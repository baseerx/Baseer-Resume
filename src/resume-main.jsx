import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ResumeDoc } from "./resume/ResumeDoc";
import "./resume/resume.css";

createRoot(document.getElementById("resume")).render(
  <StrictMode>
    <ResumeDoc />
  </StrictMode>,
);
