const fs     = require("fs");
const expect = require("expect.js");
const app    = require("./app");
const agent  = require("../src/doubleagent");

const test = agent(app);

describe("doubleagent", () => {
  describe("GET requests", () => {
    it("handles a simple case", async () => {
      const response = await test.get("/");

      expect(response.status).to.be(200);
      expect(response.body).to.eql({ok: true});
    });

    it("handles query params", async () => {
      const response = await test.get("/", {one: 1, two: 2});

      expect(response.status).to.be(200);
      expect(response.body).to.eql({
        ok:  true,
        one: 1,
        two: 2
      });
    });

    it("handles header params", async () => {
      const response = await test.get("/", null, {authtoken: "secret!"});
      expect(response.status).to.be(200);
      expect(response.body).to.eql({ok: true, authtoken: "secret!"});
    });
  });

  describe("POST requests", () => {
    it("handles a simple case", async () => {
      const response = await test.post("/");
      expect(response.status).to.be(201);
      expect(response.body).to.eql({ok: true});
    });

    it("handles text params", async () => {
      const response = await test.post("/", "one=two");
      expect(response.status).to.be(201);
      expect(response.body).to.eql({ok: true, one: "two"});
    });

    it("handles the object params", async () => {
      const response = await test.post("/", {one: "two"});
      expect(response.status).to.be(201);
      expect(response.body).to.eql({ok: true, one: "two"});
    });

    it("handles header params", async () => {
      const response = await test.post("/", null, {authtoken: "secret!"});
      expect(response.status).to.be(201);
      expect(response.body).to.eql({ok: true, authtoken: "secret!"});
    });

    it("handles files", async () => {
      const fields = {param: "two"};
      const file = 'test/fixtures/small.pdf';
      const response = await test.post("/echo", fields, null, { file });

      expect(response.status).to.be(200);
      expect(response.body).to.eql(fields);
      expect(response.files.file.type).to.eql('application/pdf');
      expect(response.files.file.name).to.eql('small.pdf');
      expect(fs.readFileSync(response.files.file.path, 'utf8')).to.equal(fs.readFileSync(file, 'utf8'));
    });
  });

  describe("PATCH requests", () => {
    it("doesn't fail on http errors", async () => {
      const response = await test.patch("/");
      expect(response.status).to.be(401);
      expect(response.body).to.eql({error: "authentication failed"});
    });
  });

  describe("DELETE requests", () => {
    it("handles them well", async () => {
      const response = await test.delete("/");
      expect(response.status).to.be(200);
      expect(response.text).to.eql("done");
    });
  });
});
