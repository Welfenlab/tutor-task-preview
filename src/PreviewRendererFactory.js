var md = require('./markdown');
var _ = require('lodash');

var PreviewRendererFactory = function (id, setTestResults) {
  var lastEdit = 0
  var curTests = {}
  var renderer;
  var sboxDisconnect = null
  if (setTestResults) {
    renderer = md({
      testProcessor: {
        init: function (disconnect) {
          sboxDisconnect = disconnect;
        },
        register: function(name, testCode) {
          if (lastEdit <= renderer.__curEdit) {
            curTests[name] = {
              name: name,
              status: "running",
              test: testCode,
              passes: undefined
            };
          }
        },
        testResult: function(err, name) {
          if (lastEdit <= renderer.__curEdit) {
            curTests[name].passes = (err == null);
            curTests[name].status = "finished"
            curTests[name].error = err;
          }
        },
        testsFinished: function(err) {
          if (lastEdit <= renderer.__curEdit) {
            setTestResults(_.map(curTests, function(t){
              if (t.status == "running") {
                t.status = err
              }
              if (!t.passes /* undefined or false */) {
                t.passes = false
              }
              return t
            }));
          }
        },
        template: function() { return ""; }
      }
    })(id);
  } else {
    renderer = md()(id);
  }

  return {
    render: function() {
      curTests = {}
      lastEdit++;
      renderer.__curEdit = lastEdit;
      // if there is still another instance of the sandbox environment running, kill it.
      if(sboxDisconnect && typeof(sboxDisconnect) == "function"){
        sboxDisconnect()
      }
      return renderer.render.apply(null, arguments);
    }
  };
};

module.exports = PreviewRendererFactory
