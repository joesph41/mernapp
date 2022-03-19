const express = require("express");
const bcrypt = require("bcryptjs");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const UserModel = require("../models/UserModel");
const ProfileModel = require("../models/ProfileModel");
const PostModel = require("../models/PostModel");
const FollowerModel = require("../models/FollowerModel");
const {
  newFollowerNotification,
  removeFollowerNotification,
} = require("../utilsServer/notificationActions");

// GET PROFILE INFO

router.get("/:username", authMiddleWare, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    const profile = await ProfileModel.findOne({ user: user._id }).populate(
      "user"
    );
    const profileFollowStats = await FollowerModel.findOne({ user: user._id });
    return res.json({
      profile,
      followersLength: profileFollowStats.followers.length,
      followingLength: profileFollowStats.following.length,
    });
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// GET ALL USER POSTS

router.get("/posts/:username", authMiddleWare, async (req, res) => {
  const { username } = req.params;
  try {
    const user = await UserModel.findOne({ username: username.toLowerCase() });
    if (!user) return res.status(404).send("User not found");
    const posts = await PostModel.find({ user: user._id })
      .sort({ createdAt: -1 })
      .populate("user")
      .populate("comments.user");
    return res.json(posts);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// GET FOLLOWERS OF A USER

router.get("/followers/:userId", authMiddleWare, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await FollowerModel.findOne({ user: userId }).populate(
      "followers.user"
    );
    return res.json(user.followers);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// GET EVERYONE A USER FOLLOWS

router.get("/following/:userId", authMiddleWare, async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await FollowerModel.findOne({ user: userId }).populate(
      "following.user"
    );
    return res.json(user.following);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// FOLLOW A USER

router.post("/follow/:followUserId", authMiddleWare, async (req, res) => {
  const { userId } = req;
  const { followUserId } = req.params;
  try {
    const user = await FollowerModel.findOne({ user: userId });
    const followUser = await FollowerModel.findOne({ user: followUserId });
    if (!user || !followUser) return res.status(404).send("User not found");
    if (
      user.following.findIndex(
        (following) => following.user.toString() === followUserId
      ) !== -1
    )
      return res.status(401).send("User already followed");
    await user.following.push({ user: followUserId });
    await user.save();
    await followUser.followers.push({ user: userId });
    await followUser.save();
    await newFollowerNotification(userId, followUserId);
    return res.status(200).send("Success");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// UNFOLLOW A USER

router.put("/unfollow/:unfollowUserId", authMiddleWare, async (req, res) => {
  const { userId } = req;
  const { unfollowUserId } = req.params;
  try {
    const user = await FollowerModel.findOne({ user: userId });
    console.log(user);
    const unfollowUser = await FollowerModel.findOne({ user: unfollowUserId });
    if (!user || !unfollowUser) return res.status(404).send("User not found");
    const unfollowUserIndex = user.following.findIndex(
      (following) => following.user.toString() === unfollowUserId
    );
    const userIndex = unfollowUser.followers.findIndex(
      (follower) => follower.user.toString() === userId
    );
    if (unfollowUserIndex === -1 && userIndex === -1)
      return res.status(401).send("User already not followed");
    await user.following.splice(unfollowUserIndex, 1);
    await user.save();
    await unfollowUser.followers.splice(userIndex, 1);
    await unfollowUser.save();
    await removeFollowerNotification(userId, unfollowUserId);
    return res.status(200).send("User unfollowed successfully");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// UPDATE PROFILE

router.post("/update", authMiddleWare, async (req, res) => {
  console.log("updating");
  try {
    const { userId } = req;
    const { bio, facebook, youtube, twitter, instagram, profilePicUrl } =
      req.body;
    let profileFields = {};
    profileFields.user = userId;
    profileFields.bio = bio;
    profileFields.social = {};
    if (facebook) profileFields.social.facebook = facebook;
    if (youtube) profileFields.social.youtube = youtube;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;
    await ProfileModel.findOneAndUpdate(
      { user: userId },
      { $set: profileFields },
      { new: true }
    );
    if (profilePicUrl) {
      const user = await UserModel.findById(userId);
      user.profilePicUrl = profilePicUrl;
      await user.save();
    }
    return res.status(200).send("Success");
  } catch (error) {
    console.log(error);
    return res.status(500).send("Server Error");
  }
});

// UPDATE PASSWORD

router.post("/settings/password", authMiddleWare, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const { userId } = req;
    if (newPassword.length < 6) {
      return res
        .status(401)
        .send("Passowrd must be at least 6 characters long");
    }
    const user = await UserModel.findById(userId).select("+password");
    const isPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isPassword) return res.status(401).send("Invalid password");
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return res.status(200).send("Updated password successfully");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

// UPDATE MESSAGE POPUP SETTINGS

router.post("/settings/messagePopup", authMiddleWare, async (req, res) => {
  const { userId } = req;
  try {
    const user = await UserModel.findById(userId);
    user.newMessagePopup = !user.newMessagePopup;
    await user.save();
    return res.status(200).send("Success");
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
