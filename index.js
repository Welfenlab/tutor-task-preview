var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var md = require('./src/markdown');
var fs = require('fs');
var path = require('path');

var ViewModel = function(params) {
  this.descriptionId = cuid();
  this.solutionId = cuid();
  this.task = params.task;
  this.showSolutionPreview = params.showSolutionPreview !== false;
  this.testResults = params.testResults;
};

ViewModel.prototype.init = function(element) {
  md()(this.descriptionId).render(this.task.text());

  if (this.showSolutionPreview) {
    var lastEdit = 0;
    var createPreview = function(id){
      var curEdit = lastEdit
      var curTests = []
      md({
        testProcessor: {
          register: function(name) {
            if (lastEdit > curEdit) {
              return;
            }
            // var taskIdx = this.task.?
            curTests.push({name: name, passes: false})
          },
          testResult: function(err, idx) {
            if (lastEdit > curEdit)
              return;
            curTests[idx].passes = (err == null)
          },
          testsFinished: function() {
            if (lastEdit > curEdit)
              return;
            if (this.testResults)
              this.testResults(curTests);
          },
          template: function() { return ""; }
        }
      });
    }

    var reRender = function() {
      var prev = createPreview(this.solutionId);
      lastEdit = lastEdit + 1;
      prev.render(this.task.tests() + "\n\n" + this.task.solution());
    }.bind(this);
    reRender();
    this.task.solution.subscribe(reRender);
  }
};

ko.components.register('tutor-task-preview', {
  template: fs.readFileSync(path.join(__dirname, 'src/task_preview.html'), 'utf8'),
  viewModel: ViewModel
});

module.exports = {
  markdownProcessor: md()()
};
