// import "./style.css";

// const breweryAPI = "https://api.openbrewerydb.org/v1/breweries/random";

// async function getData(breweryAPI) {
//   try {
//     const response = await fetch(breweryAPI);
//     const data = await response.json();
//     console.log(data.name);
//     document.getElementById("api-response").innerText = data[0].name;
//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }
// getData(breweryAPI);

async function searchBook(title) {
  try {
    //get data from api
    const response = await fetch(
      `https://openlibrary.org/search.json?title=${title}`
    );
    console.log(response);
    if (response.status != 200) {
      throw new Error(response);
    } else {
      //converts response into json we can use
      const data = await response.json();
      document.getElementById("api-response").innerText = data.docs[0].title;
    }
  } catch (error) {
    console.error(error);
  }
}

// async function getBookDescription(workKey) {
//   try {
//     // Note: workKey looks like "/works/OL123W"
//     const response = await fetch(`https://openlibrary.org${workKey}.json`);
//     const details = await response.json();

//     // Descriptions can be a simple string OR an object with a .value property
//     let description = "No description available.";
//     if (details.description) {
//       description = typeof details.description === 'string'
//         ? details.description
//         : details.description.value;
//     }

//     return description;
//   } catch (error) {
//     console.error("Error fetching description:", error);
//   }
// }

// Work on this, implement some sort of ID finding system.
/// https://openlibrary.org/dev/docs/api/search
// https://openlibrary.org/works/OL27448W.json

searchBook("the lord of the rings");
