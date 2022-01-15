type Mode = "development" | "production"

class Config {
	mode: Mode = null;
	
	constructor() {
		this.mode = process.env["mode"] as Mode;
	}
}

export default Config;
