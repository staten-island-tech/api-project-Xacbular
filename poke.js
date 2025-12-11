async function getData(poke) {
  try {
    //get data from api
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${poke}`);
    if (response.status != 200) {
      throw new Error(response);
    } else {
      //converts response into json we can use
      const data = await response.json();
      document.getElementById("api-response").textContent = data.name;
    }
  } catch (error) {
    console.error(error);
  }
}

getData("Squirtle");
