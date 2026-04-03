import express from "express";
import { getSummary } from "../controllers/dashboardController.js";

import { mockAuth } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ALL roles can view dashboard
router.get("/", mockAuth, authorizeRoles("admin", "analyst", "viewer"), getSummary);

export default router;