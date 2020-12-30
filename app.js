let newsArticles = [];
const API_KEY = "7ad27e6d8c4b4c818cca946bf4dfac73";

async function update(){
    // let url = `http://newsapi.org/v2/everything?q=javscript&from=2020-11-30&sortBy=publishedAt&language=en&apiKey=${API_KEY}`;
    let url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`;
    const result = await fetch(url);
    const data = await result.json();
    console.log(data);
    newsArticles = data.articles;

    render();
}
function renderArticleCard(article){
    return`
    <div class="col-md-4 col-sm-6"
        <div class="card news-article">
            <img class="card-img-top" src="${article.urlToImage}" 
            onerror="this.onerror=null;this.src='image/default.png';">
            <div class="card-body">
                <h5 class="card-title">${article.title}</h5>
                <p class="card-text">${article.description}</p>
                <a href="${article.url}" class="btn btn-primary">View Story</a>
            </div>
        <div class="card-footer">
            <small class="text-muted">${moment(article.publishedAt)}</small>
        </div>
        </div>
    </div>
    `
}

function render(){
    let resultsArea = document.getElementById("results");
    resultsArea.innerHTML = newsArticles.map(article => renderArticleCard(article)).join("\n");
}
update();