import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";


// Build verification
console.log("BUILD_VERSION:", "pw-" + new Date().toISOString());

createRoot(document.getElementById("root")!).render(<App />);
