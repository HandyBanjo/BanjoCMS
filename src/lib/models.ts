import type { ObjectId } from 'mongodb';

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'editor' | 'author';
  createdAt: Date;
  updatedAt: Date;
}

export type ContentStatus = 'draft' | 'published' | 'archived';
export type UpdateType = 'feature' | 'improvement' | 'fix';
export type ImpactLevel = 'major' | 'minor' | 'patch';
export type SocialPlatform = 'instagram' | 'linkedin' | 'youtube' | 'twitter' | 'facebook' | 'other';

export interface BaseContent {
  _id?: ObjectId;
  title: string;
  slug: string;
  contentType: string;
  status: ContentStatus;
  author: {
    _id: ObjectId | string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;
}

export interface BlogContent extends BaseContent {
  contentType: 'post';
  body: string;
  excerpt: string;
  featuredImage?: string;
  metadata: {
    views: number;
    likes: number;
    tags: string[];
    categories: string[];
    seo?: {
      metaTitle?: string;
      metaDescription?: string;
      ogImage?: string;
      keywords?: string[];
    };
  };
}

export interface ResourceContent extends BaseContent {
  contentType: 'resource';
  body: string;
  summary: string;
  version?: string;
  parentId?: string; // For nested documentation
  attachments?: {
    name: string;
    url: string;
    type: string;
    size?: number;
  }[];
  metadata: {
    views: number;
    tags: string[];
    categories: string[]; // e.g. "Getting Started", "Tutorials"
  };
}

export interface SocialContent extends BaseContent {
  contentType: 'social';
  platform: SocialPlatform;
  embedCode?: string;
  description?: string;
  postUrl?: string; // Direct link to original post
  images?: string[]; // If manually uploading instead of embedding
  metadata: {
    tags: string[];
    likes: number; // Internal likes
  };
}

export interface UpdateContent extends BaseContent {
  contentType: 'update';
  updateType: UpdateType;
  version: string;
  impactLevel?: ImpactLevel;
  summary: string;
  body: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    caption?: string;
  }[]; // Screenshots/Videos
  metadata: {
    tags: string[];
  };
}

export type Content = BlogContent | ResourceContent | SocialContent | UpdateContent;

export interface ContentQuery {
  status?: string;
  contentType?: string;
  platform?: string;
  parentId?: string;
  updateType?: string;
  page?: number;
  limit?: number;
  search?: string; // For unified search
}
