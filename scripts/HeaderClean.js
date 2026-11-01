// Personal maintenance rewrite based on deleteHeader.js by @leekang.
// Run only on matching requests. Does not alter response bodies.
(function () {
  'use strict';
  if (typeof $request === 'undefined' || !$request || !$request.headers) {
    $done({});
    return;
  }
  var headers = Object.assign({}, $request.headers);
  var conditional = ['x-revenuecat-etag', 'if-none-match', 'if-modified-since'];
  Object.keys(headers).forEach(function (name) {
    if (conditional.indexOf(name.toLowerCase()) !== -1) delete headers[name];
  });
  // Do not recreate X-RevenueCat-ETag with an empty value.
  // Avoid forcing Cache-Control: no-store globally, which hurts performance.
  $done({headers: headers});
})();
