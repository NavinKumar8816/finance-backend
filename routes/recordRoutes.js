import express from "express";
import {
    createRecord,
    deleteRecord,
    getRecords,
    updateRecord,
} from "../controllers/recordController.js";

import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CREATE (ADMIN only)
router.post("/", authenticate, authorizeRoles("admin"), createRecord);

// READ (ALL roles)
router.get("/", authenticate, authorizeRoles("admin", "analyst", "viewer"), getRecords);

// UPDATE / DELETE (ADMIN only)
router.put("/:id", authenticate, authorizeRoles("admin"), updateRecord);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteRecord);

export default router;