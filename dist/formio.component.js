import { Component, Input, Output, EventEmitter, ViewEncapsulation, Optional, ViewChild } from '@angular/core';
import { FormioService } from './formio.service';
import { FormioLoader } from './formio.loader';
import { FormioAlerts } from './formio.alerts';
import { FormioAppConfig } from './formio.config';
/* tslint:disable */
var Formio = require('formiojs/full');
var _each = require('lodash/each');
var _get = require('lodash/get');
var _isEmpty = require('lodash/isEmpty');
/* tslint:enable */
var FormioComponent = (function () {
    function FormioComponent(loader, alerts, config) {
        var _this = this;
        this.loader = loader;
        this.alerts = alerts;
        this.config = config;
        this.submission = {};
        this.readOnly = false;
        if (this.config) {
            Formio.Formio.setBaseUrl(this.config.apiUrl);
            Formio.Formio.setAppUrl(this.config.appUrl);
        }
        else {
            console.warn('You must provide an AppConfig within your application!');
        }
        this.ready = new Promise(function (resolve) {
            _this.readyResolve = resolve;
        });
        this.beforeSubmit = new EventEmitter();
        this.prevPage = new EventEmitter();
        this.nextPage = new EventEmitter();
        this.submit = new EventEmitter();
        this.errorChange = new EventEmitter();
        this.invalid = new EventEmitter();
        this.change = new EventEmitter();
        this.customEvent = new EventEmitter();
        this.render = new EventEmitter();
        this.formLoad = new EventEmitter();
        this.initialized = false;
        this.alerts.alerts = [];
    }
    FormioComponent.prototype.setForm = function (form) {
        var _this = this;
        this.form = form;
        // Only initialize a single formio instance.
        if (this.formio) {
            this.formio.form = this.form;
            return;
        }
        // Create the form.
        return Formio.Formio
            .createForm(this.formioElement.nativeElement, this.form, {
            noAlerts: true,
            readOnly: this.readOnly,
            i18n: this.options.i18n,
            fileService: this.options.fileService
        })
            .then(function (formio) {
            _this.formio = formio;
            if (_this.url) {
                _this.formio.url = _this.url;
            }
            if (_this.src) {
                _this.formio.url = _this.src;
            }
            _this.formio.nosubmit = true;
            _this.formio.on('prevPage', function (data) { return _this.onPrevPage(data); });
            _this.formio.on('nextPage', function (data) { return _this.onNextPage(data); });
            _this.formio.on('change', function (value) { return _this.change.emit(value); });
            _this.formio.on('customEvent', function (event) {
                return _this.customEvent.emit(event);
            });
            _this.formio.on('submit', function (submission) {
                return _this.submitForm(submission);
            });
            _this.formio.on('error', function (err) { return _this.onError(err); });
            _this.formio.on('render', function () { return _this.render.emit(); });
            _this.formio.on('formLoad', function (loadedForm) {
                return _this.formLoad.emit(loadedForm);
            });
            _this.loader.loading = false;
            _this.readyResolve(_this.formio);
            return _this.formio;
        });
    };
    FormioComponent.prototype.initialize = function () {
        if (this.initialized) {
            return;
        }
        this.options = Object.assign({
            errors: {
                message: 'Please fix the following errors before submitting.'
            },
            alerts: {
                submitMessage: 'Submission Complete.'
            },
            disableAlerts: false,
            hooks: {
                beforeSubmit: null
            }
        }, this.options);
        this.initialized = true;
    };
    FormioComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.initialize();
        if (this.language) {
            this.language.subscribe(function (lang) {
                _this.formio.language = lang;
            });
        }
        if (this.refresh) {
            this.refresh.subscribe(function (refresh) {
                return _this.onRefresh(refresh);
            });
        }
        if (this.error) {
            this.error.subscribe(function (err) { return _this.onError(err); });
        }
        if (this.success) {
            this.success.subscribe(function (message) {
                _this.alerts.setAlert({
                    type: 'success',
                    message: message || _get(_this.options, 'alerts.submitMessage')
                });
            });
        }
        if (this.src) {
            if (!this.service) {
                this.service = new FormioService(this.src);
            }
            this.loader.loading = true;
            this.service.loadForm().subscribe(function (form) {
                if (form && form.components) {
                    _this.setForm(form);
                }
                // if a submission is also provided.
                if (_isEmpty(_this.submission) && _this.service.formio.submissionId) {
                    _this.service.loadSubmission().subscribe(function (submission) {
                        if (_this.readOnly) {
                            _this.formio.options.readOnly = true;
                        }
                        _this.submission = _this.formio.submission = submission;
                    }, function (err) { return _this.onError(err); });
                }
            }, function (err) { return _this.onError(err); });
        }
    };
    FormioComponent.prototype.onRefresh = function (refresh) {
        switch (refresh.property) {
            case 'submission':
                this.formio.submission = refresh.value;
                break;
            case 'form':
                this.formio.form = refresh.value;
                break;
        }
    };
    FormioComponent.prototype.ngOnChanges = function (changes) {
        var _this = this;
        this.initialize();
        if (changes.form && changes.form.currentValue) {
            this.setForm(changes.form.currentValue);
        }
        this.ready.then(function () {
            if (changes.submission && changes.submission.currentValue) {
                _this.formio.submission = changes.submission.currentValue;
            }
            if (changes.hideComponents) {
                _this.formio.hideComponents(changes.hideComponents.currentValue);
            }
        });
    };
    FormioComponent.prototype.onPrevPage = function (data) {
        this.alerts.setAlerts([]);
        this.prevPage.emit(data);
    };
    FormioComponent.prototype.onNextPage = function (data) {
        this.alerts.setAlerts([]);
        this.nextPage.emit(data);
    };
    FormioComponent.prototype.onSubmit = function (submission, saved) {
        if (saved) {
            this.formio.emit('submitDone', submission);
        }
        this.submit.emit(submission);
        if (!this.success) {
            this.alerts.setAlert({
                type: 'success',
                message: _get(this.options, 'alerts.submitMessage')
            });
        }
    };
    FormioComponent.prototype.onError = function (err) {
        var _this = this;
        this.alerts.setAlerts([]);
        if (!err) {
            return;
        }
        // Make sure it is an array.
        err = err instanceof Array ? err : [err];
        // Emit these errors again.
        this.errorChange.emit(err);
        // Iterate through each one and set the alerts array.
        _each(err, function (error) {
            _this.alerts.setAlert({
                type: 'danger',
                message: error.message || error.toString()
            });
        });
    };
    FormioComponent.prototype.submitExecute = function (submission) {
        var _this = this;
        if (this.service) {
            this.service
                .saveSubmission(submission)
                .subscribe(function (sub) { return _this.onSubmit(sub, true); }, function (err) { return _this.onError(err); });
        }
        else {
            this.onSubmit(submission, false);
        }
    };
    FormioComponent.prototype.submitForm = function (submission) {
        var _this = this;
        this.beforeSubmit.emit(submission);
        // if they provide a beforeSubmit hook, then allow them to alter the submission asynchronously
        // or even provide a custom Error method.
        var beforeSubmit = _get(this.options, 'hooks.beforeSubmit');
        if (beforeSubmit) {
            beforeSubmit(submission, function (err, sub) {
                if (err) {
                    _this.onError(err);
                    return;
                }
                _this.submitExecute(sub);
            });
        }
        else {
            this.submitExecute(submission);
        }
    };
    FormioComponent.decorators = [
        { type: Component, args: [{
                    selector: 'formio',
                    template: '<div>' +
                        '<formio-loader></formio-loader>' +
                        '<formio-alerts *ngIf="!this.options.disableAlerts"></formio-alerts>' +
                        '<div #formio></div>' +
                        '</div>',
                    styles: ['.flatpickr-calendar{background:0 0;overflow:hidden;max-height:0;opacity:0;visibility:hidden;text-align:center;padding:0;-webkit-animation:none;animation:none;direction:ltr;border:0;font-size:14px;line-height:24px;border-radius:5px;position:absolute;width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;-ms-touch-action:manipulation;touch-action:manipulation;background:#fff;-webkit-box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08);box-shadow:1px 0 0 #e6e6e6,-1px 0 0 #e6e6e6,0 1px 0 #e6e6e6,0 -1px 0 #e6e6e6,0 3px 13px rgba(0,0,0,.08)}.flatpickr-calendar.inline,.flatpickr-calendar.open{opacity:1;visibility:visible;overflow:visible;max-height:640px}.flatpickr-calendar.open{display:inline-block;z-index:99999}.flatpickr-calendar.animate.open{-webkit-animation:fpFadeInDown .3s cubic-bezier(.23,1,.32,1);animation:fpFadeInDown .3s cubic-bezier(.23,1,.32,1)}.flatpickr-calendar.inline{display:block;position:relative;top:2px}.flatpickr-calendar.static{position:absolute;top:calc(100% + 2px)}.flatpickr-calendar.static.open{z-index:999;display:block}.flatpickr-calendar.hasWeeks{width:auto}.flatpickr-calendar .hasTime .dayContainer,.flatpickr-calendar .hasWeeks .dayContainer{border-bottom:0;border-bottom-right-radius:0;border-bottom-left-radius:0}.flatpickr-calendar .hasWeeks .dayContainer{border-left:0}.flatpickr-calendar.showTimeInput.hasTime .flatpickr-time{height:40px;border-top:1px solid #e6e6e6}.flatpickr-calendar.noCalendar.hasTime .flatpickr-time{height:auto}.flatpickr-calendar:after,.flatpickr-calendar:before{position:absolute;display:block;pointer-events:none;border:solid transparent;content:\'\';height:0;width:0;left:22px}.flatpickr-calendar.rightMost:after,.flatpickr-calendar.rightMost:before{left:auto;right:22px}.flatpickr-calendar:before{border-width:5px;margin:0 -5px}.flatpickr-calendar:after{border-width:4px;margin:0 -4px}.flatpickr-calendar.arrowTop:after,.flatpickr-calendar.arrowTop:before{bottom:100%}.flatpickr-calendar.arrowTop:before{border-bottom-color:#e6e6e6}.flatpickr-calendar.arrowTop:after{border-bottom-color:#fff}.flatpickr-calendar.arrowBottom:after,.flatpickr-calendar.arrowBottom:before{top:100%}.flatpickr-calendar.arrowBottom:before{border-top-color:#e6e6e6}.flatpickr-calendar.arrowBottom:after{border-top-color:#fff}.flatpickr-calendar:focus{outline:0}.flatpickr-wrapper{position:relative;display:inline-block}.flatpickr-month{background:0 0;color:rgba(0,0,0,.9);fill:rgba(0,0,0,.9);height:28px;line-height:1;text-align:center;position:relative;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;overflow:hidden}.flatpickr-next-month,.flatpickr-prev-month{text-decoration:none;cursor:pointer;position:absolute;top:0;line-height:16px;height:28px;padding:10px calc(3.57% - 1.5px);z-index:3}.flatpickr-next-month i,.flatpickr-prev-month i{position:relative}.flatpickr-next-month.flatpickr-prev-month,.flatpickr-prev-month.flatpickr-prev-month{left:0}.flatpickr-next-month.flatpickr-next-month,.flatpickr-prev-month.flatpickr-next-month{right:0}.flatpickr-next-month:hover,.flatpickr-prev-month:hover{color:#959ea9}.flatpickr-next-month:hover svg,.flatpickr-prev-month:hover svg{fill:#f64747}.flatpickr-next-month svg,.flatpickr-prev-month svg{width:14px}.flatpickr-next-month svg path,.flatpickr-prev-month svg path{-webkit-transition:fill .1s;transition:fill .1s;fill:inherit}.numInputWrapper{position:relative;height:auto}.numInputWrapper input,.numInputWrapper span{display:inline-block}.numInputWrapper input{width:100%}.numInputWrapper span{position:absolute;right:0;width:14px;padding:0 4px 0 2px;height:50%;line-height:50%;opacity:0;cursor:pointer;border:1px solid rgba(57,57,57,.05);-webkit-box-sizing:border-box;box-sizing:border-box}.numInputWrapper span:hover{background:rgba(0,0,0,.1)}.numInputWrapper span:active{background:rgba(0,0,0,.2)}.numInputWrapper span:after{display:block;content:"";position:absolute;top:33%}.numInputWrapper span.arrowUp{top:0;border-bottom:0}.numInputWrapper span.arrowUp:after{border-left:4px solid transparent;border-right:4px solid transparent;border-bottom:4px solid rgba(57,57,57,.6)}.numInputWrapper span.arrowDown{top:50%}.numInputWrapper span.arrowDown:after{border-left:4px solid transparent;border-right:4px solid transparent;border-top:4px solid rgba(57,57,57,.6)}.numInputWrapper span svg{width:inherit;height:auto}.numInputWrapper span svg path{fill:rgba(0,0,0,.5)}.numInputWrapper:hover{background:rgba(0,0,0,.05)}.numInputWrapper:hover span{opacity:1}.flatpickr-current-month{font-size:135%;line-height:inherit;font-weight:300;color:inherit;position:absolute;width:75%;left:12.5%;padding:6.16px 0 0 0;line-height:1;height:28px;display:inline-block;text-align:center;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}.flatpickr-current-month.slideLeft{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0);-webkit-animation:fpFadeOut .4s ease,fpSlideLeft .4s cubic-bezier(.23,1,.32,1);animation:fpFadeOut .4s ease,fpSlideLeft .4s cubic-bezier(.23,1,.32,1)}.flatpickr-current-month.slideLeftNew{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);-webkit-animation:fpFadeIn .4s ease,fpSlideLeftNew .4s cubic-bezier(.23,1,.32,1);animation:fpFadeIn .4s ease,fpSlideLeftNew .4s cubic-bezier(.23,1,.32,1)}.flatpickr-current-month.slideRight{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0);-webkit-animation:fpFadeOut .4s ease,fpSlideRight .4s cubic-bezier(.23,1,.32,1);animation:fpFadeOut .4s ease,fpSlideRight .4s cubic-bezier(.23,1,.32,1)}.flatpickr-current-month.slideRightNew{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);-webkit-animation:fpFadeIn .4s ease,fpSlideRightNew .4s cubic-bezier(.23,1,.32,1);animation:fpFadeIn .4s ease,fpSlideRightNew .4s cubic-bezier(.23,1,.32,1)}.flatpickr-current-month span.cur-month{font-family:inherit;font-weight:700;color:inherit;display:inline-block;margin-left:.5ch;padding:0}.flatpickr-current-month span.cur-month:hover{background:rgba(0,0,0,.05)}.flatpickr-current-month .numInputWrapper{width:6ch;width:7ch\0;display:inline-block}.flatpickr-current-month .numInputWrapper span.arrowUp:after{border-bottom-color:rgba(0,0,0,.9)}.flatpickr-current-month .numInputWrapper span.arrowDown:after{border-top-color:rgba(0,0,0,.9)}.flatpickr-current-month input.cur-year{background:0 0;-webkit-box-sizing:border-box;box-sizing:border-box;color:inherit;cursor:default;padding:0 0 0 .5ch;margin:0;display:inline-block;font-size:inherit;font-family:inherit;font-weight:300;line-height:inherit;height:initial;border:0;border-radius:0;vertical-align:initial}.flatpickr-current-month input.cur-year:focus{outline:0}.flatpickr-current-month input.cur-year[disabled],.flatpickr-current-month input.cur-year[disabled]:hover{font-size:100%;color:rgba(0,0,0,.5);background:0 0;pointer-events:none}.flatpickr-weekdays{background:0 0;text-align:center;overflow:hidden;width:100%;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-align:center;-webkit-align-items:center;-ms-flex-align:center;align-items:center;height:28px}span.flatpickr-weekday{cursor:default;font-size:90%;background:0 0;color:rgba(0,0,0,.54);line-height:1;margin:0;text-align:center;display:block;-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;font-weight:bolder}.dayContainer,.flatpickr-weeks{padding:1px 0 0 0}.flatpickr-days{position:relative;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;width:307.875px}.flatpickr-days:focus{outline:0}.dayContainer{padding:0;outline:0;text-align:left;width:307.875px;min-width:307.875px;max-width:307.875px;-webkit-box-sizing:border-box;box-sizing:border-box;display:inline-block;display:-ms-flexbox;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-wrap:wrap;-ms-flex-pack:justify;-webkit-justify-content:space-around;justify-content:space-around;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0);opacity:1}.flatpickr-calendar.animate .dayContainer.slideLeft{-webkit-animation:fpFadeOut .4s cubic-bezier(.23,1,.32,1),fpSlideLeft .4s cubic-bezier(.23,1,.32,1);animation:fpFadeOut .4s cubic-bezier(.23,1,.32,1),fpSlideLeft .4s cubic-bezier(.23,1,.32,1)}.flatpickr-calendar.animate .dayContainer.slideLeft,.flatpickr-calendar.animate .dayContainer.slideLeftNew{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}.flatpickr-calendar.animate .dayContainer.slideLeftNew{-webkit-animation:fpFadeIn .4s cubic-bezier(.23,1,.32,1),fpSlideLeft .4s cubic-bezier(.23,1,.32,1);animation:fpFadeIn .4s cubic-bezier(.23,1,.32,1),fpSlideLeft .4s cubic-bezier(.23,1,.32,1)}.flatpickr-calendar.animate .dayContainer.slideRight{-webkit-animation:fpFadeOut .4s cubic-bezier(.23,1,.32,1),fpSlideRight .4s cubic-bezier(.23,1,.32,1);animation:fpFadeOut .4s cubic-bezier(.23,1,.32,1),fpSlideRight .4s cubic-bezier(.23,1,.32,1);-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}.flatpickr-calendar.animate .dayContainer.slideRightNew{-webkit-animation:fpFadeIn .4s cubic-bezier(.23,1,.32,1),fpSlideRightNew .4s cubic-bezier(.23,1,.32,1);animation:fpFadeIn .4s cubic-bezier(.23,1,.32,1),fpSlideRightNew .4s cubic-bezier(.23,1,.32,1)}.flatpickr-day{background:0 0;border:1px solid transparent;border-radius:150px;-webkit-box-sizing:border-box;box-sizing:border-box;color:#393939;cursor:pointer;font-weight:400;width:14.2857143%;-webkit-flex-basis:14.2857143%;-ms-flex-preferred-size:14.2857143%;flex-basis:14.2857143%;max-width:39px;height:39px;line-height:39px;margin:0;display:inline-block;position:relative;-webkit-box-pack:center;-webkit-justify-content:center;-ms-flex-pack:center;justify-content:center;text-align:center}.flatpickr-day.inRange,.flatpickr-day.nextMonthDay.inRange,.flatpickr-day.nextMonthDay.today.inRange,.flatpickr-day.nextMonthDay:focus,.flatpickr-day.nextMonthDay:hover,.flatpickr-day.prevMonthDay.inRange,.flatpickr-day.prevMonthDay.today.inRange,.flatpickr-day.prevMonthDay:focus,.flatpickr-day.prevMonthDay:hover,.flatpickr-day.today.inRange,.flatpickr-day:focus,.flatpickr-day:hover{cursor:pointer;outline:0;background:#e6e6e6;border-color:#e6e6e6}.flatpickr-day.today{border-color:#959ea9}.flatpickr-day.today:focus,.flatpickr-day.today:hover{border-color:#959ea9;background:#959ea9;color:#fff}.flatpickr-day.endRange,.flatpickr-day.endRange.inRange,.flatpickr-day.endRange.nextMonthDay,.flatpickr-day.endRange.prevMonthDay,.flatpickr-day.endRange:focus,.flatpickr-day.endRange:hover,.flatpickr-day.selected,.flatpickr-day.selected.inRange,.flatpickr-day.selected.nextMonthDay,.flatpickr-day.selected.prevMonthDay,.flatpickr-day.selected:focus,.flatpickr-day.selected:hover,.flatpickr-day.startRange,.flatpickr-day.startRange.inRange,.flatpickr-day.startRange.nextMonthDay,.flatpickr-day.startRange.prevMonthDay,.flatpickr-day.startRange:focus,.flatpickr-day.startRange:hover{background:#569ff7;-webkit-box-shadow:none;box-shadow:none;color:#fff;border-color:#569ff7}.flatpickr-day.endRange.startRange,.flatpickr-day.selected.startRange,.flatpickr-day.startRange.startRange{border-radius:50px 0 0 50px}.flatpickr-day.endRange.endRange,.flatpickr-day.selected.endRange,.flatpickr-day.startRange.endRange{border-radius:0 50px 50px 0}.flatpickr-day.endRange.startRange+.endRange,.flatpickr-day.selected.startRange+.endRange,.flatpickr-day.startRange.startRange+.endRange{-webkit-box-shadow:-10px 0 0 #569ff7;box-shadow:-10px 0 0 #569ff7}.flatpickr-day.endRange.startRange.endRange,.flatpickr-day.selected.startRange.endRange,.flatpickr-day.startRange.startRange.endRange{border-radius:50px}.flatpickr-day.inRange{border-radius:0;-webkit-box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6;box-shadow:-5px 0 0 #e6e6e6,5px 0 0 #e6e6e6}.flatpickr-day.disabled,.flatpickr-day.disabled:hover{pointer-events:none}.flatpickr-day.disabled,.flatpickr-day.disabled:hover,.flatpickr-day.nextMonthDay,.flatpickr-day.notAllowed,.flatpickr-day.notAllowed.nextMonthDay,.flatpickr-day.notAllowed.prevMonthDay,.flatpickr-day.prevMonthDay{color:rgba(57,57,57,.3);background:0 0;border-color:transparent;cursor:default}.flatpickr-day.week.selected{border-radius:0;-webkit-box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7;box-shadow:-5px 0 0 #569ff7,5px 0 0 #569ff7}.rangeMode .flatpickr-day{margin-top:1px}.flatpickr-weekwrapper{display:inline-block;float:left}.flatpickr-weekwrapper .flatpickr-weeks{padding:0 12px;-webkit-box-shadow:1px 0 0 #e6e6e6;box-shadow:1px 0 0 #e6e6e6}.flatpickr-weekwrapper .flatpickr-weekday{float:none;width:100%;line-height:28px}.flatpickr-weekwrapper span.flatpickr-day{display:block;width:100%;max-width:none}.flatpickr-innerContainer{display:block;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden}.flatpickr-rContainer{display:inline-block;padding:0;-webkit-box-sizing:border-box;box-sizing:border-box}.flatpickr-time{text-align:center;outline:0;display:block;height:0;line-height:40px;max-height:40px;-webkit-box-sizing:border-box;box-sizing:border-box;overflow:hidden;display:-webkit-box;display:-webkit-flex;display:-ms-flexbox;display:flex}.flatpickr-time:after{content:"";display:table;clear:both}.flatpickr-time .numInputWrapper{-webkit-box-flex:1;-webkit-flex:1;-ms-flex:1;flex:1;width:40%;height:40px;float:left}.flatpickr-time .numInputWrapper span.arrowUp:after{border-bottom-color:#393939}.flatpickr-time .numInputWrapper span.arrowDown:after{border-top-color:#393939}.flatpickr-time.hasSeconds .numInputWrapper{width:26%}.flatpickr-time.time24hr .numInputWrapper{width:49%}.flatpickr-time input{background:0 0;-webkit-box-shadow:none;box-shadow:none;border:0;border-radius:0;text-align:center;margin:0;padding:0;height:inherit;line-height:inherit;cursor:pointer;color:#393939;font-size:14px;position:relative;-webkit-box-sizing:border-box;box-sizing:border-box}.flatpickr-time input.flatpickr-hour{font-weight:700}.flatpickr-time input.flatpickr-minute,.flatpickr-time input.flatpickr-second{font-weight:400}.flatpickr-time input:focus{outline:0;border:0}.flatpickr-time .flatpickr-am-pm,.flatpickr-time .flatpickr-time-separator{height:inherit;display:inline-block;float:left;line-height:inherit;color:#393939;font-weight:700;width:2%;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;-webkit-align-self:center;-ms-flex-item-align:center;align-self:center}.flatpickr-time .flatpickr-am-pm{outline:0;width:18%;cursor:pointer;text-align:center;font-weight:400}.flatpickr-time .flatpickr-am-pm:focus,.flatpickr-time .flatpickr-am-pm:hover{background:#f0f0f0}.flatpickr-input[readonly]{cursor:pointer}@-webkit-keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes fpFadeInDown{from{opacity:0;-webkit-transform:translate3d(0,-20px,0);transform:translate3d(0,-20px,0)}to{opacity:1;-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-webkit-keyframes fpSlideLeft{from{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@keyframes fpSlideLeft{from{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}}@-webkit-keyframes fpSlideLeftNew{from{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes fpSlideLeftNew{from{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-webkit-keyframes fpSlideRight{from{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@keyframes fpSlideRight{from{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}to{-webkit-transform:translate3d(100%,0,0);transform:translate3d(100%,0,0)}}@-webkit-keyframes fpSlideRightNew{from{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@keyframes fpSlideRightNew{from{-webkit-transform:translate3d(-100%,0,0);transform:translate3d(-100%,0,0)}to{-webkit-transform:translate3d(0,0,0);transform:translate3d(0,0,0)}}@-webkit-keyframes fpFadeOut{from{opacity:1}to{opacity:0}}@keyframes fpFadeOut{from{opacity:1}to{opacity:0}}@-webkit-keyframes fpFadeIn{from{opacity:0}to{opacity:1}}@keyframes fpFadeIn{from{opacity:0}to{opacity:1}}.choices{position:relative;margin-bottom:24px;font-size:16px}.choices:focus{outline:0}.choices:last-child{margin-bottom:0}.choices.is-disabled .choices__inner,.choices.is-disabled .choices__input{background-color:#eaeaea;cursor:not-allowed;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.choices.is-disabled .choices__item{cursor:not-allowed}.choices[data-type*=select-one]{cursor:pointer}.choices[data-type*=select-one] .choices__inner{padding-bottom:7.5px}.choices[data-type*=select-one] .choices__input{display:block;width:100%;padding:10px;border-bottom:1px solid #ddd;background-color:#fff;margin:0}.choices[data-type*=select-one] .choices__button{background-image:url(../node_modules/formiojs/dist/icons/cross-inverse.svg);padding:0;background-size:8px;position:absolute;top:50%;right:0;margin-top:-10px;margin-right:25px;height:20px;width:20px;border-radius:10em;opacity:.5}.choices[data-type*=select-one] .choices__button:focus,.choices[data-type*=select-one] .choices__button:hover{opacity:1}.choices[data-type*=select-one] .choices__button:focus{box-shadow:0 0 0 2px #00bcd4}.choices[data-type*=select-one]:after{content:"";height:0;width:0;border-style:solid;border-color:#333 transparent transparent transparent;border-width:5px;position:absolute;right:11.5px;top:50%;margin-top:-2.5px;pointer-events:none}.choices[data-type*=select-one].is-open:after{border-color:transparent transparent #333 transparent;margin-top:-7.5px}.choices[data-type*=select-one][dir=rtl]:after{left:11.5px;right:auto}.choices[data-type*=select-one][dir=rtl] .choices__button{right:auto;left:0;margin-left:25px;margin-right:0}.choices[data-type*=select-multiple] .choices__inner,.choices[data-type*=text] .choices__inner{cursor:text}.choices[data-type*=select-multiple] .choices__button,.choices[data-type*=text] .choices__button{position:relative;display:inline-block;margin:0 -4px 0 8px;padding-left:16px;border-left:1px solid #008fa1;background-image:url(../node_modules/formiojs/dist/icons/cross.svg);background-size:8px;width:8px;line-height:1;opacity:.75}.choices[data-type*=select-multiple] .choices__button:focus,.choices[data-type*=select-multiple] .choices__button:hover,.choices[data-type*=text] .choices__button:focus,.choices[data-type*=text] .choices__button:hover{opacity:1}.choices__inner{display:inline-block;vertical-align:top;width:100%;background-color:#f9f9f9;padding:7.5px 7.5px 3.75px;border:1px solid #ddd;border-radius:2.5px;font-size:14px;min-height:44px;overflow:hidden}.is-focused .choices__inner,.is-open .choices__inner{border-color:#b7b7b7}.is-open .choices__inner{border-radius:2.5px 2.5px 0 0}.is-flipped.is-open .choices__inner{border-radius:0 0 2.5px 2.5px}.choices__list{margin:0;padding-left:0;list-style:none}.choices__list--single{display:inline-block;padding:4px 16px 4px 4px;width:100%}[dir=rtl] .choices__list--single{padding-right:4px;padding-left:16px}.choices__list--single .choices__item{width:100%}.choices__list--multiple{display:inline}.choices__list--multiple .choices__item{display:inline-block;vertical-align:middle;border-radius:20px;padding:4px 10px;font-size:12px;font-weight:500;margin-right:3.75px;margin-bottom:3.75px;background-color:#00bcd4;border:1px solid #00a5bb;color:#fff;word-break:break-all}.choices__list--multiple .choices__item[data-deletable]{padding-right:5px}[dir=rtl] .choices__list--multiple .choices__item{margin-right:0;margin-left:3.75px}.choices__list--multiple .choices__item.is-highlighted{background-color:#00a5bb;border:1px solid #008fa1}.is-disabled .choices__list--multiple .choices__item{background-color:#aaa;border:1px solid #919191}.choices__list--dropdown{display:none;z-index:1;position:absolute;width:100%;background-color:#fff;border:1px solid #ddd;top:100%;margin-top:-1px;border-bottom-left-radius:2.5px;border-bottom-right-radius:2.5px;overflow:hidden;word-break:break-all}.choices__list--dropdown.is-active{display:block}.is-open .choices__list--dropdown{border-color:#b7b7b7}.is-flipped .choices__list--dropdown{top:auto;bottom:100%;margin-top:0;margin-bottom:-1px;border-radius:.25rem .25rem 0 0}.choices__list--dropdown .choices__list{position:relative;max-height:300px;overflow:auto;-webkit-overflow-scrolling:touch;will-change:scroll-position}.choices__list--dropdown .choices__item{position:relative;padding:10px;font-size:14px}[dir=rtl] .choices__list--dropdown .choices__item{text-align:right}@media (min-width:640px){.choices__list--dropdown .choices__item--selectable{padding-right:100px}.choices__list--dropdown .choices__item--selectable:after{content:attr(data-select-text);font-size:12px;opacity:0;position:absolute;right:10px;top:50%;-webkit-transform:translateY(-50%);transform:translateY(-50%)}[dir=rtl] .choices__list--dropdown .choices__item--selectable{text-align:right;padding-left:100px;padding-right:10px}[dir=rtl] .choices__list--dropdown .choices__item--selectable:after{right:auto;left:10px}}.choices__list--dropdown .choices__item--selectable.is-highlighted{background-color:#f2f2f2}.choices__list--dropdown .choices__item--selectable.is-highlighted:after{opacity:.5}.choices__item{cursor:default}.choices__item--selectable{cursor:pointer}.choices__item--disabled{cursor:not-allowed;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none;opacity:.5}.choices__heading{font-weight:600;font-size:12px;padding:10px;border-bottom:1px solid #f7f7f7;color:gray}.choices__button{text-indent:-9999px;-webkit-appearance:none;-moz-appearance:none;appearance:none;border:0;background-color:transparent;background-repeat:no-repeat;background-position:center;cursor:pointer}.choices__button:focus{outline:0}.choices__input{display:inline-block;vertical-align:baseline;background-color:#f9f9f9;font-size:14px;margin-bottom:5px;border:0;border-radius:0;max-width:100%;padding:4px 0 4px 2px}.choices__input:focus{outline:0}[dir=rtl] .choices__input{padding-right:2px;padding-left:0}.choices__placeholder{opacity:.5}dialog{position:absolute;left:0;right:0;width:-moz-fit-content;width:-webkit-fit-content;width:fit-content;height:-moz-fit-content;height:-webkit-fit-content;height:fit-content;margin:auto;border:solid;padding:1em;background:#fff;color:#000;display:block}dialog:not([open]){display:none}dialog+.backdrop{position:fixed;top:0;right:0;bottom:0;left:0;background:rgba(0,0,0,.1)}._dialog_overlay{position:fixed;top:0;right:0;bottom:0;left:0}dialog.fixed{position:fixed;top:50%;transform:translate(0,-50%)}.formio-form{position:relative;min-height:80px}.formio-wysiwyg-editor{min-height:200px;background-color:#fff}.has-error.bg-danger{padding:4px}.ql-source:after{content:"[source]"}.quill-source-code{width:100%;margin:0;background:#1d1d1d;box-sizing:border-box;color:#ccc;font-size:15px;outline:0;padding:20px;line-height:24px;font-family:Consolas,Menlo,Monaco,"Courier New",monospace;position:absolute;top:0;bottom:0;border:none;display:none}.field-required:after{content:" *";color:red}.glyphicon-spin{-webkit-animation:formio-spin 1s infinite linear;-moz-animation:formio-spin 1s infinite linear;-o-animation:formio-spin 1s infinite linear;animation:formio-spin 1s infinite linear}@-moz-keyframes formio-spin{from{-moz-transform:rotate(0)}to{-moz-transform:rotate(360deg)}}@-webkit-keyframes formio-spin{from{-webkit-transform:rotate(0)}to{-webkit-transform:rotate(360deg)}}@keyframes formio-spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}.button-icon-right{margin-left:5px}.form-control.flatpickr-input{background-color:#fff}td>.form-group{margin-bottom:0}.signature-pad{position:relative}.signature-pad-body{overflow:hidden}.signature-pad-canvas{border-radius:4px;box-shadow:0 0 5px rgba(0,0,0,.02) inset;border:1px solid #f4f4f4}.btn.signature-pad-refresh{position:absolute;left:0;top:0;z-index:1000;padding:3px;line-height:0}.choices__list--dropdown .choices__item--selectable{padding-right:0}.signature-pad-refresh img{height:1.2em}.signature-pad-footer{text-align:center;color:#c3c3c3}.loader-wrapper{z-index:1000;position:absolute;top:0;left:0;bottom:0;right:0;background-color:rgba(0,0,0,.1)}.loader{position:absolute;left:50%;top:50%;margin-left:-30px;margin-top:-30px;z-index:10000;display:inline-block;border:6px solid #f3f3f3;border-top:6px solid #3498db;border-radius:50%;width:60px;height:60px;animation:spin 2s linear infinite}@keyframes spin{0%{transform:rotate(0)}100%{transform:rotate(360deg)}}.choices__list--dropdown{z-index:100}.choices__list--multiple .choices__item{border-radius:0;padding:2px 8px;line-height:1em;margin-bottom:6px}.choices__list--single{padding:0}.choices__input{padding:2px}.formio-component-file .fileSelector{padding:15px;border:2px dashed #ddd;text-align:center}.formio-component-file .fileSelector.fileDragOver{border-color:#127abe}.formio-component-file .fileSelector .glyphicon{font-size:20px;margin-right:5px}.formio-component-file .fileSelector .browse{cursor:pointer}.formio-dialog{width:65%;position:fixed;top:50%;transform:translate(0,-50%);border-radius:5px}.formio-placeholder{position:absolute;color:#999}.formio-dialog-close{cursor:pointer;margin-bottom:10px}.formio-iframe{border:none;width:100%;height:1000px}.inline-form-button{margin-right:10px}.tooltip{opacity:1}.tooltip[x-placement=right] .tooltip-arrow{border-right:5px solid #000}.tooltip[x-placement=right] .tooltip-inner{margin-left:8px}'],
                    encapsulation: ViewEncapsulation.None
                },] },
    ];
    /** @nocollapse */
    FormioComponent.ctorParameters = function () { return [
        { type: FormioLoader, },
        { type: FormioAlerts, },
        { type: FormioAppConfig, decorators: [{ type: Optional },] },
    ]; };
    FormioComponent.propDecorators = {
        'form': [{ type: Input },],
        'submission': [{ type: Input },],
        'src': [{ type: Input },],
        'url': [{ type: Input },],
        'service': [{ type: Input },],
        'options': [{ type: Input },],
        'readOnly': [{ type: Input },],
        'hideComponents': [{ type: Input },],
        'refresh': [{ type: Input },],
        'error': [{ type: Input },],
        'success': [{ type: Input },],
        'language': [{ type: Input },],
        'render': [{ type: Output },],
        'customEvent': [{ type: Output },],
        'submit': [{ type: Output },],
        'prevPage': [{ type: Output },],
        'nextPage': [{ type: Output },],
        'beforeSubmit': [{ type: Output },],
        'change': [{ type: Output },],
        'invalid': [{ type: Output },],
        'errorChange': [{ type: Output },],
        'formLoad': [{ type: Output },],
        'formioElement': [{ type: ViewChild, args: ['formio',] },],
    };
    return FormioComponent;
}());
export { FormioComponent };
//# sourceMappingURL=formio.component.js.map