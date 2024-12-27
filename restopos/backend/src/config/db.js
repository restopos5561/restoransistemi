const { Pool } = require('pg');
const config = require('./index');

// Veritabanı havuzu oluştur
const pool = new Pool({
    host: config.database.host,
    port: config.database.port,
    database: config.database.database,
    user: config.database.user,
    password: config.database.password,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

// Bağlantı hatalarını dinle
pool.on('error', (err, client) => {
    console.error('Beklenmeyen veritabanı hatası:', err);
    process.exit(-1);
});

// Veritabanı işlemleri için yardımcı fonksiyonlar
const db = {
    /**
     * Veritabanı bağlantısını test et
     */
    async connect() {
        const client = await pool.connect();
        try {
            await client.query('SELECT NOW()');
            return true;
        } finally {
            client.release();
        }
    },

    /**
     * Veritabanı havuzunu kapat
     */
    async end() {
        await pool.end();
    },

    /**
     * SQL sorgusu çalıştır
     * @param {string} text - SQL sorgusu
     * @param {Array} params - Sorgu parametreleri
     */
    async query(text, params) {
        const start = Date.now();
        try {
            const res = await pool.query(text, params);
            const duration = Date.now() - start;
            console.log('SQL Sorgusu:', { text, duration, rows: res.rowCount });
            return res;
        } catch (err) {
            console.error('Sorgu hatası:', err);
            throw err;
        }
    },

    /**
     * Tek bir satır getir
     * @param {string} text - SQL sorgusu
     * @param {Array} params - Sorgu parametreleri
     */
    async queryOne(text, params) {
        const res = await this.query(text, params);
        return res.rows[0];
    },

    /**
     * Transaction başlat
     */
    async beginTransaction() {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');
            return client;
        } catch (err) {
            client.release();
            throw err;
        }
    },

    /**
     * Transaction'ı onayla
     * @param {Object} client - Veritabanı istemcisi
     */
    async commitTransaction(client) {
        try {
            await client.query('COMMIT');
        } finally {
            client.release();
        }
    },

    /**
     * Transaction'ı geri al
     * @param {Object} client - Veritabanı istemcisi
     */
    async rollbackTransaction(client) {
        try {
            await client.query('ROLLBACK');
        } finally {
            client.release();
        }
    }
};

module.exports = db; 