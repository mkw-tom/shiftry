import Image from "next/image";

const InviteBotForm = () => {
	return (
		<>
			<Image
				src="/invite-bot.jpeg"
				alt="register"
				width={400}
				height={400}
				className="object-cover mx-auto"
			/>
		</>
	);
};

export default InviteBotForm;
