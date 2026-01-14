const uiElements = {
  form: document.getElementById("search-form"),
  input: document.getElementById("book-input"),
  container: document.getElementById("results-container"),
};

async function searchBook(title) {
  try {
    uiElements.container.innerHTML =
      "<p class='text-center col-span-full'>Searching for books...</p>";

    const response = await fetch(
      `https://openlibrary.org/search.json?title=${title}&limit=6`
    );

    // Promise Handling: Check if the response is okay
    if (!response.ok) {
      throw new Error("The server is not responding. Please try again later.");
    }

    const data = await response.json();

    // Logic to handle empty results
    if (data.docs.length === 0) {
      uiElements.container.innerHTML =
        "<p class='text-center col-span-full'>No books found. Try another title!</p>";
    } else {
      renderBooks(data.docs); // Send the array of books to be displayed
    }
  } catch (error) {
    // Promise Handling: Alerting the user to the specific failure
    uiElements.container.innerHTML = `<p class="text-red-600 text-center col-span-full">${error.message}</p>`;
  }
}

// Array Methods: Using .forEach to iterate and display data
function renderBooks(bookArray) {
  uiElements.container.innerHTML = ""; // Clear previous results

  bookArray.forEach((book) => {
    // We create a "card" for each book
    const card = document.createElement("div");
    card.className =
      "bg-white p-6 rounded-xl shadow-lg border border-amber-100 flex flex-col justify-between";

    // We use the 'key' from the API to uniquely identify which book needs a description
    const bookId = book.key.split("/").pop();

    card.innerHTML = `
      <div>
        <h3 class="font-bold text-xl text-amber-900">${book.title}</h3>
        <p class="text-gray-600 italic">By ${
          book.author_name ? book.author_name[0] : "Unknown Author"
        }</p>
        <div id="desc-${bookId}" class="mt-4 text-sm text-gray-700"></div>
      </div>
      <button 
        onclick="fetchDescription('${book.key}', '${bookId}')"
        class="mt-6 bg-amber-100 text-amber-900 font-semibold py-2 px-4 rounded hover:bg-amber-200"
      >
        View Description
      </button>
    `;
    uiElements.container.appendChild(card);
  });
}

// Second API Call: Fetching specific details based on user input (button click)
window.fetchDescription = async function (workKey, bookId) {
  const descBox = document.getElementById(`desc-${bookId}`);
  descBox.innerText = "Loading description...";

  try {
    const response = await fetch(`https://openlibrary.org${workKey}.json`);
    const details = await response.json();

    let description = "No description found for this book.";

    if (details.description) {
      // Descriptions can be a string OR an object {value: "..."}
      description =
        typeof details.description === "string"
          ? details.description
          : details.description.value;
    }

    descBox.innerText = description.slice(0, 150) + "..."; // Keep it short
  } catch (err) {
    descBox.innerText = "Failed to load description.";
  }
};

// Form Handling: Logic to prevent blank fields
uiElements.form.addEventListener("submit", (event) => {
  event.preventDefault(); // Stop the page from refreshing
  const userQuery = uiElements.input.value.trim();

  if (userQuery === "") {
    alert("Please enter a book name first!");
  } else {
    searchBook(userQuery);
  }
});
