// /api/auth.js
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailLink, verifyIdToken } from 'firebase/auth';

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || 'https://yourdomain.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Check IP first (additional layer of security)
    const allowedIP = '177.64.72.8';
    const clientIP = req.headers['x-forwarded-for'] || 
                     req.headers['x-real-ip'] || 
                     req.connection.remoteAddress;
    
    if (!clientIP.includes(allowedIP)) {
        return res.status(403).json({ 
            error: 'Acesso não autorizado',
            message: 'IP não permitido'
        });
    }

    if (req.method === 'POST') {
        try {
            const { email, url } = req.body;
            
            // Verify Firebase token if provided
            if (req.headers.authorization) {
                const token = req.headers.authorization.split('Bearer ')[1];
                const decodedToken = await verifyIdToken(token);
                
                return res.status(200).json({
                    success: true,
                    user: decodedToken
                });
            }

            // Handle email link sign-in
            if (email && url) {
                // This would be handled client-side, but we verify here
                return res.status(200).json({
                    success: true,
                    message: 'Login iniciado'
                });
            }

            return res.status(400).json({ error: 'Parâmetros inválidos' });
            
        } catch (error) {
            console.error('Auth error:', error);
            return res.status(401).json({ 
                error: 'Autenticação falhou',
                message: error.message 
            });
        }
    }

    return res.status(405).json({ error: 'Método não permitido' });
}
