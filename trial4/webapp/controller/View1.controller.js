sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("trial4.controller.View1", {
            onInit: function () {
                const url = "https://run.mocky.io/v3/60441514-2cd0-47c7-9510-4c9362db2b8e"
                const oModel = new JSONModel()
                oModel.loadData(url)
                this.getView().setModel(oModel, "Products")
            }
        });
    });
