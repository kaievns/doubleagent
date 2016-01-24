import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const headers = (req) => {
  const authtoken = req.get("authtoken");
  return authtoken ? {authtoken: authtoken} : {};
};

app.get("/", (req, res) => {
  res.json(Object.assign({ok: true}, req.query, headers(req)));
});

app.post("/", (req, res) => {
  res.status(201).json(Object.assign({ok: true}, req.body, headers(req)));
});

app.patch("/", (req, res) => {
  res.json(Object.assign({ok: true}, req.body, headers(req)));
});

app.put("/", (req, res) => {
  res.json(Object.assign({ok: true}, req.body, headers(req)));
});

app.delete("/", (req, res) => {
  res.send("done");
});

export default app;
