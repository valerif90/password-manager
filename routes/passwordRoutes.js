import express from "express";
import {
  addPassword,
  fetchPasswords,
  updatePassword,
  deletePassword,
} from "../controllers/passwordsController.js";
import { passwordAuth } from "../middelware/passwordsAuth.js";

const router = express.Router();

router.get("/sync-passwords", passwordAuth, fetchPasswords);

router.post("/add", passwordAuth, addPassword);

router.post("/update", passwordAuth, updatePassword);

router.delete("/delete", passwordAuth, deletePassword);

export default router;
