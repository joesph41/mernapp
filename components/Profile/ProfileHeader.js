import React, { useState } from "react";
import {
  Segment,
  Grid,
  Image,
  Divider,
  Header,
  Button,
  List,
} from "semantic-ui-react";
import { followUser, unfollowUser } from "../../utils/profileActions";

function ProfileHeader({
  profile,
  ownAccount,
  loggedUserFollowStats,
  setLoggedUserFollowStats,
}) {
  const [loading, setLoading] = useState(false);
  const isFollowing =
    loggedUserFollowStats.following.findIndex(
      (following) => following.user === profile.user._id
    ) !== -1;

  const handleFollow = async () => {
    setLoading(true);
    isFollowing
      ? await unfollowUser(profile.user._id, setLoggedUserFollowStats)
      : await followUser(profile.user._id, setLoggedUserFollowStats);
    setLoading(false);
  };

  return (
    <>
      <Segment>
        <Grid stackable>
          <Grid.Column width={11}>
            <Grid.Row>
              <Header
                as="h2"
                content={profile.user.name}
                style={{ marginTop: "5px" }}
              />
            </Grid.Row>
            <Grid.Row stretched>
              {profile.bio}
              <Divider hidden />
            </Grid.Row>
            <Grid.Row>
              {profile.social ? (
                <>
                  <List>
                    <List.Item>
                      <List.Icon name="mail" />
                      <List.Content content={profile.user.email} />
                    </List.Item>
                    {profile.social.facebook && (
                      <List.Item>
                        <List.Icon name="facebook" color="blue" />
                        <List.Content
                          content={profile.user.facebook}
                          style={{ color: "blue" }}
                        />
                      </List.Item>
                    )}
                    {profile.social.instagram && (
                      <List.Item>
                        <List.Icon name="instagram" color="red" />
                        <List.Content
                          content={profile.user.instagram}
                          style={{ color: "red" }}
                        />
                      </List.Item>
                    )}
                    {profile.social.youtube && (
                      <List.Item>
                        <List.Icon name="youtube" color="red" />
                        <List.Content
                          content={profile.user.youtube}
                          style={{ color: "red" }}
                        />
                      </List.Item>
                    )}
                    {profile.social.twitter && (
                      <List.Item>
                        <List.Icon name="twitter" color="blue" />
                        <List.Content
                          content={profile.user.twitter}
                          style={{ color: "blue" }}
                        />
                      </List.Item>
                    )}
                  </List>
                </>
              ) : (
                <>No Social Media Links</>
              )}
            </Grid.Row>
          </Grid.Column>
          <Grid.Column width={5} stretched style={{ textAlgin: "center" }}>
            <Grid.Row>
              <Image src={profile.user.profilePicUrl} avatar size="large" />
              <br />
              {!ownAccount && (
                <Button
                  compact
                  loading={loading}
                  disabled={loading}
                  content={isFollowing ? "Following" : "Follow"}
                  icon={isFollowing ? "check circle" : "add user"}
                  color={isFollowing ? "instagram" : "twitter"}
                  style={{ width: "100%", marginTop: "15px" }}
                  onClick={handleFollow}
                />
              )}
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Segment>
    </>
  );
}

export default ProfileHeader;
