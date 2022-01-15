import Config from "./config";

import Browser from "./source/browser";
import Tray from "./source/tray";

declare global {
	namespace NodeJS {
		interface Global {
			config: Config;
			browser: Browser;
			tray: Tray;
		}
	}
}
