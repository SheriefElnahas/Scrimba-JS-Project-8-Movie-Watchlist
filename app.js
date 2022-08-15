const APIKEY = "a268923f";

const searchInput = document.querySelector(".search-input");
const searchBtn = document.querySelector(".search-btn");
const moviesContainer = document.querySelector('.movies-container');

let moviesHTML = "";

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const searchValue = searchInput.value;

  fetch(`http://www.omdbapi.com/?s=${searchValue}&apikey=${APIKEY}`)
    .then((res) => res.json())
    .then((movies) => {
      if (movies.Search.length > 1) {
        for (let movie of movies.Search) {
          fetch(`http://www.omdbapi.com/?i=${movie.imdbID}&apikey=${APIKEY}`)
            .then((res) => res.json())
            .then((movie) => {
              moviesHTML += `
                <div class="movie">
                <img src="${movie.Poster}" alt="${movie.Title}" class="movie-img">
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
                moviesContainer.innerHTML = moviesHTML;
            });
        }
      } else if (movies.Search.length === 1) {
        // Render only 1 movie
      }
    });
});

// tt0372784
// fetch(`http://www.omdbapi.com/?i=tt0372784&apikey=${APIKEY}`)
//   .then((res) => res.json())
//   .then((data) => {
//     console.log(data);
//   });

