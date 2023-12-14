const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const app = require("../app"); // Import your app instance
const Users = require("../models/users");
const mongoose = require("mongoose");
const { createUser, logUser } = require("../controllers/users");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Users Controller Tests", () => {
  before(function (done) {
    this.timeout(30000);

    mongoose
      .connect(process.env.DATABASE)
      .then(() => {
        console.log("Database connection established successfully.");
        done();
      })
      .catch((err) => {
        console.error("Error connecting to the database:", err);
        done(err);
      });
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("createUser", () => {
    it("should create a new user", async () => {
      const req = {
        body: {
          email: "test2@example.com",
          name: "Test User",
          password: "testpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon
        .stub(Users.prototype, "save")
        .resolves({ _id: "testUserId", name: "Test User" });
      sinon.stub(Users, "findOne").resolves(null);

      await createUser(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(
        res.json.calledWith({
          message: "User created",
          user: { name: "Test User", id: "testUserId" },
        })
      ).to.be.true;
    });

    it("should handle existing email", async () => {
      const req = {
        body: {
          email: "test@example.com",
          name: "Test User",
          password: "testpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(Users, "findOne").resolves({ email: "test@example.com" });

      await createUser(req, res);

      expect(res.status.calledWith(409)).to.be.true;
      expect(
        res.json.calledWith({
          message: "Email is already registered. Please use a different email.",
        })
      ).to.be.true;
    });

    it("should handle missing parameters", async () => {
      const req = {
        body: {},
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await createUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          message:
            "Missing parameters. Please enter email, name, and password.",
        })
      ).to.be.true;
    });

    it("should handle database error", async () => {
      const req = {
        body: {
          email: "test@example.com",
          name: "Test User",
          password: "testpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(Users.prototype, "save").rejects(new Error("Test error"));
      sinon.stub(Users, "findOne").resolves(null);

      await createUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          error: sinon.match.instanceOf(Error),
          message: "Error creating user",
        })
      ).to.be.true;
    });
  });

  describe("logUser", () => {
    it("should log in an existing user", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "testpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const mockUser = {
        _id: "testUserId",
        name: "Test User",
        authenticate: sinon.stub().returns(true),
      };

      sinon.stub(Users, "findOne").resolves(mockUser);

      await logUser(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "User logged in successfully",
          user: { name: "Test User", id: "testUserId" },
        })
      ).to.be.true;
    });

    it("should handle non-existent user", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "testpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(Users, "findOne").resolves(null);

      await logUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: "User with that email does not exist. Please register first.",
        })
      ).to.be.true;
    });

    it("should handle incorrect password", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "testpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      const mockUser = {
        authenticate: sinon.stub().returns(false),
      };

      sinon.stub(Users, "findOne").resolves(mockUser);

      await logUser(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(
        res.json.calledWith({
          error: "Incorrect password",
        })
      ).to.be.true;
    });

    it("should handle database error", async () => {
      const req = {
        body: {
          email: "test@example.com",
          password: "testpassword",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(Users, "findOne").rejects(new Error("Test error"));

      await logUser(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          error: sinon.match.instanceOf(Error),
          message: "Please try again.",
        })
      ).to.be.true;
    });
  });

  after(function (done) {
    this.timeout(30000);

    mongoose
      .disconnect()
      .then(() => {
        console.log("Database disconnected successfully.");
        done();
      })
      .catch((err) => {
        console.error("Error disconnecting from the database:", err);
        done(err);
      });
  });
});
