const express = require("express");
require("dotenv").config();

const app = express();
app.use(express.json());

const port = process.env.APP_PORT ?? 5000;

const welcome = (req, res) => {
  res.send("Welcome to my favourite movie list");
};

app.get("/", welcome);

const step1 = (req, res, next) => {
  req.message = "I went through step1";
  next();
};

const step2 = (req, res, next) => {
  req.message += " and step2";
  next();
};

const lastStep = (req, res) => {
  res.send(req.message);
};

app.get("/justToTest", step1, step2, lastStep);

const { validateMovie, validateUser } = require("./validators");
const movieHandlers = require("./movieHandlers");
const userHandlers = require("./userHandlers");
const {
  hashPassword,
  verifyPassword,
  verifyToken,
  verifyUser,
} = require("./auth");
const { loginHandler } = require("./loginHandler");

app.get("/api/movies", movieHandlers.getMovies);
app.get("/api/movies/:id", movieHandlers.getMovieById);
app.get("/api/users", userHandlers.getUsers);
app.get("/api/users/:id", userHandlers.getUsersById);

app.post(
  "/api/login",
  userHandlers.getUserByEmailWithPasswordAndPassToNext,
  verifyPassword
);
app.post("/api/users", validateUser, hashPassword, userHandlers.postUser);

app.use(verifyToken);

app.post("/api/movies", validateMovie, movieHandlers.postMovie);

app.put("/api/movies/:id", validateMovie, movieHandlers.updateMovie);
app.put(
  "/api/users/:id",
  verifyUser,
  validateUser,
  hashPassword,
  userHandlers.updateUser
);

app.delete("/api/movies/:id", movieHandlers.deleteMovie);
app.delete("/api/users/:id", verifyUser, userHandlers.deleteUser);

app.listen(port, (err) => {
  if (err) {
    console.error("Something bad happened");
  } else {
    console.log(`Server is listening on port ${port} 🚀`);
  }
});
