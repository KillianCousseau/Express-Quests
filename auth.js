const argon2 = require("argon2");

const hashPassword = async (req, res, next) => {
  try {
    const { password } = req.body;

    const hashedPassword = await argon2.hash("password", {
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

module.exports = { hashPassword };
