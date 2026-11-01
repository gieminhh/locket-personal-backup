/***********************************************
 > deleteHeader & Smart Network Recovery v6.0 by Lee Kang
 > Triệt tiêu hoàn toàn lỗi kẹt gói tin 304 Not Modified (ETag / If-None-Match)
 > khi chuyển đổi giữa Wi-Fi và 4G/5G trên cả RevenueCat & Firebase Remote Config
***********************************************/

const version = 'V6.0.0-ZeroRestart';

function setHeaderValue(headers, key, val) {
  var lower = key.toLowerCase();
  if (lower in headers) {
    headers[lower] = val;
  } else {
    headers[key] = val;
  }
}

function deleteHeaderCaseInsensitive(headers, targetKey) {
  var lower = targetKey.toLowerCase();
  Object.keys(headers).forEach(function (k) {
    if (k.toLowerCase() === lower) {
      delete headers[k];
    }
  });
}

var modifiedHeaders = (typeof $request !== "undefined" && $request && $request.headers) ? $request.headers : {};

// 1. Xóa sạch ETag & If-None-Match / If-Modified-Since để ép máy chủ trả về 200 OK mới nhất
deleteHeaderCaseInsensitive(modifiedHeaders, 'X-RevenueCat-ETag');
deleteHeaderCaseInsensitive(modifiedHeaders, 'If-None-Match');
deleteHeaderCaseInsensitive(modifiedHeaders, 'If-Modified-Since');
setHeaderValue(modifiedHeaders, 'X-RevenueCat-ETag', '');

// 2. Ép làm mới bộ nhớ đệm cấu hình
setHeaderValue(modifiedHeaders, 'Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
setHeaderValue(modifiedHeaders, 'Pragma', 'no-cache');

$done({ headers: modifiedHeaders });
