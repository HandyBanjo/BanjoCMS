const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load .env.local
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
}

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

console.log('Attempting to connect to MongoDB...');
// console.log('URI:', uri.replace(/:([^:@]+)@/, ':****@')); // Hide password

const client = new MongoClient(uri, {
   tls: true,
   tlsAllowInvalidCertificates: true, // Matching the project config
});

async function run() {
    try {
        await client.connect();
        console.log('Successfully connected to MongoDB!');
        
        const db = client.db();
        console.log(`Connected to database: ${db.databaseName}`);
        
        const output = await db.command({ ping: 1 });
        console.log('Ping result:', output);
        
        // Check collections
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

    } catch (e) {
        console.error('Connection failed:', e);
    } finally {
        await client.close();
    }
}

run();
