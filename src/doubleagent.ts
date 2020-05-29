import * as http from 'http';
import * as https from 'https';
import * as request from 'superagent';
import { Express } from 'express';
import { Request, Response } from 'superagent';

type MultiPartValueSingle = Parameters<Request['attach']>[1];

type Path = string;
type Params = string | object;
type Headers = { [key: string]: string };
type Files = { [filename: string]: MultiPartValueSingle };

type Method = 'get' | 'head' | 'post' | 'put' | 'patch' | 'delete';

interface BaseOptions {
  method: Method;
  params?: Params;
  headers?: Headers;
  files?: Files;
}

interface Options extends BaseOptions {
  path: Path;
}

interface RequestOptions extends BaseOptions {
  url: string;
}

type Config = {
  serializer?: (query: object) => string;
};

type SendRequest = (
  path: Path,
  params?: Params,
  headers?: Headers,
  files?: Files
) => Promise<Response>;

type DoubleAgent = {
  get: SendRequest;
  head: SendRequest;
  put: SendRequest;
  post: SendRequest;
  patch: SendRequest;
  delete: SendRequest;

  defaultHeaders: object;
  app: Express;
  server: http.Server;
  urlFor: (path: string) => string;
};

const isObject = (thing: any): thing is object => typeof thing === 'object' && thing !== null;

/**
 * Binds the app to a http port and returns the
 * base url thing
 *
 * @param {Object} http server
 * @return {string} base url
 */
const findAppUrl = (server: http.Server): string => {
  if (!server.address()) server.listen(0);

  const { port } = server.address() as any;
  const protocol = server instanceof https.Server ? 'https' : 'http';

  return `${protocol}://127.0.0.1:${port}`;
};

/**
 * Builds the superagent request instance
 *
 * @param {Object} config contains configuration e.g. serializer
 * @param {Object} options for the request method, url, params, headers and files
 * @return {Object} superagent request
 */
const buildRequest = (config: Config, options: RequestOptions): Request => {
  const { serializer } = config;
  const { method, url, params, headers, files } = options;

  let req: Request = request[method](url);

  /* eslint-disable no-restricted-syntax,guard-for-in */
  if (params) {
    if (files) {
      for (const param in params as any) {
        req = req.field(param, params[param]);
      }
    } else if (method === 'get' || method === 'head') {
      const query = serializer && isObject(params) ? serializer(params) : params;
      req = req.query(query);
    } else {
      req = req.send(params);
    }
  }

  if (files) {
    for (const file in files) {
      req = req.attach(file, files[file]);
    }
  }

  if (headers) {
    for (const key in headers) {
      req = req.set(key, headers[key]);
    }
  }
  /* eslint-enable no-restricted-syntax, guard-for-in */

  return req;
};

/**
 * Makes the call to the app with specified params
 *
 * @param {Object} httpServer
 * @param {Object} config contains configuration e.g. serializer
 * @param {Object} options for the request method, path, params, headers and files
 * @return {Promise<response>} response the http response
 */
const doubleCall = (server: http.Server, config: Config, options: Options): Promise<Response> => {
  const { path, ...rest } = options;

  return new Promise((resolve, reject) => {
    const url = findAppUrl(server);
    const req = buildRequest(config, { url: url + path, ...rest });

    req.end((err, res) => {
      server.close();

      if (err && (!res || err.status !== res.status)) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });
};

const agent = (app: Express, config: Config = {}): DoubleAgent => {
  const api: Partial<DoubleAgent> = {};
  const methods: Method[] = ['get', 'head', 'post', 'put', 'patch', 'delete'];
  const server = http.createServer(app);

  for (let i = methods.length; i--; ) {
    api[methods[i]] = (function(method) {
      return (path: Path, params?: Params, headers?: Headers, files?: Files) => {
        const combinedHeaders = { ...api.defaultHeaders, ...headers };
        return doubleCall(server, config, {
          method,
          path,
          params,
          headers: combinedHeaders,
          files,
        });
      };
    })(methods[i]);
  }

  api.server = server;
  api.app = app;
  api.urlFor = (path: string): string => findAppUrl(server) + path;

  return api as DoubleAgent;
};

export default agent;
