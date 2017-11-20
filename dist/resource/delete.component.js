import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioResourceService } from './resource.service';
var FormioResourceDeleteComponent = (function () {
    function FormioResourceDeleteComponent(service, route, router) {
        this.service = service;
        this.route = route;
        this.router = router;
    }
    FormioResourceDeleteComponent.prototype.onDelete = function () {
        var _this = this;
        this.service.remove().then(function () {
            _this.router.navigate(['../../'], { relativeTo: _this.route });
        });
    };
    FormioResourceDeleteComponent.prototype.onCancel = function () {
        this.router.navigate(['../', 'view'], { relativeTo: this.route });
    };
    FormioResourceDeleteComponent.decorators = [
        { type: Component, args: [{
                    template: '<h3>Are you sure you wish to delete this record?</h3>' +
                        '<div class="btn-toolbar">' +
                        '<button (click)="onDelete()" class="btn btn-danger">Yes</button>' +
                        '<button (click)="onCancel()" class="btn btn-danger">No</button>' +
                        '</div>'
                },] },
    ];
    /** @nocollapse */
    FormioResourceDeleteComponent.ctorParameters = function () { return [
        { type: FormioResourceService, },
        { type: ActivatedRoute, },
        { type: Router, },
    ]; };
    return FormioResourceDeleteComponent;
}());
export { FormioResourceDeleteComponent };
//# sourceMappingURL=delete.component.js.map