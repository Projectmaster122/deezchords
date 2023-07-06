export const load = ({ params, cookies }) => {
	cookies.set('dev', params.code, {
		secure: false,
		path: '/',
		expires: new Date(Date.now() + 24 * 60 * 60 * 1000)
	});

	return {
		code: params.code,
		status: 200
	};
};