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
  this.autoRefresh = params.autoRefresh || ko.observable(true);
};

ViewModel.prototype.init = function(element) {
  this.renderer = PreviewRendererFactory(this.id, this.testResults);
  this.renderer.render(this.markdown());

  this.markdown.subscribe(function() {
    if (this.autoRefresh()) {
      this.renderer.render(this.markdown());
    }
  }.bind(this));

  this.autoRefresh.subscribe(function() {
    //re-render whenever autoRefresh is changed
    this.renderer.render(this.markdown());
  }.bind(this));
};

ko.components.register('tutor-task-markdown', {
  template: fs.readFileSync(path.join(__dirname, 'task_markdown.html'), 'utf8'),
  viewModel: ViewModel
});
