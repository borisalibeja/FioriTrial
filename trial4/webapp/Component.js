/**
 * eslint-disable @sap/ui5-jsdocs/no-jsdoc
 */

sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "trial4/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";

        return UIComponent.extend("trial4.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
                this.getRolesAttribute();
            },
            getRolesAttribute(){
                
                let appId = this.getManifestEntry("/sap.app/id");
				let appPath = appId.replaceAll(".", "/");
				let appModulePath = jQuery.sap.getModulePath(appPath);
 
				     
			    //let url = appModulePath + "/user-api/currentUser$";
                let url = appModulePath + "/user-api/attributes$";
                let that = this;
                $.ajax({
                    url: url,
                    method: "GET",
                    async: false,
                    
                    success: function (result, xhr, data) {
                       // that.setModel(new sap.ui.model.json.JSONModel(result), "UserInfo");
                       console.log("ok");
                       
                    },
                    error: function (xhr, status, error) {
                        console.log(error);
                       
                    }
                });
            }
        });
    }
);