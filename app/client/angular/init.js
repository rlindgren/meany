
$(document).ready(function() {
  // Fixes facebook redirect bug (?)
  if (window.location.hash === "#_=_") window.location.hash = "";

  // Start 'er up
  angular.bootstrap(document, ['meany']);
});