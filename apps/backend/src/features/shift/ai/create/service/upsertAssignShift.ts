import type { AssignShift } from "@shared/api/common/types/prisma.js";
import type { upsertAssignShfitInputType } from "@shared/api/shift/assign/validations/put.js";
import { upsertAssignShfit } from "../../../../../repositories/assingShift.repostory.js";

const upsertAssignShfitService = async ({
	storeId,
	upsertData,
}: {
	storeId: string;
	upsertData: upsertAssignShfitInputType;
}): Promise<AssignShift> => {
	try {
		const assignShift = await upsertAssignShfit(storeId, upsertData);
		return assignShift;
	} catch (e) {
		console.error("アップサート失敗", e);
		throw new Error("シフト保存に失敗しました");
	}
};

export default upsertAssignShfitService;
