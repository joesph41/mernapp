import React, { useState, useRef } from "react";
import { Form, Button, Divider, Message } from "semantic-ui-react";
import uploadPic from "../../utils/uploadPicToCloudinary";
import { updateProfile } from "../../utils/profileActions";
import ImageDropper from "../Common/ImageDropper";
import CommonInputs from "../Common/CommonInputs";

function UpdateProfile({ Profile }) {
  const [profile, setProfile] = useState({
    profilePicUrl: Profile.user.profilePicUrl,
    bio: Profile.bio,
    facebook: (Profile.social && Profile.social.facebook) || "",
    instagram: (Profile.social && Profile.social.instagram) || "",
    youtube: (Profile.social && Profile.social.youtube) || "",
    twitter: (Profile.social && Profile.social.twitter) || "",
  });

  const [media, setMedia] = useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showSocialLinks, setShowSocialLinks] = useState(false);
  const [highlighted, setHighlighted] = useState(false);
  const inputRef = useRef();

  const imageDropperProps = {
    highlighted,
    setHighlighted,
    inputRef,
    handleChange,
    mediaPreview,
    setMediaPreview,
    setMedia,
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "meida") {
      setMedia(files[0]);
      setMediaPreview(URL.createObjectURL(files[0]));
    }
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let profilePicUrl;
    if (media !== null) {
      profilePicUrl = await uploadPic(media);

      if (!profilePicUrl) {
        setLoading(false);
        return setError("Error uploading image");
      }
    }
    await updateProfile(profile, setLoading, setError, profilePicUrl);
  };

  return (
    <>
      <Form loading={loading} error={error !== null} onSubmit={handleSubmit}>
        <Message
          error
          onDismiss={() => setError(null)}
          content={error}
          header="Something went wrong!"
          attached
        />
        <ImageDropper
          {...imageDropperProps}
          profilePicUrl={profile.profilePicUrl}
        />
        <CommonInputs
          user={profile}
          handleChange={handleChange}
          showSocialLinks={showSocialLinks}
          setShowSocialLinks={setShowSocialLinks}
        />
        <Divider hidden />
        <Button
          color="blue"
          disabled={profile.bio === "" || loading}
          icon="pencil alternate"
          content="Submit"
          type="submit"
        />
      </Form>
    </>
  );
}

export default UpdateProfile;
