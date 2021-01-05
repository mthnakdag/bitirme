import React, { useState } from 'react';
import PropTypes from 'prop-types';

function MainWindow({ startCall, clientId }) {
  const [friendID, setFriendID] = useState(null);

  /**
   * Start the call with or without video
   * @param {Boolean} video
   */
  const callWithVideo = (video) => {
    const config = { audio: false, video };
    return () => friendID && startCall(true, friendID, config);
  };

  return (
    <div className="container main-window">
      <div>
        <div style={{marginLeft:"220px",}}>
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
        <div style={{marginLeft:"220px",}}>
        <h4>ID of your contact,
        <input
          type="text"
          className="txt-clientId"
          spellCheck={false}
          placeholder="Your contact ID"
          onChange={(event) => setFriendID(event.target.value)}
        />
        </h4>
        </div>
        <div style={{marginLeft:"420px",}}>
        <div>
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
            onClick={callWithVideo(false)}
        />
        </div>
        </div>
      </div>
    </div>
  );
}

MainWindow.propTypes = {
  clientId: PropTypes.string.isRequired,
  startCall: PropTypes.func.isRequired
};

export default MainWindow;
