export type User = {
	firstName: string | null;
	lastName: string | null;
	email: string;
	emailVerifiedAt: Date | null;
	organizations: {
		role: string;
		organization: {
			name: string;
			id: string;
		} | null;
	}[];
};
