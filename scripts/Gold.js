// Personal reviewed adaptation of Locket_Gold.js by @leekang.
// Modifies the local interpretation of RevenueCat subscription data; NOT a real purchase.
// Can stop working with server-side validation. Use only if authorized.
(function () {
  'use strict';
  if (typeof $response === 'undefined' || !$response || typeof $response.body !== 'string') {
    $done({}); return;
  }
  var obj;
  try { obj = JSON.parse($response.body); } catch (e) { $done({}); return; }
  if (!obj || typeof obj !== 'object' || Array.isArray(obj) || obj.error || obj.code) {
    $done({}); return;
  }
  var subscriber = obj.subscriber;
  if (!subscriber || typeof subscriber !== 'object' || Array.isArray(subscriber)) {
    $done({}); return;
  }
  var far = '9999-01-09T10:10:14Z';
  var past = '2005-01-09T10:10:14Z';
  var product = 'locket_1600_1y';
  var subscription = {
    auto_resume_date: null, display_name: product, is_sandbox: true,
    ownership_type: 'PURCHASED', billing_issues_detected_at: null,
    management_url: 'https://apps.apple.com/account/subscriptions',
    period_type: 'normal', price: {amount: 399000, currency: 'VND'},
    expires_date: far, grace_period_expires_date: null,
    refunded_at: null, unsubscribe_detected_at: null,
    original_purchase_date: past, purchase_date: past, store: 'app_store'
  };
  var entitlement = {
    grace_period_expires_date: null, purchase_date: past,
    product_identifier: product, expires_date: far
  };
  subscriber.subscriptions = subscriber.subscriptions || {};
  subscriber.entitlements = subscriber.entitlements || {};
  subscriber.subscriptions[product] = subscription;
  ['Gold', 'gold', 'Pro', 'pro'].forEach(function (key) {
    subscriber.entitlements[key] = Object.assign({}, entitlement);
  });
  $done({body: JSON.stringify(obj)});
})();
