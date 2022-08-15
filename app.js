const APIKEY = "a268923f";

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const moviesContainer = document.querySelector(".movies-container");
const watchIconContainer = document.querySelector(".watch-icon-container");
const errorMessage = document.querySelector('.error-message');

let moviesHTML = "";

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();

  // Clear Movies HTML Before Each Search
  moviesHTML = "";

  // Extract Search Input Value
  const searchValue = searchInput.value;

  // Only start searching if the input is not empty
  if (searchValue) {
    getMovieId(searchValue);
  }
});

async function getMovieId(movieName) {
  const response = await fetch(`http://www.omdbapi.com/?s=${movieName}&apikey=${APIKEY}`);
  const movies = await response.json();

  // Avoid Too many results error & Movie Not Found
  if (movies.Response !== "False") {
    // Hide the icon - Error -  and dispaly the movies container
    watchIconContainer.style.display = "none";
    moviesContainer.style.display = "block";
    errorMessage.style.display = 'none';

    // Only loop if there is more than 1 movie
    if (movies.Search.length > 1) {
      for (let movie of movies.Search) {
        // call get movies based on movie id and give it the movie id
        getMoviesBasedOnMovieId(movie.imdbID);
      }
      // if there is only 1 movie , then extract that movie and do the same thing
    } else if (movies.Search.length === 1) {
      getMoviesBasedOnMovieId(movies.Search[0].imdbID);
    }
  } else if(movies.Error) {
    // Hide Watch - movies continer And Show Error Message And Change Input Value
    watchIconContainer.style.display = 'none';
    moviesContainer.style.display = 'none';
    errorMessage.style.display = 'block';
    

    // Clear the input and update the placeholder
    searchInput.value = '';
    searchInput.placeholder = 'Searching something with no data';

  }
}

async function getMoviesBasedOnMovieId(movieId) {
  const response = await fetch(
    `http://www.omdbapi.com/?i=${movieId}&apikey=${APIKEY}`
  );
  const movie = await response.json();

  // Build HTML out of this movie data
  buildHTML(movie);

  // !!!!!!!!!! Not efficient ! i'm manipulating the DOM more than once. !!!!!!!!!!!!!!!!!!!
  moviesContainer.innerHTML = moviesHTML;
}

function buildHTML(movie) {

    // If there is no poster - provide no poster image
    let poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg';


  moviesHTML += `
    <div class="movie">
    <img src="${poster}" alt="${movie.Title}" class="movie-img">
    <div class="movie-content">
        <h3 class="movie-title">${movie.Title} <span class="movie-star">&starf;</span>  <span class="movie-rate">${movie.imdbRating}</span></h3>
        <div class="movie-details">
            <p class="mintues">${movie.Runtime}</p>
            <p class="type">${movie.Genre}</p>
            <button class="btn-watchlist"><i class="fa-solid fa-circle-plus plus-icon"></i> Watchlist</button>
        </div>
        <p class="movie-description">${movie.Plot}</p>
    </div>
    </div>
    `;
}
