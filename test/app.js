import express from "express";
import bodyParser from "body-parser";

const app = express();

app.use(bodyParser.urlencoded());
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.json({ok: true});
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
