import React, { useEffect, useState } from "react";
import * as yekaEmailHtmlLib from "yeka-email-html";
import "highlight.js/styles/atom-one-dark.min.css";
import hljs from "highlight.js";
import { GitHubIcon } from "./GitHubIcon.tsx";
import { Logo } from "./Logo.tsx";

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
  setViewCode: (viewCode: boolean) => void;
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
  setViewCode,
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

  useEffect(() => {
    setViewCode(false);
  }, [emailHtmlContent]);

  if (viewCode)
    return (
      <pre className="block size-full min-h-screen bg-primary-200 p-4 text-sm">
        <code className="size-full whitespace-pre text-wrap rounded-xl border border-primary-800">
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
      className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
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
      className="rounded bg-primary-100 px-4 py-2 text-primary-500 outline outline-primary-500 hover:bg-primary-200 hover:text-primary-700 hover:outline-primary-700"
    >
      {confirm ? "Are you sure?" : "Reset"}
    </button>
  );
};

const AddButton = ({ onClick, title }: { onClick: any; title: string }) => {
  return (
    <button
      onClick={onClick}
      className="mr-2 rounded bg-primary-500 px-3 py-2 text-sm text-white hover:bg-primary-600"
    >
      <svg
        aria-hidden={true}
        className="-ms-1 -mt-0.5 me-1 inline size-5"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
      >
        <path fill="currentColor" d="M19 12.998h-6v6h-2v-6H5v-2h6v-6h2v6h6z"></path>
      </svg>
      {title}
    </button>
  );
};

const App: React.FC = () => {
  const [viewCode, setViewCode] = useState(false);
  useEffect(() => {
    hljs.highlightAll();
  }, [viewCode]);

  const [title, setTitle] = useState("");
  const [receiveReason, setReceiveReason] = useState("");
  const [hiddenPreviewPrefix, setHiddenPreviewPrefix] = useState("");
  const [extraStyle, setExtraStyle] = useState("");

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
      <div className="z-10 flex flex-col bg-primary-50 p-6 shadow shadow-primary-300 lg:min-h-screen">
        <header className="mb-4 flex items-center text-primary-900">
          <Logo className="me-4 inline size-16" />
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">Mail HTML</h1>
            <span className="text-xs opacity-50">
              Make a Professional Responsive Email in Seconds!
            </span>
          </div>
        </header>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            Title:
            <span className={"relative -top-1 ms-2 text-xs opacity-50"}>(Invisible)</span>
            <input
              type="text"
              value={title}
              placeholder={"[Suggestion]: The same as the title of the email."}
              onChange={e => setTitle(e.target.value)}
              className="mt-1 w-full rounded border border-primary-300 p-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            Hidden Preview Prefix:
            <input
              type="text"
              value={hiddenPreviewPrefix}
              onChange={e => setHiddenPreviewPrefix(e.target.value)}
              className="mt-1 w-full rounded border border-primary-300 p-2"
            />
          </label>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Content</h2>
          <AddButton
            title={"Raw HTML"}
            onClick={() =>
              addFunction(setBodyFunctions, {
                type: "raw",
                html: "<div>Top Row Content</div>",
              })
            }
          />
          <AddButton
            title={"Primary Button"}
            onClick={() =>
              addFunction(setBodyFunctions, {
                type: "primaryButton",
                label: "Click Me",
                href: "https://example.com",
              })
            }
          />
          <AddButton
            title="Secondary Button"
            onClick={() =>
              addFunction(setBodyFunctions, {
                type: "secondaryButton",
                label: "Click Me",
                href: "https://example.com",
              })
            }
          />
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Footer - Top Row</h2>
          <AddButton
            title={"Raw HTML"}
            onClick={() =>
              addFunction(setFooterTopRowFunctions, {
                type: "raw",
                html: "<div>Top Row Content</div>",
              })
            }
          />
          <AddButton
            title={"Primary Button"}
            onClick={() =>
              addFunction(setFooterTopRowFunctions, {
                type: "primaryButton",
                label: "Click Me",
                href: "https://example.com",
              })
            }
          />
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold">Footer - Bottom Row</h2>
          <button
            onClick={() =>
              addFunction(setFooterBottomRowFunctions, {
                type: "raw",
                html: "<div>Bottom Row Content</div>",
              })
            }
            className="mr-2 rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
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
            className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
          >
            Add Primary Button
          </button>
          {/* Add more buttons for other types as needed */}
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            Receive Reason:
            <input
              type="text"
              value={receiveReason}
              placeholder={
                "E.g., You received this email because you requested to sign up for our service. If you did not make this request, you can safely ignore this email. No account will be created without verification."
              }
              onChange={e => setReceiveReason(e.target.value)}
              className="mt-1 w-full rounded border border-primary-300 p-2"
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            Extra CSS Style:{" "}
            <span className={"relative -top-1 ms-2 text-xs opacity-50"}>(Advanced)</span>
            <input
              type="text"
              value={extraStyle}
              placeholder={"Optional"}
              onChange={e => setExtraStyle(e.target.value)}
              className="mt-1 w-full rounded border border-primary-300 p-2"
            />
          </label>
        </div>

        <div className="mb-6 mt-10 flex justify-between">
          <ClearButton
            onConfirm={() => {
              setTitle("");
              setReceiveReason("");
              setHiddenPreviewPrefix("");
              setExtraStyle("");
              setFooterTopRowFunctions([]);
              setFooterBottomRowFunctions([]);
              setBodyFunctions([]);
              setViewCode(false);
            }}
          />
          <ViewSwitchButton viewCode={viewCode} setViewCode={setViewCode} />
        </div>
        <div aria-hidden={true} className="flex-1"></div>
        <div className="text-primary-800">
          <a
            className="hover:text-primary-600"
            href="https://github.com/YektaDev/mail-html"
            target="_blank"
            title="GitHub Repository"
          >
            <GitHubIcon className="inline h-10" aria-hidden={true}></GitHubIcon>
          </a>
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
          setViewCode={setViewCode}
        />
      </div>
    </div>
  );
};

export default App;
