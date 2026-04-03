import express from "express";
import {
    createRecord,
    deleteRecord,
    getRecords,
    updateRecord,
} from "../controllers/recordController.js";

import { mockAuth } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// CREATE (ADMIN only)
router.post("/", mockAuth, authorizeRoles("admin"), createRecord);

// READ (ALL roles)
router.get("/", mockAuth, authorizeRoles("admin", "analyst", "viewer"), getRecords);

// UPDATE / DELETE (ADMIN only)
router.put("/:id", mockAuth, authorizeRoles("admin"), updateRecord);
router.delete("/:id", mockAuth, authorizeRoles("admin"), deleteRecord);

export default router;