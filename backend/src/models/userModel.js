const pool = require('../db')
const BaseModel = require('./baseModel')

const { 
    convert_to_values_str,
    convert_to_key_values,
    select_where_template,
    insert_template,
    update_template,
    delete_template,
    model_to_json,
} = require('./helperFunctions')


class User extends BaseModel {
    static table_name = 'user'
    static fields = [
        'login', 'password_hash', 
        'full_name', 'email', 'profile_picture',
        'role', 'is_verified'
    ]
    static updateable_fields =  [
        'login', 'full_name', 'email'
    ]
    static uninsertable_fields = ['id', 'rating']

    constructor({id, login, password_hash, full_name=null, email, profile_picture=null, role, is_verified = true, rating=null}) {
        super({id, login, password_hash, full_name, email, profile_picture, role, is_verified, rating})
    }

    static async findByEmail(email) {
        const query = select_where_template(this.table_name, {'email': email})
        const [rows, fields] = await pool.promise().query(query);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }

    static async findByLogin(login) {
        const query = select_where_template(this.table_name, {'login': login})
        const [rows, fields] = await pool.promise().query(query);
        if (rows.length === 0) return null;
        return new User(rows[0]);
    }
    
    static async create(user_data) {
        const {login, password_hash, full_name=null, email, profile_picture=null, role, is_verified = true} = user_data
        
        const sql_insert = insert_template(this.table_name, this.fields, user_data)
        const [rows, fields] = await pool.promise().query(sql_insert)
        user_data.id = rows.insertId
        
        return new User(user_data)
    }

    async set_rating() {
        const select_rating = `
        SELECT COALESCE(SUM(
            CASE
                WHEN l.type = 'like' THEN 1
                WHEN l.type = 'dislike' THEN -1
                ELSE 0
            END), 0) AS rating
        FROM likes l
        LEFT JOIN post p     ON l.post_id = p.id
        LEFT JOIN comment c  ON l.comment_id = c.id
        WHERE p.author_id = ${this.id} OR c.author_id = ${this.id};`

        const [rows, fields] = await pool.promise().query(select_rating)
        this.rating = rows[0]['rating']
    }
}


module.exports = User