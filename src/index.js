const path = require("path");
const express = require("express");
const cors = require("cors");
const filmsApi = require("./films");
const { logger, error } = require("./common/middlewares");

require("dotenv").config();
require("./db");

const app = express();
const router = express.Router();

// TODO: Remove it in prod
app.use(express.static(path.join(__dirname, "public")));
// TODO: configure cors
app.use(cors());

// Why i can't see req params in logger?
app.use(logger);

router.use("/films", filmsApi);

app.use("/", router);
app.use(error);

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`App is listening on the port ${PORT}`);
});
