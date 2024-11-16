sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "trial4/utils/CSRFTokenManager",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
],
function (Controller, CSRFTokenManager, JSONModel, MessageBox, MessageToast) {
    "use strict";
 
    return Controller.extend("trial4.controller.View1", {
        
        onInit: function () {
            this.calltoDB(); // Load initial data

            // Subscribe to the EventBus for data updates
            sap.ui.getCore().getEventBus().subscribe("dataChannel", "dataUpdated", this._onDataUpdated, this);
        },

        _onDataUpdated: function () {
            this.calltoDB(); // Reload data when the event is received
        },

        onPress: function() {
            this.getOwnerComponent().getRouter().navTo("RouteView2");
        },

        onDeleteRecord: function () {
            let oTable = this.byId("_IDGenTable1"); // Get reference to the table
            let aSelectedIndices = oTable.getSelectedIndices(); // Get selected row indices
        
            if (aSelectedIndices.length === 0) {
                MessageBox.warning("Please select at least one record to delete.");
                return;
            }
        
            let aSelectedRows = []; // Array to store selected Kunnr values and names for the message
        
            aSelectedIndices.forEach((iIndex) => {
                let oContext = oTable.getContextByIndex(iIndex);
                let sKunnr = oContext.getProperty("Kunnr");
                let sCustomerName = oContext.getProperty("Name1");
                aSelectedRows.push({ Kunnr: sKunnr, CustomerName: sCustomerName });
            });
        
            // Create a confirmation message listing all selected customers
            let sMessage = "Are you sure you want to delete the following records?\n\n";
            aSelectedRows.forEach((record) => {
                sMessage += `- ${record.CustomerName} (Customer No: ${record.Kunnr})\n`;
            });
        
            MessageBox.confirm(sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.YES) {
                        let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
                        let appPath = appId.replaceAll(".", "/");
                        let appModulePath = jQuery.sap.getModulePath(appPath);
        
                        // Extract Kunnr values for deletion
                        let aKunnrValues = aSelectedRows.map(row => row.Kunnr);
        
                        // Proceed with deletion
                        this._deleteRecords(aKunnrValues, appModulePath, () => {
                            sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated");
                        });
                    }
                }
            });
        },
        
        _deleteRecords: function (aSelectedRows, appModulePath, callBack) {
            // Retrieve the CSRF token from CSRFTokenManager
            const csrfToken = CSRFTokenManager.getToken();

            // Check if the CSRF token is available
            if (!csrfToken) {
                MessageBox.error("CSRF token is not available. Please fetch it first.");
                return;
            }

            let aPromises = [];

            // Iterate over selected rows to create delete requests
            aSelectedRows.forEach((sKunnr) => {
                let oDeletePromise = new Promise((resolve, reject) => {
                    $.ajax({
                        url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${sKunnr}')`,
                        type: "DELETE",
                        headers: {
                            "X-CSRF-Token": csrfToken // Use the retrieved CSRF token
                        },
                        success: () => {
                            MessageToast.show(`Record with Kunnr ${sKunnr} deleted successfully.`);
                            resolve();
                        },
                        error: (err) => {
                            MessageBox.error(`Failed to delete record with Kunnr ${sKunnr}.`);
                            reject(err);
                        }
                    });
                });
                aPromises.push(oDeletePromise);
            });

            // Handle all delete requests
            Promise.all(aPromises)
                .then(() => {
                    if (typeof callBack === "function") {
                        callBack();
                    }
                })
                .catch((err) => console.error("Error in deletion:", err));
        },

        calltoDB: function () {
            let that = this;
            return new Promise(function (resolve, reject) {
                let appId = that.getOwnerComponent().getManifestEntry("/sap.app/id");
                let appPath = appId.replaceAll(".", "/");
                let appModulePath = jQuery.sap.getModulePath(appPath);
                let oModel = new JSONModel();

                $.ajax({
                    url: appModulePath + "/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet",
                    type: "GET",
                    dataType: "json",
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    success: function (data, textStatus, jqXHR) {
                        let token = jqXHR.getResponseHeader("X-CSRF-Token");

                        CSRFTokenManager.setToken(token); // Directly use the imported CSRFTokenManager
                
                        oModel.setData(data.d);
                        that.getView().setModel(oModel, "listModel");
                        resolve();
                    },
                    error: function (err) {
                        MessageBox.error("Error loading data: " + err.statusText);
                        reject(err);
                    }
                });
            });
        },

        onSearch: function (oEvent) {
            let sQuery = oEvent.getParameter("newValue");
            let oTable = this.byId("_IDGenTable1");
            let oBinding = oTable.getBinding("rows");
        
            let aFilters = [];
            if (sQuery) {
                let aFields = [
                    "Kunnr", "Name1", "Name2", "Stcd1", "Stcd2",
                    "Smtp_addr", "Street", "City1", "Tel_number", "Stkzn"
                ];

                aFields.forEach((field) => {
                    aFilters.push(new sap.ui.model.Filter(field, sap.ui.model.FilterOperator.Contains, sQuery));
                });

                aFilters = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false
                });
            }

            oBinding.filter(aFilters);
        },
        
        onLanguageSelect: function (oEvent1) {
            let sLanguageCode = oEvent1.getSource().getCustomData()[0].getValue();
            this.changeLanguage(sLanguageCode);
        },
        
        changeLanguage: function (sLanguageCode) {
            let oResourceModel = new sap.ui.model.resource.ResourceModel({
                bundleName: "trial4.i18n.i18n",
                bundleLocale: sLanguageCode
            });
        
            this.getView().setModel(oResourceModel, "i18n");
            sap.ui.getCore().setModel(oResourceModel, "i18n");

            this.getView().rerender();
        },

        handleDetailsPress: function (oEvent) {
            let buttonPressed = oEvent.getSource();
            let context = buttonPressed.getBindingContext('listModel');
            let kunnrSelected = context.getProperty('Kunnr');

            this.getOwnerComponent().getRouter().navTo('RouteDetails', {
                Kunnr: kunnrSelected
            });
        },

        onAddRecord: function () {
            this.getOwnerComponent().getRouter().navTo("RouteAddRecord");
            sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated");
        },

        onEditRecord: function () {
            let oTable = this.byId("_IDGenTable1");
            let aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                MessageBox.warning("Please select a record to edit.");
                return;
            }

            if (aSelectedIndices.length > 1) {
                MessageBox.warning("Please select only one record to edit.");
                return;
            }

            let iIndex = aSelectedIndices[0];
            let oContext = oTable.getContextByIndex(iIndex);
            let sKunnr = oContext.getProperty("Kunnr");

            if (!sKunnr) {
                MessageBox.error("Failed to retrieve Kunnr from the selected row.");
                return;
            }

            this.getOwnerComponent().getRouter().navTo("RouteEditRecord", {
                Kunnr: sKunnr
            });

            sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated");
        }
    });
});
