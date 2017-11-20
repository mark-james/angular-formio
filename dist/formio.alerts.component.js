import { Component } from '@angular/core';
import { FormioAlerts } from './formio.alerts';
var FormioAlertsComponent = (function () {
    function FormioAlertsComponent(alerts) {
        this.alerts = alerts;
    }
    FormioAlertsComponent.decorators = [
        { type: Component, args: [{
                    selector: 'formio-alerts',
                    template: '<div *ngFor="let alert of alerts.alerts" class="alert alert-{{ alert.type }}" role="alert">{{ alert.message }}</div>'
                },] },
    ];
    /** @nocollapse */
    FormioAlertsComponent.ctorParameters = function () { return [
        { type: FormioAlerts, },
    ]; };
    return FormioAlertsComponent;
}());
export { FormioAlertsComponent };
//# sourceMappingURL=formio.alerts.component.js.map