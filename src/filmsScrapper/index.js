const rp = require("request-promise");
const $ = require("cheerio");
const { smallImgToBigImg } = require("./filmsScrapperUtils");
const IMDB_ROOT = "https://www.imdb.com";

const firstPageUrl = `${IMDB_ROOT}/search/title?groups=top_250&sort=user_rating,desc`;

// TODO: grab next page

(async () => {
  try {
    const html = await rp(firstPageUrl);

    const filmItems = $(".lister-item", html);

    const filmsData = await Promise.all(
      filmItems
        .map(async (_, $el) => {
          const filmTitle = $(".lister-item-header a", $el)
            .first()
            .text();
          const filmReleaseYear = parseInt(
            $(".lister-item-header span", $el)
              .last()
              .text()
              .slice(1, -1),
            10
          );
          const filmCertificate = $(".certificate", $el).text();
          const filmDuration = parseInt(
            $(".runtime", $el)
              .text()
              .slice(0, -3),
            10
          );
          const filmCategories = $(".genre", $el)
            .text()
            .split(",")
            .map(text => text.trim());
          const filmRating = parseFloat(
            $(".ratings-bar .ratings-imdb-rating", $el).attr("data-value")
          );
          const filmDescription = $(".ratings-bar", $el)
            .next()
            .text()
            .trim();
          const filmCast = $(".ratings-bar", $el)
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
          const [filmVotes, filmGross] = $(".sort-num_votes-visible", $el)
            .children()
            .filter('span[name="nv"]')
            .map((i, item) =>
              $(item)
                .text()
                .trim()
            )
            .get();

          const filmItem = {
            title: filmTitle,
            releaseYear: filmReleaseYear,
            certificate: filmCertificate,
            duration: filmDuration,
            categories: filmCategories,
            rating: filmRating,
            description: filmDescription,
            director: filmDirector,
            stars: filmStars,
            votes: filmVotes,
            gross: filmGross
          };

          const filmDetailsLink = $(".lister-item-header a", $el).attr("href");
          const filmDetailsFullLink = `${IMDB_ROOT}${filmDetailsLink}`;
          const filmDetailsHtml = await rp(filmDetailsFullLink);
          const filmSmallPoster = $(".poster img", filmDetailsHtml).attr("src");
          filmItem.smallPoster = filmSmallPoster;
          filmItem.bigPoster = smallImgToBigImg(filmSmallPoster);

          return filmItem;
        })
        .get()
    );

    console.log("All films on this page:");
    console.log(filmsData);
  } catch (e) {
    console.error(e);
  }
})();