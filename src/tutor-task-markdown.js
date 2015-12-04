var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var md = require('./markdown');
var fs = require('fs');
var path = require('path');
var PreviewRendererFactory = require('./PreviewRendererFactory');

var ViewModel = function (params) {
  this.id = cuid();
  this.markdown = params.markdown;
  this.testResults = params.testResults;
};

ViewModel.prototype.init = function(element) {
  var renderer = PreviewRendererFactory(this.id, this.testResults);
  this.markdown.subscribe(function() {
    renderer.render(this.markdown());
  }.bind(this));
  renderer.render(this.markdown());
};

ko.components.register('tutor-task-markdown', {
  template: fs.readFileSync(path.join(__dirname, 'task_markdown.html'), 'utf8'),
  viewModel: ViewModel
});
