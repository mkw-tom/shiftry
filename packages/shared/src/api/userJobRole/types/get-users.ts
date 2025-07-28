export type GetJobRoleWithUsersResonse = {
	ok: boolean;
	userJobRoleWithUser: UserJobRoleWithUser[];
};

export type UserJobRoleWithUser = {
	id: string;
	userId: string;
	roleId: string;
	user: {
		id: string;
		name: string;
		jobRoles: {
			roleId: string;
			role: {
				id: string;
				name: string;
			};
		}[];
	};
};
