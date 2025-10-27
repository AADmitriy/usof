const category = require('../models/categoryModel')
const post_category = require('../models/post_categoryModel')
const post = require('../models/postModel')
const {
    resp_msg,
    crudController
} = require('./helperFunctions')

const base = crudController(category, 'Category', 'category_id')


exports.get_all_categories = base.get_all

exports.get_category_by_id = base.get_by_id

exports.get_posts_by_category = async (req, res) => {
    const category_id = req.params.category_id

    const post_categories_data = await post_category.select_where_json({'category_id': category_id})

    const data = []

    for (let i = 0; i < post_categories_data.length; i++) {
        const post_id = post_categories_data[i]['post_id']
        const post_data = await post.findById(post_id)
        await post_data.get_categories_ids()

        data.push(post_data.to_json())
    }

    res.status(200).json({"success": true, "data": data})
}

exports.create_category = async (req, res) => {
    const {title, description = null} = req.body;

    const newCategory = { 
        title,
        description
    };

    const category_data = await category.create(newCategory)

    const category_json = category_data.to_json()

    res.status(200).json({"success": true, "message": 'Category created successfully', "category": category_json})
}

exports.update_category = base.update

exports.delete_category = base.delete