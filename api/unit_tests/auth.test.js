const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server");
const jwt = require("jsonwebtoken");

require("custom-env").env("dev");
require("dotenv").config();

/* Connecting to the database before each test. */
beforeAll(async () => {
  await mongoose.connect(process.env.DATABASE_URL);
}, 14000);

/* Closing database connection after each test. */
afterAll(async () => {
  await mongoose.connection.close();
});

let userId = null;
let token = "";
let maxAge = 3 * 24 * 60 * 60;

describe("Testing normal authentification", () => {
  it("should create a new database user instance and assign jwt cookie", async () => {
    const res = await request(app).post("/signup").send({
      nickname: "newUser",
      email: "myemail@gmail.com",
      password: "mypassword",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.length).toBeGreaterThan(0);
    userId = res.body;
    token = jwt.sign({ id: userId, provider: "self" }, process.env.JWT_SECRET, {
      expiresIn: maxAge,
    });
  });

  it("should return the user object and 200 status", async () => {
    const res = await request(app)
      .get("/user")
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.nickname).toBe("newuser");
    expect(res.body.email).toBe("myemail@gmail.com");
  });

  it("should return true", async () => {
    const res = await request(app)
      .get("/authenticated")
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body).toBe(true);
  });

  it("should return true", async () => {
    const res = await request(app)
      .get("/logout")
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(204);
  });
  userId = null;
  token = "";
  it("Should Login and return 200 status", async () => {
    const res = await request(app).post("/login").send({
      email: "myemail@gmail.com",
      password: "mypassword",
      rememberMe: true,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    userId = res.body;
    token = jwt.sign({ id: userId, provider: "self" }, process.env.JWT_SECRET, {
      expiresIn: maxAge,
    });
  });
});
