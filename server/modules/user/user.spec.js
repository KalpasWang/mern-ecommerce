import { expect, describe, it } from "@jest/globals";
import request from "supertest";
import bcrypt from "bcryptjs";
import app from "../../app.js";
import User from "./user.model.js";
import { userSamples } from "./user.sample.js";
import { SALT } from "../../utils/constants.js";

let createdUsers = null;
let adminUser = null;

const fakeUser = { name: "whwang", email: "user1@mail.com", password: "password", isAdmin: false };

async function getUsers() {
  const res = await request(app).get("/api/users");
  return res;
}

async function addNewUser(user = { ...fakeUser }) {
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

  describe("POST /api/users/logout, logout user", () => {
    const logoutApi = "/api/users/logout";

    it("returns 200 ok and success true", async () => {
      const res = await request(app).post(logoutApi);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect.assertions(2);
    });
  });

  describe("POST /api/users/register, register user", () => {
    const registerApi = "/api/users/register";

    it("returns 201 created and success true with valid user data", async () => {
      const res = await request(app)
        .post(registerApi)
        .send({ name: fakeUser.name, email: fakeUser.email, password: fakeUser.password });
      expect(res.statusCode).toBe(201);
      expect(res.body.success).toBe(true);
      expect.assertions(2);
    });

    describe("various user input cases", () => {
      function userInputPost(user = fakeUser) {
        const { name, email, password } = user;
        return request(app).post(registerApi).send({ name, email, password });
      }

      it.each([
        {
          field: "name",
          value: "john doe",
          status: "201",
        },
        {
          field: "name",
          value: "王小明",
          status: "201",
        },
        { field: "name", value: "john-doe", status: "400" },
        {
          field: "name",
          value: "johndoeingkjhhoogfffhkllhophgftyurdsrsedgjlpoiyxrdfgdtffgi",
          status: "400",
        },
        { field: "email", value: "XXXXXXXXXXXXX", status: "400" },
        { field: "email", value: "XXXXXXX@XXXXXX", status: "400" },
        { field: "password", value: "okok88", status: "201" },
        { field: "password", value: "okok8", status: "400" },
        { field: "password", value: "okok-notok", status: "400" },
      ])("returns $status when user $field is $value", async ({ field, value, status }) => {
        const res = await userInputPost({ ...fakeUser, [field]: value });
        expect(res.statusCode).toBe(+status);
        expect(res.body.success).toBe(status === "201");
        expect.assertions(2);
      });
    });

    it("user password is hashed", async () => {
      const res = await request(app)
        .post(registerApi)
        .send({ name: fakeUser.name, email: fakeUser.email, password: fakeUser.password });
      const user = await User.findById(res.body.id);
      const isMatch = await user.matchPassword(fakeUser.password);
      expect(user.password).not.toBe(fakeUser.password);
      expect(isMatch).toBe(true);
      expect.assertions(2);
    });

    it("returns 400 bad request with empty body", async () => {
      const res = await request(app).post(registerApi).send({});
      expect(res.statusCode).toBe(400);
      expect(res.body.success).toBe(false);
      expect.assertions(2);
    });

    it("returns 409 conflict with existing user email", async () => {
      await addNewUser();
      const res = await request(app)
        .post(registerApi)
        .send({ name: fakeUser.name, email: fakeUser.email, password: fakeUser.password });
      expect(res.statusCode).toBe(409);
      expect(res.body.success).toBe(false);
      expect.assertions(2);
    });
  });

  describe("GET /api/users/profile, get current login user profile", () => {
    const profileApi = "/api/users/profile";

    it("returns 200 ok and success true with valid credentials", async () => {
      let user = createdUsers[0];
      const token = user.generateToken();
      const res = await request(app).get(profileApi).set("Cookie", `jwt=${token}`);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect.assertions(2);
    });

    it("returns 401 unauthorized with invalid credentials", async () => {
      const res = await request(app).get(profileApi);
      expect(res.statusCode).toBe(401);
      expect(res.body.success).toBe(false);
      expect.assertions(2);
    });
  });
});
