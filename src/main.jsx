import ReactDOM from "react-dom/client";
import "mapbox-gl/dist/mapbox-gl.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
// import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
);
