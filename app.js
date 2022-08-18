const APIKEY = "a268923f";

const searchInput = document.querySelector(".search-input");
const moviesContainer = document.querySelector(".movies-container");
const videoIconContainer = document.querySelector(".watch-icon-container");
const errorMessage = document.querySelector(".error-message");

let moviesArr = [];
let moviesCounter = 0;

// **************************************************************************************************************
// |                                                Helper Functions                                            |
// **************************************************************************************************************
function hideElements(...elements) {
  if (elements.length === 1) {
    elements[0].style.display = "none";
  } else {
    for (let element of elements) {
      element.style.display = "none";
    }
  }
}

function showElements(...elements) {
  if (elements.length === 1) {
    elements[0].style.display = "block";
  } else {
    for (let element of elements) {
      element.style.display = "block";
    }
  }
}

// **************************************************************************************************************
// |                                                Search Movies                                               |
// **************************************************************************************************************

// Upong Clicking On Search Button
document.querySelector(".search-btn").addEventListener("click", (e) => {
  e.preventDefault();

  // Clear Movies Arr So that the new search replaces the old one
  moviesArr = [];

  // Extract Search Input Value
  const searchValue = searchInput.value;

  // Only start searching if the input is not empty
  if (searchValue) {
    getMovieId(searchValue);
  }
});

async function getMovieId(movieName) {
  // Fetch All Movies That match The Provided Movie Name
  const response = await fetch( `http://www.omdbapi.com/?s=${movieName}&apikey=${APIKEY}`);
  const { Search: movies, Response: responseMessage } = await response.json();

  // IF there are too many results or the movie is not found
  if (responseMessage !== "False") {
    // 1- Hide Watch Icon And Error Message
    hideElements(videoIconContainer, errorMessage);

    // 2- Display Movie COntainer
    showElements(moviesContainer);

    // Only loop if there is more than 1 movie
    if (movies.length > 1) {
      for (let movie of movies) {
        // pass movie id and length of the movies
        getMovieDetailsBasedOnMovieId(movie.imdbID, movies.length);
      }
      // if there is only 1 movie , then extract that movie and do the same thing
    } else if (movies.length === 1) {
      getMovieDetailsBasedOnMovieId(movies[0].imdbID, movies.length);
    }
  } else if (responseMessage === "False") {
    // Hide Watch - movies continer And Show Error Message And Change Input Value
    // 1- Hide Watch Icon & Movies Container
    hideElements(videoIconContainer, moviesContainer);

    // 2-Show Error Message
    showElements(errorMessage);

    // 3- Clear The Input Value & Update The PlaceHolder
    searchInput.value = "";
    searchInput.placeholder = "Searching something with no data";
  }
}

// Get Details Of The Movie Based On The Id
async function getMovieDetailsBasedOnMovieId(movieId, movieLength) {
  const response = await fetch(`http://www.omdbapi.com/?i=${movieId}&apikey=${APIKEY}`);
  const movie = await response.json();

  // Build An Object out of this movie data
  buildMovieObj(movie);

  // Store The HTML In A Varaible
  const moviesHTML = buildMoviesHTML();

  // Increase Movies Counter For Each Movie
  moviesCounter++;

  // When Movies Counter Is Equal To The Movies Number ( Fetch Is Over )
  if (movieLength === moviesCounter) {
    // Render The HTML ( To Manipulate The DOM Only Once For Better Performance ) & Reset The Counter
    moviesContainer.innerHTML = moviesHTML;
    moviesCounter = 0;
  }
}

function buildMovieObj(movie) {
  // If there is no poster - provide a a default no poster image
  let poster =
    movie.Poster !== "N/A"? movie.Poster : "https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg";

  // Extract The Valuse Out Of Movie Object And Build An Object From It
  const { imdbID, Title, imdbRating, Runtime, Genre, Plot } = movie;
  const movieObj = {
    imdbID,
    poster,
    Title,
    imdbRating,
    Runtime,
    Genre,
    Plot,
  };

  // Push This Movie Object To An Array ( We will use this to build the html out of it)
  moviesArr.push(movieObj);
}

function buildMoviesHTML() {
  const moviesHTML = moviesArr
    .map((singleMovie) => {
      const { imdbID, poster, Title, imdbRating, Runtime, Genre, Plot } =
        singleMovie;
      return `
      <div class="movie-container">

      <div class="movie" id="${imdbID}">
      <img src="${poster}" alt="${Title}" class="movie-img">
      <div class="movie-content">

          <h3 class="movie-title">${Title} <span class="movie-star">&starf;</span>  <span class="movie-rate">${imdbRating}</span></h3>
          <div class="movie-details">
              <p class="mintues">${Runtime}</p>
              <p class="type">${Genre}</p>
              <button class="btn-watchlist"><i class="fa-solid fa-circle-plus plus-icon"></i> Watchlist</button>
          </div>
          <p class="movie-description">${Plot}</p>
      </div>
      </div>
      </div>
      `;
    })
    .join("");
  return moviesHTML;
}

// **************************************************************************************************************
// |                                                Watch List                                                  |
// **************************************************************************************************************

let watchlistArr;

// If there is movies arr in the local storage then fetch it
if (localStorage.getItem("movies")) {
  watchlistArr = JSON.parse(localStorage.getItem("movies"));
} else {
  // Else initilaize an emtpy array
  watchlistArr = [];
}

// Add To Watch List Button Logic
moviesContainer.addEventListener("click", (e) => {
  const addToWatchlistClicked = e.target.classList.contains("btn-watchlist") || e.target.classList.contains("plus-icon");
  if (addToWatchlistClicked) {
    // 1-Extract This specific movie HTML element
    let movieElement = e.target.parentElement.parentElement.parentElement.outerHTML;
    
    // Extract Movie Id
    const movieId = e.target.parentElement.parentElement.parentElement.id



    // 2-Replace + Watchlist With - Remove
    movieElement = movieElement.replace('<i class="fa-solid fa-circle-plus plus-icon"></i> Watchlist','<i class="fa-solid fa-circle-minus"></i> Remove');


    // 3-Push This New Element To Watch List Arr
    // watchlistArr.push(movieElement);

    // If Array Is Empty Then Push The Movie To The array
    if(watchlistArr.length === 0) {
      watchlistArr.push(movieElement);
      // If the Array Is Not Empty Then
    } else {
      // 1- Loop Over The Watch List Array Moives
      for(let movie of watchlistArr) {
        // Any Movie In The Array Have The Same Id Of the Current Movie Then Leave This 
        if(movie.includes(movieId)) {
         return;
        } 
      }
      // If There Are No Matches Then Add This Item
      watchlistArr.push(movieElement);

    }



     
    

    // If Watchlist arr is empty then push the item 
    // IF Watchlist is not empty
      // 1-loop through these movie
         // 1-If any movie has the same id then dont add it 
         // 2- add the item
    



    


    // 4-Save This Watchlist Array In Local Storage
    localStorage.setItem("movies", JSON.stringify(watchlistArr));
    


  }
});

const searchHeader = document.querySelector(".search-header");
const searchForm = document.querySelector(".search");
const watchlistHeader = document.querySelector(".watchlist-header");
const goToWatchlist = document.querySelector("#go-to-watchlist");
const goToSearchPage = document.querySelector("#go-to-search");
const watchlistDefaultText = document.querySelector(".watchlist-content");
const watchlistMoviesContainer = document.querySelector(".watchlist-container");

// If My Watchlist button Was Clicked
goToWatchlist.addEventListener("click", () => {
  // 1- Hide ( Search Header - Search Input - Video Icon Container - Movies Container )
  hideElements(searchHeader, searchForm, videoIconContainer, moviesContainer);

  // 2- Show ( Watchlist Header - Watchlist Default Text - Watchlist Container )
  showElements(watchlistHeader, watchlistDefaultText, watchlistMoviesContainer);

  renderWatchListMovies();
});

function renderWatchListMovies() {
  let htmlMovies = "";
  // If There Are Movies In The Watch List Arr
  if (watchlistArr.length) {
    // 1- Hide Watch List Default Content
    watchlistDefaultText.style.display = "none";

    // 2- Loop Through Watchlist Movies
    for (let movie of watchlistArr) {
      htmlMovies += movie;
    }
    // Insert This Movie HTML Into Watch List Movies Container Out Of The Loop For Perfomance
    watchlistMoviesContainer.innerHTML = htmlMovies;
    // If There are no movies in the watch list arr
  } else {
    // Hide The Watch List Movies Container And Show The Default Content
    hideElements(watchlistMoviesContainer);
    showElements(watchlistDefaultText);
  }
}

function backToMovies() {
  // 1- Hide ( Watchlist Header - Watch List Default Content - Watch List Movies Container )
  hideElements(watchlistHeader, watchlistDefaultText, watchlistMoviesContainer);

  // 2- ( Show Search Header - Search Input - Video Icon Container )
  showElements(searchHeader, searchForm, videoIconContainer);

  // If there are movies searched then hide video icon container and show movies container
  if (moviesArr.length) {
    // 1- Hide Video Icon
    hideElements(videoIconContainer);

    // 2- Show Movies Container
    showElements(moviesContainer);
    // If There Are No Movies Searched Yet
  } else {
    // Show Video Icon Container
    showElements(videoIconContainer);
  }
}

// If Search For Movies Button Was Clicked
goToSearchPage.addEventListener("click", backToMovies);

// If Lets Add Some Movies Link Was Clicked
document.querySelector(".watchlist-link").addEventListener("click", backToMovies);

// - Remove Button Was Clicked
watchlistMoviesContainer.addEventListener("click", (e) => {
  const removeFromWatchlistClicked =  e.target.classList.contains("btn-watchlist") || e.target.classList.contains("fa-circle-minus");

  if (removeFromWatchlistClicked) {
    // 1- Extract Movie ID
    const movieId = e.target.parentElement.parentElement.parentElement.id;

    // 2- Get The Index Of The Movie That Was Clicked
    const movieIndex = watchlistArr.findIndex((movie) => {
      return movie.includes(movieId);
    });

    // 3- Remove That Specific Movie Index From The Array
    watchlistArr.splice(movieIndex, 1);

    // 4- Update Movies Arr In Local Storage
    localStorage.setItem("movies", JSON.stringify(watchlistArr));

    // 5- Re Render Watch List Movies
    renderWatchListMovies();
  }
});
