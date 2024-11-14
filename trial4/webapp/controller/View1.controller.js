 
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    
],
function (Controller, JSONModel, MessageBox, MessageToast) {
    "use strict";
 
    return Controller.extend("trial4.controller.View1", {
        
        onInit: function () {
            this.calltoDB();        // Existing data load function
        },

        onPress: function()  {
            this.getOwnerComponent().getRouter().navTo("RouteView2");
        },

        onDeleteRecord: function () {
            let oTable = this.byId("_IDGenTable1"); // Get reference to the table
            let aSelectedIndices = oTable.getSelectedIndices(); // Get selected row indices

            if (aSelectedIndices.length === 0) {
                MessageBox.warning("Please select a record to delete.");
                return;
            }

            let aSelectedRows = []; // Array to store selected Kunnr values
            let oModel = this.getView().getModel("listModel");

            // Loop through selected rows to get Kunnr values
            aSelectedIndices.forEach((iIndex) => {
                let oContext = oTable.getContextByIndex(iIndex);
                let sKunnr = oContext.getProperty("Kunnr");
                aSelectedRows.push(sKunnr);
            });

            // Define appModulePath for backend URL
            let appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            let appPath = appId.replaceAll(".", "/");
            let appModulePath = jQuery.sap.getModulePath(appPath);

            // Perform the delete operation
            this._deleteRecords(aSelectedRows, appModulePath, () => {
                 this.calltoDB(); // Refresh the data after deletion
            });
        },

        _deleteRecords: function (aSelectedRows, appModulePath, callBack) {
            let aPromises = []; // Handle multiple delete requests if multiple rows are selected
        
            aSelectedRows.forEach((sKunnr) => {
                let oDeletePromise = new Promise((resolve, reject) => {
                    $.ajax({
                        url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${sKunnr}')`,
                        type: "DELETE",
                        headers: {
                            "X-CSRF-Token": this._csrfToken // Pass the CSRF token in the headers
                        },
                        statusCode: {
                            204: () => { // Check for 204 No Content as a successful deletion
                                MessageToast.show(`Record with Kunnr ${sKunnr} deleted successfully.`);
                                resolve();
                            }
                        },
                        success: () => {
                            // Fallback success handler if 200 OK is returned instead of 204
                            MessageToast.show(`Record with Kunnr ${sKunnr} deleted successfully.`);
                            resolve();
                        },
                        error: (err) => {
                            // Show error message and reject the promise if error occurs
                            MessageBox.error(`Failed to delete record with Kunnr ${sKunnr}.`);
                            reject(err);
                        }
                    });
                });
        
                aPromises.push(oDeletePromise);
            });
        
            // After all delete requests are complete, execute the callback function (e.g., to refresh data)
            Promise.all(aPromises)
                .then(() => {
                    if (typeof callBack === "function") {
                        callBack(); // Execute the callback (refresh data, etc.)
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
                let oModel = new JSONModel()

                // AJAX request to load data
                $.ajax({
                    url: appModulePath + "/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet",
                    type: "GET",
                    dataType: "json",
                    headers: {
                        "X-CSRF-Token": "Fetch"
                    },
                    success: function (data, textStatus, jqXHR) {
                        that._csrfToken = jqXHR.getResponseHeader("X-CSRF-Token");
                        oModel.setData(data.d)                              //set data on oModel
                        that.getView().setModel(oModel, "listModel");       // Set model to view with name "listModel"
                        resolve();                                          // Resolve the promise
                    },
                    error: function (err, textStatus) {
                        MessageBox.error("Error loading data: " + textStatus);
                        reject(err);
                    }
                });
            });
        },

        onSearch: function (oEvent) {
            // Get the search value
            let sQuery = oEvent.getParameter("newValue");
            let oTable = this.byId("_IDGenTable1");
            let oBinding = oTable.getBinding("rows");
        
            // Create filters for each column in the table
            let aFilters = [];
            if (sQuery) {
                // Define an array of field names to include in the search
                let aFields = [
                    "Kunnr",       // Customer Number
                    "Name1",       // Name (Line 1)
                    "Name2",       // Name (Line 2)
                    "Stcd1",       // Tax Number 1
                    "Stcd2",       // Tax Number 2
                    "Smtp_addr",   // Email Address
                    "Street",      // Street Address
                    "City1",       // City
                    "Tel_number",  // Telephone Number
                    "Stkzn"        // Deletion Indicator
                ];
        
                // Create a filter for each field, checking if it contains the search query
                aFields.forEach((field) => {
                    aFilters.push(new sap.ui.model.Filter(field, sap.ui.model.FilterOperator.Contains, sQuery));
                });
        
                // Combine the individual field filters with OR logic
                aFilters = new sap.ui.model.Filter({
                    filters: aFilters,
                    and: false // false indicates "OR" between the filters
                });
            }
        
            // Apply the filters to the table binding
            oBinding.filter(aFilters);
        },
        
        onLanguageSelect: function (oEvent1) {
            // Get the language code from the button's custom data
            let sLanguageCode = oEvent1.getSource().getCustomData()[0].getValue();
            this.changeLanguage(sLanguageCode);
        },
        
        changeLanguage: function (sLanguageCode) {
            // Create a new resource model with the selected language
            let oResourceModel = new sap.ui.model.resource.ResourceModel({
                bundleName: "trial4.i18n.i18n",
                bundleLocale: sLanguageCode
            });
        
            // Set the model on the view or globally on the core
            this.getView().setModel(oResourceModel, "i18n");
            sap.ui.getCore().setModel(oResourceModel, "i18n");

            this.getView().rerender();
        },
        
        handleDetailsPress: function (oEvent) {
            let buttonPressed = oEvent.getSource();
            let context = buttonPressed.getBindingContext('listModel');
            let kunnrSelected = context.getProperty('Kunnr');
        
            // Pad Kunnr to 10 digits with leading zeros
            let paddedKunnr = kunnrSelected.padStart(10, '0');
            console.log("Selected Kunnr (padded):", paddedKunnr);
        
            // Navigate to the details view with the padded Kunnr
            this.getOwnerComponent().getRouter().navTo('RouteDetails', {
                Kunnr: paddedKunnr
            });
        },
        onAddRecord: function () {
            // Navigate to the AddRecord view
            this.getOwnerComponent().getRouter().navTo("RouteAddRecord");
        },
        
        onEditRecord: function (oEvent) {
            // Here you can pass the selected record details if necessary
            this.getOwnerComponent().getRouter().navTo("RouteEditRecord");
        }
    });
});
 
 
 
 
 