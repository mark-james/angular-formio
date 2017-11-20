import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormioComponent } from './formio.component';
import { FormioAlerts } from './formio.alerts';
import { FormioAlertsComponent } from './formio.alerts.component';
import { FormioLoader } from './formio.loader';
import { FormioLoaderComponent } from './formio.loader.component';
var FormioModule = (function () {
    function FormioModule() {
    }
    FormioModule.decorators = [
        { type: NgModule, args: [{
                    declarations: [
                        FormioComponent,
                        FormioLoaderComponent,
                        FormioAlertsComponent
                    ],
                    imports: [
                        CommonModule
                    ],
                    exports: [
                        FormioComponent,
                        FormioLoaderComponent,
                        FormioAlertsComponent
                    ],
                    providers: [
                        FormioLoader,
                        FormioAlerts
                    ]
                },] },
    ];
    /** @nocollapse */
    FormioModule.ctorParameters = function () { return []; };
    return FormioModule;
}());
export { FormioModule };
//# sourceMappingURL=formio.module.js.map