"use client";

import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Prism } from "react-syntax-highlighter";
interface Props {
  text: string;
  language: "typescript" | "tsx";
}

/**
 * Monkey patch! The original styles can be found in `node_modules/react-syntax-highlighter/dist/esm/styles/prism/vsc-dark-plus.js`
 *
 */
const PRISM_STYLE = {
  ...vscDarkPlus,
  'code[class*="language-"]': {
    ...vscDarkPlus[`code[class*="language-"`],
    fontSize: "1rem",
  },
  'pre[class*="language-"]': {
    ...vscDarkPlus[`pre[class*="language-"`],
    fontSize: "1rem",
    comment: {
      color: "#d4d4d4",
    },
  },
} as const;

export const SyntaxHighlightedText = (props: Props) => {
  return (
    <Prism showLineNumbers language={props.language} style={PRISM_STYLE as any}>
      {props.text}
    </Prism>
  );
};
