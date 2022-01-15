import {app, Tray} from "electron";
import path from "path";

import positioner from "electron-traywindow-positioner";

const icon = path.join(app.getAppPath(), "static", "logo.png");

export default class extends Tray {
	constructor() {
		super(icon);
	}
	
	public init = () => {
		this.on("click", this.click);
	};
	
	private click = () => {
		if (global.browser.isVisible()) return global.browser.hide();
		
		const bounds = this.getBounds();
		
		positioner.position(global.browser, bounds);
		
		global.browser.show();
	};
}
