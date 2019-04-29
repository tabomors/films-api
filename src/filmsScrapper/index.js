const rp = require("request-promise");
const $ = require("cheerio");

const url =
  "https://www.imdb.com/search/title?genres=drama&groups=top_250&sort=user_rating,desc";

// TODO: grab next page

rp(url)
  .then(function(html) {
    const films = [];

    const filmItems = $(".lister-item", html);
    filmItems.each((i, el) => {
      console.log("Film index", i);

      const filmTitle = $(".lister-item-header a", el)
        .first()
        .text();
      const filmReleaseYear = parseInt(
        $(".lister-item-header span", el)
          .last()
          .text()
          .slice(1, -1),
        10
      );
      const filmCertificate = $(".certificate", el).text();
      const filmDuration = parseInt(
        $(".runtime", el)
          .text()
          .slice(0, -3),
        10
      );
      const filmCategories = $(".genre", el)
        .text()
        .split(",")
        .map(text => text.trim());
      const filmRating = parseFloat(
        $(".ratings-bar .ratings-imdb-rating", el).attr("data-value")
      );
      const filmShortDescription = $(".ratings-bar", el)
        .next()
        .text()
        .trim();
      const filmCast = $(".ratings-bar", el)
        .next()
        .next()
        .children()
        .filter("a")
        .map((i, item) =>
          $(item)
            .text()
            .trim()
        )
        .get();
      const [filmDirector, ...filmStars] = filmCast;
      const [filmVotes, filmGross] = $(".sort-num_votes-visible", el)
        .children()
        .filter('span[name="nv"]')
        .map((i, item) =>
          $(item)
            .text()
            .trim()
        )
        .get();

      // console.log("title", filmTitle);
      // console.log("year", filmReleaseYear);
      // console.log("certificate", filmCertificate);
      // console.log("duration", filmDuration);
      // console.log("categories", filmCategories);
      // console.log("rating", filmRating);
      // console.log("short description", filmShortDescription);
      // console.log("director", filmDirector);
      // console.log("stars", filmStars);
      // console.log("votes", filmVotes);
      // console.log("gross", filmGross);

      const filmItem = {
        title: filmTitle,
        releaseYear: filmReleaseYear,
        certificate: filmCertificate,
        duration: filmDuration,
        categories: filmCategories,
        rating: filmRating,
        shortDescription: filmShortDescription,
        director: filmDirector,
        stars: filmStars,
        votes: filmVotes,
        gross: filmGross
      };

      films.push(filmItem)
    });

    console.log('All films on this page:')
    console.log(films)
  })
  .catch(err => {
    console.error(err);
    //handle error
  });
