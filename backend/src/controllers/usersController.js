const fs = require('fs')
const path = require('path')
const bcrypt = require('bcrypt');
const user = require('../models/userModel');
const { resp_msg } = require('./helperFunctions')


exports.get_all_users = async (req, res) => {
    const all_users_models = await user.all()

    const data = await Promise.all(all_users_models.map(async (model) => {
        await model.set_rating()
        return model.to_json()
    }))

    return res.status(200).json(data)
}

exports.get_user_by_id = async (req, res) => {
    const user_data = await user.findById(req.params.user_id)
    if (null == user_data) {
        return res.status(400).json({'success': false})
    }
    await user_data.set_rating()
    
    const data = user_data.to_json()

    const response_json = {
        'success': true,
        'user_data': data
    }

    return res.status(200).json(response_json)
}

exports.user_preview_data = async (req, res) => {
    const user_data = await user.findById(req.params.user_id)
    if (null == user_data) {
        return res.status(400).json({'success': false})
    }
    await user_data.set_rating()

    const response_json = {
        'success': true,
        'user_data': {
            "login": user_data.login,
            "full_name": user_data.full_name,
            "profile_picture": user_data.profile_picture,
            "rating": user_data.rating
        }
    }

    return res.status(200).json(response_json)
}

exports.get_self = async (req, res) => {
    const user_data = await user.findById(req.session.userId)
    if (null == user_data) {
        return res.status(400).json({'success': false})
    }
    await user_data.set_rating()
    
    const data = user_data.to_json()

    const response_json = {
        'success': true,
        'user_data': data
    }

    return res.status(200).json(response_json)
}

exports.create_user = async (req, res) => {
    const { login, email, full_name=null, password, password_confirmation, role } = req.body;


    if (password != password_confirmation) {
        return res.status(400).json(resp_msg(false, 'Passwords do not match'));
    }


    const email_exists = null != await user.findByEmail(email)
    const login_exists = null != await user.findByLogin(login)
    const user_exists = email_exists || login_exists

    if (user_exists) return res.status(400).json(resp_msg(false, 'User already exists'));

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = { 
        login,
        email,
        password_hash: hashedPassword,
        full_name,
        role,
        is_verified: true,
        profile_picture: null
    };

    await user.create(newUser)

    res.status(201).json(resp_msg(true, 'Registered successfully'))
}

exports.update_user_data = async (req, res) => {
    const user_model = await user.findById(req.params.user_id)
    if (null == user_model) {
        return res.status(400).json({'success': false})
    }

    const no_error = user_model.set_values(req.body)
    if (!no_error) {
        return res.status(400).json(resp_msg(false, "provided data contained unallowed fields"))
    }

    const success = await user_model.save()
    if (!success) {
        return res.status(400).json(
            resp_msg(false, "was not able to update fields (some error, not unique login, email")
        )
    }

    return res.status(200).json({'success': true})
}

exports.delete_user = async (req, res) => {
    const user_id = req.params.user_id

    if (user_id == req.session.userId) {
        return res.status(400).json(resp_msg(false, "Can not delete yourself"))
    }

    const success = await user.delete(user_id)

    if (!success) return res.status(400).json(resp_msg(success, "Was not able to delete"))

    res.status(200).json(resp_msg(success, "User was deleted"))
}

exports.set_avatar = async (req, res) => {
    const user_data = await user.findById(req.session.userId)

    if (!req.file) {
        const parentDir = path.join(__dirname, '..', '..');
        const filePath = path.join(parentDir, user_data.profile_picture);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete old avatar:', err);
        });
        res.status(200).json({ "success": true, message: 'Avatar deleted' });
    }
    
    if (user_data.profile_picture != null) {
        const parentDir = path.join(__dirname, '..', '..');
        const filePath = path.join(parentDir, user_data.profile_picture);
        fs.unlink(filePath, (err) => {
            if (err) console.error('Failed to delete old avatar:', err);
        });
    }

    const avatarPath = `/uploads/${req.file.filename}`;
    user_data.profile_picture = avatarPath
    
    const success = await user_data.save()
    if (!success) {
        fs.unlink(avatarPath, (err) => {
            if (err) console.error('Failed to delete avatar:', err);
        });
        return res.status(400).json(resp_msg(false, "Something went wrong"))
    }
    
      
    res.status(200).json({ "success": true, message: 'Avatar uploaded', avatarUrl: avatarPath });
}