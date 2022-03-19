import React, { useState, useEffect, useRef } from "react";
import { Form, Button, Divider, Message, List } from "semantic-ui-react";
import { updatePassword } from "../../utils/profileActions";

function UpdatePassword({ setSuccess, setShowUpdatePassword }) {
  const [userPasswords, setUserPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    field1: false,
    field2: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { currentPassword, newPassword } = userPasswords;
  const { field1, field2 } = showPassword;

  useEffect(() => {
    error !== null && setTimeout(() => setError(null), 5000);
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserPasswords((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await updatePassword(
      setSuccess,
      setError,
      setLoading,
      setShowUpdatePassword,
      userPasswords
    );
  };

  return (
    <>
      <Form error={error !== null} loading={loading} onSubmit={handleSubmit}>
        <List.List>
          <List.Item>
            <Form.Input
              fluid
              icon={{
                name: "eye",
                circular: "true",
                link: "true",
                onClick: () =>
                  setShowPassword((prev) => ({
                    ...prev,
                    field1: !prev.field1,
                  })),
              }}
              type={field1 ? "text" : "password"}
              iconPosition="left"
              label="Current Password"
              placeholder="Enter Current Passsword"
              name="currentPassword"
              onChange={handleChange}
              value={currentPassword}
            />
            <Form.Input
              fluid
              icon={{
                name: "eye",
                circular: "true",
                link: "true",
                onClick: () =>
                  setShowPassword((prev) => ({
                    ...prev,
                    field2: !prev.field2,
                  })),
              }}
              type={field2 ? "text" : "password"}
              iconPosition="left"
              label="New Password"
              placeholder="Enter New Passsword"
              name="newPassword"
              onChange={handleChange}
              value={newPassword}
            />
            <Button
              disabled={loading || newPassword === "" || currentPassword === ""}
              compact
              icon="configure"
              type="submit"
              color="teal"
              content="Confirm"
            />
            <Button
              disabled={loading}
              compact
              icon="cancel"
              content="Cancel"
              onClick={() => setShowUpdatePassword(false)}
            />
            <Message
              error
              icon="meh"
              header="Something went wrong!"
              content={error}
            />
          </List.Item>
        </List.List>
      </Form>
      <Divider hidden />
    </>
  );
}

export default UpdatePassword;
