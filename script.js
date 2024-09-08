const err = document.getElementById("error");
const mods = document.getElementById("mods");

let imageElement;
let aElement;
let textElement;
let descElement;

let Name;
let data;

fetchData();

async function fetchData() {
  mods.innerHTML = "";

  //URL Setup
  const search = document.getElementById("searchBox").value.toLowerCase();
  const version = document.getElementById("versions").value;
  const loader = document.getElementById("loader").value;
  const num1 = document.getElementById("max").value;

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
  try {
    //GET Metadata
    let url = `https://api.modrinth.com/v2/search?${queryStr}facets=[["project_type:mod"]${catagory}${versionStr}]&limit=${num1}`;
    console.log(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Cant find rescorse sry");
    }
    data = await response.json();

    //GET Download
    for (let num = 0; num < num1; num++) {
      let xversion1;
      if (version == "any") {
        xversion1 = "";
      } else {
        xversion1 = `game_versions=["${version}"]`;
      }

      let loader1;
      if (loader == "All") {
        loader1 = "";
      } else {
        loader1 = `&loaders=["${loader}"]`;
      }
      let xurl = `https://api.modrinth.com/v2/project/${data.hits[num].project_id}/version?${xversion1}${loader1}`;
      const xresponse = await fetch(xurl);
      console.log(xurl);
      if (!xresponse.ok) {
        throw new Error("Cant find rescorse sry");
      }
      let xdata = await xresponse.json();
      console.log(xdata);
      const xVersion = xdata[num]["files"][0]["url"];
      const image = data.hits[num].icon_url;
      Name = `${data.hits[num].title} for version ${xdata[0]["game_versions"][0]}`;

      //Setup Elements
      aElement = document.createElement("a");
      imageElement = document.createElement("img");
      textElement = document.createElement("h4");
      descElement = document.createElement("p");
      aElement.href = xVersion;
      err.style.display = "none";

      //Append Items
      mods.appendChild(aElement);
      aElement.appendChild(textElement);
      aElement.appendChild(descElement);
      aElement.appendChild(imageElement);

      //Images
      imageElement.parentElement = aElement;
      imageElement.src = image;
      imageElement.style.display = "block";
      imageElement.alt = data.hits[num].title;

      //Meta
      descElement.innerHTML = data.hits[num].description;
      textElement.innerHTML = Name;
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
