const database = require("./database");

const getUsers = (req, res) => {
  database
    .query("SELECT * FROM users")
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
    .query("SELECT * FROM users WHERE id = ?", [id])
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

module.exports = { getUsers, getUsersById };
