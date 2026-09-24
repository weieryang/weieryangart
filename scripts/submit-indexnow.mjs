const endpoint = "https://api.indexnow.org/indexnow";
const host = "weieryangart.com";
const key = "f1693c5ec1a846e7a2acaa66e6209fd7";
const keyLocation = `https://${host}/${key}.txt`;

const requestedUrls = process.argv.slice(2).map((value) => new URL(value, `https://${host}/`).href);

if (!requestedUrls.length) {
  console.error("Pass one or more changed weieryangart.com URLs.");
  process.exit(1);
}

const invalidUrl = requestedUrls.find((url) => new URL(url).hostname !== host);
if (invalidUrl) {
  console.error(`Refusing URL outside ${host}: ${invalidUrl}`);
  process.exit(1);
}

const response = await fetch(endpoint, {
  method: "POST",
  headers: { "content-type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host, key, keyLocation, urlList: [...new Set(requestedUrls)] }),
});

if (!response.ok) {
  const body = await response.text();
  throw new Error(`IndexNow returned ${response.status}: ${body || response.statusText}`);
}

console.log(`IndexNow accepted ${requestedUrls.length} changed URL(s) with HTTP ${response.status}.`);
