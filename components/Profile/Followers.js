import React, { useState, useEffect } from "react";
import { Button, Image, List } from "semantic-ui-react";
import Spinner from "../Layout/Spinner";
import axios from "axios";
import baseUrl from "../../utils/baseUrl";
import cookie from "js-cookie";
import { NoFollowData } from "../Layout/NoData";
import { followUser, unfollowUser } from "../../utils/profileActions";

function Followers({
  user,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
  profileUserId,
}) {
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const getFollowers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${baseUrl}/api/profile/followers/${profileUserId}`,
        { headers: { Authorization: cookie.get("token") } }
      );
      setFollowers(res.data);
    } catch (error) {
      console.error("Error loading followers");
    }
    setLoading(false);
  };

  useEffect(() => {
    getFollowers();
  }, []);

  const handleFollow = async (user, isFollowing) => {
    console.log(isFollowing);
    setFollowLoading(true);
    isFollowing
      ? await unfollowUser(user.user._id, setLoggedUserFollowStats)
      : await followUser(user.user._id, setLoggedUserFollowStats);
    setFollowLoading(false);
  };

  return (
    <>
      {loading && <Spinner />}
      {!loading && followers.length > 0 ? (
        followers.map((follower) => {
          const isFollowing =
            loggedUserFollowStats.following.findIndex(
              (following) => following.user === follower.user._id
            ) !== -1;
          return (
            <>
              <List key={follower.user._id} divided verticalAlign="middle">
                <List.Item>
                  <List.Content floated="right">
                    {follower.user._id !== user._id && (
                      <Button
                        color={isFollowing ? "instagram" : "twitter"}
                        content={isFollowing ? "Following" : "Follow"}
                        icon={isFollowing ? "check" : "add user"}
                        disabled={followLoading}
                        onClick={handleFollow.bind(_, follower, isFollowing)}
                      />
                    )}
                  </List.Content>
                  <Image avatar src={follower.user.profilePicUrl} />
                  <List.Content as="a" href={`/${follower.user.username}`}>
                    {follower.user.name}
                  </List.Content>
                </List.Item>
              </List>
            </>
          );
        })
      ) : (
        <NoFollowData followersComponent />
      )}
    </>
  );
}

export default Followers;
