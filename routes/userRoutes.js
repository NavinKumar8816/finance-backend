import express from "express";
import {
    createUser,
    getUsers,
    updateUser,
} from "../controllers/userController.js";

import { mockAuth } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ONLY ADMIN
router.post("/", mockAuth, authorizeRoles("admin"), createUser);
router.patch("/:id", mockAuth, authorizeRoles("admin"), updateUser);

// ADMIN + ANALYST
router.get("/", mockAuth, authorizeRoles("admin", "analyst"), getUsers);

export default router;