import Stripe from "stripe";
import "./env";
import "dotenv/config";
import { STRIPE_SECRET_KEY } from "../lib/env";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2025-02-24.acacia",
});
