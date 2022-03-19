const UserModel = require("../models/UserModel");
const NotificationModel = require("../models/NotificationModel");

const setNotificationToUnread = async (userId) => {
  try {
    const user = await UserModel.findById(userId);
    if (!user.unreadNotification) {
      user.unreadNotification = true;
      await user.save();
    }
    return;
  } catch (error) {
    console.error(error);
  }
};

const newLikeNotification = async (userId, postId, notifiedUserId) => {
  try {
    const notifyUser = await NotificationModel.findOne({
      user: notifiedUserId,
    });
    const newNotification = {
      type: "newLike",
      user: userId,
      post: postId,
      date: Date.now(),
    };
    await notifyUser.notifications.unshift(newNotification);
    await notifyUser.save();
    await setNotificationToUnread(notifiedUserId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeLikeNotification = async (userId, postId, notifiedUserId) => {
  try {
    const user = await NotificationModel.findOne({
      user: notifiedUserId,
    });
    const notificationToRemoveIndex = user.notifications.findIndex(
      (notification) =>
        notification.type === "newLike" &&
        notification.post.toString() === postId &&
        notification.user.toString() === userId
    );
    await user.notifications.splice(notificationToRemoveIndex, 1);
    await user.save();
    return;
  } catch (error) {
    console.error(error);
  }
};

const newCommentNotification = async (
  postId,
  commentId,
  userId,
  notifiedUserId,
  text
) => {
  try {
    const notifyUser = await NotificationModel.findOne({
      user: notifiedUserId,
    });
    const newNotification = {
      type: "newComment",
      user: userId,
      post: postId,
      commentId,
      text,
      date: Date.now(),
    };
    await notifyUser.notifications.unshift(newNotification);
    await notifyUser.save();
    await setNotificationToUnread(notifiedUserId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeCommentNotification = async (
  postId,
  commentId,
  userId,
  notifiedUserId
) => {
  try {
    const user = await NotificationModel.findOne({ user: notifiedUserId });
    const notificationToRemoveIndex = user.notifications.findIndex(
      (notification) =>
        notification.type === "newComment" &&
        notification.user.toString() === userId &&
        notification.post.toString() === postId &&
        notification.commentId === commentId
    );
    await user.notifications.splice(notificationToRemoveIndex, 1);
    await user.save();
    return;
  } catch (error) {
    console.error(error);
  }
};

const newFollowerNotification = async (userId, notifiedUserId) => {
  try {
    const user = await NotificationModel.findOne({ user: notifiedUserId });
    const newNotification = {
      type: "newFollower",
      user: userId,
      date: Date.now(),
    };
    await user.notifications.unshift(newNotification);
    await user.save();
    await setNotificationToUnread(notifiedUserId);
    return;
  } catch (error) {
    console.error(error);
  }
};

const removeFollowerNotification = async (userId, notifiedUserId) => {
  try {
    const user = await NotificationModel.findOne({ user: notifiedUserId });
    const notificationToRemoveIndex = user.notifications.findIndex(
      (notification) =>
        notification.type === "newFollower" &&
        notification.user.toString() === userId
    );
    await user.notifications.splice(notificationToRemoveIndex, 1);
    await user.save();
    return;
  } catch (error) {
    console.error(error);
  }
};

module.exports = {
  newLikeNotification,
  removeLikeNotification,
  newCommentNotification,
  removeCommentNotification,
  newFollowerNotification,
  removeFollowerNotification,
};
