import expect from "expect.js";
import app    from "./app";
import agent  from "../src/double-agent";

const test = agent(app);

describe("double-agent", () => {
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
  });

  describe("DELETE requests", () => {
    it("handles them well", async () => {
      const response = await test.delete("/");
      expect(response.status).to.be(200);
      expect(response.text).to.eql("done");
    });
  });
});
