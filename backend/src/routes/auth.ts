import express from 'express';
import { 
  createUser, 
  findUserByEmail, 
  validateUser 
} from '../model/user'

const router = express.Router();

router.post('/api/register', async (req, res) => {
  try {
    const { name, email, phone, department, employeeId, role, password } = req.body;

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const user = await createUser({
      name,
      email,
      phone,
      department,
      employeeId,
      role,
      password
    });

    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error(err);
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
