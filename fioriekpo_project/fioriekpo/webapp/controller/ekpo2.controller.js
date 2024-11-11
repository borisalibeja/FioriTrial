 
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    
],
function (Controller, JSONModel, MessageBox, Filter, FilterOperator) {
    "use strict";
 
    return Controller.extend("fioriekpo.controller.ekpo2", {
        
        onInit: function () {
            this.calltoDB();        // Existing data load function
        },

        onPress: function()  {
            this.getOwnerComponent().getRouter().navTo("Routeekpo1");
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
                    url: appModulePath + "/odata/sap/opu/odata/sap/ZBA_FIORI_EKPO_SERVICE_SRV/FioriEkpoSet",
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
        },
        
        onPlantSearch: function (oEvent) {
            // Get the search value
            let sQuery = oEvent.getParameter("newValue");
            let oTable = this.byId("_IDGenTable1");
            let oBinding = oTable.getBinding("rows");

            // Create filter for plant (Werks)
            let aFilters = [];
            if (sQuery) {
                aFilters.push(new Filter("Werks", FilterOperator.Contains, sQuery));
            }

            // Apply the filter to the table binding
            oBinding.filter(aFilters);
        },
        
    });
});
 
 
 
 
 