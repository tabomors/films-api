const rp = require("request-promise");
const $ = require("cheerio");
const { smallImgToBigImg } = require("./filmsScrapperUtils");
const db = require("../../db");
const Film = require("../models/Film");

const IMDB_ROOT = "https://www.imdb.com";
const firstPageUrl = `${IMDB_ROOT}/search/title?groups=top_250&sort=user_rating,desc`;

async function grabFilmsPage(pageUrl, acc = []) {
  console.log(`Hello from ${pageUrl} \n`);

  const html = await rp(pageUrl);

  const filmItems = $(".lister-item", html);

  const filmsData = await Promise.all(
    filmItems
      .map(async (_, $el) => {
        const filmTopRating = parseInt(
          $(".lister-item-header .lister-item-index", $el)
            .text()
            .replace(/[^0-9.]/g, ""),
          10
        );

        const filmTitle = $(".lister-item-header a", $el)
          .first()
          .text();
        const filmReleaseYear =
          parseInt(
            $(".lister-item-header span", $el)
              .last()
              .text()
              .slice(1, -1),
            10
          ) || null;
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
          topRating: filmTopRating,
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

  const updatedAcc = acc.concat(filmsData);

  const nextPageHref = $(".lister-page-next.next-page", html).attr("href");
  const nextPageFullHref = IMDB_ROOT + nextPageHref;
  return nextPageHref
    ? grabFilmsPage(nextPageFullHref, updatedAcc)
    : updatedAcc;
}

async function run() {
  try {
    // TODO: profile it when you have time
    const films = await grabFilmsPage(firstPageUrl, []);
    console.log("Films were grabbed", films);
    const res = await Film.insertMany(films);
    console.log("Films were added to the database");
    db.connection.close();
  } catch (e) {
    console.error(e);
  }
}

run();
