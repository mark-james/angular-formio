import { Observable } from 'rxjs/Observable';
/* tslint:disable */
var Formio = require('formiojs');
/* tslint:enable */
var FormioService = (function () {
    function FormioService(url, options) {
        this.url = url;
        this.options = options;
        this.formio = new Formio(this.url, this.options);
    }
    FormioService.prototype.requestWrapper = function (fn) {
        var record;
        var called = false;
        return Observable.create(function (observer) {
            try {
                if (!called) {
                    called = true;
                    fn()
                        .then(function (_record) {
                        record = _record;
                        observer.next(record);
                        observer.complete();
                    })
                        .catch(function (err) { return observer.error(err); });
                }
                else if (record) {
                    observer.next(record);
                    observer.complete();
                }
            }
            catch (err) {
                observer.error(err);
            }
        });
    };
    FormioService.prototype.saveForm = function (form) {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.saveForm(form); });
    };
    FormioService.prototype.loadForm = function () {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.loadForm(); });
    };
    FormioService.prototype.loadSubmission = function () {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.loadSubmission(); });
    };
    FormioService.prototype.saveSubmission = function (submission) {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.saveSubmission(submission); });
    };
    FormioService.prototype.loadSubmissions = function () {
        var _this = this;
        return this.requestWrapper(function () { return _this.formio.loadSubmissions(); });
    };
    return FormioService;
}());
export { FormioService };
//# sourceMappingURL=formio.service.js.map