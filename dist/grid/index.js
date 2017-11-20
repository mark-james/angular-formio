import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormioModule } from '../';
import { FormioLoader } from '../formio.loader';
import { FormioAlerts } from '../formio.alerts';
import { FormioGridComponent } from './grid.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
var FormioGridModule = (function () {
    function FormioGridModule() {
    }
    FormioGridModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        FormsModule,
                        FormioModule,
                        PaginationModule.forRoot()
                    ],
                    declarations: [
                        FormioGridComponent
                    ],
                    exports: [
                        FormioGridComponent
                    ],
                    providers: [
                        FormioLoader,
                        FormioAlerts
                    ]
                },] },
    ];
    /** @nocollapse */
    FormioGridModule.ctorParameters = function () { return []; };
    return FormioGridModule;
}());
export { FormioGridModule };
export var FormioGrid = FormioGridModule;
//# sourceMappingURL=index.js.map