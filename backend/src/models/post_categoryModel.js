const pool = require('../db')
const BaseModel = require('./baseModel')

const { 
    convert_to_values_str,
    convert_to_key_values,
    select_where_template,
    insert_template,
    delete_template,
    model_to_json,
} = require('./helperFunctions')


class Post_Category extends BaseModel {
    static table_name = 'post_category'
    static fields = [
        'post_id', 'category_id'
    ]
    static updateable_fields =  []
    static uninsertable_fields = []

    constructor({post_id, category_id}) {
        super({post_id, category_id})
    }

    static async create(post_category_data) {
        try {
            const {post_id, category_id} = post_category_data

            const sql_insert = insert_template(this.table_name, this.fields, post_category_data)
            const [rows, fields] = await pool.promise().query(sql_insert)

            return new Post_Category(post_category_data)
        }
        catch (error) {
            console.error('Query error:', error.message);
            return null;
        }
    }

    static async delete(post_id, category_id) {
        const sql_delete = `
            DELETE FROM ${this.table_name}
            WHERE post_id = ${post_id} AND category_id = ${category_id};`

        const [rows, fields] = await pool.promise().query(sql_delete);
        if (rows.length === 0) return false
        return true
    }
}

module.exports = Post_Category