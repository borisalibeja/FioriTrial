 
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    
],
function (Controller, JSONModel, MessageBox, Filter, FilterOperator) {
    "use strict";
 
    return Controller.extend("trial4.controller.View1", {
        
        onInit: function () {
            this.calltoDB();        // Existing data load function
        },

        onPress: function()  {
            this.getOwnerComponent().getRouter().navTo("RouteView2");
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
                    success: function (data) {
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
 
 
 
 
 