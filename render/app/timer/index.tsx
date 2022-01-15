import * as React from "react";

import {app} from "@electron/remote";
import * as path from "path";

import "./index.scss";
import Timeout = NodeJS.Timeout;

interface State {
	start: boolean;
	mode: "free-count" | "count-down";
	timer: number;
	activity: string;
	startTime: Date,
	endTime: Date,
}

const alert = path.join(app.getAppPath(), "static/alert.mp3");

class Timer extends React.Component<any> {
	timer: Timeout;
	alert = new Audio(alert);
	
	state: State = {
		start: false,
		mode: "count-down",
		timer: 1500,
		startTime: null,
		endTime: null,
		activity: ""
	};
	
	parseTimer = (timer = null) => {
		timer = timer === null ? this.state.timer : timer;
		
		const minutes = Math.floor(timer % 3600 / 60);
		const seconds = Math.floor(timer % 3600 % 60);
		
		return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`;
	};
	
	toggleMode = (mode: State["mode"]) => {
		if (this.state.start) return;
		
		if (mode === "free-count") {
			return this.setState({
				mode: "free-count",
				timer: 0,
			});
		}
		
		return this.setState({
			mode: "count-down",
			timer: 1500,
		});
	};
	
	startCountDown = () => {
		this.setState({
			timer: 1500,
			startTime: new Date(),
			start: true,
		});
		
		this.timer = setInterval(() => {
			if (this.state.timer === 0) {
				clearInterval(this.timer);
				return this.setState({
					start: false,
					endTime: new Date(),
				}, () => {
					this.alert.play().then(() => {
						this.save();
					});
				});
			}
			
			this.setState({
				timer: this.state.timer - 1,
			});
		}, 1000);
	};
	startFreeCount = () => {
		this.setState({
			timer: 0,
			start: true,
			startTime: new Date(),
		});
		
		this.timer = setInterval(() => {
			this.setState({
				timer: this.state.timer + 1,
			});
		}, 1000);
	};
	
	save = () => {
		const activity = this.state.activity;
		
		window.api.sendActivity(activity, this.state.startTime, this.state.endTime).then(() => {
			this.setState({
				activity: ""
			});
		});
	};
	
	start = () => {
		if (window.api.isConfigure() !== true) {
			return window.alert("please configure airtable api");
		}
		
		if (this.state.start) {
			clearInterval(this.timer);
			return this.setState({
				start: false,
				endTime: new Date(),
			}, () => this.save());
		}
		
		return this.state.mode === "free-count" ? (
			this.startFreeCount()
		) : (
			this.startCountDown()
		);
	};
	
	render() {
		return (
			<div id={"timer"}>
				<div id={"time"}>
					<span>{this.parseTimer()}</span>
				</div>
				<div id={"form"}>
					<div id={"mode"}>
						<div id={"wrapper"} className={this.state.mode}>
							<div id={"count-down"} onClick={() => this.toggleMode("free-count")}>
								<svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M4.77398 14V13.16C4.77398 12.976 4.80198 12.816 4.85798 12.68C4.91798 12.544 5.01398 12.424 5.14598 12.32C5.28198 12.212 5.45998 12.11 5.67998 12.014L6.42398 11.684C6.60798 11.6 6.74798 11.498 6.84398 11.378C6.94398 11.254 6.99398 11.096 6.99398 10.904C6.99398 10.692 6.92998 10.524 6.80198 10.4C6.67798 10.272 6.49998 10.208 6.26798 10.208C6.03598 10.208 5.85598 10.272 5.72798 10.4C5.60398 10.528 5.54198 10.706 5.54198 10.934H4.71998C4.71998 10.662 4.77798 10.418 4.89398 10.202C5.00998 9.982 5.18198 9.81 5.40998 9.686C5.63798 9.558 5.92398 9.494 6.26798 9.494C6.61198 9.494 6.89798 9.556 7.12598 9.68C7.35398 9.804 7.52598 9.97 7.64198 10.178C7.75798 10.382 7.81598 10.61 7.81598 10.862V10.94C7.81598 11.268 7.72398 11.542 7.53998 11.762C7.35598 11.978 7.08598 12.166 6.72998 12.326L5.98598 12.656C5.84598 12.716 5.74798 12.78 5.69198 12.848C5.63598 12.912 5.60798 13 5.60798 13.112V13.496L5.40398 13.274H7.83398V14H4.77398ZM9.7337 14.114C9.3897 14.114 9.0937 14.046 8.8457 13.91C8.6017 13.774 8.4137 13.594 8.2817 13.37C8.1537 13.142 8.0897 12.894 8.0897 12.626H8.9117C8.9117 12.778 8.9457 12.912 9.0137 13.028C9.0857 13.144 9.1837 13.236 9.3077 13.304C9.4317 13.368 9.5757 13.4 9.7397 13.4C9.9117 13.4 10.0597 13.364 10.1837 13.292C10.3077 13.22 10.4017 13.122 10.4657 12.998C10.5337 12.874 10.5677 12.732 10.5677 12.572C10.5677 12.416 10.5337 12.276 10.4657 12.152C10.4017 12.024 10.3077 11.924 10.1837 11.852C10.0637 11.776 9.9177 11.738 9.7457 11.738C9.6017 11.738 9.4657 11.766 9.3377 11.822C9.2097 11.878 9.1097 11.952 9.0377 12.044H8.2517L8.4737 9.62H11.0117V10.346H8.8457L9.1457 10.112L9.0017 11.624L8.7977 11.564C8.9137 11.432 9.0557 11.322 9.2237 11.234C9.3917 11.146 9.6037 11.102 9.8597 11.102C10.1837 11.102 10.4597 11.168 10.6877 11.3C10.9157 11.432 11.0897 11.608 11.2097 11.828C11.3297 12.044 11.3897 12.28 11.3897 12.536V12.614C11.3897 12.874 11.3257 13.118 11.1977 13.346C11.0697 13.574 10.8817 13.76 10.6337 13.904C10.3897 14.044 10.0897 14.114 9.7337 14.114Z"
										fill="#202733"/>
									<path
										d="M7.25 0.5C7.1837 0.5 7.12011 0.526339 7.07322 0.573223C7.02634 0.620107 7 0.683696 7 0.75C7 0.816304 7.02634 0.879893 7.07322 0.926777C7.12011 0.973661 7.1837 1 7.25 1H8.75C8.8163 1 8.87989 0.973661 8.92678 0.926777C8.97366 0.879893 9 0.816304 9 0.75C9 0.683696 8.97366 0.620107 8.92678 0.573223C8.87989 0.526339 8.8163 0.5 8.75 0.5H7.25ZM11 4.5C11 6.15675 9.65675 7.5 8 7.5C6.34325 7.5 5 6.15675 5 4.5C5 2.84325 6.34325 1.5 8 1.5C9.65675 1.5 11 2.84325 11 4.5ZM8.25 3C8.25 2.9337 8.22366 2.87011 8.17678 2.82322C8.12989 2.77634 8.0663 2.75 8 2.75C7.9337 2.75 7.87011 2.77634 7.82322 2.82322C7.77634 2.87011 7.75 2.9337 7.75 3V4.5C7.75 4.5663 7.77634 4.62989 7.82322 4.67678C7.87011 4.72366 7.9337 4.75 8 4.75C8.0663 4.75 8.12989 4.72366 8.17678 4.67678C8.22366 4.62989 8.25 4.5663 8.25 4.5V3ZM10.3232 1.57325C10.3701 1.52638 10.4337 1.50005 10.5 1.50005C10.5663 1.50005 10.6299 1.52638 10.6768 1.57325L11.1768 2.07325C11.2006 2.09631 11.2197 2.1239 11.2328 2.1544C11.2459 2.1849 11.2528 2.2177 11.2531 2.2509C11.2534 2.28409 11.247 2.31701 11.2345 2.34774C11.2219 2.37846 11.2033 2.40638 11.1798 2.42985C11.1564 2.45332 11.1285 2.47189 11.0977 2.48446C11.067 2.49703 11.0341 2.50335 11.0009 2.50306C10.9677 2.50277 10.9349 2.49588 10.9044 2.48278C10.8739 2.46967 10.8463 2.45063 10.8232 2.42675L10.3232 1.92675C10.2764 1.87987 10.2501 1.81629 10.2501 1.75C10.2501 1.68371 10.2764 1.62013 10.3232 1.57325V1.57325Z"
										fill="#202733"/>
								</svg>
							</div>
							<div id={"free-count"} onClick={() => this.toggleMode("count-down")}>
								<svg viewBox="0 0 10 12" fill="none" xmlns="http://www.w3.org/2000/svg">
									<path
										d="M7.66939 9.31619C7.70508 9.36209 7.73176 9.41487 7.7479 9.47152C7.76403 9.52817 7.76931 9.58758 7.76344 9.64636C7.75756 9.70514 7.74065 9.76214 7.71365 9.8141C7.68666 9.86606 7.65012 9.91197 7.60612 9.9492L5.30542 11.8992C5.22852 11.9644 5.13245 12 5.03336 12C4.93427 12 4.8382 11.9644 4.7613 11.8992L2.4606 9.9492C2.41606 9.91213 2.37899 9.86622 2.35155 9.81413C2.3241 9.76204 2.30683 9.70479 2.30071 9.64569C2.2946 9.58659 2.29976 9.52682 2.31592 9.46981C2.33208 9.41281 2.3589 9.35971 2.39483 9.31358C2.43077 9.26745 2.47511 9.22921 2.5253 9.20106C2.57549 9.17291 2.63052 9.15541 2.68723 9.14957C2.74393 9.14373 2.80119 9.14967 2.85568 9.16704C2.91018 9.18441 2.96083 9.21288 3.00472 9.25079L5.03336 10.9704L7.062 9.25079C7.10602 9.21346 7.15665 9.18556 7.21102 9.16867C7.26538 9.15178 7.3224 9.14625 7.37882 9.15238C7.43524 9.15851 7.48994 9.17619 7.5398 9.2044C7.58966 9.23261 7.6337 9.2708 7.66939 9.31679V9.31619ZM0.964572 4.49092C1.27689 4.49092 1.51501 4.59773 1.68009 4.81193C1.84574 5.02553 1.92972 5.33334 1.93374 5.73354V6.28315C1.93374 6.69595 1.85207 7.01216 1.68814 7.23116C1.52422 7.44956 1.28437 7.55876 0.969173 7.55876C0.656853 7.55876 0.418155 7.45136 0.25308 7.23656C0.0880047 7.02236 0.00345403 6.71455 2.97507e-06 6.31375V5.76414C-0.0005722 5.34714 0.082253 5.03093 0.247903 4.81493C0.414129 4.59893 0.652827 4.49092 0.964572 4.49092ZM3.27448 4.49092C3.5868 4.49092 3.82492 4.59773 3.99057 4.81193C4.15564 5.02553 4.24019 5.33334 4.24365 5.73354V6.28315C4.24365 6.69595 4.16197 7.01216 3.99805 7.23116C3.83412 7.44956 3.59427 7.55876 3.27908 7.55876C2.96676 7.55876 2.72806 7.45136 2.56298 7.23656C2.39791 7.02236 2.31336 6.71455 2.30991 6.31375V5.76414C2.30991 5.34714 2.39216 5.03093 2.55838 4.81493C2.72403 4.59893 2.96273 4.49092 3.27448 4.49092ZM6.72093 4.49092C7.03267 4.49092 7.27137 4.59773 7.43644 4.81193C7.60152 5.02553 7.68607 5.33334 7.6901 5.73354V6.28315C7.6901 6.69595 7.60842 7.01216 7.4445 7.23116C7.28057 7.44956 7.04072 7.55876 6.72495 7.55876C6.41321 7.55876 6.17451 7.45136 6.00943 7.23656C5.84436 7.02236 5.75981 6.71455 5.75578 6.31375V5.76414C5.75578 5.34714 5.83861 5.03093 6.00426 4.81493C6.16991 4.59893 6.40918 4.49092 6.72093 4.49092ZM9.03083 4.49092C9.34315 4.49092 9.58127 4.59773 9.74635 4.81193C9.91142 5.02553 9.99597 5.33334 10 5.73354V6.28315C10 6.69595 9.91832 7.01216 9.7544 7.23116C9.59048 7.44956 9.35063 7.55876 9.03486 7.55876C8.72311 7.55876 8.48441 7.45136 8.31934 7.23656C8.15426 7.02236 8.06971 6.71455 8.06569 6.31375V5.76414C8.06569 5.34714 8.14851 5.03093 8.31416 4.81493C8.48039 4.59893 8.71908 4.49092 9.03083 4.49092ZM5.03336 6.59995C5.12654 6.59995 5.20361 6.62935 5.26458 6.68815C5.29479 6.71733 5.3186 6.75297 5.33438 6.79263C5.35017 6.83229 5.35755 6.87504 5.35603 6.91796C5.35755 6.96032 5.35026 7.00252 5.33467 7.04167C5.31909 7.08081 5.29557 7.11598 5.26573 7.14476C5.20221 7.20403 5.1191 7.23523 5.03394 7.23176C4.94924 7.23491 4.8667 7.20349 4.80387 7.14416C4.774 7.1155 4.75042 7.08046 4.73474 7.04142C4.71905 7.00238 4.71163 6.96026 4.71299 6.91796C4.71299 6.82376 4.74347 6.74695 4.80502 6.68815C4.86727 6.62894 4.94916 6.59731 5.03336 6.59995ZM0.964572 4.97093C0.831131 4.97093 0.732201 5.02493 0.668932 5.13173C0.605663 5.23913 0.571152 5.40714 0.567701 5.63574V6.36175C0.567701 6.60475 0.599335 6.78535 0.66318 6.90356C0.726449 7.02176 0.828255 7.08116 0.968598 7.08116C1.10779 7.08116 1.20787 7.02416 1.26941 6.91076C1.33096 6.79675 1.36317 6.62395 1.36604 6.38995V5.68014C1.36604 5.43294 1.33326 5.25293 1.26826 5.14013C1.20384 5.02733 1.10261 4.97093 0.964572 4.97093ZM3.27448 4.97093C3.14104 4.97093 3.0421 5.02493 2.97884 5.13173C2.91557 5.23913 2.88106 5.40714 2.8776 5.63574V6.36175C2.8776 6.60475 2.90924 6.78535 2.97308 6.90356C3.03635 7.02176 3.13816 7.08116 3.2785 7.08116C3.41769 7.08116 3.51777 7.02416 3.57932 6.91076C3.64086 6.79675 3.67307 6.62395 3.67595 6.38995V5.68014C3.67595 5.43294 3.64316 5.25293 3.57817 5.14013C3.51375 5.02733 3.41252 4.97093 3.27448 4.97093ZM6.72093 4.97093C6.58748 4.97093 6.48855 5.02493 6.42529 5.13173C6.36202 5.23913 6.32751 5.40714 6.32405 5.63574V6.36175C6.32405 6.60475 6.35569 6.78535 6.41896 6.90356C6.48223 7.02176 6.58461 7.08116 6.72495 7.08116C6.86357 7.08116 6.96422 7.02416 7.02577 6.91076C7.08731 6.79675 7.11952 6.62395 7.12182 6.38995V5.68014C7.12182 5.43294 7.08961 5.25293 7.02462 5.14013C6.95962 5.02733 6.85839 4.97093 6.72093 4.97093ZM9.03083 4.97093C8.89739 4.97093 8.79846 5.02493 8.73519 5.13173C8.68227 5.22113 8.65006 5.35254 8.63798 5.52594L8.63396 5.63514V6.36115C8.63396 6.60475 8.66559 6.78535 8.72886 6.90356C8.79271 7.02176 8.89451 7.08116 9.03486 7.08116C9.17405 7.08116 9.27413 7.02416 9.33567 6.91076C9.38744 6.81596 9.41792 6.67975 9.4277 6.50155L9.4323 6.38995V5.68014C9.4323 5.43294 9.39952 5.25293 9.33452 5.14013C9.26953 5.02733 9.1683 4.97093 9.03083 4.97093ZM5.03336 4.91993C5.12654 4.91993 5.20361 4.94933 5.26458 5.00813C5.29471 5.03724 5.31848 5.07278 5.33426 5.11233C5.35004 5.15188 5.35747 5.19452 5.35603 5.23733C5.35755 5.2797 5.35026 5.3219 5.33467 5.36104C5.31909 5.40019 5.29557 5.43536 5.26573 5.46414C5.20221 5.52341 5.1191 5.55461 5.03394 5.55114C4.94932 5.55445 4.86679 5.52325 4.80387 5.46414C4.77393 5.43541 4.7503 5.40027 4.73461 5.36112C4.71893 5.32197 4.71155 5.27974 4.71299 5.23733C4.71299 5.14313 4.74347 5.06693 4.80502 5.00813C4.86727 4.94892 4.94916 4.91728 5.03336 4.91993ZM2.46175 2.05069L4.76245 0.100666C4.83045 0.0430652 4.91365 0.0084246 5.00099 0.00135075C5.08832 -0.00572311 5.17564 0.015105 5.25135 0.0610651L5.30599 0.100666L7.6067 2.05069C7.6911 2.12231 7.74644 2.22455 7.76164 2.33694C7.77684 2.44932 7.75076 2.56354 7.68865 2.65672C7.62653 2.7499 7.53295 2.81515 7.42667 2.83941C7.32038 2.86366 7.20923 2.84512 7.1155 2.7875L7.06315 2.7491L5.03336 1.02948L3.00472 2.7491C2.92015 2.82019 2.81299 2.85539 2.70464 2.84767C2.59628 2.83995 2.4947 2.78988 2.42019 2.70745C2.34568 2.62502 2.30371 2.51631 2.30267 2.40301C2.30164 2.28972 2.3416 2.18019 2.41459 2.09629L2.4606 2.05069L4.7613 0.100666L2.4606 2.05069H2.46175Z"
										fill="#202733"/>
								</svg>
							</div>
						</div>
					</div>
					<div id={"activity"}>
						<input type="text" placeholder={"Activity"} value={this.state.activity} onChange={e => this.setState({activity: e.target.value})}/>
					</div>
					<div id={"start"}>
						<button type="button" className={this.state.start && "stop"} onClick={this.start}>
							{
								this.state.start ? "Stop" : "Start"
							}
						</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Timer;
