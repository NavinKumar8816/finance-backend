import Record from "../models/Record.js";

// SUMMARY API
export const getSummary = async (req, res) => {
  try {
    const records = await Record.find({ isDeleted: false });

    let totalIncome = 0;
    let totalExpense = 0;

    let categoryMap = {};

    // Monthly trends (last 12 months)
    let monthlyTrends = {};
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = month.toISOString().slice(0, 7); // YYYY-MM
      monthlyTrends[key] = { income: 0, expense: 0 };
    }

    records.forEach((rec) => {
      if (rec.type === "income") totalIncome += rec.amount;
      if (rec.type === "expense") totalExpense += rec.amount;

      if (!categoryMap[rec.category]) {
        categoryMap[rec.category] = 0;
      }
      categoryMap[rec.category] += rec.amount;

      // Monthly aggregation
      const recordMonth = rec.date.toISOString().slice(0, 7);
      if (monthlyTrends[recordMonth]) {
        if (rec.type === "income") monthlyTrends[recordMonth].income += rec.amount;
        if (rec.type === "expense") monthlyTrends[recordMonth].expense += rec.amount;
      }
    });

    const netBalance = totalIncome - totalExpense;

    const recent = records.slice(-5).reverse();

    res.json({
      totalIncome,
      totalExpense,
      netBalance,
      categoryBreakdown: categoryMap,
      recentTransactions: recent,
      monthlyTrends,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};