import React from "react";
import { fieldStyle } from "../styles.ts";

const Button = ({ label, href, inNewTab, onLabelChange, onHrefChange, onInNewTabChange }) => {
  return (
    <div className="flex w-full items-center gap-2 text-xs">
      <input
        className={"flex-2 px-2 py-1 " + fieldStyle}
        value={label}
        onChange={e => onLabelChange(e.target.value)}
        placeholder="Label"
      />
      <input
        className={"flex-1 px-2 py-1 " + fieldStyle}
        value={href}
        onChange={e => onHrefChange(e.target.value)}
        placeholder="URL"
      />
      <label className="me-1 flex items-center gap-1.5">
        <input
          type="checkbox"
          className={
            "h-4 w-4 rounded border-primary-300 bg-white text-primary-600 focus:ring-2 focus:ring-primary-400"
          }
          value={inNewTab}
          onChange={e => onInNewTabChange(e.target.checked)}
        />
        <span className="text-nowrap text-primary-900">New Tab</span>
      </label>
    </div>
  );
};

export default Button;
