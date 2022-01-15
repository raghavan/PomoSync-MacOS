import * as React from "react";

import {getCurrentWindow} from "@electron/remote";

import Settings from "./settings";
import Timer from "./timer";

import "./index.scss";

class App extends React.Component {
  state = {
    main: "timer"
  };
  
  renderHeader = () => {
    const close = () => {
      getCurrentWindow().hide();
      getCurrentWindow().close();
    };
    const toggleSettings = () => {
      const main = this.state.main;
      this.setState({
        main: main === "timer" ? "settings" : "timer",
      });
    };
    
    return (
      <header>
        <span>PomoSync</span>
        <div id={"control"}>
          
          <div id={"main-toggle"}>
            <div id={"wrapper"} className={this.state.main}>
              <div id={"open-settings"} onClick={toggleSettings}>
                <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M8.06168 12.8333H5.93835C5.80531 12.8333 5.67626 12.7879 5.5726 12.7045C5.46894 12.6211 5.3969 12.5048 5.36843 12.3748L5.13101 11.2758C4.8143 11.137 4.51398 10.9635 4.2356 10.7584L3.16401 11.0997C3.03718 11.1401 2.90032 11.136 2.77617 11.0879C2.65202 11.0398 2.54804 10.9507 2.48151 10.8354L1.41751 8.99732C1.35168 8.8819 1.32697 8.74755 1.34742 8.61626C1.36787 8.48497 1.43228 8.3645 1.5301 8.27457L2.36135 7.51624C2.32355 7.17272 2.32355 6.82609 2.36135 6.48257L1.5301 5.72599C1.43214 5.63602 1.36765 5.51545 1.34719 5.38403C1.32674 5.25261 1.35153 5.11814 1.41751 5.00266L2.47918 3.16341C2.54571 3.04809 2.64968 2.959 2.77383 2.91093C2.89798 2.86286 3.03484 2.85871 3.16168 2.89916L4.23326 3.24041C4.3756 3.13541 4.52376 3.03741 4.6766 2.94874C4.82418 2.86591 4.97585 2.79066 5.13101 2.72357L5.36901 1.62574C5.39735 1.49577 5.46925 1.37939 5.5728 1.29589C5.67635 1.2124 5.80533 1.1668 5.93835 1.16666H8.06168C8.1947 1.1668 8.32368 1.2124 8.42723 1.29589C8.53078 1.37939 8.60268 1.49577 8.63101 1.62574L8.87135 2.72416C9.18788 2.86293 9.488 3.03647 9.76618 3.24157L10.8383 2.90032C10.9651 2.86002 11.1018 2.86426 11.2259 2.91232C11.3499 2.96038 11.4538 3.04938 11.5203 3.16457L12.5819 5.00382C12.7173 5.24124 12.6706 5.54166 12.4693 5.72657L11.6381 6.48491C11.6759 6.82843 11.6759 7.17506 11.6381 7.51857L12.4693 8.27691C12.6706 8.46241 12.7173 8.76224 12.5819 8.99966L11.5203 10.8389C11.4537 10.9542 11.3498 11.0433 11.2256 11.0914C11.1015 11.1395 10.9646 11.1436 10.8378 11.1032L9.76618 10.7619C9.48801 10.9669 9.18788 11.1402 8.87135 11.2787L8.63101 12.3748C8.60257 12.5047 8.53061 12.6209 8.42707 12.7043C8.32354 12.7877 8.19462 12.8332 8.06168 12.8333ZM4.44501 9.46691L4.92335 9.81691C5.03126 9.89624 5.14326 9.96916 5.25993 10.0357C5.3696 10.0992 5.4816 10.1564 5.59768 10.2083L6.14193 10.4469L6.40851 11.6667H7.59268L7.85926 10.4463L8.40351 10.2077C8.64093 10.1027 8.86668 9.97266 9.0761 9.81924L9.55443 9.46924L10.7456 9.84841L11.3377 8.82291L10.4143 7.98116L10.4796 7.39082C10.5088 7.13241 10.5088 6.87166 10.4796 6.61382L10.4143 6.02349L11.3383 5.17999L10.7456 4.15391L9.55501 4.53307L9.0761 4.18307C8.86657 4.02889 8.64108 3.89767 8.40351 3.79166L7.85926 3.55307L7.59268 2.33332H6.40851L6.14018 3.55366L5.59768 3.79166C5.35979 3.89584 5.13421 4.02614 4.9251 4.18016L4.44618 4.53016L3.25618 4.15099L2.66293 5.17999L3.58635 6.02057L3.52101 6.61149C3.49185 6.86991 3.49185 7.13066 3.52101 7.38849L3.58635 7.97882L2.66293 8.82057L3.25501 9.84607L4.44501 9.46691ZM6.99768 9.33332C6.37884 9.33332 5.78535 9.08749 5.34776 8.64991C4.91018 8.21232 4.66435 7.61883 4.66435 6.99999C4.66435 6.38115 4.91018 5.78766 5.34776 5.35007C5.78535 4.91249 6.37884 4.66666 6.99768 4.66666C7.61652 4.66666 8.21001 4.91249 8.6476 5.35007C9.08518 5.78766 9.33101 6.38115 9.33101 6.99999C9.33101 7.61883 9.08518 8.21232 8.6476 8.64991C8.21001 9.08749 7.61652 9.33332 6.99768 9.33332ZM6.99768 5.83332C6.76922 5.83355 6.54586 5.90086 6.3553 6.02688C6.16475 6.1529 6.01539 6.3321 5.92575 6.54224C5.83611 6.75238 5.81014 6.98421 5.85107 7.20897C5.89199 7.43374 5.998 7.64154 6.15596 7.8066C6.31391 7.97166 6.51685 8.08671 6.73959 8.13748C6.96234 8.18825 7.19509 8.17251 7.40897 8.0922C7.62284 8.01189 7.80844 7.87056 7.94272 7.68573C8.077 7.5009 8.15407 7.28072 8.16435 7.05249V7.28582V6.99999C8.16435 6.69057 8.04143 6.39383 7.82264 6.17503C7.60385 5.95624 7.3071 5.83332 6.99768 5.83332Z"
                    fill="#202733"/>
                </svg>
              </div>
              <div id={"open-timer"} onClick={toggleSettings}>
                <svg viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd"
                        d="M6.50024 11C6.63283 11 6.76 10.9473 6.85375 10.8536C6.94751 10.7598 7.00018 10.6326 7.00018 10.5001V4.7077L9.14594 6.85446C9.19243 6.90095 9.24761 6.93782 9.30834 6.96297C9.36908 6.98813 9.43417 7.00108 9.4999 7.00108C9.56564 7.00108 9.63073 6.98813 9.69147 6.96297C9.7522 6.93782 9.80738 6.90095 9.85387 6.85446C9.90035 6.80798 9.93722 6.7528 9.96238 6.69207C9.98753 6.63133 10.0005 6.56624 10.0005 6.5005C10.0005 6.43477 9.98753 6.36967 9.96238 6.30894C9.93722 6.24821 9.90035 6.19302 9.85387 6.14654L6.8542 3.14688C6.80776 3.10032 6.75259 3.06338 6.69185 3.03818C6.63111 3.01297 6.566 3 6.50024 3C6.43448 3 6.36937 3.01297 6.30863 3.03818C6.24789 3.06338 6.19272 3.10032 6.14628 3.14688L3.14662 6.14654C3.05274 6.24042 3 6.36774 3 6.5005C3 6.63326 3.05274 6.76059 3.14662 6.85446C3.24049 6.94834 3.36781 7.00108 3.50058 7.00108C3.63334 7.00108 3.76066 6.94834 3.85454 6.85446L6.0003 4.7077V10.5001C6.0003 10.6326 6.05297 10.7598 6.14673 10.8536C6.24048 10.9473 6.36765 11 6.50024 11Z"
                        fill="#202733"/>
                </svg>
              </div>
            </div>
          </div>
          <div id={"close"} onClick={close}>
            <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5.5875 5L7.37917 3.2125C7.45763 3.13404 7.50171 3.02762 7.50171 2.91666C7.50171 2.8057 7.45763 2.69929 7.37917 2.62083C7.30071 2.54237 7.1943 2.49829 7.08334 2.49829C6.97238 2.49829 6.86596 2.54237 6.7875 2.62083L5 4.4125L3.2125 2.62083C3.13405 2.54237 3.02763 2.49829 2.91667 2.49829C2.80571 2.49829 2.6993 2.54237 2.62084 2.62083C2.54238 2.69929 2.4983 2.8057 2.4983 2.91666C2.4983 3.02762 2.54238 3.13404 2.62084 3.2125L4.4125 5L2.62084 6.7875C2.58178 6.82623 2.55079 6.87231 2.52963 6.92309C2.50848 6.97386 2.49759 7.02832 2.49759 7.08333C2.49759 7.13833 2.50848 7.19279 2.52963 7.24357C2.55079 7.29434 2.58178 7.34043 2.62084 7.37916C2.65957 7.41821 2.70566 7.44921 2.75643 7.47037C2.80721 7.49152 2.86167 7.50241 2.91667 7.50241C2.97168 7.50241 3.02614 7.49152 3.07691 7.47037C3.12769 7.44921 3.17377 7.41821 3.2125 7.37916L5 5.5875L6.7875 7.37916C6.82624 7.41821 6.87232 7.44921 6.9231 7.47037C6.97387 7.49152 7.02833 7.50241 7.08334 7.50241C7.13834 7.50241 7.1928 7.49152 7.24358 7.47037C7.29435 7.44921 7.34044 7.41821 7.37917 7.37916C7.41822 7.34043 7.44922 7.29434 7.47038 7.24357C7.49153 7.19279 7.50242 7.13833 7.50242 7.08333C7.50242 7.02832 7.49153 6.97386 7.47038 6.92309C7.44922 6.87231 7.41822 6.82623 7.37917 6.7875L5.5875 5Z"
                fill="white"/>
            </svg>
          </div>
        </div>
      </header>
    );
  };
  
  renderMain = () => {
    return (
      <main>
        <div id={"wrapper"} className={this.state.main}>
          <Timer/>
          <Settings/>
        </div>
      </main>
    );
  };
  
  render() {
    return (
      <React.Fragment>
        <this.renderHeader/>
        <this.renderMain/>
      </React.Fragment>
    );
  }
}

export default App;