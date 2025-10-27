USE usof_db;

INSERT INTO user (login, password_hash, full_name, email, profile_picture, role, is_verified)
VALUES
('admin',   '$2b$10$psK/QFP7CE7zmGuXls0IW.jEwqCQF4s7eiK4HrDJ95yODWdypmfwa', 'Admin Adminius',  'admin@email.com',    NULL, 'admin', TRUE),
('alice',   '$2b$10$psK/QFP7CE7zmGuXls0IW.jEwqCQF4s7eiK4HrDJ95yODWdypmfwa', 'Alice Johnson',  'alice@example.com',   NULL, 'user', TRUE),
('bob',     '$2b$10$psK/QFP7CE7zmGuXls0IW.jEwqCQF4s7eiK4HrDJ95yODWdypmfwa', 'Bob Smith',      'bob@example.com',     NULL, 'user', TRUE),
('charlie', '$2b$10$psK/QFP7CE7zmGuXls0IW.jEwqCQF4s7eiK4HrDJ95yODWdypmfwa', 'Charlie Brown',  'charlie@example.com', NULL, 'user', TRUE),
('diana',   '$2b$10$psK/QFP7CE7zmGuXls0IW.jEwqCQF4s7eiK4HrDJ95yODWdypmfwa', 'Diana Prince',   'diana@example.com',   NULL, 'admin', TRUE),
('eve',     '$2b$10$psK/QFP7CE7zmGuXls0IW.jEwqCQF4s7eiK4HrDJ95yODWdypmfwa', 'Eve Adams',      'eve@example.com',     NULL, 'user', TRUE);


INSERT INTO category (title, description)
VALUES
('Technology', 'Posts about technology and innovation'),
('Science',    'Scientific discoveries and research'),
('Art',        'Discussion of art and creativity'),
('Sports',     'News and updates about sports'),
('Travel',     'Travel guides and experiences');


INSERT INTO post (author_id, title, status, content)
VALUES
(1, 'The Future of AI',         'active',   'Content about AI...'),
(2, 'Latest Space Discoveries', 'active',   'Content about space...'),
(3, 'Impressionist Art',        'active',   'Content about art...'),
(4, 'Olympic Games 2024',       'unactive', 'Content about Olympics...'),
(5, 'Backpacking in Europe',    'active',   'Content about travel...');


INSERT INTO post_category (post_id, category_id)
VALUES
(1, 1), -- AI → Technology
(2, 2), -- Space → Science
(3, 3), -- Art → Art
(4, 4), -- Olympics → Sports
(5, 5); -- Travel → Travel


INSERT INTO comment (author_id, post_id, content, status)
VALUES
(2, 1, 'Great article about AI!',          'active'),
(3, 1, 'I have doubts about this...',      'active'),
(1, 2, 'Space is so fascinating!',         'active'),
(5, 3, 'Art is life, thanks for sharing.', 'unactive'),
(4, 5, 'Nice travel guide!',               'active');


INSERT INTO likes (author_id, post_id, comment_id, type)
VALUES
(2, 1, NULL, 'like'),   -- Bob likes Alice's post
(3, 1, NULL, 'dislike'),-- Charlie dislikes Alice's post
(1, 2, NULL, 'like'),   -- Alice likes Bob's post
(5, NULL, 1, 'like'),   -- Eve likes Bob's comment
(4, NULL, 3, 'dislike');-- Diana dislikes Alice's comment
