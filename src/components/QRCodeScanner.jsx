import React, { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, BarcodeFormat } from "@zxing/browser";

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState("");
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserMultiFormatReader()); // Ref to keep the instance

  useEffect(() => {
    // Start the barcode scanner when the component mounts
    const startScanner = async () => {
      try {
        const videoInputDevices =
          await codeReader.current.listVideoInputDevices();

        if (videoInputDevices.length > 0) {
          const selectedDeviceId = videoInputDevices[0].deviceId; // Use the first camera device

          codeReader.current.decodeFromVideoDevice(
            selectedDeviceId,
            videoRef.current,
            (result, err) => {
              if (result) {
                setScanResult(result.getText());
                stopScanner(); // Optionally stop after a successful scan
              }
              if (err && !(err instanceof NotFoundException)) {
                console.error(err);
              }
            }
          );
        }
      } catch (err) {
        console.error("Error initializing barcode scanner: ", err);
      }
    };

    startScanner();

    // Clean up by stopping the scanner when the component unmounts
    return () => {
      stopScanner();
    };
  }, []);

  const stopScanner = () => {
    codeReader.current.reset();
  };

  return (
    <div>
      <h3>Scan a Barcode</h3>
      <video ref={videoRef} style={{ width: "300px", height: "300px" }} />
      {scanResult && <p>Scan Result: {scanResult}</p>}
      <button onClick={stopScanner}>Stop Scanner</button>
    </div>
  );
};

export default QRCodeScanner;
