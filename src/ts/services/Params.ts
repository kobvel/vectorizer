///<reference path="../../../tools/typings/tsd.d.ts" />
///<reference path="../../../tools/typings/typescriptApp.d.ts" />

(function() {
  angular
    .module('Vectorizer.services')
    .service('Params', Params);


  function Params() {
    return {
        gamma: 0.5,
        input: {
        turdsize: 2,
        alphamax: 1,
        turnpolicy: 'minority',
        opttolerance: 0.2,
        color: '#000000',
        fillcolor: '#FFFFFF',
        invert: false,
        tight: false
      },
      turnpolicy: ['minority', 'majority', 'black', 'white', 'left', 'right', 'random']
      
    };
   
  }
})();