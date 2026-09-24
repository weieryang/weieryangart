import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import WebSocket from "ws";

const port = Number(process.argv[2] || 9333);
const outputDir = path.resolve(process.argv[3] || "qa-redesign/case-refresh");
await mkdir(outputDir, { recursive: true });

const pageInfo = await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" }).then((response) => response.json());
const socket = new WebSocket(pageInfo.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  socket.once("open", resolve);
  socket.once("error", reject);
});

let commandId = 0;
const pending = new Map();
const consoleErrors = [];

socket.on("message", (raw) => {
  const message = JSON.parse(raw.toString());
  if (message.id && pending.has(message.id)) {
    const { resolve, reject } = pending.get(message.id);
    pending.delete(message.id);
    if (message.error) reject(new Error(message.error.message));
    else resolve(message.result);
  }
  if (message.method === "Runtime.exceptionThrown") consoleErrors.push(message.params.exceptionDetails.text);
  if (message.method === "Log.entryAdded" && message.params.entry.level === "error") consoleErrors.push(message.params.entry.text);
});

function send(method, params = {}) {
  const id = ++commandId;
  socket.send(JSON.stringify({ id, method, params }));
  return new Promise((resolve, reject) => pending.set(id, { resolve, reject }));
}

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

await send("Page.enable");
await send("Runtime.enable");
await send("Log.enable");

async function navigate(url) {
  await send("Page.navigate", { url });
  await wait(2800);
}

async function evaluate(expression) {
  const result = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
  return result.result?.value;
}

async function screenshot(name) {
  const result = await send("Page.captureScreenshot", { format: "png", fromSurface: true, captureBeyondViewport: false });
  await writeFile(path.join(outputDir, `${name}.png`), Buffer.from(result.data, "base64"));
}

async function viewport(width, height, mobile = false) {
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile,
    screenWidth: width,
    screenHeight: height,
  });
}

await viewport(1440, 900);
await navigate("http://127.0.0.1:4175/");
await evaluate(`localStorage.setItem("weieryang-site-language-v2", "en"); location.reload()`);
await wait(3200);
await screenshot("desktop-hero");

await evaluate(`document.getElementById("projects")?.scrollIntoView({block:"start"})`);
await wait(900);
await screenshot("desktop-routes");

await evaluate(`document.getElementById("cases")?.scrollIntoView({block:"start"})`);
await wait(900);
await screenshot("desktop-cases");

const desktopMetrics = await evaluate(`({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,cases:document.querySelectorAll(".case-study").length,language:document.documentElement.lang})`);

await evaluate(`scrollTo(0,0); document.querySelector(".hero-time-toggle")?.click()`);
await wait(2500);
await screenshot("desktop-hero-day");

await viewport(390, 844, true);
await navigate("http://127.0.0.1:4175/");
await screenshot("mobile-hero");

await evaluate(`document.getElementById("cases")?.scrollIntoView({block:"start"})`);
await wait(900);
await screenshot("mobile-cases");

const mobileMetrics = await evaluate(`({width:innerWidth,height:innerHeight,scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth,cases:document.querySelectorAll(".case-study").length,language:document.documentElement.lang})`);

process.stdout.write(JSON.stringify({ desktopMetrics, mobileMetrics, consoleErrors }, null, 2));
socket.close();
