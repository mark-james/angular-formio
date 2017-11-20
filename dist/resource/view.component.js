import { Component } from '@angular/core';
import { FormioResourceService } from './resource.service';
import { FormioResourceConfig } from './resource.config';
var FormioResourceViewComponent = (function () {
    function FormioResourceViewComponent(service, config) {
        this.service = service;
        this.config = config;
    }
    FormioResourceViewComponent.decorators = [
        { type: Component, args: [{
                    template: '<formio [form]="service.form" [submission]="service.resource" [hideComponents]="config.parents" [readOnly]="true"></formio>'
                },] },
    ];
    /** @nocollapse */
    FormioResourceViewComponent.ctorParameters = function () { return [
        { type: FormioResourceService, },
        { type: FormioResourceConfig, },
    ]; };
    return FormioResourceViewComponent;
}());
export { FormioResourceViewComponent };
//# sourceMappingURL=view.component.js.map