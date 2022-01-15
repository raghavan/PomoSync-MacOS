import {AirtableBase} from "airtable/lib/airtable_base";
import Airtable from "airtable";

class Api {
  base: AirtableBase = null;
  
  apiKey = localStorage.getItem("apiKey") ?? "";
  baseId = localStorage.getItem("baseId") ?? "";
  table = localStorage.getItem("table") ?? "";
  
  constructor() {
    window.addEventListener("configure", (event: CustomEvent) => {
      const {apiKey, baseId, table} = event.detail;
      this.apiKey = apiKey ?? this.apiKey;
      this.baseId = baseId ?? this.baseId;
      this.table = table ?? this.table;
      
      if ((this.apiKey !== "") && (this.baseId !== "") && (this.table !== "")) {
        this.configure();
      }
    });
  }
  
  configure = () => {
    Airtable.configure({
      endpointUrl: "https://api.airtable.com",
      apiKey: this.apiKey,
    });
    this.base = Airtable.base(this.baseId);
  };
  
  validate = async (): Promise<{ ok: boolean, error?: string }> => {
    if (this.isConfigure() !== true) return {
      ok: false,
      error: "Airtable details should not be empty",
    };
    
    return new Promise<{ ok: boolean, error?: string }>((resolve) => {
      this.base(this.table).select({
        maxRecords: 1,
        view: "Grid view",
        fields: ["activity", "start-time", "end-time"],
      }).firstPage((error) => {
        if (error) return resolve({
          ok: false,
          error: error.message,
        });
        
        return resolve({
          ok: true
        });
      });
    });
  };
  
  isConfigure = () => {
    return (this.apiKey !== "") && (this.baseId !== "") && (this.table !== "");
  };
  
  sendActivity = async (activity, startTime, endTime) => {
    return this.base(this.table).create([
      {
        "fields": {
          "activity": activity,
          "start-time": startTime,
          "stop-time": endTime
        }
      }
    ]);
  };
}

export default Api;
