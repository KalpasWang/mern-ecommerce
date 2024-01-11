import { expect, describe, it } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import User from "./user.model.js";
import { userSamples } from "./user.sample.js";

let createdUsers = null;
let adminUser = null;

async function getUsers() {
  const res = await request(app).get("/api/users");
  return res;
}

beforeEach(async () => {
  createdUsers = await User.insertMany(userSamples);
  adminUser = createdUsers.find((user) => user.isAdmin);
});

afterEach(async () => {
  await User.deleteMany();
  createdUsers = null;
  adminUser = null;
});

describe("users", () => {
  describe("GET /api/users, list all users", () => {
    it("returns 200 ok with success true", async () => {
      const res = await getUsers();
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect.assertions(2);
    });
  });
});
