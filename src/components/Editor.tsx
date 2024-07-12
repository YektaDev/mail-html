import React, { useEffect, useState } from "react";
import * as yekaEmailHtmlLib from "yeka-email-html";
import "highlight.js/styles/atom-one-dark.min.css";
import hljs from "highlight.js";
import { GitHubIcon } from "./GitHubIcon.tsx";
import { Logo } from "./Logo.tsx";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableItem from "./DraggableItem";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-css";
import "ace-builds/src-noconflict/theme-one_dark";
import "ace-builds/src-noconflict/ext-language_tools";

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
      <pre className="block size-full min-h-screen bg-primary-200 p-4 text-sm lg:max-h-screen">
        <code className="size-full whitespace-pre text-wrap rounded-xl border border-primary-800">
          {emailHtmlContent}
        </code>
      </pre>
    );

  return <iframe id="preview" className="size-full min-h-screen" srcDoc={emailHtmlContent} />;
};

const buttonIconClasses = "-ms-1 -mt-0.5 me-1 inline size-5";

const ViewSwitchButton = ({ viewCode, setViewCode }: { viewCode: boolean; setViewCode: any }) => {
  return (
    <button
      onClick={() => setViewCode((prevViewCode: boolean) => !prevViewCode)}
      className="rounded bg-primary-500 px-4 py-2 text-white hover:bg-primary-600"
      dangerouslySetInnerHTML={
        viewCode
          ? {
              __html:
                `<svg aria-hidden="true" class="${buttonIconClasses}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" fill-rule="evenodd" d="M2 2h12l1 1v10l-1 1H2l-1-1V3zm0 11h12V3H2zm11-9H3v3h10zm-1 2H4V5h8zm-3 6h4V8H9zm1-3h2v2h-2zM7 8H3v1h4zm-4 3h4v1H3z" clip-rule="evenodd"/></svg>` +
                "View Preview",
            }
          : {
              __html:
                `<svg aria-hidden="true" class="${buttonIconClasses}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="m12.89 3l1.96.4L11.11 21l-1.96-.4zm6.7 9L16 8.41V5.58L22.42 12L16 18.41v-2.83zM1.58 12L8 5.58v2.83L4.41 12L8 15.58v2.83z"/></svg>` +
                "View Code",
            }
      }
    ></button>
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
      dangerouslySetInnerHTML={
        confirm
          ? {
              __html: "Are you sure?",
            }
          : {
              __html:
                `<svg aria-hidden="true" class="${buttonIconClasses}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M2 12c0 5.523 4.477 10 10 10s10-4.477 10-10S17.523 2 12 2v2a8 8 0 1 1-5.135 1.865L9 8V2H3l2.446 2.447A9.98 9.98 0 0 0 2 12"/></svg>` +
                "Reset",
            }
      }
    />
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
        className={buttonIconClasses}
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

  const moveItem = (fromIndex: number, toIndex: number) => {
    const updatedFunctions = [...bodyFunctions];
    const [movedItem] = updatedFunctions.splice(fromIndex, 1);
    updatedFunctions.splice(toIndex, 0, movedItem);
    setBodyFunctions(updatedFunctions);
  };

  const deleteItem = (index: number) => {
    const updatedFunctions = bodyFunctions.filter((_, i) => i !== index);
    setBodyFunctions(updatedFunctions);
  };

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
      <div className="z-10 flex flex-col bg-primary-50 p-6 shadow shadow-primary-300 lg:max-h-screen lg:min-h-screen lg:overflow-y-auto">
        <header className="mb-4 flex items-center text-primary-900">
          <Logo className="me-4 inline size-16" />
          <div className="flex flex-col font-bold">
            <h1 className="text-2xl">Mail HTML</h1>
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
          <h2 className="mb-2 text-xl font-semibold text-primary-900">Content</h2>
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
            title={"Image"}
            onClick={() =>
              addFunction(setBodyFunctions, {
                type: "img",
                src: "",
                alt: "",
                width: "100px",
                height: "100px",
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
          <DndProvider backend={HTML5Backend}>
            <div className="my-2 min-h-60 space-y-2 rounded border border-dashed border-primary-500 bg-white p-4">
              {bodyFunctions.map((func, index) => (
                <DraggableItem
                  key={index}
                  index={index}
                  item={func}
                  moveItem={moveItem}
                  deleteItem={deleteItem}
                />
              ))}
            </div>
          </DndProvider>
          <label className="mt-6 block text-sm font-medium text-primary-700">
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

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-primary-900">Footer</h2>
          <div className="mb-4">
            <h3 className="mb-2 font-semibold text-primary-800">Top Row</h3>
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
          <div className="mb-4">
            <h3 className="mb-2 font-semibold text-primary-800">Bottom Row</h3>
            <AddButton
              title={"Raw HTML"}
              onClick={() =>
                addFunction(setFooterBottomRowFunctions, {
                  type: "raw",
                  html: "<div>Top Row Content</div>",
                })
              }
            />
            <AddButton
              title={"Primary Button"}
              onClick={() =>
                addFunction(setFooterBottomRowFunctions, {
                  type: "primaryButton",
                  label: "Click Me",
                  href: "https://example.com",
                })
              }
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            Extra CSS Style:{" "}
            <span className={"relative -top-1 ms-2 text-xs opacity-50"}>(Advanced - Optional)</span>
            <AceEditor
              name="extraStyle"
              mode="css"
              theme="one_dark"
              width="100%"
              enableBasicAutocompletion={true}
              minLines={3}
              maxLines={25}
              value={extraStyle}
              onChange={e => setExtraStyle(e)}
              editorProps={{ $blockScrolling: true }}
              className="mt-1 rounded border border-primary-300"
              placeholder={
                "Example:\nhr, .content > table { background: #cfe; border-color: #8ba; }"
              }
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
      <div
        aria-hidden={true}
        className="bg-primary-300 py-2 text-center font-light text-primary-800 drop-shadow lg:hidden"
      >
        <span className="me-4 font-black text-primary-500">↓</span>Live Output
        <span className="ms-4 font-black text-primary-500">↓</span>
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
