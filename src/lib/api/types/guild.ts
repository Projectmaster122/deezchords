import type { IChannel } from './channel';
import type { IEmoji, ISticker } from './emoji';
import type { IRole } from './role';
import type { IUser } from './user';
import type { IWelcomeScreen } from './welcomeScreen';

export interface IGuild {
	id: string;
	name: string;
	icon?: string | null;
	icon_hash?: string | null;
	splash?: string | null;
	discovery_splash?: string | null;
	owner?: boolean;
	owner_id: string;
	permissions?: string;
	region?: string | null;
	afk_channel_id?: string | null;
	afk_timeout: number;
	widget_enabled?: boolean;
	widget_channel_id?: string | null;
	verification_level: number;
	default_message_notifications: number;
	explicit_content_filter: number;
	roles: IRole[];
	emojis: IEmoji[];
	features: string[];
	mfa_level: number;
	application_id?: string | null;
	system_channel_id?: string | null;
	system_channel_flags: number;
	rules_channel_id?: string | null;
	max_presences?: number | null;
	max_members?: number;
	vanity_url_code?: string | null;
	description?: string | null;
	banner?: string | null;
	premium_tier: number;
	premium_subscription_count?: number;
	preferred_locale: string;
	public_updates_channel_id?: string | null;
	max_video_channel_users?: number;
	max_stage_video_channel_users?: number;
	approximate_member_count?: number;
	approximate_presence_count?: number;
	welcome_screen?: IWelcomeScreen;
	nsfw_level: number;
	stickers?: ISticker[];
	premium_progress_bar_enabled: boolean;
	safety_alerts_channel_id?: string | null;
}

export interface IInvite {
	code: string;
	guild: IGuild | undefined;
	channel: IChannel;
	inviter: IUser | undefined;
	target_type: number | undefined;
	target_user: IUser | undefined;
	//target_application: // FIXME: Application
	approximate_presence_count: number | undefined;
	approximate_member_count: number | undefined;
	expires_at: number | undefined | null;
	//stage_instance: // FIXME: StageInstance
	//guild_scheduled_event: // FIXME: GuildScheduledEvent
}

export interface IGuildMember {
	user?: IUser;
	nick?: string | null;
	avatar?: string | null;
	roles: string[];
	joined_at: string;
	premium_since?: string | null;
	deaf: boolean;
	mute: boolean;
	flags: number;
	pending?: boolean;
	permissions?: string;
	communication_disabled_until?: string | null;
}
