const express = require("express");
const router = express.Router();

//import controllers

const { createWallpost, getAllWallposts } = require("../controllers/wallposts");

/**
 * @swagger
 * /wallposts:
 *   post:
 *     summary: post new message to wall
 *     description: post a message from user in the happy wall.
 *     tags:
 *       - Wallposts
 *     parameters:
 *       - in: body
 *         name: message
 *         required: true
 *         description: message to post.
 *         schema:
 *           type: string
 *       - in: body
 *         name: userId
 *         required: true
 *         description: Id from creator user.
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Successful posted
 *         content:
 *           application/json:
 *             schema:
 *               Wallposts
 *       400:
 *         description: Missing parameters
 *       500:
 *         description: Internal error
 *
 */
router.post("/wallposts", createWallpost);
/**
 * @swagger
 * /wallposts:
 *   get:
 *     summary: get all posts from wall
 *     description: get all posts.
 *     tags:
 *       - Wallposts
 *     responses:
 *       200:
 *         description: Retrieved posts
 *         content:
 *           application/json:
 *             schema:
 *               Wallposts
 *       500:
 *         description: Internal error
 *
 */
router.get("/wallposts", getAllWallposts);

module.exports = router;
