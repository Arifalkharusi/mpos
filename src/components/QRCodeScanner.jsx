import React, { useRef, useState, useEffect } from "react";
import Quagga from "quagga";

const QRCodeScanner = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment", // or "user" for front camera
          },
          target: videoRef.current,
        },
        locator: {
          patchSize: "medium",
          halfSample: true,
        },
        numOfWorkers: navigator.hardwareConcurrency || 4,
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_128_reader",
            "code_39_reader",
            "code_39_vin_reader",
            "codabar_reader",
            "upc_reader",
            "upc_e_reader",
            "i2of5_reader",
            "2of5_reader",
            "code_93_reader",
          ],
          multiple: false,
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          return;
        }
        setScanning(true);
        Quagga.start();
      }
    );

    Quagga.onDetected(handleDetected);

    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, []);

  const handleDetected = (result) => {
    if (result.boxes && result.boxes.length > 0) {
      // Check if the barcode is fully within the scanning area
      const isFullyVisible = result.boxes.every(
        (box) => box[0] > 0 && box[0] < 640 && box[1] > 0 && box[1] < 480
      );

      if (isFullyVisible) {
        Quagga.stop();
        setScanning(false);
        setBarcode(result.codeResult.code);
      }
    }
  };

  const restartScanning = () => {
    setBarcode("");
    setScanning(true);
    Quagga.start();
  };

  return (
    <div>
      <div ref={videoRef} style={{ display: scanning ? "block" : "none" }} />
      {scanning ? (
        <p>Scanning... Please ensure the entire barcode is visible.</p>
      ) : (
        <>
          <p>Scanned Barcode: {barcode}</p>
          <button onClick={restartScanning}>Scan Another</button>
        </>
      )}
    </div>
  );
};

export default QRCodeScanner;
