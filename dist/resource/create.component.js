import { Component, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioResourceService } from './resource.service';
import { FormioResourceConfig } from './resource.config';
var FormioResourceCreateComponent = (function () {
    function FormioResourceCreateComponent(service, route, router, config) {
        this.service = service;
        this.route = route;
        this.router = router;
        this.config = config;
        // Start with fresh data.
        this.service.initialize();
        this.onError = new EventEmitter();
        this.onSuccess = new EventEmitter();
    }
    FormioResourceCreateComponent.prototype.onSubmit = function (submission) {
        var _this = this;
        this.service.save(submission).then(function () {
            _this.router.navigate(['../', _this.service.resource._id, 'view'], { relativeTo: _this.route });
        }).catch(function (err) { return _this.onError.emit(err); });
    };
    FormioResourceCreateComponent.decorators = [
        { type: Component, args: [{
                    styles: ['.back-button { font-size: 0.8em; }'],
                    template: '<h3 *ngIf="service.form" style="margin-top:0;"><a routerLink="../" class="back-button"><span class="glyphicon glyphicon-chevron-left"></span></a> | New {{ service.form.title }}</h3>' +
                        '<formio [form]="service.form" [submission]="service.resource" [refresh]="service.refresh" [hideComponents]="config.parents" [error]="onError" [success]="onSuccess" (submit)="onSubmit($event)"></formio>'
                },] },
    ];
    /** @nocollapse */
    FormioResourceCreateComponent.ctorParameters = function () { return [
        { type: FormioResourceService, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: FormioResourceConfig, },
    ]; };
    return FormioResourceCreateComponent;
}());
export { FormioResourceCreateComponent };
//# sourceMappingURL=create.component.js.map