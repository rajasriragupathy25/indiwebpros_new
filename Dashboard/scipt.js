// Netflix Clone - script.js

// Play Button
const playBtn = document.querySelector(".play-btn");

if (playBtn) {
    playBtn.addEventListener("click", function () {
        alert("🎬 Playing your movie...");
    });
}

// More Info Button
const infoBtn = document.querySelector(".info-btn");

if (infoBtn) {
    infoBtn.addEventListener("click", function () {
        alert("Netflix Clone\n\nUnlimited Movies, TV Shows and More!");
    });
}

// Movie Poster Click
const posters = document.querySelectorAll(".row-posters img");

posters.forEach((poster) => {
    poster.addEventListener("click", function () {
        alert("You selected: " + poster.alt);
    });
});

console.log("Netflix Clone Loaded Successfully!");