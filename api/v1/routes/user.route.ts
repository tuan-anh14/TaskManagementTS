import { Router, Request, Response } from "express";
const router: Router = Router();

import * as controller from "../controllers/user.controller";

import * as authMiddleWare from "../middlewares/auth.middleware";

router.post("/register", controller.register);

router.post("/login", controller.login);

router.get("/detail", authMiddleWare.requireAuth, controller.detail);

export const userRoutes: Router = router;
