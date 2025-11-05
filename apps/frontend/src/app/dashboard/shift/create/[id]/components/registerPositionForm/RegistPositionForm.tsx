import { toISO } from "@/app/utils/date";
import type { UpsertShiftPositionBaseInput } from "@shared/api/shiftPosition/validations/put-bulk";
import { useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { useGetShfitPositions } from "../../api/get-shift-positions/hook";
import { useCreateRequest } from "../../context/CreateRequestFormProvider";
import Positionlist from "./PositionList";
import UpsertPositionModal from "./UpsertPositionModal";

const RegistPositionForm = () => {
	const { setShiftPositions } = useCreateRequest();
	const [position, setPosition] = useState<UpsertShiftPositionBaseInput>({
		name: "",
		startTime: "",
		endTime: "",
		jobRoles: [],
		count: 1,
		weeks: [],
		absolute: [],
		priority: [],
	});

	const [editIndex, setEditIndex] = useState<number | null>(null);
	const { handleGetShiftPositions } = useGetShfitPositions();

	const loadedRef = useRef(false);
	useEffect(() => {
		if (loadedRef.current) return;
		loadedRef.current = true;

		const fetchData = async () => {
			const res = await handleGetShiftPositions();
			if (!res.ok && "message" in res) {
				alert(res.message);
				return;
			}
			setShiftPositions(
				res.shiftPositions.map((pos) => ({
					...pos,
					startTime: toISO(pos.startTime),
					endTime: toISO(pos.endTime),
					absolute: pos.absolute ?? [],
					priority: pos.priority ?? [],
					count:
						typeof pos.count === "number" && pos.count !== null ? pos.count : 1,
				})),
			);
		};
		fetchData();
	}, [handleGetShiftPositions, setShiftPositions]);

	const openUpsertPositionModal = (
		position: UpsertShiftPositionBaseInput,
		index: number | null,
	) => {
		setEditIndex(index);
		const modal = document.getElementById(
			`position_${position.name}`,
		) as HTMLDialogElement;
		if (modal) {
			modal.showModal();
		}
		setPosition({
			...position,
			absolute: position.absolute ?? [],
			priority: position.priority ?? [],
		});
	};

	return (
		<div className="w-full mx-auto flex flex-col h-auto">
			<UpsertPositionModal
				position={position}
				setPosition={setPosition}
				editIndex={editIndex}
			/>

			<div className="w-full flex flex-col gap-1 items-center justify-center p-1 bg-white">
				<button
					type="button"
					className="btn btn-sm bg-white text-green01 font-bold w-full border-dashed border-1 border-gray01 shadow-none"
					onClick={() => openUpsertPositionModal(position, null)}
				>
					<MdAdd className="text-lg" />
					ポジションを追加
				</button>
			</div>
			<Positionlist openUpsertPositionModal={openUpsertPositionModal} />
		</div>
	);
};

export default RegistPositionForm;
