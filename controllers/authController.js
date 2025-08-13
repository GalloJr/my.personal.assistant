import { hash, compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { findOne, create, findByPk } from '../models/User';

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const exists = await findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({ message: 'Email já registrado' });
    }

    const hashedPassword = await hash(password, 10);

    const user = await create({
      name,
      email,
      password: hashedPassword
    });

    res.json({ message: 'Usuário registrado com sucesso', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    const user = await findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const valid = await compare(password, user.password);
    if (!valid) {
      return res.status(400).json({ message: 'Credenciais inválidas' });
    }

    const token = sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1d'
    });

    res.json({ message: 'Login bem-sucedido', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function profile(req, res) {
  try {
    const user = await findByPk(req.user.id, { attributes: { exclude: ['password'] } });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
