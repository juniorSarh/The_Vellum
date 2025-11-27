import { Router } from "express";
import { initializePayment } from "../controllers/payment.controller";

const paymentRouter = Router();

paymentRouter.post("/", initializePayment);

export default paymentRouter;
