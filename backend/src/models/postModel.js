const pool = require('../db')
const BaseModel = require('./baseModel')
const post_category = require('./post_categoryModel')
const category = require('./categoryModel')

const { 
    convert_to_values_str,
    convert_to_key_values,
    select_where_template,
    insert_template,
    delete_template,
    model_to_json,
    query_constructor,
} = require('./helperFunctions')



class Post extends BaseModel {
    static table_name = 'post'
    static fields = [
        'author_id', 'title', 
        'status', 'content',
    ]
    static updateable_fields =  [
        'title', 'content', 'categories'
    ]
    static admin_updateable_fields = ['status', 'categories']
    static uninsertable_fields = [
        'id', 'published_at', 'categories', 'rating'
    ]

    constructor({id, author_id, published_at, title, status, content, categories = [], rating=null}) {
        super({id, author_id, published_at, title, status, content, categories, rating})
    }

    static async all({sort_by="likes", status=null, categories=null, start_date=null, end_date=null, user_id=null}) {
        const query_options = {
            'cte': null,
            'table_name': this.table_name,
            'where_key_values': null,
            'select_all': true,
            'values_to_select': [],
            'order_by': null
        }

        let table_name = this.table_name
        
        if (user_id == -1) {
            const all_active_plus_all_for_user = `
            WITH allowed_posts as (
            SELECT * FROM post
            WHERE post.status = "active")
            `
            query_options.cte = all_active_plus_all_for_user
            query_options.table_name = "allowed_posts"
            table_name = "allowed_posts"
        }
        else if (null != user_id) {
            const all_active_plus_all_for_user = `
            WITH allowed_posts as (
            SELECT * FROM post
            WHERE post.status = "active"
            UNION
            SELECT * FROM post
            WHERE author_id = ${user_id})
            `
            query_options.cte = all_active_plus_all_for_user
            query_options.table_name = "allowed_posts"
            table_name = "allowed_posts"
        }
        

        
       
        

        const select_rating_query = query_constructor({
            "table_name": "likes",
            "select_all": false,
            "values_to_select": ["SUM(CASE WHEN type = 'like' THEN 1 ELSE 0 END)"],
            "where_key_values": {"__specialpost_id = ": `${table_name}.id`}
        }) 

        query_options.values_to_select.push(`( ${select_rating_query} ) as rating`)

        if (sort_by == "likes") {
            query_options.order_by = `rating DESC`
        }
        else if (sort_by == "date") {
            query_options.order_by = `published_at DESC`
        }
        else {
            return null
        }

        
        if (status!=null || categories!=null || start_date!=null || end_date!=null) {
            query_options.where_key_values = {}
        }
        if (null != status) {
            query_options.where_key_values.status = status
        }
        if (null != start_date) {
            query_options.where_key_values['__specialpublished_at > '] = '"' + start_date + '"'
        }
        if (null !=  end_date) {
            query_options.where_key_values['__specialpublished_at < '] = '"' + end_date + '"'
        }
        if (null != categories) {
            const select_post_categories = query_constructor({
                "table_name": "post_category",
                "select_all": false,
                "values_to_select": ["category_id"],
                "where_key_values": {"__specialpost_id = ": `${table_name}.id`}
            }) 
            for (let i = 0; i < categories.length; i++) {
                const category_id = categories[i]
                query_options.where_key_values[`__special${category_id} in `] = '(' + select_post_categories + ')'
            }
        }


        const select_query = query_constructor(query_options)
        const [rows, fields] = await pool.promise().query(select_query);
        if (rows.length == 0) { return null }
        return rows.map(row => new this(row));
    }

    static async create(post_data) {
        const {author_id, title, status, content} = post_data

        const sql_insert = insert_template(this.table_name, this.fields, post_data)
        const [rows, fields] = await pool.promise().query(sql_insert)

        post_data.id = rows.insertId

        return new Post(post_data)
    }


    async save({save_only_categories = false}) {
        if (this.categories.length != 0) {
            const new_categories = this.categories
            await this.get_categories_ids()
            const categories_to_delete = this.categories.filter(
                (item) => !new_categories.includes(item)
            );
            const categories_to_add = new_categories.filter(
                (item) => !this.categories.includes(item)
            )

            categories_to_delete.forEach(async (category_id) => {
                await post_category.delete(this.id, category_id)
            })
            categories_to_add.forEach(async (category_id) => {
                await post_category.create({'post_id': this.id, category_id})
            })
        }
        if (!save_only_categories) {
            return await super.save()
        }
        else {
            return true
        }
        
    }

    async get_categories_ids() {
        const post_categories_data = await post_category.select_where_json({'post_id': this.id})
        const categories = []
    
        for (let i = 0; i < post_categories_data.length; i++) {
            categories.push(post_categories_data[i]['category_id'])
        }
        this.categories = categories
    }
    async get_categories_data() {
        if (this.categories.length == 0) {
            await this.get_categories_ids()
        }

        const data = await Promise.all(
            this.categories.map(category_id => category.findById_json(category_id))
        )

        this.categories = data
    }
}

module.exports = Post