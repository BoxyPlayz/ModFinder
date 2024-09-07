const err = document.getElementById("error");
const mods = document.getElementById("mods");

let imageElement;
let aElement;
let textElement;
let descElement;

let Name;
let data;

fetchData()

async function fetchData() {
  mods.innerHTML = "";
  try {
    const search = document.getElementById("searchBox").value.toLowerCase();
    const version = document.getElementById("versions").value;
    const loader = document.getElementById("loader").value;

    let catagory;
    if (loader === "All") {
      catagory = "";
    } else {
      catagory = ',["categories:' + loader + '"]';
    }

    let versionStr;

    if (version == "any") {
      versionStr = "";
    } else {
      versionStr = ',["versions:' + version + '"]';
    }

    let queryStr;
    if (search == "") {
      queryStr = "";
    } else {
      queryStr = `query=${search}&`;
    }

    let url = `https://api.modrinth.com/v2/search?${queryStr}facets=[["project_type:mod"]${catagory}${versionStr}]&limit=1`;

    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Cant find rescorse sry");
    }
    data = await response.json();
    console.log(data.hits[0]);
    const image = data.hits[0].icon_url;
    aElement = document.createElement("a");
    imageElement = document.createElement("img");
    imageElement.parentElement = aElement;
    imageElement.src = image;
    imageElement.style.display = "block";
    imageElement.alt = data.hits[0].title;
    textElement = document.createElement("h4");
    descElement = document.createElement("p");
    descElement.innerHTML = data.hits[0].description;
    try {
      let xversion1;
      if (version == "any") {
        xversion1 = "";
      } else {
        xversion1 = '?game_versions=["' + version + '"]';
      }
      let xurl =`https://api.modrinth.com/v2/project/${data.hits[0].project_id}/version${xversion1}`
      const xresponse = await fetch(xurl);
      console.log(xurl)
      if (!xresponse.ok) {
        throw new Error("Cant find rescorse sry");
      }
      let xdata = await xresponse.json();
      console.log(xdata);
      const xVersion = xdata[0]["files"][0]["url"];
      mods.appendChild(aElement);
      aElement.href = xVersion;
      aElement.appendChild(imageElement);
      Name =
        `${data.hits[0].title} for version ${xdata[0]["game_versions"][0]}`;
      textElement.innerHTML = Name;
      err.style.display = "none";
      aElement.appendChild(textElement);
      aElement.appendChild(descElement);
      console.log(xdata[0]);
    } catch (error) {
      ConsoleError(error);
    }
  } catch (error) {
    let error1 = error;
    try {
      if ((data.hits = [])) {
        err.innerHTML = "No mods found";
        err.style.display = "block";
      } else {
        ConsoleError(error1);
      }
    } catch (err) {
      ConsoleError(error1);
    }
  }
}

function handle(event) {
  if (event.key === "Enter") {
    fetchData();
  }
}

function ConsoleError(error) {
  err.style.display = "block";
  err.innerHTML = `${error}`;
  console.error(error);
}
