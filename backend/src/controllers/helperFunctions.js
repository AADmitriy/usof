exports.resp_msg = (success, message) => {
    return {
      "success": success,
      "message": message
    }
}

exports.crudController = (model, model_pretty_name, model_param_id) => {
return {
get_all: async (req, res) => {
    const all_comments = await model.all_json()
    
    return res.status(200).json(all_comments)
},

get_by_id: async (req, res) => {
    const model_data = await model.findById_json(req.params[model_param_id])
    if (null == model_data) {
        return res.status(400).json(exports.resp_msg(false, `${model_pretty_name} not found`))
    }

    const response_json = {
        'success': true,
        'data': model_data
    }

    return res.status(200).json(response_json)
},
update: async (req, res) => {
    const model_data = await model.findById(req.params[model_param_id])
    if (null == model_data) {
        return res.status(400).json(exports.resp_msg(false, `${model_pretty_name} not found`))
    }

    const no_error = model_data.set_values(req.body)
    if (!no_error) {
        return res.status(400).json(exports.resp_msg(false, "Provided data contained unallowed fields"))
    }

    const success = await model_data.save()
    if (!success) {
        return res.status(400).json(
            exports.resp_msg(false, "Wasn't able to update fields")
        )
    }

    return res.status(200).json(exports.resp_msg(true, `${model_pretty_name} updated`))
},
delete: async (req, res) => {
    const model_id = req.params[model_param_id]

    const model_data = await model.findById(model_id)

    if (null == model_data) {
        return res.status(400).json(exports.resp_msg(false, `No such ${model_pretty_name}`))
    }

    const success = await model.delete(model_id)

    if (!success) return res.status(400).json(exports.resp_msg(success, "Was not able to delete"))

    res.status(200).json(exports.resp_msg(success, `${model_pretty_name} was deleted`))
}
}
}
