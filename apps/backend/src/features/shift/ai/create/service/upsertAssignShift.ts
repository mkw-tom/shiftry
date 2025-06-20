import type { AssignShift } from "@shared/common/types/prisma";
import type { upsertAssignShfitInputType } from "@shared/shift/assign/validations/put";
import { upsertAssignShfit } from "../../../../../repositories/assingShift.repostory";

const upsertAssignShfitService = async ({
	storeId,
	upsertData,
}: {
	storeId: string;
	upsertData: upsertAssignShfitInputType;
}): Promise<AssignShift> => {
	try {
		const { shiftRequestId, shifts } = upsertData;
		const assignShift = await upsertAssignShfit(storeId, {
			shiftRequestId: shiftRequestId,
			shifts: shifts,
			status: "ADJUSTMENT",
		});
		return assignShift;
	} catch (e) {
		console.error("アップサート失敗", e);
		throw new Error("シフト保存に失敗しました");
	}
};

export default upsertAssignShfitService;
