USE usof_db;

DROP TABLE IF EXISTS user;
CREATE TABLE IF NOT EXISTS user (
	id INT NOT NULL AUTO_INCREMENT,
	login VARCHAR(64) NOT NULL,
    password_hash VARCHAR(60) NOT NULL,
    full_name VARCHAR(128) NULL,
    email VARCHAR(255) NOT NULL,
	profile_picture VARCHAR(255) NULL,
	role ENUM('user', 'admin') NOT NULL,
	is_verified BOOLEAN NOT NULL DEFAULT FALSE,
	PRIMARY KEY (id),
	UNIQUE (login),
    UNIQUE (email)
);

DROP TABLE IF EXISTS post;
CREATE TABLE IF NOT EXISTS post (
	id INT NOT NULL AUTO_INCREMENT,
	author_id INT NOT NULL,
    title VARCHAR(512) NOT NULL,
    published_at DATETIME NOT NULL DEFAULT NOW(),
	status ENUM('active', 'unactive') NOT NULL,
	content TEXT NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS category;
CREATE TABLE IF NOT EXISTS category (
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(128) NOT NULL,
	description TEXT NULL,
	PRIMARY KEY (id),
	UNIQUE (title)
);

DROP TABLE IF EXISTS comment;
CREATE TABLE IF NOT EXISTS comment (
	id INT NOT NULL AUTO_INCREMENT,
	author_id INT NOT NULL,
    post_id INT NOT NULL,
	published_at DATETIME NOT NULL DEFAULT NOW(),
	content TEXT NOT NULL,
	status ENUM('active', 'unactive') NOT NULL,
	PRIMARY KEY (id),
	FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE
);

DROP TABLE IF EXISTS likes;
CREATE TABLE IF NOT EXISTS likes (
	id INT NOT NULL AUTO_INCREMENT,
	author_id INT NOT NULL,
	published_at DATETIME NOT NULL DEFAULT NOW(),
	post_id INT NULL,
	comment_id INT NULL,
    type ENUM('like', 'dislike') NOT NULL,
    PRIMARY KEY (id),
	FOREIGN KEY (author_id) REFERENCES user(id) ON DELETE CASCADE,
	FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
	FOREIGN KEY (comment_id) REFERENCES comment(id) ON DELETE CASCADE,
	CONSTRAINT chk_like_xor CHECK (
        (post_id IS NULL AND comment_id IS NOT NULL) OR
        (post_id IS NOT NULL AND comment_id IS NULL)
    ),
	UNIQUE (author_id, post_id),
    UNIQUE (author_id, comment_id)
);

DROP TABLE IF EXISTS post_category;
CREATE TABLE IF NOT EXISTS post_category (
	post_id INT NOT NULL,
	category_id INT NOT NULL,
	PRIMARY KEY (post_id, category_id),
	FOREIGN KEY (post_id) REFERENCES post(id) ON DELETE CASCADE,
	FOREIGN KEY (category_id) REFERENCES category(id) ON DELETE CASCADE
);
