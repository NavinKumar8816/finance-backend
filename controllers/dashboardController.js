import Record from "../models/Record.js";

// SUMMARY API
export const getSummary = async (req, res) => {
  try {
    const records = await Record.find();

    let totalIncome = 0;
    let totalExpense = 0;

    let categoryMap = {};

    records.forEach((rec) => {
      if (rec.type === "income") totalIncome += rec.amount;
      if (rec.type === "expense") totalExpense += rec.amount;

      if (!categoryMap[rec.category]) {
        categoryMap[rec.category] = 0;
      }
      categoryMap[rec.category] += rec.amount;
    });

    const netBalance = totalIncome - totalExpense;

    const recent = records.slice(-5).reverse();

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown: categoryMap,
      recentTransactions: recent,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};