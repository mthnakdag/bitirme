import React, { useState, useEffect, useRef ,Component} from "react";
import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import Switch from 'react-switch';
import ToggleButton from 'react-toggle-button'

const io = require('socket.io')(5000)

class CallWindow extends Component{
  constructor() {
    super()
    this.state={
      value:false,
      valuee:false,
    }
  }
  render(){
    const {show,showModal}=this.props
  return (
        <Modal
          style={{ opacity: "1",marginTop:"5px", color: "black" }}
          show={show}
          onHide={showModal}
        >
          <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
          </Modal.Header>
          <label>
            <span> Detection</span>
          <ToggleButton
               value={ this.state.value || false}
               onToggle={(value) => {
               this.setState({
                  value: !value,
               })
                const sockett = io();
               sockett.on('connection',function(value)  {
                 if(value==true){
                    sockett.emit("message",'User use a detection');
                 }
               });
             }}/>
           </label>
           <label>
            <span> Segmentation</span>
            <ToggleButton
               value={ this.state.valuee || false }
               onToggle={(value) => {
               this.setState({
                  valuee: !value,
               })
                const sockett = io();
               sockett.on('connection',function(value) {
                 if(value==true){
                    sockett.emit("message",'User use a segmentation');
                 }
               });
             }}/>           
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