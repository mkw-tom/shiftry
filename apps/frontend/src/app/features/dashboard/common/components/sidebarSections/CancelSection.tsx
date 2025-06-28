import React from "react";
import { TbCancel } from "react-icons/tb";

const CancelSection = () => {
	return (
		<section className="w-full">
			<div className="collapse  collapse-arrow">
				<input type="checkbox" />
				<div className="collapse-title text-black font-bold text-xs text-left flex items-center">
					<TbCancel className="text-lg" />
					<span className="ml-2">解約手続き</span>
				</div>
				<div className="collapse-content">
					<ul className="list-disc text-black text-xs mx-4 flex flex-col gap-2 mt-2">
						<li>
							解約を確定後は、ご契約期間が過ぎるとアプリをご利用いただけなくなります。
						</li>
						<li>
							なお、解約後は残りのご契約期間内は、アプリをご利用いただけます。
						</li>
					</ul>
					<button
						type="button"
						className="btn btn-sm bg-error rounded-full text-xs w-full mt-5 mb-10 text-white"
					>
						解約へ進む
					</button>
				</div>
			</div>
		</section>
	);
};

export default CancelSection;
