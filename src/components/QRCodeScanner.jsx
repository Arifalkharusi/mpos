import React, { useRef, useState, useEffect } from "react";
import Quagga from "quagga";

const QRCodeScanner = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");

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
        decoder: {
          readers: [
            "ean_reader",
            "ean_8_reader",
            "code_128_reader",
            "code_39_reader",
            "code_39_vin_reader",
          ],
        },
      },
      (err) => {
        if (err) {
          console.error("Error initializing Quagga:", err);
          return;
        }
        Quagga.start();
      }
    );

    Quagga.onDetected((result) => {
      setBarcode(result.codeResult.code);
    });

    return () => {
      Quagga.stop();
    };
  }, []);

  return (
    <div>
      <div ref={videoRef} />
      <p>Scanned Barcode: {barcode}</p>
    </div>
  );
};

export default QRCodeScanner;
