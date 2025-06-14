import express from 'express';
import bcrypt from 'bcryptjs';
import { 
  createUser, 
  findUserByEmail, 
  validateUser 
} from '../model/user'

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      phone,
      department,
      password
    } = req.body;

    if (!firstName || !lastName || !email || !phone || !department || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await createUser({
      name: `${firstName} ${lastName}`,
      email,
      phone,
      department,
      employeeId: '',
      role: 'purchaser',
      password: hashedPassword
    });

    res.status(201).json({
      message: 'Registration successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        department: newUser.department,
        role: newUser.role
      }
    });

  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await validateUser(email, password);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.status(200).json({ message: 'Login successful', user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
