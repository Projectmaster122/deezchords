import request from '$lib/api/custom/calls';
import type { IUser } from '$lib/api/types/user';

export default async function getThisUser(customToken?: string) {
	const output = await request<IUser>(
		'GET',
		'https://discord.com/api/v10/users/@me',
		{ short: 'Getting user data', long: 'User data' },
		1,
		undefined,
		undefined,
		undefined,
		customToken
	);

	if (output.fail) return false;
	return output.resp;
}
