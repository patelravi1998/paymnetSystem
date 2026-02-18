const User = require('../models/User');
const Transfer = require('../models/Transfer');
const sequelize = require('../sequelize');

const createAccount = async (req, res) => {
  try {
    const { name,email } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const user = await User.create({
      name,
      email,
      balance: 0,
    });

    return res.status(201).json({
      message: "Account created",
      accountId: user.id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const depositAmmount = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    await user.increment("balance", { by: amount });

    return res.json({
      message: "Amount deposited successfully",
      balance: Number(user.balance) + Number(amount),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const transferAmount = async (req, res) => {
  const t = await sequelize.transaction();

  try {
    const { fromAccountId, toAccountId, amount } = req.body;

    if (!fromAccountId || !toAccountId || amount <= 0) {
      return res.status(400).json({ message: "Invalid input" });
    }

    if (fromAccountId === toAccountId) {
      return res.status(400).json({ message: "Cannot transfer to same account" });
    }

    const sender = await User.findOne({
      where: { id: fromAccountId },
      lock: t.LOCK.UPDATE,
      transaction: t,
    });

    if (!sender || sender.balance < amount) {
      await t.rollback();
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const receiver = await User.findOne({
      where: { id: toAccountId },
      transaction: t,
    });

    if (!receiver) {
      await t.rollback();
      return res.status(404).json({ message: "Receiver not found" });
    }

    await sender.decrement("balance", { by: amount, transaction: t });
    await receiver.increment("balance", { by: amount, transaction: t });

    await Transfer.create(
      {
        from_user_id: fromAccountId,
        to_user_id: toAccountId,
        amount,
        status: "SUCCESS",
      },
      { transaction: t }
    );

    await t.commit();

    return res.json({ message: "Transfer successful" });
  } catch (error) {
    await t.rollback();
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createAccount,
  depositAmmount,
  transferAmount,
};
