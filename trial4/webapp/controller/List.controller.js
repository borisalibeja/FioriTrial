sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
],
    function (Controller, MessageBox, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("trial4.controller.List", {
            onInit: function () {
                this.oFilterBar = this.getView().byId("filterbar");
                this.oTable = this.getView().byId("table");
                this.callToDB()
            },

            navNext: function (index) {
                this.getOwnerComponent().getRouter().navTo("RouteDetail", {
                    index: index
                });
            },

            callToDB: async function () {
                let that = this;
                return new Promise(function (resolve, reject) {
                    let appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
                    let appPath = appId.replaceAll(".", "/");
                    let appModulePath = jQuery.sap.getModulePath(appPath);
                    $.ajax({
                        url: appModulePath + "/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/",
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

            onSearch: function () {
                var aTableFilters = this.oFilterBar.getFilterGroupItems().reduce(function (aResult, oFilterGroupItem) {
                    var oControl = oFilterGroupItem.getControl(),
                        sValue = oControl.getValue(),
                        filter;
                    if (oControl.getId().includes("Name1")) {
                        filter = new Filter({
                            filters: [new Filter({
                                path: "Name1",
                                operator: FilterOperator.Contains,
                                value1: sValue
                            }),
                            new Filter({
                                path: "Name2",
                                operator: FilterOperator.Contains,
                                value1: sValue
                            })],
                            and: false
                        });
                    } else {
                        filter = new Filter({
                            path: oFilterGroupItem.getName(),
                            operator: FilterOperator.Contains,
                            value1: sValue
                        })
                    }
                    aResult.push(filter);
                    return aResult;
                }, []);

                this.oTable.getBinding("items").filter(aTableFilters);
                this.oTable.setShowOverlay(false);
            },


            onTableSelection: function (oEvent) {
                let tableIndex = oEvent.getSource().getBindingContext("listModel").getObject().Kunnr;
                this.navNext(tableIndex);
            },


            onCellClick:function(oEvent){
                //Do Something!
            }


        });
    });