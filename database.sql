DROP DATABASE IF EXISTS dolls_db;
CREATE DATABASE dolls_db;
USE dolls_db;


-- Tabla: Marca
CREATE TABLE marca (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL UNIQUE,
    fabricante VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Lotes
CREATE TABLE lotes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tipo ENUM('compra', 'venta') NOT NULL,
    precio_total DECIMAL(10,2), -- Precio manual
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: Muñecas
CREATE TABLE dolls (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    marca_id INT NOT NULL,
    modelo VARCHAR(255) NOT NULL,
    personaje VARCHAR(255) NOT NULL,
    anyo INT NOT NULL,
    estado ENUM('guardada', 'a la venta', 'vendida', 'fuera') NOT NULL DEFAULT 'guardada',
    precio_compra DECIMAL(10,2),
    precio_venta DECIMAL(10,2),
    comentarios TEXT,
    imagen VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (marca_id) REFERENCES marca(id) ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Relación: Lote-Muñeca
CREATE TABLE lote_doll (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lote_id INT NOT NULL,
    doll_id INT NOT NULL,
    FOREIGN KEY (lote_id) REFERENCES lotes(id) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (doll_id) REFERENCES dolls(id) ON DELETE CASCADE ON UPDATE CASCADE,
    UNIQUE KEY uk_doll_lote (doll_id, lote_id) -- Evita duplicados
);

-- Insert sample data
-- Insert sample marca data (unchanged)
INSERT INTO marca (nombre, fabricante) VALUES
    ('Barbie', 'Mattel'),
    ('Monster High', 'Mattel'),
    ('Ever After High', 'Mattel'),
    ('Bratz', 'MGA Entertainment'),
    ('LOL Surprise', 'MGA Entertainment'),
    ('Rainbow High', 'MGA Entertainment'),
    ('Nancy', 'Famosa');

INSERT INTO lotes (nombre, tipo, precio_total) VALUES
    ('Compra Navidad 2023', 'compra', 150.00),
    ('Venta Verano 2023', 'venta', 200.00);

INSERT INTO dolls (nombre, marca_id, modelo, personaje, anyo, estado, precio_compra, precio_venta, comentarios) VALUES
    ('Barbie Fashionista', 1, 'Fashionista #167', 'Barbie', 2022, 'a la venta', 25.00, NULL, 'Muñeca nueva'),
    ('Draculaura Core', 2, 'Core Doll', 'Draculaura', 2023, 'a la venta', 30.00, NULL, NULL),
    ('Nancy Day', 7, 'Colección 2023', 'Nancy', 2023, 'vendida', 35.00, 50.00, NULL),
    ('Clawdeen Wolf', 2, 'G3', 'Clawdeen', 2022, 'a la venta', 28.00, NULL, NULL),
    ('Rainbow High Series 4', 6, 'Series 4', 'Delilah Fields', 2023, 'vendida', 40.00, 60.00, NULL),
    ('Bratz 20th Anniversary', 4, '20th Anniversary', 'Yasmin', 2022, 'guardada', 45.00, NULL, NULL),
    ('LOL Surprise OMG', 5, 'OMG Series 4', 'Dollface', 2023, 'vendida', 32.00, 50.00, NULL),
    ('Ever After High', 3, 'Legacy Day', 'Apple White', 2022, 'a la venta', 38.00, NULL, NULL);

INSERT INTO lote_doll (lote_id, doll_id) VALUES
    (1, 1), -- Compra Navidad 2023
    (1, 2),
    (1, 4),
    (2, 3), -- Venta Verano 2023
    (2, 5),
    (2, 7);
