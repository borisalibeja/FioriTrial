 
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    
],
function (Controller, JSONModel, MessageBox) {
    "use strict";
 
    return Controller.extend("fioriekpo.controller.ekpo1", {
        
        onInit: function () {
            this.calltoDB();        // Existing data load function
        },

        
 
        calltoDB: function () {
            let that = this;
            return new Promise(function (resolve, reject) {
                let appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
                let appPath = appId.replaceAll(".", "/");
                let appModulePath = jQuery.sap.getModulePath(appPath);
                let oModel = new JSONModel()

                // AJAX request to load data
                $.ajax({
                    url: appModulePath + "/odata/sap/ZBA_FIORI_EKPO_SERVICE_SRV/FioriEkpoSet",
                    type: "GET",
                    dataType: "json",
                    success: function (data) {
                        oModel.setData(data.d)                              //set data on oModel
                        that.getView().setModel(oModel, "listModel");       // Set model to view with name "listModel"
                        resolve();                                          // Resolve the promise
                    },
                    error: function (err, textStatus) {
                        MessageBox.error("Error loading data: " + textStatus);
                        reject(err);
                    }
                });
            });
        }
    });
});
 
 
 
 
 