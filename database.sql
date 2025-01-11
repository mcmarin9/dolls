-- Database initialization
DROP DATABASE IF EXISTS dolls_db;
CREATE DATABASE dolls_db;
USE dolls_db;

-- Brands table in Spanish
CREATE TABLE marca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    fabricante VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Dolls table with marca_id instead of brand_id
CREATE TABLE dolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca_id INT NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    personaje VARCHAR(255) NOT NULL,
    anyo INT NOT NULL,
    estado ENUM('vendida', 'guardada', 'a la venta') NOT NULL,
    commentarios TEXT,
    imagen VARCHAR(255),
    lote_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marca(id) ON DELETE RESTRICT ON UPDATE CASCADE,
    INDEX idx_estado (estado),
    INDEX idx_marca (marca_id),
    INDEX idx_lote (lote_id)
);

-- Lotes table
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

-- Lote_doll association table
CREATE TABLE lote_doll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lote_id INT NOT NULL,
    doll_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lote_id) REFERENCES lotes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doll_id) REFERENCES dolls(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_doll_lote (doll_id, lote_id),
    INDEX idx_lote_doll (lote_id, doll_id)
);

-- Triggers
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

-- Insert sample marca
INSERT INTO marca (nombre, fabricante) VALUES
('Barbie', 'Mattel'),
('Monster High', 'Mattel'),
('Ever After High', 'Mattel'),
('Bratz', 'MGA Entertainment'),
('LOL Surprise', 'MGA Entertainment'),
('Rainbow High', 'MGA Entertainment'),
('Nancy', 'Famosa');

-- Insert sample dolls with marca_id
INSERT INTO dolls (nombre, marca_id, modelo, personaje, anyo, estado) VALUES
('Barbie Fashionista', 1, 'Fashionista #167', 'Barbie', 2022, 'guardada'),
('Draculaura Core', 2, 'Core Doll', 'Draculaura', 2023, 'guardada'),
('Nancy Day', 7, 'Colección 2023', 'Nancy', 2023, 'a la venta'),
('Clawdeen Wolf', 2, 'G3', 'Clawdeen', 2022, 'guardada'),
('Rainbow High Series 4', 6, 'Series 4', 'Delilah Fields', 2023, 'a la venta'),
('Bratz 20th Anniversary', 4, '20th Anniversary', 'Yasmin', 2022, 'guardada'),
('LOL Surprise OMG', 5, 'OMG Series 4', 'Dollface', 2023, 'a la venta'),
('Ever After High', 3, 'Legacy Day', 'Apple White', 2022, 'guardada');

-- Insert sample lotes (only required fields)
INSERT INTO lotes (nombre, type, total_price) VALUES
('Compra Navidad 2023', 'compra', 100.00),
('Venta Verano 2023', 'venta', 200.00);

-- Insert lote_doll associations
INSERT INTO lote_doll (lote_id, doll_id) VALUES
(1, 1), -- Compra Navidad 2023 - Barbie Fashionista
(1, 2), -- Compra Navidad 2023 - Draculaura Core
(1, 4), -- Compra Navidad 2023 - Clawdeen Wolf
(2, 3), -- Venta Verano 2023 - Nancy Day
(2, 5), -- Venta Verano 2023 - Rainbow High
(2, 7); -- Venta Verano 2023 - LOL Surprise OMG