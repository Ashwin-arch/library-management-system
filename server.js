const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'library_management'
});

// Connect to MySQL
db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('MySQL connected...');
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, '../public')));

// Serve index.html at the root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public', 'index.html'));
});

// API routes
// Get all books
app.get('/api/books', (req, res) => {
    db.query('SELECT * FROM books', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Add a book
app.post('/api/books', (req, res) => {
    const { title, author, isbn, published_date, available } = req.body;
    const newBook = { title, author, isbn, published_date, available };
    db.query('INSERT INTO books SET ?', newBook, (err, result) => {
        if (err) throw err;
        res.status(201).json({ id: result.insertId, ...newBook });
    });
});

// Update a book
app.put('/api/books/:id', (req, res) => {
    const { id } = req.params;
    const { title, author, isbn, published_date, available } = req.body;
    const updatedBook = { title, author, isbn, published_date, available };
    db.query('UPDATE books SET ? WHERE id = ?', [updatedBook, id], (err) => {
        if (err) throw err;
        res.json({ id, ...updatedBook });
    });
});

// Delete a book
app.delete('/api/books/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM books WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.status(204).send();
    });
});

// Handle 404 errors
app.use((req, res) => {
    res.status(404).send('Route not found');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
