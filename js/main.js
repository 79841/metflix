import config from "./config.js";

const imgSliderBox = document.querySelector(".img-slider");
const genreSection = document.querySelector(".genre");
const trendingSection = document.querySelector(".trending-movie-container");

const makeImgSlider = async () => {
  const { results } = await (
    await fetch(
      config.trending_list_url +
        new URLSearchParams({
          api_key: config.api_key,
        })
    )
  ).json();
  results.forEach((item) => {
    imgSliderBox.innerHTML += `
    <a href="#">
    <img src="${config.img_url}${item.poster_path}" alt="">
    </a>
    `;
  });

  let leftGap = 0;

  setInterval(() => {
    const img = document.querySelector(".home .img-slider a img");
    const numOfImg = Math.round(document.body.offsetWidth / img.offsetWidth);
    imgSliderBox.style.left = `-${leftGap * 100}%`;
    if (leftGap >= results.length / numOfImg - 1) {
      leftGap = 0;
    } else {
      leftGap += 1;
    }
  }, 3000);
};
makeImgSlider();

const makeGenreSection = async () => {
  const { genres } = await (
    await fetch(
      config.genres_list_url +
        new URLSearchParams({
          api_key: config.api_key,
        })
    )
  ).json();

  genres.forEach((item) => {
    fetchMoviesListByGenres(item.id, item.name);
  });
};
makeGenreSection();

const fetchMoviesListByGenres = async (id, genres) => {
  const { results } = await (
    await fetch(
      config.movie_genres_url +
        new URLSearchParams({
          api_key: config.api_key,
          with_genres: id,
          page: Math.floor(Math.random() * 3) + 1,
        })
    )
  ).json();

  makeGenreElement(`${genres}_movie`, results);

  // .then((data) => {
  //   makeCategoryElement(`${genres}_movie`, data.results);
  // })
  // .catch((err) => console.log(err));
};

const makeGenreElement = (category, data) => {
  genreSection.innerHTML += `
  <h1 class="movie-genre">${category.split("_").join(" ")}</h1>
  <div class="movie-container" id="${category}"></div>`;
  makeCards(category, data);
};

const makeCards = (id, data) => {
  const movieContainer = document.getElementById(id);
  data.forEach((item, i) => {
    if (item.poster_path == null) {
      return;
    }

    movieContainer.innerHTML += `
    <a class="link" target="_blank" href="${config.movie_url}${item.id}">
    <div class="movie">
      
        <img src="${config.img_url}${item.poster_path}" alt="" />
        <p class="movie-title">${item.title}</p>
        <p class="overview">${
          item.overview.length > 100
            ? item.overview.slice(0, 100) + "..."
            : item.overview
        }</p>
      
    </div>
    </a>
    `;
  });
};

const makeTrendingSection = async () => {
  const { results } = await (
    await fetch(
      config.trending_list_url +
        new URLSearchParams({
          api_key: config.api_key,
        })
    )
  ).json();
  console.log(results);
  arrangeMovieList(results);
};

const arrangeMovieList = (movies) => {
  movies.forEach((item, i) => {
    trendingSection.innerHTML += `
    <a class="link" target="_blank" href="${config.movie_url}${item.id}">
    <div class="movie">
        <img src="${config.img_url}${item.poster_path}" alt="" />
        <div class="ranking">${i + 1}</div>
        <p class="movie-title">${item.title}</p>
        <p class="overview">${
          item.overview.length > 100
            ? item.overview.slice(0, 100) + "..."
            : item.overview
        }</p>
    </div>
    </a>
    `;
  });
};

// console.log("testestset");

makeTrendingSection();
