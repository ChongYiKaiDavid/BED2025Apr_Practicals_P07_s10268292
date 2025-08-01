// Get references to all the elements we need
const editBookForm = document.getElementById("editBookForm");
const messageDiv = document.getElementById("message");
const loadingDiv = document.getElementById("loadingMessage");
const errorDiv = document.getElementById("errorSection");
const formDiv = document.getElementById("formSection");
const submitBtn = document.getElementById("submitBtn");
const errorMessageP = document.getElementById("errorMessage");

const bookIdInput = document.getElementById("bookId");
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");

const apiBaseUrl = "http://localhost:3000";
let currentBookId = null;

// Function to show messages
function showMessage(message, type = 'success') {
  messageDiv.textContent = message;
  messageDiv.className = type === 'success' ? 'message-success' : 'message-error';
  messageDiv.style.display = 'block';
  
  // Scroll to message
  messageDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

// Function to hide message
function hideMessage() {
  messageDiv.style.display = 'none';
}

// Function to show error section
function showError(message) {
  errorMessageP.textContent = message;
  errorDiv.style.display = 'block';
  loadingDiv.style.display = 'none';
  formDiv.style.display = 'none';
}

// Function to show loading
function showLoading() {
  loadingDiv.style.display = 'block';
  errorDiv.style.display = 'none';
  formDiv.style.display = 'none';
}

// Function to show form
function showForm() {
  formDiv.style.display = 'block';
  loadingDiv.style.display = 'none';
  errorDiv.style.display = 'none';
}

// Function to get book ID from URL parameters
function getBookIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Function to load book data from the API
async function loadBookData(bookId) {
  try {
    showLoading();
    
    const response = await fetch(`${apiBaseUrl}/books/${bookId}`);
    
    if (response.status === 404) {
      showError(`Book with ID ${bookId} not found.`);
      return;
    }
    
    if (!response.ok) {
      const errorData = response.headers
        .get("content-type")
        ?.includes("application/json")
        ? await response.json()
        : { message: response.statusText };
      
      throw new Error(`API error! status: ${response.status}, message: ${errorData.message}`);
    }

    const book = await response.json();
    
    // Populate the form with book data
    bookIdInput.value = book.id;
    titleInput.value = book.title;
    authorInput.value = book.author;
    
    currentBookId = book.id;
    showForm();
    
  } catch (error) {
    console.error("Error loading book:", error);
    showError(`Failed to load book: ${error.message}`);
  }
}

// Function to update book data
async function updateBook(bookData) {
  try {
    const response = await fetch(`${apiBaseUrl}/books/${currentBookId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bookData),
    });

    // Parse response body
    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.status === 200) {
      // Success
      showMessage(`✅ Book updated successfully!`, 'success');
      console.log("Updated Book:", responseBody);
      
      // Option to redirect back to list after 2 seconds
      setTimeout(() => {
        if (confirm("Book updated successfully! Go back to books list?")) {
          window.location.href = "index.html";
        }
      }, 2000);
      
    } else if (response.status === 404) {
      showMessage(`❌ Book with ID ${currentBookId} not found.`, 'error');
    } else if (response.status === 400) {
      // Handle validation errors from the API
      if (responseBody.errors && Array.isArray(responseBody.errors)) {
        // Multiple validation errors
        const errorMessage = responseBody.errors.join(", ");
        showMessage(`❌ Validation Error: ${errorMessage}`, 'error');
      } else {
        // Single validation error
        showMessage(`❌ Validation Error: ${responseBody.message}`, 'error');
      }
      console.error("Validation Error:", responseBody);
    } else {
      // Handle other potential API errors
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`
      );
    }
  } catch (error) {
    console.error("Error updating book:", error);
    showMessage(`❌ Failed to update book: ${error.message}`, 'error');
  }
}

// Event listener for form submission
editBookForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  
  hideMessage();
  
  const updatedBookData = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
  };

  // Basic client-side validation
  if (!updatedBookData.title || !updatedBookData.author) {
    showMessage("Please fill in both title and author fields.", 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Updating...";

  try {
    await updateBook(updatedBookData);
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = "💾 Update Book";
  }
});

// Real-time validation feedback
titleInput.addEventListener('input', function() {
  if (this.value.length > 50) {
    this.style.borderColor = '#dc3545';
  } else {
    this.style.borderColor = '#ddd';
  }
});

authorInput.addEventListener('input', function() {
  if (this.value.length > 50) {
    this.style.borderColor = '#dc3545';
  } else {
    this.style.borderColor = '#ddd';
  }
});

// Initialize the page
document.addEventListener("DOMContentLoaded", () => {
  const bookId = getBookIdFromUrl();
  
  if (!bookId) {
    showError("No book ID provided in URL. Please select a book from the books list.");
    return;
  }
  
  // Validate that bookId is a number
  if (isNaN(bookId) || bookId <= 0) {
    showError("Invalid book ID provided. Please select a valid book from the books list.");
    return;
  }
  
  // Load the book data
  loadBookData(bookId);
});
