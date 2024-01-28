import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_EXPIRES_IN } from "../../utils/constants.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Match user entered password to hashed password in database
userSchema.method("matchPassword", async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
});

// generate user token
userSchema.method("generateToken", function () {
  return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
});

// Encrypt password using bcrypt
// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     next();
//   }

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
// });

const User = model("User", userSchema);

export default User;
