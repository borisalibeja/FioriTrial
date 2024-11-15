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
                    that._csrfToken = jqXHR.getResponseHeader("X-CSRF-Token");

                    if (data && data.d) {
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
            let oView = this.getView();
            let aRequiredFields = [
                oView.byId("_IDGenInput9"),  // First Name
                oView.byId("_IDGenInput10"), // Last Name
                oView.byId("_IDGenInput11"), // Tax Number 1
                oView.byId("_IDGenInput13"), // Email
                oView.byId("_IDGenInput16")  // Telephone Number
            ];

            let bValidationError = false;

            // Validate required fields
            aRequiredFields.forEach((oInput) => {
                if (!oInput.getValue()) {
                    oInput.setValueState("Error");
                    bValidationError = true;
                } else {
                    oInput.setValueState("None");
                }
            });

            if (bValidationError) {
                MessageBox.error("Please fill all required fields.");
                return; // Stop execution if validation fails
            }

            let oUpdatedData = oView.getModel("recordModel").getData();

            if (!this._csrfToken) {
                MessageBox.error("CSRF token is missing. Please try again.");
                return;
            }

            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);
            let sUrl = `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${this.sKunnr}')`;

            $.ajax({
                url: sUrl,
                type: "PUT",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": this._csrfToken
                },
                data: JSON.stringify(oUpdatedData),
                success: () => {
                    sap.m.MessageToast.show("Record updated successfully!");
                    sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated"); // Notify the main view
                    this.getOwnerComponent().getRouter().navTo("RouteView1");
                },
                error: (err) => {
                    MessageBox.error("Failed to update record: " + err.statusText);
                }
            });
        },
        onCancel: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }
    });
});
