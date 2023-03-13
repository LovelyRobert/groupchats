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
let roomId = null;
let token = "";
let maxAge = 3 * 24 * 60 * 60;

describe("Testin rooms create,edit and delete", () => {
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

  it("Should create a new room in database with 201 status", async () => {
    const res = await request(app)
      .post("/rooms/create")
      .send({
        title: "roomtitle",
        description: "some desctiption for testing the room.",
        category: "Other",
        language: "English",
      })
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body.roomId.length).toBeGreaterThan(0);
    expect(res.body.message).toBe("Room created successfully!");
    roomId = res.body.roomId;
  });

  it("Should return room object with 201 status", async () => {
    const res = await request(app)
      .get(`/room/${roomId}`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBe(roomId);
    expect(res.body.title).toBe("roomtitle");
    expect(res.body.description).toBe("some desctiption for testing the room.");
    expect(res.body.category).toBe("Other");
    expect(res.body.language).toBe("English");
  });

  it("Should return rooms array with 201 status", async () => {
    const res = await request(app)
      .get(`/rooms?created_by=${userId}`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(roomId);
    expect(res.body[0].title).toBe("roomtitle");
    expect(res.body[0].description).toBe(
      "some desctiption for testing the room."
    );
    expect(res.body[0].category).toBe("Other");
    expect(res.body[0].language).toBe("English");
  });

  it("Should edit room in database with 201 status", async () => {
    const res = await request(app)
      .post(`/room/${roomId}/edit`)
      .send({
        title: "newroomtitle",
        description: "new desctiption form testing the room.",
        category: "Finance",
        language: "French",
      })
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body).toBe("Room updated successfully!");
  });

  it("Should return room object with 201 status", async () => {
    const res = await request(app)
      .get(`/room/${roomId}`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body._id).toBe(roomId);
    expect(res.body.title).toBe("newroomtitle");
    expect(res.body.description).toBe("new desctiption form testing the room.");
    expect(res.body.category).toBe("Finance");
    expect(res.body.language).toBe("French");
  });

  it("Should return rooms array with 201 status", async () => {
    const res = await request(app)
      .get(`/rooms?created_by=${userId}`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body.length).toBe(1);
    expect(res.body[0]._id).toBe(roomId);
    expect(res.body[0].title).toBe("newroomtitle");
    expect(res.body[0].description).toBe(
      "new desctiption form testing the room."
    );
    expect(res.body[0].category).toBe("Finance");
    expect(res.body[0].language).toBe("French");
  });

  it("Should return rooms array with 201 status", async () => {
    const res = await request(app)
      .get(`/rooms`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(201);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it("Should return room object with 200 status", async () => {
    const res = await request(app)
      .get(`/room/${roomId}/remove`)
      .set("Cookie", [`jwt=${token}`]);
    expect(res.statusCode).toBe(200);
  });
});
