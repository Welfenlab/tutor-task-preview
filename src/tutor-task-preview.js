var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var md = require('./markdown');
var fs = require('fs');
var path = require('path');
require('./tutor-task-markdown')

var ViewModel = function(params) {
  this.solutionId = cuid();
  this.modelSolutionId = cuid();
  this.task = ko.utils.unwrapObservable(params.task);
  //this.showSolutionPreview = params.showSolutionPreview !== false;
  this.showSolutionPreview = true;
  this.showModelSolutionPreview = params.showModelSolutionPreview;
  this.testResults = params.task.testResults;

  this.renderedSolution = ko.computed(function() {
    return this.task.tests() + "\n\n" + this.task.solution();
  }.bind(this));
};

ViewModel.prototype.init = function(element) {
  if (this.showModelSolutionPreview) {
    md()(this.modelSolutionId).render(this.task.modelSolution());
  }
};

ko.components.register('tutor-task-preview', {
  template: fs.readFileSync(path.join(__dirname, 'task_preview.html'), 'utf8'),
  viewModel: ViewModel
});
