const search = document.getElementById("search");
const searchBtn = document.getElementById("search-btn");
const movieComponents = document.getElementById("main");
const watchListArr = [];

searchBtn.addEventListener('click', handleSearch)
search.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') {
        handleSearch()
    }
})

//search on click function
function handleSearch() {
    
    movieComponents.innerHTML = ""
    const movieTitles = []
    fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=39f8e634&s=${search.value}`)
        .then(res => res.json())
        .then(data => {
            if (data.Response !== 'False') {
                data.Search.forEach(element => {
                    movieTitles.push(element.Title)
                })
            } else {
                movieComponents.innerHTML = `<p class="start-exploring">Unable to find what you're looking for. <br/>Please try another search.</p>`
            }
            console.log()
    
    
    //loop through Titles array and fetch individual movie titles    
    for(var i = 0; i < movieTitles.length; i++) {
        fetch(`https://www.omdbapi.com/?i=tt3896198&apikey=39f8e634&t=${movieTitles[i]}`)
            .then(res => res.json())
            .then(data => {
                const movieData = {
                    Image: data.Poster,
                    Title: data.Title,
                    Rating: data.imdbRating,
                    Runtime: data.Runtime,
                    Genre: data.Genre,
                    Plot: data.Plot
                }
            
            watchListArr.push(movieData);
            renderSearchResult(movieData);
            })
    }
    })
}
//render search result function
function renderSearchResult(data){
    movieComponents.innerHTML += `
    <div class="card">
        <p id="count"></p>
        <img src=${data.Image} alt="movie image" class="movie-img">
        <div class="card-contents">
            <div class="card-title-wrapper">
                <h3 class="card-title">${data.Title}</h3>
                <div class="rating">
                    <i class="fa-solid fa-star"></i>
                    <p class="score">${data.Rating}</p>
                </div>
            </div>
            <div class="movie-stats">
                <p class="runtime">${data.Runtime}</p>
                <p class="genre">${data.Genre}</p>
                <div class="add-to-watchList" onClick="addToWatchList(event)">
                    <i class="fa-solid fa-circle-plus" id="add-watchList"></i>
                    <p>WatchList</p>
                </div>
            </div>
            <p class="plot">${data.Plot}</p>
        </div>
    </div>
    `
    
}


// adding movie to watchlist localstorage

const localMovies = []

function addToWatchList(event) {
    const card = event.target.closest('.card')
    const title = card.querySelector('.card-title').textContent

    // get existing movies from local storage or create an empty array
    let localmovies = JSON.parse(localStorage.getItem('movies')) || []
    
    // find the movied to add from arr
    const movieToAdd = watchListArr.find(movie => movie.Title === title)

    // add the movie to the localmovies array
    if (movieToAdd) {
        localMovies.push(movieToAdd)
    }
    // store the updated array in local storage

    localStorage.setItem('movies', JSON.stringify(localMovies))

}

//change icon on added to watchlist
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-circle-plus")) {
        e.target.classList.replace('fa-circle-plus', 'fa-circle-check')
    } 
})
