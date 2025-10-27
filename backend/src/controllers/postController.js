const post = require('../models/postModel')
const comment = require('../models/commentModel')
const post_category = require('../models/post_categoryModel')
const { likeController } = require('./likeController')
const { resp_msg } = require('./helperFunctions')


const likeBase = likeController(post, "Post", 'post_id')


exports.get_all_posts = async (req, res) => {
    const allowed_filters = ['sort_by', 'status', 'categories', 'start_date', 'end_date']

    const filters_keys = Object.keys(req.query)
    const has_unallowed_keys = !filters_keys.every(key => allowed_filters.includes(key))
    if (has_unallowed_keys) {
        return res.status(400).json(resp_msg(false, "Invalid query options provided"))
    }

    const post_lookup_options = req.query || {}

    if (req.session.role == 'user') {
        post_lookup_options.user_id = req.session.userId
    }
    else if (!req.session.userId) {
        post_lookup_options.user_id = -1
    }

    const all_posts = await post.all(post_lookup_options)

    if (null == all_posts) {
        return res.status(400).json(resp_msg(false, "No data found"))
    }

    const data = await Promise.all(all_posts.map(async (model) => {
        await model.get_categories_ids()
        return model.to_json()
    }))
    
    return res.status(200).json(data)
}

exports.get_post_by_id = async (req, res) => {
    const post_data = await post.findById(req.params.post_id)
    if (null == post_data) {
        return res.status(400).json(resp_msg(false, "Post not found"))
    }

    await post_data.get_categories_data()

    const response_json = {
        'success': true,
        'post_data': post_data.to_json()
    }

    return res.status(200).json(response_json)
}

exports.get_post_comments = async (req, res) => {
    const post_data = await post.findById(req.params.post_id)
    if (null == post_data) {
        return res.status(400).json(resp_msg(false, "Post not found"))
    }

    let comments = null

    if (req.session.role == 'admin') {
        comments = await comment.select_where_json({'post_id': post_data.id})
    }
    else if (!req.session.userId) {
        comments = await comment.select_where_json({'post_id': post_data.id, 'status': 'active'})
    }
    else {
        comments = await comment.select_where_json({'post_id': post_data.id, 'status': 'active'})
        const user_blocked_comments = await comment.select_where_json({
            'post_id': post_data.id, 
            'status': 'unactive',
            'author_id': req.session.userId
        })
        comments.push(...user_blocked_comments)
    }

    return res.status(200).json({"success": true, "data": comments})
}

exports.get_post_likes = likeBase.get_likes

exports.get_post_categories = async (req, res) => {
    const post_data = await post.findById(req.params.post_id)
    if (null == post_data) {
        return res.status(400).json(resp_msg(false, "Post not found"))
    }
    await post_data.get_categories_data()

    return res.status(200).json({"success": true, "data": post_data.categories})
}

exports.create_post = async (req, res) => {
    const {title, content, categories = []} = req.body;

    const newPost = { 
        author_id: req.session.userId,
        title,
        content,
        status: 'active'
    };

    const post_data = await post.create(newPost)

    categories.forEach(async (category) => {
        await post_category.create({
            "post_id": post_data.id,
            "category_id": category
        })
    })

    const now = new Date();
    const isoString = now.toISOString();

    const post_json = post_data.to_json()
    post_json.published_at = isoString

    res.status(200).json({"success": true, "message": 'Post created successfully', "post": post_json})
}

exports.create_like = likeBase.create_like

exports.update_post = async (req, res) => {
    const post_data = await post.findById(req.params.post_id)
    if (null == post_data) {
        return res.status(400).json({'success': false})
    }

    if (post_data.author_id != req.session.userId && req.session.role != 'admin') {
        return res.status(400).json(resp_msg(false, "Can not update someone else's post"))
    }

    let no_error = true

    if (post_data.author_id === req.session.userId) {
        if (req.body["title"]) {
            no_error = post_data.set_values({"title": req.body["title"]}) && no_error
        }
        if (req.body["content"]) {
            no_error = post_data.set_values({"content": req.body["content"]}) && no_error
        }
        if (req.body["categories"]) {
            no_error = post_data.set_values({"categories": req.body["categories"]}) && no_error
        }
    } 
    if (req.session.role === 'admin' && req.body["status"]) {
        no_error = post_data.set_values_admin({"status": req.body["status"]})
    }

    if (!no_error) {
        return res.status(400).json(resp_msg(false, "Provided data contained unallowed fields"))
    }

    const provided_keys = Object.keys(req.body)

    const options = {
        "save_only_categories": provided_keys.length == 1 && provided_keys.includes('categories')
    }


    const success = await post_data.save(options)
    if (!success) {
        return res.status(400).json(
            resp_msg(false, "was not able to update fields")
        )
    }

    return res.status(200).json(resp_msg(true, "Post updated"))
}

exports.delete_post = async (req, res) => {
    const post_id = req.params.post_id

    const post_data = await post.findById(post_id)

    if (null == post_data) {
        return res.status(400).json(resp_msg(false, "No such post"))
    }

    if (post_data.author_id != req.session.userId) {
        return res.status(400).json(resp_msg(false, "Can not delete someone else's post"))
    }

    const success = await post.delete(post_id)

    if (!success) return res.status(400).json(resp_msg(success, "Was not able to delete"))

    res.status(200).json(resp_msg(success, "Post was deleted"))
}

exports.delete_like = likeBase.delete_like