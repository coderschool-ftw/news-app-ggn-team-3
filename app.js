let newsArticles = [];
const API_KEY = "97a8df3625884a2da87308f934ecfbbd";
let SourceObj = {};
let numOfArticle = 0;
let url = "";
let categories = [
  "Business",
  "Entertainment",
  "General",
  "Health",
  "Science",
  "Sports",
  "Technology",
];
let cat ="general";

function updateSourceObj() {
  // expected: SourceObj = { BBC: 2, CNN: 1, NewYork: 3}
  SourceObj = {};
  newsArticles.map((article) => {
    let key = article.source.name;
    if (SourceObj.hasOwnProperty(key)) {
      SourceObj[key] += 1;
    } else {
      SourceObj[key] = 1;
    }
  });
  console.log(SourceObj);
}
function renderArticleCard(article) {
  return `
    <div class="col-md-4 col-sm-6"
        <div class="card news-article">
            <img class="card-img-top" src="${article.urlToImage}" 
            onerror="this.onerror=null;this.src='image/default.png';">
            <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description}</p>
                <p class="text-muted">${article.source.name}</p>
                <a href="${article.url}" class="btn btn-primary">View Story</a>
            </div>
            <div class="card-footer">
                <small class="text-muted">${moment(article.publishAt)
                  .startOf("hour")
                  .fromNow()}</small>
            </div>
        </div>
    </div>
    `;
}

function render() {
  let resultsArea = document.getElementById("results");

  resultsArea.innerHTML = newsArticles
    .filter((article) => article.Checked === true)
    .map((article) => renderArticleCard(article))
    .join("\n");

  numOfArticle = newsArticles.filter((article) => article.Checked === true).length;
  document.getElementById("numOfArticle").innerHTML = ` (${numOfArticle})`; //load number of article
}

// belong to checkbox
function renderCheckBox(key) {
  return `
        <input type="checkbox" class="btn-check" checked onchange="toggleSource(event)" value="${key}" id="${key}">
        <label class="btn btn-outline-primary mb-2" for="${key}">${key} (${SourceObj[key]})</label>
    `;
}

function renderCheckBoxArea() {
  let checkBoxArea = document.getElementById("checkBox");
  checkBoxArea.innerHTML = "";
  for (let key in SourceObj) {
    checkBoxArea.innerHTML += renderCheckBox(key);
  }
}
// belong to checkbox

function toggleSource(event) {
  //update newsArticles
  newsArticles.forEach((article) => {
    if (article.source.name === event.target.value) {
      article.Checked = event.target.checked;
    }
  });
  render();
}
//The user should see new stories related to the category he/she chose.
function renderCategory() {
  categories.map((category) => {
    //let url = `https://newsapi.org/v2/top-headlines?country=us&${category}&apiKey=${API_KEY}`;

    document.getElementById(
      "category"
    ).innerHTML += `<button id="${category}" onclick="haha(event)" type="button" class="list-group-item list-group-item-action">${category}</button>`;
    /* document.getElementById(`${category}`).addEventListener("click", haha);
    console.log(document.getElementById(`${category}`)); */
  });
}

function haha(event) {
  cat = event.target.id;
  url = `https://newsapi.org/v2/top-headlines?country=us&category=${cat}&apiKey=${API_KEY}`;
  console.log("haha");
  console.log(url);
  loadMore.style.visibility = "visible";
  update();
}
//rendercategory=> button=> function onclick
renderCategory();
async function update() {
  // let url = `http://newsapi.org/v2/everything?q=javscript&from=2020-11-30&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;

  if (url === "") {
    url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
  }
  console.log(url);
  const result = await fetch(url);
  const data = await result.json();
  console.log(data);
  newsArticles = data.articles;
  // numOfArticle = newsArticles.length;
  // console.log(numOfArticle);
  newsArticles = newsArticles.map((x) => ({ ...x, Checked: true }));
  console.log(newsArticles);
  loadMore.addEventListener("click", updateMore);
  updateSourceObj();
  render();
  renderCheckBoxArea();

  // document.getElementById("numOfArticle").innerHTML = ` (${numOfArticle})`; //load number of article
}

update();

let loadMore = document.getElementById("loadMore");
async function updateMore(e) {
  e.preventDefault();
  let url = `https://newsapi.org/v2/top-headlines?country=us&category=${cat}&page=2&apiKey=${API_KEY}`;
  const result = await fetch(url);
  const data = await result.json();
  let newArray = data.articles;

  newArray = newArray.map((x) => ({ ...x, Checked: true }));
  newsArticles.push(...newArray);
  // numOfArticle = newsArticles.length;
  // document.getElementById("numOfArticle").innerHTML = ` (${numOfArticle})`; //load number of article
  loadMore.style.visibility = "hidden";

  updateSourceObj(); 
  render();
  renderCheckBoxArea();
}
