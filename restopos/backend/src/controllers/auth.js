const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { jwtSecret: JWT_SECRET, jwtRefreshSecret: JWT_REFRESH_SECRET } = require('../config');

// Login işlemi
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        console.log('Login attempt:', { email, password });
        
        // Kullanıcıyı veritabanında ara
        const result = await db.query(
            'SELECT * FROM kullanicilar WHERE email = $1',
            [email]
        );
        
        const user = result.rows[0];
        
        if (!user) {
            console.log('User not found:', email);
            return res.status(401).json({ error: 'Kullanıcı bulunamadı' });
        }
        
        console.log('User found:', { 
            id: user.id, 
            email: user.email,
            hashedPassword: user.sifre
        });
        
        // Şifre kontrolü
        const validPassword = await bcrypt.compare(password, user.sifre);
        console.log('Password validation:', { 
            password,
            hashedPassword: user.sifre,
            isValid: validPassword 
        });
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Geçersiz şifre' });
        }
        
        // Access token oluştur
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.rol_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Refresh token oluştur
        const refreshToken = jwt.sign(
            { userId: user.id },
            JWT_REFRESH_SECRET,
            { expiresIn: '7d' }
        );
        
        // Refresh token'ı veritabanına kaydet ve son giriş tarihini güncelle
        await db.query(
            'UPDATE kullanicilar SET refresh_token = $1, son_giris_tarihi = NOW() WHERE id = $2',
            [refreshToken, user.id]
        );
        
        res.json({
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                ad: user.ad,
                soyad: user.soyad,
                rol: user.rol_id
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

// Kayıt işlemi
const register = async (req, res) => {
    try {
        const { email, password, ad, soyad, rol_id } = req.body;
        
        // Email kontrolü
        const userExists = await db.query(
            'SELECT * FROM kullanicilar WHERE email = $1',
            [email]
        );
        
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'Bu email adresi zaten kullanımda' });
        }
        
        // Şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // Kullanıcıyı kaydet
        const result = await db.query(
            'INSERT INTO kullanicilar (email, sifre, ad, soyad, rol_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [email, hashedPassword, ad, soyad, rol_id]
        );
        
        const user = result.rows[0];
        
        res.status(201).json({
            message: 'Kullanıcı başarıyla oluşturuldu',
            user: {
                id: user.id,
                email: user.email,
                ad: user.ad,
                soyad: user.soyad,
                rol: user.rol_id
            }
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

// Token yenileme
const refreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;
        
        if (!refreshToken) {
            return res.status(401).json({ error: 'Refresh token gerekli' });
        }
        
        // Token'ı doğrula
        const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
        
        // Kullanıcıyı kontrol et
        const result = await db.query(
            'SELECT * FROM kullanicilar WHERE id = $1 AND refresh_token = $2',
            [decoded.userId, refreshToken]
        );
        
        const user = result.rows[0];
        
        if (!user) {
            return res.status(401).json({ error: 'Geçersiz refresh token' });
        }
        
        // Yeni access token oluştur
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email, role: user.rol_id },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        res.json({ accessToken });
    } catch (error) {
        console.error('Refresh token error:', error);
        res.status(401).json({ error: 'Geçersiz refresh token' });
    }
};

// Çıkış işlemi
const logout = async (req, res) => {
    try {
        // Refresh token'ı temizle
        await db.query(
            'UPDATE kullanicilar SET refresh_token = NULL WHERE id = $1',
            [req.user.userId]
        );
        
        res.json({ message: 'Başarıyla çıkış yapıldı' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

// Şifre sıfırlama isteği
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Kullanıcıyı kontrol et
        const result = await db.query(
            'SELECT * FROM kullanicilar WHERE email = $1',
            [email]
        );
        
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı' });
        }
        
        // Şifre sıfırlama token'ı oluştur
        const resetToken = jwt.sign(
            { email },
            JWT_SECRET,
            { expiresIn: '1h' }
        );
        
        // Token'ı veritabanına kaydet
        await db.query(
            'UPDATE kullanicilar SET reset_token = $1 WHERE email = $2',
            [resetToken, email]
        );
        
        // TODO: Email gönderme işlemi eklenecek
        
        res.json({ message: 'Şifre sıfırlama bağlantısı email adresinize gönderildi' });
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

// Şifre sıfırlama
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        
        // Token'ı doğrula
        const decoded = jwt.verify(token, JWT_SECRET);
        
        // Kullanıcıyı bul
        const result = await db.query(
            'SELECT * FROM kullanicilar WHERE email = $1 AND reset_token = $2',
            [decoded.email, token]
        );
        
        if (result.rows.length === 0) {
            return res.status(400).json({ error: 'Geçersiz veya süresi dolmuş token' });
        }
        
        // Yeni şifreyi hashle
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        
        // Şifreyi güncelle ve reset token'ı temizle
        await db.query(
            'UPDATE kullanicilar SET sifre = $1, reset_token = NULL WHERE email = $2',
            [hashedPassword, decoded.email]
        );
        
        res.json({ message: 'Şifre başarıyla güncellendi' });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ error: 'Sunucu hatası' });
    }
};

module.exports = {
    login,
    register,
    refreshToken,
    logout,
    forgotPassword,
    resetPassword
}; 