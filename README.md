# BanjoCMS

Content Management System for Handy Banjo website blog.

## Tech Stack

- **Next.js 15.3.4** - React framework
- **React 18** - UI library
- **TypeScript** - Type safety
- **MongoDB** - Database
- **Tailwind CSS** - Styling

## Setup Instructions

### 1. Install Dependencies

```bash
cd BanjoCMS
npm install
```

### 2. Set Up MongoDB

Make sure MongoDB is installed and running on your system:

**Windows:**
```bash
# Install MongoDB Community Edition
# Download from: https://www.mongodb.com/try/download/community

# Start MongoDB service
net start MongoDB
```

**Mac:**
```bash
brew install mongodb-community
brew services start mongodb-community
```

**Linux:**
```bash
sudo systemctl start mongod
```

### 3. Configure Environment Variables

Update `.env.local` with your settings:

```env
MONGODB_URI=mongodb://localhost:27017/banjocms
JWT_SECRET=your-super-secret-jwt-key-change-in-production
ADMIN_EMAIL=admin@handybanjo.com
ADMIN_PASSWORD=changeme123
PORT=3000
NODE_ENV=development
```

### 4. Start the Development Server

```bash
npm run dev
```

The CMS will be available at `http://localhost:3000`

### 5. Connect to HandyBanjo Website

Make sure the HandyBanjo website's `.env` file has:

```env
BANJO_CMS_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Then start the HandyBanjo website on port 3001:

```bash
cd ..
npm run dev -- -p 3001
```

## Features

- ✅ Create, edit, and delete blog posts
- ✅ Draft and publish workflow
- ✅ SEO metadata management
- ✅ Tags and categories
- ✅ Featured images
- ✅ RESTful API for content delivery
- ✅ Automatic slug generation
- ✅ View tracking

## API Endpoints

### Get All Content
```
GET /api/content?status=published&contentType=post&page=1&limit=10
```

### Get Single Content
```
GET /api/content/:id
```

### Create Content
```
POST /api/content
```

### Update Content
```
PUT /api/content/:id
```

### Delete Content
```
DELETE /api/content/:id
```

## Usage

1. Navigate to `http://localhost:3000`
2. Click "Create New Post" or "Manage Posts"
3. Fill in the post details
4. Click "Publish" or "Save as Draft"
5. Your content will automatically appear on HandyBanjo.com/blog

## Project Structure

```
BanjoCMS/
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   └── posts/          # Admin interface
│   │   ├── api/
│   │   │   └── content/        # API routes
│   │   ├── layout.tsx
│   │   └── page.tsx            # Dashboard
│   └── lib/
│       ├── mongodb.ts          # Database connection
│       └── models.ts           # Data models
├── .env.local                  # Environment variables
├── package.json
└── README.md
```

## Development Notes

- The CMS runs on port 3000 by default
- HandyBanjo website should run on port 3001 to avoid conflicts
- Both applications use the same tech stack (Next.js 15 + React 18)
- Content is stored in MongoDB and served via REST API
- The HandyBanjo website fetches content through its proxy API at `/api/blog`

## Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running: `mongod --version`
- Check connection string in `.env.local`

**Port Already in Use:**
- Change port in package.json scripts
- Update `BANJO_CMS_URL` in HandyBanjo's `.env`

**Content Not Showing:**
- Verify both servers are running
- Check browser console for API errors
- Ensure `.env` variables are set correctly
