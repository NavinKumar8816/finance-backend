import express from "express";
import {
    createRecord,
    deleteRecord,
    getRecords,
    updateRecord,
} from "../controllers/recordController.js";

const router = express.Router();

router.post("/", createRecord);
router.get("/", getRecords);
router.put("/:id", updateRecord);
router.delete("/:id", deleteRecord);

export default router;