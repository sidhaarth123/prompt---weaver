import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
// Build verification - FORCE NEW BUNDLE HASH
console.log("%c PROMPT WEAVER BUILD: " + new Date().toISOString(), "background: #222; color: #bada55; font-size: 20px");
console.log("PRICING SOURCE: src/config/pricing.ts");

// EMERGENCY CACHE BUSTING: Unregister any service workers
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(function (registrations) {
        for (let registration of registrations) {
            registration.unregister();
            console.log('Service Worker Unregistered');
        }
    });
}

// Clear caches to force fresh fetch
if ('caches' in window) {
    caches.keys().then((names) => {
        names.forEach((name) => {
            caches.delete(name);
            console.log('Cache Deleted:', name);
        });
    });
}

createRoot(document.getElementById("root")!).render(<App />);
