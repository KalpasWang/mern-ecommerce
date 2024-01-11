import bcrypt from "bcryptjs";
import { SALT } from "../../utils/constants.js";

export const userSamples = [
  {
    name: "user 1",
    email: "test1@test.com",
    password: bcrypt.hashSync("123abc", SALT),
    isAdmin: true,
  },
  {
    name: "user 2",
    email: "test2@test.com",
    password: bcrypt.hashSync("456def", SALT),
    isAdmin: false,
  },
];
