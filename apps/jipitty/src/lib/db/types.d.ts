export interface ConversationRow {
    id: int // bigint
    participants: string // JSON
    admin_id: int // bigint
    title: string | null;
    visibility: 'private' | 'public' | 'url' | 'shared'
    created_at: Date;
    updated_at: Date;
    public_id: string; // 12 digit nanoid
    created_by_user_id: int // bigint
}

export interface UserRow {
    id: int;
    email: string;
    created_at: Date;
    updated_at: Date;
}

export interface MessageRow {
    id: number;
    conversation_id: number;
    user_id: number | null;
    content: string;
    created_at: Date;
    public_id: string;
    sender_type: 'user' | 'system' | 'gpt-3.5-turbo' | null;
}
  