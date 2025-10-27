const bcrypt = require('bcrypt');
const user = require('../models/userModel');
const blackmailer = require('nodemailer');
const jwt = require('jsonwebtoken');
require('dotenv').config();
CONFIRM_EMAIL_SECRET = process.env.CONFIRM_EMAIL_SECRET
CONFIRM_PASSWORD_SECRET = process.env.CONFIRM_PASSWORD_SECRET
const EMAIL_CONFIRMATION_FRONTEND = process.env.EMAIL_CONFIRMATION_FRONTEND



const transporter = blackmailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});


function confirm_email_token(user_id, email) {
  return jwt.sign(
    { userId: user_id,
      userEmail: email }, 
    CONFIRM_EMAIL_SECRET, 
    { expiresIn: '10m' }  
  );    
}

function confirm_password_token(user_id, email) {
  return jwt.sign(
    { userId: user_id,
      userEmail: email }, 
    CONFIRM_PASSWORD_SECRET, 
    { expiresIn: '10m' }  
  );    
}


async function send_email_confirmation_link(email, token) {
  const info = await transporter.sendMail({
      from: 'This suspicious site',
      to: email,
      subject: "Follow the link to confirm your email",
      html: `
      <b>Hello from the most suspicious site in your life!</b>
      <p>If you use just api without web frontend just follow the link</p>
      <a href="${EMAIL_CONFIRMATION_FRONTEND}?token=${token}">Follow this link to confirm your email</a>
      <p>And this is your coordinates: 49.99243150605346,36.301341388916825</p>`
  });
  
  console.log("Message sent:", info);
}

async function send_password_confirmation_link(email, token) {
  const info = await transporter.sendMail({
      from: 'This suspicious site',
      to: email,
      subject: "Follow the link to enter your new password",
      html: `
      <b>Hello from the most suspicious site in your life!</b>
      <div>
        <p>If you use just api without web frontend copy the token and insert it as 'confirmation_token' in password-reset route</p>
        <p>Token:</p>
        <pre>${token}</pre>
      </div>
      <p>http://localhost:3000/api/auth/password-reset/${token}</p>
      <p>And this is your coordinates: 49.99243150605346,36.301341388916825</p>`
  });

  console.log("Message sent:", info);
}


function resp_msg(success, message) {
  return {
    "success": success,
    "message": message
  }
}


exports.register = async (req, res) => {
  const { login, email, full_name=null, password, password_confirmation, profile_picture=null } = req.body;


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
    profile_picture,
    role: 'user',
    is_verified: false
  };

  const user_data = await user.create(newUser)

  // req.session.userId = user_data.id;
  // req.session.role = user_data.role;

  const token = confirm_email_token(user_data.id, user_data.email)
  await send_email_confirmation_link(user_data.email, token)

  res.status(201).json(resp_msg(true, 'Registered successfully, now confirm email'));
};


exports.login = async (req, res) => {
  const { login, email, password } = req.body;

  const invalidated_request = () => {
    res.status(400).json(resp_msg(false, 'Invalid login, email or password'));
  }

  const user_data = await user.findByLogin(login)
  if (null == user_data) return invalidated_request()

  const email_confirmed = user_data.is_verified
  if (false == email_confirmed) {
    // REDIRECT ON EMAIL CONFIRMATION or smts
    return res.status(400).json(resp_msg(false, 'Confirm your email'));
  }

  const match = await bcrypt.compare(password, user_data.password_hash);
  if (!match) return invalidated_request()

  req.session.userId = user_data.id;
  req.session.role = user_data.role;

  res.status(200).json({
    "success": true, 
    "user_data": {
      "id": user_data.id,
      "username": user_data.full_name || user_data.login,
      "role": user_data.role
    }
  });
};


exports.logout = async (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json(resp_msg(false, 'Logout failed'));
    res.clearCookie('connect.sid');
    res.status(200).json(resp_msg(true, 'Logged out'));
  });
}

exports.confirm_email = async (req, res) => {
  const token = req.query.token
  let error = false

  jwt.verify(token, CONFIRM_EMAIL_SECRET, (err, user) => {
    if (err) {error = true}
    req.user = user
  });

  if (!req.user || error) {
    return res.status(400).json(resp_msg(false, 'Invalid token'));
  }

  const user_data = await user.findById(req.user.userId)
  if (null == user_data || user_data.email != req.user.userEmail) {
    return res.status(400).json(resp_msg(false, 'Invalid token'));
  }

  if (true == user_data.is_verified) {
    return res.status(400).json(resp_msg(false, 'Already verified'));
  }

  user_data.is_verified = true
  await user_data.save()

  req.session.userId = user_data.id;
  req.session.role = user_data.role;

  res.status(200).json({
    "success":true,
    "message":'email was confirmed',
    "user_data": {
      "id": user_data.id,
      "username": user_data.full_name || user_data.login,
      "role": user_data.role
    }
  })
}

exports.resend_confirm_email = async (req, res) => {
  const { email } = req.body

  const user_data = user.findByEmail(email)

  if (user_data.is_verified) {
    return res.status(400).json(resp_msg(false, 'Already verified'))
  }

  const token = confirm_email_token(user_data.id, user_data.email)
  await send_email_confirmation_link(user_data.email, token)

  res.status(200).json(resp_msg(true, 'Confirmation email was send'))
}

exports.password_reset_send_link = async (req, res) => {
  const { email } = req.body
  const user_data = await user.findByEmail(email)

  if (null == user_data || req.session.userId != user_data.id) {
    return res.status(400).json(resp_msg(false, 'Wrong email'));
  }

  const token = confirm_password_token(user_data.id, email)
  await send_password_confirmation_link(email, token)

  res.status(200).json(resp_msg(true, 'The link was sended'));
}

exports.set_new_password = async (req, res) => {
  const { new_password } = req.body

  const token = req.params.confirm_token

  jwt.verify(token, CONFIRM_PASSWORD_SECRET, (err, data) => {
    if (err) return res.status(400).json(resp_msg(false, 'Invalid token'));
    req.token_data = data
  });


  const user_data = await user.findById(req.session.userId)

  if (user_data.id != req.token_data.userId || user_data.email != req.token_data.userEmail) {
    return res.status(400).json(resp_msg(false, 'Invalid token data'));
  }

  const newHashedPassword = await bcrypt.hash(new_password, 10);

  user_data.password_hash = newHashedPassword
  
  const success = await user_data.save()
  if (!success) {
    return res.status(400).json(resp_msg(false, 'Something went wrong'));
  }

  res.status(200).json(resp_msg(true, 'Password was changed'))
}