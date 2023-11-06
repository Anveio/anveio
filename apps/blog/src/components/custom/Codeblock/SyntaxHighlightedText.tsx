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
      codeClassName="bg-zinc-900 my-0"
      code={props.text}
    />
  );
};
