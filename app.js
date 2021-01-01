let newsArticles = [];
const API_KEY = "7ad27e6d8c4b4c818cca946bf4dfac73";
let SourceObj = {};

async function update(){
    // let url = `http://newsapi.org/v2/everything?q=javscript&from=2020-11-30&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
    const result = await fetch(url);
    const data = await result.json();
    console.log(data);
    newsArticles = data.articles;
    newsArticles = newsArticles.map(x => ({...x, Checked: true}));
    console.log(newsArticles);
    updateSourceObj();
    
    render();
    renderCheckBoxArea();
}
function updateSourceObj(){
    // expected: SourceObj = { BBC: 2, CNN: 1, NewYork: 3}
    SourceObj = {};
    newsArticles.map(article => {
        let key = article.source.name;
        if (SourceObj.hasOwnProperty(key)) {
            SourceObj[key] += 1;
        }
        else{
            SourceObj[key] = 1;
        }
    });
    console.log(SourceObj);
}
function renderArticleCard(article) {
  return `
    <div class="col-md-4 col-sm-6"
        <div class="card news-article">
            <p>${article.source.name}</p>
            <img class="card-img-top" src="${article.urlToImage}" 
            onerror="this.onerror=null;this.src='image/default.png';">
            <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description}</p>
                <a href="${article.url}" class="btn btn-primary">View Story</a>
            </div>
            <div class="card-footer">
                <small class="text-muted">${moment(article.publishAt).startOf('hour').fromNow()}</small>
            </div>
        </div>
    </div>
    `;
}

function render(){
    let resultsArea = document.getElementById("results");
    resultsArea.innerHTML = newsArticles
                            .filter(article => article.Checked === true)
                            .map(article => renderArticleCard(article)).join("\n");
}
function renderCheckBox(key){
    return`
        <input type="checkbox" class="btn-check" checked onchange="toggleSource(event)" value="${key}" id="${key}">
        <label class="btn btn-outline-primary mb-2" for="${key}">${key} (${SourceObj[key]})</label>
    `
}
function renderCheckBoxArea(){
    let checkBoxArea = document.getElementById("checkBox"); 
    checkBoxArea.innerHTML = "";
    for(let key in SourceObj){
        checkBoxArea.innerHTML += renderCheckBox(key);
    }
}
function toggleSource (event){
    //update newsArticles
    newsArticles.forEach(article => {
        if(article.source.name === event.target.value){
            article.Checked = event.target.checked;
        }
    });
    render();
}
update();

let loadMore = document.getElementById("loadMore");
loadMore.addEventListener("click", updateMore);
async function updateMore(e) {
  e.preventDefault();
  let url = `https://newsapi.org/v2/top-headlines?country=us&page=2&apiKey=${API_KEY}`;
  const result = await fetch(url);
  const data = await result.json();
  let newArray = data.articles;

  newArray = newArray.map(x => ({...x, Checked: true}));
  newsArticles.push(...newArray);

  loadMore.style.visibility = "hidden";

  updateSourceObj();
  render();
  renderCheckBoxArea();
}
