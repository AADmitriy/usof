DROP DATABASE IF EXISTS usof_db;
DROP USER IF EXISTS 'daheionok'@'localhost';

CREATE DATABASE usof_db; 
CREATE USER 'daheionok'@'localhost' IDENTIFIED BY 'securepass';
GRANT ALL PRIVILEGES ON usof_db.* TO 'daheionok'@'localhost' WITH GRANT OPTION;

FLUSH PRIVILEGES;