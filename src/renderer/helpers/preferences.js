import path from 'path';
import { isMac } from './platform';

const { app } = window.require('electron').remote;
const settings = window.require('electron-settings');

const DEFAULT_THEME = 'light';
const FILE_NAME = 'mini-diary.txt';
const PREF_DIR = app.getPath('userData');
const THEMES = ['auto', 'light', 'dark'];


// Path to diary file

export function getFilePath() {
	// Get path of file directory (or set it to default)
	let fileDir;
	if (settings.has('filePath')) {
		fileDir = settings.get('filePath');
	} else {
		fileDir = PREF_DIR;
		settings.set('filePath', fileDir);
	}
	// Concatenate directory path with file name and return it
	return path.resolve(fileDir, FILE_NAME);
}

export function setFileDir(filePath) {
	settings.set('filePath', filePath);
}


// Theme

export function getTheme() {
	let theme;
	if (settings.has('theme')) {
		theme = settings.get('theme');
	} else {
		theme = isMac ? 'auto' : DEFAULT_THEME;
		settings.set('theme', theme);
	}
	return theme;
}

export function setTheme(theme) {
	if (!THEMES.includes(theme)) {
		throw Error(`Theme setting must be one of ${THEMES}`);
	}
	settings.set('theme', theme);
}
