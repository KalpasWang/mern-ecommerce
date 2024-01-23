import { expect, describe, it } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../app.js";
import User from "./user.model.js";
import { userSamples } from "./user.sample.js";
import { SALT } from "../../utils/constants.js";

let createdUsers = null;
let adminUser = null;

const fakeUser = { name: "user1", email: "user1@mail.com", password: "password", isAdmin: false };

async function getUsers() {
  const res = await request(app).get("/api/users");
  return res;
}

async function addNewUser(user = { ...fakeUser }) {
  const hash = await bcrypt.hash(user.password, SALT);
  user.password = hash;
  return await User.create(user);
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

  describe("POST /api/users/auth, login user", () => {
    const authApi = "/api/users/auth";

    it("returns 200 ok and success true with valid credentials", async () => {
      await addNewUser();
      const res = await request(app)
        .post(authApi)
        .send({ email: fakeUser.email, password: fakeUser.password });
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect.assertions(2);
    });

    it("returns user id, name, email, isAdmin and cookie when login success", async () => {
      const user = await addNewUser();
      const res = await request(app)
        .post(authApi)
        .send({ email: fakeUser.email, password: fakeUser.password });
      expect(res.body.id).toBe(user._id.toString());
      expect(res.body.name).toBe(user.name);
      expect(res.body.email).toBe(user.email);
      expect(res.body.isAdmin).toBe(user.isAdmin);
      expect(res.get("Set-Cookie")).toBeDefined();
      expect(res.get("Set-Cookie")[0]).toContain("jwt"); // cookie is set with jwt token
      expect(res.body.password).toBeUndefined(); // password is not returned in response body
      expect.assertions(7);
    });

    it("returns 401 unauthorized with invalid credentials", async () => {
      const user = await addNewUser();
      const res = await request(app)
        .post("/api/users/auth")
        .send({ email: user.email, password: "XXXXXXXXXXXXX" });
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect.assertions(2);
    });

    it("returns 400 bad request with invalid email", async () => {
      await addNewUser();
      const res = await request(app)
        .post("/api/users/auth")
        .send({ email: "invalid@email.com", password: fakeUser.password });
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect.assertions(2);
    });
  });
});
