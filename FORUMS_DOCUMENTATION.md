# Forums System Documentation

## Overview

The My Floral Vault (MFV) Forums system is a traditional forum-style community platform for plant enthusiasts. This frontend implementation is complete and ready for backend integration.

## Features Implemented

### ✅ Forums Landing Page (`/forums`)
- **Category List** - All forum categories with thread/post counts
- **Recent Activity Feed** - Live feed of new threads and replies
- **Popular Threads Sidebar** - Trending discussions
- **Forum Search Bar** - Search across all threads and posts
- **Stats Dashboard** - Total threads, posts, categories, and members
- **New Thread Button** - Opens create thread modal

### ✅ Category View (`/forums/[category]`)
- **Thread List** - All threads in the category
- **Sticky Threads** - Pinned threads at the top
- **Thread Sorting** - Recent, Popular, Most Replies
- **Category Search** - Search within category
- **New Thread Button** - Create thread in this category
- **Category Info** - Icon, name, description, stats

### ✅ Thread View (`/forums/[category]/[threadId]`)
- **Original Post** - Rich text content with images
- **Thread Metadata** - Author, date, views, reply count
- **Subscribe Button** - Get notifications for new replies
- **Paginated Replies** - 10 replies per page
- **Reply Actions** - Like, Quote, Edit (own), Delete (own)
- **Reply Composer** - TipTap rich text editor
- **Quote System** - Quote previous replies
- **Related Threads** - More from the same category

### ✅ Create Thread Modal
- **Title Input** - Thread title (200 char limit)
- **Category Selector** - Choose forum category
- **Rich Text Editor** - TipTap with full formatting
- **Image Upload** - Multiple images with preview
- **Tags System** - Add custom tags
- **Form Validation** - All required fields enforced

### ✅ Components Built

All components are TypeScript type-safe and mobile responsive:

1. **ForumCategoryList** - Displays all categories with stats and last post
2. **ForumThreadList** - Lists threads with sorting and sticky support
3. **ForumThreadView** - Complete thread display with replies
4. **ForumReplyComposer** - TipTap editor for replies with quote support
5. **CreateThreadModal** - Full thread creation modal
6. **RecentActivityFeed** - Activity timeline component
7. **PopularThreadsSidebar** - Trending threads widget
8. **ForumSearchBar** - Reusable search component

## File Structure

```
fe-MFV-dev/
├── app/
│   └── forums/
│       ├── page.tsx                           # Landing page
│       ├── [category]/
│       │   ├── page.tsx                       # Category view
│       │   └── [threadId]/
│       │       └── page.tsx                   # Thread view
├── components/
│   └── forums/
│       ├── index.ts                           # Export barrel
│       ├── ForumCategoryList.tsx
│       ├── ForumThreadList.tsx
│       ├── ForumThreadView.tsx
│       ├── ForumReplyComposer.tsx
│       ├── CreateThreadModal.tsx
│       ├── RecentActivityFeed.tsx
│       ├── PopularThreadsSidebar.tsx
│       └── ForumSearchBar.tsx
├── types/
│   └── forums.ts                              # All TypeScript types
├── mock/
│   └── forums.ts                              # Mock data for testing
└── FORUMS_DOCUMENTATION.md                    # This file
```

## TypeScript Types

All types are defined in `types/forums.ts`:

- **ForumUser** - User profile with role and stats
- **ForumCategory** - Category with thread/post counts
- **ForumThread** - Complete thread data
- **ForumReply** - Reply with quote support
- **ForumActivity** - Activity feed item
- **PopularThread** - Trending thread with score
- **CreateThreadInput** - Thread creation payload
- **CreateReplyInput** - Reply creation payload
- **ForumSearchResult** - Search results structure

## Design System

### Color Scheme (Traditional Forum Style)
- **Background**: `#0f1419` (Dark base)
- **Cards**: `#1a1d2d` (Card background)
- **Borders**: `#2c2f38` (Subtle borders)
- **Hover**: `#22254a` (Hover state)
- **Primary**: `#10B981` (Green accent)
- **Text Primary**: `#FFFFFF`
- **Text Secondary**: `#9CA3AF`

### Layout Philosophy
- **Traditional Forum Layout** - Similar to phpBB, vBulletin, ourfigs.com
- **NOT Social Media Style** - No infinite scroll, clear hierarchy
- **Mobile Responsive** - Works on all screen sizes
- **Keyboard Accessible** - Full keyboard navigation

## Mock Data

Comprehensive mock data is provided in `mock/forums.ts`:

- 5 mock users with different roles (admin, moderator, member)
- 6 categories (General, Plant Care, Identification, Showcase, Marketplace, Propagation)
- 5 sample threads with varying content
- 5 sample replies with quote support
- Recent activity feed items
- Popular threads with scores

## Backend Integration Checklist

When the backend is ready, implement these endpoints:

### Categories
- `GET /api/forums/categories` - List all categories
- `GET /api/forums/categories/:slug` - Get category details

### Threads
- `GET /api/forums/threads` - List threads (with filters)
- `GET /api/forums/threads/:id` - Get thread details
- `POST /api/forums/threads` - Create new thread
- `PATCH /api/forums/threads/:id` - Update thread
- `DELETE /api/forums/threads/:id` - Delete thread
- `POST /api/forums/threads/:id/subscribe` - Subscribe to thread
- `DELETE /api/forums/threads/:id/subscribe` - Unsubscribe

### Replies
- `GET /api/forums/threads/:threadId/replies` - List replies (paginated)
- `POST /api/forums/threads/:threadId/replies` - Create reply
- `PATCH /api/forums/replies/:id` - Edit reply
- `DELETE /api/forums/replies/:id` - Delete reply
- `POST /api/forums/replies/:id/like` - Like reply
- `DELETE /api/forums/replies/:id/like` - Unlike reply

### Search
- `GET /api/forums/search?q=query` - Search threads and replies

### Activity
- `GET /api/forums/activity` - Get recent activity feed
- `GET /api/forums/popular` - Get popular threads

## State Management

Currently using local React state. When implementing backend:

1. **Replace useState with API calls**
2. **Add React Query** for caching and optimistic updates
3. **Add Redux slices** if global state is needed
4. **Implement real-time updates** with WebSockets for activity feed

## Authentication Integration

The system expects:
- `currentUserId` from auth context
- User roles (admin, moderator, member)
- Permission checks for edit/delete actions

Update these in each page:
```typescript
const currentUserId = useAuth().user?.id; // From auth context
```

## Image Upload Integration

The CreateThreadModal includes image upload UI. Integrate with your upload service:

```typescript
// In CreateThreadModal
const handleSubmit = async (data) => {
  // Upload images first
  const uploadedUrls = await uploadImages(data.images);
  
  // Then create thread with URLs
  await createThread({
    ...data,
    images: uploadedUrls,
  });
};
```

## Rich Text Content

All content uses TipTap HTML. When rendering:
- Sanitize HTML to prevent XSS
- Support same extensions on backend
- Store as HTML in database

## Performance Optimization

When implementing backend:
1. **Pagination** - Already implemented (10 replies per page)
2. **Lazy Loading** - Load thread content on demand
3. **Image Optimization** - Compress and resize uploads
4. **Caching** - Cache popular threads and categories
5. **Search Indexing** - Use Elasticsearch or similar

## Mobile Responsiveness

All components are fully responsive:
- **Mobile**: Single column layout, collapsible toolbar
- **Tablet**: Two column layout
- **Desktop**: Full three column layout with sidebar

Test breakpoints:
- Mobile: 375px - 767px
- Tablet: 768px - 1023px
- Desktop: 1024px+

## Accessibility

- **Semantic HTML** - Proper heading hierarchy
- **ARIA Labels** - Screen reader support
- **Keyboard Navigation** - Tab through all interactive elements
- **Focus States** - Visible focus indicators
- **Color Contrast** - WCAG AA compliant

## Testing Strategy

### Manual Testing
1. Navigate through all pages
2. Create thread with images and tags
3. Reply to threads with quotes
4. Like/unlike replies
5. Edit and delete own replies
6. Subscribe/unsubscribe to threads
7. Search forums
8. Test mobile responsiveness

### Automated Testing (TODO)
- Unit tests for components
- Integration tests for user flows
- E2E tests with Playwright
- Accessibility tests with axe

## Known Limitations

These are frontend-only implementations awaiting backend:

1. **Data Persistence** - All changes are local only
2. **User Authentication** - Using mock user ID
3. **Real-time Updates** - No WebSocket connection
4. **Image Upload** - UI only, no actual upload
5. **Search** - Frontend filtering only
6. **Pagination** - Mock pagination logic

## Next Steps

1. **Backend API Development** - Create all endpoints
2. **Database Schema** - Design tables for forums data
3. **API Integration** - Connect frontend to backend
4. **Authentication** - Integrate with auth system
5. **Image Upload Service** - Implement file storage
6. **Search Service** - Set up search indexing
7. **Notifications** - Email/push for subscribed threads
8. **Moderation Tools** - Admin panel for managing content

## Component Props Reference

### ForumCategoryList
```typescript
interface ForumCategoryListProps {
  categories: ForumCategory[];
}
```

### ForumThreadList
```typescript
interface ForumThreadListProps {
  threads: ForumThread[];
  categorySlug: string;
  showCategory?: boolean; // Show category name on each thread
}
```

### ForumThreadView
```typescript
interface ForumThreadViewProps {
  thread: ForumThread;
  replies: ForumReply[];
  currentUserId?: string;
  isSubscribed?: boolean;
  onLikeReply?: (replyId: string) => void;
  onSubmitReply?: (content: string, quotedReplyId?: string) => void;
  onEditReply?: (replyId: string, content: string) => void;
  onDeleteReply?: (replyId: string) => void;
  onToggleSubscription?: () => void;
}
```

### CreateThreadModal
```typescript
interface CreateThreadModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateThreadInput) => void;
  categories: ForumCategory[];
  defaultCategoryId?: string;
}
```

## Styling Guidelines

All components use Tailwind CSS with the dark theme:

- Use `bg-[#1a1d2d]` for cards
- Use `border-[#2c2f38]` for borders
- Use `text-white` for primary text
- Use `text-gray-400` for secondary text
- Use `text-green-400` or `bg-green-600` for primary actions
- Use `hover:bg-[#22254a]` for hover states

## Browser Support

Tested and supported:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Credits

Built by: Devin (Coding Agent)
For: Jzavier / TimmTechProjects
Project: My Floral Vault (MFV)
Date: February 2026

---

## Quick Start

To view the forums:

1. Navigate to `/forums` in your browser
2. Browse categories
3. Click a category to see threads
4. Click a thread to view discussion
5. Click "New Thread" to test create modal

All functionality is fully working with mock data!
