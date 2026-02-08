const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Load .env.local
try {
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
} catch (e) {
    console.error('Error reading .env file:', e);
}

const uri = process.env.MONGODB_URI;

if (!uri) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
}

console.log('URI used (masked):', uri.replace(/:([^:@]+)@/, ':****@'));

const client = new MongoClient(uri, {
   serverSelectionTimeoutMS: 5000, 
   tls: true,
   tlsAllowInvalidCertificates: true,
});

async function run() {
    try {
        console.log('Connecting...');
        await client.connect();
        console.log('CONNECTED successfully!');
        
        await client.db().command({ ping: 1 });
        console.log('Database Ping: SUCCESS');
        
    } catch (e) {
        console.error('------- CONNECTION ERROR -------');
        console.error('Name:', e.name);
        console.error('Message:', e.message);
        if (e.cause) console.error('Cause:', e.cause);
        console.error('--------------------------------');
    } finally {
        await client.close();
    }
}

run();
