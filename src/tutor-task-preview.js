var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var md = require('./markdown');
var fs = require('fs');
var path = require('path');
require('./tutor-task-markdown')

var ViewModel = function (params) {
  this.task = ko.utils.unwrapObservable(params.task);
  this.showModelSolutionPreview = params.showModelSolutionPreview;
  this.testResults = params.task.testResults;
  this.autoRefresh = params.autoRefresh || ko.observable(true);

  this.renderedSolution = ko.computed(function() {
    if (this.task.tests) {
      return this.task.tests() + "\n\n" + this.task.solution();
    } else {
      return this.task.solution();
    }
  }.bind(this));
};

ko.components.register('tutor-task-preview', {
  template: fs.readFileSync(path.join(__dirname, 'task_preview.html'), 'utf8'),
  viewModel: ViewModel
});
