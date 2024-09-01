const btn = document.getElementById("searchBtn");
const err = document.getElementById("error");
const imageElement = document.getElementById("icon");
const aElement = document.getElementById("a");

async function fetchData() {
  try {
    const search = document.getElementById("searchBox").value.toLowerCase();
    const version = document.getElementById("versions").value;
    const loader = document.getElementById("loader").value;

    let catagory;
    if (loader === 'All') {
        catagory = ''
    }
    else {
        catagory = ',[ "categories:' + loader + '"]'
    }
    
    let versionStr

    if (version == "any") {
      versionStr = ""
    } else {
      versionStr = ',["versions:' +
      version +
      '"'
    }

    let url = 
    "https://api.modrinth.com/v2/search?query=" +
      search +
      '&facets=[["project_type:mod"]' + catagory + 
      versionStr +
      ']&limit=1'

      console.log(url)
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Cant find rescorse sry");
    }
    console.log(url);
    const data = await response.json();
    console.log(data.hits[0]);
    const image = data.hits[0].icon_url;
    imageElement.src = image;
    imageElement.style.display = "block";
    imageElement.alt = data.hits[0].title;
    try {
      let xversion1
      if (!version == "any") {
        xversion1 = '?game_versions=["' +
          version +
          '"]'
      } else {
        xversion1 = ""
      }
      let xurl = 
      "https://api.modrinth.com/v2/project/" +
        data.hits[0].project_id +
        '/version' + xversion1
      const xresponse = await fetch(xurl);
      if (!xresponse.ok) {
        throw new Error("Cant find rescorse sry");
      }
      console.log(data.hits[0]);
      const xdata = await xresponse.json();
      console.log(xdata);
      const xVersion = xdata[0]["files"][0]["url"];
      aElement.href = xVersion;
      err.innerHTML = data.hits[0].title + " for version " + xdata[0]["game_versions"][0];
      console.log(xdata[0])
    } catch (error) {
        ConsoleError(error)
    }
  } catch (error) {
    ConsoleError(error)
  }
}

function handle(event) {
  if (event.key === "Enter") {
    fetchData("1.20");
  }
}


function ConsoleError(error) {
    err.innerHTML = "There are no mods found! Check the console if you want to know more";
    console.error(error);
    imageElement.style.display = "none";
}