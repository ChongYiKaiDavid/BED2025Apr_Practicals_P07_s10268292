// Get references to the form and message elements:
const createBookForm = document.getElementById("createBookForm");
const messageDiv = document.getElementById("message");
const submitBtn = document.getElementById("submitBtn");
const apiBaseUrl = "http://localhost:3000";

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

createBookForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the default browser form submission

  hideMessage(); // Clear previous messages

  // Collect data from the form inputs
  const titleInput = document.getElementById("title");
  const authorInput = document.getElementById("author");

  const newBookData = {
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
  };

  // Basic client-side validation
  if (!newBookData.title || !newBookData.author) {
    showMessage("Please fill in both title and author fields.", 'error');
    return;
  }

  // Show loading state
  submitBtn.disabled = true;
  submitBtn.textContent = "Creating...";

  try {
    // Make a POST request to your API endpoint
    const response = await fetch(`${apiBaseUrl}/books`, {
      method: "POST", // Specify the HTTP method
      headers: {
        "Content-Type": "application/json", // Tell the API we are sending JSON
      },
      body: JSON.stringify(newBookData), // Send the data as a JSON string in the request body
    });

    // Parse response body
    const responseBody = response.headers
      .get("content-type")
      ?.includes("application/json")
      ? await response.json()
      : { message: response.statusText };

    if (response.status === 201) {
      // Success
      showMessage(`✅ Book created successfully! ID: ${responseBody.id}`, 'success');
      createBookForm.reset(); // Clear the form after success
      console.log("Created Book:", responseBody);
      
      // Option to redirect back to list after 2 seconds
      setTimeout(() => {
        if (confirm("Book created successfully! Go back to books list?")) {
          window.location.href = "index.html";
        }
      }, 2000);
      
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
      // Handle other potential API errors (e.g., 500 from error handling middleware)
      throw new Error(
        `API error! status: ${response.status}, message: ${responseBody.message}`
      );
    }
  } catch (error) {
    console.error("Error creating book:", error);
    showMessage(`❌ Failed to create book: ${error.message}`, 'error');
  } finally {
    // Reset button state
    submitBtn.disabled = false;
    submitBtn.textContent = "➕ Create Book";
  }
});

// Real-time validation feedback
const titleInput = document.getElementById("title");
const authorInput = document.getElementById("author");

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
