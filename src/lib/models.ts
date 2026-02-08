
export type ContentStatus = 'draft' | 'published' | 'archived';
export type ContentType = 'post' | 'update' | 'resource' | 'press' | 'feed';
export type UpdateType = 'feature' | 'improvement' | 'fix';
export type Platform = 'instagram' | 'linkedin' | 'youtube' | 'twitter' | 'facebook' | 'other';

export interface Content {
  id: string;
  title: string;
  slug: string;
  content_type: ContentType;
  status: ContentStatus;
  body: string;
  excerpt: string;
  featured_image?: string;
  
  author_id: string;
  author_name: string;
  author_email: string;

  // Specific Type Fields (stored in metadata but typed here for helper usage if mapped)
  platform?: Platform; // for social/feed
  update_type?: UpdateType; // for updates
  version?: string; // for updates
  parent_id?: string; // for resources
  external_link?: string; // for press

  metadata: {
    // Analytics
    views?: number;
    likes?: number;

    // Organization
    tags?: string[];
    categories?: string[];

    // Advanced SEO
    seo?: {
        metaTitle?: string;
        metaDescription?: string;
        ogImage?: string;
        keywords?: string[];
        canonicalUrl?: string;
        schemaType?: 'Article' | 'NewsArticle' | 'BlogPosting' | 'TechArticle';
    };

    // GEO (Local SEO)
    geo?: {
        region?: string; // e.g. "US-NY"
        placename?: string; // e.g. "New York"
        position?: string; // "lat;long"
    };

    // AEO (Answer Engine Optimization)
    aeo?: {
        question?: string;
        answerSnippet?: string; // 40-60 words concise answer
    };

    // Specialized
    changelog?: string[]; // list of changes
    faq?: { question: string; answer: string }[];
    steps?: { title: string; body: string }[]; // How-to steps
    
    [key: string]: any;
  };

  created_at: string;
  updated_at: string;
  published_at?: string;
}

export interface ContentQuery {
  status?: string;
  contentType?: string;
  page?: number;
  limit?: number;
  search?: string;
}
