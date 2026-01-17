// /api/protect.js
export default function handler(req, res) {
    // This API endpoint can be used to validate client-side protections
    // or implement server-side checks
    
    const protectionMethods = {
        devtoolsDetection: true,
        ipWhitelisting: true,
        rateLimiting: true,
        corsProtection: true,
        firebaseAuth: true
    };

    res.status(200).json({
        protected: true,
        methods: protectionMethods,
        timestamp: new Date().toISOString(),
        message: 'Sistema de proteção ativo'
    });
}
