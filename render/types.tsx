import Config from "./utils/config";
import Api from "./utils/api";

declare global {
	interface Window {
		config: Config;
		api: Api;
	}
}
