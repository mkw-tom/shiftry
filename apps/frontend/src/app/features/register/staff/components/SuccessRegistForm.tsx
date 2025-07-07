import Link from "next/link";
import React from "react";

const SuccessRegistForm = () => {
	return (
		<div>
			<div className="w-full h-32 flex flex-col justify-center items-center gap-2">
				<span className="text-success font-bold">登録が完了しました ✨</span>
				<span className="text-xs text-gray-500">
					ご登録ありがとうございます。
				</span>
			</div>
			<Link href={"/dashboard"} className="flex justify-center mt-5">
				<button
					type="button"
					className="btn btn-sm sm:btn-md bg-green02 rounded-full border-none w-2/3 mx-auto text-white"
				>
					ダッシュボードへ移動
				</button>
			</Link>
		</div>
	);
};

export default SuccessRegistForm;
