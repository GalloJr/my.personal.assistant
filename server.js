require('dotenv').config();
import express, { json } from 'express';
import cors from 'cors';
import { sync } from './config/database';
import authRoutes from './routes/authRoutes';

const app = express();

app.use(cors());
app.use(json());
app.use('/api/auth', authRoutes);

sync({ alter: true }) // cria/atualiza tabelas conforme models
  .then(() => {
    console.log('Banco sincronizado');
    app.listen(process.env.PORT, () => {
      console.log(`Servidor rodando na porta ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Erro ao conectar banco:', err));
