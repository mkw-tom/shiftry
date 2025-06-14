import React from "react";

const Skeleton = ({
	width,
	height,
	rounded,
}: { width: string; height: string; rounded: string }) => {
	const size = `${height} ${width} ${rounded}`;

	return <div className={`skeleton ${size} bg-gray-100`} />;
};

export default Skeleton;
