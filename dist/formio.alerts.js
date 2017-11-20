import { Injectable } from '@angular/core';
var FormioAlerts = (function () {
    function FormioAlerts() {
        this.alerts = [];
    }
    FormioAlerts.prototype.setAlert = function (alert) {
        this.alerts = [alert];
    };
    FormioAlerts.prototype.addAlert = function (alert) {
        this.alerts.push(alert);
    };
    FormioAlerts.prototype.setAlerts = function (alerts) {
        this.alerts = alerts;
    };
    FormioAlerts.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FormioAlerts.ctorParameters = function () { return []; };
    return FormioAlerts;
}());
export { FormioAlerts };
//# sourceMappingURL=formio.alerts.js.map