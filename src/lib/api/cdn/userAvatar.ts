export default function cdnUserAvatar(userId: string, avatarHash: string) {
	return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${
		!avatarHash.startsWith('a_') ? 'png' : 'gif'
	}`;
}
