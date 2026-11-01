'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const scripts = path.resolve(__dirname, '..', 'scripts');
function run(filename, {body, args, headers} = {}) {
  let output;
  const box = {
    $done: value => {output = value},
    $argument: args,
    $response: body === undefined ? undefined : {body},
    $request: headers === undefined ? undefined : {headers},
    JSON, Date, Object, String, Array, Math, Number, decodeURIComponent
  };
  vm.runInNewContext(fs.readFileSync(path.join(scripts, filename), 'utf8'), box, {timeout: 1000});
  assert.ok(output, filename + ' must call $done');
  return output;
}
// Invalid/error responses should remain unmodified.
assert.equal(JSON.stringify(run('RemoteConfig.js', {body:'not json'})), JSON.stringify({}));
assert.equal(JSON.stringify(run('RemoteConfig.js', {body:'{"error":"upstream"}'})), JSON.stringify({}));
assert.equal(JSON.stringify(run('Gold.js', {body:'no json'})), JSON.stringify({}));
assert.equal(JSON.stringify(run('Gold.js', {body:'{"code":403,"error":"unauthorized"}'})), JSON.stringify({}));
const gold = JSON.parse(run('Gold.js', {body:JSON.stringify({subscriber: {subscriptions:{},entitlements:{}}})}).body);
assert.ok(gold.subscriber.entitlements.gold);
// Cache headers removed in a case-insensitive manner (and not recreated).
const fixedHeaders = run('HeaderClean.js', {headers:{'X-RevenueCat-ETag':'abc','IF-none-MATCH':'xyz','if-modified-since':'y','Authorization':'test'}}).headers;
assert.equal(fixedHeaders.Authorization, 'test');
assert.ok(!Object.keys(fixedHeaders).some(k => /^(x-revenuecat-etag|if-none-match|if-modified-since)$/i.test(k)));
// Captions should merge existing entries and not drop those under matching headings.
const upstream = {entries:{overlay_items: JSON.stringify([
  {section:'🎨 Meme & Hài hước 🤡',items:[{overlay_id:'caption:server_new',caption:{text:'from server'}}]},
  {section:'Separate Section',items:[{overlay_id:'caption:other_server',caption:{text:'elsewhere'}}]}
]),overlay_dynamic_captions: JSON.stringify(['upstream_id']), unrelated:'preserve-me'}};
const rewritten = JSON.parse(run('RemoteConfig.js', {body:JSON.stringify(upstream), args:'name=Test%20%26%20Me&startDate=2024-02-14&hd=true'}).body);
assert.equal(rewritten.entries.unrelated,'preserve-me');
const sections = JSON.parse(rewritten.entries.overlay_items);
const all = sections.flatMap(s => s.items);
const custom = all.filter(i => i.overlay_id.startsWith('caption:personal_'));
console.log('Personal static captions:', custom.length);
assert.ok(custom.length >= 150, 'must ship >=150 personal captions');
const ids = all.map(i=>i.overlay_id).filter(Boolean);
assert.equal(new Set(ids).size, ids.length);
assert.ok(ids.includes('caption:server_new'));
assert.ok(ids.includes('caption:other_server'));
assert.ok(JSON.parse(rewritten.entries.overlay_dynamic_captions).includes('upstream_id'));
assert.equal(rewritten.entries.storage_bucket, undefined);
assert.equal(rewritten.entries.cdn_domain_replacements, undefined);
assert.equal(JSON.parse(rewritten.entries.camera).max_duration, 60);
console.log('PASS: 13 checks (syntax, malformed responses, headers, Gold, caption count, dedup, merge, fields).');
