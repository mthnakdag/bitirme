import React, { useState, useEffect, useRef, Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Switch from "react-switch";
import ToggleButton from "react-toggle-button";
import socket from "./socket";
import Grid from "@material-ui/core";

const SettingWindow = ({
  show,
  showModal,
  detectionBool,
  setDetectionBool,
  segmentationBool,
  setSegmentationBool,
  who,
  detectBody,
  detectObj,
}) => {
  return (
    <Modal
      style={{ opacity: "1", marginTop: "5px", color: "black" }}
      show={show}
      onHide={showModal}
    >
      <Modal.Header closeButton>
        <Modal.Title style={{marginTop:"50px"}}>Modal heading</Modal.Title>
      </Modal.Header>
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "left",
        flexDirection: "column",
      }}
    >
      <label>
        <span> Detection</span>
        <ToggleButton
          value={detectionBool}
          onToggle={(value) => {
            setDetectionBool(!value);
            console.log(!value);
            setTimeout(()=> detectObj(),1000)
          }}
        />
      </label>
      </div>
      <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "right",
        flexDirection: "column",
      }}
    >
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
      </div>
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
