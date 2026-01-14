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

    if (!response.ok) {
      throw new Error("The server is not responding. Please try again later.");
    }

    const data = await response.json();

    if (data.docs.length === 0) {
      uiElements.container.innerHTML =
        "<p class='text-center col-span-full'>No books found. Try another title!</p>";
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

window.fetchDescription = async function (workKey, bookId) {
  const descBox = document.getElementById(`desc-${bookId}`);
  descBox.innerText = "Loading description...";

  try {
    const response = await fetch(`https://openlibrary.org${workKey}.json`);
    const details = await response.json();

    let description = "No description found for this book.";

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
