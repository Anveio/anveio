import { cn } from "@/lib/utils";
import * as React from "react";
import { CopyCodeButton } from "./CopyCodeButton";
import { SyntaxHighlightedText } from "./SyntaxHighlightedText";
interface Props {
  filename: string;
  text: string;
  language: "typescript" | "tsx";
}

export const Codeblock = (props: Props) => {
  return (
    <div
      className={cn(
        "wrapper mx-4 rounded-md overflow-hidden border-[1px] border-solid border-zinc-700"
      )}
    >
      <div className="header py-0 px-4 rounded-t-md rounded-b-none border-b-[1px] border-solid border-zinc-700 h-12 items-center flex bg-black ">
        <div className="filename text-zinc-400 border-zinc-700 flex gap-2 text-sm min-w-min mr-auto my-0 ml-0">
          <div
            aria-hidden="true"
            className="file-icon-container w-4 items-center flex flex-shrink-0"
          >
            {FILE_EXTENSION_TO_SVG[getFileExtension(props.filename) ?? "jsx"] ||
              null}
          </div>
          <span className="filename-label inline-block overflow-hidden text-ellipsis whitespace-nowrap max-w-full min-w-0">
            {props.filename}
          </span>
        </div>
        <div className="code-block-actions flex gap-1">
          <CopyCodeButton {...props} />
        </div>
      </div>
      <div className="py-5 bg-zinc-900">
        <React.Suspense>
          <SyntaxHighlightedText text={props.text} language={props.language} />
        </React.Suspense>
      </div>
    </div>
  );
};

function getFileExtension(filename: string): string | null {
  const dotIndex = filename.lastIndexOf(".");

  if (dotIndex === -1 || dotIndex === 0 || dotIndex === filename.length - 1) {
    throw new Error("No parseable file extension");
  }

  return filename.substring(dotIndex + 1);
}

const FILE_EXTENSION_TO_SVG = {
  jsx: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <title>file_type_reactjs</title>
      <circle cx="16" cy="15.974" r="2.5" style={{ fill: "#00d8ff" }} />
      <path
        d="M16,21.706a28.385,28.385,0,0,1-8.88-1.2,11.3,11.3,0,0,1-3.657-1.958A3.543,3.543,0,0,1,2,15.974c0-1.653,1.816-3.273,4.858-4.333A28.755,28.755,0,0,1,16,10.293a28.674,28.674,0,0,1,9.022,1.324,11.376,11.376,0,0,1,3.538,1.866A3.391,3.391,0,0,1,30,15.974c0,1.718-2.03,3.459-5.3,4.541A28.8,28.8,0,0,1,16,21.706Zm0-10.217a27.948,27.948,0,0,0-8.749,1.282c-2.8.977-4.055,2.313-4.055,3.2,0,.928,1.349,2.387,4.311,3.4A27.21,27.21,0,0,0,16,20.51a27.6,27.6,0,0,0,8.325-1.13C27.4,18.361,28.8,16.9,28.8,15.974a2.327,2.327,0,0,0-1.01-1.573,10.194,10.194,0,0,0-3.161-1.654A27.462,27.462,0,0,0,16,11.489Z"
        style={{ fill: "#00d8ff" }}
      />
      <path
        d="M10.32,28.443a2.639,2.639,0,0,1-1.336-.328c-1.432-.826-1.928-3.208-1.327-6.373a28.755,28.755,0,0,1,3.4-8.593h0A28.676,28.676,0,0,1,16.71,5.995a11.376,11.376,0,0,1,3.384-2.133,3.391,3.391,0,0,1,2.878,0c1.489.858,1.982,3.486,1.287,6.859a28.806,28.806,0,0,1-3.316,8.133,28.385,28.385,0,0,1-5.476,7.093,11.3,11.3,0,0,1-3.523,2.189A4.926,4.926,0,0,1,10.32,28.443Zm1.773-14.7a27.948,27.948,0,0,0-3.26,8.219c-.553,2.915-.022,4.668.75,5.114.8.463,2.742.024,5.1-2.036a27.209,27.209,0,0,0,5.227-6.79,27.6,27.6,0,0,0,3.181-7.776c.654-3.175.089-5.119-.713-5.581a2.327,2.327,0,0,0-1.868.089A10.194,10.194,0,0,0,17.5,6.9a27.464,27.464,0,0,0-5.4,6.849Z"
        style={{ fill: "#00d8ff" }}
      />
      <path
        d="M21.677,28.456c-1.355,0-3.076-.82-4.868-2.361a28.756,28.756,0,0,1-5.747-7.237h0a28.676,28.676,0,0,1-3.374-8.471,11.376,11.376,0,0,1-.158-4A3.391,3.391,0,0,1,8.964,3.9c1.487-.861,4.01.024,6.585,2.31a28.8,28.8,0,0,1,5.39,6.934,28.384,28.384,0,0,1,3.41,8.287,11.3,11.3,0,0,1,.137,4.146,3.543,3.543,0,0,1-1.494,2.555A2.59,2.59,0,0,1,21.677,28.456Zm-9.58-10.2a27.949,27.949,0,0,0,5.492,6.929c2.249,1.935,4.033,2.351,4.8,1.9.8-.465,1.39-2.363.782-5.434A27.212,27.212,0,0,0,19.9,13.74,27.6,27.6,0,0,0,14.755,7.1c-2.424-2.152-4.39-2.633-5.191-2.169a2.327,2.327,0,0,0-.855,1.662,10.194,10.194,0,0,0,.153,3.565,27.465,27.465,0,0,0,3.236,8.1Z"
        style={{ fill: "#00d8ff" }}
      />
    </svg>
  ),
  ts: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <title>file_type_typescript</title>
      <path
        d="M23.827,8.243A4.424,4.424,0,0,1,26.05,9.524a5.853,5.853,0,0,1,.852,1.143c.011.045-1.534,1.083-2.471,1.662-.034.023-.169-.124-.322-.35a2.014,2.014,0,0,0-1.67-1c-1.077-.074-1.771.49-1.766,1.433a1.3,1.3,0,0,0,.153.666c.237.49.677.784,2.059,1.383,2.544,1.095,3.636,1.817,4.31,2.843a5.158,5.158,0,0,1,.416,4.333,4.764,4.764,0,0,1-3.932,2.815,10.9,10.9,0,0,1-2.708-.028,6.531,6.531,0,0,1-3.616-1.884,6.278,6.278,0,0,1-.926-1.371,2.655,2.655,0,0,1,.327-.208c.158-.09.756-.434,1.32-.761L19.1,19.6l.214.312a4.771,4.771,0,0,0,1.35,1.292,3.3,3.3,0,0,0,3.458-.175,1.545,1.545,0,0,0,.2-1.974c-.276-.395-.84-.727-2.443-1.422a8.8,8.8,0,0,1-3.349-2.055,4.687,4.687,0,0,1-.976-1.777,7.116,7.116,0,0,1-.062-2.268,4.332,4.332,0,0,1,3.644-3.374A9,9,0,0,1,23.827,8.243ZM15.484,9.726l.011,1.454h-4.63V24.328H7.6V11.183H2.97V9.755A13.986,13.986,0,0,1,3.01,8.289c.017-.023,2.832-.034,6.245-.028l6.211.017Z"
        style={{ fill: "#007acc" }}
      />
    </svg>
  ),
} as Record<string, React.ReactNode>;
