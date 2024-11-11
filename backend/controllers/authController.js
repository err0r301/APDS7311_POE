const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

module.exports.register = async (req, res) => {
  const { username, name, surname, accountNumber, IDNumber, password } =
    req.body;

  // Check if user already exists
  try {
    const user = await User.findOne({ username });
    if (user) {
      return res.status(400).send("User already exists");
    }
  } catch (error) {
    return res.status(500).send("Internal server error");
  }

  // Check if ID number is unique
  const IDNumberExists = await User.findOne({ IDNumber });
  if (IDNumberExists) {
    return res.status(400).send("ID number already exists");
  }

  // Check if password is strong
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .send(
        "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one digit, and one special character"
      );
  }

  // check if ID number is valid
  const IDNumberRegex = /^[0-9]{13}$/;
  if (!IDNumberRegex.test(IDNumber)) {
    return res.status(400).send("Invalid ID number");
  }

  // check if username is valid
  const usernameRegex = /^[a-zA-Z]+$/;
  if (
    !username ||
    typeof username !== "string" ||
    !usernameRegex.test(username)
  ) {
    return res.status(400).send("Invalid username");
  }

  const nameRegex = /^[a-zA-Z]+$/;
  if (!username || typeof username !== "string" || !nameRegex.test(username)) {
    return res.status(400).send("Invalid name");
  }

  const surnameRegex = /^[a-zA-Z]+$/;
  if (
    !username ||
    typeof username !== "string" ||
    !surnameRegex.test(username)
  ) {
    return res.status(400).send("Invalid surname");
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create new user
  const newUser = new User({
    username,
    name,
    surname,
    accountNumber,
    IDNumber,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(200).send("User registered successfully");
};

module.exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      // Return a 400 status code for "User not found"
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Return a 400 status code for "Incorrect password"
      return res.status(400).json({ message: "Incorrect password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET, // Ensure JWT_SECRET is set in your .env file
      { expiresIn: "1h" }
    );

    const userType = user.userType;

    // Return a 200 status code for a successful login
    return res
      .status(200)
      .json({ message: "Login successful", token, userType });
  } catch (error) {
    // Return a 500 status code for a server error
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
