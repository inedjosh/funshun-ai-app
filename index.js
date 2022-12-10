const express = require("express");
const path = require("path");
const fs = require("fs");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");

const { v4: uuidv4 } = require("uuid");
const bodyParser = require("body-parser");
const multer = require("multer");
const cors = require("cors");

// routes`
const routes = require("./routes/index");

const { connectDB } = require("./DB");
const { Configuration, OpenAIApi } = require("openai");
const { configs } = require("./config");

//** Set up express */
const app = express();

//** Connect DB */
connectDB();

//** Configure OpenAi */
const configuration = new Configuration({
  apiKey: configs.OPENAI_API_KEY,
});

exports.openai = new OpenAIApi(configuration);

// const privateKey = fs.readFileSync("server.key");
// const certificate = fs.readFileSync("server.cert");

//** Set Storage for files */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + "-" + file.originalname);
  },
});

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

// middlewares
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));

//** File upload middleware */
const fileFilter = (req, file, cb) => {
  if (
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
  }
};

app.use(multer({ storage: storage, fileFilter: fileFilter }).single("image"));
app.use("/images", express.static(path.join(__dirname, "images")));

//** Set Headers */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

//** Routes */
app.use("/api", routes);

//** index route */
app.get("/", function (req, res) {
  res.send("Welcome to funshun Ai API 😇 - server is up and running!");
});

// Set error middleware
app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ status: "failed", message: message, data: data });
});

//** App port listner */
const PORT = process.env.PORT || 4000;

// setting localhost certificate
// https.createServer({ key: privateKey, cert: certificate }, app).listen(PORT);

app.listen(PORT);
