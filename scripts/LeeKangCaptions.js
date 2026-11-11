// Source: https://locket.iamlekhang.com/scripts/js/Locket_Unlocked.js?v=1792946292
// Personal modification: add 32 Vietnamese captions after General. Original author: @leekang.
// ==============================================================================
// Locket Remote Config Rewrite // Pro Suite v3.5 (Ultra HD & Dynamic Captions)
// Endpoint: firebaseremoteconfig.googleapis.com
// Hỗ trợ: Shadowrocket / Loon / Surge / Quantumult X
// Tác giả: @leekang
// Vui lòng khi chia sẻ giữ nguyên nguồn tác giả. Xin chân thành cảm ơn!
// ==============================================================================

var obj = {};
try {
    obj = JSON.parse($response.body);
} catch (e) {
    obj = {};
}

obj.Attention = "Chúc mừng bạn! Vui lòng không sử dụng chúng dưới mục đích thương mại!";
obj.entries = obj.entries || {};

// ==============================================================================
// 1. TÙY CHỈNH NHANH KHÔNG CẦN SỬA CODE ($argument / BoxJS) [TÍNH NĂNG 5]
// ==============================================================================
function parseArgs() {
    var args = {};
    if (typeof $argument !== "undefined" && $argument) {
        if (typeof $argument === "string" && $argument.trim().startsWith("{")) {
            try { return JSON.parse($argument); } catch (e) { }
        }
        if (typeof $argument === "string") {
            $argument.split("&").forEach(function (pair) {
                var parts = pair.split("=");
                var k = parts[0] ? decodeURIComponent(parts[0].trim()) : "";
                var v = parts[1] ? decodeURIComponent(parts[1].trim()) : true;
                if (k) args[k] = v;
            });
        }
    }
    return args;
}

var userArgs = parseArgs();
var customName = userArgs.name || "Lee Kang";
var anniversaryDateStr = userArgs.startDate || "2024-02-14";
var isUltraHD = (userArgs.hd !== "false" && userArgs.hd !== false); // Mặc định bật Ultra HD
// Trỏ vào Locket Caption Studio mở trực tiếp trong SFSafariViewController của app Locket
var STUDIO_URL = "https://firebaseremoteconfig.googleapis.com/locket-studio";
var customTiktok = userArgs.tiktok || STUDIO_URL;
var customInstagram = userArgs.instagram || STUDIO_URL;

// ==============================================================================
// 2. HÀM RÚT GỌN TẠO CAPTION SIÊU TỐC (HELPER FUNCTION) [TÍNH NĂNG 6]
// ==============================================================================
function cap(id, text, colors, textColor, icon, iconType, extra) {
    textColor = textColor || "#FFFFFFE6";
    extra = extra || {};
    var item = {
        overlay_id: "caption:" + id,
        source: "remote",
        caption: {
            background: { colors: colors },
            max_lines: extra.max_lines || 1,
            text: text,
            text_color: textColor,
            type: "static_content"
        }
    };
    if (icon) {
        if (iconType === "sf_symbol" || icon.indexOf(".") !== -1) {
            item.caption.icon = { data: icon, type: "sf_symbol", color: extra.iconColor || textColor };
        } else {
            item.caption.icon = { data: icon, type: "emoji" };
        }
    }
    if (extra.daily_start_hour !== undefined) item.daily_start_hour = extra.daily_start_hour;
    if (extra.daily_end_hour !== undefined) item.daily_end_hour = extra.daily_end_hour;
    if (extra.localized_text) item.caption.localized_text = extra.localized_text;
    return item;
}




// ==============================================================================
// 3. TÍNH TOÁN DỮ LIỆU THỜI GIAN THỰC & ĐẾM NGÀY (DYNAMIC REALTIME) [TÍNH NĂNG 1]
// ==============================================================================
var now = new Date();
var utcTime = now.getTime() + (now.getTimezoneOffset() * 60000);
var vnNow = new Date(utcTime + (3600000 * 7)); // Chuẩn hóa múi giờ Việt Nam (UTC+7)

var currentHour = vnNow.getHours();
var currentYear = vnNow.getFullYear();
var dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
var currentDayName = dayNames[vnNow.getDay()];
var currentDateStr = vnNow.getDate() + "/" + (vnNow.getMonth() + 1);

// 3.1 Đếm số ngày bên nhau
var anniDate = new Date(anniversaryDateStr);
var diffMs = vnNow.getTime() - anniDate.getTime();
var loveDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

// 3.2 Đếm ngược tới Tết Dương Lịch tiếp theo (1/1)
var nextNewYearDate = new Date(currentYear + 1, 0, 1);
var daysToNewYear = Math.max(1, Math.ceil((nextNewYearDate.getTime() - vnNow.getTime()) / (1000 * 60 * 60 * 24)));

// 3.3 Đếm ngược tới Tết Nguyên Đán (Khoảng tháng 1 - 2 âm lịch)
var targetTetDate = (vnNow.getMonth() >= 2) ? new Date(currentYear + 1, 1, 10) : new Date(currentYear, 1, 10);
var daysToTet = Math.max(1, Math.ceil((targetTetDate.getTime() - vnNow.getTime()) / (1000 * 60 * 60 * 24)));

// 3.4 Đếm ngược tới Giáng Sinh (25/12)
var targetNoelDate = (vnNow.getMonth() === 11 && vnNow.getDate() > 25) ? new Date(currentYear + 1, 11, 25) : new Date(currentYear, 11, 25);
var daysToNoel = Math.max(0, Math.ceil((targetNoelDate.getTime() - vnNow.getTime()) / (1000 * 60 * 60 * 24)));

// 3.5 Quẻ bói & Thông điệp vũ trụ ngẫu nhiên
var COSMIC_QUOTES = [
    { text: "Vũ trụ bảo: Hôm nay crush sẽ để ý bạn 👀", colors: ["#FF758C", "#FF7EB3"], icon: "✨" },
    { text: "Quẻ hôm nay: Đại cát đại lợi, ví dày tình đậm 💸", colors: ["#11998E", "#38EF7D"], icon: "💰" },
    { text: "Vũ trụ gửi tín hiệu: Mọi việc sẽ êm xuôi 🌸", colors: ["#A18CD1", "#FBC2EB"], icon: "🔮" },
    { text: "Số may mắn hôm nay: " + (Math.floor(Math.random() * 89) + 10) + " 🍀", colors: ["#00B4DB", "#0083B0"], icon: "🎲" },
    { text: "Hôm nay nên đi uống trà sữa cùng người thương 🧋", colors: ["#F6D365", "#FDA085"], icon: "🧋" },
    { text: "Hôm nay làm gì cũng thuận lợi, tự tin lên nha! 🌟", colors: ["#F5576C", "#F093FB"], icon: "⭐" },
    { text: "Đừng overthinking nữa, bạn đang làm rất tốt 💖", colors: ["#4FACFE", "#00F2FE"], icon: "🫶" },
    { text: "Vũ trụ bảo: Hôm nay sẽ có một bất ngờ ngọt ngào 🎁", colors: ["#FF9A9E", "#FECFEF"], icon: "🎀" },
    { text: "Hôm nay hãy cười nhiều lên, nụ cười của bạn rất đẹp ✨", colors: ["#FA709A", "#FEE140"], icon: "😊" }
];
var randomQuote = COSMIC_QUOTES[Math.floor(Math.random() * COSMIC_QUOTES.length)];

// ==============================================================================
// 4. TỰ ĐỘNG XOAY VÒNG KHUNG WIDGET & LÀM MỚI CACHE [TÍNH NĂNG 4]
// ==============================================================================
var WIDGET_FRAMES = [
    { id: "shinchan", name: "Shin-chan Cưng", url: "https://i.ibb.co/1Yt1Dzzy/Shin-chan-1.png" },
    { id: "kitty", name: "Hello Kitty", url: "https://i.ibb.co/RTm5P1n9/kitty-1.png" },
    { id: "instagram", name: "Instagram Story", url: "https://i.ibb.co/JjLZ3cvD/khung-ins.png" },
    { id: "ig_classic", name: "Classic Polaroid", url: "https://i.ibb.co/vC8b93Ld/ig.png" },
    { id: "haikyuu", name: "Haikyuu!!", url: "https://i.ibb.co/cSMPcY0b/haikyuu.png" },
    { id: "fairy_tail", name: "Fairy Tail", url: "https://i.ibb.co/qYk2YpJk/fairy-tail.png" },
    { id: "tokyo_ghoul", name: "Tokyo Ghoul", url: "https://i.ibb.co/j90RQm2n/tokyo-ghoul.png" },
    { id: "my_hero_academia", name: "My Hero Academia", url: "https://i.ibb.co/rfFhT4SX/my-hero-academia.png" },
    { id: "bleach", name: "Bleach", url: "https://i.ibb.co/wZQQLRS1/bleach.png" },
    { id: "attack_on_titan", name: "Attack on Titan", url: "https://i.ibb.co/p6hYvWV9/attack-on-titan.png" },
    { id: "doraemon", name: "Doraemon", url: "https://i.ibb.co/JWcKWc7W/doraemon.png" },
    { id: "black_clover", name: "Black Clover", url: "https://i.ibb.co/5Ws7hTRN/black-clover.png" },
    { id: "demon_slayer", name: "Demon Slayer", url: "https://i.ibb.co/rKB3DLBj/demon-slayer.png" },
    { id: "jujutsu_kaisen", name: "Jujutsu Kaisen", url: "https://i.ibb.co/XrDbBxDb/jujutsu-kaisen.png" },
    { id: "hunter_x_hunter", name: "Hunter x Hunter", url: "https://i.ibb.co/mCcXWP9C/hunter-x-hunter.png" },
    { id: "conan", name: "Detective Conan", url: "https://i.ibb.co/sdbTYPdv/conan.png" },
    { id: "one_piece", name: "One Piece", url: "https://i.ibb.co/23fz24Rt/one-piece.png" },
    { id: "naruto", name: "Naruto", url: "https://i.ibb.co/d04x5n4H/naruto.png" }
];

var activeFrame = WIDGET_FRAMES[vnNow.getDay() % WIDGET_FRAMES.length];
if (userArgs.frame) {
    if (userArgs.frame.indexOf("http") === 0) {
        activeFrame = { id: "custom_user", name: "Custom Frame", url: userArgs.frame };
    } else {
        var matched = WIDGET_FRAMES.find(function (f) { return f.id === userArgs.frame.toLowerCase(); });
        if (matched) activeFrame = matched;
    }
}
var dynamicFrameUid = "frame_" + vnNow.toISOString().slice(0, 10) + "_" + activeFrame.id;

// ==============================================================================
// 5. CẤU HÌNH GOLD, FEATURE GATES & PAYWALL SUPPRESSION
// ==============================================================================
Object.assign(obj.entries, {
    feature_gates: JSON.stringify({
        app_icon_picker: "enabled",
        camera_roll: "enabled",
        camera_theme: "enabled",
        locket_views: "enabled",
        long_captions: "enabled",
        longer_video: "enabled",
        unlimited_friends: "enabled",
        priority_support: "enabled",
        profile_badge: "enabled",
        remove_ads: "enabled",
        video: "enabled",
        custom_widget_frames: "enabled",
        streak_recovery: "enabled"
    }),
    upsell_features: JSON.stringify({
        app_icon_picker: true,
        camera_roll: true,
        camera_theme: true,
        locket_views: true,
        remove_ads: true,
        custom_widget_frames: true
    }),
    paywall_presentation_config: JSON.stringify({
        uid: "paywall_testflight",
        onboarding: false,
        after_sent_moment: false,
        on_foreground: false,
        interval: 2592000,
        profile_banner: true
    }),
    feature_discovery_popup_config: JSON.stringify({
        tag: "LOCKET GOLD ALL FEATURES",
        tag_gradient: true,
        tag_style: "gold_gradient",
        title: "Lên Locket Gold rồi đó 😎",
        feature_set: [
            {
                title: "Chào mừng " + customName + " gia nhập Locket Gold ✨",
                body: "Một follow của bạn, một niềm vui của mình 💛",
                imageURL: "https://cdn.upanhlaylink.com/i/GSfYXmKd.png"
            }
        ],
        primary_button_title: "Xong rồi nhé!",
        campaign: "locket_gold_welcome_v3",
        start_at: "2020-01-01T00:00:00",
        end_at: "2099-12-31T23:59:59",
        use_local_time_zone: true
    }),
    android_subscribe_gold_button_enabled: "false",
    profile_badge_visible: "true",
    lunar_new_year_app_icon_enabled: "true",
    settings_instagram_url: customInstagram,
    settings_tiktok_url: customTiktok,
    settings_help_center_url: STUDIO_URL,
    settings_safety_center_url: STUDIO_URL,
    settings_help_center_url: STUDIO_URL,
    settings_safety_center_url: STUDIO_URL
});

// ==============================================================================
// 6. CHẶN QUẢNG CÁO & VÔ HIỆU HÓA TRACKING (SENTRY)
// ==============================================================================
Object.assign(obj.entries, {
    history_ads_mode: "off",
    history_ads_prefetch_count: "0",
    history_ads_prefetch_immediate: "false",
    history_ads_prefetch_reroute: "false",
    history_ads_dynamic_insertion: "false",
    history_ads_refresh_prefetch_on_foreground: "false",
    history_ads_floor_price: "0",
    history_ads_floor_price_att: "0",
    history_ad_log_displayed_on_background: "false",
    history_ads_debug_menu: "false",
    sentry_sample_rate: "0",
    sentry_network_tracing: "false",
    sentry_performance_tracking: "false",
    sentry_trace_sample_rate: "0",
    sentry_profiles_sample_rate: "0"
});

// ==============================================================================
// 7. CAMERA, VIDEO & CHẤT LƯỢNG ULTRA HD [TÍNH NĂNG 3]
// ==============================================================================
var videoQualityBitrate = isUltraHD ? 4.0 : 2.5;

Object.assign(obj.entries, {
    camera: JSON.stringify({
        gold_max_duration: 60.0,
        goldMaxDuration: 60.0,
        max_duration: 60.0,
        maxDuration: 60.0,
        ultra_wide: true,
        ultraWide: true,
        volume_button: true,
        volumeButton: true,
        flash_button: true,
        telephoto: true,
        srgb: true,
        lanczos: true,
        quality_mbps: videoQualityBitrate,
        qualityMbps: videoQualityBitrate
    }),
    camera_roll: JSON.stringify({
        gold_max_duration: 60.0,
        goldMaxDuration: 60.0,
        video_max_duration: 60.0,
        videoMaxDuration: 60.0,
        max_duration: 60.0,
        maxDuration: 60.0,
        trim_max_duration: 60.0,
        trimMaxDuration: 60.0,
        camera_roll_max_duration: 60.0,
        quality_mbps: videoQualityBitrate,
        qualityMbps: videoQualityBitrate,
        flash_button: true
    }),
    live_photos: JSON.stringify({
        capture: true,
        video: true,
        viewing: true,
        catch_up: true,
        widget_looping_mode: "never"
    }),
    camera_filter_config: JSON.stringify({
        allows_custom_filters: true,
        show_filter_button: true,
        sheet_enabled: true,
        open_sheet_immediately: true,
        sheet_filters: [
            { title: { en: "Goofy" }, filter_ids: ["okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows"] },
            { title: { en: "Looks" }, filter_ids: ["bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns", "tatted", "mohawk", "braces", "bye_brows"] },
            { title: { en: "Celebrate" }, filter_ids: ["slimed", "princess", "disco_lights", "cash_money", "happy_birthday"] },
            { title: { en: "Cute" }, filter_ids: ["cutesy", "sticker_face", "flower_crown", "love_bug"] },
            { title: { en: "Costumes" }, filter_ids: ["wedding", "cowboy_cowgirl", "giraffe", "clown"] },
            { title: { en: "Holidays" }, filter_ids: ["easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun", "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"] }
        ],
        picker_filters: [
            "okay_wig", "influencer", "looks_maxxing", "toothless", "bye_brows",
            "bowling_ball", "blonde_bleached", "beard", "bob_cut", "buns",
            "tatted", "mohawk", "braces", "slimed", "princess",
            "disco_lights", "cash_money", "happy_birthday", "cutesy", "sticker_face",
            "flower_crown", "love_bug", "wedding", "cowboy_cowgirl", "giraffe",
            "clown", "easter_bunney_cutout", "easter_chick_cutout", "bearded", "leprechaun",
            "lucky_face", "sweet_hearts", "elf_cutout", "santa_cutout", "frosty"
        ]
    }),
    camera_roll_preview_enabled: "true",
    camera_roll_video_enabled: "true",
    camera_roll_video_upload_enabled: "true",
    internal_camera_roll_video_upload_enabled: "true",
    longer_camera_roll_videos_enabled: "true",
    video_sound_enabled: "true",
    microphone_enabled: "true",
    camera_microphone_enabled: "true",
    audio_session_deactivation_enabled: "true",
    zoom_enabled: "true",
    upload_main: "true",
    upload_main_image_quality: isUltraHD ? "0.95" : "0.85",
    upload_main_image_size: isUltraHD ? "2048" : "1440",
    upload_thumbnail_image_quality: "0.85",
    upload_thumbnail_image_size: "1080"
});

// ==============================================================================
// 8. BẠN BÈ & GIỚI HẠN KẾT BẠN
// ==============================================================================
Object.assign(obj.entries, {
    max_friends_count: "999999999",
    friend_limit_mode: "0",
    soft_friend_limit_threshold_count: "999999999",
    show_friend_limit_on_cam: "false",
    signup_max_friends_count: "999999999",
    celebrity_inbox_limit: "999999999",
    celebrity_inbox_enabled: "true",
    celebrity_vip_qr_redemption_enabled: "true",
    friend_limit_geo_override: JSON.stringify({ experiments: {}, area_code_overrides: {} }),
    friends_sheet_locket_count_config: JSON.stringify({ items: [{ threshold: 0, icon_name: "heart" }, { threshold: 1, icon_name: "heart.fill" }, { threshold: 10, emoji: "🤍" }, { threshold: 100, emoji: "💛" }, { threshold: 500, emoji: "❤️🔥" }, { threshold: 1000, emoji: "🌟🫶🌟" }, { threshold: 2000, emoji: "✨💟✨" }, { threshold: 5000, emoji: "⚡️😵💫⚡" }, { threshold: 10000, emoji: "✨⚡️😱⚡✨" }] }),
    friend_locket_count_config: JSON.stringify({ items: [{ threshold: 0, icon_name: "heart" }, { threshold: 1, icon_name: "heart.fill" }, { threshold: 10, emoji: "🤍" }, { threshold: 100, emoji: "💛" }, { threshold: 500, emoji: "❤️🔥" }, { threshold: 1000, emoji: "✨💗✨" }, { threshold: 2000, emoji: "✨️⭐️✨" }, { threshold: 5000, emoji: "✨💎✨" }, { threshold: 10000, emoji: "✨🔐💛✨" }] }),
    new_friends_monitoring_enabled: "true",
    improved_friend_suggestions: "true",
    show_friend_suggestions_by_default: "true",
    emoji_friend_suggestions: "true",
    prompt_contact_permissions_on_search: "true",
    populate_phone_numbers_from_suggest_friends: "true",
    hide_friends_enabled: "true",
    hide_invite_links: "false",
    hide_skip_contacts: "true",
    show_all_contacts: "true",
    show_invite_suggestions: "true",
    show_no_friends_bottom_sheet: "false",
    signup_allow_skip_add_friends: "true",
    signup_custom_profile_picture: "true",
    user_data_export_enabled: "true",
    username_suggestions_enabled: "true"
});

// ==============================================================================
// 9. MOMENTS, STREAK & TƯƠNG TÁC
// ==============================================================================
try {
    var streak = JSON.parse(obj.entries.streak_config || "{}");
    streak.minimum_recovery_count = 0;
    streak.minimum_display_count = 0;
    obj.entries.streak_config = JSON.stringify(streak);
} catch (e) { }

Object.assign(obj.entries, {
    moment_views_enabled: "true",
    moment_views_v2: "true",
    record_moment_views: "true",
    notify_moment_views: "true",
    get_moment_views_as_cloud_function: "true",
    moment_reactions_v2: "true",
    chat_reactions_enabled: "true",
    conversation_reactions: "true",
    typing_indicators_enabled: "true",
    unsend_message_enabled: "true",
    reply_prototype_enabled: "true",
    messages_integration: "true",
    conversations_enabled: "true",
    fetch_moments_in_conversation: "true",
    hide_chat_button: "false",
    groups_enabled: "true",
    group_contact_invites_enabled: "true",
    groups_onboarding_accept_invite_preview_enabled: "true",
    chat_hyperlink_enabled_mode: "always_enabled",
    send_to_self_only_mode: "always_enabled",
    time_travel_rewind_v2_enabled: "true",
    conversation_drafts_enabled: "true",
    calendar_delete_moment_enabled: "true",
    calendar_rewind_enabled: "false",
    locket_yearbook_story_sharing_encouraged: "true",
    rollcall_enabled: "true",
    rollcall_comment_actions: "true",
    rollcall_profile_button: "true",
    rollcall_prompt_export_after_share: "true",
    rollcall_confirm_skip_tagging: "false",
    rollcall_tap_to_tag_enabled: "false"
});

// ==============================================================================
// 10. WIDGET FRAME EVENT & GIAO DIỆN
// ==============================================================================
Object.assign(obj.entries, {
    widget_frame_event_max_images: "5",
    android_widget_frame_event_enabled: "true",
    widget_badge_enabled: "true",
    widget_badge_v2: "true",
    widget_stale_state_enabled: "false",
    widget_last_sent_indicator: "false",
    widget_sync_token_reload_mode: "clearTokenNever",
    widget_frame_event: JSON.stringify({
        uid: dynamicFrameUid,
        url: activeFrame.url,
        use_local_time_zone: true,
        placement: "below",
        start_at: "2020-01-01T00:00:00",
        end_at: "2099-12-31T23:59:59"
    }),
    live_activity_onboarding: "true",
    live_activity_onboarding_variant: "friending",
    register_live_activity_push_to_start_token: "true",
    live_activity_remove_stale_start_token: "true",
    notification_preferences_live_activities: "true",
    notification_preferences: "true",
    notification_reply_body_visible: "true",
    prompt_notification_permissions_after_friending: "true",
    activity_bar_enabled: "true",
    journal_activity_bar_enabled: "true",
    journal_settings: JSON.stringify({
        debug_menu_enabled: false,
        focus_animation: false,
        compact_header: true,
        friends_button: false,
        reverse_scroll_direction: false,
        streak_visualization: true,
        streak_visualization_style: "gradient",
        streak_header_minimum_count: 0,
        streak_visualization_minimum_count: 2,
        overlay_indicators: { location: false, music: true, static_content: true, weather: true }
    }),
    qr_code_config: JSON.stringify({ profile_enabled: true, scanning_enabled: true }),
    custom_profile_pics: "true",
    profile_menu_v2_enabled: "true"
});

// ==============================================================================
// 11. HỆ THỐNG CACHE & STORAGE CDN
// ==============================================================================
Object.assign(obj.entries, {
    cdn_domain_replacements: JSON.stringify({ "firebasestorage.googleapis.com": "cdn.locketcamera.com" }),
    cdn_domain_replacements_video: "true",
    storage_bucket: "gs://locket-img",
    storage_bucket_video: "gs://locket-video",
    image_cache_max_age_sec: "157680000",
    image_cache_max_size: "400000000",
    history_cache_age_days: "1000",
    user_cache_max_age_sec: "691200",
    friends_cache_max_age_sec: "2592000",
    image_fetch_cache: "true",
    image_cache_use_shared: "true",
    use_doc_dir_for_image_cache: "true",
    efficient_history_cache_invalidation: "true",
    timestamp_based_history_fetches: "true",
    get_latest_moment_v2: "true",
    fetch_users_from_cloud_function: "true",
    refresh_interval: "60",
    firestore_refresh_v2: "true",
    firestore_refresh_v3: "true",
    keychain_access_retries: "true",
    blocked_users_cached_sync_enabled: "true",
    beta_features_enabled: "true",
    join_testflight_enabled: "true",
    safety_center: "true",
    help_center: "true",
    support_v2: "true",
    privacy_choices_setting: "true",
    request_att_permission: "true",
    invite_link_preview_variant: "4",
    share_history_config: JSON.stringify({ prompt_enabled: false, fetching_enabled: true }),
    share_history_prompt_enabled: "false",
    use_thumbnails_for_sharing: "true",
    use_thumbnails_in_timeline: "true",
    persist_onboarding_step: "true",
    onboarding_contact_permission_step: "true"
});

// ==============================================================================
// 12. OVERLAY & CAPTIONS: REALTIME DYNAMIC + TOÀN BỘ 11 SECTION GỐC [TÍNH NĂNG 1, 2, 6]
// ==============================================================================
// 12.1 Danh mục Caption Thời Gian Thực (Mới bổ sung theo yêu cầu)
var dynamicSections = [
    {
        section: "🔮 Thời Gian Thực & Thông Điệp Vũ Trụ ✨",
        items: [
            cap("love_days_count", "Bên nhau " + loveDays + " ngày 💕", ["#FF758C", "#FF7EB3", "#FD746C"], "#FFFFFFE6", "heart.fill", "sf_symbol"),
            cap("tet_countdown", "Còn " + daysToTet + " ngày nữa tới Tết 🧧", ["#D31027", "#EA384D", "#FFB199"], "#FFFFFFE6", "🏮"),
            cap("noel_countdown", (daysToNoel === 0 ? "Hôm nay là Giáng Sinh! 🎄" : "Còn " + daysToNoel + " ngày tới Giáng Sinh 🎄"), ["#134E5E", "#71B280"], "#FFFFFFE6", "gift.fill", "sf_symbol"),
            cap("newyear_countdown", "Còn " + daysToNewYear + " ngày sang năm mới 🎆", ["#F37335", "#FDC830"], "#FFFFFFE6", "sparkles", "sf_symbol"),
            cap("cosmic_oracle", randomQuote.text, randomQuote.colors, "#FFFFFFE6", randomQuote.icon),
            cap("today_calendar", "Hôm nay " + currentDayName + " (" + currentDateStr + ") 🗓️", ["#36D1DC", "#5B86E5"], "#FFFFFFE6", "calendar", "sf_symbol"),
            cap("night_owl", "Hội cú đêm thức cùng trăng sao 🦉", ["#0F2027", "#203A43", "#2C5364"], "#FFFFFFE6", "moon.stars.fill", "sf_symbol", { daily_start_hour: 22, daily_end_hour: 4 }),
            cap("morning_sun", "Chào buổi sáng, ngày mới rực rỡ ☀️", ["#F7971E", "#FFD200"], "#633D02", "sun.max.fill", "sf_symbol", { daily_start_hour: 5, daily_end_hour: 9 }),
            cap("lunch_energy", "Ăn trưa nạp năng lượng thôi nào 🍱", ["#FF512F", "#DD2476"], "#FFFFFFE6", "fork.knife", "sf_symbol", { daily_start_hour: 11, daily_end_hour: 13 }),
            cap("after_work", "Tan ca rồi, về nhà nghỉ ngơi thôi 🛵", ["#8E2DE2", "#4A00E0"], "#FFFFFFE6", "figure.walk", "sf_symbol", { daily_start_hour: 17, daily_end_hour: 19 }),
            cap("vip_gold_badge", "Locket Gold VIP • " + customName, ["#F59E0B", "#FBBF24", "#D97706"], "#FFFFFFE6", "crown.fill", "sf_symbol")
        ]
    }
];

// 12.2 Danh mục 11 Section Hiện Tại (GIỮ NGUYÊN VẸN 100%, KHÔNG XÓA MỘT CHỮ NÀO)
var existingSections = [
    {
        section: "🎨 General",
        items: [
            { overlay_id: "caption:standard", source: "local", caption: { type: "standard" } },
            { overlay_id: "caption:link", source: "local", caption: { type: "link" } },
            { overlay_id: "caption:review", source: "local", caption: { type: "review" } },
            { overlay_id: "caption:poll", source: "local", caption: { type: "poll" } },
            { overlay_id: "caption:music", source: "local", caption: { type: "music" } },
            { overlay_id: "caption:location", source: "local", caption: { type: "location" } },
            { overlay_id: "caption:weather", source: "local", caption: { type: "weather" } },
            { overlay_id: "caption:time", source: "local", caption: { type: "time" } },
            { overlay_id: "caption:streak", source: "local", caption: { type: "streak" } },
            { overlay_id: "caption:star_sign", source: "local", caption: { type: "star_sign" } },
            { overlay_id: "caption:color_palette", source: "local", caption: { type: "color_palette" } },
            { overlay_id: "caption:quote", source: "local", caption: { type: "quote" } },
            { overlay_id: "caption:breaking_news", source: "local", caption: { type: "breaking_news" } },
            { overlay_id: "caption:locket_count", source: "local", caption: { type: "locket_count" } },
        ]
    },
    {
        section: "🎨 Holiday Caption",
        items: [
            { overlay_id: "caption:halloween_2026", source: "remote", caption: { background: { colors: ["#150804", "#C8540D"] }, icon: { type: "image", data: "https://storage.googleapis.com/locket-public/journal_calendar_assets/holiday_indicators/halloween_indicator%403x.png", source: "url" }, max_lines: 1, text: "Halloween", localized_text: { en: "Halloween", vn: "Halloween" }, text_color: "#FFB182", type: "static_content" } },
            { overlay_id: "caption:autumn_2026", source: "remote", caption: { background: { colors: ["#FFE0A0", "#F6A53A"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "Xin chào Mùa Thu", localized_text: { en: "Xin chào Mùa Thu", vn: "Xin chào Mùa Thu" }, text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:christmas_eve_2026", source: "remote", caption: { background: { colors: ["#2FA85F", "#176B3A"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" }, text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:christmas_day_2026", source: "remote", caption: { background: { colors: ["#E53935", "#A81818"] }, icon: { data: "🎄", type: "emoji" }, max_lines: 1, text: "Giáng sinh an lành", localized_text: { en: "Giáng sinh an lành", vn: "Giáng sinh an lành" }, text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:new_years_eve_2026", source: "remote", caption: { background: { colors: ["#FFC64B", "#FFEDBF"] }, icon: { data: "🥂", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" }, text_color: "#643F00", type: "static_content" } },
            { overlay_id: "caption:new_years_day_2027", source: "remote", caption: { background: { colors: ["#3B00EC", "#823FFF"] }, icon: { data: "💫", type: "emoji" }, max_lines: 1, text: "Xin chào 2027!", localized_text: { en: "Xin chào 2027!", vn: "Xin chào 2027!" }, text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:new_years_day_2027_alternate", source: "remote", caption: { background: { colors: ["#FF0062", "#FF783F"] }, max_lines: 1, text: "2027", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:no_memory", source: "remote", caption: { background: { image: { type: "image", data: "https://public.locketcamera.com/locket-public/overlays/forgotten_island/forgotten_island_bg.png", source: "url" }, colors: ["#1A1A2E", "#16213E"] }, max_lines: 1, text: "NO MEMORY LEFT BEHIND", text_color: "#FFFFFFE6", type: "static_content" } },
        ]
    },
    {
        section: "🎨 Decorative by Locket",
        items: [
            { overlay_id: "caption:toi_nho_em", source: "remote", caption: { background: { colors: ["#FFFFFF", "#6D9EEB"] }, max_lines: 1, text: "보고 싶어 🥺", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:party_time", source: "remote", caption: { background: { colors: ["#5EFFF5", "#FCFF57"] }, icon: { data: "🪩", type: "emoji" }, max_lines: 1, text: "Party Time!", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:good_morning", source: "remote", daily_start_hour: 5, daily_end_hour: 10, caption: { background: { colors: ["#EF7402", "#EABF0F"] }, icon: { data: "☀️", type: "emoji" }, max_lines: 1, text: "Good morning", text_color: "#FFFFFFE5", type: "static_content" } },
            { overlay_id: "caption:goodnight", source: "remote", daily_start_hour: 19.5, daily_end_hour: 24, caption: { background: { colors: ["#370C6F", "#575CD4"] }, icon: { data: "🌙", type: "emoji" }, max_lines: 1, text: "Goodnight", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:miss_you", source: "remote", caption: { background: { colors: ["#EC0C00", "#FF493F"] }, icon: { data: "🥰", type: "emoji" }, max_lines: 1, text: "Miss you", text_color: "#FFFFFFDB", type: "static_content" } },
            { overlay_id: "caption:ootd", source: "remote", caption: { background: { colors: ["#FFFFFF", "#DBDBDB"] }, icon: { data: "🕶", type: "emoji" }, max_lines: 1, text: "OOTD", text_color: "#101010E6", type: "static_content" } },
        ]
    },
    {
        section: "🎨 Decorative by Lee Kang",
        items: [
            { overlay_id: "caption:Lee Kang", source: "remote", caption: { background: { colors: ["#B8E7FF", "#A8F5D0", "#DCCBFF"] }, icon: { data: "tortoise.fill", type: "sf_symbol", color: "#183153" }, max_lines: 1, text: "Lee Kang", text_color: "#183153", type: "static_content" } },
            { overlay_id: "caption:cu", source: "remote", caption: { background: { colors: ["#FFD6A5", "#FFF1A8", "#FFC4D6"] }, max_lines: 1, text: "Ku 🐃", text_color: "#633B24", type: "static_content" } },
            { overlay_id: "caption:kang", source: "remote", caption: { background: { colors: ["#FFF275", "#FFD93D", "#FFA41B"] }, max_lines: 1, text: "Kang 🐓", text_color: "#4A2E1B", type: "static_content" } },
            { overlay_id: "caption:tuat", source: "remote", caption: { background: { colors: ["#2C1A0E", "#5D4037", "#D7A86E"] }, icon: { data: "🐕", type: "emoji" }, max_lines: 1, text: "Tuất", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:snake_vibes", source: "remote", caption: { background: { colors: ["#2E7D32", "#66BB6A"] }, icon: { data: "🐍", type: "emoji" }, max_lines: 1, text: "Snake Vibes", localized_text: { en: "Snake Vibes", vn: "Chất rắn" }, text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:du_an_ma", source: "remote", caption: { background: { colors: ["#263238", "#455A64"] }, icon: { data: "👻", type: "emoji" }, max_lines: 1, text: "dự án ma", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:love_vietnam", source: "remote", alt_text: "Tôi yêu Việt Nam", caption: { background: { image: { type: "image", data: "star_sign_background", source: "local" }, colors: ["#DA251D", "#DA251D"] }, icon: { type: "image", data: "https://storage.googleapis.com/locket-public/journal_calendar_assets/holiday_indicators/valentines_indicator%403x.png", source: "url" }, max_lines: 1, text: "Tôi yêu Việt Nam", text_color: "#FFFF00", type: "static_content" } },
            { overlay_id: "caption:film_diary", source: "remote", alt_text: "Một ngày rất chill", caption: { background: { image: { type: "image", data: "https://public.locketcamera.com/locket-public/gold_promos/gold_promo_camera_roll.png", source: "url" }, colors: ["#D2B48C", "#8B4513"] }, icon: { type: "image", data: "https://public.locketcamera.com/locket-public/journal_calendar_assets/holiday_indicators/st_patricks_indicator%403x.png", source: "url" }, max_lines: 1, text: "Một ngày rất chill", text_color: "#FFFDD0", type: "static_content" } },
            { overlay_id: "caption:strangers", source: "remote", alt_text: "Người lạ", caption: { background: { image: { type: "image", data: "https://public.locketcamera.com/locket-public/gold_promos/gold_promo_views.png", source: "url" }, colors: ["#1C1C1E", "#2C2C2E"] }, icon: { data: "eye.fill", type: "sf_symbol", color: "#0A84FF" }, max_lines: 1, text: "Người lạ", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:genz_flex", source: "remote", alt_text: "Mood: Chill", caption: { background: { image: { type: "image", data: "https://public.locketcamera.com/locket-public/gold_promos/gold_promo_widgets.png", source: "url" }, colors: ["#FF9A9E", "#FECFEF"] }, icon: { data: "camera.fill", type: "sf_symbol", color: "#FF007F" }, max_lines: 1, text: "Mood: Chill 💅", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:lk_u_qua_35_5", source: "remote", caption: { background: { colors: ["#FF6B6B", "#FFD93D", "#6BCB77"] }, icon: { data: "calendar.badge.clock", type: "sf_symbol", color: "#183153" }, max_lines: 1, text: "Qua 35/5", text_color: "#183153", type: "static_content" } },
        ]
    },
    {
        section: "Food & Drink",
        items: [
            { overlay_id: "caption:food_u_lam_vay_ma", source: "remote", caption: { background: { colors: ["#FF5F6D", "#FFC371"] }, icon: { data: "fork.knife.circle.fill", type: "sf_symbol", color: "#7D2828" }, max_lines: 1, text: "Ăn lắm vậy má", text_color: "#702626", type: "static_content" } },
            { overlay_id: "caption:food_u_nay_an_gi", source: "remote", caption: { background: { colors: ["#F9C74F", "#F9844A"] }, icon: { data: "questionmark.circle.fill", type: "sf_symbol", color: "#713D12" }, max_lines: 1, text: "Nay ăn gì?", text_color: "#60340C", type: "static_content" } },
            { overlay_id: "caption:food_u_nay_uong_gi", source: "remote", caption: { background: { colors: ["#A8E6CF", "#56C596"] }, icon: { data: "cup.and.saucer.fill", type: "sf_symbol", color: "#245B49" }, max_lines: 1, text: "Nay uống gì?", text_color: "#174B39", type: "static_content" } },
            { overlay_id: "caption:food_u_ngon_khong_tuong", source: "remote", caption: { background: { colors: ["#FF758F", "#FFB86C"] }, icon: { data: "star.circle.fill", type: "sf_symbol", color: "#713049" }, max_lines: 1, text: "Ngon không tưởng", text_color: "#65253C", type: "static_content" } },
            { overlay_id: "caption:food_u_do_thay_me", source: "remote", caption: { background: { colors: ["#434343", "#8E9EAB"] }, icon: { data: "hand.thumbsdown.fill", type: "sf_symbol", color: "#FFE0E0" }, max_lines: 1, text: "Dỡ thấy mẹ", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:food_u_umm", source: "remote", caption: { background: { colors: ["#D8B4FE", "#F0ABFC"] }, icon: { data: "ellipsis.bubble.fill", type: "sf_symbol", color: "#713F8C" }, max_lines: 1, text: "Umm", text_color: "#51266C", type: "static_content" } },
            { overlay_id: "caption:food_u_cum_tammm", source: "remote", caption: { background: { colors: ["#FFD6A5", "#FFADAD"] }, icon: { data: "face.smiling.fill", type: "sf_symbol", color: "#914C35" }, max_lines: 1, text: "Cũm tạmmm đuy", text_color: "#703522", type: "static_content" } },
            { overlay_id: "caption:food_u_cum_duoc", source: "remote", caption: { background: { colors: ["#B7E4C7", "#95D5B2"] }, icon: { data: "checkmark.circle.fill", type: "sf_symbol", color: "#2D6A4F" }, max_lines: 1, text: "Cũm được", text_color: "#24553D", type: "static_content" } },
            { overlay_id: "caption:food_u_ngon_theeee", source: "remote", caption: { background: { colors: ["#FF9A8B", "#FF6A88"] }, icon: { data: "heart.fill", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "Ngon théeee", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:food_u_chac_ngon", source: "remote", caption: { background: { colors: ["#B8C0FF", "#C8B6FF"] }, icon: { data: "eye.fill", type: "sf_symbol", color: "#514A85" }, max_lines: 1, text: "Chắc ngon", text_color: "#40376E", type: "static_content" } },
            { overlay_id: "caption:food_u_chao_da_bat", source: "remote", caption: { background: { colors: ["#6A994E", "#A7C957"] }, icon: { data: "leaf.fill", type: "sf_symbol", color: "#243D18" }, max_lines: 1, text: "ăn cháo đá bát", text_color: "#243D18", type: "static_content" } },
            { overlay_id: "caption:food_u_an_k_noi_co", source: "remote", caption: { background: { colors: ["#577590", "#43AA8B"] }, icon: { data: "bubble.left.fill", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "ăn k nói có", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:food_u_an_nang_hoi_cai", source: "remote", caption: { background: { colors: ["#F4A261", "#E9C46A"] }, icon: { data: "arrow.uturn.backward.circle.fill", type: "sf_symbol", color: "#713F12" }, max_lines: 1, text: "ăn năng hối cải", text_color: "#5D350D", type: "static_content" } },
            { overlay_id: "caption:food_u_an_chay_niem_phat", source: "remote", caption: { background: { colors: ["#95D5B2", "#D8F3DC"] }, icon: { data: "hands.sparkles.fill", type: "sf_symbol", color: "#386641" }, max_lines: 1, text: "ăn chay niệm phật", text_color: "#285239", type: "static_content" } }
        ]
    },
    {
        section: "🎨 Tình yêu & Cơm chó 💕",
        items: [
            { overlay_id: "caption:em_nho_anhh", source: "remote", caption: { background: { colors: ["#FF6B81", "#FF8E9E", "#FFB3C6"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "em nhớ anhh", text_color: "#8C1938", type: "static_content" } },
            { overlay_id: "caption:nho_anh_phien", source: "remote", caption: { background: { colors: ["#F0B5CB", "#F6D0DF", "#DCCAF0"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "nhớ anh tới mức hơi phiền", text_color: "#70445A", type: "static_content" } },
            { overlay_id: "caption:i_love_you", source: "remote", caption: { background: { colors: ["#FF8FAB", "#FFC2D1", "#FFE5EC"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "i love you", text_color: "#8A304F", type: "static_content" } },
            { overlay_id: "caption:yeu_cuc_dang", source: "remote", caption: { background: { colors: ["#F2B5C8", "#F8D5D9", "#F6E5D2"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "yêu cục dàng", text_color: "#754454", type: "static_content" } },
            { overlay_id: "caption:yeu_emmm", source: "remote", caption: { background: { colors: ["#F2AFC6", "#F7C9D9", "#E5CFF4"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "Yeu Emmm", text_color: "#70445C", type: "static_content" } },
            { overlay_id: "caption:yeu_anhhh", source: "remote", caption: { background: { colors: ["#B8C9F2", "#D5DDF8", "#E8CFF0"] }, icon: { data: "🫶", type: "emoji" }, max_lines: 1, text: "Yeu Anhhh", text_color: "#414C72", type: "static_content" } },
            { overlay_id: "caption:baby_love", source: "remote", caption: { background: { colors: ["#FFB6C1", "#FF69B4", "#FF1493"] }, icon: { data: "🧸", type: "emoji" }, max_lines: 1, text: "Baby Love 💖", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:muon_duoc_om", source: "remote", caption: { background: { colors: ["#FF9A9E", "#FECFEF"] }, icon: { data: "🫂", type: "emoji" }, max_lines: 1, text: "Muốn được ôm", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:cho_hun_mieng", source: "remote", caption: { background: { colors: ["#F3AFC7", "#F8D0D8", "#F4C9BB"] }, icon: { data: "😘", type: "emoji" }, max_lines: 1, text: "cho hun miếng coi", text_color: "#754252", type: "static_content" } },
            { overlay_id: "caption:me_anh_me_ngu", source: "remote", caption: { background: { colors: ["#C4C8EF", "#DED3F4", "#EBCDE4"] }, icon: { data: "💤", type: "emoji" }, max_lines: 1, text: "mê anh hơn mê ngủ", text_color: "#4F4770", type: "static_content" } },
            { overlay_id: "caption:be_be_can_do", source: "remote", caption: { background: { colors: ["#FF8FAB", "#FFC2D1", "#FFE5EC"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "em bé cần được dỗ", text_color: "#812D4A", type: "static_content" } },
            { overlay_id: "caption:iu_thi_noi", source: "remote", caption: { background: { colors: ["#FFD166", "#FFE8A3", "#FFF3D0"] }, icon: { data: "🤭", type: "emoji" }, max_lines: 1, text: "iu thì nói, đừng có ngại", text_color: "#704510", type: "static_content" } },
            { overlay_id: "caption:iu_hong_thi_bao", source: "remote", caption: { background: { colors: ["#FF6B6B", "#FF9999", "#FFD1C9"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "iu hong thì bảo", text_color: "#812626", type: "static_content" } },
            { overlay_id: "caption:anh_thuong_em", source: "remote", caption: { background: { colors: ["#A0C4FF", "#BDE0FE", "#DFF3FF"] }, icon: { data: "🥹", type: "emoji" }, max_lines: 1, text: "anh có thương em thiệt hong", text_color: "#23466F", type: "static_content" } },
            { overlay_id: "caption:yeu_em_nhiem_vu", source: "remote", caption: { background: { colors: ["#B7E4C7", "#D8F3DC", "#F0FFF1"] }, icon: { data: "🫡", type: "emoji" }, max_lines: 1, text: "yêu em là nhiệm vụ cả đời", text_color: "#24563A", type: "static_content" } },
            { overlay_id: "caption:crush_nhin", source: "remote", caption: { background: { colors: ["#CDB4DB", "#E2CFEA", "#F3E5F5"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "crush nhìn em một cái là xong", text_color: "#593B68", type: "static_content" } },
            { overlay_id: "caption:ngoai_le_cua_em", source: "remote", caption: { background: { colors: ["#80CBC4", "#B2DFDB", "#E0F2F1"] }, icon: { data: "🫶", type: "emoji" }, max_lines: 1, text: "anh là ngoại lệ của em", text_color: "#205953", type: "static_content" } },
            { overlay_id: "caption:dang_ban_tuong_tu", source: "remote", caption: { background: { colors: ["#1A2980", "#26D0CE"] }, icon: { data: "💭", type: "emoji" }, max_lines: 1, text: "Đang bận tương tư", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:mac_bay_tinh_yeu", source: "remote", caption: { background: { colors: ["#EE9CA7", "#FFDDE1"] }, icon: { data: "💘", type: "emoji" }, max_lines: 1, text: "Mắc bẫy tình yêu", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:minh_cuoi_nhau", source: "remote", caption: { background: { colors: ["#F0B8CD", "#F7D4DF", "#E7C9EF"] }, icon: { data: "💍", type: "emoji" }, max_lines: 1, text: "hông ấy mình cưới nhau đi", text_color: "#70465B", type: "static_content" } },
            { overlay_id: "caption:wedding_time", source: "remote", caption: { background: { colors: ["#FFE4E1", "#E73C7E"] }, icon: { data: "💍", type: "emoji" }, max_lines: 1, text: "Wedding Time!", localized_text: { en: "Wedding Time!", vn: "Đám cưới nè!" }, text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:dating_time", source: "remote", caption: { background: { colors: ["#E91E63", "#F44336"] }, icon: { data: "💕", type: "emoji" }, max_lines: 1, text: "Dating Time!", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:tuong_love_hoa_ra_lop", source: "remote", caption: { background: { colors: ["#C9184A", "#FF4D6D", "#FFB3C6"] }, icon: { data: "❤️🩹", type: "emoji" }, max_lines: 1, text: "Tưởng love hoá ra lốp", text_color: "#64152F", type: "static_content" } },
            { overlay_id: "caption:cam_thay_hanh_phuc", source: "remote", caption: { background: { colors: ["#EC407A", "#F8BBD0"] }, icon: { data: "🇻🇳", type: "emoji" }, max_lines: 1, text: "Cảm thấy hạnh phúc", localized_text: { en: "Feeling Happy", vn: "Cảm thấy hạnh phúc" }, text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:cho_anh_chut_thoi", source: "remote", caption: { background: { colors: ["#F4A6B7", "#F6BFA6", "#F8D9A0"] }, icon: { data: "heart.fill", type: "sf_symbol", color: "#E85D75" }, max_lines: 1, text: "Chờ anh chút thôi", text_color: "#593744", type: "static_content" } },
        ]
    },
    {
        section: "🎨 Gen Z & Xéo xắt 💅",
        items: [
            { overlay_id: "caption:feeling_cute", source: "remote", caption: { background: { colors: ["#F8BBD0", "#E91E63"] }, icon: { data: "🌷", type: "emoji" }, max_lines: 1, text: "Feeling Cute", localized_text: { en: "Feeling Cute", vn: "Cảm thấy dthw" }, text_color: "#FFFFFFE5", type: "static_content" } },
            { overlay_id: "caption:cutie_pie", source: "remote", caption: { background: { colors: ["#FFDEE9", "#FFB6C1", "#FF9AA2"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "Cutie Pie 🌸", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:hello_kitty", source: "remote", caption: { background: { colors: ["#FFD1DC", "#FFB7C5", "#FFC0CB"] }, icon: { data: "🌸", type: "emoji" }, max_lines: 1, text: "Hello Kitty 🐱", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:ngoan_xinh_iu", source: "remote", caption: { background: { colors: ["#F3C1D4", "#F8DDE5", "#E8CFF0"] }, icon: { data: "💗", type: "emoji" }, max_lines: 1, text: "ngoan xinh iu của ai đây", text_color: "#71465D", type: "static_content" } },
            { overlay_id: "caption:xinh_dep_tuyet_voi", source: "remote", caption: { background: { colors: ["#FC5C7D", "#6A82FB"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "Xinh đẹp tuyệt vời", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:hom_nay_slay", source: "remote", caption: { background: { colors: ["#C5B5E8", "#DDD0F2", "#F0C9DD"] }, icon: { type: "sf_symbol", data: "sparkles", color: "#514368" }, max_lines: 1, text: "hôm nay cũng slay", text_color: "#514368", type: "static_content" } },
            { overlay_id: "caption:tinh_hoa_hoi_tu", source: "remote", caption: { background: { image: { type: "image", data: "star_sign_background", source: "local" }, colors: ["#FFD700", "#FF8C00"] }, icon: { type: "sf_symbol", data: "wand.and.sparkles", color: "#000000E6" }, max_lines: 1, text: "Tinh hoa hội tụ", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:xinh_gai_an_phim_1", source: "remote", caption: { background: { colors: ["#F77062", "#FE5196"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "Xinh gái ấn phím 1", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:xinh_la_tai_nang", source: "remote", caption: { background: { colors: ["#F0B5CA", "#F5D2DD", "#EAD1F0"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "xinh là một loại tài năng", text_color: "#70435B", type: "static_content" } },
            { overlay_id: "caption:dep_trai_co_gi_sai", source: "remote", caption: { background: { colors: ["#FF5722", "#FFC107"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "Đẹp trai có gì sai", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:dep_khong_ly_do", source: "remote", caption: { background: { colors: ["#E5B7CD", "#F0D0DC", "#DCCCF0"] }, icon: { data: "🪞", type: "emoji" }, max_lines: 1, text: "đẹp không cần lý do", text_color: "#67455C", type: "static_content" } },
            { overlay_id: "caption:cha_nay_tu_luyen_ghe", source: "remote", caption: { background: { colors: ["#FFDEE9", "#B5FFFC", "#FAD0C4", "#FFD1FF"] }, icon: { data: "🪞", type: "emoji" }, max_lines: 1, text: "Cha này tự luyến ghê", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:phu_tinh_khong_phu_ban", source: "remote", caption: { background: { colors: ["#8E2DE2", "#4A00E0"] }, icon: { data: "🕶️", type: "emoji" }, max_lines: 1, text: "Phụ tình không phụ bản", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:main_character", source: "remote", caption: { background: { colors: ["#D6B8E8", "#E8CDEB", "#F3D2D9"] }, icon: { type: "sf_symbol", data: "movieclapper.fill", color: "#5A4366" }, max_lines: 1, text: "main character của cuộc đời mình", text_color: "#5A4366", type: "static_content" } },
            { overlay_id: "caption:vibe_khong_phai_ai", source: "remote", caption: { background: { colors: ["#80D8FF", "#A0F0E0", "#D9FFF5"] }, icon: { data: "🪩", type: "emoji" }, max_lines: 1, text: "vibe này ko phải ai cũng có", text_color: "#174C58", type: "static_content" } },
            { overlay_id: "caption:khi_chat", source: "remote", caption: { background: { colors: ["#FFB36B", "#FFD49B", "#FFF0C2"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "không hoàn hảo nhưng có khí chất", text_color: "#713D20", type: "static_content" } },
            { overlay_id: "caption:sieu_cap_ba_khi", source: "remote", caption: { background: { colors: ["#EC407A", "#F44336"] }, icon: { data: "🐉", type: "emoji" }, max_lines: 1, text: "siêu cấp bá khí", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:ba_khi", source: "remote", caption: { background: { colors: ["#8EACCD", "#B5C8DE", "#D7C7E6"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "bá khí ngang ngược", text_color: "#35475D", type: "static_content" } },
            { overlay_id: "caption:du_ba_khi_chua", source: "remote", caption: { background: { colors: ["#CBB4DE", "#DFCBEA", "#F2E3F7"] }, icon: { data: "👑", type: "emoji" }, max_lines: 1, text: "Đủ bá khí chưa?", text_color: "#4C385C", type: "static_content" } },
            { overlay_id: "caption:oach_xa_lach", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "🥬", type: "emoji" }, max_lines: 1, text: "oách xà lách", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:cung_cung_di", source: "remote", caption: { background: { colors: ["#FF7043", "#FF8A50", "#FFCA70"] }, icon: { data: "🚀", type: "emoji" }, max_lines: 1, text: "Cũng cứng đi", text_color: "#592313", type: "static_content" } },
            { overlay_id: "caption:ra_duong_ne_moi_anh", source: "remote", caption: { background: { colors: ["#BCC5D6", "#D7DEEA", "#EDE8F5"] }, icon: { data: "🕶️", type: "emoji" }, max_lines: 1, text: "Ra đường nể mỗi anh", text_color: "#384358", type: "static_content" } },
            { overlay_id: "caption:nhin_la_biet_uy_tin", source: "remote", caption: { background: { colors: ["#2980B9", "#2C3E50"] }, icon: { data: "👌", type: "emoji" }, max_lines: 1, text: "Nhìn là biết uy tín", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:flex_den_hoi_tho_cuoi", source: "remote", caption: { background: { colors: ["#00BFA5", "#64E8C8", "#C4FFF0"] }, icon: { data: "💎", type: "emoji" }, max_lines: 1, text: "Flex đến hơi thở cuối", text_color: "#064D43", type: "static_content" } },
            { overlay_id: "caption:tui_khong_hon_thua", source: "remote", caption: { background: { colors: ["#8E2430", "#C0394B", "#F08A8E"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "tui không hơn thua, tui hơn hẳn", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:hon_hom_qua", source: "remote", caption: { background: { colors: ["#B9D7D0", "#D6E6D7", "#E8DFC6"] }, icon: { data: "🫶", type: "emoji" }, max_lines: 1, text: "tui không hơn ai, tui hơn hôm qua", text_color: "#3F554E", type: "static_content" } },
            { overlay_id: "caption:khong_phai_gu", source: "remote", caption: { background: { colors: ["#FF6F91", "#FF9A9E", "#FFD1BA"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "không phải gu của tất cả, may quá", text_color: "#70243D", type: "static_content" } },
            { overlay_id: "caption:quan_trong_lam", source: "remote", caption: { background: { colors: ["#7566D9", "#9B8AFB", "#D2C8FF"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "ủa tưởng mình quan trọng lắm?", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:cai_net_ky", source: "remote", caption: { background: { colors: ["#B7D96C", "#D9ED9A", "#F1F7C8"] }, icon: { data: "😒", type: "emoji" }, max_lines: 1, text: "cái nết kỳ ghê", text_color: "#35451B", type: "static_content" } },
            { overlay_id: "caption:ghet_dua_kia_ghe", source: "remote", caption: { background: { colors: ["#52647A", "#7D91A8", "#BBC9D8"] }, icon: { data: "😒", type: "emoji" }, max_lines: 1, text: "ghét đứa kia ghê 😒", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:khong_ghet_khong_ua", source: "remote", caption: { background: { colors: ["#FFAB40", "#FFD180", "#FFF0C2"] }, icon: { data: "😒", type: "emoji" }, max_lines: 1, text: "không ghét, chỉ không ưa", text_color: "#633B12", type: "static_content" } },
            { overlay_id: "caption:toi_song_the_day", source: "remote", caption: { background: { colors: ["#202124", "#525866", "#AAB2C0"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "Tôi sống thế đấy", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:che_manh", source: "remote", caption: { background: { colors: ["#FF4E50", "#F9D423"] }, icon: { data: "👎", type: "emoji" }, max_lines: 1, text: "Chê mạnh", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:chua_du_wow", source: "remote", caption: { background: { colors: ["#FFD1DC", "#FFB7C5", "#FFE4E1"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "Chưa đủ wow", text_color: "#6E4254", type: "static_content" } },
            { overlay_id: "caption:roi_let_luon", source: "remote", caption: { background: { colors: ["#FF9A9E", "#FECFEF", "#FBC2EB", "#A6C1EE"] }, icon: { data: "💅", type: "emoji" }, max_lines: 1, text: "rồi lét luôn", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:roi_gay_luon", source: "remote", caption: { background: { colors: ["#FF6EC7", "#7873F5", "#4ADEDE", "#FFE66D"] }, icon: { data: "🌈", type: "emoji" }, max_lines: 1, text: "rồi gay luôn", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:dang_truc_tiep", source: "remote", caption: { background: { colors: ["#0000001A", "#0000001A"], material_blur: "regular" }, icon: { data: "circle.fill", type: "sf_symbol", color: "#FF3B5C" }, max_lines: 1, text: "ĐANG TRỰC TIẾP", text_color: "#FFFFFF", type: "static_content" } },
            // Cung Hoàng Đạo độc quyền
            { overlay_id: "caption:zod_u_bach_duong", source: "remote", caption: { background: { colors: ["#D62828", "#F77F00"] }, icon: { data: "flame.fill", type: "sf_symbol", color: "#FFE082" }, max_lines: 1, text: "Bạch Dương – Cuồng Phong Phục Địa", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_kim_nguu", source: "remote", caption: { background: { colors: ["#386641", "#6A994E"] }, icon: { data: "leaf.fill", type: "sf_symbol", color: "#F2E8CF" }, max_lines: 1, text: "Kim Ngưu – Mật Nguyện Triền Miên", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_song_tu", source: "remote", caption: { background: { colors: ["#7209B7", "#B8C0FF"] }, icon: { data: "person.2.fill", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "♊ Song Tử – Song Ảnh Đối Giao", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_cu_giai", source: "remote", caption: { background: { colors: ["#14213D", "#4361EE"] }, icon: { data: "moon.stars.fill", type: "sf_symbol", color: "#FFE8A1" }, max_lines: 1, text: "♋ Cự Giải – Uyên Ương Đồng Huyệt", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_su_tu", source: "remote", caption: { background: { colors: ["#F6BD60", "#D97706"] }, icon: { data: "crown.fill", type: "sf_symbol", color: "#5C3200" }, max_lines: 1, text: "♌ Sư Tử – Vương Tọa Kiêu Hùng", text_color: "#4F2D00", type: "static_content" } },
            { overlay_id: "caption:zod_u_xu_nu", source: "remote", caption: { background: { colors: ["#D8F3DC", "#95D5B2"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol", color: "#386641" }, max_lines: 1, text: "♍ Xử Nữ – Ngọc Khẩu Phục Tinh", text_color: "#24553D", type: "static_content" } },
            { overlay_id: "caption:zod_u_thien_binh", source: "remote", caption: { background: { colors: ["#FFC8DD", "#CDB4DB"] }, icon: { data: "scalemass.fill", type: "sf_symbol", color: "#76518D" }, max_lines: 1, text: "♎ Thiên Bình – Song Nguyệt Giao Chi", text_color: "#50375F", type: "static_content" } },
            { overlay_id: "caption:zod_u_bo_cap", source: "remote", caption: { background: { colors: ["#240046", "#7B2CBF"] }, icon: { data: "ant.fill", type: "sf_symbol", color: "#E0AAFF" }, max_lines: 1, text: "♏ Bọ Cạp – Hắc Xà Triền Thân", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_nhan_ma", source: "remote", caption: { background: { colors: ["#1D3557", "#457B9D"] }, icon: { data: "arrow.up.right.circle.fill", type: "sf_symbol", color: "#A8DADC" }, max_lines: 1, text: "♐ Nhân Mã – Truy Phong Lập Thế", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_ma_ket", source: "remote", caption: { background: { colors: ["#343A40", "#6C757D"] }, icon: { data: "mountain.2.fill", type: "sf_symbol", color: "#FFD166" }, max_lines: 1, text: "♑ Ma Kết – Thiên Trụ Khuất Phục", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_bao_binh", source: "remote", caption: { background: { colors: ["#0077B6", "#48CAE4"] }, icon: { data: "water.waves", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "♒ Bảo Bình – Nghịch Thủy Du Long", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:zod_u_song_ngu", source: "remote", caption: { background: { colors: ["#5A189A", "#00B4D8"] }, icon: { data: "fish.fill", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "♓ Song Ngư – Thủy Nguyệt Liên Tâm", text_color: "#FFFFFF", type: "static_content" } },
            // Gen Z & Xéo xắt cập nhật mới
            { overlay_id: "caption:gz_u_quy_khong_bu", source: "remote", caption: { background: { colors: ["#C9ADA7", "#F2E9E4"] }, icon: { data: "diamond.fill", type: "sf_symbol", color: "#704F48" }, max_lines: 1, text: "Quý ko cần bù", text_color: "#573E39", type: "static_content" } },
            { overlay_id: "caption:gz_u_cung_dang_nu", source: "remote", caption: { background: { colors: ["#FFAFCC", "#FFC8DD"] }, icon: { data: "face.smiling.fill", type: "sf_symbol", color: "#A23E67" }, max_lines: 1, text: "cưng đang nú", text_color: "#742C4A", type: "static_content" } },
            { overlay_id: "caption:gz_u_no_tinh_duc", source: "remote", caption: { background: { colors: ["#264653", "#457B9D"] }, icon: { data: "hand.raised.fill", type: "sf_symbol", color: "#A8DADC" }, max_lines: 1, text: "không có ý đồ tình dục", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:gz_u_co_ring", source: "remote", caption: { background: { colors: ["#8338EC", "#FF006E"] }, icon: { data: "bubble.left.and.bubble.right.fill", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "Cờ ring qus mẹ", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:gz_u_be_len_threads", source: "remote", caption: { background: { colors: ["#111111", "#434343"] }, icon: { data: "paperplane.fill", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "t bế lên threats liền nè", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:gz_u_quy_phai", source: "remote", caption: { background: { colors: ["#B08968", "#E6CCB2"] }, icon: { data: "sparkles", type: "sf_symbol", color: "#704214" }, max_lines: 1, text: "quý phái tôn trọng và lịch sự", text_color: "#573D2B", type: "static_content" } },
            { overlay_id: "caption:gz_u_tro_bong", source: "remote", caption: { background: { colors: ["#F72585", "#7209B7", "#4361EE"] }, icon: { data: "sparkles", type: "sf_symbol", color: "#FFE082" }, max_lines: 1, text: "Trổ bóng", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:gz_u_tho_chong", source: "remote", caption: { background: { colors: ["#6D597A", "#B56576"] }, icon: { data: "quote.bubble.fill", type: "sf_symbol", color: "#FFCDB2" }, max_lines: 1, text: "Thơ chồng thiệt chướng", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:gz_u_chai_dim", source: "remote", caption: { background: { colors: ["#343A40", "#495057"] }, icon: { data: "arrow.down.circle.fill", type: "sf_symbol", color: "#FFB4A2" }, max_lines: 1, text: "Chài dìm", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:gz_u_co_no", source: "remote", caption: { background: { colors: ["#E63946", "#FF8FA3"] }, icon: { data: "person.2.fill", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "“Có nó thì hong có tau”", text_color: "#FFFFFF", type: "static_content" } },
        ]
    },
    {
        section: "🎨 Meme & Hài hước 🤡",
        items: [
            { overlay_id: "caption:cuoi_vcl_m_oi", source: "remote", caption: { background: { colors: ["#F7971E", "#FFD200", "#FFEE58"] }, icon: { data: "😂", type: "emoji" }, max_lines: 1, text: "Cười vcl m oi", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:cuoi_xiu", source: "remote", caption: { background: { colors: ["#FFEB3B", "#FF9800"] }, icon: { data: "😎", type: "emoji" }, max_lines: 1, text: "Cười xỉu", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:luon_vui_tuoi", source: "remote", caption: { background: { colors: ["#00F2FE", "#4FACFE"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "Luôn vui tươi", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:nau_xoi", source: "remote", caption: { background: { colors: ["#B8E04A", "#D9F477", "#F5FFB8"] }, icon: { data: "🙀", type: "emoji" }, max_lines: 1, text: "Nấu xói", text_color: "#394713", type: "static_content" } },
            { overlay_id: "caption:con_vien_la_lan", source: "remote", caption: { background: { colors: ["#A8C3A0", "#DCE5D1"] }, icon: { data: "🍂", type: "emoji" }, max_lines: 1, text: "côn viên lá làn", text_color: "#344536", type: "static_content" } },
            { overlay_id: "caption:gian_dang_iu_hong", source: "remote", caption: { background: { colors: ["#A8E6CF", "#D4F1BE", "#FFF1B6"] }, icon: { data: "🪳", type: "emoji" }, max_lines: 1, text: "Gián đáng iu hong", text_color: "#315847", type: "static_content" } },
            { overlay_id: "caption:am_cha_hui", source: "remote", caption: { background: { colors: ["#F1C0D2", "#F5D9E1", "#E7D1F2"] }, icon: { data: "🎀", type: "emoji" }, max_lines: 1, text: "ăm chã húi, bà chã hơm", text_color: "#70475C", type: "static_content" } },
            { overlay_id: "caption:hong_drama", source: "remote", caption: { background: { colors: ["#8A2387", "#E94057", "#F27121"] }, icon: { data: "🍿", type: "emoji" }, max_lines: 1, text: "Hóng drama", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:ke_chuyen_nghe_choi", source: "remote", caption: { background: { colors: ["#8A2387", "#E94057"] }, icon: { data: "🍿", type: "emoji" }, max_lines: 1, text: "Kể chuyện nghe chơi", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:drama_ai_hong", source: "remote", caption: { background: { colors: ["#F0C4A8", "#F3D8B8", "#D8C6E5"] }, icon: { data: "🍿", type: "emoji" }, max_lines: 1, text: "thân ai nấy lo, drama ai nấy hóng", text_color: "#624736", type: "static_content" } },
            { overlay_id: "caption:check_var", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "📺", type: "emoji" }, max_lines: 1, text: "Check VAR liền", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:co_bien_co_bien", source: "remote", caption: { background: { colors: ["#FF512F", "#F09819", "#FFD200"] }, icon: { type: "sf_symbol", data: "light.beacon.max.fill", color: "#FFFFFFE6" }, max_lines: 1, text: "Có biến có biến", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:so_ho_la_bao", source: "remote", caption: { background: { colors: ["#F5B8A9", "#F6D0B2", "#E8BFCB"] }, icon: { data: "🚨", type: "emoji" }, max_lines: 1, text: "sơ hở là báo", text_color: "#713F40", type: "static_content" } },
            { overlay_id: "caption:bot_bao", source: "remote", caption: { background: { colors: ["#7AA6C2", "#B0C9D9", "#DCE8EF"] }, icon: { data: "🚨", type: "emoji" }, max_lines: 1, text: "bớt báo giùm cái", text_color: "#29485D", type: "static_content" } },
            { overlay_id: "caption:ai_so_thi_di_ve", source: "remote", caption: { background: { colors: ["#B71C1C", "#FF5722"] }, icon: { data: "🏃", type: "emoji" }, max_lines: 1, text: "ai sợ thì đi về", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:chay_ngay_di", source: "remote", caption: { background: { colors: ["#D31027", "#EA384D"] }, icon: { data: "🏃💨", type: "emoji" }, max_lines: 1, text: "Chạy ngay đi", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:len_chua_khong_biet_lay_ai", source: "remote", caption: { background: { colors: ["#D7CCC8", "#EFEBE9", "#F5F5F0"] }, icon: { data: "🙏🥺", type: "emoji" }, max_lines: 1, text: "lên chùa không biết lạy ai", text_color: "#5D4037", type: "static_content" } },
            { overlay_id: "caption:dam_nhau_khong", source: "remote", caption: { background: { colors: ["#E53935", "#FF7043"] }, icon: { data: "🥊", type: "emoji" }, max_lines: 1, text: "đấm nhau không", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:hao_han", source: "remote", caption: { background: { colors: ["#292E49", "#8E3B46", "#E09F3E"] }, icon: { data: "🗡️", type: "emoji" }, max_lines: 1, text: "Hảo hán", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:mong_ton_hoa_sen", source: "remote", caption: { background: { colors: ["#D8B4E2", "#F8BBD0"] }, icon: { data: "🪷", type: "emoji" }, max_lines: 1, text: "Mong tôn hoa sen thấy cảnh này", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:con_cai_nit", source: "remote", caption: { background: { colors: ["#D7CCC8", "#8D6E63"] }, icon: { data: "🧶", type: "emoji" }, max_lines: 1, text: "còn cái nịt", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:minh_la_lop", source: "remote", caption: { background: { colors: ["#263238", "#455A64"] }, icon: { data: "🛞", type: "emoji" }, max_lines: 1, text: "Mình là lốp", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:hay_ra_de_qua_a", source: "remote", caption: { background: { colors: ["#FFF59D", "#80DEEA"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "Hay ra dẻ quá à!", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:mac_co_qua_hai_oi", source: "remote", caption: { background: { colors: ["#FFB74D", "#F8BBD0"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Mắc cỡ quá hai ơi", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:than_chua_ma_don", source: "remote", caption: { background: { colors: ["#607D8B", "#37474F"] }, icon: { data: "😔", type: "emoji" }, max_lines: 1, text: "Thân chưa mà dỡn", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:ai_muon", source: "remote", caption: { background: { colors: ["#FF6B35", "#FF9F1C", "#FFE0A3"] }, icon: { data: "🤨", type: "emoji" }, max_lines: 1, text: "ủa rồi ai mượn?", text_color: "#6B2814", type: "static_content" } },
            { overlay_id: "caption:co_ra_dai_khong", source: "remote", caption: { background: { colors: ["#FF4D6D", "#FF8E72", "#FFD6A5"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "có ra dại không", text_color: "#6B1833", type: "static_content" } },
            { overlay_id: "caption:he_dieu_hanh_la", source: "remote", caption: { background: { colors: ["#287271", "#57A99A", "#B5E5D5"] }, icon: { data: "🤨", type: "emoji" }, max_lines: 1, text: "bạn mình nhưng hệ điều hành lạ", text_color: "#153F3D", type: "static_content" } },
            { overlay_id: "caption:ai_cung_khac", source: "remote", caption: { background: { colors: ["#343A40", "#59636E", "#AAB4BE"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "ai rồi cũng khác, riêng bạn thì lạ", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:tuong_tuong", source: "remote", caption: { background: { colors: ["#3977D5", "#78A9F5", "#D0E4FF"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "tưởng gì, hóa ra tưởng tượng", text_color: "#173767", type: "static_content" } },
            { overlay_id: "caption:be_hong_sai", source: "remote", caption: { background: { colors: ["#F4A7C3", "#FFD1DC", "#FFF0F3"] }, icon: { data: "😌", type: "emoji" }, max_lines: 1, text: "bé hông có sai, tại đời sai", text_color: "#802D50", type: "static_content" } },
            { overlay_id: "caption:khong_vua_long", source: "remote", caption: { background: { colors: ["#D5A64B", "#E8C979", "#FFF0BF"] }, icon: { data: "😌", type: "emoji" }, max_lines: 1, text: "sống sao cho vừa lòng thiên hạ? thôi khỏi", text_color: "#594015", type: "static_content" } },
            { overlay_id: "caption:boc_trung_sit_rit", source: "remote", caption: { background: { colors: ["#9C27B0", "#7B1FA2"] }, icon: { data: "🎁", type: "emoji" }, max_lines: 1, text: "Bóc trúng sít rịt", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:hen_lam_moi_xui_duoc_vay_a", source: "remote", caption: { background: { colors: ["#00BCD4", "#0097A7"] }, icon: { data: "😅", type: "emoji" }, max_lines: 1, text: "Hên lắm mới xui được vậy á", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:giam_suc_manh_con_tuong", source: "remote", caption: { background: { colors: ["#4CAF50", "#00BCD4"] }, icon: { data: "🎮", type: "emoji" }, max_lines: 1, text: "Giảm sức mạnh con tướng", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:phu_huynh_dung_xem", source: "remote", caption: { background: { colors: ["#FF0844", "#FFB199"] }, icon: { data: "🙈", type: "emoji" }, max_lines: 1, text: "Phụ huynh đừng xem", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:khong_van_de_gi_luon", source: "remote", caption: { background: { colors: ["#087E8B", "#39B8A5", "#B8F2E6"] }, icon: { data: "👌", type: "emoji" }, max_lines: 1, text: "Không vấn đề gì luôn", text_color: "#103F43", type: "static_content" } },
            { overlay_id: "caption:bung_no", source: "remote", caption: { background: { colors: ["#FF6B6B", "#FF8E53", "#FFD166"] }, icon: { data: "💥", type: "emoji" }, max_lines: 1, text: "Bùng nổ", text_color: "#702B16", type: "static_content" } },
            { overlay_id: "caption:xin_vinh_biet_cu", source: "remote", caption: { background: { colors: ["#232526", "#414345"] }, icon: { data: "🕯️", type: "emoji" }, max_lines: 1, text: "Xin vĩnh biệt cụ", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
    },
    {
        section: "🎨 Bất ổn & Hết cứu 🫠",
        items: [
            { overlay_id: "caption:bat_on_that_su", source: "remote", caption: { background: { colors: ["#636363", "#A2AB58"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "Bất ổn thật sự", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:nay_la_het_cuu", source: "remote", caption: { background: { colors: ["#607D8B", "#455A64"] }, icon: { type: "sf_symbol", data: "bolt.badge.xmark", color: "#FFFFFFE6" }, max_lines: 1, text: "Này là hết cứu", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:het_cuu_thiet", source: "remote", caption: { background: { colors: ["#B8C9E8", "#D5D5F0", "#E9CDE0"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "hết cứu thiệt chứ", text_color: "#454660", type: "static_content" } },
            { overlay_id: "caption:toi_cong_chuyen", source: "remote", caption: { background: { colors: ["#F2B5A7", "#F6D1B5", "#E9C2D5"] }, icon: { data: "💀", type: "emoji" }, max_lines: 1, text: "tới công chuyện nữa rồi", text_color: "#634044", type: "static_content" } },
            { overlay_id: "caption:toang_that_roi", source: "remote", caption: { background: { colors: ["#F44336", "#B71C1C"] }, icon: { data: "🐉", type: "emoji" }, max_lines: 1, text: "Toang thật rồi", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:toi_roi_toi_roi", source: "remote", caption: { background: { colors: ["#F7253E", "#FF6B35", "#FFC857"] }, icon: { data: "❗", type: "emoji" }, max_lines: 1, text: "Tới rồi tới rồi", text_color: "#58151B", type: "static_content" } },
            { overlay_id: "caption:goi_xong_lun", source: "remote", caption: { background: { colors: ["#F3B6AF", "#F6D2C2", "#EAC8D9"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "gòi xong lun á", text_color: "#6A4549", type: "static_content" } },
            { overlay_id: "caption:xiu_ngang", source: "remote", caption: { background: { colors: ["#C0B7E5", "#D8D0F0", "#EACDE2"] }, icon: { data: "💀", type: "emoji" }, max_lines: 1, text: "xĩu ngang xĩu dọc", text_color: "#504567", type: "static_content" } },
            { overlay_id: "caption:guc_nga", source: "remote", caption: { background: { colors: ["#3A1C71", "#D76D77"] }, icon: { data: "📉", type: "emoji" }, max_lines: 1, text: "Gục ngã", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:bat_luc", source: "remote", caption: { background: { colors: ["#2C3E50", "#3498DB"] }, icon: { data: "🏳️", type: "emoji" }, max_lines: 1, text: "Bất lực", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:rot_nuoc_mat", source: "remote", caption: { background: { colors: ["#1CB5E0", "#000046"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Rớt nước mắt", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:tien_dinh", source: "remote", caption: { background: { colors: ["#FF9A8B", "#FF6A88"] }, icon: { data: "🌪️", type: "emoji" }, max_lines: 1, text: "Tiền đình", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:nao_bao_tri", source: "remote", caption: { background: { colors: ["#B8E0D2", "#D8EAD8", "#C9D9F0"] }, icon: { data: "🧠", type: "emoji" }, max_lines: 1, text: "não đang bảo trì", text_color: "#35564F", type: "static_content" } },
            { overlay_id: "caption:overthinking_vai_chuong", source: "remote", caption: { background: { colors: ["#2C3E50", "#4CA1AF"] }, icon: { data: "🤯", type: "emoji" }, max_lines: 1, text: "Overthinking vai chưởng", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:tram_cam_nhe", source: "remote", caption: { background: { colors: ["#1F1C2C", "#928DAB"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "Trầm cảm nhẹ", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:khong_cam_xuc", source: "remote", caption: { background: { colors: ["#434343", "#000000"] }, icon: { data: "🗿", type: "emoji" }, max_lines: 1, text: "Không cảm xúc", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:mieng_cuoi_long_khong", source: "remote", caption: { background: { colors: ["#526A82", "#8CA6B8", "#D5E3E8"] }, icon: { data: "🙂", type: "emoji" }, max_lines: 1, text: "miệng cười nhưng lòng thì không", text_color: "#233746", type: "static_content" } },
            { overlay_id: "caption:hom_nay_toi_buon", source: "remote", caption: { background: { colors: ["#141E30", "#243B55"] }, icon: { data: "🥀", type: "emoji" }, max_lines: 1, text: "hôm nay tôi buồn", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:dem_nay_noi_buon", source: "remote", caption: { background: { colors: ["#283B66", "#526C9E", "#A9C1D9"] }, icon: { data: "🌙", type: "emoji" }, max_lines: 1, text: "đêm nay ai ôm nỗi buồn", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:em_on_ap_luc", source: "remote", caption: { background: { colors: ["#FFB26B", "#FFD08A", "#FFF0B5"] }, icon: { data: "🥲", type: "emoji" }, max_lines: 1, text: "em ổn, ổn áp lực", text_color: "#70401F", type: "static_content" } },
            { overlay_id: "caption:mot_minh", source: "remote", caption: { background: { colors: ["#AEB8D1", "#C7C7DF", "#DED0E0"] }, icon: { data: "🫂", type: "emoji" }, max_lines: 1, text: "thôi thì mình lại một mình", text_color: "#45475F", type: "static_content" } },
            { overlay_id: "caption:nan_nhan", source: "remote", caption: { background: { colors: ["#F3C7D9", "#F6D9D0", "#E5CFF0"] }, icon: { data: "🥹", type: "emoji" }, max_lines: 1, text: "tui là nạn nhân", text_color: "#70495D", type: "static_content" } },
            { overlay_id: "caption:ai_cuu_tui", source: "remote", caption: { background: { colors: ["#F0B6B6", "#F5D0C3", "#E8C6DE"] }, icon: { data: "sos", type: "sf_symbol", color: "#6A4248" }, max_lines: 1, text: "òi ai cứu tui", text_color: "#6A4248", type: "static_content" } },
            { overlay_id: "caption:song_gio_phu_doi_trai", source: "remote", caption: { background: { colors: ["#3A1C71", "#D76D77"] }, icon: { data: "🌪️", type: "emoji" }, max_lines: 1, text: "Sóng gió phủ đời trai", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:thuong_nguoi_khong_thuong", source: "remote", caption: { background: { colors: ["#C8A6C4", "#D9B9D0", "#E7C8D6"] }, icon: { data: "💔", type: "emoji" }, max_lines: 1, text: "thương người không thương mình", text_color: "#5D3F59", type: "static_content" } },
            { overlay_id: "caption:tu_da_tinh", source: "remote", caption: { background: { colors: ["#52658F", "#9A8FBF", "#F2B6B8"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "lại tự mình đa tình", text_color: "#373653", type: "static_content" } },
            { overlay_id: "caption:khong_du_tot", source: "remote", caption: { background: { colors: ["#AFC6D8", "#C8D5E2", "#E0D1DE"] }, icon: { type: "sf_symbol", data: "cloud.sun.rain.fill", color: "#455467" }, max_lines: 1, text: "chắc tại mình không đủ tốt", text_color: "#455467", type: "static_content" } },
            { overlay_id: "caption:hy_vong_that_vong", source: "remote", caption: { background: { colors: ["#8E354A", "#C45D69", "#F0B6A8"] }, icon: { data: "🥀", type: "emoji" }, max_lines: 1, text: "một chút hy vọng, một đống thất vọng", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:het_duyen_het_thuong", source: "remote", caption: { background: { colors: ["#334E68", "#627D98", "#BCCCDC"] }, icon: { data: "💭", type: "emoji" }, max_lines: 1, text: "hết duyên hay hết thương?", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:nguoi_vui_nho", source: "remote", caption: { background: { colors: ["#455A64", "#78909C", "#CFD8DC"] }, icon: { data: "🩶", type: "emoji" }, max_lines: 1, text: "người vui có nhớ người buồn không", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:da_xem_chua_rep", source: "remote", caption: { background: { colors: ["#2979FF", "#64B5F6", "#BBDEFB"] }, icon: { data: "📱", type: "emoji" }, max_lines: 1, text: "đã xem, chưa rep, đã đau", text_color: "#15345C", type: "static_content" } },
            { overlay_id: "caption:dung_im_lang", source: "remote", caption: { background: { colors: ["#FF8FA3", "#FFB3C6", "#FFE0E9"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "đừng im lặng với em mà", text_color: "#812D49", type: "static_content" } },
            { overlay_id: "caption:nho_thi_nho", source: "remote", caption: { background: { colors: ["#E5A642", "#F4CB78", "#FFF0C2"] }, icon: { data: "🙂", type: "emoji" }, max_lines: 1, text: "nhớ thì nhớ, quay lại thì thôi", text_color: "#633F13", type: "static_content" } },
            { overlay_id: "caption:em_hong_doi", source: "remote", caption: { background: { colors: ["#65A30D", "#A3C957", "#E2F0B0"] }, icon: { data: "🥲", type: "emoji" }, max_lines: 1, text: "em hong có dỗi, em chỉ buồn", text_color: "#2F4712", type: "static_content" } },
            { overlay_id: "caption:doi_roi", source: "remote", caption: { background: { colors: ["#FF5F6D", "#FFC371"] }, icon: { data: "😤", type: "emoji" }, max_lines: 1, text: "Dỗi rồi", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:dung_choc_be", source: "remote", caption: { background: { colors: ["#F1BDD0", "#F8DCE5", "#E8D1F2"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "thui mừ đừng có chọc bé", text_color: "#70475D", type: "static_content" } },
            { overlay_id: "caption:dung_lam_be_quao", source: "remote", caption: { background: { colors: ["#FF8A5B", "#FFB36B", "#FFE3A3"] }, icon: { data: "😾", type: "emoji" }, max_lines: 1, text: "đừng có làm bé quạo", text_color: "#71351F", type: "static_content" } },
            { overlay_id: "caption:xin_lui_duoc_chua", source: "remote", caption: { background: { colors: ["#F6D365", "#FDA085"] }, icon: { data: "🥺", type: "emoji" }, max_lines: 1, text: "Xin lũi được chưa", text_color: "#000000", type: "static_content" } },
            { overlay_id: "caption:biet_roi_kho", source: "remote", caption: { background: { colors: ["#FF7A59", "#FFAD73", "#FFE0A3"] }, icon: { data: "🥲", type: "emoji" }, max_lines: 1, text: "bíc gòi khổ lém", text_color: "#71351F", type: "static_content" } },
            { overlay_id: "caption:hong_be_oi", source: "remote", caption: { background: { colors: ["#58C9A5", "#A4E6C8", "#E0F7D9"] }, icon: { data: "🥹", type: "emoji" }, max_lines: 1, text: "hong bé ơi", text_color: "#205844", type: "static_content" } },
            { overlay_id: "caption:khum_biet_nua", source: "remote", caption: { background: { colors: ["#5367C5", "#8F9FE8", "#D5D8FF"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "khum có bíc nữa", text_color: "#29346F", type: "static_content" } },
            { overlay_id: "caption:cai_deo_ma", source: "remote", caption: { background: { colors: ["#FF6B6B", "#FF8E53", "#FFD166"] }, icon: { data: "🤬", type: "emoji" }, max_lines: 1, text: "cái đéo má ??", text_color: "#542323", type: "static_content" } },
            { overlay_id: "caption:cai_gi_vay_troi", source: "remote", caption: { background: { colors: ["#FF512F", "#FF8C42", "#FFD166"] }, icon: { data: "❗", type: "emoji" }, max_lines: 1, text: "Cái gì vậy trời", text_color: "#672016", type: "static_content" } },
            { overlay_id: "caption:khong_the_tin_noi", source: "remote", caption: { background: { colors: ["#3867FF", "#725CFF", "#B9A5FF"] }, icon: { data: "❓", type: "emoji" }, max_lines: 1, text: "Không thể tin nổi", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:vl_m_oi", source: "remote", caption: { background: { colors: ["#20212D", "#51566D", "#A8B4C9"] }, icon: { data: "😳", type: "emoji" }, max_lines: 1, text: "vl m ơi?", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:ua_alo", source: "remote", caption: { background: { colors: ["#FFB347", "#FFD166", "#FFF0A8"] }, icon: { data: "questionmark", type: "sf_symbol", color: "#654018" }, max_lines: 1, text: "Ủa alo", text_color: "#654018", type: "static_content" } },
            { overlay_id: "caption:alo_gi_da", source: "remote", caption: { background: { colors: ["#00A896", "#55CDB5", "#B8F0D8"] }, icon: { data: "😭", type: "emoji" }, max_lines: 1, text: "Ủa alo, gì dạ?", text_color: "#104B45", type: "static_content" } },
            { overlay_id: "caption:ho", source: "remote", caption: { background: { colors: ["#E63946", "#F07167", "#FFB4A2"] }, icon: { data: "🤨", type: "emoji" }, max_lines: 1, text: "hỏ?", text_color: "#681D2A", type: "static_content" } },
            { overlay_id: "caption:lai_phai_lo", source: "remote", caption: { background: { colors: ["#70C1B3", "#B7E4A8", "#F9F7A8"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "lại phải lọ", text_color: "#294B42", type: "static_content" } },
            { overlay_id: "caption:noi_chuyen_met", source: "remote", caption: { background: { colors: ["#6D597A", "#9A789D", "#D5B8D2"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "nói chuyện nghe mắc mệt", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:het_noi_noi", source: "remote", caption: { background: { colors: ["#52734D", "#86A873", "#D5E6A8"] }, icon: { data: "🙄", type: "emoji" }, max_lines: 1, text: "đúng là hết nói nổi", text_color: "#263D27", type: "static_content" } },
            { overlay_id: "caption:chan_bo_may_di", source: "remote", caption: { background: { colors: ["#6A0572", "#AB1745", "#FF7B54"] }, icon: { data: "🙄", type: "emoji" }, max_lines: 1, text: "Chan bố mày đi", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:tuyet_doi_khong_nghe", source: "remote", caption: { background: { colors: ["#FF416C", "#FF4B2B"] }, icon: { data: "🙉", type: "emoji" }, max_lines: 1, text: "Tuyệt đối không nghe", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:khong_thay_khong_nghe", source: "remote", caption: { background: { colors: ["#C4D9CB", "#E5E6D0", "#F3D9C5"] }, icon: { data: "🙈", type: "emoji" }, max_lines: 1, text: "không biết, không thấy, không nghe", text_color: "#425348", type: "static_content" } },
            { overlay_id: "caption:noi_it_lo", source: "remote", caption: { background: { colors: ["#145A64", "#398A8C", "#B8E0D2"] }, icon: { data: "🤫", type: "emoji" }, max_lines: 1, text: "nói ít thôi, lộ hết bây giờ", text_color: "#12383D", type: "static_content" } },
            { overlay_id: "caption:nguoi_im_lang_gap_nguoi_hay_noi", source: "remote", caption: { background: { colors: ["#232526", "#414345", "#6C7A89", "#B0BEC5"] }, icon: { data: "🤐", type: "emoji" }, max_lines: 1, text: "Người im lặng gặp người hay nói", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:noi_het_bi_mat_thi_co_yeu_hong", source: "remote", caption: { background: { colors: ["#D8B4E2", "#EAC7D8", "#C4D7F2"] }, icon: { data: "🤫", type: "emoji" }, max_lines: 1, text: "Nói hết bí mật thì có yêu hong", text_color: "#55415F", type: "static_content" } }
        ]
    },
    {
        section: "🎨 Deadline & Tiền bạc 💸",
        items: [
            { overlay_id: "caption:deadline_ruot", source: "remote", caption: { background: { colors: ["#ED213A", "#93291E"] }, icon: { data: "🔥", type: "emoji" }, max_lines: 1, text: "Deadline dí tụt quần", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:doi_tru_deadline", source: "remote", caption: { background: { colors: ["#F0D1A4", "#F5E2BD", "#D5D9EF"] }, icon: { data: "📚", type: "emoji" }, max_lines: 1, text: "đời cho gì nhận nấy, trừ deadline", text_color: "#5B4A35", type: "static_content" } },
            { overlay_id: "caption:di_lam_vi_dam_me", source: "remote", caption: { background: { colors: ["#FDC830", "#F37335"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "Đi làm vì đam mê", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:ca_o_ran_doc", source: "remote", caption: { background: { colors: ["#0F2027", "#1B5E20", "#66BB6A"] }, icon: { data: "🐍", type: "emoji" }, max_lines: 1, text: "Cả ổ rắn độc", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:nghien_cuu_khoa_hoc", source: "remote", caption: { background: { colors: ["#0F2027", "#2C5364"] }, icon: { data: "☕", type: "emoji" }, max_lines: 1, text: "Cần nạp cafein gấp", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:tien_dau_ma_tieu", source: "remote", caption: { background: { colors: ["#11998E", "#38EF7D"] }, icon: { data: "💸", type: "emoji" }, max_lines: 1, text: "Tiền đâu mà tiêu", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:luc_nao_co_tien_thi_moi_di_a", source: "remote", caption: { background: { colors: ["#0F2027", "#203A43", "#2C5364"] }, icon: { data: "💸", type: "emoji" }, max_lines: 1, text: "Lúc nào có tiền thì mới đi á", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:doc_so_tai_khoan", source: "remote", caption: { background: { colors: ["#1E90FF", "#00D4FF"] }, icon: { data: "💳", type: "emoji" }, max_lines: 1, text: "đọc số tài khoản", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:co_tien_lam_phien_thien_ha", source: "remote", caption: { background: { colors: ["#BFA06A", "#E8D5AD", "#F6EBDD"] }, icon: { data: "💰", type: "emoji" }, max_lines: 1, text: "Có tiền làm phiền thiên hạ", text_color: "#493824", type: "static_content" } },
            { overlay_id: "caption:co_tien_noi_tiep", source: "remote", caption: { background: { colors: ["#075E54", "#16A085", "#B7E4C7"] }, icon: { data: "💸", type: "emoji" }, max_lines: 1, text: "có tiền thì nói chuyện tiếp", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:doc_lap_tai_chinh", source: "remote", caption: { background: { colors: ["#B8C8B3", "#D9DFC5", "#EAD9B7"] }, icon: { data: "💰", type: "emoji" }, max_lines: 1, text: "độc lập tài chính, độc thân tình cảm", text_color: "#405340", type: "static_content" } },
            { overlay_id: "caption:cu_tu_tu_khoai_se_nhu", source: "remote", caption: { background: { colors: ["#56AB2F", "#A8E063"] }, icon: { data: "🥔", type: "emoji" }, max_lines: 1, text: "Cứ từ từ khoai sẽ nhừ", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:kiem_tra_nhan_pham", source: "remote", caption: { background: { colors: ["#654EA3", "#EAAFC8"] }, icon: { data: "🎲", type: "emoji" }, max_lines: 1, text: "Kiểm tra nhân phẩm", text_color: "#FFFFFFE6", type: "static_content" } }
        ]
    },
    {
        section: "🎨 Daily & Đời sống ☕",
        items: [
            { overlay_id: "caption:ngay_moi_vui_ve", source: "remote", caption: { background: { colors: ["#FFB703", "#FFD166", "#FFF0A8"] }, icon: { data: "☀️", type: "emoji" }, max_lines: 1, text: "Ngày mới vui vẻ", text_color: "#69420A", type: "static_content" } },
            { overlay_id: "caption:coffee_time", source: "remote", caption: { background: { colors: ["#4E342E", "#8D6E63"] }, icon: { data: "☕", type: "emoji" }, max_lines: 1, text: "Coffee Time!", localized_text: { en: "Coffee Time!", vn: "Giờ uống cà phê!" }, text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:matcha_latte", source: "remote", caption: { background: { colors: ["#C8E6C9", "#A5D6A7", "#81C784"] }, icon: { data: "🍃", type: "emoji" }, max_lines: 1, text: "Matcha Latte 🍵", text_color: "#1B5E20E6", type: "static_content" } },
            { overlay_id: "caption:mixue_time", source: "remote", caption: { background: { colors: ["#FFF9C4", "#F8BBD0"] }, icon: { data: "🍦", type: "emoji" }, max_lines: 1, text: "Mixue Time!", localized_text: { en: "Mixue Time!", vn: "Giờ Mixue!" }, text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:tien_mua_tra_sua", source: "remote", caption: { background: { colors: ["#D7B77D", "#EAD6AA", "#F5E7CC"] }, icon: { data: "🧋", type: "emoji" }, max_lines: 1, text: "tiền không mua được tất cả, nhưng mua được trà sữa", text_color: "#5D472B", type: "static_content" } },
            { overlay_id: "caption:an_com_chua", source: "remote", caption: { background: { colors: ["#FF9800", "#F57C00"] }, icon: { data: "🍽️", type: "emoji" }, max_lines: 1, text: "Ăn cơm chưa?", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:dinner_time", source: "remote", caption: { background: { colors: ["#FFCCBC", "#FF8A80"] }, icon: { data: "🍽️", type: "emoji" }, max_lines: 1, text: "Dinner Time!", localized_text: { en: "Dinner Time!", vn: "Giờ ăn tối!" }, text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:di_choi_khong", source: "remote", caption: { background: { colors: ["#E91E63", "#C2185B"] }, icon: { data: "✈️", type: "emoji" }, max_lines: 1, text: "Đi chơi không?", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:tuyet_voi_uong_nao", source: "remote", caption: { background: { colors: ["#F0C58E", "#F5D9A9", "#EBC6B8"] }, icon: { data: "🥂", type: "emoji" }, max_lines: 1, text: "tuyệt vời, uống nào!", text_color: "#65462D", type: "static_content" } },
            { overlay_id: "caption:shopping_time", source: "remote", caption: { background: { colors: ["#B3E5FC", "#FFFFFF"] }, icon: { data: "🛍️", type: "emoji" }, max_lines: 1, text: "Shopping Time!", localized_text: { en: "Shopping Time!", vn: "Giờ mua sắm!" }, text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:cinema_time", source: "remote", caption: { background: { colors: ["#1A237E", "#455A64"] }, icon: { data: "🎬", type: "emoji" }, max_lines: 1, text: "Cinema Time!", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:tuyet_doi_dien_anh", source: "remote", caption: { background: { colors: ["#455A64", "#263238"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Tuyệt đối điện ảnh", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:qua_la_dien_anh", source: "remote", caption: { background: { colors: ["#26A69A", "#00897B"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Quá là điện ảnh", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:locket_time", source: "remote", caption: { background: { colors: ["#ECEFF1", "#B3E5FC"] }, icon: { data: "📷", type: "emoji" }, max_lines: 1, text: "Locket Time!", text_color: "#000000E6", type: "static_content" } },
            { overlay_id: "caption:chilling_time", source: "remote", caption: { background: { colors: ["#E1BEE7", "#F8BBD0"] }, icon: { data: "🌴", type: "emoji" }, max_lines: 1, text: "Chilling Time!", localized_text: { en: "Chilling Time!", vn: "Giờ thư giãn!" }, text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:graduation_day", source: "remote", caption: { background: { colors: ["#1A237E", "#283593"] }, icon: { data: "🎓", type: "emoji" }, max_lines: 1, text: "Happy Graduation Day!", localized_text: { en: "Happy Graduation Day!", vn: "Chúc mừng tốt nghiệp!" }, text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:bien_oiiii", source: "remote", caption: { background: { colors: ["#56CFE1", "#72EFDD", "#B8F3FF"] }, icon: { data: "🌊", type: "emoji" }, max_lines: 1, text: "Biển ơiiii", text_color: "#124559", type: "static_content" } },
            { overlay_id: "caption:hoi_chieu_troi_mua", source: "remote", caption: { background: { image: { type: "image", data: "cloud_cover", source: "local" }, colors: ["#546E7A", "#263238"] }, icon: { data: "🌧️", type: "emoji" }, max_lines: 1, text: "Hồi chiều trời mưa...", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:rainy_day", source: "remote", caption: { background: { image: { type: "image", data: "cloud_cover", source: "local" }, colors: ["#6D4C41", "#8D6E63", "#BCAAA4"] }, icon: { data: "☕", type: "emoji" }, max_lines: 1, text: "Rainy Day ☕🌧️", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:cam_lanh", source: "remote", caption: { background: { colors: ["#2193B0", "#6DD5ED"] }, icon: { data: "🤧", type: "emoji" }, max_lines: 1, text: "Cảm lạnh", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:bau_troi_da_ly_huong", source: "remote", caption: { background: { colors: ["#B8A1D9", "#D8C6E8", "#A9B8E8"] }, icon: { type: "sf_symbol", data: "cloud.moon.fill", color: "#FFFFFF" }, max_lines: 1, text: "nhìn bầu trời màu dạ lý hương", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:night_vibes", source: "remote", caption: { background: { colors: ["#B993D6", "#8CA6DB", "#C9B1FF"] }, icon: { data: "🪐", type: "emoji" }, max_lines: 1, text: "Night Vibes 🌌", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:2am_thoughts", source: "remote", daily_start_hour: 1, daily_end_hour: 3, caption: { background: { colors: ["#0F2027", "#203A43", "#2C5364"] }, icon: { type: "sf_symbol", data: "cloud.bolt.fill", color: "#FFFFFFE6" }, max_lines: 1, text: "2:00 AM Thoughts 🌙", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:ngu_ngon", source: "remote", caption: { background: { colors: ["#3F51B5", "#1A237E"] }, icon: { type: "sf_symbol", data: "moon.zzz.fill", color: "#FFFFFFE6" }, max_lines: 1, text: "Ngủ ngon", text_color: "#FFFFFFE6", type: "static_content" } },
            { overlay_id: "caption:sweet_dream", source: "remote", caption: { background: { colors: ["#A1C4FD", "#C2E9FB", "#E0F7FA"] }, icon: { data: "☁️", type: "emoji" }, max_lines: 1, text: "Sweet Dream 🧊", text_color: "#1A237EE6", type: "static_content" } },
            { overlay_id: "caption:nhiem_vu_di_ngu", source: "remote", caption: { background: { colors: ["#172554", "#334EAC", "#91A7FF"] }, icon: { data: "🫡", type: "emoji" }, max_lines: 1, text: "nhiệm vụ hệ thống: đi ngủ", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:da_den_luc_tat_nguon", source: "remote", caption: { background: { colors: ["#283593", "#5C6BC0", "#B3C5FF"] }, icon: { data: "😴", type: "emoji" }, max_lines: 1, text: "đã đến lúc tắt nguồn", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:nao_nghi_lam_tay_van_online", source: "remote", caption: { background: { colors: ["#FF6B35", "#FF9F1C", "#FFE0A3"] }, icon: { data: "🤡", type: "emoji" }, max_lines: 1, text: "não nghỉ làm, tay vẫn online", text_color: "#672812", type: "static_content" } },
            { overlay_id: "caption:buon_ngu_chua_chiu_ngu", source: "remote", caption: { background: { colors: ["#7B2CBF", "#B185DB", "#E0C3FC"] }, icon: { data: "🫠", type: "emoji" }, max_lines: 1, text: "buồn ngủ nhưng chưa chịu ngủ", text_color: "#39204F", type: "static_content" } },
            { overlay_id: "caption:pin_nguoi_dung_con_1", source: "remote", caption: { background: { colors: ["#D62828", "#F77F00", "#FCBF49"] }, icon: { data: "🚨", type: "emoji" }, max_lines: 1, text: "cảnh báo: pin người dùng còn 1%", text_color: "#651515", type: "static_content" } },
            { overlay_id: "caption:nhiem_vu_hom_nay_nam_im", source: "remote", caption: { background: { colors: ["#168AAD", "#52B69A", "#D9ED92"] }, icon: { data: "🛌", type: "emoji" }, max_lines: 1, text: "nhiệm vụ hôm nay: nằm im", text_color: "#17483F", type: "static_content" } },
            { overlay_id: "caption:mai_tinh_nay_ngu", source: "remote", caption: { background: { colors: ["#343A40", "#6C757D", "#ADB5BD"] }, icon: { data: "💀", type: "emoji" }, max_lines: 1, text: "mai tính, nay ngủ", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:offline_de_hoi_sinh", source: "remote", caption: { background: { colors: ["#006D77", "#83C5BE", "#EDF6F9"] }, icon: { data: "💤", type: "emoji" }, max_lines: 1, text: "offline để hồi sinh", text_color: "#164E52", type: "static_content" } },
        ]
    },
    {
        section: "🎨 Chứng nhận của Locket",
        items: [
            { overlay_id: "caption:locket_cuti", source: "remote", caption: { background: { colors: ["#35B5E8", "#19A1D8"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Locket xác nhận bạn cutii", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:locket_xinh", source: "remote", caption: { background: { colors: ["#FFD45C", "#F5B91E"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Locket xác nhận bạn xjnh gái", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:locket_dep", source: "remote", caption: { background: { colors: ["#258DEB", "#1672D4"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Locket xác nhận bạn đẹp chai", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:locket_dangiu", source: "remote", caption: { background: { colors: ["#FF638B", "#F44772"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Locket xác nhận bạn dangiu", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:gai_dep", source: "remote", caption: { background: { colors: ["#FF91AE", "#F8759B"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Đã xác minh bạn là gái đẹp", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:trai_dep", source: "remote", caption: { background: { colors: ["#4A9FEF", "#267DD7"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Đã xác minh bạn là trai đẹp", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:be_ngoan", source: "remote", caption: { background: { colors: ["#E9B9C5", "#D9A4B3"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Đã xác nhận bạn là bé ngoan", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:tuyen_duong", source: "remote", caption: { background: { colors: ["#D94A77", "#B82D59"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol" }, max_lines: 1, text: "Locket tuyên dương bạn cute", text_color: "#FFFFFF", type: "static_content" } },
        ]
    },
];

// ==============================================================================
// 12.3 DANH MỤC CAPTION SIÊU TỐC TẠO BẰNG HÀM cap() [TÍNH NĂNG 6 NÂNG CẤP MỚI]
// ==============================================================================
var superSpeedSections = [
    {
        section: "⚡ Caption Độc Quyền",
        items: [
            cap("ca_phe", "Đi cà phê không? ☕", ["#4E342E", "#8D6E63"], "#FFFFFF", "cup.and.saucer.fill", "sf_symbol"),
            cap("tra_sua", "Cần một ly trà sữa full topping 🧋", ["#F6D365", "#FDA085"], "#61380B", "🧋"),
            cap("chua_lanh", "Đang trong chế độ chữa lành 🌿", ["#11998E", "#38EF7D"], "#FFFFFF", "leaf.fill", "sf_symbol"),
            cap("overthinking", "Overthinking level max 🧠💥", ["#8E2DE2", "#4A00E0"], "#FFFFFF", "brain.head.profile", "sf_symbol"),
            cap("deadline_di_em", "Deadline dí chạy không kịp thở 🏃♂️💨", ["#FF416C", "#FF4B2B"], "#FFFFFF", "flame.fill", "sf_symbol"),
            cap("chill_het_nac", "Chill hết nấc cùng bạn thân 🥂", ["#3A1C71", "#D76D77", "#FFAF7B"], "#FFFFFF", "wineglass.fill", "sf_symbol"),
            cap("flex_nhe", "Flex nhẹ sự dễ thương hôm nay ✨", ["#FA709A", "#FEE140"], "#FFFFFF", "sparkles", "sf_symbol"),
            cap("bat_on_vl", "Ổn, nhưng là bất ổn 🫠", ["#434343", "#000000"], "#FFFFFF", "face.dashed", "sf_symbol"),
            cap("san_sale", "Ví tiền kêu cứu, săn sale miệt mài 🛒", ["#F09819", "#EDDE5D"], "#61380B", "cart.fill", "sf_symbol")
        ]
    },
    {
        section: "🪩 Side Quest · Gen Z Caption Lab",
        items: [
            { overlay_id: "caption:sq_private_mode", source: "remote", caption: { background: { colors: ["#202A44", "#3A506B"] }, icon: { data: "safari.fill", type: "sf_symbol", color: "#A8E6CF" }, max_lines: 1, text: "Tâm trí bật chế độ riêng tư", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_lore_personal", source: "remote", caption: { background: { colors: ["#E1DDFE", "#C8D5FF"] }, icon: { data: "books.vertical.fill", type: "sf_symbol", color: "#6857A8" }, max_lines: 1, text: "Bận viết lore cá nhân", text_color: "#3B3159", type: "static_content" } },
            { overlay_id: "caption:sq_beta_nett", source: "remote", caption: { background: { colors: ["#F6BD60", "#F7EDE2"] }, icon: { data: "puzzlepiece.fill", type: "sf_symbol", color: "#824A12" }, max_lines: 1, text: "Cái nết đang ở bản beta", text_color: "#522900", type: "static_content" } },
            { overlay_id: "caption:sq_selective_budget", source: "remote", caption: { background: { colors: ["#A8E6CF", "#DCEDC1"] }, icon: { data: "creditcard.fill", type: "sf_symbol", color: "#28624B" }, max_lines: 1, text: "Gu tiêu tiền có chọn lọc", text_color: "#174C39", type: "static_content" } },
            { overlay_id: "caption:sq_no_early", source: "remote", caption: { background: { colors: ["#2B2D42", "#8D99AE"] }, icon: { data: "clock.arrow.circlepath", type: "sf_symbol", color: "#D6E1FF" }, max_lines: 1, text: "Trừ dậy sớm, gì cũng được", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_profile_speaks", source: "remote", caption: { background: { colors: ["#FAD2E1", "#F4ACB7"] }, icon: { data: "person.crop.square", type: "sf_symbol", color: "#B23762" }, max_lines: 1, text: "Để profile tự lên tiếng", text_color: "#6A1D3F", type: "static_content" } },
            { overlay_id: "caption:sq_strategic_laugh", source: "remote", caption: { background: { colors: ["#5F0F40", "#9A031E"] }, icon: { data: "theatermasks.fill", type: "sf_symbol", color: "#FFE082" }, max_lines: 1, text: "Cười có chiến thuật", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_ngoan_vo_tri", source: "remote", caption: { background: { colors: ["#BDE0FE", "#A2D2FF"] }, icon: { data: "ellipsis.bubble.fill", type: "sf_symbol", color: "#366A9A" }, max_lines: 1, text: "Hôm nay xin làm người vô tri", text_color: "#16324F", type: "static_content" } },
            { overlay_id: "caption:sq_own_brain", source: "remote", caption: { background: { colors: ["#FFF3B0", "#FFD166"] }, icon: { data: "lightbulb.max.fill", type: "sf_symbol", color: "#A36C00" }, max_lines: 1, text: "Đầu óc có gu riêng", text_color: "#5A3A00", type: "static_content" } },
            { overlay_id: "caption:sq_select_notif", source: "remote", caption: { background: { colors: ["#005F73", "#0A9396"] }, icon: { data: "tag.fill", type: "sf_symbol", color: "#8CE3D0" }, max_lines: 1, text: "Chỉ bật thông báo cho người thú vị", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_licensed_nhay", source: "remote", caption: { background: { colors: ["#FF7F51", "#FFB26B"] }, icon: { data: "ticket.fill", type: "sf_symbol", color: "#542713" }, max_lines: 1, text: "Độ nhây có giấy phép", text_color: "#4A2110", type: "static_content" } },
            { overlay_id: "caption:sq_filter_duyen", source: "remote", caption: { background: { colors: ["#7B2CBF", "#C77DFF"] }, icon: { data: "person.2.fill", type: "sf_symbol", color: "#FBE5FF" }, max_lines: 1, text: "Bật bộ lọc nhân duyên", text_color: "#30104C", type: "static_content" } },
            { overlay_id: "caption:sq_exchange_gu", source: "remote", caption: { background: { colors: ["#C9ADA7", "#F2E9E4"] }, icon: { data: "chart.bar.fill", type: "sf_symbol", color: "#795548" }, max_lines: 1, text: "Gu đổi theo tỷ giá", text_color: "#4A3524", type: "static_content" } },
            { overlay_id: "caption:sq_plot_maker", source: "remote", caption: { background: { colors: ["#0B3954", "#087E8B"] }, icon: { data: "paperplane.fill", type: "sf_symbol", color: "#B4F0FF" }, max_lines: 1, text: "Tay trái chuyên tạo plot twist", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_surprise_mode", source: "remote", caption: { background: { colors: ["#1B4332", "#40916C"] }, icon: { data: "gamecontroller.fill", type: "sf_symbol", color: "#B9FBC0" }, max_lines: 1, text: "Chơi hệ bất ngờ, khỏi báo trước", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_imagination_kpi", source: "remote", caption: { background: { colors: ["#F4ACB7", "#E5989B"] }, icon: { data: "brain", type: "sf_symbol", color: "#702C48" }, max_lines: 1, text: "Trí tưởng tượng có KPI", text_color: "#5C2239", type: "static_content" } },
            { overlay_id: "caption:sq_distance_nhat", source: "remote", caption: { background: { colors: ["#E9C46A", "#F4A261"] }, icon: { data: "ruler.fill", type: "sf_symbol", color: "#6C4A10" }, max_lines: 1, text: "Xin giữ khoảng cách với sự nhạt", text_color: "#5A3D0C", type: "static_content" } },
            { overlay_id: "caption:sq_emotion_reply", source: "remote", caption: { background: { colors: ["#CDB4DB", "#FFC8DD"] }, icon: { data: "bubble.left.and.bubble.right.fill", type: "sf_symbol", color: "#76518D" }, max_lines: 1, text: "Phản hồi cảm xúc tùy người", text_color: "#4B345E", type: "static_content" } },
            { overlay_id: "caption:sq_me_first", source: "remote", caption: { background: { colors: ["#343A40", "#495057"] }, icon: { data: "list.bullet.clipboard.fill", type: "sf_symbol", color: "#CED4DA" }, max_lines: 1, text: "Ưu tiên việc của tui trước", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_quiet_personality", source: "remote", caption: { background: { colors: ["#48CAE4", "#90E0EF"] }, icon: { data: "ear.slash.fill", type: "sf_symbol", color: "#073B4C" }, max_lines: 1, text: "Né ồn ào, giữ cá tính", text_color: "#083344", type: "static_content" } },
            { overlay_id: "caption:sq_contract_cute", source: "remote", caption: { background: { colors: ["#CAD2C5", "#E0E5D5"] }, icon: { data: "doc.text.fill", type: "sf_symbol", color: "#4D6352" }, max_lines: 1, text: "Dễ thương không nằm trong hợp đồng", text_color: "#34483A", type: "static_content" } },
            { overlay_id: "caption:sq_new_version", source: "remote", caption: { background: { colors: ["#BC6C25", "#DDA15E"] }, icon: { data: "arrow.triangle.2.circlepath", type: "sf_symbol", color: "#FFE8C2" }, max_lines: 1, text: "Mỗi ngày một phiên bản khó chiều", text_color: "#43210A", type: "static_content" } },
            { overlay_id: "caption:sq_ignore_algo", source: "remote", caption: { background: { colors: ["#4B4E6D", "#747CA5"] }, icon: { data: "slider.horizontal.3", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "Nay mặc kệ thuật toán", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_less_explain", source: "remote", caption: { background: { colors: ["#5A189A", "#9D4EDD"] }, icon: { data: "dial.low.fill", type: "sf_symbol", color: "#FFD166" }, max_lines: 1, text: "Tăng độ khó, giảm giải thích", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_ken_song", source: "remote", caption: { background: { colors: ["#2A9D8F", "#A8DADC"] }, icon: { data: "antenna.radiowaves.left.and.right", type: "sf_symbol", color: "#174F4A" }, max_lines: 1, text: "Có gu nên hơi kén sóng", text_color: "#083C3A", type: "static_content" } },
            { overlay_id: "caption:sq_not_mass", source: "remote", caption: { background: { colors: ["#FFE8D6", "#FFD7BA"] }, icon: { data: "square.grid.2x2.fill", type: "sf_symbol", color: "#7E4A20" }, max_lines: 1, text: "Đơn giản nhưng không đại trà", text_color: "#6B3F2A", type: "static_content" } },
            { overlay_id: "caption:sq_write_rules", source: "remote", caption: { background: { colors: ["#3C096C", "#7B2CBF"] }, icon: { data: "person.3.fill", type: "sf_symbol", color: "#F3E8FF" }, max_lines: 1, text: "Tui tự viết luật chơi", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_outside_majority", source: "remote", caption: { background: { colors: ["#293241", "#3D5A80"] }, icon: { data: "shuffle", type: "sf_symbol", color: "#D0DEFF" }, max_lines: 1, text: "Không thuộc số đông, cảm ơn", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:sq_adapt", source: "remote", caption: { background: { colors: ["#006D77", "#83C5BE"] }, icon: { data: "paintpalette.fill", type: "sf_symbol", color: "#D8FFF2" }, max_lines: 1, text: "Ứng biến là môn sở trường", text_color: "#073B3A", type: "static_content" } },
            { overlay_id: "caption:sq_no_regret", source: "remote", caption: { background: { colors: ["#E76F51", "#F4A261"] }, icon: { data: "bookmark.fill", type: "sf_symbol", color: "#7A271A" }, max_lines: 1, text: "Đã chọn thì khỏi lăn tăn", text_color: "#5A1A10", type: "static_content" } }
        ]
    },
    {
        section: "🧩 Caption Drop · Bản Ngẫu Hứng 03",
        items: [
            { overlay_id: "caption:drop03_lag_face", source: "remote", caption: { background: { colors: ["#243B55", "#141E30"] }, icon: { data: "waveform.path", type: "sf_symbol", color: "#9DECF9" }, max_lines: 1, text: "Tỉnh táo nhưng đời hơi lag", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_energy_saver", source: "remote", caption: { background: { colors: ["#D8F3DC", "#95D5B2"] }, icon: { data: "leaf.fill", type: "sf_symbol", color: "#2D6A4F" }, max_lines: 1, text: "Không lười, đang tiết kiệm chuyển động", text_color: "#1B4332", type: "static_content" } },
            { overlay_id: "caption:drop03_social_battery", source: "remote", caption: { background: { colors: ["#3D405B", "#6D597A"] }, icon: { data: "person.2.fill", type: "sf_symbol", color: "#F2E9E4" }, max_lines: 1, text: "Xã giao để sau, yên bình trước", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_private_aura", source: "remote", caption: { background: { colors: ["#FDE2E4", "#FAD2E1"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol", color: "#A4133C" }, max_lines: 1, text: "Gu riêng, khỏi cần hội đồng duyệt", text_color: "#6A1632", type: "static_content" } },
            { overlay_id: "caption:drop03_mood_copyright", source: "remote", caption: { background: { colors: ["#264653", "#2A9D8F"] }, icon: { data: "lock.fill", type: "sf_symbol", color: "#E9C46A" }, max_lines: 1, text: "Mood này có bản quyền", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_noise_filter", source: "remote", caption: { background: { colors: ["#D9ED92", "#99D98C"] }, icon: { data: "waveform", type: "sf_symbol", color: "#31572C" }, max_lines: 1, text: "Đang lọc nhiễu khỏi tâm trí", text_color: "#1B4332", type: "static_content" } },
            { overlay_id: "caption:drop03_eye_subtitle", source: "remote", caption: { background: { colors: ["#F4ACB7", "#F7CAD0"] }, icon: { data: "eye.fill", type: "sf_symbol", color: "#8A2846" }, max_lines: 1, text: "Ánh mắt có phụ đề", text_color: "#68263A", type: "static_content" } },
            { overlay_id: "caption:drop03_timezone", source: "remote", caption: { background: { colors: ["#355070", "#6D597A", "#B56576"] }, icon: { data: "globe.americas.fill", type: "sf_symbol", color: "#FBE7C6" }, max_lines: 1, text: "Tâm trạng lệch múi giờ", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_pic_reason", source: "remote", caption: { background: { colors: ["#F6BD60", "#F7EDE2"] }, icon: { data: "camera.fill", type: "sf_symbol", color: "#8C4A18" }, max_lines: 1, text: "Tới đây vì chiếc ảnh đỉnh", text_color: "#57320D", type: "static_content" } },
            { overlay_id: "caption:drop03_multitask", source: "remote", caption: { background: { colors: ["#B8C0FF", "#BBD0FF"] }, icon: { data: "gearshape.2.fill", type: "sf_symbol", color: "#3A3D75" }, max_lines: 1, text: "Ngoài điềm tĩnh, trong đa luồng", text_color: "#252850", type: "static_content" } },
            { overlay_id: "caption:drop03_random_control", source: "remote", caption: { background: { colors: ["#F1C0E8", "#CFBAF0"] }, icon: { data: "slider.horizontal.3", type: "sf_symbol", color: "#694C80" }, max_lines: 1, text: "Ngẫu hứng nhưng có kiểm soát", text_color: "#49345D", type: "static_content" } },
            { overlay_id: "caption:drop03_rare_build", source: "remote", caption: { background: { colors: ["#FFB4A2", "#E5989B"] }, icon: { data: "diamond.fill", type: "sf_symbol", color: "#7A284B" }, max_lines: 1, text: "Build này hơi hiếm", text_color: "#64213B", type: "static_content" } },
            { overlay_id: "caption:drop03_slow_reply", source: "remote", caption: { background: { colors: ["#A9DEF9", "#D0F4DE"] }, icon: { data: "bubble.left.and.bubble.right.fill", type: "sf_symbol", color: "#28536B" }, max_lines: 1, text: "Rep chậm, suy nghĩ chạy nhanh", text_color: "#183B56", type: "static_content" } },
            { overlay_id: "caption:drop03_self_check", source: "remote", caption: { background: { colors: ["#EDEEC9", "#DDE7C7"] }, icon: { data: "checkmark.seal.fill", type: "sf_symbol", color: "#52634A" }, max_lines: 1, text: "Tự kiểm định, khỏi thẩm định", text_color: "#374633", type: "static_content" } },
            { overlay_id: "caption:drop03_not_template", source: "remote", caption: { background: { colors: ["#BDE0FE", "#CDB4DB"] }, icon: { data: "square.stack.3d.up.fill", type: "sf_symbol", color: "#4D4B7D" }, max_lines: 1, text: "Không phải template đại trà", text_color: "#32305A", type: "static_content" } },
            { overlay_id: "caption:drop03_vibe_spec", source: "remote", caption: { background: { colors: ["#FFD6A5", "#FDFFB6"] }, icon: { data: "slider.horizontal.3", type: "sf_symbol", color: "#815B25" }, max_lines: 1, text: "Vibe có thông số riêng", text_color: "#60451D", type: "static_content" } },
            { overlay_id: "caption:drop03_visual_math", source: "remote", caption: { background: { colors: ["#CDEAC0", "#A9D6B5"] }, icon: { data: "ruler.fill", type: "sf_symbol", color: "#315B42" }, max_lines: 1, text: "Visual áp dụng toán riêng", text_color: "#254734", type: "static_content" } },
            { overlay_id: "caption:drop03_life_filter", source: "remote", caption: { background: { colors: ["#3A506B", "#5BC0BE"] }, icon: { data: "camera.filters", type: "sf_symbol", color: "#F0F3BD" }, max_lines: 1, text: "Đời hơi nhiễu, tôi vẫn nét", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_offscript", source: "remote", caption: { background: { colors: ["#F28482", "#F6BD60"] }, icon: { data: "pencil.and.outline", type: "sf_symbol", color: "#6B2D22" }, max_lines: 1, text: "Không đi theo bản nháp", text_color: "#5C291E", type: "static_content" } },
            { overlay_id: "caption:drop03_scene_shift", source: "remote", caption: { background: { colors: ["#6A4C93", "#A06CD5"] }, icon: { data: "rectangle.3.group.fill", type: "sf_symbol", color: "#F2E9FF" }, max_lines: 1, text: "Xuất hiện là đổi bố cục", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_expression", source: "remote", caption: { background: { colors: ["#FAD643", "#F2A541"] }, icon: { data: "person.crop.circle", type: "sf_symbol", color: "#5A3B0C" }, max_lines: 1, text: "Ít lời, nhiều biểu cảm", text_color: "#57390C", type: "static_content" } },
            { overlay_id: "caption:drop03_mystery", source: "remote", caption: { background: { colors: ["#22223B", "#4A4E69"] }, icon: { data: "questionmark.circle.fill", type: "sf_symbol", color: "#C9ADA7" }, max_lines: 1, text: "Thêm chút bí ẩn cho đủ vị", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_tone_auto", source: "remote", caption: { background: { colors: ["#9BF6FF", "#A0C4FF"] }, icon: { data: "slider.horizontal.3", type: "sf_symbol", color: "#214E75" }, max_lines: 1, text: "Thái độ đang tự căn chỉnh", text_color: "#183C5A", type: "static_content" } },
            { overlay_id: "caption:drop03_color_mode", source: "remote", caption: { background: { colors: ["#FFADAD", "#FFD6A5", "#FDFFB6"] }, icon: { data: "paintpalette.fill", type: "sf_symbol", color: "#873D50" }, max_lines: 1, text: "Bật màu riêng, tắt so sánh", text_color: "#632D3D", type: "static_content" } },
            { overlay_id: "caption:drop03_own_pace", source: "remote", caption: { background: { colors: ["#84A59D", "#B8D8BA"] }, icon: { data: "figure.walk", type: "sf_symbol", color: "#24483F" }, max_lines: 1, text: "Đi nhịp mình, khỏi đếm bước", text_color: "#203F37", type: "static_content" } },
            { overlay_id: "caption:drop03_rare_angle", source: "remote", caption: { background: { colors: ["#F7B267", "#F79D65"] }, icon: { data: "viewfinder", type: "sf_symbol", color: "#713E23" }, max_lines: 1, text: "Góc nhìn này không đại trà", text_color: "#5D321D", type: "static_content" } },
            { overlay_id: "caption:drop03_frame_layers", source: "remote", caption: { background: { colors: ["#B8C0FF", "#E7C6FF"] }, icon: { data: "square.stack.3d.up.fill", type: "sf_symbol", color: "#4B3B79" }, max_lines: 1, text: "Một khung hình, nhiều tầng nghĩa", text_color: "#35285C", type: "static_content" } },
            { overlay_id: "caption:drop03_many_tabs", source: "remote", caption: { background: { colors: ["#264653", "#457B9D"] }, icon: { data: "macwindow", type: "sf_symbol", color: "#A8DADC" }, max_lines: 1, text: "Não mở nhiều tab, mặt vẫn calm", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_plan_b", source: "remote", caption: { background: { colors: ["#E9C46A", "#2A9D8F"] }, icon: { data: "arrow.triangle.branch", type: "sf_symbol", color: "#FFFFFF" }, max_lines: 1, text: "Kế hoạch B cũng có gu", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_background_app", source: "remote", caption: { background: { colors: ["#6C757D", "#343A40"] }, icon: { data: "gearshape.fill", type: "sf_symbol", color: "#DEE2E6" }, max_lines: 1, text: "Bản thân chạy nền rất mạnh", text_color: "#FFFFFF", type: "static_content" } },
            { overlay_id: "caption:drop03_final_destination", source: "remote", caption: { background: { colors: ["#0B6E69", "#4FAF9E"] }, icon: { data: "location.fill", type: "sf_symbol", color: "#D9FFF4" }, max_lines: 1, text: "Không gấp, vẫn tới đích", text_color: "#FFFFFF", type: "static_content" } }
        ]
    }
];

// 12.5 Ghép toàn bộ: Dynamic Realtime + 11 Section gốc + Siêu tốc cap()
var personalExtraPalettes = [
  ['#591078', '#973672'], ['#193263', '#176A78'], ['#91223F', '#B44336'],
  ['#4B317E', '#6450AD'], ['#1D5044', '#25775D'], ['#713621', '#9E541F'],
  ['#422B57', '#A13667'], ['#18344C', '#385D83']
];
var personalExtraGroups = [
  ['🤡 Cà khịa & Báo đời', [
    ['warranty', 'Cái nết có bảo hành k', '🧾'],
    ['release', 'Ủa nay được thả ra hả', '🚪'],
    ['nobody_asked', 'Ai hỏi mà kể nhiệt vậy', '🗣️'],
    ['believe', 'Coi chừng t tưởng thiệt', '🫵'],
    ['witness', 'Đứng đó cho có nhân chứng', '🧍'],
    ['kind', 'T hiền tại chưa tới lượt', '😇'],
    ['receipt', 'Xin cái biên lai nha', '🧾'],
    ['gossip', 'Hóng thôi, đừng tag t', '🍿']
  ]],
  ['💅 Slay & Hết cứu', [
    ['camera', 'Chụp xong xin lỗi cam', '📸'],
    ['mercy', 'Mặt này xin tha', '🫣'],
    ['colors', 'Tính làm màu mà hết màu', '🎭'],
    ['confidence', 'Tự tin dù chưa có căn cứ', '🧠'],
    ['taste', 'T hơi khùng nhưng có gu', '💅'],
    ['battery', 'Hết pin mà còn phải diễn', '🪫'],
    ['buffering', 'Mặt tỉnh, não load', '⏳'],
    ['angle', 'Góc này có thù với t', '🤳']
  ]],
  ['💌 In Love & Dỗi', [
    ['hug', 'Ôm trước, nói sau', '🫂'],
    ['sulk', 'Dỗi có thời hạn', '😤'],
    ['miss', 'Nhớ thì nhớ, ai biểu', '🥺'],
    ['reply', 'Rep lẹ, t sắp tự biên', '💬'],
    ['bribe', 'Hối lộ bằng trà sữa', '🧋'],
    ['heart', 'Tim yếu mà hay simp', '💘'],
    ['wrong', 'Sai cũng phải dỗ t', '😗'],
    ['together', 'Chụp chung cái coi', '📷']
  ]],
  ['💸 Deadline & Ví rỗng', [
    ['deadline', 'Deadline có chân à', '🏃'],
    ['wallet', 'Ví đang ở ẩn', '👛'],
    ['payday', 'Lương ghé chơi rồi đi', '💸'],
    ['coffee', 'Nạp cà phê mới nói', '☕'],
    ['meeting', 'Họp xong muốn họp hồn', '👻'],
    ['five_minutes', 'Năm phút nữa t làm', '⏰'],
    ['submit', 'Nộp bài bằng niềm tin', '📚'],
    ['balance', 'Số dư đang hướng nội', '💳']
  ]]
].map(function (group, groupIndex) {
  return {
    section: group[0],
    items: group[1].map(function (tag, index) {
      var colors = personalExtraPalettes[(groupIndex + index) % personalExtraPalettes.length];
      return cap('personal_extra_' + tag[0], tag[1], colors, '#FFFFFF', tag[2], 'emoji');
    })
  };
});

var myFullSections = dynamicSections.concat(existingSections.slice(0, 1), personalExtraGroups, existingSections.slice(1), superSpeedSections);

// 12.6 Đọc và Merge các Caption sự kiện mới từ máy chủ Locket (Không ghi đè) [TÍNH NĂNG 2]
var serverOverlayItems = [];
try {
    if (obj.entries.overlay_items) {
        serverOverlayItems = (typeof obj.entries.overlay_items === "string")
            ? JSON.parse(obj.entries.overlay_items)
            : obj.entries.overlay_items;
    }
} catch (e) {
    serverOverlayItems = [];
}

var mySectionTitles = {};
myFullSections.forEach(function (s) {
    if (s && s.section) mySectionTitles[s.section] = true;
});

var serverExtraSections = [];
if (Array.isArray(serverOverlayItems)) {
    serverOverlayItems.forEach(function (s) {
        if (s && s.section && !mySectionTitles[s.section]) {
            serverExtraSections.push(s);
        }
    });
}

var finalMergedSections = myFullSections.concat(serverExtraSections);

// 12.7 Cập nhật danh sách Dynamic Captions
var defaultDynamicCaptions = [
    "standard", "poll", "color_palette", "review", "music", "location",
    "weather", "time", "streak", "star_sign", "party_time", "locket_count",
    "good_morning", "goodnight", "ootd", "miss_you", "custom", "halloween_2026",
    "love_days_count", "tet_countdown", "noel_countdown", "newyear_countdown",
    "cosmic_oracle", "today_calendar", "night_owl", "morning_sun", "lunch_energy", "vip_gold_badge",
    "ca_phe", "tra_sua", "chua_lanh", "overthinking", "deadline_di_em", "chill_het_nac", "flex_nhe", "bat_on_vl", "san_sale"
];

var serverDynamicCaptions = [];
try {
    if (obj.entries.overlay_dynamic_captions) {
        serverDynamicCaptions = (typeof obj.entries.overlay_dynamic_captions === "string")
            ? JSON.parse(obj.entries.overlay_dynamic_captions)
            : obj.entries.overlay_dynamic_captions;
    }
} catch (e) { }

var finalDynamicCaptions = defaultDynamicCaptions.slice();
if (Array.isArray(serverDynamicCaptions)) {
    serverDynamicCaptions.forEach(function (c) {
        if (finalDynamicCaptions.indexOf(c) === -1) {
            finalDynamicCaptions.push(c);
        }
    });
}

Object.assign(obj.entries, {
    overlay_navigator_enabled: "true",
    overlays_v2_config: JSON.stringify({ suggestions_enabled: true }),
    captions_enabled: "true",
    music_caption_enabled: "true",
    music_caption_song_preview_enabled: "true",
    link_caption_link_enabled: "true",
    overlay_dynamic_captions: JSON.stringify(finalDynamicCaptions),
    overlay_items: JSON.stringify(finalMergedSections)
});

$done({ body: JSON.stringify(obj) });
