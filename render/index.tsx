import * as React from "react";
import * as ReactDOM from "react-dom";

import Config from "./utils/config";
import Api from "./utils/api";

import App from "./app";

import "./index.scss";

const defineGlobal = () => {
	window.config = new Config();
	window.api = new Api();
};
const render = () => {
	const element = (
		<App/>
	);
	
	const target = document.getElementById("app");
	
	ReactDOM.render(element, target);
};

defineGlobal();
render();
