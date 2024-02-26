export type InngestFunctionTypes = {
  'chat/global.message-send': {
    data: {
      messages: any[];
      requestId: string;
    };
  };
  'upload/image-to-vercel-blob-storage': {
    data: {
      image: string;
      requestId: string;
    };
  };
};
