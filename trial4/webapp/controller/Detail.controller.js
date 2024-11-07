sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
],
    function (Controller, MessageBox, JSONModel, Filter, FilterOperator) {
        "use strict";

        return Controller.extend("freestyleapp.controller.List", {
            onInit: function () {
                this.getOwnerComponent().getRouter().getRoute("RouteDetail").attachPatternMatched(this._onObjectMatched, this);
            },

            _onObjectMatched: function (oEvent) {
                let index = oEvent.getParameter("arguments").index;
                if (!index) this.getOwnerComponent().getRouter().navTo("RouteList");
                else {
                    this.getSingleClient(index);
                }
            },

            getSingleClient: function (i) {
                let that = this;
               
                return new Promise(function (resolve, reject) {
                    let appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
                    let appPath = appId.replaceAll(".", "/");
                    let appModulePath = jQuery.sap.getModulePath(appPath);
                    $.ajax({
                        url: appModulePath + `/odata/sap/opu/odata/sap/ZACA_CUSTOM_SRV/zcustomerSet('${i}')`,
                        type: "GET",
                        dataType: "json",
                        success: function (data) {
                            resolve(that.getView().setModel(new JSONModel(data.d), "detailModel"));
                        },
                        error: function (err, textStatus) {
                            reject(MessageBox.error(textStatus));
                        }
                    });
                });
            }
        })
    });