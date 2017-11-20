import { Injectable, EventEmitter } from '@angular/core';
var FormioResources = (function () {
    function FormioResources() {
        this.resources = {};
        this.error = new EventEmitter();
        this.onError = this.error;
        this.resources = {};
    }
    FormioResources.decorators = [
        { type: Injectable },
    ];
    /** @nocollapse */
    FormioResources.ctorParameters = function () { return []; };
    return FormioResources;
}());
export { FormioResources };
//# sourceMappingURL=resources.service.js.map