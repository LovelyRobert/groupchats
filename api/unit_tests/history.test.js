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

let roomId = ""; //To add before testing
let skip = 1;

describe("Get histroy behaviour", () => {
  it("Should Login and return 200 status with user ID", async () => {
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
  it("should return the first set of messages with 200 status", async () => {
    const res = await request(app)
      .get(`/history/${roomId}?skip=${skip}`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).tobe(10);
    expect(res.body[9].id).toBe(res.body.length - 1);
  });
  skip += 1;
  it("should return the first set of messages with 200 status", async () => {
    const res = await request(app)
      .get(`/history/${roomId}?skip=${skip}`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).tobe(10);
    expect(res.body[9].id).toBe(res.body.length - 10);
  });
  skip += 1;
  it("should return the first set of messages with 200 status", async () => {
    const res = await request(app)
      .get(`/history/${roomId}?skip=${skip}`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.length).tobe(10);
    expect(res.body[9].id).toBe(res.body.length - 20);
  });
});
