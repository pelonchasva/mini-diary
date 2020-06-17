import { app, BrowserWindow } from "electron";
import path from "path";

import contextMenu from "electron-context-menu";
import electronDebug from "electron-debug";

import { windowStateKeeper } from "../renderer/utils/windowStateKeeper";
import { initLogger } from "../shared/logger";
import { initI18n } from "./i18n/i18n";
import initIpcListeners from "./ipcMain/listeners";
import { buildMenu } from "./menu/menu";
import updateApp from "./updater";
import { getWindow, setWindow } from "./window";

initLogger();
electronDebug();
contextMenu({
	showCopyImage: false,
	showSearchWithGoogle: false,
});

async function createWindow(): Promise<BrowserWindow> {
	const mainWindowStateKeeper = windowStateKeeper('main');
	const win = new BrowserWindow({
		x: mainWindowStateKeeper.x,
		y: mainWindowStateKeeper.y,
		width: mainWindowStateKeeper.width,
		minWidth: 500,
		height: mainWindowStateKeeper.height,
		minHeight: 500,
		show: false,
		titleBarStyle: "hiddenInset",
		webPreferences: {
			nodeIntegration: true,
			spellcheck: true,
		},
	});
	mainWindowStateKeeper.track(win);
	win.on("ready-to-show", (): void => {
		win.show();
	});
	win.on("closed", (): void => {
		// Dereference the window
		// @ts-ignore
		setWindow(null);
	});

	// Load HTML file
	await win.loadFile(path.join(__dirname, "index.html"));

	return win;
}

// Quit app when all of its windows have been closed
app.on("window-all-closed", (): void => {
	app.quit();
});

// On app activation (e.g. when clicking dock icon), re-create BrowserWindow if necessary
app.on(
	"activate",
	async (): Promise<void> => {
		if (!getWindow()) {
			setWindow(await createWindow());
		}
	},
);

(async (): Promise<void> => {
	// Wait for Electron to be initialized
	await app.whenReady();

	// Set up translations, messaging between main and renderer processes, and application menu
	initI18n();
	buildMenu();
	initIpcListeners();

	// Create and show BrowserWindow
	setWindow(await createWindow());

	updateApp();
})();
