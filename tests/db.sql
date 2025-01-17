
CREATE TABLE IF NOT EXISTS users(

    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,

    full_name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,

    profile_picture VARCHAR(255) NOT NULL,
    bio VARCHAR(255) NOT NULL,
    
    created_at BIGINT NOT NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS posts(

    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,

    user_id INT(11) NOT NULL,

    description TEXT NOT NULL,
    image VARCHAR(255) NOT NULL,

    created_at BIGINT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users( id )
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS likes(

    id INT(11) NOT NULL AUTO_INCREMENT PRIMARY KEY,

    user_id INT(11) NOT NULL,

    post_id INT(11) NOT NULL,

    created_at BIGINT NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users( id ),
    FOREIGN KEY (post_id) REFERENCES posts( id )
) ENGINE=InnoDB;
