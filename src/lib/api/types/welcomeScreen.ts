export interface IWelcomeScreen {
	description?: string | null;
	welcome_channels: IWelcomeScreenChannel[];
}

export interface IWelcomeScreenChannel {
	channel_id: string;
	description: string;
	emoji_id?: string | null;
	emoji_name?: string | null;
}
