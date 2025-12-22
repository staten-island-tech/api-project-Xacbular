// import "./style.css";

const breweryAPI = "https://api.openbrewerydb.org/v1/breweries/random";

async function getData(breweryAPI) {
  try {
    const response = await fetch(breweryAPI);
    const data = await response.json();
    console.log(data.name);
    document.getElementById("api-response").innerText = data[0].name;
    console.log(data);
  } catch (error) {
    console.error(error);
  }
}
getData(breweryAPI);
