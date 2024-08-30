import React, { useState, useEffect } from "react";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState({ content: "", format: "" });
  const [isScanning, setIsScanning] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);

  useEffect(() => {
    const checkInitialPermissions = async () => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        setPermissionGranted(true);
      } else {
        console.log("no permission");
      }
    };
    checkInitialPermissions();
  }, []);

  const requestPermission = async () => {
    try {
      const status = await BarcodeScanner.requestPermissions();
      if (status.camera === "granted") {
        setPermissionGranted(true);
      } else {
        alert("Camera permission is required to scan barcodes.");
      }
    } catch (error) {
      console.error("Permission request failed", error);
    }
  };

  const startScan = async () => {
    if (!permissionGranted) {
      await requestPermission();
    }

    if (!permissionGranted) {
      return; // Exit if permission is not granted
    }

    try {
      setIsScanning(true);
      document.querySelector("body").style.background = "transparent";
      await BarcodeScanner.hideBackground(); // Ensure the call is awaited

      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        setScanResult({ content: result.content, format: result.format });
      }
    } catch (error) {
      console.error("Scan failed", error);
    } finally {
      stopScan(); // Stop scanning properly
    }
  };

  const stopScan = () => {
    BarcodeScanner.stopScan();
    setIsScanning(false);
    document.querySelector("body").style.background = "";
  };

  return (
    <div className="code-scanner">
      {isScanning ? (
        <button onClick={stopScan}>Stop Scan</button>
      ) : (
        <button onClick={startScan}>Start Scan</button>
      )}
      {scanResult.content && (
        <div>
          <p>Scan Result: {scanResult.content}</p>
          <p>Format: {scanResult.format}</p>
        </div>
      )}
    </div>
  );
};

export default QRCodeScanner;
