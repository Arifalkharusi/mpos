import React, { useRef, useState, useEffect } from "react";
import Quagga from "quagga";

const QRCodeScanner = () => {
  const videoRef = useRef(null);
  const [barcode, setBarcode] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const initQuagga = () => {
    Quagga.init(
      {
        inputStream: {
          type: "LiveStream",
          constraints: {
            width: { min: 640 },
            height: { min: 480 },
            facingMode: "environment",
            aspectRatio: { min: 1, max: 2 },
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
          ],
        },
        locate: true,
      },
      (err) => {
        if (err) {
          console.error("Quagga initialization failed", err);
          setError(`Initialization error: ${err.name} ${err.message}`);
          return;
        }
        console.log("Quagga initialization succeeded");
        setIsInitialized(true);
        setError(null);
      }
    );

    Quagga.onDetected(handleDetected);
  };

  useEffect(() => {
    initQuagga();

    return () => {
      Quagga.offDetected(handleDetected);
      Quagga.stop();
    };
  }, []);

  const handleDetected = (result) => {
    console.log("Barcode detected", result);
    if (result.codeResult.startInfo.error < 0.25) {
      setBarcode(result.codeResult.code);
      setIsScanning(false);
      Quagga.pause();
    }
  };

  const startScanning = () => {
    setIsScanning(true);
    setBarcode("");
    Quagga.start();
  };

  const stopScanning = () => {
    setIsScanning(false);
    Quagga.pause();
  };

  const resetScanner = () => {
    setBarcode("");
    setError(null);
    setIsScanning(false);
    Quagga.stop();
    setTimeout(() => {
      initQuagga();
    }, 100);
  };

  return (
    <div>
      <div
        ref={videoRef}
        style={{ width: "100%", maxWidth: "640px", height: "auto" }}
      >
        {isInitialized && (
          <div
            style={{
              position: "relative",
              width: "100%",
              paddingBottom: "75%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                border: "3px solid red",
              }}
            >
              <p
                style={{
                  background: "rgba(255,255,255,0.7)",
                  padding: "10px",
                  margin: 0,
                }}
              >
                Align barcode within the red box and press the scan button
              </p>
            </div>
          </div>
        )}
      </div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {barcode ? (
        <>
          <p>Scanned Barcode: {barcode}</p>
          <button onClick={resetScanner}>Scan Another</button>
        </>
      ) : (
        <>
          <p>{isInitialized ? "Ready to scan" : "Scanner initializing..."}</p>
          <button
            onMouseDown={startScanning}
            onMouseUp={stopScanning}
            onMouseLeave={stopScanning}
            onTouchStart={startScanning}
            onTouchEnd={stopScanning}
            disabled={!isInitialized}
          >
            {isScanning ? "Scanning..." : "Push to Scan"}
          </button>
        </>
      )}
    </div>
  );
};

export default QRCodeScanner;
