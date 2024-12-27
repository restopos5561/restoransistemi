const BaseModel = require('./BaseModel');
const db = require('../config/db');

class Upload extends BaseModel {
    static tableName = 'uploads';

    // Dosya yükle
    static async create(data) {
        const {
            originalname,
            encoding,
            mimetype,
            destination,
            filename,
            path,
            size,
            kullanici_id
        } = data;

        const [id] = await db(this.tableName)
            .insert({
                original_name: originalname,
                encoding,
                mime_type: mimetype,
                destination,
                filename,
                path,
                size,
                kullanici_id,
                created_at: db.fn.now()
            })
            .returning('id');

        return this.getById(id);
    }

    // Dosya bilgilerini getir
    static async getById(id) {
        return db(this.tableName)
            .where('id', id)
            .where('deleted_at', null)
            .first();
    }

    // Tüm dosyaları getir
    static async getAll(filters = {}) {
        const query = db(this.tableName)
            .where('deleted_at', null)
            .orderBy('created_at', 'desc');

        // Filtreleri uygula
        if (filters.type) {
            query.where('mime_type', 'like', `${filters.type}%`);
        }

        if (filters.min_size) {
            query.where('size', '>=', filters.min_size);
        }

        if (filters.max_size) {
            query.where('size', '<=', filters.max_size);
        }

        if (filters.search) {
            query.where('original_name', 'like', `%${filters.search}%`);
        }

        // Sayfalama
        const page = parseInt(filters.page) || 1;
        const limit = parseInt(filters.limit) || 20;
        const offset = (page - 1) * limit;

        const [total] = await db(this.tableName)
            .where('deleted_at', null)
            .count('* as count');

        const data = await query
            .limit(limit)
            .offset(offset);

        return {
            data,
            pagination: {
                total: total.count,
                page,
                limit
            }
        };
    }

    // Dosya sil (soft delete)
    static async delete(id) {
        return db(this.tableName)
            .where('id', id)
            .update({
                deleted_at: db.fn.now()
            });
    }

    // Dosya türüne göre getir
    static async getByType(type) {
        return db(this.tableName)
            .where('mime_type', 'like', `${type}%`)
            .where('deleted_at', null)
            .orderBy('created_at', 'desc');
    }

    // Kullanıcıya göre dosyaları getir
    static async getByUser(kullanici_id) {
        return db(this.tableName)
            .where('kullanici_id', kullanici_id)
            .where('deleted_at', null)
            .orderBy('created_at', 'desc');
    }

    // Dosya boyutuna göre getir
    static async getBySize(min_size, max_size) {
        const query = db(this.tableName)
            .where('deleted_at', null);

        if (min_size) {
            query.where('size', '>=', min_size);
        }

        if (max_size) {
            query.where('size', '<=', max_size);
        }

        return query.orderBy('size', 'desc');
    }

    // Dosya adına göre ara
    static async searchByName(query) {
        return db(this.tableName)
            .where('original_name', 'like', `%${query}%`)
            .where('deleted_at', null)
            .orderBy('created_at', 'desc');
    }

    // Dosya istatistiklerini getir
    static async getStats() {
        const [result] = await db(this.tableName)
            .where('deleted_at', null)
            .select(
                db.raw('COUNT(*) as total_files'),
                db.raw('SUM(size) as total_size'),
                db.raw('AVG(size) as avg_size'),
                db.raw('COUNT(DISTINCT mime_type) as unique_types')
            );

        return result;
    }

    // Dosya meta verilerini güncelle
    static async updateMetadata(id, metadata, kullanici_id) {
        await db(this.tableName)
            .where('id', id)
            .update({
                metadata: JSON.stringify(metadata),
                updated_at: db.fn.now(),
                updated_by: kullanici_id
            });

        return this.getById(id);
    }

    // Dosya etiketlerini güncelle
    static async updateTags(id, tags, kullanici_id) {
        await db(this.tableName)
            .where('id', id)
            .update({
                tags: JSON.stringify(tags),
                updated_at: db.fn.now(),
                updated_by: kullanici_id
            });

        return this.getById(id);
    }

    // Dosya açıklamasını güncelle
    static async updateDescription(id, description, kullanici_id) {
        await db(this.tableName)
            .where('id', id)
            .update({
                description,
                updated_at: db.fn.now(),
                updated_by: kullanici_id
            });

        return this.getById(id);
    }

    // Dosya kategorisini güncelle
    static async updateCategory(id, category, kullanici_id) {
        await db(this.tableName)
            .where('id', id)
            .update({
                category,
                updated_at: db.fn.now(),
                updated_by: kullanici_id
            });

        return this.getById(id);
    }
}

module.exports = Upload; 