const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const User = require('../model/UserSchema');
require('../db/conn');

router.get('/', (req, res) => {
  res.send('hello from the server router js');
});

/**
 * @Roote /register
 * @Method POST
 * @Desc To register the new user
 */
router.post('/register', async (req, res) => {
  console.log(req.body);
  try {
    const { name, email, phone, work, password, cpassword } = req.body;
    if (!name || !email || !phone || !work || !password || !cpassword) {
      return res
        .status(422)
        .json({ error: 'Please fill the fields correctly' });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(422).json({ error: 'User already exists' });
    } else if (password !== cpassword) {
      return res.status(422).json({ error: 'Password are not matching' });
    } else {
      const user = new User({ name, email, phone, work, password, cpassword });
      await user.save();
      res.status(201).json({ message: ' User registered successfully' });
    }
  } catch (err) {
    console.log('.....error.....', err);
    res.status(500).json({ err });
  }
});

/**
 * @Route /signin
 * @Method POST
 * @Desc to login the registered user
 */

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: 'Please fill the fields' });
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = await user.generateAuthToken();
        console.log('....token....', token);
        res.cookie('jwtoken', token, {
          expires: new Date(Date.now() + 2592000000),
          httpOnly: true
        });
        return res.json({ message: 'user logged in successfully' });
      } else {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
    } else return res.status(400).json({ message: 'Invalid credentials' });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
