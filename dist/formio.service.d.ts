import { Observable } from 'rxjs/Observable';
import { FormioForm } from './formio.common';
export declare class FormioService {
    url: string;
    options: object | undefined;
    formio: any;
    constructor(url: string, options?: object | undefined);
    requestWrapper(fn: any): any;
    saveForm(form: FormioForm): Observable<FormioForm>;
    loadForm(): Observable<FormioForm>;
    loadSubmission(): Observable<{}>;
    saveSubmission(submission: {}): Observable<{}>;
    loadSubmissions(): Observable<{}>;
}
