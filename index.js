/**
 * @typedef  {object} MovieType - an object that represent the data os single movie
 * @property {Array<string>} favoriteMovieInfo.genres - the mogenre of the movie
 * @property {string} favoriteMovieInfo.image - the url of the image of the movie
 * @property {string} favoriteMovieInfo.title - the title of the movie
 * @property {string} favoriteMovieInfo.description - the description of the movie
 * @property {number} favoriteMovieInfo.id - unique id od the movie
 */

/**
 * defining the global varibles
 * use localstorage to persist favorites
 */
var movies = [];
var favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
var favoritesContainer = document.getElementById("favorites-container");
var moviesContainer = document.getElementById("movies-container");

/**
 * fetch and render the initial movies
 */
fetch("./movies.json")
  .then(response => response.json())
  .then((data) => {
    movies = data;
    renderMovieList(movies);
  });

/**
 * render the initial favorites list
 */
renderFavoritesList(favorites);

/**
 * render movies on screen
 * @param {Array<MovieType>} movies
 */
function renderMovieList(movies) {
  movies.forEach((singleMovie) => {
    var movieElement = createrMovieElement(singleMovie);
    moviesContainer.appendChild(movieElement)
  })
}

/**
 * render favorites movies on screen
 * @param {Array<MovieType>} movies
 */
function renderFavoritesList(movies) {
  movies.forEach((singleMovie) => {
    var favoriteMovieElement = createFavoriteElement(singleMovie);
    favoritesContainer.appendChild(favoriteMovieElement)
  })
}


/**
 * add a new movie on the favorite list and render on screen
 * @param {MovieType} movie 
 */
function addToFavorites (movie) {
  // verify if this movie in not a favorite yet
  if (!favorites.find((fav) => fav.id == movie.id)) {
    favorites.unshift(movie);
    localStorage.setItem("favorites", JSON.stringify(favorites)); // sync with local storage
    var movieElement = createFavoriteElement(movie);
    favoritesContainer.prepend(movieElement)
  } else {
    alert("The movie is on your favorites already")
  }
}

/**
 * remove from favorite list and remove from DOM
 * @param {MovieType} movie 
 */
function removeFromFavorites (movie) {
  favorites = favorites.filter((movieToCompare) => movieToCompare.id != movie.id);
  localStorage.setItem("favorites", JSON.stringify(favorites)); // sync with local storage
  var childToRemove = document.getElementById("movie-"+movie.id);
  favoritesContainer.removeChild(childToRemove);
}

/**
 * search movie from movie list
 * @param {string} query - movie title or genre
 */
function filterMovies (query) {
  var normalizedQuery = query.toLowerCase().trim();
  var results = movies.filter((movie) => {
    var normalizedMovieTitle = movie.title.trim().toLowerCase();
    var normalizedGenres = movie.genres.map((genre) => genre.trim().toLowerCase())
    return normalizedMovieTitle.includes(normalizedQuery) || normalizedGenres.includes(normalizedQuery) || false;
  })
  return results;
}

/**
 * Listen the submit event 
 * @param {Event} event 
 */
function hadlesubmitSearch(event) {
  var query = event.target.elements.query.value;
  var filteredMivies = filterMovies(query);
  moviesContainer.replaceChildren();
  if (!!filteredMivies.length) {
    renderMovieList(filteredMivies);
  } else {
    moviesContainer.appendChild(create404Result())
    console.log(create404Result())
  }
};


/**
 * listen remove filters button
 * 
 */
function handleRemoveFilters() {
  moviesContainer.replaceChildren();
  renderMovieList(movies);
}


/**
 * create a html element that represents a single movie
 * @param {MovieType} movieInfo
 * @return {HTMLElement} 
 */
function createrMovieElement (movieInfo) {
  var wraper = document.createElement("div");
  var image = document.createElement("img");
  var dataWrapper = document.createElement("div");
  var title = document.createElement("h6");
  var genre = document.createElement("div");
  var description = document.createElement("p");
  var addFavoriteButton = document.createElement("button");
  wraper.className = "movie-wrapper";
  image.src = movieInfo.image;
  description.textContent = movieInfo.description;
  title.textContent = movieInfo.title;
  genre.textContent = "Genre(s): " + movieInfo.genres.join(", ");
  genre.className = "genre";
  addFavoriteButton.textContent = "Add favorite"
  addFavoriteButton.className = "add-favorite-buttton"
  addFavoriteButton.onclick = () => addToFavorites(movieInfo)
  dataWrapper.appendChild(addFavoriteButton)
  dataWrapper.appendChild(title);
  dataWrapper.appendChild(genre);
  dataWrapper.appendChild(description);
  wraper.appendChild(image);
  wraper.appendChild(dataWrapper);
  return wraper;
};


/**
 * create a html element that represents a single favorite movie
 * @param {MovieType} favoriteMovieInfo
 * @return {HTMLElement} 
 */
function createFavoriteElement (favoriteMovieInfo) {
  var wraper = document.createElement("div");
  var deleteButton = document.createElement("div");
  var image = document.createElement("img");
  var dataWrapper = document.createElement("div");
  var title = document.createElement("h6");
  var genre = document.createElement("div");
  wraper.className = "favorite-movie"
  wraper.id = "movie-"+favoriteMovieInfo.id;
  deleteButton.className = "delete";
  deleteButton.textContent = "X";
  deleteButton.onclick = () => removeFromFavorites(favoriteMovieInfo)
  image.src = favoriteMovieInfo.image;
  title.textContent = favoriteMovieInfo.title;
  genre.className = "genre";
  genre.textContent = "Genre(s): " + favoriteMovieInfo.genres.join(", ");
  wraper.appendChild(deleteButton);
  wraper.appendChild(image);
  dataWrapper.appendChild(title);
  dataWrapper.appendChild(genre);
  wraper.appendChild(dataWrapper)
  return wraper;
};

function create404Result() {
  const Wrapper = document.createElement('div');
  const bigText = document.createElement('div');
  const text = document.createElement("div");
  Wrapper.className = "not-results";
  bigText.className = "big-text";
  bigText.textContent = "¡Oppps!";
  text.className = "text";
  text.textContent = "There is no results";
  Wrapper.appendChild(bigText);
  Wrapper.appendChild(text);
  return Wrapper;
};