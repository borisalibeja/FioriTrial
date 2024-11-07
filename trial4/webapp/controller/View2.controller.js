sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
     "../model/dataSet"
],
    // function (Controller, JSONModel, dataSet) {
     function (Controller, JSONModel, dataSet) {
        "use strict";

        return Controller.extend("trial4.controller.View2", {
            onInit: function () {
                // const url = "https://run.mocky.io/v3/60441514-2cd0-47c7-9510-4c9362db2b8e"
                const oModel = new JSONModel(dataSet)
                // oModel.loadData(model/dataSet.js)
                this.getView().setModel(oModel, "DataModel")
                
            },
            onBeforeExport: function (oEvt) {
                var mExcelSettings = oEvt.getParameter("exportSettings");
                // Check if URL-based export is configured
                if (mExcelSettings.url) {
                    return;
                }
                // For UI5 Client Export: Modify output settings for Excel export
    
                // Disable Worker as this is a local setup --> Do not use this for real applications!
                mExcelSettings.worker = false;
            }

        });
    }
)
    

