var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var markdown = require('./src/markdown')();
var fs = require('fs');

var ViewModel = function(params) {
  console.log(cuid());
  this.descriptionId = cuid();
  this.solutionId = cuid();
  this.task = params.task;
  this.showSolutionPreview = params.showSolutionPreview !== false;
};

ViewModel.prototype.init = function(element) {
  //markdown()(this.descriptionId).render(this.task.text());
  if (this.showSolutionPreview) {
    //TODO render solution
  }
};

ko.components.register('tutor-task-preview', {
  template: fs.readFileSync(__dirname + "/src/task_preview.html", "utf8"),
  viewModel: ViewModel
});

module.exports = 'tutor-task-preview';
