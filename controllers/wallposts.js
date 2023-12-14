const moment = require("moment");
const Wallposts = require("../models/wallposts");

exports.createWallpost = (req, res) => {
  // check all parameters
  const { message, userId } = req.body;
  if (!message || !userId) {
    return res.status(400).json({
      message: "Cant post empty message.",
    });
  }

  const newWallPost = new Wallposts({
    message,
    creator: userId,
  });

  newWallPost
    .save()
    .then((wallpost) => {
      return res.status(201).json({
        message: "Wall post created",
      });
    })
    .catch((error) => {
      return res.status(500).json({
        error,
        message: "Error creating wall post",
      });
    });
};

exports.getAllWallposts = (req, res) => {
  Wallposts.find()
    .populate("creator", "name")

    .exec()
    .then((wallposts) => {
      const formattedWallposts = wallposts.map((post) => ({
        ...post._doc,
        createdAt: moment(post.createdAt).fromNow(),
      }));
      return res.status(200).json({
        message: "All wallposts retrieved successfully",
        wallposts: formattedWallposts,
      });
    })
    .catch((error) => {
      console.log(error);
      return res.status(500).json({
        error,
        message: "Error retrieving wallposts",
      });
    });
};
