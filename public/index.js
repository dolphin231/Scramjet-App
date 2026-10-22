"use strict";
const form = document.getElementById("sj-form");
const address = document.getElementById("sj-address");
const searchEngine = document.getElementById("sj-search-engine");
const error = document.getElementById("sj-error");
const errorCode = document.getElementById("sj-error-code");

const { ScramjetController } = $scramjetLoadController();

const scramjet = new ScramjetController({
	files: {
		wasm: "/scram/scramjet.wasm.wasm",
		all: "/scram/scramjet.all.js",
		sync: "/scram/scramjet.sync.js",
	},
});

scramjet.init();

const connection = new BareMux.BareMuxConnection("/baremux/worker.js");

async function openInFrame(url) {
	await registerSW();
	const proto = location.protocol === "https:" ? "wss" : "ws";
	const wispUrl = proto + "://" + location.host + "/wisp/";
	if ((await connection.getTransport()) !== "/libcurl/index.mjs") {
		await connection.setTransport("/libcurl/index.mjs", [
			{ websocket: wispUrl },
		]);
	}
	const frame = scramjet.createFrame();
	frame.frame.id = "sj-frame";
	document.body.appendChild(frame.frame);
	frame.go(url);
}

form.addEventListener("submit", async (event) => {
	event.preventDefault();
	try {
		const engine = searchEngine ? searchEngine.value : "https://duckduckgo.com/?q=%s";
		await openInFrame(search(address.value, engine));
	} catch (err) {
		error.textContent = "Failed to load.";
		errorCode.textContent = err.toString();
	}
});

const autoUrl = new URLSearchParams(location.search).get("url");
if (autoUrl) {
	openInFrame(autoUrl).catch((err) => {
		error.textContent = "Failed to load.";
		errorCode.textContent = err.toString();
	});
}
