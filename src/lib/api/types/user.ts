export interface IUser {
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
