const mysql = require('mysql2');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: ''
});

// pool.execute(
//     'INSERT INTO products (title, price, imageUrl, description) VALUES (?, ?, ?, ?)',
//     [this.title, this.price, this.imageUrl, this.description]
// );

// pool.execute('SELECT * FROM products');

// pool.execute('SELECT * FROM products WHERE products.id = ?', [id]);

module.exports = pool.promise();
