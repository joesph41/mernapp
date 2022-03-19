import React, { useState, useEffect } from "react";
import axios from "axios";
import { parseCookies } from "nookies";
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
  Container,
} from "semantic-ui-react";
import PostComments from "../../components/Post/PostComments";
import CommentInput from "../../components/Post/CommentInput";
import LikesList from "../../components/Post/LikesList";
import Link from "next/link";
import { likePost } from "../../utils/postActions";
import calculateTime from "../../utils/calculateTime";
import { NoPostFound } from "../../components/Layout/NoData";
import baseUrl from "../../utils/baseUrl";

function PostPage({ post, errorLoading, user }) {
  if (errorLoading) return <NoPostFound />;

  const [likes, setLikes] = useState(post.likes);
  const isLiked =
    likes.length > 0 &&
    likes.findIndex((like) => like.user === user._id) !== -1;
  const [comments, setComments] = useState(post.comments);

  return (
    <Container text>
      <Segment basic>
        <Card color="teal" fluid>
          {post.picUrl && (
            <Image
              src={post.picUrl}
              style={{ cursor: "pointer" }}
              floated="left"
              wrapped
              ui={false}
              alt="Post image"
              onClick={() => setShowModal(true)}
            />
          )}

          <Card.Content
            onClick={() => setShowModal(true)}
            style={{ cursor: "pointer" }}
          >
            <Image
              floated="left"
              src={post.user.profilePicUrl}
              avatar
              circular
            />
            {(user.role === "root" || post.user._id === user._id) && (
              <>
                <Popup
                  on="click"
                  position="top right"
                  trigger={
                    <Image
                      src="/deleteIcon.svg"
                      style={{ cursor: "pointer" }}
                      size="mini"
                      floated="right"
                    />
                  }
                >
                  <Header as="h4" content="Are you sure?" />
                  <p>This action is irreversible</p>
                  <Button
                    color="red"
                    icon="trash"
                    content="Delete"
                    onClick={() =>
                      deletePost(post._id, setPosts, setShowToastr)
                    }
                  />
                </Popup>
              </>
            )}
            <Card.Header>
              <Link href={`/${post.user.username}`}>
                <a>{post.user.name}</a>
              </Link>
            </Card.Header>
            <Card.Meta>{calculateTime(post.createdAt)}</Card.Meta>
            {post.location && <Card.Meta content={post.location} />}
            <Card.Description
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
              }}
            />
            {post.text}
          </Card.Content>
          <Card.Content extra>
            <Icon
              name={isLiked ? "heart" : "heart outline"}
              color="red"
              style={{ cursor: "pointer" }}
              onClick={() =>
                likePost(post._id, user._id, setLikes, isLiked ? false : true)
              }
            />
            <LikesList
              postId={post._id}
              trigger={
                likes.length > 0 && (
                  <span className="spanLikesList">{`${likes.length} ${
                    likes.length === 1 ? "like" : "likes"
                  }`}</span>
                )
              }
            />
            <Icon
              name="comment outline"
              style={{ marginLeft: "7px" }}
              color="blue"
            />
            {comments.length > 0 &&
              comments.map((comment) => (
                <PostComments
                  key={comment._id}
                  comment={comment}
                  postId={post._id}
                  user={user}
                  setComments={setComments}
                />
              ))}
            <Divider hidden />
            <CommentInput
              user={user}
              postId={post._id}
              setComments={setComments}
            />
          </Card.Content>
        </Card>
      </Segment>
      <Divider hidden />
    </Container>
  );
}

PostPage.getInitialProps = async (ctx) => {
  try {
    const { postId } = ctx.query;
    const { token } = parseCookies(ctx);
    const res = await axios.get(`${baseUrl}/api/posts/${postId}`, {
      headers: { Authorization: token },
    });
    return { post: res.data };
  } catch (error) {
    return { errorLoading: true };
  }
};

export default PostPage;
