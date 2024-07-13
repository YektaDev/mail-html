import React from "react";
import { buttonStyle, outlineButtonStyle } from "./styles.ts";

const activeStyle = `px-4 py-2 ${buttonStyle}`;
const inactiveStyle = `px-4 py-2 ${outlineButtonStyle}`;

const ButtonGroup = ({ buttons, activeButton, handleButtonClick }) => {
  return (
    <div className="flex gap-2 text-xs" role="radiogroup">
      {buttons.map((button: string) => (
        <button
          key={button}
          className={button === activeButton ? activeStyle : inactiveStyle}
          onClick={() => handleButtonClick(button)}
        >
          {button}
        </button>
      ))}
    </div>
  );
};

export default ButtonGroup;
