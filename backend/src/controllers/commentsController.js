const comment = require('../models/commentModel')
const { likeController } = require('./likeController')
const post = require('../models/postModel')
const {
    resp_msg,
    crudController
} = require('./helperFunctions')

const comment_pretty_name = 'Comment'
const comment_param_id = 'comment_id'

const base = crudController(comment, comment_pretty_name, comment_param_id)
const likeBase = likeController(comment, comment_pretty_name, comment_param_id)


exports.get_all_comments = base.get_all

exports.get_comment_by_id = base.get_by_id

exports.get_comment_likes = likeBase.get_likes

exports.create_comment = async (req, res) => {
    const {post_id, content} = req.body;

    const post_data = await post.findById(post_id)
    if (null == post_data) {
        return res.status(400).json(resp_msg(false, "Post not found"))
    }

    if (post_data.status != 'active') {
        return res.status(400).json(resp_msg(false, "Post is unactive"))
    }

    const newComment = { 
        author_id: req.session.userId,
        post_id,
        content
    };

    const comment_data = await comment.create(newComment)

    const comment_json = comment_data.to_json()

    res.status(200).json({"success": true, "message": 'comment created successfully', "comment": comment_json})
}

exports.create_like = likeBase.create_like

exports.update_comment =  async (req, res) => {
    const comment_data = await comment.findById(req.params.comment_id)
    if (null == comment_data) {
        return res.status(400).json({'success': false})
    }

    if (comment_data.author_id != req.session.userId && req.session.role != 'admin') {
        return res.status(400).json(resp_msg(false, "Can not update someone else's comment"))
    }

    let no_error = false

    if (req.session.userId === comment_data.author_id && req.body['content']) {
        no_error = comment_data.set_values({"content": req.body['content']})
    }
    if (req.session.role === 'admin' && req.body['status']) {
        no_error = comment_data.set_values_admin({"status": req.body['status']})
    }

    if (!no_error) {
        return res.status(400).json(resp_msg(false, "Provided data contained unallowed fields"))
    }

    const success = await comment_data.save()
    if (!success) {
        return res.status(400).json(
            resp_msg(false, "Was not able to update fields")
        )
    }

    return res.status(200).json(resp_msg(true, "Comment updated"))
}

exports.delete_comment = base.delete

exports.delete_like = likeBase.delete_like