"use client";
import React from "react";

const ConnectButton = ({
	isDisabled,
	connecting,
}: { isDisabled: boolean; connecting: boolean }) => {
	return (
		<button
			type="submit"
			className={`btn sm:btn-md ${
				isDisabled || connecting
					? "bg-gray01 opacity-90 pointer-events-none"
					: " bg-green02"
			} rounded-md border-none w-full mx-auto text-white mt-5 `}
			disabled={connecting}
		>
			<div className="flex items-center gap-2">
				<svg
					aria-label="Line logo"
					width="16"
					height="16"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 16 16"
				>
					<title>invite lineBot</title>
					<g fillRule="evenodd" strokeLinejoin="round" fill="white">
						<path
							fillRule="nonzero"
							d="M12.91 6.57c.232 0 .42.19.42.42 0 .23-.188.42-.42.42h-1.17v.75h1.17a.42.42 0 1 1 0 .84h-1.59a.42.42 0 0 1-.418-.42V5.4c0-.23.188-.42.42-.42h1.59a.42.42 0 0 1-.002.84h-1.17v.75h1.17zm-2.57 2.01a.421.421 0 0 1-.757.251l-1.63-2.217V8.58a.42.42 0 0 1-.42.42.42.42 0 0 1-.418-.42V5.4a.418.418 0 0 1 .755-.249L9.5 7.366V5.4c0-.23.188-.42.42-.42.23 0 .42.19.42.42v3.18zm-3.828 0c0 .23-.188.42-.42.42a.42.42 0 0 1-.418-.42V5.4c0-.23.188-.42.42-.42.23 0 .418.19.418.42v3.18zM4.868 9h-1.59c-.23 0-.42-.19-.42-.42V5.4c0-.23.19-.42.42-.42.232 0 .42.19.42.42v2.76h1.17a.42.42 0 1 1 0 .84M16 6.87C16 3.29 12.41.376 8 .376S0 3.29 0 6.87c0 3.208 2.846 5.896 6.69 6.405.26.056.615.172.705.394.08.2.053.518.026.722 0 0-.092.565-.113.685-.035.203-.16.79.693.432.854-.36 4.607-2.714 6.285-4.646C15.445 9.594 16 8.302 16 6.87"
						/>
					</g>
				</svg>
				LINEグループ連携
			</div>
		</button>
	);
};

export default ConnectButton;
