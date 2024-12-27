const db = require('../config/db');

class BaseModel {
    static tableName = '';

    // Tüm kayıtları getir
    static async getAll(filters = {}) {
        const { limit, offset, orderBy = 'id', orderDir = 'ASC' } = filters;
        
        let query = `SELECT * FROM ${this.tableName}`;
        const values = [];
        let valueIndex = 1;

        // Sıralama
        query += ` ORDER BY ${orderBy} ${orderDir}`;

        // Limit ve offset
        if (limit) {
            query += ` LIMIT $${valueIndex}`;
            values.push(limit);
            valueIndex++;
        }

        if (offset) {
            query += ` OFFSET $${valueIndex}`;
            values.push(offset);
        }

        const result = await db.query(query, values);
        return result.rows;
    }

    // ID'ye göre kayıt getir
    static async getById(id) {
        const query = `SELECT * FROM ${this.tableName} WHERE id = $1`;
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('Kayıt bulunamadı');
        }
        
        return result.rows[0];
    }

    // Yeni kayıt oluştur
    static async create(data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
        
        const query = `
            INSERT INTO ${this.tableName} (${columns.join(', ')})
            VALUES (${placeholders})
            RETURNING *
        `;
        
        const result = await db.query(query, values);
        return result.rows[0];
    }

    // Kayıt güncelle
    static async update(id, data) {
        const columns = Object.keys(data);
        const values = Object.values(data);
        const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
        
        const query = `
            UPDATE ${this.tableName}
            SET ${setClause}
            WHERE id = $${values.length + 1}
            RETURNING *
        `;
        
        const result = await db.query(query, [...values, id]);
        
        if (result.rows.length === 0) {
            throw new Error('Kayıt bulunamadı');
        }
        
        return result.rows[0];
    }

    // Kayıt sil
    static async delete(id) {
        const query = `DELETE FROM ${this.tableName} WHERE id = $1 RETURNING *`;
        const result = await db.query(query, [id]);
        
        if (result.rows.length === 0) {
            throw new Error('Kayıt bulunamadı');
        }
        
        return result.rows[0];
    }

    // Toplu kayıt oluştur
    static async bulkCreate(dataArray) {
        const client = await db.getClient();
        
        try {
            await client.query('BEGIN');
            
            const results = [];
            for (const data of dataArray) {
                const columns = Object.keys(data);
                const values = Object.values(data);
                const placeholders = values.map((_, i) => `$${i + 1}`).join(', ');
                
                const query = `
                    INSERT INTO ${this.tableName} (${columns.join(', ')})
                    VALUES (${placeholders})
                    RETURNING *
                `;
                
                const result = await client.query(query, values);
                results.push(result.rows[0]);
            }
            
            await client.query('COMMIT');
            return results;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Toplu kayıt güncelle
    static async bulkUpdate(dataArray) {
        const client = await db.getClient();
        
        try {
            await client.query('BEGIN');
            
            const results = [];
            for (const { id, ...data } of dataArray) {
                const columns = Object.keys(data);
                const values = Object.values(data);
                const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
                
                const query = `
                    UPDATE ${this.tableName}
                    SET ${setClause}
                    WHERE id = $${values.length + 1}
                    RETURNING *
                `;
                
                const result = await client.query(query, [...values, id]);
                
                if (result.rows.length === 0) {
                    throw new Error(`ID ${id} için kayıt bulunamadı`);
                }
                
                results.push(result.rows[0]);
            }
            
            await client.query('COMMIT');
            return results;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    // Toplu kayıt sil
    static async bulkDelete(ids) {
        const client = await db.getClient();
        
        try {
            await client.query('BEGIN');
            
            const placeholders = ids.map((_, i) => `$${i + 1}`).join(', ');
            const query = `DELETE FROM ${this.tableName} WHERE id IN (${placeholders}) RETURNING *`;
            
            const result = await client.query(query, ids);
            
            if (result.rows.length !== ids.length) {
                throw new Error('Bazı kayıtlar bulunamadı');
            }
            
            await client.query('COMMIT');
            return result.rows;
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = BaseModel; 