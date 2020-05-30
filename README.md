# Double Agent [![Build Status](https://travis-ci.org/MadRabbit/doubleagent.svg?branch=master)](https://travis-ci.org/MadRabbit/doubleagent)

`doubleagent` is an ES7 `async/await` compatible wrapper on top of [superagent](https://github.com/visionmedia/superagent) that makes testing of expressjs/connect apps easier in a modern environment.

Lets say you have an [expressjs](http://expressjs.com) app, that looks somewhat like this:

```js
import express from "express";

const app = express();

app.get("/hello", (req, res) => {
  res.json({ok: true});
});

export default app;
```

Now, `doubleagent` allows you to test the app like it's 2016 out there:

```js
import { expect } from "chai";
import agent from "doubleagent";
import app from "../src/app";

describe("app", () => {
  it("handles GET /hello", async () => {
    const response = await agent(app).get("/hello");

    expect(response.status).to.be(200);
    expect(response.body).to.eql({ok: true});
  });
});
```

There are two main points to this whole thing:

1. Using ES7 `async/await` syntax for more maintainable tests codebase
2. Use your favorite assertion library for testing

## API & Usage

Installation is straight forward

```
npm install doubleagent --save-dev
```

As for the API, the `agent(app)` call returns a object with all the basic HTTP methods that all have the same API:

```
agent(app)[method](path[, params[, headers[, files]]]) -> Promise
```

__NOTE__: `params` are contextual, they are handled as `query` for `GET`/`HEAD` requests and as `body` for `POST`, `PUT`, etc. When files are passed the request changes into a multi-part form and params is treated as fields.

### Default Headers

If you need to specify app wide default HTTP headers, just assign them to the `defaultHeaders` property:

```js
agent.defaultHeaders = { Authorization: `Bearer ${token}` };
agent.get('/some/url'); // <- will automatically send the headers
```

__NOTE__ any headers that you send through with specific `#get`, `#post`, etc. requests _will override_ the `defaultHeaders` values.

### Full URL Locations

If you need to access a full URL location to the http server that runs underneath the `doubleagent` interface, please use the `#urlFor(path)` method;

```js
agent.urlFor('/users'); // -> 'http://127.0.0.1:0/users'
```

### Custom Query String Encoding

Under the hood, `doubleagent` uses `superagent`. Superagent uses the `qs` library for both query string stringification and parsing. However you may use a different form of querystring encoding such that it matches your application. You can optionally pass in a custom parser to `doubleagent`.

```js
import { expect } from "chai";
import agent from "doubleagent";
import app from "../src/app";

/* define a custom stringify function */
const stringify = (query) => qs.stringify(query, { arrayFormat: 'indicies' });
const test = agent(app, { serializer: stringify });

describe("app", () => {
  it("handles GET /hello", async () => {
    const response = await test.get("/hello");

    expect(response.status).to.be(200);
    expect(response.body).to.eql({ok: true});
  });
});
```

## Copyright & License

All code in this library is released under the terms of the MIT license

Copyright (C) 2016 Nikolay Nemshilov
