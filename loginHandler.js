const express = require("express");

const loginHandler = (req, res, next) => {
  const { email, password } = req.body;

  if (email === "dwight@theoffice.com" && password === "123456") {
    res.send("Credentials are valid");
  } else {
    res.sendStatus(401);
  }
};

module.exports = { loginHandler };
