sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    // "../model/dataSet.js"
],
    // function (Controller, JSONModel, dataSet) {
     function (Controller, JSONModel) {
        "use strict";

        return Controller.extend("trial4.controller.View1", {
            onInit: function () {
                const url = "https://run.mocky.io/v3/60441514-2cd0-47c7-9510-4c9362db2b8e"
                const oModel = new JSONModel()
                oModel.loadData(url)
                this.getView().setModel(oModel, "Products")
                this.callToDB()
            },
            callToDB: async function () {
                let that = this;
                return new Promise(function (resolve, reject) {
                    let appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
                    let appPath = appId.replaceAll(".", "/");
                    let appModulePath = jQuery.sap.getModulePath(appPath);
                    $.ajax({
                        url: appModulePath + "/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet",
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            resolve(that.getView().setModel(new JSONModel(data.d.results), "listModel"));
                        },
                        error: function (err, textStatus) {
                            reject(MessageBox.error(textStatus));
                        }
                    });
                });
                this.getView().getModel("listModel")?.refresh()
               
            },

        });

    });

