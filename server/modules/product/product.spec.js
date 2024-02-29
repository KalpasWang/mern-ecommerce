import { expect, describe, it } from "@jest/globals";
import request from "supertest";
import app from "../../app.js";
import Product from "./product.model.js";
import User from "../user/user.model.js";
import { productSamples } from "./product.sample.js";
import { userSamples } from "../user/user.sample.js";

let createdUsers = null;
let createdProducts = null;

async function getProducts() {
  const res = await request(app).get("/api/products");
  return res;
}

async function getProductById(id) {
  const res = await request(app).get(`/api/products/${id}`);
  return res;
}

beforeEach(async () => {
  createdUsers = await User.insertMany(userSamples);
  const adminUser = createdUsers.find((user) => user.isAdmin);
  const data = productSamples.map((product) => ({
    ...product,
    modifiedBy: adminUser._id,
  }));
  createdProducts = await Product.insertMany(data);
});

afterEach(async () => {
  await Product.deleteMany();
  await User.deleteMany();
  createdUsers = null;
  createdProducts = null;
});

describe("products", () => {
  describe("GET /api/products, list all products", () => {
    it("returns 200 ok with success true", async () => {
      const res = await getProducts();
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect.assertions(2);
    });

    it("returns products array with length equal to test data", async () => {
      const res = await getProducts();
      expect(res.body.products.length).toBe(productSamples.length);
      expect.hasAssertions();
    });

    it("returns products with their info. But without description, reviews, numReviews, countInStock, modifiedBy", async () => {
      const res = await getProducts();
      res.body.products.forEach((product, i) => {
        expect(typeof product.name).toBe("string");
        expect(typeof product.image).toBe("string");
        expect(typeof product.brand).toBe("string");
        expect(typeof product.category).toBe("string");
        expect(typeof product.soldAmount).toBe("number");
        expect(typeof product.rating).toBe("number");
        expect(typeof product.price).toBe("number");
        expect(typeof product.createdAt).toBe("string");
        expect(typeof product.updatedAt).toBe("string");
        expect(product.description).toBeUndefined();
        expect(product.reviews).toBeUndefined();
        expect(product.numReviews).toBeUndefined();
        expect(product.countInStock).toBeUndefined();
        expect(product.modifiedBy).toBeUndefined();
      });
      expect.assertions(createdProducts.length * 14);
    });
  });

  describe("GET /api/products/:id, get product details by id", () => {
    it("returns 200 ok with existing id", async () => {
      const res = await getProductById(createdProducts[0]._id);
      expect(res.statusCode).toBe(200);
      expect(res.body.success).toBe(true);
      expect.assertions(2);
    });

    it("returns 404 not found with non-existing id", async () => {
      const res = await getProductById("noSuchId");
      expect(res.statusCode).toBe(404);
      expect(res.body.success).toBe(false);
      expect.assertions(2);
    });

    it("returns product details with reviews", async () => {
      const res = await getProductById(createdProducts[0]._id);
      const product = res.body.product;
      expect(typeof product.name).toBe("string");
      expect(typeof product.image).toBe("string");
      expect(typeof product.brand).toBe("string");
      expect(typeof product.category).toBe("string");
      expect(typeof product.description).toBe("string");
      expect(typeof product.soldAmount).toBe("number");
      expect(typeof product.rating).toBe("number");
      expect(typeof product.numReviews).toBe("number");
      expect(typeof product.price).toBe("number");
      expect(typeof product.countInStock).toBe("number");
      expect(typeof product.modifiedBy).toBe("string");
      expect(typeof product.createdAt).toBe("string");
      expect(typeof product.updatedAt).toBe("string");
      expect(Array.isArray(product.reviews)).toBe(true);
      expect.assertions(14);
    });
  });

  describe("POST /api/products, create new product", () => {
    it("returns 201 created with valid data", async () => {});
    it("returns 400 bad request with invalid data", async () => {});
    it("returns 401 unauthorized with invalid token", async () => {});
    it("returns 403 forbidden with invalid user", async () => {});
  });
  describe("PUT /api/products/:id, update product detail by id", () => {});
  describe("DELETE /api/products/:id, delete product by id", () => {});
  describe("POST /api/products/:id/reviews, create new product review", () => {});
});
