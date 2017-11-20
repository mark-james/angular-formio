import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioResourceService } from './resource.service';
import { FormioResourceConfig } from './resource.config';
var FormioResourceEditComponent = (function () {
    function FormioResourceEditComponent(service, route, router, config) {
        this.service = service;
        this.route = route;
        this.router = router;
        this.config = config;
    }
    FormioResourceEditComponent.prototype.onSubmit = function (submission) {
        var _this = this;
        var edit = this.service.resource;
        edit.data = submission.data;
        this.service.save(edit).then(function () {
            _this.router.navigate(['../', 'view'], { relativeTo: _this.route });
        });
    };
    FormioResourceEditComponent.decorators = [
        { type: Component, args: [{
                    template: '<formio [form]="service.form" [submission]="service.resource" [refresh]="service.refresh" [hideComponents]="config.parents" (submit)="onSubmit($event)"></formio>'
                },] },
    ];
    /** @nocollapse */
    FormioResourceEditComponent.ctorParameters = function () { return [
        { type: FormioResourceService, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: FormioResourceConfig, },
    ]; };
    return FormioResourceEditComponent;
}());
export { FormioResourceEditComponent };
//# sourceMappingURL=edit.component.js.map