// import { useNavigation } from "@/app/lib/navigation";
// import { clearAllTokens } from "@/app/redux/slices/token";
// import { useRouter } from "next/navigation";
// import React from "react";
// import { useDispatch } from "react-redux";

// const AutoLoginError = ({
// 	storeId,
// 	shiftRequestId,
// }: { storeId: string | null; shiftRequestId: string | null }) => {
// 	const dispatch = useDispatch();
// 	const router = useRouter();

// 	const reTryLogin = () => {
// 		dispatch(clearAllTokens());
// 		router.replace(
// 			`/auth/login?storeId=${storeId}&shiftRequestId=${shiftRequestId}`,
// 		);
// 	};

// 	return (
// 		<>
// 			<div className="fixed h-auto top-0 bottom-0 left-0 right-0  z-20 bg-[color:var(--color-overlay)]">
// 				<div className="w-full mt-56">
// 					<div className="card bg-base-100 w-11/12 shadow-sm mx-auto">
// 						<div className="card-body">
// 							<h2 className="card-title">ログインエラー</h2>
// 							<p>ログイン情報を取得に失敗しました。</p>
// 							<div className="card-actions justify-end">
// 								<button
// 									type="button"
// 									className="btn btn-error rounded-full btn-md"
// 									onClick={reTryLogin}
// 								>
// 									ログイン画面へ
// 								</button>
// 							</div>
// 						</div>
// 					</div>
// 				</div>
// 			</div>
// 		</>
// 	);
// };

// export default AutoLoginError;
