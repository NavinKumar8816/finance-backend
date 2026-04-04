import Record from "../models/Record.js";

// CREATE RECORD
export const createRecord = async (req, res) => {
  try {
    const { amount, type, category, date, note, createdBy } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    if (!["income", "expense"].includes(type)) {
      return res.status(400).json({ message: "Invalid type" });
    }

    if (!category) {
      return res.status(400).json({ message: "Category is required" });
    }

    const record = await Record.create({
      amount,
      type,
      category,
      date,
      note,
      createdBy,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// GET RECORDS
export const getRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, search, page = 1, limit = 10 } = req.query;

    let filter = { isDeleted: false };
    if (type) filter.type = type;
    if (category) filter.category = category;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }
    if (search) {
      filter.$or = [
        { category: { $regex: search, $options: "i" } },
        { note: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    const records = await Record.find(filter)
      .populate("createdBy", "name email")
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ date: -1 });

    const total = await Record.countDocuments(filter);

    res.json({
      records,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// UPDATE RECORD
export const updateRecord = async (req, res) => {
  try {
    const record = await Record.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(record);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// DELETE RECORD
export const deleteRecord = async (req, res) => {
  try {
    await Record.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ message: "Record deleted (soft delete)" });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};