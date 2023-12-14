const chai = require("chai");
const chaiHttp = require("chai-http");
const sinon = require("sinon");
const moment = require("moment");
const mongoose = require("mongoose");
const app = require("../app"); // Import your express app
const Wallposts = require("../models/wallposts");
const { createWallpost, getAllWallposts } = require("../controllers/wallposts");

chai.use(chaiHttp);
const expect = chai.expect;

describe("Wallpost Controller Tests", () => {
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

  describe("createWallpost", () => {
    it("should create a new wallpost", async () => {
      const req = {
        body: {
          message: "Test message",
          userId: "testUserId",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(Wallposts.prototype, "save").resolves({});

      await createWallpost(req, res);

      expect(res.status.calledWith(201)).to.be.true;
      expect(res.json.calledWith({ message: "Wall post created" })).to.be.true;
    });

    it("should handle error while creating wallpost", async () => {
      const req = {
        body: {
          message: "Test message",
          userId: "testUserId",
        },
      };

      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      sinon.stub(Wallposts.prototype, "save").rejects(new Error("Test error"));

      await createWallpost(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          error: sinon.match.instanceOf(Error),
          message: "Error creating wall post",
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

      await createWallpost(req, res);

      expect(res.status.calledWith(400)).to.be.true;
      expect(res.json.calledWith({ message: "Cant post empty message." })).to.be
        .true;
    });
  });

  describe("getAllWallposts", () => {
    it("should retrieve all wallposts", async () => {
      const wallposts = [
        {
          _id: "testId",
          message: "Test message",
          creator: {
            _id: "testUserId",
            name: "Test User",
          },
          createdAt: moment().subtract(1, "day"),
        },
      ];

      sinon.stub(Wallposts, "find").resolves(wallposts);

      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getAllWallposts(req, res);

      expect(res.status.calledWith(200)).to.be.true;
      expect(
        res.json.calledWith({
          message: "All wallposts retrieved successfully",
          wallposts: [
            {
              _id: "testId",
              message: "Test message",
              creator: {
                _id: "testUserId",
                name: "Test User",
              },
              createdAt: sinon.match.string,
            },
          ],
        })
      ).to.be.true;
    });

    it("should handle error while retrieving wallposts", async () => {
      sinon.stub(Wallposts, "find").rejects(new Error("Test error"));

      const req = {};
      const res = {
        status: sinon.stub().returnsThis(),
        json: sinon.spy(),
      };

      await getAllWallposts(req, res);

      expect(res.status.calledWith(500)).to.be.true;
      expect(
        res.json.calledWith({
          error: sinon.match.instanceOf(Error),
          message: "Error retrieving wallposts",
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
