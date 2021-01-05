import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";

function CallWindow({
  show,
  showModal
}) {
  return (
        <Modal
          style={{ opacity: "1", color: "black" }}
          show={show}
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
  );
}

CallWindow.propTypes = {
  show: PropTypes.bool.isRequired,
  showFunc: PropTypes.func.isRequired,
};

export default CallWindow;
