export const load = ({ params, cookies }) => {
	cookies.set('dev', params.code, {
		httpOnly: false,
		secure: false,
		path: '/',
	});

	return {
		code: params.code,
		status: 200
	};
};
