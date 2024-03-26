import express from "express";
const router = express.Router();

//authentication
import { verifyToken } from "../middleware/commonMiddlewares";

//validations
import {
  registerSchemaValidation,
  loginSchemaValidation,
  verifyEmailSchemaValidation,
} from "../validation/User";

//controllers
import {
  initialRoute,
  createUser,
  verifyEmailCode,
  loginUser,
} from "../users/controller/userController";

router.get("/", initialRoute);

router.post("/signup", registerSchemaValidation, createUser);
router.post("/signin", loginSchemaValidation, loginUser);
router.post(
  "/verify-email",
  verifyEmailSchemaValidation,
  verifyToken,
  verifyEmailCode
);

export const allRoutes = router;
