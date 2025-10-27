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


class Like extends BaseModel {
    static table_name = 'likes'
    static fields = [
        'author_id', 'post_id', 'comment_id', 'type'
    ]
    static updateable_fields =  []
    static uninsertable_fields = ['id', 'published_at']

    constructor({id, author_id, post_id, comment_id, type, published_at}) {
        super({id, author_id, post_id, comment_id, type, published_at})
    }

    static async create(like_data) {
        try {
            const {author_id, post_id = null, comment_id = null, type} = like_data
            like_data = {author_id, post_id, comment_id, type}

            const sql_insert = insert_template(this.table_name, this.fields, like_data)
            const [rows, fields] = await pool.promise().query(sql_insert)

            return new Like(like_data)
        }
        catch (error) {
            console.error('Query error:', error.message);
            return null;
        }
    }
}

module.exports = Like