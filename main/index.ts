import {app} from "electron";
import {initialize} from "@electron/remote/main";

import Config from "./config";

import Browser from "./source/browser";
import Tray from "./source/tray";

class App {
	constructor() {
		global.config = new Config();
		
		global.browser = null;
		global.tray = null;
	}
	
	public init = () => {
		app.on("ready", this.ready);
		app.on("activate", this.activate);
	};
	public quit = () => {
		app.quit();
	};
	
	private ready = async () => {
		initialize();
		
		global.browser = new Browser();
		global.tray = new Tray();
		
		global.browser.init().then(() => {
			global.tray.init();
		});
	};
	private activate = () => {
		if (global.browser === null) return this.ready();
	};
}

if (app.requestSingleInstanceLock()) {
	(new App()).init();
} else {
	(new App()).quit();
}
