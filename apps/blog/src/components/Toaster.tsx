"use client";

import * as React from "react";
import { Button } from "./ui/button";
import { createToast } from "@/lib/toasts";

export const ToasterButtons = () => {
  return (
    <>
      <Button
        variant="outline"
        onClick={() => {
          createToast("Success", { type: "success", timeout: 5000 });
        }}
      >
        Success Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          createToast("Error Toast", { type: "error", timeout: 5000 });
        }}
      >
        Error Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          createToast("Dark Toast", { type: "dark", timeout: 5000 });
        }}
      >
        Dark Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          createToast("Default Toast", { type: "default", timeout: 5000 });
        }}
      >
        Default Toast
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          createToast("Warning Toast", { type: "warning", timeout: 5000 });
        }}
      >
        Warning Toast
      </Button>
    </>
  );
};
