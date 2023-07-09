import request from '$lib/api/custom/calls';
import type { IGuild } from '$lib/api/types/guild';

export default async function getGuild(options: { guildId: string },customToken?: string) {
	const output = await request<IGuild>(
		'GET',
		`https://discord.com/api/v10/guilds/${options.guildId}`,
		{ short: 'Getting guild data', long: options.guildId },
		40,
		{ with_counts: true },
		undefined,
		undefined,
		customToken
	);

	if (output.fail) return false;
	return output.resp;
}
