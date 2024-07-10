import React, { useState } from "react";
import * as yekaEmailHtmlLib from "yeka-email-html";

const { emailHtml } = yekaEmailHtmlLib.dev.yekta.yeka.email.html;

type EmailHtmlWriterScope = {
  escape: (_this_: string) => string;
  img: (src: string, alt: string, width: number, height: number) => void;
  primaryButton: (label: string, href: string, inNewTab?: boolean) => void;
  secondaryButton: (label: string, href: string, inNewTab?: boolean) => void;
  raw: (html: string) => void;
};

interface EmailHtmlGeneratorProps {
  title: string;
  receiveReason: string;
  hiddenPreviewPrefix: string;
  extraStyle: string;
  footerTopRow: (x: EmailHtmlWriterScope) => void;
  footerBottomRow: (x: EmailHtmlWriterScope) => void;
  body: (x: EmailHtmlWriterScope) => void;
}

const EmailHtmlGenerator: React.FC<EmailHtmlGeneratorProps> = ({
  title,
  receiveReason,
  hiddenPreviewPrefix,
  extraStyle,
  footerTopRow,
  footerBottomRow,
  body,
}) => {
  const emailHtmlContent = emailHtml(
    title,
    receiveReason,
    hiddenPreviewPrefix,
    footerTopRow,
    footerBottomRow,
    extraStyle,
    body,
  );

  return (
    <iframe id="preview" srcDoc={emailHtmlContent} style={{ width: "100%", height: "100%" }} />
  );
};

const App: React.FC = () => {
  const [title, setTitle] = useState("Title");
  const [receiveReason, setReceiveReason] = useState("Receive Reason");
  const [hiddenPreviewPrefix, setHiddenPreviewPrefix] = useState("Hidden Preview Prefix");
  const [extraStyle, setExtraStyle] = useState("Extra Style");

  const [footerTopRowFunctions, setFooterTopRowFunctions] = useState<any[]>([]);
  const [footerBottomRowFunctions, setFooterBottomRowFunctions] = useState<any[]>([]);
  const [bodyFunctions, setBodyFunctions] = useState<any[]>([]);

  const applyFunctions = (functions: any[], scope: EmailHtmlWriterScope) => {
    functions.forEach(func => {
      switch (func.type) {
        case "escape":
          scope.escape(func.value);
          break;
        case "img":
          scope.img(func.src, func.alt, func.width, func.height);
          break;
        case "primaryButton":
          scope.primaryButton(func.label, func.href, func.inNewTab);
          break;
        case "secondaryButton":
          scope.secondaryButton(func.label, func.href, func.inNewTab);
          break;
        case "raw":
          scope.raw(func.html);
          break;
        default:
          break;
      }
    });
  };

  const footerTopRow = (x: EmailHtmlWriterScope) => {
    applyFunctions(footerTopRowFunctions, x);
  };

  const footerBottomRow = (x: EmailHtmlWriterScope) => {
    applyFunctions(footerBottomRowFunctions, x);
  };

  const body = (x: EmailHtmlWriterScope) => {
    applyFunctions(bodyFunctions, x);
  };

  const addFunction = (setFunctions: React.Dispatch<React.SetStateAction<any[]>>, func: any) => {
    setFunctions(prevFunctions => [...prevFunctions, func]);
  };

  return (
    <div>
      <h1>Email HTML Generator</h1>
      <div>
        <label>
          Title:
          <input type="text" value={title} onChange={e => setTitle(e.target.value)} />
        </label>
      </div>
      <div>
        <label>
          Receive Reason:
          <input
            type="text"
            value={receiveReason}
            onChange={e => setReceiveReason(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Hidden Preview Prefix:
          <input
            type="text"
            value={hiddenPreviewPrefix}
            onChange={e => setHiddenPreviewPrefix(e.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          Extra Style:
          <input type="text" value={extraStyle} onChange={e => setExtraStyle(e.target.value)} />
        </label>
      </div>

      <div>
        <h2>Configure Footer Top Row</h2>
        <button
          onClick={() =>
            addFunction(setFooterTopRowFunctions, {
              type: "raw",
              html: "<div>Top Row Content</div>",
            })
          }
        >
          Add Raw HTML
        </button>
        <button
          onClick={() =>
            addFunction(setFooterTopRowFunctions, {
              type: "primaryButton",
              label: "Click Me",
              href: "https://example.com",
            })
          }
        >
          Add Primary Button
        </button>
      </div>

      <div>
        <h2>Configure Footer Bottom Row</h2>
        <button
          onClick={() =>
            addFunction(setFooterBottomRowFunctions, {
              type: "raw",
              html: "<div>Bottom Row Content</div>",
            })
          }
        >
          Add Raw HTML
        </button>
        <button
          onClick={() =>
            addFunction(setFooterBottomRowFunctions, {
              type: "primaryButton",
              label: "Click Me",
              href: "https://example.com",
            })
          }
        >
          Add Primary Button
        </button>
      </div>

      <div>
        <h2>Configure Body Content</h2>
        <button
          onClick={() =>
            addFunction(setBodyFunctions, { type: "raw", html: "<div>Some Sample Content</div>" })
          }
        >
          Add Raw HTML
        </button>
        <button
          onClick={() =>
            addFunction(setBodyFunctions, {
              type: "primaryButton",
              label: "Sample Label",
              href: "https://sample.url",
            })
          }
        >
          Add Primary Button
        </button>
      </div>

      <EmailHtmlGenerator
        title={title}
        receiveReason={receiveReason}
        hiddenPreviewPrefix={hiddenPreviewPrefix}
        extraStyle={extraStyle}
        footerTopRow={footerTopRow}
        footerBottomRow={footerBottomRow}
        body={body}
      />
    </div>
  );
};

export default App;
