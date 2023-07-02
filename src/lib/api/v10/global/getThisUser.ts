import request from '$lib/api/custom/calls';

export default async function getThisUser(customToken?: string) {
	const output = await request<IgetThisUser>(
		'GET',
		'https://discord.com/api/v10/users/@me',
		{ short: 'Getting user data' },
		undefined,
		undefined,
		undefined,
		customToken
	);

	if (output.fail) return false;
	return output.resp;
}

export interface IgetThisUser {
	id: string;
	username: string;
	discriminator: string;
	global_name: string | null;
	avatar: string | null;
	bot: boolean | undefined;
	system: boolean | undefined;
	mfa_enabled: boolean | undefined;
	banner: string | null;
	accent_color: number | null;
	locale: string;
	verified: boolean;
	email: string | null | undefined;
	flags: number | undefined;
	premium_type: number | undefined;
	public_flags: number | undefined;
}
