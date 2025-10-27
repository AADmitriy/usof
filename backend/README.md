# Stack Underflow backend

To check endpoints go to /docs

This project is a Node.js + Express backend API for a content management system that supports users, posts, categories, comments, and likes.
It provides authentication and authorization with sessions, including role-based access (admin vs regular users).
The API allows users to register, log in, manage profiles (with avatars), create and edit posts, assign categories, and interact via likes/dislikes and comments.
The system uses MySQL as the database, with models implemented in JavaScript classes for clean interaction with database tables.

JWT tokes are used for email confirmation during user regitration



# How to test

## 1. 
Go to `.env` and set up `EMAIL_HOST`, `EMAIL_USER` and `EMAIL_PASSWORD`. 

Optionaly you can change `DB_PORT`

## 2.
Run `npm install` in root folder

## 3.
Run `npm run recreate_db` in root folder. You would be prompted to enter password from root user

If command fails, go to `db_setup` folder and execute scripts manualy in order like this `db.sql`, `tables.sql`, `data.sql`

## 4. 
Run `npm start` in root folder


## 5. Optionaly
Go to `docs` folder and import `usof.postman_collection.json` to your postman workspace


<br>

## Password for all default users is 123456

## The structure of endpoints is the same as pdf except comment creation which is in 'comments' routes

## I am poorly educated, so I use 'unactive' instead of 'inactive' in requests