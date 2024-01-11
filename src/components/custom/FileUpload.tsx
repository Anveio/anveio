"use client";

import * as React from "react";
import { DropEvent, FileRejection, useDropzone } from "react-dropzone";
import { useMachine } from "@xstate/react";
import { assign, createMachine } from "xstate";
import { PutBlobResult } from "@vercel/blob";
import { upload } from "@vercel/blob/client";

// XState machine definition
const uploadMachine = createMachine(
  {
    id: "upload",
    initial: "idle",
    context: {
      acceptedFiles: [],
      rejectedFiles: [],
      error: null,
    },
    schema: {
      events: {} as
        | { type: "DROP_INTENT_START" }
        | {
            type: "UPLOAD_FILE";
            payload: { acceptedFiles: File[]; rejectedFiles: File[] };
          }
        | { type: "DROP_INTENT_CANCEL" }
        | { type: "UPLOAD" },
      context: {
        error: null,
        acceptedFiles: [],
        rejectedFiles: [],
      } as {
        error: string | null;
        acceptedFiles: File[];
        rejectedFiles: File[];
      },
    },
    states: {
      idle: {
        on: { DROP_INTENT_START: "hovering" },
      },
      hovering: {
        on: {
          DROP_INTENT_CANCEL: "idle",
          UPLOAD_FILE: {
            target: "uploading",
            actions: assign({
              acceptedFiles: (context, event) => event.payload.acceptedFiles,
              rejectedFiles: (context, event) => event.payload.rejectedFiles,
            }),
          },
        },
      },
      uploading: {
        invoke: {
          src: "inline",
          onDone: {
            target: "idle",
          },
          onError: {
            target: "error",
            actions: "onError",
          },
        },
      },
      error: {
        // Handle error state
      },
    },
    predictableActionArguments: true,
    preserveActionOrder: true,
  },
  {
    actions: {
      onError: assign({
        error: (context, event) => {
          console.log(event);

          return null;
        },
      }),
    },
    services: {
      multipleFileUploader: (context, event) => {
        return Promise.all(
          context.acceptedFiles.map((file) => {
            return upload(file.name, file, {
              access: "public",
              handleUploadUrl: "/api/upload/image/client-upload",
            });
          })
        );
      },
    },
  }
);

const uploadFiles = async (files: File[]) => {
  for (let file of files) {
    const newBlob = await upload(file.name, file, {
      access: "public",
      handleUploadUrl: "/api/upload/image/client-upload",
    });
  }
};

type OnDropFn = <T extends File>(
  acceptedFiles: T[],
  fileRejections: FileRejection[],
  event?: DropEvent
) => void;

const ImageUploadComponent: React.FC = () => {
  const [state, send] = useMachine(uploadMachine);

  const inputFileRef = React.useRef<HTMLInputElement>(null);

  const onDrop: OnDropFn = async (acceptedFiles, rejectedFiles, e) => {
    send("UPLOAD", { acceptedFiles, rejectedFiles });
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDragEnter: () => send("DROP_INTENT_START"),
    onDragLeave: () => send("DROP_INTENT_CANCEL"),
    onDrop: (acceptedFiles, rejectedFiles) =>
      send("UPLOAD", { acceptedFiles, rejectedFiles }),
  });

  // const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
  //   const files = inputFileRef.current?.files;

  //   if (!files || files.length === 0) {
  //     return;
  //   }

  //   event.preventDefault();

  //   onDrop(Array.from(files), []);
  // };

  return (
    <div
      {...getRootProps()}
      className={`p-4 border-dashed border-2 ${
        isDragActive ? "bg-blue-100 border-blue-500" : "border-gray-300"
      }`}
    >
      <form>
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-10 h-10 mb-3 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            ></path>
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and
            drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            SVG, PNG, JPG or GIF (MAX. 800x400px)
          </p>
        </div>
        <input {...getInputProps()} />
        <pre>{JSON.stringify(state.context, null, 2)}</pre>
        <pre>{JSON.stringify(state.value)}</pre>
        {state.matches("idle") && (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
        {state.matches("hovering") && <p>Release to upload</p>}
        {state.matches("uploading") && <p>Uploading...</p>}
        {state.matches("success") && <p>Success!</p>}
        {/* Add more UI feedback for different states */}
      </form>
    </div>
  );
};

export default ImageUploadComponent;
