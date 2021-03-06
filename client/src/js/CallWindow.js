import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import classnames from "classnames";
import { Modal, Button } from "react-bootstrap";
import SettingWindow from "./SettingWindow";
import * as tf from "@tensorflow/tfjs";
import * as bodyPix from "@tensorflow-models/body-pix";
import * as cocossd from "@tensorflow-models/coco-ssd";

import socket from "./socket";

const getButtonClass = (icon, enabled) =>
  classnames(`btn-action fa ${icon}`, { disable: !enabled });

function CallWindow({
  peerSrc,
  localSrc,
  callFrom,
  config,
  mediaDevice,
  status,
  endCall,
}) {
  const peerVideo = useRef(null);
  const localVideo = useRef(null);
  const peerCanvas = useRef(null);
  const localCanvas = useRef(null);

  const [video, setVideo] = useState(config.video);
  const [audio, setAudio] = useState(config.audio);
  const [showSetting, setShowSetting] = useState(false);
  const [bodyPixModel, setBodyPixModel] = useState(null);
  const [detectionBool, setDetectionBool] = useState(false);

  const [segmentationBoolLocal, setSegmentationBoolLocal] = useState(false);
  const [segmentationBoolPeer, setSegmentationBoolPeer] = useState(false);

  const [cocoSSDModel, setCocoSSDModel] = useState(null);

  useEffect(() => {
    socket.on("segmentTo", (data) => {
      console.log(data);
      data.who === "peer"
        ? setSegmentationBoolPeer(data.data)
        : setSegmentationBoolLocal(data.data);
      detectBody();
    });
  });

  useEffect(() => {
    tf.backend("webgl");
    bodyPix
      .load({
        architecture: "MobileNetV1",
        outputStride: 16,
        multiplier: 0.75,
        quantBytes: 2,
      })
      .catch((error) => {
        console.error(error);
      })
      .then((objNet) => {
        setBodyPixModel(objNet);
        console.log("bodyPix loaded");
      });
    cocossd
      .load()
      .catch((error) => {
        console.error(error);
      })
      .then((objNet) => {
        setCocoSSDModel(objNet);
        console.log("cocoSSD is loaded");
        console.log(objNet);
      });
  }, []);

  const detectObj = () => {
    if (
      cocoSSDModel !== null &&
      peerVideo.current !== null &&
      peerVideo.current !== undefined &&
      localVideo.current !== null &&
      localVideo.current !== undefined
    ) {
      if (!detectionBool) {
        console.log(1);
        return;
      } else {
        if (detectionBool) {
          cocoSSDModel
            .detect(callFrom === "" ? localVideo.current : peerVideo.current)
            .catch((err) => console.error(err))
            .then((detect) => {
              console.log(detect);
              if (detect !== undefined && detect !== null) {
                var classes = [];
                console.log("outer", detect);
                detect.forEach((element) => {
                  classes.push(element.class);
                });
                if (
                  !classes.includes("person") ||
                  classes.includes("cell phone") ||
                  classes.includes("remote")
                ) {
                  setTimeout(() => {
                    if (detectionBool) {
                      cocoSSDModel
                        .detect(
                          callFrom === ""
                            ? localVideo.current
                            : peerVideo.current
                        )
                        .then((detection) => {
                          console.log("inner", detection);
                          if (detection !== undefined && detection !== null) {
                            var classes2 = [];
                            detection.forEach((element) => {
                              classes2.push(element.class);
                            });
                            if (
                              !classes2.includes("person") ||
                              classes2.includes("cell phone") ||
                              classes2.includes("remote")
                            ) {
                              setAudio(false);
                              setVideo(false);
                              return;
                            }
                          }
                        });
                    }
                  }, 3000);
                  return;
                }
              }
            });
        }
        requestAnimationFrame(detectObj);
      }
    }
  };

  const detectBody = () => {
    if (
      bodyPixModel !== null &&
      peerVideo.current !== null &&
      peerVideo.current !== undefined &&
      localVideo.current !== null &&
      localVideo.current !== undefined
    ) {
      if (!(segmentationBoolLocal || segmentationBoolPeer)) {
        return;
      } else {
        if (segmentationBoolPeer) {
          bodyPixModel
            .segmentPerson(peerVideo.current, {
              flipHorizontal: true,
              internalResolution: 0.25,
              segmentationThreshold: 0.5,
              //maxDetections:1
              nmsRadius: 2,
            })
            .catch((err) => {
              console.error(err);
            })
            .then((segmentation) => {
              if (segmentation !== undefined && segmentation !== null)
                drawBody(segmentation, "peer");
            });
        }
        if (segmentationBoolLocal) {
          bodyPixModel
            .segmentPerson(localVideo.current, {
              flipHorizontal: true,
              internalResolution: 0.25,
              segmentationThreshold: 0.5,
              //maxDetections:1
              nmsRadius: 2,
            })
            .catch((err) => {
              console.error(err);
            })
            .then((segmentation) => {
              if (segmentation !== undefined && segmentation !== null)
                drawBody(segmentation, "local");
            });
        }
        requestAnimationFrame(detectBody);
      }
    }
  };

  const drawBody = (segmentation, control) => {
    if (control === "local") {
      localCanvas.current
        .getContext("2d")
        .drawImage(localVideo.current, 0, 0, 350, 200);
      let imageData = localCanvas.current
        .getContext("2d")
        .getImageData(0, 0, 350, 200);
      let pixel = imageData.data;
      for (let p = 0; p < pixel.length; p += 4)
        if (segmentation.data[p / 4] === 0) pixel[p + 3] = 0;
      localCanvas.current.getContext("2d").imageSmoothingEnabled = true;
      localCanvas.current.getContext("2d").putImageData(imageData, 0, 0);
    } else {
      peerCanvas.current
        .getContext("2d")
        .drawImage(peerVideo.current, 0, 0, 350, 200);
      let imageData = peerCanvas.current
        .getContext("2d")
        .getImageData(0, 0, 350, 200);
      let pixel = imageData.data;
      for (let p = 0; p < pixel.length; p += 4)
        if (segmentation.data[p / 4] === 0) pixel[p + 3] = 0;
      peerCanvas.current.getContext("2d").imageSmoothingEnabled = true;
      peerCanvas.current.getContext("2d").putImageData(imageData, 0, 0);
    }
  };

  const showModal = () => {
    setShowSetting(!showSetting);
  };

  useEffect(() => {
    if (peerVideo.current && peerSrc) peerVideo.current.srcObject = peerSrc;
    if (localVideo.current && localSrc) localVideo.current.srcObject = localSrc;
  }, [localSrc, peerSrc]);

  useEffect(() => {
    if (mediaDevice) {
      mediaDevice.toggle("Video", video);
      mediaDevice.toggle("Audio", audio);
    }
  }, [video, audio]);

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
      <div className="video-div">
        {/* DEFAULT ON THE BELOW */}
        <video
          width="350px"
          height="200px"
          id="peerVideo"
          ref={peerVideo}
          autoPlay
        />
        <canvas
          style={{ visibility: segmentationBoolPeer ? "visible" : "hidden" }}
          width="350px"
          height="200px"
          id="peerCanvas"
          ref={peerCanvas}
        />
        <video
          width="350px"
          height="200px"
          id="localVideo"
          ref={localVideo}
          autoPlay
        />
        <canvas
          style={{ visibility: segmentationBoolLocal ? "visible" : "hidden" }}
          width="350px"
          height="200px"
          id="localCanvas"
          ref={localCanvas}
        />

        {showSetting && (
          <SettingWindow
            show={showSetting}
            showModal={showModal}
            detectionBool={detectionBool}
            setDetectionBool={setDetectionBool}
            segmentationBool={
              callFrom === "" ? segmentationBoolLocal : segmentationBoolPeer
            }
            setSegmentationBool={
              callFrom === ""
                ? setSegmentationBoolLocal
                : setSegmentationBoolPeer
            }
            who={callFrom === "" ? "local" : "peer"}
            detectBody={detectBody}
            detectObj={detectObj}
          />
        )}
      </div>
      <div className="video-control">
        <button
          key="btnVideo"
          type="button"
          className={getButtonClass("fa-video-camera", video)}
          onClick={() => {
            toggleMediaDevice("video");
            detectObj();
          }}
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
  callFrom: PropTypes.string,
  config: PropTypes.shape({
    audio: PropTypes.bool.isRequired,
    video: PropTypes.bool.isRequired,
  }).isRequired,
  mediaDevice: PropTypes.object, // eslint-disable-line
  endCall: PropTypes.func.isRequired,
};

export default CallWindow;
