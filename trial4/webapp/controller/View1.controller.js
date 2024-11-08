sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "../model/view1Set",
    "../model/formatter"
],
    // function (Controller, JSONModel, dataSet) {
    function (Controller, JSONModel, view1Set, formatter) {
        "use strict";

        return Controller.extend("trial4.controller.View1", {
            formatter: formatter,
            onInit: function () {
                // const url = "https://run.mocky.io/v3/60441514-2cd0-47c7-9510-4c9362db2b8e"
                const oModel = new JSONModel(view1Set)
                // oModel.loadData(url)
                this.getView().setModel(oModel, "Products")
                // this.callToDB()
                var oComboBox = this.byId("_IDGenComboBox");
                var oGenSelect = this.byId("_IDGenSelect");
               

                oComboBox.bindAggregation("items", {
                    path: "Products>/Suppliers/",
                    template: new sap.ui.core.Item({
                        text: "{Products>Name}"
                    }),
                    templateShareable: true
                });
                oGenSelect.bindAggregation("items", {
                    path: "Products>/Categories/",
                    template: new sap.ui.core.Item({
                        text: "{Products>Name}"
                    }),
                    templateShareable: true
                });
                

            },
            formatAvailableToObjectState: function (available) {
                return available ? "Success" : "Error";
            },
            formatAvailableToIcon(available) {
                return available ? "Success" : "Error";
            },
            
            // callToDB: async function () {
            //     let that = this;
            //     return new Promise(function (resolve, reject) {
            //         let appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
            //         let appPath = appId.replaceAll(".", "/");
            //         let appModulePath = jQuery.sap.getModulePath(appPath);
            //         $.ajax({
            //             url: appModulePath + "/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet",
            //             type: "GET",
            //             dataType: "json",
            //             success: function (data) {
            //                 resolve(that.getView().setModel(new JSONModel(data.d.results), "listModel"));
            //             },
            //             error: function (err, textStatus) {
            //                 reject(MessageBox.error(textStatus));
            //             }
            //         });
            //     });
            //     this.getView().getModel("listModel")?.refresh()

            // },

        });

    });

