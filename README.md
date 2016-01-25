# Double Agent

`double-agent` is an ES7 `async/await` compatible wrapper on top of
[superagent](https://github.com/visionmedia/superagent) that makes testing of
expressjs/connect apps easier in a modern environment.

Lets say you have an [expressjs](http://expressjs.com) app, that looks somewhat
like this:

```js
import express from "express";

const app = express();

app.get("/hello", (req, res) => {
  res.json({ok: true});
});

export default app;
```

Now, `double-agent` allows you to test the app like it's 2016 out there:

```js
import { expect } from "chai";
import agent from "double-agent";
import app from "../src/app";

describe("app", () => {
  it("handles GET /", async () => {
    const response = await agent(app).get("/");

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
npm install double-agent --save-dev
```

As for the API, the `agent(app)` call returns a object with all the basic HTTP
methods that all have the same API:

```
agent(app)[method](path[, params[, headers]]) -> Promise
```

__NOTE__: `params` are contextual, they are handled as `query` for `GET`/`HEAD`
requests and as `body` for `POST`, `PUT`, etc.

## Copyright & License

All code in this library is released under the terms of the MIT license

Copyright (C) 2016 Nikolay Nemshilov
