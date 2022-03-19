import React, { useState, useEffect, useRef } from "react";
import { Checkbox } from "semantic-ui-react";
import { toggleMessagePopup } from "../../utils/profileActions";

function ToggleMessagePopup({ newMessagePopup, setSuccess }) {
  const [popupSetting, setPopupSetting] = useState(newMessagePopup);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
  }, popupSetting);

  return (
    <div>
      <div style={{ marginTop: "10px" }}>
        Control weather a popup should appear when you recieve a new message
        <br />
        <Checkbox
          checked={popupSetting}
          toggle
          onChange={() => toggleMessagePopup(setPopupSetting, setSuccess)}
        />
      </div>
    </div>
  );
}

export default ToggleMessagePopup;
