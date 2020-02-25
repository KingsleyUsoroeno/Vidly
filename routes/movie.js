const express = require("express");
const router = express.Router();
const Movie = require("../models/Movie");
const { Genre } = require("../models/Genre");
const Joi = require("joi");
const authMiddleWare = require("../middleware/auth");

function validateMovie(movie) {
  const schema = {
    title: Joi.string()
      .min(6)
      .max(50)
      .required(),
    genre: Joi.string().required(),
    numberInStock: Joi.number(),
    dailyRentalRate: Joi.number()
  };

  return Joi.validate(movie, schema);
}

router.get("/me", authMiddleWare, async (req, res) => {
  console.log("user id is " + req.body._id);
  const user = await User.findById(req.body._id).select('-password');
  res.status(200).json(user);
});

// GET a Movie
router.get("/", authMiddleWare, async (req, res) => {
  const movies = await Movie.find({});
  res.status(200).json(movies);
});

// Add a Movie
router.post("/", authMiddleWare, async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const { title, genre, numberInStock, dailyRentalRate } = req.body;
  console.log("genreId is ", genre);

  const savedGenre = await Genre.findById(genre);

  if (!savedGenre)
    return res.status(400).json({ message: "Genre does not exist" });

  //const newGenre = new Genre({ genre });

  const movie = Movie({
    title,
    genre: {
      _id: savedGenre._id,
      name: savedGenre.name
    },
    numberInStock,
    dailyRentalRate
  });

  try {
    const newMovie = await movie.save();
    let response = {
      status: "Success",
      message: "Movie Added Successfully",
      movie: newMovie
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
