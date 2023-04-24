import React from "react";
import CompanyLogoWhite from "../../public/company-logo.svg";
import Image from "next/image";

export function Logo(props: Partial<React.ComponentProps<typeof Image>>) {
  return <Image {...props} src={CompanyLogoWhite} alt="" />;
}
