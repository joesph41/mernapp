const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const NotificationModel = require("../models/NotificationModel");
const UserModel = require("../models/UserModel");

router.get("/", authMiddleWare, async (req, res) => {
  try {
    console.log("hit the route");
    const { userId } = req;
    const user = await NotificationModel.findOne({ user: userId })
      .populate("notifications.user")
      .populate("notifications.post");
    console.log(user);
    return res.json(user.notifications);
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

router.post("/", authMiddleWare, async (req, res) => {
  try {
    const { userId } = req;
    const user = await UserModel.findById(userId);
    if (user.unreadNotification) {
      user.unreadNotification = false;
      await user.save();
    }
    return res.status(200).send("Updated");
  } catch (error) {
    return res.status(500).send("Server error");
  }
});

module.exports = router;
