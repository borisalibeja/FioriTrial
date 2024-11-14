sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("trial4.controller.AddRecord", {

        onSave: function () {
            // Logic to save the new record, such as an OData POST request
            MessageToast.show("Record added successfully!");
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        onCancel: function () {
            // Navigate back to the main view
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }

    });
});
