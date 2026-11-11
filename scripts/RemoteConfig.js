// Locket Personal Captions + Remote Config. Adapted for private personal backup.
// Original caption pack and config concept: @leekang (Locket_Unlocked.js v3.5).
// Curated rewrite, not a verbatim preservation of the original 150+ preset styles.
// Requires an app version that understands overlay_items / overlay_dynamic_captions.
(function () {
  'use strict';
  var args = parseArgs(typeof $argument === 'undefined' ? '' : $argument);
  var extrasOnly = args.captionPack === 'extras';
  var locketFetch = typeof $request !== 'undefined' && $request &&
    /^https:\/\/firebaseremoteconfig\.googleapis\.com\/v1\/projects\/locket-4252a\//.test($request.url || '');
  function logCaptionStatus(status) {
    if (extrasOnly && locketFetch && typeof console !== 'undefined' && typeof console.log === 'function') {
      console.log('[Locket Captions] ' + status);
    }
  }
  if (typeof $response === 'undefined' || !$response || typeof $response.body !== 'string') {
    logCaptionStatus('skipped: no response body');
    $done({}); return;
  }
  var obj;
  try { obj = JSON.parse($response.body); } catch (e) {
    logCaptionStatus('skipped: invalid JSON');
    $done({}); return;
  }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) ||
      obj.error || !obj.entries || typeof obj.entries !== 'object' || Array.isArray(obj.entries)) {
    logCaptionStatus(obj && obj.state === 'NO_CHANGE' ? 'skipped: NO_CHANGE' : 'skipped: no config entries');
    $done({}); return; // Do not replace malformed/error Remote Config with a new object.
  }
  var entries = obj.entries;
  function parseArgs(s) {
    if (typeof s !== 'string') return {};
    if (s.trim().charAt(0) === '{') {
      try { var j = JSON.parse(s); return j && typeof j === 'object' ? j : {}; } catch (e) { return {}; }
    }
    var out = {};
    s.split('&').forEach(function (part) {
      if (!part) return;
      var pos = part.indexOf('=');
      try {
        var k = decodeURIComponent(pos === -1 ? part : part.slice(0, pos));
        var v = decodeURIComponent(pos === -1 ? '' : part.slice(pos + 1));
        if (k && !['__proto__', 'prototype', 'constructor'].includes(k)) out[k] = v;
      } catch (e) { /* skip malformed argument */ }
    });
    return out;
  }
  var name = String(args.name || 'Personal').slice(0, 48);
  var hd = args.hd !== 'false' && args.hd !== false;
  var now = new Date();
  // Use UTC getters on a UTC+7 shifted timestamp: avoids double-timezone shifting.
  var vn = new Date(now.getTime() + 7 * 3600000);
  var y = vn.getUTCFullYear(), m = vn.getUTCMonth(), d = vn.getUTCDate();
  var day = vn.getUTCDay(), hr = vn.getUTCHours();
  function daysUntil(target) {
    var todayUTC = Date.UTC(y, m, d);
    return Math.max(0, Math.ceil((target.getTime() - todayUTC) / 86400000));
  }
  var datesTet = {2026: '2026-02-17', 2027: '2027-02-06', 2028: '2028-01-26', 2029: '2029-02-13', 2030: '2030-02-03'};
  var tetCountdown = null;
  Object.keys(datesTet).sort().some(function (yy) {
    var dt = new Date(datesTet[yy] + 'T00:00:00Z');
    if (dt.getTime() >= Date.UTC(y, m, d)) {
      tetCountdown = daysUntil(dt); return true;
    }
    return false;
  });
  var newYear = daysUntil(new Date(Date.UTC(y + 1, 0, 1)));
  var xmas = daysUntil(new Date(Date.UTC(y, 11, 25)));
  if (xmas === 0 && !(m === 11 && d === 25)) {
    xmas = daysUntil(new Date(Date.UTC(y + 1, 11, 25)));
  }
  var since = NaN;
  if (typeof args.startDate === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(args.startDate)) {
    var parsed = new Date(args.startDate + 'T00:00:00Z').getTime();
    if (Number.isFinite(parsed)) since = Math.max(0, Math.floor((Date.UTC(y, m, d) - parsed) / 86400000));
  }
  var palettes = [
    ['#FF758C','#FF7EB3'], ['#1A2980','#26D0CE'], ['#8E2DE2','#4A00E0'],
    ['#F7971E','#FFD200'], ['#11998E','#38EF7D'], ['#FF416C','#FF4B2B'],
    ['#3A1C71','#D76D77'], ['#4FACFE','#00F2FE'], ['#B8C0FF','#C8B6FF'],
    ['#141E30','#243B55'], ['#E91E63','#F44336'], ['#56AB2F','#A8E063']
  ];
  function preset(id, label, idx, icon, colors) {
    return {
      overlay_id: 'caption:' + id,
      source: 'remote',
      caption: {
        background: {colors: colors || palettes[idx % palettes.length]},
        max_lines: 1,
        text: label,
        text_color: '#FFFFFF',
        type: 'static_content',
        icon: {data: icon || '✨', type: 'emoji'}
      }
    };
  }
  function parseJsonArray(value) {
    try {
      var parsed = typeof value === 'string' ? JSON.parse(value) : value;
      return Array.isArray(parsed) ? parsed : null;
    } catch (e) { return null; }
  }
  function mergeCaptionSections(sections) {
    var merged = [], bySection = Object.create(null), seen = Object.create(null);
    sections.forEach(function (section) {
      if (!section || !Array.isArray(section.items)) return;
      section.items.forEach(function (item) {
        if (!item || typeof item !== 'object') return;
        var key = typeof item.overlay_id === 'string' ? item.overlay_id : null;
        if (key && seen[key]) return;
        if (key) seen[key] = true;
        var title = section.section || 'Unsorted';
        if (!bySection[title]) {
          bySection[title] = {section: title, items: []};
          merged.push(bySection[title]);
        }
        bySection[title].items.push(item);
      });
    });
    return merged;
  }
  var extraPalettes = [
    ['#591078', '#973672'], ['#193263', '#176A78'], ['#91223F', '#B44336'],
    ['#4B317E', '#6450AD'], ['#1D5044', '#25775D'], ['#713621', '#9E541F'],
    ['#422B57', '#A13667'], ['#18344C', '#385D83']
  ];
  var extraGroups = [
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
        var colors = extraPalettes[(groupIndex + index) % extraPalettes.length];
        return preset('personal_extra_' + tag[0], tag[1], index, tag[2], colors);
      })
    };
  });
  var serverSections = parseJsonArray(entries.overlay_items);
  if (extrasOnly) {
    // Only seed a missing catalog on a full update from Locket's own project.
    var canSeedCatalog = locketFetch && obj.state === 'UPDATE' &&
      !Object.prototype.hasOwnProperty.call(entries, 'overlay_items');
    if (obj.state === 'NO_CHANGE' || (!serverSections && !canSeedCatalog)) {
      logCaptionStatus('skipped: no fresh caption catalog');
      $done({}); return;
    }
    entries.overlay_items = JSON.stringify(mergeCaptionSections(extraGroups.concat(serverSections || [])));
    logCaptionStatus('applied 32 tags');
    $done({body: JSON.stringify(obj)});
    return;
  }
  // Each line becomes one independent caption; IDs generated with unique slug prefix.
  // Stored in source for fully offline backup: no 3rd-party caption service needed.
  var groups = [
    ['🎨 Meme & Hài hước 🤡', '😂', [
      'Cười vcl m oi','Cười xỉu','Luôn vui tươi','Nấu xói','côn viên lá làn',
      'Gián đáng iu hong','ăm chã húi, bà chã hơm','Hóng drama','Kể chuyện nghe chơi',
      'thân ai nấy lo, drama ai nấy hóng','Check VAR liền','Có biến có biến',
      'sơ hở là báo','bớt báo giùm cái','ai sợ thì đi về','Chạy ngay đi',
      'lên chùa không biết lạy ai','đấm nhau không','Hảo hán','còn cái nịt',
      'Mình là lốp','Hay ra dẻ quá à!','Mắc cỡ quá hai ơi','Thân chưa mà dỡn',
      'ủa rồi ai mượn?','bạn mình nhưng hệ điều hành lạ','ai rồi cũng khác, riêng bạn thì lạ',
      'tưởng gì, hóa ra tưởng tượng','Hên lắm mới xui được vậy á',
      'Bóc trúng sít rịt','Không vấn đề gì luôn','Bùng nổ','Phụ huynh đừng xem',
      'Ủa alo','Ủa alo, gì dạ?','hỏ?','cái đéo má ??','Cái gì vậy trời',
      'Không thể tin nổi','vl m ơi?','Chê mạnh','rồi lét luôn','rồi gay luôn'
    ]],
    ['🎨 Gen Z & Xéo xắt 💅', '💅', [
      'Feeling Cute','Cutie Pie 🌸','Hello Kitty 🐱','ngoan xinh iu của ai đây',
      'Xinh đẹp tuyệt vời','hôm nay cũng slay','Tinh hoa hội tụ','Xinh gái ấn phím 1',
      'xinh là một loại tài năng','Đẹp trai có gì sai','đẹp không cần lý do',
      'Cha này tự luyến ghê','Phụ tình không phụ bản','main character của cuộc đời mình',
      'vibe này ko phải ai cũng có','không hoàn hảo nhưng có khí chất','siêu cấp bá khí',
      'bá khí ngang ngược','Đủ bá khí chưa?','oách xà lách','Ra đường nể mỗi anh',
      'Nhìn là biết uy tín','Flex đến hơi thở cuối','tui không hơn thua, tui hơn hẳn',
      'tui không hơn ai, tui hơn hôm qua','không phải gu của tất cả, may quá',
      'ủa tưởng mình quan trọng lắm?','cái nết kỳ ghê','ghét đứa kia ghê 😒',
      'không ghét, chỉ không ưa','Tôi sống thế đấy','Chưa đủ wow',
      'cưng đang nú','Cờ ring qus mẹ','t bế lên threads liền nè','Trổ bóng'
    ]],
    ['🎨 Tình yêu & Cơm chó 💕', '💕', [
      'em nhớ anhh','nhớ anh tới mức hơi phiền','i love you','yêu cục dàng',
      'Yeu Emmm','Yeu Anhhh','Baby Love 💖','Muốn được ôm','cho hun miếng coi',
      'mê anh hơn mê ngủ','em bé cần được dỗ','iu thì nói, đừng có ngại',
      'iu hong thì bảo','anh có thương em thiệt hong','yêu em là nhiệm vụ cả đời',
      'crush nhìn em một cái là xong','anh là ngoại lệ của em',
      'Đang bận tương tư','Mắc bẫy tình yêu','hông ấy mình cưới nhau đi',
      'Wedding Time!','Dating Time!','Tưởng love hoá ra lốp','Cảm thấy hạnh phúc'
    ]],
    ['🎨 Bất ổn & Hết cứu 🫠', '🫠', [
      'Bất ổn thật sự','Này là hết cứu','hết cứu thiệt chứ','tới công chuyện nữa rồi',
      'Toang thật rồi','Tới rồi tới rồi','gòi xong lun á','xĩu ngang xĩu dọc',
      'Gục ngã','Bất lực','Rớt nước mắt','Tiền đình','não đang bảo trì',
      'Overthinking vai chưởng','Trầm cảm nhẹ','Không cảm xúc',
      'miệng cười nhưng lòng thì không','hôm nay tôi buồn','đêm nay ai ôm nỗi buồn',
      'em ổn, ổn áp lực','thôi thì mình lại một mình','tui là nạn nhân',
      'òi ai cứu tui','Sóng gió phủ đời trai','thương người không thương mình',
      'lại tự mình đa tình','chắc tại mình không đủ tốt',
      'một chút hy vọng, một đống thất vọng','hết duyên hay hết thương?',
      'người vui có nhớ người buồn không','đã xem, chưa rep, đã đau',
      'đừng im lặng với em mà','nhớ thì nhớ, quay lại thì thôi',
      'em hong có dỗi, em chỉ buồn','Dỗi rồi','thui mừ đừng có chọc bé',
      'đừng có làm bé quạo','Xin lũi được chưa','bíc gòi khổ lém',
      'hong bé ơi','khum có bíc nữa'
    ]],
    ['🎨 Deadline & Tiền bạc 💸', '💸', [
      'Deadline dí tụt quần','đời cho gì nhận nấy, trừ deadline',
      'Đi làm vì đam mê','Cần nạp cafein gấp','Tiền đâu mà tiêu',
      'Lúc nào có tiền thì mới đi á','đọc số tài khoản','Có tiền làm phiền thiên hạ',
      'có tiền thì nói chuyện tiếp','độc lập tài chính, độc thân tình cảm',
      'Cứ từ từ khoai sẽ nhừ','Kiểm tra nhân phẩm'
    ]],
    ['🎨 Daily & Đời sống ☕', '☕', [
      'Ngày mới vui vẻ','Coffee Time!','Matcha Latte 🍵','Mixue Time!',
      'tiền không mua được tất cả, nhưng mua được trà sữa','Ăn cơm chưa?',
      'Dinner Time!','Đi chơi không?','tuyệt vời, uống nào!','Shopping Time!',
      'Cinema Time!','Tuyệt đối điện ảnh','Quá là điện ảnh','Locket Time!',
      'Chilling Time!','Happy Graduation Day!','Biển ơiiii',
      'Hồi chiều trời mưa...','Rainy Day ☕🌧️','Cảm lạnh',
      'Night Vibes 🌌','2:00 AM Thoughts 🌙','Ngủ ngon','Sweet Dream 🧊',
      'nhiệm vụ hệ thống: đi ngủ','đã đến lúc tắt nguồn',
      'não nghỉ làm, tay vẫn online','buồn ngủ nhưng chưa chịu ngủ',
      'cảnh báo: pin người dùng còn 1%','nhiệm vụ hôm nay: nằm im',
      'mai tính, nay ngủ','offline để hồi sinh'
    ]],
    ['🎨 Chứng nhận (nhãn vui, không phải xác minh thật)', '✅', [
      'Locket xác nhận bạn cutii','Locket xác nhận bạn xjnh gái',
      'Locket xác nhận bạn đẹp chai','Locket xác nhận bạn dangiu',
      'Đã xác minh bạn là gái đẹp','Đã xác minh bạn là trai đẹp',
      'Đã xác nhận bạn là bé ngoan','Locket tuyên dương bạn cute'
    ]],
    ['Food & Drink', '🍜', [
      'Ăn lắm vậy má','Nay ăn gì?','Nay uống gì?','Ngon không tưởng',
      'Dỡ thấy mẹ','Umm','Cũm tạmmm đuy','Cũm được','Ngon théeee',
      'Chắc ngon','ăn cháo đá bát','ăn k nói có','ăn năng hối cải','ăn chay niệm phật'
    ]]
  ];
  var personal = [];
  groups.forEach(function (group, gi) {
    var items = group[2].map(function (caption, idx) {
      var id = 'personal_' + gi + '_' + idx;
      return preset(id, caption, gi + idx, group[1]);
    });
    personal.push({section: group[0], items: items});
  });
  var dynamic = [];
  function addDynamic(id, label, icon, colors) {
    dynamic.push(preset(id, label, dynamic.length, icon, colors));
  }
  addDynamic('personal_today', 'Hôm nay ' + ['CN','Thứ Hai','Thứ Ba','Thứ Tư','Thứ Năm','Thứ Sáu','Thứ Bảy'][day] + ' (' + d + '/' + (m+1) + ')', '🗓️');
  addDynamic('personal_newyear', 'Còn ' + newYear + ' ngày sang năm mới 🎆', '🎆');
  addDynamic('personal_noel', (xmas === 0 ? 'Hôm nay là Giáng Sinh! 🎄' : 'Còn ' + xmas + ' ngày đến Giáng Sinh 🎄'), '🎄');
  if (tetCountdown !== null) addDynamic('personal_tet', 'Còn ' + tetCountdown + ' ngày nữa tới Tết 🧧', '🧧');
  if (Number.isFinite(since)) addDynamic('personal_love_days', 'Bên nhau ' + since + ' ngày 💕', '💕');
  addDynamic('personal_badge', 'Personal Locket • ' + name, '👑');
  var hourText = (hr >= 5 && hr < 11) ? 'Chào buổi sáng ☀️' :
                 (hr >= 22 || hr < 5) ? 'Hội cú đêm 🦉' : 'Hôm nay phải vui ✨';
  addDynamic('personal_time', hourText, '✨');
  personal.unshift({section: '⏱️ Thời gian thực', items: dynamic});
  var merged = mergeCaptionSections(personal.concat(extraGroups, serverSections || []));
  var dynIds = ['standard','poll','review','music','location','weather','time',
                'streak','custom','color_palette','quote'];
  dynamic.forEach(function (item) {dynIds.push(item.overlay_id.replace(/^caption:/, ''));});
  (parseJsonArray(entries.overlay_dynamic_captions) || []).forEach(function (id) {
    if (typeof id === 'string' && dynIds.indexOf(id) === -1) dynIds.push(id);
  });
  Object.assign(entries, {
    overlay_navigator_enabled: 'true',
    captions_enabled: 'true',
    overlay_items: JSON.stringify(merged),
    overlay_dynamic_captions: JSON.stringify(dynIds),
    feature_gates: JSON.stringify(Object.assign({}, (function () {
      try {return JSON.parse(entries.feature_gates || '{}') || {}} catch (e) {return {}}
    })(), {
      app_icon_picker: 'enabled', camera_roll: 'enabled', camera_theme: 'enabled',
      long_captions: 'enabled', longer_video: 'enabled', video: 'enabled'
    })),
    camera: JSON.stringify(Object.assign({}, (function () {
      try {return JSON.parse(entries.camera || '{}') || {}} catch(e) {return {}}
    })(), {gold_max_duration: 60, max_duration: 60, quality_mbps: hd ? 4.0 : 2.5})),
    camera_roll: JSON.stringify(Object.assign({}, (function () {
      try {return JSON.parse(entries.camera_roll || '{}') || {}} catch(e) {return {}}
    })(), {video_max_duration: 60, trim_max_duration: 60, quality_mbps: hd ? 4.0 : 2.5})),
    video_sound_enabled: 'true', microphone_enabled: 'true',
    camera_roll_video_enabled: 'true',
    camera_roll_video_upload_enabled: 'true',
    upload_main_image_quality: hd ? '0.95' : '0.85',
    upload_main_image_size: hd ? '2048' : '1440'
  });
  // Deliberately no CDN rewriting, Sentry tracking override, storage bucket changes,
  // hard-coded external support URLs, or forced cache lifetime.
  $done({body: JSON.stringify(obj)});
})();
