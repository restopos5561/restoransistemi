require('dotenv').config();

module.exports = {
    // JWT Secrets
    jwtSecret: process.env.JWT_SECRET || 'your-jwt-secret',
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'your-jwt-refresh-secret',
    jwtResetSecret: process.env.JWT_RESET_SECRET || 'your-jwt-reset-secret',

    // Database
    database: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'restopos_db',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || '1234'
    },

    // Server
    port: process.env.PORT || 3000,
    nodeEnv: process.env.NODE_ENV || 'development',

    // Cors
    corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',

    // Email
    email: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
        from: process.env.EMAIL_FROM || 'noreply@restopos.com'
    }
}; 