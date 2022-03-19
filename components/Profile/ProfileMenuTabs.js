import React from "react";
import { Menu } from "semantic-ui-react";

function ProfileMenuTabs({
  activeItem,
  handleItemClick,
  followersLength,
  followingLength,
  ownAccount,
  loggedUserFollowStats,
}) {
  return (
    <>
      <Menu pointing secondary>
        <Menu.Item
          name="profile"
          active={activeItem === "profile"}
          onClick={() => handleItemClick("profile")}
        />
        {ownAccount ? (
          <>
            <Menu.Item
              name={`${loggedUserFollowStats.followers.length} followers`}
              active={activeItem === "followers"}
              onClick={() => handleItemClick("followers")}
            />
            <Menu.Item
              name={`${loggedUserFollowStats.following.length} following`}
              active={activeItem === "following"}
              onClick={() => handleItemClick("following")}
            />
          </>
        ) : (
          <>
            <Menu.Item
              name={`${followersLength} followers`}
              active={activeItem === "followers"}
              onClick={() => handleItemClick("followers")}
            />
            <Menu.Item
              name={`${followingLength} following`}
              active={activeItem === "following"}
              onClick={() => handleItemClick("following")}
            />
          </>
        )}

        {ownAccount && (
          <>
            <Menu.Item
              name="Update profile"
              active={activeItem === "updateProfile"}
              onClick={() => handleItemClick("updateProfile")}
            />
            <Menu.Item
              name="Settings"
              active={activeItem === "settings"}
              onClick={() => handleItemClick("settings")}
            />
          </>
        )}
      </Menu>
    </>
  );
}

export default ProfileMenuTabs;
