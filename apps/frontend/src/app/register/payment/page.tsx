"use client";
import FirstView from "@/app/features/common/components/FirstView";
import RegisterPaymentArea from "@/app/features/register/payment/components/RegisterPaymentArea";
import { NEXT_PUBLIC_STRIPE_PK } from "@/app/lib/env";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

import React from "react";
const stripePromise = loadStripe(NEXT_PUBLIC_STRIPE_PK);

const Page = () => {
	return (
		<Elements stripe={stripePromise}>
			<main className="bg-green01 w-full  h-lvh">
				<div className="bg-green01 w-full md:w-[400px] mx-auto">
					<FirstView />
					<RegisterPaymentArea />
				</div>
			</main>
		</Elements>
	);
};

export default Page;
