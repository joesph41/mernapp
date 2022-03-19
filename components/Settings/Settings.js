import React, { useState, useEffect, useRef } from "react";
import {
  Form,
  Button,
  Divider,
  Message,
  List,
  Checkbox,
} from "semantic-ui-react";
import UpdatePassword from "./UpdatePassword";
import ToggleMessagePopup from "./ToggleMessagePopup";

function Settings({ newMessagePopup }) {
  const [showUpdatePassword, setShowUpdatePassword] = useState(false);
  const [showMsgSettings, setShowMsgSettings] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    success && setTimeout(() => setSuccess(false), 3000);
  }, [success]);

  return (
    <>
      {success && (
        <>
          {" "}
          <Message icon="check circle" header="Updated Successfully" success />
          <Divider hidden />
        </>
      )}

      <List size="huge" animated>
        <List.Item>
          <List.Icon name="user secret" size="large" verticalAlign="middle" />
          <List.Content>
            <List.Header
              as="a"
              onClick={() => setShowUpdatePassword((prev) => !prev)}
              content="Update Password"
            />
          </List.Content>
          {showUpdatePassword && (
            <UpdatePassword
              setSuccess={setSuccess}
              setShowUpdatePassword={setShowUpdatePassword}
            />
          )}
        </List.Item>

        <Divider />

        <List.Item>
          <List.Icon
            name="paper plane outline"
            size="large"
            verticalAlign="middle"
          />
          <List.Content>
            <List.Header
              onClick={() => setShowMsgSettings((prev) => !prev)}
              as="a"
              content="Show new message popup"
            />
            {showMsgSettings && (
              <ToggleMessagePopup
                newMessagePopup={newMessagePopup}
                setSuccess={setSuccess}
              />
            )}
          </List.Content>
        </List.Item>
      </List>
    </>
  );
}

export default Settings;
