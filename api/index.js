import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import admin from 'firebase-admin';

dotenv.config();

// Initialize Firebase Admin
try {
    if (!admin.apps.length) {
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.trim().replace(/^"|"$/g, '').replace(/\\n/g, '\n');

        if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !privateKey) {
            console.error('CRITICAL: Missing Firebase Environment Variables!', {
                projectId: !!process.env.FIREBASE_PROJECT_ID,
                clientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: !!privateKey
            });
        }

        admin.initializeApp({
            credential: admin.credential.cert({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: privateKey,
            }),
        });
        console.log('Firebase Admin initialized successfully');
    }
} catch (error) {
    console.error('Firebase Admin Initialization Error:', error.message);
}

const db = admin.firestore();
const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            "default-src": ["'self'"],
            "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
            "style-src": ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
            "font-src": ["'self'", "https://fonts.gstatic.com"],
            "img-src": ["'self'", "data:", "https:", "http:"],
            "connect-src": ["'self'", "https://api.ipify.org"],
        },
    },
}));
app.use(cors());
app.use(express.json());

// Rate limiting for message submission
const messageLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 15,
    message: { error: 'Too many messages sent from this IP, please try again later.' }
});

// Admin Authentication Middleware
const authenticateAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decodedToken = await admin.auth().verifyIdToken(token);
        req.user = decodedToken;
        next();
    } catch (err) {
        console.error('Auth Error:', err);
        res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Helper to read all data from Firestore
async function fetchAllData() {
    try {
        const messagesSnapshot = await db.collection('messages').orderBy('timestamp', 'desc').get();
        const messages = messagesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        const settingsDoc = await db.collection('config').doc('settings').get();
        const settings = settingsDoc.exists ? settingsDoc.data() : { requireIg: true };

        const mediaSnapshot = await db.collection('media').orderBy('timestamp', 'desc').get();
        const media = mediaSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        return { messages, settings, media };
    } catch (err) {
        console.error('Firestore Read Error:', err);
        return { messages: [], settings: { requireIg: true }, media: [] };
    }
}

// Routes
app.get('/api/settings', async (req, res) => {
    const settingsDoc = await db.collection('config').doc('settings').get();
    const settings = settingsDoc.exists ? settingsDoc.data() : { requireIg: true };
    res.json(settings);
});

app.post('/api/messages', messageLimiter, async (req, res) => {
    const { text, igUsername, ip } = req.body;
    if (!text) return res.status(400).json({ error: 'Message text is required' });

    try {
        const newMessage = {
            text,
            igUsername: igUsername || 'Atlandı',
            ip: ip || req.headers['x-forwarded-for'] || req.ip,
            timestamp: new Date().toISOString()
        };

        await db.collection('messages').add(newMessage);
        res.status(201).json({ success: true });
    } catch (err) {
        console.error('Firestore Save Error:', err);
        res.status(500).json({ error: 'Failed to save message' });
    }
});

app.get('/api/admin/data', authenticateAdmin, async (req, res) => {
    const data = await fetchAllData();
    res.json(data);
});

app.post('/api/admin/settings', authenticateAdmin, async (req, res) => {
    const { requireIg } = req.body;
    try {
        await db.collection('config').doc('settings').set({ requireIg: !!requireIg }, { merge: true });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
});

app.post('/api/admin/media', authenticateAdmin, async (req, res) => {
    const { text, timestamp } = req.body;
    try {
        await db.collection('media').add({ text, timestamp: timestamp || new Date().toISOString() });
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save media metadata' });
    }
});

// For local testing
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => console.log(`Server running locally on port ${PORT}`));
}

export default app;
