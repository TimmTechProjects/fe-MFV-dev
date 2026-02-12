// Mock data for Forums System

import {
  ForumCategory,
  ForumThread,
  ForumReply,
  ForumActivity,
  PopularThread,
  ForumUser,
} from "@/types/forums";

// Mock Users
export const mockForumUsers: ForumUser[] = [
  {
    id: "1",
    username: "PlantWhisperer",
    avatarUrl: "https://i.pravatar.cc/150?u=plantwhisperer",
    role: "admin",
    joinDate: "2024-01-01",
    postCount: 342,
  },
  {
    id: "2",
    username: "GreenThumb92",
    avatarUrl: "https://i.pravatar.cc/150?u=greenthumb",
    role: "moderator",
    joinDate: "2024-02-15",
    postCount: 156,
  },
  {
    id: "3",
    username: "SucculentLover",
    avatarUrl: "https://i.pravatar.cc/150?u=succulent",
    role: "member",
    joinDate: "2024-03-20",
    postCount: 89,
  },
  {
    id: "4",
    username: "TropicalCollector",
    avatarUrl: "https://i.pravatar.cc/150?u=tropical",
    role: "member",
    joinDate: "2024-04-10",
    postCount: 67,
  },
  {
    id: "5",
    username: "BotanyNerd",
    avatarUrl: "https://i.pravatar.cc/150?u=botany",
    role: "member",
    joinDate: "2024-05-05",
    postCount: 124,
  },
];

// Mock Categories
export const mockForumCategories: ForumCategory[] = [
  {
    id: "general",
    name: "General Discussion",
    slug: "general",
    description:
      "General topics about plants, gardening, and the community. Share your thoughts!",
    threadCount: 156,
    postCount: 1243,
    icon: "💬",
    color: "#10B981",
    lastPost: {
      id: "post-1",
      threadId: "thread-1",
      threadTitle: "Welcome to the Forums!",
      author: mockForumUsers[0],
      createdAt: "2024-01-20T14:30:00Z",
    },
  },
  {
    id: "plant-care",
    name: "Plant Care & Advice",
    slug: "plant-care",
    description:
      "Get help with plant care, troubleshoot problems, and share your expertise.",
    threadCount: 234,
    postCount: 2156,
    icon: "🌿",
    color: "#3B82F6",
    lastPost: {
      id: "post-2",
      threadId: "thread-2",
      threadTitle: "Help! My monstera has yellow leaves",
      author: mockForumUsers[2],
      createdAt: "2024-01-21T10:15:00Z",
    },
  },
  {
    id: "identification",
    name: "Plant Identification",
    slug: "identification",
    description:
      "Not sure what plant you have? Upload a photo and get help identifying it!",
    threadCount: 189,
    postCount: 987,
    icon: "🔍",
    color: "#F59E0B",
    lastPost: {
      id: "post-3",
      threadId: "thread-3",
      threadTitle: "Found this beauty at the nursery - what is it?",
      author: mockForumUsers[3],
      createdAt: "2024-01-21T09:45:00Z",
    },
  },
  {
    id: "showcase",
    name: "Plant Showcase",
    slug: "showcase",
    description:
      "Show off your beautiful plants! Share photos of your collection and garden.",
    threadCount: 312,
    postCount: 1876,
    icon: "📸",
    color: "#8B5CF6",
    lastPost: {
      id: "post-4",
      threadId: "thread-4",
      threadTitle: "My variegated monstera finally unfurled!",
      author: mockForumUsers[1],
      createdAt: "2024-01-21T11:20:00Z",
    },
  },
  {
    id: "marketplace",
    name: "Buy, Sell, Trade",
    slug: "marketplace",
    description:
      "Buy, sell, or trade plants and plant-related items with the community.",
    threadCount: 267,
    postCount: 1432,
    icon: "🛒",
    color: "#EC4899",
    lastPost: {
      id: "post-5",
      threadId: "thread-5",
      threadTitle: "ISO: Rare philodendron cuttings",
      author: mockForumUsers[4],
      createdAt: "2024-01-21T08:30:00Z",
    },
  },
  {
    id: "propagation",
    name: "Propagation Station",
    slug: "propagation",
    description:
      "Tips, tricks, and discussion about propagating plants from cuttings and seeds.",
    threadCount: 145,
    postCount: 892,
    icon: "🌱",
    color: "#14B8A6",
    lastPost: {
      id: "post-6",
      threadId: "thread-6",
      threadTitle: "Water vs soil propagation - what's better?",
      author: mockForumUsers[2],
      createdAt: "2024-01-20T16:45:00Z",
    },
  },
];

// Mock Threads
export const mockForumThreads: ForumThread[] = [
  {
    id: "thread-1",
    title: "Welcome to the MFV Forums! 🎉",
    slug: "welcome-to-mfv-forums",
    categoryId: "general",
    categoryName: "General Discussion",
    author: mockForumUsers[0],
    content:
      "<p>Welcome to My Floral Vault Forums! We're excited to have you here.</p><p>This is a place to connect with fellow plant enthusiasts, share your knowledge, ask questions, and show off your beautiful collections.</p><h2>Forum Guidelines</h2><ul><li>Be respectful and kind to all members</li><li>Stay on topic in each category</li><li>No spam or self-promotion without permission</li><li>Share high-quality photos and content</li></ul><p>Happy posting! 🌿</p>",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    views: 1234,
    replyCount: 45,
    isSticky: true,
    isLocked: false,
    isPinned: true,
    tags: ["announcement", "welcome"],
    lastReply: {
      id: "reply-5",
      author: mockForumUsers[4],
      createdAt: "2024-01-20T14:30:00Z",
    },
  },
  {
    id: "thread-2",
    title: "Help! My monstera has yellow leaves 😟",
    slug: "monstera-yellow-leaves",
    categoryId: "plant-care",
    categoryName: "Plant Care & Advice",
    author: mockForumUsers[2],
    content:
      "<p>I've had my monstera deliciosa for about 6 months now, and recently I've noticed the lower leaves turning yellow. I water it once a week and it's in indirect sunlight.</p><p>What could be causing this? Is this normal or should I be worried?</p><p>Photos attached below!</p>",
    createdAt: "2024-01-18T09:30:00Z",
    updatedAt: "2024-01-18T09:30:00Z",
    views: 567,
    replyCount: 12,
    isSticky: false,
    isLocked: false,
    isPinned: false,
    tags: ["monstera", "help", "yellow-leaves"],
    images: [
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500",
    ],
    lastReply: {
      id: "reply-12",
      author: mockForumUsers[0],
      createdAt: "2024-01-21T10:15:00Z",
    },
  },
  {
    id: "thread-3",
    title: "Found this beauty at the nursery - what is it?",
    slug: "identify-nursery-plant",
    categoryId: "identification",
    categoryName: "Plant Identification",
    author: mockForumUsers[3],
    content:
      "<p>Spotted this gorgeous plant at my local nursery but there was no label! The leaves are so unique with the variegation.</p><p>Can anyone help me identify it? I want to make sure I can take proper care of it before buying.</p>",
    createdAt: "2024-01-19T14:20:00Z",
    updatedAt: "2024-01-19T14:20:00Z",
    views: 389,
    replyCount: 8,
    isSticky: false,
    isLocked: false,
    isPinned: false,
    tags: ["identification", "help"],
    images: [
      "https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500",
    ],
    lastReply: {
      id: "reply-8",
      author: mockForumUsers[1],
      createdAt: "2024-01-21T09:45:00Z",
    },
  },
  {
    id: "thread-4",
    title: "My variegated monstera finally unfurled! 🎊",
    slug: "variegated-monstera-unfurled",
    categoryId: "showcase",
    categoryName: "Plant Showcase",
    author: mockForumUsers[1],
    content:
      "<p>After weeks of waiting, my variegated monstera albo finally gave me this STUNNING new leaf! The variegation is perfect - almost 50/50!</p><p>I'm so excited I had to share with you all. This is why we do what we do! 💚</p>",
    createdAt: "2024-01-20T08:15:00Z",
    updatedAt: "2024-01-20T08:15:00Z",
    views: 892,
    replyCount: 34,
    isSticky: false,
    isLocked: false,
    isPinned: false,
    tags: ["monstera", "variegated", "showcase"],
    images: [
      "https://images.unsplash.com/photo-1614594895304-fe7116ac3b58?w=500",
      "https://images.unsplash.com/photo-1614594975525-e45190c55d0b?w=500",
    ],
    lastReply: {
      id: "reply-34",
      author: mockForumUsers[3],
      createdAt: "2024-01-21T11:20:00Z",
    },
  },
  {
    id: "thread-5",
    title: "ISO: Rare philodendron cuttings",
    slug: "iso-rare-philodendron",
    categoryId: "marketplace",
    categoryName: "Buy, Sell, Trade",
    author: mockForumUsers[4],
    content:
      "<p>Looking for cuttings of rare philodendrons! Particularly interested in:</p><ul><li>Philodendron Pink Princess</li><li>Philodendron Gloriosum</li><li>Philodendron Melanochrysum</li></ul><p>I have plenty of plants for trade including various hoyas, pothos, and monsteras. DM me if you're interested in trading!</p>",
    createdAt: "2024-01-17T11:45:00Z",
    updatedAt: "2024-01-17T11:45:00Z",
    views: 456,
    replyCount: 15,
    isSticky: false,
    isLocked: false,
    isPinned: false,
    tags: ["trade", "philodendron", "iso"],
    lastReply: {
      id: "reply-15",
      author: mockForumUsers[2],
      createdAt: "2024-01-21T08:30:00Z",
    },
  },
];

// Mock Replies
export const mockForumReplies: ForumReply[] = [
  {
    id: "reply-1",
    threadId: "thread-2",
    author: mockForumUsers[0],
    content:
      "<p>Yellow leaves on monstera are often caused by overwatering! Once a week might be too frequent depending on your environment.</p><p>Try checking if the soil is dry before watering. The top 2 inches should be dry to the touch.</p>",
    createdAt: "2024-01-18T10:15:00Z",
    updatedAt: "2024-01-18T10:15:00Z",
    likes: 23,
    likedByCurrentUser: false,
    isEdited: false,
  },
  {
    id: "reply-2",
    threadId: "thread-2",
    author: mockForumUsers[1],
    content:
      "<p>I agree with PlantWhisperer! Also, make sure your pot has good drainage. Monsteras hate sitting in water.</p>",
    createdAt: "2024-01-18T11:30:00Z",
    updatedAt: "2024-01-18T11:30:00Z",
    likes: 15,
    likedByCurrentUser: true,
    isEdited: false,
    quotedReply: {
      id: "reply-1",
      author: mockForumUsers[0],
      content:
        "<p>Yellow leaves on monstera are often caused by overwatering!</p>",
    },
  },
  {
    id: "reply-3",
    threadId: "thread-3",
    author: mockForumUsers[1],
    content:
      "<p>That looks like a Philodendron Birkin! Beautiful variegation. They're relatively easy to care for - bright indirect light and keep the soil slightly moist but not soggy.</p>",
    createdAt: "2024-01-19T15:00:00Z",
    updatedAt: "2024-01-19T15:00:00Z",
    likes: 18,
    likedByCurrentUser: false,
    isEdited: false,
  },
  {
    id: "reply-4",
    threadId: "thread-4",
    author: mockForumUsers[0],
    content:
      "<p>Absolutely stunning! That variegation is PERFECT! 😍 Congrats on the new leaf!</p>",
    createdAt: "2024-01-20T08:45:00Z",
    updatedAt: "2024-01-20T08:45:00Z",
    likes: 31,
    likedByCurrentUser: false,
    isEdited: false,
  },
  {
    id: "reply-5",
    threadId: "thread-5",
    author: mockForumUsers[2],
    content:
      "<p>I have a Pink Princess I might be willing to trade! What hoyas do you have? I'm looking for Hoya Carnosa Compacta.</p>",
    createdAt: "2024-01-17T13:20:00Z",
    updatedAt: "2024-01-17T13:20:00Z",
    likes: 8,
    likedByCurrentUser: false,
    isEdited: false,
  },
];

// Mock Activities
export const mockForumActivities: ForumActivity[] = [
  {
    id: "activity-1",
    type: "new_thread",
    thread: {
      id: "thread-4",
      title: "My variegated monstera finally unfurled!",
      categoryId: "showcase",
      categoryName: "Plant Showcase",
    },
    user: mockForumUsers[1],
    createdAt: "2024-01-20T08:15:00Z",
  },
  {
    id: "activity-2",
    type: "new_reply",
    thread: {
      id: "thread-2",
      title: "Help! My monstera has yellow leaves",
      categoryId: "plant-care",
      categoryName: "Plant Care & Advice",
    },
    user: mockForumUsers[0],
    content:
      "Yellow leaves on monstera are often caused by overwatering! Once a week might be too frequent...",
    createdAt: "2024-01-18T10:15:00Z",
  },
  {
    id: "activity-3",
    type: "new_reply",
    thread: {
      id: "thread-3",
      title: "Found this beauty at the nursery - what is it?",
      categoryId: "identification",
      categoryName: "Plant Identification",
    },
    user: mockForumUsers[1],
    content: "That looks like a Philodendron Birkin! Beautiful variegation.",
    createdAt: "2024-01-19T15:00:00Z",
  },
];

// Mock Popular Threads
export const mockPopularThreads: PopularThread[] = [
  {
    thread: mockForumThreads[3], // Variegated monstera
    score: 95,
  },
  {
    thread: mockForumThreads[1], // Yellow leaves help
    score: 87,
  },
  {
    thread: mockForumThreads[0], // Welcome post
    score: 82,
  },
  {
    thread: mockForumThreads[2], // Identification
    score: 76,
  },
  {
    thread: mockForumThreads[4], // ISO trade
    score: 68,
  },
];
