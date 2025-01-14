const database = require("./database");

const getUsers = (req, res) => {
  const initialSql =
    "SELECT id, firstname, lastname, email, city, language FROM users";
  const where = [];

  if (req.query.language) {
    where.push({
      column: "language",
      value: req.query.language,
      operator: "=",
    });
  }
  if (req.query.city) {
    where.push({
      column: "city",
      value: req.query.city,
      operator: "=",
    });
  }

  database
    .query(
      where.reduce(
        (sql, { column, operator }, index) =>
          `${sql} ${index === 0 ? "WHERE" : "AND"} ${column} ${operator} ?`,
        initialSql
      ),
      where.map(({ value }) => value)
    )
    .then(([users]) => {
      res.json(users);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    });
};

const getUsersById = (req, res) => {
  const id = parseInt(req.params.id);

  database
    .query(
      "SELECT id, firstname, lastname, email, city, language FROM users WHERE id = ?",
      [id]
    )
    .then(([users]) => {
      if (users[0]) {
        res.status(200).json(users);
      } else {
        res.sendStatus(404);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(404);
    });
};

const getUserByEmailWithPasswordAndPassToNext = (req, res, next) => {
  const { email } = req.body;

  database
    .query("SELECT * FROM users WHERE email = ?", [email])
    .then(([users]) => {
      if (users[0]) {
        req.user = users[0];
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const postUser = (req, res) => {
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;
  database
    .query(
      "INSERT INTO users (firstname, lastname, email, city, language, hashedPassword) VALUES (?, ?, ?, ?, ?, ?)",
      [firstname, lastname, email, city, language, hashedPassword]
    )
    .then(([result]) =>
      res.location(`/api/users/${result.insertId}`).sendStatus(201)
    )
    .catch((err) => {
      console.log(err);
      res.sendStatus(500);
    });
};

const updateUser = (req, res) => {
  const { id } = req.params;
  const { firstname, lastname, email, city, language, hashedPassword } =
    req.body;

  database
    .query(
      "UPDATE users SET firstname=?, lastname=?, email=?, city=?, language=?, hashedPassword=? WHERE id=?",
      [firstname, lastname, email, city, language, hashedPassword, id]
    )
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(204);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

const deleteUser = (req, res) => {
  const { id } = req.params;

  database
    .query("DELETE FROM users WHERE id=?", [id])
    .then(([result]) => {
      if (result.affectedRows === 0) {
        res.sendStatus(404);
      } else {
        res.sendStatus(200);
      }
    })
    .catch((err) => {
      console.error(err);
      res.sendStatus(500);
    });
};

module.exports = {
  getUsers,
  getUsersById,
  getUserByEmailWithPasswordAndPassToNext,
  postUser,
  updateUser,
  deleteUser,
};
