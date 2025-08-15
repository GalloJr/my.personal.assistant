const { Op } = require('sequelize');
const Account = require('../models/Account');

exports.getAccounts = async (req, res) => {
  try {
    const { status, month, year, title } = req.query;
    const where = { userId: req.user.id };

    if (status) where.status = status;
    if (title)  where.title = { [Op.iLike]: `%${title}%` };

    // Uso do filtro por mês e ano
    if (month && year) {
      // Prepara datas para buscar entre o primeiro e o último dia do mês
      const start = `${year}-${month.padStart(2, '0')}-01`;
      const end = `${year}-${month.padStart(2, '0')}-31`;
      where.dueDate = { [Op.between]: [start, end] };
    }

    const accounts = await Account.findAll({ where });
    res.json(accounts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createAccount = async (req, res) => {
  try {
    const { title, description, amount, dueDate, status } = req.body;
    const account = await Account.create({
      title,
      description,
      amount,
      dueDate,
      status,
      userId: req.user.id
    });
    res.status(201).json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateAccount = async (req, res) => {
  try {
    const account = await Account.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!account) return res.status(404).json({ message: 'Conta não encontrada' });

    await account.update(req.body);
    res.json(account);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteAccount = async (req, res) => {
  try {
    const account = await Account.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!account) return res.status(404).json({ message: 'Conta não encontrada' });

    await account.destroy();
    res.json({ message: 'Conta excluída' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};