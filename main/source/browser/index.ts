import {BrowserWindow, BrowserWindowConstructorOptions} from "electron";
import {enable} from "@electron/remote/main";
import path from "path";

const constructorOptions: BrowserWindowConstructorOptions = {
	show: false,
	alwaysOnTop: true,
	width: 450,
	height: 300,
	frame: false,
	autoHideMenuBar: true,
	transparent: true,
	webPreferences: {
		nodeIntegration: true,
		contextIsolation: false,
		webSecurity: false
	}
};

export default class Browser extends BrowserWindow {
	constructor() {
		super(constructorOptions);
		enable(this.webContents);
	}
	
	public init = () => {
		if (global.config.mode === "development") return this.loadURL("http://localhost:3000/");
		return this.loadURL(path.join("file://", __dirname, "index.html"));
	};
	
	close() {
		global.browser = null;
		super.close();
	}
}
