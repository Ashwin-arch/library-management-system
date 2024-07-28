document.addEventListener('DOMContentLoaded', function() {
    const bookForm = document.getElementById('addBookForm');
    const booksTable = document.getElementById('booksTable').getElementsByTagName('tbody')[0];

    // Function to fetch and display books
    function loadBooks() {
        fetch('/api/books')
            .then(response => response.json())
            .then(books => {
                booksTable.innerHTML = ''; // Clear current table rows
                books.forEach(book => {
                    const row = booksTable.insertRow();
                    row.innerHTML = `
                        <td>${book.id}</td>
                        <td>${book.title}</td>
                        <td>${book.author}</td>
                        <td>${book.isbn}</td>
                        <td>${book.published_date}</td>
                        <td>${book.available ? 'Yes' : 'No'}</td>
                        <td>
                            <button onclick="editBook(${book.id})">Edit</button>
                            <button onclick="deleteBook(${book.id})">Delete</button>
                        </td>
                    `;
                });
            })
            .catch(err => console.error('Error fetching books:', err));
    }

    // Add a book
    bookForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const isbn = document.getElementById('isbn').value;
        const published_date = document.getElementById('published_date').value;
        const available = document.getElementById('available').checked;

        fetch('/api/books', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, isbn, published_date, available })
        })
        .then(response => response.json())
        .then(book => {
            console.log('Book added:', book);
            loadBooks(); // Reload books list
        })
        .catch(err => console.error('Error adding book:', err));
    });

    // Function to delete a book
    window.deleteBook = function(id) {
        fetch(`/api/books/${id}`, { method: 'DELETE' })
            .then(() => loadBooks())
            .catch(err => console.error('Error deleting book:', err));
    };

    // Load books on page load
    loadBooks();
});
