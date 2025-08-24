import type { UpsertShiftPositionType } from "@shared/api/shiftPosition/validations/put-bulk";
import type React from "react";
import { useState } from "react";

const useUpsertJobrole = ({
	position,
	setPosition,
	jobRoles,
	setJobRoles,
}: {
	position: UpsertShiftPositionType;
	setPosition: React.Dispatch<React.SetStateAction<UpsertShiftPositionType>>;
	jobRoles: string[];
	setJobRoles: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
	const [newJobRoles, setNewJobRole] = useState<string[]>([]);
	const [showALlJobRoles, setShowAllJobRoles] = useState(false);
	const [updated, setUpdated] = useState({ deleted: 0, added: 0 });

	const [editJobRole, setEditJobRole] = useState<number | null>(null);
	const [editInputValue, setEditInputValue] = useState("");

	const addJobRoleFromAllJobRolesList = (jobRoleValue: string) => {
		if (position.jobRoles.includes(jobRoleValue)) {
			window.alert("この業務はすでに追加されています");
			return;
		}
		setPosition((prev) => ({
			...prev,
			jobRoles: [...prev.jobRoles, jobRoleValue],
		}));
		setShowAllJobRoles(false);
	};

	const addJobRole = (inputJobRoleValue: string) => {
		if (position.jobRoles.includes(inputJobRoleValue)) {
			window.alert("この業務はすでに追加されています");
			return;
		}
		if (inputJobRoleValue.trim() === "") {
			window.alert("業務名を入力してください");
			return;
		}

		setPosition((prev) => ({
			...prev,
			jobRoles: [...prev.jobRoles, inputJobRoleValue],
		}));

		if (!jobRoles.includes(inputJobRoleValue)) {
			setNewJobRole((prev) => [...prev, inputJobRoleValue]);
			updated.added += 1;
		}
	};

	const editJobRoleName = (index: number) => {
		setJobRoles((prev) =>
			prev.map((r, i) => {
				if (i === index) {
					return editInputValue;
				}
				return r;
			}),
		);
		setEditJobRole(null);
		setEditInputValue("");
	};

	const deleteJobRoleFromAllJobRoleList = (role: string) => {
		if (!confirm("この業務を削除しますか？")) return;
		setJobRoles((prev) => prev.filter((r) => r !== role));
		updated.deleted += 1;
	};

	const deleteJobRole = (role: string) => {
		setPosition((prev) => ({
			...prev,
			jobRoles: prev.jobRoles.filter((r) => r !== role),
		}));
		if (!jobRoles.includes(role)) {
			setNewJobRole((prev) => prev.filter((r) => r !== role));
			updated.deleted += 1;
		}
	};

	const cancelEditJobRole = () => {
		setEditJobRole(null);
		setEditInputValue("");
	};

	const saveJobRoleDatas = () => {
		setJobRoles((prev) => [...prev, ...newJobRoles]);
		setNewJobRole([]);
	};

	const closeAllJobRoleListModal = () => {
		setShowAllJobRoles(false);
		setEditJobRole(null);
		setEditInputValue("");
	};

	const values = {
		state: {
			showALlJobRoles,
			setShowAllJobRoles,
			editJobRole,
			setEditJobRole,
			editInputValue,
			setEditInputValue,
			updated,
		},
		actions: {
			addJobRoleFromAllJobRolesList,
			addJobRole,
			editJobRoleName,
			deleteJobRoleFromAllJobRoleList,
			cancelEditJobRole,
			deleteJobRole,
			saveJobRoleDatas,
			closeAllJobRoleListModal,
			setUpdated,
		},
	};

	return values;
};

export default useUpsertJobrole;
