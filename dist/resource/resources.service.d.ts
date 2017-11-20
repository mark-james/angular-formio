import { EventEmitter } from '@angular/core';
export interface FormioResourceMap {
    [name: string]: any;
}
export declare class FormioResources {
    resources: FormioResourceMap;
    error: EventEmitter<any>;
    onError: EventEmitter<any>;
    constructor();
}
