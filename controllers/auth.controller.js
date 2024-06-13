const User = require("../models/user.model.js");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.index = (req, res) => {
    
}
exports.register = (req, res) => {
  const { username, password, email } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const user = new User({
    username: username,
    password: hashedPassword,
    email: email,
  });

  User.create(user, (err, data) => {
    if (err) res.status(500).send({ message: err.message || "Some error occurred while creating the User." });
    else res.send(data);
  });
};

exports.login = (req, res) => {
  const { username, password } = req.body;

  User.findByUsername(username, (err, user) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: `Not found User with username ${username}.` });
      } else {
        res.status(500).send({ message: "Error retrieving User with username " + username });
      }
    } else {
      const passwordIsValid = bcrypt.compareSync(password, user.password);
      if (!passwordIsValid) {
        return res.status(401).send({ accessToken: null, message: "Invalid Password!" });
      }
      const token = jwt.sign({ id: user.id }, process.env.SECRET, { expiresIn: 86400 });
      res.status(200).send({ id: user.id, username: user.username, email: user.email, accessToken: token });
    }
  });
};

exports.logout = (req, res) => {
  res.status(200).send({ message: "Logout successful" });
};
