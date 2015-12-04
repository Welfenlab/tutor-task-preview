var md = require('./src/markdown');

require('./src/tutor-task-markdown'); //register <tutor-task-markdown />
require('./src/tutor-task-preview'); //register <tutor-task-preview />

module.exports = {
  markdownProcessor: md()()
};
