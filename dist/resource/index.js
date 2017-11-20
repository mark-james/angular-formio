import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormioModule } from '../';
import { FormioGrid } from '../grid';
import { RouterModule } from '@angular/router';
import { FormioResourceComponent } from './resource.component';
import { FormioResourceViewComponent } from './view.component';
import { FormioResourceEditComponent } from './edit.component';
import { FormioResourceDeleteComponent } from './delete.component';
import { FormioResourceCreateComponent } from './create.component';
import { FormioResourceIndexComponent } from './index.component';
var FormioResourceModule = (function () {
    function FormioResourceModule() {
    }
    FormioResourceModule.decorators = [
        { type: NgModule, args: [{
                    imports: [
                        CommonModule,
                        FormioModule,
                        FormioGrid,
                        RouterModule.forChild([])
                    ],
                    declarations: [
                        FormioResourceComponent,
                        FormioResourceCreateComponent,
                        FormioResourceIndexComponent,
                        FormioResourceViewComponent,
                        FormioResourceEditComponent,
                        FormioResourceDeleteComponent
                    ]
                },] },
    ];
    /** @nocollapse */
    FormioResourceModule.ctorParameters = function () { return []; };
    return FormioResourceModule;
}());
export { FormioResourceModule };
export var FormioResource = FormioResourceModule;
export { FormioResourceRoutes } from './resource.routes';
export { FormioResourceConfig } from './resource.config';
export { FormioResources } from './resources.service';
export { FormioResourceComponent } from './resource.component';
export { FormioResourceViewComponent } from './view.component';
export { FormioResourceEditComponent } from './edit.component';
export { FormioResourceDeleteComponent } from './delete.component';
export { FormioResourceCreateComponent } from './create.component';
export { FormioResourceIndexComponent } from './index.component';
export { FormioResourceService } from './resource.service';
//# sourceMappingURL=index.js.map