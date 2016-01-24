import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  const authtoken = req.get("authtoken");
  const headers   = authtoken ? {authtoken: authtoken} : {};

  res.json(Object.assign({ok: true}, req.query, headers));
});

app.post("/", (req, res) => {
  res.status(201).json({body: req.body});
});

app.patch("/", (req, res) => {
  res.json({body: req.body});
});

app.put("/", (req, res) => {
  res.json({body: req.body});
});

app.delete("/", (req, res) => {
  res.send("done");
});

export default app;
