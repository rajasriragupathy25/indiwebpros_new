const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const movieGrid = document.getElementById("movieGrid");

searchBtn.addEventListener("click", searchMovie);

searchInput.addEventListener("keyup", searchMovie);

function searchMovie() {
    const filter = searchInput.value.toLowerCase();
    const movieCards = movieGrid.getElementsByClassName("movie-card");

    for (let i = 0; i < movieCards.length; i++) {
        const title = movieCards[i].querySelector("h3").textContent.toLowerCase();

        if (title.includes(filter)) {
            movieCards[i].style.display = "block";
        } else {
            movieCards[i].style.display = "none";
        }
    }
}