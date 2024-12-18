/**
 * @namespace trial4.controller
 * @class
 * Controller for the details view.
 * Handles navigation to details, data fetching for a specific customer, and model binding.
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
    "use strict";

    return Controller.extend("trial4.controller.details", {

        /**
         * Initializes the controller.
         * Attaches a pattern-matched event to handle route navigation to the details view.
         * @public
         */
        onInit: function () {
            this.getOwnerComponent().getRouter()
                .getRoute("RouteDetails")
                .attachPatternMatched(this._onObjectMatched, this);
        },

        /**
         * Navigates back to the main view (RouteView1).
         * @public
         */
        onPress: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },

        /**
         * Handles the route pattern-matched event when navigating to the details view.
         * Fetches customer data for the specified `Kunnr` and binds it to the view.
         * @private
         * @param {sap.ui.base.Event} oEvent - Event triggered when the route pattern matches.
         */
        _onObjectMatched: function (oEvent) {
            const sKunnr = oEvent.getParameter("arguments").Kunnr;

            // Fetch and bind data for the specified customer
            this._fetchCustomerData(sKunnr)
                .then((data) => {
                    const oModel = new JSONModel(data);
                    this.getView().setModel(oModel, "detailsModel");
                })
                .catch((err) => {
                    MessageBox.error(err.message);
                });
        },

        /**
         * Fetches customer data for a specific `Kunnr` via an AJAX request.
         * @private
         * @param {string} sKunnr - Customer ID for the record to fetch.
         * @returns {Promise<Object>} Resolves with customer data or rejects with an error message.
         */
        _fetchCustomerData: function (sKunnr) {
            const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            const appPath = appId.replaceAll(".", "/");
            const appModulePath = jQuery.sap.getModulePath(appPath);

            return new Promise((resolve, reject) => {
                $.ajax({
                    url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${sKunnr}')`,
                    type: "GET",
                    dataType: "json",
                    success: (data) => {
                        if (data && data.d) {
                            resolve(data.d);
                        } else {
                            reject(new Error("No data found for the specified Kunnr"));
                        }
                    },
                    error: (err) => {
                        reject(new Error("Error fetching data: " + err.statusText));
                    }
                });
            });
        }
    });
});
