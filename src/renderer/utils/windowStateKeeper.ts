import { BrowserWindow } from "electron";

import settings from "electron-settings";

/**
 *
 */
interface WindowState {
	x?: number,
	y?: number,
	width: number,
	height: number,
	isMaximized: boolean
}

/**
 * A closure function to keep track of a window state
 * @param windowName The name of the window
 * @todo Find a proper return type for this closure function
 */
export function windowStateKeeper(windowName: string) {
	let window: BrowserWindow;
	const windowState: WindowState = {
		x: undefined,
		y: undefined,
		width: 1100,
		height: 600,
		isMaximized: false
	};

	function setBounds(): void {
		// Restore from electron settings
		if (settings.has(`windowState.${windowName}`)) {
			const state = settings.get(`windowState.${windowName}`);

			if (state !== null) {
				windowState.x = state.x;
				windowState.y = state.y;
				windowState.width = state.width;
				windowState.height = state.height;
			}
		}
	}

	function saveState(): void {
		if (!windowState.isMaximized) {
			const bounds = window.getBounds();

			if (bounds !== null) {
				windowState.x = bounds.x;
				windowState.y = bounds.y;
				windowState.width = bounds.width;
				windowState.height = bounds.height;
			}
		}

		windowState.isMaximized = window.isMaximized();
		settings.set(`windowState.${windowName}`, windowState);
	}

	function track(win: BrowserWindow): void {
		window = win;
		['resize', 'move', 'close'].forEach((event: string) => {
			win.on(event, saveState);
		});
	}

	setBounds();

	return({
		x: windowState.x,
		y: windowState.y,
		width: windowState.width,
		height: windowState.height,
		isMaximized: windowState.isMaximized,
		track,
	});
}
