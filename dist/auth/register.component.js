import { Component } from '@angular/core';
import { FormioAuthService } from './auth.service';
var FormioAuthRegisterComponent = (function () {
    function FormioAuthRegisterComponent(service) {
        this.service = service;
    }
    FormioAuthRegisterComponent.decorators = [
        { type: Component, args: [{
                    template: '<formio [src]="service.registerForm" (submit)="service.onRegisterSubmit($event)"></formio>'
                },] },
    ];
    /** @nocollapse */
    FormioAuthRegisterComponent.ctorParameters = function () { return [
        { type: FormioAuthService, },
    ]; };
    return FormioAuthRegisterComponent;
}());
export { FormioAuthRegisterComponent };
//# sourceMappingURL=register.component.js.map