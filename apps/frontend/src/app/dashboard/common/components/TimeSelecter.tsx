import type React from "react";
import { useEffect, useRef, useState } from "react";
import { BiTime } from "react-icons/bi";

type TimeSelecterProps = {
	value: string;
	onChange: (value: string) => void;
	step?: number; // 分刻み（例: 15, 30）
	start?: string; // 開始時刻（例: "06:00"）
	end?: string; // 終了時刻（例: "23:30"）
	label?: string;
	btnStyle?: string;
	color?: string;
};

// "HH:mm" → 分
const timeToMinutes = (time: string) => {
	const [h, m] = time.split(":").map(Number);
	return h * 60 + m;
};

// 分 → "HH:mm"
const minutesToTime = (minutes: number) => {
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
};

const TimeSelecter: React.FC<TimeSelecterProps> = ({
	value,
	onChange,
	step = 30,
	start = "00:00",
	end = "23:30",
	label,
	btnStyle = "w-48",
	color = "primary",
}) => {
	const [open, setOpen] = useState(false);
	const dropdownRef = useRef<HTMLDivElement>(null);

	// 選択肢生成
	const startMin = timeToMinutes(start);
	const endMin = timeToMinutes(end);
	const options: string[] = [];
	for (let min = startMin; min <= endMin; min += step) {
		options.push(minutesToTime(min));
	}

	// 外側クリックで閉じる（スマホ対応）
	useEffect(() => {
		if (!open) return;
		const handleClose = (e: PointerEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(e.target as Node)
			) {
				setOpen(false);
			}
		};
		document.addEventListener("pointerdown", handleClose, { passive: true });
		return () => document.removeEventListener("pointerdown", handleClose);
	}, [open]);

	return (
		<div className="flex flex-col gap-1">
			{label && <span className="label-text mb-1">{label}</span>}
			<div className="relative" ref={dropdownRef}>
				<button
					type="button"
					className={`input input-bordered flex justify-between items-center cursor-pointer text-gray-700 ${btnStyle}`}
					onClick={() => setOpen((v) => !v)}
				>
					<span>{value}</span>
					<span className="ml-2 text-gray-400">
						<BiTime />
					</span>
				</button>

				{open && (
					<div className="absolute top-full mt-1 right-0 w-32 max-h-60 overflow-y-auto shadow-lg bg-base-100 rounded-box z-50">
						<ul className="grid grid-cols-2 p-0 text-gray-700">
							{options.map((opt) => (
								<li key={opt}>
									<button
										type="button"
										className={`w-full text-left px-2 py-1 hover:bg-primary hover:text-primary-content ${
											opt === value ? `bg-${color} text-primary-content` : ""
										}`}
										onClick={() => {
											onChange(opt);
											setOpen(false);
										}}
									>
										{opt}
									</button>
								</li>
							))}
						</ul>
					</div>
				)}
			</div>
		</div>
	);
};

export default TimeSelecter;
