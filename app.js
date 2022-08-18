const APIKEY = "a268923f";

const searchInput = document.querySelector(".search-input");
const moviesContainer = document.querySelector(".movies-container");
const watchIconContainer = document.querySelector(".watch-icon-container");
const errorMessage = document.querySelector('.error-message');

let moviesArr = [];
let moviesCounter = 0;



// **************************************************************************************************************
// |                                                Helper Functions                                            |
// **************************************************************************************************************
function hideElements(...elements) {
  if(elements.length === 1) {
    elements[0].style.display = 'none';
  } else {
    for(let element of elements) {
      element.style.display = 'none';
    }
  }
}

function showElements(...elements) {

  if(elements.length === 1) {
    elements[0].style.display = 'block';
  } else {
    for(let element of elements) {
      element.style.display = 'block';
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
  const response = await fetch(`http://www.omdbapi.com/?s=${movieName}&apikey=${APIKEY}`);
  const {Search: movies, Response: responseMessage} = await response.json();


  // IF there are too many results or the movie is not found
  if (responseMessage !== "False") {
    // 1- Hide Watch Icon And Error Message 
    hideElements(watchIconContainer, errorMessage);

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
  } else if(responseMessage === 'False') {
    // Hide Watch - movies continer And Show Error Message And Change Input Value
    // 1- Hide Watch Icon & Movies Container
    hideElements(watchIconContainer, moviesContainer);

    // 2-Show Error Message 
    showElements(errorMessage);
    
    // 3- Clear The Input Value & Update The PlaceHolder
    searchInput.value = '';
    searchInput.placeholder = 'Searching something with no data';
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
  if(movieLength === moviesCounter) {
      // Render The HTML ( To Manipulate The DOM Only Once For Better Performance ) & Reset The Counter
      moviesContainer.innerHTML = moviesHTML;
      moviesCounter = 0;
  }
}


function buildMovieObj(movie) {
      // If there is no poster - provide a a default no poster image
      let poster = movie.Poster !== 'N/A' ? movie.Poster : 'https://www.jakartaplayers.org/uploads/1/2/5/5/12551960/2297419_orig.jpg';

      // Extract The Valuse Out Of Movie Object And Build An Object From It
      const {imdbID, Title, imdbRating, Runtime, Genre,Plot} = movie;
      const movieObj = {
          imdbID,
          poster,
          Title,
          imdbRating,
          Runtime,
          Genre,
          Plot      
     }

     // Push This Movie Object To An Array ( We will use this to build the html out of it)
     moviesArr.push(movieObj);
}


function buildMoviesHTML() { 
    const moviesHTML = moviesArr.map((singleMovie) => {
      const {imdbID,poster,  Title, imdbRating, Runtime, Genre,Plot} = singleMovie;
      return `
      <div class="movie">
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
      `
    }).join('')
    return moviesHTML;
}


// **************************************************************************************************************
// |                                                Watch List                                                  |
// **************************************************************************************************************

let watchlistArr;


// If there is movies arr in the local storage then fetch it 
if(localStorage.getItem('movies') ) {
  watchlistArr = JSON.parse(localStorage.getItem('movies'))
} else {
  // Else initilaize an emtpy array
  watchlistArr = [];
}

moviesContainer.addEventListener('click', (e) => {
    const buttonWasClicked = e.target.classList.contains('btn-watchlist') || e.target.classList.contains('plus-icon')
    if(buttonWasClicked ) {

        // watchlistArr.push(e.target.parentElement.parentElement.parentElement)
        // console.dir(e.target.parentElement.parentElement.parentElement)
        const movieElement = e.target.parentElement.parentElement.parentElement.innerHTML;
        let movieHTML = `<div class="movie">${movieElement}</div>`

        movieHTML = movieHTML.replace(`<i class="fa-solid fa-circle-plus plus-icon"></i> Watchlist`, `<i class="fa-solid fa-circle-minus"></i> Remove`)
        watchlistArr.push(movieHTML);
        localStorage.setItem('movies', JSON.stringify(watchlistArr));





      


    }

})


const searchHeader = document.querySelector('.search-header');
const searchForm = document.querySelector('.search');
const watchlistHeader = document.querySelector('.watchlist-header');
const goToWatchlist = document.querySelector('#go-to-watchlist');
const goToSearchPage = document.querySelector('#go-to-search');
const watchlistContent = document.querySelector('.watchlist-content');
const watchlistContainer = document.querySelector('.watchlist-container')

goToWatchlist.addEventListener('click', () => {
  // Hide Search Header - Search Input & Watchlist Icon Container & Movies Container
  searchHeader.style.display = searchForm.style.display = watchIconContainer.style.display = moviesContainer.style.display = 'none';


  // Show Watchlist Header & Watchlist Content & Watchlist Container
  watchlistHeader.style.display = watchlistContent.style.display = watchlistContainer.style.display =  'block';

  let htmlMovie = '';


  if(watchlistArr.length ) {
    watchlistContent.style.display = 'none';




    for(let movie of watchlistArr) {
       htmlMovie += movie; 
      
    }
    watchlistContainer.innerHTML = htmlMovie;
  }


})

goToSearchPage.addEventListener('click', () => {
    // Hide Watchlist Header & Watchlist Content & Watchlist Container
    watchlistHeader.style.display = watchlistContent.style.display =  watchlistContainer.style.display = 'none';


  // Show Search Header - Search Input & Watchlist Icon Container & Watchlist Container
  searchHeader.style.display = searchForm.style.display = watchIconContainer.style.display = 'block';

  if(moviesHTML !== '') {
    // hide watch icon and show movies container
    watchIconContainer.style.display = 'none';
    moviesContainer.style.display = 'block';
  }


})


watchlistContainer.addEventListener('click', (e) => {
  const buttonWasClicked = e.target.classList.contains('btn-watchlist') || e.target.classList.contains('fa-circle-minus')
  if(buttonWasClicked ) {
    console.log('remove item now');
    console.log(e.target.parentElement.parentElement.parentElement)
    // console.log(JSON.parse(localStorage.getItem('movies')));
  }

})