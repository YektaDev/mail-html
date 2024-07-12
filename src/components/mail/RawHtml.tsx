import React from "react";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-language_tools";

const RawHtml = ({ html, onChange }) => {
  return (
    <AceEditor
      mode="html"
      theme="one_dark"
      width="100%"
      enableBasicAutocompletion={true}
      minLines={3}
      maxLines={10}
      value={html}
      onChange={e => onChange(e)}
      wrapEnabled={true}
      editorProps={{ $blockScrolling: true }}
      className="h-fit max-h-fit rounded border border-primary-300"
      placeholder="HTML / Text"
    />
  );
};

export default RawHtml;
