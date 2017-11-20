import { FormioAuthComponent } from './auth.component';
import { FormioAuthLoginComponent } from './login.component';
import { FormioAuthRegisterComponent } from './register.component';
export function FormioAuthRoutes(config) {
    config = config || {};
    return [
        {
            path: '',
            component: config.auth || FormioAuthComponent,
            children: [
                {
                    path: '',
                    redirectTo: 'login',
                    pathMatch: 'full'
                },
                {
                    path: 'login',
                    component: config.login || FormioAuthLoginComponent
                },
                {
                    path: 'register',
                    component: config.register || FormioAuthRegisterComponent
                }
            ]
        }
    ];
}
;
//# sourceMappingURL=auth.routes.js.map