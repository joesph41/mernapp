import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import baseUrl from "../utils/baseUrl";
import uploadPic from "../utils/uploadPicToCloudinary";
import { registerUser } from "../utils/authUser";
import {
  Form,
  Button,
  Message,
  Segment,
  TextArea,
  Divider,
  FormInput,
} from "semantic-ui-react";
import {
  HeaderMessage,
  FooterMessage,
} from "../components/Common/WelcomeMessage";
import CommonInputs from "../components/Common/CommonInputs";
import ImageDropper from "../components/Common/ImageDropper";

const regexUserName = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;

let cancel;

function Signup() {
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    facebook: "",
    youtube: "",
    twitter: "",
    instagram: "",
  });

  const { name, email, password, bio } = user;

  const [showSocicalLinks, setShowSocailLinks] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [username, setUsername] = useState("");
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState(false);
  const [usernameError, setUsernameError] = useState(false);
  const [usernameTouched, setUsernameTouched] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [submitDisabled, setSubmitDisabled] = useState(true);

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const isUser = Object.values({ name, email, password, bio }).every(
      (item) => {
        return Boolean(item);
      }
    );
    setSubmitDisabled(!isUser);
  }, [user]);

  const checkUsername = async () => {
    setUsernameLoading(true);
    try {
      cancel && cancel();
      const CancelToken = axios.CancelToken;
      const res = await axios.get(`${baseUrl}/api/signup/${username}`, {
        cancelToken: new CancelToken((canceler) => {
          cancel = canceler;
        }),
      });
      if (res.data === "Available") {
        setUsernameAvailable(true);
        setUsernameError(false);
        setUser((prev) => ({ ...prev, username }));
      } else {
        setUsernameAvailable(false);
        setUsernameError(true);
      }
      if (errorMsg !== null) setErrorMsg(null);
    } catch (error) {
      setUsernameAvailable(false);
      setUsernameError(true);
      setErrorMsg("Username Not Available");
    }
    setUsernameLoading(false);
  };

  useEffect(() => {
    username === "" ? setUsernameAvailable(false) : checkUsername();
  }, [username]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);
    }
    if (media !== null && !profilePicUrl) {
      setFormLoading(false);
      return setErrorMsg("Error uploading the image");
    }
    await registerUser(user, profilePicUrl, setErrorMsg, setFormLoading);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "media") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }

    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <HeaderMessage />
      <Form
        loading={formLoading}
        error={errorMsg !== null}
        onSubmit={handleSubmit}
      >
        <Message
          error
          header="Something went wrong!"
          content={errorMsg}
          onDismiss={() => setErrorMsg(null)}
        />
        <Segment>
          <ImageDropper
            mediaPreview={mediaPreview}
            setMediaPreview={setMediaPreview}
            setMedia={setMedia}
            inputRef={inputRef}
            highlighted={highlighted}
            setHighlighted={setHighlighted}
            handleChange={handleChange}
          />
          <Form.Input
            required
            label="name"
            placeholder="name"
            name="name"
            value={name}
            onChange={handleChange}
            fluid
            icon="user"
            iconPosition="left"
          />
          <Form.Input
            required
            label="Email"
            placeholder="Email"
            name="email"
            value={email}
            onChange={handleChange}
            fluid
            icon="envelope"
            iconPosition="left"
            type="email"
          />
          <Form.Input
            label="Password"
            placeholder="Password"
            name="password"
            value={password}
            onChange={handleChange}
            fluid
            icon={{
              name: "eye",
              circular: true,
              link: true,
              onClick: () => {
                setShowPassword(!showPassword);
              },
            }}
            iconPosition="left"
            type={showPassword ? "text" : "password"}
            required
          />
          <Form.Input
            loading={usernameLoading}
            error={usernameError}
            required
            label="Username"
            placeholder="Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (!regexUserName.test(e.target.value)) {
                setUsernameAvailable(false);
                setUsernameError(true);
              } else {
                setUsernameAvailable(true);
                setUsernameError(false);
              }
            }}
            onBlur={(e) => {
              if (e.target.value === "") {
                setUsernameError(true);
              }
            }}
            fluid
            icon={usernameAvailable ? "check" : "close"}
            iconPosition="left"
          />
          <CommonInputs
            user={user}
            showSocialLinks={showSocicalLinks}
            setShowSocialLinks={setShowSocailLinks}
            handleChange={handleChange}
          />
          <Divider hidden />
          <Button
            icon="signup"
            content="Signup"
            type="submit"
            color="teal"
            disabled={submitDisabled || !usernameAvailable}
          />
        </Segment>
      </Form>
      <FooterMessage />
    </>
  );
}

export default Signup;
