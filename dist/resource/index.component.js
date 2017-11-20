import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormioResourceService } from './resource.service';
import { FormioResourceConfig } from './resource.config';
/* tslint:disable */
var _each = require('lodash/each');
/* tslint:enable */
var FormioResourceIndexComponent = (function () {
    function FormioResourceIndexComponent(service, route, router, config) {
        var _this = this;
        this.service = service;
        this.route = route;
        this.router = router;
        this.config = config;
        this.service.initialize();
        this.gridQuery = {};
        if (this.config.parents && this.config.parents.length) {
            // Wait for the parents to load before loading this grid.
            this.service.onParents.subscribe(function (parents) {
                _each(parents, function (parent) {
                    if (parent) {
                        _this.gridQuery['data.' + parent.name + '._id'] = parent.resource._id;
                    }
                });
                // Set the source to load the grid.
                _this.gridSrc = _this.service.formUrl;
            });
        }
        else if (this.service.formUrl) {
            this.gridSrc = this.service.formUrl;
        }
    }
    FormioResourceIndexComponent.prototype.onSelect = function (row) {
        this.router.navigate([row._id, 'view'], { relativeTo: this.route });
    };
    FormioResourceIndexComponent.decorators = [
        { type: Component, args: [{
                    template: '<formio-grid [src]="gridSrc" [query]="gridQuery" [onForm]="service.formLoaded" (select)="onSelect($event)" (error)="service.onError($event)"></formio-grid>' +
                        '<button class="btn btn-primary" *ngIf="service.form" routerLink="new"><span class="glyphicon glyphicon-plus"></span> New {{ service.form.title }}</button>'
                },] },
    ];
    /** @nocollapse */
    FormioResourceIndexComponent.ctorParameters = function () { return [
        { type: FormioResourceService, },
        { type: ActivatedRoute, },
        { type: Router, },
        { type: FormioResourceConfig, },
    ]; };
    return FormioResourceIndexComponent;
}());
export { FormioResourceIndexComponent };
//# sourceMappingURL=index.component.js.map