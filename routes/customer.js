const express = require("express");
const router = express.Router();
const Joi = require("joi");
const Customer = require("../models/Customer");

function validateCustomer(customer) {
  const schema = {
    name: Joi.string()
      .min(6).max(50).required(),
    phoneNumber: Joi.string().min(8).max(11).required(),
    isGold: Joi.boolean()
  };

  return Joi.validate(customer, schema);
}

router.get("/", async (req, res) => {
  try {
    const customer = await Customer.find({});
    res.status(200).json(customer);
  } catch (error) {
    res.status(401).json(error);
  }
});

router.get("/:id", async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) return res.status(404).send("Customer does not exist.");
    res.status(200).send(customer);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  const customer = Customer(req.body);

  try {
    const newCustomer = await customer.save();
    let response = {
      status: "Success",
      message: "Customer Created Successfully",
      customer: newCustomer
    };
    res.status(201).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const { name, phoneNumber } = req.body;
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, phoneNumber },
      {
        new: true
      }
    );

    if (!customer) return res.status(404).send("These Customer does not exits");

    let response = {
      status: "Success",
      message: "Customer Updated Successfully",
      customer: customer
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json(error);
  }
});


router.delete("/:id", async (req, res) => {
    try {
      const customer = await Customer.findByIdAndDelete(req.params.id);
      let response = {
        status: "Success",
        msg: "Genre deleted Successfully",
        customer: customer
      };
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json(error);
    }
  });

  module.exports = router;
