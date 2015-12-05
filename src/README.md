# tutor-task-preview
This module defines [Knockout components][ko-elem] to simplify the usage of our markdown converter and additional features.

After this module is required, the following two components are available:
* `<tutor-task-markdown>`  
  Converts a markdown string to HTML and displays it. Supports everything that
  [@tutor/markdown2html][md2h] supports (i.e. executing scripts, running tests, trees,
  graphs).

* `<tutor-task-preview>`  
  Displays markdown fields and titles for an entire _task_, this includes the
  task description, the solution and a model solution.

[ko-elem]:http://knockoutjs.com/documentation/component-overview.html
[md2h]:https://github.com/Welfenlab/tutor-markdown2html

## Usage

### tutor-task-markdown
The `<tutor-task-markdown>` element has two parameters:
* `markdown` specifies a (observable) markdown string to convert
* `testResults` _(optional)_ specifies a function to call whenever the tests results are updated (as `ko.observable` variables are functions, you can also use these)

#### Example
```js
var viewModel = {
  markdown: ko.observable(
    "# hello world\n" +
    "```tests\n" +
    "it('should be put into the test results', function(){ });" +
    "```"),
  testResults: ko.observable([])
}
```
```html
<tutor-task-markdown params="
  markdown: markdown,
  testResults: testResults">
</tutor-task-markdown>
```

### tutor-task-preview
The `<tutor-task-preview>` element has three parameters:
* `task` specifies the task to display, it needs to have (at least) the following
  observable properties:
  * `number` specifies the number of the task
  * `title` _(optional)_ specifies the title of the task
  * `text` specifies the task description
  * `solution` specifies the solution to display
  * `tests` _(optional)_ additional markdown with tests to prepend to the
    rendered markdown; may be used to specify tests that the user won't see
  * `testResults` _(optional)_ target for test results; if specified, this is used
    as the `testResults` callback (as described above)
* `showModelSolutionPreview` _(optional, defaults to false)_ displays the markdown
  specified in `task.modelSolution()` below the solution

#### Example
```js
var viewModel = {
  task: {
    number: 42,
    title: 'Demo task',
    text: 'In _this_ task, you should do something.'
  }
}
```
```html
<tutor-task-preview params="task: task"></tutor-task-preview>
```
