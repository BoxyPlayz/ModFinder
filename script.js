async function fetchData(version) {
  try {
    const search = document.getElementById("searchBox").value.toLowerCase();

    const response = await fetch(
      "https://api.modrinth.com/v2/search?query=" +
        search +
        '&&facets=[["project_type:mod"]]&&limit=1'
    );
    if (!response.ok) {
      throw new Error("Cant find rescorse sry");
    }
    const data = await response.json();
    console.log(data.hits[0]);
    const image = data.hits[0].icon_url;
    const imageElement = document.getElementById("icon");
    const aElement = document.getElementById("a");
    imageElement.src = image;
    imageElement.style.display = "block";
    imageElement.alt = data.hits[0].title;
    try {
      const xresponse = await fetch(
        "https://api.modrinth.com/v2/project/" + data.hits[0].project_id + "/version?game_versions=[" + '"1.20.1"' + "]"
      );
      if (!xresponse.ok) {
        throw new Error("Cant find rescorse sry");
      }
      const xdata = await xresponse.json();
      const xVersion = xdata[0]['files'][0]['url']
      aElement.href = xVersion
    } catch (error) {
      console.error(error);
    }
  } catch (error) {
    console.error(error);
  }
}

function openInNewTab(url) {
  window.open("https://modrinth.com", "_blank").focus();
}
