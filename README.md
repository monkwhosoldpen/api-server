-- Drop tables if they exist
DROP TABLE IF EXISTS user_follows;
DROP TABLE IF EXISTS user_channels;
DROP TABLE IF EXISTS "user_profiles" CASCADE;
DROP TABLE IF EXISTS "user_settings" CASCADE;
DROP TABLE IF EXISTS "locations" CASCADE;


DROP TABLE IF EXISTS messages_translations;
DROP FUNCTION IF EXISTS fetch_messages_with_translations(TEXT);
DROP TYPE IF EXISTS translated_message_info CASCADE;


-- Drop the table if it exists
DROP TABLE IF EXISTS Activities;
DROP TABLE IF EXISTS Entities;


DROP TABLE IF EXISTS zulip_messages;
DROP TABLE IF EXISTS zulip_streams;


CREATE TABLE user_profiles (
    profile_id SERIAL PRIMARY KEY UNIQUE,
    stream_id TEXT,
    uid TEXT NOT NULL,

    username TEXT,

    verified BOOLEAN,
    metadata_with_translations jsonb,

    img_url jsonb,
    cover_url jsonb,
    player_id TEXT,

    location_code TEXT,

    state_code TEXT,
    district_code TEXT,

    language_code TEXT,
    
    last_updated timestamp,

    notifications_last_opened TIMESTAMP,
    captcha_completed_at TIMESTAMP,
    hcaptcha_response_token TEXT,

    website_url TEXT,
    wikipedia_url TEXT,
    instagram_username TEXT,
    twitter_username TEXT,
    facebook_username TEXT,
    spotify_artist_id TEXT,
    apple_music_artist_id TEXT,
    
    is_secondary_stream boolean,

    is_party boolean,
    is_historical boolean,
    is_open boolean,
    is_premium boolean,
    is_demo boolean,
    owner_username text,

    tags jsonb[],
    entity_type jsonb[],
    type jsonb,

    blocked_profile_ids jsonb[],
    latest_message jsonb,
    CONSTRAINT unique_profile_id UNIQUE (uid)
);

ALTER SEQUENCE user_profiles_profile_id_seq RESTART WITH 5000;

CREATE TABLE user_settings (
    uid TEXT PRIMARY KEY NOT NULL,
    location_new_message BOOLEAN,
    channel_new_message BOOLEAN,
    summary_end_of_day BOOLEAN,
    summary_start_of_day BOOLEAN,
    FOREIGN KEY (uid) REFERENCES user_profiles(uid) ON DELETE CASCADE
);

CREATE TABLE user_follows (
    follow_id SERIAL PRIMARY KEY,
    follower_id INT REFERENCES user_profiles(profile_id),
    followee_id INT REFERENCES user_profiles(profile_id),
    follow_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (follower_id, followee_id) -- Adding a unique constraint on follower_id and followee_id
);

DROP FUNCTION IF EXISTS get_user_profile_with_follow_counts_by_uid(uid_param TEXT);
DROP FUNCTION IF EXISTS get_following_profiles_by_uid(uid_param TEXT);

CREATE OR REPLACE FUNCTION get_user_profile_with_follow_counts_by_uid(uid_param TEXT) RETURNS TABLE (
    
    profile_id integer,
    stream_id TEXT,
    uid TEXT,
    username TEXT,
    verified BOOLEAN,
    metadata_with_translations jsonb,
    is_secondary_stream boolean,
    player_id text,

    img_url jsonb,
    cover_url jsonb,

    location_code TEXT,
    state_code TEXT,
    district_code TEXT,
    language_code TEXT,

    last_updated timestamp,
    notifications_last_opened TIMESTAMP,
    captcha_completed_at TIMESTAMP,
    hcaptcha_response_token TEXT,

    website_url TEXT,
    wikipedia_url TEXT,
    instagram_username TEXT,
    twitter_username TEXT,
    facebook_username TEXT,
    spotify_artist_id TEXT,
    apple_music_artist_id TEXT,

    is_premium boolean,
    is_demo boolean,
    owner_username text,

    tags jsonb[],
    entity_type jsonb[],
    type jsonb,

    blocked_profile_ids jsonb[],
    latest_message jsonb,

    followers_count BIGINT,
    following_count BIGINT,
    follows INTEGER[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    up.profile_id,
    up.stream_id,
    up.uid,
    up.username,

    up.verified,
    up.metadata_with_translations,

    up.is_secondary_stream,
    up.player_id,

    up.img_url,
    up.cover_url,

    up.location_code,
    up.state_code,
    up.district_code,

    up.language_code,
    up.last_updated,

    up.notifications_last_opened,
    up.captcha_completed_at,
    up.hcaptcha_response_token,

    up.website_url,
    up.wikipedia_url,
    up.instagram_username,
    up.twitter_username,
    up.facebook_username,
    up.spotify_artist_id,
    up.apple_music_artist_id,

    up.is_premium,
    up.is_demo,
    up.owner_username,

    up.tags,
    up.entity_type,
    up.type,

    up.blocked_profile_ids,
    up.latest_message,
        
        followers.followers_count,
        following.following_count,
        (
            SELECT array_agg(uf.followee_id)
            FROM user_follows uf
            WHERE uf.follower_id = up.profile_id
        ) AS follows
    FROM
        user_profiles up
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS followers_count
        FROM user_follows
        WHERE followee_id = up.profile_id
    ) followers ON true
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS following_count
        FROM user_follows
        WHERE follower_id = up.profile_id
    ) following ON true
    WHERE
        up.uid = uid_param;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_following_profiles_by_uid(uid_param TEXT) 
RETURNS TABLE (
    profile_id integer,
    stream_id TEXT,
    uid TEXT,
    username TEXT,

    verified BOOLEAN,
    metadata_with_translations jsonb,

    is_secondary_stream boolean,
    player_id text,

    img_url jsonb,
    cover_url jsonb,

    location_code TEXT,
    state_code TEXT,
    district_code TEXT,

    language_code TEXT,
    last_updated timestamp,

    notifications_last_opened TIMESTAMP,
    captcha_completed_at TIMESTAMP,
    hcaptcha_response_token TEXT,

    website_url TEXT,
    wikipedia_url TEXT,
    instagram_username TEXT,
    twitter_username TEXT,
    facebook_username TEXT,
    spotify_artist_id TEXT,
    apple_music_artist_id TEXT,

    is_premium boolean,
    is_demo boolean,
    owner_username text,

    tags jsonb[],
    entity_type jsonb[],
    type jsonb,

    blocked_profile_ids jsonb[],
    latest_message jsonb,

    followers_count BIGINT,
    following_count BIGINT,
    follows INTEGER[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
    up.profile_id,
    up.stream_id,
    up.uid,
    up.username,

    up.verified,
    up.metadata_with_translations,

    up.is_secondary_stream,
    up.player_id,

    up.img_url,
    up.cover_url,

    up.location_code,
    up.state_code,
    up.district_code,

    up.language_code,
    up.last_updated,

    up.notifications_last_opened,
    up.captcha_completed_at,
    up.hcaptcha_response_token,

    up.website_url,
    up.wikipedia_url,
    up.instagram_username,
    up.twitter_username,
    up.facebook_username,
    up.spotify_artist_id,
    up.apple_music_artist_id,

    up.is_premium,
    up.is_demo,
    up.owner_username,

    up.tags,
    up.entity_type,
    up.type,

    up.blocked_profile_ids,
    up.latest_message,
        followers.followers_count,
        following.following_count,
        (
            SELECT array_agg(uf.followee_id)
            FROM user_follows uf
            WHERE uf.follower_id = up.profile_id
        ) AS follows
    FROM
        user_profiles up
    INNER JOIN user_follows uf ON up.profile_id = uf.followee_id
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS followers_count
        FROM user_follows uf_inner
        WHERE uf_inner.followee_id = up.profile_id
    ) followers ON true
    LEFT JOIN LATERAL (
        SELECT COUNT(*) AS following_count
        FROM user_follows uf_inner
        WHERE uf_inner.follower_id = up.profile_id
    ) following ON true
    WHERE
        uf.follower_id = (SELECT up_inner.profile_id FROM user_profiles up_inner WHERE up_inner.uid = uid_param);
END;
$$ LANGUAGE plpgsql;

CREATE TABLE zulip_streams (
    stream_id BIGINT PRIMARY KEY,
    name VARCHAR(255),
    description TEXT,
    date_created JSONB,
    first_message_id BIGINT,
    history_public_to_subscribers BOOLEAN,
    invite_only BOOLEAN,
    is_web_public BOOLEAN,
    stream_post_policy INT,
    is_announcement_only BOOLEAN,
    can_remove_subscribers_group BIGINT,
    message_retention_days BIGINT,
    latest_message jsonb,
    rendered_description TEXT,
    stream_weekly_traffic JSONB
);


DROP SEQUENCE IF EXISTS zulip_messages_id_seq;

CREATE SEQUENCE zulip_messages_id_seq;

CREATE TABLE zulip_messages (
    message_id bigint primary key, 
    uid text,
    username TEXT NOT NULL,
    sender_id BIGINT,
    source TEXT,
    content jsonb,
    translated_content jsonb,
    message_url jsonb,
    recipient_id BIGINT,
    timestamp timestamp,
    edit_history jsonb,
    client VARCHAR(100),
    subject VARCHAR(255),
    is_me_message BOOLEAN,
    sender_full_name VARCHAR(255),
    sender_email VARCHAR(255),
    sender_realm_str VARCHAR(255),
    display_recipient VARCHAR(255),
    type VARCHAR(50),
    stream_id BIGINT,
    avatar_url TEXT,
    flags VARCHAR(255),
    content_type VARCHAR(50),
    submessages VARCHAR(50),
    reactions JSONB,
    topic_links JSONB,
    last_edit_timestamp jsonb,
    FOREIGN KEY (uid) REFERENCES user_profiles(uid)
);

CREATE OR REPLACE FUNCTION update_latest_message()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE user_profiles
    SET latest_message = jsonb_build_object(
        'content', NEW.content,
        'timestamp', NEW.timestamp
    )
    WHERE username = NEW.username;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER user_profile_message_insert_trigger
AFTER INSERT ON zulip_messages
FOR EACH ROW
EXECUTE FUNCTION update_latest_message();
