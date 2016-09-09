(function(app) {
  app.AppComponent =
    ng.core.Component({
      selector: 'my-app',
      template: '<h1>This is my hacker tracker.  There are many like it, but this one is mine.</h1>'
    })
    .Class({
      constructor: function() {}
    });
})(window.app || (window.app = {}));
