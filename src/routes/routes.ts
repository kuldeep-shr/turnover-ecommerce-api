import express from "express";
const router = express.Router();

//authentication
import { verifyToken } from "../middleware/commonMiddlewares";

//validations
import {
  registerSchemaValidation,
  loginSchemaValidation,
  verifyEmailSchemaValidation,
  updateCategoriesSchemaValidation,
  categoriesListSchemaValidation,
} from "../validation/User";

//controllers
import {
  initialRoute,
  createUser,
  verifyEmailCode,
  loginPage,
  loginUser,
  updateSelectedCategories,
  categoriesList,
  pagination,
  categoryPage,
} from "../users/controller/userController";

router.get("/", initialRoute);
router.get("/signin", loginPage);
router.get("/category", categoryPage);

router.post("/signup", registerSchemaValidation, createUser);
router.post("/signin", loginSchemaValidation, loginUser);
router.post(
  "/verify-email",
  verifyEmailSchemaValidation,
  verifyToken,
  verifyEmailCode
);
router.post(
  "/update-categories",
  updateCategoriesSchemaValidation,
  verifyToken,
  updateSelectedCategories
);

router.post(
  "/categories",
  categoriesListSchemaValidation,
  verifyToken,
  categoriesList
);

router.get("/categories-count", verifyToken, pagination);

export const allRoutes = router;
