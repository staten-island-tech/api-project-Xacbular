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

    if (!response.ok) throw new Error("Server error. Please try again.");

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

// 2. Render cards with insertAdjacentHTML
function renderBooks(bookArray) {
  uiElements.container.innerHTML = "";

  bookArray.forEach((book) => {
    // Simplify: create the ID once here
    const cleanId = book.key.split("/").pop();
    const author = book.author_name ? book.author_name[0] : "Unknown Author";

    const cardHTML = `
      <div class="bg-white p-6 rounded-xl shadow-lg border border-amber-100 flex flex-col justify-between">
        <div>
          <h3 class="font-bold text-xl text-amber-900">${book.title}</h3>
          <p class="text-gray-600 italic">By ${author}</p>
          <div id="desc-${cleanId}" class="mt-4 text-sm text-gray-700"></div>
        </div>
        <button 
          onclick="fetchDescription('${book.key}', '${cleanId}')"
          class="mt-6 bg-amber-100 text-amber-900 font-semibold py-2 px-4 rounded hover:bg-amber-200"
        >
          View Description
        </button>
      </div>
    `;
    uiElements.container.insertAdjacentHTML("beforeend", cardHTML);
  });
}

// 3. Fetching the specific description (The Second API Call)
window.fetchDescription = async function (workKey, cleanId) {
  const descBox = document.getElementById(`desc-${cleanId}`);
  descBox.innerText = "Loading...";

  try {
    const response = await fetch(`https://openlibrary.org${workKey}.json`);
    const details = await response.json();

    // Simplified: Check if description exists, then check if it's an object or string
    let rawDesc = details.description || "No description available.";
    let finalDesc = typeof rawDesc === "object" ? rawDesc.value : rawDesc;

    descBox.innerText = finalDesc.slice(0, 200) + "...";
  } catch (err) {
    descBox.innerText = "Failed to load description.";
  }
};

// 4. Submit Event
uiElements.form.addEventListener("submit", (e) => {
  e.preventDefault();
  const query = uiElements.input.value.trim();
  if (query) searchBook(query);
  else alert("Please enter a title!");
});
