var ko = require('knockout');
var _ = require('lodash');
var cuid = require('cuid');
var md = require('./markdown');
var fs = require('fs');
var path = require('path');

var ViewModel = function(params) {
  this.id = cuid();
  this.markdown = params.markdown;
};

ViewModel.prototype.init = function(element) {
  var render = md()(this.id).render(this.markdown());
  this.markdown.subscribe(render);
};

ko.components.register('tutor-task-markdown', {
  template: fs.readFileSync(path.join(__dirname, 'task_markdown.html'), 'utf8'),
  viewModel: ViewModel
});
