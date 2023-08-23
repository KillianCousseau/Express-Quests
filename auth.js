const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 5,
      parallelism: 1,
    });
    req.body.hashedPassword = hashedPassword;
    delete req.body.password;
    next();
  } catch {
    res.sendStatus(400);
  }
};

const verifyPassword = async (req, res) => {
  argon2
    .verify(req.user.hashedPassword, req.body.password)
    .then((isVerified) => {
      if (isVerified) {
        const payload = { sub: req.user.id };
        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });

        delete req.user.hashedPassword;
        res.send({ token, user: req.user });
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const verifyToken = (req, res, next) => {
  try {
    const authorizationHeader = req.get("Authorization");

    if (authorizationHeader) {
      const [type, token] = authorizationHeader.split(" ");
      if (type === "Bearer") {
        req.payload = jwt.verify(token, process.env.JWT_SECRET);
        next();
      } else {
        throw new Error("Authorization header has not the 'Bearer' type");
      }
    } else {
      throw new Error("Authorization header is missing");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(401);
  }
};

const verifyUser = (req, res, next) => {
  try {
    if (req.payload.sub === parseInt(req.params.id)) {
      next();
    } else {
      throw new Error("Wrong user");
    }
  } catch (err) {
    console.error(err);
    res.sendStatus(403);
  }
};

module.exports = { hashPassword, verifyPassword, verifyToken, verifyUser };
