-- Database initialization
DROP DATABASE IF EXISTS dolls_db;
CREATE DATABASE dolls_db;
USE dolls_db;

-- Core Tables
CREATE TABLE dolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca VARCHAR(255) NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    personaje VARCHAR(255) NOT NULL,
    anyo INT NOT NULL,
    estado ENUM('vendida', 'guardada', 'a la venta') NOT NULL,
    commentarios TEXT,
    imagen VARCHAR(255),
    lote_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_estado (estado),
    INDEX idx_marca (marca),
    INDEX idx_lote (lote_id)
);

CREATE TABLE lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    type ENUM('compra', 'venta') NOT NULL,
    total_price DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    quantity INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uk_nombre (nombre),
    INDEX idx_type (type)
);

-- Add foreign key after both tables exist
ALTER TABLE dolls
ADD CONSTRAINT fk_doll_lote 
    FOREIGN KEY (lote_id) 
    REFERENCES lotes(id)
    ON DELETE SET NULL
    ON UPDATE CASCADE;

CREATE TABLE lote_doll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lote_id INT NOT NULL,
    doll_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_lote_doll_lote FOREIGN KEY (lote_id) 
        REFERENCES lotes(id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    CONSTRAINT fk_lote_doll_doll FOREIGN KEY (doll_id) 
        REFERENCES dolls(id) 
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    UNIQUE KEY uk_doll_lote (doll_id, lote_id),
    INDEX idx_lote_doll (lote_id, doll_id)
);

-- Triggers for data validation
DELIMITER //

CREATE TRIGGER before_doll_insert 
BEFORE INSERT ON dolls
FOR EACH ROW
BEGIN
    IF NEW.anyo < 1900 OR NEW.anyo > YEAR(CURRENT_DATE) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Year must be between 1900 and current year';
    END IF;
END//

CREATE TRIGGER before_doll_update 
BEFORE UPDATE ON dolls
FOR EACH ROW
BEGIN
    IF NEW.anyo < 1900 OR NEW.anyo > YEAR(CURRENT_DATE) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Year must be between 1900 and current year';
    END IF;
END//

CREATE TRIGGER before_lote_insert 
BEFORE INSERT ON lotes
FOR EACH ROW
BEGIN
    IF NEW.total_price < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Total price cannot be negative';
    END IF;
END//

CREATE TRIGGER after_lote_doll_insert
AFTER INSERT ON lote_doll
FOR EACH ROW
BEGIN
    UPDATE lotes l
    SET l.quantity = (
        SELECT COUNT(*) 
        FROM lote_doll 
        WHERE lote_id = NEW.lote_id
    )
    WHERE l.id = NEW.lote_id;
    
    UPDATE dolls
    SET lote_id = NEW.lote_id
    WHERE id = NEW.doll_id;
END//

CREATE TRIGGER after_lote_doll_delete
AFTER DELETE ON lote_doll
FOR EACH ROW
BEGIN
    UPDATE lotes l
    SET l.quantity = (
        SELECT COUNT(*) 
        FROM lote_doll 
        WHERE lote_id = OLD.lote_id
    )
    WHERE l.id = OLD.lote_id;
    
    UPDATE dolls
    SET lote_id = NULL
    WHERE id = OLD.doll_id;
END//

DELIMITER ;