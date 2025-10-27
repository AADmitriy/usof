const pool = require('../db')

const { 
    convert_to_values_str,
    convert_to_key_values,
    select_where_template,
    insert_template,
    update_template,
    delete_template,
    model_to_json,
} = require('./helperFunctions')


class BaseModel {
    static table_name = null
    static fields = []
    static updateable_fields = []
    static admin_updateable_fields = []
    static uninsertable_fields = []

    constructor(data) {
        Object.assign(this, data)
    }

    static async all() {
        const [rows, fields] = await pool.promise().query(`SELECT * FROM ${this.table_name}`);
        return rows.map(row => new this(row));
    }

    static async all_json() {
        const all_models = await this.all()
        const all_json = []
        
        for (const model of all_models) {
            all_json.push(model.to_json())
        }

        return all_json
    }

    static async select_where(key_values) {
        const query = select_where_template(this.table_name, key_values)
        const [rows, fields] = await pool.promise().query(query);
        return rows.map(row => new this(row))
    }

    static async select_where_json(key_values) {
        const models = await this.select_where(key_values)
        return models.map(model => model.to_json())
    }

    static async findById(id) {
        const query = select_where_template(this.table_name, {'id': id})
        const [rows, fields] = await pool.promise().query(query);
        if (rows.length === 0) return null;
        return new this(rows[0]);
    }

    static async findById_json(id) {
        const user_data = await this.findById(id)

        if (null == user_data) return null;

        return user_data.to_json()
    }

    static async delete(id) {
        const sql_delete = delete_template(this.table_name, id)

        const [rows, fields] = await pool.promise().query(sql_delete);
        if (rows.length === 0) return false
        return true
    }



    set_values(data) {
        if (data == undefined) {
            return false
        }

        const data_keys = Object.keys(data)

        if (data_keys.length == 0) {
            return false
        }

        const has_unallowed_keys = !data_keys.every(key => this.constructor.updateable_fields.includes(key))
        if (has_unallowed_keys) return false

        for (const field of this.constructor.updateable_fields) {
            if (data_keys.includes(field)) {
                this[field] = data[field]
            }
        }

        return true
    }

    set_values_admin(data) {
        if (data == undefined) {
            return false
        }

        const data_keys = Object.keys(data)

        if (data_keys.length == 0) {
            return false
        }

        const has_unallowed_keys = !data_keys.every(key => this.constructor.admin_updateable_fields.includes(key))
        if (has_unallowed_keys) return false

        for (const field of this.constructor.admin_updateable_fields) {
            if (data_keys.includes(field)) {
                this[field] = data[field]
            }
        }

        return true
    }

    async save() {
        const sql_update = update_template(
            this.constructor.table_name, this.constructor.fields, this
        )

        try {
            await pool.promise().query(sql_update)
            return true
        }
        catch (error) {
            console.error('Query error:', error.message);
            return false;
        }
    }

    to_json() {
        const fields = this.constructor.uninsertable_fields.concat(this.constructor.fields)
        return model_to_json(this, fields)
    }
}

module.exports = BaseModel