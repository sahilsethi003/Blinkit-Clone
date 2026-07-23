import { Router } from "express";
import auth from "../middleware/auth.js";
import { admin } from "../middleware/Admin.js";
import {
    createPromoCodeController,
    getPublicPromoCodesController,
    getAdminPromoCodesController,
    updatePromoCodeController,
    deletePromoCodeController
} from "../controllers/promocode.controller.js";

const promoCodeRouter = Router();

// Public route to fetch active promo codes
promoCodeRouter.get("/get", getPublicPromoCodesController);

// Admin-only routes
promoCodeRouter.post("/create", auth, admin, createPromoCodeController);
promoCodeRouter.get("/admin-get", auth, admin, getAdminPromoCodesController);
promoCodeRouter.put("/update", auth, admin, updatePromoCodeController);
promoCodeRouter.delete("/delete", auth, admin, deletePromoCodeController);

export default promoCodeRouter;
