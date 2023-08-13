"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export const ToggleThemeButton = (props: { theme: "light" | "dark" }) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        fetch("./api/theming", {
          method: "POST",
          body: JSON.stringify({
            theme: props.theme === "dark" ? "light" : "dark",
          }),
        });
      }}
    >
      <Button type="submit" variant="outline" size="icon">
        <ChevronRight className="h-4 w-4" />
      </Button>
    </form>
  );
};
