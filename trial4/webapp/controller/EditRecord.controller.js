sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("trial4.controller.EditRecord", {

        onInit: function () {
            // Attach pattern-matched handler to load data when the route is matched
            this.getOwnerComponent().getRouter().getRoute("RouteEditRecord").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            // Retrieve the Kunnr parameter from the route
            this.sKunnr = oEvent.getParameter("arguments").Kunnr;

            // Fetch data for the specified Kunnr, including the CSRF token
            this._fetchRecordData(this.sKunnr);
        },

        _fetchRecordData: function (sKunnr) {
            // Construct the URL for fetching the record data
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);
            let sUrl = `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${sKunnr}')`;

            let oModel = new JSONModel();
            let that = this;

            // AJAX request to get record data and CSRF token
            $.ajax({
                url: sUrl,
                type: "GET",
                dataType: "json",
                headers: {
                    "X-CSRF-Token": "Fetch" // Request CSRF token
                },
                success: function (data, textStatus, jqXHR) {
                    // Store CSRF token for later use
                    that._csrfToken = jqXHR.getResponseHeader("X-CSRF-Token");

                    if (data && data.d) {
                        // Populate the model with fetched data and bind to input fields
                        oModel.setData(data.d);
                        that.getView().setModel(oModel, "recordModel");
                    } else {
                        MessageBox.error("No data found for the specified Kunnr.");
                    }
                },
                error: function (err) {
                    MessageBox.error("Error fetching data: " + err.statusText);
                }
            });
        },

        onSaveChanges: function () {
            // Get the updated data from the input fields
            let oUpdatedData = this.getView().getModel("recordModel").getData();

            // Ensure CSRF token is available
            if (!this._csrfToken) {
                MessageBox.error("CSRF token is missing. Please try again.");
                return;
            }

            // Define appModulePath for the backend URL
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);

            // Construct URL for updating the record
            let sUrl = `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${this.sKunnr}')`;

            // PUT request to update the record with new data
            $.ajax({
                url: sUrl,
                type: "PUT",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": this._csrfToken // Use the stored CSRF token
                },
                data: JSON.stringify(oUpdatedData), // Send updated data as JSON
                success: () => {
                    MessageToast.show("Record updated successfully!");
                    this.getOwnerComponent().getRouter().navTo("RouteView1"); // Adjust to navigate back as needed
                },
                error: (err) => {
                    MessageBox.error("Failed to update record: " + err.statusText);
                }
            });
        },

        onCancel: function () {
            // Navigate back to the previous route
            this.getOwnerComponent().getRouter().navTo("RouteView1"); // Adjust with actual route as needed
        }
    });
});
