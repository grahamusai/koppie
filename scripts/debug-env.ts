import { config } from 'dotenv';
import path from 'path';

console.log('Current directory:', process.cwd());
const result = config({ path: '.env.local' });

if (result.error) {
    console.error('Error loading .env.local:', result.error);
}

console.log('DATABASE_URL loaded:', process.env.DATABASE_URL ? 'YES' : 'NO');
if (process.env.DATABASE_URL) {
    console.log('Value starts with:', process.env.DATABASE_URL.substring(0, 15));
}
