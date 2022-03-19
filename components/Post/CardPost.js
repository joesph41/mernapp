import React, { useState } from "react";
import {
  Card,
  Icon,
  Image,
  Divider,
  Segment,
  Button,
  Popup,
  Header,
  Modal,
} from "semantic-ui-react";
import PostComments from "./PostComments";
import CommentInput from "./CommentInput";
import LikesList from "./LikesList";
import Link from "next/link";
import calculateTime from "../../utils/calculateTime";
import { deletePost, likePost } from "../../utils/postActions";
import ImageModal from "./ImageModal";
import NoImageModal from "./NoImageModal";

function CardPost({ post, user, setPosts, setShowToastr }) {
  const [likes, setLikes] = useState(post.likes);
  const isLiked =
    likes.length > 0 &&
    likes.findIndex((like) => like.user === user._id) !== -1;
  const [comments, setComments] = useState(post.comments);
  const [error, setError] = useState(null);
  const [commentsAmount, setCommentsAmount] = useState(3);
  const [showModal, setShowModal] = useState(false);

  const addPropsToModal = () => ({
    post,
    user,
    setLikes,
    likes,
    isLiked,
    comments,
    setComments,
  });

  return (
    <>
      {showModal && (
        <Modal
          open={showModal}
          onClose={() => setShowModal(false)}
          closeIcon
          closeOnDimmerClick
        >
          <Modal.Content>
            {post.picUrl ? (
              <ImageModal {...addPropsToModal()} />
            ) : (
              <NoImageModal {...addPropsToModal()} />
            )}
          </Modal.Content>
        </Modal>
      )}
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

          <Card.Content>
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
              onClick={() => setShowModal(true)}
              style={{
                fontSize: "17px",
                letterSpacing: "0.1px",
                wordSpacing: "0.35px",
                cursor: "pointer",
              }}
            >
              {post.text}
            </Card.Description>
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
              comments.map(
                (comment, i) =>
                  i < commentsAmount && (
                    <PostComments
                      key={comment._id}
                      comment={comment}
                      postId={post._id}
                      user={user}
                      setComments={setComments}
                    />
                  )
              )}
            {comments.length > commentsAmount && (
              <Button
                content="View More"
                color="teal"
                basic
                circular
                onClick={() => {
                  setCommentsAmount((prev) => prev + 3);
                }}
              />
            )}
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
    </>
  );
}

export default CardPost;
