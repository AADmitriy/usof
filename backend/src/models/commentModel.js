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


class Comment extends BaseModel {
    static table_name = 'comment'
    static fields = [
        'author_id', 'post_id',
        'content', 'status'
    ]
    static updateable_fields =  [
        'content'
    ]
    static admin_updateable_fields = ['status']
    static uninsertable_fields = ['id', 'published_at', 'status']

    constructor({id, author_id, post_id, content, published_at, status}) {
        super({id, author_id, post_id, content, published_at, status})
    }

    static async create(comment_data) {
        const {author_id, post_id, content, status='active'} = comment_data
        comment_data = {author_id, post_id, content, status}

        const sql_insert = insert_template(this.table_name, this.fields, comment_data)
        const [rows, fields] = await pool.promise().query(sql_insert)

        comment_data.id = rows.insertId

        return new Comment(comment_data)
    }
}

module.exports = Comment