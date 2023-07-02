import request from '$lib/api/custom/calls';

export default async function tokenValid(customToken?: string) {
	const output = await request(
		'GET',
		'https://discord.com/api/v10/users/@me',
		{ short: 'Checking token' },
		undefined,
		undefined,
		undefined,
		customToken
	);

	if (output.fail) return false;
	return true;
}
