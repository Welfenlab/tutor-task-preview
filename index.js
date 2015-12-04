var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var md = require('./src/markdown');
var fs = require('fs');
var path = require('path');

var ViewModel = function(params) {
  this.descriptionId = cuid();
  this.solutionId = cuid();
  this.modelSolutionId = cuid();
  this.task = ko.utils.unwrapObservable(params.task);
  //this.showSolutionPreview = params.showSolutionPreview !== false;
  this.showSolutionPreview = true;
  this.showModelSolutionPreview = params.showModelSolutionPreview;
  this.testResults = params.task.testResults;
};
 
ViewModel.prototype.init = function(element) {
  md()(this.descriptionId).render(this.task.text());

  if (this.showModelSolutionPreview) {
    md()(this.modelSolutionId).render(this.task.modelSolution());
  }

  if (this.showSolutionPreview) {
    var lastEdit = 0;
    var createPreview = function(id, testResults){
      var curEdit = lastEdit
      var curTests = {}
      var sboxDisconnect = null
      return md({
        testProcessor: {
          init: function(disconnect) {
            if(sboxDisconnect && typeof(sboxDisconnect) == "function"){
              sboxDisconnect()
            }
            sboxDisconnect = disconnect
          },
          register: function(name) {
            if (lastEdit > curEdit) {
              return;
            }
            curTests[name] = {name: name, status: "running", passes: undefined}
          },
          testResult: function(err, name) {
            if (lastEdit > curEdit)
              return;
            curTests[name].passes = (err == null)
            if(err){
              curTests[name].error = err
            }
          },
          testsFinished: function(err) {
            if (lastEdit > curEdit)
              return;
            var tests = _.map(curTests, function(t){
              if(t.status == "running"){
                t.status = err
              }
              if (!t.passes /* undefined or false */) {
                t.passes = false
              }
              return t
            })
            if (testResults)
              testResults(tests);
          },
          template: function() { return ""; }
        }
      })(id);
    }

    var reRender = function() {
      lastEdit = lastEdit + 1;
      var prev = createPreview(this.solutionId, this.testResults);
      prev.render(this.task.tests() + "\n\n" + this.task.solution())
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
