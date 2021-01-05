import React, { useState, useEffect, useRef ,Component} from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Switch from 'react-switch';

class CallWindow extends Component{
  constructor() {
    super()
    this.state={
      checked:false,
      checkedSegmentation:false,
      checkedDetection:false,
    }
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(checked){
    this.setState({checked})
  }
  render(){
    const {show,showModal}=this.props
  return (
        <Modal
          style={{ opacity: "1", color: "black" }}
          show={show}
          onHide={showModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <label>
            <span> Detection</span>
          <Switch
           className="react-switch"
           onChange={this.handleChange}
           checked={this.state.checkedDetection}>
           </Switch>
           </label>
           <label>
            <span> Segmentation</span>
          <Switch
           className="react-switch"
           onChange={this.handleChange}
           checked={this.state.checkedSegmentation}>
           </Switch>
           </label>
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
}

CallWindow.propTypes = {
  show: PropTypes.bool.isRequired,
  showFunc: PropTypes.func.isRequired,
};

export default CallWindow;