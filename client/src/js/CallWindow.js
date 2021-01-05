import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Modal, Button } from "react-bootstrap";

const getButtonClass = (icon, enabled) =>
  classnames(`btn-action fa ${icon}`, { disable: !enabled });

function CallWindow({
  peerSrc,
  localSrc,
  config,
  mediaDevice,
  status,
  endCall,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  const [showSetting, setShowSetting] = useState(false);

  const showModal = () => {
    console.log(showSetting);
    setShowSetting(!showSetting);
  };

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  });

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle("Video", video);
      mediaDevice.toggle("Audio", audio);
    }
  });

  /**
   * Turn on/off a media device
   * @param {String} deviceType - Type of the device eg: Video, Audio
   */
  const toggleMediaDevice = (deviceType) => {
    if (deviceType === "video") {
      setVideo(!video);
      mediaDevice.toggle("Video");
    }
    if (deviceType === "audio") {
      setAudio(!audio);
      mediaDevice.toggle("Audio");
    }
  };

  return (
    <div className={classnames("call-window", status)}>
      {/* DEFAULT ON THE BELOW */}
      <video id="peerVideo" ref={peerVideo} autoPlay />
      <video id="localVideo" ref={localVideo} autoPlay muted />
      {showSetting && (
        <Modal
          style={{ opacity: "1", color: "black" }}
          show={showSetting}
          onHide={showModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={showModal}>
              Close
            </Button>
            <Button variant="primary" onClick={showModal}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      )}

      <div className="video-control">
        <button
          key="btnVideo"
          type="button"
          className={getButtonClass("fa-video-camera", video)}
          onClick={() => toggleMediaDevice("video")}
        />
        <button
          key="btnAudio"
          type="button"
          className={getButtonClass("fa-microphone", audio)}
          onClick={() => toggleMediaDevice("audio")}
        />
        <button
          type="button"
          className="btn-action hangup fa fa-phone"
          onClick={() => endCall(true)}
        />
        <button
          type="button"
          className="btn-action setting fa fa-cog"
          onClick={() => showModal()}
        />
      </div>
    </div>
  );
}

CallWindow.propTypes = {
  status: PropTypes.string.isRequired,
  localSrc: PropTypes.object, // eslint-disable-line
  peerSrc: PropTypes.object, // eslint-disable-line
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
