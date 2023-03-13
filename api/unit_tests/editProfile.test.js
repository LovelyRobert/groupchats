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

describe("Testing profile edit", () => {
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
  it("should edit database user and return 201 status with success message", async () => {
    const res = await request(app)
      .post("/edit/profile")
      .send({
        nickname: "newname",
        description: "some description of my profile.",
      })
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe("Your account was successfully updated!");
  });
  it("should edit database user and return 201 status with success message", async () => {
    const res = await request(app)
      .post("/edit/info")
      .send({
        first_name: "firstname",
        last_name: "lastname",
        country: "Morocco",
        address: "someaddress",
        city: "Rabat",
        state: "",
      })
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe("Your account was successfully updated!");
  });
  it("should return the user object with 200 status", async () => {
    const res = await request(app)
      .get("/user")
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(200);
    expect(res.body.nickname).toBe("newname");
    expect(res.body.email).toBe("myemail@gmail.com");
    expect(res.body.description).toBe("some description of my profile.");
    expect(res.body.first_name).toBe("firstname");
    expect(res.body.last_name).toBe("lastname");
    expect(res.body.country).toBe("Morocco");
    expect(res.body.address).toBe("someaddress");
    expect(res.body.city).toBe("Rabat");
    expect(res.body.state).toBe("");
  });
});
