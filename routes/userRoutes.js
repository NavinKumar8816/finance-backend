import express from "express";
import {
    createUser,
    deleteUser,
    getUsers,
    loginUser,
    registerUser,
    updateUser,
} from "../controllers/userController.js";

import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// PUBLIC ROUTES
router.post("/register", registerUser);
router.post("/login", loginUser);

// PROTECTED ROUTES
// ONLY ADMIN
router.post("/", authenticate, authorizeRoles("admin"), createUser);
router.patch("/:id", authenticate, authorizeRoles("admin"), updateUser);
router.delete("/:id", authenticate, authorizeRoles("admin"), deleteUser);

// ADMIN + ANALYST
router.get("/", authenticate, authorizeRoles("admin", "analyst"), getUsers);

export default router;