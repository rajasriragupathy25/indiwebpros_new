import React, { useState, useMemo, useEffect } from "react";
import { Search, Play, Plus, Star } from "lucide-react";

const GENRES = [
  "Trending Now",
  "Thrillers",
  "Comedies",
  "Sci-Fi & Fantasy",
  "Documentaries",
  "Family Picks",
];

const TITLES = [
  ["Midnight Harbor", "Thriller", 8.4, 2024],
  ["The Long Static", "Sci-Fi", 7.9, 2023],
  ["Paper Kingdoms", "Drama", 8.1, 2022],
  ["Loud House Rules", "Comedy", 7.2, 2024],
  ["Echoes of Ferra", "Fantasy", 8.6, 2021],
  ["Coastal Static", "Documentary", 7.8, 2023],
  ["Nine Red Doors", "Thriller", 8.0, 2020],
  ["The Understudy", "Comedy", 6.9, 2024],
  ["Glass Orchard", "Drama", 8.3, 2019],
  ["Signal Lost", "Sci-Fi", 7.5, 2022],
  ["Kettle & Fire", "Family", 7.1, 2023],
  ["Amber Road", "Documentary", 8.2, 2021],
  ["Wildfire Season", "Thriller", 7.6, 2024],
  ["The Last Rehearsal", "Drama", 8.5, 2020],
  ["Junction 88", "Sci-Fi", 7.3, 2022],
  ["Salt & Concrete", "Thriller", 7.9, 2023],
  ["Two Left Shoes", "Comedy", 7.0, 2021],
  ["Northbound", "Family", 7.4, 2024],
  ["The Quiet Hour", "Documentary", 8.0, 2022],
  ["Static Bloom", "Fantasy", 8.1, 2023],
];

function seedFor(title) {
  return encodeURIComponent(title.replace(/\s+/g, "-").toLowerCase());
}

function posterURL(title, i) {
  return `https://picsum.photos/seed/${seedFor(title)}${i}/300/450`;
}

function shuffleSubset(arr, n) {
  return [...arr].sort(() => Math.random() - 0.5).slice(0, n);
}

function Card({ title, genre, rating, year, idx }) {
  return (
    <div
      tabIndex={0}
      className="group relative shrink-0 w-[160px] sm:w-[170px] rounded-lg overflow-hidden bg-neutral-900 border border-white/10 cursor-pointer transition-all duration-300 hover:-translate-y-1.5 hover:scale-[1.03] hover:border-orange-600 hover:shadow-xl hover:shadow-orange-900/30 focus-visible:-translate-y-1.5 focus-visible:border-orange-600 outline-none"
    >
      <img
        loading="lazy"
        src={posterURL(title, idx)}
        alt={`${title} poster`}
        className="w-full aspect-[2/3] object-cover bg-neutral-800"
      />
      <div className="p-3">
        <h3 className="text-[13.5px] font-semibold leading-snug mb-1 truncate">
          {title}
        </h3>
        <div className="flex items-center gap-2 text-[11.5px] text-neutral-400">
          <span className="text-green-400 font-bold">
            {Math.round(rating * 11)}% match
          </span>
          <span>{year}</span>
        </div>
      </div>
    </div>
  );
}

function Row({ genre, items }) {
  return (
    <div className="mb-10">
      <div className="flex items-baseline justify-between mb-3.5">
        <h2 className="text-[19px] font-bold tracking-tight">{genre}</h2>
        <span className="text-xs text-neutral-500">{items.length} titles</span>
      </div>
      <div className="flex gap-3.5 overflow-x-auto pb-2.5 [scrollbar-width:thin]">
        {items.map(([title, g, rating, year], i) => (
          <Card
            key={title}
            title={title}
            genre={g}
            rating={rating}
            year={year}
            idx={i}
          />
        ))}
      </div>
    </div>
  );
}

export default function Netflix() {
  const [query, setQuery] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [heroTitle, setHeroTitle] = useState(TITLES[0]);

  // per-genre shuffled picks, stable across re-renders
  const rows = useMemo(
    () => GENRES.map((genre) => ({ genre, items: shuffleSubset(TITLES, 10) })),
    []
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setHeroTitle(TITLES[Math.floor(Math.random() * TITLES.length)]);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const q = query.trim().toLowerCase();
  const matches = useMemo(() => {
    if (!q) return null;
    return TITLES.filter(
      ([title, genre]) =>
        title.toLowerCase().includes(q) || genre.toLowerCase().includes(q)
    );
  }, [q]);

  const [heroT, heroGenre, heroRating, heroYear] = heroTitle;

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans">
      {/* Header */}
      <header
        className={`sticky top-0 z-50 flex items-center gap-8 px-[4vw] py-4 backdrop-blur-md bg-gradient-to-b from-neutral-950/95 to-neutral-950/70 border-b transition-colors ${
          scrolled ? "border-white/10" : "border-transparent"
        }`}
      >
        <div className="text-2xl font-black tracking-wide text-orange-600 whitespace-nowrap">
          NETFLIX
        </div>
        <nav className="hidden sm:flex gap-6">
          {["Home", "Series", "Films", "My List"].map((item) => (
            <a
              key={item}
              href="#"
              className="text-sm font-medium text-neutral-400 hover:text-neutral-100 transition-colors"
            >
              {item}
            </a>
          ))}
        </nav>
        <div className="relative ml-auto w-[60vw] sm:w-80 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search titles, genres..."
            autoComplete="off"
            className="w-full bg-neutral-900 border border-white/10 rounded-full py-2.5 pl-9 pr-4 text-sm outline-none focus:border-orange-600 focus:bg-neutral-800 placeholder:text-neutral-500 transition-colors"
          />
        </div>
      </header>

      {/* Hero */}
      {!matches && (
        <section className="relative min-h-[60vh] flex items-end px-[4vw] py-[5vw] overflow-hidden bg-gradient-to-tr from-neutral-900 via-neutral-950 to-neutral-950">
          <div className="relative max-w-xl">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-widest uppercase mb-3">
              <span className="text-[8px]">●</span> Featured tonight
            </div>
            <h1 className="font-black text-4xl sm:text-6xl leading-[0.98] tracking-tight mb-4 transition-opacity duration-300">
              {heroT}
            </h1>
            <div className="flex flex-wrap items-center gap-3.5 mb-6">
              <span className="text-amber-400 font-bold text-sm flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400" /> {heroRating}
              </span>
              <span className="text-xs font-semibold border border-white/10 rounded px-2.5 py-1">
                {heroYear}
              </span>
              <span className="text-xs font-semibold border border-white/10 rounded px-2.5 py-1">
                {heroGenre}
              </span>
            </div>
            <p className="text-neutral-400 text-[15px] leading-relaxed max-w-md mb-7">
              A dockworker uncovers a smuggling ring running beneath her city
              — and realizes the trail leads straight back to her own family.
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold text-sm rounded-md px-6 py-3 transition-colors active:scale-95">
                <Play className="w-4 h-4 fill-white" /> Play
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/15 font-bold text-sm rounded-md px-6 py-3 transition-colors active:scale-95">
                <Plus className="w-4 h-4" /> My List
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Main */}
      <main className="px-[4vw] pb-20 relative z-10 -mt-6">
        {matches ? (
          <section>
            <h2 className="text-[19px] font-bold mb-4">
              Results for &quot;{query}&quot;
            </h2>
            {matches.length === 0 ? (
              <div className="text-center py-16 px-5 text-neutral-400">
                <h3 className="text-lg text-neutral-100 mb-2">
                  No matches for &quot;{query}&quot;
                </h3>
                <p className="text-sm max-w-xs mx-auto">
                  Try a different title or genre — e.g. "thriller", "comedy",
                  or "static".
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-4">
                {matches.map(([title, genre, rating, year], i) => (
                  <Card
                    key={title}
                    title={title}
                    genre={genre}
                    rating={rating}
                    year={year}
                    idx={i + 50}
                  />
                ))}
              </div>
            )}
          </section>
        ) : (
          rows.map((row) => <Row key={row.genre} {...row} />)
        )}
      </main>

      <footer className="px-[4vw] py-8 text-center text-xs text-neutral-500 border-t border-white/10">
        This is a demo UI inspired by streaming apps. All titles shown are fictional placeholders.
      </footer>
    </div>
  );
}