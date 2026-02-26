import React from "react";
import "./Intro.css";

export default function IntroProgress({ step }) {
  return (
    <div className="intro-progress">
      <div className={step === 1 ? "dot active" : "dot"} />
      <div className={step === 2 ? "dot active" : "dot"} />
      <div className={step === 3 ? "dot active" : "dot"} />
    </div>
  );
}