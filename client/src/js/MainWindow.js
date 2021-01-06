import React, { useState } from "react";
import PropTypes from "prop-types";

function MainWindow({ startCall, clientId }) {
  const [friendID, setFriendID] = useState(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   * @param {Boolean} audio
   */
  const callWithVideo = (video) => {
    const config = { audio: false, video };
    return () => friendID && startCall(true, friendID, config);
  };

  const callWithAudio = (audio) => {
    const configg = { video: false, audio };
    return () => friendID && startCall(true, friendID, configg);
  };

  return (
    <div
      className="container main-window"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div>
        <h3>
          Your current ID at this call,
          <input
            type="text"
            className="txt-clientId"
            defaultValue={clientId}
            readOnly
          />
        </h3>
      </div>
      <div>
        <h4>
          ID of your contact,
          <input
            type="text"
            className="txt-clientId"
            spellCheck={false}
            placeholder="Your contact ID"
            onChange={(event) => setFriendID(event.target.value)}
          />
        </h4>
      </div>
      <div
        style={{
          paddingTop: "4%",
          width: "30%",
          display: "flex",
          justifyContent: "space-between",
          justifyItems: "flex-start",
        }}
      >
        <button
          type="button"
          className="btn-action fa fa-video-camera"
          onClick={callWithVideo(true)}
        />
        <button
          type="button"
          className="btn-action fa fa-phone"
          onClick={callWithVideo(false)}
        />
        <button
          type="button"
          className="btn-action fa fa-microphone"
          onClick={callWithAudio(true)}
        />
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired,
};

export default MainWindow;
