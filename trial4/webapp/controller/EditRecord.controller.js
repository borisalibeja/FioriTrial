sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast"
], function (Controller, MessageToast) {
    "use strict";

    return Controller.extend("trial4.controller.EditRecord", {

        onSaveChanges: function () {
            // Logic to save the edited record, such as an OData PUT/PATCH request
            MessageToast.show("Record updated successfully!");
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        onCancel: function () {
            // Navigate back to the main view
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        }

    });
});
