export const selectedOrganization: {
	value: {
		role: string;
		organization: { name: string; id: string } | null;
	} | null;
} = $state({value: null});
