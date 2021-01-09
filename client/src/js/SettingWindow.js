import React, { useState, useEffect, useRef, Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Switch from "react-switch";
import ToggleButton from "react-toggle-button";
import socket from "./socket";

const SettingWindow = ({
  show,
  showModal,
  detectionBool,
  setDetectionBool,
  segmentationBool,
  setSegmentationBool,
  who,
  detectBody,
}) => {
  return (
    <Modal
      style={{ opacity: "1", marginTop: "5px", color: "black" }}
      show={show}
      onHide={showModal}
    >
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <label>
        <span> Detection</span>
        <ToggleButton
          value={detectionBool}
          onToggle={(value) => {
            setDetectionBool(!value);
            console.log(value);
          }}
        />
      </label>
      <label>
        <span> Segmentation</span>
        <ToggleButton
          value={segmentationBool}
          onToggle={(value) => {
            setSegmentationBool(!value);
            socket.emit("segment", { who: who, data: !value });
            detectBody();
          }}
        />
      </label>
      <Modal.Footer>
        <Button variant="primary" onClick={showModal}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

SettingWindow.propTypes = {
  show: PropTypes.bool.isRequired,
  showFunc: PropTypes.func.isRequired,
  callFrom: PropTypes.string,
};

export default SettingWindow;
