export const load = ({ url }) => {
	return {
		ref: url.searchParams.get('r')
	};
};
