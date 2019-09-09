declare module 'doubleagent' {
  import { Application } from 'express';
  import { Response } from 'superagent';

  type ICall = (path: string, params?: object, headers?: object, files?: object) => Promise<Response>

  interface IRESTInterface {
    get: ICall;
    head: ICall;
    post: ICall;
    put: ICall;
    patch: ICall;
    delete: ICall;

    app: Application;
    urlFor: (path: string) => string;
  }

  type IFunc = (app: object) => IRESTInterface
  const Func: IFunc;
  export = Func;
}
