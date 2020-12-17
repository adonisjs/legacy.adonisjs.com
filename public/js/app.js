/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./node_modules/alpinejs/dist/alpine.js":
/*!**********************************************!*
  !*** ./node_modules/alpinejs/dist/alpine.js ***!
  \**********************************************/
/***/ (function(module) {

(function (global, factory) {
   true ? module.exports = factory() :
  0;
}(this, (function () { 'use strict';

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  // Thanks @stimulus:
  // https://github.com/stimulusjs/stimulus/blob/master/packages/%40stimulus/core/src/application.ts
  function domReady() {
    return new Promise(resolve => {
      if (document.readyState == "loading") {
        document.addEventListener("DOMContentLoaded", resolve);
      } else {
        resolve();
      }
    });
  }
  function arrayUnique(array) {
    return Array.from(new Set(array));
  }
  function isTesting() {
    return navigator.userAgent.includes("Node.js") || navigator.userAgent.includes("jsdom");
  }
  function checkedAttrLooseCompare(valueA, valueB) {
    return valueA == valueB;
  }
  function warnIfMalformedTemplate(el, directive) {
    if (el.tagName.toLowerCase() !== 'template') {
      console.warn(`Alpine: [${directive}] directive should only be added to <template> tags. See https://github.com/alpinejs/alpine#${directive}`);
    } else if (el.content.childElementCount !== 1) {
      console.warn(`Alpine: <template> tag with [${directive}] encountered with multiple element roots. Make sure <template> only has a single child element.`);
    }
  }
  function kebabCase(subject) {
    return subject.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/[_\s]/, '-').toLowerCase();
  }
  function camelCase(subject) {
    return subject.toLowerCase().replace(/-(\w)/g, (match, char) => char.toUpperCase());
  }
  function walk(el, callback) {
    if (callback(el) === false) return;
    let node = el.firstElementChild;

    while (node) {
      walk(node, callback);
      node = node.nextElementSibling;
    }
  }
  function debounce(func, wait) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
        timeout = null;
        func.apply(context, args);
      };

      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  function saferEval(expression, dataContext, additionalHelperVariables = {}) {
    if (typeof expression === 'function') {
      return expression.call(dataContext);
    }

    return new Function(['$data', ...Object.keys(additionalHelperVariables)], `var __alpine_result; with($data) { __alpine_result = ${expression} }; return __alpine_result`)(dataContext, ...Object.values(additionalHelperVariables));
  }
  function saferEvalNoReturn(expression, dataContext, additionalHelperVariables = {}) {
    if (typeof expression === 'function') {
      return Promise.resolve(expression.call(dataContext, additionalHelperVariables['$event']));
    }

    let AsyncFunction = Function;
    /* MODERN-ONLY:START */

    AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    /* MODERN-ONLY:END */
    // For the cases when users pass only a function reference to the caller: `x-on:click="foo"`
    // Where "foo" is a function. Also, we'll pass the function the event instance when we call it.

    if (Object.keys(dataContext).includes(expression)) {
      let methodReference = new Function(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { return ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables));

      if (typeof methodReference === 'function') {
        return Promise.resolve(methodReference.call(dataContext, additionalHelperVariables['$event']));
      } else {
        return Promise.resolve();
      }
    }

    return Promise.resolve(new AsyncFunction(['dataContext', ...Object.keys(additionalHelperVariables)], `with(dataContext) { ${expression} }`)(dataContext, ...Object.values(additionalHelperVariables)));
  }
  const xAttrRE = /^x-(on|bind|data|text|html|model|if|for|show|cloak|transition|ref|spread)\b/;
  function isXAttr(attr) {
    const name = replaceAtAndColonWithStandardSyntax(attr.name);
    return xAttrRE.test(name);
  }
  function getXAttrs(el, component, type) {
    let directives = Array.from(el.attributes).filter(isXAttr).map(parseHtmlAttribute); // Get an object of directives from x-spread.

    let spreadDirective = directives.filter(directive => directive.type === 'spread')[0];

    if (spreadDirective) {
      let spreadObject = saferEval(spreadDirective.expression, component.$data); // Add x-spread directives to the pile of existing directives.

      directives = directives.concat(Object.entries(spreadObject).map(([name, value]) => parseHtmlAttribute({
        name,
        value
      })));
    }

    if (type) return directives.filter(i => i.type === type);
    return sortDirectives(directives);
  }

  function sortDirectives(directives) {
    let directiveOrder = ['bind', 'model', 'show', 'catch-all'];
    return directives.sort((a, b) => {
      let typeA = directiveOrder.indexOf(a.type) === -1 ? 'catch-all' : a.type;
      let typeB = directiveOrder.indexOf(b.type) === -1 ? 'catch-all' : b.type;
      return directiveOrder.indexOf(typeA) - directiveOrder.indexOf(typeB);
    });
  }

  function parseHtmlAttribute({
    name,
    value
  }) {
    const normalizedName = replaceAtAndColonWithStandardSyntax(name);
    const typeMatch = normalizedName.match(xAttrRE);
    const valueMatch = normalizedName.match(/:([a-zA-Z0-9\-:]+)/);
    const modifiers = normalizedName.match(/\.[^.\]]+(?=[^\]]*$)/g) || [];
    return {
      type: typeMatch ? typeMatch[1] : null,
      value: valueMatch ? valueMatch[1] : null,
      modifiers: modifiers.map(i => i.replace('.', '')),
      expression: value
    };
  }
  function isBooleanAttr(attrName) {
    // As per HTML spec table https://html.spec.whatwg.org/multipage/indices.html#attributes-3:boolean-attribute
    // Array roughly ordered by estimated usage
    const booleanAttributes = ['disabled', 'checked', 'required', 'readonly', 'hidden', 'open', 'selected', 'autofocus', 'itemscope', 'multiple', 'novalidate', 'allowfullscreen', 'allowpaymentrequest', 'formnovalidate', 'autoplay', 'controls', 'loop', 'muted', 'playsinline', 'default', 'ismap', 'reversed', 'async', 'defer', 'nomodule'];
    return booleanAttributes.includes(attrName);
  }
  function replaceAtAndColonWithStandardSyntax(name) {
    if (name.startsWith('@')) {
      return name.replace('@', 'x-on:');
    } else if (name.startsWith(':')) {
      return name.replace(':', 'x-bind:');
    }

    return name;
  }
  function convertClassStringToArray(classList, filterFn = Boolean) {
    return classList.split(' ').filter(filterFn);
  }
  const TRANSITION_TYPE_IN = 'in';
  const TRANSITION_TYPE_OUT = 'out';
  const TRANSITION_CANCELLED = 'cancelled';
  function transitionIn(el, show, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return show();

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_IN) {
      // there is already a similar transition going on, this was probably triggered by
      // a change in a different property, let's just leave the previous one doing its job
      return;
    }

    const attrs = getXAttrs(el, component, 'transition');
    const showAttr = getXAttrs(el, component, 'show')[0]; // If this is triggered by a x-show.transition.

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers; // If x-show.transition.out, we'll skip the "in" transition.

      if (modifiers.includes('out') && !modifiers.includes('in')) return show();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out'); // If x-show.transition.in...out... only use "in" related modifiers for this transition.

      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index < modifiers.indexOf('out')) : modifiers;
      transitionHelperIn(el, modifiers, show, reject); // Otherwise, we can assume x-transition:enter.
    } else if (attrs.some(attr => ['enter', 'enter-start', 'enter-end'].includes(attr.value))) {
      transitionClassesIn(el, component, attrs, show, reject);
    } else {
      // If neither, just show that damn thing.
      show();
    }
  }
  function transitionOut(el, hide, reject, component, forceSkip = false) {
    // We don't want to transition on the initial page load.
    if (forceSkip) return hide();

    if (el.__x_transition && el.__x_transition.type === TRANSITION_TYPE_OUT) {
      // there is already a similar transition going on, this was probably triggered by
      // a change in a different property, let's just leave the previous one doing its job
      return;
    }

    const attrs = getXAttrs(el, component, 'transition');
    const showAttr = getXAttrs(el, component, 'show')[0];

    if (showAttr && showAttr.modifiers.includes('transition')) {
      let modifiers = showAttr.modifiers;
      if (modifiers.includes('in') && !modifiers.includes('out')) return hide();
      const settingBothSidesOfTransition = modifiers.includes('in') && modifiers.includes('out');
      modifiers = settingBothSidesOfTransition ? modifiers.filter((i, index) => index > modifiers.indexOf('out')) : modifiers;
      transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hide, reject);
    } else if (attrs.some(attr => ['leave', 'leave-start', 'leave-end'].includes(attr.value))) {
      transitionClassesOut(el, component, attrs, hide, reject);
    } else {
      hide();
    }
  }
  function transitionHelperIn(el, modifiers, showCallback, reject) {
    // Default values inspired by: https://material.io/design/motion/speed.html#duration
    const styleValues = {
      duration: modifierValue(modifiers, 'duration', 150),
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      },
      second: {
        opacity: 1,
        scale: 100
      }
    };
    transitionHelper(el, modifiers, showCallback, () => {}, reject, styleValues, TRANSITION_TYPE_IN);
  }
  function transitionHelperOut(el, modifiers, settingBothSidesOfTransition, hideCallback, reject) {
    // Make the "out" transition .5x slower than the "in". (Visually better)
    // HOWEVER, if they explicitly set a duration for the "out" transition,
    // use that.
    const duration = settingBothSidesOfTransition ? modifierValue(modifiers, 'duration', 150) : modifierValue(modifiers, 'duration', 150) / 2;
    const styleValues = {
      duration: duration,
      origin: modifierValue(modifiers, 'origin', 'center'),
      first: {
        opacity: 1,
        scale: 100
      },
      second: {
        opacity: 0,
        scale: modifierValue(modifiers, 'scale', 95)
      }
    };
    transitionHelper(el, modifiers, () => {}, hideCallback, reject, styleValues, TRANSITION_TYPE_OUT);
  }

  function modifierValue(modifiers, key, fallback) {
    // If the modifier isn't present, use the default.
    if (modifiers.indexOf(key) === -1) return fallback; // If it IS present, grab the value after it: x-show.transition.duration.500ms

    const rawValue = modifiers[modifiers.indexOf(key) + 1];
    if (!rawValue) return fallback;

    if (key === 'scale') {
      // Check if the very next value is NOT a number and return the fallback.
      // If x-show.transition.scale, we'll use the default scale value.
      // That is how a user opts out of the opacity transition.
      if (!isNumeric(rawValue)) return fallback;
    }

    if (key === 'duration') {
      // Support x-show.transition.duration.500ms && duration.500
      let match = rawValue.match(/([0-9]+)ms/);
      if (match) return match[1];
    }

    if (key === 'origin') {
      // Support chaining origin directions: x-show.transition.top.right
      if (['top', 'right', 'left', 'center', 'bottom'].includes(modifiers[modifiers.indexOf(key) + 2])) {
        return [rawValue, modifiers[modifiers.indexOf(key) + 2]].join(' ');
      }
    }

    return rawValue;
  }

  function transitionHelper(el, modifiers, hook1, hook2, reject, styleValues, type) {
    // clear the previous transition if exists to avoid caching the wrong styles
    if (el.__x_transition) {
      el.__x_transition.cancel && el.__x_transition.cancel();
    } // If the user set these style values, we'll put them back when we're done with them.


    const opacityCache = el.style.opacity;
    const transformCache = el.style.transform;
    const transformOriginCache = el.style.transformOrigin; // If no modifiers are present: x-show.transition, we'll default to both opacity and scale.

    const noModifiers = !modifiers.includes('opacity') && !modifiers.includes('scale');
    const transitionOpacity = noModifiers || modifiers.includes('opacity');
    const transitionScale = noModifiers || modifiers.includes('scale'); // These are the explicit stages of a transition (same stages for in and for out).
    // This way you can get a birds eye view of the hooks, and the differences
    // between them.

    const stages = {
      start() {
        if (transitionOpacity) el.style.opacity = styleValues.first.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.first.scale / 100})`;
      },

      during() {
        if (transitionScale) el.style.transformOrigin = styleValues.origin;
        el.style.transitionProperty = [transitionOpacity ? `opacity` : ``, transitionScale ? `transform` : ``].join(' ').trim();
        el.style.transitionDuration = `${styleValues.duration / 1000}s`;
        el.style.transitionTimingFunction = `cubic-bezier(0.4, 0.0, 0.2, 1)`;
      },

      show() {
        hook1();
      },

      end() {
        if (transitionOpacity) el.style.opacity = styleValues.second.opacity;
        if (transitionScale) el.style.transform = `scale(${styleValues.second.scale / 100})`;
      },

      hide() {
        hook2();
      },

      cleanup() {
        if (transitionOpacity) el.style.opacity = opacityCache;
        if (transitionScale) el.style.transform = transformCache;
        if (transitionScale) el.style.transformOrigin = transformOriginCache;
        el.style.transitionProperty = null;
        el.style.transitionDuration = null;
        el.style.transitionTimingFunction = null;
      }

    };
    transition(el, stages, type, reject);
  }

  const ensureStringExpression = (expression, el, component) => {
    return typeof expression === 'function' ? component.evaluateReturnExpression(el, expression) : expression;
  };

  function transitionClassesIn(el, component, directives, showCallback, reject) {
    const enter = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter') || {
      expression: ''
    }).expression, el, component));
    const enterStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-start') || {
      expression: ''
    }).expression, el, component));
    const enterEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'enter-end') || {
      expression: ''
    }).expression, el, component));
    transitionClasses(el, enter, enterStart, enterEnd, showCallback, () => {}, TRANSITION_TYPE_IN, reject);
  }
  function transitionClassesOut(el, component, directives, hideCallback, reject) {
    const leave = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave') || {
      expression: ''
    }).expression, el, component));
    const leaveStart = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-start') || {
      expression: ''
    }).expression, el, component));
    const leaveEnd = convertClassStringToArray(ensureStringExpression((directives.find(i => i.value === 'leave-end') || {
      expression: ''
    }).expression, el, component));
    transitionClasses(el, leave, leaveStart, leaveEnd, () => {}, hideCallback, TRANSITION_TYPE_OUT, reject);
  }
  function transitionClasses(el, classesDuring, classesStart, classesEnd, hook1, hook2, type, reject) {
    // clear the previous transition if exists to avoid caching the wrong classes
    if (el.__x_transition) {
      el.__x_transition.cancel && el.__x_transition.cancel();
    }

    const originalClasses = el.__x_original_classes || [];
    const stages = {
      start() {
        el.classList.add(...classesStart);
      },

      during() {
        el.classList.add(...classesDuring);
      },

      show() {
        hook1();
      },

      end() {
        // Don't remove classes that were in the original class attribute.
        el.classList.remove(...classesStart.filter(i => !originalClasses.includes(i)));
        el.classList.add(...classesEnd);
      },

      hide() {
        hook2();
      },

      cleanup() {
        el.classList.remove(...classesDuring.filter(i => !originalClasses.includes(i)));
        el.classList.remove(...classesEnd.filter(i => !originalClasses.includes(i)));
      }

    };
    transition(el, stages, type, reject);
  }
  function transition(el, stages, type, reject) {
    const finish = once(() => {
      stages.hide(); // Adding an "isConnected" check, in case the callback
      // removed the element from the DOM.

      if (el.isConnected) {
        stages.cleanup();
      }

      delete el.__x_transition;
    });
    el.__x_transition = {
      // Set transition type so we can avoid clearing transition if the direction is the same
      type: type,
      // create a callback for the last stages of the transition so we can call it
      // from different point and early terminate it. Once will ensure that function
      // is only called one time.
      cancel: once(() => {
        reject(TRANSITION_CANCELLED);
        finish();
      }),
      finish,
      // This store the next animation frame so we can cancel it
      nextFrame: null
    };
    stages.start();
    stages.during();
    el.__x_transition.nextFrame = requestAnimationFrame(() => {
      // Note: Safari's transitionDuration property will list out comma separated transition durations
      // for every single transition property. Let's grab the first one and call it a day.
      let duration = Number(getComputedStyle(el).transitionDuration.replace(/,.*/, '').replace('s', '')) * 1000;

      if (duration === 0) {
        duration = Number(getComputedStyle(el).animationDuration.replace('s', '')) * 1000;
      }

      stages.show();
      el.__x_transition.nextFrame = requestAnimationFrame(() => {
        stages.end();
        setTimeout(el.__x_transition.finish, duration);
      });
    });
  }
  function isNumeric(subject) {
    return !Array.isArray(subject) && !isNaN(subject);
  } // Thanks @vuejs
  // https://github.com/vuejs/vue/blob/4de4649d9637262a9b007720b59f80ac72a5620c/src/shared/util.js

  function once(callback) {
    let called = false;
    return function () {
      if (!called) {
        called = true;
        callback.apply(this, arguments);
      }
    };
  }

  function handleForDirective(component, templateEl, expression, initialUpdate, extraVars) {
    warnIfMalformedTemplate(templateEl, 'x-for');
    let iteratorNames = typeof expression === 'function' ? parseForExpression(component.evaluateReturnExpression(templateEl, expression)) : parseForExpression(expression);
    let items = evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, templateEl, iteratorNames, extraVars); // As we walk the array, we'll also walk the DOM (updating/creating as we go).

    let currentEl = templateEl;
    items.forEach((item, index) => {
      let iterationScopeVariables = getIterationScopeVariables(iteratorNames, item, index, items, extraVars());
      let currentKey = generateKeyForIteration(component, templateEl, index, iterationScopeVariables);
      let nextEl = lookAheadForMatchingKeyedElementAndMoveItIfFound(currentEl.nextElementSibling, currentKey); // If we haven't found a matching key, insert the element at the current position.

      if (!nextEl) {
        nextEl = addElementInLoopAfterCurrentEl(templateEl, currentEl); // And transition it in if it's not the first page load.

        transitionIn(nextEl, () => {}, () => {}, component, initialUpdate);
        nextEl.__x_for = iterationScopeVariables;
        component.initializeElements(nextEl, () => nextEl.__x_for); // Otherwise update the element we found.
      } else {
        // Temporarily remove the key indicator to allow the normal "updateElements" to work.
        delete nextEl.__x_for_key;
        nextEl.__x_for = iterationScopeVariables;
        component.updateElements(nextEl, () => nextEl.__x_for);
      }

      currentEl = nextEl;
      currentEl.__x_for_key = currentKey;
    });
    removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component);
  } // This was taken from VueJS 2.* core. Thanks Vue!

  function parseForExpression(expression) {
    let forIteratorRE = /,([^,\}\]]*)(?:,([^,\}\]]*))?$/;
    let stripParensRE = /^\(|\)$/g;
    let forAliasRE = /([\s\S]*?)\s+(?:in|of)\s+([\s\S]*)/;
    let inMatch = expression.match(forAliasRE);
    if (!inMatch) return;
    let res = {};
    res.items = inMatch[2].trim();
    let item = inMatch[1].trim().replace(stripParensRE, '');
    let iteratorMatch = item.match(forIteratorRE);

    if (iteratorMatch) {
      res.item = item.replace(forIteratorRE, '').trim();
      res.index = iteratorMatch[1].trim();

      if (iteratorMatch[2]) {
        res.collection = iteratorMatch[2].trim();
      }
    } else {
      res.item = item;
    }

    return res;
  }

  function getIterationScopeVariables(iteratorNames, item, index, items, extraVars) {
    // We must create a new object, so each iteration has a new scope
    let scopeVariables = extraVars ? _objectSpread2({}, extraVars) : {};
    scopeVariables[iteratorNames.item] = item;
    if (iteratorNames.index) scopeVariables[iteratorNames.index] = index;
    if (iteratorNames.collection) scopeVariables[iteratorNames.collection] = items;
    return scopeVariables;
  }

  function generateKeyForIteration(component, el, index, iterationScopeVariables) {
    let bindKeyAttribute = getXAttrs(el, component, 'bind').filter(attr => attr.value === 'key')[0]; // If the dev hasn't specified a key, just return the index of the iteration.

    if (!bindKeyAttribute) return index;
    return component.evaluateReturnExpression(el, bindKeyAttribute.expression, () => iterationScopeVariables);
  }

  function evaluateItemsAndReturnEmptyIfXIfIsPresentAndFalseOnElement(component, el, iteratorNames, extraVars) {
    let ifAttribute = getXAttrs(el, component, 'if')[0];

    if (ifAttribute && !component.evaluateReturnExpression(el, ifAttribute.expression)) {
      return [];
    }

    let items = component.evaluateReturnExpression(el, iteratorNames.items, extraVars); // This adds support for the `i in n` syntax.

    if (isNumeric(items) && items > 0) {
      items = Array.from(Array(items).keys(), i => i + 1);
    }

    return items;
  }

  function addElementInLoopAfterCurrentEl(templateEl, currentEl) {
    let clone = document.importNode(templateEl.content, true);
    currentEl.parentElement.insertBefore(clone, currentEl.nextElementSibling);
    return currentEl.nextElementSibling;
  }

  function lookAheadForMatchingKeyedElementAndMoveItIfFound(nextEl, currentKey) {
    if (!nextEl) return; // If the the key's DO match, no need to look ahead.

    if (nextEl.__x_for_key === currentKey) return nextEl; // If they don't, we'll look ahead for a match.
    // If we find it, we'll move it to the current position in the loop.

    let tmpNextEl = nextEl;

    while (tmpNextEl) {
      if (tmpNextEl.__x_for_key === currentKey) {
        return tmpNextEl.parentElement.insertBefore(tmpNextEl, nextEl);
      }

      tmpNextEl = tmpNextEl.nextElementSibling && tmpNextEl.nextElementSibling.__x_for_key !== undefined ? tmpNextEl.nextElementSibling : false;
    }
  }

  function removeAnyLeftOverElementsFromPreviousUpdate(currentEl, component) {
    var nextElementFromOldLoop = currentEl.nextElementSibling && currentEl.nextElementSibling.__x_for_key !== undefined ? currentEl.nextElementSibling : false;

    while (nextElementFromOldLoop) {
      let nextElementFromOldLoopImmutable = nextElementFromOldLoop;
      let nextSibling = nextElementFromOldLoop.nextElementSibling;
      transitionOut(nextElementFromOldLoop, () => {
        nextElementFromOldLoopImmutable.remove();
      }, () => {}, component);
      nextElementFromOldLoop = nextSibling && nextSibling.__x_for_key !== undefined ? nextSibling : false;
    }
  }

  function handleAttributeBindingDirective(component, el, attrName, expression, extraVars, attrType, modifiers) {
    var value = component.evaluateReturnExpression(el, expression, extraVars);

    if (attrName === 'value') {
      if (Alpine.ignoreFocusedForValueBinding && document.activeElement.isSameNode(el)) return; // If nested model key is undefined, set the default value to empty string.

      if (value === undefined && expression.match(/\./)) {
        value = '';
      }

      if (el.type === 'radio') {
        // Set radio value from x-bind:value, if no "value" attribute exists.
        // If there are any initial state values, radio will have a correct
        // "checked" value since x-bind:value is processed before x-model.
        if (el.attributes.value === undefined && attrType === 'bind') {
          el.value = value;
        } else if (attrType !== 'bind') {
          el.checked = checkedAttrLooseCompare(el.value, value);
        }
      } else if (el.type === 'checkbox') {
        // If we are explicitly binding a string to the :value, set the string,
        // If the value is a boolean, leave it alone, it will be set to "on"
        // automatically.
        if (typeof value !== 'boolean' && ![null, undefined].includes(value) && attrType === 'bind') {
          el.value = String(value);
        } else if (attrType !== 'bind') {
          if (Array.isArray(value)) {
            // I'm purposely not using Array.includes here because it's
            // strict, and because of Numeric/String mis-casting, I
            // want the "includes" to be "fuzzy".
            el.checked = value.some(val => checkedAttrLooseCompare(val, el.value));
          } else {
            el.checked = !!value;
          }
        }
      } else if (el.tagName === 'SELECT') {
        updateSelect(el, value);
      } else {
        if (el.value === value) return;
        el.value = value;
      }
    } else if (attrName === 'class') {
      if (Array.isArray(value)) {
        const originalClasses = el.__x_original_classes || [];
        el.setAttribute('class', arrayUnique(originalClasses.concat(value)).join(' '));
      } else if (typeof value === 'object') {
        // Sorting the keys / class names by their boolean value will ensure that
        // anything that evaluates to `false` and needs to remove classes is run first.
        const keysSortedByBooleanValue = Object.keys(value).sort((a, b) => value[a] - value[b]);
        keysSortedByBooleanValue.forEach(classNames => {
          if (value[classNames]) {
            convertClassStringToArray(classNames).forEach(className => el.classList.add(className));
          } else {
            convertClassStringToArray(classNames).forEach(className => el.classList.remove(className));
          }
        });
      } else {
        const originalClasses = el.__x_original_classes || [];
        const newClasses = convertClassStringToArray(value);
        el.setAttribute('class', arrayUnique(originalClasses.concat(newClasses)).join(' '));
      }
    } else {
      attrName = modifiers.includes('camel') ? camelCase(attrName) : attrName; // If an attribute's bound value is null, undefined or false, remove the attribute

      if ([null, undefined, false].includes(value)) {
        el.removeAttribute(attrName);
      } else {
        isBooleanAttr(attrName) ? setIfChanged(el, attrName, attrName) : setIfChanged(el, attrName, value);
      }
    }
  }

  function setIfChanged(el, attrName, value) {
    if (el.getAttribute(attrName) != value) {
      el.setAttribute(attrName, value);
    }
  }

  function updateSelect(el, value) {
    const arrayWrappedValue = [].concat(value).map(value => {
      return value + '';
    });
    Array.from(el.options).forEach(option => {
      option.selected = arrayWrappedValue.includes(option.value || option.text);
    });
  }

  function handleTextDirective(el, output, expression) {
    // If nested model key is undefined, set the default value to empty string.
    if (output === undefined && expression.match(/\./)) {
      output = '';
    }

    el.textContent = output;
  }

  function handleHtmlDirective(component, el, expression, extraVars) {
    el.innerHTML = component.evaluateReturnExpression(el, expression, extraVars);
  }

  function handleShowDirective(component, el, value, modifiers, initialUpdate = false) {
    const hide = () => {
      el.style.display = 'none';
      el.__x_is_shown = false;
    };

    const show = () => {
      if (el.style.length === 1 && el.style.display === 'none') {
        el.removeAttribute('style');
      } else {
        el.style.removeProperty('display');
      }

      el.__x_is_shown = true;
    };

    if (initialUpdate === true) {
      if (value) {
        show();
      } else {
        hide();
      }

      return;
    }

    const handle = (resolve, reject) => {
      if (value) {
        if (el.style.display === 'none' || el.__x_transition) {
          transitionIn(el, () => {
            show();
          }, reject, component);
        }

        resolve(() => {});
      } else {
        if (el.style.display !== 'none') {
          transitionOut(el, () => {
            resolve(() => {
              hide();
            });
          }, reject, component);
        } else {
          resolve(() => {});
        }
      }
    }; // The working of x-show is a bit complex because we need to
    // wait for any child transitions to finish before hiding
    // some element. Also, this has to be done recursively.
    // If x-show.immediate, foregoe the waiting.


    if (modifiers.includes('immediate')) {
      handle(finish => finish(), () => {});
      return;
    } // x-show is encountered during a DOM tree walk. If an element
    // we encounter is NOT a child of another x-show element we
    // can execute the previous x-show stack (if one exists).


    if (component.showDirectiveLastElement && !component.showDirectiveLastElement.contains(el)) {
      component.executeAndClearRemainingShowDirectiveStack();
    }

    component.showDirectiveStack.push(handle);
    component.showDirectiveLastElement = el;
  }

  function handleIfDirective(component, el, expressionResult, initialUpdate, extraVars) {
    warnIfMalformedTemplate(el, 'x-if');
    const elementHasAlreadyBeenAdded = el.nextElementSibling && el.nextElementSibling.__x_inserted_me === true;

    if (expressionResult && (!elementHasAlreadyBeenAdded || el.__x_transition)) {
      const clone = document.importNode(el.content, true);
      el.parentElement.insertBefore(clone, el.nextElementSibling);
      transitionIn(el.nextElementSibling, () => {}, () => {}, component, initialUpdate);
      component.initializeElements(el.nextElementSibling, extraVars);
      el.nextElementSibling.__x_inserted_me = true;
    } else if (!expressionResult && elementHasAlreadyBeenAdded) {
      transitionOut(el.nextElementSibling, () => {
        el.nextElementSibling.remove();
      }, () => {}, component, initialUpdate);
    }
  }

  function registerListener(component, el, event, modifiers, expression, extraVars = {}) {
    const options = {
      passive: modifiers.includes('passive')
    };

    if (modifiers.includes('camel')) {
      event = camelCase(event);
    }

    if (modifiers.includes('away')) {
      let handler = e => {
        // Don't do anything if the click came from the element or within it.
        if (el.contains(e.target)) return; // Don't do anything if this element isn't currently visible.

        if (el.offsetWidth < 1 && el.offsetHeight < 1) return; // Now that we are sure the element is visible, AND the click
        // is from outside it, let's run the expression.

        runListenerHandler(component, expression, e, extraVars);

        if (modifiers.includes('once')) {
          document.removeEventListener(event, handler, options);
        }
      }; // Listen for this event at the root level.


      document.addEventListener(event, handler, options);
    } else {
      let listenerTarget = modifiers.includes('window') ? window : modifiers.includes('document') ? document : el;

      let handler = e => {
        // Remove this global event handler if the element that declared it
        // has been removed. It's now stale.
        if (listenerTarget === window || listenerTarget === document) {
          if (!document.body.contains(el)) {
            listenerTarget.removeEventListener(event, handler, options);
            return;
          }
        }

        if (isKeyEvent(event)) {
          if (isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers)) {
            return;
          }
        }

        if (modifiers.includes('prevent')) e.preventDefault();
        if (modifiers.includes('stop')) e.stopPropagation(); // If the .self modifier isn't present, or if it is present and
        // the target element matches the element we are registering the
        // event on, run the handler

        if (!modifiers.includes('self') || e.target === el) {
          const returnValue = runListenerHandler(component, expression, e, extraVars);
          returnValue.then(value => {
            if (value === false) {
              e.preventDefault();
            } else {
              if (modifiers.includes('once')) {
                listenerTarget.removeEventListener(event, handler, options);
              }
            }
          });
        }
      };

      if (modifiers.includes('debounce')) {
        let nextModifier = modifiers[modifiers.indexOf('debounce') + 1] || 'invalid-wait';
        let wait = isNumeric(nextModifier.split('ms')[0]) ? Number(nextModifier.split('ms')[0]) : 250;
        handler = debounce(handler, wait);
      }

      listenerTarget.addEventListener(event, handler, options);
    }
  }

  function runListenerHandler(component, expression, e, extraVars) {
    return component.evaluateCommandExpression(e.target, expression, () => {
      return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        '$event': e
      });
    });
  }

  function isKeyEvent(event) {
    return ['keydown', 'keyup'].includes(event);
  }

  function isListeningForASpecificKeyThatHasntBeenPressed(e, modifiers) {
    let keyModifiers = modifiers.filter(i => {
      return !['window', 'document', 'prevent', 'stop'].includes(i);
    });

    if (keyModifiers.includes('debounce')) {
      let debounceIndex = keyModifiers.indexOf('debounce');
      keyModifiers.splice(debounceIndex, isNumeric((keyModifiers[debounceIndex + 1] || 'invalid-wait').split('ms')[0]) ? 2 : 1);
    } // If no modifier is specified, we'll call it a press.


    if (keyModifiers.length === 0) return false; // If one is passed, AND it matches the key pressed, we'll call it a press.

    if (keyModifiers.length === 1 && keyModifiers[0] === keyToModifier(e.key)) return false; // The user is listening for key combinations.

    const systemKeyModifiers = ['ctrl', 'shift', 'alt', 'meta', 'cmd', 'super'];
    const selectedSystemKeyModifiers = systemKeyModifiers.filter(modifier => keyModifiers.includes(modifier));
    keyModifiers = keyModifiers.filter(i => !selectedSystemKeyModifiers.includes(i));

    if (selectedSystemKeyModifiers.length > 0) {
      const activelyPressedKeyModifiers = selectedSystemKeyModifiers.filter(modifier => {
        // Alias "cmd" and "super" to "meta"
        if (modifier === 'cmd' || modifier === 'super') modifier = 'meta';
        return e[`${modifier}Key`];
      }); // If all the modifiers selected are pressed, ...

      if (activelyPressedKeyModifiers.length === selectedSystemKeyModifiers.length) {
        // AND the remaining key is pressed as well. It's a press.
        if (keyModifiers[0] === keyToModifier(e.key)) return false;
      }
    } // We'll call it NOT a valid keypress.


    return true;
  }

  function keyToModifier(key) {
    switch (key) {
      case '/':
        return 'slash';

      case ' ':
      case 'Spacebar':
        return 'space';

      default:
        return key && kebabCase(key);
    }
  }

  function registerModelListener(component, el, modifiers, expression, extraVars) {
    // If the element we are binding to is a select, a radio, or checkbox
    // we'll listen for the change event instead of the "input" event.
    var event = el.tagName.toLowerCase() === 'select' || ['checkbox', 'radio'].includes(el.type) || modifiers.includes('lazy') ? 'change' : 'input';
    const listenerExpression = `${expression} = rightSideOfExpression($event, ${expression})`;
    registerListener(component, el, event, modifiers, listenerExpression, () => {
      return _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        rightSideOfExpression: generateModelAssignmentFunction(el, modifiers, expression)
      });
    });
  }

  function generateModelAssignmentFunction(el, modifiers, expression) {
    if (el.type === 'radio') {
      // Radio buttons only work properly when they share a name attribute.
      // People might assume we take care of that for them, because
      // they already set a shared "x-model" attribute.
      if (!el.hasAttribute('name')) el.setAttribute('name', expression);
    }

    return (event, currentValue) => {
      // Check for event.detail due to an issue where IE11 handles other events as a CustomEvent.
      if (event instanceof CustomEvent && event.detail) {
        return event.detail;
      } else if (el.type === 'checkbox') {
        // If the data we are binding to is an array, toggle its value inside the array.
        if (Array.isArray(currentValue)) {
          const newValue = modifiers.includes('number') ? safeParseNumber(event.target.value) : event.target.value;
          return event.target.checked ? currentValue.concat([newValue]) : currentValue.filter(el => !checkedAttrLooseCompare(el, newValue));
        } else {
          return event.target.checked;
        }
      } else if (el.tagName.toLowerCase() === 'select' && el.multiple) {
        return modifiers.includes('number') ? Array.from(event.target.selectedOptions).map(option => {
          const rawValue = option.value || option.text;
          return safeParseNumber(rawValue);
        }) : Array.from(event.target.selectedOptions).map(option => {
          return option.value || option.text;
        });
      } else {
        const rawValue = event.target.value;
        return modifiers.includes('number') ? safeParseNumber(rawValue) : modifiers.includes('trim') ? rawValue.trim() : rawValue;
      }
    };
  }

  function safeParseNumber(rawValue) {
    const number = rawValue ? parseFloat(rawValue) : null;
    return isNumeric(number) ? number : rawValue;
  }

  /**
   * Copyright (C) 2017 salesforce.com, inc.
   */
  const { isArray } = Array;
  const { getPrototypeOf, create: ObjectCreate, defineProperty: ObjectDefineProperty, defineProperties: ObjectDefineProperties, isExtensible, getOwnPropertyDescriptor, getOwnPropertyNames, getOwnPropertySymbols, preventExtensions, hasOwnProperty, } = Object;
  const { push: ArrayPush, concat: ArrayConcat, map: ArrayMap, } = Array.prototype;
  function isUndefined(obj) {
      return obj === undefined;
  }
  function isFunction(obj) {
      return typeof obj === 'function';
  }
  function isObject(obj) {
      return typeof obj === 'object';
  }
  const proxyToValueMap = new WeakMap();
  function registerProxy(proxy, value) {
      proxyToValueMap.set(proxy, value);
  }
  const unwrap = (replicaOrAny) => proxyToValueMap.get(replicaOrAny) || replicaOrAny;

  function wrapValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getProxy(value) : value;
  }
  /**
   * Unwrap property descriptors will set value on original descriptor
   * We only need to unwrap if value is specified
   * @param descriptor external descrpitor provided to define new property on original value
   */
  function unwrapDescriptor(descriptor) {
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = unwrap(descriptor.value);
      }
      return descriptor;
  }
  function lockShadowTarget(membrane, shadowTarget, originalTarget) {
      const targetKeys = ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      targetKeys.forEach((key) => {
          let descriptor = getOwnPropertyDescriptor(originalTarget, key);
          // We do not need to wrap the descriptor if configurable
          // Because we can deal with wrapping it when user goes through
          // Get own property descriptor. There is also a chance that this descriptor
          // could change sometime in the future, so we can defer wrapping
          // until we need to
          if (!descriptor.configurable) {
              descriptor = wrapDescriptor(membrane, descriptor, wrapValue);
          }
          ObjectDefineProperty(shadowTarget, key, descriptor);
      });
      preventExtensions(shadowTarget);
  }
  class ReactiveProxyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getProxy(value);
      }
      set(shadowTarget, key, value) {
          const { originalTarget, membrane: { valueMutated } } = this;
          const oldValue = originalTarget[key];
          if (oldValue !== value) {
              originalTarget[key] = value;
              valueMutated(originalTarget, key);
          }
          else if (key === 'length' && isArray(originalTarget)) {
              // fix for issue #236: push will add the new index, and by the time length
              // is updated, the internal length is already equal to the new length value
              // therefore, the oldValue is equal to the value. This is the forking logic
              // to support this use case.
              valueMutated(originalTarget, key);
          }
          return true;
      }
      deleteProperty(shadowTarget, key) {
          const { originalTarget, membrane: { valueMutated } } = this;
          delete originalTarget[key];
          valueMutated(originalTarget, key);
          return true;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      isExtensible(shadowTarget) {
          const shadowIsExtensible = isExtensible(shadowTarget);
          if (!shadowIsExtensible) {
              return shadowIsExtensible;
          }
          const { originalTarget, membrane } = this;
          const targetIsExtensible = isExtensible(originalTarget);
          if (!targetIsExtensible) {
              lockShadowTarget(membrane, shadowTarget, originalTarget);
          }
          return targetIsExtensible;
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getPrototypeOf(shadowTarget) {
          const { originalTarget } = this;
          return getPrototypeOf(originalTarget);
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = this.membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value, setter or getter (if available) cannot observe
          // mutations, just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapValue);
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          const { originalTarget, membrane } = this;
          lockShadowTarget(membrane, shadowTarget, originalTarget);
          preventExtensions(originalTarget);
          return true;
      }
      defineProperty(shadowTarget, key, descriptor) {
          const { originalTarget, membrane } = this;
          const { valueMutated } = membrane;
          const { configurable } = descriptor;
          // We have to check for value in descriptor
          // because Object.freeze(proxy) calls this method
          // with only { configurable: false, writeable: false }
          // Additionally, method will only be called with writeable:false
          // if the descriptor has a value, as opposed to getter/setter
          // So we can just check if writable is present and then see if
          // value is present. This eliminates getter and setter descriptors
          if (hasOwnProperty.call(descriptor, 'writable') && !hasOwnProperty.call(descriptor, 'value')) {
              const originalDescriptor = getOwnPropertyDescriptor(originalTarget, key);
              descriptor.value = originalDescriptor.value;
          }
          ObjectDefineProperty(originalTarget, key, unwrapDescriptor(descriptor));
          if (configurable === false) {
              ObjectDefineProperty(shadowTarget, key, wrapDescriptor(membrane, descriptor, wrapValue));
          }
          valueMutated(originalTarget, key);
          return true;
      }
  }

  function wrapReadOnlyValue(membrane, value) {
      return membrane.valueIsObservable(value) ? membrane.getReadOnlyProxy(value) : value;
  }
  class ReadOnlyHandler {
      constructor(membrane, value) {
          this.originalTarget = value;
          this.membrane = membrane;
      }
      get(shadowTarget, key) {
          const { membrane, originalTarget } = this;
          const value = originalTarget[key];
          const { valueObserved } = membrane;
          valueObserved(originalTarget, key);
          return membrane.getReadOnlyProxy(value);
      }
      set(shadowTarget, key, value) {
          return false;
      }
      deleteProperty(shadowTarget, key) {
          return false;
      }
      apply(shadowTarget, thisArg, argArray) {
          /* No op */
      }
      construct(target, argArray, newTarget) {
          /* No op */
      }
      has(shadowTarget, key) {
          const { originalTarget, membrane: { valueObserved } } = this;
          valueObserved(originalTarget, key);
          return key in originalTarget;
      }
      ownKeys(shadowTarget) {
          const { originalTarget } = this;
          return ArrayConcat.call(getOwnPropertyNames(originalTarget), getOwnPropertySymbols(originalTarget));
      }
      setPrototypeOf(shadowTarget, prototype) {
      }
      getOwnPropertyDescriptor(shadowTarget, key) {
          const { originalTarget, membrane } = this;
          const { valueObserved } = membrane;
          // keys looked up via hasOwnProperty need to be reactive
          valueObserved(originalTarget, key);
          let desc = getOwnPropertyDescriptor(originalTarget, key);
          if (isUndefined(desc)) {
              return desc;
          }
          const shadowDescriptor = getOwnPropertyDescriptor(shadowTarget, key);
          if (!isUndefined(shadowDescriptor)) {
              return shadowDescriptor;
          }
          // Note: by accessing the descriptor, the key is marked as observed
          // but access to the value or getter (if available) cannot be observed,
          // just like regular methods, in which case we just do nothing.
          desc = wrapDescriptor(membrane, desc, wrapReadOnlyValue);
          if (hasOwnProperty.call(desc, 'set')) {
              desc.set = undefined; // readOnly membrane does not allow setters
          }
          if (!desc.configurable) {
              // If descriptor from original target is not configurable,
              // We must copy the wrapped descriptor over to the shadow target.
              // Otherwise, proxy will throw an invariant error.
              // This is our last chance to lock the value.
              // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/getOwnPropertyDescriptor#Invariants
              ObjectDefineProperty(shadowTarget, key, desc);
          }
          return desc;
      }
      preventExtensions(shadowTarget) {
          return false;
      }
      defineProperty(shadowTarget, key, descriptor) {
          return false;
      }
  }
  function createShadowTarget(value) {
      let shadowTarget = undefined;
      if (isArray(value)) {
          shadowTarget = [];
      }
      else if (isObject(value)) {
          shadowTarget = {};
      }
      return shadowTarget;
  }
  const ObjectDotPrototype = Object.prototype;
  function defaultValueIsObservable(value) {
      // intentionally checking for null
      if (value === null) {
          return false;
      }
      // treat all non-object types, including undefined, as non-observable values
      if (typeof value !== 'object') {
          return false;
      }
      if (isArray(value)) {
          return true;
      }
      const proto = getPrototypeOf(value);
      return (proto === ObjectDotPrototype || proto === null || getPrototypeOf(proto) === null);
  }
  const defaultValueObserved = (obj, key) => {
      /* do nothing */
  };
  const defaultValueMutated = (obj, key) => {
      /* do nothing */
  };
  const defaultValueDistortion = (value) => value;
  function wrapDescriptor(membrane, descriptor, getValue) {
      const { set, get } = descriptor;
      if (hasOwnProperty.call(descriptor, 'value')) {
          descriptor.value = getValue(membrane, descriptor.value);
      }
      else {
          if (!isUndefined(get)) {
              descriptor.get = function () {
                  // invoking the original getter with the original target
                  return getValue(membrane, get.call(unwrap(this)));
              };
          }
          if (!isUndefined(set)) {
              descriptor.set = function (value) {
                  // At this point we don't have a clear indication of whether
                  // or not a valid mutation will occur, we don't have the key,
                  // and we are not sure why and how they are invoking this setter.
                  // Nevertheless we preserve the original semantics by invoking the
                  // original setter with the original target and the unwrapped value
                  set.call(unwrap(this), membrane.unwrapProxy(value));
              };
          }
      }
      return descriptor;
  }
  class ReactiveMembrane {
      constructor(options) {
          this.valueDistortion = defaultValueDistortion;
          this.valueMutated = defaultValueMutated;
          this.valueObserved = defaultValueObserved;
          this.valueIsObservable = defaultValueIsObservable;
          this.objectGraph = new WeakMap();
          if (!isUndefined(options)) {
              const { valueDistortion, valueMutated, valueObserved, valueIsObservable } = options;
              this.valueDistortion = isFunction(valueDistortion) ? valueDistortion : defaultValueDistortion;
              this.valueMutated = isFunction(valueMutated) ? valueMutated : defaultValueMutated;
              this.valueObserved = isFunction(valueObserved) ? valueObserved : defaultValueObserved;
              this.valueIsObservable = isFunction(valueIsObservable) ? valueIsObservable : defaultValueIsObservable;
          }
      }
      getProxy(value) {
          const unwrappedValue = unwrap(value);
          const distorted = this.valueDistortion(unwrappedValue);
          if (this.valueIsObservable(distorted)) {
              const o = this.getReactiveState(unwrappedValue, distorted);
              // when trying to extract the writable version of a readonly
              // we return the readonly.
              return o.readOnly === value ? value : o.reactive;
          }
          return distorted;
      }
      getReadOnlyProxy(value) {
          value = unwrap(value);
          const distorted = this.valueDistortion(value);
          if (this.valueIsObservable(distorted)) {
              return this.getReactiveState(value, distorted).readOnly;
          }
          return distorted;
      }
      unwrapProxy(p) {
          return unwrap(p);
      }
      getReactiveState(value, distortedValue) {
          const { objectGraph, } = this;
          let reactiveState = objectGraph.get(distortedValue);
          if (reactiveState) {
              return reactiveState;
          }
          const membrane = this;
          reactiveState = {
              get reactive() {
                  const reactiveHandler = new ReactiveProxyHandler(membrane, distortedValue);
                  // caching the reactive proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), reactiveHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'reactive', { value: proxy });
                  return proxy;
              },
              get readOnly() {
                  const readOnlyHandler = new ReadOnlyHandler(membrane, distortedValue);
                  // caching the readOnly proxy after the first time it is accessed
                  const proxy = new Proxy(createShadowTarget(distortedValue), readOnlyHandler);
                  registerProxy(proxy, value);
                  ObjectDefineProperty(this, 'readOnly', { value: proxy });
                  return proxy;
              }
          };
          objectGraph.set(distortedValue, reactiveState);
          return reactiveState;
      }
  }
  /** version: 0.26.0 */

  function wrap(data, mutationCallback) {

    let membrane = new ReactiveMembrane({
      valueMutated(target, key) {
        mutationCallback(target, key);
      }

    });
    return {
      data: membrane.getProxy(data),
      membrane: membrane
    };
  }
  function unwrap$1(membrane, observable) {
    let unwrappedData = membrane.unwrapProxy(observable);
    let copy = {};
    Object.keys(unwrappedData).forEach(key => {
      if (['$el', '$refs', '$nextTick', '$watch'].includes(key)) return;
      copy[key] = unwrappedData[key];
    });
    return copy;
  }

  class Component {
    constructor(el, componentForClone = null) {
      this.$el = el;
      const dataAttr = this.$el.getAttribute('x-data');
      const dataExpression = dataAttr === '' ? '{}' : dataAttr;
      const initExpression = this.$el.getAttribute('x-init');
      let dataExtras = {
        $el: this.$el
      };
      let canonicalComponentElementReference = componentForClone ? componentForClone.$el : this.$el;
      Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
        Object.defineProperty(dataExtras, `$${name}`, {
          get: function get() {
            return callback(canonicalComponentElementReference);
          }
        });
      });
      this.unobservedData = componentForClone ? componentForClone.getUnobservedData() : saferEval(dataExpression, dataExtras);
      // Construct a Proxy-based observable. This will be used to handle reactivity.

      let {
        membrane,
        data
      } = this.wrapDataInObservable(this.unobservedData);
      this.$data = data;
      this.membrane = membrane; // After making user-supplied data methods reactive, we can now add
      // our magic properties to the original data for access.

      this.unobservedData.$el = this.$el;
      this.unobservedData.$refs = this.getRefsProxy();
      this.nextTickStack = [];

      this.unobservedData.$nextTick = callback => {
        this.nextTickStack.push(callback);
      };

      this.watchers = {};

      this.unobservedData.$watch = (property, callback) => {
        if (!this.watchers[property]) this.watchers[property] = [];
        this.watchers[property].push(callback);
      };
      /* MODERN-ONLY:START */
      // We remove this piece of code from the legacy build.
      // In IE11, we have already defined our helpers at this point.
      // Register custom magic properties.


      Object.entries(Alpine.magicProperties).forEach(([name, callback]) => {
        Object.defineProperty(this.unobservedData, `$${name}`, {
          get: function get() {
            return callback(canonicalComponentElementReference);
          }
        });
      });
      /* MODERN-ONLY:END */

      this.showDirectiveStack = [];
      this.showDirectiveLastElement;
      componentForClone || Alpine.onBeforeComponentInitializeds.forEach(callback => callback(this));
      var initReturnedCallback; // If x-init is present AND we aren't cloning (skip x-init on clone)

      if (initExpression && !componentForClone) {
        // We want to allow data manipulation, but not trigger DOM updates just yet.
        // We haven't even initialized the elements with their Alpine bindings. I mean c'mon.
        this.pauseReactivity = true;
        initReturnedCallback = this.evaluateReturnExpression(this.$el, initExpression);
        this.pauseReactivity = false;
      } // Register all our listeners and set all our attribute bindings.


      this.initializeElements(this.$el); // Use mutation observer to detect new elements being added within this component at run-time.
      // Alpine's just so darn flexible amirite?

      this.listenForNewElementsToInitialize();

      if (typeof initReturnedCallback === 'function') {
        // Run the callback returned from the "x-init" hook to allow the user to do stuff after
        // Alpine's got it's grubby little paws all over everything.
        initReturnedCallback.call(this.$data);
      }

      componentForClone || setTimeout(() => {
        Alpine.onComponentInitializeds.forEach(callback => callback(this));
      }, 0);
    }

    getUnobservedData() {
      return unwrap$1(this.membrane, this.$data);
    }

    wrapDataInObservable(data) {
      var self = this;
      let updateDom = debounce(function () {
        self.updateElements(self.$el);
      }, 0);
      return wrap(data, (target, key) => {
        if (self.watchers[key]) {
          // If there's a watcher for this specific key, run it.
          self.watchers[key].forEach(callback => callback(target[key]));
        } else if (Array.isArray(target)) {
          // Arrays are special cases, if any of the items change, we consider the array as mutated.
          Object.keys(self.watchers).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // Ignore length mutations since they would result in duplicate calls.
            // For example, when calling push, we would get a mutation for the item's key
            // and a second mutation for the length property.

            if (key === 'length') return;
            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData[part])) {
                self.watchers[fullDotNotationKey].forEach(callback => callback(target));
              }

              return comparisonData[part];
            }, self.unobservedData);
          });
        } else {
          // Let's walk through the watchers with "dot-notation" (foo.bar) and see
          // if this mutation fits any of them.
          Object.keys(self.watchers).filter(i => i.includes('.')).forEach(fullDotNotationKey => {
            let dotNotationParts = fullDotNotationKey.split('.'); // If this dot-notation watcher's last "part" doesn't match the current
            // key, then skip it early for performance reasons.

            if (key !== dotNotationParts[dotNotationParts.length - 1]) return; // Now, walk through the dot-notation "parts" recursively to find
            // a match, and call the watcher if one's found.

            dotNotationParts.reduce((comparisonData, part) => {
              if (Object.is(target, comparisonData)) {
                // Run the watchers.
                self.watchers[fullDotNotationKey].forEach(callback => callback(target[key]));
              }

              return comparisonData[part];
            }, self.unobservedData);
          });
        } // Don't react to data changes for cases like the `x-created` hook.


        if (self.pauseReactivity) return;
        updateDom();
      });
    }

    walkAndSkipNestedComponents(el, callback, initializeComponentCallback = () => {}) {
      walk(el, el => {
        // We've hit a component.
        if (el.hasAttribute('x-data')) {
          // If it's not the current one.
          if (!el.isSameNode(this.$el)) {
            // Initialize it if it's not.
            if (!el.__x) initializeComponentCallback(el); // Now we'll let that sub-component deal with itself.

            return false;
          }
        }

        return callback(el);
      });
    }

    initializeElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop
        if (el.__x_for_key !== undefined) return false; // Don't touch spawns from if directives

        if (el.__x_inserted_me !== undefined) return false;
        this.initializeElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack();
      this.executeAndClearNextTickStack(rootEl);
    }

    initializeElement(el, extraVars) {
      // To support class attribute merging, we have to know what the element's
      // original class attribute looked like for reference.
      if (el.hasAttribute('class') && getXAttrs(el, this).length > 0) {
        el.__x_original_classes = convertClassStringToArray(el.getAttribute('class'));
      }

      this.registerListeners(el, extraVars);
      this.resolveBoundAttributes(el, true, extraVars);
    }

    updateElements(rootEl, extraVars = () => {}) {
      this.walkAndSkipNestedComponents(rootEl, el => {
        // Don't touch spawns from for loop (and check if the root is actually a for loop in a parent, don't skip it.)
        if (el.__x_for_key !== undefined && !el.isSameNode(this.$el)) return false;
        this.updateElement(el, extraVars);
      }, el => {
        el.__x = new Component(el);
      });
      this.executeAndClearRemainingShowDirectiveStack();
      this.executeAndClearNextTickStack(rootEl);
    }

    executeAndClearNextTickStack(el) {
      // Skip spawns from alpine directives
      if (el === this.$el && this.nextTickStack.length > 0) {
        // We run the tick stack after the next frame to allow any
        // running transitions to pass the initial show stage.
        requestAnimationFrame(() => {
          while (this.nextTickStack.length > 0) {
            this.nextTickStack.shift()();
          }
        });
      }
    }

    executeAndClearRemainingShowDirectiveStack() {
      // The goal here is to start all the x-show transitions
      // and build a nested promise chain so that elements
      // only hide when the children are finished hiding.
      this.showDirectiveStack.reverse().map(handler => {
        return new Promise((resolve, reject) => {
          handler(resolve, reject);
        });
      }).reduce((promiseChain, promise) => {
        return promiseChain.then(() => {
          return promise.then(finishElement => {
            finishElement();
          });
        });
      }, Promise.resolve(() => {})).catch(e => {
        if (e !== TRANSITION_CANCELLED) throw e;
      }); // We've processed the handler stack. let's clear it.

      this.showDirectiveStack = [];
      this.showDirectiveLastElement = undefined;
    }

    updateElement(el, extraVars) {
      this.resolveBoundAttributes(el, false, extraVars);
    }

    registerListeners(el, extraVars) {
      getXAttrs(el, this).forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'on':
            registerListener(this, el, value, modifiers, expression, extraVars);
            break;

          case 'model':
            registerModelListener(this, el, modifiers, expression, extraVars);
            break;
        }
      });
    }

    resolveBoundAttributes(el, initialUpdate = false, extraVars) {
      let attrs = getXAttrs(el, this);
      attrs.forEach(({
        type,
        value,
        modifiers,
        expression
      }) => {
        switch (type) {
          case 'model':
            handleAttributeBindingDirective(this, el, 'value', expression, extraVars, type, modifiers);
            break;

          case 'bind':
            // The :key binding on an x-for is special, ignore it.
            if (el.tagName.toLowerCase() === 'template' && value === 'key') return;
            handleAttributeBindingDirective(this, el, value, expression, extraVars, type, modifiers);
            break;

          case 'text':
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleTextDirective(el, output, expression);
            break;

          case 'html':
            handleHtmlDirective(this, el, expression, extraVars);
            break;

          case 'show':
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleShowDirective(this, el, output, modifiers, initialUpdate);
            break;

          case 'if':
            // If this element also has x-for on it, don't process x-if.
            // We will let the "x-for" directive handle the "if"ing.
            if (attrs.some(i => i.type === 'for')) return;
            var output = this.evaluateReturnExpression(el, expression, extraVars);
            handleIfDirective(this, el, output, initialUpdate, extraVars);
            break;

          case 'for':
            handleForDirective(this, el, expression, initialUpdate, extraVars);
            break;

          case 'cloak':
            el.removeAttribute('x-cloak');
            break;
        }
      });
    }

    evaluateReturnExpression(el, expression, extraVars = () => {}) {
      return saferEval(expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    evaluateCommandExpression(el, expression, extraVars = () => {}) {
      return saferEvalNoReturn(expression, this.$data, _objectSpread2(_objectSpread2({}, extraVars()), {}, {
        $dispatch: this.getDispatchFunction(el)
      }));
    }

    getDispatchFunction(el) {
      return (event, detail = {}) => {
        el.dispatchEvent(new CustomEvent(event, {
          detail,
          bubbles: true
        }));
      };
    }

    listenForNewElementsToInitialize() {
      const targetNode = this.$el;
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        for (let i = 0; i < mutations.length; i++) {
          // Filter out mutations triggered from child components.
          const closestParentComponent = mutations[i].target.closest('[x-data]');
          if (!(closestParentComponent && closestParentComponent.isSameNode(this.$el))) continue;

          if (mutations[i].type === 'attributes' && mutations[i].attributeName === 'x-data') {
            const rawData = saferEval(mutations[i].target.getAttribute('x-data') || '{}', {
              $el: this.$el
            });
            Object.keys(rawData).forEach(key => {
              if (this.$data[key] !== rawData[key]) {
                this.$data[key] = rawData[key];
              }
            });
          }

          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              if (node.nodeType !== 1 || node.__x_inserted_me) return;

              if (node.matches('[x-data]') && !node.__x) {
                node.__x = new Component(node);
                return;
              }

              this.initializeElements(node);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    }

    getRefsProxy() {
      var self = this;
      var refObj = {};
      // One of the goals of this is to not hold elements in memory, but rather re-evaluate
      // the DOM when the system needs something from it. This way, the framework is flexible and
      // friendly to outside DOM changes from libraries like Vue/Livewire.
      // For this reason, I'm using an "on-demand" proxy to fake a "$refs" object.

      return new Proxy(refObj, {
        get(object, property) {
          if (property === '$isAlpineProxy') return true;
          var ref; // We can't just query the DOM because it's hard to filter out refs in
          // nested components.

          self.walkAndSkipNestedComponents(self.$el, el => {
            if (el.hasAttribute('x-ref') && el.getAttribute('x-ref') === property) {
              ref = el;
            }
          });
          return ref;
        }

      });
    }

  }

  const Alpine = {
    version: "2.7.3",
    pauseMutationObserver: false,
    magicProperties: {},
    onComponentInitializeds: [],
    onBeforeComponentInitializeds: [],
    ignoreFocusedForValueBinding: false,
    start: async function start() {
      if (!isTesting()) {
        await domReady();
      }

      this.discoverComponents(el => {
        this.initializeComponent(el);
      }); // It's easier and more performant to just support Turbolinks than listen
      // to MutationObserver mutations at the document level.

      document.addEventListener("turbolinks:load", () => {
        this.discoverUninitializedComponents(el => {
          this.initializeComponent(el);
        });
      });
      this.listenForNewUninitializedComponentsAtRunTime();
    },
    discoverComponents: function discoverComponents(callback) {
      const rootEls = document.querySelectorAll('[x-data]');
      rootEls.forEach(rootEl => {
        callback(rootEl);
      });
    },
    discoverUninitializedComponents: function discoverUninitializedComponents(callback, el = null) {
      const rootEls = (el || document).querySelectorAll('[x-data]');
      Array.from(rootEls).filter(el => el.__x === undefined).forEach(rootEl => {
        callback(rootEl);
      });
    },
    listenForNewUninitializedComponentsAtRunTime: function listenForNewUninitializedComponentsAtRunTime() {
      const targetNode = document.querySelector('body');
      const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true
      };
      const observer = new MutationObserver(mutations => {
        if (this.pauseMutationObserver) return;

        for (let i = 0; i < mutations.length; i++) {
          if (mutations[i].addedNodes.length > 0) {
            mutations[i].addedNodes.forEach(node => {
              // Discard non-element nodes (like line-breaks)
              if (node.nodeType !== 1) return; // Discard any changes happening within an existing component.
              // They will take care of themselves.

              if (node.parentElement && node.parentElement.closest('[x-data]')) return;
              this.discoverUninitializedComponents(el => {
                this.initializeComponent(el);
              }, node.parentElement);
            });
          }
        }
      });
      observer.observe(targetNode, observerOptions);
    },
    initializeComponent: function initializeComponent(el) {
      if (!el.__x) {
        // Wrap in a try/catch so that we don't prevent other components
        // from initializing when one component contains an error.
        try {
          el.__x = new Component(el);
        } catch (error) {
          setTimeout(() => {
            throw error;
          }, 0);
        }
      }
    },
    clone: function clone(component, newEl) {
      if (!newEl.__x) {
        newEl.__x = new Component(newEl, component);
      }
    },
    addMagicProperty: function addMagicProperty(name, callback) {
      this.magicProperties[name] = callback;
    },
    onComponentInitialized: function onComponentInitialized(callback) {
      this.onComponentInitializeds.push(callback);
    },
    onBeforeComponentInitialized: function onBeforeComponentInitialized(callback) {
      this.onBeforeComponentInitializeds.push(callback);
    }
  };

  if (!isTesting()) {
    window.Alpine = Alpine;

    if (window.deferLoadingAlpine) {
      window.deferLoadingAlpine(function () {
        window.Alpine.start();
      });
    } else {
      window.Alpine.start();
    }
  }

  return Alpine;

})));


/***/ }),

/***/ "./resources/assets/js/app.js":
/*!************************************!*
  !*** ./resources/assets/js/app.js ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! alpinejs */ "./node_modules/alpinejs/dist/alpine.js");
/* harmony import */ var alpinejs__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(alpinejs__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var turbolinks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! turbolinks */ "./node_modules/turbolinks/dist/turbolinks.js");
/* harmony import */ var turbolinks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(turbolinks__WEBPACK_IMPORTED_MODULE_1__);
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }



turbolinks__WEBPACK_IMPORTED_MODULE_1___default().start();
(turbolinks__WEBPACK_IMPORTED_MODULE_1___default().scroll) = {};

window.initializeSearch = function () {
  Promise.all([__webpack_require__.e(/*! import() | docsearch */ "docsearch").then(__webpack_require__.bind(__webpack_require__, /*! @docsearch/js */ "./node_modules/@docsearch/js/dist/esm/index.js")), __webpack_require__.e(/*! import() | docsearch */ "docsearch").then(__webpack_require__.bind(__webpack_require__, /*! @docsearch/css */ "./node_modules/@docsearch/css/dist/style.css"))]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 1),
        docsearch = _ref2[0];

    docsearch["default"]({
      container: '#docsearch'
    });
  });
};

window.initializeCodegroups = function () {
  return {
    activeTab: 1,
    changeTab: function changeTab(index, element) {
      this.$refs.highlighter.style.left = "".concat(element.offsetLeft, "px");
      this.$refs.highlighter.style.width = "".concat(element.clientWidth, "px");
      this.activeTab = index;
    },
    mounted: function mounted() {
      var _this = this;

      this.changeTab(1, this.$refs.firstTab);
      setTimeout(function () {
        if (_this.$el.classList) {
          _this.$el.classList.add('ready');
        }
      });
    }
  };
};

window.initializeIntersectionObserver = function (elementsContainer, linksContainer, activeClass) {
  return {
    mounted: function mounted() {
      var _this2 = this;

      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting && entry.intersectionRatio >= 1.0) {
            var id = entry.target.getAttribute('id');

            var existingActive = _this2.$el.querySelector("".concat(linksContainer, " .").concat(activeClass));

            if (existingActive) {
              existingActive.classList.remove(activeClass);
            }

            var newLink = _this2.$el.querySelector("".concat(linksContainer, " [href=\"#").concat(id, "\"]"));

            if (newLink) {
              newLink.classList.add(activeClass);
            }
          }
        });
      }, {
        threshold: 1.0,
        rootMargin: '0px'
      });
      var subsections = this.$el.querySelectorAll(elementsContainer);
      subsections.forEach(function (subsection) {
        observer.observe(subsection);
      });
    }
  };
};

document.addEventListener('turbolinks:render', function () {
  var sidebar = document.querySelector('.sidebar');
  var top = (turbolinks__WEBPACK_IMPORTED_MODULE_1___default().scroll.top);

  if (top) {
    sidebar.scrollTo(0, top);
  }
});
document.addEventListener('turbolinks:click', function () {
  var sidebar = document.querySelector('.sidebar');
  (turbolinks__WEBPACK_IMPORTED_MODULE_1___default().scroll.top) = sidebar.scrollTop;
});

/***/ }),

/***/ "./resources/assets/css/app.css":
/*!**************************************!*
  !*** ./resources/assets/css/app.css ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/turbolinks/dist/turbolinks.js":
/*!****************************************************!*
  !*** ./node_modules/turbolinks/dist/turbolinks.js ***!
  \****************************************************/
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
Turbolinks 5.2.0
Copyright © 2018 Basecamp, LLC
 */
(function(){var t=this;(function(){(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame&&null!=window.addEventListener}(),visit:function(t,r){return e.controller.visit(t,r)},clearCache:function(){return e.controller.clearCache()},setProgressBarDelay:function(t){return e.controller.setProgressBarDelay(t)}}}).call(this)}).call(t);var e=t.Turbolinks;(function(){(function(){var t,r,n,o=[].slice;e.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},e.closest=function(e,r){return t.call(e,r)},t=function(){var t,e;return t=document.documentElement,null!=(e=t.closest)?e:function(t){var e;for(e=this;e;){if(e.nodeType===Node.ELEMENT_NODE&&r.call(e,t))return e;e=e.parentNode}}}(),e.defer=function(t){return setTimeout(t,1)},e.throttle=function(t){var e;return e=null,function(){var r;return r=1<=arguments.length?o.call(arguments,0):[],null!=e?e:e=requestAnimationFrame(function(n){return function(){return e=null,t.apply(n,r)}}(this))}},e.dispatch=function(t,e){var r,o,i,s,a,u;return a=null!=e?e:{},u=a.target,r=a.cancelable,o=a.data,i=document.createEvent("Events"),i.initEvent(t,!0,r===!0),i.data=null!=o?o:{},i.cancelable&&!n&&(s=i.preventDefault,i.preventDefault=function(){return this.defaultPrevented||Object.defineProperty(this,"defaultPrevented",{get:function(){return!0}}),s.call(this)}),(null!=u?u:document).dispatchEvent(i),i},n=function(){var t;return t=document.createEvent("Events"),t.initEvent("test",!0,!0),t.preventDefault(),t.defaultPrevented}(),e.match=function(t,e){return r.call(t,e)},r=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),e.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}).call(this),function(){e.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.requestURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.HttpRequest=function(){function r(r,n,o){this.delegate=r,this.requestCanceled=t(this.requestCanceled,this),this.requestTimedOut=t(this.requestTimedOut,this),this.requestFailed=t(this.requestFailed,this),this.requestLoaded=t(this.requestLoaded,this),this.requestProgressed=t(this.requestProgressed,this),this.url=e.Location.wrap(n).requestURL,this.referrer=e.Location.wrap(o).absoluteURL,this.createXHR()}return r.NETWORK_FAILURE=0,r.TIMEOUT_FAILURE=-1,r.timeout=60,r.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},r.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},r.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},r.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},r.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},r.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},r.prototype.requestCanceled=function(){return this.endRequest()},r.prototype.notifyApplicationBeforeRequestStart=function(){return e.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},r.prototype.notifyApplicationAfterRequestEnd=function(){return e.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},r.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},r.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},r.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},r.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ProgressBar=function(){function e(){this.trickle=t(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,e.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",e.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},e.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},e.prototype.setValue=function(t){return this.value=t,this.refresh()},e.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},e.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},e.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},e.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},e.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},e.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},e.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},e.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},e.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},e.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},e}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.BrowserAdapter=function(){function r(r){this.controller=r,this.showProgressBar=t(this.showProgressBar,this),this.progressBar=new e.ProgressBar}var n,o,i;return i=e.HttpRequest,n=i.NETWORK_FAILURE,o=i.TIMEOUT_FAILURE,r.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},r.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},r.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},r.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},r.prototype.visitRequestCompleted=function(t){return t.loadResponse()},r.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case n:case o:return this.reload();default:return t.loadResponse()}},r.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},r.prototype.visitCompleted=function(t){return t.followRedirect()},r.prototype.pageInvalidated=function(){return this.reload()},r.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,this.controller.progressBarDelay)},r.prototype.showProgressBar=function(){return this.progressBar.show()},r.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},r.prototype.reload=function(){return window.location.reload()},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.History=function(){function r(e){this.delegate=e,this.onPageLoad=t(this.onPageLoad,this),this.onPopState=t(this.onPopState,this)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),addEventListener("load",this.onPageLoad,!1),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),removeEventListener("load",this.onPageLoad,!1),this.started=!1):void 0},r.prototype.push=function(t,r){return t=e.Location.wrap(t),this.update("push",t,r)},r.prototype.replace=function(t,r){return t=e.Location.wrap(t),this.update("replace",t,r)},r.prototype.onPopState=function(t){var r,n,o,i;return this.shouldHandlePopState()&&(i=null!=(n=t.state)?n.turbolinks:void 0)?(r=e.Location.wrap(window.location),o=i.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(r,o)):void 0},r.prototype.onPageLoad=function(t){return e.defer(function(t){return function(){return t.pageLoaded=!0}}(this))},r.prototype.shouldHandlePopState=function(){return this.pageIsLoaded()},r.prototype.pageIsLoaded=function(){return this.pageLoaded||"complete"===document.readyState},r.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},r}()}.call(this),function(){e.HeadDetails=function(){function t(t){var e,r,n,s,a,u;for(this.elements={},n=0,a=t.length;a>n;n++)u=t[n],u.nodeType===Node.ELEMENT_NODE&&(s=u.outerHTML,r=null!=(e=this.elements)[s]?e[s]:e[s]={type:i(u),tracked:o(u),elements:[]},r.elements.push(u))}var e,r,n,o,i;return t.fromHeadElement=function(t){var e;return new this(null!=(e=null!=t?t.childNodes:void 0)?e:[])},t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},t.prototype.getMetaValue=function(t){var e;return null!=(e=this.findMetaElementByName(t))?e.getAttribute("content"):void 0},t.prototype.findMetaElementByName=function(t){var r,n,o,i;r=void 0,i=this.elements;for(o in i)n=i[o].elements,e(n[0],t)&&(r=n[0]);return r},i=function(t){return r(t)?"script":n(t)?"stylesheet":void 0},o=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},r=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},n=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},e=function(t,e){var r;return r=t.tagName.toLowerCase(),"meta"===r&&t.getAttribute("name")===e},t}()}.call(this),function(){e.Snapshot=function(){function t(t,e){this.headDetails=t,this.bodyElement=e}return t.wrap=function(t){return t instanceof this?t:"string"==typeof t?this.fromHTMLString(t):this.fromHTMLElement(t)},t.fromHTMLString=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromHTMLElement(e)},t.fromHTMLElement=function(t){var r,n,o,i;return o=t.querySelector("head"),r=null!=(i=t.querySelector("body"))?i:document.createElement("body"),n=e.HeadDetails.fromHeadElement(o),new this(n,r)},t.prototype.clone=function(){return new this.constructor(this.headDetails,this.bodyElement.cloneNode(!0))},t.prototype.getRootLocation=function(){var t,r;return r=null!=(t=this.getSetting("root"))?t:"/",new e.Location(r)},t.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},t.prototype.getElementForAnchor=function(t){try{return this.bodyElement.querySelector("[id='"+t+"'], a[name='"+t+"']")}catch(e){}},t.prototype.getPermanentElements=function(){return this.bodyElement.querySelectorAll("[id][data-turbolinks-permanent]")},t.prototype.getPermanentElementById=function(t){return this.bodyElement.querySelector("#"+t+"[data-turbolinks-permanent]")},t.prototype.getPermanentElementsPresentInSnapshot=function(t){var e,r,n,o,i;for(o=this.getPermanentElements(),i=[],r=0,n=o.length;n>r;r++)e=o[r],t.getPermanentElementById(e.id)&&i.push(e);return i},t.prototype.findFirstAutofocusableElement=function(){return this.bodyElement.querySelector("[autofocus]")},t.prototype.hasAnchor=function(t){return null!=this.getElementForAnchor(t)},t.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},t.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},t.prototype.isVisitable=function(){return"reload"!==this.getSetting("visit-control")},t.prototype.getSetting=function(t){return this.headDetails.getMetaValue("turbolinks-"+t)},t}()}.call(this),function(){var t=[].slice;e.Renderer=function(){function e(){}var r;return e.render=function(){var e,r,n,o;return n=arguments[0],r=arguments[1],e=3<=arguments.length?t.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,e,function(){}),o.delegate=n,o.render(r),o},e.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},e.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},e.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,e.async=!1,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},e}()}.call(this),function(){var t,r,n=function(t,e){function r(){this.constructor=t}for(var n in e)o.call(e,n)&&(t[n]=e[n]);return r.prototype=e.prototype,t.prototype=new r,t.__super__=e.prototype,t},o={}.hasOwnProperty;e.SnapshotRenderer=function(e){function o(t,e,r){this.currentSnapshot=t,this.newSnapshot=e,this.isPreview=r,this.currentHeadDetails=this.currentSnapshot.headDetails,this.newHeadDetails=this.newSnapshot.headDetails,this.currentBody=this.currentSnapshot.bodyElement,this.newBody=this.newSnapshot.bodyElement}return n(o,e),o.prototype.render=function(t){return this.shouldRender()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.isPreview||e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},o.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},o.prototype.replaceBody=function(){var t;return t=this.relocateCurrentBodyPermanentElements(),this.activateNewBodyScriptElements(),this.assignNewBody(),this.replacePlaceholderElementsWithClonedPermanentElements(t)},o.prototype.shouldRender=function(){return this.newSnapshot.isVisitable()&&this.trackedElementsAreIdentical()},o.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},o.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},o.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},o.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},o.prototype.relocateCurrentBodyPermanentElements=function(){var e,n,o,i,s,a,u;for(a=this.getCurrentBodyPermanentElements(),u=[],e=0,n=a.length;n>e;e++)i=a[e],s=t(i),o=this.newSnapshot.getPermanentElementById(i.id),r(i,s.element),r(o,i),u.push(s);return u},o.prototype.replacePlaceholderElementsWithClonedPermanentElements=function(t){var e,n,o,i,s,a,u;for(u=[],o=0,i=t.length;i>o;o++)a=t[o],n=a.element,s=a.permanentElement,e=s.cloneNode(!0),u.push(r(n,e));return u},o.prototype.activateNewBodyScriptElements=function(){var t,e,n,o,i,s;for(i=this.getNewBodyScriptElements(),s=[],e=0,o=i.length;o>e;e++)n=i[e],t=this.createScriptElement(n),s.push(r(n,t));return s},o.prototype.assignNewBody=function(){return document.body=this.newBody},o.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.newSnapshot.findFirstAutofocusableElement())?t.focus():void 0},o.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},o.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},o.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},o.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},o.prototype.getCurrentBodyPermanentElements=function(){return this.currentSnapshot.getPermanentElementsPresentInSnapshot(this.newSnapshot)},o.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},o}(e.Renderer),t=function(t){var e;return e=document.createElement("meta"),e.setAttribute("name","turbolinks-permanent-placeholder"),e.setAttribute("content",t.id),{element:e,permanentElement:t}},r=function(t,e){var r;return(r=t.parentNode)?r.replaceChild(e,t):void 0}}.call(this),function(){var t=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;e.ErrorRenderer=function(e){function r(t){var e;e=document.createElement("html"),e.innerHTML=t,this.newHead=e.querySelector("head"),this.newBody=e.querySelector("body")}return t(r,e),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceHeadAndBody(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceHeadAndBody=function(){var t,e;return e=document.head,t=document.body,e.parentNode.replaceChild(this.newHead,e),t.parentNode.replaceChild(this.newBody,t)},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(e.Renderer)}.call(this),function(){e.View=function(){function t(t){this.delegate=t,this.htmlElement=document.documentElement}return t.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},t.prototype.getElementForAnchor=function(t){return this.getSnapshot().getElementForAnchor(t)},t.prototype.getSnapshot=function(){return e.Snapshot.fromHTMLElement(this.htmlElement)},t.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,n,e):this.renderError(r,e)},t.prototype.markAsPreview=function(t){return t?this.htmlElement.setAttribute("data-turbolinks-preview",""):this.htmlElement.removeAttribute("data-turbolinks-preview")},t.prototype.renderSnapshot=function(t,r,n){return e.SnapshotRenderer.render(this.delegate,n,this.getSnapshot(),e.Snapshot.wrap(t),r)},t.prototype.renderError=function(t,r){return e.ErrorRenderer.render(this.delegate,r,t)},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.ScrollManager=function(){function r(r){this.delegate=r,this.onScroll=t(this.onScroll,this),this.onScroll=e.throttle(this.onScroll)}return r.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},r.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},r.prototype.scrollToElement=function(t){return t.scrollIntoView()},r.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},r.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},r.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},r}()}.call(this),function(){e.SnapshotCache=function(){function t(t){this.size=t,this.keys=[],this.snapshots={}}var r;return t.prototype.has=function(t){var e;return e=r(t),e in this.snapshots},t.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},t.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},t.prototype.read=function(t){var e;return e=r(t),this.snapshots[e]},t.prototype.write=function(t,e){var n;return n=r(t),this.snapshots[n]=e},t.prototype.touch=function(t){var e,n;return n=r(t),e=this.keys.indexOf(n),e>-1&&this.keys.splice(e,1),this.keys.unshift(n),this.trim()},t.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},r=function(t){return e.Location.wrap(t).toCacheKey()},t}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Visit=function(){function r(r,n,o){this.controller=r,this.action=o,this.performScroll=t(this.performScroll,this),this.identifier=e.uuid(),this.location=e.Location.wrap(n),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var n;return r.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},r.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},r.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},r.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},r.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=n(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},r.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new e.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},r.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},r.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},r.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},r.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},r.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},r.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},r.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},r.prototype.requestCompletedWithResponse=function(t,r){return this.response=t,null!=r&&(this.redirectedToLocation=e.Location.wrap(r)),this.adapter.visitRequestCompleted(this)},r.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},r.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},r.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},r.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},r.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},r.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},r.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},r.prototype.getTimingMetrics=function(){return e.copyObject(this.timingMetrics)},n=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},r.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},r.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},r.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},r.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},r}()}.call(this),function(){var t=function(t,e){return function(){return t.apply(e,arguments)}};e.Controller=function(){function r(){this.clickBubbled=t(this.clickBubbled,this),this.clickCaptured=t(this.clickCaptured,this),this.pageLoaded=t(this.pageLoaded,this),this.history=new e.History(this),this.view=new e.View(this),this.scrollManager=new e.ScrollManager(this),this.restorationData={},this.clearCache(),this.setProgressBarDelay(500)}return r.prototype.start=function(){return e.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},r.prototype.disable=function(){return this.enabled=!1},r.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},r.prototype.clearCache=function(){return this.cache=new e.SnapshotCache(10)},r.prototype.visit=function(t,r){var n,o;return null==r&&(r={}),t=e.Location.wrap(t),this.applicationAllowsVisitingLocation(t)?this.locationIsVisitable(t)?(n=null!=(o=r.action)?o:"advance",this.adapter.visitProposedToLocationWithAction(t,n)):window.location=t:void 0},r.prototype.startVisitToLocationWithAction=function(t,r,n){var o;return e.supported?(o=this.getRestorationDataForIdentifier(n),this.startVisit(t,r,{restorationData:o})):window.location=t},r.prototype.setProgressBarDelay=function(t){return this.progressBarDelay=t},r.prototype.startHistory=function(){return this.location=e.Location.wrap(window.location),this.restorationIdentifier=e.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.stopHistory=function(){return this.history.stop()},r.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.push(this.location,this.restorationIdentifier)},r.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(t,r){return this.restorationIdentifier=r,this.location=e.Location.wrap(t),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.historyPoppedToLocationWithRestorationIdentifier=function(t,r){var n;return this.restorationIdentifier=r,this.enabled?(n=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(t,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:n,historyChanged:!0}),this.location=e.Location.wrap(t)):this.adapter.pageInvalidated()},r.prototype.getCachedSnapshotForLocation=function(t){var e;return null!=(e=this.cache.get(t))?e.clone():void 0},r.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable();
},r.prototype.cacheSnapshot=function(){var t,r;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),r=this.view.getSnapshot(),t=this.lastRenderedLocation,e.defer(function(e){return function(){return e.cache.put(t,r.clone())}}(this))):void 0},r.prototype.scrollToAnchor=function(t){var e;return(e=this.view.getElementForAnchor(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},r.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},r.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},r.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},r.prototype.render=function(t,e){return this.view.render(t,e)},r.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},r.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},r.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},r.prototype.pageLoaded=function(){return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},r.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},r.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},r.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},r.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},r.prototype.notifyApplicationAfterClickingLinkToLocation=function(t,r){return e.dispatch("turbolinks:click",{target:t,data:{url:r.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationBeforeVisitingLocation=function(t){return e.dispatch("turbolinks:before-visit",{data:{url:t.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationAfterVisitingLocation=function(t){return e.dispatch("turbolinks:visit",{data:{url:t.absoluteURL}})},r.prototype.notifyApplicationBeforeCachingSnapshot=function(){return e.dispatch("turbolinks:before-cache")},r.prototype.notifyApplicationBeforeRender=function(t){return e.dispatch("turbolinks:before-render",{data:{newBody:t}})},r.prototype.notifyApplicationAfterRender=function(){return e.dispatch("turbolinks:render")},r.prototype.notifyApplicationAfterPageLoad=function(t){return null==t&&(t={}),e.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:t}})},r.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},r.prototype.createVisit=function(t,r,n){var o,i,s,a,u;return i=null!=n?n:{},a=i.restorationIdentifier,s=i.restorationData,o=i.historyChanged,u=new e.Visit(this,t,r),u.restorationIdentifier=null!=a?a:e.uuid(),u.restorationData=e.copyObject(s),u.historyChanged=o,u.referrer=this.location,u},r.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},r.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},r.prototype.getVisitableLinkForNode=function(t){return this.nodeIsVisitable(t)?e.closest(t,"a[href]:not([target]):not([download])"):void 0},r.prototype.getVisitableLocationForLink=function(t){var r;return r=new e.Location(t.getAttribute("href")),this.locationIsVisitable(r)?r:void 0},r.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},r.prototype.nodeIsVisitable=function(t){var r;return(r=e.closest(t,"[data-turbolinks]"))?"false"!==r.getAttribute("data-turbolinks"):!0},r.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},r.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},r.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},r}()}.call(this),function(){!function(){var t,e;if((t=e=document.currentScript)&&!e.hasAttribute("data-turbolinks-suppress-warning"))for(;t=t.parentNode;)if(t===document.body)return console.warn("You are loading Turbolinks from a <script> element inside the <body> element. This is probably not what you meant to do!\n\nLoad your application\u2019s JavaScript bundle inside the <head> element instead. <script> elements in <body> are evaluated with each page change.\n\nFor more information, see: https://github.com/turbolinks/turbolinks#working-with-script-elements\n\n\u2014\u2014\nSuppress this warning by adding a `data-turbolinks-suppress-warning` attribute to: %s",e.outerHTML)}()}.call(this),function(){var t,r,n;e.start=function(){return r()?(null==e.controller&&(e.controller=t()),e.controller.start()):void 0},r=function(){return null==window.Turbolinks&&(window.Turbolinks=e),n()},t=function(){var t;return t=new e.Controller,t.adapter=new e.BrowserAdapter(t),t},n=function(){return window.Turbolinks===e},n()&&e.start()}.call(this)}).call(this), true&&module.exports?module.exports=e: true&&!(__WEBPACK_AMD_DEFINE_FACTORY__ = (e),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))}).call(this);

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		if(__webpack_module_cache__[moduleId]) {
/******/ 			return __webpack_module_cache__[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => module['default'] :
/******/ 				() => module;
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/ensure chunk */
/******/ 	(() => {
/******/ 		__webpack_require__.f = {};
/******/ 		// This file contains only the entry chunk.
/******/ 		// The chunk loading function for additional chunks
/******/ 		__webpack_require__.e = (chunkId) => {
/******/ 			return Promise.all(Object.keys(__webpack_require__.f).reduce((promises, key) => {
/******/ 				__webpack_require__.f[key](chunkId, promises);
/******/ 				return promises;
/******/ 			}, []));
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get javascript chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference async chunks
/******/ 		__webpack_require__.u = (chunkId) => {
/******/ 			// return url for filenames not based on template
/******/ 			if (chunkId === "docsearch") return "js/" + chunkId + ".js";
/******/ 			// return url for filenames based on template
/******/ 			return undefined;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/get mini-css chunk filename */
/******/ 	(() => {
/******/ 		// This function allow to reference all chunks
/******/ 		__webpack_require__.miniCssF = (chunkId) => {
/******/ 			// return url for filenames based on template
/******/ 			return "" + chunkId + ".css";
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop)
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/load script */
/******/ 	(() => {
/******/ 		var inProgress = {};
/******/ 		var dataWebpackPrefix = "app:";
/******/ 		// loadScript function to load a script via script tag
/******/ 		__webpack_require__.l = (url, done, key) => {
/******/ 			if(inProgress[url]) { inProgress[url].push(done); return; }
/******/ 			var script, needAttach;
/******/ 			if(key !== undefined) {
/******/ 				var scripts = document.getElementsByTagName("script");
/******/ 				for(var i = 0; i < scripts.length; i++) {
/******/ 					var s = scripts[i];
/******/ 					if(s.getAttribute("src") == url || s.getAttribute("data-webpack") == dataWebpackPrefix + key) { script = s; break; }
/******/ 				}
/******/ 			}
/******/ 			if(!script) {
/******/ 				needAttach = true;
/******/ 				script = document.createElement('script');
/******/ 		
/******/ 				script.charset = 'utf-8';
/******/ 				script.timeout = 120;
/******/ 				if (__webpack_require__.nc) {
/******/ 					script.setAttribute("nonce", __webpack_require__.nc);
/******/ 				}
/******/ 				script.setAttribute("data-webpack", dataWebpackPrefix + key);
/******/ 				script.src = url;
/******/ 			}
/******/ 			inProgress[url] = [done];
/******/ 			var onScriptComplete = (prev, event) => {
/******/ 				// avoid mem leaks in IE.
/******/ 				script.onerror = script.onload = null;
/******/ 				clearTimeout(timeout);
/******/ 				var doneFns = inProgress[url];
/******/ 				delete inProgress[url];
/******/ 				script.parentNode && script.parentNode.removeChild(script);
/******/ 				doneFns && doneFns.forEach((fn) => fn(event));
/******/ 				if(prev) return prev(event);
/******/ 			}
/******/ 			;
/******/ 			var timeout = setTimeout(onScriptComplete.bind(null, undefined, { type: 'timeout', target: script }), 120000);
/******/ 			script.onerror = onScriptComplete.bind(null, script.onerror);
/******/ 			script.onload = onScriptComplete.bind(null, script.onload);
/******/ 			needAttach && document.head.appendChild(script);
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/publicPath */
/******/ 	(() => {
/******/ 		__webpack_require__.p = "/";
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/css loading */
/******/ 	(() => {
/******/ 		var createStylesheet = (chunkId, fullhref, resolve, reject) => {
/******/ 			var linkTag = document.createElement("link");
/******/ 		
/******/ 			linkTag.rel = "stylesheet";
/******/ 			linkTag.type = "text/css";
/******/ 			var onLinkComplete = (event) => {
/******/ 				// avoid mem leaks.
/******/ 				linkTag.onerror = linkTag.onload = null;
/******/ 				if (event.type === 'load') {
/******/ 					resolve();
/******/ 				} else {
/******/ 					var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 					var realHref = event && event.target && event.target.href || fullhref;
/******/ 					var err = new Error("Loading CSS chunk " + chunkId + " failed.\n(" + realHref + ")");
/******/ 					err.code = "CSS_CHUNK_LOAD_FAILED";
/******/ 					err.type = errorType;
/******/ 					err.request = realHref;
/******/ 					linkTag.parentNode.removeChild(linkTag)
/******/ 					reject(err);
/******/ 				}
/******/ 			}
/******/ 			linkTag.onerror = linkTag.onload = onLinkComplete;
/******/ 			linkTag.href = fullhref;
/******/ 		
/******/ 			document.head.appendChild(linkTag);
/******/ 			return linkTag;
/******/ 		};
/******/ 		var findStylesheet = (href, fullhref) => {
/******/ 			var existingLinkTags = document.getElementsByTagName("link");
/******/ 			for(var i = 0; i < existingLinkTags.length; i++) {
/******/ 				var tag = existingLinkTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href") || tag.getAttribute("href");
/******/ 				if(tag.rel === "stylesheet" && (dataHref === href || dataHref === fullhref)) return tag;
/******/ 			}
/******/ 			var existingStyleTags = document.getElementsByTagName("style");
/******/ 			for(var i = 0; i < existingStyleTags.length; i++) {
/******/ 				var tag = existingStyleTags[i];
/******/ 				var dataHref = tag.getAttribute("data-href");
/******/ 				if(dataHref === href || dataHref === fullhref) return tag;
/******/ 			}
/******/ 		};
/******/ 		var loadStylesheet = (chunkId) => {
/******/ 			return new Promise((resolve, reject) => {
/******/ 				var href = __webpack_require__.miniCssF(chunkId);
/******/ 				var fullhref = __webpack_require__.p + href;
/******/ 				if(findStylesheet(href, fullhref)) return resolve();
/******/ 				createStylesheet(chunkId, fullhref, resolve, reject);
/******/ 			});
/******/ 		}
/******/ 		// object to store loaded CSS chunks
/******/ 		var installedCssChunks = {
/******/ 			"/js/app": 0
/******/ 		};
/******/ 		
/******/ 		__webpack_require__.f.miniCss = (chunkId, promises) => {
/******/ 			var cssChunks = {"docsearch":1};
/******/ 			if(installedCssChunks[chunkId]) promises.push(installedCssChunks[chunkId]);
/******/ 			else if(installedCssChunks[chunkId] !== 0 && cssChunks[chunkId]) {
/******/ 				promises.push(installedCssChunks[chunkId] = loadStylesheet(chunkId).then(() => {
/******/ 					installedCssChunks[chunkId] = 0;
/******/ 				}, (e) => {
/******/ 					delete installedCssChunks[chunkId];
/******/ 					throw e;
/******/ 				}));
/******/ 			}
/******/ 		};
/******/ 		
/******/ 		// no hmr
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// Promise = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"/js/app": 0
/******/ 		};
/******/ 		
/******/ 		var deferredModules = [
/******/ 			["./resources/assets/js/app.js"],
/******/ 			["./resources/assets/css/app.css"]
/******/ 		];
/******/ 		__webpack_require__.f.j = (chunkId, promises) => {
/******/ 				// JSONP chunk loading for javascript
/******/ 				var installedChunkData = __webpack_require__.o(installedChunks, chunkId) ? installedChunks[chunkId] : undefined;
/******/ 				if(installedChunkData !== 0) { // 0 means "already installed".
/******/ 		
/******/ 					// a Promise means "currently loading".
/******/ 					if(installedChunkData) {
/******/ 						promises.push(installedChunkData[2]);
/******/ 					} else {
/******/ 						if("docsearch" == chunkId) {
/******/ 							// setup Promise in chunk cache
/******/ 							var promise = new Promise((resolve, reject) => {
/******/ 								installedChunkData = installedChunks[chunkId] = [resolve, reject];
/******/ 							});
/******/ 							promises.push(installedChunkData[2] = promise);
/******/ 		
/******/ 							// start chunk loading
/******/ 							var url = __webpack_require__.p + __webpack_require__.u(chunkId);
/******/ 							// create error before stack unwound to get useful stacktrace later
/******/ 							var error = new Error();
/******/ 							var loadingEnded = (event) => {
/******/ 								if(__webpack_require__.o(installedChunks, chunkId)) {
/******/ 									installedChunkData = installedChunks[chunkId];
/******/ 									if(installedChunkData !== 0) installedChunks[chunkId] = undefined;
/******/ 									if(installedChunkData) {
/******/ 										var errorType = event && (event.type === 'load' ? 'missing' : event.type);
/******/ 										var realSrc = event && event.target && event.target.src;
/******/ 										error.message = 'Loading chunk ' + chunkId + ' failed.\n(' + errorType + ': ' + realSrc + ')';
/******/ 										error.name = 'ChunkLoadError';
/******/ 										error.type = errorType;
/******/ 										error.request = realSrc;
/******/ 										installedChunkData[1](error);
/******/ 									}
/******/ 								}
/******/ 							};
/******/ 							__webpack_require__.l(url, loadingEnded, "chunk-" + chunkId);
/******/ 						} else installedChunks[chunkId] = 0;
/******/ 					}
/******/ 				}
/******/ 		};
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		var checkDeferredModules = () => {
/******/ 		
/******/ 		};
/******/ 		function checkDeferredModulesImpl() {
/******/ 			var result;
/******/ 			for(var i = 0; i < deferredModules.length; i++) {
/******/ 				var deferredModule = deferredModules[i];
/******/ 				var fulfilled = true;
/******/ 				for(var j = 1; j < deferredModule.length; j++) {
/******/ 					var depId = deferredModule[j];
/******/ 					if(installedChunks[depId] !== 0) fulfilled = false;
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferredModules.splice(i--, 1);
/******/ 					result = __webpack_require__(__webpack_require__.s = deferredModule[0]);
/******/ 				}
/******/ 			}
/******/ 			if(deferredModules.length === 0) {
/******/ 				__webpack_require__.x();
/******/ 				__webpack_require__.x = () => {
/******/ 		
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		}
/******/ 		__webpack_require__.x = () => {
/******/ 			// reset startup function so it can be called again when more startup code is added
/******/ 			__webpack_require__.x = () => {
/******/ 		
/******/ 			}
/******/ 			chunkLoadingGlobal = chunkLoadingGlobal.slice();
/******/ 			for(var i = 0; i < chunkLoadingGlobal.length; i++) webpackJsonpCallback(chunkLoadingGlobal[i]);
/******/ 			return (checkDeferredModules = checkDeferredModulesImpl)();
/******/ 		};
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (data) => {
/******/ 			var [chunkIds, moreModules, runtime, executeModules] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0, resolves = [];
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					resolves.push(installedChunks[chunkId][0]);
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			for(moduleId in moreModules) {
/******/ 				if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 					__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 				}
/******/ 			}
/******/ 			if(runtime) runtime(__webpack_require__);
/******/ 			parentChunkLoadingFunction(data);
/******/ 			while(resolves.length) {
/******/ 				resolves.shift()();
/******/ 			}
/******/ 		
/******/ 			// add entry modules from loaded chunk to deferred list
/******/ 			if(executeModules) deferredModules.push.apply(deferredModules, executeModules);
/******/ 		
/******/ 			// run deferred modules when all chunks ready
/******/ 			return checkDeferredModules();
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = self["webpackChunkapp"] = self["webpackChunkapp"] || [];
/******/ 		var parentChunkLoadingFunction = chunkLoadingGlobal.push.bind(chunkLoadingGlobal);
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback;
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	// run startup
/******/ 	return __webpack_require__.x();
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9hcHAvLi9ub2RlX21vZHVsZXMvYWxwaW5lanMvZGlzdC9hbHBpbmUuanMiLCJ3ZWJwYWNrOi8vYXBwLy4vcmVzb3VyY2VzL2Fzc2V0cy9qcy9hcHAuanMiLCJ3ZWJwYWNrOi8vYXBwLy4vcmVzb3VyY2VzL2Fzc2V0cy9jc3MvYXBwLmNzcyIsIndlYnBhY2s6Ly9hcHAvLi9ub2RlX21vZHVsZXMvdHVyYm9saW5rcy9kaXN0L3R1cmJvbGlua3MuanMiLCJ3ZWJwYWNrOi8vYXBwL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL2FwcC93ZWJwYWNrL3J1bnRpbWUvY29tcGF0IGdldCBkZWZhdWx0IGV4cG9ydCIsIndlYnBhY2s6Ly9hcHAvd2VicGFjay9ydW50aW1lL2RlZmluZSBwcm9wZXJ0eSBnZXR0ZXJzIiwid2VicGFjazovL2FwcC93ZWJwYWNrL3J1bnRpbWUvZW5zdXJlIGNodW5rIiwid2VicGFjazovL2FwcC93ZWJwYWNrL3J1bnRpbWUvZ2V0IGphdmFzY3JpcHQgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vYXBwL3dlYnBhY2svcnVudGltZS9nZXQgbWluaS1jc3MgY2h1bmsgZmlsZW5hbWUiLCJ3ZWJwYWNrOi8vYXBwL3dlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQiLCJ3ZWJwYWNrOi8vYXBwL3dlYnBhY2svcnVudGltZS9sb2FkIHNjcmlwdCIsIndlYnBhY2s6Ly9hcHAvd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCIsIndlYnBhY2s6Ly9hcHAvd2VicGFjay9ydW50aW1lL3B1YmxpY1BhdGgiLCJ3ZWJwYWNrOi8vYXBwL3dlYnBhY2svcnVudGltZS9jc3MgbG9hZGluZyIsIndlYnBhY2s6Ly9hcHAvd2VicGFjay9ydW50aW1lL2pzb25wIGNodW5rIGxvYWRpbmciLCJ3ZWJwYWNrOi8vYXBwL3dlYnBhY2svc3RhcnR1cCJdLCJuYW1lcyI6WyJUdXJib2xpbmtzIiwid2luZG93IiwiaW5pdGlhbGl6ZVNlYXJjaCIsIlByb21pc2UiLCJhbGwiLCJ0aGVuIiwiZG9jc2VhcmNoIiwiY29udGFpbmVyIiwiaW5pdGlhbGl6ZUNvZGVncm91cHMiLCJhY3RpdmVUYWIiLCJjaGFuZ2VUYWIiLCJpbmRleCIsImVsZW1lbnQiLCIkcmVmcyIsImhpZ2hsaWdodGVyIiwic3R5bGUiLCJsZWZ0Iiwib2Zmc2V0TGVmdCIsIndpZHRoIiwiY2xpZW50V2lkdGgiLCJtb3VudGVkIiwiZmlyc3RUYWIiLCJzZXRUaW1lb3V0IiwiJGVsIiwiY2xhc3NMaXN0IiwiYWRkIiwiaW5pdGlhbGl6ZUludGVyc2VjdGlvbk9ic2VydmVyIiwiZWxlbWVudHNDb250YWluZXIiLCJsaW5rc0NvbnRhaW5lciIsImFjdGl2ZUNsYXNzIiwib2JzZXJ2ZXIiLCJJbnRlcnNlY3Rpb25PYnNlcnZlciIsImVudHJpZXMiLCJmb3JFYWNoIiwiZW50cnkiLCJpc0ludGVyc2VjdGluZyIsImludGVyc2VjdGlvblJhdGlvIiwiaWQiLCJ0YXJnZXQiLCJnZXRBdHRyaWJ1dGUiLCJleGlzdGluZ0FjdGl2ZSIsInF1ZXJ5U2VsZWN0b3IiLCJyZW1vdmUiLCJuZXdMaW5rIiwidGhyZXNob2xkIiwicm9vdE1hcmdpbiIsInN1YnNlY3Rpb25zIiwicXVlcnlTZWxlY3RvckFsbCIsInN1YnNlY3Rpb24iLCJvYnNlcnZlIiwiZG9jdW1lbnQiLCJhZGRFdmVudExpc3RlbmVyIiwic2lkZWJhciIsInRvcCIsInNjcm9sbFRvIiwic2Nyb2xsVG9wIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7QUFBQTtBQUNBLEVBQUUsS0FBNEQ7QUFDOUQsRUFBRSxDQUNvRDtBQUN0RCxDQUFDLHFCQUFxQjs7QUFFdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxPQUFPO0FBQ1AsS0FBSztBQUNMO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsT0FBTztBQUNQO0FBQ0E7O0FBRUE7QUFDQTs7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bkVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBLGdDQUFnQzs7V0FFaEM7V0FDQTtXQUNBO1dBQ0EsSUFBSTtXQUNKO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTTtXQUNOOztXQUVBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQSxLQUFLO1dBQ0w7V0FDQTtXQUNBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBOztXQUVBO1dBQ0E7V0FDQTtXQUNBLGVBQWUsNEJBQTRCO1dBQzNDO1dBQ0E7V0FDQSxnQkFBZ0IsMkJBQTJCO1dBQzNDO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLGVBQWUsK0JBQStCO1dBQzlDO1dBQ0E7O1dBRUE7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0EsTUFBTSxvQkFBb0I7V0FDMUI7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7V0FDQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTs7V0FFQTtXQUNBO1dBQ0E7O1dBRUE7V0FDQTtXQUNBLCtDOzs7O1VDbElBO1VBQ0EiLCJmaWxlIjoiL2pzL2FwcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG4gIHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IG1vZHVsZS5leHBvcnRzID0gZmFjdG9yeSgpIDpcbiAgdHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKGZhY3RvcnkpIDpcbiAgKGdsb2JhbCA9IGdsb2JhbCB8fCBzZWxmLCBnbG9iYWwuQWxwaW5lID0gZmFjdG9yeSgpKTtcbn0odGhpcywgKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4gIGZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHtcbiAgICBpZiAoa2V5IGluIG9iaikge1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7XG4gICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlLFxuICAgICAgICB3cml0YWJsZTogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIG9ialtrZXldID0gdmFsdWU7XG4gICAgfVxuXG4gICAgcmV0dXJuIG9iajtcbiAgfVxuXG4gIGZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkge1xuICAgIHZhciBrZXlzID0gT2JqZWN0LmtleXMob2JqZWN0KTtcblxuICAgIGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG4gICAgICB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTtcbiAgICAgIGlmIChlbnVtZXJhYmxlT25seSkgc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHtcbiAgICAgICAgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7XG4gICAgICB9KTtcbiAgICAgIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTtcbiAgICB9XG5cbiAgICByZXR1cm4ga2V5cztcbiAgfVxuXG4gIGZ1bmN0aW9uIF9vYmplY3RTcHJlYWQyKHRhcmdldCkge1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgc291cmNlID0gYXJndW1lbnRzW2ldICE9IG51bGwgPyBhcmd1bWVudHNbaV0gOiB7fTtcblxuICAgICAgaWYgKGkgJSAyKSB7XG4gICAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSksIHRydWUpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMpIHtcbiAgICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihzb3VyY2UsIGtleSkpO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9XG5cbiAgLy8gVGhhbmtzIEBzdGltdWx1czpcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL3N0aW11bHVzanMvc3RpbXVsdXMvYmxvYi9tYXN0ZXIvcGFja2FnZXMvJTQwc3RpbXVsdXMvY29yZS9zcmMvYXBwbGljYXRpb24udHNcbiAgZnVuY3Rpb24gZG9tUmVhZHkoKSB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKHJlc29sdmUgPT4ge1xuICAgICAgaWYgKGRvY3VtZW50LnJlYWR5U3RhdGUgPT0gXCJsb2FkaW5nXCIpIHtcbiAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgcmVzb2x2ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbiAgZnVuY3Rpb24gYXJyYXlVbmlxdWUoYXJyYXkpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShuZXcgU2V0KGFycmF5KSk7XG4gIH1cbiAgZnVuY3Rpb24gaXNUZXN0aW5nKCkge1xuICAgIHJldHVybiBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKFwiTm9kZS5qc1wiKSB8fCBuYXZpZ2F0b3IudXNlckFnZW50LmluY2x1ZGVzKFwianNkb21cIik7XG4gIH1cbiAgZnVuY3Rpb24gY2hlY2tlZEF0dHJMb29zZUNvbXBhcmUodmFsdWVBLCB2YWx1ZUIpIHtcbiAgICByZXR1cm4gdmFsdWVBID09IHZhbHVlQjtcbiAgfVxuICBmdW5jdGlvbiB3YXJuSWZNYWxmb3JtZWRUZW1wbGF0ZShlbCwgZGlyZWN0aXZlKSB7XG4gICAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSAhPT0gJ3RlbXBsYXRlJykge1xuICAgICAgY29uc29sZS53YXJuKGBBbHBpbmU6IFske2RpcmVjdGl2ZX1dIGRpcmVjdGl2ZSBzaG91bGQgb25seSBiZSBhZGRlZCB0byA8dGVtcGxhdGU+IHRhZ3MuIFNlZSBodHRwczovL2dpdGh1Yi5jb20vYWxwaW5lanMvYWxwaW5lIyR7ZGlyZWN0aXZlfWApO1xuICAgIH0gZWxzZSBpZiAoZWwuY29udGVudC5jaGlsZEVsZW1lbnRDb3VudCAhPT0gMSkge1xuICAgICAgY29uc29sZS53YXJuKGBBbHBpbmU6IDx0ZW1wbGF0ZT4gdGFnIHdpdGggWyR7ZGlyZWN0aXZlfV0gZW5jb3VudGVyZWQgd2l0aCBtdWx0aXBsZSBlbGVtZW50IHJvb3RzLiBNYWtlIHN1cmUgPHRlbXBsYXRlPiBvbmx5IGhhcyBhIHNpbmdsZSBjaGlsZCBlbGVtZW50LmApO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiBrZWJhYkNhc2Uoc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0LnJlcGxhY2UoLyhbYS16XSkoW0EtWl0pL2csICckMS0kMicpLnJlcGxhY2UoL1tfXFxzXS8sICctJykudG9Mb3dlckNhc2UoKTtcbiAgfVxuICBmdW5jdGlvbiBjYW1lbENhc2Uoc3ViamVjdCkge1xuICAgIHJldHVybiBzdWJqZWN0LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvLShcXHcpL2csIChtYXRjaCwgY2hhcikgPT4gY2hhci50b1VwcGVyQ2FzZSgpKTtcbiAgfVxuICBmdW5jdGlvbiB3YWxrKGVsLCBjYWxsYmFjaykge1xuICAgIGlmIChjYWxsYmFjayhlbCkgPT09IGZhbHNlKSByZXR1cm47XG4gICAgbGV0IG5vZGUgPSBlbC5maXJzdEVsZW1lbnRDaGlsZDtcblxuICAgIHdoaWxlIChub2RlKSB7XG4gICAgICB3YWxrKG5vZGUsIGNhbGxiYWNrKTtcbiAgICAgIG5vZGUgPSBub2RlLm5leHRFbGVtZW50U2libGluZztcbiAgICB9XG4gIH1cbiAgZnVuY3Rpb24gZGVib3VuY2UoZnVuYywgd2FpdCkge1xuICAgIHZhciB0aW1lb3V0O1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgY29udGV4dCA9IHRoaXMsXG4gICAgICAgICAgYXJncyA9IGFyZ3VtZW50cztcblxuICAgICAgdmFyIGxhdGVyID0gZnVuY3Rpb24gbGF0ZXIoKSB7XG4gICAgICAgIHRpbWVvdXQgPSBudWxsO1xuICAgICAgICBmdW5jLmFwcGx5KGNvbnRleHQsIGFyZ3MpO1xuICAgICAgfTtcblxuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQobGF0ZXIsIHdhaXQpO1xuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gc2FmZXJFdmFsKGV4cHJlc3Npb24sIGRhdGFDb250ZXh0LCBhZGRpdGlvbmFsSGVscGVyVmFyaWFibGVzID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBleHByZXNzaW9uLmNhbGwoZGF0YUNvbnRleHQpO1xuICAgIH1cblxuICAgIHJldHVybiBuZXcgRnVuY3Rpb24oWyckZGF0YScsIC4uLk9iamVjdC5rZXlzKGFkZGl0aW9uYWxIZWxwZXJWYXJpYWJsZXMpXSwgYHZhciBfX2FscGluZV9yZXN1bHQ7IHdpdGgoJGRhdGEpIHsgX19hbHBpbmVfcmVzdWx0ID0gJHtleHByZXNzaW9ufSB9OyByZXR1cm4gX19hbHBpbmVfcmVzdWx0YCkoZGF0YUNvbnRleHQsIC4uLk9iamVjdC52YWx1ZXMoYWRkaXRpb25hbEhlbHBlclZhcmlhYmxlcykpO1xuICB9XG4gIGZ1bmN0aW9uIHNhZmVyRXZhbE5vUmV0dXJuKGV4cHJlc3Npb24sIGRhdGFDb250ZXh0LCBhZGRpdGlvbmFsSGVscGVyVmFyaWFibGVzID0ge30pIHtcbiAgICBpZiAodHlwZW9mIGV4cHJlc3Npb24gPT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUoZXhwcmVzc2lvbi5jYWxsKGRhdGFDb250ZXh0LCBhZGRpdGlvbmFsSGVscGVyVmFyaWFibGVzWyckZXZlbnQnXSkpO1xuICAgIH1cblxuICAgIGxldCBBc3luY0Z1bmN0aW9uID0gRnVuY3Rpb247XG4gICAgLyogTU9ERVJOLU9OTFk6U1RBUlQgKi9cblxuICAgIEFzeW5jRnVuY3Rpb24gPSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoYXN5bmMgZnVuY3Rpb24gKCkge30pLmNvbnN0cnVjdG9yO1xuICAgIC8qIE1PREVSTi1PTkxZOkVORCAqL1xuICAgIC8vIEZvciB0aGUgY2FzZXMgd2hlbiB1c2VycyBwYXNzIG9ubHkgYSBmdW5jdGlvbiByZWZlcmVuY2UgdG8gdGhlIGNhbGxlcjogYHgtb246Y2xpY2s9XCJmb29cImBcbiAgICAvLyBXaGVyZSBcImZvb1wiIGlzIGEgZnVuY3Rpb24uIEFsc28sIHdlJ2xsIHBhc3MgdGhlIGZ1bmN0aW9uIHRoZSBldmVudCBpbnN0YW5jZSB3aGVuIHdlIGNhbGwgaXQuXG5cbiAgICBpZiAoT2JqZWN0LmtleXMoZGF0YUNvbnRleHQpLmluY2x1ZGVzKGV4cHJlc3Npb24pKSB7XG4gICAgICBsZXQgbWV0aG9kUmVmZXJlbmNlID0gbmV3IEZ1bmN0aW9uKFsnZGF0YUNvbnRleHQnLCAuLi5PYmplY3Qua2V5cyhhZGRpdGlvbmFsSGVscGVyVmFyaWFibGVzKV0sIGB3aXRoKGRhdGFDb250ZXh0KSB7IHJldHVybiAke2V4cHJlc3Npb259IH1gKShkYXRhQ29udGV4dCwgLi4uT2JqZWN0LnZhbHVlcyhhZGRpdGlvbmFsSGVscGVyVmFyaWFibGVzKSk7XG5cbiAgICAgIGlmICh0eXBlb2YgbWV0aG9kUmVmZXJlbmNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIHJldHVybiBQcm9taXNlLnJlc29sdmUobWV0aG9kUmVmZXJlbmNlLmNhbGwoZGF0YUNvbnRleHQsIGFkZGl0aW9uYWxIZWxwZXJWYXJpYWJsZXNbJyRldmVudCddKSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gUHJvbWlzZS5yZXNvbHZlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIFByb21pc2UucmVzb2x2ZShuZXcgQXN5bmNGdW5jdGlvbihbJ2RhdGFDb250ZXh0JywgLi4uT2JqZWN0LmtleXMoYWRkaXRpb25hbEhlbHBlclZhcmlhYmxlcyldLCBgd2l0aChkYXRhQ29udGV4dCkgeyAke2V4cHJlc3Npb259IH1gKShkYXRhQ29udGV4dCwgLi4uT2JqZWN0LnZhbHVlcyhhZGRpdGlvbmFsSGVscGVyVmFyaWFibGVzKSkpO1xuICB9XG4gIGNvbnN0IHhBdHRyUkUgPSAvXngtKG9ufGJpbmR8ZGF0YXx0ZXh0fGh0bWx8bW9kZWx8aWZ8Zm9yfHNob3d8Y2xvYWt8dHJhbnNpdGlvbnxyZWZ8c3ByZWFkKVxcYi87XG4gIGZ1bmN0aW9uIGlzWEF0dHIoYXR0cikge1xuICAgIGNvbnN0IG5hbWUgPSByZXBsYWNlQXRBbmRDb2xvbldpdGhTdGFuZGFyZFN5bnRheChhdHRyLm5hbWUpO1xuICAgIHJldHVybiB4QXR0clJFLnRlc3QobmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gZ2V0WEF0dHJzKGVsLCBjb21wb25lbnQsIHR5cGUpIHtcbiAgICBsZXQgZGlyZWN0aXZlcyA9IEFycmF5LmZyb20oZWwuYXR0cmlidXRlcykuZmlsdGVyKGlzWEF0dHIpLm1hcChwYXJzZUh0bWxBdHRyaWJ1dGUpOyAvLyBHZXQgYW4gb2JqZWN0IG9mIGRpcmVjdGl2ZXMgZnJvbSB4LXNwcmVhZC5cblxuICAgIGxldCBzcHJlYWREaXJlY3RpdmUgPSBkaXJlY3RpdmVzLmZpbHRlcihkaXJlY3RpdmUgPT4gZGlyZWN0aXZlLnR5cGUgPT09ICdzcHJlYWQnKVswXTtcblxuICAgIGlmIChzcHJlYWREaXJlY3RpdmUpIHtcbiAgICAgIGxldCBzcHJlYWRPYmplY3QgPSBzYWZlckV2YWwoc3ByZWFkRGlyZWN0aXZlLmV4cHJlc3Npb24sIGNvbXBvbmVudC4kZGF0YSk7IC8vIEFkZCB4LXNwcmVhZCBkaXJlY3RpdmVzIHRvIHRoZSBwaWxlIG9mIGV4aXN0aW5nIGRpcmVjdGl2ZXMuXG5cbiAgICAgIGRpcmVjdGl2ZXMgPSBkaXJlY3RpdmVzLmNvbmNhdChPYmplY3QuZW50cmllcyhzcHJlYWRPYmplY3QpLm1hcCgoW25hbWUsIHZhbHVlXSkgPT4gcGFyc2VIdG1sQXR0cmlidXRlKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgdmFsdWVcbiAgICAgIH0pKSk7XG4gICAgfVxuXG4gICAgaWYgKHR5cGUpIHJldHVybiBkaXJlY3RpdmVzLmZpbHRlcihpID0+IGkudHlwZSA9PT0gdHlwZSk7XG4gICAgcmV0dXJuIHNvcnREaXJlY3RpdmVzKGRpcmVjdGl2ZXMpO1xuICB9XG5cbiAgZnVuY3Rpb24gc29ydERpcmVjdGl2ZXMoZGlyZWN0aXZlcykge1xuICAgIGxldCBkaXJlY3RpdmVPcmRlciA9IFsnYmluZCcsICdtb2RlbCcsICdzaG93JywgJ2NhdGNoLWFsbCddO1xuICAgIHJldHVybiBkaXJlY3RpdmVzLnNvcnQoKGEsIGIpID0+IHtcbiAgICAgIGxldCB0eXBlQSA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYS50eXBlKSA9PT0gLTEgPyAnY2F0Y2gtYWxsJyA6IGEudHlwZTtcbiAgICAgIGxldCB0eXBlQiA9IGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YoYi50eXBlKSA9PT0gLTEgPyAnY2F0Y2gtYWxsJyA6IGIudHlwZTtcbiAgICAgIHJldHVybiBkaXJlY3RpdmVPcmRlci5pbmRleE9mKHR5cGVBKSAtIGRpcmVjdGl2ZU9yZGVyLmluZGV4T2YodHlwZUIpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gcGFyc2VIdG1sQXR0cmlidXRlKHtcbiAgICBuYW1lLFxuICAgIHZhbHVlXG4gIH0pIHtcbiAgICBjb25zdCBub3JtYWxpemVkTmFtZSA9IHJlcGxhY2VBdEFuZENvbG9uV2l0aFN0YW5kYXJkU3ludGF4KG5hbWUpO1xuICAgIGNvbnN0IHR5cGVNYXRjaCA9IG5vcm1hbGl6ZWROYW1lLm1hdGNoKHhBdHRyUkUpO1xuICAgIGNvbnN0IHZhbHVlTWF0Y2ggPSBub3JtYWxpemVkTmFtZS5tYXRjaCgvOihbYS16QS1aMC05XFwtOl0rKS8pO1xuICAgIGNvbnN0IG1vZGlmaWVycyA9IG5vcm1hbGl6ZWROYW1lLm1hdGNoKC9cXC5bXi5cXF1dKyg/PVteXFxdXSokKS9nKSB8fCBbXTtcbiAgICByZXR1cm4ge1xuICAgICAgdHlwZTogdHlwZU1hdGNoID8gdHlwZU1hdGNoWzFdIDogbnVsbCxcbiAgICAgIHZhbHVlOiB2YWx1ZU1hdGNoID8gdmFsdWVNYXRjaFsxXSA6IG51bGwsXG4gICAgICBtb2RpZmllcnM6IG1vZGlmaWVycy5tYXAoaSA9PiBpLnJlcGxhY2UoJy4nLCAnJykpLFxuICAgICAgZXhwcmVzc2lvbjogdmFsdWVcbiAgICB9O1xuICB9XG4gIGZ1bmN0aW9uIGlzQm9vbGVhbkF0dHIoYXR0ck5hbWUpIHtcbiAgICAvLyBBcyBwZXIgSFRNTCBzcGVjIHRhYmxlIGh0dHBzOi8vaHRtbC5zcGVjLndoYXR3Zy5vcmcvbXVsdGlwYWdlL2luZGljZXMuaHRtbCNhdHRyaWJ1dGVzLTM6Ym9vbGVhbi1hdHRyaWJ1dGVcbiAgICAvLyBBcnJheSByb3VnaGx5IG9yZGVyZWQgYnkgZXN0aW1hdGVkIHVzYWdlXG4gICAgY29uc3QgYm9vbGVhbkF0dHJpYnV0ZXMgPSBbJ2Rpc2FibGVkJywgJ2NoZWNrZWQnLCAncmVxdWlyZWQnLCAncmVhZG9ubHknLCAnaGlkZGVuJywgJ29wZW4nLCAnc2VsZWN0ZWQnLCAnYXV0b2ZvY3VzJywgJ2l0ZW1zY29wZScsICdtdWx0aXBsZScsICdub3ZhbGlkYXRlJywgJ2FsbG93ZnVsbHNjcmVlbicsICdhbGxvd3BheW1lbnRyZXF1ZXN0JywgJ2Zvcm1ub3ZhbGlkYXRlJywgJ2F1dG9wbGF5JywgJ2NvbnRyb2xzJywgJ2xvb3AnLCAnbXV0ZWQnLCAncGxheXNpbmxpbmUnLCAnZGVmYXVsdCcsICdpc21hcCcsICdyZXZlcnNlZCcsICdhc3luYycsICdkZWZlcicsICdub21vZHVsZSddO1xuICAgIHJldHVybiBib29sZWFuQXR0cmlidXRlcy5pbmNsdWRlcyhhdHRyTmFtZSk7XG4gIH1cbiAgZnVuY3Rpb24gcmVwbGFjZUF0QW5kQ29sb25XaXRoU3RhbmRhcmRTeW50YXgobmFtZSkge1xuICAgIGlmIChuYW1lLnN0YXJ0c1dpdGgoJ0AnKSkge1xuICAgICAgcmV0dXJuIG5hbWUucmVwbGFjZSgnQCcsICd4LW9uOicpO1xuICAgIH0gZWxzZSBpZiAobmFtZS5zdGFydHNXaXRoKCc6JykpIHtcbiAgICAgIHJldHVybiBuYW1lLnJlcGxhY2UoJzonLCAneC1iaW5kOicpO1xuICAgIH1cblxuICAgIHJldHVybiBuYW1lO1xuICB9XG4gIGZ1bmN0aW9uIGNvbnZlcnRDbGFzc1N0cmluZ1RvQXJyYXkoY2xhc3NMaXN0LCBmaWx0ZXJGbiA9IEJvb2xlYW4pIHtcbiAgICByZXR1cm4gY2xhc3NMaXN0LnNwbGl0KCcgJykuZmlsdGVyKGZpbHRlckZuKTtcbiAgfVxuICBjb25zdCBUUkFOU0lUSU9OX1RZUEVfSU4gPSAnaW4nO1xuICBjb25zdCBUUkFOU0lUSU9OX1RZUEVfT1VUID0gJ291dCc7XG4gIGNvbnN0IFRSQU5TSVRJT05fQ0FOQ0VMTEVEID0gJ2NhbmNlbGxlZCc7XG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25JbihlbCwgc2hvdywgcmVqZWN0LCBjb21wb25lbnQsIGZvcmNlU2tpcCA9IGZhbHNlKSB7XG4gICAgLy8gV2UgZG9uJ3Qgd2FudCB0byB0cmFuc2l0aW9uIG9uIHRoZSBpbml0aWFsIHBhZ2UgbG9hZC5cbiAgICBpZiAoZm9yY2VTa2lwKSByZXR1cm4gc2hvdygpO1xuXG4gICAgaWYgKGVsLl9feF90cmFuc2l0aW9uICYmIGVsLl9feF90cmFuc2l0aW9uLnR5cGUgPT09IFRSQU5TSVRJT05fVFlQRV9JTikge1xuICAgICAgLy8gdGhlcmUgaXMgYWxyZWFkeSBhIHNpbWlsYXIgdHJhbnNpdGlvbiBnb2luZyBvbiwgdGhpcyB3YXMgcHJvYmFibHkgdHJpZ2dlcmVkIGJ5XG4gICAgICAvLyBhIGNoYW5nZSBpbiBhIGRpZmZlcmVudCBwcm9wZXJ0eSwgbGV0J3MganVzdCBsZWF2ZSB0aGUgcHJldmlvdXMgb25lIGRvaW5nIGl0cyBqb2JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRycyA9IGdldFhBdHRycyhlbCwgY29tcG9uZW50LCAndHJhbnNpdGlvbicpO1xuICAgIGNvbnN0IHNob3dBdHRyID0gZ2V0WEF0dHJzKGVsLCBjb21wb25lbnQsICdzaG93JylbMF07IC8vIElmIHRoaXMgaXMgdHJpZ2dlcmVkIGJ5IGEgeC1zaG93LnRyYW5zaXRpb24uXG5cbiAgICBpZiAoc2hvd0F0dHIgJiYgc2hvd0F0dHIubW9kaWZpZXJzLmluY2x1ZGVzKCd0cmFuc2l0aW9uJykpIHtcbiAgICAgIGxldCBtb2RpZmllcnMgPSBzaG93QXR0ci5tb2RpZmllcnM7IC8vIElmIHgtc2hvdy50cmFuc2l0aW9uLm91dCwgd2UnbGwgc2tpcCB0aGUgXCJpblwiIHRyYW5zaXRpb24uXG5cbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoJ291dCcpICYmICFtb2RpZmllcnMuaW5jbHVkZXMoJ2luJykpIHJldHVybiBzaG93KCk7XG4gICAgICBjb25zdCBzZXR0aW5nQm90aFNpZGVzT2ZUcmFuc2l0aW9uID0gbW9kaWZpZXJzLmluY2x1ZGVzKCdpbicpICYmIG1vZGlmaWVycy5pbmNsdWRlcygnb3V0Jyk7IC8vIElmIHgtc2hvdy50cmFuc2l0aW9uLmluLi4ub3V0Li4uIG9ubHkgdXNlIFwiaW5cIiByZWxhdGVkIG1vZGlmaWVycyBmb3IgdGhpcyB0cmFuc2l0aW9uLlxuXG4gICAgICBtb2RpZmllcnMgPSBzZXR0aW5nQm90aFNpZGVzT2ZUcmFuc2l0aW9uID8gbW9kaWZpZXJzLmZpbHRlcigoaSwgaW5kZXgpID0+IGluZGV4IDwgbW9kaWZpZXJzLmluZGV4T2YoJ291dCcpKSA6IG1vZGlmaWVycztcbiAgICAgIHRyYW5zaXRpb25IZWxwZXJJbihlbCwgbW9kaWZpZXJzLCBzaG93LCByZWplY3QpOyAvLyBPdGhlcndpc2UsIHdlIGNhbiBhc3N1bWUgeC10cmFuc2l0aW9uOmVudGVyLlxuICAgIH0gZWxzZSBpZiAoYXR0cnMuc29tZShhdHRyID0+IFsnZW50ZXInLCAnZW50ZXItc3RhcnQnLCAnZW50ZXItZW5kJ10uaW5jbHVkZXMoYXR0ci52YWx1ZSkpKSB7XG4gICAgICB0cmFuc2l0aW9uQ2xhc3Nlc0luKGVsLCBjb21wb25lbnQsIGF0dHJzLCBzaG93LCByZWplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBJZiBuZWl0aGVyLCBqdXN0IHNob3cgdGhhdCBkYW1uIHRoaW5nLlxuICAgICAgc2hvdygpO1xuICAgIH1cbiAgfVxuICBmdW5jdGlvbiB0cmFuc2l0aW9uT3V0KGVsLCBoaWRlLCByZWplY3QsIGNvbXBvbmVudCwgZm9yY2VTa2lwID0gZmFsc2UpIHtcbiAgICAvLyBXZSBkb24ndCB3YW50IHRvIHRyYW5zaXRpb24gb24gdGhlIGluaXRpYWwgcGFnZSBsb2FkLlxuICAgIGlmIChmb3JjZVNraXApIHJldHVybiBoaWRlKCk7XG5cbiAgICBpZiAoZWwuX194X3RyYW5zaXRpb24gJiYgZWwuX194X3RyYW5zaXRpb24udHlwZSA9PT0gVFJBTlNJVElPTl9UWVBFX09VVCkge1xuICAgICAgLy8gdGhlcmUgaXMgYWxyZWFkeSBhIHNpbWlsYXIgdHJhbnNpdGlvbiBnb2luZyBvbiwgdGhpcyB3YXMgcHJvYmFibHkgdHJpZ2dlcmVkIGJ5XG4gICAgICAvLyBhIGNoYW5nZSBpbiBhIGRpZmZlcmVudCBwcm9wZXJ0eSwgbGV0J3MganVzdCBsZWF2ZSB0aGUgcHJldmlvdXMgb25lIGRvaW5nIGl0cyBqb2JcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICBjb25zdCBhdHRycyA9IGdldFhBdHRycyhlbCwgY29tcG9uZW50LCAndHJhbnNpdGlvbicpO1xuICAgIGNvbnN0IHNob3dBdHRyID0gZ2V0WEF0dHJzKGVsLCBjb21wb25lbnQsICdzaG93JylbMF07XG5cbiAgICBpZiAoc2hvd0F0dHIgJiYgc2hvd0F0dHIubW9kaWZpZXJzLmluY2x1ZGVzKCd0cmFuc2l0aW9uJykpIHtcbiAgICAgIGxldCBtb2RpZmllcnMgPSBzaG93QXR0ci5tb2RpZmllcnM7XG4gICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKCdpbicpICYmICFtb2RpZmllcnMuaW5jbHVkZXMoJ291dCcpKSByZXR1cm4gaGlkZSgpO1xuICAgICAgY29uc3Qgc2V0dGluZ0JvdGhTaWRlc09mVHJhbnNpdGlvbiA9IG1vZGlmaWVycy5pbmNsdWRlcygnaW4nKSAmJiBtb2RpZmllcnMuaW5jbHVkZXMoJ291dCcpO1xuICAgICAgbW9kaWZpZXJzID0gc2V0dGluZ0JvdGhTaWRlc09mVHJhbnNpdGlvbiA/IG1vZGlmaWVycy5maWx0ZXIoKGksIGluZGV4KSA9PiBpbmRleCA+IG1vZGlmaWVycy5pbmRleE9mKCdvdXQnKSkgOiBtb2RpZmllcnM7XG4gICAgICB0cmFuc2l0aW9uSGVscGVyT3V0KGVsLCBtb2RpZmllcnMsIHNldHRpbmdCb3RoU2lkZXNPZlRyYW5zaXRpb24sIGhpZGUsIHJlamVjdCk7XG4gICAgfSBlbHNlIGlmIChhdHRycy5zb21lKGF0dHIgPT4gWydsZWF2ZScsICdsZWF2ZS1zdGFydCcsICdsZWF2ZS1lbmQnXS5pbmNsdWRlcyhhdHRyLnZhbHVlKSkpIHtcbiAgICAgIHRyYW5zaXRpb25DbGFzc2VzT3V0KGVsLCBjb21wb25lbnQsIGF0dHJzLCBoaWRlLCByZWplY3QpO1xuICAgIH0gZWxzZSB7XG4gICAgICBoaWRlKCk7XG4gICAgfVxuICB9XG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25IZWxwZXJJbihlbCwgbW9kaWZpZXJzLCBzaG93Q2FsbGJhY2ssIHJlamVjdCkge1xuICAgIC8vIERlZmF1bHQgdmFsdWVzIGluc3BpcmVkIGJ5OiBodHRwczovL21hdGVyaWFsLmlvL2Rlc2lnbi9tb3Rpb24vc3BlZWQuaHRtbCNkdXJhdGlvblxuICAgIGNvbnN0IHN0eWxlVmFsdWVzID0ge1xuICAgICAgZHVyYXRpb246IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCAnZHVyYXRpb24nLCAxNTApLFxuICAgICAgb3JpZ2luOiBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ29yaWdpbicsICdjZW50ZXInKSxcbiAgICAgIGZpcnN0OiB7XG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIHNjYWxlOiBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ3NjYWxlJywgOTUpXG4gICAgICB9LFxuICAgICAgc2Vjb25kOiB7XG4gICAgICAgIG9wYWNpdHk6IDEsXG4gICAgICAgIHNjYWxlOiAxMDBcbiAgICAgIH1cbiAgICB9O1xuICAgIHRyYW5zaXRpb25IZWxwZXIoZWwsIG1vZGlmaWVycywgc2hvd0NhbGxiYWNrLCAoKSA9PiB7fSwgcmVqZWN0LCBzdHlsZVZhbHVlcywgVFJBTlNJVElPTl9UWVBFX0lOKTtcbiAgfVxuICBmdW5jdGlvbiB0cmFuc2l0aW9uSGVscGVyT3V0KGVsLCBtb2RpZmllcnMsIHNldHRpbmdCb3RoU2lkZXNPZlRyYW5zaXRpb24sIGhpZGVDYWxsYmFjaywgcmVqZWN0KSB7XG4gICAgLy8gTWFrZSB0aGUgXCJvdXRcIiB0cmFuc2l0aW9uIC41eCBzbG93ZXIgdGhhbiB0aGUgXCJpblwiLiAoVmlzdWFsbHkgYmV0dGVyKVxuICAgIC8vIEhPV0VWRVIsIGlmIHRoZXkgZXhwbGljaXRseSBzZXQgYSBkdXJhdGlvbiBmb3IgdGhlIFwib3V0XCIgdHJhbnNpdGlvbixcbiAgICAvLyB1c2UgdGhhdC5cbiAgICBjb25zdCBkdXJhdGlvbiA9IHNldHRpbmdCb3RoU2lkZXNPZlRyYW5zaXRpb24gPyBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ2R1cmF0aW9uJywgMTUwKSA6IG1vZGlmaWVyVmFsdWUobW9kaWZpZXJzLCAnZHVyYXRpb24nLCAxNTApIC8gMjtcbiAgICBjb25zdCBzdHlsZVZhbHVlcyA9IHtcbiAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcbiAgICAgIG9yaWdpbjogbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsICdvcmlnaW4nLCAnY2VudGVyJyksXG4gICAgICBmaXJzdDoge1xuICAgICAgICBvcGFjaXR5OiAxLFxuICAgICAgICBzY2FsZTogMTAwXG4gICAgICB9LFxuICAgICAgc2Vjb25kOiB7XG4gICAgICAgIG9wYWNpdHk6IDAsXG4gICAgICAgIHNjYWxlOiBtb2RpZmllclZhbHVlKG1vZGlmaWVycywgJ3NjYWxlJywgOTUpXG4gICAgICB9XG4gICAgfTtcbiAgICB0cmFuc2l0aW9uSGVscGVyKGVsLCBtb2RpZmllcnMsICgpID0+IHt9LCBoaWRlQ2FsbGJhY2ssIHJlamVjdCwgc3R5bGVWYWx1ZXMsIFRSQU5TSVRJT05fVFlQRV9PVVQpO1xuICB9XG5cbiAgZnVuY3Rpb24gbW9kaWZpZXJWYWx1ZShtb2RpZmllcnMsIGtleSwgZmFsbGJhY2spIHtcbiAgICAvLyBJZiB0aGUgbW9kaWZpZXIgaXNuJ3QgcHJlc2VudCwgdXNlIHRoZSBkZWZhdWx0LlxuICAgIGlmIChtb2RpZmllcnMuaW5kZXhPZihrZXkpID09PSAtMSkgcmV0dXJuIGZhbGxiYWNrOyAvLyBJZiBpdCBJUyBwcmVzZW50LCBncmFiIHRoZSB2YWx1ZSBhZnRlciBpdDogeC1zaG93LnRyYW5zaXRpb24uZHVyYXRpb24uNTAwbXNcblxuICAgIGNvbnN0IHJhd1ZhbHVlID0gbW9kaWZpZXJzW21vZGlmaWVycy5pbmRleE9mKGtleSkgKyAxXTtcbiAgICBpZiAoIXJhd1ZhbHVlKSByZXR1cm4gZmFsbGJhY2s7XG5cbiAgICBpZiAoa2V5ID09PSAnc2NhbGUnKSB7XG4gICAgICAvLyBDaGVjayBpZiB0aGUgdmVyeSBuZXh0IHZhbHVlIGlzIE5PVCBhIG51bWJlciBhbmQgcmV0dXJuIHRoZSBmYWxsYmFjay5cbiAgICAgIC8vIElmIHgtc2hvdy50cmFuc2l0aW9uLnNjYWxlLCB3ZSdsbCB1c2UgdGhlIGRlZmF1bHQgc2NhbGUgdmFsdWUuXG4gICAgICAvLyBUaGF0IGlzIGhvdyBhIHVzZXIgb3B0cyBvdXQgb2YgdGhlIG9wYWNpdHkgdHJhbnNpdGlvbi5cbiAgICAgIGlmICghaXNOdW1lcmljKHJhd1ZhbHVlKSkgcmV0dXJuIGZhbGxiYWNrO1xuICAgIH1cblxuICAgIGlmIChrZXkgPT09ICdkdXJhdGlvbicpIHtcbiAgICAgIC8vIFN1cHBvcnQgeC1zaG93LnRyYW5zaXRpb24uZHVyYXRpb24uNTAwbXMgJiYgZHVyYXRpb24uNTAwXG4gICAgICBsZXQgbWF0Y2ggPSByYXdWYWx1ZS5tYXRjaCgvKFswLTldKyltcy8pO1xuICAgICAgaWYgKG1hdGNoKSByZXR1cm4gbWF0Y2hbMV07XG4gICAgfVxuXG4gICAgaWYgKGtleSA9PT0gJ29yaWdpbicpIHtcbiAgICAgIC8vIFN1cHBvcnQgY2hhaW5pbmcgb3JpZ2luIGRpcmVjdGlvbnM6IHgtc2hvdy50cmFuc2l0aW9uLnRvcC5yaWdodFxuICAgICAgaWYgKFsndG9wJywgJ3JpZ2h0JywgJ2xlZnQnLCAnY2VudGVyJywgJ2JvdHRvbSddLmluY2x1ZGVzKG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihrZXkpICsgMl0pKSB7XG4gICAgICAgIHJldHVybiBbcmF3VmFsdWUsIG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZihrZXkpICsgMl1dLmpvaW4oJyAnKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gcmF3VmFsdWU7XG4gIH1cblxuICBmdW5jdGlvbiB0cmFuc2l0aW9uSGVscGVyKGVsLCBtb2RpZmllcnMsIGhvb2sxLCBob29rMiwgcmVqZWN0LCBzdHlsZVZhbHVlcywgdHlwZSkge1xuICAgIC8vIGNsZWFyIHRoZSBwcmV2aW91cyB0cmFuc2l0aW9uIGlmIGV4aXN0cyB0byBhdm9pZCBjYWNoaW5nIHRoZSB3cm9uZyBzdHlsZXNcbiAgICBpZiAoZWwuX194X3RyYW5zaXRpb24pIHtcbiAgICAgIGVsLl9feF90cmFuc2l0aW9uLmNhbmNlbCAmJiBlbC5fX3hfdHJhbnNpdGlvbi5jYW5jZWwoKTtcbiAgICB9IC8vIElmIHRoZSB1c2VyIHNldCB0aGVzZSBzdHlsZSB2YWx1ZXMsIHdlJ2xsIHB1dCB0aGVtIGJhY2sgd2hlbiB3ZSdyZSBkb25lIHdpdGggdGhlbS5cblxuXG4gICAgY29uc3Qgb3BhY2l0eUNhY2hlID0gZWwuc3R5bGUub3BhY2l0eTtcbiAgICBjb25zdCB0cmFuc2Zvcm1DYWNoZSA9IGVsLnN0eWxlLnRyYW5zZm9ybTtcbiAgICBjb25zdCB0cmFuc2Zvcm1PcmlnaW5DYWNoZSA9IGVsLnN0eWxlLnRyYW5zZm9ybU9yaWdpbjsgLy8gSWYgbm8gbW9kaWZpZXJzIGFyZSBwcmVzZW50OiB4LXNob3cudHJhbnNpdGlvbiwgd2UnbGwgZGVmYXVsdCB0byBib3RoIG9wYWNpdHkgYW5kIHNjYWxlLlxuXG4gICAgY29uc3Qgbm9Nb2RpZmllcnMgPSAhbW9kaWZpZXJzLmluY2x1ZGVzKCdvcGFjaXR5JykgJiYgIW1vZGlmaWVycy5pbmNsdWRlcygnc2NhbGUnKTtcbiAgICBjb25zdCB0cmFuc2l0aW9uT3BhY2l0eSA9IG5vTW9kaWZpZXJzIHx8IG1vZGlmaWVycy5pbmNsdWRlcygnb3BhY2l0eScpO1xuICAgIGNvbnN0IHRyYW5zaXRpb25TY2FsZSA9IG5vTW9kaWZpZXJzIHx8IG1vZGlmaWVycy5pbmNsdWRlcygnc2NhbGUnKTsgLy8gVGhlc2UgYXJlIHRoZSBleHBsaWNpdCBzdGFnZXMgb2YgYSB0cmFuc2l0aW9uIChzYW1lIHN0YWdlcyBmb3IgaW4gYW5kIGZvciBvdXQpLlxuICAgIC8vIFRoaXMgd2F5IHlvdSBjYW4gZ2V0IGEgYmlyZHMgZXllIHZpZXcgb2YgdGhlIGhvb2tzLCBhbmQgdGhlIGRpZmZlcmVuY2VzXG4gICAgLy8gYmV0d2VlbiB0aGVtLlxuXG4gICAgY29uc3Qgc3RhZ2VzID0ge1xuICAgICAgc3RhcnQoKSB7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uT3BhY2l0eSkgZWwuc3R5bGUub3BhY2l0eSA9IHN0eWxlVmFsdWVzLmZpcnN0Lm9wYWNpdHk7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uU2NhbGUpIGVsLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3N0eWxlVmFsdWVzLmZpcnN0LnNjYWxlIC8gMTAwfSlgO1xuICAgICAgfSxcblxuICAgICAgZHVyaW5nKCkge1xuICAgICAgICBpZiAodHJhbnNpdGlvblNjYWxlKSBlbC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSBzdHlsZVZhbHVlcy5vcmlnaW47XG4gICAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25Qcm9wZXJ0eSA9IFt0cmFuc2l0aW9uT3BhY2l0eSA/IGBvcGFjaXR5YCA6IGBgLCB0cmFuc2l0aW9uU2NhbGUgPyBgdHJhbnNmb3JtYCA6IGBgXS5qb2luKCcgJykudHJpbSgpO1xuICAgICAgICBlbC5zdHlsZS50cmFuc2l0aW9uRHVyYXRpb24gPSBgJHtzdHlsZVZhbHVlcy5kdXJhdGlvbiAvIDEwMDB9c2A7XG4gICAgICAgIGVsLnN0eWxlLnRyYW5zaXRpb25UaW1pbmdGdW5jdGlvbiA9IGBjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSlgO1xuICAgICAgfSxcblxuICAgICAgc2hvdygpIHtcbiAgICAgICAgaG9vazEoKTtcbiAgICAgIH0sXG5cbiAgICAgIGVuZCgpIHtcbiAgICAgICAgaWYgKHRyYW5zaXRpb25PcGFjaXR5KSBlbC5zdHlsZS5vcGFjaXR5ID0gc3R5bGVWYWx1ZXMuc2Vjb25kLm9wYWNpdHk7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uU2NhbGUpIGVsLnN0eWxlLnRyYW5zZm9ybSA9IGBzY2FsZSgke3N0eWxlVmFsdWVzLnNlY29uZC5zY2FsZSAvIDEwMH0pYDtcbiAgICAgIH0sXG5cbiAgICAgIGhpZGUoKSB7XG4gICAgICAgIGhvb2syKCk7XG4gICAgICB9LFxuXG4gICAgICBjbGVhbnVwKCkge1xuICAgICAgICBpZiAodHJhbnNpdGlvbk9wYWNpdHkpIGVsLnN0eWxlLm9wYWNpdHkgPSBvcGFjaXR5Q2FjaGU7XG4gICAgICAgIGlmICh0cmFuc2l0aW9uU2NhbGUpIGVsLnN0eWxlLnRyYW5zZm9ybSA9IHRyYW5zZm9ybUNhY2hlO1xuICAgICAgICBpZiAodHJhbnNpdGlvblNjYWxlKSBlbC5zdHlsZS50cmFuc2Zvcm1PcmlnaW4gPSB0cmFuc2Zvcm1PcmlnaW5DYWNoZTtcbiAgICAgICAgZWwuc3R5bGUudHJhbnNpdGlvblByb3BlcnR5ID0gbnVsbDtcbiAgICAgICAgZWwuc3R5bGUudHJhbnNpdGlvbkR1cmF0aW9uID0gbnVsbDtcbiAgICAgICAgZWwuc3R5bGUudHJhbnNpdGlvblRpbWluZ0Z1bmN0aW9uID0gbnVsbDtcbiAgICAgIH1cblxuICAgIH07XG4gICAgdHJhbnNpdGlvbihlbCwgc3RhZ2VzLCB0eXBlLCByZWplY3QpO1xuICB9XG5cbiAgY29uc3QgZW5zdXJlU3RyaW5nRXhwcmVzc2lvbiA9IChleHByZXNzaW9uLCBlbCwgY29tcG9uZW50KSA9PiB7XG4gICAgcmV0dXJuIHR5cGVvZiBleHByZXNzaW9uID09PSAnZnVuY3Rpb24nID8gY29tcG9uZW50LmV2YWx1YXRlUmV0dXJuRXhwcmVzc2lvbihlbCwgZXhwcmVzc2lvbikgOiBleHByZXNzaW9uO1xuICB9O1xuXG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25DbGFzc2VzSW4oZWwsIGNvbXBvbmVudCwgZGlyZWN0aXZlcywgc2hvd0NhbGxiYWNrLCByZWplY3QpIHtcbiAgICBjb25zdCBlbnRlciA9IGNvbnZlcnRDbGFzc1N0cmluZ1RvQXJyYXkoZW5zdXJlU3RyaW5nRXhwcmVzc2lvbigoZGlyZWN0aXZlcy5maW5kKGkgPT4gaS52YWx1ZSA9PT0gJ2VudGVyJykgfHwge1xuICAgICAgZXhwcmVzc2lvbjogJydcbiAgICB9KS5leHByZXNzaW9uLCBlbCwgY29tcG9uZW50KSk7XG4gICAgY29uc3QgZW50ZXJTdGFydCA9IGNvbnZlcnRDbGFzc1N0cmluZ1RvQXJyYXkoZW5zdXJlU3RyaW5nRXhwcmVzc2lvbigoZGlyZWN0aXZlcy5maW5kKGkgPT4gaS52YWx1ZSA9PT0gJ2VudGVyLXN0YXJ0JykgfHwge1xuICAgICAgZXhwcmVzc2lvbjogJydcbiAgICB9KS5leHByZXNzaW9uLCBlbCwgY29tcG9uZW50KSk7XG4gICAgY29uc3QgZW50ZXJFbmQgPSBjb252ZXJ0Q2xhc3NTdHJpbmdUb0FycmF5KGVuc3VyZVN0cmluZ0V4cHJlc3Npb24oKGRpcmVjdGl2ZXMuZmluZChpID0+IGkudmFsdWUgPT09ICdlbnRlci1lbmQnKSB8fCB7XG4gICAgICBleHByZXNzaW9uOiAnJ1xuICAgIH0pLmV4cHJlc3Npb24sIGVsLCBjb21wb25lbnQpKTtcbiAgICB0cmFuc2l0aW9uQ2xhc3NlcyhlbCwgZW50ZXIsIGVudGVyU3RhcnQsIGVudGVyRW5kLCBzaG93Q2FsbGJhY2ssICgpID0+IHt9LCBUUkFOU0lUSU9OX1RZUEVfSU4sIHJlamVjdCk7XG4gIH1cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbkNsYXNzZXNPdXQoZWwsIGNvbXBvbmVudCwgZGlyZWN0aXZlcywgaGlkZUNhbGxiYWNrLCByZWplY3QpIHtcbiAgICBjb25zdCBsZWF2ZSA9IGNvbnZlcnRDbGFzc1N0cmluZ1RvQXJyYXkoZW5zdXJlU3RyaW5nRXhwcmVzc2lvbigoZGlyZWN0aXZlcy5maW5kKGkgPT4gaS52YWx1ZSA9PT0gJ2xlYXZlJykgfHwge1xuICAgICAgZXhwcmVzc2lvbjogJydcbiAgICB9KS5leHByZXNzaW9uLCBlbCwgY29tcG9uZW50KSk7XG4gICAgY29uc3QgbGVhdmVTdGFydCA9IGNvbnZlcnRDbGFzc1N0cmluZ1RvQXJyYXkoZW5zdXJlU3RyaW5nRXhwcmVzc2lvbigoZGlyZWN0aXZlcy5maW5kKGkgPT4gaS52YWx1ZSA9PT0gJ2xlYXZlLXN0YXJ0JykgfHwge1xuICAgICAgZXhwcmVzc2lvbjogJydcbiAgICB9KS5leHByZXNzaW9uLCBlbCwgY29tcG9uZW50KSk7XG4gICAgY29uc3QgbGVhdmVFbmQgPSBjb252ZXJ0Q2xhc3NTdHJpbmdUb0FycmF5KGVuc3VyZVN0cmluZ0V4cHJlc3Npb24oKGRpcmVjdGl2ZXMuZmluZChpID0+IGkudmFsdWUgPT09ICdsZWF2ZS1lbmQnKSB8fCB7XG4gICAgICBleHByZXNzaW9uOiAnJ1xuICAgIH0pLmV4cHJlc3Npb24sIGVsLCBjb21wb25lbnQpKTtcbiAgICB0cmFuc2l0aW9uQ2xhc3NlcyhlbCwgbGVhdmUsIGxlYXZlU3RhcnQsIGxlYXZlRW5kLCAoKSA9PiB7fSwgaGlkZUNhbGxiYWNrLCBUUkFOU0lUSU9OX1RZUEVfT1VULCByZWplY3QpO1xuICB9XG4gIGZ1bmN0aW9uIHRyYW5zaXRpb25DbGFzc2VzKGVsLCBjbGFzc2VzRHVyaW5nLCBjbGFzc2VzU3RhcnQsIGNsYXNzZXNFbmQsIGhvb2sxLCBob29rMiwgdHlwZSwgcmVqZWN0KSB7XG4gICAgLy8gY2xlYXIgdGhlIHByZXZpb3VzIHRyYW5zaXRpb24gaWYgZXhpc3RzIHRvIGF2b2lkIGNhY2hpbmcgdGhlIHdyb25nIGNsYXNzZXNcbiAgICBpZiAoZWwuX194X3RyYW5zaXRpb24pIHtcbiAgICAgIGVsLl9feF90cmFuc2l0aW9uLmNhbmNlbCAmJiBlbC5fX3hfdHJhbnNpdGlvbi5jYW5jZWwoKTtcbiAgICB9XG5cbiAgICBjb25zdCBvcmlnaW5hbENsYXNzZXMgPSBlbC5fX3hfb3JpZ2luYWxfY2xhc3NlcyB8fCBbXTtcbiAgICBjb25zdCBzdGFnZXMgPSB7XG4gICAgICBzdGFydCgpIHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzU3RhcnQpO1xuICAgICAgfSxcblxuICAgICAgZHVyaW5nKCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QuYWRkKC4uLmNsYXNzZXNEdXJpbmcpO1xuICAgICAgfSxcblxuICAgICAgc2hvdygpIHtcbiAgICAgICAgaG9vazEoKTtcbiAgICAgIH0sXG5cbiAgICAgIGVuZCgpIHtcbiAgICAgICAgLy8gRG9uJ3QgcmVtb3ZlIGNsYXNzZXMgdGhhdCB3ZXJlIGluIHRoZSBvcmlnaW5hbCBjbGFzcyBhdHRyaWJ1dGUuXG4gICAgICAgIGVsLmNsYXNzTGlzdC5yZW1vdmUoLi4uY2xhc3Nlc1N0YXJ0LmZpbHRlcihpID0+ICFvcmlnaW5hbENsYXNzZXMuaW5jbHVkZXMoaSkpKTtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmFkZCguLi5jbGFzc2VzRW5kKTtcbiAgICAgIH0sXG5cbiAgICAgIGhpZGUoKSB7XG4gICAgICAgIGhvb2syKCk7XG4gICAgICB9LFxuXG4gICAgICBjbGVhbnVwKCkge1xuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXNEdXJpbmcuZmlsdGVyKGkgPT4gIW9yaWdpbmFsQ2xhc3Nlcy5pbmNsdWRlcyhpKSkpO1xuICAgICAgICBlbC5jbGFzc0xpc3QucmVtb3ZlKC4uLmNsYXNzZXNFbmQuZmlsdGVyKGkgPT4gIW9yaWdpbmFsQ2xhc3Nlcy5pbmNsdWRlcyhpKSkpO1xuICAgICAgfVxuXG4gICAgfTtcbiAgICB0cmFuc2l0aW9uKGVsLCBzdGFnZXMsIHR5cGUsIHJlamVjdCk7XG4gIH1cbiAgZnVuY3Rpb24gdHJhbnNpdGlvbihlbCwgc3RhZ2VzLCB0eXBlLCByZWplY3QpIHtcbiAgICBjb25zdCBmaW5pc2ggPSBvbmNlKCgpID0+IHtcbiAgICAgIHN0YWdlcy5oaWRlKCk7IC8vIEFkZGluZyBhbiBcImlzQ29ubmVjdGVkXCIgY2hlY2ssIGluIGNhc2UgdGhlIGNhbGxiYWNrXG4gICAgICAvLyByZW1vdmVkIHRoZSBlbGVtZW50IGZyb20gdGhlIERPTS5cblxuICAgICAgaWYgKGVsLmlzQ29ubmVjdGVkKSB7XG4gICAgICAgIHN0YWdlcy5jbGVhbnVwKCk7XG4gICAgICB9XG5cbiAgICAgIGRlbGV0ZSBlbC5fX3hfdHJhbnNpdGlvbjtcbiAgICB9KTtcbiAgICBlbC5fX3hfdHJhbnNpdGlvbiA9IHtcbiAgICAgIC8vIFNldCB0cmFuc2l0aW9uIHR5cGUgc28gd2UgY2FuIGF2b2lkIGNsZWFyaW5nIHRyYW5zaXRpb24gaWYgdGhlIGRpcmVjdGlvbiBpcyB0aGUgc2FtZVxuICAgICAgdHlwZTogdHlwZSxcbiAgICAgIC8vIGNyZWF0ZSBhIGNhbGxiYWNrIGZvciB0aGUgbGFzdCBzdGFnZXMgb2YgdGhlIHRyYW5zaXRpb24gc28gd2UgY2FuIGNhbGwgaXRcbiAgICAgIC8vIGZyb20gZGlmZmVyZW50IHBvaW50IGFuZCBlYXJseSB0ZXJtaW5hdGUgaXQuIE9uY2Ugd2lsbCBlbnN1cmUgdGhhdCBmdW5jdGlvblxuICAgICAgLy8gaXMgb25seSBjYWxsZWQgb25lIHRpbWUuXG4gICAgICBjYW5jZWw6IG9uY2UoKCkgPT4ge1xuICAgICAgICByZWplY3QoVFJBTlNJVElPTl9DQU5DRUxMRUQpO1xuICAgICAgICBmaW5pc2goKTtcbiAgICAgIH0pLFxuICAgICAgZmluaXNoLFxuICAgICAgLy8gVGhpcyBzdG9yZSB0aGUgbmV4dCBhbmltYXRpb24gZnJhbWUgc28gd2UgY2FuIGNhbmNlbCBpdFxuICAgICAgbmV4dEZyYW1lOiBudWxsXG4gICAgfTtcbiAgICBzdGFnZXMuc3RhcnQoKTtcbiAgICBzdGFnZXMuZHVyaW5nKCk7XG4gICAgZWwuX194X3RyYW5zaXRpb24ubmV4dEZyYW1lID0gcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgIC8vIE5vdGU6IFNhZmFyaSdzIHRyYW5zaXRpb25EdXJhdGlvbiBwcm9wZXJ0eSB3aWxsIGxpc3Qgb3V0IGNvbW1hIHNlcGFyYXRlZCB0cmFuc2l0aW9uIGR1cmF0aW9uc1xuICAgICAgLy8gZm9yIGV2ZXJ5IHNpbmdsZSB0cmFuc2l0aW9uIHByb3BlcnR5LiBMZXQncyBncmFiIHRoZSBmaXJzdCBvbmUgYW5kIGNhbGwgaXQgYSBkYXkuXG4gICAgICBsZXQgZHVyYXRpb24gPSBOdW1iZXIoZ2V0Q29tcHV0ZWRTdHlsZShlbCkudHJhbnNpdGlvbkR1cmF0aW9uLnJlcGxhY2UoLywuKi8sICcnKS5yZXBsYWNlKCdzJywgJycpKSAqIDEwMDA7XG5cbiAgICAgIGlmIChkdXJhdGlvbiA9PT0gMCkge1xuICAgICAgICBkdXJhdGlvbiA9IE51bWJlcihnZXRDb21wdXRlZFN0eWxlKGVsKS5hbmltYXRpb25EdXJhdGlvbi5yZXBsYWNlKCdzJywgJycpKSAqIDEwMDA7XG4gICAgICB9XG5cbiAgICAgIHN0YWdlcy5zaG93KCk7XG4gICAgICBlbC5fX3hfdHJhbnNpdGlvbi5uZXh0RnJhbWUgPSByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoKCkgPT4ge1xuICAgICAgICBzdGFnZXMuZW5kKCk7XG4gICAgICAgIHNldFRpbWVvdXQoZWwuX194X3RyYW5zaXRpb24uZmluaXNoLCBkdXJhdGlvbik7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuICBmdW5jdGlvbiBpc051bWVyaWMoc3ViamVjdCkge1xuICAgIHJldHVybiAhQXJyYXkuaXNBcnJheShzdWJqZWN0KSAmJiAhaXNOYU4oc3ViamVjdCk7XG4gIH0gLy8gVGhhbmtzIEB2dWVqc1xuICAvLyBodHRwczovL2dpdGh1Yi5jb20vdnVlanMvdnVlL2Jsb2IvNGRlNDY0OWQ5NjM3MjYyYTliMDA3NzIwYjU5ZjgwYWM3MmE1NjIwYy9zcmMvc2hhcmVkL3V0aWwuanNcblxuICBmdW5jdGlvbiBvbmNlKGNhbGxiYWNrKSB7XG4gICAgbGV0IGNhbGxlZCA9IGZhbHNlO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICBpZiAoIWNhbGxlZCkge1xuICAgICAgICBjYWxsZWQgPSB0cnVlO1xuICAgICAgICBjYWxsYmFjay5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVGb3JEaXJlY3RpdmUoY29tcG9uZW50LCB0ZW1wbGF0ZUVsLCBleHByZXNzaW9uLCBpbml0aWFsVXBkYXRlLCBleHRyYVZhcnMpIHtcbiAgICB3YXJuSWZNYWxmb3JtZWRUZW1wbGF0ZSh0ZW1wbGF0ZUVsLCAneC1mb3InKTtcbiAgICBsZXQgaXRlcmF0b3JOYW1lcyA9IHR5cGVvZiBleHByZXNzaW9uID09PSAnZnVuY3Rpb24nID8gcGFyc2VGb3JFeHByZXNzaW9uKGNvbXBvbmVudC5ldmFsdWF0ZVJldHVybkV4cHJlc3Npb24odGVtcGxhdGVFbCwgZXhwcmVzc2lvbikpIDogcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pO1xuICAgIGxldCBpdGVtcyA9IGV2YWx1YXRlSXRlbXNBbmRSZXR1cm5FbXB0eUlmWElmSXNQcmVzZW50QW5kRmFsc2VPbkVsZW1lbnQoY29tcG9uZW50LCB0ZW1wbGF0ZUVsLCBpdGVyYXRvck5hbWVzLCBleHRyYVZhcnMpOyAvLyBBcyB3ZSB3YWxrIHRoZSBhcnJheSwgd2UnbGwgYWxzbyB3YWxrIHRoZSBET00gKHVwZGF0aW5nL2NyZWF0aW5nIGFzIHdlIGdvKS5cblxuICAgIGxldCBjdXJyZW50RWwgPSB0ZW1wbGF0ZUVsO1xuICAgIGl0ZW1zLmZvckVhY2goKGl0ZW0sIGluZGV4KSA9PiB7XG4gICAgICBsZXQgaXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMgPSBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCBpdGVtLCBpbmRleCwgaXRlbXMsIGV4dHJhVmFycygpKTtcbiAgICAgIGxldCBjdXJyZW50S2V5ID0gZ2VuZXJhdGVLZXlGb3JJdGVyYXRpb24oY29tcG9uZW50LCB0ZW1wbGF0ZUVsLCBpbmRleCwgaXRlcmF0aW9uU2NvcGVWYXJpYWJsZXMpO1xuICAgICAgbGV0IG5leHRFbCA9IGxvb2tBaGVhZEZvck1hdGNoaW5nS2V5ZWRFbGVtZW50QW5kTW92ZUl0SWZGb3VuZChjdXJyZW50RWwubmV4dEVsZW1lbnRTaWJsaW5nLCBjdXJyZW50S2V5KTsgLy8gSWYgd2UgaGF2ZW4ndCBmb3VuZCBhIG1hdGNoaW5nIGtleSwgaW5zZXJ0IHRoZSBlbGVtZW50IGF0IHRoZSBjdXJyZW50IHBvc2l0aW9uLlxuXG4gICAgICBpZiAoIW5leHRFbCkge1xuICAgICAgICBuZXh0RWwgPSBhZGRFbGVtZW50SW5Mb29wQWZ0ZXJDdXJyZW50RWwodGVtcGxhdGVFbCwgY3VycmVudEVsKTsgLy8gQW5kIHRyYW5zaXRpb24gaXQgaW4gaWYgaXQncyBub3QgdGhlIGZpcnN0IHBhZ2UgbG9hZC5cblxuICAgICAgICB0cmFuc2l0aW9uSW4obmV4dEVsLCAoKSA9PiB7fSwgKCkgPT4ge30sIGNvbXBvbmVudCwgaW5pdGlhbFVwZGF0ZSk7XG4gICAgICAgIG5leHRFbC5fX3hfZm9yID0gaXRlcmF0aW9uU2NvcGVWYXJpYWJsZXM7XG4gICAgICAgIGNvbXBvbmVudC5pbml0aWFsaXplRWxlbWVudHMobmV4dEVsLCAoKSA9PiBuZXh0RWwuX194X2Zvcik7IC8vIE90aGVyd2lzZSB1cGRhdGUgdGhlIGVsZW1lbnQgd2UgZm91bmQuXG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBUZW1wb3JhcmlseSByZW1vdmUgdGhlIGtleSBpbmRpY2F0b3IgdG8gYWxsb3cgdGhlIG5vcm1hbCBcInVwZGF0ZUVsZW1lbnRzXCIgdG8gd29yay5cbiAgICAgICAgZGVsZXRlIG5leHRFbC5fX3hfZm9yX2tleTtcbiAgICAgICAgbmV4dEVsLl9feF9mb3IgPSBpdGVyYXRpb25TY29wZVZhcmlhYmxlcztcbiAgICAgICAgY29tcG9uZW50LnVwZGF0ZUVsZW1lbnRzKG5leHRFbCwgKCkgPT4gbmV4dEVsLl9feF9mb3IpO1xuICAgICAgfVxuXG4gICAgICBjdXJyZW50RWwgPSBuZXh0RWw7XG4gICAgICBjdXJyZW50RWwuX194X2Zvcl9rZXkgPSBjdXJyZW50S2V5O1xuICAgIH0pO1xuICAgIHJlbW92ZUFueUxlZnRPdmVyRWxlbWVudHNGcm9tUHJldmlvdXNVcGRhdGUoY3VycmVudEVsLCBjb21wb25lbnQpO1xuICB9IC8vIFRoaXMgd2FzIHRha2VuIGZyb20gVnVlSlMgMi4qIGNvcmUuIFRoYW5rcyBWdWUhXG5cbiAgZnVuY3Rpb24gcGFyc2VGb3JFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcbiAgICBsZXQgZm9ySXRlcmF0b3JSRSA9IC8sKFteLFxcfVxcXV0qKSg/OiwoW14sXFx9XFxdXSopKT8kLztcbiAgICBsZXQgc3RyaXBQYXJlbnNSRSA9IC9eXFwofFxcKSQvZztcbiAgICBsZXQgZm9yQWxpYXNSRSA9IC8oW1xcc1xcU10qPylcXHMrKD86aW58b2YpXFxzKyhbXFxzXFxTXSopLztcbiAgICBsZXQgaW5NYXRjaCA9IGV4cHJlc3Npb24ubWF0Y2goZm9yQWxpYXNSRSk7XG4gICAgaWYgKCFpbk1hdGNoKSByZXR1cm47XG4gICAgbGV0IHJlcyA9IHt9O1xuICAgIHJlcy5pdGVtcyA9IGluTWF0Y2hbMl0udHJpbSgpO1xuICAgIGxldCBpdGVtID0gaW5NYXRjaFsxXS50cmltKCkucmVwbGFjZShzdHJpcFBhcmVuc1JFLCAnJyk7XG4gICAgbGV0IGl0ZXJhdG9yTWF0Y2ggPSBpdGVtLm1hdGNoKGZvckl0ZXJhdG9yUkUpO1xuXG4gICAgaWYgKGl0ZXJhdG9yTWF0Y2gpIHtcbiAgICAgIHJlcy5pdGVtID0gaXRlbS5yZXBsYWNlKGZvckl0ZXJhdG9yUkUsICcnKS50cmltKCk7XG4gICAgICByZXMuaW5kZXggPSBpdGVyYXRvck1hdGNoWzFdLnRyaW0oKTtcblxuICAgICAgaWYgKGl0ZXJhdG9yTWF0Y2hbMl0pIHtcbiAgICAgICAgcmVzLmNvbGxlY3Rpb24gPSBpdGVyYXRvck1hdGNoWzJdLnRyaW0oKTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgcmVzLml0ZW0gPSBpdGVtO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICBmdW5jdGlvbiBnZXRJdGVyYXRpb25TY29wZVZhcmlhYmxlcyhpdGVyYXRvck5hbWVzLCBpdGVtLCBpbmRleCwgaXRlbXMsIGV4dHJhVmFycykge1xuICAgIC8vIFdlIG11c3QgY3JlYXRlIGEgbmV3IG9iamVjdCwgc28gZWFjaCBpdGVyYXRpb24gaGFzIGEgbmV3IHNjb3BlXG4gICAgbGV0IHNjb3BlVmFyaWFibGVzID0gZXh0cmFWYXJzID8gX29iamVjdFNwcmVhZDIoe30sIGV4dHJhVmFycykgOiB7fTtcbiAgICBzY29wZVZhcmlhYmxlc1tpdGVyYXRvck5hbWVzLml0ZW1dID0gaXRlbTtcbiAgICBpZiAoaXRlcmF0b3JOYW1lcy5pbmRleCkgc2NvcGVWYXJpYWJsZXNbaXRlcmF0b3JOYW1lcy5pbmRleF0gPSBpbmRleDtcbiAgICBpZiAoaXRlcmF0b3JOYW1lcy5jb2xsZWN0aW9uKSBzY29wZVZhcmlhYmxlc1tpdGVyYXRvck5hbWVzLmNvbGxlY3Rpb25dID0gaXRlbXM7XG4gICAgcmV0dXJuIHNjb3BlVmFyaWFibGVzO1xuICB9XG5cbiAgZnVuY3Rpb24gZ2VuZXJhdGVLZXlGb3JJdGVyYXRpb24oY29tcG9uZW50LCBlbCwgaW5kZXgsIGl0ZXJhdGlvblNjb3BlVmFyaWFibGVzKSB7XG4gICAgbGV0IGJpbmRLZXlBdHRyaWJ1dGUgPSBnZXRYQXR0cnMoZWwsIGNvbXBvbmVudCwgJ2JpbmQnKS5maWx0ZXIoYXR0ciA9PiBhdHRyLnZhbHVlID09PSAna2V5JylbMF07IC8vIElmIHRoZSBkZXYgaGFzbid0IHNwZWNpZmllZCBhIGtleSwganVzdCByZXR1cm4gdGhlIGluZGV4IG9mIHRoZSBpdGVyYXRpb24uXG5cbiAgICBpZiAoIWJpbmRLZXlBdHRyaWJ1dGUpIHJldHVybiBpbmRleDtcbiAgICByZXR1cm4gY29tcG9uZW50LmV2YWx1YXRlUmV0dXJuRXhwcmVzc2lvbihlbCwgYmluZEtleUF0dHJpYnV0ZS5leHByZXNzaW9uLCAoKSA9PiBpdGVyYXRpb25TY29wZVZhcmlhYmxlcyk7XG4gIH1cblxuICBmdW5jdGlvbiBldmFsdWF0ZUl0ZW1zQW5kUmV0dXJuRW1wdHlJZlhJZklzUHJlc2VudEFuZEZhbHNlT25FbGVtZW50KGNvbXBvbmVudCwgZWwsIGl0ZXJhdG9yTmFtZXMsIGV4dHJhVmFycykge1xuICAgIGxldCBpZkF0dHJpYnV0ZSA9IGdldFhBdHRycyhlbCwgY29tcG9uZW50LCAnaWYnKVswXTtcblxuICAgIGlmIChpZkF0dHJpYnV0ZSAmJiAhY29tcG9uZW50LmV2YWx1YXRlUmV0dXJuRXhwcmVzc2lvbihlbCwgaWZBdHRyaWJ1dGUuZXhwcmVzc2lvbikpIHtcbiAgICAgIHJldHVybiBbXTtcbiAgICB9XG5cbiAgICBsZXQgaXRlbXMgPSBjb21wb25lbnQuZXZhbHVhdGVSZXR1cm5FeHByZXNzaW9uKGVsLCBpdGVyYXRvck5hbWVzLml0ZW1zLCBleHRyYVZhcnMpOyAvLyBUaGlzIGFkZHMgc3VwcG9ydCBmb3IgdGhlIGBpIGluIG5gIHN5bnRheC5cblxuICAgIGlmIChpc051bWVyaWMoaXRlbXMpICYmIGl0ZW1zID4gMCkge1xuICAgICAgaXRlbXMgPSBBcnJheS5mcm9tKEFycmF5KGl0ZW1zKS5rZXlzKCksIGkgPT4gaSArIDEpO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVtcztcbiAgfVxuXG4gIGZ1bmN0aW9uIGFkZEVsZW1lbnRJbkxvb3BBZnRlckN1cnJlbnRFbCh0ZW1wbGF0ZUVsLCBjdXJyZW50RWwpIHtcbiAgICBsZXQgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKHRlbXBsYXRlRWwuY29udGVudCwgdHJ1ZSk7XG4gICAgY3VycmVudEVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNsb25lLCBjdXJyZW50RWwubmV4dEVsZW1lbnRTaWJsaW5nKTtcbiAgICByZXR1cm4gY3VycmVudEVsLm5leHRFbGVtZW50U2libGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGxvb2tBaGVhZEZvck1hdGNoaW5nS2V5ZWRFbGVtZW50QW5kTW92ZUl0SWZGb3VuZChuZXh0RWwsIGN1cnJlbnRLZXkpIHtcbiAgICBpZiAoIW5leHRFbCkgcmV0dXJuOyAvLyBJZiB0aGUgdGhlIGtleSdzIERPIG1hdGNoLCBubyBuZWVkIHRvIGxvb2sgYWhlYWQuXG5cbiAgICBpZiAobmV4dEVsLl9feF9mb3Jfa2V5ID09PSBjdXJyZW50S2V5KSByZXR1cm4gbmV4dEVsOyAvLyBJZiB0aGV5IGRvbid0LCB3ZSdsbCBsb29rIGFoZWFkIGZvciBhIG1hdGNoLlxuICAgIC8vIElmIHdlIGZpbmQgaXQsIHdlJ2xsIG1vdmUgaXQgdG8gdGhlIGN1cnJlbnQgcG9zaXRpb24gaW4gdGhlIGxvb3AuXG5cbiAgICBsZXQgdG1wTmV4dEVsID0gbmV4dEVsO1xuXG4gICAgd2hpbGUgKHRtcE5leHRFbCkge1xuICAgICAgaWYgKHRtcE5leHRFbC5fX3hfZm9yX2tleSA9PT0gY3VycmVudEtleSkge1xuICAgICAgICByZXR1cm4gdG1wTmV4dEVsLnBhcmVudEVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRtcE5leHRFbCwgbmV4dEVsKTtcbiAgICAgIH1cblxuICAgICAgdG1wTmV4dEVsID0gdG1wTmV4dEVsLm5leHRFbGVtZW50U2libGluZyAmJiB0bXBOZXh0RWwubmV4dEVsZW1lbnRTaWJsaW5nLl9feF9mb3Jfa2V5ICE9PSB1bmRlZmluZWQgPyB0bXBOZXh0RWwubmV4dEVsZW1lbnRTaWJsaW5nIDogZmFsc2U7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVtb3ZlQW55TGVmdE92ZXJFbGVtZW50c0Zyb21QcmV2aW91c1VwZGF0ZShjdXJyZW50RWwsIGNvbXBvbmVudCkge1xuICAgIHZhciBuZXh0RWxlbWVudEZyb21PbGRMb29wID0gY3VycmVudEVsLm5leHRFbGVtZW50U2libGluZyAmJiBjdXJyZW50RWwubmV4dEVsZW1lbnRTaWJsaW5nLl9feF9mb3Jfa2V5ICE9PSB1bmRlZmluZWQgPyBjdXJyZW50RWwubmV4dEVsZW1lbnRTaWJsaW5nIDogZmFsc2U7XG5cbiAgICB3aGlsZSAobmV4dEVsZW1lbnRGcm9tT2xkTG9vcCkge1xuICAgICAgbGV0IG5leHRFbGVtZW50RnJvbU9sZExvb3BJbW11dGFibGUgPSBuZXh0RWxlbWVudEZyb21PbGRMb29wO1xuICAgICAgbGV0IG5leHRTaWJsaW5nID0gbmV4dEVsZW1lbnRGcm9tT2xkTG9vcC5uZXh0RWxlbWVudFNpYmxpbmc7XG4gICAgICB0cmFuc2l0aW9uT3V0KG5leHRFbGVtZW50RnJvbU9sZExvb3AsICgpID0+IHtcbiAgICAgICAgbmV4dEVsZW1lbnRGcm9tT2xkTG9vcEltbXV0YWJsZS5yZW1vdmUoKTtcbiAgICAgIH0sICgpID0+IHt9LCBjb21wb25lbnQpO1xuICAgICAgbmV4dEVsZW1lbnRGcm9tT2xkTG9vcCA9IG5leHRTaWJsaW5nICYmIG5leHRTaWJsaW5nLl9feF9mb3Jfa2V5ICE9PSB1bmRlZmluZWQgPyBuZXh0U2libGluZyA6IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUF0dHJpYnV0ZUJpbmRpbmdEaXJlY3RpdmUoY29tcG9uZW50LCBlbCwgYXR0ck5hbWUsIGV4cHJlc3Npb24sIGV4dHJhVmFycywgYXR0clR5cGUsIG1vZGlmaWVycykge1xuICAgIHZhciB2YWx1ZSA9IGNvbXBvbmVudC5ldmFsdWF0ZVJldHVybkV4cHJlc3Npb24oZWwsIGV4cHJlc3Npb24sIGV4dHJhVmFycyk7XG5cbiAgICBpZiAoYXR0ck5hbWUgPT09ICd2YWx1ZScpIHtcbiAgICAgIGlmIChBbHBpbmUuaWdub3JlRm9jdXNlZEZvclZhbHVlQmluZGluZyAmJiBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmlzU2FtZU5vZGUoZWwpKSByZXR1cm47IC8vIElmIG5lc3RlZCBtb2RlbCBrZXkgaXMgdW5kZWZpbmVkLCBzZXQgdGhlIGRlZmF1bHQgdmFsdWUgdG8gZW1wdHkgc3RyaW5nLlxuXG4gICAgICBpZiAodmFsdWUgPT09IHVuZGVmaW5lZCAmJiBleHByZXNzaW9uLm1hdGNoKC9cXC4vKSkge1xuICAgICAgICB2YWx1ZSA9ICcnO1xuICAgICAgfVxuXG4gICAgICBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgICAvLyBTZXQgcmFkaW8gdmFsdWUgZnJvbSB4LWJpbmQ6dmFsdWUsIGlmIG5vIFwidmFsdWVcIiBhdHRyaWJ1dGUgZXhpc3RzLlxuICAgICAgICAvLyBJZiB0aGVyZSBhcmUgYW55IGluaXRpYWwgc3RhdGUgdmFsdWVzLCByYWRpbyB3aWxsIGhhdmUgYSBjb3JyZWN0XG4gICAgICAgIC8vIFwiY2hlY2tlZFwiIHZhbHVlIHNpbmNlIHgtYmluZDp2YWx1ZSBpcyBwcm9jZXNzZWQgYmVmb3JlIHgtbW9kZWwuXG4gICAgICAgIGlmIChlbC5hdHRyaWJ1dGVzLnZhbHVlID09PSB1bmRlZmluZWQgJiYgYXR0clR5cGUgPT09ICdiaW5kJykge1xuICAgICAgICAgIGVsLnZhbHVlID0gdmFsdWU7XG4gICAgICAgIH0gZWxzZSBpZiAoYXR0clR5cGUgIT09ICdiaW5kJykge1xuICAgICAgICAgIGVsLmNoZWNrZWQgPSBjaGVja2VkQXR0ckxvb3NlQ29tcGFyZShlbC52YWx1ZSwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgLy8gSWYgd2UgYXJlIGV4cGxpY2l0bHkgYmluZGluZyBhIHN0cmluZyB0byB0aGUgOnZhbHVlLCBzZXQgdGhlIHN0cmluZyxcbiAgICAgICAgLy8gSWYgdGhlIHZhbHVlIGlzIGEgYm9vbGVhbiwgbGVhdmUgaXQgYWxvbmUsIGl0IHdpbGwgYmUgc2V0IHRvIFwib25cIlxuICAgICAgICAvLyBhdXRvbWF0aWNhbGx5LlxuICAgICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicgJiYgIVtudWxsLCB1bmRlZmluZWRdLmluY2x1ZGVzKHZhbHVlKSAmJiBhdHRyVHlwZSA9PT0gJ2JpbmQnKSB7XG4gICAgICAgICAgZWwudmFsdWUgPSBTdHJpbmcodmFsdWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGF0dHJUeXBlICE9PSAnYmluZCcpIHtcbiAgICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh2YWx1ZSkpIHtcbiAgICAgICAgICAgIC8vIEknbSBwdXJwb3NlbHkgbm90IHVzaW5nIEFycmF5LmluY2x1ZGVzIGhlcmUgYmVjYXVzZSBpdCdzXG4gICAgICAgICAgICAvLyBzdHJpY3QsIGFuZCBiZWNhdXNlIG9mIE51bWVyaWMvU3RyaW5nIG1pcy1jYXN0aW5nLCBJXG4gICAgICAgICAgICAvLyB3YW50IHRoZSBcImluY2x1ZGVzXCIgdG8gYmUgXCJmdXp6eVwiLlxuICAgICAgICAgICAgZWwuY2hlY2tlZCA9IHZhbHVlLnNvbWUodmFsID0+IGNoZWNrZWRBdHRyTG9vc2VDb21wYXJlKHZhbCwgZWwudmFsdWUpKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZWwuY2hlY2tlZCA9ICEhdmFsdWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2UgaWYgKGVsLnRhZ05hbWUgPT09ICdTRUxFQ1QnKSB7XG4gICAgICAgIHVwZGF0ZVNlbGVjdChlbCwgdmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaWYgKGVsLnZhbHVlID09PSB2YWx1ZSkgcmV0dXJuO1xuICAgICAgICBlbC52YWx1ZSA9IHZhbHVlO1xuICAgICAgfVxuICAgIH0gZWxzZSBpZiAoYXR0ck5hbWUgPT09ICdjbGFzcycpIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICBjb25zdCBvcmlnaW5hbENsYXNzZXMgPSBlbC5fX3hfb3JpZ2luYWxfY2xhc3NlcyB8fCBbXTtcbiAgICAgICAgZWwuc2V0QXR0cmlidXRlKCdjbGFzcycsIGFycmF5VW5pcXVlKG9yaWdpbmFsQ2xhc3Nlcy5jb25jYXQodmFsdWUpKS5qb2luKCcgJykpO1xuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XG4gICAgICAgIC8vIFNvcnRpbmcgdGhlIGtleXMgLyBjbGFzcyBuYW1lcyBieSB0aGVpciBib29sZWFuIHZhbHVlIHdpbGwgZW5zdXJlIHRoYXRcbiAgICAgICAgLy8gYW55dGhpbmcgdGhhdCBldmFsdWF0ZXMgdG8gYGZhbHNlYCBhbmQgbmVlZHMgdG8gcmVtb3ZlIGNsYXNzZXMgaXMgcnVuIGZpcnN0LlxuICAgICAgICBjb25zdCBrZXlzU29ydGVkQnlCb29sZWFuVmFsdWUgPSBPYmplY3Qua2V5cyh2YWx1ZSkuc29ydCgoYSwgYikgPT4gdmFsdWVbYV0gLSB2YWx1ZVtiXSk7XG4gICAgICAgIGtleXNTb3J0ZWRCeUJvb2xlYW5WYWx1ZS5mb3JFYWNoKGNsYXNzTmFtZXMgPT4ge1xuICAgICAgICAgIGlmICh2YWx1ZVtjbGFzc05hbWVzXSkge1xuICAgICAgICAgICAgY29udmVydENsYXNzU3RyaW5nVG9BcnJheShjbGFzc05hbWVzKS5mb3JFYWNoKGNsYXNzTmFtZSA9PiBlbC5jbGFzc0xpc3QuYWRkKGNsYXNzTmFtZSkpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb252ZXJ0Q2xhc3NTdHJpbmdUb0FycmF5KGNsYXNzTmFtZXMpLmZvckVhY2goY2xhc3NOYW1lID0+IGVsLmNsYXNzTGlzdC5yZW1vdmUoY2xhc3NOYW1lKSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IG9yaWdpbmFsQ2xhc3NlcyA9IGVsLl9feF9vcmlnaW5hbF9jbGFzc2VzIHx8IFtdO1xuICAgICAgICBjb25zdCBuZXdDbGFzc2VzID0gY29udmVydENsYXNzU3RyaW5nVG9BcnJheSh2YWx1ZSk7XG4gICAgICAgIGVsLnNldEF0dHJpYnV0ZSgnY2xhc3MnLCBhcnJheVVuaXF1ZShvcmlnaW5hbENsYXNzZXMuY29uY2F0KG5ld0NsYXNzZXMpKS5qb2luKCcgJykpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBhdHRyTmFtZSA9IG1vZGlmaWVycy5pbmNsdWRlcygnY2FtZWwnKSA/IGNhbWVsQ2FzZShhdHRyTmFtZSkgOiBhdHRyTmFtZTsgLy8gSWYgYW4gYXR0cmlidXRlJ3MgYm91bmQgdmFsdWUgaXMgbnVsbCwgdW5kZWZpbmVkIG9yIGZhbHNlLCByZW1vdmUgdGhlIGF0dHJpYnV0ZVxuXG4gICAgICBpZiAoW251bGwsIHVuZGVmaW5lZCwgZmFsc2VdLmluY2x1ZGVzKHZhbHVlKSkge1xuICAgICAgICBlbC5yZW1vdmVBdHRyaWJ1dGUoYXR0ck5hbWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaXNCb29sZWFuQXR0cihhdHRyTmFtZSkgPyBzZXRJZkNoYW5nZWQoZWwsIGF0dHJOYW1lLCBhdHRyTmFtZSkgOiBzZXRJZkNoYW5nZWQoZWwsIGF0dHJOYW1lLCB2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gc2V0SWZDaGFuZ2VkKGVsLCBhdHRyTmFtZSwgdmFsdWUpIHtcbiAgICBpZiAoZWwuZ2V0QXR0cmlidXRlKGF0dHJOYW1lKSAhPSB2YWx1ZSkge1xuICAgICAgZWwuc2V0QXR0cmlidXRlKGF0dHJOYW1lLCB2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gdXBkYXRlU2VsZWN0KGVsLCB2YWx1ZSkge1xuICAgIGNvbnN0IGFycmF5V3JhcHBlZFZhbHVlID0gW10uY29uY2F0KHZhbHVlKS5tYXAodmFsdWUgPT4ge1xuICAgICAgcmV0dXJuIHZhbHVlICsgJyc7XG4gICAgfSk7XG4gICAgQXJyYXkuZnJvbShlbC5vcHRpb25zKS5mb3JFYWNoKG9wdGlvbiA9PiB7XG4gICAgICBvcHRpb24uc2VsZWN0ZWQgPSBhcnJheVdyYXBwZWRWYWx1ZS5pbmNsdWRlcyhvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHQpO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaGFuZGxlVGV4dERpcmVjdGl2ZShlbCwgb3V0cHV0LCBleHByZXNzaW9uKSB7XG4gICAgLy8gSWYgbmVzdGVkIG1vZGVsIGtleSBpcyB1bmRlZmluZWQsIHNldCB0aGUgZGVmYXVsdCB2YWx1ZSB0byBlbXB0eSBzdHJpbmcuXG4gICAgaWYgKG91dHB1dCA9PT0gdW5kZWZpbmVkICYmIGV4cHJlc3Npb24ubWF0Y2goL1xcLi8pKSB7XG4gICAgICBvdXRwdXQgPSAnJztcbiAgICB9XG5cbiAgICBlbC50ZXh0Q29udGVudCA9IG91dHB1dDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUh0bWxEaXJlY3RpdmUoY29tcG9uZW50LCBlbCwgZXhwcmVzc2lvbiwgZXh0cmFWYXJzKSB7XG4gICAgZWwuaW5uZXJIVE1MID0gY29tcG9uZW50LmV2YWx1YXRlUmV0dXJuRXhwcmVzc2lvbihlbCwgZXhwcmVzc2lvbiwgZXh0cmFWYXJzKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZVNob3dEaXJlY3RpdmUoY29tcG9uZW50LCBlbCwgdmFsdWUsIG1vZGlmaWVycywgaW5pdGlhbFVwZGF0ZSA9IGZhbHNlKSB7XG4gICAgY29uc3QgaGlkZSA9ICgpID0+IHtcbiAgICAgIGVsLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICBlbC5fX3hfaXNfc2hvd24gPSBmYWxzZTtcbiAgICB9O1xuXG4gICAgY29uc3Qgc2hvdyA9ICgpID0+IHtcbiAgICAgIGlmIChlbC5zdHlsZS5sZW5ndGggPT09IDEgJiYgZWwuc3R5bGUuZGlzcGxheSA9PT0gJ25vbmUnKSB7XG4gICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsLnN0eWxlLnJlbW92ZVByb3BlcnR5KCdkaXNwbGF5Jyk7XG4gICAgICB9XG5cbiAgICAgIGVsLl9feF9pc19zaG93biA9IHRydWU7XG4gICAgfTtcblxuICAgIGlmIChpbml0aWFsVXBkYXRlID09PSB0cnVlKSB7XG4gICAgICBpZiAodmFsdWUpIHtcbiAgICAgICAgc2hvdygpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgaGlkZSgpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgY29uc3QgaGFuZGxlID0gKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuICAgICAgaWYgKHZhbHVlKSB7XG4gICAgICAgIGlmIChlbC5zdHlsZS5kaXNwbGF5ID09PSAnbm9uZScgfHwgZWwuX194X3RyYW5zaXRpb24pIHtcbiAgICAgICAgICB0cmFuc2l0aW9uSW4oZWwsICgpID0+IHtcbiAgICAgICAgICAgIHNob3coKTtcbiAgICAgICAgICB9LCByZWplY3QsIGNvbXBvbmVudCk7XG4gICAgICAgIH1cblxuICAgICAgICByZXNvbHZlKCgpID0+IHt9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChlbC5zdHlsZS5kaXNwbGF5ICE9PSAnbm9uZScpIHtcbiAgICAgICAgICB0cmFuc2l0aW9uT3V0KGVsLCAoKSA9PiB7XG4gICAgICAgICAgICByZXNvbHZlKCgpID0+IHtcbiAgICAgICAgICAgICAgaGlkZSgpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSwgcmVqZWN0LCBjb21wb25lbnQpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc29sdmUoKCkgPT4ge30pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfTsgLy8gVGhlIHdvcmtpbmcgb2YgeC1zaG93IGlzIGEgYml0IGNvbXBsZXggYmVjYXVzZSB3ZSBuZWVkIHRvXG4gICAgLy8gd2FpdCBmb3IgYW55IGNoaWxkIHRyYW5zaXRpb25zIHRvIGZpbmlzaCBiZWZvcmUgaGlkaW5nXG4gICAgLy8gc29tZSBlbGVtZW50LiBBbHNvLCB0aGlzIGhhcyB0byBiZSBkb25lIHJlY3Vyc2l2ZWx5LlxuICAgIC8vIElmIHgtc2hvdy5pbW1lZGlhdGUsIGZvcmVnb2UgdGhlIHdhaXRpbmcuXG5cblxuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoJ2ltbWVkaWF0ZScpKSB7XG4gICAgICBoYW5kbGUoZmluaXNoID0+IGZpbmlzaCgpLCAoKSA9PiB7fSk7XG4gICAgICByZXR1cm47XG4gICAgfSAvLyB4LXNob3cgaXMgZW5jb3VudGVyZWQgZHVyaW5nIGEgRE9NIHRyZWUgd2Fsay4gSWYgYW4gZWxlbWVudFxuICAgIC8vIHdlIGVuY291bnRlciBpcyBOT1QgYSBjaGlsZCBvZiBhbm90aGVyIHgtc2hvdyBlbGVtZW50IHdlXG4gICAgLy8gY2FuIGV4ZWN1dGUgdGhlIHByZXZpb3VzIHgtc2hvdyBzdGFjayAoaWYgb25lIGV4aXN0cykuXG5cblxuICAgIGlmIChjb21wb25lbnQuc2hvd0RpcmVjdGl2ZUxhc3RFbGVtZW50ICYmICFjb21wb25lbnQuc2hvd0RpcmVjdGl2ZUxhc3RFbGVtZW50LmNvbnRhaW5zKGVsKSkge1xuICAgICAgY29tcG9uZW50LmV4ZWN1dGVBbmRDbGVhclJlbWFpbmluZ1Nob3dEaXJlY3RpdmVTdGFjaygpO1xuICAgIH1cblxuICAgIGNvbXBvbmVudC5zaG93RGlyZWN0aXZlU3RhY2sucHVzaChoYW5kbGUpO1xuICAgIGNvbXBvbmVudC5zaG93RGlyZWN0aXZlTGFzdEVsZW1lbnQgPSBlbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGhhbmRsZUlmRGlyZWN0aXZlKGNvbXBvbmVudCwgZWwsIGV4cHJlc3Npb25SZXN1bHQsIGluaXRpYWxVcGRhdGUsIGV4dHJhVmFycykge1xuICAgIHdhcm5JZk1hbGZvcm1lZFRlbXBsYXRlKGVsLCAneC1pZicpO1xuICAgIGNvbnN0IGVsZW1lbnRIYXNBbHJlYWR5QmVlbkFkZGVkID0gZWwubmV4dEVsZW1lbnRTaWJsaW5nICYmIGVsLm5leHRFbGVtZW50U2libGluZy5fX3hfaW5zZXJ0ZWRfbWUgPT09IHRydWU7XG5cbiAgICBpZiAoZXhwcmVzc2lvblJlc3VsdCAmJiAoIWVsZW1lbnRIYXNBbHJlYWR5QmVlbkFkZGVkIHx8IGVsLl9feF90cmFuc2l0aW9uKSkge1xuICAgICAgY29uc3QgY2xvbmUgPSBkb2N1bWVudC5pbXBvcnROb2RlKGVsLmNvbnRlbnQsIHRydWUpO1xuICAgICAgZWwucGFyZW50RWxlbWVudC5pbnNlcnRCZWZvcmUoY2xvbmUsIGVsLm5leHRFbGVtZW50U2libGluZyk7XG4gICAgICB0cmFuc2l0aW9uSW4oZWwubmV4dEVsZW1lbnRTaWJsaW5nLCAoKSA9PiB7fSwgKCkgPT4ge30sIGNvbXBvbmVudCwgaW5pdGlhbFVwZGF0ZSk7XG4gICAgICBjb21wb25lbnQuaW5pdGlhbGl6ZUVsZW1lbnRzKGVsLm5leHRFbGVtZW50U2libGluZywgZXh0cmFWYXJzKTtcbiAgICAgIGVsLm5leHRFbGVtZW50U2libGluZy5fX3hfaW5zZXJ0ZWRfbWUgPSB0cnVlO1xuICAgIH0gZWxzZSBpZiAoIWV4cHJlc3Npb25SZXN1bHQgJiYgZWxlbWVudEhhc0FscmVhZHlCZWVuQWRkZWQpIHtcbiAgICAgIHRyYW5zaXRpb25PdXQoZWwubmV4dEVsZW1lbnRTaWJsaW5nLCAoKSA9PiB7XG4gICAgICAgIGVsLm5leHRFbGVtZW50U2libGluZy5yZW1vdmUoKTtcbiAgICAgIH0sICgpID0+IHt9LCBjb21wb25lbnQsIGluaXRpYWxVcGRhdGUpO1xuICAgIH1cbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyTGlzdGVuZXIoY29tcG9uZW50LCBlbCwgZXZlbnQsIG1vZGlmaWVycywgZXhwcmVzc2lvbiwgZXh0cmFWYXJzID0ge30pIHtcbiAgICBjb25zdCBvcHRpb25zID0ge1xuICAgICAgcGFzc2l2ZTogbW9kaWZpZXJzLmluY2x1ZGVzKCdwYXNzaXZlJylcbiAgICB9O1xuXG4gICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcygnY2FtZWwnKSkge1xuICAgICAgZXZlbnQgPSBjYW1lbENhc2UoZXZlbnQpO1xuICAgIH1cblxuICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoJ2F3YXknKSkge1xuICAgICAgbGV0IGhhbmRsZXIgPSBlID0+IHtcbiAgICAgICAgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgdGhlIGNsaWNrIGNhbWUgZnJvbSB0aGUgZWxlbWVudCBvciB3aXRoaW4gaXQuXG4gICAgICAgIGlmIChlbC5jb250YWlucyhlLnRhcmdldCkpIHJldHVybjsgLy8gRG9uJ3QgZG8gYW55dGhpbmcgaWYgdGhpcyBlbGVtZW50IGlzbid0IGN1cnJlbnRseSB2aXNpYmxlLlxuXG4gICAgICAgIGlmIChlbC5vZmZzZXRXaWR0aCA8IDEgJiYgZWwub2Zmc2V0SGVpZ2h0IDwgMSkgcmV0dXJuOyAvLyBOb3cgdGhhdCB3ZSBhcmUgc3VyZSB0aGUgZWxlbWVudCBpcyB2aXNpYmxlLCBBTkQgdGhlIGNsaWNrXG4gICAgICAgIC8vIGlzIGZyb20gb3V0c2lkZSBpdCwgbGV0J3MgcnVuIHRoZSBleHByZXNzaW9uLlxuXG4gICAgICAgIHJ1bkxpc3RlbmVySGFuZGxlcihjb21wb25lbnQsIGV4cHJlc3Npb24sIGUsIGV4dHJhVmFycyk7XG5cbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcygnb25jZScpKSB7XG4gICAgICAgICAgZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgIH07IC8vIExpc3RlbiBmb3IgdGhpcyBldmVudCBhdCB0aGUgcm9vdCBsZXZlbC5cblxuXG4gICAgICBkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBoYW5kbGVyLCBvcHRpb25zKTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IGxpc3RlbmVyVGFyZ2V0ID0gbW9kaWZpZXJzLmluY2x1ZGVzKCd3aW5kb3cnKSA/IHdpbmRvdyA6IG1vZGlmaWVycy5pbmNsdWRlcygnZG9jdW1lbnQnKSA/IGRvY3VtZW50IDogZWw7XG5cbiAgICAgIGxldCBoYW5kbGVyID0gZSA9PiB7XG4gICAgICAgIC8vIFJlbW92ZSB0aGlzIGdsb2JhbCBldmVudCBoYW5kbGVyIGlmIHRoZSBlbGVtZW50IHRoYXQgZGVjbGFyZWQgaXRcbiAgICAgICAgLy8gaGFzIGJlZW4gcmVtb3ZlZC4gSXQncyBub3cgc3RhbGUuXG4gICAgICAgIGlmIChsaXN0ZW5lclRhcmdldCA9PT0gd2luZG93IHx8IGxpc3RlbmVyVGFyZ2V0ID09PSBkb2N1bWVudCkge1xuICAgICAgICAgIGlmICghZG9jdW1lbnQuYm9keS5jb250YWlucyhlbCkpIHtcbiAgICAgICAgICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChpc0tleUV2ZW50KGV2ZW50KSkge1xuICAgICAgICAgIGlmIChpc0xpc3RlbmluZ0ZvckFTcGVjaWZpY0tleVRoYXRIYXNudEJlZW5QcmVzc2VkKGUsIG1vZGlmaWVycykpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAobW9kaWZpZXJzLmluY2x1ZGVzKCdwcmV2ZW50JykpIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgaWYgKG1vZGlmaWVycy5pbmNsdWRlcygnc3RvcCcpKSBlLnN0b3BQcm9wYWdhdGlvbigpOyAvLyBJZiB0aGUgLnNlbGYgbW9kaWZpZXIgaXNuJ3QgcHJlc2VudCwgb3IgaWYgaXQgaXMgcHJlc2VudCBhbmRcbiAgICAgICAgLy8gdGhlIHRhcmdldCBlbGVtZW50IG1hdGNoZXMgdGhlIGVsZW1lbnQgd2UgYXJlIHJlZ2lzdGVyaW5nIHRoZVxuICAgICAgICAvLyBldmVudCBvbiwgcnVuIHRoZSBoYW5kbGVyXG5cbiAgICAgICAgaWYgKCFtb2RpZmllcnMuaW5jbHVkZXMoJ3NlbGYnKSB8fCBlLnRhcmdldCA9PT0gZWwpIHtcbiAgICAgICAgICBjb25zdCByZXR1cm5WYWx1ZSA9IHJ1bkxpc3RlbmVySGFuZGxlcihjb21wb25lbnQsIGV4cHJlc3Npb24sIGUsIGV4dHJhVmFycyk7XG4gICAgICAgICAgcmV0dXJuVmFsdWUudGhlbih2YWx1ZSA9PiB7XG4gICAgICAgICAgICBpZiAodmFsdWUgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoJ29uY2UnKSkge1xuICAgICAgICAgICAgICAgIGxpc3RlbmVyVGFyZ2V0LnJlbW92ZUV2ZW50TGlzdGVuZXIoZXZlbnQsIGhhbmRsZXIsIG9wdGlvbnMpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIGlmIChtb2RpZmllcnMuaW5jbHVkZXMoJ2RlYm91bmNlJykpIHtcbiAgICAgICAgbGV0IG5leHRNb2RpZmllciA9IG1vZGlmaWVyc1ttb2RpZmllcnMuaW5kZXhPZignZGVib3VuY2UnKSArIDFdIHx8ICdpbnZhbGlkLXdhaXQnO1xuICAgICAgICBsZXQgd2FpdCA9IGlzTnVtZXJpYyhuZXh0TW9kaWZpZXIuc3BsaXQoJ21zJylbMF0pID8gTnVtYmVyKG5leHRNb2RpZmllci5zcGxpdCgnbXMnKVswXSkgOiAyNTA7XG4gICAgICAgIGhhbmRsZXIgPSBkZWJvdW5jZShoYW5kbGVyLCB3YWl0KTtcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgaGFuZGxlciwgb3B0aW9ucyk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcnVuTGlzdGVuZXJIYW5kbGVyKGNvbXBvbmVudCwgZXhwcmVzc2lvbiwgZSwgZXh0cmFWYXJzKSB7XG4gICAgcmV0dXJuIGNvbXBvbmVudC5ldmFsdWF0ZUNvbW1hbmRFeHByZXNzaW9uKGUudGFyZ2V0LCBleHByZXNzaW9uLCAoKSA9PiB7XG4gICAgICByZXR1cm4gX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIGV4dHJhVmFycygpKSwge30sIHtcbiAgICAgICAgJyRldmVudCc6IGVcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgZnVuY3Rpb24gaXNLZXlFdmVudChldmVudCkge1xuICAgIHJldHVybiBbJ2tleWRvd24nLCAna2V5dXAnXS5pbmNsdWRlcyhldmVudCk7XG4gIH1cblxuICBmdW5jdGlvbiBpc0xpc3RlbmluZ0ZvckFTcGVjaWZpY0tleVRoYXRIYXNudEJlZW5QcmVzc2VkKGUsIG1vZGlmaWVycykge1xuICAgIGxldCBrZXlNb2RpZmllcnMgPSBtb2RpZmllcnMuZmlsdGVyKGkgPT4ge1xuICAgICAgcmV0dXJuICFbJ3dpbmRvdycsICdkb2N1bWVudCcsICdwcmV2ZW50JywgJ3N0b3AnXS5pbmNsdWRlcyhpKTtcbiAgICB9KTtcblxuICAgIGlmIChrZXlNb2RpZmllcnMuaW5jbHVkZXMoJ2RlYm91bmNlJykpIHtcbiAgICAgIGxldCBkZWJvdW5jZUluZGV4ID0ga2V5TW9kaWZpZXJzLmluZGV4T2YoJ2RlYm91bmNlJyk7XG4gICAgICBrZXlNb2RpZmllcnMuc3BsaWNlKGRlYm91bmNlSW5kZXgsIGlzTnVtZXJpYygoa2V5TW9kaWZpZXJzW2RlYm91bmNlSW5kZXggKyAxXSB8fCAnaW52YWxpZC13YWl0Jykuc3BsaXQoJ21zJylbMF0pID8gMiA6IDEpO1xuICAgIH0gLy8gSWYgbm8gbW9kaWZpZXIgaXMgc3BlY2lmaWVkLCB3ZSdsbCBjYWxsIGl0IGEgcHJlc3MuXG5cblxuICAgIGlmIChrZXlNb2RpZmllcnMubGVuZ3RoID09PSAwKSByZXR1cm4gZmFsc2U7IC8vIElmIG9uZSBpcyBwYXNzZWQsIEFORCBpdCBtYXRjaGVzIHRoZSBrZXkgcHJlc3NlZCwgd2UnbGwgY2FsbCBpdCBhIHByZXNzLlxuXG4gICAgaWYgKGtleU1vZGlmaWVycy5sZW5ndGggPT09IDEgJiYga2V5TW9kaWZpZXJzWzBdID09PSBrZXlUb01vZGlmaWVyKGUua2V5KSkgcmV0dXJuIGZhbHNlOyAvLyBUaGUgdXNlciBpcyBsaXN0ZW5pbmcgZm9yIGtleSBjb21iaW5hdGlvbnMuXG5cbiAgICBjb25zdCBzeXN0ZW1LZXlNb2RpZmllcnMgPSBbJ2N0cmwnLCAnc2hpZnQnLCAnYWx0JywgJ21ldGEnLCAnY21kJywgJ3N1cGVyJ107XG4gICAgY29uc3Qgc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMgPSBzeXN0ZW1LZXlNb2RpZmllcnMuZmlsdGVyKG1vZGlmaWVyID0+IGtleU1vZGlmaWVycy5pbmNsdWRlcyhtb2RpZmllcikpO1xuICAgIGtleU1vZGlmaWVycyA9IGtleU1vZGlmaWVycy5maWx0ZXIoaSA9PiAhc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMuaW5jbHVkZXMoaSkpO1xuXG4gICAgaWYgKHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmxlbmd0aCA+IDApIHtcbiAgICAgIGNvbnN0IGFjdGl2ZWx5UHJlc3NlZEtleU1vZGlmaWVycyA9IHNlbGVjdGVkU3lzdGVtS2V5TW9kaWZpZXJzLmZpbHRlcihtb2RpZmllciA9PiB7XG4gICAgICAgIC8vIEFsaWFzIFwiY21kXCIgYW5kIFwic3VwZXJcIiB0byBcIm1ldGFcIlxuICAgICAgICBpZiAobW9kaWZpZXIgPT09ICdjbWQnIHx8IG1vZGlmaWVyID09PSAnc3VwZXInKSBtb2RpZmllciA9ICdtZXRhJztcbiAgICAgICAgcmV0dXJuIGVbYCR7bW9kaWZpZXJ9S2V5YF07XG4gICAgICB9KTsgLy8gSWYgYWxsIHRoZSBtb2RpZmllcnMgc2VsZWN0ZWQgYXJlIHByZXNzZWQsIC4uLlxuXG4gICAgICBpZiAoYWN0aXZlbHlQcmVzc2VkS2V5TW9kaWZpZXJzLmxlbmd0aCA9PT0gc2VsZWN0ZWRTeXN0ZW1LZXlNb2RpZmllcnMubGVuZ3RoKSB7XG4gICAgICAgIC8vIEFORCB0aGUgcmVtYWluaW5nIGtleSBpcyBwcmVzc2VkIGFzIHdlbGwuIEl0J3MgYSBwcmVzcy5cbiAgICAgICAgaWYgKGtleU1vZGlmaWVyc1swXSA9PT0ga2V5VG9Nb2RpZmllcihlLmtleSkpIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICB9IC8vIFdlJ2xsIGNhbGwgaXQgTk9UIGEgdmFsaWQga2V5cHJlc3MuXG5cblxuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgZnVuY3Rpb24ga2V5VG9Nb2RpZmllcihrZXkpIHtcbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSAnLyc6XG4gICAgICAgIHJldHVybiAnc2xhc2gnO1xuXG4gICAgICBjYXNlICcgJzpcbiAgICAgIGNhc2UgJ1NwYWNlYmFyJzpcbiAgICAgICAgcmV0dXJuICdzcGFjZSc7XG5cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHJldHVybiBrZXkgJiYga2ViYWJDYXNlKGtleSk7XG4gICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJNb2RlbExpc3RlbmVyKGNvbXBvbmVudCwgZWwsIG1vZGlmaWVycywgZXhwcmVzc2lvbiwgZXh0cmFWYXJzKSB7XG4gICAgLy8gSWYgdGhlIGVsZW1lbnQgd2UgYXJlIGJpbmRpbmcgdG8gaXMgYSBzZWxlY3QsIGEgcmFkaW8sIG9yIGNoZWNrYm94XG4gICAgLy8gd2UnbGwgbGlzdGVuIGZvciB0aGUgY2hhbmdlIGV2ZW50IGluc3RlYWQgb2YgdGhlIFwiaW5wdXRcIiBldmVudC5cbiAgICB2YXIgZXZlbnQgPSBlbC50YWdOYW1lLnRvTG93ZXJDYXNlKCkgPT09ICdzZWxlY3QnIHx8IFsnY2hlY2tib3gnLCAncmFkaW8nXS5pbmNsdWRlcyhlbC50eXBlKSB8fCBtb2RpZmllcnMuaW5jbHVkZXMoJ2xhenknKSA/ICdjaGFuZ2UnIDogJ2lucHV0JztcbiAgICBjb25zdCBsaXN0ZW5lckV4cHJlc3Npb24gPSBgJHtleHByZXNzaW9ufSA9IHJpZ2h0U2lkZU9mRXhwcmVzc2lvbigkZXZlbnQsICR7ZXhwcmVzc2lvbn0pYDtcbiAgICByZWdpc3Rlckxpc3RlbmVyKGNvbXBvbmVudCwgZWwsIGV2ZW50LCBtb2RpZmllcnMsIGxpc3RlbmVyRXhwcmVzc2lvbiwgKCkgPT4ge1xuICAgICAgcmV0dXJuIF9vYmplY3RTcHJlYWQyKF9vYmplY3RTcHJlYWQyKHt9LCBleHRyYVZhcnMoKSksIHt9LCB7XG4gICAgICAgIHJpZ2h0U2lkZU9mRXhwcmVzc2lvbjogZ2VuZXJhdGVNb2RlbEFzc2lnbm1lbnRGdW5jdGlvbihlbCwgbW9kaWZpZXJzLCBleHByZXNzaW9uKVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBmdW5jdGlvbiBnZW5lcmF0ZU1vZGVsQXNzaWdubWVudEZ1bmN0aW9uKGVsLCBtb2RpZmllcnMsIGV4cHJlc3Npb24pIHtcbiAgICBpZiAoZWwudHlwZSA9PT0gJ3JhZGlvJykge1xuICAgICAgLy8gUmFkaW8gYnV0dG9ucyBvbmx5IHdvcmsgcHJvcGVybHkgd2hlbiB0aGV5IHNoYXJlIGEgbmFtZSBhdHRyaWJ1dGUuXG4gICAgICAvLyBQZW9wbGUgbWlnaHQgYXNzdW1lIHdlIHRha2UgY2FyZSBvZiB0aGF0IGZvciB0aGVtLCBiZWNhdXNlXG4gICAgICAvLyB0aGV5IGFscmVhZHkgc2V0IGEgc2hhcmVkIFwieC1tb2RlbFwiIGF0dHJpYnV0ZS5cbiAgICAgIGlmICghZWwuaGFzQXR0cmlidXRlKCduYW1lJykpIGVsLnNldEF0dHJpYnV0ZSgnbmFtZScsIGV4cHJlc3Npb24pO1xuICAgIH1cblxuICAgIHJldHVybiAoZXZlbnQsIGN1cnJlbnRWYWx1ZSkgPT4ge1xuICAgICAgLy8gQ2hlY2sgZm9yIGV2ZW50LmRldGFpbCBkdWUgdG8gYW4gaXNzdWUgd2hlcmUgSUUxMSBoYW5kbGVzIG90aGVyIGV2ZW50cyBhcyBhIEN1c3RvbUV2ZW50LlxuICAgICAgaWYgKGV2ZW50IGluc3RhbmNlb2YgQ3VzdG9tRXZlbnQgJiYgZXZlbnQuZGV0YWlsKSB7XG4gICAgICAgIHJldHVybiBldmVudC5kZXRhaWw7XG4gICAgICB9IGVsc2UgaWYgKGVsLnR5cGUgPT09ICdjaGVja2JveCcpIHtcbiAgICAgICAgLy8gSWYgdGhlIGRhdGEgd2UgYXJlIGJpbmRpbmcgdG8gaXMgYW4gYXJyYXksIHRvZ2dsZSBpdHMgdmFsdWUgaW5zaWRlIHRoZSBhcnJheS5cbiAgICAgICAgaWYgKEFycmF5LmlzQXJyYXkoY3VycmVudFZhbHVlKSkge1xuICAgICAgICAgIGNvbnN0IG5ld1ZhbHVlID0gbW9kaWZpZXJzLmluY2x1ZGVzKCdudW1iZXInKSA/IHNhZmVQYXJzZU51bWJlcihldmVudC50YXJnZXQudmFsdWUpIDogZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICAgIHJldHVybiBldmVudC50YXJnZXQuY2hlY2tlZCA/IGN1cnJlbnRWYWx1ZS5jb25jYXQoW25ld1ZhbHVlXSkgOiBjdXJyZW50VmFsdWUuZmlsdGVyKGVsID0+ICFjaGVja2VkQXR0ckxvb3NlQ29tcGFyZShlbCwgbmV3VmFsdWUpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZXZlbnQudGFyZ2V0LmNoZWNrZWQ7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoZWwudGFnTmFtZS50b0xvd2VyQ2FzZSgpID09PSAnc2VsZWN0JyAmJiBlbC5tdWx0aXBsZSkge1xuICAgICAgICByZXR1cm4gbW9kaWZpZXJzLmluY2x1ZGVzKCdudW1iZXInKSA/IEFycmF5LmZyb20oZXZlbnQudGFyZ2V0LnNlbGVjdGVkT3B0aW9ucykubWFwKG9wdGlvbiA9PiB7XG4gICAgICAgICAgY29uc3QgcmF3VmFsdWUgPSBvcHRpb24udmFsdWUgfHwgb3B0aW9uLnRleHQ7XG4gICAgICAgICAgcmV0dXJuIHNhZmVQYXJzZU51bWJlcihyYXdWYWx1ZSk7XG4gICAgICAgIH0pIDogQXJyYXkuZnJvbShldmVudC50YXJnZXQuc2VsZWN0ZWRPcHRpb25zKS5tYXAob3B0aW9uID0+IHtcbiAgICAgICAgICByZXR1cm4gb3B0aW9uLnZhbHVlIHx8IG9wdGlvbi50ZXh0O1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHJhd1ZhbHVlID0gZXZlbnQudGFyZ2V0LnZhbHVlO1xuICAgICAgICByZXR1cm4gbW9kaWZpZXJzLmluY2x1ZGVzKCdudW1iZXInKSA/IHNhZmVQYXJzZU51bWJlcihyYXdWYWx1ZSkgOiBtb2RpZmllcnMuaW5jbHVkZXMoJ3RyaW0nKSA/IHJhd1ZhbHVlLnRyaW0oKSA6IHJhd1ZhbHVlO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICBmdW5jdGlvbiBzYWZlUGFyc2VOdW1iZXIocmF3VmFsdWUpIHtcbiAgICBjb25zdCBudW1iZXIgPSByYXdWYWx1ZSA/IHBhcnNlRmxvYXQocmF3VmFsdWUpIDogbnVsbDtcbiAgICByZXR1cm4gaXNOdW1lcmljKG51bWJlcikgPyBudW1iZXIgOiByYXdWYWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb3B5cmlnaHQgKEMpIDIwMTcgc2FsZXNmb3JjZS5jb20sIGluYy5cbiAgICovXG4gIGNvbnN0IHsgaXNBcnJheSB9ID0gQXJyYXk7XG4gIGNvbnN0IHsgZ2V0UHJvdG90eXBlT2YsIGNyZWF0ZTogT2JqZWN0Q3JlYXRlLCBkZWZpbmVQcm9wZXJ0eTogT2JqZWN0RGVmaW5lUHJvcGVydHksIGRlZmluZVByb3BlcnRpZXM6IE9iamVjdERlZmluZVByb3BlcnRpZXMsIGlzRXh0ZW5zaWJsZSwgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLCBnZXRPd25Qcm9wZXJ0eU5hbWVzLCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMsIHByZXZlbnRFeHRlbnNpb25zLCBoYXNPd25Qcm9wZXJ0eSwgfSA9IE9iamVjdDtcbiAgY29uc3QgeyBwdXNoOiBBcnJheVB1c2gsIGNvbmNhdDogQXJyYXlDb25jYXQsIG1hcDogQXJyYXlNYXAsIH0gPSBBcnJheS5wcm90b3R5cGU7XG4gIGZ1bmN0aW9uIGlzVW5kZWZpbmVkKG9iaikge1xuICAgICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkO1xuICB9XG4gIGZ1bmN0aW9uIGlzRnVuY3Rpb24ob2JqKSB7XG4gICAgICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gJ2Z1bmN0aW9uJztcbiAgfVxuICBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICAgIHJldHVybiB0eXBlb2Ygb2JqID09PSAnb2JqZWN0JztcbiAgfVxuICBjb25zdCBwcm94eVRvVmFsdWVNYXAgPSBuZXcgV2Vha01hcCgpO1xuICBmdW5jdGlvbiByZWdpc3RlclByb3h5KHByb3h5LCB2YWx1ZSkge1xuICAgICAgcHJveHlUb1ZhbHVlTWFwLnNldChwcm94eSwgdmFsdWUpO1xuICB9XG4gIGNvbnN0IHVud3JhcCA9IChyZXBsaWNhT3JBbnkpID0+IHByb3h5VG9WYWx1ZU1hcC5nZXQocmVwbGljYU9yQW55KSB8fCByZXBsaWNhT3JBbnk7XG5cbiAgZnVuY3Rpb24gd3JhcFZhbHVlKG1lbWJyYW5lLCB2YWx1ZSkge1xuICAgICAgcmV0dXJuIG1lbWJyYW5lLnZhbHVlSXNPYnNlcnZhYmxlKHZhbHVlKSA/IG1lbWJyYW5lLmdldFByb3h5KHZhbHVlKSA6IHZhbHVlO1xuICB9XG4gIC8qKlxuICAgKiBVbndyYXAgcHJvcGVydHkgZGVzY3JpcHRvcnMgd2lsbCBzZXQgdmFsdWUgb24gb3JpZ2luYWwgZGVzY3JpcHRvclxuICAgKiBXZSBvbmx5IG5lZWQgdG8gdW53cmFwIGlmIHZhbHVlIGlzIHNwZWNpZmllZFxuICAgKiBAcGFyYW0gZGVzY3JpcHRvciBleHRlcm5hbCBkZXNjcnBpdG9yIHByb3ZpZGVkIHRvIGRlZmluZSBuZXcgcHJvcGVydHkgb24gb3JpZ2luYWwgdmFsdWVcbiAgICovXG4gIGZ1bmN0aW9uIHVud3JhcERlc2NyaXB0b3IoZGVzY3JpcHRvcikge1xuICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoZGVzY3JpcHRvciwgJ3ZhbHVlJykpIHtcbiAgICAgICAgICBkZXNjcmlwdG9yLnZhbHVlID0gdW53cmFwKGRlc2NyaXB0b3IudmFsdWUpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGRlc2NyaXB0b3I7XG4gIH1cbiAgZnVuY3Rpb24gbG9ja1NoYWRvd1RhcmdldChtZW1icmFuZSwgc2hhZG93VGFyZ2V0LCBvcmlnaW5hbFRhcmdldCkge1xuICAgICAgY29uc3QgdGFyZ2V0S2V5cyA9IEFycmF5Q29uY2F0LmNhbGwoZ2V0T3duUHJvcGVydHlOYW1lcyhvcmlnaW5hbFRhcmdldCksIGdldE93blByb3BlcnR5U3ltYm9scyhvcmlnaW5hbFRhcmdldCkpO1xuICAgICAgdGFyZ2V0S2V5cy5mb3JFYWNoKChrZXkpID0+IHtcbiAgICAgICAgICBsZXQgZGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvcmlnaW5hbFRhcmdldCwga2V5KTtcbiAgICAgICAgICAvLyBXZSBkbyBub3QgbmVlZCB0byB3cmFwIHRoZSBkZXNjcmlwdG9yIGlmIGNvbmZpZ3VyYWJsZVxuICAgICAgICAgIC8vIEJlY2F1c2Ugd2UgY2FuIGRlYWwgd2l0aCB3cmFwcGluZyBpdCB3aGVuIHVzZXIgZ29lcyB0aHJvdWdoXG4gICAgICAgICAgLy8gR2V0IG93biBwcm9wZXJ0eSBkZXNjcmlwdG9yLiBUaGVyZSBpcyBhbHNvIGEgY2hhbmNlIHRoYXQgdGhpcyBkZXNjcmlwdG9yXG4gICAgICAgICAgLy8gY291bGQgY2hhbmdlIHNvbWV0aW1lIGluIHRoZSBmdXR1cmUsIHNvIHdlIGNhbiBkZWZlciB3cmFwcGluZ1xuICAgICAgICAgIC8vIHVudGlsIHdlIG5lZWQgdG9cbiAgICAgICAgICBpZiAoIWRlc2NyaXB0b3IuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3IgPSB3cmFwRGVzY3JpcHRvcihtZW1icmFuZSwgZGVzY3JpcHRvciwgd3JhcFZhbHVlKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoc2hhZG93VGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpO1xuICAgICAgfSk7XG4gICAgICBwcmV2ZW50RXh0ZW5zaW9ucyhzaGFkb3dUYXJnZXQpO1xuICB9XG4gIGNsYXNzIFJlYWN0aXZlUHJveHlIYW5kbGVyIHtcbiAgICAgIGNvbnN0cnVjdG9yKG1lbWJyYW5lLCB2YWx1ZSkge1xuICAgICAgICAgIHRoaXMub3JpZ2luYWxUYXJnZXQgPSB2YWx1ZTtcbiAgICAgICAgICB0aGlzLm1lbWJyYW5lID0gbWVtYnJhbmU7XG4gICAgICB9XG4gICAgICBnZXQoc2hhZG93VGFyZ2V0LCBrZXkpIHtcbiAgICAgICAgICBjb25zdCB7IG9yaWdpbmFsVGFyZ2V0LCBtZW1icmFuZSB9ID0gdGhpcztcbiAgICAgICAgICBjb25zdCB2YWx1ZSA9IG9yaWdpbmFsVGFyZ2V0W2tleV07XG4gICAgICAgICAgY29uc3QgeyB2YWx1ZU9ic2VydmVkIH0gPSBtZW1icmFuZTtcbiAgICAgICAgICB2YWx1ZU9ic2VydmVkKG9yaWdpbmFsVGFyZ2V0LCBrZXkpO1xuICAgICAgICAgIHJldHVybiBtZW1icmFuZS5nZXRQcm94eSh2YWx1ZSk7XG4gICAgICB9XG4gICAgICBzZXQoc2hhZG93VGFyZ2V0LCBrZXksIHZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgeyBvcmlnaW5hbFRhcmdldCwgbWVtYnJhbmU6IHsgdmFsdWVNdXRhdGVkIH0gfSA9IHRoaXM7XG4gICAgICAgICAgY29uc3Qgb2xkVmFsdWUgPSBvcmlnaW5hbFRhcmdldFtrZXldO1xuICAgICAgICAgIGlmIChvbGRWYWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICAgICAgb3JpZ2luYWxUYXJnZXRba2V5XSA9IHZhbHVlO1xuICAgICAgICAgICAgICB2YWx1ZU11dGF0ZWQob3JpZ2luYWxUYXJnZXQsIGtleSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGVsc2UgaWYgKGtleSA9PT0gJ2xlbmd0aCcgJiYgaXNBcnJheShvcmlnaW5hbFRhcmdldCkpIHtcbiAgICAgICAgICAgICAgLy8gZml4IGZvciBpc3N1ZSAjMjM2OiBwdXNoIHdpbGwgYWRkIHRoZSBuZXcgaW5kZXgsIGFuZCBieSB0aGUgdGltZSBsZW5ndGhcbiAgICAgICAgICAgICAgLy8gaXMgdXBkYXRlZCwgdGhlIGludGVybmFsIGxlbmd0aCBpcyBhbHJlYWR5IGVxdWFsIHRvIHRoZSBuZXcgbGVuZ3RoIHZhbHVlXG4gICAgICAgICAgICAgIC8vIHRoZXJlZm9yZSwgdGhlIG9sZFZhbHVlIGlzIGVxdWFsIHRvIHRoZSB2YWx1ZS4gVGhpcyBpcyB0aGUgZm9ya2luZyBsb2dpY1xuICAgICAgICAgICAgICAvLyB0byBzdXBwb3J0IHRoaXMgdXNlIGNhc2UuXG4gICAgICAgICAgICAgIHZhbHVlTXV0YXRlZChvcmlnaW5hbFRhcmdldCwga2V5KTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgICBkZWxldGVQcm9wZXJ0eShzaGFkb3dUYXJnZXQsIGtleSkge1xuICAgICAgICAgIGNvbnN0IHsgb3JpZ2luYWxUYXJnZXQsIG1lbWJyYW5lOiB7IHZhbHVlTXV0YXRlZCB9IH0gPSB0aGlzO1xuICAgICAgICAgIGRlbGV0ZSBvcmlnaW5hbFRhcmdldFtrZXldO1xuICAgICAgICAgIHZhbHVlTXV0YXRlZChvcmlnaW5hbFRhcmdldCwga2V5KTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGFwcGx5KHNoYWRvd1RhcmdldCwgdGhpc0FyZywgYXJnQXJyYXkpIHtcbiAgICAgICAgICAvKiBObyBvcCAqL1xuICAgICAgfVxuICAgICAgY29uc3RydWN0KHRhcmdldCwgYXJnQXJyYXksIG5ld1RhcmdldCkge1xuICAgICAgICAgIC8qIE5vIG9wICovXG4gICAgICB9XG4gICAgICBoYXMoc2hhZG93VGFyZ2V0LCBrZXkpIHtcbiAgICAgICAgICBjb25zdCB7IG9yaWdpbmFsVGFyZ2V0LCBtZW1icmFuZTogeyB2YWx1ZU9ic2VydmVkIH0gfSA9IHRoaXM7XG4gICAgICAgICAgdmFsdWVPYnNlcnZlZChvcmlnaW5hbFRhcmdldCwga2V5KTtcbiAgICAgICAgICByZXR1cm4ga2V5IGluIG9yaWdpbmFsVGFyZ2V0O1xuICAgICAgfVxuICAgICAgb3duS2V5cyhzaGFkb3dUYXJnZXQpIHtcbiAgICAgICAgICBjb25zdCB7IG9yaWdpbmFsVGFyZ2V0IH0gPSB0aGlzO1xuICAgICAgICAgIHJldHVybiBBcnJheUNvbmNhdC5jYWxsKGdldE93blByb3BlcnR5TmFtZXMob3JpZ2luYWxUYXJnZXQpLCBnZXRPd25Qcm9wZXJ0eVN5bWJvbHMob3JpZ2luYWxUYXJnZXQpKTtcbiAgICAgIH1cbiAgICAgIGlzRXh0ZW5zaWJsZShzaGFkb3dUYXJnZXQpIHtcbiAgICAgICAgICBjb25zdCBzaGFkb3dJc0V4dGVuc2libGUgPSBpc0V4dGVuc2libGUoc2hhZG93VGFyZ2V0KTtcbiAgICAgICAgICBpZiAoIXNoYWRvd0lzRXh0ZW5zaWJsZSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hhZG93SXNFeHRlbnNpYmxlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCB7IG9yaWdpbmFsVGFyZ2V0LCBtZW1icmFuZSB9ID0gdGhpcztcbiAgICAgICAgICBjb25zdCB0YXJnZXRJc0V4dGVuc2libGUgPSBpc0V4dGVuc2libGUob3JpZ2luYWxUYXJnZXQpO1xuICAgICAgICAgIGlmICghdGFyZ2V0SXNFeHRlbnNpYmxlKSB7XG4gICAgICAgICAgICAgIGxvY2tTaGFkb3dUYXJnZXQobWVtYnJhbmUsIHNoYWRvd1RhcmdldCwgb3JpZ2luYWxUYXJnZXQpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gdGFyZ2V0SXNFeHRlbnNpYmxlO1xuICAgICAgfVxuICAgICAgc2V0UHJvdG90eXBlT2Yoc2hhZG93VGFyZ2V0LCBwcm90b3R5cGUpIHtcbiAgICAgIH1cbiAgICAgIGdldFByb3RvdHlwZU9mKHNoYWRvd1RhcmdldCkge1xuICAgICAgICAgIGNvbnN0IHsgb3JpZ2luYWxUYXJnZXQgfSA9IHRoaXM7XG4gICAgICAgICAgcmV0dXJuIGdldFByb3RvdHlwZU9mKG9yaWdpbmFsVGFyZ2V0KTtcbiAgICAgIH1cbiAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzaGFkb3dUYXJnZXQsIGtleSkge1xuICAgICAgICAgIGNvbnN0IHsgb3JpZ2luYWxUYXJnZXQsIG1lbWJyYW5lIH0gPSB0aGlzO1xuICAgICAgICAgIGNvbnN0IHsgdmFsdWVPYnNlcnZlZCB9ID0gdGhpcy5tZW1icmFuZTtcbiAgICAgICAgICAvLyBrZXlzIGxvb2tlZCB1cCB2aWEgaGFzT3duUHJvcGVydHkgbmVlZCB0byBiZSByZWFjdGl2ZVxuICAgICAgICAgIHZhbHVlT2JzZXJ2ZWQob3JpZ2luYWxUYXJnZXQsIGtleSk7XG4gICAgICAgICAgbGV0IGRlc2MgPSBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob3JpZ2luYWxUYXJnZXQsIGtleSk7XG4gICAgICAgICAgaWYgKGlzVW5kZWZpbmVkKGRlc2MpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBzaGFkb3dEZXNjcmlwdG9yID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNoYWRvd1RhcmdldCwga2V5KTtcbiAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKHNoYWRvd0Rlc2NyaXB0b3IpKSB7XG4gICAgICAgICAgICAgIHJldHVybiBzaGFkb3dEZXNjcmlwdG9yO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBOb3RlOiBieSBhY2Nlc3NpbmcgdGhlIGRlc2NyaXB0b3IsIHRoZSBrZXkgaXMgbWFya2VkIGFzIG9ic2VydmVkXG4gICAgICAgICAgLy8gYnV0IGFjY2VzcyB0byB0aGUgdmFsdWUsIHNldHRlciBvciBnZXR0ZXIgKGlmIGF2YWlsYWJsZSkgY2Fubm90IG9ic2VydmVcbiAgICAgICAgICAvLyBtdXRhdGlvbnMsIGp1c3QgbGlrZSByZWd1bGFyIG1ldGhvZHMsIGluIHdoaWNoIGNhc2Ugd2UganVzdCBkbyBub3RoaW5nLlxuICAgICAgICAgIGRlc2MgPSB3cmFwRGVzY3JpcHRvcihtZW1icmFuZSwgZGVzYywgd3JhcFZhbHVlKTtcbiAgICAgICAgICBpZiAoIWRlc2MuY29uZmlndXJhYmxlKSB7XG4gICAgICAgICAgICAgIC8vIElmIGRlc2NyaXB0b3IgZnJvbSBvcmlnaW5hbCB0YXJnZXQgaXMgbm90IGNvbmZpZ3VyYWJsZSxcbiAgICAgICAgICAgICAgLy8gV2UgbXVzdCBjb3B5IHRoZSB3cmFwcGVkIGRlc2NyaXB0b3Igb3ZlciB0byB0aGUgc2hhZG93IHRhcmdldC5cbiAgICAgICAgICAgICAgLy8gT3RoZXJ3aXNlLCBwcm94eSB3aWxsIHRocm93IGFuIGludmFyaWFudCBlcnJvci5cbiAgICAgICAgICAgICAgLy8gVGhpcyBpcyBvdXIgbGFzdCBjaGFuY2UgdG8gbG9jayB0aGUgdmFsdWUuXG4gICAgICAgICAgICAgIC8vIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL1Byb3h5L2hhbmRsZXIvZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yI0ludmFyaWFudHNcbiAgICAgICAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoc2hhZG93VGFyZ2V0LCBrZXksIGRlc2MpO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZGVzYztcbiAgICAgIH1cbiAgICAgIHByZXZlbnRFeHRlbnNpb25zKHNoYWRvd1RhcmdldCkge1xuICAgICAgICAgIGNvbnN0IHsgb3JpZ2luYWxUYXJnZXQsIG1lbWJyYW5lIH0gPSB0aGlzO1xuICAgICAgICAgIGxvY2tTaGFkb3dUYXJnZXQobWVtYnJhbmUsIHNoYWRvd1RhcmdldCwgb3JpZ2luYWxUYXJnZXQpO1xuICAgICAgICAgIHByZXZlbnRFeHRlbnNpb25zKG9yaWdpbmFsVGFyZ2V0KTtcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICAgIGRlZmluZVByb3BlcnR5KHNoYWRvd1RhcmdldCwga2V5LCBkZXNjcmlwdG9yKSB7XG4gICAgICAgICAgY29uc3QgeyBvcmlnaW5hbFRhcmdldCwgbWVtYnJhbmUgfSA9IHRoaXM7XG4gICAgICAgICAgY29uc3QgeyB2YWx1ZU11dGF0ZWQgfSA9IG1lbWJyYW5lO1xuICAgICAgICAgIGNvbnN0IHsgY29uZmlndXJhYmxlIH0gPSBkZXNjcmlwdG9yO1xuICAgICAgICAgIC8vIFdlIGhhdmUgdG8gY2hlY2sgZm9yIHZhbHVlIGluIGRlc2NyaXB0b3JcbiAgICAgICAgICAvLyBiZWNhdXNlIE9iamVjdC5mcmVlemUocHJveHkpIGNhbGxzIHRoaXMgbWV0aG9kXG4gICAgICAgICAgLy8gd2l0aCBvbmx5IHsgY29uZmlndXJhYmxlOiBmYWxzZSwgd3JpdGVhYmxlOiBmYWxzZSB9XG4gICAgICAgICAgLy8gQWRkaXRpb25hbGx5LCBtZXRob2Qgd2lsbCBvbmx5IGJlIGNhbGxlZCB3aXRoIHdyaXRlYWJsZTpmYWxzZVxuICAgICAgICAgIC8vIGlmIHRoZSBkZXNjcmlwdG9yIGhhcyBhIHZhbHVlLCBhcyBvcHBvc2VkIHRvIGdldHRlci9zZXR0ZXJcbiAgICAgICAgICAvLyBTbyB3ZSBjYW4ganVzdCBjaGVjayBpZiB3cml0YWJsZSBpcyBwcmVzZW50IGFuZCB0aGVuIHNlZSBpZlxuICAgICAgICAgIC8vIHZhbHVlIGlzIHByZXNlbnQuIFRoaXMgZWxpbWluYXRlcyBnZXR0ZXIgYW5kIHNldHRlciBkZXNjcmlwdG9yc1xuICAgICAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICd3cml0YWJsZScpICYmICFoYXNPd25Qcm9wZXJ0eS5jYWxsKGRlc2NyaXB0b3IsICd2YWx1ZScpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG9yaWdpbmFsRGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihvcmlnaW5hbFRhcmdldCwga2V5KTtcbiAgICAgICAgICAgICAgZGVzY3JpcHRvci52YWx1ZSA9IG9yaWdpbmFsRGVzY3JpcHRvci52YWx1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHkob3JpZ2luYWxUYXJnZXQsIGtleSwgdW53cmFwRGVzY3JpcHRvcihkZXNjcmlwdG9yKSk7XG4gICAgICAgICAgaWYgKGNvbmZpZ3VyYWJsZSA9PT0gZmFsc2UpIHtcbiAgICAgICAgICAgICAgT2JqZWN0RGVmaW5lUHJvcGVydHkoc2hhZG93VGFyZ2V0LCBrZXksIHdyYXBEZXNjcmlwdG9yKG1lbWJyYW5lLCBkZXNjcmlwdG9yLCB3cmFwVmFsdWUpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFsdWVNdXRhdGVkKG9yaWdpbmFsVGFyZ2V0LCBrZXkpO1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICB9XG5cbiAgZnVuY3Rpb24gd3JhcFJlYWRPbmx5VmFsdWUobWVtYnJhbmUsIHZhbHVlKSB7XG4gICAgICByZXR1cm4gbWVtYnJhbmUudmFsdWVJc09ic2VydmFibGUodmFsdWUpID8gbWVtYnJhbmUuZ2V0UmVhZE9ubHlQcm94eSh2YWx1ZSkgOiB2YWx1ZTtcbiAgfVxuICBjbGFzcyBSZWFkT25seUhhbmRsZXIge1xuICAgICAgY29uc3RydWN0b3IobWVtYnJhbmUsIHZhbHVlKSB7XG4gICAgICAgICAgdGhpcy5vcmlnaW5hbFRhcmdldCA9IHZhbHVlO1xuICAgICAgICAgIHRoaXMubWVtYnJhbmUgPSBtZW1icmFuZTtcbiAgICAgIH1cbiAgICAgIGdldChzaGFkb3dUYXJnZXQsIGtleSkge1xuICAgICAgICAgIGNvbnN0IHsgbWVtYnJhbmUsIG9yaWdpbmFsVGFyZ2V0IH0gPSB0aGlzO1xuICAgICAgICAgIGNvbnN0IHZhbHVlID0gb3JpZ2luYWxUYXJnZXRba2V5XTtcbiAgICAgICAgICBjb25zdCB7IHZhbHVlT2JzZXJ2ZWQgfSA9IG1lbWJyYW5lO1xuICAgICAgICAgIHZhbHVlT2JzZXJ2ZWQob3JpZ2luYWxUYXJnZXQsIGtleSk7XG4gICAgICAgICAgcmV0dXJuIG1lbWJyYW5lLmdldFJlYWRPbmx5UHJveHkodmFsdWUpO1xuICAgICAgfVxuICAgICAgc2V0KHNoYWRvd1RhcmdldCwga2V5LCB2YWx1ZSkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGRlbGV0ZVByb3BlcnR5KHNoYWRvd1RhcmdldCwga2V5KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgYXBwbHkoc2hhZG93VGFyZ2V0LCB0aGlzQXJnLCBhcmdBcnJheSkge1xuICAgICAgICAgIC8qIE5vIG9wICovXG4gICAgICB9XG4gICAgICBjb25zdHJ1Y3QodGFyZ2V0LCBhcmdBcnJheSwgbmV3VGFyZ2V0KSB7XG4gICAgICAgICAgLyogTm8gb3AgKi9cbiAgICAgIH1cbiAgICAgIGhhcyhzaGFkb3dUYXJnZXQsIGtleSkge1xuICAgICAgICAgIGNvbnN0IHsgb3JpZ2luYWxUYXJnZXQsIG1lbWJyYW5lOiB7IHZhbHVlT2JzZXJ2ZWQgfSB9ID0gdGhpcztcbiAgICAgICAgICB2YWx1ZU9ic2VydmVkKG9yaWdpbmFsVGFyZ2V0LCBrZXkpO1xuICAgICAgICAgIHJldHVybiBrZXkgaW4gb3JpZ2luYWxUYXJnZXQ7XG4gICAgICB9XG4gICAgICBvd25LZXlzKHNoYWRvd1RhcmdldCkge1xuICAgICAgICAgIGNvbnN0IHsgb3JpZ2luYWxUYXJnZXQgfSA9IHRoaXM7XG4gICAgICAgICAgcmV0dXJuIEFycmF5Q29uY2F0LmNhbGwoZ2V0T3duUHJvcGVydHlOYW1lcyhvcmlnaW5hbFRhcmdldCksIGdldE93blByb3BlcnR5U3ltYm9scyhvcmlnaW5hbFRhcmdldCkpO1xuICAgICAgfVxuICAgICAgc2V0UHJvdG90eXBlT2Yoc2hhZG93VGFyZ2V0LCBwcm90b3R5cGUpIHtcbiAgICAgIH1cbiAgICAgIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzaGFkb3dUYXJnZXQsIGtleSkge1xuICAgICAgICAgIGNvbnN0IHsgb3JpZ2luYWxUYXJnZXQsIG1lbWJyYW5lIH0gPSB0aGlzO1xuICAgICAgICAgIGNvbnN0IHsgdmFsdWVPYnNlcnZlZCB9ID0gbWVtYnJhbmU7XG4gICAgICAgICAgLy8ga2V5cyBsb29rZWQgdXAgdmlhIGhhc093blByb3BlcnR5IG5lZWQgdG8gYmUgcmVhY3RpdmVcbiAgICAgICAgICB2YWx1ZU9ic2VydmVkKG9yaWdpbmFsVGFyZ2V0LCBrZXkpO1xuICAgICAgICAgIGxldCBkZXNjID0gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9yaWdpbmFsVGFyZ2V0LCBrZXkpO1xuICAgICAgICAgIGlmIChpc1VuZGVmaW5lZChkZXNjKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZGVzYztcbiAgICAgICAgICB9XG4gICAgICAgICAgY29uc3Qgc2hhZG93RGVzY3JpcHRvciA9IGdldE93blByb3BlcnR5RGVzY3JpcHRvcihzaGFkb3dUYXJnZXQsIGtleSk7XG4gICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChzaGFkb3dEZXNjcmlwdG9yKSkge1xuICAgICAgICAgICAgICByZXR1cm4gc2hhZG93RGVzY3JpcHRvcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gTm90ZTogYnkgYWNjZXNzaW5nIHRoZSBkZXNjcmlwdG9yLCB0aGUga2V5IGlzIG1hcmtlZCBhcyBvYnNlcnZlZFxuICAgICAgICAgIC8vIGJ1dCBhY2Nlc3MgdG8gdGhlIHZhbHVlIG9yIGdldHRlciAoaWYgYXZhaWxhYmxlKSBjYW5ub3QgYmUgb2JzZXJ2ZWQsXG4gICAgICAgICAgLy8ganVzdCBsaWtlIHJlZ3VsYXIgbWV0aG9kcywgaW4gd2hpY2ggY2FzZSB3ZSBqdXN0IGRvIG5vdGhpbmcuXG4gICAgICAgICAgZGVzYyA9IHdyYXBEZXNjcmlwdG9yKG1lbWJyYW5lLCBkZXNjLCB3cmFwUmVhZE9ubHlWYWx1ZSk7XG4gICAgICAgICAgaWYgKGhhc093blByb3BlcnR5LmNhbGwoZGVzYywgJ3NldCcpKSB7XG4gICAgICAgICAgICAgIGRlc2Muc2V0ID0gdW5kZWZpbmVkOyAvLyByZWFkT25seSBtZW1icmFuZSBkb2VzIG5vdCBhbGxvdyBzZXR0ZXJzXG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICghZGVzYy5jb25maWd1cmFibGUpIHtcbiAgICAgICAgICAgICAgLy8gSWYgZGVzY3JpcHRvciBmcm9tIG9yaWdpbmFsIHRhcmdldCBpcyBub3QgY29uZmlndXJhYmxlLFxuICAgICAgICAgICAgICAvLyBXZSBtdXN0IGNvcHkgdGhlIHdyYXBwZWQgZGVzY3JpcHRvciBvdmVyIHRvIHRoZSBzaGFkb3cgdGFyZ2V0LlxuICAgICAgICAgICAgICAvLyBPdGhlcndpc2UsIHByb3h5IHdpbGwgdGhyb3cgYW4gaW52YXJpYW50IGVycm9yLlxuICAgICAgICAgICAgICAvLyBUaGlzIGlzIG91ciBsYXN0IGNoYW5jZSB0byBsb2NrIHRoZSB2YWx1ZS5cbiAgICAgICAgICAgICAgLy8gaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvSmF2YVNjcmlwdC9SZWZlcmVuY2UvR2xvYmFsX09iamVjdHMvUHJveHkvaGFuZGxlci9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IjSW52YXJpYW50c1xuICAgICAgICAgICAgICBPYmplY3REZWZpbmVQcm9wZXJ0eShzaGFkb3dUYXJnZXQsIGtleSwgZGVzYyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkZXNjO1xuICAgICAgfVxuICAgICAgcHJldmVudEV4dGVuc2lvbnMoc2hhZG93VGFyZ2V0KSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuICAgICAgZGVmaW5lUHJvcGVydHkoc2hhZG93VGFyZ2V0LCBrZXksIGRlc2NyaXB0b3IpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gIH1cbiAgZnVuY3Rpb24gY3JlYXRlU2hhZG93VGFyZ2V0KHZhbHVlKSB7XG4gICAgICBsZXQgc2hhZG93VGFyZ2V0ID0gdW5kZWZpbmVkO1xuICAgICAgaWYgKGlzQXJyYXkodmFsdWUpKSB7XG4gICAgICAgICAgc2hhZG93VGFyZ2V0ID0gW107XG4gICAgICB9XG4gICAgICBlbHNlIGlmIChpc09iamVjdCh2YWx1ZSkpIHtcbiAgICAgICAgICBzaGFkb3dUYXJnZXQgPSB7fTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzaGFkb3dUYXJnZXQ7XG4gIH1cbiAgY29uc3QgT2JqZWN0RG90UHJvdG90eXBlID0gT2JqZWN0LnByb3RvdHlwZTtcbiAgZnVuY3Rpb24gZGVmYXVsdFZhbHVlSXNPYnNlcnZhYmxlKHZhbHVlKSB7XG4gICAgICAvLyBpbnRlbnRpb25hbGx5IGNoZWNraW5nIGZvciBudWxsXG4gICAgICBpZiAodmFsdWUgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgICAvLyB0cmVhdCBhbGwgbm9uLW9iamVjdCB0eXBlcywgaW5jbHVkaW5nIHVuZGVmaW5lZCwgYXMgbm9uLW9ic2VydmFibGUgdmFsdWVzXG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGlmIChpc0FycmF5KHZhbHVlKSkge1xuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgICAgY29uc3QgcHJvdG8gPSBnZXRQcm90b3R5cGVPZih2YWx1ZSk7XG4gICAgICByZXR1cm4gKHByb3RvID09PSBPYmplY3REb3RQcm90b3R5cGUgfHwgcHJvdG8gPT09IG51bGwgfHwgZ2V0UHJvdG90eXBlT2YocHJvdG8pID09PSBudWxsKTtcbiAgfVxuICBjb25zdCBkZWZhdWx0VmFsdWVPYnNlcnZlZCA9IChvYmosIGtleSkgPT4ge1xuICAgICAgLyogZG8gbm90aGluZyAqL1xuICB9O1xuICBjb25zdCBkZWZhdWx0VmFsdWVNdXRhdGVkID0gKG9iaiwga2V5KSA9PiB7XG4gICAgICAvKiBkbyBub3RoaW5nICovXG4gIH07XG4gIGNvbnN0IGRlZmF1bHRWYWx1ZURpc3RvcnRpb24gPSAodmFsdWUpID0+IHZhbHVlO1xuICBmdW5jdGlvbiB3cmFwRGVzY3JpcHRvcihtZW1icmFuZSwgZGVzY3JpcHRvciwgZ2V0VmFsdWUpIHtcbiAgICAgIGNvbnN0IHsgc2V0LCBnZXQgfSA9IGRlc2NyaXB0b3I7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChkZXNjcmlwdG9yLCAndmFsdWUnKSkge1xuICAgICAgICAgIGRlc2NyaXB0b3IudmFsdWUgPSBnZXRWYWx1ZShtZW1icmFuZSwgZGVzY3JpcHRvci52YWx1ZSk7XG4gICAgICB9XG4gICAgICBlbHNlIHtcbiAgICAgICAgICBpZiAoIWlzVW5kZWZpbmVkKGdldCkpIHtcbiAgICAgICAgICAgICAgZGVzY3JpcHRvci5nZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgICAvLyBpbnZva2luZyB0aGUgb3JpZ2luYWwgZ2V0dGVyIHdpdGggdGhlIG9yaWdpbmFsIHRhcmdldFxuICAgICAgICAgICAgICAgICAgcmV0dXJuIGdldFZhbHVlKG1lbWJyYW5lLCBnZXQuY2FsbCh1bndyYXAodGhpcykpKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChzZXQpKSB7XG4gICAgICAgICAgICAgIGRlc2NyaXB0b3Iuc2V0ID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICAgICAgICAvLyBBdCB0aGlzIHBvaW50IHdlIGRvbid0IGhhdmUgYSBjbGVhciBpbmRpY2F0aW9uIG9mIHdoZXRoZXJcbiAgICAgICAgICAgICAgICAgIC8vIG9yIG5vdCBhIHZhbGlkIG11dGF0aW9uIHdpbGwgb2NjdXIsIHdlIGRvbid0IGhhdmUgdGhlIGtleSxcbiAgICAgICAgICAgICAgICAgIC8vIGFuZCB3ZSBhcmUgbm90IHN1cmUgd2h5IGFuZCBob3cgdGhleSBhcmUgaW52b2tpbmcgdGhpcyBzZXR0ZXIuXG4gICAgICAgICAgICAgICAgICAvLyBOZXZlcnRoZWxlc3Mgd2UgcHJlc2VydmUgdGhlIG9yaWdpbmFsIHNlbWFudGljcyBieSBpbnZva2luZyB0aGVcbiAgICAgICAgICAgICAgICAgIC8vIG9yaWdpbmFsIHNldHRlciB3aXRoIHRoZSBvcmlnaW5hbCB0YXJnZXQgYW5kIHRoZSB1bndyYXBwZWQgdmFsdWVcbiAgICAgICAgICAgICAgICAgIHNldC5jYWxsKHVud3JhcCh0aGlzKSwgbWVtYnJhbmUudW53cmFwUHJveHkodmFsdWUpKTtcbiAgICAgICAgICAgICAgfTtcbiAgICAgICAgICB9XG4gICAgICB9XG4gICAgICByZXR1cm4gZGVzY3JpcHRvcjtcbiAgfVxuICBjbGFzcyBSZWFjdGl2ZU1lbWJyYW5lIHtcbiAgICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgICB0aGlzLnZhbHVlRGlzdG9ydGlvbiA9IGRlZmF1bHRWYWx1ZURpc3RvcnRpb247XG4gICAgICAgICAgdGhpcy52YWx1ZU11dGF0ZWQgPSBkZWZhdWx0VmFsdWVNdXRhdGVkO1xuICAgICAgICAgIHRoaXMudmFsdWVPYnNlcnZlZCA9IGRlZmF1bHRWYWx1ZU9ic2VydmVkO1xuICAgICAgICAgIHRoaXMudmFsdWVJc09ic2VydmFibGUgPSBkZWZhdWx0VmFsdWVJc09ic2VydmFibGU7XG4gICAgICAgICAgdGhpcy5vYmplY3RHcmFwaCA9IG5ldyBXZWFrTWFwKCk7XG4gICAgICAgICAgaWYgKCFpc1VuZGVmaW5lZChvcHRpb25zKSkge1xuICAgICAgICAgICAgICBjb25zdCB7IHZhbHVlRGlzdG9ydGlvbiwgdmFsdWVNdXRhdGVkLCB2YWx1ZU9ic2VydmVkLCB2YWx1ZUlzT2JzZXJ2YWJsZSB9ID0gb3B0aW9ucztcbiAgICAgICAgICAgICAgdGhpcy52YWx1ZURpc3RvcnRpb24gPSBpc0Z1bmN0aW9uKHZhbHVlRGlzdG9ydGlvbikgPyB2YWx1ZURpc3RvcnRpb24gOiBkZWZhdWx0VmFsdWVEaXN0b3J0aW9uO1xuICAgICAgICAgICAgICB0aGlzLnZhbHVlTXV0YXRlZCA9IGlzRnVuY3Rpb24odmFsdWVNdXRhdGVkKSA/IHZhbHVlTXV0YXRlZCA6IGRlZmF1bHRWYWx1ZU11dGF0ZWQ7XG4gICAgICAgICAgICAgIHRoaXMudmFsdWVPYnNlcnZlZCA9IGlzRnVuY3Rpb24odmFsdWVPYnNlcnZlZCkgPyB2YWx1ZU9ic2VydmVkIDogZGVmYXVsdFZhbHVlT2JzZXJ2ZWQ7XG4gICAgICAgICAgICAgIHRoaXMudmFsdWVJc09ic2VydmFibGUgPSBpc0Z1bmN0aW9uKHZhbHVlSXNPYnNlcnZhYmxlKSA/IHZhbHVlSXNPYnNlcnZhYmxlIDogZGVmYXVsdFZhbHVlSXNPYnNlcnZhYmxlO1xuICAgICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGdldFByb3h5KHZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgdW53cmFwcGVkVmFsdWUgPSB1bndyYXAodmFsdWUpO1xuICAgICAgICAgIGNvbnN0IGRpc3RvcnRlZCA9IHRoaXMudmFsdWVEaXN0b3J0aW9uKHVud3JhcHBlZFZhbHVlKTtcbiAgICAgICAgICBpZiAodGhpcy52YWx1ZUlzT2JzZXJ2YWJsZShkaXN0b3J0ZWQpKSB7XG4gICAgICAgICAgICAgIGNvbnN0IG8gPSB0aGlzLmdldFJlYWN0aXZlU3RhdGUodW53cmFwcGVkVmFsdWUsIGRpc3RvcnRlZCk7XG4gICAgICAgICAgICAgIC8vIHdoZW4gdHJ5aW5nIHRvIGV4dHJhY3QgdGhlIHdyaXRhYmxlIHZlcnNpb24gb2YgYSByZWFkb25seVxuICAgICAgICAgICAgICAvLyB3ZSByZXR1cm4gdGhlIHJlYWRvbmx5LlxuICAgICAgICAgICAgICByZXR1cm4gby5yZWFkT25seSA9PT0gdmFsdWUgPyB2YWx1ZSA6IG8ucmVhY3RpdmU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkaXN0b3J0ZWQ7XG4gICAgICB9XG4gICAgICBnZXRSZWFkT25seVByb3h5KHZhbHVlKSB7XG4gICAgICAgICAgdmFsdWUgPSB1bndyYXAodmFsdWUpO1xuICAgICAgICAgIGNvbnN0IGRpc3RvcnRlZCA9IHRoaXMudmFsdWVEaXN0b3J0aW9uKHZhbHVlKTtcbiAgICAgICAgICBpZiAodGhpcy52YWx1ZUlzT2JzZXJ2YWJsZShkaXN0b3J0ZWQpKSB7XG4gICAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFJlYWN0aXZlU3RhdGUodmFsdWUsIGRpc3RvcnRlZCkucmVhZE9ubHk7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBkaXN0b3J0ZWQ7XG4gICAgICB9XG4gICAgICB1bndyYXBQcm94eShwKSB7XG4gICAgICAgICAgcmV0dXJuIHVud3JhcChwKTtcbiAgICAgIH1cbiAgICAgIGdldFJlYWN0aXZlU3RhdGUodmFsdWUsIGRpc3RvcnRlZFZhbHVlKSB7XG4gICAgICAgICAgY29uc3QgeyBvYmplY3RHcmFwaCwgfSA9IHRoaXM7XG4gICAgICAgICAgbGV0IHJlYWN0aXZlU3RhdGUgPSBvYmplY3RHcmFwaC5nZXQoZGlzdG9ydGVkVmFsdWUpO1xuICAgICAgICAgIGlmIChyZWFjdGl2ZVN0YXRlKSB7XG4gICAgICAgICAgICAgIHJldHVybiByZWFjdGl2ZVN0YXRlO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb25zdCBtZW1icmFuZSA9IHRoaXM7XG4gICAgICAgICAgcmVhY3RpdmVTdGF0ZSA9IHtcbiAgICAgICAgICAgICAgZ2V0IHJlYWN0aXZlKCkge1xuICAgICAgICAgICAgICAgICAgY29uc3QgcmVhY3RpdmVIYW5kbGVyID0gbmV3IFJlYWN0aXZlUHJveHlIYW5kbGVyKG1lbWJyYW5lLCBkaXN0b3J0ZWRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAvLyBjYWNoaW5nIHRoZSByZWFjdGl2ZSBwcm94eSBhZnRlciB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZFxuICAgICAgICAgICAgICAgICAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkoY3JlYXRlU2hhZG93VGFyZ2V0KGRpc3RvcnRlZFZhbHVlKSwgcmVhY3RpdmVIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyUHJveHkocHJveHksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIE9iamVjdERlZmluZVByb3BlcnR5KHRoaXMsICdyZWFjdGl2ZScsIHsgdmFsdWU6IHByb3h5IH0pO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICBnZXQgcmVhZE9ubHkoKSB7XG4gICAgICAgICAgICAgICAgICBjb25zdCByZWFkT25seUhhbmRsZXIgPSBuZXcgUmVhZE9ubHlIYW5kbGVyKG1lbWJyYW5lLCBkaXN0b3J0ZWRWYWx1ZSk7XG4gICAgICAgICAgICAgICAgICAvLyBjYWNoaW5nIHRoZSByZWFkT25seSBwcm94eSBhZnRlciB0aGUgZmlyc3QgdGltZSBpdCBpcyBhY2Nlc3NlZFxuICAgICAgICAgICAgICAgICAgY29uc3QgcHJveHkgPSBuZXcgUHJveHkoY3JlYXRlU2hhZG93VGFyZ2V0KGRpc3RvcnRlZFZhbHVlKSwgcmVhZE9ubHlIYW5kbGVyKTtcbiAgICAgICAgICAgICAgICAgIHJlZ2lzdGVyUHJveHkocHJveHksIHZhbHVlKTtcbiAgICAgICAgICAgICAgICAgIE9iamVjdERlZmluZVByb3BlcnR5KHRoaXMsICdyZWFkT25seScsIHsgdmFsdWU6IHByb3h5IH0pO1xuICAgICAgICAgICAgICAgICAgcmV0dXJuIHByb3h5O1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfTtcbiAgICAgICAgICBvYmplY3RHcmFwaC5zZXQoZGlzdG9ydGVkVmFsdWUsIHJlYWN0aXZlU3RhdGUpO1xuICAgICAgICAgIHJldHVybiByZWFjdGl2ZVN0YXRlO1xuICAgICAgfVxuICB9XG4gIC8qKiB2ZXJzaW9uOiAwLjI2LjAgKi9cblxuICBmdW5jdGlvbiB3cmFwKGRhdGEsIG11dGF0aW9uQ2FsbGJhY2spIHtcblxuICAgIGxldCBtZW1icmFuZSA9IG5ldyBSZWFjdGl2ZU1lbWJyYW5lKHtcbiAgICAgIHZhbHVlTXV0YXRlZCh0YXJnZXQsIGtleSkge1xuICAgICAgICBtdXRhdGlvbkNhbGxiYWNrKHRhcmdldCwga2V5KTtcbiAgICAgIH1cblxuICAgIH0pO1xuICAgIHJldHVybiB7XG4gICAgICBkYXRhOiBtZW1icmFuZS5nZXRQcm94eShkYXRhKSxcbiAgICAgIG1lbWJyYW5lOiBtZW1icmFuZVxuICAgIH07XG4gIH1cbiAgZnVuY3Rpb24gdW53cmFwJDEobWVtYnJhbmUsIG9ic2VydmFibGUpIHtcbiAgICBsZXQgdW53cmFwcGVkRGF0YSA9IG1lbWJyYW5lLnVud3JhcFByb3h5KG9ic2VydmFibGUpO1xuICAgIGxldCBjb3B5ID0ge307XG4gICAgT2JqZWN0LmtleXModW53cmFwcGVkRGF0YSkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgaWYgKFsnJGVsJywgJyRyZWZzJywgJyRuZXh0VGljaycsICckd2F0Y2gnXS5pbmNsdWRlcyhrZXkpKSByZXR1cm47XG4gICAgICBjb3B5W2tleV0gPSB1bndyYXBwZWREYXRhW2tleV07XG4gICAgfSk7XG4gICAgcmV0dXJuIGNvcHk7XG4gIH1cblxuICBjbGFzcyBDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKGVsLCBjb21wb25lbnRGb3JDbG9uZSA9IG51bGwpIHtcbiAgICAgIHRoaXMuJGVsID0gZWw7XG4gICAgICBjb25zdCBkYXRhQXR0ciA9IHRoaXMuJGVsLmdldEF0dHJpYnV0ZSgneC1kYXRhJyk7XG4gICAgICBjb25zdCBkYXRhRXhwcmVzc2lvbiA9IGRhdGFBdHRyID09PSAnJyA/ICd7fScgOiBkYXRhQXR0cjtcbiAgICAgIGNvbnN0IGluaXRFeHByZXNzaW9uID0gdGhpcy4kZWwuZ2V0QXR0cmlidXRlKCd4LWluaXQnKTtcbiAgICAgIGxldCBkYXRhRXh0cmFzID0ge1xuICAgICAgICAkZWw6IHRoaXMuJGVsXG4gICAgICB9O1xuICAgICAgbGV0IGNhbm9uaWNhbENvbXBvbmVudEVsZW1lbnRSZWZlcmVuY2UgPSBjb21wb25lbnRGb3JDbG9uZSA/IGNvbXBvbmVudEZvckNsb25lLiRlbCA6IHRoaXMuJGVsO1xuICAgICAgT2JqZWN0LmVudHJpZXMoQWxwaW5lLm1hZ2ljUHJvcGVydGllcykuZm9yRWFjaCgoW25hbWUsIGNhbGxiYWNrXSkgPT4ge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZGF0YUV4dHJhcywgYCQke25hbWV9YCwge1xuICAgICAgICAgIGdldDogZnVuY3Rpb24gZ2V0KCkge1xuICAgICAgICAgICAgcmV0dXJuIGNhbGxiYWNrKGNhbm9uaWNhbENvbXBvbmVudEVsZW1lbnRSZWZlcmVuY2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudW5vYnNlcnZlZERhdGEgPSBjb21wb25lbnRGb3JDbG9uZSA/IGNvbXBvbmVudEZvckNsb25lLmdldFVub2JzZXJ2ZWREYXRhKCkgOiBzYWZlckV2YWwoZGF0YUV4cHJlc3Npb24sIGRhdGFFeHRyYXMpO1xuICAgICAgLy8gQ29uc3RydWN0IGEgUHJveHktYmFzZWQgb2JzZXJ2YWJsZS4gVGhpcyB3aWxsIGJlIHVzZWQgdG8gaGFuZGxlIHJlYWN0aXZpdHkuXG5cbiAgICAgIGxldCB7XG4gICAgICAgIG1lbWJyYW5lLFxuICAgICAgICBkYXRhXG4gICAgICB9ID0gdGhpcy53cmFwRGF0YUluT2JzZXJ2YWJsZSh0aGlzLnVub2JzZXJ2ZWREYXRhKTtcbiAgICAgIHRoaXMuJGRhdGEgPSBkYXRhO1xuICAgICAgdGhpcy5tZW1icmFuZSA9IG1lbWJyYW5lOyAvLyBBZnRlciBtYWtpbmcgdXNlci1zdXBwbGllZCBkYXRhIG1ldGhvZHMgcmVhY3RpdmUsIHdlIGNhbiBub3cgYWRkXG4gICAgICAvLyBvdXIgbWFnaWMgcHJvcGVydGllcyB0byB0aGUgb3JpZ2luYWwgZGF0YSBmb3IgYWNjZXNzLlxuXG4gICAgICB0aGlzLnVub2JzZXJ2ZWREYXRhLiRlbCA9IHRoaXMuJGVsO1xuICAgICAgdGhpcy51bm9ic2VydmVkRGF0YS4kcmVmcyA9IHRoaXMuZ2V0UmVmc1Byb3h5KCk7XG4gICAgICB0aGlzLm5leHRUaWNrU3RhY2sgPSBbXTtcblxuICAgICAgdGhpcy51bm9ic2VydmVkRGF0YS4kbmV4dFRpY2sgPSBjYWxsYmFjayA9PiB7XG4gICAgICAgIHRoaXMubmV4dFRpY2tTdGFjay5wdXNoKGNhbGxiYWNrKTtcbiAgICAgIH07XG5cbiAgICAgIHRoaXMud2F0Y2hlcnMgPSB7fTtcblxuICAgICAgdGhpcy51bm9ic2VydmVkRGF0YS4kd2F0Y2ggPSAocHJvcGVydHksIGNhbGxiYWNrKSA9PiB7XG4gICAgICAgIGlmICghdGhpcy53YXRjaGVyc1twcm9wZXJ0eV0pIHRoaXMud2F0Y2hlcnNbcHJvcGVydHldID0gW107XG4gICAgICAgIHRoaXMud2F0Y2hlcnNbcHJvcGVydHldLnB1c2goY2FsbGJhY2spO1xuICAgICAgfTtcbiAgICAgIC8qIE1PREVSTi1PTkxZOlNUQVJUICovXG4gICAgICAvLyBXZSByZW1vdmUgdGhpcyBwaWVjZSBvZiBjb2RlIGZyb20gdGhlIGxlZ2FjeSBidWlsZC5cbiAgICAgIC8vIEluIElFMTEsIHdlIGhhdmUgYWxyZWFkeSBkZWZpbmVkIG91ciBoZWxwZXJzIGF0IHRoaXMgcG9pbnQuXG4gICAgICAvLyBSZWdpc3RlciBjdXN0b20gbWFnaWMgcHJvcGVydGllcy5cblxuXG4gICAgICBPYmplY3QuZW50cmllcyhBbHBpbmUubWFnaWNQcm9wZXJ0aWVzKS5mb3JFYWNoKChbbmFtZSwgY2FsbGJhY2tdKSA9PiB7XG4gICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLnVub2JzZXJ2ZWREYXRhLCBgJCR7bmFtZX1gLCB7XG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQoKSB7XG4gICAgICAgICAgICByZXR1cm4gY2FsbGJhY2soY2Fub25pY2FsQ29tcG9uZW50RWxlbWVudFJlZmVyZW5jZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH0pO1xuICAgICAgLyogTU9ERVJOLU9OTFk6RU5EICovXG5cbiAgICAgIHRoaXMuc2hvd0RpcmVjdGl2ZVN0YWNrID0gW107XG4gICAgICB0aGlzLnNob3dEaXJlY3RpdmVMYXN0RWxlbWVudDtcbiAgICAgIGNvbXBvbmVudEZvckNsb25lIHx8IEFscGluZS5vbkJlZm9yZUNvbXBvbmVudEluaXRpYWxpemVkcy5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRoaXMpKTtcbiAgICAgIHZhciBpbml0UmV0dXJuZWRDYWxsYmFjazsgLy8gSWYgeC1pbml0IGlzIHByZXNlbnQgQU5EIHdlIGFyZW4ndCBjbG9uaW5nIChza2lwIHgtaW5pdCBvbiBjbG9uZSlcblxuICAgICAgaWYgKGluaXRFeHByZXNzaW9uICYmICFjb21wb25lbnRGb3JDbG9uZSkge1xuICAgICAgICAvLyBXZSB3YW50IHRvIGFsbG93IGRhdGEgbWFuaXB1bGF0aW9uLCBidXQgbm90IHRyaWdnZXIgRE9NIHVwZGF0ZXMganVzdCB5ZXQuXG4gICAgICAgIC8vIFdlIGhhdmVuJ3QgZXZlbiBpbml0aWFsaXplZCB0aGUgZWxlbWVudHMgd2l0aCB0aGVpciBBbHBpbmUgYmluZGluZ3MuIEkgbWVhbiBjJ21vbi5cbiAgICAgICAgdGhpcy5wYXVzZVJlYWN0aXZpdHkgPSB0cnVlO1xuICAgICAgICBpbml0UmV0dXJuZWRDYWxsYmFjayA9IHRoaXMuZXZhbHVhdGVSZXR1cm5FeHByZXNzaW9uKHRoaXMuJGVsLCBpbml0RXhwcmVzc2lvbik7XG4gICAgICAgIHRoaXMucGF1c2VSZWFjdGl2aXR5ID0gZmFsc2U7XG4gICAgICB9IC8vIFJlZ2lzdGVyIGFsbCBvdXIgbGlzdGVuZXJzIGFuZCBzZXQgYWxsIG91ciBhdHRyaWJ1dGUgYmluZGluZ3MuXG5cblxuICAgICAgdGhpcy5pbml0aWFsaXplRWxlbWVudHModGhpcy4kZWwpOyAvLyBVc2UgbXV0YXRpb24gb2JzZXJ2ZXIgdG8gZGV0ZWN0IG5ldyBlbGVtZW50cyBiZWluZyBhZGRlZCB3aXRoaW4gdGhpcyBjb21wb25lbnQgYXQgcnVuLXRpbWUuXG4gICAgICAvLyBBbHBpbmUncyBqdXN0IHNvIGRhcm4gZmxleGlibGUgYW1pcml0ZT9cblxuICAgICAgdGhpcy5saXN0ZW5Gb3JOZXdFbGVtZW50c1RvSW5pdGlhbGl6ZSgpO1xuXG4gICAgICBpZiAodHlwZW9mIGluaXRSZXR1cm5lZENhbGxiYWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIFJ1biB0aGUgY2FsbGJhY2sgcmV0dXJuZWQgZnJvbSB0aGUgXCJ4LWluaXRcIiBob29rIHRvIGFsbG93IHRoZSB1c2VyIHRvIGRvIHN0dWZmIGFmdGVyXG4gICAgICAgIC8vIEFscGluZSdzIGdvdCBpdCdzIGdydWJieSBsaXR0bGUgcGF3cyBhbGwgb3ZlciBldmVyeXRoaW5nLlxuICAgICAgICBpbml0UmV0dXJuZWRDYWxsYmFjay5jYWxsKHRoaXMuJGRhdGEpO1xuICAgICAgfVxuXG4gICAgICBjb21wb25lbnRGb3JDbG9uZSB8fCBzZXRUaW1lb3V0KCgpID0+IHtcbiAgICAgICAgQWxwaW5lLm9uQ29tcG9uZW50SW5pdGlhbGl6ZWRzLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGhpcykpO1xuICAgICAgfSwgMCk7XG4gICAgfVxuXG4gICAgZ2V0VW5vYnNlcnZlZERhdGEoKSB7XG4gICAgICByZXR1cm4gdW53cmFwJDEodGhpcy5tZW1icmFuZSwgdGhpcy4kZGF0YSk7XG4gICAgfVxuXG4gICAgd3JhcERhdGFJbk9ic2VydmFibGUoZGF0YSkge1xuICAgICAgdmFyIHNlbGYgPSB0aGlzO1xuICAgICAgbGV0IHVwZGF0ZURvbSA9IGRlYm91bmNlKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgc2VsZi51cGRhdGVFbGVtZW50cyhzZWxmLiRlbCk7XG4gICAgICB9LCAwKTtcbiAgICAgIHJldHVybiB3cmFwKGRhdGEsICh0YXJnZXQsIGtleSkgPT4ge1xuICAgICAgICBpZiAoc2VsZi53YXRjaGVyc1trZXldKSB7XG4gICAgICAgICAgLy8gSWYgdGhlcmUncyBhIHdhdGNoZXIgZm9yIHRoaXMgc3BlY2lmaWMga2V5LCBydW4gaXQuXG4gICAgICAgICAgc2VsZi53YXRjaGVyc1trZXldLmZvckVhY2goY2FsbGJhY2sgPT4gY2FsbGJhY2sodGFyZ2V0W2tleV0pKTtcbiAgICAgICAgfSBlbHNlIGlmIChBcnJheS5pc0FycmF5KHRhcmdldCkpIHtcbiAgICAgICAgICAvLyBBcnJheXMgYXJlIHNwZWNpYWwgY2FzZXMsIGlmIGFueSBvZiB0aGUgaXRlbXMgY2hhbmdlLCB3ZSBjb25zaWRlciB0aGUgYXJyYXkgYXMgbXV0YXRlZC5cbiAgICAgICAgICBPYmplY3Qua2V5cyhzZWxmLndhdGNoZXJzKS5mb3JFYWNoKGZ1bGxEb3ROb3RhdGlvbktleSA9PiB7XG4gICAgICAgICAgICBsZXQgZG90Tm90YXRpb25QYXJ0cyA9IGZ1bGxEb3ROb3RhdGlvbktleS5zcGxpdCgnLicpOyAvLyBJZ25vcmUgbGVuZ3RoIG11dGF0aW9ucyBzaW5jZSB0aGV5IHdvdWxkIHJlc3VsdCBpbiBkdXBsaWNhdGUgY2FsbHMuXG4gICAgICAgICAgICAvLyBGb3IgZXhhbXBsZSwgd2hlbiBjYWxsaW5nIHB1c2gsIHdlIHdvdWxkIGdldCBhIG11dGF0aW9uIGZvciB0aGUgaXRlbSdzIGtleVxuICAgICAgICAgICAgLy8gYW5kIGEgc2Vjb25kIG11dGF0aW9uIGZvciB0aGUgbGVuZ3RoIHByb3BlcnR5LlxuXG4gICAgICAgICAgICBpZiAoa2V5ID09PSAnbGVuZ3RoJykgcmV0dXJuO1xuICAgICAgICAgICAgZG90Tm90YXRpb25QYXJ0cy5yZWR1Y2UoKGNvbXBhcmlzb25EYXRhLCBwYXJ0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChPYmplY3QuaXModGFyZ2V0LCBjb21wYXJpc29uRGF0YVtwYXJ0XSkpIHtcbiAgICAgICAgICAgICAgICBzZWxmLndhdGNoZXJzW2Z1bGxEb3ROb3RhdGlvbktleV0uZm9yRWFjaChjYWxsYmFjayA9PiBjYWxsYmFjayh0YXJnZXQpKTtcbiAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgIHJldHVybiBjb21wYXJpc29uRGF0YVtwYXJ0XTtcbiAgICAgICAgICAgIH0sIHNlbGYudW5vYnNlcnZlZERhdGEpO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIExldCdzIHdhbGsgdGhyb3VnaCB0aGUgd2F0Y2hlcnMgd2l0aCBcImRvdC1ub3RhdGlvblwiIChmb28uYmFyKSBhbmQgc2VlXG4gICAgICAgICAgLy8gaWYgdGhpcyBtdXRhdGlvbiBmaXRzIGFueSBvZiB0aGVtLlxuICAgICAgICAgIE9iamVjdC5rZXlzKHNlbGYud2F0Y2hlcnMpLmZpbHRlcihpID0+IGkuaW5jbHVkZXMoJy4nKSkuZm9yRWFjaChmdWxsRG90Tm90YXRpb25LZXkgPT4ge1xuICAgICAgICAgICAgbGV0IGRvdE5vdGF0aW9uUGFydHMgPSBmdWxsRG90Tm90YXRpb25LZXkuc3BsaXQoJy4nKTsgLy8gSWYgdGhpcyBkb3Qtbm90YXRpb24gd2F0Y2hlcidzIGxhc3QgXCJwYXJ0XCIgZG9lc24ndCBtYXRjaCB0aGUgY3VycmVudFxuICAgICAgICAgICAgLy8ga2V5LCB0aGVuIHNraXAgaXQgZWFybHkgZm9yIHBlcmZvcm1hbmNlIHJlYXNvbnMuXG5cbiAgICAgICAgICAgIGlmIChrZXkgIT09IGRvdE5vdGF0aW9uUGFydHNbZG90Tm90YXRpb25QYXJ0cy5sZW5ndGggLSAxXSkgcmV0dXJuOyAvLyBOb3csIHdhbGsgdGhyb3VnaCB0aGUgZG90LW5vdGF0aW9uIFwicGFydHNcIiByZWN1cnNpdmVseSB0byBmaW5kXG4gICAgICAgICAgICAvLyBhIG1hdGNoLCBhbmQgY2FsbCB0aGUgd2F0Y2hlciBpZiBvbmUncyBmb3VuZC5cblxuICAgICAgICAgICAgZG90Tm90YXRpb25QYXJ0cy5yZWR1Y2UoKGNvbXBhcmlzb25EYXRhLCBwYXJ0KSA9PiB7XG4gICAgICAgICAgICAgIGlmIChPYmplY3QuaXModGFyZ2V0LCBjb21wYXJpc29uRGF0YSkpIHtcbiAgICAgICAgICAgICAgICAvLyBSdW4gdGhlIHdhdGNoZXJzLlxuICAgICAgICAgICAgICAgIHNlbGYud2F0Y2hlcnNbZnVsbERvdE5vdGF0aW9uS2V5XS5mb3JFYWNoKGNhbGxiYWNrID0+IGNhbGxiYWNrKHRhcmdldFtrZXldKSk7XG4gICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICByZXR1cm4gY29tcGFyaXNvbkRhdGFbcGFydF07XG4gICAgICAgICAgICB9LCBzZWxmLnVub2JzZXJ2ZWREYXRhKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSAvLyBEb24ndCByZWFjdCB0byBkYXRhIGNoYW5nZXMgZm9yIGNhc2VzIGxpa2UgdGhlIGB4LWNyZWF0ZWRgIGhvb2suXG5cblxuICAgICAgICBpZiAoc2VsZi5wYXVzZVJlYWN0aXZpdHkpIHJldHVybjtcbiAgICAgICAgdXBkYXRlRG9tKCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICB3YWxrQW5kU2tpcE5lc3RlZENvbXBvbmVudHMoZWwsIGNhbGxiYWNrLCBpbml0aWFsaXplQ29tcG9uZW50Q2FsbGJhY2sgPSAoKSA9PiB7fSkge1xuICAgICAgd2FsayhlbCwgZWwgPT4ge1xuICAgICAgICAvLyBXZSd2ZSBoaXQgYSBjb21wb25lbnQuXG4gICAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ3gtZGF0YScpKSB7XG4gICAgICAgICAgLy8gSWYgaXQncyBub3QgdGhlIGN1cnJlbnQgb25lLlxuICAgICAgICAgIGlmICghZWwuaXNTYW1lTm9kZSh0aGlzLiRlbCkpIHtcbiAgICAgICAgICAgIC8vIEluaXRpYWxpemUgaXQgaWYgaXQncyBub3QuXG4gICAgICAgICAgICBpZiAoIWVsLl9feCkgaW5pdGlhbGl6ZUNvbXBvbmVudENhbGxiYWNrKGVsKTsgLy8gTm93IHdlJ2xsIGxldCB0aGF0IHN1Yi1jb21wb25lbnQgZGVhbCB3aXRoIGl0c2VsZi5cblxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBjYWxsYmFjayhlbCk7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRWxlbWVudHMocm9vdEVsLCBleHRyYVZhcnMgPSAoKSA9PiB7fSkge1xuICAgICAgdGhpcy53YWxrQW5kU2tpcE5lc3RlZENvbXBvbmVudHMocm9vdEVsLCBlbCA9PiB7XG4gICAgICAgIC8vIERvbid0IHRvdWNoIHNwYXducyBmcm9tIGZvciBsb29wXG4gICAgICAgIGlmIChlbC5fX3hfZm9yX2tleSAhPT0gdW5kZWZpbmVkKSByZXR1cm4gZmFsc2U7IC8vIERvbid0IHRvdWNoIHNwYXducyBmcm9tIGlmIGRpcmVjdGl2ZXNcblxuICAgICAgICBpZiAoZWwuX194X2luc2VydGVkX21lICE9PSB1bmRlZmluZWQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplRWxlbWVudChlbCwgZXh0cmFWYXJzKTtcbiAgICAgIH0sIGVsID0+IHtcbiAgICAgICAgZWwuX194ID0gbmV3IENvbXBvbmVudChlbCk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMuZXhlY3V0ZUFuZENsZWFyUmVtYWluaW5nU2hvd0RpcmVjdGl2ZVN0YWNrKCk7XG4gICAgICB0aGlzLmV4ZWN1dGVBbmRDbGVhck5leHRUaWNrU3RhY2socm9vdEVsKTtcbiAgICB9XG5cbiAgICBpbml0aWFsaXplRWxlbWVudChlbCwgZXh0cmFWYXJzKSB7XG4gICAgICAvLyBUbyBzdXBwb3J0IGNsYXNzIGF0dHJpYnV0ZSBtZXJnaW5nLCB3ZSBoYXZlIHRvIGtub3cgd2hhdCB0aGUgZWxlbWVudCdzXG4gICAgICAvLyBvcmlnaW5hbCBjbGFzcyBhdHRyaWJ1dGUgbG9va2VkIGxpa2UgZm9yIHJlZmVyZW5jZS5cbiAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ2NsYXNzJykgJiYgZ2V0WEF0dHJzKGVsLCB0aGlzKS5sZW5ndGggPiAwKSB7XG4gICAgICAgIGVsLl9feF9vcmlnaW5hbF9jbGFzc2VzID0gY29udmVydENsYXNzU3RyaW5nVG9BcnJheShlbC5nZXRBdHRyaWJ1dGUoJ2NsYXNzJykpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnJlZ2lzdGVyTGlzdGVuZXJzKGVsLCBleHRyYVZhcnMpO1xuICAgICAgdGhpcy5yZXNvbHZlQm91bmRBdHRyaWJ1dGVzKGVsLCB0cnVlLCBleHRyYVZhcnMpO1xuICAgIH1cblxuICAgIHVwZGF0ZUVsZW1lbnRzKHJvb3RFbCwgZXh0cmFWYXJzID0gKCkgPT4ge30pIHtcbiAgICAgIHRoaXMud2Fsa0FuZFNraXBOZXN0ZWRDb21wb25lbnRzKHJvb3RFbCwgZWwgPT4ge1xuICAgICAgICAvLyBEb24ndCB0b3VjaCBzcGF3bnMgZnJvbSBmb3IgbG9vcCAoYW5kIGNoZWNrIGlmIHRoZSByb290IGlzIGFjdHVhbGx5IGEgZm9yIGxvb3AgaW4gYSBwYXJlbnQsIGRvbid0IHNraXAgaXQuKVxuICAgICAgICBpZiAoZWwuX194X2Zvcl9rZXkgIT09IHVuZGVmaW5lZCAmJiAhZWwuaXNTYW1lTm9kZSh0aGlzLiRlbCkpIHJldHVybiBmYWxzZTtcbiAgICAgICAgdGhpcy51cGRhdGVFbGVtZW50KGVsLCBleHRyYVZhcnMpO1xuICAgICAgfSwgZWwgPT4ge1xuICAgICAgICBlbC5fX3ggPSBuZXcgQ29tcG9uZW50KGVsKTtcbiAgICAgIH0pO1xuICAgICAgdGhpcy5leGVjdXRlQW5kQ2xlYXJSZW1haW5pbmdTaG93RGlyZWN0aXZlU3RhY2soKTtcbiAgICAgIHRoaXMuZXhlY3V0ZUFuZENsZWFyTmV4dFRpY2tTdGFjayhyb290RWwpO1xuICAgIH1cblxuICAgIGV4ZWN1dGVBbmRDbGVhck5leHRUaWNrU3RhY2soZWwpIHtcbiAgICAgIC8vIFNraXAgc3Bhd25zIGZyb20gYWxwaW5lIGRpcmVjdGl2ZXNcbiAgICAgIGlmIChlbCA9PT0gdGhpcy4kZWwgJiYgdGhpcy5uZXh0VGlja1N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgLy8gV2UgcnVuIHRoZSB0aWNrIHN0YWNrIGFmdGVyIHRoZSBuZXh0IGZyYW1lIHRvIGFsbG93IGFueVxuICAgICAgICAvLyBydW5uaW5nIHRyYW5zaXRpb25zIHRvIHBhc3MgdGhlIGluaXRpYWwgc2hvdyBzdGFnZS5cbiAgICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKCgpID0+IHtcbiAgICAgICAgICB3aGlsZSAodGhpcy5uZXh0VGlja1N0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHRoaXMubmV4dFRpY2tTdGFjay5zaGlmdCgpKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBleGVjdXRlQW5kQ2xlYXJSZW1haW5pbmdTaG93RGlyZWN0aXZlU3RhY2soKSB7XG4gICAgICAvLyBUaGUgZ29hbCBoZXJlIGlzIHRvIHN0YXJ0IGFsbCB0aGUgeC1zaG93IHRyYW5zaXRpb25zXG4gICAgICAvLyBhbmQgYnVpbGQgYSBuZXN0ZWQgcHJvbWlzZSBjaGFpbiBzbyB0aGF0IGVsZW1lbnRzXG4gICAgICAvLyBvbmx5IGhpZGUgd2hlbiB0aGUgY2hpbGRyZW4gYXJlIGZpbmlzaGVkIGhpZGluZy5cbiAgICAgIHRoaXMuc2hvd0RpcmVjdGl2ZVN0YWNrLnJldmVyc2UoKS5tYXAoaGFuZGxlciA9PiB7XG4gICAgICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgICAgaGFuZGxlcihyZXNvbHZlLCByZWplY3QpO1xuICAgICAgICB9KTtcbiAgICAgIH0pLnJlZHVjZSgocHJvbWlzZUNoYWluLCBwcm9taXNlKSA9PiB7XG4gICAgICAgIHJldHVybiBwcm9taXNlQ2hhaW4udGhlbigoKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIHByb21pc2UudGhlbihmaW5pc2hFbGVtZW50ID0+IHtcbiAgICAgICAgICAgIGZpbmlzaEVsZW1lbnQoKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICB9LCBQcm9taXNlLnJlc29sdmUoKCkgPT4ge30pKS5jYXRjaChlID0+IHtcbiAgICAgICAgaWYgKGUgIT09IFRSQU5TSVRJT05fQ0FOQ0VMTEVEKSB0aHJvdyBlO1xuICAgICAgfSk7IC8vIFdlJ3ZlIHByb2Nlc3NlZCB0aGUgaGFuZGxlciBzdGFjay4gbGV0J3MgY2xlYXIgaXQuXG5cbiAgICAgIHRoaXMuc2hvd0RpcmVjdGl2ZVN0YWNrID0gW107XG4gICAgICB0aGlzLnNob3dEaXJlY3RpdmVMYXN0RWxlbWVudCA9IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICB1cGRhdGVFbGVtZW50KGVsLCBleHRyYVZhcnMpIHtcbiAgICAgIHRoaXMucmVzb2x2ZUJvdW5kQXR0cmlidXRlcyhlbCwgZmFsc2UsIGV4dHJhVmFycyk7XG4gICAgfVxuXG4gICAgcmVnaXN0ZXJMaXN0ZW5lcnMoZWwsIGV4dHJhVmFycykge1xuICAgICAgZ2V0WEF0dHJzKGVsLCB0aGlzKS5mb3JFYWNoKCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBtb2RpZmllcnMsXG4gICAgICAgIGV4cHJlc3Npb25cbiAgICAgIH0pID0+IHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSAnb24nOlxuICAgICAgICAgICAgcmVnaXN0ZXJMaXN0ZW5lcih0aGlzLCBlbCwgdmFsdWUsIG1vZGlmaWVycywgZXhwcmVzc2lvbiwgZXh0cmFWYXJzKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnbW9kZWwnOlxuICAgICAgICAgICAgcmVnaXN0ZXJNb2RlbExpc3RlbmVyKHRoaXMsIGVsLCBtb2RpZmllcnMsIGV4cHJlc3Npb24sIGV4dHJhVmFycyk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmVzb2x2ZUJvdW5kQXR0cmlidXRlcyhlbCwgaW5pdGlhbFVwZGF0ZSA9IGZhbHNlLCBleHRyYVZhcnMpIHtcbiAgICAgIGxldCBhdHRycyA9IGdldFhBdHRycyhlbCwgdGhpcyk7XG4gICAgICBhdHRycy5mb3JFYWNoKCh7XG4gICAgICAgIHR5cGUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBtb2RpZmllcnMsXG4gICAgICAgIGV4cHJlc3Npb25cbiAgICAgIH0pID0+IHtcbiAgICAgICAgc3dpdGNoICh0eXBlKSB7XG4gICAgICAgICAgY2FzZSAnbW9kZWwnOlxuICAgICAgICAgICAgaGFuZGxlQXR0cmlidXRlQmluZGluZ0RpcmVjdGl2ZSh0aGlzLCBlbCwgJ3ZhbHVlJywgZXhwcmVzc2lvbiwgZXh0cmFWYXJzLCB0eXBlLCBtb2RpZmllcnMpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdiaW5kJzpcbiAgICAgICAgICAgIC8vIFRoZSA6a2V5IGJpbmRpbmcgb24gYW4geC1mb3IgaXMgc3BlY2lhbCwgaWdub3JlIGl0LlxuICAgICAgICAgICAgaWYgKGVsLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ3RlbXBsYXRlJyAmJiB2YWx1ZSA9PT0gJ2tleScpIHJldHVybjtcbiAgICAgICAgICAgIGhhbmRsZUF0dHJpYnV0ZUJpbmRpbmdEaXJlY3RpdmUodGhpcywgZWwsIHZhbHVlLCBleHByZXNzaW9uLCBleHRyYVZhcnMsIHR5cGUsIG1vZGlmaWVycyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ3RleHQnOlxuICAgICAgICAgICAgdmFyIG91dHB1dCA9IHRoaXMuZXZhbHVhdGVSZXR1cm5FeHByZXNzaW9uKGVsLCBleHByZXNzaW9uLCBleHRyYVZhcnMpO1xuICAgICAgICAgICAgaGFuZGxlVGV4dERpcmVjdGl2ZShlbCwgb3V0cHV0LCBleHByZXNzaW9uKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnaHRtbCc6XG4gICAgICAgICAgICBoYW5kbGVIdG1sRGlyZWN0aXZlKHRoaXMsIGVsLCBleHByZXNzaW9uLCBleHRyYVZhcnMpO1xuICAgICAgICAgICAgYnJlYWs7XG5cbiAgICAgICAgICBjYXNlICdzaG93JzpcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLmV2YWx1YXRlUmV0dXJuRXhwcmVzc2lvbihlbCwgZXhwcmVzc2lvbiwgZXh0cmFWYXJzKTtcbiAgICAgICAgICAgIGhhbmRsZVNob3dEaXJlY3RpdmUodGhpcywgZWwsIG91dHB1dCwgbW9kaWZpZXJzLCBpbml0aWFsVXBkYXRlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuXG4gICAgICAgICAgY2FzZSAnaWYnOlxuICAgICAgICAgICAgLy8gSWYgdGhpcyBlbGVtZW50IGFsc28gaGFzIHgtZm9yIG9uIGl0LCBkb24ndCBwcm9jZXNzIHgtaWYuXG4gICAgICAgICAgICAvLyBXZSB3aWxsIGxldCB0aGUgXCJ4LWZvclwiIGRpcmVjdGl2ZSBoYW5kbGUgdGhlIFwiaWZcImluZy5cbiAgICAgICAgICAgIGlmIChhdHRycy5zb21lKGkgPT4gaS50eXBlID09PSAnZm9yJykpIHJldHVybjtcbiAgICAgICAgICAgIHZhciBvdXRwdXQgPSB0aGlzLmV2YWx1YXRlUmV0dXJuRXhwcmVzc2lvbihlbCwgZXhwcmVzc2lvbiwgZXh0cmFWYXJzKTtcbiAgICAgICAgICAgIGhhbmRsZUlmRGlyZWN0aXZlKHRoaXMsIGVsLCBvdXRwdXQsIGluaXRpYWxVcGRhdGUsIGV4dHJhVmFycyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2Zvcic6XG4gICAgICAgICAgICBoYW5kbGVGb3JEaXJlY3RpdmUodGhpcywgZWwsIGV4cHJlc3Npb24sIGluaXRpYWxVcGRhdGUsIGV4dHJhVmFycyk7XG4gICAgICAgICAgICBicmVhaztcblxuICAgICAgICAgIGNhc2UgJ2Nsb2FrJzpcbiAgICAgICAgICAgIGVsLnJlbW92ZUF0dHJpYnV0ZSgneC1jbG9haycpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cblxuICAgIGV2YWx1YXRlUmV0dXJuRXhwcmVzc2lvbihlbCwgZXhwcmVzc2lvbiwgZXh0cmFWYXJzID0gKCkgPT4ge30pIHtcbiAgICAgIHJldHVybiBzYWZlckV2YWwoZXhwcmVzc2lvbiwgdGhpcy4kZGF0YSwgX29iamVjdFNwcmVhZDIoX29iamVjdFNwcmVhZDIoe30sIGV4dHJhVmFycygpKSwge30sIHtcbiAgICAgICAgJGRpc3BhdGNoOiB0aGlzLmdldERpc3BhdGNoRnVuY3Rpb24oZWwpXG4gICAgICB9KSk7XG4gICAgfVxuXG4gICAgZXZhbHVhdGVDb21tYW5kRXhwcmVzc2lvbihlbCwgZXhwcmVzc2lvbiwgZXh0cmFWYXJzID0gKCkgPT4ge30pIHtcbiAgICAgIHJldHVybiBzYWZlckV2YWxOb1JldHVybihleHByZXNzaW9uLCB0aGlzLiRkYXRhLCBfb2JqZWN0U3ByZWFkMihfb2JqZWN0U3ByZWFkMih7fSwgZXh0cmFWYXJzKCkpLCB7fSwge1xuICAgICAgICAkZGlzcGF0Y2g6IHRoaXMuZ2V0RGlzcGF0Y2hGdW5jdGlvbihlbClcbiAgICAgIH0pKTtcbiAgICB9XG5cbiAgICBnZXREaXNwYXRjaEZ1bmN0aW9uKGVsKSB7XG4gICAgICByZXR1cm4gKGV2ZW50LCBkZXRhaWwgPSB7fSkgPT4ge1xuICAgICAgICBlbC5kaXNwYXRjaEV2ZW50KG5ldyBDdXN0b21FdmVudChldmVudCwge1xuICAgICAgICAgIGRldGFpbCxcbiAgICAgICAgICBidWJibGVzOiB0cnVlXG4gICAgICAgIH0pKTtcbiAgICAgIH07XG4gICAgfVxuXG4gICAgbGlzdGVuRm9yTmV3RWxlbWVudHNUb0luaXRpYWxpemUoKSB7XG4gICAgICBjb25zdCB0YXJnZXROb2RlID0gdGhpcy4kZWw7XG4gICAgICBjb25zdCBvYnNlcnZlck9wdGlvbnMgPSB7XG4gICAgICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICAgICAgYXR0cmlidXRlczogdHJ1ZSxcbiAgICAgICAgc3VidHJlZTogdHJ1ZVxuICAgICAgfTtcbiAgICAgIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIobXV0YXRpb25zID0+IHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtdXRhdGlvbnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAvLyBGaWx0ZXIgb3V0IG11dGF0aW9ucyB0cmlnZ2VyZWQgZnJvbSBjaGlsZCBjb21wb25lbnRzLlxuICAgICAgICAgIGNvbnN0IGNsb3Nlc3RQYXJlbnRDb21wb25lbnQgPSBtdXRhdGlvbnNbaV0udGFyZ2V0LmNsb3Nlc3QoJ1t4LWRhdGFdJyk7XG4gICAgICAgICAgaWYgKCEoY2xvc2VzdFBhcmVudENvbXBvbmVudCAmJiBjbG9zZXN0UGFyZW50Q29tcG9uZW50LmlzU2FtZU5vZGUodGhpcy4kZWwpKSkgY29udGludWU7XG5cbiAgICAgICAgICBpZiAobXV0YXRpb25zW2ldLnR5cGUgPT09ICdhdHRyaWJ1dGVzJyAmJiBtdXRhdGlvbnNbaV0uYXR0cmlidXRlTmFtZSA9PT0gJ3gtZGF0YScpIHtcbiAgICAgICAgICAgIGNvbnN0IHJhd0RhdGEgPSBzYWZlckV2YWwobXV0YXRpb25zW2ldLnRhcmdldC5nZXRBdHRyaWJ1dGUoJ3gtZGF0YScpIHx8ICd7fScsIHtcbiAgICAgICAgICAgICAgJGVsOiB0aGlzLiRlbFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBPYmplY3Qua2V5cyhyYXdEYXRhKS5mb3JFYWNoKGtleSA9PiB7XG4gICAgICAgICAgICAgIGlmICh0aGlzLiRkYXRhW2tleV0gIT09IHJhd0RhdGFba2V5XSkge1xuICAgICAgICAgICAgICAgIHRoaXMuJGRhdGFba2V5XSA9IHJhd0RhdGFba2V5XTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKG11dGF0aW9uc1tpXS5hZGRlZE5vZGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIG11dGF0aW9uc1tpXS5hZGRlZE5vZGVzLmZvckVhY2gobm9kZSA9PiB7XG4gICAgICAgICAgICAgIGlmIChub2RlLm5vZGVUeXBlICE9PSAxIHx8IG5vZGUuX194X2luc2VydGVkX21lKSByZXR1cm47XG5cbiAgICAgICAgICAgICAgaWYgKG5vZGUubWF0Y2hlcygnW3gtZGF0YV0nKSAmJiAhbm9kZS5fX3gpIHtcbiAgICAgICAgICAgICAgICBub2RlLl9feCA9IG5ldyBDb21wb25lbnQobm9kZSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgdGhpcy5pbml0aWFsaXplRWxlbWVudHMobm9kZSk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlLCBvYnNlcnZlck9wdGlvbnMpO1xuICAgIH1cblxuICAgIGdldFJlZnNQcm94eSgpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciByZWZPYmogPSB7fTtcbiAgICAgIC8vIE9uZSBvZiB0aGUgZ29hbHMgb2YgdGhpcyBpcyB0byBub3QgaG9sZCBlbGVtZW50cyBpbiBtZW1vcnksIGJ1dCByYXRoZXIgcmUtZXZhbHVhdGVcbiAgICAgIC8vIHRoZSBET00gd2hlbiB0aGUgc3lzdGVtIG5lZWRzIHNvbWV0aGluZyBmcm9tIGl0LiBUaGlzIHdheSwgdGhlIGZyYW1ld29yayBpcyBmbGV4aWJsZSBhbmRcbiAgICAgIC8vIGZyaWVuZGx5IHRvIG91dHNpZGUgRE9NIGNoYW5nZXMgZnJvbSBsaWJyYXJpZXMgbGlrZSBWdWUvTGl2ZXdpcmUuXG4gICAgICAvLyBGb3IgdGhpcyByZWFzb24sIEknbSB1c2luZyBhbiBcIm9uLWRlbWFuZFwiIHByb3h5IHRvIGZha2UgYSBcIiRyZWZzXCIgb2JqZWN0LlxuXG4gICAgICByZXR1cm4gbmV3IFByb3h5KHJlZk9iaiwge1xuICAgICAgICBnZXQob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgICAgICAgIGlmIChwcm9wZXJ0eSA9PT0gJyRpc0FscGluZVByb3h5JykgcmV0dXJuIHRydWU7XG4gICAgICAgICAgdmFyIHJlZjsgLy8gV2UgY2FuJ3QganVzdCBxdWVyeSB0aGUgRE9NIGJlY2F1c2UgaXQncyBoYXJkIHRvIGZpbHRlciBvdXQgcmVmcyBpblxuICAgICAgICAgIC8vIG5lc3RlZCBjb21wb25lbnRzLlxuXG4gICAgICAgICAgc2VsZi53YWxrQW5kU2tpcE5lc3RlZENvbXBvbmVudHMoc2VsZi4kZWwsIGVsID0+IHtcbiAgICAgICAgICAgIGlmIChlbC5oYXNBdHRyaWJ1dGUoJ3gtcmVmJykgJiYgZWwuZ2V0QXR0cmlidXRlKCd4LXJlZicpID09PSBwcm9wZXJ0eSkge1xuICAgICAgICAgICAgICByZWYgPSBlbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KTtcbiAgICAgICAgICByZXR1cm4gcmVmO1xuICAgICAgICB9XG5cbiAgICAgIH0pO1xuICAgIH1cblxuICB9XG5cbiAgY29uc3QgQWxwaW5lID0ge1xuICAgIHZlcnNpb246IFwiMi43LjNcIixcbiAgICBwYXVzZU11dGF0aW9uT2JzZXJ2ZXI6IGZhbHNlLFxuICAgIG1hZ2ljUHJvcGVydGllczoge30sXG4gICAgb25Db21wb25lbnRJbml0aWFsaXplZHM6IFtdLFxuICAgIG9uQmVmb3JlQ29tcG9uZW50SW5pdGlhbGl6ZWRzOiBbXSxcbiAgICBpZ25vcmVGb2N1c2VkRm9yVmFsdWVCaW5kaW5nOiBmYWxzZSxcbiAgICBzdGFydDogYXN5bmMgZnVuY3Rpb24gc3RhcnQoKSB7XG4gICAgICBpZiAoIWlzVGVzdGluZygpKSB7XG4gICAgICAgIGF3YWl0IGRvbVJlYWR5KCk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMuZGlzY292ZXJDb21wb25lbnRzKGVsID0+IHtcbiAgICAgICAgdGhpcy5pbml0aWFsaXplQ29tcG9uZW50KGVsKTtcbiAgICAgIH0pOyAvLyBJdCdzIGVhc2llciBhbmQgbW9yZSBwZXJmb3JtYW50IHRvIGp1c3Qgc3VwcG9ydCBUdXJib2xpbmtzIHRoYW4gbGlzdGVuXG4gICAgICAvLyB0byBNdXRhdGlvbk9ic2VydmVyIG11dGF0aW9ucyBhdCB0aGUgZG9jdW1lbnQgbGV2ZWwuXG5cbiAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJ0dXJib2xpbmtzOmxvYWRcIiwgKCkgPT4ge1xuICAgICAgICB0aGlzLmRpc2NvdmVyVW5pbml0aWFsaXplZENvbXBvbmVudHMoZWwgPT4ge1xuICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbXBvbmVudChlbCk7XG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLmxpc3RlbkZvck5ld1VuaW5pdGlhbGl6ZWRDb21wb25lbnRzQXRSdW5UaW1lKCk7XG4gICAgfSxcbiAgICBkaXNjb3ZlckNvbXBvbmVudHM6IGZ1bmN0aW9uIGRpc2NvdmVyQ29tcG9uZW50cyhjYWxsYmFjaykge1xuICAgICAgY29uc3Qgcm9vdEVscyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1t4LWRhdGFdJyk7XG4gICAgICByb290RWxzLmZvckVhY2gocm9vdEVsID0+IHtcbiAgICAgICAgY2FsbGJhY2socm9vdEVsKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgZGlzY292ZXJVbmluaXRpYWxpemVkQ29tcG9uZW50czogZnVuY3Rpb24gZGlzY292ZXJVbmluaXRpYWxpemVkQ29tcG9uZW50cyhjYWxsYmFjaywgZWwgPSBudWxsKSB7XG4gICAgICBjb25zdCByb290RWxzID0gKGVsIHx8IGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKCdbeC1kYXRhXScpO1xuICAgICAgQXJyYXkuZnJvbShyb290RWxzKS5maWx0ZXIoZWwgPT4gZWwuX194ID09PSB1bmRlZmluZWQpLmZvckVhY2gocm9vdEVsID0+IHtcbiAgICAgICAgY2FsbGJhY2socm9vdEVsKTtcbiAgICAgIH0pO1xuICAgIH0sXG4gICAgbGlzdGVuRm9yTmV3VW5pbml0aWFsaXplZENvbXBvbmVudHNBdFJ1blRpbWU6IGZ1bmN0aW9uIGxpc3RlbkZvck5ld1VuaW5pdGlhbGl6ZWRDb21wb25lbnRzQXRSdW5UaW1lKCkge1xuICAgICAgY29uc3QgdGFyZ2V0Tm9kZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2JvZHknKTtcbiAgICAgIGNvbnN0IG9ic2VydmVyT3B0aW9ucyA9IHtcbiAgICAgICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgICAgICBhdHRyaWJ1dGVzOiB0cnVlLFxuICAgICAgICBzdWJ0cmVlOiB0cnVlXG4gICAgICB9O1xuICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcihtdXRhdGlvbnMgPT4ge1xuICAgICAgICBpZiAodGhpcy5wYXVzZU11dGF0aW9uT2JzZXJ2ZXIpIHJldHVybjtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG11dGF0aW9ucy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGlmIChtdXRhdGlvbnNbaV0uYWRkZWROb2Rlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBtdXRhdGlvbnNbaV0uYWRkZWROb2Rlcy5mb3JFYWNoKG5vZGUgPT4ge1xuICAgICAgICAgICAgICAvLyBEaXNjYXJkIG5vbi1lbGVtZW50IG5vZGVzIChsaWtlIGxpbmUtYnJlYWtzKVxuICAgICAgICAgICAgICBpZiAobm9kZS5ub2RlVHlwZSAhPT0gMSkgcmV0dXJuOyAvLyBEaXNjYXJkIGFueSBjaGFuZ2VzIGhhcHBlbmluZyB3aXRoaW4gYW4gZXhpc3RpbmcgY29tcG9uZW50LlxuICAgICAgICAgICAgICAvLyBUaGV5IHdpbGwgdGFrZSBjYXJlIG9mIHRoZW1zZWx2ZXMuXG5cbiAgICAgICAgICAgICAgaWYgKG5vZGUucGFyZW50RWxlbWVudCAmJiBub2RlLnBhcmVudEVsZW1lbnQuY2xvc2VzdCgnW3gtZGF0YV0nKSkgcmV0dXJuO1xuICAgICAgICAgICAgICB0aGlzLmRpc2NvdmVyVW5pbml0aWFsaXplZENvbXBvbmVudHMoZWwgPT4ge1xuICAgICAgICAgICAgICAgIHRoaXMuaW5pdGlhbGl6ZUNvbXBvbmVudChlbCk7XG4gICAgICAgICAgICAgIH0sIG5vZGUucGFyZW50RWxlbWVudCk7XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZSh0YXJnZXROb2RlLCBvYnNlcnZlck9wdGlvbnMpO1xuICAgIH0sXG4gICAgaW5pdGlhbGl6ZUNvbXBvbmVudDogZnVuY3Rpb24gaW5pdGlhbGl6ZUNvbXBvbmVudChlbCkge1xuICAgICAgaWYgKCFlbC5fX3gpIHtcbiAgICAgICAgLy8gV3JhcCBpbiBhIHRyeS9jYXRjaCBzbyB0aGF0IHdlIGRvbid0IHByZXZlbnQgb3RoZXIgY29tcG9uZW50c1xuICAgICAgICAvLyBmcm9tIGluaXRpYWxpemluZyB3aGVuIG9uZSBjb21wb25lbnQgY29udGFpbnMgYW4gZXJyb3IuXG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgZWwuX194ID0gbmV3IENvbXBvbmVudChlbCk7XG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgICAgICB0aHJvdyBlcnJvcjtcbiAgICAgICAgICB9LCAwKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2xvbmU6IGZ1bmN0aW9uIGNsb25lKGNvbXBvbmVudCwgbmV3RWwpIHtcbiAgICAgIGlmICghbmV3RWwuX194KSB7XG4gICAgICAgIG5ld0VsLl9feCA9IG5ldyBDb21wb25lbnQobmV3RWwsIGNvbXBvbmVudCk7XG4gICAgICB9XG4gICAgfSxcbiAgICBhZGRNYWdpY1Byb3BlcnR5OiBmdW5jdGlvbiBhZGRNYWdpY1Byb3BlcnR5KG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgICB0aGlzLm1hZ2ljUHJvcGVydGllc1tuYW1lXSA9IGNhbGxiYWNrO1xuICAgIH0sXG4gICAgb25Db21wb25lbnRJbml0aWFsaXplZDogZnVuY3Rpb24gb25Db21wb25lbnRJbml0aWFsaXplZChjYWxsYmFjaykge1xuICAgICAgdGhpcy5vbkNvbXBvbmVudEluaXRpYWxpemVkcy5wdXNoKGNhbGxiYWNrKTtcbiAgICB9LFxuICAgIG9uQmVmb3JlQ29tcG9uZW50SW5pdGlhbGl6ZWQ6IGZ1bmN0aW9uIG9uQmVmb3JlQ29tcG9uZW50SW5pdGlhbGl6ZWQoY2FsbGJhY2spIHtcbiAgICAgIHRoaXMub25CZWZvcmVDb21wb25lbnRJbml0aWFsaXplZHMucHVzaChjYWxsYmFjayk7XG4gICAgfVxuICB9O1xuXG4gIGlmICghaXNUZXN0aW5nKCkpIHtcbiAgICB3aW5kb3cuQWxwaW5lID0gQWxwaW5lO1xuXG4gICAgaWYgKHdpbmRvdy5kZWZlckxvYWRpbmdBbHBpbmUpIHtcbiAgICAgIHdpbmRvdy5kZWZlckxvYWRpbmdBbHBpbmUoZnVuY3Rpb24gKCkge1xuICAgICAgICB3aW5kb3cuQWxwaW5lLnN0YXJ0KCk7XG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd2luZG93LkFscGluZS5zdGFydCgpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBBbHBpbmU7XG5cbn0pKSk7XG4iLCJpbXBvcnQgJ2FscGluZWpzJ1xuaW1wb3J0IFR1cmJvbGlua3MgZnJvbSAndHVyYm9saW5rcydcblxuVHVyYm9saW5rcy5zdGFydCgpXG5cblR1cmJvbGlua3Muc2Nyb2xsID0ge31cblxud2luZG93LmluaXRpYWxpemVTZWFyY2ggPSBmdW5jdGlvbiAoKSB7XG4gIFByb21pc2UuYWxsKFtcbiAgICBpbXBvcnQoLyogd2VicGFja0NodW5rTmFtZTogXCJkb2NzZWFyY2hcIiAqLyAnQGRvY3NlYXJjaC9qcycpLFxuICAgIGltcG9ydCgvKiB3ZWJwYWNrQ2h1bmtOYW1lOiBcImRvY3NlYXJjaFwiICovICdAZG9jc2VhcmNoL2NzcycpLFxuICBdKS50aGVuKChbZG9jc2VhcmNoXSkgPT4ge1xuICAgIGRvY3NlYXJjaC5kZWZhdWx0KHtcbiAgICAgIGNvbnRhaW5lcjogJyNkb2NzZWFyY2gnLFxuICAgIH0pXG4gIH0pXG59XG5cbndpbmRvdy5pbml0aWFsaXplQ29kZWdyb3VwcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICBhY3RpdmVUYWI6IDEsXG4gICAgY2hhbmdlVGFiKGluZGV4LCBlbGVtZW50KSB7XG4gICAgICB0aGlzLiRyZWZzLmhpZ2hsaWdodGVyLnN0eWxlLmxlZnQgPSBgJHtlbGVtZW50Lm9mZnNldExlZnR9cHhgXG4gICAgICB0aGlzLiRyZWZzLmhpZ2hsaWdodGVyLnN0eWxlLndpZHRoID0gYCR7ZWxlbWVudC5jbGllbnRXaWR0aH1weGBcbiAgICAgIHRoaXMuYWN0aXZlVGFiID0gaW5kZXhcbiAgICB9LFxuICAgIG1vdW50ZWQoKSB7XG4gICAgICB0aGlzLmNoYW5nZVRhYigxLCB0aGlzLiRyZWZzLmZpcnN0VGFiKVxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XG4gICAgICAgIGlmICh0aGlzLiRlbC5jbGFzc0xpc3QpIHtcbiAgICAgICAgICB0aGlzLiRlbC5jbGFzc0xpc3QuYWRkKCdyZWFkeScpXG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfSxcbiAgfVxufVxuXG53aW5kb3cuaW5pdGlhbGl6ZUludGVyc2VjdGlvbk9ic2VydmVyID0gZnVuY3Rpb24gKGVsZW1lbnRzQ29udGFpbmVyLCBsaW5rc0NvbnRhaW5lciwgYWN0aXZlQ2xhc3MpIHtcbiAgcmV0dXJuIHtcbiAgICBtb3VudGVkKCkge1xuICAgICAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgSW50ZXJzZWN0aW9uT2JzZXJ2ZXIoXG4gICAgICAgIChlbnRyaWVzKSA9PiB7XG4gICAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xuICAgICAgICAgICAgaWYgKGVudHJ5LmlzSW50ZXJzZWN0aW5nICYmIGVudHJ5LmludGVyc2VjdGlvblJhdGlvID49IDEuMCkge1xuICAgICAgICAgICAgICBjb25zdCBpZCA9IGVudHJ5LnRhcmdldC5nZXRBdHRyaWJ1dGUoJ2lkJylcbiAgICAgICAgICAgICAgY29uc3QgZXhpc3RpbmdBY3RpdmUgPSB0aGlzLiRlbC5xdWVyeVNlbGVjdG9yKGAke2xpbmtzQ29udGFpbmVyfSAuJHthY3RpdmVDbGFzc31gKVxuICAgICAgICAgICAgICBpZiAoZXhpc3RpbmdBY3RpdmUpIHtcbiAgICAgICAgICAgICAgICBleGlzdGluZ0FjdGl2ZS5jbGFzc0xpc3QucmVtb3ZlKGFjdGl2ZUNsYXNzKVxuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY29uc3QgbmV3TGluayA9IHRoaXMuJGVsLnF1ZXJ5U2VsZWN0b3IoYCR7bGlua3NDb250YWluZXJ9IFtocmVmPVwiIyR7aWR9XCJdYClcbiAgICAgICAgICAgICAgaWYgKG5ld0xpbmspIHtcbiAgICAgICAgICAgICAgICBuZXdMaW5rLmNsYXNzTGlzdC5hZGQoYWN0aXZlQ2xhc3MpXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9LFxuICAgICAgICB7IHRocmVzaG9sZDogMS4wLCByb290TWFyZ2luOiAnMHB4JyB9XG4gICAgICApXG5cbiAgICAgIGNvbnN0IHN1YnNlY3Rpb25zID0gdGhpcy4kZWwucXVlcnlTZWxlY3RvckFsbChlbGVtZW50c0NvbnRhaW5lcilcbiAgICAgIHN1YnNlY3Rpb25zLmZvckVhY2goKHN1YnNlY3Rpb24pID0+IHtcbiAgICAgICAgb2JzZXJ2ZXIub2JzZXJ2ZShzdWJzZWN0aW9uKVxuICAgICAgfSlcbiAgICB9LFxuICB9XG59XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ3R1cmJvbGlua3M6cmVuZGVyJywgZnVuY3Rpb24gKCkge1xuICBjb25zdCBzaWRlYmFyID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLnNpZGViYXInKVxuICBsZXQgdG9wID0gVHVyYm9saW5rcy5zY3JvbGxbJ3RvcCddXG4gIGlmICh0b3ApIHtcbiAgICBzaWRlYmFyLnNjcm9sbFRvKDAsIHRvcClcbiAgfVxufSlcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcigndHVyYm9saW5rczpjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgY29uc3Qgc2lkZWJhciA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zaWRlYmFyJylcbiAgVHVyYm9saW5rcy5zY3JvbGxbJ3RvcCddID0gc2lkZWJhci5zY3JvbGxUb3Bcbn0pXG4iLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW5cbmV4cG9ydCB7fTsiLCIvKlxuVHVyYm9saW5rcyA1LjIuMFxuQ29weXJpZ2h0IMKpIDIwMTggQmFzZWNhbXAsIExMQ1xuICovXG4oZnVuY3Rpb24oKXt2YXIgdD10aGlzOyhmdW5jdGlvbigpeyhmdW5jdGlvbigpe3RoaXMuVHVyYm9saW5rcz17c3VwcG9ydGVkOmZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPXdpbmRvdy5oaXN0b3J5LnB1c2hTdGF0ZSYmbnVsbCE9d2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSYmbnVsbCE9d2luZG93LmFkZEV2ZW50TGlzdGVuZXJ9KCksdmlzaXQ6ZnVuY3Rpb24odCxyKXtyZXR1cm4gZS5jb250cm9sbGVyLnZpc2l0KHQscil9LGNsZWFyQ2FjaGU6ZnVuY3Rpb24oKXtyZXR1cm4gZS5jb250cm9sbGVyLmNsZWFyQ2FjaGUoKX0sc2V0UHJvZ3Jlc3NCYXJEZWxheTpmdW5jdGlvbih0KXtyZXR1cm4gZS5jb250cm9sbGVyLnNldFByb2dyZXNzQmFyRGVsYXkodCl9fX0pLmNhbGwodGhpcyl9KS5jYWxsKHQpO3ZhciBlPXQuVHVyYm9saW5rczsoZnVuY3Rpb24oKXsoZnVuY3Rpb24oKXt2YXIgdCxyLG4sbz1bXS5zbGljZTtlLmNvcHlPYmplY3Q9ZnVuY3Rpb24odCl7dmFyIGUscixuO3I9e307Zm9yKGUgaW4gdCluPXRbZV0scltlXT1uO3JldHVybiByfSxlLmNsb3Nlc3Q9ZnVuY3Rpb24oZSxyKXtyZXR1cm4gdC5jYWxsKGUscil9LHQ9ZnVuY3Rpb24oKXt2YXIgdCxlO3JldHVybiB0PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxudWxsIT0oZT10LmNsb3Nlc3QpP2U6ZnVuY3Rpb24odCl7dmFyIGU7Zm9yKGU9dGhpcztlOyl7aWYoZS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFJiZyLmNhbGwoZSx0KSlyZXR1cm4gZTtlPWUucGFyZW50Tm9kZX19fSgpLGUuZGVmZXI9ZnVuY3Rpb24odCl7cmV0dXJuIHNldFRpbWVvdXQodCwxKX0sZS50aHJvdHRsZT1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gZT1udWxsLGZ1bmN0aW9uKCl7dmFyIHI7cmV0dXJuIHI9MTw9YXJndW1lbnRzLmxlbmd0aD9vLmNhbGwoYXJndW1lbnRzLDApOltdLG51bGwhPWU/ZTplPXJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbihuKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZT1udWxsLHQuYXBwbHkobixyKX19KHRoaXMpKX19LGUuZGlzcGF0Y2g9ZnVuY3Rpb24odCxlKXt2YXIgcixvLGkscyxhLHU7cmV0dXJuIGE9bnVsbCE9ZT9lOnt9LHU9YS50YXJnZXQscj1hLmNhbmNlbGFibGUsbz1hLmRhdGEsaT1kb2N1bWVudC5jcmVhdGVFdmVudChcIkV2ZW50c1wiKSxpLmluaXRFdmVudCh0LCEwLHI9PT0hMCksaS5kYXRhPW51bGwhPW8/bzp7fSxpLmNhbmNlbGFibGUmJiFuJiYocz1pLnByZXZlbnREZWZhdWx0LGkucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kZWZhdWx0UHJldmVudGVkfHxPYmplY3QuZGVmaW5lUHJvcGVydHkodGhpcyxcImRlZmF1bHRQcmV2ZW50ZWRcIix7Z2V0OmZ1bmN0aW9uKCl7cmV0dXJuITB9fSkscy5jYWxsKHRoaXMpfSksKG51bGwhPXU/dTpkb2N1bWVudCkuZGlzcGF0Y2hFdmVudChpKSxpfSxuPWZ1bmN0aW9uKCl7dmFyIHQ7cmV0dXJuIHQ9ZG9jdW1lbnQuY3JlYXRlRXZlbnQoXCJFdmVudHNcIiksdC5pbml0RXZlbnQoXCJ0ZXN0XCIsITAsITApLHQucHJldmVudERlZmF1bHQoKSx0LmRlZmF1bHRQcmV2ZW50ZWR9KCksZS5tYXRjaD1mdW5jdGlvbih0LGUpe3JldHVybiByLmNhbGwodCxlKX0scj1mdW5jdGlvbigpe3ZhciB0LGUscixuO3JldHVybiB0PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudCxudWxsIT0oZT1udWxsIT0ocj1udWxsIT0obj10Lm1hdGNoZXNTZWxlY3Rvcik/bjp0LndlYmtpdE1hdGNoZXNTZWxlY3Rvcik/cjp0Lm1zTWF0Y2hlc1NlbGVjdG9yKT9lOnQubW96TWF0Y2hlc1NlbGVjdG9yfSgpLGUudXVpZD1mdW5jdGlvbigpe3ZhciB0LGUscjtmb3Iocj1cIlwiLHQ9ZT0xOzM2Pj1lO3Q9KytlKXIrPTk9PT10fHwxND09PXR8fDE5PT09dHx8MjQ9PT10P1wiLVwiOjE1PT09dD9cIjRcIjoyMD09PXQ/KE1hdGguZmxvb3IoNCpNYXRoLnJhbmRvbSgpKSs4KS50b1N0cmluZygxNik6TWF0aC5mbG9vcigxNSpNYXRoLnJhbmRvbSgpKS50b1N0cmluZygxNik7cmV0dXJuIHJ9fSkuY2FsbCh0aGlzKSxmdW5jdGlvbigpe2UuTG9jYXRpb249ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQpe3ZhciBlLHI7bnVsbD09dCYmKHQ9XCJcIikscj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYVwiKSxyLmhyZWY9dC50b1N0cmluZygpLHRoaXMuYWJzb2x1dGVVUkw9ci5ocmVmLGU9ci5oYXNoLmxlbmd0aCwyPmU/dGhpcy5yZXF1ZXN0VVJMPXRoaXMuYWJzb2x1dGVVUkw6KHRoaXMucmVxdWVzdFVSTD10aGlzLmFic29sdXRlVVJMLnNsaWNlKDAsLWUpLHRoaXMuYW5jaG9yPXIuaGFzaC5zbGljZSgxKSl9dmFyIGUscixuLG87cmV0dXJuIHQud3JhcD1mdW5jdGlvbih0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIHRoaXM/dDpuZXcgdGhpcyh0KX0sdC5wcm90b3R5cGUuZ2V0T3JpZ2luPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYWJzb2x1dGVVUkwuc3BsaXQoXCIvXCIsMykuam9pbihcIi9cIil9LHQucHJvdG90eXBlLmdldFBhdGg9ZnVuY3Rpb24oKXt2YXIgdCxlO3JldHVybiBudWxsIT0odD1udWxsIT0oZT10aGlzLnJlcXVlc3RVUkwubWF0Y2goL1xcL1xcL1teXFwvXSooXFwvW14/O10qKS8pKT9lWzFdOnZvaWQgMCk/dDpcIi9cIn0sdC5wcm90b3R5cGUuZ2V0UGF0aENvbXBvbmVudHM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRQYXRoKCkuc3BsaXQoXCIvXCIpLnNsaWNlKDEpfSx0LnByb3RvdHlwZS5nZXRMYXN0UGF0aENvbXBvbmVudD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFBhdGhDb21wb25lbnRzKCkuc2xpY2UoLTEpWzBdfSx0LnByb3RvdHlwZS5nZXRFeHRlbnNpb249ZnVuY3Rpb24oKXt2YXIgdCxlO3JldHVybiBudWxsIT0odD1udWxsIT0oZT10aGlzLmdldExhc3RQYXRoQ29tcG9uZW50KCkubWF0Y2goL1xcLlteLl0qJC8pKT9lWzBdOnZvaWQgMCk/dDpcIlwifSx0LnByb3RvdHlwZS5pc0hUTUw9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRFeHRlbnNpb24oKS5tYXRjaCgvXig/OnxcXC4oPzpodG18aHRtbHx4aHRtbCkpJC8pfSx0LnByb3RvdHlwZS5pc1ByZWZpeGVkQnk9ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuIGU9cih0KSx0aGlzLmlzRXF1YWxUbyh0KXx8byh0aGlzLmFic29sdXRlVVJMLGUpfSx0LnByb3RvdHlwZS5pc0VxdWFsVG89ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuYWJzb2x1dGVVUkw9PT0obnVsbCE9dD90LmFic29sdXRlVVJMOnZvaWQgMCl9LHQucHJvdG90eXBlLnRvQ2FjaGVLZXk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5yZXF1ZXN0VVJMfSx0LnByb3RvdHlwZS50b0pTT049ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hYnNvbHV0ZVVSTH0sdC5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hYnNvbHV0ZVVSTH0sdC5wcm90b3R5cGUudmFsdWVPZj1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFic29sdXRlVVJMfSxyPWZ1bmN0aW9uKHQpe3JldHVybiBlKHQuZ2V0T3JpZ2luKCkrdC5nZXRQYXRoKCkpfSxlPWZ1bmN0aW9uKHQpe3JldHVybiBuKHQsXCIvXCIpP3Q6dCtcIi9cIn0sbz1mdW5jdGlvbih0LGUpe3JldHVybiB0LnNsaWNlKDAsZS5sZW5ndGgpPT09ZX0sbj1mdW5jdGlvbih0LGUpe3JldHVybiB0LnNsaWNlKC1lLmxlbmd0aCk9PT1lfSx0fSgpfS5jYWxsKHRoaXMpLGZ1bmN0aW9uKCl7dmFyIHQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdC5hcHBseShlLGFyZ3VtZW50cyl9fTtlLkh0dHBSZXF1ZXN0PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihyLG4sbyl7dGhpcy5kZWxlZ2F0ZT1yLHRoaXMucmVxdWVzdENhbmNlbGVkPXQodGhpcy5yZXF1ZXN0Q2FuY2VsZWQsdGhpcyksdGhpcy5yZXF1ZXN0VGltZWRPdXQ9dCh0aGlzLnJlcXVlc3RUaW1lZE91dCx0aGlzKSx0aGlzLnJlcXVlc3RGYWlsZWQ9dCh0aGlzLnJlcXVlc3RGYWlsZWQsdGhpcyksdGhpcy5yZXF1ZXN0TG9hZGVkPXQodGhpcy5yZXF1ZXN0TG9hZGVkLHRoaXMpLHRoaXMucmVxdWVzdFByb2dyZXNzZWQ9dCh0aGlzLnJlcXVlc3RQcm9ncmVzc2VkLHRoaXMpLHRoaXMudXJsPWUuTG9jYXRpb24ud3JhcChuKS5yZXF1ZXN0VVJMLHRoaXMucmVmZXJyZXI9ZS5Mb2NhdGlvbi53cmFwKG8pLmFic29sdXRlVVJMLHRoaXMuY3JlYXRlWEhSKCl9cmV0dXJuIHIuTkVUV09SS19GQUlMVVJFPTAsci5USU1FT1VUX0ZBSUxVUkU9LTEsci50aW1lb3V0PTYwLHIucHJvdG90eXBlLnNlbmQ9ZnVuY3Rpb24oKXt2YXIgdDtyZXR1cm4gdGhpcy54aHImJiF0aGlzLnNlbnQ/KHRoaXMubm90aWZ5QXBwbGljYXRpb25CZWZvcmVSZXF1ZXN0U3RhcnQoKSx0aGlzLnNldFByb2dyZXNzKDApLHRoaXMueGhyLnNlbmQoKSx0aGlzLnNlbnQ9ITAsXCJmdW5jdGlvblwiPT10eXBlb2YodD10aGlzLmRlbGVnYXRlKS5yZXF1ZXN0U3RhcnRlZD90LnJlcXVlc3RTdGFydGVkKCk6dm9pZCAwKTp2b2lkIDB9LHIucHJvdG90eXBlLmNhbmNlbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnhociYmdGhpcy5zZW50P3RoaXMueGhyLmFib3J0KCk6dm9pZCAwfSxyLnByb3RvdHlwZS5yZXF1ZXN0UHJvZ3Jlc3NlZD1mdW5jdGlvbih0KXtyZXR1cm4gdC5sZW5ndGhDb21wdXRhYmxlP3RoaXMuc2V0UHJvZ3Jlc3ModC5sb2FkZWQvdC50b3RhbCk6dm9pZCAwfSxyLnByb3RvdHlwZS5yZXF1ZXN0TG9hZGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZW5kUmVxdWVzdChmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgZTtyZXR1cm4gMjAwPD0oZT10Lnhoci5zdGF0dXMpJiYzMDA+ZT90LmRlbGVnYXRlLnJlcXVlc3RDb21wbGV0ZWRXaXRoUmVzcG9uc2UodC54aHIucmVzcG9uc2VUZXh0LHQueGhyLmdldFJlc3BvbnNlSGVhZGVyKFwiVHVyYm9saW5rcy1Mb2NhdGlvblwiKSk6KHQuZmFpbGVkPSEwLHQuZGVsZWdhdGUucmVxdWVzdEZhaWxlZFdpdGhTdGF0dXNDb2RlKHQueGhyLnN0YXR1cyx0Lnhoci5yZXNwb25zZVRleHQpKX19KHRoaXMpKX0sci5wcm90b3R5cGUucmVxdWVzdEZhaWxlZD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmVuZFJlcXVlc3QoZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQuZmFpbGVkPSEwLHQuZGVsZWdhdGUucmVxdWVzdEZhaWxlZFdpdGhTdGF0dXNDb2RlKHQuY29uc3RydWN0b3IuTkVUV09SS19GQUlMVVJFKX19KHRoaXMpKX0sci5wcm90b3R5cGUucmVxdWVzdFRpbWVkT3V0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZW5kUmVxdWVzdChmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdC5mYWlsZWQ9ITAsdC5kZWxlZ2F0ZS5yZXF1ZXN0RmFpbGVkV2l0aFN0YXR1c0NvZGUodC5jb25zdHJ1Y3Rvci5USU1FT1VUX0ZBSUxVUkUpfX0odGhpcykpfSxyLnByb3RvdHlwZS5yZXF1ZXN0Q2FuY2VsZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbmRSZXF1ZXN0KCl9LHIucHJvdG90eXBlLm5vdGlmeUFwcGxpY2F0aW9uQmVmb3JlUmVxdWVzdFN0YXJ0PWZ1bmN0aW9uKCl7cmV0dXJuIGUuZGlzcGF0Y2goXCJ0dXJib2xpbmtzOnJlcXVlc3Qtc3RhcnRcIix7ZGF0YTp7dXJsOnRoaXMudXJsLHhocjp0aGlzLnhocn19KX0sci5wcm90b3R5cGUubm90aWZ5QXBwbGljYXRpb25BZnRlclJlcXVlc3RFbmQ9ZnVuY3Rpb24oKXtyZXR1cm4gZS5kaXNwYXRjaChcInR1cmJvbGlua3M6cmVxdWVzdC1lbmRcIix7ZGF0YTp7dXJsOnRoaXMudXJsLHhocjp0aGlzLnhocn19KX0sci5wcm90b3R5cGUuY3JlYXRlWEhSPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMueGhyPW5ldyBYTUxIdHRwUmVxdWVzdCx0aGlzLnhoci5vcGVuKFwiR0VUXCIsdGhpcy51cmwsITApLHRoaXMueGhyLnRpbWVvdXQ9MWUzKnRoaXMuY29uc3RydWN0b3IudGltZW91dCx0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiQWNjZXB0XCIsXCJ0ZXh0L2h0bWwsIGFwcGxpY2F0aW9uL3hodG1sK3htbFwiKSx0aGlzLnhoci5zZXRSZXF1ZXN0SGVhZGVyKFwiVHVyYm9saW5rcy1SZWZlcnJlclwiLHRoaXMucmVmZXJyZXIpLHRoaXMueGhyLm9ucHJvZ3Jlc3M9dGhpcy5yZXF1ZXN0UHJvZ3Jlc3NlZCx0aGlzLnhoci5vbmxvYWQ9dGhpcy5yZXF1ZXN0TG9hZGVkLHRoaXMueGhyLm9uZXJyb3I9dGhpcy5yZXF1ZXN0RmFpbGVkLHRoaXMueGhyLm9udGltZW91dD10aGlzLnJlcXVlc3RUaW1lZE91dCx0aGlzLnhoci5vbmFib3J0PXRoaXMucmVxdWVzdENhbmNlbGVkfSxyLnByb3RvdHlwZS5lbmRSZXF1ZXN0PWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLnhocj8odGhpcy5ub3RpZnlBcHBsaWNhdGlvbkFmdGVyUmVxdWVzdEVuZCgpLG51bGwhPXQmJnQuY2FsbCh0aGlzKSx0aGlzLmRlc3Ryb3koKSk6dm9pZCAwfSxyLnByb3RvdHlwZS5zZXRQcm9ncmVzcz1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gdGhpcy5wcm9ncmVzcz10LFwiZnVuY3Rpb25cIj09dHlwZW9mKGU9dGhpcy5kZWxlZ2F0ZSkucmVxdWVzdFByb2dyZXNzZWQ/ZS5yZXF1ZXN0UHJvZ3Jlc3NlZCh0aGlzLnByb2dyZXNzKTp2b2lkIDB9LHIucHJvdG90eXBlLmRlc3Ryb3k9ZnVuY3Rpb24oKXt2YXIgdDtyZXR1cm4gdGhpcy5zZXRQcm9ncmVzcygxKSxcImZ1bmN0aW9uXCI9PXR5cGVvZih0PXRoaXMuZGVsZWdhdGUpLnJlcXVlc3RGaW5pc2hlZCYmdC5yZXF1ZXN0RmluaXNoZWQoKSx0aGlzLmRlbGVnYXRlPW51bGwsdGhpcy54aHI9bnVsbH0scn0oKX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3ZhciB0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQuYXBwbHkoZSxhcmd1bWVudHMpfX07ZS5Qcm9ncmVzc0Jhcj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXt0aGlzLnRyaWNrbGU9dCh0aGlzLnRyaWNrbGUsdGhpcyksdGhpcy5zdHlsZXNoZWV0RWxlbWVudD10aGlzLmNyZWF0ZVN0eWxlc2hlZXRFbGVtZW50KCksdGhpcy5wcm9ncmVzc0VsZW1lbnQ9dGhpcy5jcmVhdGVQcm9ncmVzc0VsZW1lbnQoKX12YXIgcjtyZXR1cm4gcj0zMDAsZS5kZWZhdWx0Q1NTPVwiLnR1cmJvbGlua3MtcHJvZ3Jlc3MtYmFyIHtcXG4gIHBvc2l0aW9uOiBmaXhlZDtcXG4gIGRpc3BsYXk6IGJsb2NrO1xcbiAgdG9wOiAwO1xcbiAgbGVmdDogMDtcXG4gIGhlaWdodDogM3B4O1xcbiAgYmFja2dyb3VuZDogIzAwNzZmZjtcXG4gIHotaW5kZXg6IDk5OTk7XFxuICB0cmFuc2l0aW9uOiB3aWR0aCBcIityK1wibXMgZWFzZS1vdXQsIG9wYWNpdHkgXCIrci8yK1wibXMgXCIrci8yK1wibXMgZWFzZS1pbjtcXG4gIHRyYW5zZm9ybTogdHJhbnNsYXRlM2QoMCwgMCwgMCk7XFxufVwiLGUucHJvdG90eXBlLnNob3c9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52aXNpYmxlP3ZvaWQgMDoodGhpcy52aXNpYmxlPSEwLHRoaXMuaW5zdGFsbFN0eWxlc2hlZXRFbGVtZW50KCksdGhpcy5pbnN0YWxsUHJvZ3Jlc3NFbGVtZW50KCksdGhpcy5zdGFydFRyaWNrbGluZygpKX0sZS5wcm90b3R5cGUuaGlkZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLnZpc2libGUmJiF0aGlzLmhpZGluZz8odGhpcy5oaWRpbmc9ITAsdGhpcy5mYWRlUHJvZ3Jlc3NFbGVtZW50KGZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0LnVuaW5zdGFsbFByb2dyZXNzRWxlbWVudCgpLHQuc3RvcFRyaWNrbGluZygpLHQudmlzaWJsZT0hMSx0LmhpZGluZz0hMX19KHRoaXMpKSk6dm9pZCAwfSxlLnByb3RvdHlwZS5zZXRWYWx1ZT1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy52YWx1ZT10LHRoaXMucmVmcmVzaCgpfSxlLnByb3RvdHlwZS5pbnN0YWxsU3R5bGVzaGVldEVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gZG9jdW1lbnQuaGVhZC5pbnNlcnRCZWZvcmUodGhpcy5zdHlsZXNoZWV0RWxlbWVudCxkb2N1bWVudC5oZWFkLmZpcnN0Q2hpbGQpfSxlLnByb3RvdHlwZS5pbnN0YWxsUHJvZ3Jlc3NFbGVtZW50PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvZ3Jlc3NFbGVtZW50LnN0eWxlLndpZHRoPTAsdGhpcy5wcm9ncmVzc0VsZW1lbnQuc3R5bGUub3BhY2l0eT0xLGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5pbnNlcnRCZWZvcmUodGhpcy5wcm9ncmVzc0VsZW1lbnQsZG9jdW1lbnQuYm9keSksdGhpcy5yZWZyZXNoKCl9LGUucHJvdG90eXBlLmZhZGVQcm9ncmVzc0VsZW1lbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucHJvZ3Jlc3NFbGVtZW50LnN0eWxlLm9wYWNpdHk9MCxzZXRUaW1lb3V0KHQsMS41KnIpfSxlLnByb3RvdHlwZS51bmluc3RhbGxQcm9ncmVzc0VsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9ncmVzc0VsZW1lbnQucGFyZW50Tm9kZT9kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucmVtb3ZlQ2hpbGQodGhpcy5wcm9ncmVzc0VsZW1lbnQpOnZvaWQgMH0sZS5wcm90b3R5cGUuc3RhcnRUcmlja2xpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbCE9dGhpcy50cmlja2xlSW50ZXJ2YWw/dGhpcy50cmlja2xlSW50ZXJ2YWw6dGhpcy50cmlja2xlSW50ZXJ2YWw9c2V0SW50ZXJ2YWwodGhpcy50cmlja2xlLHIpfSxlLnByb3RvdHlwZS5zdG9wVHJpY2tsaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIGNsZWFySW50ZXJ2YWwodGhpcy50cmlja2xlSW50ZXJ2YWwpLHRoaXMudHJpY2tsZUludGVydmFsPW51bGx9LGUucHJvdG90eXBlLnRyaWNrbGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zZXRWYWx1ZSh0aGlzLnZhbHVlK01hdGgucmFuZG9tKCkvMTAwKX0sZS5wcm90b3R5cGUucmVmcmVzaD1mdW5jdGlvbigpe3JldHVybiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQucHJvZ3Jlc3NFbGVtZW50LnN0eWxlLndpZHRoPTEwKzkwKnQudmFsdWUrXCIlXCJ9fSh0aGlzKSl9LGUucHJvdG90eXBlLmNyZWF0ZVN0eWxlc2hlZXRFbGVtZW50PWZ1bmN0aW9uKCl7dmFyIHQ7cmV0dXJuIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpLHQudHlwZT1cInRleHQvY3NzXCIsdC50ZXh0Q29udGVudD10aGlzLmNvbnN0cnVjdG9yLmRlZmF1bHRDU1MsdH0sZS5wcm90b3R5cGUuY3JlYXRlUHJvZ3Jlc3NFbGVtZW50PWZ1bmN0aW9uKCl7dmFyIHQ7cmV0dXJuIHQ9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKSx0LmNsYXNzTmFtZT1cInR1cmJvbGlua3MtcHJvZ3Jlc3MtYmFyXCIsdH0sZX0oKX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3ZhciB0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQuYXBwbHkoZSxhcmd1bWVudHMpfX07ZS5Ccm93c2VyQWRhcHRlcj1mdW5jdGlvbigpe2Z1bmN0aW9uIHIocil7dGhpcy5jb250cm9sbGVyPXIsdGhpcy5zaG93UHJvZ3Jlc3NCYXI9dCh0aGlzLnNob3dQcm9ncmVzc0Jhcix0aGlzKSx0aGlzLnByb2dyZXNzQmFyPW5ldyBlLlByb2dyZXNzQmFyfXZhciBuLG8saTtyZXR1cm4gaT1lLkh0dHBSZXF1ZXN0LG49aS5ORVRXT1JLX0ZBSUxVUkUsbz1pLlRJTUVPVVRfRkFJTFVSRSxyLnByb3RvdHlwZS52aXNpdFByb3Bvc2VkVG9Mb2NhdGlvbldpdGhBY3Rpb249ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5jb250cm9sbGVyLnN0YXJ0VmlzaXRUb0xvY2F0aW9uV2l0aEFjdGlvbih0LGUpfSxyLnByb3RvdHlwZS52aXNpdFN0YXJ0ZWQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQuaXNzdWVSZXF1ZXN0KCksdC5jaGFuZ2VIaXN0b3J5KCksdC5sb2FkQ2FjaGVkU25hcHNob3QoKX0sci5wcm90b3R5cGUudmlzaXRSZXF1ZXN0U3RhcnRlZD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wcm9ncmVzc0Jhci5zZXRWYWx1ZSgwKSx0Lmhhc0NhY2hlZFNuYXBzaG90KCl8fFwicmVzdG9yZVwiIT09dC5hY3Rpb24/dGhpcy5zaG93UHJvZ3Jlc3NCYXJBZnRlckRlbGF5KCk6dGhpcy5zaG93UHJvZ3Jlc3NCYXIoKX0sci5wcm90b3R5cGUudmlzaXRSZXF1ZXN0UHJvZ3Jlc3NlZD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wcm9ncmVzc0Jhci5zZXRWYWx1ZSh0LnByb2dyZXNzKX0sci5wcm90b3R5cGUudmlzaXRSZXF1ZXN0Q29tcGxldGVkPWZ1bmN0aW9uKHQpe3JldHVybiB0LmxvYWRSZXNwb25zZSgpfSxyLnByb3RvdHlwZS52aXNpdFJlcXVlc3RGYWlsZWRXaXRoU3RhdHVzQ29kZT1mdW5jdGlvbih0LGUpe3N3aXRjaChlKXtjYXNlIG46Y2FzZSBvOnJldHVybiB0aGlzLnJlbG9hZCgpO2RlZmF1bHQ6cmV0dXJuIHQubG9hZFJlc3BvbnNlKCl9fSxyLnByb3RvdHlwZS52aXNpdFJlcXVlc3RGaW5pc2hlZD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5oaWRlUHJvZ3Jlc3NCYXIoKX0sci5wcm90b3R5cGUudmlzaXRDb21wbGV0ZWQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQuZm9sbG93UmVkaXJlY3QoKX0sci5wcm90b3R5cGUucGFnZUludmFsaWRhdGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVsb2FkKCl9LHIucHJvdG90eXBlLnNob3dQcm9ncmVzc0JhckFmdGVyRGVsYXk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wcm9ncmVzc0JhclRpbWVvdXQ9c2V0VGltZW91dCh0aGlzLnNob3dQcm9ncmVzc0Jhcix0aGlzLmNvbnRyb2xsZXIucHJvZ3Jlc3NCYXJEZWxheSl9LHIucHJvdG90eXBlLnNob3dQcm9ncmVzc0Jhcj1mdW5jdGlvbigpe3JldHVybiB0aGlzLnByb2dyZXNzQmFyLnNob3coKX0sci5wcm90b3R5cGUuaGlkZVByb2dyZXNzQmFyPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucHJvZ3Jlc3NCYXIuaGlkZSgpLGNsZWFyVGltZW91dCh0aGlzLnByb2dyZXNzQmFyVGltZW91dCl9LHIucHJvdG90eXBlLnJlbG9hZD1mdW5jdGlvbigpe3JldHVybiB3aW5kb3cubG9jYXRpb24ucmVsb2FkKCl9LHJ9KCl9LmNhbGwodGhpcyksZnVuY3Rpb24oKXt2YXIgdD1mdW5jdGlvbih0LGUpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0LmFwcGx5KGUsYXJndW1lbnRzKX19O2UuSGlzdG9yeT1mdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSl7dGhpcy5kZWxlZ2F0ZT1lLHRoaXMub25QYWdlTG9hZD10KHRoaXMub25QYWdlTG9hZCx0aGlzKSx0aGlzLm9uUG9wU3RhdGU9dCh0aGlzLm9uUG9wU3RhdGUsdGhpcyl9cmV0dXJuIHIucHJvdG90eXBlLnN0YXJ0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc3RhcnRlZD92b2lkIDA6KGFkZEV2ZW50TGlzdGVuZXIoXCJwb3BzdGF0ZVwiLHRoaXMub25Qb3BTdGF0ZSwhMSksYWRkRXZlbnRMaXN0ZW5lcihcImxvYWRcIix0aGlzLm9uUGFnZUxvYWQsITEpLHRoaXMuc3RhcnRlZD0hMCl9LHIucHJvdG90eXBlLnN0b3A9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdGFydGVkPyhyZW1vdmVFdmVudExpc3RlbmVyKFwicG9wc3RhdGVcIix0aGlzLm9uUG9wU3RhdGUsITEpLHJlbW92ZUV2ZW50TGlzdGVuZXIoXCJsb2FkXCIsdGhpcy5vblBhZ2VMb2FkLCExKSx0aGlzLnN0YXJ0ZWQ9ITEpOnZvaWQgMH0sci5wcm90b3R5cGUucHVzaD1mdW5jdGlvbih0LHIpe3JldHVybiB0PWUuTG9jYXRpb24ud3JhcCh0KSx0aGlzLnVwZGF0ZShcInB1c2hcIix0LHIpfSxyLnByb3RvdHlwZS5yZXBsYWNlPWZ1bmN0aW9uKHQscil7cmV0dXJuIHQ9ZS5Mb2NhdGlvbi53cmFwKHQpLHRoaXMudXBkYXRlKFwicmVwbGFjZVwiLHQscil9LHIucHJvdG90eXBlLm9uUG9wU3RhdGU9ZnVuY3Rpb24odCl7dmFyIHIsbixvLGk7cmV0dXJuIHRoaXMuc2hvdWxkSGFuZGxlUG9wU3RhdGUoKSYmKGk9bnVsbCE9KG49dC5zdGF0ZSk/bi50dXJib2xpbmtzOnZvaWQgMCk/KHI9ZS5Mb2NhdGlvbi53cmFwKHdpbmRvdy5sb2NhdGlvbiksbz1pLnJlc3RvcmF0aW9uSWRlbnRpZmllcix0aGlzLmRlbGVnYXRlLmhpc3RvcnlQb3BwZWRUb0xvY2F0aW9uV2l0aFJlc3RvcmF0aW9uSWRlbnRpZmllcihyLG8pKTp2b2lkIDB9LHIucHJvdG90eXBlLm9uUGFnZUxvYWQ9ZnVuY3Rpb24odCl7cmV0dXJuIGUuZGVmZXIoZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQucGFnZUxvYWRlZD0hMH19KHRoaXMpKX0sci5wcm90b3R5cGUuc2hvdWxkSGFuZGxlUG9wU3RhdGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYWdlSXNMb2FkZWQoKX0sci5wcm90b3R5cGUucGFnZUlzTG9hZGVkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFnZUxvYWRlZHx8XCJjb21wbGV0ZVwiPT09ZG9jdW1lbnQucmVhZHlTdGF0ZX0sci5wcm90b3R5cGUudXBkYXRlPWZ1bmN0aW9uKHQsZSxyKXt2YXIgbjtyZXR1cm4gbj17dHVyYm9saW5rczp7cmVzdG9yYXRpb25JZGVudGlmaWVyOnJ9fSxoaXN0b3J5W3QrXCJTdGF0ZVwiXShuLG51bGwsZSl9LHJ9KCl9LmNhbGwodGhpcyksZnVuY3Rpb24oKXtlLkhlYWREZXRhaWxzPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXt2YXIgZSxyLG4scyxhLHU7Zm9yKHRoaXMuZWxlbWVudHM9e30sbj0wLGE9dC5sZW5ndGg7YT5uO24rKyl1PXRbbl0sdS5ub2RlVHlwZT09PU5vZGUuRUxFTUVOVF9OT0RFJiYocz11Lm91dGVySFRNTCxyPW51bGwhPShlPXRoaXMuZWxlbWVudHMpW3NdP2Vbc106ZVtzXT17dHlwZTppKHUpLHRyYWNrZWQ6byh1KSxlbGVtZW50czpbXX0sci5lbGVtZW50cy5wdXNoKHUpKX12YXIgZSxyLG4sbyxpO3JldHVybiB0LmZyb21IZWFkRWxlbWVudD1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gbmV3IHRoaXMobnVsbCE9KGU9bnVsbCE9dD90LmNoaWxkTm9kZXM6dm9pZCAwKT9lOltdKX0sdC5wcm90b3R5cGUuaGFzRWxlbWVudFdpdGhLZXk9ZnVuY3Rpb24odCl7cmV0dXJuIHQgaW4gdGhpcy5lbGVtZW50c30sdC5wcm90b3R5cGUuZ2V0VHJhY2tlZEVsZW1lbnRTaWduYXR1cmU9ZnVuY3Rpb24oKXt2YXIgdCxlO3JldHVybiBmdW5jdGlvbigpe3ZhciByLG47cj10aGlzLmVsZW1lbnRzLG49W107Zm9yKHQgaW4gcillPXJbdF0udHJhY2tlZCxlJiZuLnB1c2godCk7cmV0dXJuIG59LmNhbGwodGhpcykuam9pbihcIlwiKX0sdC5wcm90b3R5cGUuZ2V0U2NyaXB0RWxlbWVudHNOb3RJbkRldGFpbHM9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZ2V0RWxlbWVudHNNYXRjaGluZ1R5cGVOb3RJbkRldGFpbHMoXCJzY3JpcHRcIix0KX0sdC5wcm90b3R5cGUuZ2V0U3R5bGVzaGVldEVsZW1lbnRzTm90SW5EZXRhaWxzPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmdldEVsZW1lbnRzTWF0Y2hpbmdUeXBlTm90SW5EZXRhaWxzKFwic3R5bGVzaGVldFwiLHQpfSx0LnByb3RvdHlwZS5nZXRFbGVtZW50c01hdGNoaW5nVHlwZU5vdEluRGV0YWlscz1mdW5jdGlvbih0LGUpe3ZhciByLG4sbyxpLHMsYTtvPXRoaXMuZWxlbWVudHMscz1bXTtmb3IobiBpbiBvKWk9b1tuXSxhPWkudHlwZSxyPWkuZWxlbWVudHMsYSE9PXR8fGUuaGFzRWxlbWVudFdpdGhLZXkobil8fHMucHVzaChyWzBdKTtyZXR1cm4gc30sdC5wcm90b3R5cGUuZ2V0UHJvdmlzaW9uYWxFbGVtZW50cz1mdW5jdGlvbigpe3ZhciB0LGUscixuLG8saSxzO3I9W10sbj10aGlzLmVsZW1lbnRzO2ZvcihlIGluIG4pbz1uW2VdLHM9by50eXBlLGk9by50cmFja2VkLHQ9by5lbGVtZW50cyxudWxsIT1zfHxpP3QubGVuZ3RoPjEmJnIucHVzaC5hcHBseShyLHQuc2xpY2UoMSkpOnIucHVzaC5hcHBseShyLHQpO3JldHVybiByfSx0LnByb3RvdHlwZS5nZXRNZXRhVmFsdWU9ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuIG51bGwhPShlPXRoaXMuZmluZE1ldGFFbGVtZW50QnlOYW1lKHQpKT9lLmdldEF0dHJpYnV0ZShcImNvbnRlbnRcIik6dm9pZCAwfSx0LnByb3RvdHlwZS5maW5kTWV0YUVsZW1lbnRCeU5hbWU9ZnVuY3Rpb24odCl7dmFyIHIsbixvLGk7cj12b2lkIDAsaT10aGlzLmVsZW1lbnRzO2ZvcihvIGluIGkpbj1pW29dLmVsZW1lbnRzLGUoblswXSx0KSYmKHI9blswXSk7cmV0dXJuIHJ9LGk9ZnVuY3Rpb24odCl7cmV0dXJuIHIodCk/XCJzY3JpcHRcIjpuKHQpP1wic3R5bGVzaGVldFwiOnZvaWQgMH0sbz1mdW5jdGlvbih0KXtyZXR1cm5cInJlbG9hZFwiPT09dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR1cmJvbGlua3MtdHJhY2tcIil9LHI9ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuIGU9dC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXCJzY3JpcHRcIj09PWV9LG49ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuIGU9dC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXCJzdHlsZVwiPT09ZXx8XCJsaW5rXCI9PT1lJiZcInN0eWxlc2hlZXRcIj09PXQuZ2V0QXR0cmlidXRlKFwicmVsXCIpfSxlPWZ1bmN0aW9uKHQsZSl7dmFyIHI7cmV0dXJuIHI9dC50YWdOYW1lLnRvTG93ZXJDYXNlKCksXCJtZXRhXCI9PT1yJiZ0LmdldEF0dHJpYnV0ZShcIm5hbWVcIik9PT1lfSx0fSgpfS5jYWxsKHRoaXMpLGZ1bmN0aW9uKCl7ZS5TbmFwc2hvdD1mdW5jdGlvbigpe2Z1bmN0aW9uIHQodCxlKXt0aGlzLmhlYWREZXRhaWxzPXQsdGhpcy5ib2R5RWxlbWVudD1lfXJldHVybiB0LndyYXA9ZnVuY3Rpb24odCl7cmV0dXJuIHQgaW5zdGFuY2VvZiB0aGlzP3Q6XCJzdHJpbmdcIj09dHlwZW9mIHQ/dGhpcy5mcm9tSFRNTFN0cmluZyh0KTp0aGlzLmZyb21IVE1MRWxlbWVudCh0KX0sdC5mcm9tSFRNTFN0cmluZz1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaHRtbFwiKSxlLmlubmVySFRNTD10LHRoaXMuZnJvbUhUTUxFbGVtZW50KGUpfSx0LmZyb21IVE1MRWxlbWVudD1mdW5jdGlvbih0KXt2YXIgcixuLG8saTtyZXR1cm4gbz10LnF1ZXJ5U2VsZWN0b3IoXCJoZWFkXCIpLHI9bnVsbCE9KGk9dC5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKSk/aTpkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYm9keVwiKSxuPWUuSGVhZERldGFpbHMuZnJvbUhlYWRFbGVtZW50KG8pLG5ldyB0aGlzKG4scil9LHQucHJvdG90eXBlLmNsb25lPWZ1bmN0aW9uKCl7cmV0dXJuIG5ldyB0aGlzLmNvbnN0cnVjdG9yKHRoaXMuaGVhZERldGFpbHMsdGhpcy5ib2R5RWxlbWVudC5jbG9uZU5vZGUoITApKX0sdC5wcm90b3R5cGUuZ2V0Um9vdExvY2F0aW9uPWZ1bmN0aW9uKCl7dmFyIHQscjtyZXR1cm4gcj1udWxsIT0odD10aGlzLmdldFNldHRpbmcoXCJyb290XCIpKT90OlwiL1wiLG5ldyBlLkxvY2F0aW9uKHIpfSx0LnByb3RvdHlwZS5nZXRDYWNoZUNvbnRyb2xWYWx1ZT1mdW5jdGlvbigpe3JldHVybiB0aGlzLmdldFNldHRpbmcoXCJjYWNoZS1jb250cm9sXCIpfSx0LnByb3RvdHlwZS5nZXRFbGVtZW50Rm9yQW5jaG9yPWZ1bmN0aW9uKHQpe3RyeXtyZXR1cm4gdGhpcy5ib2R5RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW2lkPSdcIit0K1wiJ10sIGFbbmFtZT0nXCIrdCtcIiddXCIpfWNhdGNoKGUpe319LHQucHJvdG90eXBlLmdldFBlcm1hbmVudEVsZW1lbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYm9keUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcIltpZF1bZGF0YS10dXJib2xpbmtzLXBlcm1hbmVudF1cIil9LHQucHJvdG90eXBlLmdldFBlcm1hbmVudEVsZW1lbnRCeUlkPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmJvZHlFbGVtZW50LnF1ZXJ5U2VsZWN0b3IoXCIjXCIrdCtcIltkYXRhLXR1cmJvbGlua3MtcGVybWFuZW50XVwiKX0sdC5wcm90b3R5cGUuZ2V0UGVybWFuZW50RWxlbWVudHNQcmVzZW50SW5TbmFwc2hvdD1mdW5jdGlvbih0KXt2YXIgZSxyLG4sbyxpO2ZvcihvPXRoaXMuZ2V0UGVybWFuZW50RWxlbWVudHMoKSxpPVtdLHI9MCxuPW8ubGVuZ3RoO24+cjtyKyspZT1vW3JdLHQuZ2V0UGVybWFuZW50RWxlbWVudEJ5SWQoZS5pZCkmJmkucHVzaChlKTtyZXR1cm4gaX0sdC5wcm90b3R5cGUuZmluZEZpcnN0QXV0b2ZvY3VzYWJsZUVsZW1lbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5ib2R5RWxlbWVudC5xdWVyeVNlbGVjdG9yKFwiW2F1dG9mb2N1c11cIil9LHQucHJvdG90eXBlLmhhc0FuY2hvcj1mdW5jdGlvbih0KXtyZXR1cm4gbnVsbCE9dGhpcy5nZXRFbGVtZW50Rm9yQW5jaG9yKHQpfSx0LnByb3RvdHlwZS5pc1ByZXZpZXdhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuXCJuby1wcmV2aWV3XCIhPT10aGlzLmdldENhY2hlQ29udHJvbFZhbHVlKCl9LHQucHJvdG90eXBlLmlzQ2FjaGVhYmxlPWZ1bmN0aW9uKCl7cmV0dXJuXCJuby1jYWNoZVwiIT09dGhpcy5nZXRDYWNoZUNvbnRyb2xWYWx1ZSgpfSx0LnByb3RvdHlwZS5pc1Zpc2l0YWJsZT1mdW5jdGlvbigpe3JldHVyblwicmVsb2FkXCIhPT10aGlzLmdldFNldHRpbmcoXCJ2aXNpdC1jb250cm9sXCIpfSx0LnByb3RvdHlwZS5nZXRTZXR0aW5nPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmhlYWREZXRhaWxzLmdldE1ldGFWYWx1ZShcInR1cmJvbGlua3MtXCIrdCl9LHR9KCl9LmNhbGwodGhpcyksZnVuY3Rpb24oKXt2YXIgdD1bXS5zbGljZTtlLlJlbmRlcmVyPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSgpe312YXIgcjtyZXR1cm4gZS5yZW5kZXI9ZnVuY3Rpb24oKXt2YXIgZSxyLG4sbztyZXR1cm4gbj1hcmd1bWVudHNbMF0scj1hcmd1bWVudHNbMV0sZT0zPD1hcmd1bWVudHMubGVuZ3RoP3QuY2FsbChhcmd1bWVudHMsMik6W10sbz1mdW5jdGlvbih0LGUscil7ci5wcm90b3R5cGU9dC5wcm90b3R5cGU7dmFyIG49bmV3IHIsbz10LmFwcGx5KG4sZSk7cmV0dXJuIE9iamVjdChvKT09PW8/bzpufSh0aGlzLGUsZnVuY3Rpb24oKXt9KSxvLmRlbGVnYXRlPW4sby5yZW5kZXIociksb30sZS5wcm90b3R5cGUucmVuZGVyVmlldz1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5kZWxlZ2F0ZS52aWV3V2lsbFJlbmRlcih0aGlzLm5ld0JvZHkpLHQoKSx0aGlzLmRlbGVnYXRlLnZpZXdSZW5kZXJlZCh0aGlzLm5ld0JvZHkpfSxlLnByb3RvdHlwZS5pbnZhbGlkYXRlVmlldz1mdW5jdGlvbigpe3JldHVybiB0aGlzLmRlbGVnYXRlLnZpZXdJbnZhbGlkYXRlZCgpfSxlLnByb3RvdHlwZS5jcmVhdGVTY3JpcHRFbGVtZW50PWZ1bmN0aW9uKHQpe3ZhciBlO3JldHVyblwiZmFsc2VcIj09PXQuZ2V0QXR0cmlidXRlKFwiZGF0YS10dXJib2xpbmtzLWV2YWxcIik/dDooZT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLGUudGV4dENvbnRlbnQ9dC50ZXh0Q29udGVudCxlLmFzeW5jPSExLHIoZSx0KSxlKX0scj1mdW5jdGlvbih0LGUpe3ZhciByLG4sbyxpLHMsYSx1O2ZvcihpPWUuYXR0cmlidXRlcyxhPVtdLHI9MCxuPWkubGVuZ3RoO24+cjtyKyspcz1pW3JdLG89cy5uYW1lLHU9cy52YWx1ZSxhLnB1c2godC5zZXRBdHRyaWJ1dGUobyx1KSk7cmV0dXJuIGF9LGV9KCl9LmNhbGwodGhpcyksZnVuY3Rpb24oKXt2YXIgdCxyLG49ZnVuY3Rpb24odCxlKXtmdW5jdGlvbiByKCl7dGhpcy5jb25zdHJ1Y3Rvcj10fWZvcih2YXIgbiBpbiBlKW8uY2FsbChlLG4pJiYodFtuXT1lW25dKTtyZXR1cm4gci5wcm90b3R5cGU9ZS5wcm90b3R5cGUsdC5wcm90b3R5cGU9bmV3IHIsdC5fX3N1cGVyX189ZS5wcm90b3R5cGUsdH0sbz17fS5oYXNPd25Qcm9wZXJ0eTtlLlNuYXBzaG90UmVuZGVyZXI9ZnVuY3Rpb24oZSl7ZnVuY3Rpb24gbyh0LGUscil7dGhpcy5jdXJyZW50U25hcHNob3Q9dCx0aGlzLm5ld1NuYXBzaG90PWUsdGhpcy5pc1ByZXZpZXc9cix0aGlzLmN1cnJlbnRIZWFkRGV0YWlscz10aGlzLmN1cnJlbnRTbmFwc2hvdC5oZWFkRGV0YWlscyx0aGlzLm5ld0hlYWREZXRhaWxzPXRoaXMubmV3U25hcHNob3QuaGVhZERldGFpbHMsdGhpcy5jdXJyZW50Qm9keT10aGlzLmN1cnJlbnRTbmFwc2hvdC5ib2R5RWxlbWVudCx0aGlzLm5ld0JvZHk9dGhpcy5uZXdTbmFwc2hvdC5ib2R5RWxlbWVudH1yZXR1cm4gbihvLGUpLG8ucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5zaG91bGRSZW5kZXIoKT8odGhpcy5tZXJnZUhlYWQoKSx0aGlzLnJlbmRlclZpZXcoZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGUucmVwbGFjZUJvZHkoKSxlLmlzUHJldmlld3x8ZS5mb2N1c0ZpcnN0QXV0b2ZvY3VzYWJsZUVsZW1lbnQoKSx0KCl9fSh0aGlzKSkpOnRoaXMuaW52YWxpZGF0ZVZpZXcoKX0sby5wcm90b3R5cGUubWVyZ2VIZWFkPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29weU5ld0hlYWRTdHlsZXNoZWV0RWxlbWVudHMoKSx0aGlzLmNvcHlOZXdIZWFkU2NyaXB0RWxlbWVudHMoKSx0aGlzLnJlbW92ZUN1cnJlbnRIZWFkUHJvdmlzaW9uYWxFbGVtZW50cygpLHRoaXMuY29weU5ld0hlYWRQcm92aXNpb25hbEVsZW1lbnRzKCl9LG8ucHJvdG90eXBlLnJlcGxhY2VCb2R5PWZ1bmN0aW9uKCl7dmFyIHQ7cmV0dXJuIHQ9dGhpcy5yZWxvY2F0ZUN1cnJlbnRCb2R5UGVybWFuZW50RWxlbWVudHMoKSx0aGlzLmFjdGl2YXRlTmV3Qm9keVNjcmlwdEVsZW1lbnRzKCksdGhpcy5hc3NpZ25OZXdCb2R5KCksdGhpcy5yZXBsYWNlUGxhY2Vob2xkZXJFbGVtZW50c1dpdGhDbG9uZWRQZXJtYW5lbnRFbGVtZW50cyh0KX0sby5wcm90b3R5cGUuc2hvdWxkUmVuZGVyPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmV3U25hcHNob3QuaXNWaXNpdGFibGUoKSYmdGhpcy50cmFja2VkRWxlbWVudHNBcmVJZGVudGljYWwoKX0sby5wcm90b3R5cGUudHJhY2tlZEVsZW1lbnRzQXJlSWRlbnRpY2FsPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY3VycmVudEhlYWREZXRhaWxzLmdldFRyYWNrZWRFbGVtZW50U2lnbmF0dXJlKCk9PT10aGlzLm5ld0hlYWREZXRhaWxzLmdldFRyYWNrZWRFbGVtZW50U2lnbmF0dXJlKCl9LG8ucHJvdG90eXBlLmNvcHlOZXdIZWFkU3R5bGVzaGVldEVsZW1lbnRzPWZ1bmN0aW9uKCl7dmFyIHQsZSxyLG4sbztmb3Iobj10aGlzLmdldE5ld0hlYWRTdHlsZXNoZWV0RWxlbWVudHMoKSxvPVtdLGU9MCxyPW4ubGVuZ3RoO3I+ZTtlKyspdD1uW2VdLG8ucHVzaChkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHQpKTtyZXR1cm4gb30sby5wcm90b3R5cGUuY29weU5ld0hlYWRTY3JpcHRFbGVtZW50cz1mdW5jdGlvbigpe3ZhciB0LGUscixuLG87Zm9yKG49dGhpcy5nZXROZXdIZWFkU2NyaXB0RWxlbWVudHMoKSxvPVtdLGU9MCxyPW4ubGVuZ3RoO3I+ZTtlKyspdD1uW2VdLG8ucHVzaChkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHRoaXMuY3JlYXRlU2NyaXB0RWxlbWVudCh0KSkpO3JldHVybiBvfSxvLnByb3RvdHlwZS5yZW1vdmVDdXJyZW50SGVhZFByb3Zpc2lvbmFsRWxlbWVudHM9ZnVuY3Rpb24oKXt2YXIgdCxlLHIsbixvO2ZvcihuPXRoaXMuZ2V0Q3VycmVudEhlYWRQcm92aXNpb25hbEVsZW1lbnRzKCksbz1bXSxlPTAscj1uLmxlbmd0aDtyPmU7ZSsrKXQ9bltlXSxvLnB1c2goZG9jdW1lbnQuaGVhZC5yZW1vdmVDaGlsZCh0KSk7cmV0dXJuIG99LG8ucHJvdG90eXBlLmNvcHlOZXdIZWFkUHJvdmlzaW9uYWxFbGVtZW50cz1mdW5jdGlvbigpe3ZhciB0LGUscixuLG87Zm9yKG49dGhpcy5nZXROZXdIZWFkUHJvdmlzaW9uYWxFbGVtZW50cygpLG89W10sZT0wLHI9bi5sZW5ndGg7cj5lO2UrKyl0PW5bZV0sby5wdXNoKGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQodCkpO3JldHVybiBvfSxvLnByb3RvdHlwZS5yZWxvY2F0ZUN1cnJlbnRCb2R5UGVybWFuZW50RWxlbWVudHM9ZnVuY3Rpb24oKXt2YXIgZSxuLG8saSxzLGEsdTtmb3IoYT10aGlzLmdldEN1cnJlbnRCb2R5UGVybWFuZW50RWxlbWVudHMoKSx1PVtdLGU9MCxuPWEubGVuZ3RoO24+ZTtlKyspaT1hW2VdLHM9dChpKSxvPXRoaXMubmV3U25hcHNob3QuZ2V0UGVybWFuZW50RWxlbWVudEJ5SWQoaS5pZCkscihpLHMuZWxlbWVudCkscihvLGkpLHUucHVzaChzKTtyZXR1cm4gdX0sby5wcm90b3R5cGUucmVwbGFjZVBsYWNlaG9sZGVyRWxlbWVudHNXaXRoQ2xvbmVkUGVybWFuZW50RWxlbWVudHM9ZnVuY3Rpb24odCl7dmFyIGUsbixvLGkscyxhLHU7Zm9yKHU9W10sbz0wLGk9dC5sZW5ndGg7aT5vO28rKylhPXRbb10sbj1hLmVsZW1lbnQscz1hLnBlcm1hbmVudEVsZW1lbnQsZT1zLmNsb25lTm9kZSghMCksdS5wdXNoKHIobixlKSk7cmV0dXJuIHV9LG8ucHJvdG90eXBlLmFjdGl2YXRlTmV3Qm9keVNjcmlwdEVsZW1lbnRzPWZ1bmN0aW9uKCl7dmFyIHQsZSxuLG8saSxzO2ZvcihpPXRoaXMuZ2V0TmV3Qm9keVNjcmlwdEVsZW1lbnRzKCkscz1bXSxlPTAsbz1pLmxlbmd0aDtvPmU7ZSsrKW49aVtlXSx0PXRoaXMuY3JlYXRlU2NyaXB0RWxlbWVudChuKSxzLnB1c2gocihuLHQpKTtyZXR1cm4gc30sby5wcm90b3R5cGUuYXNzaWduTmV3Qm9keT1mdW5jdGlvbigpe3JldHVybiBkb2N1bWVudC5ib2R5PXRoaXMubmV3Qm9keX0sby5wcm90b3R5cGUuZm9jdXNGaXJzdEF1dG9mb2N1c2FibGVFbGVtZW50PWZ1bmN0aW9uKCl7dmFyIHQ7cmV0dXJuIG51bGwhPSh0PXRoaXMubmV3U25hcHNob3QuZmluZEZpcnN0QXV0b2ZvY3VzYWJsZUVsZW1lbnQoKSk/dC5mb2N1cygpOnZvaWQgMH0sby5wcm90b3R5cGUuZ2V0TmV3SGVhZFN0eWxlc2hlZXRFbGVtZW50cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLm5ld0hlYWREZXRhaWxzLmdldFN0eWxlc2hlZXRFbGVtZW50c05vdEluRGV0YWlscyh0aGlzLmN1cnJlbnRIZWFkRGV0YWlscyl9LG8ucHJvdG90eXBlLmdldE5ld0hlYWRTY3JpcHRFbGVtZW50cz1mdW5jdGlvbigpe3JldHVybiB0aGlzLm5ld0hlYWREZXRhaWxzLmdldFNjcmlwdEVsZW1lbnRzTm90SW5EZXRhaWxzKHRoaXMuY3VycmVudEhlYWREZXRhaWxzKX0sby5wcm90b3R5cGUuZ2V0Q3VycmVudEhlYWRQcm92aXNpb25hbEVsZW1lbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY3VycmVudEhlYWREZXRhaWxzLmdldFByb3Zpc2lvbmFsRWxlbWVudHMoKX0sby5wcm90b3R5cGUuZ2V0TmV3SGVhZFByb3Zpc2lvbmFsRWxlbWVudHM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5uZXdIZWFkRGV0YWlscy5nZXRQcm92aXNpb25hbEVsZW1lbnRzKCl9LG8ucHJvdG90eXBlLmdldEN1cnJlbnRCb2R5UGVybWFuZW50RWxlbWVudHM9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jdXJyZW50U25hcHNob3QuZ2V0UGVybWFuZW50RWxlbWVudHNQcmVzZW50SW5TbmFwc2hvdCh0aGlzLm5ld1NuYXBzaG90KX0sby5wcm90b3R5cGUuZ2V0TmV3Qm9keVNjcmlwdEVsZW1lbnRzPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMubmV3Qm9keS5xdWVyeVNlbGVjdG9yQWxsKFwic2NyaXB0XCIpfSxvfShlLlJlbmRlcmVyKSx0PWZ1bmN0aW9uKHQpe3ZhciBlO3JldHVybiBlPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJtZXRhXCIpLGUuc2V0QXR0cmlidXRlKFwibmFtZVwiLFwidHVyYm9saW5rcy1wZXJtYW5lbnQtcGxhY2Vob2xkZXJcIiksZS5zZXRBdHRyaWJ1dGUoXCJjb250ZW50XCIsdC5pZCkse2VsZW1lbnQ6ZSxwZXJtYW5lbnRFbGVtZW50OnR9fSxyPWZ1bmN0aW9uKHQsZSl7dmFyIHI7cmV0dXJuKHI9dC5wYXJlbnROb2RlKT9yLnJlcGxhY2VDaGlsZChlLHQpOnZvaWQgMH19LmNhbGwodGhpcyksZnVuY3Rpb24oKXt2YXIgdD1mdW5jdGlvbih0LGUpe2Z1bmN0aW9uIG4oKXt0aGlzLmNvbnN0cnVjdG9yPXR9Zm9yKHZhciBvIGluIGUpci5jYWxsKGUsbykmJih0W29dPWVbb10pO3JldHVybiBuLnByb3RvdHlwZT1lLnByb3RvdHlwZSx0LnByb3RvdHlwZT1uZXcgbix0Ll9fc3VwZXJfXz1lLnByb3RvdHlwZSx0fSxyPXt9Lmhhc093blByb3BlcnR5O2UuRXJyb3JSZW5kZXJlcj1mdW5jdGlvbihlKXtmdW5jdGlvbiByKHQpe3ZhciBlO2U9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImh0bWxcIiksZS5pbm5lckhUTUw9dCx0aGlzLm5ld0hlYWQ9ZS5xdWVyeVNlbGVjdG9yKFwiaGVhZFwiKSx0aGlzLm5ld0JvZHk9ZS5xdWVyeVNlbGVjdG9yKFwiYm9keVwiKX1yZXR1cm4gdChyLGUpLHIucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5yZW5kZXJWaWV3KGZ1bmN0aW9uKGUpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBlLnJlcGxhY2VIZWFkQW5kQm9keSgpLGUuYWN0aXZhdGVCb2R5U2NyaXB0RWxlbWVudHMoKSx0KCl9fSh0aGlzKSl9LHIucHJvdG90eXBlLnJlcGxhY2VIZWFkQW5kQm9keT1mdW5jdGlvbigpe3ZhciB0LGU7cmV0dXJuIGU9ZG9jdW1lbnQuaGVhZCx0PWRvY3VtZW50LmJvZHksZS5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh0aGlzLm5ld0hlYWQsZSksdC5wYXJlbnROb2RlLnJlcGxhY2VDaGlsZCh0aGlzLm5ld0JvZHksdCl9LHIucHJvdG90eXBlLmFjdGl2YXRlQm9keVNjcmlwdEVsZW1lbnRzPWZ1bmN0aW9uKCl7dmFyIHQsZSxyLG4sbyxpO2ZvcihuPXRoaXMuZ2V0U2NyaXB0RWxlbWVudHMoKSxpPVtdLGU9MCxyPW4ubGVuZ3RoO3I+ZTtlKyspbz1uW2VdLHQ9dGhpcy5jcmVhdGVTY3JpcHRFbGVtZW50KG8pLGkucHVzaChvLnBhcmVudE5vZGUucmVwbGFjZUNoaWxkKHQsbykpO3JldHVybiBpfSxyLnByb3RvdHlwZS5nZXRTY3JpcHRFbGVtZW50cz1mdW5jdGlvbigpe3JldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChcInNjcmlwdFwiKX0scn0oZS5SZW5kZXJlcil9LmNhbGwodGhpcyksZnVuY3Rpb24oKXtlLlZpZXc9ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KHQpe3RoaXMuZGVsZWdhdGU9dCx0aGlzLmh0bWxFbGVtZW50PWRvY3VtZW50LmRvY3VtZW50RWxlbWVudH1yZXR1cm4gdC5wcm90b3R5cGUuZ2V0Um9vdExvY2F0aW9uPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZ2V0U25hcHNob3QoKS5nZXRSb290TG9jYXRpb24oKX0sdC5wcm90b3R5cGUuZ2V0RWxlbWVudEZvckFuY2hvcj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5nZXRTbmFwc2hvdCgpLmdldEVsZW1lbnRGb3JBbmNob3IodCl9LHQucHJvdG90eXBlLmdldFNuYXBzaG90PWZ1bmN0aW9uKCl7cmV0dXJuIGUuU25hcHNob3QuZnJvbUhUTUxFbGVtZW50KHRoaXMuaHRtbEVsZW1lbnQpfSx0LnByb3RvdHlwZS5yZW5kZXI9ZnVuY3Rpb24odCxlKXt2YXIgcixuLG87cmV0dXJuIG89dC5zbmFwc2hvdCxyPXQuZXJyb3Isbj10LmlzUHJldmlldyx0aGlzLm1hcmtBc1ByZXZpZXcobiksbnVsbCE9bz90aGlzLnJlbmRlclNuYXBzaG90KG8sbixlKTp0aGlzLnJlbmRlckVycm9yKHIsZSl9LHQucHJvdG90eXBlLm1hcmtBc1ByZXZpZXc9ZnVuY3Rpb24odCl7cmV0dXJuIHQ/dGhpcy5odG1sRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJkYXRhLXR1cmJvbGlua3MtcHJldmlld1wiLFwiXCIpOnRoaXMuaHRtbEVsZW1lbnQucmVtb3ZlQXR0cmlidXRlKFwiZGF0YS10dXJib2xpbmtzLXByZXZpZXdcIil9LHQucHJvdG90eXBlLnJlbmRlclNuYXBzaG90PWZ1bmN0aW9uKHQscixuKXtyZXR1cm4gZS5TbmFwc2hvdFJlbmRlcmVyLnJlbmRlcih0aGlzLmRlbGVnYXRlLG4sdGhpcy5nZXRTbmFwc2hvdCgpLGUuU25hcHNob3Qud3JhcCh0KSxyKX0sdC5wcm90b3R5cGUucmVuZGVyRXJyb3I9ZnVuY3Rpb24odCxyKXtyZXR1cm4gZS5FcnJvclJlbmRlcmVyLnJlbmRlcih0aGlzLmRlbGVnYXRlLHIsdCl9LHR9KCl9LmNhbGwodGhpcyksZnVuY3Rpb24oKXt2YXIgdD1mdW5jdGlvbih0LGUpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0LmFwcGx5KGUsYXJndW1lbnRzKX19O2UuU2Nyb2xsTWFuYWdlcj1mdW5jdGlvbigpe2Z1bmN0aW9uIHIocil7dGhpcy5kZWxlZ2F0ZT1yLHRoaXMub25TY3JvbGw9dCh0aGlzLm9uU2Nyb2xsLHRoaXMpLHRoaXMub25TY3JvbGw9ZS50aHJvdHRsZSh0aGlzLm9uU2Nyb2xsKX1yZXR1cm4gci5wcm90b3R5cGUuc3RhcnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zdGFydGVkP3ZvaWQgMDooYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLHRoaXMub25TY3JvbGwsITEpLHRoaXMub25TY3JvbGwoKSx0aGlzLnN0YXJ0ZWQ9ITApfSxyLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc3RhcnRlZD8ocmVtb3ZlRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLHRoaXMub25TY3JvbGwsITEpLHRoaXMuc3RhcnRlZD0hMSk6dm9pZCAwfSxyLnByb3RvdHlwZS5zY3JvbGxUb0VsZW1lbnQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQuc2Nyb2xsSW50b1ZpZXcoKX0sci5wcm90b3R5cGUuc2Nyb2xsVG9Qb3NpdGlvbj1mdW5jdGlvbih0KXt2YXIgZSxyO3JldHVybiBlPXQueCxyPXQueSx3aW5kb3cuc2Nyb2xsVG8oZSxyKX0sci5wcm90b3R5cGUub25TY3JvbGw9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMudXBkYXRlUG9zaXRpb24oe3g6d2luZG93LnBhZ2VYT2Zmc2V0LHk6d2luZG93LnBhZ2VZT2Zmc2V0fSl9LHIucHJvdG90eXBlLnVwZGF0ZVBvc2l0aW9uPWZ1bmN0aW9uKHQpe3ZhciBlO3JldHVybiB0aGlzLnBvc2l0aW9uPXQsbnVsbCE9KGU9dGhpcy5kZWxlZ2F0ZSk/ZS5zY3JvbGxQb3NpdGlvbkNoYW5nZWQodGhpcy5wb3NpdGlvbik6dm9pZCAwfSxyfSgpfS5jYWxsKHRoaXMpLGZ1bmN0aW9uKCl7ZS5TbmFwc2hvdENhY2hlPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCh0KXt0aGlzLnNpemU9dCx0aGlzLmtleXM9W10sdGhpcy5zbmFwc2hvdHM9e319dmFyIHI7cmV0dXJuIHQucHJvdG90eXBlLmhhcz1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gZT1yKHQpLGUgaW4gdGhpcy5zbmFwc2hvdHN9LHQucHJvdG90eXBlLmdldD1mdW5jdGlvbih0KXt2YXIgZTtpZih0aGlzLmhhcyh0KSlyZXR1cm4gZT10aGlzLnJlYWQodCksdGhpcy50b3VjaCh0KSxlfSx0LnByb3RvdHlwZS5wdXQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy53cml0ZSh0LGUpLHRoaXMudG91Y2godCksZX0sdC5wcm90b3R5cGUucmVhZD1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gZT1yKHQpLHRoaXMuc25hcHNob3RzW2VdfSx0LnByb3RvdHlwZS53cml0ZT1mdW5jdGlvbih0LGUpe3ZhciBuO3JldHVybiBuPXIodCksdGhpcy5zbmFwc2hvdHNbbl09ZX0sdC5wcm90b3R5cGUudG91Y2g9ZnVuY3Rpb24odCl7dmFyIGUsbjtyZXR1cm4gbj1yKHQpLGU9dGhpcy5rZXlzLmluZGV4T2YobiksZT4tMSYmdGhpcy5rZXlzLnNwbGljZShlLDEpLHRoaXMua2V5cy51bnNoaWZ0KG4pLHRoaXMudHJpbSgpfSx0LnByb3RvdHlwZS50cmltPWZ1bmN0aW9uKCl7dmFyIHQsZSxyLG4sbztmb3Iobj10aGlzLmtleXMuc3BsaWNlKHRoaXMuc2l6ZSksbz1bXSx0PTAscj1uLmxlbmd0aDtyPnQ7dCsrKWU9blt0XSxvLnB1c2goZGVsZXRlIHRoaXMuc25hcHNob3RzW2VdKTtyZXR1cm4gb30scj1mdW5jdGlvbih0KXtyZXR1cm4gZS5Mb2NhdGlvbi53cmFwKHQpLnRvQ2FjaGVLZXkoKX0sdH0oKX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3ZhciB0PWZ1bmN0aW9uKHQsZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHQuYXBwbHkoZSxhcmd1bWVudHMpfX07ZS5WaXNpdD1mdW5jdGlvbigpe2Z1bmN0aW9uIHIocixuLG8pe3RoaXMuY29udHJvbGxlcj1yLHRoaXMuYWN0aW9uPW8sdGhpcy5wZXJmb3JtU2Nyb2xsPXQodGhpcy5wZXJmb3JtU2Nyb2xsLHRoaXMpLHRoaXMuaWRlbnRpZmllcj1lLnV1aWQoKSx0aGlzLmxvY2F0aW9uPWUuTG9jYXRpb24ud3JhcChuKSx0aGlzLmFkYXB0ZXI9dGhpcy5jb250cm9sbGVyLmFkYXB0ZXIsdGhpcy5zdGF0ZT1cImluaXRpYWxpemVkXCIsdGhpcy50aW1pbmdNZXRyaWNzPXt9fXZhciBuO3JldHVybiByLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe3JldHVyblwiaW5pdGlhbGl6ZWRcIj09PXRoaXMuc3RhdGU/KHRoaXMucmVjb3JkVGltaW5nTWV0cmljKFwidmlzaXRTdGFydFwiKSx0aGlzLnN0YXRlPVwic3RhcnRlZFwiLHRoaXMuYWRhcHRlci52aXNpdFN0YXJ0ZWQodGhpcykpOnZvaWQgMH0sci5wcm90b3R5cGUuY2FuY2VsPWZ1bmN0aW9uKCl7dmFyIHQ7cmV0dXJuXCJzdGFydGVkXCI9PT10aGlzLnN0YXRlPyhudWxsIT0odD10aGlzLnJlcXVlc3QpJiZ0LmNhbmNlbCgpLHRoaXMuY2FuY2VsUmVuZGVyKCksdGhpcy5zdGF0ZT1cImNhbmNlbGVkXCIpOnZvaWQgMH0sci5wcm90b3R5cGUuY29tcGxldGU9ZnVuY3Rpb24oKXt2YXIgdDtyZXR1cm5cInN0YXJ0ZWRcIj09PXRoaXMuc3RhdGU/KHRoaXMucmVjb3JkVGltaW5nTWV0cmljKFwidmlzaXRFbmRcIiksdGhpcy5zdGF0ZT1cImNvbXBsZXRlZFwiLFwiZnVuY3Rpb25cIj09dHlwZW9mKHQ9dGhpcy5hZGFwdGVyKS52aXNpdENvbXBsZXRlZCYmdC52aXNpdENvbXBsZXRlZCh0aGlzKSx0aGlzLmNvbnRyb2xsZXIudmlzaXRDb21wbGV0ZWQodGhpcykpOnZvaWQgMH0sci5wcm90b3R5cGUuZmFpbD1mdW5jdGlvbigpe3ZhciB0O3JldHVyblwic3RhcnRlZFwiPT09dGhpcy5zdGF0ZT8odGhpcy5zdGF0ZT1cImZhaWxlZFwiLFwiZnVuY3Rpb25cIj09dHlwZW9mKHQ9dGhpcy5hZGFwdGVyKS52aXNpdEZhaWxlZD90LnZpc2l0RmFpbGVkKHRoaXMpOnZvaWQgMCk6dm9pZCAwfSxyLnByb3RvdHlwZS5jaGFuZ2VIaXN0b3J5PWZ1bmN0aW9uKCl7dmFyIHQsZTtyZXR1cm4gdGhpcy5oaXN0b3J5Q2hhbmdlZD92b2lkIDA6KHQ9dGhpcy5sb2NhdGlvbi5pc0VxdWFsVG8odGhpcy5yZWZlcnJlcik/XCJyZXBsYWNlXCI6dGhpcy5hY3Rpb24sZT1uKHQpLHRoaXMuY29udHJvbGxlcltlXSh0aGlzLmxvY2F0aW9uLHRoaXMucmVzdG9yYXRpb25JZGVudGlmaWVyKSx0aGlzLmhpc3RvcnlDaGFuZ2VkPSEwKX0sci5wcm90b3R5cGUuaXNzdWVSZXF1ZXN0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2hvdWxkSXNzdWVSZXF1ZXN0KCkmJm51bGw9PXRoaXMucmVxdWVzdD8odGhpcy5wcm9ncmVzcz0wLHRoaXMucmVxdWVzdD1uZXcgZS5IdHRwUmVxdWVzdCh0aGlzLHRoaXMubG9jYXRpb24sdGhpcy5yZWZlcnJlciksdGhpcy5yZXF1ZXN0LnNlbmQoKSk6dm9pZCAwfSxyLnByb3RvdHlwZS5nZXRDYWNoZWRTbmFwc2hvdD1mdW5jdGlvbigpe3ZhciB0O3JldHVybiEodD10aGlzLmNvbnRyb2xsZXIuZ2V0Q2FjaGVkU25hcHNob3RGb3JMb2NhdGlvbih0aGlzLmxvY2F0aW9uKSl8fG51bGwhPXRoaXMubG9jYXRpb24uYW5jaG9yJiYhdC5oYXNBbmNob3IodGhpcy5sb2NhdGlvbi5hbmNob3IpfHxcInJlc3RvcmVcIiE9PXRoaXMuYWN0aW9uJiYhdC5pc1ByZXZpZXdhYmxlKCk/dm9pZCAwOnR9LHIucHJvdG90eXBlLmhhc0NhY2hlZFNuYXBzaG90PWZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPXRoaXMuZ2V0Q2FjaGVkU25hcHNob3QoKX0sci5wcm90b3R5cGUubG9hZENhY2hlZFNuYXBzaG90PWZ1bmN0aW9uKCl7dmFyIHQsZTtyZXR1cm4oZT10aGlzLmdldENhY2hlZFNuYXBzaG90KCkpPyh0PXRoaXMuc2hvdWxkSXNzdWVSZXF1ZXN0KCksdGhpcy5yZW5kZXIoZnVuY3Rpb24oKXt2YXIgcjtyZXR1cm4gdGhpcy5jYWNoZVNuYXBzaG90KCksdGhpcy5jb250cm9sbGVyLnJlbmRlcih7c25hcHNob3Q6ZSxpc1ByZXZpZXc6dH0sdGhpcy5wZXJmb3JtU2Nyb2xsKSxcImZ1bmN0aW9uXCI9PXR5cGVvZihyPXRoaXMuYWRhcHRlcikudmlzaXRSZW5kZXJlZCYmci52aXNpdFJlbmRlcmVkKHRoaXMpLHQ/dm9pZCAwOnRoaXMuY29tcGxldGUoKX0pKTp2b2lkIDB9LHIucHJvdG90eXBlLmxvYWRSZXNwb25zZT1mdW5jdGlvbigpe3JldHVybiBudWxsIT10aGlzLnJlc3BvbnNlP3RoaXMucmVuZGVyKGZ1bmN0aW9uKCl7dmFyIHQsZTtyZXR1cm4gdGhpcy5jYWNoZVNuYXBzaG90KCksdGhpcy5yZXF1ZXN0LmZhaWxlZD8odGhpcy5jb250cm9sbGVyLnJlbmRlcih7ZXJyb3I6dGhpcy5yZXNwb25zZX0sdGhpcy5wZXJmb3JtU2Nyb2xsKSxcImZ1bmN0aW9uXCI9PXR5cGVvZih0PXRoaXMuYWRhcHRlcikudmlzaXRSZW5kZXJlZCYmdC52aXNpdFJlbmRlcmVkKHRoaXMpLHRoaXMuZmFpbCgpKToodGhpcy5jb250cm9sbGVyLnJlbmRlcih7c25hcHNob3Q6dGhpcy5yZXNwb25zZX0sdGhpcy5wZXJmb3JtU2Nyb2xsKSxcImZ1bmN0aW9uXCI9PXR5cGVvZihlPXRoaXMuYWRhcHRlcikudmlzaXRSZW5kZXJlZCYmZS52aXNpdFJlbmRlcmVkKHRoaXMpLHRoaXMuY29tcGxldGUoKSl9KTp2b2lkIDB9LHIucHJvdG90eXBlLmZvbGxvd1JlZGlyZWN0PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucmVkaXJlY3RlZFRvTG9jYXRpb24mJiF0aGlzLmZvbGxvd2VkUmVkaXJlY3Q/KHRoaXMubG9jYXRpb249dGhpcy5yZWRpcmVjdGVkVG9Mb2NhdGlvbix0aGlzLmNvbnRyb2xsZXIucmVwbGFjZUhpc3RvcnlXaXRoTG9jYXRpb25BbmRSZXN0b3JhdGlvbklkZW50aWZpZXIodGhpcy5yZWRpcmVjdGVkVG9Mb2NhdGlvbix0aGlzLnJlc3RvcmF0aW9uSWRlbnRpZmllciksdGhpcy5mb2xsb3dlZFJlZGlyZWN0PSEwKTp2b2lkIDB9LHIucHJvdG90eXBlLnJlcXVlc3RTdGFydGVkPWZ1bmN0aW9uKCl7dmFyIHQ7cmV0dXJuIHRoaXMucmVjb3JkVGltaW5nTWV0cmljKFwicmVxdWVzdFN0YXJ0XCIpLFwiZnVuY3Rpb25cIj09dHlwZW9mKHQ9dGhpcy5hZGFwdGVyKS52aXNpdFJlcXVlc3RTdGFydGVkP3QudmlzaXRSZXF1ZXN0U3RhcnRlZCh0aGlzKTp2b2lkIDB9LHIucHJvdG90eXBlLnJlcXVlc3RQcm9ncmVzc2VkPWZ1bmN0aW9uKHQpe3ZhciBlO3JldHVybiB0aGlzLnByb2dyZXNzPXQsXCJmdW5jdGlvblwiPT10eXBlb2YoZT10aGlzLmFkYXB0ZXIpLnZpc2l0UmVxdWVzdFByb2dyZXNzZWQ/ZS52aXNpdFJlcXVlc3RQcm9ncmVzc2VkKHRoaXMpOnZvaWQgMH0sci5wcm90b3R5cGUucmVxdWVzdENvbXBsZXRlZFdpdGhSZXNwb25zZT1mdW5jdGlvbih0LHIpe3JldHVybiB0aGlzLnJlc3BvbnNlPXQsbnVsbCE9ciYmKHRoaXMucmVkaXJlY3RlZFRvTG9jYXRpb249ZS5Mb2NhdGlvbi53cmFwKHIpKSx0aGlzLmFkYXB0ZXIudmlzaXRSZXF1ZXN0Q29tcGxldGVkKHRoaXMpfSxyLnByb3RvdHlwZS5yZXF1ZXN0RmFpbGVkV2l0aFN0YXR1c0NvZGU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5yZXNwb25zZT1lLHRoaXMuYWRhcHRlci52aXNpdFJlcXVlc3RGYWlsZWRXaXRoU3RhdHVzQ29kZSh0aGlzLHQpfSxyLnByb3RvdHlwZS5yZXF1ZXN0RmluaXNoZWQ9ZnVuY3Rpb24oKXt2YXIgdDtyZXR1cm4gdGhpcy5yZWNvcmRUaW1pbmdNZXRyaWMoXCJyZXF1ZXN0RW5kXCIpLFwiZnVuY3Rpb25cIj09dHlwZW9mKHQ9dGhpcy5hZGFwdGVyKS52aXNpdFJlcXVlc3RGaW5pc2hlZD90LnZpc2l0UmVxdWVzdEZpbmlzaGVkKHRoaXMpOnZvaWQgMH0sci5wcm90b3R5cGUucGVyZm9ybVNjcm9sbD1mdW5jdGlvbigpe3JldHVybiB0aGlzLnNjcm9sbGVkP3ZvaWQgMDooXCJyZXN0b3JlXCI9PT10aGlzLmFjdGlvbj90aGlzLnNjcm9sbFRvUmVzdG9yZWRQb3NpdGlvbigpfHx0aGlzLnNjcm9sbFRvVG9wKCk6dGhpcy5zY3JvbGxUb0FuY2hvcigpfHx0aGlzLnNjcm9sbFRvVG9wKCksdGhpcy5zY3JvbGxlZD0hMCl9LHIucHJvdG90eXBlLnNjcm9sbFRvUmVzdG9yZWRQb3NpdGlvbj1mdW5jdGlvbigpe3ZhciB0LGU7cmV0dXJuIHQ9bnVsbCE9KGU9dGhpcy5yZXN0b3JhdGlvbkRhdGEpP2Uuc2Nyb2xsUG9zaXRpb246dm9pZCAwLG51bGwhPXQ/KHRoaXMuY29udHJvbGxlci5zY3JvbGxUb1Bvc2l0aW9uKHQpLCEwKTp2b2lkIDB9LHIucHJvdG90eXBlLnNjcm9sbFRvQW5jaG9yPWZ1bmN0aW9uKCl7cmV0dXJuIG51bGwhPXRoaXMubG9jYXRpb24uYW5jaG9yPyh0aGlzLmNvbnRyb2xsZXIuc2Nyb2xsVG9BbmNob3IodGhpcy5sb2NhdGlvbi5hbmNob3IpLCEwKTp2b2lkIDB9LHIucHJvdG90eXBlLnNjcm9sbFRvVG9wPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY29udHJvbGxlci5zY3JvbGxUb1Bvc2l0aW9uKHt4OjAseTowfSl9LHIucHJvdG90eXBlLnJlY29yZFRpbWluZ01ldHJpYz1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gbnVsbCE9KGU9dGhpcy50aW1pbmdNZXRyaWNzKVt0XT9lW3RdOmVbdF09KG5ldyBEYXRlKS5nZXRUaW1lKCl9LHIucHJvdG90eXBlLmdldFRpbWluZ01ldHJpY3M9ZnVuY3Rpb24oKXtyZXR1cm4gZS5jb3B5T2JqZWN0KHRoaXMudGltaW5nTWV0cmljcyl9LG49ZnVuY3Rpb24odCl7c3dpdGNoKHQpe2Nhc2VcInJlcGxhY2VcIjpyZXR1cm5cInJlcGxhY2VIaXN0b3J5V2l0aExvY2F0aW9uQW5kUmVzdG9yYXRpb25JZGVudGlmaWVyXCI7Y2FzZVwiYWR2YW5jZVwiOmNhc2VcInJlc3RvcmVcIjpyZXR1cm5cInB1c2hIaXN0b3J5V2l0aExvY2F0aW9uQW5kUmVzdG9yYXRpb25JZGVudGlmaWVyXCJ9fSxyLnByb3RvdHlwZS5zaG91bGRJc3N1ZVJlcXVlc3Q9ZnVuY3Rpb24oKXtyZXR1cm5cInJlc3RvcmVcIj09PXRoaXMuYWN0aW9uPyF0aGlzLmhhc0NhY2hlZFNuYXBzaG90KCk6ITB9LHIucHJvdG90eXBlLmNhY2hlU25hcHNob3Q9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5zbmFwc2hvdENhY2hlZD92b2lkIDA6KHRoaXMuY29udHJvbGxlci5jYWNoZVNuYXBzaG90KCksdGhpcy5zbmFwc2hvdENhY2hlZD0hMCl9LHIucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5jYW5jZWxSZW5kZXIoKSx0aGlzLmZyYW1lPXJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbihlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZS5mcmFtZT1udWxsLHQuY2FsbChlKX19KHRoaXMpKX0sci5wcm90b3R5cGUuY2FuY2VsUmVuZGVyPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuZnJhbWU/Y2FuY2VsQW5pbWF0aW9uRnJhbWUodGhpcy5mcmFtZSk6dm9pZCAwfSxyfSgpfS5jYWxsKHRoaXMpLGZ1bmN0aW9uKCl7dmFyIHQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdC5hcHBseShlLGFyZ3VtZW50cyl9fTtlLkNvbnRyb2xsZXI9ZnVuY3Rpb24oKXtmdW5jdGlvbiByKCl7dGhpcy5jbGlja0J1YmJsZWQ9dCh0aGlzLmNsaWNrQnViYmxlZCx0aGlzKSx0aGlzLmNsaWNrQ2FwdHVyZWQ9dCh0aGlzLmNsaWNrQ2FwdHVyZWQsdGhpcyksdGhpcy5wYWdlTG9hZGVkPXQodGhpcy5wYWdlTG9hZGVkLHRoaXMpLHRoaXMuaGlzdG9yeT1uZXcgZS5IaXN0b3J5KHRoaXMpLHRoaXMudmlldz1uZXcgZS5WaWV3KHRoaXMpLHRoaXMuc2Nyb2xsTWFuYWdlcj1uZXcgZS5TY3JvbGxNYW5hZ2VyKHRoaXMpLHRoaXMucmVzdG9yYXRpb25EYXRhPXt9LHRoaXMuY2xlYXJDYWNoZSgpLHRoaXMuc2V0UHJvZ3Jlc3NCYXJEZWxheSg1MDApfXJldHVybiByLnByb3RvdHlwZS5zdGFydD1mdW5jdGlvbigpe3JldHVybiBlLnN1cHBvcnRlZCYmIXRoaXMuc3RhcnRlZD8oYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5jbGlja0NhcHR1cmVkLCEwKSxhZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLHRoaXMucGFnZUxvYWRlZCwhMSksdGhpcy5zY3JvbGxNYW5hZ2VyLnN0YXJ0KCksdGhpcy5zdGFydEhpc3RvcnkoKSx0aGlzLnN0YXJ0ZWQ9ITAsdGhpcy5lbmFibGVkPSEwKTp2b2lkIDB9LHIucHJvdG90eXBlLmRpc2FibGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5lbmFibGVkPSExfSxyLnByb3RvdHlwZS5zdG9wPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc3RhcnRlZD8ocmVtb3ZlRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5jbGlja0NhcHR1cmVkLCEwKSxyZW1vdmVFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLHRoaXMucGFnZUxvYWRlZCwhMSksdGhpcy5zY3JvbGxNYW5hZ2VyLnN0b3AoKSx0aGlzLnN0b3BIaXN0b3J5KCksdGhpcy5zdGFydGVkPSExKTp2b2lkIDB9LHIucHJvdG90eXBlLmNsZWFyQ2FjaGU9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jYWNoZT1uZXcgZS5TbmFwc2hvdENhY2hlKDEwKX0sci5wcm90b3R5cGUudmlzaXQ9ZnVuY3Rpb24odCxyKXt2YXIgbixvO3JldHVybiBudWxsPT1yJiYocj17fSksdD1lLkxvY2F0aW9uLndyYXAodCksdGhpcy5hcHBsaWNhdGlvbkFsbG93c1Zpc2l0aW5nTG9jYXRpb24odCk/dGhpcy5sb2NhdGlvbklzVmlzaXRhYmxlKHQpPyhuPW51bGwhPShvPXIuYWN0aW9uKT9vOlwiYWR2YW5jZVwiLHRoaXMuYWRhcHRlci52aXNpdFByb3Bvc2VkVG9Mb2NhdGlvbldpdGhBY3Rpb24odCxuKSk6d2luZG93LmxvY2F0aW9uPXQ6dm9pZCAwfSxyLnByb3RvdHlwZS5zdGFydFZpc2l0VG9Mb2NhdGlvbldpdGhBY3Rpb249ZnVuY3Rpb24odCxyLG4pe3ZhciBvO3JldHVybiBlLnN1cHBvcnRlZD8obz10aGlzLmdldFJlc3RvcmF0aW9uRGF0YUZvcklkZW50aWZpZXIobiksdGhpcy5zdGFydFZpc2l0KHQscix7cmVzdG9yYXRpb25EYXRhOm99KSk6d2luZG93LmxvY2F0aW9uPXR9LHIucHJvdG90eXBlLnNldFByb2dyZXNzQmFyRGVsYXk9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucHJvZ3Jlc3NCYXJEZWxheT10fSxyLnByb3RvdHlwZS5zdGFydEhpc3Rvcnk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sb2NhdGlvbj1lLkxvY2F0aW9uLndyYXAod2luZG93LmxvY2F0aW9uKSx0aGlzLnJlc3RvcmF0aW9uSWRlbnRpZmllcj1lLnV1aWQoKSx0aGlzLmhpc3Rvcnkuc3RhcnQoKSx0aGlzLmhpc3RvcnkucmVwbGFjZSh0aGlzLmxvY2F0aW9uLHRoaXMucmVzdG9yYXRpb25JZGVudGlmaWVyKX0sci5wcm90b3R5cGUuc3RvcEhpc3Rvcnk9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5oaXN0b3J5LnN0b3AoKX0sci5wcm90b3R5cGUucHVzaEhpc3RvcnlXaXRoTG9jYXRpb25BbmRSZXN0b3JhdGlvbklkZW50aWZpZXI9ZnVuY3Rpb24odCxyKXtyZXR1cm4gdGhpcy5yZXN0b3JhdGlvbklkZW50aWZpZXI9cix0aGlzLmxvY2F0aW9uPWUuTG9jYXRpb24ud3JhcCh0KSx0aGlzLmhpc3RvcnkucHVzaCh0aGlzLmxvY2F0aW9uLHRoaXMucmVzdG9yYXRpb25JZGVudGlmaWVyKX0sci5wcm90b3R5cGUucmVwbGFjZUhpc3RvcnlXaXRoTG9jYXRpb25BbmRSZXN0b3JhdGlvbklkZW50aWZpZXI9ZnVuY3Rpb24odCxyKXtyZXR1cm4gdGhpcy5yZXN0b3JhdGlvbklkZW50aWZpZXI9cix0aGlzLmxvY2F0aW9uPWUuTG9jYXRpb24ud3JhcCh0KSx0aGlzLmhpc3RvcnkucmVwbGFjZSh0aGlzLmxvY2F0aW9uLHRoaXMucmVzdG9yYXRpb25JZGVudGlmaWVyKX0sci5wcm90b3R5cGUuaGlzdG9yeVBvcHBlZFRvTG9jYXRpb25XaXRoUmVzdG9yYXRpb25JZGVudGlmaWVyPWZ1bmN0aW9uKHQscil7dmFyIG47cmV0dXJuIHRoaXMucmVzdG9yYXRpb25JZGVudGlmaWVyPXIsdGhpcy5lbmFibGVkPyhuPXRoaXMuZ2V0UmVzdG9yYXRpb25EYXRhRm9ySWRlbnRpZmllcih0aGlzLnJlc3RvcmF0aW9uSWRlbnRpZmllciksdGhpcy5zdGFydFZpc2l0KHQsXCJyZXN0b3JlXCIse3Jlc3RvcmF0aW9uSWRlbnRpZmllcjp0aGlzLnJlc3RvcmF0aW9uSWRlbnRpZmllcixyZXN0b3JhdGlvbkRhdGE6bixoaXN0b3J5Q2hhbmdlZDohMH0pLHRoaXMubG9jYXRpb249ZS5Mb2NhdGlvbi53cmFwKHQpKTp0aGlzLmFkYXB0ZXIucGFnZUludmFsaWRhdGVkKCl9LHIucHJvdG90eXBlLmdldENhY2hlZFNuYXBzaG90Rm9yTG9jYXRpb249ZnVuY3Rpb24odCl7dmFyIGU7cmV0dXJuIG51bGwhPShlPXRoaXMuY2FjaGUuZ2V0KHQpKT9lLmNsb25lKCk6dm9pZCAwfSxyLnByb3RvdHlwZS5zaG91bGRDYWNoZVNuYXBzaG90PWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmlldy5nZXRTbmFwc2hvdCgpLmlzQ2FjaGVhYmxlKCk7XG59LHIucHJvdG90eXBlLmNhY2hlU25hcHNob3Q9ZnVuY3Rpb24oKXt2YXIgdCxyO3JldHVybiB0aGlzLnNob3VsZENhY2hlU25hcHNob3QoKT8odGhpcy5ub3RpZnlBcHBsaWNhdGlvbkJlZm9yZUNhY2hpbmdTbmFwc2hvdCgpLHI9dGhpcy52aWV3LmdldFNuYXBzaG90KCksdD10aGlzLmxhc3RSZW5kZXJlZExvY2F0aW9uLGUuZGVmZXIoZnVuY3Rpb24oZSl7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGUuY2FjaGUucHV0KHQsci5jbG9uZSgpKX19KHRoaXMpKSk6dm9pZCAwfSxyLnByb3RvdHlwZS5zY3JvbGxUb0FuY2hvcj1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4oZT10aGlzLnZpZXcuZ2V0RWxlbWVudEZvckFuY2hvcih0KSk/dGhpcy5zY3JvbGxUb0VsZW1lbnQoZSk6dGhpcy5zY3JvbGxUb1Bvc2l0aW9uKHt4OjAseTowfSl9LHIucHJvdG90eXBlLnNjcm9sbFRvRWxlbWVudD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5zY3JvbGxNYW5hZ2VyLnNjcm9sbFRvRWxlbWVudCh0KX0sci5wcm90b3R5cGUuc2Nyb2xsVG9Qb3NpdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5zY3JvbGxNYW5hZ2VyLnNjcm9sbFRvUG9zaXRpb24odCl9LHIucHJvdG90eXBlLnNjcm9sbFBvc2l0aW9uQ2hhbmdlZD1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gZT10aGlzLmdldEN1cnJlbnRSZXN0b3JhdGlvbkRhdGEoKSxlLnNjcm9sbFBvc2l0aW9uPXR9LHIucHJvdG90eXBlLnJlbmRlcj1mdW5jdGlvbih0LGUpe3JldHVybiB0aGlzLnZpZXcucmVuZGVyKHQsZSl9LHIucHJvdG90eXBlLnZpZXdJbnZhbGlkYXRlZD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmFkYXB0ZXIucGFnZUludmFsaWRhdGVkKCl9LHIucHJvdG90eXBlLnZpZXdXaWxsUmVuZGVyPWZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLm5vdGlmeUFwcGxpY2F0aW9uQmVmb3JlUmVuZGVyKHQpfSxyLnByb3RvdHlwZS52aWV3UmVuZGVyZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5sYXN0UmVuZGVyZWRMb2NhdGlvbj10aGlzLmN1cnJlbnRWaXNpdC5sb2NhdGlvbix0aGlzLm5vdGlmeUFwcGxpY2F0aW9uQWZ0ZXJSZW5kZXIoKX0sci5wcm90b3R5cGUucGFnZUxvYWRlZD1mdW5jdGlvbigpe3JldHVybiB0aGlzLmxhc3RSZW5kZXJlZExvY2F0aW9uPXRoaXMubG9jYXRpb24sdGhpcy5ub3RpZnlBcHBsaWNhdGlvbkFmdGVyUGFnZUxvYWQoKX0sci5wcm90b3R5cGUuY2xpY2tDYXB0dXJlZD1mdW5jdGlvbigpe3JldHVybiByZW1vdmVFdmVudExpc3RlbmVyKFwiY2xpY2tcIix0aGlzLmNsaWNrQnViYmxlZCwhMSksYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsdGhpcy5jbGlja0J1YmJsZWQsITEpfSxyLnByb3RvdHlwZS5jbGlja0J1YmJsZWQ9ZnVuY3Rpb24odCl7dmFyIGUscixuO3JldHVybiB0aGlzLmVuYWJsZWQmJnRoaXMuY2xpY2tFdmVudElzU2lnbmlmaWNhbnQodCkmJihyPXRoaXMuZ2V0VmlzaXRhYmxlTGlua0Zvck5vZGUodC50YXJnZXQpKSYmKG49dGhpcy5nZXRWaXNpdGFibGVMb2NhdGlvbkZvckxpbmsocikpJiZ0aGlzLmFwcGxpY2F0aW9uQWxsb3dzRm9sbG93aW5nTGlua1RvTG9jYXRpb24ocixuKT8odC5wcmV2ZW50RGVmYXVsdCgpLGU9dGhpcy5nZXRBY3Rpb25Gb3JMaW5rKHIpLHRoaXMudmlzaXQobix7YWN0aW9uOmV9KSk6dm9pZCAwfSxyLnByb3RvdHlwZS5hcHBsaWNhdGlvbkFsbG93c0ZvbGxvd2luZ0xpbmtUb0xvY2F0aW9uPWZ1bmN0aW9uKHQsZSl7dmFyIHI7cmV0dXJuIHI9dGhpcy5ub3RpZnlBcHBsaWNhdGlvbkFmdGVyQ2xpY2tpbmdMaW5rVG9Mb2NhdGlvbih0LGUpLCFyLmRlZmF1bHRQcmV2ZW50ZWR9LHIucHJvdG90eXBlLmFwcGxpY2F0aW9uQWxsb3dzVmlzaXRpbmdMb2NhdGlvbj1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gZT10aGlzLm5vdGlmeUFwcGxpY2F0aW9uQmVmb3JlVmlzaXRpbmdMb2NhdGlvbih0KSwhZS5kZWZhdWx0UHJldmVudGVkfSxyLnByb3RvdHlwZS5ub3RpZnlBcHBsaWNhdGlvbkFmdGVyQ2xpY2tpbmdMaW5rVG9Mb2NhdGlvbj1mdW5jdGlvbih0LHIpe3JldHVybiBlLmRpc3BhdGNoKFwidHVyYm9saW5rczpjbGlja1wiLHt0YXJnZXQ6dCxkYXRhOnt1cmw6ci5hYnNvbHV0ZVVSTH0sY2FuY2VsYWJsZTohMH0pfSxyLnByb3RvdHlwZS5ub3RpZnlBcHBsaWNhdGlvbkJlZm9yZVZpc2l0aW5nTG9jYXRpb249ZnVuY3Rpb24odCl7cmV0dXJuIGUuZGlzcGF0Y2goXCJ0dXJib2xpbmtzOmJlZm9yZS12aXNpdFwiLHtkYXRhOnt1cmw6dC5hYnNvbHV0ZVVSTH0sY2FuY2VsYWJsZTohMH0pfSxyLnByb3RvdHlwZS5ub3RpZnlBcHBsaWNhdGlvbkFmdGVyVmlzaXRpbmdMb2NhdGlvbj1mdW5jdGlvbih0KXtyZXR1cm4gZS5kaXNwYXRjaChcInR1cmJvbGlua3M6dmlzaXRcIix7ZGF0YTp7dXJsOnQuYWJzb2x1dGVVUkx9fSl9LHIucHJvdG90eXBlLm5vdGlmeUFwcGxpY2F0aW9uQmVmb3JlQ2FjaGluZ1NuYXBzaG90PWZ1bmN0aW9uKCl7cmV0dXJuIGUuZGlzcGF0Y2goXCJ0dXJib2xpbmtzOmJlZm9yZS1jYWNoZVwiKX0sci5wcm90b3R5cGUubm90aWZ5QXBwbGljYXRpb25CZWZvcmVSZW5kZXI9ZnVuY3Rpb24odCl7cmV0dXJuIGUuZGlzcGF0Y2goXCJ0dXJib2xpbmtzOmJlZm9yZS1yZW5kZXJcIix7ZGF0YTp7bmV3Qm9keTp0fX0pfSxyLnByb3RvdHlwZS5ub3RpZnlBcHBsaWNhdGlvbkFmdGVyUmVuZGVyPWZ1bmN0aW9uKCl7cmV0dXJuIGUuZGlzcGF0Y2goXCJ0dXJib2xpbmtzOnJlbmRlclwiKX0sci5wcm90b3R5cGUubm90aWZ5QXBwbGljYXRpb25BZnRlclBhZ2VMb2FkPWZ1bmN0aW9uKHQpe3JldHVybiBudWxsPT10JiYodD17fSksZS5kaXNwYXRjaChcInR1cmJvbGlua3M6bG9hZFwiLHtkYXRhOnt1cmw6dGhpcy5sb2NhdGlvbi5hYnNvbHV0ZVVSTCx0aW1pbmc6dH19KX0sci5wcm90b3R5cGUuc3RhcnRWaXNpdD1mdW5jdGlvbih0LGUscil7dmFyIG47cmV0dXJuIG51bGwhPShuPXRoaXMuY3VycmVudFZpc2l0KSYmbi5jYW5jZWwoKSx0aGlzLmN1cnJlbnRWaXNpdD10aGlzLmNyZWF0ZVZpc2l0KHQsZSxyKSx0aGlzLmN1cnJlbnRWaXNpdC5zdGFydCgpLHRoaXMubm90aWZ5QXBwbGljYXRpb25BZnRlclZpc2l0aW5nTG9jYXRpb24odCl9LHIucHJvdG90eXBlLmNyZWF0ZVZpc2l0PWZ1bmN0aW9uKHQscixuKXt2YXIgbyxpLHMsYSx1O3JldHVybiBpPW51bGwhPW4/bjp7fSxhPWkucmVzdG9yYXRpb25JZGVudGlmaWVyLHM9aS5yZXN0b3JhdGlvbkRhdGEsbz1pLmhpc3RvcnlDaGFuZ2VkLHU9bmV3IGUuVmlzaXQodGhpcyx0LHIpLHUucmVzdG9yYXRpb25JZGVudGlmaWVyPW51bGwhPWE/YTplLnV1aWQoKSx1LnJlc3RvcmF0aW9uRGF0YT1lLmNvcHlPYmplY3QocyksdS5oaXN0b3J5Q2hhbmdlZD1vLHUucmVmZXJyZXI9dGhpcy5sb2NhdGlvbix1fSxyLnByb3RvdHlwZS52aXNpdENvbXBsZXRlZD1mdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5ub3RpZnlBcHBsaWNhdGlvbkFmdGVyUGFnZUxvYWQodC5nZXRUaW1pbmdNZXRyaWNzKCkpfSxyLnByb3RvdHlwZS5jbGlja0V2ZW50SXNTaWduaWZpY2FudD1mdW5jdGlvbih0KXtyZXR1cm4hKHQuZGVmYXVsdFByZXZlbnRlZHx8dC50YXJnZXQuaXNDb250ZW50RWRpdGFibGV8fHQud2hpY2g+MXx8dC5hbHRLZXl8fHQuY3RybEtleXx8dC5tZXRhS2V5fHx0LnNoaWZ0S2V5KX0sci5wcm90b3R5cGUuZ2V0VmlzaXRhYmxlTGlua0Zvck5vZGU9ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMubm9kZUlzVmlzaXRhYmxlKHQpP2UuY2xvc2VzdCh0LFwiYVtocmVmXTpub3QoW3RhcmdldF0pOm5vdChbZG93bmxvYWRdKVwiKTp2b2lkIDB9LHIucHJvdG90eXBlLmdldFZpc2l0YWJsZUxvY2F0aW9uRm9yTGluaz1mdW5jdGlvbih0KXt2YXIgcjtyZXR1cm4gcj1uZXcgZS5Mb2NhdGlvbih0LmdldEF0dHJpYnV0ZShcImhyZWZcIikpLHRoaXMubG9jYXRpb25Jc1Zpc2l0YWJsZShyKT9yOnZvaWQgMH0sci5wcm90b3R5cGUuZ2V0QWN0aW9uRm9yTGluaz1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gbnVsbCE9KGU9dC5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR1cmJvbGlua3MtYWN0aW9uXCIpKT9lOlwiYWR2YW5jZVwifSxyLnByb3RvdHlwZS5ub2RlSXNWaXNpdGFibGU9ZnVuY3Rpb24odCl7dmFyIHI7cmV0dXJuKHI9ZS5jbG9zZXN0KHQsXCJbZGF0YS10dXJib2xpbmtzXVwiKSk/XCJmYWxzZVwiIT09ci5nZXRBdHRyaWJ1dGUoXCJkYXRhLXR1cmJvbGlua3NcIik6ITB9LHIucHJvdG90eXBlLmxvY2F0aW9uSXNWaXNpdGFibGU9ZnVuY3Rpb24odCl7cmV0dXJuIHQuaXNQcmVmaXhlZEJ5KHRoaXMudmlldy5nZXRSb290TG9jYXRpb24oKSkmJnQuaXNIVE1MKCl9LHIucHJvdG90eXBlLmdldEN1cnJlbnRSZXN0b3JhdGlvbkRhdGE9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5nZXRSZXN0b3JhdGlvbkRhdGFGb3JJZGVudGlmaWVyKHRoaXMucmVzdG9yYXRpb25JZGVudGlmaWVyKX0sci5wcm90b3R5cGUuZ2V0UmVzdG9yYXRpb25EYXRhRm9ySWRlbnRpZmllcj1mdW5jdGlvbih0KXt2YXIgZTtyZXR1cm4gbnVsbCE9KGU9dGhpcy5yZXN0b3JhdGlvbkRhdGEpW3RdP2VbdF06ZVt0XT17fX0scn0oKX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpeyFmdW5jdGlvbigpe3ZhciB0LGU7aWYoKHQ9ZT1kb2N1bWVudC5jdXJyZW50U2NyaXB0KSYmIWUuaGFzQXR0cmlidXRlKFwiZGF0YS10dXJib2xpbmtzLXN1cHByZXNzLXdhcm5pbmdcIikpZm9yKDt0PXQucGFyZW50Tm9kZTspaWYodD09PWRvY3VtZW50LmJvZHkpcmV0dXJuIGNvbnNvbGUud2FybihcIllvdSBhcmUgbG9hZGluZyBUdXJib2xpbmtzIGZyb20gYSA8c2NyaXB0PiBlbGVtZW50IGluc2lkZSB0aGUgPGJvZHk+IGVsZW1lbnQuIFRoaXMgaXMgcHJvYmFibHkgbm90IHdoYXQgeW91IG1lYW50IHRvIGRvIVxcblxcbkxvYWQgeW91ciBhcHBsaWNhdGlvblxcdTIwMTlzIEphdmFTY3JpcHQgYnVuZGxlIGluc2lkZSB0aGUgPGhlYWQ+IGVsZW1lbnQgaW5zdGVhZC4gPHNjcmlwdD4gZWxlbWVudHMgaW4gPGJvZHk+IGFyZSBldmFsdWF0ZWQgd2l0aCBlYWNoIHBhZ2UgY2hhbmdlLlxcblxcbkZvciBtb3JlIGluZm9ybWF0aW9uLCBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS90dXJib2xpbmtzL3R1cmJvbGlua3Mjd29ya2luZy13aXRoLXNjcmlwdC1lbGVtZW50c1xcblxcblxcdTIwMTRcXHUyMDE0XFxuU3VwcHJlc3MgdGhpcyB3YXJuaW5nIGJ5IGFkZGluZyBhIGBkYXRhLXR1cmJvbGlua3Mtc3VwcHJlc3Mtd2FybmluZ2AgYXR0cmlidXRlIHRvOiAlc1wiLGUub3V0ZXJIVE1MKX0oKX0uY2FsbCh0aGlzKSxmdW5jdGlvbigpe3ZhciB0LHIsbjtlLnN0YXJ0PWZ1bmN0aW9uKCl7cmV0dXJuIHIoKT8obnVsbD09ZS5jb250cm9sbGVyJiYoZS5jb250cm9sbGVyPXQoKSksZS5jb250cm9sbGVyLnN0YXJ0KCkpOnZvaWQgMH0scj1mdW5jdGlvbigpe3JldHVybiBudWxsPT13aW5kb3cuVHVyYm9saW5rcyYmKHdpbmRvdy5UdXJib2xpbmtzPWUpLG4oKX0sdD1mdW5jdGlvbigpe3ZhciB0O3JldHVybiB0PW5ldyBlLkNvbnRyb2xsZXIsdC5hZGFwdGVyPW5ldyBlLkJyb3dzZXJBZGFwdGVyKHQpLHR9LG49ZnVuY3Rpb24oKXtyZXR1cm4gd2luZG93LlR1cmJvbGlua3M9PT1lfSxuKCkmJmUuc3RhcnQoKX0uY2FsbCh0aGlzKX0pLmNhbGwodGhpcyksXCJvYmplY3RcIj09dHlwZW9mIG1vZHVsZSYmbW9kdWxlLmV4cG9ydHM/bW9kdWxlLmV4cG9ydHM9ZTpcImZ1bmN0aW9uXCI9PXR5cGVvZiBkZWZpbmUmJmRlZmluZS5hbWQmJmRlZmluZShlKX0pLmNhbGwodGhpcyk7IiwiLy8gVGhlIG1vZHVsZSBjYWNoZVxudmFyIF9fd2VicGFja19tb2R1bGVfY2FjaGVfXyA9IHt9O1xuXG4vLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcblx0aWYoX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSkge1xuXHRcdHJldHVybiBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4vLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuX193ZWJwYWNrX3JlcXVpcmVfXy5tID0gX193ZWJwYWNrX21vZHVsZXNfXztcblxuIiwiLy8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbl9fd2VicGFja19yZXF1aXJlX18ubiA9IChtb2R1bGUpID0+IHtcblx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG5cdFx0KCkgPT4gbW9kdWxlWydkZWZhdWx0J10gOlxuXHRcdCgpID0+IG1vZHVsZTtcblx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgeyBhOiBnZXR0ZXIgfSk7XG5cdHJldHVybiBnZXR0ZXI7XG59OyIsIi8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb25zIGZvciBoYXJtb255IGV4cG9ydHNcbl9fd2VicGFja19yZXF1aXJlX18uZCA9IChleHBvcnRzLCBkZWZpbml0aW9uKSA9PiB7XG5cdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcblx0XHRpZihfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZGVmaW5pdGlvbiwga2V5KSAmJiAhX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIGtleSkpIHtcblx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBrZXksIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBkZWZpbml0aW9uW2tleV0gfSk7XG5cdFx0fVxuXHR9XG59OyIsIl9fd2VicGFja19yZXF1aXJlX18uZiA9IHt9O1xuLy8gVGhpcyBmaWxlIGNvbnRhaW5zIG9ubHkgdGhlIGVudHJ5IGNodW5rLlxuLy8gVGhlIGNodW5rIGxvYWRpbmcgZnVuY3Rpb24gZm9yIGFkZGl0aW9uYWwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLmUgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gUHJvbWlzZS5hbGwoT2JqZWN0LmtleXMoX193ZWJwYWNrX3JlcXVpcmVfXy5mKS5yZWR1Y2UoKHByb21pc2VzLCBrZXkpID0+IHtcblx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmZba2V5XShjaHVua0lkLCBwcm9taXNlcyk7XG5cdFx0cmV0dXJuIHByb21pc2VzO1xuXHR9LCBbXSkpO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhc3luYyBjaHVua3Ncbl9fd2VicGFja19yZXF1aXJlX18udSA9IChjaHVua0lkKSA9PiB7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBub3QgYmFzZWQgb24gdGVtcGxhdGVcblx0aWYgKGNodW5rSWQgPT09IFwiZG9jc2VhcmNoXCIpIHJldHVybiBcImpzL1wiICsgY2h1bmtJZCArIFwiLmpzXCI7XG5cdC8vIHJldHVybiB1cmwgZm9yIGZpbGVuYW1lcyBiYXNlZCBvbiB0ZW1wbGF0ZVxuXHRyZXR1cm4gdW5kZWZpbmVkO1xufTsiLCIvLyBUaGlzIGZ1bmN0aW9uIGFsbG93IHRvIHJlZmVyZW5jZSBhbGwgY2h1bmtzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLm1pbmlDc3NGID0gKGNodW5rSWQpID0+IHtcblx0Ly8gcmV0dXJuIHVybCBmb3IgZmlsZW5hbWVzIGJhc2VkIG9uIHRlbXBsYXRlXG5cdHJldHVybiBcIlwiICsgY2h1bmtJZCArIFwiLmNzc1wiO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqLCBwcm9wKSIsInZhciBpblByb2dyZXNzID0ge307XG52YXIgZGF0YVdlYnBhY2tQcmVmaXggPSBcImFwcDpcIjtcbi8vIGxvYWRTY3JpcHQgZnVuY3Rpb24gdG8gbG9hZCBhIHNjcmlwdCB2aWEgc2NyaXB0IHRhZ1xuX193ZWJwYWNrX3JlcXVpcmVfXy5sID0gKHVybCwgZG9uZSwga2V5KSA9PiB7XG5cdGlmKGluUHJvZ3Jlc3NbdXJsXSkgeyBpblByb2dyZXNzW3VybF0ucHVzaChkb25lKTsgcmV0dXJuOyB9XG5cdHZhciBzY3JpcHQsIG5lZWRBdHRhY2g7XG5cdGlmKGtleSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0dmFyIHNjcmlwdHMgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInNjcmlwdFwiKTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc2NyaXB0cy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIHMgPSBzY3JpcHRzW2ldO1xuXHRcdFx0aWYocy5nZXRBdHRyaWJ1dGUoXCJzcmNcIikgPT0gdXJsIHx8IHMuZ2V0QXR0cmlidXRlKFwiZGF0YS13ZWJwYWNrXCIpID09IGRhdGFXZWJwYWNrUHJlZml4ICsga2V5KSB7IHNjcmlwdCA9IHM7IGJyZWFrOyB9XG5cdFx0fVxuXHR9XG5cdGlmKCFzY3JpcHQpIHtcblx0XHRuZWVkQXR0YWNoID0gdHJ1ZTtcblx0XHRzY3JpcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzY3JpcHQnKTtcblxuXHRcdHNjcmlwdC5jaGFyc2V0ID0gJ3V0Zi04Jztcblx0XHRzY3JpcHQudGltZW91dCA9IDEyMDtcblx0XHRpZiAoX193ZWJwYWNrX3JlcXVpcmVfXy5uYykge1xuXHRcdFx0c2NyaXB0LnNldEF0dHJpYnV0ZShcIm5vbmNlXCIsIF9fd2VicGFja19yZXF1aXJlX18ubmMpO1xuXHRcdH1cblx0XHRzY3JpcHQuc2V0QXR0cmlidXRlKFwiZGF0YS13ZWJwYWNrXCIsIGRhdGFXZWJwYWNrUHJlZml4ICsga2V5KTtcblx0XHRzY3JpcHQuc3JjID0gdXJsO1xuXHR9XG5cdGluUHJvZ3Jlc3NbdXJsXSA9IFtkb25lXTtcblx0dmFyIG9uU2NyaXB0Q29tcGxldGUgPSAocHJldiwgZXZlbnQpID0+IHtcblx0XHQvLyBhdm9pZCBtZW0gbGVha3MgaW4gSUUuXG5cdFx0c2NyaXB0Lm9uZXJyb3IgPSBzY3JpcHQub25sb2FkID0gbnVsbDtcblx0XHRjbGVhclRpbWVvdXQodGltZW91dCk7XG5cdFx0dmFyIGRvbmVGbnMgPSBpblByb2dyZXNzW3VybF07XG5cdFx0ZGVsZXRlIGluUHJvZ3Jlc3NbdXJsXTtcblx0XHRzY3JpcHQucGFyZW50Tm9kZSAmJiBzY3JpcHQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzY3JpcHQpO1xuXHRcdGRvbmVGbnMgJiYgZG9uZUZucy5mb3JFYWNoKChmbikgPT4gZm4oZXZlbnQpKTtcblx0XHRpZihwcmV2KSByZXR1cm4gcHJldihldmVudCk7XG5cdH1cblx0O1xuXHR2YXIgdGltZW91dCA9IHNldFRpbWVvdXQob25TY3JpcHRDb21wbGV0ZS5iaW5kKG51bGwsIHVuZGVmaW5lZCwgeyB0eXBlOiAndGltZW91dCcsIHRhcmdldDogc2NyaXB0IH0pLCAxMjAwMDApO1xuXHRzY3JpcHQub25lcnJvciA9IG9uU2NyaXB0Q29tcGxldGUuYmluZChudWxsLCBzY3JpcHQub25lcnJvcik7XG5cdHNjcmlwdC5vbmxvYWQgPSBvblNjcmlwdENvbXBsZXRlLmJpbmQobnVsbCwgc2NyaXB0Lm9ubG9hZCk7XG5cdG5lZWRBdHRhY2ggJiYgZG9jdW1lbnQuaGVhZC5hcHBlbmRDaGlsZChzY3JpcHQpO1xufTsiLCIvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSAoZXhwb3J0cykgPT4ge1xuXHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcblx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcblx0fVxuXHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xufTsiLCJfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9cIjsiLCJ2YXIgY3JlYXRlU3R5bGVzaGVldCA9IChjaHVua0lkLCBmdWxsaHJlZiwgcmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdHZhciBsaW5rVGFnID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cblx0bGlua1RhZy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblx0bGlua1RhZy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHR2YXIgb25MaW5rQ29tcGxldGUgPSAoZXZlbnQpID0+IHtcblx0XHQvLyBhdm9pZCBtZW0gbGVha3MuXG5cdFx0bGlua1RhZy5vbmVycm9yID0gbGlua1RhZy5vbmxvYWQgPSBudWxsO1xuXHRcdGlmIChldmVudC50eXBlID09PSAnbG9hZCcpIHtcblx0XHRcdHJlc29sdmUoKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIGVycm9yVHlwZSA9IGV2ZW50ICYmIChldmVudC50eXBlID09PSAnbG9hZCcgPyAnbWlzc2luZycgOiBldmVudC50eXBlKTtcblx0XHRcdHZhciByZWFsSHJlZiA9IGV2ZW50ICYmIGV2ZW50LnRhcmdldCAmJiBldmVudC50YXJnZXQuaHJlZiB8fCBmdWxsaHJlZjtcblx0XHRcdHZhciBlcnIgPSBuZXcgRXJyb3IoXCJMb2FkaW5nIENTUyBjaHVuayBcIiArIGNodW5rSWQgKyBcIiBmYWlsZWQuXFxuKFwiICsgcmVhbEhyZWYgKyBcIilcIik7XG5cdFx0XHRlcnIuY29kZSA9IFwiQ1NTX0NIVU5LX0xPQURfRkFJTEVEXCI7XG5cdFx0XHRlcnIudHlwZSA9IGVycm9yVHlwZTtcblx0XHRcdGVyci5yZXF1ZXN0ID0gcmVhbEhyZWY7XG5cdFx0XHRsaW5rVGFnLnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQobGlua1RhZylcblx0XHRcdHJlamVjdChlcnIpO1xuXHRcdH1cblx0fVxuXHRsaW5rVGFnLm9uZXJyb3IgPSBsaW5rVGFnLm9ubG9hZCA9IG9uTGlua0NvbXBsZXRlO1xuXHRsaW5rVGFnLmhyZWYgPSBmdWxsaHJlZjtcblxuXHRkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKGxpbmtUYWcpO1xuXHRyZXR1cm4gbGlua1RhZztcbn07XG52YXIgZmluZFN0eWxlc2hlZXQgPSAoaHJlZiwgZnVsbGhyZWYpID0+IHtcblx0dmFyIGV4aXN0aW5nTGlua1RhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcImxpbmtcIik7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBleGlzdGluZ0xpbmtUYWdzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIHRhZyA9IGV4aXN0aW5nTGlua1RhZ3NbaV07XG5cdFx0dmFyIGRhdGFIcmVmID0gdGFnLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKSB8fCB0YWcuZ2V0QXR0cmlidXRlKFwiaHJlZlwiKTtcblx0XHRpZih0YWcucmVsID09PSBcInN0eWxlc2hlZXRcIiAmJiAoZGF0YUhyZWYgPT09IGhyZWYgfHwgZGF0YUhyZWYgPT09IGZ1bGxocmVmKSkgcmV0dXJuIHRhZztcblx0fVxuXHR2YXIgZXhpc3RpbmdTdHlsZVRhZ3MgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZShcInN0eWxlXCIpO1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgZXhpc3RpbmdTdHlsZVRhZ3MubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgdGFnID0gZXhpc3RpbmdTdHlsZVRhZ3NbaV07XG5cdFx0dmFyIGRhdGFIcmVmID0gdGFnLmdldEF0dHJpYnV0ZShcImRhdGEtaHJlZlwiKTtcblx0XHRpZihkYXRhSHJlZiA9PT0gaHJlZiB8fCBkYXRhSHJlZiA9PT0gZnVsbGhyZWYpIHJldHVybiB0YWc7XG5cdH1cbn07XG52YXIgbG9hZFN0eWxlc2hlZXQgPSAoY2h1bmtJZCkgPT4ge1xuXHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdHZhciBocmVmID0gX193ZWJwYWNrX3JlcXVpcmVfXy5taW5pQ3NzRihjaHVua0lkKTtcblx0XHR2YXIgZnVsbGhyZWYgPSBfX3dlYnBhY2tfcmVxdWlyZV9fLnAgKyBocmVmO1xuXHRcdGlmKGZpbmRTdHlsZXNoZWV0KGhyZWYsIGZ1bGxocmVmKSkgcmV0dXJuIHJlc29sdmUoKTtcblx0XHRjcmVhdGVTdHlsZXNoZWV0KGNodW5rSWQsIGZ1bGxocmVmLCByZXNvbHZlLCByZWplY3QpO1xuXHR9KTtcbn1cbi8vIG9iamVjdCB0byBzdG9yZSBsb2FkZWQgQ1NTIGNodW5rc1xudmFyIGluc3RhbGxlZENzc0NodW5rcyA9IHtcblx0XCIvanMvYXBwXCI6IDBcbn07XG5cbl9fd2VicGFja19yZXF1aXJlX18uZi5taW5pQ3NzID0gKGNodW5rSWQsIHByb21pc2VzKSA9PiB7XG5cdHZhciBjc3NDaHVua3MgPSB7XCJkb2NzZWFyY2hcIjoxfTtcblx0aWYoaW5zdGFsbGVkQ3NzQ2h1bmtzW2NodW5rSWRdKSBwcm9taXNlcy5wdXNoKGluc3RhbGxlZENzc0NodW5rc1tjaHVua0lkXSk7XG5cdGVsc2UgaWYoaW5zdGFsbGVkQ3NzQ2h1bmtzW2NodW5rSWRdICE9PSAwICYmIGNzc0NodW5rc1tjaHVua0lkXSkge1xuXHRcdHByb21pc2VzLnB1c2goaW5zdGFsbGVkQ3NzQ2h1bmtzW2NodW5rSWRdID0gbG9hZFN0eWxlc2hlZXQoY2h1bmtJZCkudGhlbigoKSA9PiB7XG5cdFx0XHRpbnN0YWxsZWRDc3NDaHVua3NbY2h1bmtJZF0gPSAwO1xuXHRcdH0sIChlKSA9PiB7XG5cdFx0XHRkZWxldGUgaW5zdGFsbGVkQ3NzQ2h1bmtzW2NodW5rSWRdO1xuXHRcdFx0dGhyb3cgZTtcblx0XHR9KSk7XG5cdH1cbn07XG5cbi8vIG5vIGhtciIsIi8vIG5vIGJhc2VVUklcblxuLy8gb2JqZWN0IHRvIHN0b3JlIGxvYWRlZCBhbmQgbG9hZGluZyBjaHVua3Ncbi8vIHVuZGVmaW5lZCA9IGNodW5rIG5vdCBsb2FkZWQsIG51bGwgPSBjaHVuayBwcmVsb2FkZWQvcHJlZmV0Y2hlZFxuLy8gUHJvbWlzZSA9IGNodW5rIGxvYWRpbmcsIDAgPSBjaHVuayBsb2FkZWRcbnZhciBpbnN0YWxsZWRDaHVua3MgPSB7XG5cdFwiL2pzL2FwcFwiOiAwXG59O1xuXG52YXIgZGVmZXJyZWRNb2R1bGVzID0gW1xuXHRbXCIuL3Jlc291cmNlcy9hc3NldHMvanMvYXBwLmpzXCJdLFxuXHRbXCIuL3Jlc291cmNlcy9hc3NldHMvY3NzL2FwcC5jc3NcIl1cbl07XG5fX3dlYnBhY2tfcmVxdWlyZV9fLmYuaiA9IChjaHVua0lkLCBwcm9taXNlcykgPT4ge1xuXHRcdC8vIEpTT05QIGNodW5rIGxvYWRpbmcgZm9yIGphdmFzY3JpcHRcblx0XHR2YXIgaW5zdGFsbGVkQ2h1bmtEYXRhID0gX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgPyBpbnN0YWxsZWRDaHVua3NbY2h1bmtJZF0gOiB1bmRlZmluZWQ7XG5cdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhICE9PSAwKSB7IC8vIDAgbWVhbnMgXCJhbHJlYWR5IGluc3RhbGxlZFwiLlxuXG5cdFx0XHQvLyBhIFByb21pc2UgbWVhbnMgXCJjdXJyZW50bHkgbG9hZGluZ1wiLlxuXHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhKSB7XG5cdFx0XHRcdHByb21pc2VzLnB1c2goaW5zdGFsbGVkQ2h1bmtEYXRhWzJdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGlmKFwiZG9jc2VhcmNoXCIgPT0gY2h1bmtJZCkge1xuXHRcdFx0XHRcdC8vIHNldHVwIFByb21pc2UgaW4gY2h1bmsgY2FjaGVcblx0XHRcdFx0XHR2YXIgcHJvbWlzZSA9IG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdFx0XHRcdGluc3RhbGxlZENodW5rRGF0YSA9IGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IFtyZXNvbHZlLCByZWplY3RdO1xuXHRcdFx0XHRcdH0pO1xuXHRcdFx0XHRcdHByb21pc2VzLnB1c2goaW5zdGFsbGVkQ2h1bmtEYXRhWzJdID0gcHJvbWlzZSk7XG5cblx0XHRcdFx0XHQvLyBzdGFydCBjaHVuayBsb2FkaW5nXG5cdFx0XHRcdFx0dmFyIHVybCA9IF9fd2VicGFja19yZXF1aXJlX18ucCArIF9fd2VicGFja19yZXF1aXJlX18udShjaHVua0lkKTtcblx0XHRcdFx0XHQvLyBjcmVhdGUgZXJyb3IgYmVmb3JlIHN0YWNrIHVud291bmQgdG8gZ2V0IHVzZWZ1bCBzdGFja3RyYWNlIGxhdGVyXG5cdFx0XHRcdFx0dmFyIGVycm9yID0gbmV3IEVycm9yKCk7XG5cdFx0XHRcdFx0dmFyIGxvYWRpbmdFbmRlZCA9IChldmVudCkgPT4ge1xuXHRcdFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkpIHtcblx0XHRcdFx0XHRcdFx0aW5zdGFsbGVkQ2h1bmtEYXRhID0gaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdO1xuXHRcdFx0XHRcdFx0XHRpZihpbnN0YWxsZWRDaHVua0RhdGEgIT09IDApIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IHVuZGVmaW5lZDtcblx0XHRcdFx0XHRcdFx0aWYoaW5zdGFsbGVkQ2h1bmtEYXRhKSB7XG5cdFx0XHRcdFx0XHRcdFx0dmFyIGVycm9yVHlwZSA9IGV2ZW50ICYmIChldmVudC50eXBlID09PSAnbG9hZCcgPyAnbWlzc2luZycgOiBldmVudC50eXBlKTtcblx0XHRcdFx0XHRcdFx0XHR2YXIgcmVhbFNyYyA9IGV2ZW50ICYmIGV2ZW50LnRhcmdldCAmJiBldmVudC50YXJnZXQuc3JjO1xuXHRcdFx0XHRcdFx0XHRcdGVycm9yLm1lc3NhZ2UgPSAnTG9hZGluZyBjaHVuayAnICsgY2h1bmtJZCArICcgZmFpbGVkLlxcbignICsgZXJyb3JUeXBlICsgJzogJyArIHJlYWxTcmMgKyAnKSc7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IubmFtZSA9ICdDaHVua0xvYWRFcnJvcic7XG5cdFx0XHRcdFx0XHRcdFx0ZXJyb3IudHlwZSA9IGVycm9yVHlwZTtcblx0XHRcdFx0XHRcdFx0XHRlcnJvci5yZXF1ZXN0ID0gcmVhbFNyYztcblx0XHRcdFx0XHRcdFx0XHRpbnN0YWxsZWRDaHVua0RhdGFbMV0oZXJyb3IpO1xuXHRcdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0fTtcblx0XHRcdFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmwodXJsLCBsb2FkaW5nRW5kZWQsIFwiY2h1bmstXCIgKyBjaHVua0lkKTtcblx0XHRcdFx0fSBlbHNlIGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdFx0XHR9XG5cdFx0fVxufTtcblxuLy8gbm8gcHJlZmV0Y2hpbmdcblxuLy8gbm8gcHJlbG9hZGVkXG5cbi8vIG5vIEhNUlxuXG4vLyBubyBITVIgbWFuaWZlc3RcblxudmFyIGNoZWNrRGVmZXJyZWRNb2R1bGVzID0gKCkgPT4ge1xuXG59O1xuZnVuY3Rpb24gY2hlY2tEZWZlcnJlZE1vZHVsZXNJbXBsKCkge1xuXHR2YXIgcmVzdWx0O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgZGVmZXJyZWRNb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGRlZmVycmVkTW9kdWxlID0gZGVmZXJyZWRNb2R1bGVzW2ldO1xuXHRcdHZhciBmdWxmaWxsZWQgPSB0cnVlO1xuXHRcdGZvcih2YXIgaiA9IDE7IGogPCBkZWZlcnJlZE1vZHVsZS5sZW5ndGg7IGorKykge1xuXHRcdFx0dmFyIGRlcElkID0gZGVmZXJyZWRNb2R1bGVbal07XG5cdFx0XHRpZihpbnN0YWxsZWRDaHVua3NbZGVwSWRdICE9PSAwKSBmdWxmaWxsZWQgPSBmYWxzZTtcblx0XHR9XG5cdFx0aWYoZnVsZmlsbGVkKSB7XG5cdFx0XHRkZWZlcnJlZE1vZHVsZXMuc3BsaWNlKGktLSwgMSk7XG5cdFx0XHRyZXN1bHQgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IGRlZmVycmVkTW9kdWxlWzBdKTtcblx0XHR9XG5cdH1cblx0aWYoZGVmZXJyZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18ueCgpO1xuXHRcdF9fd2VicGFja19yZXF1aXJlX18ueCA9ICgpID0+IHtcblxuXHRcdH1cblx0fVxuXHRyZXR1cm4gcmVzdWx0O1xufVxuX193ZWJwYWNrX3JlcXVpcmVfXy54ID0gKCkgPT4ge1xuXHQvLyByZXNldCBzdGFydHVwIGZ1bmN0aW9uIHNvIGl0IGNhbiBiZSBjYWxsZWQgYWdhaW4gd2hlbiBtb3JlIHN0YXJ0dXAgY29kZSBpcyBhZGRlZFxuXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnggPSAoKSA9PiB7XG5cblx0fVxuXHRjaHVua0xvYWRpbmdHbG9iYWwgPSBjaHVua0xvYWRpbmdHbG9iYWwuc2xpY2UoKTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGNodW5rTG9hZGluZ0dsb2JhbC5sZW5ndGg7IGkrKykgd2VicGFja0pzb25wQ2FsbGJhY2soY2h1bmtMb2FkaW5nR2xvYmFsW2ldKTtcblx0cmV0dXJuIChjaGVja0RlZmVycmVkTW9kdWxlcyA9IGNoZWNrRGVmZXJyZWRNb2R1bGVzSW1wbCkoKTtcbn07XG5cbi8vIGluc3RhbGwgYSBKU09OUCBjYWxsYmFjayBmb3IgY2h1bmsgbG9hZGluZ1xudmFyIHdlYnBhY2tKc29ucENhbGxiYWNrID0gKGRhdGEpID0+IHtcblx0dmFyIFtjaHVua0lkcywgbW9yZU1vZHVsZXMsIHJ1bnRpbWUsIGV4ZWN1dGVNb2R1bGVzXSA9IGRhdGE7XG5cdC8vIGFkZCBcIm1vcmVNb2R1bGVzXCIgdG8gdGhlIG1vZHVsZXMgb2JqZWN0LFxuXHQvLyB0aGVuIGZsYWcgYWxsIFwiY2h1bmtJZHNcIiBhcyBsb2FkZWQgYW5kIGZpcmUgY2FsbGJhY2tcblx0dmFyIG1vZHVsZUlkLCBjaHVua0lkLCBpID0gMCwgcmVzb2x2ZXMgPSBbXTtcblx0Zm9yKDtpIDwgY2h1bmtJZHMubGVuZ3RoOyBpKyspIHtcblx0XHRjaHVua0lkID0gY2h1bmtJZHNbaV07XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGluc3RhbGxlZENodW5rcywgY2h1bmtJZCkgJiYgaW5zdGFsbGVkQ2h1bmtzW2NodW5rSWRdKSB7XG5cdFx0XHRyZXNvbHZlcy5wdXNoKGluc3RhbGxlZENodW5rc1tjaHVua0lkXVswXSk7XG5cdFx0fVxuXHRcdGluc3RhbGxlZENodW5rc1tjaHVua0lkXSA9IDA7XG5cdH1cblx0Zm9yKG1vZHVsZUlkIGluIG1vcmVNb2R1bGVzKSB7XG5cdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1vcmVNb2R1bGVzLCBtb2R1bGVJZCkpIHtcblx0XHRcdF9fd2VicGFja19yZXF1aXJlX18ubVttb2R1bGVJZF0gPSBtb3JlTW9kdWxlc1ttb2R1bGVJZF07XG5cdFx0fVxuXHR9XG5cdGlmKHJ1bnRpbWUpIHJ1bnRpbWUoX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cdHBhcmVudENodW5rTG9hZGluZ0Z1bmN0aW9uKGRhdGEpO1xuXHR3aGlsZShyZXNvbHZlcy5sZW5ndGgpIHtcblx0XHRyZXNvbHZlcy5zaGlmdCgpKCk7XG5cdH1cblxuXHQvLyBhZGQgZW50cnkgbW9kdWxlcyBmcm9tIGxvYWRlZCBjaHVuayB0byBkZWZlcnJlZCBsaXN0XG5cdGlmKGV4ZWN1dGVNb2R1bGVzKSBkZWZlcnJlZE1vZHVsZXMucHVzaC5hcHBseShkZWZlcnJlZE1vZHVsZXMsIGV4ZWN1dGVNb2R1bGVzKTtcblxuXHQvLyBydW4gZGVmZXJyZWQgbW9kdWxlcyB3aGVuIGFsbCBjaHVua3MgcmVhZHlcblx0cmV0dXJuIGNoZWNrRGVmZXJyZWRNb2R1bGVzKCk7XG59XG5cbnZhciBjaHVua0xvYWRpbmdHbG9iYWwgPSBzZWxmW1wid2VicGFja0NodW5rYXBwXCJdID0gc2VsZltcIndlYnBhY2tDaHVua2FwcFwiXSB8fCBbXTtcbnZhciBwYXJlbnRDaHVua0xvYWRpbmdGdW5jdGlvbiA9IGNodW5rTG9hZGluZ0dsb2JhbC5wdXNoLmJpbmQoY2h1bmtMb2FkaW5nR2xvYmFsKTtcbmNodW5rTG9hZGluZ0dsb2JhbC5wdXNoID0gd2VicGFja0pzb25wQ2FsbGJhY2s7IiwiLy8gcnVuIHN0YXJ0dXBcbnJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fLngoKTtcbiJdLCJzb3VyY2VSb290IjoiIn0=