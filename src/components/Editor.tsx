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
import "ace-builds/src-noconflict/ext-language_tools";
import { buttonIconClasses, buttonStyle, fieldStyle, outlineButtonStyle } from "./styles.ts";
import ButtonGroup from "./ButtonGroup.tsx";

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

const ViewSwitchButton = ({ viewCode, setViewCode }: { viewCode: boolean; setViewCode: any }) => {
  return (
    <button
      onClick={() => setViewCode((prevViewCode: boolean) => !prevViewCode)}
      className={"px-4 py-2 " + buttonStyle}
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
      className={outlineButtonStyle}
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

const AddButton = ({ onClick, html }: { onClick: any; html: string }) => {
  return (
    <button
      onClick={onClick}
      className={"px-4 py-2 text-start text-sm " + buttonStyle}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

const activeFooterButton: (rowFunctions: any[]) => string = (rowFunctions: any[]) => {
  return rowFunctions.length === 0
    ? "Nothing"
    : rowFunctions[0].type === "raw"
      ? "Text / HTML"
      : rowFunctions[0].type === "img"
        ? "Image"
        : (() => {
            console.error("Unknown top row item type");
            return "Nothing";
          })();
};

const handleFooterButton: (button: string, setFooterRowFunctions: (x: any[]) => void) => void = (
  button: string,
  setFooterRowFunctions: (x: any[]) => void,
) => {
  switch (button) {
    case "Nothing":
      setFooterRowFunctions([]);
      break;
    case "Text / HTML":
      setFooterRowFunctions([
        {
          type: "raw",
          html: "",
        },
      ]);
      break;
    case "Image":
      setFooterRowFunctions([
        {
          type: "img",
          src: "",
          alt: "",
          width: 100,
          height: 100,
        },
      ]);
      break;
    default:
      console.error("Unsupported button type:", button);
  }
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

  const updateItem = (index: number, updatedItem: any) => {
    const updatedFunctions = [...bodyFunctions];
    updatedFunctions[index] = updatedItem;
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
    <main className="flex flex-col lg:flex-row">
      <div className="z-10 flex flex-col bg-primary-50 p-6 shadow shadow-primary-300 lg:max-h-screen lg:min-h-screen lg:max-w-lg lg:overflow-y-auto">
        <header className="mb-4 flex items-center text-primary-900">
          <Logo className="me-4 inline size-16" />
          <div className="flex flex-col font-bold">
            <h1 className="text-2xl">Mail HTML</h1>
            <span className="text-xs opacity-50">
              Make Professional Responsive Emails in Seconds!
            </span>
          </div>
        </header>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            <strong>Title:</strong>
            <span className={"relative -top-1 ms-2 text-xs opacity-50"}>(Invisible)</span>
            <input
              type="text"
              value={title}
              placeholder={"[Suggestion]: The same as the title of the email."}
              onChange={e => setTitle(e.target.value)}
              className={"mt-1 w-full p-2 " + fieldStyle}
            />
          </label>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            <strong>Description Preview:</strong>
            <span className={"relative -top-1 ms-2 text-xs opacity-50"}>(Invisible)</span>
            <input
              type="text"
              value={hiddenPreviewPrefix}
              onChange={e => setHiddenPreviewPrefix(e.target.value)}
              className={"mt-1 w-full p-2 " + fieldStyle}
            />
            <p className="mt-3 text-xs opacity-50">
              In many mail clients, the first few words of the email are shown as a preview. You can
              use this field to add a hidden prefix to the email content to make the preview more
              appealing.
            </p>
          </label>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-primary-900">Content</h2>
          <div className="xs:grid-cols-2 grid gap-1 sm:grid-cols-3 lg:grid-cols-2">
            <AddButton
              html={
                `<svg aria-hidden="true" class="${buttonIconClasses}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill="currentColor" d="M8.5 5v6h2a.5.5 0 1 1 0 1h-5a.5.5 0 1 1 0-1h2V5H5v.5a.5.5 0 0 1-1 0v-1a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 .5.51l-.021 1a.5.5 0 1 1-1-.02l.01-.49zM1 15h1.5a.5.5 0 1 1 0 1h-2a.5.5 0 0 1-.5-.5v-1.996a.5.5 0 0 1 1 0zM1 1v1.497a.5.5 0 1 1-1 0V.5A.5.5 0 0 1 .5 0h2a.5.5 0 0 1 0 1zm14 0h-1.495a.5.5 0 0 1 0-1H15.5a.5.5 0 0 1 .5.5v2a.5.5 0 1 1-1 0zm0 14v-1.5a.5.5 0 1 1 1 0v2a.5.5 0 0 1-.5.5h-2a.5.5 0 1 1 0-1zM0 6.5a.5.5 0 0 1 1 0v3a.5.5 0 0 1-1 0zM9.5 0a.5.5 0 0 1 0 1h-3a.5.5 0 0 1 0-1zM15 6.5a.5.5 0 1 1 1 0v3a.5.5 0 1 1-1 0zM9.5 15a.5.5 0 1 1 0 1h-3a.5.5 0 1 1 0-1z"/></svg>` +
                "Text / HTML"
              }
              onClick={() =>
                addFunction(setBodyFunctions, {
                  type: "raw",
                  html: "",
                })
              }
            />
            <AddButton
              html={
                `<svg aria-hidden="true" class="${buttonIconClasses}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path fill="currentColor" d="M2 5v22h28V5zm2 2h24v13.906l-5.281-5.312l-.719-.719l-4.531 4.531l-5.75-5.812l-.719-.719l-7 7zm20 2a1.999 1.999 0 1 0 0 4a1.999 1.999 0 1 0 0-4m-13 6.719L20.188 25H4v-2.281zm11 2l6 6V25h-4.969l-4.156-4.188z"/></svg>` +
                "Image"
              }
              onClick={() =>
                addFunction(setBodyFunctions, {
                  type: "img",
                  src: "",
                  alt: "",
                  width: "",
                  height: "",
                })
              }
            />
            <AddButton
              html={
                `<svg aria-hidden="true" class="${buttonIconClasses}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17V7h18v10zm4.558-2.5h.884v-2.058H10.5v-.884H8.442V9.5h-.884v2.058H5.5v.884h2.058z"/></svg>` +
                "Primary Button"
              }
              onClick={() =>
                addFunction(setBodyFunctions, {
                  type: "primaryButton",
                  label: "",
                  href: "",
                })
              }
            />
            <AddButton
              html={
                `<svg aria-hidden="true" class="${buttonIconClasses}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="currentColor" d="M3 17V7h18v10zm1-1h16V8H4zm3.558-1.5h.884v-2.058H10.5v-.884H8.442V9.5h-.884v2.058H5.5v.884h2.058zM4 16V8z"/></svg>` +
                "Secondary Button"
              }
              onClick={() =>
                addFunction(setBodyFunctions, {
                  type: "secondaryButton",
                  label: "",
                  href: "",
                })
              }
            />
          </div>
          <DndProvider backend={HTML5Backend}>
            <div className="xs:mx-0 -mx-4 my-2 min-h-60 space-y-2 rounded border border-dashed border-primary-500 bg-white p-4">
              {bodyFunctions.map((func, index) => (
                <DraggableItem
                  key={index}
                  index={index}
                  item={func}
                  moveItem={moveItem}
                  deleteItem={deleteItem}
                  updateItem={updateItem}
                />
              ))}
            </div>
          </DndProvider>
          <label className="mt-6 block text-sm font-medium text-primary-700">
            <strong>Footnote:</strong>
            <input
              type="text"
              value={receiveReason}
              placeholder={"[Suggestion]: Mention the reason for receiving the email."}
              onChange={e => setReceiveReason(e.target.value)}
              className={"mt-1 w-full p-2 " + fieldStyle}
            />
            <p className="mt-3 text-xs opacity-50">
              E.g., You received this email because you requested to sign up for our service. If you
              did not make this request, you can safely ignore this email. No account will be
              created without verification.
            </p>
          </label>
        </div>

        <div className="mb-6">
          <h2 className="mb-2 text-xl font-semibold text-primary-900">Footer</h2>
          <div className="mb-4 flex items-center">
            <h3 className="me-4 font-semibold text-primary-800">Top Row</h3>
            <ButtonGroup
              buttons={["Nothing", "Text / HTML", "Image"]}
              activeButton={activeFooterButton(footerTopRowFunctions)}
              handleButtonClick={(button: string) => {
                handleFooterButton(button, setFooterTopRowFunctions);
              }}
            />
          </div>
          <div className="mb-4 flex items-center">
            <h3 className="me-4 font-semibold text-primary-800">Bottom Row</h3>
            <ButtonGroup
              buttons={["Nothing", "Text / HTML", "Image"]}
              activeButton={activeFooterButton(footerBottomRowFunctions)}
              handleButtonClick={(button: string) => {
                handleFooterButton(button, setFooterBottomRowFunctions);
              }}
            />
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-sm font-medium text-primary-700">
            <strong>Extra CSS Style:</strong>
            <span className={"relative -top-1 ms-2 text-xs opacity-50"}>(Advanced - Optional)</span>
            <AceEditor
              name="extraStyle"
              mode="css"
              width="100%"
              enableBasicAutocompletion={true}
              minLines={3}
              maxLines={25}
              value={extraStyle}
              onChange={e => setExtraStyle(e)}
              editorProps={{ $blockScrolling: true }}
              className={"mt-1 " + fieldStyle}
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
    </main>
  );
};

export default App;
