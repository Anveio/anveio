'use client';

import { LiveObject, createClient, shallow } from '@liveblocks/client';
import { createRoomContext } from '@liveblocks/react';
import * as React from 'react';
import { AvatarId } from '../constants/avatars';

const client = createClient({
  authEndpoint: '/api/liveblocks-auth',
});

// Presence represents the properties that exist on every user in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export type Presence = {
  cursor: { x: number; y: number } | null;
  avatar: AvatarId | null;
  currentlyViewedPage: {
    id: string;
  };
};

export type LiveChatObject = LiveObject<{
  x: number;
  y: number;
  text: string;
  selectedBy: UserMeta['info'] | null;
  id: string;
}>;

// Optionally, Storage represents the shared document that persists in the
// Room, even after all users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
  // author: LiveObject<{ firstName: string, lastName: string }>,
  // ...
};

export type UserInfo = {
  color: string;
};

// Optionally, UserMeta represents static/readonly metadata on each user, as
// provided by your own custom auth back end (if used). Useful for data that
// will not change during a session, like a user's name or avatar.
type UserMeta = {
  info: UserInfo;
};

// Optionally, the type of custom events broadcast and listened to in this
// room. Use a union for multiple events. Must be JSON-serializable.
type RoomEvent = {
  // type: "NOTIFICATION",
  // ...
};

export const useOthersOnPage = (pageId: string) => {
  const others = useOthers(
    (others) =>
      others.filter(
        (other) => other.presence.currentlyViewedPage.id === pageId
      ),
    shallow
  );

  const otherCursorsMemoized = React.useMemo(() => {
    return others;
  }, [others]);

  return otherCursorsMemoized;
};

export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useUpdateMyPresence,
    useSelf,
    useOthers,
    useOthersMapped,
    useOthersConnectionIds,
    useOther,
    useBroadcastEvent,
    useEventListener,
    useErrorListener,
    useStorage,
    useObject,
    useMap,
    useList,
    useBatch,
    useHistory,
    useUndo,
    useRedo,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStatus,
    useLostConnectionListener,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent>(client);
