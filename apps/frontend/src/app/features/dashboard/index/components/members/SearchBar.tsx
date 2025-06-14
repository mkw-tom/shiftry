import { RootState } from "@/app/redux/store";
import React from "react";
import { useSelector } from "react-redux";

const SearchBar = () => {
	return (
		<div className="w-11/12 mx-auto mt-2 border-b-1 border-b-gray01 pb-1">
			<input className="w-4/5 bg-gray01 rounded-l-full input input-xs input-success outline-none" />
			<button
				type="button"
				className="btn btn-xs w-1/5 btn-success bg-green01 text-white rounded-r-full "
			>
				Filter
			</button>
		</div>
	);
};

export default SearchBar;
