const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const UserModel = require("../models/UserModel");
const PostModel = require("../models/PostModel");
const FollowerModel = require("../models/FollowerModel");
const {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
} = require("../utilsServer/notificationActions");
const uuid = require("uuid").v4;

// CREATE A POST

router.post("/", authMiddleWare, async (req, res) => {
  const { text, location, picUrl } = req.body;
  if (text.length < 1) return res.status(401).send("Text must be provided!");
  try {
    const newPost = {
      user: req.userId,
      text,
    };
    if (location) newPost.location = location;
    if (picUrl) newPost.picUrl = picUrl;
    const post = await new PostModel(newPost).save();
    return res.status(201).json(post._id);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// GET ALL POSTS

router.get("/", authMiddleWare, async (req, res) => {
  const { pageNumber } = req.query;
  const { userId } = req;
  const POSTS_AMOUNT = 8;
  try {
    const number = Number(pageNumber);
    const loggedUser = await FollowerModel.findOne({ user: userId }).select(
      "-followers"
    );
    let posts = [];
    if (number === 1) {
      if (loggedUser.following.length > 0) {
        posts = await PostModel.find({
          user: {
            $in: [
              userId,
              ...loggedUser.following.map((following) => following.user),
            ],
          },
        })
          .limit(POSTS_AMOUNT)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      } else {
        posts = await PostModel.find({ user: userId })
          .limit(POSTS_AMOUNT)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      }
    } else {
      const skips = POSTS_AMOUNT * (number - 1);
      if (loggedUser.following.length > 0) {
        posts = await PostModel.find({
          user: {
            $in: [
              userId,
              ...loggedUser.following.map((following) => following.user),
            ],
          },
        })
          .skip(skips)
          .limit(POSTS_AMOUNT)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      } else {
        posts = await PostModel.find({ user: userId })
          .skip(skips)
          .limit(POSTS_AMOUNT)
          .sort({ createdAt: -1 })
          .populate("user")
          .populate("comments.user");
      }
    }
    return res.json(posts);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// GET POST BY ID

router.get("/:postId", authMiddleWare, async (req, res) => {
  try {
    const post = await PostModel.findById(req.params.postId)
      .populate("user")
      .populate("comments.user");
    if (!post) return res.status(404).send("Post not found");
    return res.json(post);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// DELETE POST

router.delete("/:postId", authMiddleWare, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    const user = await UserModel.findById(userId);
    if (post.user.toString() !== userId.toString()) {
      if (user.role === "root") {
        await post.remove();
        return res.status(200).send("Post deleted successfully");
      } else {
        return res.status(401).send("Unauthorized");
      }
    }
    await post.remove();
    return res.status(200).send("Post deleted successfully");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// LIKE A POST

router.post("/like/:postId", authMiddleWare, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("No post found");
    const isLiked =
      post.likes.findIndex(
        (like) => like.user.toString() === userId.toString()
      ) !== -1;
    if (isLiked) return res.status(401).send("Post already liked");
    await post.likes.unshift({ user: userId });
    await post.save();
    if (post.user.toString() !== userId) {
      await newLikeNotification(userId, postId, post.user.toString());
    }
    return res.status(200).send("Post Liked");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// UNLIKE A POST

router.put("/unlike/:postId", authMiddleWare, async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId } = req;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("No post found");
    const isLiked =
      post.likes.filter((like) => like.user.toString() === userId.toString())
        .length === 0;
    if (isLiked) return res.status(401).send("Post not liked before");
    const index = post.likes.findIndex(
      (like) => like.user.toString() === userId.toString()
    );
    await post.likes.splice(index, 1);
    await post.save();
    if (post.user.toString() !== userId) {
      await removeLikeNotification(userId, postId, post.user.toString());
    }
    return res.status(200).send("Post Unliked");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// GET ALL LIKES

router.get("/like/:postId", authMiddleWare, async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await PostModel.findById(postId).populate("likes.user");
    if (!post) return res.status(404).send("No post found");
    return res.status(200).json(post.likes);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// ADD A COMMENT

router.post("/comment/:postId", authMiddleWare, async (req, res) => {
  try {
    const { userId } = req;
    const { postId } = req.params;
    const { text } = req.body;
    if (text.trim().length < 1)
      return res
        .status(401)
        .send("Comment should be at least 1 character long");
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).semd("Post not found");
    const newComment = {
      _id: uuid(),
      text,
      user: userId,
      date: Date.now(),
    };
    await post.comments.unshift(newComment);
    await post.save();
    if (post.user.toString() !== userId) {
      console.log("new comment notification");
      await newCommentNotification(
        postId,
        newComment._id,
        userId,
        post.user.toString(),
        text
      );
    }
    return res.status(200).json(newComment._id);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// DELTE A COMMENT

router.delete("/:postId/:commentId", authMiddleWare, async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    const { userId } = req;
    const post = await PostModel.findById(postId);
    if (!post) return res.status(404).send("Post not found");
    const comment = post.comments.find((comment) => comment._id === commentId);
    if (!comment) res.status(404).send("No comment found");
    const user = await UserModel.findById(userId);
    if (comment.user.toString() !== userId.toString()) {
      if (user.role === "root") {
        const index = post.comments.findIndex(
          (comment) => comment._id === commentId
        );
        await post.comments.splice(index, 1);
        await post.save();
        return res.status(200).send("Deleted successfully");
      } else return res.status(401).send("Unauthorized");
    }
    const index = post.comments.findIndex(
      (comment) => comment._id === commentId
    );
    await post.comments.splice(index, 1);
    await post.save();
    if (post.user.toString() !== userId) {
      removeCommentNotification(
        postId,
        commentId,
        userId,
        post.user.toString()
      );
    }
    return res.status(200).send("Deleted successfully");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
