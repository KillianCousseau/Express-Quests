const { body, validationResult } = require("express-validator");

const validateMovie = [
  body("title").notEmpty().isLength({ max: 255 }),
  body("director").notEmpty().isLength({ max: 255 }),
  body("year").notEmpty(),
  body("color").notEmpty(),
  body("duration").notEmpty(),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

const validateUser = [
  body("firstname").notEmpty().isLength({ max: 255 }),
  body("lastname").notEmpty().isLength({ max: 255 }),
  body("email").notEmpty().isEmail(),
  body("city").notEmpty().isLength({ max: 255 }),
  body("language").notEmpty().isLength({ max: 255 }),
  (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(422).json({ validationErrors: errors.array() });
    } else {
      next();
    }
  },
];

module.exports = { validateMovie, validateUser };
