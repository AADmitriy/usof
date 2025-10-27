const like = require('../models/likeModel')
const { resp_msg } = require('./helperFunctions')

exports.likeController = (model, model_pretty_name, model_param_id) => {
return {
get_likes: async (req, res) => {
    const model_data = await model.findById(req.params[model_param_id])
    if (null == model_data) {
        return res.status(400).json(resp_msg(false, `${model_pretty_name} not found`))
    }

    const likes_models = await like.select_where({[model_param_id]: model_data.id, 'type': 'like'})
    const dislikes_models = await like.select_where({[model_param_id]: model_data.id, 'type': 'dislike'})

    const data = {
        'likes': likes_models.length,
        'dislikes': dislikes_models.length,
        'has_user_like': false,
        'has_user_dislike': false
    }

    if (req.session.userId) {
        data['has_user_like'] = likes_models.some(like => like.author_id == req.session.userId)
        data['has_user_dislike'] = dislikes_models.some(like => like.author_id == req.session.userId)
    }

    const response_json = {
        'success': true,
        data
    }

    return res.status(200).json(response_json)
},

create_like: async (req, res) => {
    const {type} = req.body

    const model_id = req.params[model_param_id]

    const model_data = await model.findById(model_id)

    if (null == model_data) {
        return res.status(400).json(resp_msg(false, `No such ${model_pretty_name}`))
    }

    const the_like = (await like.select_where({
        'author_id': req.session.userId,
        [model_param_id]: model_data.id
    }))[0]

    if (the_like != undefined) {
        if (the_like.type != type) {
            await like.delete(the_like.id)
        }
    }

    const newLike = {
        author_id: req.session.userId,
        [model_param_id]: model_id,
        type
    }

    const like_data = await like.create(newLike)

    if (null == like_data) {
        return res.status(400).json(
            resp_msg(false, "Was not able to create like")
        )
    }

    res.status(200).json(resp_msg(true, 'Like created successfully'))
},

delete_like: async (req, res) => {
    const model_id = req.params[model_param_id]

    const model_data = await model.findById(model_id)

    if (null == model_data) {
        return res.status(400).json(resp_msg(false, `No such ${model_pretty_name}`))
    }

    const the_like = (await like.select_where({
        'author_id': req.session.userId,
        [model_param_id]: model_data.id
    }))[0]

    if (the_like == undefined) {
        return res.status(400).json(resp_msg(false, "No such like"))
    }
    
    const success = await like.delete(the_like.id)

    if (!success) return res.status(400).json(resp_msg(success, "Was not able to delete"))

    res.status(200).json(resp_msg(success, "Like was deleted"))
}

}
}