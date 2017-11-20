export interface FormioAuthFormConfig {
    path?: string;
    form?: string;
    component?: any;
}
export interface FormioAuthRouteConfig {
    auth?: any;
    login?: any;
    register?: any;
}
export declare class FormioAuthConfig {
    component?: any;
    login?: FormioAuthFormConfig;
    register?: FormioAuthFormConfig;
}
