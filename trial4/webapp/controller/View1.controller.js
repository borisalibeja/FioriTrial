/**
 * @namespace trial4.controller
 * @class
 * Main controller for the Trial 4 application.
 * Handles data fetching, CRUD operations, navigation, and event subscriptions.
 */
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "trial4/utils/CSRFTokenManager",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (Controller, CSRFTokenManager, JSONModel, MessageBox, MessageToast, Filter, FilterOperator) {
    "use strict";

    return Controller.extend("trial4.controller.View1", {

        /**
         * Initializes the controller.
         * Loads initial data and subscribes to event updates.
         * @public
         */
        onInit: function () {
            this._callToDB(); // Load initial data
            sap.ui.getCore().getEventBus().subscribe("dataChannel", "dataUpdated", this._onDataUpdated, this);
        },

        /**
         * Event handler for the "dataUpdated" event.
         * Reloads data from the database.
         * @private
         */
        _onDataUpdated: function () {
            this._callToDB();
        },

        /**
         * Navigates to the secondary view.
         * @public
         */
        onPress: function () {
            this.getOwnerComponent().getRouter().navTo("RouteView2");
        },

        /**
         * Deletes selected records from the table after confirmation.
         * @public
         */
        onDeleteRecord: function () {
            const oTable = this.byId("_IDGenTable1");
            const aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                MessageBox.warning("Please select at least one record to delete.");
                return;
            }

            const aSelectedRows = aSelectedIndices.map((iIndex) => {
                const oContext = oTable.getContextByIndex(iIndex);
                return {
                    Kunnr: oContext.getProperty("Kunnr"),
                    CustomerName: oContext.getProperty("Name1")
                };
            });

            const sMessage = "Are you sure you want to delete the following records?\n\n" +
                aSelectedRows.map(record => `- ${record.CustomerName} (Customer No: ${record.Kunnr})`).join("\n");

            MessageBox.confirm(sMessage, {
                actions: [MessageBox.Action.YES, MessageBox.Action.NO],
                onClose: (oAction) => {
                    if (oAction === MessageBox.Action.YES) {
                        const aKunnrValues = aSelectedRows.map(row => row.Kunnr);
                        this._deleteRecords(aKunnrValues, () => {
                            sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated");
                        });
                    }
                }
            });
        },

        /**
         * Deletes multiple records by sending DELETE requests to the OData service.
         * @private
         * @param {Array} aKunnrValues - List of customer numbers to delete.
         * @param {Function} callBack - Callback function to execute after deletion.
         */
        _deleteRecords: function (aKunnrValues, callBack) {
            const csrfToken = CSRFTokenManager.getToken();

            if (!csrfToken) {
                MessageBox.error("CSRF token is not available. Please fetch it first.");
                return;
            }

            const appModulePath = this._getAppModulePath();
            const aPromises = aKunnrValues.map((sKunnr) =>
                new Promise((resolve, reject) => {
                    $.ajax({
                        url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet(Kunnr='${sKunnr}')`,
                        type: "DELETE",
                        headers: { "X-CSRF-Token": csrfToken },
                        success: () => {
                            MessageToast.show(`Record with Kunnr ${sKunnr} deleted successfully.`);
                            resolve();
                        },
                        error: (err) => {
                            MessageBox.error(`Failed to delete record with Kunnr ${sKunnr}.`);
                            reject(err);
                        }
                    });
                })
            );

            Promise.all(aPromises)
                .then(() => callBack && callBack())
                .catch((err) => console.error("Error in deletion:", err));
        },

        /**
         * Fetches data from the database and sets it in the model.
         * @private
         */
        _callToDB: function () {
            const appModulePath = this._getAppModulePath();
            const oModel = new JSONModel();

            $.ajax({
                url: `${appModulePath}/odata/sap/opu/odata/sap/ZBA_TEST_PROJECT_SRV/zba_testSet`,
                type: "GET",
                dataType: "json",
                headers: { "X-CSRF-Token": "Fetch" },
                success: (data, textStatus, jqXHR) => {
                    const token = jqXHR.getResponseHeader("X-CSRF-Token");
                    CSRFTokenManager.setToken(token);
                    oModel.setData(data.d);
                    this.getView().setModel(oModel, "listModel");
                },
                error: (err) => {
                    MessageBox.error("Error loading data: " + err.statusText);
                }
            });
        },

        /**
         * Filters the table based on the search query.
         * @public
         * @param {sap.ui.base.Event} oEvent - Event containing the search query.
         */
        onSearch: function (oEvent) {
            const sQuery = oEvent.getParameter("newValue");
            const oBinding = this.byId("_IDGenTable1").getBinding("rows");

            const aFilters = sQuery ? [
                "Kunnr", "Name1", "Name2", "Stcd1", "Stcd2",
                "Smtp_addr", "Street", "City1", "Tel_number", "Stkzn"
            ].map(field => new Filter(field, FilterOperator.Contains, sQuery)) : [];

            oBinding.filter(aFilters.length ? new Filter(aFilters, false) : []);
        },

        /**
         * Changes the application language.
         * @public
         * @param {sap.ui.base.Event} oEvent - Event containing the selected language.
         */
        onLanguageSelect: function (oEvent) {
            const sLanguageCode = oEvent.getSource().getCustomData()[0].getValue();
            const oResourceModel = new sap.ui.model.resource.ResourceModel({
                bundleName: "trial4.i18n.i18n",
                bundleLocale: sLanguageCode
            });

            this.getView().setModel(oResourceModel, "i18n");
            sap.ui.getCore().setModel(oResourceModel, "i18n");
            this.getView().rerender();
        },

        /**
         * Navigates to the details page for the selected customer.
         * @public
         * @param {sap.ui.base.Event} oEvent - Event containing the selected context.
         */
        handleDetailsPress: function (oEvent) {
            const kunnrSelected = oEvent.getSource().getBindingContext("listModel").getProperty("Kunnr");
            this.getOwnerComponent().getRouter().navTo("RouteDetails", { Kunnr: kunnrSelected });
        },

        /**
         * Navigates to the "Add Record" page.
         * @public
         */
        onAddRecord: function () {
            this.getOwnerComponent().getRouter().navTo("RouteAddRecord");
            sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated");
        },

        /**
         * Navigates to the "Edit Record" page for the selected record.
         * @public
         */
        onEditRecord: function () {
            const oTable = this.byId("_IDGenTable1");
            const aSelectedIndices = oTable.getSelectedIndices();

            if (aSelectedIndices.length === 0) {
                MessageBox.warning("Please select a record to edit.");
                return;
            }

            if (aSelectedIndices.length > 1) {
                MessageBox.warning("Please select only one record to edit.");
                return;
            }

            const sKunnr = oTable.getContextByIndex(aSelectedIndices[0]).getProperty("Kunnr");

            if (!sKunnr) {
                MessageBox.error("Failed to retrieve Kunnr from the selected row.");
                return;
            }

            this.getOwnerComponent().getRouter().navTo("RouteEditRecord", { Kunnr: sKunnr });
            sap.ui.getCore().getEventBus().publish("dataChannel", "dataUpdated");
        },

        /**
         * Retrieves the application module path from the manifest.
         * @private
         * @returns {string} Application module path.
         */
        _getAppModulePath: function () {
            const appId = this.getOwnerComponent().getManifestEntry("/sap.app/id");
            return jQuery.sap.getModulePath(appId.replaceAll(".", "/"));
        }
    });
});
