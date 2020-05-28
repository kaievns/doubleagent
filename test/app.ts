import * as express from 'express';
import * as bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const headers = req => {
  const authtoken = req.get('authtoken');
  return authtoken ? { authtoken } : {};
};

app.get('/', (req, res) => {
  res.json({ ok: true, ...req.query, ...headers(req) });
});

app.post('/', (req, res) => {
  res.status(201).json({ ok: true, ...req.body, ...headers(req) });
});

app.patch('/', (req, res) => {
  res.status(401).json({ error: 'authentication failed' });
});

app.put('/', (req, res) => {
  res.json({ ok: true, ...req.body, ...headers(req) });
});

app.delete('/', (req, res) => {
  res.send('done');
});

app.all('/echo', (req, res) => {
  const { headers } = req;
  // if (process.env.HTTP2_TEST) {
  //   Object.keys(headers).forEach(name => {
  //     if (isPseudoHeader(name)) {
  //       delete headers[name];
  //     }
  //   });
  // }

  res.writeHead(200, headers);
  req.pipe(res);
});

export default app;
