import express from "express";
import {
    createUser,
    getUsers,
    updateUser,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/", createUser);
router.get("/", getUsers);
router.patch("/:id", updateUser);

export default router;