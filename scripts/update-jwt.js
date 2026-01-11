import fs from 'fs';
import path from 'path';

const envPath = path.resolve(process.cwd(), '.env.local');
// The user provided NEW JWT
const jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiIxZWM0M2M1MC0zZDE0LTRkYmMtOTJhYS03MDc1NDI0Yjc5YmYiLCJlbWFpbCI6Imp1c3Rmb3Jicm93c2luZzk5QGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkMTcxODFjOWVjMDBhZDY1YWE1OCIsInNjb3BlZEtleVNlY3JldCI6IjExYWM4ZDgzMmFmNjc4YmMyMzBkYTgwMGFmZDFkNGNiOThmMGQ2MGRhOWJhYWMyMTUwYzgzMDgyNmJmYjk3NTMiLCJleHAiOjE3OTk2NjExMTN9.dvGn0u2n4ZTpXlP1wEfZ5PaRY52_FTtIs03nwLu5kSA";

try {
    let content = '';
    if (fs.existsSync(envPath)) {
        content = fs.readFileSync(envPath, 'utf8');
    }

    const lines = content.split(/\r?\n/);
    let found = false;
    const newLines = lines.map(line => {
        if (line.trim().startsWith('PINATA_JWT=')) {
            found = true;
            return `PINATA_JWT=${jwt}`;
        }
        return line;
    });

    if (!found) {
        newLines.push(`PINATA_JWT=${jwt}`);
    }

    fs.writeFileSync(envPath, newLines.join('\n'));
    console.log(`Updated PINATA_JWT in .env.local to new value.`);

} catch (err) {
    console.error('Error updating .env.local:', err);
}
