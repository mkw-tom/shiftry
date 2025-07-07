import type { User } from "@shared/api/common/types/prisma";
import { useGenareteShift } from "../../../context/useGenerateShift";

// const users: User[] = [
// 	{
// 		id: "user-1111-aaaa-bbbb-cccc-000000000001",
// 		lineId: "LINE_USER_001",
// 		name: "A子さん",
// 		pictureUrl: "https://example.com/avatar_a.jpg",
// 		role: "STAFF", // 例: "OWNER" or "STAFF"
// 		createdAt: new Date("2025-06-01T10:00:00Z"),
// 		updatedAt: new Date("2025-06-01T10:00:00Z"),
// 	},
// 	{
// 		id: "user-2222-dddd-eeee-ffff-000000000002",
// 		lineId: "LINE_USER_002",
// 		name: "B子さん",
// 		pictureUrl: "https://example.com/avatar_b.jpg",
// 		role: "STAFF",
// 		createdAt: new Date("2025-06-01T11:00:00Z"),
// 		updatedAt: new Date("2025-06-01T11:00:00Z"),
// 	},
// ];

const NotSubmitShiftList = () => {
	const { submittedDatas } = useGenareteShift();
	const { notSubmittedShifts } = submittedDatas;
	return (
		<div>
			{notSubmittedShifts.map((user) => (
				<div
					key={user.id}
					className="flex items-center justify-between py-4 px-2 border-b border-gray01"
				>
					<div className="flex flex-col items-start gap-2 w-full">
						<div className=" flex items-center w-full gap-2">
							<div className="w-7 h-7 bg-gray01 rounded-md" />
							<span className="text-sm  text-black">{user.name}</span>
						</div>
					</div>
				</div>
			))}
		</div>
	);
};

export default NotSubmitShiftList;
