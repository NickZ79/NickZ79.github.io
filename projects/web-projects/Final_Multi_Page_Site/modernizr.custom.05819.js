/*! modernizr.custom.05819.js */
/*! Modernizr 2.8.3 (Custom Build) | MIT & BSD */

window.Modernizr = (function(window, document, undefined) {
  var version = '2.8.3',
      Modernizr = {},
      docElement = document.documentElement,
      mod = 'modernizr',
      mStyle = document.createElement(mod).style;

  Modernizr.flexbox = (function() {
    var props = ['flexWrap', 'WebkitFlexWrap', 'msFlexWrap'];
    for (var i in props) {
      if (mStyle[props[i]] !== undefined) {
        return true;
      }
    }
    return false;
  })();

  Modernizr.canvas = (function() {
    var elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
  })();

  Modernizr.localstorage = (function() {
    try {
      localStorage.setItem(mod, mod);
      localStorage.removeItem(mod);
      return true;
    } catch (e) {
      return false;
    }
  })();

  Modernizr.placeholder = (function() {
    return 'placeholder' in document.createElement('input');
  })();

  docElement.className += " " + (Modernizr.flexbox ? "flexbox" : "no-flexbox");
  docElement.className += Modernizr.canvas ? " canvas" : " no-canvas";
  docElement.className += Modernizr.localstorage ? " localstorage" : " no-localstorage";
  docElement.className += Modernizr.placeholder ? " placeholder" : " no-placeholder";

  return Modernizr;
})(this, this.document);
