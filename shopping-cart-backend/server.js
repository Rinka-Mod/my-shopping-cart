const express = require('express');
const MySQL = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Kết nối với MySQL
const db = MySQL.createConnection({
	host: 'localhost',
	user: 'root', // change if different
	password: 'password', // Replace with your MySQL password
	database: 'shopping_cart'
});

let dbConnected = false;
db.connect((err) => {
	if (err) {
		console.error('MySQL connection error:', err);
		dbConnected = false;
		return;
	}
	dbConnected = true;
	console.log('Connected to MySQL');
});

// API để lấy sản phẩm trong giỏ hàng
app.get('/api/cart', (req, res) => {
	if (!dbConnected) return res.status(500).json({ error: 'Database not connected' });
	db.query('SELECT * FROM cart_items', (err, results) => {
		if (err) {
			console.error('DB query error:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		res.json(results);
	});
});

// API để thêm sản phẩm vào giỏ hàng
app.post('/api/cart', (req, res) => {
	if (!dbConnected) return res.status(500).json({ error: 'Database not connected' });
	const { name, price, quantity } = req.body;
	const query = 'INSERT INTO cart_items (name, price, quantity) VALUES (?, ?, ?)';
	db.query(query, [name, price, quantity], (err, result) => {
		if (err) {
			console.error('DB insert error:', err);
			return res.status(500).json({ error: 'Database error' });
		}
		res.json({
			id: result.insertId,
			name,
			price,
			quantity
		});
	});
});

// Start server (change PORT via env if needed)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});
