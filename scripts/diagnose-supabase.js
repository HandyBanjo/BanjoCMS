const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Manually load .env.local because we are running with node, not next dev
const envPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const [key, value] = line.split('=');
        if (key && value) {
            process.env[key.trim()] = value.trim();
        }
    });
} else {
    console.log('.env.local not found');
}

console.log('Testing Supabase Connection...');
console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Defined' : 'Missing');
console.log('KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'Defined' : 'Missing');

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error('ERROR: Missing Credentials');
    process.exit(1);
}

try {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    console.log('Supabase client initialized successfully.');
} catch (error) {
    console.error('ERROR Initializing Client:', error.message);
}
