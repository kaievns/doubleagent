import expect from "expect.js";
import app    from "./app";
import agent  from "../src/double-agent";

const test = agent(app);

describe("double-agent", () => {
  describe("GET requests", () => {
    it("handles a simple GET request well", async () => {
      const response = await test.get("/");

      expect(response.status).to.be(200);
      expect(response.body).to.eql({ok: true});
    });
  });
});
