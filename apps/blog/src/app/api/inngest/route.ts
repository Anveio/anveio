import { AnveioInngestClient } from 'anveio-inngest-client'
import { serve } from 'anveio-inngest-client/inngest/next'
import { sendChatMessageGlobalChat } from 'anveio-inngest-client/functions'

export const { GET, POST, PUT } = serve({
  client: AnveioInngestClient,
  functions: [sendChatMessageGlobalChat],
});
