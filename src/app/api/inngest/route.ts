import { AnveioInngestClient, sendChatMessageGlobalChat } from '@/lib/inngest';
import { serve } from 'inngest/next';

export const { GET, POST, PUT } = serve({
  client: AnveioInngestClient,
  functions: [sendChatMessageGlobalChat],
});
