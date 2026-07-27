// ---------- Data ----------
const GENRES = ["Trending Now","Thrillers","Comedies","Sci-Fi & Fantasy","Documentaries","Family Picks"];

const TITLES = [
  ["Midnight Harbor","Thriller",8.4,2024],
  ["The Long Static","Sci-Fi",7.9,2023],
  ["Paper Kingdoms","Drama",8.1,2022],
  ["Loud House Rules","Comedy",7.2,2024],
  ["Echoes of Ferra","Fantasy",8.6,2021],
  ["Coastal Static","Documentary",7.8,2023],
  ["Nine Red Doors","Thriller",8.0,2020],
  ["The Understudy","Comedy",6.9,2024],
  ["Glass Orchard","Drama",8.3,2019],
  ["Signal Lost","Sci-Fi",7.5,2022],
  ["Kettle & Fire","Family",7.1,2023],
  ["Amber Road","Documentary",8.2,2021],
  ["Wildfire Season","Thriller",7.6,2024],
  ["The Last Rehearsal","Drama",8.5,2020],
  ["Junction 88","Sci-Fi",7.3,2022],
  ["Salt & Concrete","Thriller",7.9,2023],
  ["Two Left Shoes","Comedy",7.0,2021],
  ["Northbound","Family",7.4,2024],
  ["The Quiet Hour","Documentary",8.0,2022],
  ["Static Bloom","Fantasy",8.1,2023],
];

function seedFor(title){
  // stable pseudo-random seed per title for placeholder art
  return encodeURIComponent(title.replace(/\s+/g,'-').toLowerCase());
}

function posterURL(title, i){
  return `https://picsum.photos/seed/${seedFor(title)}${i}/300/450`;
}

function cardHTML(item, idx){
  const [title, genre, rating, year] = item;
  return `
    <div class="card" tabindex="0" data-title="${title.toLowerCase()}" data-genre="${genre.toLowerCase()}">
      <img class="poster" loading="lazy" src="${posterURL(title, idx)}" alt="${title} poster">
      <div class="card-info">
        <h3>${title}</h3>
        <div class="sub"><span class="match">${Math.round(rating*11)}% match</span><span>${year}</span></div>
      </div>
    </div>`;
}

// ---------- Render home rows ----------
const homeSections = document.getElementById('homeSections');

function shuffleSubset(arr, n){
  return [...arr].sort(()=>Math.random()-0.5).slice(0, n);
}

GENRES.forEach((genre, gi)=>{
  const picks = shuffleSubset(TITLES, 10);
  const row = document.createElement('div');
  row.className = 'row';
  row.innerHTML = `
    <div class="row-head">
      <h2>${genre}</h2>
      <span>${picks.length} titles</span>
    </div>
    <div class="track">
      ${picks.map((item, i)=>cardHTML(item, gi*10+i)).join('')}
    </div>`;
  homeSections.appendChild(row);
});

// ---------- Search ----------
const searchInput = document.getElementById('search');
const resultsSection = document.getElementById('results-section');
const resultsGrid = document.getElementById('resultsGrid');
const resultsTitle = document.getElementById('resultsTitle');
const hero = document.getElementById('hero');

function runSearch(query){
  const q = query.trim().toLowerCase();
  if(!q){
    resultsSection.classList.remove('active');
    homeSections.classList.remove('hidden');
    hero.style.display = '';
    return;
  }
  hero.style.display = 'none';
  homeSections.classList.add('hidden');
  resultsSection.classList.add('active');

  const matches = TITLES.filter(([title, genre]) =>
    title.toLowerCase().includes(q) || genre.toLowerCase().includes(q)
  );

  resultsTitle.textContent = `Results for "${query}"`;

  if(matches.length === 0){
    resultsGrid.innerHTML = `
      <div class="empty" style="grid-column:1/-1">
        <h3>No matches for "${query}"</h3>
        <p>Try a different title or genre — e.g. "thriller", "comedy", or "static".</p>
      </div>`;
    return;
  }
  resultsGrid.innerHTML = matches.map((item,i)=>cardHTML(item, i+50)).join('');
}

let debounce;
searchInput.addEventListener('input', (e)=>{
  clearTimeout(debounce);
  debounce = setTimeout(()=>runSearch(e.target.value), 150);
});

// ---------- Header scroll state ----------
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', ()=>{
  header.classList.toggle('scrolled', window.scrollY > 10);
});

// ---------- Cycle hero feature every so often ----------
const heroTitleEl = document.getElementById('heroTitle');
setInterval(()=>{
  const [t] = TITLES[Math.floor(Math.random()*TITLES.length)];
  heroTitleEl.style.opacity = 0;
  setTimeout(()=>{ heroTitleEl.textContent = t; heroTitleEl.style.opacity = 1; }, 300);
}, 8000);