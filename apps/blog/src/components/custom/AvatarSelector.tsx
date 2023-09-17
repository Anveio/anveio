import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GearIcon } from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { AVATAR_ID_TO_DISPLAY_META } from "@/lib/features/avatars.client/avatars";
import { useHasIntent } from "@/lib/features/use-has-intent/use-has-intent";
import {
  Presence,
  useMyPresence,
  useUpdateMyPresence,
} from "@/lib/liveblocks.client";
import { AVATAR_IDS, AvatarId } from "@/lib/constants/avatars";

export const AvatarSelector = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="rounded-none border-none">
          <GearIcon height={18} width={18} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Profile</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <div className="grid grid-cols-3">
                  {AVATAR_IDS.map((avatarId) => {
                    return (
                      <AvatarSelectorButton
                        avatarId={avatarId}
                        key={avatarId}
                      />
                    );
                  })}
                </div>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface AvatarSelectorButtonProps {
  avatarId: AvatarId;
}

const AvatarSelectorButton = (props: AvatarSelectorButtonProps) => {
  const buttonElementRef = React.useRef<HTMLButtonElement>(null);

  const buttonHasIntent = useHasIntent(buttonElementRef);

  console.log(props.avatarId);

  const meta = AVATAR_ID_TO_DISPLAY_META[props.avatarId];

  const IconComponent = meta.iconComponent;

  const updateMyPresence = useUpdateMyPresence();
  const [myPresence] = useMyPresence();

  const buttonIsalreadySelected = myPresence?.avatar === props.avatarId;

  const handleClick = () => {
    updateMyPresence({
      avatar: props.avatarId,
    });
  };

  return (
    <Button
      ref={buttonElementRef}
      className={cn(
        `h-12 w-12`,
        `color-${meta.iconColor} hover:bg-[${meta.selectedBackgroundColor}]`
      )}
      onClick={handleClick}
      style={{
        backgroundColor: buttonHasIntent
          ? meta.selectedBackgroundColor
          : undefined,
        boxShadow: buttonIsalreadySelected
          ? `inset 0 0 0 2px ${meta.iconColor}`
          : undefined,
      }}
      variant={"ghost"}
      aria-label={meta.label}
    >
      <IconComponent
        className={`h-12 w-12 text-current`}
        color={meta.iconColor}
      />
    </Button>
  );
};
