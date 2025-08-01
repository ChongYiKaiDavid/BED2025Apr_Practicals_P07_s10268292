// Get references to the HTML elements you'll interact with:
const booksListDiv = document.getElementById("booksList");
const fetchBooksBtn = document.getElementById("fetchBooksBtn");
const messageDiv = document.getElementById("message");
const apiBaseUrl = "http://localhost:3000";

// Function to show messages
function showMessage(message, type = 'success') {
  messageDiv.textContent = message;
  messageDiv.className = type === 'success' ? 'message-success' : 'message-error';
  messageDiv.style.display = 'block';
  
  // Auto-hide message after 5 seconds
  setTimeout(() => {
    messageDiv.style.display = 'none';
  }, 5000);
}

// Function to fetch books from the API and display them
async function fetchBooks() {
  try {
    booksListDiv.innerHTML = '<div class="loading">Loading books...</div>';
    messageDiv.style.display = 'none';

    // Make a GET request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/books`);

    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody.message}`
      );
    }

    // Parse the JSON response
    const books = await response.json();

    // Clear previous content and display books
    booksListDiv.innerHTML = "";
    if (books.length === 0) {
      booksListDiv.innerHTML = '<div class="no-books">📚 No books found. <a href="create.html">Add the first book!</a></div>';
    } else {
      books.forEach((book) => {
        const bookElement = document.createElement("div");
        bookElement.classList.add("book-item");
        bookElement.setAttribute("data-book-id", book.id);
        bookElement.innerHTML = `
          <h3>📖 ${escapeHtml(book.title)}</h3>
          <p><strong>Author:</strong> ${escapeHtml(book.author)}</p>
          <p><strong>ID:</strong> ${book.id}</p>
          <div class="book-actions">
            <button class="btn btn-primary" onclick="viewBookDetails(${book.id})">👁️ View Details</button>
            <button class="btn btn-warning" onclick="editBook(${book.id})">✏️ Edit</button>
            <button class="btn btn-danger delete-btn" data-id="${book.id}">🗑️ Delete</button>
          </div>
        `;
        booksListDiv.appendChild(bookElement);
      });
      
      // Add event listeners for delete buttons after they are added to the DOM
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleDeleteClick);
      });
    }
  } catch (error) {
    console.error("Error fetching books:", error);
    booksListDiv.innerHTML = `<div class="message-error">Failed to load books: ${error.message}</div>`;
  }
}

// Function to escape HTML to prevent XSS
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Placeholder functions for other actions
function viewBookDetails(bookId) {
  console.log("View details for book ID:", bookId);
  // For now, just show an alert with book details
  fetch(`${apiBaseUrl}/books/${bookId}`)
    .then(response => response.json())
    .then(book => {
      alert(`Book Details:\n\nID: ${book.id}\nTitle: ${book.title}\nAuthor: ${book.author}`);
    })
    .catch(error => {
      alert(`Error fetching book details: ${error.message}`);
    });
}

function editBook(bookId) {
  console.log("Edit book with ID:", bookId);
  // Redirect to edit.html with the book ID
  window.location.href = `edit.html?id=${bookId}`;
}

// Implementation for Delete
async function handleDeleteClick(event) {
  const bookId = event.target.getAttribute("data-id");
  
  // Confirm deletion
  if (!confirm(`Are you sure you want to delete this book (ID: ${bookId})?`)) {
    return;
  }
  
  try {
    // Show loading state
    event.target.disabled = true;
    event.target.textContent = "Deleting...";
    
    // Make DELETE request
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`, {
      method: 'DELETE'
    });
    
    if (response.status === 204) {
      // Success - remove the book element from the DOM
      const bookElement = document.querySelector(`[data-book-id="${bookId}"]`);
      if (bookElement) {
        bookElement.remove();
      }
      showMessage(`Book with ID ${bookId} deleted successfully!`, 'success');
    } else if (response.status === 404) {
      showMessage(`Book with ID ${bookId} not found.`, 'error');
    } else {
      // Handle other errors
      const errorBody = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody.message}`);
    }
  } catch (error) {
    console.error("Error deleting book:", error);
    showMessage(`Failed to delete book: ${error.message}`, 'error');
    
    // Re-enable button on error
    event.target.disabled = false;
    event.target.textContent = "🗑️ Delete";
  }
}

// Fetch books when the button is clicked
fetchBooksBtn.addEventListener("click", fetchBooks);

// Fetch books when the page loads
window.addEventListener('load', fetchBooks);
