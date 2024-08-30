import React, { useState } from "react";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
// import { Plugins } from '@capacitor/core';

// const { BarcodeScanner } = Plugins;

const QRCodeScanner = () => {
  const [scanResult, setScanResult] = useState({ content: "", format: "" });
  const [isScanning, setIsScanning] = useState(false);

  const startScan = async () => {
    try {
      const permission = await BarcodeScanner.checkPermission({ force: true });
      if (permission.granted) {
        setIsScanning(true);
        document.querySelector("body").style.background = "transparent";
        BarcodeScanner.hideBackground();

        const result = await BarcodeScanner.startScan({
          targetedFormats: [
            "UPC-A",
            "UPC-E",
            "EAN-13",
            "EAN-8",
            "Code 39",
            "Code 93",
            "Code 128",
            "ITF-14",
            "Codabar",
            "GS1 DataBar",
            "QR Code",
            "Data Matrix",
            "PDF417",
            "Aztec Code",
            "MaxiCode",
            "Micro QR Code",
            "MicroPDF417",
          ],
        });

        if (result.hasContent) {
          setScanResult({ content: result.content, format: result.format });
          setIsScanning(false);
        }
      }
    } catch (error) {
      console.error(error);
      setIsScanning(false);
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
