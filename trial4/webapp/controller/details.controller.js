sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("trial4.controller.details", {

        onInit: function () {
            // Attach the route pattern matched event to call _onObjectMatched when RouteDetails is accessed
            this.getOwnerComponent().getRouter().getRoute("RouteDetails").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            // Retrieve the Kunnr parameter from the route
            let sKunnr = oEvent.getParameter("arguments").Kunnr;

            // Construct the URL for fetching the specific customer data based on Kunnr
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);
        
            // Create a new JSONModel to store the fetched customer data
            let oModel = new JSONModel();
            let that = this;

            // Make an AJAX call to fetch the specific record
            $.ajax({
                
                url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${sKunnr}')`,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    // Check if data was returned
                    if (data && data.d) {
                        // Set the data as the model for the details view
                        oModel.setData(data.d);
                        that.getView().setModel(oModel, "detailsModel");
                    } else {
                        MessageBox.error("No data found for the specified Kunnr");
                    }
                },
                error: function (err) {
                    MessageBox.error("Error fetching data: " + err.statusText);
                }
            });
        }
    });
});
