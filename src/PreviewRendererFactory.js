var md = require('./markdown');
var _ = require('lodash');

var PreviewRendererFactory = function (id, setTestResults) {
  var lastEdit = 0

  var renderer = function (curEdit) {
    if (setTestResults) {
      var sboxDisconnect = null
      var curTests = {}

      return md({
        testProcessor: {
          init: function (disconnect) {
            if(sboxDisconnect && typeof(sboxDisconnect) == "function"){
              sboxDisconnect()
            }
            sboxDisconnect = disconnect;
          },
          register: function(name) {
            if (lastEdit <= curEdit) {
              curTests[name] = {
                name: name,
                status: "running",
                passes: undefined
              };
            }
          },
          testResult: function(err, name) {
            if (lastEdit <= curEdit) {
              curTests[name].passes = (err == null);
              curTests[name].error = err;
            }
          },
          testsFinished: function(err) {
            if (lastEdit <= curEdit) {
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
      return md()(id);
    }
  };

  return {
    render: function() {
      lastEdit++;
      return renderer(lastEdit).render.apply(null, arguments);
    }
  };
};

module.exports = PreviewRendererFactory
