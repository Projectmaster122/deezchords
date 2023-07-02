export function generatePfpInitials(name: string) {
	const words = name.split(' ');
	let initials = '';
	for (let i = 0; i < words.length; i++) {
		const initial = words[i].charAt(0).toUpperCase();
		initials += initial;
		if (initials.length === 3) {
			break;
		}
	}
	return initials;
}
