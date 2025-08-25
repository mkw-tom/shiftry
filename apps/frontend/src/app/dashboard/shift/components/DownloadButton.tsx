import { MdDownload } from "react-icons/md";

const DownloadButton = () => {
	return (
		<div className="w-1/2 h-10">
			<button
				type="submit"
				className="btn rounded-md bg-black text-white border-none flex items-center gap-2 w-full shadow-md"
			>
				<MdDownload className="text-lg" />
				<span className="mr-2">ダウンロード</span>
			</button>
		</div>
	);
};
export default DownloadButton;
