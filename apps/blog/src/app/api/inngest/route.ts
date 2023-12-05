import { AnveioInngestClient } from 'inngest-client'
import { serve } from 'inngest-client/inngest/next'
import { sendChatMessageGlobalChat } from 'inngest-client/functions'

export const { GET, POST, PUT } = serve({
  client: AnveioInngestClient,
  functions: [sendChatMessageGlobalChat],
});
