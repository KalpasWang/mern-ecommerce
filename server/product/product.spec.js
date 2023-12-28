/* products unit test */

import request from "supertest";
import app from "../app";

describe("GET /api/products", () => {
  describe("when there are products", () => {
    it("return 200 ok ", async () => {
      const res = await request(app).get("/api/products");
      expect(res.statusCode).toBe(200);
    });
  });
  describe("when there are no products", () => {
    it("return 200 ok ", () => {});
  });
});
