 
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
    
],
function (Controller, JSONModel, MessageBox, Filter, FilterOperator) {
    "use strict";
 
    return Controller.extend("trial4.controller.View2", {
        
        onPress: function()  {
            this.getOwnerComponent().getRouter().navTo("RouteView1");
        },
    });
});
 
 
 
 
 