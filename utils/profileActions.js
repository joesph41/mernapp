import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";
import Router from "next/router";

const Axios = axios.create({
  baseURL: `${baseUrl}/api/profile`,
  headers: { Authorization: cookie.get("token") },
});

export const followUser = async (followedUserId, setUserFollowStats) => {
  try {
    await Axios.post(`/follow/${followedUserId}`);
    setUserFollowStats((prev) => ({
      ...prev,
      following: [...prev.following, { user: followedUserId }],
    }));
  } catch (error) {
    console.error(catchErrors(error));
  }
};

export const unfollowUser = async (unfollowedUserId, setUserFollowStats) => {
  try {
    await Axios.put(`/unfollow/${unfollowedUserId}`);
    setUserFollowStats((prev) => ({
      ...prev,
      following: prev.following.filter(
        (follower) => follower.user !== unfollowedUserId
      ),
    }));
  } catch (error) {
    console.error(catchErrors(error));
  }
};

export const updateProfile = async (
  profile,
  setLoading,
  setError,
  profilePicUrl
) => {
  try {
    const { bio, facebook, youtube, twitter, instagram } = profile;
    console.log(bio);
    await Axios.post(`/update`, {
      bio,
      facebook,
      youtube,
      twitter,
      instagram,
      profilePicUrl,
    });
    setLoading(false);
    Router.reload();
  } catch (error) {
    setError(catchErrors(error));
    setLoading(false);
  }
};

export const updatePassword = async (
  setSuccess,
  setError,
  setLoading,
  setShowUpdatePassword,
  userPasswords
) => {
  try {
    const { currentPassword, newPassword } = userPasswords;
    await Axios.post(`/settings/password`, {
      currentPassword,
      newPassword,
    });
    setSuccess(true);
    setLoading(false);
    setShowUpdatePassword(false);
  } catch (error) {
    setLoading(false);
    setError(error.message);
  }
};

export const toggleMessagePopup = async (setPopupSetting, setSuccess) => {
  try {
    await Axios.post("/settings/messagePopup");
    setPopupSetting((prev) => !prev);
    setSuccess(true);
  } catch (error) {
    console.error(catchErrors(error));
  }
};
