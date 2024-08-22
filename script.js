const btn = document.getElementById("searchBtn");
const err = document.getElementById("error");
const imageElement = document.getElementById("icon");
const aElement = document.getElementById("a");

async function fetchData() {
  try {
    const search = document.getElementById("searchBox").value.toLowerCase();
    const version = document.getElementById("versions").value;

    const response = await fetch(
      "https://api.modrinth.com/v2/search?query=" +
        search +
        '&&facets=[["project_type:mod"],["versions:' +
        version +
        '"]]&&limit=1'
    );
    if (!response.ok) {
      throw new Error("Cant find rescorse sry");
    }
    console.log(
      "https://api.modrinth.com/v2/search?query=" +
        search +
        '&&facets=[["project_type:mod"],["versions:' +
        version +
        '"]]&&limit=1'
    );
    const data = await response.json();
    console.log(data.hits[0]);
    const image = data.hits[0].icon_url;
    imageElement.src = image;
    imageElement.style.display = "block";
    imageElement.alt = data.hits[0].title;
    try {
      const xresponse = await fetch(
        "https://api.modrinth.com/v2/project/" +
          data.hits[0].project_id +
          '/version?game_versions=["' +
          version +
          '"]'
      );
      if (!xresponse.ok) {
        throw new Error("Cant find rescorse sry");
      }
      console.log(
        "https://api.modrinth.com/v2/project/" +
          data.hits[0].project_id +
          '/version?game_versions=["' +
          version +
          '"]'
      );
      console.log(data.hits[0]);
      const xdata = await xresponse.json();
      console.log(xdata);
      const xVersion = xdata[0]["files"][0]["url"];
      aElement.href = xVersion;
      err.innerHTML = data.hits[0].title + " for version " + version;
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
    err.innerHTML = error;
    console.error(error);
    imageElement.src = "error.jpg";
}