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
      expect(response.body).to.eql({
        ok:        true,
        authtoken: "secret!"
      });
    });
  });
});
