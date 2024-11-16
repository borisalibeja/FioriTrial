sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "trial4/utils/CSRFTokenManager",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, CSRFTokenManager, JSONModel, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("trial4.controller.EditRecord", {

        onInit: function () {
            // Attach pattern-matched handler to load data when the route is matched
            this.getOwnerComponent().getRouter().getRoute("RouteEditRecord").attachPatternMatched(this._onObjectMatched, this);
        },

        _onObjectMatched: function (oEvent) {
            // Retrieve the Kunnr parameter from the route
            this.sKunnr = oEvent.getParameter("arguments").Kunnr;

            // Fetch data for the specified Kunnr
            this._fetchRecordData(this.sKunnr);
        },

        _fetchRecordData: function (sKunnr) {

            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);

            let oModel = new JSONModel();
            let that = this;

            // AJAX request to get record data and CSRF token
            $.ajax({
                url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${sKunnr}')`,
                type: "GET",
                dataType: "json",
                success: function (data) {
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

            // Retrieve the CSRF token from CSRFTokenManager
            const csrfToken = CSRFTokenManager.getToken();

            // Check if the CSRF token is available
            if (!csrfToken) {
                MessageBox.error("CSRF token is not available. Please fetch it first.");
                return;
            }

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

            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);

            $.ajax({
                url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${this.sKunnr}')`,
                type: "PUT",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": csrfToken // Use the retrieved CSRF token
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
