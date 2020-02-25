const express = require("express");
const router = express.Router();
const {Genre} = require("../models/Genre");
const Joi = require("joi");
const authMiddleWare = require('../middleware/auth');
const adminMiddleWare = require('../middleware/admin');

router.get("/", async (req, res) => {
  try {
    const genre = await Genre.find({});
    res.status(200).json(genre);
  } catch (error) {
    res.status(401).json(error);
  }
});

router.post("/", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const genre = Genre(req.body);

  try {
    const newGenre = await genre.save();
    res.status(201).json(newGenre);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const genre = await Genre.findByIdAndUpdate(req.params.id,{ name: req.body.name },{
      new: true
    });

    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");

    let response = {
      status: "Success",
      message: "Genre Updated Successfully",
      genre: genre
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.delete("/:id", [authMiddleWare, adminMiddleWare], async (req, res) => {
  // the auth middleware will check if the user is Authenticated to authorise these route 
  // the admin middleware will ensure that the user calling these route is authorised to do so and delete a genre 
  try {
    const genre = await Genre.findByIdAndDelete(req.params.id);
    let response = {
      status: "Success",
      msg: "Genre deleted Successfully",
      genre: genre
    };
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const genre = await Genre.findById(req.params.id);
    if (!genre)
      return res.status(404).send("The genre with the given ID was not found.");
    res.status(200).send(genre);
  } catch (error) {
    res.status(500).json(error);
  }
});

function validateGenre(genre) {
  const schema = {
    name: Joi.string()
      .min(6)
      .required()
  };

  return Joi.validate(genre, schema);
}

module.exports = router;
