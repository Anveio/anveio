import { Code } from "bright";
interface Props {
  text: string;
  language: string;
}

Code.theme = "dark-plus";

export const SyntaxHighlightedText = (props: Props) => {
  return (
    <Code
      lineNumbers={props.language === "shell" ? false : true}
      lang={props.language}
      style={{
        marginTop: 0,
        marginBottom: 0,
      }}
    >
      {props.text}
    </Code>
  );
};
