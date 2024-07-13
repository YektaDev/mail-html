import React, { useState } from "react";
import { buttonStyle, outlineButtonStyle } from "./styles.ts";

const activeStyle = "px-4 py-2 " + buttonStyle;
const inactiveStyle = "px-4 py-2 " + outlineButtonStyle;
const ButtonGroup: React.FC = () => {
  const [activeButton, setActiveButton] = useState("Nothing");

  const handleButtonClick = (buttonName: string) => {
    setActiveButton(buttonName);
  };

  return (
    <div className="flex gap-2 text-xs">
      <button
        className={activeButton === "Nothing" ? activeStyle : inactiveStyle}
        onClick={() => handleButtonClick("Nothing")}
      >
        Nothing
      </button>
      <button
        className={activeButton === "Text/HTML" ? activeStyle : inactiveStyle}
        onClick={() => handleButtonClick("Text/HTML")}
      >
        Text / HTML
      </button>
      <button
        className={activeButton === "Image" ? activeStyle : inactiveStyle}
        onClick={() => handleButtonClick("Image")}
      >
        Image
      </button>
    </div>
  );
};

export default ButtonGroup;
