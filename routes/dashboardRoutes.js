import express from "express";
import { getSummary } from "../controllers/dashboardController.js";

import { authenticate } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ALL roles can view dashboard
router.get("/", authenticate, authorizeRoles("admin", "analyst", "viewer"), getSummary);

export default router;