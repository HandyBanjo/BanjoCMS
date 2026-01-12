const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/banjocms';

async function seedSamplePost() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected successfully!');
    
    const db = client.db();
    const collection = db.collection('content');
    
    // Read sample post
    const samplePostPath = path.join(__dirname, '..', 'sample-post.json');
    const samplePost = JSON.parse(fs.readFileSync(samplePostPath, 'utf8'));
    
    // Add timestamps
    samplePost.createdAt = new Date();
    samplePost.updatedAt = new Date();
    samplePost.publishedAt = new Date();
    
    // Check if post already exists
    const existing = await collection.findOne({ slug: samplePost.slug });
    
    if (existing) {
      console.log('Sample post already exists. Skipping...');
    } else {
      // Insert sample post
      const result = await collection.insertOne(samplePost);
      console.log('Sample post created successfully!');
      console.log('Post ID:', result.insertedId);
    }
    
    console.log('\nYou can now view your blog at: http://localhost:3001/blog');
    
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('\nDatabase connection closed.');
  }
}

seedSamplePost();
