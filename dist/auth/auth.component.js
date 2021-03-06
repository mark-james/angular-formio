import { Component } from '@angular/core';
var FormioAuthComponent = (function () {
    function FormioAuthComponent() {
    }
    FormioAuthComponent.decorators = [
        { type: Component, args: [{
                    template: '<div class="panel panel-default">' +
                        '  <div class="panel-heading" style="padding-bottom: 0; border-bottom: none;">' +
                        '    <ul class="nav nav-tabs" style="border-bottom: none;">' +
                        '      <li role="presentation" routerLinkActive="active"><a routerLink="login">Login</a></li>' +
                        '      <li role="presentation" routerLinkActive="active"><a routerLink="register">Register</a></li>' +
                        '    </ul>' +
                        '  </div>\n' +
                        '  <div class="panel-body">' +
                        '    <div class="row">' +
                        '      <div class="col-lg-12">' +
                        '        <router-outlet></router-outlet>' +
                        '      </div>' +
                        '    </div>' +
                        '  </div>' +
                        '</div>'
                },] },
    ];
    /** @nocollapse */
    FormioAuthComponent.ctorParameters = function () { return []; };
    return FormioAuthComponent;
}());
export { FormioAuthComponent };
//# sourceMappingURL=auth.component.js.map