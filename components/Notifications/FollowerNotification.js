import React, { useState } from "react";
import { Feed, Button } from "semantic-ui-react";
import calculateTime from "../../utils/calculateTime";
import { followUser, unfollowUser } from "../../utils/profileActions";

function FollowerNotification({
  notification,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
}) {
  const [disabled, setDisabled] = useState(false);
  const isFollowing =
    loggedUserFollowStats.following.findIndex(
      (followed) => followed.user === notification.user._id
    ) !== -1;

  const handleFollow = async () => {
    setDisabled(true);
    isFollowing
      ? await unfollowUser(notification.user._id, setLoggedUserFollowStats)
      : await followUser(notification.user._id, setLoggedUserFollowStats);
    setDisabled(false);
  };

  return (
    <>
      <Feed.Event>
        <Feed.Label image={notification.user.profilePicUrl} />
        <Feed.Content>
          <Feed.Summary>
            <>
              <Feed.User as="a" href={`/${notification.user.username}`}>
                {notification.user.name}
              </Feed.User>{" "}
              started following you
              <Feed.Date>{calculateTime(notification.date)}</Feed.Date>
            </>
          </Feed.Summary>
          <div style={{ position: "absolute", right: "5px", top: "5px" }}>
            <Button
              size="small"
              compact
              icon={isFollowing ? "check circle" : "add user"}
              color={isFollowing ? "instagram" : "twitter"}
              disabled={disabled}
              onClick={handleFollow}
            />
          </div>
        </Feed.Content>
      </Feed.Event>
      <br />
    </>
  );
}

export default FollowerNotification;
