export default function cdnGuildBanner(guildId: string, hash: string) {
	return `https://cdn.discordapp.com/banners/${guildId}/${hash}.${
		!hash.startsWith('a_') ? 'png' : 'gif'
	}`;
}
