# Technical Design: Rich Blog Post Composer

## Current Tech Stack Analysis
- **Frontend**: Next.js 15 + React 19 + TypeScript + Tailwind CSS
- **Backend**: Convex (real-time database)
- **Auth**: Better Auth
- **Styling**: Tailwind CSS + Biome (linting/formatting)
- **Already has**: Markdown support (`marked`, `gray-matter`)

## 1. Data Model & Schema Design

### Convex Schema Extensions
```typescript
// Add to schema.ts
posts: defineTable({
  title: v.string(),
  slug: v.string(),
  content: v.string(), // JSON structure for rich content
  excerpt: v.optional(v.string()),
  status: v.union(v.literal('draft'), v.literal('published'), v.literal('archived')),
  authorId: v.id('users'),
  publishedAt: v.optional(v.number()),
  tags: v.array(v.string()),
  featuredImageId: v.optional(v.id('media')),
  seoTitle: v.optional(v.string()),
  seoDescription: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index('by_slug', ['slug'])
.index('by_author', ['authorId'])
.index('by_status', ['status'])
.index('by_published_date', ['publishedAt'])
.index('by_author_status', ['authorId', 'status']),

media: defineTable({
  filename: v.string(),
  storageId: v.string(), // Convex file storage ID
  contentType: v.string(),
  size: v.number(),
  uploadedBy: v.id('users'),
  alt: v.optional(v.string()),
  caption: v.optional(v.string()),
  createdAt: v.number(),
})
.index('by_uploader', ['uploadedBy']),

embeddedComponents: defineTable({
  name: v.string(), // Component identifier
  props: v.string(), // JSON serialized props
  version: v.string(),
  createdBy: v.id('users'),
  createdAt: v.number(),
})
.index('by_name', ['name'])
.index('by_creator', ['createdBy'])
```

## 2. Rich Text Editor Architecture

### Editor Options (Recommended: EditorJS)
**EditorJS** - Block-based editor, perfect for rich content:
- Pros: Block-based, extensible, JSON output, great for mixed content
- Cons: Steeper learning curve
- Alternative: **Lexical** (Facebook's framework) or **TipTap** (ProseMirror-based)

### Content Structure (JSON)
```typescript
interface BlogContent {
  version: string;
  blocks: Array<{
    id: string;
    type: 'paragraph' | 'heading' | 'image' | 'embed' | 'component' | 'code';
    data: {
      text?: string;
      level?: number; // for headings
      file?: { url: string; caption: string; alt: string }; // for images
      service?: string; embed?: string; // for embeds
      componentId?: string; props?: Record<string, any>; // for React components
      code?: string; language?: string; // for code blocks
    };
  }>;
}
```

## 3. Media Handling System

### File Upload Flow
1. **Upload**: Drag & drop → Convex file storage
2. **Processing**: Image optimization, thumbnail generation
3. **Metadata**: Store file info in `media` table
4. **Insert**: Reference in editor blocks

### Convex Functions Needed
```typescript
// convex/media.ts
export const uploadFile = mutation({...}); // Handle file upload
export const getMedia = query({...}); // Get media by ID
export const listMedia = query({...}); // Media library
export const deleteMedia = mutation({...}); // Remove media
```

## 4. React Component Embedding System

### Component Registry Pattern
```typescript
// components/embeddable/registry.ts
export const EMBEDDABLE_COMPONENTS = {
  'interactive-chart': dynamic(() => import('./InteractiveChart')),
  'code-sandbox': dynamic(() => import('./CodeSandbox')),
  'tweet-embed': dynamic(() => import('./TweetEmbed')),
  'demo-widget': dynamic(() => import('./DemoWidget')),
} as const;

// Safe rendering with error boundaries
export function EmbeddedComponent({ type, props }: { type: string; props: any }) {
  const Component = EMBEDDABLE_COMPONENTS[type];
  if (!Component) return <div>Unknown component: {type}</div>;
  
  return (
    <ErrorBoundary>
      <Component {...props} />
    </ErrorBoundary>
  );
}
```

### Security Considerations
- **Sandboxing**: Use iframe for untrusted components
- **Prop validation**: Zod schemas for component props
- **CSP headers**: Restrict inline scripts
- **Component whitelist**: Only registered components allowed

## 5. Implementation Phases

### Phase 1: Core Infrastructure (Week 1-2)
- [ ] Extend Convex schema (posts, media, embeddedComponents)
- [ ] Basic post CRUD operations
- [ ] File upload system
- [ ] Admin dashboard structure

### Phase 2: Rich Editor (Week 3-4)
- [ ] Install & configure EditorJS
- [ ] Basic blocks (paragraph, heading, list, code)
- [ ] Image upload integration
- [ ] Auto-save functionality

### Phase 3: Media Management (Week 5)
- [ ] Media library interface
- [ ] Image optimization pipeline
- [ ] Drag & drop uploads
- [ ] Alt text & captions

### Phase 4: Component System (Week 6-7)
- [ ] Component registry
- [ ] Basic embeddable components
- [ ] Props editor interface
- [ ] Security sandboxing

### Phase 5: Publishing & SEO (Week 8)
- [ ] Draft/publish workflow
- [ ] SEO metadata
- [ ] URL slug management
- [ ] Post scheduling

## 6. Key Dependencies to Add

```json
{
  "@editorjs/editorjs": "^2.28.2",
  "@editorjs/header": "^2.7.0",
  "@editorjs/image": "^2.8.1",
  "@editorjs/code": "^2.8.0",
  "@editorjs/embed": "^2.5.3",
  "react-dropzone": "^14.2.3",
  "zod": "^3.22.4",
  "sharp": "^0.32.6", // Image processing
  "react-error-boundary": "^4.0.11"
}
```

## 7. File Structure
```
app/
├── admin/
│   ├── posts/
│   │   ├── page.tsx           # Posts list
│   │   ├── new/page.tsx       # Create post
│   │   ├── [id]/edit/page.tsx # Edit post
│   │   └── [id]/preview/page.tsx
│   ├── media/page.tsx         # Media library
│   └── components/page.tsx    # Component manager
components/
├── editor/
│   ├── BlogEditor.tsx
│   ├── EditorJS.tsx
│   └── blocks/               # Custom editor blocks
├── embeddable/
│   ├── registry.ts
│   └── components/          # Embeddable components
└── media/
    ├── MediaLibrary.tsx
    ├── MediaUpload.tsx
    └── ImageOptimizer.tsx
convex/
├── posts.ts                 # Post CRUD
├── media.ts                 # Media handling
└── components.ts            # Component management
```

This design provides a scalable, secure foundation for rich blog composition with the flexibility to add more complex features later. The block-based approach makes it easy to extend with new content types while maintaining clean data structures.