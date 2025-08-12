import Stripe from "stripe";
import "./env.js";
import "dotenv/config.js";
import { STRIPE_SECRET_KEY } from "../lib/env.js";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: "2025-02-24.acacia",
});
