/*global QUnit*/

sap.ui.define([
	"fioriekpo/controller/ekpo1.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ekpo1 Controller");

	QUnit.test("I should test the ekpo1 controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
