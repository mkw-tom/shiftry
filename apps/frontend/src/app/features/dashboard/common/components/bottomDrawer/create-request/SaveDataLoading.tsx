import React from "react";

const SaveDataLoading = () => {
	return (
		<>
			<div
				className="fixed h-auto top-0 bottom-0 left-0 right-0  z-20 bg-[color:var(--color-overlay)]
        "
			>
				<div className="w-full mt-56">
					<div className="w-11/12  mx-auto text-center flex flex-col items-center gap-2 text-white ">
						<span>データ保存中...</span>
						<span className="loading loading-spinner loading-md" />
					</div>
				</div>
			</div>
		</>
	);
};

export default SaveDataLoading;
