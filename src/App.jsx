import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import QRCodeScanner from "./components/QRCodeScanner";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <QRCodeScanner />
    </>
  );
}

export default App;
