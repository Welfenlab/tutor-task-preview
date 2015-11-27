var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var md = require('./src/markdown');
var fs = require('fs');

var ViewModel = function(params) {
  this.descriptionId = cuid();
  this.solutionId = cuid();
  this.task = params.task;
  this.showSolutionPreview = params.showSolutionPreview !== false;
};

ViewModel.prototype.init = function(element) {
  md()(this.descriptionId).render(this.task.text());

  if (this.showSolutionPreview) {
    //TODO render solution
    createPreview = md({
      testProcessor: {
        register: function(name) {
          if (lastEdit > curEdit)
            return;
          curTests[taskIdx].push({name: name, passes: false})
        },
        testResult: function(err, idx) {
          if (lastEdit > curEdit)
            return;
          curTests[taskIdx][idx].passes = (err == null)
        },
        testsFinished: function() {
          if (lastEdit > curEdit)
            return;
          allTests(curTests);
        },
        template: function() { return ""; }
      }
    });

    prev = createPreview(this.solutionId)
    prev.render(this.task.tests() + "\n\n" + this.task.solution)
  }
};

ko.components.register('tutor-task-preview', {
  template: fs.readFileSync(__dirname + "/src/task_preview.html", "utf8"),
  viewModel: ViewModel
});

module.exports = 'tutor-task-preview';
