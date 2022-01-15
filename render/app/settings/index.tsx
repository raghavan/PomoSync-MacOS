import * as React from "react";

import "./index.scss";
import {app} from "@electron/remote";

class Settings extends React.Component {
	state = {
		startup: app.getLoginItemSettings().openAtLogin,
		apiKey: localStorage.getItem("apiKey") ?? "",
		baseId: localStorage.getItem("baseId") ?? "",
		table: localStorage.getItem("table") ?? "",
		
		needValidation: localStorage.getItem("needValidation") ?? "1",
		error: "",
	};
	
	setOpenAtLogin = () => {
		app.setLoginItemSettings({
			openAtLogin: !this.state.startup
		});
		
		this.setState({
			startup: app.getLoginItemSettings().openAtLogin,
		});
	};
	
	validate = async () => {
		this.setState({
			error: "",
		});
		
		const validation = await window.api.validate();
		
		if (validation.ok) {
			localStorage.setItem("needValidation", "0");
			
			return this.setState({
				needValidation: "0",
			});
		}
		
		this.setState({
			error: validation.error,
		});
	};
	
	render() {
		return (
			<div id={"settings"}>
				<div id={"scroller"}>
					<div id={"group"}>
						<div id={"title"}>
							<h4>App</h4>
						</div>
						
						<div id={"options"}>
							<div id={"option"}>
								<div id={"left"}>
									<h5>Startup With System</h5>
								</div>
								<div id={"right"}>
									<div id={"switcher"}>
										<span className={this.state.startup ? "active" : ""} onClick={this.setOpenAtLogin}/>
										<h5 id={"state"} style={{width: "50px"}}>{this.state.startup ? "Enabled" : "Disabled"}</h5>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div id={"group"}>
						<div id={"title"}>
							<h4>Airtable</h4>
						</div>
						
						<div id={"options"}>
							<div id={"option"}>
								<div id={"left"}>
									<h5>Airtable Api Key</h5>
								</div>
								<div id={"right"}>
									<div id={"input"}>
										<input type="text" placeholder={"Enter your api key"} value={this.state.apiKey} onChange={e => this.setState({apiKey: e.target.value})}/>
									</div>
								</div>
							</div>
							<div id={"option"}>
								<div id={"left"}>
									<h5>Airtable Base Id</h5>
								</div>
								<div id={"right"}>
									<div id={"input"}>
										<input type="text" placeholder={"Enter your base id"} value={this.state.baseId} onChange={e => this.setState({baseId: e.target.value})}/>
									</div>
								</div>
							</div>
							<div id={"option"}>
								<div id={"left"}>
									<h5>Airtable Table Name</h5>
								</div>
								<div id={"right"}>
									<div id={"input"}>
										<input type="text" placeholder={"Enter your table name"} value={this.state.table} onChange={e => this.setState({table: e.target.value})}/>
									</div>
								</div>
							</div>
							{
								this.state.needValidation === "1" && (
									<React.Fragment>
										<div id={"option"}>
											<div id={"left"}>
												<h5>Airtable Validation</h5>
											</div>
											<div id={"right"}>
												<div id={"button"} onClick={this.validate}>
													<button type="button">Validate</button>
												</div>
											</div>
										</div>
										{
											this.state.error && (
												<div id={"option"}>
													<h5>{this.state.error}</h5>
												</div>
											)
										}
									</React.Fragment>
								)
							}
						</div>
					</div>
				</div>
			</div>
		);
	}
	
	componentDidMount() {
		const event = new CustomEvent("configure", {
			detail: {
				apiKey: this.state.apiKey,
				baseId: this.state.baseId,
				table: this.state.table,
			},
		});
		
		window.dispatchEvent(event);
	}
	
	componentDidUpdate(prevProps, prevState) {
		localStorage.setItem("apiKey", this.state.apiKey);
		localStorage.setItem("baseId", this.state.baseId);
		localStorage.setItem("table", this.state.table);
		
		const apiKeyChanged = this.state.apiKey !== prevState.apiKey;
		const baseIdChanged = this.state.baseId !== prevState.baseId;
		const tableChanged = this.state.table !== prevState.table;
		
		if (apiKeyChanged || baseIdChanged || tableChanged) {
			localStorage.setItem("needValidation", "1");
			this.setState({
				needValidation: "1",
			});
		}
		
		const event = new CustomEvent("configure", {
			detail: {
				apiKey: this.state.apiKey,
				baseId: this.state.baseId,
				table: this.state.table,
			},
		});
		
		window.dispatchEvent(event);
	}
}

export default Settings;
