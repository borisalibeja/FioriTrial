sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("trial4.controller.AddRecord", {

        onInit: function () {
            this._fetchCsrfToken(); // Fetch CSRF token when initializing
        },

        _fetchCsrfToken: function () {
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);
            let that = this;

            $.ajax({
                url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/`, // Endpoint for CSRF token
                type: "GET",
                headers: {
                    "X-CSRF-Token": "Fetch"
                },
                success: function (data, textStatus, jqXHR) {
                    // Store the CSRF token for later use
                    that._csrfToken = jqXHR.getResponseHeader("X-CSRF-Token");
                },
                error: function () {
                    MessageBox.error("Failed to fetch CSRF token.");
                }
            });
        },

        onSave: function () {
            // Retrieve data from input fields
            let oNewRecordData = {
                Name1: this.byId("_IDGenInput").getValue(),
                Name2: this.byId("_IDGenInput1").getValue(),
                Stcd1: this.byId("_IDGenInput2").getValue(),
                Stcd2: this.byId("_IDGenInput3").getValue(),
                SmtpAddr: this.byId("_IDGenInput4").getValue(),
                Street: this.byId("_IDGenInput5").getValue(),
                City1: this.byId("_IDGenInput6").getValue(),
                TelNumber: this.byId("_IDGenInput7").getValue(),
                Stkzn: this.byId("_IDGenInput8").getValue()
            };

            // Ensure the CSRF token is available
            if (!this._csrfToken) {
                MessageBox.error("CSRF token is missing. Please try again.");
                return;
            }

            // Define appModulePath for the backend URL
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);

            // Send POST request to add the new record
            $.ajax({
                url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet`, // Adjust endpoint as necessary
                type: "POST",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": this._csrfToken // Use the CSRF token
                },
                data: JSON.stringify(oNewRecordData), // Send data as JSON
                success: () => {
                    MessageToast.show("Record added successfully!");
                    // Clear the input fields after adding the record
                    this._clearInputs();
                },
                error: (err) => {
                    MessageBox.error("Failed to add record: " + err.statusText);
                }
            });
             this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        _clearInputs: function () {
            // Reset each input field in the view
            this.byId("_IDGenInput").setValue("");
            this.byId("_IDGenInput1").setValue("");
            this.byId("_IDGenInput2").setValue("");
            this.byId("_IDGenInput3").setValue("");
            this.byId("_IDGenInput4").setValue("");
            this.byId("_IDGenInput5").setValue("");
            this.byId("_IDGenInput6").setValue("");
            this.byId("_IDGenInput7").setValue("");
            this.byId("_IDGenInput8").setValue("");
        },

        onCancel: function () {
            // Optionally, navigate back or reset the form on cancel
            this.getOwnerComponent().getRouter().navTo("RouteView1"); // Replace with actual route
        }
    });
});
