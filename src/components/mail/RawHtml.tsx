import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/ext-language_tools";
import fieldStyle from "../fieldStyle.ts";

const RawHtml = ({ html, onChange }) => {
  return (
    <AceEditor
      mode="html"
      width="100%"
      enableBasicAutocompletion={true}
      minLines={3}
      maxLines={10}
      value={html}
      onChange={e => onChange(e)}
      wrapEnabled={true}
      editorProps={{ $blockScrolling: true }}
      className={"h-fit max-h-fit " + fieldStyle}
      placeholder="HTML / Text"
    />
  );
};

export default RawHtml;
