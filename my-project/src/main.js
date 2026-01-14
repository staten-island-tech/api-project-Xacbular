const uiElements = {
  form: document.getElementById("search-form"),
  input: document.getElementById("book-input"),
  container: document.getElementById("results-container"),
};

// 1. Search for books
async function searchBook(title) {
  try {
    uiElements.container.innerHTML =
      "<p class='text-center col-span-full'>Searching...</p>";

    // We use encodeURIComponent to handle titles with spaces or special characters safely
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${encodeURIComponent(
        title
      )}&limit=6`
    );

    if (!response.ok) {
      throw new Error("The server is not responding. Please try again later.");
    }

    const data = await response.json();

    if (data.docs.length === 0) {
      uiElements.container.innerHTML =
        "<p class='text-center col-span-full'>No books found!</p>";
    } else {
      renderBooks(data.docs);
    }
  } catch (error) {
    uiElements.container.innerHTML = `<p class="text-red-600 text-center col-span-full">${error.message}</p>`;
  }
}

function renderBooks(bookArray) {
  uiElements.container.innerHTML = "";

  bookArray.forEach((book) => {
    const card = document.createElement("div");
    card.className =
      "bg-white p-6 rounded-xl shadow-lg border border-amber-100 flex flex-col justify-between";

    const bookId = book.key.split("/").pop();

    card.innerHTML = `
      <div>
        <h3 class="font-bold text-xl text-amber-900">${book.title}</h3>
        <p class="text-gray-600 italic">By ${
          book.author_name ? book.author_name[0] : "Unknown Author"
        }</p>
        <div id="desc-${bookId}" class="mt-4 text-sm text-gray-700"></div>
      </div>
    `;
    uiElements.container.insertAdjacentHTML("beforeend", cardHTML);
  });
}

window.fetchDescription = async function (workKey, bookId) {
  const descBox = document.getElementById(`desc-${bookId}`);
  descBox.innerText = "Loading description...";

  try {
    const response = await fetch(`https://openlibrary.org${workKey}.json`);
    const details = await response.json();

    // Simplified: Check if description exists, then check if it's an object or string
    let rawDesc = details.description || "No description available.";
    let finalDesc = typeof rawDesc === "object" ? rawDesc.value : rawDesc;

    if (details.description) {
      description =
        typeof details.description === "string"
          ? details.description
          : details.description.value;
    }

    descBox.innerText = description.slice(0, 150) + "...";
  } catch (err) {
    descBox.innerText = "Failed to load description.";
  }
};

uiElements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const userQuery = uiElements.input.value.trim();

  if (userQuery === "") {
    alert("Please enter a book name first!");
  } else {
    searchBook(userQuery);
  }
});
