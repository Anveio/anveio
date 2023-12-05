import { Message } from 'ai'

export type InngestFunctionTypes = {
    "chat/global.message-send": {
        data: {
            messages: Message[];
            requestId: string;
        };
    };
    "upload/image-to-vercel-blob-storage": {
        data: {
            image: string;
            requestId: string;
        };
    };
};
