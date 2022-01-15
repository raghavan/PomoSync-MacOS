type Mode = "development" | "production";

import {getGlobal} from "@electron/remote";

class Config {
	mode: Mode = null;
	
	constructor() {
		this.mode = getGlobal("config").mode as Mode;
	}
}

export default Config;
