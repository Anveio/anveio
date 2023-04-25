import { Session } from "next-auth";
import { MobileSidebar } from "./MobileSidebar";
import { SidebarCore } from "./SidebarCore";

interface Props {
  session: Session | null;
}

export function Sidebar(props: Props) {
  return (
    <div className="">
      <MobileSidebar>
        <SidebarCore session={props.session} />
      </MobileSidebar>
      <SidebarCore session={props.session} className="hidden lg:flex" />
    </div>
  );
}
