import request from '$lib/api/custom/calls';
import type { IInvite } from '$lib/api/types/guild';

export default async function inviteGuild(options: { guildId: string }, customToken?: string) {
	const output = await request<IInvite>(
		'GET',
		`https://discord.com/api/v10/invites/${options.guildId}`,
		{ short: 'Getting guild join dialog' },
		{ with_counts: true, with_expiration: true },
		undefined,
		undefined,
		customToken
	);

	if (output.fail) return false;
	return output.resp;
}
