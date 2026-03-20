const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let users = [];

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { _id: Date.now().toString(), name, email, password: hashedPassword, role: role || 'user' };
    users.push(user);
    res.status(201).json({ message: 'User registered successfully', user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '7d' });
    res.json({ token, user: { _id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const usersWithoutPassword = users.map(u => ({ _id: u._id, name: u.name, email: u.email, role: u.role }));
    res.json(usersWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
