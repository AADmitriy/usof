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


class Category extends BaseModel {
    static table_name = 'category'
    static fields = [
        'title', 'description'
    ]
    static updateable_fields =  [
        'title', 'description'
    ]
    static uninsertable_fields = ['id']

    constructor({id, title, description}) {
        super({id, title, description})
    }

    static async create(category_data) {
        const {title, description = null} = category_data

        const sql_insert = insert_template(this.table_name, this.fields, category_data)
        const [rows, fields] = await pool.promise().query(sql_insert)

        category_data.id = rows.insertId

        return new Category(category_data)
    }
}

module.exports = Category