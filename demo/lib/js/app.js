var App;

(function(window, document) {
  var Moon;
  Moon = function(target, args) {
    return new Moon.fn.init(target, args);
  };
  Moon.fn = Moon.prototype = {
    _collection: [],
    _stack: [],
    _step: -1,
    _callback: void 0,
    init: function(target, args) {
      var self;
      self = this;
      self._collection = self.getMoonCollection(target);
      return self;
    },
    getMoonCollection: function(target) {
      var aux, collection, el, selectedElements, tgt, _i, _j, _k, _l, _len, _len1, _len2, _len3;
      collection = [];
      if (!(target instanceof Array)) {
        aux = target;
        target = [];
        target.push(aux);
      }
      for (_i = 0, _len = target.length; _i < _len; _i++) {
        tgt = target[_i];
        if (tgt instanceof NodeList || tgt instanceof HTMLCollection) {
          for (_j = 0, _len1 = tgt.length; _j < _len1; _j++) {
            el = tgt[_j];
            collection.push(el);
          }
        } else if (typeof tgt === "string") {
          selectedElements = document.querySelectorAll(tgt);
          for (_k = 0, _len2 = selectedElements.length; _k < _len2; _k++) {
            el = selectedElements[_k];
            collection.push(el);
          }
        } else if (!(tgt instanceof Array)) {
          collection.push(tgt);
        } else {
          for (_l = 0, _len3 = tgt.length; _l < _len3; _l++) {
            el = tgt[_l];
            collection.push(el);
          }
        }
      }
      return collection;
    },
    getPrefix: function(prop) {
      var indexOfDash, pre, prefixes, _i, _len;
      prefixes = ["", "webkit", "moz", "ms", "O"];
      indexOfDash = prop.indexOf("-");
      while (indexOfDash > -1) {
        prop = prop.slice(0, indexOfDash) + prop.charAt(indexOfDash + 1).toUpperCase() + prop.slice(indexOfDash + 2);
        indexOfDash = prop.indexOf("-");
      }
      for (_i = 0, _len = prefixes.length; _i < _len; _i++) {
        pre = prefixes[_i];
        if (pre !== "") {
          prop = prop.charAt(0).toUpperCase() + prop.slice(1);
        }
        if (document.documentElement.style[pre + prop] != null) {
          return pre + prop;
        }
      }
    },
    animate: function(args) {
      var animationProps, arg, self, value;
      self = this;
      animationProps = {
        duration: 0,
        delay: 0,
        easing: "ease",
        beforeAnimation: void 0,
        afterAnimation: void 0
      };
      for (arg in args) {
        value = args[arg];
        animationProps[arg] = value;
      }
      self._stack.push(animationProps);
      return self;
    },
    play: function(callback) {
      var self;
      self = this;
      self._callback = callback;
      self._play();
      return self;
    },
    _play: function() {
      var anm, el, key, nextTimeout, self, value, _i, _len, _ref;
      self = this;
      self._step++;
      anm = self._stack[self._step];
      if (typeof anm !== "undefined" && anm !== null) {
        if (typeof anm.beforeAnimation === "function") {
          anm.beforeAnimation();
        }
        _ref = self._collection;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          el = _ref[_i];
          el.style[self.getPrefix("transition")] = "" + anm.duration + "ms all " + anm.easing + " " + anm.delay + "ms";
          for (key in anm) {
            value = anm[key];
            if (key === "duration" || key === "delay" || key === "easing") {
              continue;
            }
            el.style[self.getPrefix(key)] = value;
          }
        }
        return nextTimeout = setTimeout(function() {
          if (typeof anm.afterAnimation === "function") {
            anm.afterAnimation();
          }
          self._play();
          return clearTimeout(nextTimeout);
        }, anm.delay + anm.duration);
      } else {
        self._step = -1;
        if (self._callback != null) {
          return self._callback();
        }
      }
    }
  };
  Moon.fn.init.prototype = Moon.fn;
  return window.Moon = Moon;
})(window, document);

App = {
  init: function() {
    var a;
    a = App;
    a.animationWrapper = document.getElementById("animationWrapper");
    a.animationSelect = document.getElementById('animationSelector');
    a.animationSelect.addEventListener('change', function(e) {
      return a.controllers.activateAnimation(this.value);
    });
    return a.controllers.cleanAnimations();
  },
  controllers: {
    activateAnimation: function(index) {
      var a, tgt;
      a = App;
      index = parseInt(index, 10);
      a.controllers.cleanAnimations();
      switch (index) {
        case 0:
          tgt = a.controllers.createTargets(1);
          return setTimeout(function() {
            return Moon(tgt).animate({
              "transform": "scale(1.2) rotate(180deg)",
              "duration": 1500
            }).play();
          }, 500);
        case 1:
          tgt = a.controllers.createTargets(1);
          return setTimeout(function() {
            return Moon(tgt).animate({
              "transform": "scale(1.2) rotate(180deg)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(-100px, 0, 0) scale(0.8)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(300px, 0, 0) rotate(30deg)",
              "duration": 1500
            }).animate({
              "transform": "translate3d(0,0,0)",
              "duration": 1500
            }).play();
          }, 500);
      }
    },
    cleanAnimations: function() {
      var a, _results;
      a = App;
      _results = [];
      while (a.animationWrapper.firstChild) {
        _results.push(a.animationWrapper.removeChild(a.animationWrapper.firstChild));
      }
      return _results;
    },
    createTargets: function(num) {
      var a, i, tgt, tgtFrag, tgtsCreated, _i;
      a = App;
      tgtsCreated = [];
      tgtFrag = document.createDocumentFragment();
      for (i = _i = 1; 1 <= num ? _i <= num : _i >= num; i = 1 <= num ? ++_i : --_i) {
        tgt = document.createElement('div');
        tgt.classList.add('target');
        tgtFrag.appendChild(tgt);
        tgtsCreated.push(tgt);
      }
      a.animationWrapper.appendChild(tgtFrag);
      return tgtsCreated;
    }
  }
};

window.onload = App.init;