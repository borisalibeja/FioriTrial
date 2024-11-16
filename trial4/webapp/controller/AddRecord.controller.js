sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "trial4/utils/CSRFTokenManager",
    "sap/m/MessageBox",
    "sap/m/MessageToast"
], function (Controller, CSRFTokenManager, MessageBox, MessageToast) {
    "use strict";

    return Controller.extend("trial4.controller.AddRecord", {

        onSave: function () {

            // Retrieve the CSRF token from CSRFTokenManager
            const csrfToken = CSRFTokenManager.getToken();

            // Check if the CSRF token is available
            if (!csrfToken) {
                MessageBox.error("CSRF token is not available. Please fetch it first.");
                return;
            }

            // Retrieve data from input fields
            let oView = this.getView();
            let aRequiredFields = [
                oView.byId("_IDGenInput"),  // First Name
                oView.byId("_IDGenInput1"), // Last Name
                oView.byId("_IDGenInput4"), // Email
                oView.byId("_IDGenInput7"), // Tel Number
                oView.byId("_IDGenInput2")  // Tax Number 1
            ];
        
            let bValidationError = false;
        
            // Validate required fields
            aRequiredFields.forEach((oInput) => {
                if (!oInput.getValue()) {
                    oInput.setValueState("Error"); // Highlight the field in red
                    bValidationError = true;
                } else {
                    oInput.setValueState("None"); // Reset to normal if valid
                }
            });
        
            if (bValidationError) {
                sap.m.MessageBox.error("Please fill all required fields.");
                return; // Stop execution if validation fails
            }
        
            let oNewRecordData = {
                Name1: oView.byId("_IDGenInput").getValue(),
                Name2: oView.byId("_IDGenInput1").getValue(),
                Stcd1: oView.byId("_IDGenInput2").getValue(),
                Stcd2: oView.byId("_IDGenInput3").getValue(),
                SmtpAddr: oView.byId("_IDGenInput4").getValue(),
                Street: oView.byId("_IDGenInput5").getValue(),
                City1: oView.byId("_IDGenInput6").getValue(),
                TelNumber: oView.byId("_IDGenInput7").getValue(),
                Stkzn: oView.byId("_IDGenInput8").getValue()
            };
        
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);
        
            // Send POST request to add the new record
            $.ajax({
                url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet`,
                type: "POST",
                contentType: "application/json",
                headers: {
                    "X-CSRF-Token": csrfToken // Use the retrieved CSRF token
                },
                data: JSON.stringify(oNewRecordData),
                success: () => {
                    sap.m.MessageToast.show("Record added successfully!");
                    this._clearInputs();

                    // HIGHLIGHTED CHANGE: Publish dataUpdated event to refresh main view
                    console.log("Publishing dataUpdated event after record addition");
                    sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated");

                    this.getOwnerComponent().getRouter().navTo("RouteView1");
                },
                error: (err) => {
                    sap.m.MessageBox.error("Failed to add record: " + err.statusText);
                }
            });
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
