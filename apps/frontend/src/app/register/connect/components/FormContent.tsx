"use client";
import { useState } from "react";
import { MdErrorOutline } from "react-icons/md";
import useUnconnectedStore from "../hooks/useUnconnectedStore";
import ConnectForm from "./ConnectForm";
import UnconnectedStoreList from "./UnconnectedStoreList";

const FormContent = () => {
	const [selectStoreId, setSelectStoreId] = useState<string | null>(null);
	const { unconnectedStores, loading, error } = useUnconnectedStore();

	if (error !== null) {
		return (
			<div className="w-11/12 mx-auto mt-5 flex flex-col items-center justify-center gap-3">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-center text-gray02">
					店舗の取得に失敗しました。
					<br />
					再度ページを開き直してください
				</p>
			</div>
		);
	}

	if (unconnectedStores.length === 0) {
		return (
			<div className="w-11/12 mx-auto mt-5 flex flex-col items-center justify-center gap-3">
				<MdErrorOutline className="text-gray02 text-2xl mt-20" />
				<p className="text-center text-gray-500">接続可能な店舗がありません</p>
			</div>
		);
	}
	if (loading) {
		return (
			<div className="w-11/12 mx-auto mt-5 flex flex-col items-center justify-center gap-3">
				<p className="loading loading-spinner text-green02 mt-20" />
				<p className="text-center text-green-500">店舗情報を取得中...</p>
			</div>
		);
	}

	return (
		<>
			<UnconnectedStoreList
				unconnectedStores={unconnectedStores}
				selectStoreId={selectStoreId}
				setSelectStoreId={setSelectStoreId}
			/>
			<ConnectForm storeId={selectStoreId} />
		</>
	);
};

export default FormContent;
