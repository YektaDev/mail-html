import React, { useEffect, useState } from "react";
import * as yekaEmailHtmlLib from "yeka-email-html";
import "highlight.js/styles/kimbie-dark.min.css";
import hljs from "highlight.js";

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
  viewCode: boolean;
}

const Output: React.FC<EmailHtmlGeneratorProps> = ({
  title,
  receiveReason,
  hiddenPreviewPrefix,
  extraStyle,
  footerTopRow,
  footerBottomRow,
  body,
  viewCode,
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

  if (viewCode)
    return (
      <pre className="bg-primary-200 block size-full min-h-screen p-4 text-sm">
        <code className="border-primary-800 size-full whitespace-pre text-wrap rounded-xl border">
          {emailHtmlContent}
        </code>
      </pre>
    );

  return <iframe id="preview" className="size-full min-h-screen" srcDoc={emailHtmlContent} />;
};

const ViewSwitchButton = ({ viewCode, setViewCode }: { viewCode: boolean; setViewCode: any }) => {
  return (
    <button
      onClick={() => setViewCode(prevViewCode => !prevViewCode)}
      className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-white"
    >
      {viewCode ? "View Preview" : "View Code"}
    </button>
  );
};

const ClearButton = ({ onConfirm }: { onConfirm: any }) => {
  const [confirm, setConfirm] = useState(false);

  useEffect(() => {
    if (confirm) {
      const timeout = setTimeout(() => {
        setConfirm(false);
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [confirm]);

  return (
    <button
      onClick={() => {
        if (confirm) {
          onConfirm();
          setConfirm(false);
        } else {
          setConfirm(true);
        }
      }}
      className="hover:outline-primary-700 bg-primary-100 hover:bg-primary-200 hover:text-primary-700 outline-primary-500 text-primary-500 rounded px-4 py-2 outline"
    >
      {confirm ? "Are you sure?" : "Reset"}
    </button>
  );
};

const App: React.FC = () => {
  const [viewCode, setViewCode] = useState(false);
  useEffect(() => {
    hljs.highlightAll();
  }, [viewCode]);

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
    <div className="flex flex-col lg:flex-row">
      <div className="bg-primary-50 shadow-primary-300 z-10 min-h-screen p-6 shadow">
        <h1 className="text-primary-900 mb-4 text-2xl font-bold">Email HTML Generator</h1>

        <div className="mb-4">
          <label className="text-primary-700 mb-2 block text-sm font-medium">
            Title:
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              className="border-primary-300 mt-1 w-full rounded border p-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="text-primary-700 mb-2 block text-sm font-medium">
            Receive Reason:
            <input
              type="text"
              value={receiveReason}
              onChange={e => setReceiveReason(e.target.value)}
              className="border-primary-300 mt-1 w-full rounded border p-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="text-primary-700 mb-2 block text-sm font-medium">
            Hidden Preview Prefix:
            <input
              type="text"
              value={hiddenPreviewPrefix}
              onChange={e => setHiddenPreviewPrefix(e.target.value)}
              className="border-primary-300 mt-1 w-full rounded border p-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="text-primary-700 mb-2 block text-sm font-medium">
            Extra Style:
            <input
              type="text"
              value={extraStyle}
              onChange={e => setExtraStyle(e.target.value)}
              className="border-primary-300 mt-1 w-full rounded border p-2"
            />
          </label>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Configure Footer Top Row</h2>
          <button
            onClick={() =>
              addFunction(setFooterTopRowFunctions, {
                type: "raw",
                html: "<div>Top Row Content</div>",
              })
            }
            className="bg-primary-500 hover:bg-primary-600 mr-2 rounded px-4 py-2 text-white"
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
            className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-white"
          >
            Add Primary Button
          </button>
          {/* Add more buttons for other types as needed */}
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Configure Footer Bottom Row</h2>
          <button
            onClick={() =>
              addFunction(setFooterBottomRowFunctions, {
                type: "raw",
                html: "<div>Bottom Row Content</div>",
              })
            }
            className="bg-primary-500 hover:bg-primary-600 mr-2 rounded px-4 py-2 text-white"
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
            className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-white"
          >
            Add Primary Button
          </button>
          {/* Add more buttons for other types as needed */}
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Configure Body Content</h2>
          <button
            onClick={() =>
              addFunction(setBodyFunctions, { type: "raw", html: "<div>Some Sample Content</div>" })
            }
            className="bg-primary-500 hover:bg-primary-600 mr-2 rounded px-4 py-2 text-white"
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
            className="bg-primary-500 hover:bg-primary-600 rounded px-4 py-2 text-white"
          >
            Add Primary Button
          </button>
          {/* Add more buttons for other types as needed */}
        </div>

        <div className="mb-6 flex justify-between">
          <ClearButton
            onConfirm={() => {
              setTitle("Title");
              setReceiveReason("Receive Reason");
              setHiddenPreviewPrefix("Hidden Preview Prefix");
              setExtraStyle("Extra Style");
              setFooterTopRowFunctions([]);
              setFooterBottomRowFunctions([]);
              setBodyFunctions([]);
            }}
          />
          <ViewSwitchButton viewCode={viewCode} setViewCode={setViewCode} />
        </div>
      </div>
      <div className="flex flex-1 items-stretch justify-stretch lg:min-h-screen">
        <Output
          title={title}
          receiveReason={receiveReason}
          hiddenPreviewPrefix={hiddenPreviewPrefix}
          extraStyle={extraStyle}
          footerTopRow={footerTopRow}
          footerBottomRow={footerBottomRow}
          body={body}
          viewCode={viewCode}
        />
      </div>
    </div>
  );
};

export default App;
