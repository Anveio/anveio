import * as conversations from "./conversations"
import * as schemas from "./schemas"

export const AivisorClient = {
	v2: {
		schemas,
		conversations: {
			createConversation: conversations.createConversation,
			getConversation: conversations.getConversation,
			generateConversationTitle: conversations.generateConversationTitle,
			createMessageInConversation: conversations.createMessageInConversation
		}
	}
}
