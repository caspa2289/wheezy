(self["webpackChunkWheezy"] = self["webpackChunkWheezy"] || []).push([["index"],{

/***/ "./node_modules/ansi-html-community/index.js":
/*!***************************************************!*\
  !*** ./node_modules/ansi-html-community/index.js ***!
  \***************************************************/
/***/ ((module) => {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),

/***/ "./node_modules/events/events.js":
/*!***************************************!*\
  !*** ./node_modules/events/events.js ***!
  \***************************************/
/***/ ((module) => {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var R = typeof Reflect === 'object' ? Reflect : null
var ReflectApply = R && typeof R.apply === 'function'
  ? R.apply
  : function ReflectApply(target, receiver, args) {
    return Function.prototype.apply.call(target, receiver, args);
  }

var ReflectOwnKeys
if (R && typeof R.ownKeys === 'function') {
  ReflectOwnKeys = R.ownKeys
} else if (Object.getOwnPropertySymbols) {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target)
      .concat(Object.getOwnPropertySymbols(target));
  };
} else {
  ReflectOwnKeys = function ReflectOwnKeys(target) {
    return Object.getOwnPropertyNames(target);
  };
}

function ProcessEmitWarning(warning) {
  if (console && console.warn) console.warn(warning);
}

var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
  return value !== value;
}

function EventEmitter() {
  EventEmitter.init.call(this);
}
module.exports = EventEmitter;
module.exports.once = once;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._eventsCount = 0;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
var defaultMaxListeners = 10;

function checkListener(listener) {
  if (typeof listener !== 'function') {
    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
  }
}

Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
  enumerable: true,
  get: function() {
    return defaultMaxListeners;
  },
  set: function(arg) {
    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    }
    defaultMaxListeners = arg;
  }
});

EventEmitter.init = function() {

  if (this._events === undefined ||
      this._events === Object.getPrototypeOf(this)._events) {
    this._events = Object.create(null);
    this._eventsCount = 0;
  }

  this._maxListeners = this._maxListeners || undefined;
};

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
  }
  this._maxListeners = n;
  return this;
};

function _getMaxListeners(that) {
  if (that._maxListeners === undefined)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}

EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
  return _getMaxListeners(this);
};

EventEmitter.prototype.emit = function emit(type) {
  var args = [];
  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
  var doError = (type === 'error');

  var events = this._events;
  if (events !== undefined)
    doError = (doError && events.error === undefined);
  else if (!doError)
    return false;

  // If there is no 'error' event listener then throw.
  if (doError) {
    var er;
    if (args.length > 0)
      er = args[0];
    if (er instanceof Error) {
      // Note: The comments on the `throw` lines are intentional, they show
      // up in Node's output if this results in an unhandled exception.
      throw er; // Unhandled 'error' event
    }
    // At least give some kind of context to the user
    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    err.context = er;
    throw err; // Unhandled 'error' event
  }

  var handler = events[type];

  if (handler === undefined)
    return false;

  if (typeof handler === 'function') {
    ReflectApply(handler, this, args);
  } else {
    var len = handler.length;
    var listeners = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      ReflectApply(listeners[i], this, args);
  }

  return true;
};

function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;

  checkListener(listener);

  events = target._events;
  if (events === undefined) {
    events = target._events = Object.create(null);
    target._eventsCount = 0;
  } else {
    // To avoid recursion in the case that type === "newListener"! Before
    // adding it to the listeners, first emit "newListener".
    if (events.newListener !== undefined) {
      target.emit('newListener', type,
                  listener.listener ? listener.listener : listener);

      // Re-assign `events` because a newListener handler could have caused the
      // this._events to be assigned to a new object
      events = target._events;
    }
    existing = events[type];
  }

  if (existing === undefined) {
    // Optimize the case of one listener. Don't need the extra array object.
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === 'function') {
      // Adding the second element, need to change to array.
      existing = events[type] =
        prepend ? [listener, existing] : [existing, listener];
      // If we've already got an array, just append.
    } else if (prepend) {
      existing.unshift(listener);
    } else {
      existing.push(listener);
    }

    // Check for listener leak
    m = _getMaxListeners(target);
    if (m > 0 && existing.length > m && !existing.warned) {
      existing.warned = true;
      // No error code for this since it is a Warning
      // eslint-disable-next-line no-restricted-syntax
      var w = new Error('Possible EventEmitter memory leak detected. ' +
                          existing.length + ' ' + String(type) + ' listeners ' +
                          'added. Use emitter.setMaxListeners() to ' +
                          'increase limit');
      w.name = 'MaxListenersExceededWarning';
      w.emitter = target;
      w.type = type;
      w.count = existing.length;
      ProcessEmitWarning(w);
    }
  }

  return target;
}

EventEmitter.prototype.addListener = function addListener(type, listener) {
  return _addListener(this, type, listener, false);
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.prependListener =
    function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };

function onceWrapper() {
  if (!this.fired) {
    this.target.removeListener(this.type, this.wrapFn);
    this.fired = true;
    if (arguments.length === 0)
      return this.listener.call(this.target);
    return this.listener.apply(this.target, arguments);
  }
}

function _onceWrap(target, type, listener) {
  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
  var wrapped = onceWrapper.bind(state);
  wrapped.listener = listener;
  state.wrapFn = wrapped;
  return wrapped;
}

EventEmitter.prototype.once = function once(type, listener) {
  checkListener(listener);
  this.on(type, _onceWrap(this, type, listener));
  return this;
};

EventEmitter.prototype.prependOnceListener =
    function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };

// Emits a 'removeListener' event if and only if the listener was removed.
EventEmitter.prototype.removeListener =
    function removeListener(type, listener) {
      var list, events, position, i, originalListener;

      checkListener(listener);

      events = this._events;
      if (events === undefined)
        return this;

      list = events[type];
      if (list === undefined)
        return this;

      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit('removeListener', type, list.listener || listener);
        }
      } else if (typeof list !== 'function') {
        position = -1;

        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }

        if (position < 0)
          return this;

        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }

        if (list.length === 1)
          events[type] = list[0];

        if (events.removeListener !== undefined)
          this.emit('removeListener', type, originalListener || listener);
      }

      return this;
    };

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

EventEmitter.prototype.removeAllListeners =
    function removeAllListeners(type) {
      var listeners, events, i;

      events = this._events;
      if (events === undefined)
        return this;

      // not listening for removeListener, no need to emit
      if (events.removeListener === undefined) {
        if (arguments.length === 0) {
          this._events = Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== undefined) {
          if (--this._eventsCount === 0)
            this._events = Object.create(null);
          else
            delete events[type];
        }
        return this;
      }

      // emit removeListener for all listeners on all events
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === 'removeListener') continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners('removeListener');
        this._events = Object.create(null);
        this._eventsCount = 0;
        return this;
      }

      listeners = events[type];

      if (typeof listeners === 'function') {
        this.removeListener(type, listeners);
      } else if (listeners !== undefined) {
        // LIFO order
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }

      return this;
    };

function _listeners(target, type, unwrap) {
  var events = target._events;

  if (events === undefined)
    return [];

  var evlistener = events[type];
  if (evlistener === undefined)
    return [];

  if (typeof evlistener === 'function')
    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

  return unwrap ?
    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
}

EventEmitter.prototype.listeners = function listeners(type) {
  return _listeners(this, type, true);
};

EventEmitter.prototype.rawListeners = function rawListeners(type) {
  return _listeners(this, type, false);
};

EventEmitter.listenerCount = function(emitter, type) {
  if (typeof emitter.listenerCount === 'function') {
    return emitter.listenerCount(type);
  } else {
    return listenerCount.call(emitter, type);
  }
};

EventEmitter.prototype.listenerCount = listenerCount;
function listenerCount(type) {
  var events = this._events;

  if (events !== undefined) {
    var evlistener = events[type];

    if (typeof evlistener === 'function') {
      return 1;
    } else if (evlistener !== undefined) {
      return evlistener.length;
    }
  }

  return 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
};

function arrayClone(arr, n) {
  var copy = new Array(n);
  for (var i = 0; i < n; ++i)
    copy[i] = arr[i];
  return copy;
}

function spliceOne(list, index) {
  for (; index + 1 < list.length; index++)
    list[index] = list[index + 1];
  list.pop();
}

function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}

function once(emitter, name) {
  return new Promise(function (resolve, reject) {
    function errorListener(err) {
      emitter.removeListener(name, resolver);
      reject(err);
    }

    function resolver() {
      if (typeof emitter.removeListener === 'function') {
        emitter.removeListener('error', errorListener);
      }
      resolve([].slice.call(arguments));
    };

    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    if (name !== 'error') {
      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    }
  });
}

function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
  if (typeof emitter.on === 'function') {
    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
  }
}

function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
  if (typeof emitter.on === 'function') {
    if (flags.once) {
      emitter.once(name, listener);
    } else {
      emitter.on(name, listener);
    }
  } else if (typeof emitter.addEventListener === 'function') {
    // EventTarget does not have `error` event semantics like Node
    // EventEmitters, we do not listen for `error` events here.
    emitter.addEventListener(name, function wrapListener(arg) {
      // IE does not have builtin `{ once: true }` support so we
      // have to do it manually.
      if (flags.once) {
        emitter.removeEventListener(name, wrapListener);
      }
      listener(arg);
    });
  } else {
    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
  }
}


/***/ }),

/***/ "./node_modules/html-entities/lib/index.js":
/*!*************************************************!*\
  !*** ./node_modules/html-entities/lib/index.js ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";
var __assign=this&&this.__assign||function(){__assign=Object.assign||function(t){for(var s,i=1,n=arguments.length;i<n;i++){s=arguments[i];for(var p in s)if(Object.prototype.hasOwnProperty.call(s,p))t[p]=s[p]}return t};return __assign.apply(this,arguments)};Object.defineProperty(exports, "__esModule", ({value:true}));var named_references_1=__webpack_require__(/*! ./named-references */ "./node_modules/html-entities/lib/named-references.js");var numeric_unicode_map_1=__webpack_require__(/*! ./numeric-unicode-map */ "./node_modules/html-entities/lib/numeric-unicode-map.js");var surrogate_pairs_1=__webpack_require__(/*! ./surrogate-pairs */ "./node_modules/html-entities/lib/surrogate-pairs.js");var allNamedReferences=__assign(__assign({},named_references_1.namedReferences),{all:named_references_1.namedReferences.html5});function replaceUsingRegExp(macroText,macroRegExp,macroReplacer){macroRegExp.lastIndex=0;var replaceMatch=macroRegExp.exec(macroText);var replaceResult;if(replaceMatch){replaceResult="";var replaceLastIndex=0;do{if(replaceLastIndex!==replaceMatch.index){replaceResult+=macroText.substring(replaceLastIndex,replaceMatch.index)}var replaceInput=replaceMatch[0];replaceResult+=macroReplacer(replaceInput);replaceLastIndex=replaceMatch.index+replaceInput.length}while(replaceMatch=macroRegExp.exec(macroText));if(replaceLastIndex!==macroText.length){replaceResult+=macroText.substring(replaceLastIndex)}}else{replaceResult=macroText}return replaceResult}var encodeRegExps={specialChars:/[<>'"&]/g,nonAscii:/[<>'"&\u0080-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,nonAsciiPrintable:/[<>'"&\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,nonAsciiPrintableOnly:/[\x01-\x08\x11-\x15\x17-\x1F\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g,extensive:/[\x01-\x0c\x0e-\x1f\x21-\x2c\x2e-\x2f\x3a-\x40\x5b-\x60\x7b-\x7d\x7f-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/g};var defaultEncodeOptions={mode:"specialChars",level:"all",numeric:"decimal"};function encode(text,_a){var _b=_a===void 0?defaultEncodeOptions:_a,_c=_b.mode,mode=_c===void 0?"specialChars":_c,_d=_b.numeric,numeric=_d===void 0?"decimal":_d,_e=_b.level,level=_e===void 0?"all":_e;if(!text){return""}var encodeRegExp=encodeRegExps[mode];var references=allNamedReferences[level].characters;var isHex=numeric==="hexadecimal";return replaceUsingRegExp(text,encodeRegExp,(function(input){var result=references[input];if(!result){var code=input.length>1?surrogate_pairs_1.getCodePoint(input,0):input.charCodeAt(0);result=(isHex?"&#x"+code.toString(16):"&#"+code)+";"}return result}))}exports.encode=encode;var defaultDecodeOptions={scope:"body",level:"all"};var strict=/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);/g;var attribute=/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+)[;=]?/g;var baseDecodeRegExps={xml:{strict:strict,attribute:attribute,body:named_references_1.bodyRegExps.xml},html4:{strict:strict,attribute:attribute,body:named_references_1.bodyRegExps.html4},html5:{strict:strict,attribute:attribute,body:named_references_1.bodyRegExps.html5}};var decodeRegExps=__assign(__assign({},baseDecodeRegExps),{all:baseDecodeRegExps.html5});var fromCharCode=String.fromCharCode;var outOfBoundsChar=fromCharCode(65533);var defaultDecodeEntityOptions={level:"all"};function getDecodedEntity(entity,references,isAttribute,isStrict){var decodeResult=entity;var decodeEntityLastChar=entity[entity.length-1];if(isAttribute&&decodeEntityLastChar==="="){decodeResult=entity}else if(isStrict&&decodeEntityLastChar!==";"){decodeResult=entity}else{var decodeResultByReference=references[entity];if(decodeResultByReference){decodeResult=decodeResultByReference}else if(entity[0]==="&"&&entity[1]==="#"){var decodeSecondChar=entity[2];var decodeCode=decodeSecondChar=="x"||decodeSecondChar=="X"?parseInt(entity.substr(3),16):parseInt(entity.substr(2));decodeResult=decodeCode>=1114111?outOfBoundsChar:decodeCode>65535?surrogate_pairs_1.fromCodePoint(decodeCode):fromCharCode(numeric_unicode_map_1.numericUnicodeMap[decodeCode]||decodeCode)}}return decodeResult}function decodeEntity(entity,_a){var _b=(_a===void 0?defaultDecodeEntityOptions:_a).level,level=_b===void 0?"all":_b;if(!entity){return""}return getDecodedEntity(entity,allNamedReferences[level].entities,false,false)}exports.decodeEntity=decodeEntity;function decode(text,_a){var _b=_a===void 0?defaultDecodeOptions:_a,_c=_b.level,level=_c===void 0?"all":_c,_d=_b.scope,scope=_d===void 0?level==="xml"?"strict":"body":_d;if(!text){return""}var decodeRegExp=decodeRegExps[level][scope];var references=allNamedReferences[level].entities;var isAttribute=scope==="attribute";var isStrict=scope==="strict";return replaceUsingRegExp(text,decodeRegExp,(function(entity){return getDecodedEntity(entity,references,isAttribute,isStrict)}))}exports.decode=decode;
//# sourceMappingURL=./index.js.map

/***/ }),

/***/ "./node_modules/html-entities/lib/named-references.js":
/*!************************************************************!*\
  !*** ./node_modules/html-entities/lib/named-references.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.bodyRegExps={xml:/&(?:#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html4:/&notin;|&(?:nbsp|iexcl|cent|pound|curren|yen|brvbar|sect|uml|copy|ordf|laquo|not|shy|reg|macr|deg|plusmn|sup2|sup3|acute|micro|para|middot|cedil|sup1|ordm|raquo|frac14|frac12|frac34|iquest|Agrave|Aacute|Acirc|Atilde|Auml|Aring|AElig|Ccedil|Egrave|Eacute|Ecirc|Euml|Igrave|Iacute|Icirc|Iuml|ETH|Ntilde|Ograve|Oacute|Ocirc|Otilde|Ouml|times|Oslash|Ugrave|Uacute|Ucirc|Uuml|Yacute|THORN|szlig|agrave|aacute|acirc|atilde|auml|aring|aelig|ccedil|egrave|eacute|ecirc|euml|igrave|iacute|icirc|iuml|eth|ntilde|ograve|oacute|ocirc|otilde|ouml|divide|oslash|ugrave|uacute|ucirc|uuml|yacute|thorn|yuml|quot|amp|lt|gt|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g,html5:/&centerdot;|&copysr;|&divideontimes;|&gtcc;|&gtcir;|&gtdot;|&gtlPar;|&gtquest;|&gtrapprox;|&gtrarr;|&gtrdot;|&gtreqless;|&gtreqqless;|&gtrless;|&gtrsim;|&ltcc;|&ltcir;|&ltdot;|&lthree;|&ltimes;|&ltlarr;|&ltquest;|&ltrPar;|&ltri;|&ltrie;|&ltrif;|&notin;|&notinE;|&notindot;|&notinva;|&notinvb;|&notinvc;|&notni;|&notniva;|&notnivb;|&notnivc;|&parallel;|&timesb;|&timesbar;|&timesd;|&(?:AElig|AMP|Aacute|Acirc|Agrave|Aring|Atilde|Auml|COPY|Ccedil|ETH|Eacute|Ecirc|Egrave|Euml|GT|Iacute|Icirc|Igrave|Iuml|LT|Ntilde|Oacute|Ocirc|Ograve|Oslash|Otilde|Ouml|QUOT|REG|THORN|Uacute|Ucirc|Ugrave|Uuml|Yacute|aacute|acirc|acute|aelig|agrave|amp|aring|atilde|auml|brvbar|ccedil|cedil|cent|copy|curren|deg|divide|eacute|ecirc|egrave|eth|euml|frac12|frac14|frac34|gt|iacute|icirc|iexcl|igrave|iquest|iuml|laquo|lt|macr|micro|middot|nbsp|not|ntilde|oacute|ocirc|ograve|ordf|ordm|oslash|otilde|ouml|para|plusmn|pound|quot|raquo|reg|sect|shy|sup1|sup2|sup3|szlig|thorn|times|uacute|ucirc|ugrave|uml|uuml|yacute|yen|yuml|#\d+|#[xX][\da-fA-F]+|[0-9a-zA-Z]+);?/g};exports.namedReferences={xml:{entities:{"&lt;":"<","&gt;":">","&quot;":'"',"&apos;":"'","&amp;":"&"},characters:{"<":"&lt;",">":"&gt;",'"':"&quot;","'":"&apos;","&":"&amp;"}},html4:{entities:{"&apos;":"'","&nbsp":" ","&nbsp;":" ","&iexcl":"¡","&iexcl;":"¡","&cent":"¢","&cent;":"¢","&pound":"£","&pound;":"£","&curren":"¤","&curren;":"¤","&yen":"¥","&yen;":"¥","&brvbar":"¦","&brvbar;":"¦","&sect":"§","&sect;":"§","&uml":"¨","&uml;":"¨","&copy":"©","&copy;":"©","&ordf":"ª","&ordf;":"ª","&laquo":"«","&laquo;":"«","&not":"¬","&not;":"¬","&shy":"­","&shy;":"­","&reg":"®","&reg;":"®","&macr":"¯","&macr;":"¯","&deg":"°","&deg;":"°","&plusmn":"±","&plusmn;":"±","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&acute":"´","&acute;":"´","&micro":"µ","&micro;":"µ","&para":"¶","&para;":"¶","&middot":"·","&middot;":"·","&cedil":"¸","&cedil;":"¸","&sup1":"¹","&sup1;":"¹","&ordm":"º","&ordm;":"º","&raquo":"»","&raquo;":"»","&frac14":"¼","&frac14;":"¼","&frac12":"½","&frac12;":"½","&frac34":"¾","&frac34;":"¾","&iquest":"¿","&iquest;":"¿","&Agrave":"À","&Agrave;":"À","&Aacute":"Á","&Aacute;":"Á","&Acirc":"Â","&Acirc;":"Â","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Aring":"Å","&Aring;":"Å","&AElig":"Æ","&AElig;":"Æ","&Ccedil":"Ç","&Ccedil;":"Ç","&Egrave":"È","&Egrave;":"È","&Eacute":"É","&Eacute;":"É","&Ecirc":"Ê","&Ecirc;":"Ê","&Euml":"Ë","&Euml;":"Ë","&Igrave":"Ì","&Igrave;":"Ì","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Iuml":"Ï","&Iuml;":"Ï","&ETH":"Ð","&ETH;":"Ð","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Ograve":"Ò","&Ograve;":"Ò","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Otilde":"Õ","&Otilde;":"Õ","&Ouml":"Ö","&Ouml;":"Ö","&times":"×","&times;":"×","&Oslash":"Ø","&Oslash;":"Ø","&Ugrave":"Ù","&Ugrave;":"Ù","&Uacute":"Ú","&Uacute;":"Ú","&Ucirc":"Û","&Ucirc;":"Û","&Uuml":"Ü","&Uuml;":"Ü","&Yacute":"Ý","&Yacute;":"Ý","&THORN":"Þ","&THORN;":"Þ","&szlig":"ß","&szlig;":"ß","&agrave":"à","&agrave;":"à","&aacute":"á","&aacute;":"á","&acirc":"â","&acirc;":"â","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&aring":"å","&aring;":"å","&aelig":"æ","&aelig;":"æ","&ccedil":"ç","&ccedil;":"ç","&egrave":"è","&egrave;":"è","&eacute":"é","&eacute;":"é","&ecirc":"ê","&ecirc;":"ê","&euml":"ë","&euml;":"ë","&igrave":"ì","&igrave;":"ì","&iacute":"í","&iacute;":"í","&icirc":"î","&icirc;":"î","&iuml":"ï","&iuml;":"ï","&eth":"ð","&eth;":"ð","&ntilde":"ñ","&ntilde;":"ñ","&ograve":"ò","&ograve;":"ò","&oacute":"ó","&oacute;":"ó","&ocirc":"ô","&ocirc;":"ô","&otilde":"õ","&otilde;":"õ","&ouml":"ö","&ouml;":"ö","&divide":"÷","&divide;":"÷","&oslash":"ø","&oslash;":"ø","&ugrave":"ù","&ugrave;":"ù","&uacute":"ú","&uacute;":"ú","&ucirc":"û","&ucirc;":"û","&uuml":"ü","&uuml;":"ü","&yacute":"ý","&yacute;":"ý","&thorn":"þ","&thorn;":"þ","&yuml":"ÿ","&yuml;":"ÿ","&quot":'"',"&quot;":'"',"&amp":"&","&amp;":"&","&lt":"<","&lt;":"<","&gt":">","&gt;":">","&OElig;":"Œ","&oelig;":"œ","&Scaron;":"Š","&scaron;":"š","&Yuml;":"Ÿ","&circ;":"ˆ","&tilde;":"˜","&ensp;":" ","&emsp;":" ","&thinsp;":" ","&zwnj;":"‌","&zwj;":"‍","&lrm;":"‎","&rlm;":"‏","&ndash;":"–","&mdash;":"—","&lsquo;":"‘","&rsquo;":"’","&sbquo;":"‚","&ldquo;":"“","&rdquo;":"”","&bdquo;":"„","&dagger;":"†","&Dagger;":"‡","&permil;":"‰","&lsaquo;":"‹","&rsaquo;":"›","&euro;":"€","&fnof;":"ƒ","&Alpha;":"Α","&Beta;":"Β","&Gamma;":"Γ","&Delta;":"Δ","&Epsilon;":"Ε","&Zeta;":"Ζ","&Eta;":"Η","&Theta;":"Θ","&Iota;":"Ι","&Kappa;":"Κ","&Lambda;":"Λ","&Mu;":"Μ","&Nu;":"Ν","&Xi;":"Ξ","&Omicron;":"Ο","&Pi;":"Π","&Rho;":"Ρ","&Sigma;":"Σ","&Tau;":"Τ","&Upsilon;":"Υ","&Phi;":"Φ","&Chi;":"Χ","&Psi;":"Ψ","&Omega;":"Ω","&alpha;":"α","&beta;":"β","&gamma;":"γ","&delta;":"δ","&epsilon;":"ε","&zeta;":"ζ","&eta;":"η","&theta;":"θ","&iota;":"ι","&kappa;":"κ","&lambda;":"λ","&mu;":"μ","&nu;":"ν","&xi;":"ξ","&omicron;":"ο","&pi;":"π","&rho;":"ρ","&sigmaf;":"ς","&sigma;":"σ","&tau;":"τ","&upsilon;":"υ","&phi;":"φ","&chi;":"χ","&psi;":"ψ","&omega;":"ω","&thetasym;":"ϑ","&upsih;":"ϒ","&piv;":"ϖ","&bull;":"•","&hellip;":"…","&prime;":"′","&Prime;":"″","&oline;":"‾","&frasl;":"⁄","&weierp;":"℘","&image;":"ℑ","&real;":"ℜ","&trade;":"™","&alefsym;":"ℵ","&larr;":"←","&uarr;":"↑","&rarr;":"→","&darr;":"↓","&harr;":"↔","&crarr;":"↵","&lArr;":"⇐","&uArr;":"⇑","&rArr;":"⇒","&dArr;":"⇓","&hArr;":"⇔","&forall;":"∀","&part;":"∂","&exist;":"∃","&empty;":"∅","&nabla;":"∇","&isin;":"∈","&notin;":"∉","&ni;":"∋","&prod;":"∏","&sum;":"∑","&minus;":"−","&lowast;":"∗","&radic;":"√","&prop;":"∝","&infin;":"∞","&ang;":"∠","&and;":"∧","&or;":"∨","&cap;":"∩","&cup;":"∪","&int;":"∫","&there4;":"∴","&sim;":"∼","&cong;":"≅","&asymp;":"≈","&ne;":"≠","&equiv;":"≡","&le;":"≤","&ge;":"≥","&sub;":"⊂","&sup;":"⊃","&nsub;":"⊄","&sube;":"⊆","&supe;":"⊇","&oplus;":"⊕","&otimes;":"⊗","&perp;":"⊥","&sdot;":"⋅","&lceil;":"⌈","&rceil;":"⌉","&lfloor;":"⌊","&rfloor;":"⌋","&lang;":"〈","&rang;":"〉","&loz;":"◊","&spades;":"♠","&clubs;":"♣","&hearts;":"♥","&diams;":"♦"},characters:{"'":"&apos;"," ":"&nbsp;","¡":"&iexcl;","¢":"&cent;","£":"&pound;","¤":"&curren;","¥":"&yen;","¦":"&brvbar;","§":"&sect;","¨":"&uml;","©":"&copy;","ª":"&ordf;","«":"&laquo;","¬":"&not;","­":"&shy;","®":"&reg;","¯":"&macr;","°":"&deg;","±":"&plusmn;","²":"&sup2;","³":"&sup3;","´":"&acute;","µ":"&micro;","¶":"&para;","·":"&middot;","¸":"&cedil;","¹":"&sup1;","º":"&ordm;","»":"&raquo;","¼":"&frac14;","½":"&frac12;","¾":"&frac34;","¿":"&iquest;","À":"&Agrave;","Á":"&Aacute;","Â":"&Acirc;","Ã":"&Atilde;","Ä":"&Auml;","Å":"&Aring;","Æ":"&AElig;","Ç":"&Ccedil;","È":"&Egrave;","É":"&Eacute;","Ê":"&Ecirc;","Ë":"&Euml;","Ì":"&Igrave;","Í":"&Iacute;","Î":"&Icirc;","Ï":"&Iuml;","Ð":"&ETH;","Ñ":"&Ntilde;","Ò":"&Ograve;","Ó":"&Oacute;","Ô":"&Ocirc;","Õ":"&Otilde;","Ö":"&Ouml;","×":"&times;","Ø":"&Oslash;","Ù":"&Ugrave;","Ú":"&Uacute;","Û":"&Ucirc;","Ü":"&Uuml;","Ý":"&Yacute;","Þ":"&THORN;","ß":"&szlig;","à":"&agrave;","á":"&aacute;","â":"&acirc;","ã":"&atilde;","ä":"&auml;","å":"&aring;","æ":"&aelig;","ç":"&ccedil;","è":"&egrave;","é":"&eacute;","ê":"&ecirc;","ë":"&euml;","ì":"&igrave;","í":"&iacute;","î":"&icirc;","ï":"&iuml;","ð":"&eth;","ñ":"&ntilde;","ò":"&ograve;","ó":"&oacute;","ô":"&ocirc;","õ":"&otilde;","ö":"&ouml;","÷":"&divide;","ø":"&oslash;","ù":"&ugrave;","ú":"&uacute;","û":"&ucirc;","ü":"&uuml;","ý":"&yacute;","þ":"&thorn;","ÿ":"&yuml;",'"':"&quot;","&":"&amp;","<":"&lt;",">":"&gt;","Œ":"&OElig;","œ":"&oelig;","Š":"&Scaron;","š":"&scaron;","Ÿ":"&Yuml;","ˆ":"&circ;","˜":"&tilde;"," ":"&ensp;"," ":"&emsp;"," ":"&thinsp;","‌":"&zwnj;","‍":"&zwj;","‎":"&lrm;","‏":"&rlm;","–":"&ndash;","—":"&mdash;","‘":"&lsquo;","’":"&rsquo;","‚":"&sbquo;","“":"&ldquo;","”":"&rdquo;","„":"&bdquo;","†":"&dagger;","‡":"&Dagger;","‰":"&permil;","‹":"&lsaquo;","›":"&rsaquo;","€":"&euro;","ƒ":"&fnof;","Α":"&Alpha;","Β":"&Beta;","Γ":"&Gamma;","Δ":"&Delta;","Ε":"&Epsilon;","Ζ":"&Zeta;","Η":"&Eta;","Θ":"&Theta;","Ι":"&Iota;","Κ":"&Kappa;","Λ":"&Lambda;","Μ":"&Mu;","Ν":"&Nu;","Ξ":"&Xi;","Ο":"&Omicron;","Π":"&Pi;","Ρ":"&Rho;","Σ":"&Sigma;","Τ":"&Tau;","Υ":"&Upsilon;","Φ":"&Phi;","Χ":"&Chi;","Ψ":"&Psi;","Ω":"&Omega;","α":"&alpha;","β":"&beta;","γ":"&gamma;","δ":"&delta;","ε":"&epsilon;","ζ":"&zeta;","η":"&eta;","θ":"&theta;","ι":"&iota;","κ":"&kappa;","λ":"&lambda;","μ":"&mu;","ν":"&nu;","ξ":"&xi;","ο":"&omicron;","π":"&pi;","ρ":"&rho;","ς":"&sigmaf;","σ":"&sigma;","τ":"&tau;","υ":"&upsilon;","φ":"&phi;","χ":"&chi;","ψ":"&psi;","ω":"&omega;","ϑ":"&thetasym;","ϒ":"&upsih;","ϖ":"&piv;","•":"&bull;","…":"&hellip;","′":"&prime;","″":"&Prime;","‾":"&oline;","⁄":"&frasl;","℘":"&weierp;","ℑ":"&image;","ℜ":"&real;","™":"&trade;","ℵ":"&alefsym;","←":"&larr;","↑":"&uarr;","→":"&rarr;","↓":"&darr;","↔":"&harr;","↵":"&crarr;","⇐":"&lArr;","⇑":"&uArr;","⇒":"&rArr;","⇓":"&dArr;","⇔":"&hArr;","∀":"&forall;","∂":"&part;","∃":"&exist;","∅":"&empty;","∇":"&nabla;","∈":"&isin;","∉":"&notin;","∋":"&ni;","∏":"&prod;","∑":"&sum;","−":"&minus;","∗":"&lowast;","√":"&radic;","∝":"&prop;","∞":"&infin;","∠":"&ang;","∧":"&and;","∨":"&or;","∩":"&cap;","∪":"&cup;","∫":"&int;","∴":"&there4;","∼":"&sim;","≅":"&cong;","≈":"&asymp;","≠":"&ne;","≡":"&equiv;","≤":"&le;","≥":"&ge;","⊂":"&sub;","⊃":"&sup;","⊄":"&nsub;","⊆":"&sube;","⊇":"&supe;","⊕":"&oplus;","⊗":"&otimes;","⊥":"&perp;","⋅":"&sdot;","⌈":"&lceil;","⌉":"&rceil;","⌊":"&lfloor;","⌋":"&rfloor;","〈":"&lang;","〉":"&rang;","◊":"&loz;","♠":"&spades;","♣":"&clubs;","♥":"&hearts;","♦":"&diams;"}},html5:{entities:{"&AElig":"Æ","&AElig;":"Æ","&AMP":"&","&AMP;":"&","&Aacute":"Á","&Aacute;":"Á","&Abreve;":"Ă","&Acirc":"Â","&Acirc;":"Â","&Acy;":"А","&Afr;":"𝔄","&Agrave":"À","&Agrave;":"À","&Alpha;":"Α","&Amacr;":"Ā","&And;":"⩓","&Aogon;":"Ą","&Aopf;":"𝔸","&ApplyFunction;":"⁡","&Aring":"Å","&Aring;":"Å","&Ascr;":"𝒜","&Assign;":"≔","&Atilde":"Ã","&Atilde;":"Ã","&Auml":"Ä","&Auml;":"Ä","&Backslash;":"∖","&Barv;":"⫧","&Barwed;":"⌆","&Bcy;":"Б","&Because;":"∵","&Bernoullis;":"ℬ","&Beta;":"Β","&Bfr;":"𝔅","&Bopf;":"𝔹","&Breve;":"˘","&Bscr;":"ℬ","&Bumpeq;":"≎","&CHcy;":"Ч","&COPY":"©","&COPY;":"©","&Cacute;":"Ć","&Cap;":"⋒","&CapitalDifferentialD;":"ⅅ","&Cayleys;":"ℭ","&Ccaron;":"Č","&Ccedil":"Ç","&Ccedil;":"Ç","&Ccirc;":"Ĉ","&Cconint;":"∰","&Cdot;":"Ċ","&Cedilla;":"¸","&CenterDot;":"·","&Cfr;":"ℭ","&Chi;":"Χ","&CircleDot;":"⊙","&CircleMinus;":"⊖","&CirclePlus;":"⊕","&CircleTimes;":"⊗","&ClockwiseContourIntegral;":"∲","&CloseCurlyDoubleQuote;":"”","&CloseCurlyQuote;":"’","&Colon;":"∷","&Colone;":"⩴","&Congruent;":"≡","&Conint;":"∯","&ContourIntegral;":"∮","&Copf;":"ℂ","&Coproduct;":"∐","&CounterClockwiseContourIntegral;":"∳","&Cross;":"⨯","&Cscr;":"𝒞","&Cup;":"⋓","&CupCap;":"≍","&DD;":"ⅅ","&DDotrahd;":"⤑","&DJcy;":"Ђ","&DScy;":"Ѕ","&DZcy;":"Џ","&Dagger;":"‡","&Darr;":"↡","&Dashv;":"⫤","&Dcaron;":"Ď","&Dcy;":"Д","&Del;":"∇","&Delta;":"Δ","&Dfr;":"𝔇","&DiacriticalAcute;":"´","&DiacriticalDot;":"˙","&DiacriticalDoubleAcute;":"˝","&DiacriticalGrave;":"`","&DiacriticalTilde;":"˜","&Diamond;":"⋄","&DifferentialD;":"ⅆ","&Dopf;":"𝔻","&Dot;":"¨","&DotDot;":"⃜","&DotEqual;":"≐","&DoubleContourIntegral;":"∯","&DoubleDot;":"¨","&DoubleDownArrow;":"⇓","&DoubleLeftArrow;":"⇐","&DoubleLeftRightArrow;":"⇔","&DoubleLeftTee;":"⫤","&DoubleLongLeftArrow;":"⟸","&DoubleLongLeftRightArrow;":"⟺","&DoubleLongRightArrow;":"⟹","&DoubleRightArrow;":"⇒","&DoubleRightTee;":"⊨","&DoubleUpArrow;":"⇑","&DoubleUpDownArrow;":"⇕","&DoubleVerticalBar;":"∥","&DownArrow;":"↓","&DownArrowBar;":"⤓","&DownArrowUpArrow;":"⇵","&DownBreve;":"̑","&DownLeftRightVector;":"⥐","&DownLeftTeeVector;":"⥞","&DownLeftVector;":"↽","&DownLeftVectorBar;":"⥖","&DownRightTeeVector;":"⥟","&DownRightVector;":"⇁","&DownRightVectorBar;":"⥗","&DownTee;":"⊤","&DownTeeArrow;":"↧","&Downarrow;":"⇓","&Dscr;":"𝒟","&Dstrok;":"Đ","&ENG;":"Ŋ","&ETH":"Ð","&ETH;":"Ð","&Eacute":"É","&Eacute;":"É","&Ecaron;":"Ě","&Ecirc":"Ê","&Ecirc;":"Ê","&Ecy;":"Э","&Edot;":"Ė","&Efr;":"𝔈","&Egrave":"È","&Egrave;":"È","&Element;":"∈","&Emacr;":"Ē","&EmptySmallSquare;":"◻","&EmptyVerySmallSquare;":"▫","&Eogon;":"Ę","&Eopf;":"𝔼","&Epsilon;":"Ε","&Equal;":"⩵","&EqualTilde;":"≂","&Equilibrium;":"⇌","&Escr;":"ℰ","&Esim;":"⩳","&Eta;":"Η","&Euml":"Ë","&Euml;":"Ë","&Exists;":"∃","&ExponentialE;":"ⅇ","&Fcy;":"Ф","&Ffr;":"𝔉","&FilledSmallSquare;":"◼","&FilledVerySmallSquare;":"▪","&Fopf;":"𝔽","&ForAll;":"∀","&Fouriertrf;":"ℱ","&Fscr;":"ℱ","&GJcy;":"Ѓ","&GT":">","&GT;":">","&Gamma;":"Γ","&Gammad;":"Ϝ","&Gbreve;":"Ğ","&Gcedil;":"Ģ","&Gcirc;":"Ĝ","&Gcy;":"Г","&Gdot;":"Ġ","&Gfr;":"𝔊","&Gg;":"⋙","&Gopf;":"𝔾","&GreaterEqual;":"≥","&GreaterEqualLess;":"⋛","&GreaterFullEqual;":"≧","&GreaterGreater;":"⪢","&GreaterLess;":"≷","&GreaterSlantEqual;":"⩾","&GreaterTilde;":"≳","&Gscr;":"𝒢","&Gt;":"≫","&HARDcy;":"Ъ","&Hacek;":"ˇ","&Hat;":"^","&Hcirc;":"Ĥ","&Hfr;":"ℌ","&HilbertSpace;":"ℋ","&Hopf;":"ℍ","&HorizontalLine;":"─","&Hscr;":"ℋ","&Hstrok;":"Ħ","&HumpDownHump;":"≎","&HumpEqual;":"≏","&IEcy;":"Е","&IJlig;":"Ĳ","&IOcy;":"Ё","&Iacute":"Í","&Iacute;":"Í","&Icirc":"Î","&Icirc;":"Î","&Icy;":"И","&Idot;":"İ","&Ifr;":"ℑ","&Igrave":"Ì","&Igrave;":"Ì","&Im;":"ℑ","&Imacr;":"Ī","&ImaginaryI;":"ⅈ","&Implies;":"⇒","&Int;":"∬","&Integral;":"∫","&Intersection;":"⋂","&InvisibleComma;":"⁣","&InvisibleTimes;":"⁢","&Iogon;":"Į","&Iopf;":"𝕀","&Iota;":"Ι","&Iscr;":"ℐ","&Itilde;":"Ĩ","&Iukcy;":"І","&Iuml":"Ï","&Iuml;":"Ï","&Jcirc;":"Ĵ","&Jcy;":"Й","&Jfr;":"𝔍","&Jopf;":"𝕁","&Jscr;":"𝒥","&Jsercy;":"Ј","&Jukcy;":"Є","&KHcy;":"Х","&KJcy;":"Ќ","&Kappa;":"Κ","&Kcedil;":"Ķ","&Kcy;":"К","&Kfr;":"𝔎","&Kopf;":"𝕂","&Kscr;":"𝒦","&LJcy;":"Љ","&LT":"<","&LT;":"<","&Lacute;":"Ĺ","&Lambda;":"Λ","&Lang;":"⟪","&Laplacetrf;":"ℒ","&Larr;":"↞","&Lcaron;":"Ľ","&Lcedil;":"Ļ","&Lcy;":"Л","&LeftAngleBracket;":"⟨","&LeftArrow;":"←","&LeftArrowBar;":"⇤","&LeftArrowRightArrow;":"⇆","&LeftCeiling;":"⌈","&LeftDoubleBracket;":"⟦","&LeftDownTeeVector;":"⥡","&LeftDownVector;":"⇃","&LeftDownVectorBar;":"⥙","&LeftFloor;":"⌊","&LeftRightArrow;":"↔","&LeftRightVector;":"⥎","&LeftTee;":"⊣","&LeftTeeArrow;":"↤","&LeftTeeVector;":"⥚","&LeftTriangle;":"⊲","&LeftTriangleBar;":"⧏","&LeftTriangleEqual;":"⊴","&LeftUpDownVector;":"⥑","&LeftUpTeeVector;":"⥠","&LeftUpVector;":"↿","&LeftUpVectorBar;":"⥘","&LeftVector;":"↼","&LeftVectorBar;":"⥒","&Leftarrow;":"⇐","&Leftrightarrow;":"⇔","&LessEqualGreater;":"⋚","&LessFullEqual;":"≦","&LessGreater;":"≶","&LessLess;":"⪡","&LessSlantEqual;":"⩽","&LessTilde;":"≲","&Lfr;":"𝔏","&Ll;":"⋘","&Lleftarrow;":"⇚","&Lmidot;":"Ŀ","&LongLeftArrow;":"⟵","&LongLeftRightArrow;":"⟷","&LongRightArrow;":"⟶","&Longleftarrow;":"⟸","&Longleftrightarrow;":"⟺","&Longrightarrow;":"⟹","&Lopf;":"𝕃","&LowerLeftArrow;":"↙","&LowerRightArrow;":"↘","&Lscr;":"ℒ","&Lsh;":"↰","&Lstrok;":"Ł","&Lt;":"≪","&Map;":"⤅","&Mcy;":"М","&MediumSpace;":" ","&Mellintrf;":"ℳ","&Mfr;":"𝔐","&MinusPlus;":"∓","&Mopf;":"𝕄","&Mscr;":"ℳ","&Mu;":"Μ","&NJcy;":"Њ","&Nacute;":"Ń","&Ncaron;":"Ň","&Ncedil;":"Ņ","&Ncy;":"Н","&NegativeMediumSpace;":"​","&NegativeThickSpace;":"​","&NegativeThinSpace;":"​","&NegativeVeryThinSpace;":"​","&NestedGreaterGreater;":"≫","&NestedLessLess;":"≪","&NewLine;":"\n","&Nfr;":"𝔑","&NoBreak;":"⁠","&NonBreakingSpace;":" ","&Nopf;":"ℕ","&Not;":"⫬","&NotCongruent;":"≢","&NotCupCap;":"≭","&NotDoubleVerticalBar;":"∦","&NotElement;":"∉","&NotEqual;":"≠","&NotEqualTilde;":"≂̸","&NotExists;":"∄","&NotGreater;":"≯","&NotGreaterEqual;":"≱","&NotGreaterFullEqual;":"≧̸","&NotGreaterGreater;":"≫̸","&NotGreaterLess;":"≹","&NotGreaterSlantEqual;":"⩾̸","&NotGreaterTilde;":"≵","&NotHumpDownHump;":"≎̸","&NotHumpEqual;":"≏̸","&NotLeftTriangle;":"⋪","&NotLeftTriangleBar;":"⧏̸","&NotLeftTriangleEqual;":"⋬","&NotLess;":"≮","&NotLessEqual;":"≰","&NotLessGreater;":"≸","&NotLessLess;":"≪̸","&NotLessSlantEqual;":"⩽̸","&NotLessTilde;":"≴","&NotNestedGreaterGreater;":"⪢̸","&NotNestedLessLess;":"⪡̸","&NotPrecedes;":"⊀","&NotPrecedesEqual;":"⪯̸","&NotPrecedesSlantEqual;":"⋠","&NotReverseElement;":"∌","&NotRightTriangle;":"⋫","&NotRightTriangleBar;":"⧐̸","&NotRightTriangleEqual;":"⋭","&NotSquareSubset;":"⊏̸","&NotSquareSubsetEqual;":"⋢","&NotSquareSuperset;":"⊐̸","&NotSquareSupersetEqual;":"⋣","&NotSubset;":"⊂⃒","&NotSubsetEqual;":"⊈","&NotSucceeds;":"⊁","&NotSucceedsEqual;":"⪰̸","&NotSucceedsSlantEqual;":"⋡","&NotSucceedsTilde;":"≿̸","&NotSuperset;":"⊃⃒","&NotSupersetEqual;":"⊉","&NotTilde;":"≁","&NotTildeEqual;":"≄","&NotTildeFullEqual;":"≇","&NotTildeTilde;":"≉","&NotVerticalBar;":"∤","&Nscr;":"𝒩","&Ntilde":"Ñ","&Ntilde;":"Ñ","&Nu;":"Ν","&OElig;":"Œ","&Oacute":"Ó","&Oacute;":"Ó","&Ocirc":"Ô","&Ocirc;":"Ô","&Ocy;":"О","&Odblac;":"Ő","&Ofr;":"𝔒","&Ograve":"Ò","&Ograve;":"Ò","&Omacr;":"Ō","&Omega;":"Ω","&Omicron;":"Ο","&Oopf;":"𝕆","&OpenCurlyDoubleQuote;":"“","&OpenCurlyQuote;":"‘","&Or;":"⩔","&Oscr;":"𝒪","&Oslash":"Ø","&Oslash;":"Ø","&Otilde":"Õ","&Otilde;":"Õ","&Otimes;":"⨷","&Ouml":"Ö","&Ouml;":"Ö","&OverBar;":"‾","&OverBrace;":"⏞","&OverBracket;":"⎴","&OverParenthesis;":"⏜","&PartialD;":"∂","&Pcy;":"П","&Pfr;":"𝔓","&Phi;":"Φ","&Pi;":"Π","&PlusMinus;":"±","&Poincareplane;":"ℌ","&Popf;":"ℙ","&Pr;":"⪻","&Precedes;":"≺","&PrecedesEqual;":"⪯","&PrecedesSlantEqual;":"≼","&PrecedesTilde;":"≾","&Prime;":"″","&Product;":"∏","&Proportion;":"∷","&Proportional;":"∝","&Pscr;":"𝒫","&Psi;":"Ψ","&QUOT":'"',"&QUOT;":'"',"&Qfr;":"𝔔","&Qopf;":"ℚ","&Qscr;":"𝒬","&RBarr;":"⤐","&REG":"®","&REG;":"®","&Racute;":"Ŕ","&Rang;":"⟫","&Rarr;":"↠","&Rarrtl;":"⤖","&Rcaron;":"Ř","&Rcedil;":"Ŗ","&Rcy;":"Р","&Re;":"ℜ","&ReverseElement;":"∋","&ReverseEquilibrium;":"⇋","&ReverseUpEquilibrium;":"⥯","&Rfr;":"ℜ","&Rho;":"Ρ","&RightAngleBracket;":"⟩","&RightArrow;":"→","&RightArrowBar;":"⇥","&RightArrowLeftArrow;":"⇄","&RightCeiling;":"⌉","&RightDoubleBracket;":"⟧","&RightDownTeeVector;":"⥝","&RightDownVector;":"⇂","&RightDownVectorBar;":"⥕","&RightFloor;":"⌋","&RightTee;":"⊢","&RightTeeArrow;":"↦","&RightTeeVector;":"⥛","&RightTriangle;":"⊳","&RightTriangleBar;":"⧐","&RightTriangleEqual;":"⊵","&RightUpDownVector;":"⥏","&RightUpTeeVector;":"⥜","&RightUpVector;":"↾","&RightUpVectorBar;":"⥔","&RightVector;":"⇀","&RightVectorBar;":"⥓","&Rightarrow;":"⇒","&Ropf;":"ℝ","&RoundImplies;":"⥰","&Rrightarrow;":"⇛","&Rscr;":"ℛ","&Rsh;":"↱","&RuleDelayed;":"⧴","&SHCHcy;":"Щ","&SHcy;":"Ш","&SOFTcy;":"Ь","&Sacute;":"Ś","&Sc;":"⪼","&Scaron;":"Š","&Scedil;":"Ş","&Scirc;":"Ŝ","&Scy;":"С","&Sfr;":"𝔖","&ShortDownArrow;":"↓","&ShortLeftArrow;":"←","&ShortRightArrow;":"→","&ShortUpArrow;":"↑","&Sigma;":"Σ","&SmallCircle;":"∘","&Sopf;":"𝕊","&Sqrt;":"√","&Square;":"□","&SquareIntersection;":"⊓","&SquareSubset;":"⊏","&SquareSubsetEqual;":"⊑","&SquareSuperset;":"⊐","&SquareSupersetEqual;":"⊒","&SquareUnion;":"⊔","&Sscr;":"𝒮","&Star;":"⋆","&Sub;":"⋐","&Subset;":"⋐","&SubsetEqual;":"⊆","&Succeeds;":"≻","&SucceedsEqual;":"⪰","&SucceedsSlantEqual;":"≽","&SucceedsTilde;":"≿","&SuchThat;":"∋","&Sum;":"∑","&Sup;":"⋑","&Superset;":"⊃","&SupersetEqual;":"⊇","&Supset;":"⋑","&THORN":"Þ","&THORN;":"Þ","&TRADE;":"™","&TSHcy;":"Ћ","&TScy;":"Ц","&Tab;":"\t","&Tau;":"Τ","&Tcaron;":"Ť","&Tcedil;":"Ţ","&Tcy;":"Т","&Tfr;":"𝔗","&Therefore;":"∴","&Theta;":"Θ","&ThickSpace;":"  ","&ThinSpace;":" ","&Tilde;":"∼","&TildeEqual;":"≃","&TildeFullEqual;":"≅","&TildeTilde;":"≈","&Topf;":"𝕋","&TripleDot;":"⃛","&Tscr;":"𝒯","&Tstrok;":"Ŧ","&Uacute":"Ú","&Uacute;":"Ú","&Uarr;":"↟","&Uarrocir;":"⥉","&Ubrcy;":"Ў","&Ubreve;":"Ŭ","&Ucirc":"Û","&Ucirc;":"Û","&Ucy;":"У","&Udblac;":"Ű","&Ufr;":"𝔘","&Ugrave":"Ù","&Ugrave;":"Ù","&Umacr;":"Ū","&UnderBar;":"_","&UnderBrace;":"⏟","&UnderBracket;":"⎵","&UnderParenthesis;":"⏝","&Union;":"⋃","&UnionPlus;":"⊎","&Uogon;":"Ų","&Uopf;":"𝕌","&UpArrow;":"↑","&UpArrowBar;":"⤒","&UpArrowDownArrow;":"⇅","&UpDownArrow;":"↕","&UpEquilibrium;":"⥮","&UpTee;":"⊥","&UpTeeArrow;":"↥","&Uparrow;":"⇑","&Updownarrow;":"⇕","&UpperLeftArrow;":"↖","&UpperRightArrow;":"↗","&Upsi;":"ϒ","&Upsilon;":"Υ","&Uring;":"Ů","&Uscr;":"𝒰","&Utilde;":"Ũ","&Uuml":"Ü","&Uuml;":"Ü","&VDash;":"⊫","&Vbar;":"⫫","&Vcy;":"В","&Vdash;":"⊩","&Vdashl;":"⫦","&Vee;":"⋁","&Verbar;":"‖","&Vert;":"‖","&VerticalBar;":"∣","&VerticalLine;":"|","&VerticalSeparator;":"❘","&VerticalTilde;":"≀","&VeryThinSpace;":" ","&Vfr;":"𝔙","&Vopf;":"𝕍","&Vscr;":"𝒱","&Vvdash;":"⊪","&Wcirc;":"Ŵ","&Wedge;":"⋀","&Wfr;":"𝔚","&Wopf;":"𝕎","&Wscr;":"𝒲","&Xfr;":"𝔛","&Xi;":"Ξ","&Xopf;":"𝕏","&Xscr;":"𝒳","&YAcy;":"Я","&YIcy;":"Ї","&YUcy;":"Ю","&Yacute":"Ý","&Yacute;":"Ý","&Ycirc;":"Ŷ","&Ycy;":"Ы","&Yfr;":"𝔜","&Yopf;":"𝕐","&Yscr;":"𝒴","&Yuml;":"Ÿ","&ZHcy;":"Ж","&Zacute;":"Ź","&Zcaron;":"Ž","&Zcy;":"З","&Zdot;":"Ż","&ZeroWidthSpace;":"​","&Zeta;":"Ζ","&Zfr;":"ℨ","&Zopf;":"ℤ","&Zscr;":"𝒵","&aacute":"á","&aacute;":"á","&abreve;":"ă","&ac;":"∾","&acE;":"∾̳","&acd;":"∿","&acirc":"â","&acirc;":"â","&acute":"´","&acute;":"´","&acy;":"а","&aelig":"æ","&aelig;":"æ","&af;":"⁡","&afr;":"𝔞","&agrave":"à","&agrave;":"à","&alefsym;":"ℵ","&aleph;":"ℵ","&alpha;":"α","&amacr;":"ā","&amalg;":"⨿","&amp":"&","&amp;":"&","&and;":"∧","&andand;":"⩕","&andd;":"⩜","&andslope;":"⩘","&andv;":"⩚","&ang;":"∠","&ange;":"⦤","&angle;":"∠","&angmsd;":"∡","&angmsdaa;":"⦨","&angmsdab;":"⦩","&angmsdac;":"⦪","&angmsdad;":"⦫","&angmsdae;":"⦬","&angmsdaf;":"⦭","&angmsdag;":"⦮","&angmsdah;":"⦯","&angrt;":"∟","&angrtvb;":"⊾","&angrtvbd;":"⦝","&angsph;":"∢","&angst;":"Å","&angzarr;":"⍼","&aogon;":"ą","&aopf;":"𝕒","&ap;":"≈","&apE;":"⩰","&apacir;":"⩯","&ape;":"≊","&apid;":"≋","&apos;":"'","&approx;":"≈","&approxeq;":"≊","&aring":"å","&aring;":"å","&ascr;":"𝒶","&ast;":"*","&asymp;":"≈","&asympeq;":"≍","&atilde":"ã","&atilde;":"ã","&auml":"ä","&auml;":"ä","&awconint;":"∳","&awint;":"⨑","&bNot;":"⫭","&backcong;":"≌","&backepsilon;":"϶","&backprime;":"‵","&backsim;":"∽","&backsimeq;":"⋍","&barvee;":"⊽","&barwed;":"⌅","&barwedge;":"⌅","&bbrk;":"⎵","&bbrktbrk;":"⎶","&bcong;":"≌","&bcy;":"б","&bdquo;":"„","&becaus;":"∵","&because;":"∵","&bemptyv;":"⦰","&bepsi;":"϶","&bernou;":"ℬ","&beta;":"β","&beth;":"ℶ","&between;":"≬","&bfr;":"𝔟","&bigcap;":"⋂","&bigcirc;":"◯","&bigcup;":"⋃","&bigodot;":"⨀","&bigoplus;":"⨁","&bigotimes;":"⨂","&bigsqcup;":"⨆","&bigstar;":"★","&bigtriangledown;":"▽","&bigtriangleup;":"△","&biguplus;":"⨄","&bigvee;":"⋁","&bigwedge;":"⋀","&bkarow;":"⤍","&blacklozenge;":"⧫","&blacksquare;":"▪","&blacktriangle;":"▴","&blacktriangledown;":"▾","&blacktriangleleft;":"◂","&blacktriangleright;":"▸","&blank;":"␣","&blk12;":"▒","&blk14;":"░","&blk34;":"▓","&block;":"█","&bne;":"=⃥","&bnequiv;":"≡⃥","&bnot;":"⌐","&bopf;":"𝕓","&bot;":"⊥","&bottom;":"⊥","&bowtie;":"⋈","&boxDL;":"╗","&boxDR;":"╔","&boxDl;":"╖","&boxDr;":"╓","&boxH;":"═","&boxHD;":"╦","&boxHU;":"╩","&boxHd;":"╤","&boxHu;":"╧","&boxUL;":"╝","&boxUR;":"╚","&boxUl;":"╜","&boxUr;":"╙","&boxV;":"║","&boxVH;":"╬","&boxVL;":"╣","&boxVR;":"╠","&boxVh;":"╫","&boxVl;":"╢","&boxVr;":"╟","&boxbox;":"⧉","&boxdL;":"╕","&boxdR;":"╒","&boxdl;":"┐","&boxdr;":"┌","&boxh;":"─","&boxhD;":"╥","&boxhU;":"╨","&boxhd;":"┬","&boxhu;":"┴","&boxminus;":"⊟","&boxplus;":"⊞","&boxtimes;":"⊠","&boxuL;":"╛","&boxuR;":"╘","&boxul;":"┘","&boxur;":"└","&boxv;":"│","&boxvH;":"╪","&boxvL;":"╡","&boxvR;":"╞","&boxvh;":"┼","&boxvl;":"┤","&boxvr;":"├","&bprime;":"‵","&breve;":"˘","&brvbar":"¦","&brvbar;":"¦","&bscr;":"𝒷","&bsemi;":"⁏","&bsim;":"∽","&bsime;":"⋍","&bsol;":"\\","&bsolb;":"⧅","&bsolhsub;":"⟈","&bull;":"•","&bullet;":"•","&bump;":"≎","&bumpE;":"⪮","&bumpe;":"≏","&bumpeq;":"≏","&cacute;":"ć","&cap;":"∩","&capand;":"⩄","&capbrcup;":"⩉","&capcap;":"⩋","&capcup;":"⩇","&capdot;":"⩀","&caps;":"∩︀","&caret;":"⁁","&caron;":"ˇ","&ccaps;":"⩍","&ccaron;":"č","&ccedil":"ç","&ccedil;":"ç","&ccirc;":"ĉ","&ccups;":"⩌","&ccupssm;":"⩐","&cdot;":"ċ","&cedil":"¸","&cedil;":"¸","&cemptyv;":"⦲","&cent":"¢","&cent;":"¢","&centerdot;":"·","&cfr;":"𝔠","&chcy;":"ч","&check;":"✓","&checkmark;":"✓","&chi;":"χ","&cir;":"○","&cirE;":"⧃","&circ;":"ˆ","&circeq;":"≗","&circlearrowleft;":"↺","&circlearrowright;":"↻","&circledR;":"®","&circledS;":"Ⓢ","&circledast;":"⊛","&circledcirc;":"⊚","&circleddash;":"⊝","&cire;":"≗","&cirfnint;":"⨐","&cirmid;":"⫯","&cirscir;":"⧂","&clubs;":"♣","&clubsuit;":"♣","&colon;":":","&colone;":"≔","&coloneq;":"≔","&comma;":",","&commat;":"@","&comp;":"∁","&compfn;":"∘","&complement;":"∁","&complexes;":"ℂ","&cong;":"≅","&congdot;":"⩭","&conint;":"∮","&copf;":"𝕔","&coprod;":"∐","&copy":"©","&copy;":"©","&copysr;":"℗","&crarr;":"↵","&cross;":"✗","&cscr;":"𝒸","&csub;":"⫏","&csube;":"⫑","&csup;":"⫐","&csupe;":"⫒","&ctdot;":"⋯","&cudarrl;":"⤸","&cudarrr;":"⤵","&cuepr;":"⋞","&cuesc;":"⋟","&cularr;":"↶","&cularrp;":"⤽","&cup;":"∪","&cupbrcap;":"⩈","&cupcap;":"⩆","&cupcup;":"⩊","&cupdot;":"⊍","&cupor;":"⩅","&cups;":"∪︀","&curarr;":"↷","&curarrm;":"⤼","&curlyeqprec;":"⋞","&curlyeqsucc;":"⋟","&curlyvee;":"⋎","&curlywedge;":"⋏","&curren":"¤","&curren;":"¤","&curvearrowleft;":"↶","&curvearrowright;":"↷","&cuvee;":"⋎","&cuwed;":"⋏","&cwconint;":"∲","&cwint;":"∱","&cylcty;":"⌭","&dArr;":"⇓","&dHar;":"⥥","&dagger;":"†","&daleth;":"ℸ","&darr;":"↓","&dash;":"‐","&dashv;":"⊣","&dbkarow;":"⤏","&dblac;":"˝","&dcaron;":"ď","&dcy;":"д","&dd;":"ⅆ","&ddagger;":"‡","&ddarr;":"⇊","&ddotseq;":"⩷","&deg":"°","&deg;":"°","&delta;":"δ","&demptyv;":"⦱","&dfisht;":"⥿","&dfr;":"𝔡","&dharl;":"⇃","&dharr;":"⇂","&diam;":"⋄","&diamond;":"⋄","&diamondsuit;":"♦","&diams;":"♦","&die;":"¨","&digamma;":"ϝ","&disin;":"⋲","&div;":"÷","&divide":"÷","&divide;":"÷","&divideontimes;":"⋇","&divonx;":"⋇","&djcy;":"ђ","&dlcorn;":"⌞","&dlcrop;":"⌍","&dollar;":"$","&dopf;":"𝕕","&dot;":"˙","&doteq;":"≐","&doteqdot;":"≑","&dotminus;":"∸","&dotplus;":"∔","&dotsquare;":"⊡","&doublebarwedge;":"⌆","&downarrow;":"↓","&downdownarrows;":"⇊","&downharpoonleft;":"⇃","&downharpoonright;":"⇂","&drbkarow;":"⤐","&drcorn;":"⌟","&drcrop;":"⌌","&dscr;":"𝒹","&dscy;":"ѕ","&dsol;":"⧶","&dstrok;":"đ","&dtdot;":"⋱","&dtri;":"▿","&dtrif;":"▾","&duarr;":"⇵","&duhar;":"⥯","&dwangle;":"⦦","&dzcy;":"џ","&dzigrarr;":"⟿","&eDDot;":"⩷","&eDot;":"≑","&eacute":"é","&eacute;":"é","&easter;":"⩮","&ecaron;":"ě","&ecir;":"≖","&ecirc":"ê","&ecirc;":"ê","&ecolon;":"≕","&ecy;":"э","&edot;":"ė","&ee;":"ⅇ","&efDot;":"≒","&efr;":"𝔢","&eg;":"⪚","&egrave":"è","&egrave;":"è","&egs;":"⪖","&egsdot;":"⪘","&el;":"⪙","&elinters;":"⏧","&ell;":"ℓ","&els;":"⪕","&elsdot;":"⪗","&emacr;":"ē","&empty;":"∅","&emptyset;":"∅","&emptyv;":"∅","&emsp13;":" ","&emsp14;":" ","&emsp;":" ","&eng;":"ŋ","&ensp;":" ","&eogon;":"ę","&eopf;":"𝕖","&epar;":"⋕","&eparsl;":"⧣","&eplus;":"⩱","&epsi;":"ε","&epsilon;":"ε","&epsiv;":"ϵ","&eqcirc;":"≖","&eqcolon;":"≕","&eqsim;":"≂","&eqslantgtr;":"⪖","&eqslantless;":"⪕","&equals;":"=","&equest;":"≟","&equiv;":"≡","&equivDD;":"⩸","&eqvparsl;":"⧥","&erDot;":"≓","&erarr;":"⥱","&escr;":"ℯ","&esdot;":"≐","&esim;":"≂","&eta;":"η","&eth":"ð","&eth;":"ð","&euml":"ë","&euml;":"ë","&euro;":"€","&excl;":"!","&exist;":"∃","&expectation;":"ℰ","&exponentiale;":"ⅇ","&fallingdotseq;":"≒","&fcy;":"ф","&female;":"♀","&ffilig;":"ﬃ","&fflig;":"ﬀ","&ffllig;":"ﬄ","&ffr;":"𝔣","&filig;":"ﬁ","&fjlig;":"fj","&flat;":"♭","&fllig;":"ﬂ","&fltns;":"▱","&fnof;":"ƒ","&fopf;":"𝕗","&forall;":"∀","&fork;":"⋔","&forkv;":"⫙","&fpartint;":"⨍","&frac12":"½","&frac12;":"½","&frac13;":"⅓","&frac14":"¼","&frac14;":"¼","&frac15;":"⅕","&frac16;":"⅙","&frac18;":"⅛","&frac23;":"⅔","&frac25;":"⅖","&frac34":"¾","&frac34;":"¾","&frac35;":"⅗","&frac38;":"⅜","&frac45;":"⅘","&frac56;":"⅚","&frac58;":"⅝","&frac78;":"⅞","&frasl;":"⁄","&frown;":"⌢","&fscr;":"𝒻","&gE;":"≧","&gEl;":"⪌","&gacute;":"ǵ","&gamma;":"γ","&gammad;":"ϝ","&gap;":"⪆","&gbreve;":"ğ","&gcirc;":"ĝ","&gcy;":"г","&gdot;":"ġ","&ge;":"≥","&gel;":"⋛","&geq;":"≥","&geqq;":"≧","&geqslant;":"⩾","&ges;":"⩾","&gescc;":"⪩","&gesdot;":"⪀","&gesdoto;":"⪂","&gesdotol;":"⪄","&gesl;":"⋛︀","&gesles;":"⪔","&gfr;":"𝔤","&gg;":"≫","&ggg;":"⋙","&gimel;":"ℷ","&gjcy;":"ѓ","&gl;":"≷","&glE;":"⪒","&gla;":"⪥","&glj;":"⪤","&gnE;":"≩","&gnap;":"⪊","&gnapprox;":"⪊","&gne;":"⪈","&gneq;":"⪈","&gneqq;":"≩","&gnsim;":"⋧","&gopf;":"𝕘","&grave;":"`","&gscr;":"ℊ","&gsim;":"≳","&gsime;":"⪎","&gsiml;":"⪐","&gt":">","&gt;":">","&gtcc;":"⪧","&gtcir;":"⩺","&gtdot;":"⋗","&gtlPar;":"⦕","&gtquest;":"⩼","&gtrapprox;":"⪆","&gtrarr;":"⥸","&gtrdot;":"⋗","&gtreqless;":"⋛","&gtreqqless;":"⪌","&gtrless;":"≷","&gtrsim;":"≳","&gvertneqq;":"≩︀","&gvnE;":"≩︀","&hArr;":"⇔","&hairsp;":" ","&half;":"½","&hamilt;":"ℋ","&hardcy;":"ъ","&harr;":"↔","&harrcir;":"⥈","&harrw;":"↭","&hbar;":"ℏ","&hcirc;":"ĥ","&hearts;":"♥","&heartsuit;":"♥","&hellip;":"…","&hercon;":"⊹","&hfr;":"𝔥","&hksearow;":"⤥","&hkswarow;":"⤦","&hoarr;":"⇿","&homtht;":"∻","&hookleftarrow;":"↩","&hookrightarrow;":"↪","&hopf;":"𝕙","&horbar;":"―","&hscr;":"𝒽","&hslash;":"ℏ","&hstrok;":"ħ","&hybull;":"⁃","&hyphen;":"‐","&iacute":"í","&iacute;":"í","&ic;":"⁣","&icirc":"î","&icirc;":"î","&icy;":"и","&iecy;":"е","&iexcl":"¡","&iexcl;":"¡","&iff;":"⇔","&ifr;":"𝔦","&igrave":"ì","&igrave;":"ì","&ii;":"ⅈ","&iiiint;":"⨌","&iiint;":"∭","&iinfin;":"⧜","&iiota;":"℩","&ijlig;":"ĳ","&imacr;":"ī","&image;":"ℑ","&imagline;":"ℐ","&imagpart;":"ℑ","&imath;":"ı","&imof;":"⊷","&imped;":"Ƶ","&in;":"∈","&incare;":"℅","&infin;":"∞","&infintie;":"⧝","&inodot;":"ı","&int;":"∫","&intcal;":"⊺","&integers;":"ℤ","&intercal;":"⊺","&intlarhk;":"⨗","&intprod;":"⨼","&iocy;":"ё","&iogon;":"į","&iopf;":"𝕚","&iota;":"ι","&iprod;":"⨼","&iquest":"¿","&iquest;":"¿","&iscr;":"𝒾","&isin;":"∈","&isinE;":"⋹","&isindot;":"⋵","&isins;":"⋴","&isinsv;":"⋳","&isinv;":"∈","&it;":"⁢","&itilde;":"ĩ","&iukcy;":"і","&iuml":"ï","&iuml;":"ï","&jcirc;":"ĵ","&jcy;":"й","&jfr;":"𝔧","&jmath;":"ȷ","&jopf;":"𝕛","&jscr;":"𝒿","&jsercy;":"ј","&jukcy;":"є","&kappa;":"κ","&kappav;":"ϰ","&kcedil;":"ķ","&kcy;":"к","&kfr;":"𝔨","&kgreen;":"ĸ","&khcy;":"х","&kjcy;":"ќ","&kopf;":"𝕜","&kscr;":"𝓀","&lAarr;":"⇚","&lArr;":"⇐","&lAtail;":"⤛","&lBarr;":"⤎","&lE;":"≦","&lEg;":"⪋","&lHar;":"⥢","&lacute;":"ĺ","&laemptyv;":"⦴","&lagran;":"ℒ","&lambda;":"λ","&lang;":"⟨","&langd;":"⦑","&langle;":"⟨","&lap;":"⪅","&laquo":"«","&laquo;":"«","&larr;":"←","&larrb;":"⇤","&larrbfs;":"⤟","&larrfs;":"⤝","&larrhk;":"↩","&larrlp;":"↫","&larrpl;":"⤹","&larrsim;":"⥳","&larrtl;":"↢","&lat;":"⪫","&latail;":"⤙","&late;":"⪭","&lates;":"⪭︀","&lbarr;":"⤌","&lbbrk;":"❲","&lbrace;":"{","&lbrack;":"[","&lbrke;":"⦋","&lbrksld;":"⦏","&lbrkslu;":"⦍","&lcaron;":"ľ","&lcedil;":"ļ","&lceil;":"⌈","&lcub;":"{","&lcy;":"л","&ldca;":"⤶","&ldquo;":"“","&ldquor;":"„","&ldrdhar;":"⥧","&ldrushar;":"⥋","&ldsh;":"↲","&le;":"≤","&leftarrow;":"←","&leftarrowtail;":"↢","&leftharpoondown;":"↽","&leftharpoonup;":"↼","&leftleftarrows;":"⇇","&leftrightarrow;":"↔","&leftrightarrows;":"⇆","&leftrightharpoons;":"⇋","&leftrightsquigarrow;":"↭","&leftthreetimes;":"⋋","&leg;":"⋚","&leq;":"≤","&leqq;":"≦","&leqslant;":"⩽","&les;":"⩽","&lescc;":"⪨","&lesdot;":"⩿","&lesdoto;":"⪁","&lesdotor;":"⪃","&lesg;":"⋚︀","&lesges;":"⪓","&lessapprox;":"⪅","&lessdot;":"⋖","&lesseqgtr;":"⋚","&lesseqqgtr;":"⪋","&lessgtr;":"≶","&lesssim;":"≲","&lfisht;":"⥼","&lfloor;":"⌊","&lfr;":"𝔩","&lg;":"≶","&lgE;":"⪑","&lhard;":"↽","&lharu;":"↼","&lharul;":"⥪","&lhblk;":"▄","&ljcy;":"љ","&ll;":"≪","&llarr;":"⇇","&llcorner;":"⌞","&llhard;":"⥫","&lltri;":"◺","&lmidot;":"ŀ","&lmoust;":"⎰","&lmoustache;":"⎰","&lnE;":"≨","&lnap;":"⪉","&lnapprox;":"⪉","&lne;":"⪇","&lneq;":"⪇","&lneqq;":"≨","&lnsim;":"⋦","&loang;":"⟬","&loarr;":"⇽","&lobrk;":"⟦","&longleftarrow;":"⟵","&longleftrightarrow;":"⟷","&longmapsto;":"⟼","&longrightarrow;":"⟶","&looparrowleft;":"↫","&looparrowright;":"↬","&lopar;":"⦅","&lopf;":"𝕝","&loplus;":"⨭","&lotimes;":"⨴","&lowast;":"∗","&lowbar;":"_","&loz;":"◊","&lozenge;":"◊","&lozf;":"⧫","&lpar;":"(","&lparlt;":"⦓","&lrarr;":"⇆","&lrcorner;":"⌟","&lrhar;":"⇋","&lrhard;":"⥭","&lrm;":"‎","&lrtri;":"⊿","&lsaquo;":"‹","&lscr;":"𝓁","&lsh;":"↰","&lsim;":"≲","&lsime;":"⪍","&lsimg;":"⪏","&lsqb;":"[","&lsquo;":"‘","&lsquor;":"‚","&lstrok;":"ł","&lt":"<","&lt;":"<","&ltcc;":"⪦","&ltcir;":"⩹","&ltdot;":"⋖","&lthree;":"⋋","&ltimes;":"⋉","&ltlarr;":"⥶","&ltquest;":"⩻","&ltrPar;":"⦖","&ltri;":"◃","&ltrie;":"⊴","&ltrif;":"◂","&lurdshar;":"⥊","&luruhar;":"⥦","&lvertneqq;":"≨︀","&lvnE;":"≨︀","&mDDot;":"∺","&macr":"¯","&macr;":"¯","&male;":"♂","&malt;":"✠","&maltese;":"✠","&map;":"↦","&mapsto;":"↦","&mapstodown;":"↧","&mapstoleft;":"↤","&mapstoup;":"↥","&marker;":"▮","&mcomma;":"⨩","&mcy;":"м","&mdash;":"—","&measuredangle;":"∡","&mfr;":"𝔪","&mho;":"℧","&micro":"µ","&micro;":"µ","&mid;":"∣","&midast;":"*","&midcir;":"⫰","&middot":"·","&middot;":"·","&minus;":"−","&minusb;":"⊟","&minusd;":"∸","&minusdu;":"⨪","&mlcp;":"⫛","&mldr;":"…","&mnplus;":"∓","&models;":"⊧","&mopf;":"𝕞","&mp;":"∓","&mscr;":"𝓂","&mstpos;":"∾","&mu;":"μ","&multimap;":"⊸","&mumap;":"⊸","&nGg;":"⋙̸","&nGt;":"≫⃒","&nGtv;":"≫̸","&nLeftarrow;":"⇍","&nLeftrightarrow;":"⇎","&nLl;":"⋘̸","&nLt;":"≪⃒","&nLtv;":"≪̸","&nRightarrow;":"⇏","&nVDash;":"⊯","&nVdash;":"⊮","&nabla;":"∇","&nacute;":"ń","&nang;":"∠⃒","&nap;":"≉","&napE;":"⩰̸","&napid;":"≋̸","&napos;":"ŉ","&napprox;":"≉","&natur;":"♮","&natural;":"♮","&naturals;":"ℕ","&nbsp":" ","&nbsp;":" ","&nbump;":"≎̸","&nbumpe;":"≏̸","&ncap;":"⩃","&ncaron;":"ň","&ncedil;":"ņ","&ncong;":"≇","&ncongdot;":"⩭̸","&ncup;":"⩂","&ncy;":"н","&ndash;":"–","&ne;":"≠","&neArr;":"⇗","&nearhk;":"⤤","&nearr;":"↗","&nearrow;":"↗","&nedot;":"≐̸","&nequiv;":"≢","&nesear;":"⤨","&nesim;":"≂̸","&nexist;":"∄","&nexists;":"∄","&nfr;":"𝔫","&ngE;":"≧̸","&nge;":"≱","&ngeq;":"≱","&ngeqq;":"≧̸","&ngeqslant;":"⩾̸","&nges;":"⩾̸","&ngsim;":"≵","&ngt;":"≯","&ngtr;":"≯","&nhArr;":"⇎","&nharr;":"↮","&nhpar;":"⫲","&ni;":"∋","&nis;":"⋼","&nisd;":"⋺","&niv;":"∋","&njcy;":"њ","&nlArr;":"⇍","&nlE;":"≦̸","&nlarr;":"↚","&nldr;":"‥","&nle;":"≰","&nleftarrow;":"↚","&nleftrightarrow;":"↮","&nleq;":"≰","&nleqq;":"≦̸","&nleqslant;":"⩽̸","&nles;":"⩽̸","&nless;":"≮","&nlsim;":"≴","&nlt;":"≮","&nltri;":"⋪","&nltrie;":"⋬","&nmid;":"∤","&nopf;":"𝕟","&not":"¬","&not;":"¬","&notin;":"∉","&notinE;":"⋹̸","&notindot;":"⋵̸","&notinva;":"∉","&notinvb;":"⋷","&notinvc;":"⋶","&notni;":"∌","&notniva;":"∌","&notnivb;":"⋾","&notnivc;":"⋽","&npar;":"∦","&nparallel;":"∦","&nparsl;":"⫽⃥","&npart;":"∂̸","&npolint;":"⨔","&npr;":"⊀","&nprcue;":"⋠","&npre;":"⪯̸","&nprec;":"⊀","&npreceq;":"⪯̸","&nrArr;":"⇏","&nrarr;":"↛","&nrarrc;":"⤳̸","&nrarrw;":"↝̸","&nrightarrow;":"↛","&nrtri;":"⋫","&nrtrie;":"⋭","&nsc;":"⊁","&nsccue;":"⋡","&nsce;":"⪰̸","&nscr;":"𝓃","&nshortmid;":"∤","&nshortparallel;":"∦","&nsim;":"≁","&nsime;":"≄","&nsimeq;":"≄","&nsmid;":"∤","&nspar;":"∦","&nsqsube;":"⋢","&nsqsupe;":"⋣","&nsub;":"⊄","&nsubE;":"⫅̸","&nsube;":"⊈","&nsubset;":"⊂⃒","&nsubseteq;":"⊈","&nsubseteqq;":"⫅̸","&nsucc;":"⊁","&nsucceq;":"⪰̸","&nsup;":"⊅","&nsupE;":"⫆̸","&nsupe;":"⊉","&nsupset;":"⊃⃒","&nsupseteq;":"⊉","&nsupseteqq;":"⫆̸","&ntgl;":"≹","&ntilde":"ñ","&ntilde;":"ñ","&ntlg;":"≸","&ntriangleleft;":"⋪","&ntrianglelefteq;":"⋬","&ntriangleright;":"⋫","&ntrianglerighteq;":"⋭","&nu;":"ν","&num;":"#","&numero;":"№","&numsp;":" ","&nvDash;":"⊭","&nvHarr;":"⤄","&nvap;":"≍⃒","&nvdash;":"⊬","&nvge;":"≥⃒","&nvgt;":">⃒","&nvinfin;":"⧞","&nvlArr;":"⤂","&nvle;":"≤⃒","&nvlt;":"<⃒","&nvltrie;":"⊴⃒","&nvrArr;":"⤃","&nvrtrie;":"⊵⃒","&nvsim;":"∼⃒","&nwArr;":"⇖","&nwarhk;":"⤣","&nwarr;":"↖","&nwarrow;":"↖","&nwnear;":"⤧","&oS;":"Ⓢ","&oacute":"ó","&oacute;":"ó","&oast;":"⊛","&ocir;":"⊚","&ocirc":"ô","&ocirc;":"ô","&ocy;":"о","&odash;":"⊝","&odblac;":"ő","&odiv;":"⨸","&odot;":"⊙","&odsold;":"⦼","&oelig;":"œ","&ofcir;":"⦿","&ofr;":"𝔬","&ogon;":"˛","&ograve":"ò","&ograve;":"ò","&ogt;":"⧁","&ohbar;":"⦵","&ohm;":"Ω","&oint;":"∮","&olarr;":"↺","&olcir;":"⦾","&olcross;":"⦻","&oline;":"‾","&olt;":"⧀","&omacr;":"ō","&omega;":"ω","&omicron;":"ο","&omid;":"⦶","&ominus;":"⊖","&oopf;":"𝕠","&opar;":"⦷","&operp;":"⦹","&oplus;":"⊕","&or;":"∨","&orarr;":"↻","&ord;":"⩝","&order;":"ℴ","&orderof;":"ℴ","&ordf":"ª","&ordf;":"ª","&ordm":"º","&ordm;":"º","&origof;":"⊶","&oror;":"⩖","&orslope;":"⩗","&orv;":"⩛","&oscr;":"ℴ","&oslash":"ø","&oslash;":"ø","&osol;":"⊘","&otilde":"õ","&otilde;":"õ","&otimes;":"⊗","&otimesas;":"⨶","&ouml":"ö","&ouml;":"ö","&ovbar;":"⌽","&par;":"∥","&para":"¶","&para;":"¶","&parallel;":"∥","&parsim;":"⫳","&parsl;":"⫽","&part;":"∂","&pcy;":"п","&percnt;":"%","&period;":".","&permil;":"‰","&perp;":"⊥","&pertenk;":"‱","&pfr;":"𝔭","&phi;":"φ","&phiv;":"ϕ","&phmmat;":"ℳ","&phone;":"☎","&pi;":"π","&pitchfork;":"⋔","&piv;":"ϖ","&planck;":"ℏ","&planckh;":"ℎ","&plankv;":"ℏ","&plus;":"+","&plusacir;":"⨣","&plusb;":"⊞","&pluscir;":"⨢","&plusdo;":"∔","&plusdu;":"⨥","&pluse;":"⩲","&plusmn":"±","&plusmn;":"±","&plussim;":"⨦","&plustwo;":"⨧","&pm;":"±","&pointint;":"⨕","&popf;":"𝕡","&pound":"£","&pound;":"£","&pr;":"≺","&prE;":"⪳","&prap;":"⪷","&prcue;":"≼","&pre;":"⪯","&prec;":"≺","&precapprox;":"⪷","&preccurlyeq;":"≼","&preceq;":"⪯","&precnapprox;":"⪹","&precneqq;":"⪵","&precnsim;":"⋨","&precsim;":"≾","&prime;":"′","&primes;":"ℙ","&prnE;":"⪵","&prnap;":"⪹","&prnsim;":"⋨","&prod;":"∏","&profalar;":"⌮","&profline;":"⌒","&profsurf;":"⌓","&prop;":"∝","&propto;":"∝","&prsim;":"≾","&prurel;":"⊰","&pscr;":"𝓅","&psi;":"ψ","&puncsp;":" ","&qfr;":"𝔮","&qint;":"⨌","&qopf;":"𝕢","&qprime;":"⁗","&qscr;":"𝓆","&quaternions;":"ℍ","&quatint;":"⨖","&quest;":"?","&questeq;":"≟","&quot":'"',"&quot;":'"',"&rAarr;":"⇛","&rArr;":"⇒","&rAtail;":"⤜","&rBarr;":"⤏","&rHar;":"⥤","&race;":"∽̱","&racute;":"ŕ","&radic;":"√","&raemptyv;":"⦳","&rang;":"⟩","&rangd;":"⦒","&range;":"⦥","&rangle;":"⟩","&raquo":"»","&raquo;":"»","&rarr;":"→","&rarrap;":"⥵","&rarrb;":"⇥","&rarrbfs;":"⤠","&rarrc;":"⤳","&rarrfs;":"⤞","&rarrhk;":"↪","&rarrlp;":"↬","&rarrpl;":"⥅","&rarrsim;":"⥴","&rarrtl;":"↣","&rarrw;":"↝","&ratail;":"⤚","&ratio;":"∶","&rationals;":"ℚ","&rbarr;":"⤍","&rbbrk;":"❳","&rbrace;":"}","&rbrack;":"]","&rbrke;":"⦌","&rbrksld;":"⦎","&rbrkslu;":"⦐","&rcaron;":"ř","&rcedil;":"ŗ","&rceil;":"⌉","&rcub;":"}","&rcy;":"р","&rdca;":"⤷","&rdldhar;":"⥩","&rdquo;":"”","&rdquor;":"”","&rdsh;":"↳","&real;":"ℜ","&realine;":"ℛ","&realpart;":"ℜ","&reals;":"ℝ","&rect;":"▭","&reg":"®","&reg;":"®","&rfisht;":"⥽","&rfloor;":"⌋","&rfr;":"𝔯","&rhard;":"⇁","&rharu;":"⇀","&rharul;":"⥬","&rho;":"ρ","&rhov;":"ϱ","&rightarrow;":"→","&rightarrowtail;":"↣","&rightharpoondown;":"⇁","&rightharpoonup;":"⇀","&rightleftarrows;":"⇄","&rightleftharpoons;":"⇌","&rightrightarrows;":"⇉","&rightsquigarrow;":"↝","&rightthreetimes;":"⋌","&ring;":"˚","&risingdotseq;":"≓","&rlarr;":"⇄","&rlhar;":"⇌","&rlm;":"‏","&rmoust;":"⎱","&rmoustache;":"⎱","&rnmid;":"⫮","&roang;":"⟭","&roarr;":"⇾","&robrk;":"⟧","&ropar;":"⦆","&ropf;":"𝕣","&roplus;":"⨮","&rotimes;":"⨵","&rpar;":")","&rpargt;":"⦔","&rppolint;":"⨒","&rrarr;":"⇉","&rsaquo;":"›","&rscr;":"𝓇","&rsh;":"↱","&rsqb;":"]","&rsquo;":"’","&rsquor;":"’","&rthree;":"⋌","&rtimes;":"⋊","&rtri;":"▹","&rtrie;":"⊵","&rtrif;":"▸","&rtriltri;":"⧎","&ruluhar;":"⥨","&rx;":"℞","&sacute;":"ś","&sbquo;":"‚","&sc;":"≻","&scE;":"⪴","&scap;":"⪸","&scaron;":"š","&sccue;":"≽","&sce;":"⪰","&scedil;":"ş","&scirc;":"ŝ","&scnE;":"⪶","&scnap;":"⪺","&scnsim;":"⋩","&scpolint;":"⨓","&scsim;":"≿","&scy;":"с","&sdot;":"⋅","&sdotb;":"⊡","&sdote;":"⩦","&seArr;":"⇘","&searhk;":"⤥","&searr;":"↘","&searrow;":"↘","&sect":"§","&sect;":"§","&semi;":";","&seswar;":"⤩","&setminus;":"∖","&setmn;":"∖","&sext;":"✶","&sfr;":"𝔰","&sfrown;":"⌢","&sharp;":"♯","&shchcy;":"щ","&shcy;":"ш","&shortmid;":"∣","&shortparallel;":"∥","&shy":"­","&shy;":"­","&sigma;":"σ","&sigmaf;":"ς","&sigmav;":"ς","&sim;":"∼","&simdot;":"⩪","&sime;":"≃","&simeq;":"≃","&simg;":"⪞","&simgE;":"⪠","&siml;":"⪝","&simlE;":"⪟","&simne;":"≆","&simplus;":"⨤","&simrarr;":"⥲","&slarr;":"←","&smallsetminus;":"∖","&smashp;":"⨳","&smeparsl;":"⧤","&smid;":"∣","&smile;":"⌣","&smt;":"⪪","&smte;":"⪬","&smtes;":"⪬︀","&softcy;":"ь","&sol;":"/","&solb;":"⧄","&solbar;":"⌿","&sopf;":"𝕤","&spades;":"♠","&spadesuit;":"♠","&spar;":"∥","&sqcap;":"⊓","&sqcaps;":"⊓︀","&sqcup;":"⊔","&sqcups;":"⊔︀","&sqsub;":"⊏","&sqsube;":"⊑","&sqsubset;":"⊏","&sqsubseteq;":"⊑","&sqsup;":"⊐","&sqsupe;":"⊒","&sqsupset;":"⊐","&sqsupseteq;":"⊒","&squ;":"□","&square;":"□","&squarf;":"▪","&squf;":"▪","&srarr;":"→","&sscr;":"𝓈","&ssetmn;":"∖","&ssmile;":"⌣","&sstarf;":"⋆","&star;":"☆","&starf;":"★","&straightepsilon;":"ϵ","&straightphi;":"ϕ","&strns;":"¯","&sub;":"⊂","&subE;":"⫅","&subdot;":"⪽","&sube;":"⊆","&subedot;":"⫃","&submult;":"⫁","&subnE;":"⫋","&subne;":"⊊","&subplus;":"⪿","&subrarr;":"⥹","&subset;":"⊂","&subseteq;":"⊆","&subseteqq;":"⫅","&subsetneq;":"⊊","&subsetneqq;":"⫋","&subsim;":"⫇","&subsub;":"⫕","&subsup;":"⫓","&succ;":"≻","&succapprox;":"⪸","&succcurlyeq;":"≽","&succeq;":"⪰","&succnapprox;":"⪺","&succneqq;":"⪶","&succnsim;":"⋩","&succsim;":"≿","&sum;":"∑","&sung;":"♪","&sup1":"¹","&sup1;":"¹","&sup2":"²","&sup2;":"²","&sup3":"³","&sup3;":"³","&sup;":"⊃","&supE;":"⫆","&supdot;":"⪾","&supdsub;":"⫘","&supe;":"⊇","&supedot;":"⫄","&suphsol;":"⟉","&suphsub;":"⫗","&suplarr;":"⥻","&supmult;":"⫂","&supnE;":"⫌","&supne;":"⊋","&supplus;":"⫀","&supset;":"⊃","&supseteq;":"⊇","&supseteqq;":"⫆","&supsetneq;":"⊋","&supsetneqq;":"⫌","&supsim;":"⫈","&supsub;":"⫔","&supsup;":"⫖","&swArr;":"⇙","&swarhk;":"⤦","&swarr;":"↙","&swarrow;":"↙","&swnwar;":"⤪","&szlig":"ß","&szlig;":"ß","&target;":"⌖","&tau;":"τ","&tbrk;":"⎴","&tcaron;":"ť","&tcedil;":"ţ","&tcy;":"т","&tdot;":"⃛","&telrec;":"⌕","&tfr;":"𝔱","&there4;":"∴","&therefore;":"∴","&theta;":"θ","&thetasym;":"ϑ","&thetav;":"ϑ","&thickapprox;":"≈","&thicksim;":"∼","&thinsp;":" ","&thkap;":"≈","&thksim;":"∼","&thorn":"þ","&thorn;":"þ","&tilde;":"˜","&times":"×","&times;":"×","&timesb;":"⊠","&timesbar;":"⨱","&timesd;":"⨰","&tint;":"∭","&toea;":"⤨","&top;":"⊤","&topbot;":"⌶","&topcir;":"⫱","&topf;":"𝕥","&topfork;":"⫚","&tosa;":"⤩","&tprime;":"‴","&trade;":"™","&triangle;":"▵","&triangledown;":"▿","&triangleleft;":"◃","&trianglelefteq;":"⊴","&triangleq;":"≜","&triangleright;":"▹","&trianglerighteq;":"⊵","&tridot;":"◬","&trie;":"≜","&triminus;":"⨺","&triplus;":"⨹","&trisb;":"⧍","&tritime;":"⨻","&trpezium;":"⏢","&tscr;":"𝓉","&tscy;":"ц","&tshcy;":"ћ","&tstrok;":"ŧ","&twixt;":"≬","&twoheadleftarrow;":"↞","&twoheadrightarrow;":"↠","&uArr;":"⇑","&uHar;":"⥣","&uacute":"ú","&uacute;":"ú","&uarr;":"↑","&ubrcy;":"ў","&ubreve;":"ŭ","&ucirc":"û","&ucirc;":"û","&ucy;":"у","&udarr;":"⇅","&udblac;":"ű","&udhar;":"⥮","&ufisht;":"⥾","&ufr;":"𝔲","&ugrave":"ù","&ugrave;":"ù","&uharl;":"↿","&uharr;":"↾","&uhblk;":"▀","&ulcorn;":"⌜","&ulcorner;":"⌜","&ulcrop;":"⌏","&ultri;":"◸","&umacr;":"ū","&uml":"¨","&uml;":"¨","&uogon;":"ų","&uopf;":"𝕦","&uparrow;":"↑","&updownarrow;":"↕","&upharpoonleft;":"↿","&upharpoonright;":"↾","&uplus;":"⊎","&upsi;":"υ","&upsih;":"ϒ","&upsilon;":"υ","&upuparrows;":"⇈","&urcorn;":"⌝","&urcorner;":"⌝","&urcrop;":"⌎","&uring;":"ů","&urtri;":"◹","&uscr;":"𝓊","&utdot;":"⋰","&utilde;":"ũ","&utri;":"▵","&utrif;":"▴","&uuarr;":"⇈","&uuml":"ü","&uuml;":"ü","&uwangle;":"⦧","&vArr;":"⇕","&vBar;":"⫨","&vBarv;":"⫩","&vDash;":"⊨","&vangrt;":"⦜","&varepsilon;":"ϵ","&varkappa;":"ϰ","&varnothing;":"∅","&varphi;":"ϕ","&varpi;":"ϖ","&varpropto;":"∝","&varr;":"↕","&varrho;":"ϱ","&varsigma;":"ς","&varsubsetneq;":"⊊︀","&varsubsetneqq;":"⫋︀","&varsupsetneq;":"⊋︀","&varsupsetneqq;":"⫌︀","&vartheta;":"ϑ","&vartriangleleft;":"⊲","&vartriangleright;":"⊳","&vcy;":"в","&vdash;":"⊢","&vee;":"∨","&veebar;":"⊻","&veeeq;":"≚","&vellip;":"⋮","&verbar;":"|","&vert;":"|","&vfr;":"𝔳","&vltri;":"⊲","&vnsub;":"⊂⃒","&vnsup;":"⊃⃒","&vopf;":"𝕧","&vprop;":"∝","&vrtri;":"⊳","&vscr;":"𝓋","&vsubnE;":"⫋︀","&vsubne;":"⊊︀","&vsupnE;":"⫌︀","&vsupne;":"⊋︀","&vzigzag;":"⦚","&wcirc;":"ŵ","&wedbar;":"⩟","&wedge;":"∧","&wedgeq;":"≙","&weierp;":"℘","&wfr;":"𝔴","&wopf;":"𝕨","&wp;":"℘","&wr;":"≀","&wreath;":"≀","&wscr;":"𝓌","&xcap;":"⋂","&xcirc;":"◯","&xcup;":"⋃","&xdtri;":"▽","&xfr;":"𝔵","&xhArr;":"⟺","&xharr;":"⟷","&xi;":"ξ","&xlArr;":"⟸","&xlarr;":"⟵","&xmap;":"⟼","&xnis;":"⋻","&xodot;":"⨀","&xopf;":"𝕩","&xoplus;":"⨁","&xotime;":"⨂","&xrArr;":"⟹","&xrarr;":"⟶","&xscr;":"𝓍","&xsqcup;":"⨆","&xuplus;":"⨄","&xutri;":"△","&xvee;":"⋁","&xwedge;":"⋀","&yacute":"ý","&yacute;":"ý","&yacy;":"я","&ycirc;":"ŷ","&ycy;":"ы","&yen":"¥","&yen;":"¥","&yfr;":"𝔶","&yicy;":"ї","&yopf;":"𝕪","&yscr;":"𝓎","&yucy;":"ю","&yuml":"ÿ","&yuml;":"ÿ","&zacute;":"ź","&zcaron;":"ž","&zcy;":"з","&zdot;":"ż","&zeetrf;":"ℨ","&zeta;":"ζ","&zfr;":"𝔷","&zhcy;":"ж","&zigrarr;":"⇝","&zopf;":"𝕫","&zscr;":"𝓏","&zwj;":"‍","&zwnj;":"‌"},characters:{"Æ":"&AElig;","&":"&amp;","Á":"&Aacute;","Ă":"&Abreve;","Â":"&Acirc;","А":"&Acy;","𝔄":"&Afr;","À":"&Agrave;","Α":"&Alpha;","Ā":"&Amacr;","⩓":"&And;","Ą":"&Aogon;","𝔸":"&Aopf;","⁡":"&af;","Å":"&angst;","𝒜":"&Ascr;","≔":"&coloneq;","Ã":"&Atilde;","Ä":"&Auml;","∖":"&ssetmn;","⫧":"&Barv;","⌆":"&doublebarwedge;","Б":"&Bcy;","∵":"&because;","ℬ":"&bernou;","Β":"&Beta;","𝔅":"&Bfr;","𝔹":"&Bopf;","˘":"&breve;","≎":"&bump;","Ч":"&CHcy;","©":"&copy;","Ć":"&Cacute;","⋒":"&Cap;","ⅅ":"&DD;","ℭ":"&Cfr;","Č":"&Ccaron;","Ç":"&Ccedil;","Ĉ":"&Ccirc;","∰":"&Cconint;","Ċ":"&Cdot;","¸":"&cedil;","·":"&middot;","Χ":"&Chi;","⊙":"&odot;","⊖":"&ominus;","⊕":"&oplus;","⊗":"&otimes;","∲":"&cwconint;","”":"&rdquor;","’":"&rsquor;","∷":"&Proportion;","⩴":"&Colone;","≡":"&equiv;","∯":"&DoubleContourIntegral;","∮":"&oint;","ℂ":"&complexes;","∐":"&coprod;","∳":"&awconint;","⨯":"&Cross;","𝒞":"&Cscr;","⋓":"&Cup;","≍":"&asympeq;","⤑":"&DDotrahd;","Ђ":"&DJcy;","Ѕ":"&DScy;","Џ":"&DZcy;","‡":"&ddagger;","↡":"&Darr;","⫤":"&DoubleLeftTee;","Ď":"&Dcaron;","Д":"&Dcy;","∇":"&nabla;","Δ":"&Delta;","𝔇":"&Dfr;","´":"&acute;","˙":"&dot;","˝":"&dblac;","`":"&grave;","˜":"&tilde;","⋄":"&diamond;","ⅆ":"&dd;","𝔻":"&Dopf;","¨":"&uml;","⃜":"&DotDot;","≐":"&esdot;","⇓":"&dArr;","⇐":"&lArr;","⇔":"&iff;","⟸":"&xlArr;","⟺":"&xhArr;","⟹":"&xrArr;","⇒":"&rArr;","⊨":"&vDash;","⇑":"&uArr;","⇕":"&vArr;","∥":"&spar;","↓":"&downarrow;","⤓":"&DownArrowBar;","⇵":"&duarr;","̑":"&DownBreve;","⥐":"&DownLeftRightVector;","⥞":"&DownLeftTeeVector;","↽":"&lhard;","⥖":"&DownLeftVectorBar;","⥟":"&DownRightTeeVector;","⇁":"&rightharpoondown;","⥗":"&DownRightVectorBar;","⊤":"&top;","↧":"&mapstodown;","𝒟":"&Dscr;","Đ":"&Dstrok;","Ŋ":"&ENG;","Ð":"&ETH;","É":"&Eacute;","Ě":"&Ecaron;","Ê":"&Ecirc;","Э":"&Ecy;","Ė":"&Edot;","𝔈":"&Efr;","È":"&Egrave;","∈":"&isinv;","Ē":"&Emacr;","◻":"&EmptySmallSquare;","▫":"&EmptyVerySmallSquare;","Ę":"&Eogon;","𝔼":"&Eopf;","Ε":"&Epsilon;","⩵":"&Equal;","≂":"&esim;","⇌":"&rlhar;","ℰ":"&expectation;","⩳":"&Esim;","Η":"&Eta;","Ë":"&Euml;","∃":"&exist;","ⅇ":"&exponentiale;","Ф":"&Fcy;","𝔉":"&Ffr;","◼":"&FilledSmallSquare;","▪":"&squf;","𝔽":"&Fopf;","∀":"&forall;","ℱ":"&Fscr;","Ѓ":"&GJcy;",">":"&gt;","Γ":"&Gamma;","Ϝ":"&Gammad;","Ğ":"&Gbreve;","Ģ":"&Gcedil;","Ĝ":"&Gcirc;","Г":"&Gcy;","Ġ":"&Gdot;","𝔊":"&Gfr;","⋙":"&ggg;","𝔾":"&Gopf;","≥":"&geq;","⋛":"&gtreqless;","≧":"&geqq;","⪢":"&GreaterGreater;","≷":"&gtrless;","⩾":"&ges;","≳":"&gtrsim;","𝒢":"&Gscr;","≫":"&gg;","Ъ":"&HARDcy;","ˇ":"&caron;","^":"&Hat;","Ĥ":"&Hcirc;","ℌ":"&Poincareplane;","ℋ":"&hamilt;","ℍ":"&quaternions;","─":"&boxh;","Ħ":"&Hstrok;","≏":"&bumpeq;","Е":"&IEcy;","Ĳ":"&IJlig;","Ё":"&IOcy;","Í":"&Iacute;","Î":"&Icirc;","И":"&Icy;","İ":"&Idot;","ℑ":"&imagpart;","Ì":"&Igrave;","Ī":"&Imacr;","ⅈ":"&ii;","∬":"&Int;","∫":"&int;","⋂":"&xcap;","⁣":"&ic;","⁢":"&it;","Į":"&Iogon;","𝕀":"&Iopf;","Ι":"&Iota;","ℐ":"&imagline;","Ĩ":"&Itilde;","І":"&Iukcy;","Ï":"&Iuml;","Ĵ":"&Jcirc;","Й":"&Jcy;","𝔍":"&Jfr;","𝕁":"&Jopf;","𝒥":"&Jscr;","Ј":"&Jsercy;","Є":"&Jukcy;","Х":"&KHcy;","Ќ":"&KJcy;","Κ":"&Kappa;","Ķ":"&Kcedil;","К":"&Kcy;","𝔎":"&Kfr;","𝕂":"&Kopf;","𝒦":"&Kscr;","Љ":"&LJcy;","<":"&lt;","Ĺ":"&Lacute;","Λ":"&Lambda;","⟪":"&Lang;","ℒ":"&lagran;","↞":"&twoheadleftarrow;","Ľ":"&Lcaron;","Ļ":"&Lcedil;","Л":"&Lcy;","⟨":"&langle;","←":"&slarr;","⇤":"&larrb;","⇆":"&lrarr;","⌈":"&lceil;","⟦":"&lobrk;","⥡":"&LeftDownTeeVector;","⇃":"&downharpoonleft;","⥙":"&LeftDownVectorBar;","⌊":"&lfloor;","↔":"&leftrightarrow;","⥎":"&LeftRightVector;","⊣":"&dashv;","↤":"&mapstoleft;","⥚":"&LeftTeeVector;","⊲":"&vltri;","⧏":"&LeftTriangleBar;","⊴":"&trianglelefteq;","⥑":"&LeftUpDownVector;","⥠":"&LeftUpTeeVector;","↿":"&upharpoonleft;","⥘":"&LeftUpVectorBar;","↼":"&lharu;","⥒":"&LeftVectorBar;","⋚":"&lesseqgtr;","≦":"&leqq;","≶":"&lg;","⪡":"&LessLess;","⩽":"&les;","≲":"&lsim;","𝔏":"&Lfr;","⋘":"&Ll;","⇚":"&lAarr;","Ŀ":"&Lmidot;","⟵":"&xlarr;","⟷":"&xharr;","⟶":"&xrarr;","𝕃":"&Lopf;","↙":"&swarrow;","↘":"&searrow;","↰":"&lsh;","Ł":"&Lstrok;","≪":"&ll;","⤅":"&Map;","М":"&Mcy;"," ":"&MediumSpace;","ℳ":"&phmmat;","𝔐":"&Mfr;","∓":"&mp;","𝕄":"&Mopf;","Μ":"&Mu;","Њ":"&NJcy;","Ń":"&Nacute;","Ň":"&Ncaron;","Ņ":"&Ncedil;","Н":"&Ncy;","​":"&ZeroWidthSpace;","\n":"&NewLine;","𝔑":"&Nfr;","⁠":"&NoBreak;"," ":"&nbsp;","ℕ":"&naturals;","⫬":"&Not;","≢":"&nequiv;","≭":"&NotCupCap;","∦":"&nspar;","∉":"&notinva;","≠":"&ne;","≂̸":"&nesim;","∄":"&nexists;","≯":"&ngtr;","≱":"&ngeq;","≧̸":"&ngeqq;","≫̸":"&nGtv;","≹":"&ntgl;","⩾̸":"&nges;","≵":"&ngsim;","≎̸":"&nbump;","≏̸":"&nbumpe;","⋪":"&ntriangleleft;","⧏̸":"&NotLeftTriangleBar;","⋬":"&ntrianglelefteq;","≮":"&nlt;","≰":"&nleq;","≸":"&ntlg;","≪̸":"&nLtv;","⩽̸":"&nles;","≴":"&nlsim;","⪢̸":"&NotNestedGreaterGreater;","⪡̸":"&NotNestedLessLess;","⊀":"&nprec;","⪯̸":"&npreceq;","⋠":"&nprcue;","∌":"&notniva;","⋫":"&ntriangleright;","⧐̸":"&NotRightTriangleBar;","⋭":"&ntrianglerighteq;","⊏̸":"&NotSquareSubset;","⋢":"&nsqsube;","⊐̸":"&NotSquareSuperset;","⋣":"&nsqsupe;","⊂⃒":"&vnsub;","⊈":"&nsubseteq;","⊁":"&nsucc;","⪰̸":"&nsucceq;","⋡":"&nsccue;","≿̸":"&NotSucceedsTilde;","⊃⃒":"&vnsup;","⊉":"&nsupseteq;","≁":"&nsim;","≄":"&nsimeq;","≇":"&ncong;","≉":"&napprox;","∤":"&nsmid;","𝒩":"&Nscr;","Ñ":"&Ntilde;","Ν":"&Nu;","Œ":"&OElig;","Ó":"&Oacute;","Ô":"&Ocirc;","О":"&Ocy;","Ő":"&Odblac;","𝔒":"&Ofr;","Ò":"&Ograve;","Ō":"&Omacr;","Ω":"&ohm;","Ο":"&Omicron;","𝕆":"&Oopf;","“":"&ldquo;","‘":"&lsquo;","⩔":"&Or;","𝒪":"&Oscr;","Ø":"&Oslash;","Õ":"&Otilde;","⨷":"&Otimes;","Ö":"&Ouml;","‾":"&oline;","⏞":"&OverBrace;","⎴":"&tbrk;","⏜":"&OverParenthesis;","∂":"&part;","П":"&Pcy;","𝔓":"&Pfr;","Φ":"&Phi;","Π":"&Pi;","±":"&pm;","ℙ":"&primes;","⪻":"&Pr;","≺":"&prec;","⪯":"&preceq;","≼":"&preccurlyeq;","≾":"&prsim;","″":"&Prime;","∏":"&prod;","∝":"&vprop;","𝒫":"&Pscr;","Ψ":"&Psi;",'"':"&quot;","𝔔":"&Qfr;","ℚ":"&rationals;","𝒬":"&Qscr;","⤐":"&drbkarow;","®":"&reg;","Ŕ":"&Racute;","⟫":"&Rang;","↠":"&twoheadrightarrow;","⤖":"&Rarrtl;","Ř":"&Rcaron;","Ŗ":"&Rcedil;","Р":"&Rcy;","ℜ":"&realpart;","∋":"&niv;","⇋":"&lrhar;","⥯":"&duhar;","Ρ":"&Rho;","⟩":"&rangle;","→":"&srarr;","⇥":"&rarrb;","⇄":"&rlarr;","⌉":"&rceil;","⟧":"&robrk;","⥝":"&RightDownTeeVector;","⇂":"&downharpoonright;","⥕":"&RightDownVectorBar;","⌋":"&rfloor;","⊢":"&vdash;","↦":"&mapsto;","⥛":"&RightTeeVector;","⊳":"&vrtri;","⧐":"&RightTriangleBar;","⊵":"&trianglerighteq;","⥏":"&RightUpDownVector;","⥜":"&RightUpTeeVector;","↾":"&upharpoonright;","⥔":"&RightUpVectorBar;","⇀":"&rightharpoonup;","⥓":"&RightVectorBar;","ℝ":"&reals;","⥰":"&RoundImplies;","⇛":"&rAarr;","ℛ":"&realine;","↱":"&rsh;","⧴":"&RuleDelayed;","Щ":"&SHCHcy;","Ш":"&SHcy;","Ь":"&SOFTcy;","Ś":"&Sacute;","⪼":"&Sc;","Š":"&Scaron;","Ş":"&Scedil;","Ŝ":"&Scirc;","С":"&Scy;","𝔖":"&Sfr;","↑":"&uparrow;","Σ":"&Sigma;","∘":"&compfn;","𝕊":"&Sopf;","√":"&radic;","□":"&square;","⊓":"&sqcap;","⊏":"&sqsubset;","⊑":"&sqsubseteq;","⊐":"&sqsupset;","⊒":"&sqsupseteq;","⊔":"&sqcup;","𝒮":"&Sscr;","⋆":"&sstarf;","⋐":"&Subset;","⊆":"&subseteq;","≻":"&succ;","⪰":"&succeq;","≽":"&succcurlyeq;","≿":"&succsim;","∑":"&sum;","⋑":"&Supset;","⊃":"&supset;","⊇":"&supseteq;","Þ":"&THORN;","™":"&trade;","Ћ":"&TSHcy;","Ц":"&TScy;","\t":"&Tab;","Τ":"&Tau;","Ť":"&Tcaron;","Ţ":"&Tcedil;","Т":"&Tcy;","𝔗":"&Tfr;","∴":"&therefore;","Θ":"&Theta;","  ":"&ThickSpace;"," ":"&thinsp;","∼":"&thksim;","≃":"&simeq;","≅":"&cong;","≈":"&thkap;","𝕋":"&Topf;","⃛":"&tdot;","𝒯":"&Tscr;","Ŧ":"&Tstrok;","Ú":"&Uacute;","↟":"&Uarr;","⥉":"&Uarrocir;","Ў":"&Ubrcy;","Ŭ":"&Ubreve;","Û":"&Ucirc;","У":"&Ucy;","Ű":"&Udblac;","𝔘":"&Ufr;","Ù":"&Ugrave;","Ū":"&Umacr;",_:"&lowbar;","⏟":"&UnderBrace;","⎵":"&bbrk;","⏝":"&UnderParenthesis;","⋃":"&xcup;","⊎":"&uplus;","Ų":"&Uogon;","𝕌":"&Uopf;","⤒":"&UpArrowBar;","⇅":"&udarr;","↕":"&varr;","⥮":"&udhar;","⊥":"&perp;","↥":"&mapstoup;","↖":"&nwarrow;","↗":"&nearrow;","ϒ":"&upsih;","Υ":"&Upsilon;","Ů":"&Uring;","𝒰":"&Uscr;","Ũ":"&Utilde;","Ü":"&Uuml;","⊫":"&VDash;","⫫":"&Vbar;","В":"&Vcy;","⊩":"&Vdash;","⫦":"&Vdashl;","⋁":"&xvee;","‖":"&Vert;","∣":"&smid;","|":"&vert;","❘":"&VerticalSeparator;","≀":"&wreath;"," ":"&hairsp;","𝔙":"&Vfr;","𝕍":"&Vopf;","𝒱":"&Vscr;","⊪":"&Vvdash;","Ŵ":"&Wcirc;","⋀":"&xwedge;","𝔚":"&Wfr;","𝕎":"&Wopf;","𝒲":"&Wscr;","𝔛":"&Xfr;","Ξ":"&Xi;","𝕏":"&Xopf;","𝒳":"&Xscr;","Я":"&YAcy;","Ї":"&YIcy;","Ю":"&YUcy;","Ý":"&Yacute;","Ŷ":"&Ycirc;","Ы":"&Ycy;","𝔜":"&Yfr;","𝕐":"&Yopf;","𝒴":"&Yscr;","Ÿ":"&Yuml;","Ж":"&ZHcy;","Ź":"&Zacute;","Ž":"&Zcaron;","З":"&Zcy;","Ż":"&Zdot;","Ζ":"&Zeta;","ℨ":"&zeetrf;","ℤ":"&integers;","𝒵":"&Zscr;","á":"&aacute;","ă":"&abreve;","∾":"&mstpos;","∾̳":"&acE;","∿":"&acd;","â":"&acirc;","а":"&acy;","æ":"&aelig;","𝔞":"&afr;","à":"&agrave;","ℵ":"&aleph;","α":"&alpha;","ā":"&amacr;","⨿":"&amalg;","∧":"&wedge;","⩕":"&andand;","⩜":"&andd;","⩘":"&andslope;","⩚":"&andv;","∠":"&angle;","⦤":"&ange;","∡":"&measuredangle;","⦨":"&angmsdaa;","⦩":"&angmsdab;","⦪":"&angmsdac;","⦫":"&angmsdad;","⦬":"&angmsdae;","⦭":"&angmsdaf;","⦮":"&angmsdag;","⦯":"&angmsdah;","∟":"&angrt;","⊾":"&angrtvb;","⦝":"&angrtvbd;","∢":"&angsph;","⍼":"&angzarr;","ą":"&aogon;","𝕒":"&aopf;","⩰":"&apE;","⩯":"&apacir;","≊":"&approxeq;","≋":"&apid;","'":"&apos;","å":"&aring;","𝒶":"&ascr;","*":"&midast;","ã":"&atilde;","ä":"&auml;","⨑":"&awint;","⫭":"&bNot;","≌":"&bcong;","϶":"&bepsi;","‵":"&bprime;","∽":"&bsim;","⋍":"&bsime;","⊽":"&barvee;","⌅":"&barwedge;","⎶":"&bbrktbrk;","б":"&bcy;","„":"&ldquor;","⦰":"&bemptyv;","β":"&beta;","ℶ":"&beth;","≬":"&twixt;","𝔟":"&bfr;","◯":"&xcirc;","⨀":"&xodot;","⨁":"&xoplus;","⨂":"&xotime;","⨆":"&xsqcup;","★":"&starf;","▽":"&xdtri;","△":"&xutri;","⨄":"&xuplus;","⤍":"&rbarr;","⧫":"&lozf;","▴":"&utrif;","▾":"&dtrif;","◂":"&ltrif;","▸":"&rtrif;","␣":"&blank;","▒":"&blk12;","░":"&blk14;","▓":"&blk34;","█":"&block;","=⃥":"&bne;","≡⃥":"&bnequiv;","⌐":"&bnot;","𝕓":"&bopf;","⋈":"&bowtie;","╗":"&boxDL;","╔":"&boxDR;","╖":"&boxDl;","╓":"&boxDr;","═":"&boxH;","╦":"&boxHD;","╩":"&boxHU;","╤":"&boxHd;","╧":"&boxHu;","╝":"&boxUL;","╚":"&boxUR;","╜":"&boxUl;","╙":"&boxUr;","║":"&boxV;","╬":"&boxVH;","╣":"&boxVL;","╠":"&boxVR;","╫":"&boxVh;","╢":"&boxVl;","╟":"&boxVr;","⧉":"&boxbox;","╕":"&boxdL;","╒":"&boxdR;","┐":"&boxdl;","┌":"&boxdr;","╥":"&boxhD;","╨":"&boxhU;","┬":"&boxhd;","┴":"&boxhu;","⊟":"&minusb;","⊞":"&plusb;","⊠":"&timesb;","╛":"&boxuL;","╘":"&boxuR;","┘":"&boxul;","└":"&boxur;","│":"&boxv;","╪":"&boxvH;","╡":"&boxvL;","╞":"&boxvR;","┼":"&boxvh;","┤":"&boxvl;","├":"&boxvr;","¦":"&brvbar;","𝒷":"&bscr;","⁏":"&bsemi;","\\":"&bsol;","⧅":"&bsolb;","⟈":"&bsolhsub;","•":"&bullet;","⪮":"&bumpE;","ć":"&cacute;","∩":"&cap;","⩄":"&capand;","⩉":"&capbrcup;","⩋":"&capcap;","⩇":"&capcup;","⩀":"&capdot;","∩︀":"&caps;","⁁":"&caret;","⩍":"&ccaps;","č":"&ccaron;","ç":"&ccedil;","ĉ":"&ccirc;","⩌":"&ccups;","⩐":"&ccupssm;","ċ":"&cdot;","⦲":"&cemptyv;","¢":"&cent;","𝔠":"&cfr;","ч":"&chcy;","✓":"&checkmark;","χ":"&chi;","○":"&cir;","⧃":"&cirE;","ˆ":"&circ;","≗":"&cire;","↺":"&olarr;","↻":"&orarr;","Ⓢ":"&oS;","⊛":"&oast;","⊚":"&ocir;","⊝":"&odash;","⨐":"&cirfnint;","⫯":"&cirmid;","⧂":"&cirscir;","♣":"&clubsuit;",":":"&colon;",",":"&comma;","@":"&commat;","∁":"&complement;","⩭":"&congdot;","𝕔":"&copf;","℗":"&copysr;","↵":"&crarr;","✗":"&cross;","𝒸":"&cscr;","⫏":"&csub;","⫑":"&csube;","⫐":"&csup;","⫒":"&csupe;","⋯":"&ctdot;","⤸":"&cudarrl;","⤵":"&cudarrr;","⋞":"&curlyeqprec;","⋟":"&curlyeqsucc;","↶":"&curvearrowleft;","⤽":"&cularrp;","∪":"&cup;","⩈":"&cupbrcap;","⩆":"&cupcap;","⩊":"&cupcup;","⊍":"&cupdot;","⩅":"&cupor;","∪︀":"&cups;","↷":"&curvearrowright;","⤼":"&curarrm;","⋎":"&cuvee;","⋏":"&cuwed;","¤":"&curren;","∱":"&cwint;","⌭":"&cylcty;","⥥":"&dHar;","†":"&dagger;","ℸ":"&daleth;","‐":"&hyphen;","⤏":"&rBarr;","ď":"&dcaron;","д":"&dcy;","⇊":"&downdownarrows;","⩷":"&eDDot;","°":"&deg;","δ":"&delta;","⦱":"&demptyv;","⥿":"&dfisht;","𝔡":"&dfr;","♦":"&diams;","ϝ":"&gammad;","⋲":"&disin;","÷":"&divide;","⋇":"&divonx;","ђ":"&djcy;","⌞":"&llcorner;","⌍":"&dlcrop;",$:"&dollar;","𝕕":"&dopf;","≑":"&eDot;","∸":"&minusd;","∔":"&plusdo;","⊡":"&sdotb;","⌟":"&lrcorner;","⌌":"&drcrop;","𝒹":"&dscr;","ѕ":"&dscy;","⧶":"&dsol;","đ":"&dstrok;","⋱":"&dtdot;","▿":"&triangledown;","⦦":"&dwangle;","џ":"&dzcy;","⟿":"&dzigrarr;","é":"&eacute;","⩮":"&easter;","ě":"&ecaron;","≖":"&eqcirc;","ê":"&ecirc;","≕":"&eqcolon;","э":"&ecy;","ė":"&edot;","≒":"&fallingdotseq;","𝔢":"&efr;","⪚":"&eg;","è":"&egrave;","⪖":"&eqslantgtr;","⪘":"&egsdot;","⪙":"&el;","⏧":"&elinters;","ℓ":"&ell;","⪕":"&eqslantless;","⪗":"&elsdot;","ē":"&emacr;","∅":"&varnothing;"," ":"&emsp13;"," ":"&emsp14;"," ":"&emsp;","ŋ":"&eng;"," ":"&ensp;","ę":"&eogon;","𝕖":"&eopf;","⋕":"&epar;","⧣":"&eparsl;","⩱":"&eplus;","ε":"&epsilon;","ϵ":"&varepsilon;","=":"&equals;","≟":"&questeq;","⩸":"&equivDD;","⧥":"&eqvparsl;","≓":"&risingdotseq;","⥱":"&erarr;","ℯ":"&escr;","η":"&eta;","ð":"&eth;","ë":"&euml;","€":"&euro;","!":"&excl;","ф":"&fcy;","♀":"&female;","ﬃ":"&ffilig;","ﬀ":"&fflig;","ﬄ":"&ffllig;","𝔣":"&ffr;","ﬁ":"&filig;",fj:"&fjlig;","♭":"&flat;","ﬂ":"&fllig;","▱":"&fltns;","ƒ":"&fnof;","𝕗":"&fopf;","⋔":"&pitchfork;","⫙":"&forkv;","⨍":"&fpartint;","½":"&half;","⅓":"&frac13;","¼":"&frac14;","⅕":"&frac15;","⅙":"&frac16;","⅛":"&frac18;","⅔":"&frac23;","⅖":"&frac25;","¾":"&frac34;","⅗":"&frac35;","⅜":"&frac38;","⅘":"&frac45;","⅚":"&frac56;","⅝":"&frac58;","⅞":"&frac78;","⁄":"&frasl;","⌢":"&sfrown;","𝒻":"&fscr;","⪌":"&gtreqqless;","ǵ":"&gacute;","γ":"&gamma;","⪆":"&gtrapprox;","ğ":"&gbreve;","ĝ":"&gcirc;","г":"&gcy;","ġ":"&gdot;","⪩":"&gescc;","⪀":"&gesdot;","⪂":"&gesdoto;","⪄":"&gesdotol;","⋛︀":"&gesl;","⪔":"&gesles;","𝔤":"&gfr;","ℷ":"&gimel;","ѓ":"&gjcy;","⪒":"&glE;","⪥":"&gla;","⪤":"&glj;","≩":"&gneqq;","⪊":"&gnapprox;","⪈":"&gneq;","⋧":"&gnsim;","𝕘":"&gopf;","ℊ":"&gscr;","⪎":"&gsime;","⪐":"&gsiml;","⪧":"&gtcc;","⩺":"&gtcir;","⋗":"&gtrdot;","⦕":"&gtlPar;","⩼":"&gtquest;","⥸":"&gtrarr;","≩︀":"&gvnE;","ъ":"&hardcy;","⥈":"&harrcir;","↭":"&leftrightsquigarrow;","ℏ":"&plankv;","ĥ":"&hcirc;","♥":"&heartsuit;","…":"&mldr;","⊹":"&hercon;","𝔥":"&hfr;","⤥":"&searhk;","⤦":"&swarhk;","⇿":"&hoarr;","∻":"&homtht;","↩":"&larrhk;","↪":"&rarrhk;","𝕙":"&hopf;","―":"&horbar;","𝒽":"&hscr;","ħ":"&hstrok;","⁃":"&hybull;","í":"&iacute;","î":"&icirc;","и":"&icy;","е":"&iecy;","¡":"&iexcl;","𝔦":"&ifr;","ì":"&igrave;","⨌":"&qint;","∭":"&tint;","⧜":"&iinfin;","℩":"&iiota;","ĳ":"&ijlig;","ī":"&imacr;","ı":"&inodot;","⊷":"&imof;","Ƶ":"&imped;","℅":"&incare;","∞":"&infin;","⧝":"&infintie;","⊺":"&intercal;","⨗":"&intlarhk;","⨼":"&iprod;","ё":"&iocy;","į":"&iogon;","𝕚":"&iopf;","ι":"&iota;","¿":"&iquest;","𝒾":"&iscr;","⋹":"&isinE;","⋵":"&isindot;","⋴":"&isins;","⋳":"&isinsv;","ĩ":"&itilde;","і":"&iukcy;","ï":"&iuml;","ĵ":"&jcirc;","й":"&jcy;","𝔧":"&jfr;","ȷ":"&jmath;","𝕛":"&jopf;","𝒿":"&jscr;","ј":"&jsercy;","є":"&jukcy;","κ":"&kappa;","ϰ":"&varkappa;","ķ":"&kcedil;","к":"&kcy;","𝔨":"&kfr;","ĸ":"&kgreen;","х":"&khcy;","ќ":"&kjcy;","𝕜":"&kopf;","𝓀":"&kscr;","⤛":"&lAtail;","⤎":"&lBarr;","⪋":"&lesseqqgtr;","⥢":"&lHar;","ĺ":"&lacute;","⦴":"&laemptyv;","λ":"&lambda;","⦑":"&langd;","⪅":"&lessapprox;","«":"&laquo;","⤟":"&larrbfs;","⤝":"&larrfs;","↫":"&looparrowleft;","⤹":"&larrpl;","⥳":"&larrsim;","↢":"&leftarrowtail;","⪫":"&lat;","⤙":"&latail;","⪭":"&late;","⪭︀":"&lates;","⤌":"&lbarr;","❲":"&lbbrk;","{":"&lcub;","[":"&lsqb;","⦋":"&lbrke;","⦏":"&lbrksld;","⦍":"&lbrkslu;","ľ":"&lcaron;","ļ":"&lcedil;","л":"&lcy;","⤶":"&ldca;","⥧":"&ldrdhar;","⥋":"&ldrushar;","↲":"&ldsh;","≤":"&leq;","⇇":"&llarr;","⋋":"&lthree;","⪨":"&lescc;","⩿":"&lesdot;","⪁":"&lesdoto;","⪃":"&lesdotor;","⋚︀":"&lesg;","⪓":"&lesges;","⋖":"&ltdot;","⥼":"&lfisht;","𝔩":"&lfr;","⪑":"&lgE;","⥪":"&lharul;","▄":"&lhblk;","љ":"&ljcy;","⥫":"&llhard;","◺":"&lltri;","ŀ":"&lmidot;","⎰":"&lmoustache;","≨":"&lneqq;","⪉":"&lnapprox;","⪇":"&lneq;","⋦":"&lnsim;","⟬":"&loang;","⇽":"&loarr;","⟼":"&xmap;","↬":"&rarrlp;","⦅":"&lopar;","𝕝":"&lopf;","⨭":"&loplus;","⨴":"&lotimes;","∗":"&lowast;","◊":"&lozenge;","(":"&lpar;","⦓":"&lparlt;","⥭":"&lrhard;","‎":"&lrm;","⊿":"&lrtri;","‹":"&lsaquo;","𝓁":"&lscr;","⪍":"&lsime;","⪏":"&lsimg;","‚":"&sbquo;","ł":"&lstrok;","⪦":"&ltcc;","⩹":"&ltcir;","⋉":"&ltimes;","⥶":"&ltlarr;","⩻":"&ltquest;","⦖":"&ltrPar;","◃":"&triangleleft;","⥊":"&lurdshar;","⥦":"&luruhar;","≨︀":"&lvnE;","∺":"&mDDot;","¯":"&strns;","♂":"&male;","✠":"&maltese;","▮":"&marker;","⨩":"&mcomma;","м":"&mcy;","—":"&mdash;","𝔪":"&mfr;","℧":"&mho;","µ":"&micro;","⫰":"&midcir;","−":"&minus;","⨪":"&minusdu;","⫛":"&mlcp;","⊧":"&models;","𝕞":"&mopf;","𝓂":"&mscr;","μ":"&mu;","⊸":"&mumap;","⋙̸":"&nGg;","≫⃒":"&nGt;","⇍":"&nlArr;","⇎":"&nhArr;","⋘̸":"&nLl;","≪⃒":"&nLt;","⇏":"&nrArr;","⊯":"&nVDash;","⊮":"&nVdash;","ń":"&nacute;","∠⃒":"&nang;","⩰̸":"&napE;","≋̸":"&napid;","ŉ":"&napos;","♮":"&natural;","⩃":"&ncap;","ň":"&ncaron;","ņ":"&ncedil;","⩭̸":"&ncongdot;","⩂":"&ncup;","н":"&ncy;","–":"&ndash;","⇗":"&neArr;","⤤":"&nearhk;","≐̸":"&nedot;","⤨":"&toea;","𝔫":"&nfr;","↮":"&nleftrightarrow;","⫲":"&nhpar;","⋼":"&nis;","⋺":"&nisd;","њ":"&njcy;","≦̸":"&nleqq;","↚":"&nleftarrow;","‥":"&nldr;","𝕟":"&nopf;","¬":"&not;","⋹̸":"&notinE;","⋵̸":"&notindot;","⋷":"&notinvb;","⋶":"&notinvc;","⋾":"&notnivb;","⋽":"&notnivc;","⫽⃥":"&nparsl;","∂̸":"&npart;","⨔":"&npolint;","↛":"&nrightarrow;","⤳̸":"&nrarrc;","↝̸":"&nrarrw;","𝓃":"&nscr;","⊄":"&nsub;","⫅̸":"&nsubseteqq;","⊅":"&nsup;","⫆̸":"&nsupseteqq;","ñ":"&ntilde;","ν":"&nu;","#":"&num;","№":"&numero;"," ":"&numsp;","⊭":"&nvDash;","⤄":"&nvHarr;","≍⃒":"&nvap;","⊬":"&nvdash;","≥⃒":"&nvge;",">⃒":"&nvgt;","⧞":"&nvinfin;","⤂":"&nvlArr;","≤⃒":"&nvle;","<⃒":"&nvlt;","⊴⃒":"&nvltrie;","⤃":"&nvrArr;","⊵⃒":"&nvrtrie;","∼⃒":"&nvsim;","⇖":"&nwArr;","⤣":"&nwarhk;","⤧":"&nwnear;","ó":"&oacute;","ô":"&ocirc;","о":"&ocy;","ő":"&odblac;","⨸":"&odiv;","⦼":"&odsold;","œ":"&oelig;","⦿":"&ofcir;","𝔬":"&ofr;","˛":"&ogon;","ò":"&ograve;","⧁":"&ogt;","⦵":"&ohbar;","⦾":"&olcir;","⦻":"&olcross;","⧀":"&olt;","ō":"&omacr;","ω":"&omega;","ο":"&omicron;","⦶":"&omid;","𝕠":"&oopf;","⦷":"&opar;","⦹":"&operp;","∨":"&vee;","⩝":"&ord;","ℴ":"&oscr;","ª":"&ordf;","º":"&ordm;","⊶":"&origof;","⩖":"&oror;","⩗":"&orslope;","⩛":"&orv;","ø":"&oslash;","⊘":"&osol;","õ":"&otilde;","⨶":"&otimesas;","ö":"&ouml;","⌽":"&ovbar;","¶":"&para;","⫳":"&parsim;","⫽":"&parsl;","п":"&pcy;","%":"&percnt;",".":"&period;","‰":"&permil;","‱":"&pertenk;","𝔭":"&pfr;","φ":"&phi;","ϕ":"&varphi;","☎":"&phone;","π":"&pi;","ϖ":"&varpi;","ℎ":"&planckh;","+":"&plus;","⨣":"&plusacir;","⨢":"&pluscir;","⨥":"&plusdu;","⩲":"&pluse;","⨦":"&plussim;","⨧":"&plustwo;","⨕":"&pointint;","𝕡":"&popf;","£":"&pound;","⪳":"&prE;","⪷":"&precapprox;","⪹":"&prnap;","⪵":"&prnE;","⋨":"&prnsim;","′":"&prime;","⌮":"&profalar;","⌒":"&profline;","⌓":"&profsurf;","⊰":"&prurel;","𝓅":"&pscr;","ψ":"&psi;"," ":"&puncsp;","𝔮":"&qfr;","𝕢":"&qopf;","⁗":"&qprime;","𝓆":"&qscr;","⨖":"&quatint;","?":"&quest;","⤜":"&rAtail;","⥤":"&rHar;","∽̱":"&race;","ŕ":"&racute;","⦳":"&raemptyv;","⦒":"&rangd;","⦥":"&range;","»":"&raquo;","⥵":"&rarrap;","⤠":"&rarrbfs;","⤳":"&rarrc;","⤞":"&rarrfs;","⥅":"&rarrpl;","⥴":"&rarrsim;","↣":"&rightarrowtail;","↝":"&rightsquigarrow;","⤚":"&ratail;","∶":"&ratio;","❳":"&rbbrk;","}":"&rcub;","]":"&rsqb;","⦌":"&rbrke;","⦎":"&rbrksld;","⦐":"&rbrkslu;","ř":"&rcaron;","ŗ":"&rcedil;","р":"&rcy;","⤷":"&rdca;","⥩":"&rdldhar;","↳":"&rdsh;","▭":"&rect;","⥽":"&rfisht;","𝔯":"&rfr;","⥬":"&rharul;","ρ":"&rho;","ϱ":"&varrho;","⇉":"&rrarr;","⋌":"&rthree;","˚":"&ring;","‏":"&rlm;","⎱":"&rmoustache;","⫮":"&rnmid;","⟭":"&roang;","⇾":"&roarr;","⦆":"&ropar;","𝕣":"&ropf;","⨮":"&roplus;","⨵":"&rotimes;",")":"&rpar;","⦔":"&rpargt;","⨒":"&rppolint;","›":"&rsaquo;","𝓇":"&rscr;","⋊":"&rtimes;","▹":"&triangleright;","⧎":"&rtriltri;","⥨":"&ruluhar;","℞":"&rx;","ś":"&sacute;","⪴":"&scE;","⪸":"&succapprox;","š":"&scaron;","ş":"&scedil;","ŝ":"&scirc;","⪶":"&succneqq;","⪺":"&succnapprox;","⋩":"&succnsim;","⨓":"&scpolint;","с":"&scy;","⋅":"&sdot;","⩦":"&sdote;","⇘":"&seArr;","§":"&sect;",";":"&semi;","⤩":"&tosa;","✶":"&sext;","𝔰":"&sfr;","♯":"&sharp;","щ":"&shchcy;","ш":"&shcy;","­":"&shy;","σ":"&sigma;","ς":"&varsigma;","⩪":"&simdot;","⪞":"&simg;","⪠":"&simgE;","⪝":"&siml;","⪟":"&simlE;","≆":"&simne;","⨤":"&simplus;","⥲":"&simrarr;","⨳":"&smashp;","⧤":"&smeparsl;","⌣":"&ssmile;","⪪":"&smt;","⪬":"&smte;","⪬︀":"&smtes;","ь":"&softcy;","/":"&sol;","⧄":"&solb;","⌿":"&solbar;","𝕤":"&sopf;","♠":"&spadesuit;","⊓︀":"&sqcaps;","⊔︀":"&sqcups;","𝓈":"&sscr;","☆":"&star;","⊂":"&subset;","⫅":"&subseteqq;","⪽":"&subdot;","⫃":"&subedot;","⫁":"&submult;","⫋":"&subsetneqq;","⊊":"&subsetneq;","⪿":"&subplus;","⥹":"&subrarr;","⫇":"&subsim;","⫕":"&subsub;","⫓":"&subsup;","♪":"&sung;","¹":"&sup1;","²":"&sup2;","³":"&sup3;","⫆":"&supseteqq;","⪾":"&supdot;","⫘":"&supdsub;","⫄":"&supedot;","⟉":"&suphsol;","⫗":"&suphsub;","⥻":"&suplarr;","⫂":"&supmult;","⫌":"&supsetneqq;","⊋":"&supsetneq;","⫀":"&supplus;","⫈":"&supsim;","⫔":"&supsub;","⫖":"&supsup;","⇙":"&swArr;","⤪":"&swnwar;","ß":"&szlig;","⌖":"&target;","τ":"&tau;","ť":"&tcaron;","ţ":"&tcedil;","т":"&tcy;","⌕":"&telrec;","𝔱":"&tfr;","θ":"&theta;","ϑ":"&vartheta;","þ":"&thorn;","×":"&times;","⨱":"&timesbar;","⨰":"&timesd;","⌶":"&topbot;","⫱":"&topcir;","𝕥":"&topf;","⫚":"&topfork;","‴":"&tprime;","▵":"&utri;","≜":"&trie;","◬":"&tridot;","⨺":"&triminus;","⨹":"&triplus;","⧍":"&trisb;","⨻":"&tritime;","⏢":"&trpezium;","𝓉":"&tscr;","ц":"&tscy;","ћ":"&tshcy;","ŧ":"&tstrok;","⥣":"&uHar;","ú":"&uacute;","ў":"&ubrcy;","ŭ":"&ubreve;","û":"&ucirc;","у":"&ucy;","ű":"&udblac;","⥾":"&ufisht;","𝔲":"&ufr;","ù":"&ugrave;","▀":"&uhblk;","⌜":"&ulcorner;","⌏":"&ulcrop;","◸":"&ultri;","ū":"&umacr;","ų":"&uogon;","𝕦":"&uopf;","υ":"&upsilon;","⇈":"&uuarr;","⌝":"&urcorner;","⌎":"&urcrop;","ů":"&uring;","◹":"&urtri;","𝓊":"&uscr;","⋰":"&utdot;","ũ":"&utilde;","ü":"&uuml;","⦧":"&uwangle;","⫨":"&vBar;","⫩":"&vBarv;","⦜":"&vangrt;","⊊︀":"&vsubne;","⫋︀":"&vsubnE;","⊋︀":"&vsupne;","⫌︀":"&vsupnE;","в":"&vcy;","⊻":"&veebar;","≚":"&veeeq;","⋮":"&vellip;","𝔳":"&vfr;","𝕧":"&vopf;","𝓋":"&vscr;","⦚":"&vzigzag;","ŵ":"&wcirc;","⩟":"&wedbar;","≙":"&wedgeq;","℘":"&wp;","𝔴":"&wfr;","𝕨":"&wopf;","𝓌":"&wscr;","𝔵":"&xfr;","ξ":"&xi;","⋻":"&xnis;","𝕩":"&xopf;","𝓍":"&xscr;","ý":"&yacute;","я":"&yacy;","ŷ":"&ycirc;","ы":"&ycy;","¥":"&yen;","𝔶":"&yfr;","ї":"&yicy;","𝕪":"&yopf;","𝓎":"&yscr;","ю":"&yucy;","ÿ":"&yuml;","ź":"&zacute;","ž":"&zcaron;","з":"&zcy;","ż":"&zdot;","ζ":"&zeta;","𝔷":"&zfr;","ж":"&zhcy;","⇝":"&zigrarr;","𝕫":"&zopf;","𝓏":"&zscr;","‍":"&zwj;","‌":"&zwnj;"}}};
//# sourceMappingURL=./named-references.js.map

/***/ }),

/***/ "./node_modules/html-entities/lib/numeric-unicode-map.js":
/*!***************************************************************!*\
  !*** ./node_modules/html-entities/lib/numeric-unicode-map.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.numericUnicodeMap={0:65533,128:8364,130:8218,131:402,132:8222,133:8230,134:8224,135:8225,136:710,137:8240,138:352,139:8249,140:338,142:381,145:8216,146:8217,147:8220,148:8221,149:8226,150:8211,151:8212,152:732,153:8482,154:353,155:8250,156:339,158:382,159:376};
//# sourceMappingURL=./numeric-unicode-map.js.map

/***/ }),

/***/ "./node_modules/html-entities/lib/surrogate-pairs.js":
/*!***********************************************************!*\
  !*** ./node_modules/html-entities/lib/surrogate-pairs.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";
Object.defineProperty(exports, "__esModule", ({value:true}));exports.fromCodePoint=String.fromCodePoint||function(astralCodePoint){return String.fromCharCode(Math.floor((astralCodePoint-65536)/1024)+55296,(astralCodePoint-65536)%1024+56320)};exports.getCodePoint=String.prototype.codePointAt?function(input,position){return input.codePointAt(position)}:function(input,position){return(input.charCodeAt(position)-55296)*1024+input.charCodeAt(position+1)-56320+65536};exports.highSurrogateFrom=55296;exports.highSurrogateTo=56319;
//# sourceMappingURL=./surrogate-pairs.js.map

/***/ }),

/***/ "./src/engine/core/Component/Component.ts":
/*!************************************************!*\
  !*** ./src/engine/core/Component/Component.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* binding */ Component)
/* harmony export */ });
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../Entity */ "./src/engine/core/Entity/index.ts");

class Component extends _Entity__WEBPACK_IMPORTED_MODULE_0__.Entity {
    constructor(parent, componentType) {
        super(componentType);
        this._parent = parent;
        this._parent.addComponent(this);
    }
    get parent() {
        return this._parent;
    }
}


/***/ }),

/***/ "./src/engine/core/Component/index.ts":
/*!********************************************!*\
  !*** ./src/engine/core/Component/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* reexport safe */ _Component__WEBPACK_IMPORTED_MODULE_0__.Component)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/engine/core/Component/Component.ts");



/***/ }),

/***/ "./src/engine/core/Entity/Entity.ts":
/*!******************************************!*\
  !*** ./src/engine/core/Entity/Entity.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Entity: () => (/* binding */ Entity)
/* harmony export */ });
class Entity {
    constructor(type) {
        this._id = this._generateId();
        this._type = type;
    }
    _generateId() {
        return String(Math.random());
    }
    get id() {
        return this._id;
    }
    get type() {
        return this._type;
    }
}


/***/ }),

/***/ "./src/engine/core/Entity/index.ts":
/*!*****************************************!*\
  !*** ./src/engine/core/Entity/index.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Entity: () => (/* reexport safe */ _Entity__WEBPACK_IMPORTED_MODULE_0__.Entity)
/* harmony export */ });
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Entity */ "./src/engine/core/Entity/Entity.ts");



/***/ }),

/***/ "./src/engine/core/GameObject/GameObject.ts":
/*!**************************************************!*\
  !*** ./src/engine/core/GameObject/GameObject.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameObject: () => (/* binding */ GameObject)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "./src/engine/types/index.ts");
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Entity */ "./src/engine/core/Entity/index.ts");


class GameObject extends _Entity__WEBPACK_IMPORTED_MODULE_1__.Entity {
    constructor() {
        super(_types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.gameObject);
        this._components = new Map();
        this._name = `GameObject ${super.id}`;
    }
    get name() {
        return this._name;
    }
    set name(value) {
        this._name = value;
    }
    get components() {
        return this._components;
    }
    addComponent(component) {
        this._components.set(component.id, component);
    }
    removeComponent(id) {
        this._components.delete(id);
    }
}


/***/ }),

/***/ "./src/engine/core/GameObject/index.ts":
/*!*********************************************!*\
  !*** ./src/engine/core/GameObject/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GameObject: () => (/* reexport safe */ _GameObject__WEBPACK_IMPORTED_MODULE_0__.GameObject)
/* harmony export */ });
/* harmony import */ var _GameObject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./GameObject */ "./src/engine/core/GameObject/GameObject.ts");



/***/ }),

/***/ "./src/engine/core/Mesh/Mesh.ts":
/*!**************************************!*\
  !*** ./src/engine/core/Mesh/Mesh.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mesh: () => (/* binding */ Mesh)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "./src/engine/types/index.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Component */ "./src/engine/core/Component/index.ts");


class Mesh extends _Component__WEBPACK_IMPORTED_MODULE_1__.Component {
    constructor(parent, positions) {
        super(parent, _types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.mesh);
        this.mode = 4; // GPU topology mode
        this.positions = positions;
    }
    buildRenderPipeline(device, shaderModule, colorFormat, depthFormat, uniformsBGLayout) {
        const vertexState = {
            module: shaderModule,
            entryPoint: 'vertex_main',
            buffers: [
                {
                    arrayStride: this.positions.byteStride,
                    attributes: [
                        // Note: We do not pass the positions.byteOffset here, as its
                        // meaning can vary in different glB files, i.e., if it's
                        // being used for interleaved element offset or an absolute
                        // offset.
                        {
                            format: this.positions.elementType,
                            offset: 0,
                            shaderLocation: 0,
                        },
                    ],
                },
            ],
        };
        const fragmentState = {
            module: shaderModule,
            entryPoint: 'fragment_main',
            targets: [{ format: colorFormat }],
        };
        // Our loader only supports triangle lists and strips, so by default we set
        // the primitive topology to triangle list, and check if it's
        // instead a triangle strip
        const primitive = {
            topology: 'triangle-list',
            stripIndexFormat: undefined,
        };
        // if (this.mode === 5) {
        //     primitive.topology = 'triangle-strip'
        //     primitive.stripIndexFormat = this.indices.vertexType
        // }
        const layout = device.createPipelineLayout({
            bindGroupLayouts: [uniformsBGLayout],
        });
        this.renderPipeline = device.createRenderPipeline({
            layout: layout,
            vertex: vertexState,
            fragment: fragmentState,
            primitive: primitive,
            depthStencil: {
                format: depthFormat,
                depthWriteEnabled: true,
                depthCompare: 'less',
            },
        });
    }
}


/***/ }),

/***/ "./src/engine/core/Mesh/index.ts":
/*!***************************************!*\
  !*** ./src/engine/core/Mesh/index.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Mesh: () => (/* reexport safe */ _Mesh__WEBPACK_IMPORTED_MODULE_0__.Mesh)
/* harmony export */ });
/* harmony import */ var _Mesh__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Mesh */ "./src/engine/core/Mesh/Mesh.ts");



/***/ }),

/***/ "./src/engine/core/ObjectManager/ObjectManager.ts":
/*!********************************************************!*\
  !*** ./src/engine/core/ObjectManager/ObjectManager.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObjectManager: () => (/* binding */ ObjectManager)
/* harmony export */ });
/* harmony import */ var _SceneTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../SceneTree */ "./src/engine/core/SceneTree/index.ts");

class ObjectManager {
    constructor() {
        this._objectPositions = new Map();
        this._sceneTree = new _SceneTree__WEBPACK_IMPORTED_MODULE_0__.SceneTree();
    }
    getObjectPosition(gameObject) {
        return gameObject
            ? this._objectPositions.get(gameObject.id) ?? null
            : null;
    }
    addObject(child, target) {
        const position = this._sceneTree.addNodeAt(this.getObjectPosition(target), {
            gameObject: child,
            children: new Map(),
        });
        this._objectPositions.set(child.id, position);
    }
    reparentObject(child, target) {
        const childPosition = this._objectPositions.get(child.id);
        if (!childPosition) {
            throw new Error(`Position record not found for ${child.id}`);
        }
        const newPosition = this._sceneTree.reparentNode(this.getObjectPosition(target), childPosition);
        this._objectPositions.set(child.id, newPosition);
    }
    destroyObject(gameObject) {
        const childPosition = this._objectPositions.get(gameObject.id);
        if (!childPosition) {
            throw new Error(`Position record not found for ${gameObject.id}`);
        }
        const idsToRemove = this._sceneTree.removeNode(childPosition);
        idsToRemove.forEach((id) => {
            this._objectPositions.delete(id);
        });
    }
}


/***/ }),

/***/ "./src/engine/core/ObjectManager/index.ts":
/*!************************************************!*\
  !*** ./src/engine/core/ObjectManager/index.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ObjectManager: () => (/* reexport safe */ _ObjectManager__WEBPACK_IMPORTED_MODULE_0__.ObjectManager)
/* harmony export */ });
/* harmony import */ var _ObjectManager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./ObjectManager */ "./src/engine/core/ObjectManager/ObjectManager.ts");



/***/ }),

/***/ "./src/engine/core/SceneTree/SceneTree.ts":
/*!************************************************!*\
  !*** ./src/engine/core/SceneTree/SceneTree.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SceneTree: () => (/* binding */ SceneTree)
/* harmony export */ });
class SceneTree {
    constructor() {
        this._nodes = new Map();
    }
    getNodeContentAt(position) {
        let currentTreeNode = this._nodes.get(position[0]);
        for (let i = 1; i < position.length; i++) {
            currentTreeNode = currentTreeNode?.children?.get(position[i]);
        }
        return currentTreeNode ?? null;
    }
    addNodeAt(position, nodeContent) {
        if (!position) {
            this._nodes.set(nodeContent.gameObject.id, nodeContent);
            return [nodeContent.gameObject.id];
        }
        let currentTreeNode = this.getNodeContentAt(position);
        currentTreeNode?.children?.set(nodeContent.gameObject.id, nodeContent);
        return [...position, nodeContent.gameObject.id];
    }
    reparentNode(target, child) {
        const nodeContent = this.getNodeContentAt(child);
        if (!nodeContent) {
            throw new Error(`No node found at position ${child.join()}`);
        }
        const newPosition = this.addNodeAt(target, nodeContent);
        this.removeNode(child);
        return newPosition;
    }
    removeNode(targetPosition) {
        const parentPosition = targetPosition.slice(-1);
        const parentNode = this.getNodeContentAt(parentPosition);
        const childrenIds = [];
        this.traverseNode(parentNode?.children, (nodeId) => {
            childrenIds.push(nodeId);
        });
        parentNode?.children?.delete(targetPosition[targetPosition.length - 1]);
        return childrenIds;
    }
    traverseNode(node, callback) {
        const iterate = (sceneNode) => {
            if (!sceneNode)
                return;
            sceneNode.forEach((value, key) => {
                callback(key, value);
                iterate(value.children);
            });
        };
        iterate(node);
    }
    get nodes() {
        return this._nodes;
    }
}


/***/ }),

/***/ "./src/engine/core/SceneTree/index.ts":
/*!********************************************!*\
  !*** ./src/engine/core/SceneTree/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SceneTree: () => (/* reexport safe */ _SceneTree__WEBPACK_IMPORTED_MODULE_0__.SceneTree)
/* harmony export */ });
/* harmony import */ var _SceneTree__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SceneTree */ "./src/engine/core/SceneTree/SceneTree.ts");



/***/ }),

/***/ "./src/engine/core/Transform/Transform.ts":
/*!************************************************!*\
  !*** ./src/engine/core/Transform/Transform.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transform: () => (/* binding */ Transform)
/* harmony export */ });
/* harmony import */ var _types__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../types */ "./src/engine/types/index.ts");
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../Component */ "./src/engine/core/Component/index.ts");


class Transform extends _Component__WEBPACK_IMPORTED_MODULE_1__.Component {
    constructor(parent, trs, matrix) {
        super(parent, _types__WEBPACK_IMPORTED_MODULE_0__.EntityTypes.transform);
        if (matrix) {
            this.matrix = matrix;
        }
        else {
            this.scale = trs?.scale ?? [1, 1, 1];
            this.rotation = trs?.rotation ?? [0, 0, 0, 1];
            this.translation = trs?.translation ?? [0, 0, 0];
        }
    }
}


/***/ }),

/***/ "./src/engine/core/Transform/index.ts":
/*!********************************************!*\
  !*** ./src/engine/core/Transform/index.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Transform: () => (/* reexport safe */ _Transform__WEBPACK_IMPORTED_MODULE_0__.Transform)
/* harmony export */ });
/* harmony import */ var _Transform__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Transform */ "./src/engine/core/Transform/Transform.ts");



/***/ }),

/***/ "./src/engine/core/index.ts":
/*!**********************************!*\
  !*** ./src/engine/core/index.ts ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Component: () => (/* reexport safe */ _Component__WEBPACK_IMPORTED_MODULE_0__.Component),
/* harmony export */   Entity: () => (/* reexport safe */ _Entity__WEBPACK_IMPORTED_MODULE_1__.Entity),
/* harmony export */   GameObject: () => (/* reexport safe */ _GameObject__WEBPACK_IMPORTED_MODULE_2__.GameObject),
/* harmony export */   Mesh: () => (/* reexport safe */ _Mesh__WEBPACK_IMPORTED_MODULE_6__.Mesh),
/* harmony export */   ObjectManager: () => (/* reexport safe */ _ObjectManager__WEBPACK_IMPORTED_MODULE_3__.ObjectManager),
/* harmony export */   SceneTree: () => (/* reexport safe */ _SceneTree__WEBPACK_IMPORTED_MODULE_4__.SceneTree),
/* harmony export */   Transform: () => (/* reexport safe */ _Transform__WEBPACK_IMPORTED_MODULE_5__.Transform)
/* harmony export */ });
/* harmony import */ var _Component__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Component */ "./src/engine/core/Component/index.ts");
/* harmony import */ var _Entity__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Entity */ "./src/engine/core/Entity/index.ts");
/* harmony import */ var _GameObject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./GameObject */ "./src/engine/core/GameObject/index.ts");
/* harmony import */ var _ObjectManager__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./ObjectManager */ "./src/engine/core/ObjectManager/index.ts");
/* harmony import */ var _SceneTree__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./SceneTree */ "./src/engine/core/SceneTree/index.ts");
/* harmony import */ var _Transform__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./Transform */ "./src/engine/core/Transform/index.ts");
/* harmony import */ var _Mesh__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./Mesh */ "./src/engine/core/Mesh/index.ts");









/***/ }),

/***/ "./src/engine/types/core/Component/index.ts":
/*!**************************************************!*\
  !*** ./src/engine/types/core/Component/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/engine/types/core/Entity/index.ts":
/*!***********************************************!*\
  !*** ./src/engine/types/core/Entity/index.ts ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EntityTypes: () => (/* binding */ EntityTypes)
/* harmony export */ });
var EntityTypes;
(function (EntityTypes) {
    EntityTypes["gameObject"] = "gameObject";
    EntityTypes["mesh"] = "mesh";
    EntityTypes["material"] = "material";
    EntityTypes["transform"] = "transform";
})(EntityTypes || (EntityTypes = {}));


/***/ }),

/***/ "./src/engine/types/core/GameObject/index.ts":
/*!***************************************************!*\
  !*** ./src/engine/types/core/GameObject/index.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/engine/types/core/Mesh/index.ts":
/*!*********************************************!*\
  !*** ./src/engine/types/core/Mesh/index.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/engine/types/core/ObjectManager/index.ts":
/*!******************************************************!*\
  !*** ./src/engine/types/core/ObjectManager/index.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/engine/types/core/SceneTree/index.ts":
/*!**************************************************!*\
  !*** ./src/engine/types/core/SceneTree/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/engine/types/core/Transform/index.ts":
/*!**************************************************!*\
  !*** ./src/engine/types/core/Transform/index.ts ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);



/***/ }),

/***/ "./src/engine/types/index.ts":
/*!***********************************!*\
  !*** ./src/engine/types/index.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EntityTypes: () => (/* reexport safe */ _core_Entity__WEBPACK_IMPORTED_MODULE_0__.EntityTypes)
/* harmony export */ });
/* harmony import */ var _core_Entity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./core/Entity */ "./src/engine/types/core/Entity/index.ts");
/* harmony import */ var _core_GameObject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./core/GameObject */ "./src/engine/types/core/GameObject/index.ts");
/* harmony import */ var _core_Component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./core/Component */ "./src/engine/types/core/Component/index.ts");
/* harmony import */ var _core_SceneTree__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./core/SceneTree */ "./src/engine/types/core/SceneTree/index.ts");
/* harmony import */ var _core_ObjectManager__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./core/ObjectManager */ "./src/engine/types/core/ObjectManager/index.ts");
/* harmony import */ var _core_Mesh__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./core/Mesh */ "./src/engine/types/core/Mesh/index.ts");
/* harmony import */ var _core_Transform__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./core/Transform */ "./src/engine/types/core/Transform/index.ts");









/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./engine/core */ "./src/engine/core/index.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils */ "./src/utils/index.ts");
/* harmony import */ var _testShader_wgsl__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./testShader.wgsl */ "./src/testShader.wgsl");



(async () => {
    const objectManager = new _engine_core__WEBPACK_IMPORTED_MODULE_0__.ObjectManager();
    const adapter = (await navigator.gpu.requestAdapter());
    const device = await adapter.requestDevice();
    // Get a context to display our rendered image on the canvas
    const canvas = document.getElementById('webgpu-canvas');
    const context = canvas.getContext('webgpu');
    const shaderModule = device.createShaderModule({ code: _testShader_wgsl__WEBPACK_IMPORTED_MODULE_2__["default"] });
    const ass = await _utils__WEBPACK_IMPORTED_MODULE_1__.WheezyGLBLoader.loadFromUrl('static/models/Duck.glb', objectManager, device);
    // console.log(ass)
})();


/***/ }),

/***/ "./src/utils/WheezyGLBLoader.ts":
/*!**************************************!*\
  !*** ./src/utils/WheezyGLBLoader.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLTFComponentType: () => (/* binding */ GLTFComponentType),
/* harmony export */   WheezyGLBLoader: () => (/* binding */ WheezyGLBLoader)
/* harmony export */ });
/* harmony import */ var _loaders_gl_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/core */ "./node_modules/@loaders.gl/core/dist/lib/api/load.js");
/* harmony import */ var _loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @loaders.gl/gltf */ "./node_modules/@loaders.gl/gltf/dist/glb-loader.js");
/* harmony import */ var _engine_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../engine/core */ "./src/engine/core/index.ts");



class WheezyGLBLoader {
    static async loadFromUrl(url, objectManager, device) {
        //FIXME: create a mechanism to load models without registering them instantly
        //FIXME: buffers uploading to gpu on load
        const modelData = await (0,_loaders_gl_core__WEBPACK_IMPORTED_MODULE_1__.load)(url, _loaders_gl_gltf__WEBPACK_IMPORTED_MODULE_2__.GLBLoader);
        // console.log(modelData)
        const sceneObject = new _engine_core__WEBPACK_IMPORTED_MODULE_0__.GameObject();
        objectManager.addObject(sceneObject);
        modelData?.json?.scenes?.forEach((scene) => {
            scene?.nodes?.forEach((nodeIndex) => {
                this.loadNode(nodeIndex, modelData, device, objectManager, sceneObject);
            });
        });
        console.log(objectManager);
    }
    static loadNode(nodeIndex, modelData, device, objectManager, parentObject) {
        const nodeJsonData = modelData?.json?.nodes[nodeIndex];
        if (!nodeJsonData) {
            return;
        }
        const nodeGameObject = new _engine_core__WEBPACK_IMPORTED_MODULE_0__.GameObject();
        objectManager.addObject(nodeGameObject, parentObject);
        //FIXME: figure out what format is used for trs values in the parser
        const nodeTransfrom = new _engine_core__WEBPACK_IMPORTED_MODULE_0__.Transform(nodeGameObject, undefined, nodeJsonData.matrix);
        if (nodeJsonData.mesh !== undefined) {
            //FIXME: get mesh buffers accessors and set them here
            // const positionAccessor: GLTFAccessor = {}
            const meshJsonData = modelData.json.meshes[nodeJsonData.mesh];
            nodeGameObject.name = meshJsonData.name;
            // {
            //     "attributes": {
            //         "NORMAL": 1,
            //         "POSITION": 2,
            //         "TEXCOORD_0": 3
            //     },
            //     "indices": 0,
            //     "mode": 4,
            //     "material": 0
            // }
            meshJsonData.primitives.forEach((primitive) => {
                //TODO!
                //FIXME: Parse textures, materials, etc. here
                const positionRawAccessor = modelData.json.accessors[primitive.attributes.POSITION];
                const positionRawBufferView = modelData.json.bufferViews[positionRawAccessor.bufferView];
                // console.log(positionRawBufferView)
                const positionBuffer = modelData.binChunks[positionRawBufferView.buffer];
                // console.log(positionBuffer)
                const meshGameObject = new _engine_core__WEBPACK_IMPORTED_MODULE_0__.GameObject();
                objectManager.addObject(meshGameObject, nodeGameObject);
                const view = new Uint8Array(positionBuffer.arrayBuffer).subarray(positionRawBufferView.byteOffset, positionRawBufferView.byteOffset +
                    positionRawBufferView.byteLength);
                const buf = device.createBuffer({
                    size: positionRawBufferView.byteLength,
                    usage: positionRawBufferView.target,
                    mappedAtCreation: true,
                });
                new Uint8Array(buf.getMappedRange()).set(view);
                buf.unmap();
                const positionAccessor = {
                    byteStride: positionRawAccessor.byteStride ?? 0,
                    count: positionRawAccessor.count,
                    componentType: positionRawAccessor.componentType,
                    type: positionRawAccessor.type,
                    byteOffset: positionRawAccessor.byteOffset ?? 0,
                    elementType: getVertexType(positionRawAccessor.componentType, positionRawAccessor.type),
                    min: positionRawAccessor.min,
                    max: positionRawAccessor.max,
                    bufferView: {
                        byteLength: positionRawBufferView.byteLength,
                        byteStride: positionRawBufferView.byteStride,
                        view,
                        buffer: buf,
                        usage: positionRawBufferView.target,
                    },
                };
                const mesh = new _engine_core__WEBPACK_IMPORTED_MODULE_0__.Mesh(meshGameObject, positionAccessor);
                // console.log(mesh)
            });
        }
        nodeJsonData?.children?.forEach((childIndex) => {
            this.loadNode(childIndex, modelData, device, objectManager, nodeGameObject);
        });
    }
}
var GLTFComponentType;
(function (GLTFComponentType) {
    GLTFComponentType[GLTFComponentType["BYTE"] = 5120] = "BYTE";
    GLTFComponentType[GLTFComponentType["UNSIGNED_BYTE"] = 5121] = "UNSIGNED_BYTE";
    GLTFComponentType[GLTFComponentType["SHORT"] = 5122] = "SHORT";
    GLTFComponentType[GLTFComponentType["UNSIGNED_SHORT"] = 5123] = "UNSIGNED_SHORT";
    GLTFComponentType[GLTFComponentType["INT"] = 5124] = "INT";
    GLTFComponentType[GLTFComponentType["UNSIGNED_INT"] = 5125] = "UNSIGNED_INT";
    GLTFComponentType[GLTFComponentType["FLOAT"] = 5126] = "FLOAT";
    GLTFComponentType[GLTFComponentType["DOUBLE"] = 5130] = "DOUBLE";
})(GLTFComponentType || (GLTFComponentType = {}));
const getTypeComponentsAmount = (type) => {
    switch (type) {
        case 'SCALAR':
            return 1;
        case 'VEC2':
            return 2;
        case 'VEC3':
            return 3;
        case 'VEC4':
        case 'MAT2':
            return 4;
        case 'MAT3':
            return 9;
        case 'MAT4':
            return 16;
        default:
            throw Error(`Invalid gltf type ${type}`);
    }
};
const getVertexType = (componentType, type) => {
    let typeStr = null;
    switch (componentType) {
        case GLTFComponentType.BYTE:
            typeStr = 'sint8';
            break;
        case GLTFComponentType.UNSIGNED_BYTE:
            typeStr = 'uint8';
            break;
        case GLTFComponentType.SHORT:
            typeStr = 'sint16';
            break;
        case GLTFComponentType.UNSIGNED_SHORT:
            typeStr = 'uint16';
            break;
        case GLTFComponentType.INT:
            typeStr = 'int32';
            break;
        case GLTFComponentType.UNSIGNED_INT:
            typeStr = 'uint32';
            break;
        case GLTFComponentType.FLOAT:
            typeStr = 'float32';
            break;
        default:
            throw Error(`Unrecognized or unsupported gltf type ${componentType}`);
    }
    switch (getTypeComponentsAmount(type)) {
        case 2:
            typeStr += 'x2';
            break;
        case 3:
            typeStr += 'x3';
            break;
        case 4:
            typeStr += 'x4';
            break;
        default:
            throw Error(`Invalid number of components for gltf type: ${type}`);
    }
    return typeStr;
};


/***/ }),

/***/ "./src/utils/index.ts":
/*!****************************!*\
  !*** ./src/utils/index.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLTFComponentType: () => (/* reexport safe */ _WheezyGLBLoader__WEBPACK_IMPORTED_MODULE_0__.GLTFComponentType),
/* harmony export */   WheezyGLBLoader: () => (/* reexport safe */ _WheezyGLBLoader__WEBPACK_IMPORTED_MODULE_0__.WheezyGLBLoader)
/* harmony export */ });
/* harmony import */ var _WheezyGLBLoader__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./WheezyGLBLoader */ "./src/utils/WheezyGLBLoader.ts");



/***/ }),

/***/ "./src/testShader.wgsl":
/*!*****************************!*\
  !*** ./src/testShader.wgsl ***!
  \*****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ("alias float4 = vec4<f32>;\r\nalias float3 = vec3<f32>;\r\n\r\nstruct VertexInput {\r\n    @location(0) position: float3,\r\n};\r\n\r\nstruct VertexOutput {\r\n    @builtin(position) position: float4,\r\n    @location(0) world_pos: float3,\r\n};\r\n\r\nstruct ViewParams {\r\n    view_proj: mat4x4<f32>,\r\n};\r\n\r\nstruct NodeParams {\r\n    transform: mat4x4<f32>,\r\n};\r\n\r\n@group(0) @binding(0)\r\nvar<uniform> view_params: ViewParams;\r\n\r\n@group(1) @binding(0)\r\nvar<uniform> node_params: NodeParams;\r\n\r\n@vertex\r\nfn vertex_main(vert: VertexInput) -> VertexOutput {\r\n    var out: VertexOutput;\r\n    out.position = view_params.view_proj * node_params.transform * float4(vert.position, 1.0);\r\n    out.world_pos = vert.position.xyz;\r\n    return out;\r\n};\r\n\r\n@fragment\r\nfn fragment_main(in: VertexOutput) -> @location(0) float4 {\r\n    let dx = dpdx(in.world_pos);\r\n    let dy = dpdy(in.world_pos);\r\n    let n = normalize(cross(dx, dy));\r\n    return float4((n + 1.0) * 0.5, 1.0);\r\n}\r\n");

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/clients/WebSocketClient.js":
/*!***************************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/clients/WebSocketClient.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WebSocketClient)
/* harmony export */ });
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/log.js */ "./node_modules/webpack-dev-server/client/utils/log.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

var WebSocketClient = /*#__PURE__*/function () {
  /**
   * @param {string} url
   */
  function WebSocketClient(url) {
    _classCallCheck(this, WebSocketClient);
    this.client = new WebSocket(url);
    this.client.onerror = function (error) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_0__.log.error(error);
    };
  }

  /**
   * @param {(...args: any[]) => void} f
   */
  _createClass(WebSocketClient, [{
    key: "onOpen",
    value: function onOpen(f) {
      this.client.onopen = f;
    }

    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onClose",
    value: function onClose(f) {
      this.client.onclose = f;
    }

    // call f with the message string as the first argument
    /**
     * @param {(...args: any[]) => void} f
     */
  }, {
    key: "onMessage",
    value: function onMessage(f) {
      this.client.onmessage = function (e) {
        f(e.data);
      };
    }
  }]);
  return WebSocketClient;
}();


/***/ }),

/***/ "./node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=3000&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true":
/*!***********************************************************************************************************************************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=3000&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true ***!
  \***********************************************************************************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
var __resourceQuery = "?protocol=ws%3A&hostname=0.0.0.0&port=3000&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webpack/hot/log.js */ "./node_modules/webpack/hot/log.js");
/* harmony import */ var webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/stripAnsi.js */ "./node_modules/webpack-dev-server/client/utils/stripAnsi.js");
/* harmony import */ var _utils_parseURL_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/parseURL.js */ "./node_modules/webpack-dev-server/client/utils/parseURL.js");
/* harmony import */ var _socket_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./socket.js */ "./node_modules/webpack-dev-server/client/socket.js");
/* harmony import */ var _overlay_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./overlay.js */ "./node_modules/webpack-dev-server/client/overlay.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/log.js */ "./node_modules/webpack-dev-server/client/utils/log.js");
/* harmony import */ var _utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/sendMessage.js */ "./node_modules/webpack-dev-server/client/utils/sendMessage.js");
/* harmony import */ var _utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/reloadApp.js */ "./node_modules/webpack-dev-server/client/utils/reloadApp.js");
/* harmony import */ var _utils_createSocketURL_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./utils/createSocketURL.js */ "./node_modules/webpack-dev-server/client/utils/createSocketURL.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/* global __resourceQuery, __webpack_hash__ */
/// <reference types="webpack/module" />










/**
 * @typedef {Object} OverlayOptions
 * @property {boolean | (error: Error) => boolean} [warnings]
 * @property {boolean | (error: Error) => boolean} [errors]
 * @property {boolean | (error: Error) => boolean} [runtimeErrors]
 * @property {string} [trustedTypesPolicyName]
 */

/**
 * @typedef {Object} Options
 * @property {boolean} hot
 * @property {boolean} liveReload
 * @property {boolean} progress
 * @property {boolean | OverlayOptions} overlay
 * @property {string} [logging]
 * @property {number} [reconnect]
 */

/**
 * @typedef {Object} Status
 * @property {boolean} isUnloading
 * @property {string} currentHash
 * @property {string} [previousHash]
 */

/**
 * @param {boolean | { warnings?: boolean | string; errors?: boolean | string; runtimeErrors?: boolean | string; }} overlayOptions
 */
var decodeOverlayOptions = function decodeOverlayOptions(overlayOptions) {
  if (typeof overlayOptions === "object") {
    ["warnings", "errors", "runtimeErrors"].forEach(function (property) {
      if (typeof overlayOptions[property] === "string") {
        var overlayFilterFunctionString = decodeURIComponent(overlayOptions[property]);

        // eslint-disable-next-line no-new-func
        var overlayFilterFunction = new Function("message", "var callback = ".concat(overlayFilterFunctionString, "\n        return callback(message)"));
        overlayOptions[property] = overlayFilterFunction;
      }
    });
  }
};

/**
 * @type {Status}
 */
var status = {
  isUnloading: false,
  // TODO Workaround for webpack v4, `__webpack_hash__` is not replaced without HotModuleReplacement
  // eslint-disable-next-line camelcase
  currentHash:  true ? __webpack_require__.h() : 0
};

/** @type {Options} */
var options = {
  hot: false,
  liveReload: false,
  progress: false,
  overlay: false
};
var parsedResourceQuery = (0,_utils_parseURL_js__WEBPACK_IMPORTED_MODULE_2__["default"])(__resourceQuery);
var enabledFeatures = {
  "Hot Module Replacement": false,
  "Live Reloading": false,
  Progress: false,
  Overlay: false
};
if (parsedResourceQuery.hot === "true") {
  options.hot = true;
  enabledFeatures["Hot Module Replacement"] = true;
}
if (parsedResourceQuery["live-reload"] === "true") {
  options.liveReload = true;
  enabledFeatures["Live Reloading"] = true;
}
if (parsedResourceQuery.progress === "true") {
  options.progress = true;
  enabledFeatures.Progress = true;
}
if (parsedResourceQuery.overlay) {
  try {
    options.overlay = JSON.parse(parsedResourceQuery.overlay);
  } catch (e) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error("Error parsing overlay options from resource query:", e);
  }

  // Fill in default "true" params for partially-specified objects.
  if (typeof options.overlay === "object") {
    options.overlay = _objectSpread({
      errors: true,
      warnings: true,
      runtimeErrors: true
    }, options.overlay);
    decodeOverlayOptions(options.overlay);
  }
  enabledFeatures.Overlay = true;
}
if (parsedResourceQuery.logging) {
  options.logging = parsedResourceQuery.logging;
}
if (typeof parsedResourceQuery.reconnect !== "undefined") {
  options.reconnect = Number(parsedResourceQuery.reconnect);
}

/**
 * @param {string} level
 */
function setAllLogLevel(level) {
  // This is needed because the HMR logger operate separately from dev server logger
  webpack_hot_log_js__WEBPACK_IMPORTED_MODULE_0___default().setLogLevel(level === "verbose" || level === "log" ? "info" : level);
  (0,_utils_log_js__WEBPACK_IMPORTED_MODULE_5__.setLogLevel)(level);
}
if (options.logging) {
  setAllLogLevel(options.logging);
}
(0,_utils_log_js__WEBPACK_IMPORTED_MODULE_5__.logEnabledFeatures)(enabledFeatures);
self.addEventListener("beforeunload", function () {
  status.isUnloading = true;
});
var overlay = typeof window !== "undefined" ? (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.createOverlay)(typeof options.overlay === "object" ? {
  trustedTypesPolicyName: options.overlay.trustedTypesPolicyName,
  catchRuntimeError: options.overlay.runtimeErrors
} : {
  trustedTypesPolicyName: false,
  catchRuntimeError: options.overlay
}) : {
  send: function send() {}
};
var onSocketMessage = {
  hot: function hot() {
    if (parsedResourceQuery.hot === "false") {
      return;
    }
    options.hot = true;
  },
  liveReload: function liveReload() {
    if (parsedResourceQuery["live-reload"] === "false") {
      return;
    }
    options.liveReload = true;
  },
  invalid: function invalid() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("App updated. Recompiling...");

    // Fixes #1042. overlay doesn't clear if errors are fixed but warnings remain.
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Invalid");
  },
  /**
   * @param {string} hash
   */
  hash: function hash(_hash) {
    status.previousHash = status.currentHash;
    status.currentHash = _hash;
  },
  logging: setAllLogLevel,
  /**
   * @param {boolean} value
   */
  overlay: function overlay(value) {
    if (typeof document === "undefined") {
      return;
    }
    options.overlay = value;
    decodeOverlayOptions(options.overlay);
  },
  /**
   * @param {number} value
   */
  reconnect: function reconnect(value) {
    if (parsedResourceQuery.reconnect === "false") {
      return;
    }
    options.reconnect = value;
  },
  /**
   * @param {boolean} value
   */
  progress: function progress(value) {
    options.progress = value;
  },
  /**
   * @param {{ pluginName?: string, percent: number, msg: string }} data
   */
  "progress-update": function progressUpdate(data) {
    if (options.progress) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(data.pluginName ? "[".concat(data.pluginName, "] ") : "").concat(data.percent, "% - ").concat(data.msg, "."));
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Progress", data);
  },
  "still-ok": function stillOk() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("Nothing changed.");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("StillOk");
  },
  ok: function ok() {
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Ok");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__["default"])(options, status);
  },
  // TODO: remove in v5 in favor of 'static-changed'
  /**
   * @param {string} file
   */
  "content-changed": function contentChanged(file) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(file ? "\"".concat(file, "\"") : "Content", " from static directory was changed. Reloading..."));
    self.location.reload();
  },
  /**
   * @param {string} file
   */
  "static-changed": function staticChanged(file) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("".concat(file ? "\"".concat(file, "\"") : "Content", " from static directory was changed. Reloading..."));
    self.location.reload();
  },
  /**
   * @param {Error[]} warnings
   * @param {any} params
   */
  warnings: function warnings(_warnings, params) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.warn("Warnings while compiling.");
    var printableWarnings = _warnings.map(function (error) {
      var _formatProblem = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.formatProblem)("warning", error),
        header = _formatProblem.header,
        body = _formatProblem.body;
      return "".concat(header, "\n").concat((0,_utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__["default"])(body));
    });
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Warnings", printableWarnings);
    for (var i = 0; i < printableWarnings.length; i++) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.warn(printableWarnings[i]);
    }
    var overlayWarningsSetting = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.warnings;
    if (overlayWarningsSetting) {
      var warningsToDisplay = typeof overlayWarningsSetting === "function" ? _warnings.filter(overlayWarningsSetting) : _warnings;
      if (warningsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "warning",
          messages: _warnings
        });
      }
    }
    if (params && params.preventReloading) {
      return;
    }
    (0,_utils_reloadApp_js__WEBPACK_IMPORTED_MODULE_7__["default"])(options, status);
  },
  /**
   * @param {Error[]} errors
   */
  errors: function errors(_errors) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error("Errors while compiling. Reload prevented.");
    var printableErrors = _errors.map(function (error) {
      var _formatProblem2 = (0,_overlay_js__WEBPACK_IMPORTED_MODULE_4__.formatProblem)("error", error),
        header = _formatProblem2.header,
        body = _formatProblem2.body;
      return "".concat(header, "\n").concat((0,_utils_stripAnsi_js__WEBPACK_IMPORTED_MODULE_1__["default"])(body));
    });
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Errors", printableErrors);
    for (var i = 0; i < printableErrors.length; i++) {
      _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error(printableErrors[i]);
    }
    var overlayErrorsSettings = typeof options.overlay === "boolean" ? options.overlay : options.overlay && options.overlay.errors;
    if (overlayErrorsSettings) {
      var errorsToDisplay = typeof overlayErrorsSettings === "function" ? _errors.filter(overlayErrorsSettings) : _errors;
      if (errorsToDisplay.length) {
        overlay.send({
          type: "BUILD_ERROR",
          level: "error",
          messages: _errors
        });
      }
    }
  },
  /**
   * @param {Error} error
   */
  error: function error(_error) {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.error(_error);
  },
  close: function close() {
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.info("Disconnected!");
    if (options.overlay) {
      overlay.send({
        type: "DISMISS"
      });
    }
    (0,_utils_sendMessage_js__WEBPACK_IMPORTED_MODULE_6__["default"])("Close");
  }
};
var socketURL = (0,_utils_createSocketURL_js__WEBPACK_IMPORTED_MODULE_8__["default"])(parsedResourceQuery);
(0,_socket_js__WEBPACK_IMPORTED_MODULE_3__["default"])(socketURL, onSocketMessage, options.reconnect);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/modules/logger/index.js":
/*!************************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/modules/logger/index.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, exports) => {

/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./client-src/modules/logger/SyncBailHookFake.js":
/*!*******************************************************!*\
  !*** ./client-src/modules/logger/SyncBailHookFake.js ***!
  \*******************************************************/
/***/ (function(module) {



/**
 * Client stub for tapable SyncBailHook
 */
module.exports = function clientTapableSyncBailHook() {
  return {
    call: function call() {}
  };
};

/***/ }),

/***/ "./node_modules/webpack/lib/logging/Logger.js":
/*!****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/Logger.js ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) !== "undefined" && iter[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}
function _toPropertyKey(arg) {
  var key = _toPrimitive(arg, "string");
  return typeof key === "symbol" ? key : String(key);
}
function _toPrimitive(input, hint) {
  if (typeof input !== "object" || input === null) return input;
  var prim = input[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).toPrimitive];
  if (prim !== undefined) {
    var res = prim.call(input, hint || "default");
    if (typeof res !== "object") return res;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (hint === "string" ? String : Number)(input);
}
var LogType = Object.freeze({
  error: /** @type {"error"} */"error",
  // message, c style arguments
  warn: /** @type {"warn"} */"warn",
  // message, c style arguments
  info: /** @type {"info"} */"info",
  // message, c style arguments
  log: /** @type {"log"} */"log",
  // message, c style arguments
  debug: /** @type {"debug"} */"debug",
  // message, c style arguments

  trace: /** @type {"trace"} */"trace",
  // no arguments

  group: /** @type {"group"} */"group",
  // [label]
  groupCollapsed: /** @type {"groupCollapsed"} */"groupCollapsed",
  // [label]
  groupEnd: /** @type {"groupEnd"} */"groupEnd",
  // [label]

  profile: /** @type {"profile"} */"profile",
  // [profileName]
  profileEnd: /** @type {"profileEnd"} */"profileEnd",
  // [profileName]

  time: /** @type {"time"} */"time",
  // name, time as [seconds, nanoseconds]

  clear: /** @type {"clear"} */"clear",
  // no arguments
  status: /** @type {"status"} */"status" // message, arguments
});

exports.LogType = LogType;

/** @typedef {typeof LogType[keyof typeof LogType]} LogTypeEnum */

var LOG_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger raw log method");
var TIMERS_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger times");
var TIMERS_AGGREGATES_SYMBOL = (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; })("webpack logger aggregated times");
var WebpackLogger = /*#__PURE__*/function () {
  /**
   * @param {function(LogTypeEnum, any[]=): void} log log function
   * @param {function(string | function(): string): WebpackLogger} getChildLogger function to create child logger
   */
  function WebpackLogger(log, getChildLogger) {
    _classCallCheck(this, WebpackLogger);
    this[LOG_SYMBOL] = log;
    this.getChildLogger = getChildLogger;
  }
  _createClass(WebpackLogger, [{
    key: "error",
    value: function error() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      this[LOG_SYMBOL](LogType.error, args);
    }
  }, {
    key: "warn",
    value: function warn() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      this[LOG_SYMBOL](LogType.warn, args);
    }
  }, {
    key: "info",
    value: function info() {
      for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
      }
      this[LOG_SYMBOL](LogType.info, args);
    }
  }, {
    key: "log",
    value: function log() {
      for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
      }
      this[LOG_SYMBOL](LogType.log, args);
    }
  }, {
    key: "debug",
    value: function debug() {
      for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
      }
      this[LOG_SYMBOL](LogType.debug, args);
    }
  }, {
    key: "assert",
    value: function assert(assertion) {
      if (!assertion) {
        for (var _len6 = arguments.length, args = new Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
          args[_key6 - 1] = arguments[_key6];
        }
        this[LOG_SYMBOL](LogType.error, args);
      }
    }
  }, {
    key: "trace",
    value: function trace() {
      this[LOG_SYMBOL](LogType.trace, ["Trace"]);
    }
  }, {
    key: "clear",
    value: function clear() {
      this[LOG_SYMBOL](LogType.clear);
    }
  }, {
    key: "status",
    value: function status() {
      for (var _len7 = arguments.length, args = new Array(_len7), _key7 = 0; _key7 < _len7; _key7++) {
        args[_key7] = arguments[_key7];
      }
      this[LOG_SYMBOL](LogType.status, args);
    }
  }, {
    key: "group",
    value: function group() {
      for (var _len8 = arguments.length, args = new Array(_len8), _key8 = 0; _key8 < _len8; _key8++) {
        args[_key8] = arguments[_key8];
      }
      this[LOG_SYMBOL](LogType.group, args);
    }
  }, {
    key: "groupCollapsed",
    value: function groupCollapsed() {
      for (var _len9 = arguments.length, args = new Array(_len9), _key9 = 0; _key9 < _len9; _key9++) {
        args[_key9] = arguments[_key9];
      }
      this[LOG_SYMBOL](LogType.groupCollapsed, args);
    }
  }, {
    key: "groupEnd",
    value: function groupEnd() {
      for (var _len10 = arguments.length, args = new Array(_len10), _key10 = 0; _key10 < _len10; _key10++) {
        args[_key10] = arguments[_key10];
      }
      this[LOG_SYMBOL](LogType.groupEnd, args);
    }
  }, {
    key: "profile",
    value: function profile(label) {
      this[LOG_SYMBOL](LogType.profile, [label]);
    }
  }, {
    key: "profileEnd",
    value: function profileEnd(label) {
      this[LOG_SYMBOL](LogType.profileEnd, [label]);
    }
  }, {
    key: "time",
    value: function time(label) {
      this[TIMERS_SYMBOL] = this[TIMERS_SYMBOL] || new Map();
      this[TIMERS_SYMBOL].set(label, process.hrtime());
    }
  }, {
    key: "timeLog",
    value: function timeLog(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeLog()"));
      }
      var time = process.hrtime(prev);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }, {
    key: "timeEnd",
    value: function timeEnd(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeEnd()"));
      }
      var time = process.hrtime(prev);
      this[TIMERS_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }, {
    key: "timeAggregate",
    value: function timeAggregate(label) {
      var prev = this[TIMERS_SYMBOL] && this[TIMERS_SYMBOL].get(label);
      if (!prev) {
        throw new Error("No such label '".concat(label, "' for WebpackLogger.timeAggregate()"));
      }
      var time = process.hrtime(prev);
      this[TIMERS_SYMBOL].delete(label);
      this[TIMERS_AGGREGATES_SYMBOL] = this[TIMERS_AGGREGATES_SYMBOL] || new Map();
      var current = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (current !== undefined) {
        if (time[1] + current[1] > 1e9) {
          time[0] += current[0] + 1;
          time[1] = time[1] - 1e9 + current[1];
        } else {
          time[0] += current[0];
          time[1] += current[1];
        }
      }
      this[TIMERS_AGGREGATES_SYMBOL].set(label, time);
    }
  }, {
    key: "timeAggregateEnd",
    value: function timeAggregateEnd(label) {
      if (this[TIMERS_AGGREGATES_SYMBOL] === undefined) return;
      var time = this[TIMERS_AGGREGATES_SYMBOL].get(label);
      if (time === undefined) return;
      this[TIMERS_AGGREGATES_SYMBOL].delete(label);
      this[LOG_SYMBOL](LogType.time, [label].concat(_toConsumableArray(time)));
    }
  }]);
  return WebpackLogger;
}();
exports.Logger = WebpackLogger;

/***/ }),

/***/ "./node_modules/webpack/lib/logging/createConsoleLogger.js":
/*!*****************************************************************!*\
  !*** ./node_modules/webpack/lib/logging/createConsoleLogger.js ***!
  \*****************************************************************/
/***/ (function(module, __unused_webpack_exports, __nested_webpack_require_11285__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _iterableToArray(iter) {
  if (typeof (typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }) !== "undefined" && iter[(typeof Symbol !== "undefined" ? Symbol : function (i) { return i; }).iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;
  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
  return arr2;
}
var _require = __nested_webpack_require_11285__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  LogType = _require.LogType;

/** @typedef {import("../../declarations/WebpackOptions").FilterItemTypes} FilterItemTypes */
/** @typedef {import("../../declarations/WebpackOptions").FilterTypes} FilterTypes */
/** @typedef {import("./Logger").LogTypeEnum} LogTypeEnum */

/** @typedef {function(string): boolean} FilterFunction */

/**
 * @typedef {Object} LoggerConsole
 * @property {function(): void} clear
 * @property {function(): void} trace
 * @property {(...args: any[]) => void} info
 * @property {(...args: any[]) => void} log
 * @property {(...args: any[]) => void} warn
 * @property {(...args: any[]) => void} error
 * @property {(...args: any[]) => void=} debug
 * @property {(...args: any[]) => void=} group
 * @property {(...args: any[]) => void=} groupCollapsed
 * @property {(...args: any[]) => void=} groupEnd
 * @property {(...args: any[]) => void=} status
 * @property {(...args: any[]) => void=} profile
 * @property {(...args: any[]) => void=} profileEnd
 * @property {(...args: any[]) => void=} logTime
 */

/**
 * @typedef {Object} LoggerOptions
 * @property {false|true|"none"|"error"|"warn"|"info"|"log"|"verbose"} level loglevel
 * @property {FilterTypes|boolean} debug filter for debug logging
 * @property {LoggerConsole} console the console to log to
 */

/**
 * @param {FilterItemTypes} item an input item
 * @returns {FilterFunction} filter function
 */
var filterToFunction = function filterToFunction(item) {
  if (typeof item === "string") {
    var regExp = new RegExp("[\\\\/]".concat(item.replace(
    // eslint-disable-next-line no-useless-escape
    /[-[\]{}()*+?.\\^$|]/g, "\\$&"), "([\\\\/]|$|!|\\?)"));
    return function (ident) {
      return regExp.test(ident);
    };
  }
  if (item && typeof item === "object" && typeof item.test === "function") {
    return function (ident) {
      return item.test(ident);
    };
  }
  if (typeof item === "function") {
    return item;
  }
  if (typeof item === "boolean") {
    return function () {
      return item;
    };
  }
};

/**
 * @enum {number}
 */
var LogLevel = {
  none: 6,
  false: 6,
  error: 5,
  warn: 4,
  info: 3,
  log: 2,
  true: 2,
  verbose: 1
};

/**
 * @param {LoggerOptions} options options object
 * @returns {function(string, LogTypeEnum, any[]): void} logging function
 */
module.exports = function (_ref) {
  var _ref$level = _ref.level,
    level = _ref$level === void 0 ? "info" : _ref$level,
    _ref$debug = _ref.debug,
    debug = _ref$debug === void 0 ? false : _ref$debug,
    console = _ref.console;
  var debugFilters = typeof debug === "boolean" ? [function () {
    return debug;
  }] : /** @type {FilterItemTypes[]} */[].concat(debug).map(filterToFunction);
  /** @type {number} */
  var loglevel = LogLevel["".concat(level)] || 0;

  /**
   * @param {string} name name of the logger
   * @param {LogTypeEnum} type type of the log entry
   * @param {any[]} args arguments of the log entry
   * @returns {void}
   */
  var logger = function logger(name, type, args) {
    var labeledArgs = function labeledArgs() {
      if (Array.isArray(args)) {
        if (args.length > 0 && typeof args[0] === "string") {
          return ["[".concat(name, "] ").concat(args[0])].concat(_toConsumableArray(args.slice(1)));
        } else {
          return ["[".concat(name, "]")].concat(_toConsumableArray(args));
        }
      } else {
        return [];
      }
    };
    var debug = debugFilters.some(function (f) {
      return f(name);
    });
    switch (type) {
      case LogType.debug:
        if (!debug) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.debug === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.debug.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.log:
        if (!debug && loglevel > LogLevel.log) return;
        console.log.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.info:
        if (!debug && loglevel > LogLevel.info) return;
        console.info.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.warn:
        if (!debug && loglevel > LogLevel.warn) return;
        console.warn.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.error:
        if (!debug && loglevel > LogLevel.error) return;
        console.error.apply(console, _toConsumableArray(labeledArgs()));
        break;
      case LogType.trace:
        if (!debug) return;
        console.trace();
        break;
      case LogType.groupCollapsed:
        if (!debug && loglevel > LogLevel.log) return;
        if (!debug && loglevel > LogLevel.verbose) {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          if (typeof console.groupCollapsed === "function") {
            // eslint-disable-next-line node/no-unsupported-features/node-builtins
            console.groupCollapsed.apply(console, _toConsumableArray(labeledArgs()));
          } else {
            console.log.apply(console, _toConsumableArray(labeledArgs()));
          }
          break;
        }
      // falls through
      case LogType.group:
        if (!debug && loglevel > LogLevel.log) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.group === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.group.apply(console, _toConsumableArray(labeledArgs()));
        } else {
          console.log.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.groupEnd:
        if (!debug && loglevel > LogLevel.log) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.groupEnd === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.groupEnd();
        }
        break;
      case LogType.time:
        {
          if (!debug && loglevel > LogLevel.log) return;
          var ms = args[1] * 1000 + args[2] / 1000000;
          var msg = "[".concat(name, "] ").concat(args[0], ": ").concat(ms, " ms");
          if (typeof console.logTime === "function") {
            console.logTime(msg);
          } else {
            console.log(msg);
          }
          break;
        }
      case LogType.profile:
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.profile === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.profile.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.profileEnd:
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.profileEnd === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.profileEnd.apply(console, _toConsumableArray(labeledArgs()));
        }
        break;
      case LogType.clear:
        if (!debug && loglevel > LogLevel.log) return;
        // eslint-disable-next-line node/no-unsupported-features/node-builtins
        if (typeof console.clear === "function") {
          // eslint-disable-next-line node/no-unsupported-features/node-builtins
          console.clear();
        }
        break;
      case LogType.status:
        if (!debug && loglevel > LogLevel.info) return;
        if (typeof console.status === "function") {
          if (args.length === 0) {
            console.status();
          } else {
            console.status.apply(console, _toConsumableArray(labeledArgs()));
          }
        } else {
          if (args.length !== 0) {
            console.info.apply(console, _toConsumableArray(labeledArgs()));
          }
        }
        break;
      default:
        throw new Error("Unexpected LogType ".concat(type));
    }
  };
  return logger;
};

/***/ }),

/***/ "./node_modules/webpack/lib/logging/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/webpack/lib/logging/runtime.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __nested_webpack_require_21334__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/



function _extends() {
  _extends = Object.assign ? Object.assign.bind() : function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}
var SyncBailHook = __nested_webpack_require_21334__(/*! tapable/lib/SyncBailHook */ "./client-src/modules/logger/SyncBailHookFake.js");
var _require = __nested_webpack_require_21334__(/*! ./Logger */ "./node_modules/webpack/lib/logging/Logger.js"),
  Logger = _require.Logger;
var createConsoleLogger = __nested_webpack_require_21334__(/*! ./createConsoleLogger */ "./node_modules/webpack/lib/logging/createConsoleLogger.js");

/** @type {createConsoleLogger.LoggerOptions} */
var currentDefaultLoggerOptions = {
  level: "info",
  debug: false,
  console: console
};
var currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);

/**
 * @param {string} name name of the logger
 * @returns {Logger} a logger
 */
exports.getLogger = function (name) {
  return new Logger(function (type, args) {
    if (exports.hooks.log.call(name, type, args) === undefined) {
      currentDefaultLogger(name, type, args);
    }
  }, function (childName) {
    return exports.getLogger("".concat(name, "/").concat(childName));
  });
};

/**
 * @param {createConsoleLogger.LoggerOptions} options new options, merge with old options
 * @returns {void}
 */
exports.configureDefaultLogger = function (options) {
  _extends(currentDefaultLoggerOptions, options);
  currentDefaultLogger = createConsoleLogger(currentDefaultLoggerOptions);
};
exports.hooks = {
  log: new SyncBailHook(["origin", "type", "args"])
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __nested_webpack_require_23461__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __nested_webpack_require_23461__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__nested_webpack_require_23461__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__nested_webpack_require_23461__.o(definition, key) && !__nested_webpack_require_23461__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__nested_webpack_require_23461__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__nested_webpack_require_23461__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __nested_webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!********************************************!*\
  !*** ./client-src/modules/logger/index.js ***!
  \********************************************/
__nested_webpack_require_23461__.r(__nested_webpack_exports__);
/* harmony export */ __nested_webpack_require_23461__.d(__nested_webpack_exports__, {
/* harmony export */   "default": function() { return /* reexport default export from named module */ webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__; }
/* harmony export */ });
/* harmony import */ var webpack_lib_logging_runtime_js__WEBPACK_IMPORTED_MODULE_0__ = __nested_webpack_require_23461__(/*! webpack/lib/logging/runtime.js */ "./node_modules/webpack/lib/logging/runtime.js");

}();
var __webpack_export_target__ = exports;
for(var i in __nested_webpack_exports__) __webpack_export_target__[i] = __nested_webpack_exports__[i];
if(__nested_webpack_exports__.__esModule) Object.defineProperty(__webpack_export_target__, "__esModule", { value: true });
/******/ })()
;

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/overlay.js":
/*!***********************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/overlay.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createOverlay: () => (/* binding */ createOverlay),
/* harmony export */   formatProblem: () => (/* binding */ formatProblem)
/* harmony export */ });
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ansi-html-community */ "./node_modules/ansi-html-community/index.js");
/* harmony import */ var ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ansi_html_community__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! html-entities */ "./node_modules/html-entities/lib/index.js");
/* harmony import */ var html_entities__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(html_entities__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./overlay/runtime-error.js */ "./node_modules/webpack-dev-server/client/overlay/runtime-error.js");
/* harmony import */ var _overlay_state_machine_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./overlay/state-machine.js */ "./node_modules/webpack-dev-server/client/overlay/state-machine.js");
/* harmony import */ var _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./overlay/styles.js */ "./node_modules/webpack-dev-server/client/overlay/styles.js");
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
// The error overlay is inspired (and mostly copied) from Create React App (https://github.com/facebookincubator/create-react-app)
// They, in turn, got inspired by webpack-hot-middleware (https://github.com/glenjamin/webpack-hot-middleware).






var colors = {
  reset: ["transparent", "transparent"],
  black: "181818",
  red: "E36049",
  green: "B3CB74",
  yellow: "FFD080",
  blue: "7CAFC2",
  magenta: "7FACCA",
  cyan: "C3C2EF",
  lightgrey: "EBE7E3",
  darkgrey: "6D7891"
};
ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default().setColors(colors);

/**
 * @param {string} type
 * @param {string  | { file?: string, moduleName?: string, loc?: string, message?: string; stack?: string[] }} item
 * @returns {{ header: string, body: string }}
 */
function formatProblem(type, item) {
  var header = type === "warning" ? "WARNING" : "ERROR";
  var body = "";
  if (typeof item === "string") {
    body += item;
  } else {
    var file = item.file || "";
    // eslint-disable-next-line no-nested-ternary
    var moduleName = item.moduleName ? item.moduleName.indexOf("!") !== -1 ? "".concat(item.moduleName.replace(/^(\s|\S)*!/, ""), " (").concat(item.moduleName, ")") : "".concat(item.moduleName) : "";
    var loc = item.loc;
    header += "".concat(moduleName || file ? " in ".concat(moduleName ? "".concat(moduleName).concat(file ? " (".concat(file, ")") : "") : file).concat(loc ? " ".concat(loc) : "") : "");
    body += item.message || "";
  }
  if (Array.isArray(item.stack)) {
    item.stack.forEach(function (stack) {
      if (typeof stack === "string") {
        body += "\r\n".concat(stack);
      }
    });
  }
  return {
    header: header,
    body: body
  };
}

/**
 * @typedef {Object} CreateOverlayOptions
 * @property {string | null} trustedTypesPolicyName
 * @property {boolean | (error: Error) => void} [catchRuntimeError]
 */

/**
 *
 * @param {CreateOverlayOptions} options
 */
var createOverlay = function createOverlay(options) {
  /** @type {HTMLIFrameElement | null | undefined} */
  var iframeContainerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var containerElement;
  /** @type {HTMLDivElement | null | undefined} */
  var headerElement;
  /** @type {Array<(element: HTMLDivElement) => void>} */
  var onLoadQueue = [];
  /** @type {TrustedTypePolicy | undefined} */
  var overlayTrustedTypesPolicy;

  /**
   *
   * @param {HTMLElement} element
   * @param {CSSStyleDeclaration} style
   */
  function applyStyle(element, style) {
    Object.keys(style).forEach(function (prop) {
      element.style[prop] = style[prop];
    });
  }

  /**
   * @param {string | null} trustedTypesPolicyName
   */
  function createContainer(trustedTypesPolicyName) {
    // Enable Trusted Types if they are available in the current browser.
    if (window.trustedTypes) {
      overlayTrustedTypesPolicy = window.trustedTypes.createPolicy(trustedTypesPolicyName || "webpack-dev-server#overlay", {
        createHTML: function createHTML(value) {
          return value;
        }
      });
    }
    iframeContainerElement = document.createElement("iframe");
    iframeContainerElement.id = "webpack-dev-server-client-overlay";
    iframeContainerElement.src = "about:blank";
    applyStyle(iframeContainerElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.iframeStyle);
    iframeContainerElement.onload = function () {
      var contentElement = /** @type {Document} */
      /** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument.createElement("div");
      containerElement = /** @type {Document} */
      /** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument.createElement("div");
      contentElement.id = "webpack-dev-server-client-overlay-div";
      applyStyle(contentElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.containerStyle);
      headerElement = document.createElement("div");
      headerElement.innerText = "Compiled with problems:";
      applyStyle(headerElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.headerStyle);
      var closeButtonElement = document.createElement("button");
      applyStyle(closeButtonElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.dismissButtonStyle);
      closeButtonElement.innerText = "×";
      closeButtonElement.ariaLabel = "Dismiss";
      closeButtonElement.addEventListener("click", function () {
        // eslint-disable-next-line no-use-before-define
        overlayService.send({
          type: "DISMISS"
        });
      });
      contentElement.appendChild(headerElement);
      contentElement.appendChild(closeButtonElement);
      contentElement.appendChild(containerElement);

      /** @type {Document} */
      /** @type {HTMLIFrameElement} */
      iframeContainerElement.contentDocument.body.appendChild(contentElement);
      onLoadQueue.forEach(function (onLoad) {
        onLoad( /** @type {HTMLDivElement} */contentElement);
      });
      onLoadQueue = [];

      /** @type {HTMLIFrameElement} */
      iframeContainerElement.onload = null;
    };
    document.body.appendChild(iframeContainerElement);
  }

  /**
   * @param {(element: HTMLDivElement) => void} callback
   * @param {string | null} trustedTypesPolicyName
   */
  function ensureOverlayExists(callback, trustedTypesPolicyName) {
    if (containerElement) {
      containerElement.innerHTML = "";
      // Everything is ready, call the callback right away.
      callback(containerElement);
      return;
    }
    onLoadQueue.push(callback);
    if (iframeContainerElement) {
      return;
    }
    createContainer(trustedTypesPolicyName);
  }

  // Successful compilation.
  function hide() {
    if (!iframeContainerElement) {
      return;
    }

    // Clean up and reset internal state.
    document.body.removeChild(iframeContainerElement);
    iframeContainerElement = null;
    containerElement = null;
  }

  // Compilation with errors (e.g. syntax error or missing modules).
  /**
   * @param {string} type
   * @param {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
   * @param {string | null} trustedTypesPolicyName
   * @param {'build' | 'runtime'} messageSource
   */
  function show(type, messages, trustedTypesPolicyName, messageSource) {
    ensureOverlayExists(function () {
      headerElement.innerText = messageSource === "runtime" ? "Uncaught runtime errors:" : "Compiled with problems:";
      messages.forEach(function (message) {
        var entryElement = document.createElement("div");
        var msgStyle = type === "warning" ? _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgStyles.warning : _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgStyles.error;
        applyStyle(entryElement, _objectSpread(_objectSpread({}, msgStyle), {}, {
          padding: "1rem 1rem 1.5rem 1rem"
        }));
        var typeElement = document.createElement("div");
        var _formatProblem = formatProblem(type, message),
          header = _formatProblem.header,
          body = _formatProblem.body;
        typeElement.innerText = header;
        applyStyle(typeElement, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgTypeStyle);
        if (message.moduleIdentifier) {
          applyStyle(typeElement, {
            cursor: "pointer"
          });
          // element.dataset not supported in IE
          typeElement.setAttribute("data-can-open", true);
          typeElement.addEventListener("click", function () {
            fetch("/webpack-dev-server/open-editor?fileName=".concat(message.moduleIdentifier));
          });
        }

        // Make it look similar to our terminal.
        var text = ansi_html_community__WEBPACK_IMPORTED_MODULE_0___default()((0,html_entities__WEBPACK_IMPORTED_MODULE_4__.encode)(body));
        var messageTextNode = document.createElement("div");
        applyStyle(messageTextNode, _overlay_styles_js__WEBPACK_IMPORTED_MODULE_3__.msgTextStyle);
        messageTextNode.innerHTML = overlayTrustedTypesPolicy ? overlayTrustedTypesPolicy.createHTML(text) : text;
        entryElement.appendChild(typeElement);
        entryElement.appendChild(messageTextNode);

        /** @type {HTMLDivElement} */
        containerElement.appendChild(entryElement);
      });
    }, trustedTypesPolicyName);
  }
  var overlayService = (0,_overlay_state_machine_js__WEBPACK_IMPORTED_MODULE_2__["default"])({
    showOverlay: function showOverlay(_ref) {
      var _ref$level = _ref.level,
        level = _ref$level === void 0 ? "error" : _ref$level,
        messages = _ref.messages,
        messageSource = _ref.messageSource;
      return show(level, messages, options.trustedTypesPolicyName, messageSource);
    },
    hideOverlay: hide
  });
  if (options.catchRuntimeError) {
    /**
     * @param {Error | undefined} error
     * @param {string} fallbackMessage
     */
    var handleError = function handleError(error, fallbackMessage) {
      var errorObject = error instanceof Error ? error : new Error(error || fallbackMessage);
      var shouldDisplay = typeof options.catchRuntimeError === "function" ? options.catchRuntimeError(errorObject) : true;
      if (shouldDisplay) {
        overlayService.send({
          type: "RUNTIME_ERROR",
          messages: [{
            message: errorObject.message,
            stack: (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.parseErrorToStacks)(errorObject)
          }]
        });
      }
    };
    (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.listenToRuntimeError)(function (errorEvent) {
      // error property may be empty in older browser like IE
      var error = errorEvent.error,
        message = errorEvent.message;
      if (!error && !message) {
        return;
      }
      handleError(error, message);
    });
    (0,_overlay_runtime_error_js__WEBPACK_IMPORTED_MODULE_1__.listenToUnhandledRejection)(function (promiseRejectionEvent) {
      var reason = promiseRejectionEvent.reason;
      handleError(reason, "Unknown promise rejection reason");
    });
  }
  return overlayService;
};


/***/ }),

/***/ "./node_modules/webpack-dev-server/client/overlay/fsm.js":
/*!***************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/overlay/fsm.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return typeof key === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (typeof input !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (typeof res !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
/**
 * @typedef {Object} StateDefinitions
 * @property {{[event: string]: { target: string; actions?: Array<string> }}} [on]
 */

/**
 * @typedef {Object} Options
 * @property {{[state: string]: StateDefinitions}} states
 * @property {object} context;
 * @property {string} initial
 */

/**
 * @typedef {Object} Implementation
 * @property {{[actionName: string]: (ctx: object, event: any) => object}} actions
 */

/**
 * A simplified `createMachine` from `@xstate/fsm` with the following differences:
 *
 *  - the returned machine is technically a "service". No `interpret(machine).start()` is needed.
 *  - the state definition only support `on` and target must be declared with { target: 'nextState', actions: [] } explicitly.
 *  - event passed to `send` must be an object with `type` property.
 *  - actions implementation will be [assign action](https://xstate.js.org/docs/guides/context.html#assign-action) if you return any value.
 *  Do not return anything if you just want to invoke side effect.
 *
 * The goal of this custom function is to avoid installing the entire `'xstate/fsm'` package, while enabling modeling using
 * state machine. You can copy the first parameter into the editor at https://stately.ai/viz to visualize the state machine.
 *
 * @param {Options} options
 * @param {Implementation} implementation
 */
function createMachine(_ref, _ref2) {
  var states = _ref.states,
    context = _ref.context,
    initial = _ref.initial;
  var actions = _ref2.actions;
  var currentState = initial;
  var currentContext = context;
  return {
    send: function send(event) {
      var currentStateOn = states[currentState].on;
      var transitionConfig = currentStateOn && currentStateOn[event.type];
      if (transitionConfig) {
        currentState = transitionConfig.target;
        if (transitionConfig.actions) {
          transitionConfig.actions.forEach(function (actName) {
            var actionImpl = actions[actName];
            var nextContextValue = actionImpl && actionImpl(currentContext, event);
            if (nextContextValue) {
              currentContext = _objectSpread(_objectSpread({}, currentContext), nextContextValue);
            }
          });
        }
      }
    }
  };
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createMachine);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/overlay/runtime-error.js":
/*!*************************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/overlay/runtime-error.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   listenToRuntimeError: () => (/* binding */ listenToRuntimeError),
/* harmony export */   listenToUnhandledRejection: () => (/* binding */ listenToUnhandledRejection),
/* harmony export */   parseErrorToStacks: () => (/* binding */ parseErrorToStacks)
/* harmony export */ });
/**
 *
 * @param {Error} error
 */
function parseErrorToStacks(error) {
  if (!error || !(error instanceof Error)) {
    throw new Error("parseErrorToStacks expects Error object");
  }
  if (typeof error.stack === "string") {
    return error.stack.split("\n").filter(function (stack) {
      return stack !== "Error: ".concat(error.message);
    });
  }
}

/**
 * @callback ErrorCallback
 * @param {ErrorEvent} error
 * @returns {void}
 */

/**
 * @param {ErrorCallback} callback
 */
function listenToRuntimeError(callback) {
  window.addEventListener("error", callback);
  return function cleanup() {
    window.removeEventListener("error", callback);
  };
}

/**
 * @callback UnhandledRejectionCallback
 * @param {PromiseRejectionEvent} rejectionEvent
 * @returns {void}
 */

/**
 * @param {UnhandledRejectionCallback} callback
 */
function listenToUnhandledRejection(callback) {
  window.addEventListener("unhandledrejection", callback);
  return function cleanup() {
    window.removeEventListener("unhandledrejection", callback);
  };
}


/***/ }),

/***/ "./node_modules/webpack-dev-server/client/overlay/state-machine.js":
/*!*************************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/overlay/state-machine.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _fsm_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./fsm.js */ "./node_modules/webpack-dev-server/client/overlay/fsm.js");


/**
 * @typedef {Object} ShowOverlayData
 * @property {'warning' | 'error'} level
 * @property {Array<string  | { moduleIdentifier?: string, moduleName?: string, loc?: string, message?: string }>} messages
 * @property {'build' | 'runtime'} messageSource
 */

/**
 * @typedef {Object} CreateOverlayMachineOptions
 * @property {(data: ShowOverlayData) => void} showOverlay
 * @property {() => void} hideOverlay
 */

/**
 * @param {CreateOverlayMachineOptions} options
 */
var createOverlayMachine = function createOverlayMachine(options) {
  var hideOverlay = options.hideOverlay,
    showOverlay = options.showOverlay;
  var overlayMachine = (0,_fsm_js__WEBPACK_IMPORTED_MODULE_0__["default"])({
    initial: "hidden",
    context: {
      level: "error",
      messages: [],
      messageSource: "build"
    },
    states: {
      hidden: {
        on: {
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      },
      displayBuildError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["appendMessages", "showOverlay"]
          }
        }
      },
      displayRuntimeError: {
        on: {
          DISMISS: {
            target: "hidden",
            actions: ["dismissMessages", "hideOverlay"]
          },
          RUNTIME_ERROR: {
            target: "displayRuntimeError",
            actions: ["appendMessages", "showOverlay"]
          },
          BUILD_ERROR: {
            target: "displayBuildError",
            actions: ["setMessages", "showOverlay"]
          }
        }
      }
    }
  }, {
    actions: {
      dismissMessages: function dismissMessages() {
        return {
          messages: [],
          level: "error",
          messageSource: "build"
        };
      },
      appendMessages: function appendMessages(context, event) {
        return {
          messages: context.messages.concat(event.messages),
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      setMessages: function setMessages(context, event) {
        return {
          messages: event.messages,
          level: event.level || context.level,
          messageSource: event.type === "RUNTIME_ERROR" ? "runtime" : "build"
        };
      },
      hideOverlay: hideOverlay,
      showOverlay: showOverlay
    }
  });
  return overlayMachine;
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createOverlayMachine);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/overlay/styles.js":
/*!******************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/overlay/styles.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   containerStyle: () => (/* binding */ containerStyle),
/* harmony export */   dismissButtonStyle: () => (/* binding */ dismissButtonStyle),
/* harmony export */   headerStyle: () => (/* binding */ headerStyle),
/* harmony export */   iframeStyle: () => (/* binding */ iframeStyle),
/* harmony export */   msgStyles: () => (/* binding */ msgStyles),
/* harmony export */   msgTextStyle: () => (/* binding */ msgTextStyle),
/* harmony export */   msgTypeStyle: () => (/* binding */ msgTypeStyle)
/* harmony export */ });
// styles are inspired by `react-error-overlay`

var msgStyles = {
  error: {
    backgroundColor: "rgba(206, 17, 38, 0.1)",
    color: "#fccfcf"
  },
  warning: {
    backgroundColor: "rgba(251, 245, 180, 0.1)",
    color: "#fbf5b4"
  }
};
var iframeStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  border: "none",
  "z-index": 9999999999
};
var containerStyle = {
  position: "fixed",
  boxSizing: "border-box",
  left: 0,
  top: 0,
  right: 0,
  bottom: 0,
  width: "100vw",
  height: "100vh",
  fontSize: "large",
  padding: "2rem 2rem 4rem 2rem",
  lineHeight: "1.2",
  whiteSpace: "pre-wrap",
  overflow: "auto",
  backgroundColor: "rgba(0, 0, 0, 0.9)",
  color: "white"
};
var headerStyle = {
  color: "#e83b46",
  fontSize: "2em",
  whiteSpace: "pre-wrap",
  fontFamily: "sans-serif",
  margin: "0 2rem 2rem 0",
  flex: "0 0 auto",
  maxHeight: "50%",
  overflow: "auto"
};
var dismissButtonStyle = {
  color: "#ffffff",
  lineHeight: "1rem",
  fontSize: "1.5rem",
  padding: "1rem",
  cursor: "pointer",
  position: "absolute",
  right: 0,
  top: 0,
  backgroundColor: "transparent",
  border: "none"
};
var msgTypeStyle = {
  color: "#e83b46",
  fontSize: "1.2em",
  marginBottom: "1rem",
  fontFamily: "sans-serif"
};
var msgTextStyle = {
  lineHeight: "1.5",
  fontSize: "1rem",
  fontFamily: "Menlo, Consolas, monospace"
};


/***/ }),

/***/ "./node_modules/webpack-dev-server/client/socket.js":
/*!**********************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/socket.js ***!
  \**********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   client: () => (/* binding */ client),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./clients/WebSocketClient.js */ "./node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/log.js */ "./node_modules/webpack-dev-server/client/utils/log.js");
/* provided dependency */ var __webpack_dev_server_client__ = __webpack_require__(/*! ./node_modules/webpack-dev-server/client/clients/WebSocketClient.js */ "./node_modules/webpack-dev-server/client/clients/WebSocketClient.js");
/* global __webpack_dev_server_client__ */




// this WebsocketClient is here as a default fallback, in case the client is not injected
/* eslint-disable camelcase */
var Client =
// eslint-disable-next-line no-nested-ternary
typeof __webpack_dev_server_client__ !== "undefined" ? typeof __webpack_dev_server_client__.default !== "undefined" ? __webpack_dev_server_client__.default : __webpack_dev_server_client__ : _clients_WebSocketClient_js__WEBPACK_IMPORTED_MODULE_0__["default"];
/* eslint-enable camelcase */

var retries = 0;
var maxRetries = 10;

// Initialized client is exported so external consumers can utilize the same instance
// It is mutable to enforce singleton
// eslint-disable-next-line import/no-mutable-exports
var client = null;

/**
 * @param {string} url
 * @param {{ [handler: string]: (data?: any, params?: any) => any }} handlers
 * @param {number} [reconnect]
 */
var socket = function initSocket(url, handlers, reconnect) {
  client = new Client(url);
  client.onOpen(function () {
    retries = 0;
    if (typeof reconnect !== "undefined") {
      maxRetries = reconnect;
    }
  });
  client.onClose(function () {
    if (retries === 0) {
      handlers.close();
    }

    // Try to reconnect.
    client = null;

    // After 10 retries stop trying, to prevent logspam.
    if (retries < maxRetries) {
      // Exponentially increase timeout to reconnect.
      // Respectfully copied from the package `got`.
      // eslint-disable-next-line no-restricted-properties
      var retryInMs = 1000 * Math.pow(2, retries) + Math.random() * 100;
      retries += 1;
      _utils_log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("Trying to reconnect...");
      setTimeout(function () {
        socket(url, handlers, reconnect);
      }, retryInMs);
    }
  });
  client.onMessage(
  /**
   * @param {any} data
   */
  function (data) {
    var message = JSON.parse(data);
    if (handlers[message.type]) {
      handlers[message.type](message.data, message.params);
    }
  });
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (socket);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/createSocketURL.js":
/*!*************************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/utils/createSocketURL.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @param {{ protocol?: string, auth?: string, hostname?: string, port?: string, pathname?: string, search?: string, hash?: string, slashes?: boolean }} objURL
 * @returns {string}
 */
function format(objURL) {
  var protocol = objURL.protocol || "";
  if (protocol && protocol.substr(-1) !== ":") {
    protocol += ":";
  }
  var auth = objURL.auth || "";
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ":");
    auth += "@";
  }
  var host = "";
  if (objURL.hostname) {
    host = auth + (objURL.hostname.indexOf(":") === -1 ? objURL.hostname : "[".concat(objURL.hostname, "]"));
    if (objURL.port) {
      host += ":".concat(objURL.port);
    }
  }
  var pathname = objURL.pathname || "";
  if (objURL.slashes) {
    host = "//".concat(host || "");
    if (pathname && pathname.charAt(0) !== "/") {
      pathname = "/".concat(pathname);
    }
  } else if (!host) {
    host = "";
  }
  var search = objURL.search || "";
  if (search && search.charAt(0) !== "?") {
    search = "?".concat(search);
  }
  var hash = objURL.hash || "";
  if (hash && hash.charAt(0) !== "#") {
    hash = "#".concat(hash);
  }
  pathname = pathname.replace(/[?#]/g,
  /**
   * @param {string} match
   * @returns {string}
   */
  function (match) {
    return encodeURIComponent(match);
  });
  search = search.replace("#", "%23");
  return "".concat(protocol).concat(host).concat(pathname).concat(search).concat(hash);
}

/**
 * @param {URL & { fromCurrentScript?: boolean }} parsedURL
 * @returns {string}
 */
function createSocketURL(parsedURL) {
  var hostname = parsedURL.hostname;

  // Node.js module parses it as `::`
  // `new URL(urlString, [baseURLString])` parses it as '[::]'
  var isInAddrAny = hostname === "0.0.0.0" || hostname === "::" || hostname === "[::]";

  // why do we need this check?
  // hostname n/a for file protocol (example, when using electron, ionic)
  // see: https://github.com/webpack/webpack-dev-server/pull/384
  if (isInAddrAny && self.location.hostname && self.location.protocol.indexOf("http") === 0) {
    hostname = self.location.hostname;
  }
  var socketURLProtocol = parsedURL.protocol || self.location.protocol;

  // When https is used in the app, secure web sockets are always necessary because the browser doesn't accept non-secure web sockets.
  if (socketURLProtocol === "auto:" || hostname && isInAddrAny && self.location.protocol === "https:") {
    socketURLProtocol = self.location.protocol;
  }
  socketURLProtocol = socketURLProtocol.replace(/^(?:http|.+-extension|file)/i, "ws");
  var socketURLAuth = "";

  // `new URL(urlString, [baseURLstring])` doesn't have `auth` property
  // Parse authentication credentials in case we need them
  if (parsedURL.username) {
    socketURLAuth = parsedURL.username;

    // Since HTTP basic authentication does not allow empty username,
    // we only include password if the username is not empty.
    if (parsedURL.password) {
      // Result: <username>:<password>
      socketURLAuth = socketURLAuth.concat(":", parsedURL.password);
    }
  }

  // In case the host is a raw IPv6 address, it can be enclosed in
  // the brackets as the brackets are needed in the final URL string.
  // Need to remove those as url.format blindly adds its own set of brackets
  // if the host string contains colons. That would lead to non-working
  // double brackets (e.g. [[::]]) host
  //
  // All of these web socket url params are optionally passed in through resourceQuery,
  // so we need to fall back to the default if they are not provided
  var socketURLHostname = (hostname || self.location.hostname || "localhost").replace(/^\[(.*)\]$/, "$1");
  var socketURLPort = parsedURL.port;
  if (!socketURLPort || socketURLPort === "0") {
    socketURLPort = self.location.port;
  }

  // If path is provided it'll be passed in via the resourceQuery as a
  // query param so it has to be parsed out of the querystring in order for the
  // client to open the socket to the correct location.
  var socketURLPathname = "/ws";
  if (parsedURL.pathname && !parsedURL.fromCurrentScript) {
    socketURLPathname = parsedURL.pathname;
  }
  return format({
    protocol: socketURLProtocol,
    auth: socketURLAuth,
    hostname: socketURLHostname,
    port: socketURLPort,
    pathname: socketURLPathname,
    slashes: true
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (createSocketURL);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js":
/*!********************************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * @returns {string}
 */
function getCurrentScriptSource() {
  // `document.currentScript` is the most accurate way to find the current script,
  // but is not supported in all browsers.
  if (document.currentScript) {
    return document.currentScript.getAttribute("src");
  }

  // Fallback to getting all scripts running in the document.
  var scriptElements = document.scripts || [];
  var scriptElementsWithSrc = Array.prototype.filter.call(scriptElements, function (element) {
    return element.getAttribute("src");
  });
  if (scriptElementsWithSrc.length > 0) {
    var currentScript = scriptElementsWithSrc[scriptElementsWithSrc.length - 1];
    return currentScript.getAttribute("src");
  }

  // Fail as there was no script to use.
  throw new Error("[webpack-dev-server] Failed to get current script source.");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (getCurrentScriptSource);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/log.js":
/*!*************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/utils/log.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   logEnabledFeatures: () => (/* binding */ logEnabledFeatures),
/* harmony export */   setLogLevel: () => (/* binding */ setLogLevel)
/* harmony export */ });
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../modules/logger/index.js */ "./node_modules/webpack-dev-server/client/modules/logger/index.js");
/* harmony import */ var _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0__);

var name = "webpack-dev-server";
// default level is set on the client side, so it does not need
// to be set by the CLI or API
var defaultLevel = "info";

// options new options, merge with old options
/**
 * @param {false | true | "none" | "error" | "warn" | "info" | "log" | "verbose"} level
 * @returns {void}
 */
function setLogLevel(level) {
  _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().configureDefaultLogger({
    level: level
  });
}
setLogLevel(defaultLevel);
var log = _modules_logger_index_js__WEBPACK_IMPORTED_MODULE_0___default().getLogger(name);
var logEnabledFeatures = function logEnabledFeatures(features) {
  var enabledFeatures = Object.keys(features);
  if (!features || enabledFeatures.length === 0) {
    return;
  }
  var logString = "Server started:";

  // Server started: Hot Module Replacement enabled, Live Reloading enabled, Overlay disabled.
  for (var i = 0; i < enabledFeatures.length; i++) {
    var key = enabledFeatures[i];
    logString += " ".concat(key, " ").concat(features[key] ? "enabled" : "disabled", ",");
  }
  // replace last comma with a period
  logString = logString.slice(0, -1).concat(".");
  log.info(logString);
};


/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/parseURL.js":
/*!******************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/utils/parseURL.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _getCurrentScriptSource_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./getCurrentScriptSource.js */ "./node_modules/webpack-dev-server/client/utils/getCurrentScriptSource.js");


/**
 * @param {string} resourceQuery
 * @returns {{ [key: string]: string | boolean }}
 */
function parseURL(resourceQuery) {
  /** @type {{ [key: string]: string }} */
  var options = {};
  if (typeof resourceQuery === "string" && resourceQuery !== "") {
    var searchParams = resourceQuery.slice(1).split("&");
    for (var i = 0; i < searchParams.length; i++) {
      var pair = searchParams[i].split("=");
      options[pair[0]] = decodeURIComponent(pair[1]);
    }
  } else {
    // Else, get the url from the <script> this file was called with.
    var scriptSource = (0,_getCurrentScriptSource_js__WEBPACK_IMPORTED_MODULE_0__["default"])();
    var scriptSourceURL;
    try {
      // The placeholder `baseURL` with `window.location.href`,
      // is to allow parsing of path-relative or protocol-relative URLs,
      // and will have no effect if `scriptSource` is a fully valid URL.
      scriptSourceURL = new URL(scriptSource, self.location.href);
    } catch (error) {
      // URL parsing failed, do nothing.
      // We will still proceed to see if we can recover using `resourceQuery`
    }
    if (scriptSourceURL) {
      options = scriptSourceURL;
      options.fromCurrentScript = true;
    }
  }
  return options;
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (parseURL);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/reloadApp.js":
/*!*******************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/utils/reloadApp.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! webpack/hot/emitter.js */ "./node_modules/webpack/hot/emitter.js");
/* harmony import */ var webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _log_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log.js */ "./node_modules/webpack-dev-server/client/utils/log.js");



/** @typedef {import("../index").Options} Options
/** @typedef {import("../index").Status} Status

/**
 * @param {Options} options
 * @param {Status} status
 */
function reloadApp(_ref, status) {
  var hot = _ref.hot,
    liveReload = _ref.liveReload;
  if (status.isUnloading) {
    return;
  }
  var currentHash = status.currentHash,
    previousHash = status.previousHash;
  var isInitial = currentHash.indexOf( /** @type {string} */previousHash) >= 0;
  if (isInitial) {
    return;
  }

  /**
   * @param {Window} rootWindow
   * @param {number} intervalId
   */
  function applyReload(rootWindow, intervalId) {
    clearInterval(intervalId);
    _log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("App updated. Reloading...");
    rootWindow.location.reload();
  }
  var search = self.location.search.toLowerCase();
  var allowToHot = search.indexOf("webpack-dev-server-hot=false") === -1;
  var allowToLiveReload = search.indexOf("webpack-dev-server-live-reload=false") === -1;
  if (hot && allowToHot) {
    _log_js__WEBPACK_IMPORTED_MODULE_1__.log.info("App hot update...");
    webpack_hot_emitter_js__WEBPACK_IMPORTED_MODULE_0___default().emit("webpackHotUpdate", status.currentHash);
    if (typeof self !== "undefined" && self.window) {
      // broadcast update to window
      self.postMessage("webpackHotUpdate".concat(status.currentHash), "*");
    }
  }
  // allow refreshing the page only if liveReload isn't disabled
  else if (liveReload && allowToLiveReload) {
    var rootWindow = self;

    // use parent window for reload (in case we're in an iframe with no valid src)
    var intervalId = self.setInterval(function () {
      if (rootWindow.location.protocol !== "about:") {
        // reload immediately if protocol is valid
        applyReload(rootWindow, intervalId);
      } else {
        rootWindow = rootWindow.parent;
        if (rootWindow.parent === rootWindow) {
          // if parent equals current window we've reached the root which would continue forever, so trigger a reload anyways
          applyReload(rootWindow, intervalId);
        }
      }
    });
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (reloadApp);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/sendMessage.js":
/*!*********************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/utils/sendMessage.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* global __resourceQuery WorkerGlobalScope */

// Send messages to the outside, so plugins can consume it.
/**
 * @param {string} type
 * @param {any} [data]
 */
function sendMsg(type, data) {
  if (typeof self !== "undefined" && (typeof WorkerGlobalScope === "undefined" || !(self instanceof WorkerGlobalScope))) {
    self.postMessage({
      type: "webpack".concat(type),
      data: data
    }, "*");
  }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (sendMsg);

/***/ }),

/***/ "./node_modules/webpack-dev-server/client/utils/stripAnsi.js":
/*!*******************************************************************!*\
  !*** ./node_modules/webpack-dev-server/client/utils/stripAnsi.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var ansiRegex = new RegExp(["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))"].join("|"), "g");

/**
 *
 * Strip [ANSI escape codes](https://en.wikipedia.org/wiki/ANSI_escape_code) from a string.
 * Adapted from code originally released by Sindre Sorhus
 * Licensed the MIT License
 *
 * @param {string} string
 * @return {string}
 */
function stripAnsi(string) {
  if (typeof string !== "string") {
    throw new TypeError("Expected a `string`, got `".concat(typeof string, "`"));
  }
  return string.replace(ansiRegex, "");
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (stripAnsi);

/***/ }),

/***/ "./node_modules/webpack/hot/dev-server.js":
/*!************************************************!*\
  !*** ./node_modules/webpack/hot/dev-server.js ***!
  \************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
/* globals __webpack_hash__ */
if (true) {
	/** @type {undefined|string} */
	var lastHash;
	var upToDate = function upToDate() {
		return /** @type {string} */ (lastHash).indexOf(__webpack_require__.h()) >= 0;
	};
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");
	var check = function check() {
		module.hot
			.check(true)
			.then(function (updatedModules) {
				if (!updatedModules) {
					log(
						"warning",
						"[HMR] Cannot find update. " +
							(typeof window !== "undefined"
								? "Need to do a full reload!"
								: "Please reload manually!")
					);
					log(
						"warning",
						"[HMR] (Probably because of restarting the webpack-dev-server)"
					);
					if (typeof window !== "undefined") {
						window.location.reload();
					}
					return;
				}

				if (!upToDate()) {
					check();
				}

				__webpack_require__(/*! ./log-apply-result */ "./node_modules/webpack/hot/log-apply-result.js")(updatedModules, updatedModules);

				if (upToDate()) {
					log("info", "[HMR] App is up to date.");
				}
			})
			.catch(function (err) {
				var status = module.hot.status();
				if (["abort", "fail"].indexOf(status) >= 0) {
					log(
						"warning",
						"[HMR] Cannot apply update. " +
							(typeof window !== "undefined"
								? "Need to do a full reload!"
								: "Please reload manually!")
					);
					log("warning", "[HMR] " + log.formatError(err));
					if (typeof window !== "undefined") {
						window.location.reload();
					}
				} else {
					log("warning", "[HMR] Update failed: " + log.formatError(err));
				}
			});
	};
	var hotEmitter = __webpack_require__(/*! ./emitter */ "./node_modules/webpack/hot/emitter.js");
	hotEmitter.on("webpackHotUpdate", function (currentHash) {
		lastHash = currentHash;
		if (!upToDate() && module.hot.status() === "idle") {
			log("info", "[HMR] Checking for updates on the server...");
			check();
		}
	});
	log("info", "[HMR] Waiting for update signal from WDS...");
} else {}


/***/ }),

/***/ "./node_modules/webpack/hot/emitter.js":
/*!*********************************************!*\
  !*** ./node_modules/webpack/hot/emitter.js ***!
  \*********************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var EventEmitter = __webpack_require__(/*! events */ "./node_modules/events/events.js");
module.exports = new EventEmitter();


/***/ }),

/***/ "./node_modules/webpack/hot/log-apply-result.js":
/*!******************************************************!*\
  !*** ./node_modules/webpack/hot/log-apply-result.js ***!
  \******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

/**
 * @param {(string | number)[]} updatedModules updated modules
 * @param {(string | number)[] | null} renewedModules renewed modules
 */
module.exports = function (updatedModules, renewedModules) {
	var unacceptedModules = updatedModules.filter(function (moduleId) {
		return renewedModules && renewedModules.indexOf(moduleId) < 0;
	});
	var log = __webpack_require__(/*! ./log */ "./node_modules/webpack/hot/log.js");

	if (unacceptedModules.length > 0) {
		log(
			"warning",
			"[HMR] The following modules couldn't be hot updated: (They would need a full reload!)"
		);
		unacceptedModules.forEach(function (moduleId) {
			log("warning", "[HMR]  - " + moduleId);
		});
	}

	if (!renewedModules || renewedModules.length === 0) {
		log("info", "[HMR] Nothing hot updated.");
	} else {
		log("info", "[HMR] Updated modules:");
		renewedModules.forEach(function (moduleId) {
			if (typeof moduleId === "string" && moduleId.indexOf("!") !== -1) {
				var parts = moduleId.split("!");
				log.groupCollapsed("info", "[HMR]  - " + parts.pop());
				log("info", "[HMR]  - " + moduleId);
				log.groupEnd("info");
			} else {
				log("info", "[HMR]  - " + moduleId);
			}
		});
		var numberIds = renewedModules.every(function (moduleId) {
			return typeof moduleId === "number";
		});
		if (numberIds)
			log(
				"info",
				'[HMR] Consider using the optimization.moduleIds: "named" for module names.'
			);
	}
};


/***/ }),

/***/ "./node_modules/webpack/hot/log.js":
/*!*****************************************!*\
  !*** ./node_modules/webpack/hot/log.js ***!
  \*****************************************/
/***/ ((module) => {

/** @typedef {"info" | "warning" | "error"} LogLevel */

/** @type {LogLevel} */
var logLevel = "info";

function dummy() {}

/**
 * @param {LogLevel} level log level
 * @returns {boolean} true, if should log
 */
function shouldLog(level) {
	var shouldLog =
		(logLevel === "info" && level === "info") ||
		(["info", "warning"].indexOf(logLevel) >= 0 && level === "warning") ||
		(["info", "warning", "error"].indexOf(logLevel) >= 0 && level === "error");
	return shouldLog;
}

/**
 * @param {(msg?: string) => void} logFn log function
 * @returns {(level: LogLevel, msg?: string) => void} function that logs when log level is sufficient
 */
function logGroup(logFn) {
	return function (level, msg) {
		if (shouldLog(level)) {
			logFn(msg);
		}
	};
}

/**
 * @param {LogLevel} level log level
 * @param {string|Error} msg message
 */
module.exports = function (level, msg) {
	if (shouldLog(level)) {
		if (level === "info") {
			console.log(msg);
		} else if (level === "warning") {
			console.warn(msg);
		} else if (level === "error") {
			console.error(msg);
		}
	}
};

var group = console.group || dummy;
var groupCollapsed = console.groupCollapsed || dummy;
var groupEnd = console.groupEnd || dummy;

module.exports.group = logGroup(group);

module.exports.groupCollapsed = logGroup(groupCollapsed);

module.exports.groupEnd = logGroup(groupEnd);

/**
 * @param {LogLevel} level log level
 */
module.exports.setLogLevel = function (level) {
	logLevel = level;
};

/**
 * @param {Error} err error
 * @returns {string} formatted error
 */
module.exports.formatError = function (err) {
	var message = err.message;
	var stack = err.stack;
	if (!stack) {
		return message;
	} else if (stack.indexOf(message) < 0) {
		return message + "\n" + stack;
	} else {
		return stack;
	}
};


/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-array-buffer-iterator.js":
/*!**************************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-array-buffer-iterator.js ***!
  \**************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeArrayBufferIterator: () => (/* binding */ makeArrayBufferIterator)
/* harmony export */ });
const DEFAULT_CHUNK_SIZE = 256 * 1024;
function makeArrayBufferIterator(arrayBuffer) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  return function* () {
    const {
      chunkSize = DEFAULT_CHUNK_SIZE
    } = options;
    let byteOffset = 0;
    while (byteOffset < arrayBuffer.byteLength) {
      const chunkByteLength = Math.min(arrayBuffer.byteLength - byteOffset, chunkSize);
      const chunk = new ArrayBuffer(chunkByteLength);
      const sourceArray = new Uint8Array(arrayBuffer, byteOffset, chunkByteLength);
      const chunkArray = new Uint8Array(chunk);
      chunkArray.set(sourceArray);
      byteOffset += chunkByteLength;
      yield chunk;
    }
  }();
}
//# sourceMappingURL=make-array-buffer-iterator.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-blob-iterator.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-blob-iterator.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeBlobIterator: () => (/* binding */ makeBlobIterator)
/* harmony export */ });
const DEFAULT_CHUNK_SIZE = 1024 * 1024;
async function* makeBlobIterator(blob, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
  let offset = 0;
  while (offset < blob.size) {
    const end = offset + chunkSize;
    const chunk = await blob.slice(offset, end).arrayBuffer();
    offset = end;
    yield chunk;
  }
}
//# sourceMappingURL=make-blob-iterator.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-iterator.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-iterator.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeIterator: () => (/* binding */ makeIterator)
/* harmony export */ });
/* harmony import */ var _make_string_iterator_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./make-string-iterator.js */ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-string-iterator.js");
/* harmony import */ var _make_array_buffer_iterator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./make-array-buffer-iterator.js */ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-array-buffer-iterator.js");
/* harmony import */ var _make_blob_iterator_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./make-blob-iterator.js */ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-blob-iterator.js");
/* harmony import */ var _make_stream_iterator_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./make-stream-iterator.js */ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-stream-iterator.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");





function makeIterator(data, options) {
  if (typeof data === 'string') {
    return (0,_make_string_iterator_js__WEBPACK_IMPORTED_MODULE_0__.makeStringIterator)(data, options);
  }
  if (data instanceof ArrayBuffer) {
    return (0,_make_array_buffer_iterator_js__WEBPACK_IMPORTED_MODULE_1__.makeArrayBufferIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isBlob)(data)) {
    return (0,_make_blob_iterator_js__WEBPACK_IMPORTED_MODULE_3__.makeBlobIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isReadableStream)(data)) {
    return (0,_make_stream_iterator_js__WEBPACK_IMPORTED_MODULE_4__.makeStreamIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isResponse)(data)) {
    const response = data;
    return (0,_make_stream_iterator_js__WEBPACK_IMPORTED_MODULE_4__.makeStreamIterator)(response.body, options);
  }
  throw new Error('makeIterator');
}
//# sourceMappingURL=make-iterator.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-stream-iterator.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-stream-iterator.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeStreamIterator: () => (/* binding */ makeStreamIterator)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-conversion-utils.js");

function makeStreamIterator(stream, options) {
  return _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.isBrowser ? makeBrowserStreamIterator(stream, options) : makeNodeStreamIterator(stream, options);
}
async function* makeBrowserStreamIterator(stream, options) {
  const reader = stream.getReader();
  let nextBatchPromise;
  try {
    while (true) {
      const currentBatchPromise = nextBatchPromise || reader.read();
      if (options !== null && options !== void 0 && options._streamReadAhead) {
        nextBatchPromise = reader.read();
      }
      const {
        done,
        value
      } = await currentBatchPromise;
      if (done) {
        return;
      }
      yield (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.toArrayBuffer)(value);
    }
  } catch (error) {
    reader.releaseLock();
  }
}
async function* makeNodeStreamIterator(stream, options) {
  for await (const chunk of stream) {
    yield (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.toArrayBuffer)(chunk);
  }
}
//# sourceMappingURL=make-stream-iterator.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-string-iterator.js":
/*!********************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-string-iterator.js ***!
  \********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   makeStringIterator: () => (/* binding */ makeStringIterator)
/* harmony export */ });
const DEFAULT_CHUNK_SIZE = 256 * 1024;
function* makeStringIterator(string, options) {
  const chunkSize = (options === null || options === void 0 ? void 0 : options.chunkSize) || DEFAULT_CHUNK_SIZE;
  let offset = 0;
  const textEncoder = new TextEncoder();
  while (offset < string.length) {
    const chunkLength = Math.min(string.length - offset, chunkSize);
    const chunk = string.slice(offset, offset + chunkLength);
    offset += chunkLength;
    yield textEncoder.encode(chunk);
  }
}
//# sourceMappingURL=make-string-iterator.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js":
/*!************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isAsyncIterable: () => (/* binding */ isAsyncIterable),
/* harmony export */   isBlob: () => (/* binding */ isBlob),
/* harmony export */   isBuffer: () => (/* binding */ isBuffer),
/* harmony export */   isFile: () => (/* binding */ isFile),
/* harmony export */   isIterable: () => (/* binding */ isIterable),
/* harmony export */   isIterator: () => (/* binding */ isIterator),
/* harmony export */   isObject: () => (/* binding */ isObject),
/* harmony export */   isPromise: () => (/* binding */ isPromise),
/* harmony export */   isPureObject: () => (/* binding */ isPureObject),
/* harmony export */   isReadableDOMStream: () => (/* binding */ isReadableDOMStream),
/* harmony export */   isReadableNodeStream: () => (/* binding */ isReadableNodeStream),
/* harmony export */   isReadableStream: () => (/* binding */ isReadableStream),
/* harmony export */   isResponse: () => (/* binding */ isResponse),
/* harmony export */   isWritableDOMStream: () => (/* binding */ isWritableDOMStream),
/* harmony export */   isWritableNodeStream: () => (/* binding */ isWritableNodeStream),
/* harmony export */   isWritableStream: () => (/* binding */ isWritableStream)
/* harmony export */ });
const isBoolean = x => typeof x === 'boolean';
const isFunction = x => typeof x === 'function';
const isObject = x => x !== null && typeof x === 'object';
const isPureObject = x => isObject(x) && x.constructor === {}.constructor;
const isPromise = x => isObject(x) && isFunction(x.then);
const isIterable = x => Boolean(x) && typeof x[Symbol.iterator] === 'function';
const isAsyncIterable = x => x && typeof x[Symbol.asyncIterator] === 'function';
const isIterator = x => x && isFunction(x.next);
const isResponse = x => typeof Response !== 'undefined' && x instanceof Response || x && x.arrayBuffer && x.text && x.json;
const isFile = x => typeof File !== 'undefined' && x instanceof File;
const isBlob = x => typeof Blob !== 'undefined' && x instanceof Blob;
const isBuffer = x => x && typeof x === 'object' && x.isBuffer;
const isWritableDOMStream = x => isObject(x) && isFunction(x.abort) && isFunction(x.getWriter);
const isReadableDOMStream = x => typeof ReadableStream !== 'undefined' && x instanceof ReadableStream || isObject(x) && isFunction(x.tee) && isFunction(x.cancel) && isFunction(x.getReader);
const isWritableNodeStream = x => isObject(x) && isFunction(x.end) && isFunction(x.write) && isBoolean(x.writable);
const isReadableNodeStream = x => isObject(x) && isFunction(x.read) && isFunction(x.pipe) && isBoolean(x.readable);
const isReadableStream = x => isReadableDOMStream(x) || isReadableNodeStream(x);
const isWritableStream = x => isWritableDOMStream(x) || isWritableNodeStream(x);
//# sourceMappingURL=is-type.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/api/load.js":
/*!************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/api/load.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   load: () => (/* binding */ load)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _loader_utils_get_fetch_function_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loader-utils/get-fetch-function.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js");
/* harmony import */ var _parse_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./parse.js */ "./node_modules/@loaders.gl/core/dist/lib/api/parse.js");




async function load(url, loaders, options, context) {
  let resolvedLoaders;
  let resolvedOptions;
  if (!Array.isArray(loaders) && !(0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__.isLoaderObject)(loaders)) {
    resolvedLoaders = [];
    resolvedOptions = loaders;
    context = undefined;
  } else {
    resolvedLoaders = loaders;
    resolvedOptions = options;
  }
  const fetch = (0,_loader_utils_get_fetch_function_js__WEBPACK_IMPORTED_MODULE_1__.getFetchFunction)(resolvedOptions);
  let data = url;
  if (typeof url === 'string') {
    data = await fetch(url);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_2__.isBlob)(url)) {
    data = await fetch(url);
  }
  return Array.isArray(resolvedLoaders) ? await (0,_parse_js__WEBPACK_IMPORTED_MODULE_3__.parse)(data, resolvedLoaders, resolvedOptions) : await (0,_parse_js__WEBPACK_IMPORTED_MODULE_3__.parse)(data, resolvedLoaders, resolvedOptions);
}
//# sourceMappingURL=load.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/api/parse.js":
/*!*************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/api/parse.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parse: () => (/* binding */ parse)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/parse-with-worker.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/validate-worker-version.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../loader-utils/option-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/option-utils/merge-loader-options.js");
/* harmony import */ var _loader_utils_get_data_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../loader-utils/get-data.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/get-data.js");
/* harmony import */ var _loader_utils_loader_context_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../loader-utils/loader-context.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/loader-context.js");
/* harmony import */ var _utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/resource-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js");
/* harmony import */ var _select_loader_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./select-loader.js */ "./node_modules/@loaders.gl/core/dist/lib/api/select-loader.js");










async function parse(data, loaders, options, context) {
  if (loaders && !Array.isArray(loaders) && !(0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_0__.isLoaderObject)(loaders)) {
    context = undefined;
    options = loaders;
    loaders = undefined;
  }
  data = await data;
  options = options || {};
  const url = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceUrl)(data);
  const typedLoaders = loaders;
  const candidateLoaders = (0,_loader_utils_loader_context_js__WEBPACK_IMPORTED_MODULE_2__.getLoadersFromContext)(typedLoaders, context);
  const loader = await (0,_select_loader_js__WEBPACK_IMPORTED_MODULE_3__.selectLoader)(data, candidateLoaders, options);
  if (!loader) {
    return null;
  }
  options = (0,_loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_4__.normalizeOptions)(options, loader, candidateLoaders, url);
  context = (0,_loader_utils_loader_context_js__WEBPACK_IMPORTED_MODULE_2__.getLoaderContext)({
    url,
    _parse: parse,
    loaders: candidateLoaders
  }, options, context || null);
  return await parseWithLoader(loader, data, options, context);
}
async function parseWithLoader(loader, data, options, context) {
  (0,_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_5__.validateWorkerVersion)(loader);
  options = (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__.mergeLoaderOptions)(loader.options, options);
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_7__.isResponse)(data)) {
    const response = data;
    const {
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    } = response;
    const headers = Object.fromEntries(response.headers.entries());
    context.response = {
      headers,
      ok,
      redirected,
      status,
      statusText,
      type,
      url
    };
  }
  data = await (0,_loader_utils_get_data_js__WEBPACK_IMPORTED_MODULE_8__.getArrayBufferOrStringFromData)(data, loader, options);
  const loaderWithParser = loader;
  if (loaderWithParser.parseTextSync && typeof data === 'string') {
    return loaderWithParser.parseTextSync(data, options, context);
  }
  if ((0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_9__.canParseWithWorker)(loader, options)) {
    return await (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_9__.parseWithWorker)(loader, data, options, context, parse);
  }
  if (loaderWithParser.parseText && typeof data === 'string') {
    return await loaderWithParser.parseText(data, options, context);
  }
  if (loaderWithParser.parse) {
    return await loaderWithParser.parse(data, options, context);
  }
  (0,_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_10__.assert)(!loaderWithParser.parseSync);
  throw new Error(`${loader.id} loader - no parser found and worker is disabled`);
}
//# sourceMappingURL=parse.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/api/register-loaders.js":
/*!************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/api/register-loaders.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   _unregisterLoaders: () => (/* binding */ _unregisterLoaders),
/* harmony export */   getRegisteredLoaders: () => (/* binding */ getRegisteredLoaders),
/* harmony export */   registerLoaders: () => (/* binding */ registerLoaders)
/* harmony export */ });
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../loader-utils/option-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js");


const getGlobalLoaderRegistry = () => {
  const state = (0,_loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalLoaderState)();
  state.loaderRegistry = state.loaderRegistry || [];
  return state.loaderRegistry;
};
function registerLoaders(loaders) {
  const loaderRegistry = getGlobalLoaderRegistry();
  loaders = Array.isArray(loaders) ? loaders : [loaders];
  for (const loader of loaders) {
    const normalizedLoader = (0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__.normalizeLoader)(loader);
    if (!loaderRegistry.find(registeredLoader => normalizedLoader === registeredLoader)) {
      loaderRegistry.unshift(normalizedLoader);
    }
  }
}
function getRegisteredLoaders() {
  return getGlobalLoaderRegistry();
}
function _unregisterLoaders() {
  const state = (0,_loader_utils_option_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalLoaderState)();
  state.loaderRegistry = [];
}
//# sourceMappingURL=register-loaders.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/api/select-loader.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/api/select-loader.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   selectLoader: () => (/* binding */ selectLoader),
/* harmony export */   selectLoaderSync: () => (/* binding */ selectLoaderSync)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js");
/* harmony import */ var _loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../loader-utils/normalize-loader.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js");
/* harmony import */ var _utils_log_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils/log.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/log.js");
/* harmony import */ var _utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../utils/resource-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js");
/* harmony import */ var _register_loaders_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./register-loaders.js */ "./node_modules/@loaders.gl/core/dist/lib/api/register-loaders.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _utils_url_utils_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../utils/url-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js");







const EXT_PATTERN = /\.([^.]+)$/;
async function selectLoader(data) {
  let loaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let options = arguments.length > 2 ? arguments[2] : undefined;
  let context = arguments.length > 3 ? arguments[3] : undefined;
  if (!validHTTPResponse(data)) {
    return null;
  }
  let loader = selectLoaderSync(data, loaders, {
    ...options,
    nothrow: true
  }, context);
  if (loader) {
    return loader;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(data)) {
    data = await data.slice(0, 10).arrayBuffer();
    loader = selectLoaderSync(data, loaders, options, context);
  }
  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }
  return loader;
}
function selectLoaderSync(data) {
  let loaders = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
  let options = arguments.length > 2 ? arguments[2] : undefined;
  let context = arguments.length > 3 ? arguments[3] : undefined;
  if (!validHTTPResponse(data)) {
    return null;
  }
  if (loaders && !Array.isArray(loaders)) {
    return (0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__.normalizeLoader)(loaders);
  }
  let candidateLoaders = [];
  if (loaders) {
    candidateLoaders = candidateLoaders.concat(loaders);
  }
  if (!(options !== null && options !== void 0 && options.ignoreRegisteredLoaders)) {
    candidateLoaders.push(...(0,_register_loaders_js__WEBPACK_IMPORTED_MODULE_2__.getRegisteredLoaders)());
  }
  normalizeLoaders(candidateLoaders);
  const loader = selectLoaderInternal(data, candidateLoaders, options, context);
  if (!loader && !(options !== null && options !== void 0 && options.nothrow)) {
    throw new Error(getNoValidLoaderMessage(data));
  }
  return loader;
}
function selectLoaderInternal(data, loaders, options, context) {
  const url = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceUrl)(data);
  const type = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceMIMEType)(data);
  const testUrl = (0,_utils_url_utils_js__WEBPACK_IMPORTED_MODULE_4__.stripQueryString)(url) || (context === null || context === void 0 ? void 0 : context.url);
  let loader = null;
  let reason = '';
  if (options !== null && options !== void 0 && options.mimeType) {
    loader = findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.mimeType);
    reason = `match forced by supplied MIME type ${options === null || options === void 0 ? void 0 : options.mimeType}`;
  }
  loader = loader || findLoaderByUrl(loaders, testUrl);
  reason = reason || (loader ? `matched url ${testUrl}` : '');
  loader = loader || findLoaderByMIMEType(loaders, type);
  reason = reason || (loader ? `matched MIME type ${type}` : '');
  loader = loader || findLoaderByInitialBytes(loaders, data);
  reason = reason || (loader ? `matched initial data ${getFirstCharacters(data)}` : '');
  if (options !== null && options !== void 0 && options.fallbackMimeType) {
    loader = loader || findLoaderByMIMEType(loaders, options === null || options === void 0 ? void 0 : options.fallbackMimeType);
    reason = reason || (loader ? `matched fallback MIME type ${type}` : '');
  }
  if (reason) {
    var _loader;
    _utils_log_js__WEBPACK_IMPORTED_MODULE_5__.log.log(1, `selectLoader selected ${(_loader = loader) === null || _loader === void 0 ? void 0 : _loader.name}: ${reason}.`);
  }
  return loader;
}
function validHTTPResponse(data) {
  if (data instanceof Response) {
    if (data.status === 204) {
      return false;
    }
  }
  return true;
}
function getNoValidLoaderMessage(data) {
  const url = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceUrl)(data);
  const type = (0,_utils_resource_utils_js__WEBPACK_IMPORTED_MODULE_3__.getResourceMIMEType)(data);
  let message = 'No valid loader found (';
  message += url ? `${_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_6__.filename(url)}, ` : 'no url provided, ';
  message += `MIME type: ${type ? `"${type}"` : 'not provided'}, `;
  const firstCharacters = data ? getFirstCharacters(data) : '';
  message += firstCharacters ? ` first bytes: "${firstCharacters}"` : 'first bytes: not available';
  message += ')';
  return message;
}
function normalizeLoaders(loaders) {
  for (const loader of loaders) {
    (0,_loader_utils_normalize_loader_js__WEBPACK_IMPORTED_MODULE_1__.normalizeLoader)(loader);
  }
}
function findLoaderByUrl(loaders, url) {
  const match = url && EXT_PATTERN.exec(url);
  const extension = match && match[1];
  return extension ? findLoaderByExtension(loaders, extension) : null;
}
function findLoaderByExtension(loaders, extension) {
  extension = extension.toLowerCase();
  for (const loader of loaders) {
    for (const loaderExtension of loader.extensions) {
      if (loaderExtension.toLowerCase() === extension) {
        return loader;
      }
    }
  }
  return null;
}
function findLoaderByMIMEType(loaders, mimeType) {
  for (const loader of loaders) {
    if (loader.mimeTypes && loader.mimeTypes.includes(mimeType)) {
      return loader;
    }
    if (mimeType === `application/x.${loader.id}`) {
      return loader;
    }
  }
  return null;
}
function findLoaderByInitialBytes(loaders, data) {
  if (!data) {
    return null;
  }
  for (const loader of loaders) {
    if (typeof data === 'string') {
      if (testDataAgainstText(data, loader)) {
        return loader;
      }
    } else if (ArrayBuffer.isView(data)) {
      if (testDataAgainstBinary(data.buffer, data.byteOffset, loader)) {
        return loader;
      }
    } else if (data instanceof ArrayBuffer) {
      const byteOffset = 0;
      if (testDataAgainstBinary(data, byteOffset, loader)) {
        return loader;
      }
    }
  }
  return null;
}
function testDataAgainstText(data, loader) {
  if (loader.testText) {
    return loader.testText(data);
  }
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => data.startsWith(test));
}
function testDataAgainstBinary(data, byteOffset, loader) {
  const tests = Array.isArray(loader.tests) ? loader.tests : [loader.tests];
  return tests.some(test => testBinary(data, byteOffset, loader, test));
}
function testBinary(data, byteOffset, loader, test) {
  if (test instanceof ArrayBuffer) {
    return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_7__.compareArrayBuffers)(test, data, test.byteLength);
  }
  switch (typeof test) {
    case 'function':
      return test(data);
    case 'string':
      const magic = getMagicString(data, byteOffset, test.length);
      return test === magic;
    default:
      return false;
  }
}
function getFirstCharacters(data) {
  let length = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 5;
  if (typeof data === 'string') {
    return data.slice(0, length);
  } else if (ArrayBuffer.isView(data)) {
    return getMagicString(data.buffer, data.byteOffset, length);
  } else if (data instanceof ArrayBuffer) {
    const byteOffset = 0;
    return getMagicString(data, byteOffset, length);
  }
  return '';
}
function getMagicString(arrayBuffer, byteOffset, length) {
  if (arrayBuffer.byteLength < byteOffset + length) {
    return '';
  }
  const dataView = new DataView(arrayBuffer);
  let magic = '';
  for (let i = 0; i < length; i++) {
    magic += String.fromCharCode(dataView.getUint8(byteOffset + i));
  }
  return magic;
}
//# sourceMappingURL=select-loader.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/fetch/fetch-file.js":
/*!********************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/fetch/fetch-file.js ***!
  \********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fetchFile: () => (/* binding */ fetchFile),
/* harmony export */   isDataURL: () => (/* binding */ isDataURL),
/* harmony export */   isNodePath: () => (/* binding */ isNodePath),
/* harmony export */   isRequestURL: () => (/* binding */ isRequestURL)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/file-aliases.js");
/* harmony import */ var _utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/response-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js");


function isNodePath(url) {
  return !isRequestURL(url) && !isDataURL(url);
}
function isRequestURL(url) {
  return url.startsWith('http:') || url.startsWith('https:');
}
function isDataURL(url) {
  return url.startsWith('data:');
}
async function fetchFile(urlOrData, fetchOptions) {
  if (typeof urlOrData === 'string') {
    const url = (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.resolvePath)(urlOrData);
    if (isNodePath(url)) {
      var _globalThis$loaders;
      if ((_globalThis$loaders = globalThis.loaders) !== null && _globalThis$loaders !== void 0 && _globalThis$loaders.fetchNode) {
        var _globalThis$loaders2;
        return (_globalThis$loaders2 = globalThis.loaders) === null || _globalThis$loaders2 === void 0 ? void 0 : _globalThis$loaders2.fetchNode(url, fetchOptions);
      }
    }
    return await fetch(url, fetchOptions);
  }
  return await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.makeResponse)(urlOrData);
}
//# sourceMappingURL=fetch-file.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/get-data.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/loader-utils/get-data.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getArrayBufferOrStringFromData: () => (/* binding */ getArrayBufferOrStringFromData),
/* harmony export */   getArrayBufferOrStringFromDataSync: () => (/* binding */ getArrayBufferOrStringFromDataSync),
/* harmony export */   getAsyncIterableFromData: () => (/* binding */ getAsyncIterableFromData),
/* harmony export */   getReadableStream: () => (/* binding */ getReadableStream)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/iterators/async-iteration.js");
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../iterators/make-iterator/make-iterator.js */ "./node_modules/@loaders.gl/core/dist/iterators/make-iterator/make-iterator.js");
/* harmony import */ var _utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/response-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js");




const ERR_DATA = 'Cannot convert supplied data type';
function getArrayBufferOrStringFromDataSync(data, loader, options) {
  if (loader.text && typeof data === 'string') {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBuffer)(data)) {
    data = data.buffer;
  }
  if (data instanceof ArrayBuffer) {
    const arrayBuffer = data;
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(arrayBuffer);
    }
    return arrayBuffer;
  }
  if (ArrayBuffer.isView(data)) {
    if (loader.text && !loader.binary) {
      const textDecoder = new TextDecoder('utf8');
      return textDecoder.decode(data);
    }
    let arrayBuffer = data.buffer;
    const byteLength = data.byteLength || data.length;
    if (data.byteOffset !== 0 || byteLength !== arrayBuffer.byteLength) {
      arrayBuffer = arrayBuffer.slice(data.byteOffset, data.byteOffset + byteLength);
    }
    return arrayBuffer;
  }
  throw new Error(ERR_DATA);
}
async function getArrayBufferOrStringFromData(data, loader, options) {
  const isArrayBuffer = data instanceof ArrayBuffer || ArrayBuffer.isView(data);
  if (typeof data === 'string' || isArrayBuffer) {
    return getArrayBufferOrStringFromDataSync(data, loader, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(data)) {
    data = await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.makeResponse)(data);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(data)) {
    const response = data;
    await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.checkResponse)(response);
    return loader.binary ? await response.arrayBuffer() : await response.text();
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isReadableStream)(data)) {
    data = (0,_iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__.makeIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterable)(data) || (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isAsyncIterable)(data)) {
    return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_3__.concatenateArrayBuffersAsync)(data);
  }
  throw new Error(ERR_DATA);
}
async function getAsyncIterableFromData(data, options) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterator)(data)) {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(data)) {
    const response = data;
    await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.checkResponse)(response);
    const body = await response.body;
    return (0,_iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__.makeIterator)(body, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(data) || (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isReadableStream)(data)) {
    return (0,_iterators_make_iterator_make_iterator_js__WEBPACK_IMPORTED_MODULE_2__.makeIterator)(data, options);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isAsyncIterable)(data)) {
    return data;
  }
  return getIterableFromData(data);
}
async function getReadableStream(data) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isReadableStream)(data)) {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(data)) {
    return data.body;
  }
  const response = await (0,_utils_response_utils_js__WEBPACK_IMPORTED_MODULE_1__.makeResponse)(data);
  return response.body;
}
function getIterableFromData(data) {
  if (ArrayBuffer.isView(data)) {
    return function* oneChunk() {
      yield data.buffer;
    }();
  }
  if (data instanceof ArrayBuffer) {
    return function* oneChunk() {
      yield data;
    }();
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterator)(data)) {
    return data;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isIterable)(data)) {
    return data[Symbol.iterator]();
  }
  throw new Error(ERR_DATA);
}
//# sourceMappingURL=get-data.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getFetchFunction: () => (/* binding */ getFetchFunction)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _fetch_fetch_file_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../fetch/fetch-file.js */ "./node_modules/@loaders.gl/core/dist/lib/fetch/fetch-file.js");
/* harmony import */ var _option_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./option-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js");



function getFetchFunction(options, context) {
  const globalOptions = (0,_option_utils_js__WEBPACK_IMPORTED_MODULE_0__.getGlobalLoaderOptions)();
  const loaderOptions = options || globalOptions;
  if (typeof loaderOptions.fetch === 'function') {
    return loaderOptions.fetch;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(loaderOptions.fetch)) {
    return url => (0,_fetch_fetch_file_js__WEBPACK_IMPORTED_MODULE_2__.fetchFile)(url, loaderOptions.fetch);
  }
  if (context !== null && context !== void 0 && context.fetch) {
    return context === null || context === void 0 ? void 0 : context.fetch;
  }
  return _fetch_fetch_file_js__WEBPACK_IMPORTED_MODULE_2__.fetchFile;
}
//# sourceMappingURL=get-fetch-function.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/loader-context.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/loader-utils/loader-context.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLoaderContext: () => (/* binding */ getLoaderContext),
/* harmony export */   getLoadersFromContext: () => (/* binding */ getLoadersFromContext)
/* harmony export */ });
/* harmony import */ var _get_fetch_function_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-fetch-function.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/get-fetch-function.js");
/* harmony import */ var _utils_url_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils/url-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js");



function getLoaderContext(context, options, parentContext) {
  if (parentContext) {
    return parentContext;
  }
  const newContext = {
    fetch: (0,_get_fetch_function_js__WEBPACK_IMPORTED_MODULE_0__.getFetchFunction)(options, context),
    ...context
  };
  if (newContext.url) {
    const baseUrl = (0,_utils_url_utils_js__WEBPACK_IMPORTED_MODULE_1__.stripQueryString)(newContext.url);
    newContext.baseUrl = baseUrl;
    newContext.queryString = (0,_utils_url_utils_js__WEBPACK_IMPORTED_MODULE_1__.extractQueryString)(newContext.url);
    newContext.filename = _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_2__.filename(baseUrl);
    newContext.baseUrl = _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_2__.dirname(baseUrl);
  }
  if (!Array.isArray(newContext.loaders)) {
    newContext.loaders = null;
  }
  return newContext;
}
function getLoadersFromContext(loaders, context) {
  if (loaders && !Array.isArray(loaders)) {
    return loaders;
  }
  let candidateLoaders;
  if (loaders) {
    candidateLoaders = Array.isArray(loaders) ? loaders : [loaders];
  }
  if (context && context.loaders) {
    const contextLoaders = Array.isArray(context.loaders) ? context.loaders : [context.loaders];
    candidateLoaders = candidateLoaders ? [...candidateLoaders, ...contextLoaders] : contextLoaders;
  }
  return candidateLoaders && candidateLoaders.length ? candidateLoaders : undefined;
}
//# sourceMappingURL=loader-context.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js":
/*!************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ConsoleLog: () => (/* binding */ ConsoleLog),
/* harmony export */   NullLog: () => (/* binding */ NullLog),
/* harmony export */   probeLog: () => (/* binding */ probeLog)
/* harmony export */ });
/* harmony import */ var _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/log */ "./node_modules/@probe.gl/log/dist/log.js");

const probeLog = new _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__.Log({
  id: 'loaders.gl'
});
class NullLog {
  log() {
    return () => {};
  }
  info() {
    return () => {};
  }
  warn() {
    return () => {};
  }
  error() {
    return () => {};
  }
}
class ConsoleLog {
  constructor() {
    this.console = void 0;
    this.console = console;
  }
  log() {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    return this.console.log.bind(this.console, ...args);
  }
  info() {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    return this.console.info.bind(this.console, ...args);
  }
  warn() {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
      args[_key3] = arguments[_key3];
    }
    return this.console.warn.bind(this.console, ...args);
  }
  error() {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
      args[_key4] = arguments[_key4];
    }
    return this.console.error.bind(this.console, ...args);
  }
}
//# sourceMappingURL=loggers.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js":
/*!*********************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/loader-utils/normalize-loader.js ***!
  \*********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isLoaderObject: () => (/* binding */ isLoaderObject),
/* harmony export */   normalizeLoader: () => (/* binding */ normalizeLoader)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js");

function isLoaderObject(loader) {
  var _loader;
  if (!loader) {
    return false;
  }
  if (Array.isArray(loader)) {
    loader = loader[0];
  }
  const hasExtensions = Array.isArray((_loader = loader) === null || _loader === void 0 ? void 0 : _loader.extensions);
  return hasExtensions;
}
function normalizeLoader(loader) {
  var _loader2, _loader3;
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(loader, 'null loader');
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(isLoaderObject(loader), 'invalid loader');
  let options;
  if (Array.isArray(loader)) {
    options = loader[1];
    loader = loader[0];
    loader = {
      ...loader,
      options: {
        ...loader.options,
        ...options
      }
    };
  }
  if ((_loader2 = loader) !== null && _loader2 !== void 0 && _loader2.parseTextSync || (_loader3 = loader) !== null && _loader3 !== void 0 && _loader3.parseText) {
    loader.text = true;
  }
  if (!loader.text) {
    loader.binary = true;
  }
  return loader;
}
//# sourceMappingURL=normalize-loader.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-defaults.js":
/*!********************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-defaults.js ***!
  \********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_LOADER_OPTIONS: () => (/* binding */ DEFAULT_LOADER_OPTIONS),
/* harmony export */   REMOVED_LOADER_OPTIONS: () => (/* binding */ REMOVED_LOADER_OPTIONS)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _loggers_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./loggers.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js");


const DEFAULT_LOADER_OPTIONS = {
  fetch: null,
  mimeType: undefined,
  nothrow: false,
  log: new _loggers_js__WEBPACK_IMPORTED_MODULE_0__.ConsoleLog(),
  useLocalLibraries: false,
  CDN: 'https://unpkg.com/@loaders.gl',
  worker: true,
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser,
  _nodeWorkers: false,
  _workerType: '',
  limit: 0,
  _limitMB: 0,
  batchSize: 'auto',
  batchDebounceMs: 0,
  metadata: false,
  transforms: []
};
const REMOVED_LOADER_OPTIONS = {
  throws: 'nothrow',
  dataType: '(no longer used)',
  uri: 'baseUri',
  method: 'fetch.method',
  headers: 'fetch.headers',
  body: 'fetch.body',
  mode: 'fetch.mode',
  credentials: 'fetch.credentials',
  cache: 'fetch.cache',
  redirect: 'fetch.redirect',
  referrer: 'fetch.referrer',
  referrerPolicy: 'fetch.referrerPolicy',
  integrity: 'fetch.integrity',
  keepalive: 'fetch.keepalive',
  signal: 'fetch.signal'
};
//# sourceMappingURL=option-defaults.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-utils.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobalLoaderOptions: () => (/* binding */ getGlobalLoaderOptions),
/* harmony export */   getGlobalLoaderState: () => (/* binding */ getGlobalLoaderState),
/* harmony export */   normalizeOptions: () => (/* binding */ normalizeOptions),
/* harmony export */   setGlobalOptions: () => (/* binding */ setGlobalOptions)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _loggers_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./loggers.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/loggers.js");
/* harmony import */ var _option_defaults_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./option-defaults.js */ "./node_modules/@loaders.gl/core/dist/lib/loader-utils/option-defaults.js");



function getGlobalLoaderState() {
  globalThis.loaders = globalThis.loaders || {};
  const {
    loaders
  } = globalThis;
  loaders._state = loaders._state || {};
  return loaders._state;
}
function getGlobalLoaderOptions() {
  const state = getGlobalLoaderState();
  state.globalOptions = state.globalOptions || {
    ..._option_defaults_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_LOADER_OPTIONS
  };
  return state.globalOptions;
}
function setGlobalOptions(options) {
  const state = getGlobalLoaderState();
  const globalOptions = getGlobalLoaderOptions();
  state.globalOptions = normalizeOptionsInternal(globalOptions, options);
}
function normalizeOptions(options, loader, loaders, url) {
  loaders = loaders || [];
  loaders = Array.isArray(loaders) ? loaders : [loaders];
  validateOptions(options, loaders);
  return normalizeOptionsInternal(loader, options, url);
}
function validateOptions(options, loaders) {
  validateOptionsObject(options, null, _option_defaults_js__WEBPACK_IMPORTED_MODULE_0__.DEFAULT_LOADER_OPTIONS, _option_defaults_js__WEBPACK_IMPORTED_MODULE_0__.REMOVED_LOADER_OPTIONS, loaders);
  for (const loader of loaders) {
    const idOptions = options && options[loader.id] || {};
    const loaderOptions = loader.options && loader.options[loader.id] || {};
    const deprecatedOptions = loader.deprecatedOptions && loader.deprecatedOptions[loader.id] || {};
    validateOptionsObject(idOptions, loader.id, loaderOptions, deprecatedOptions, loaders);
  }
}
function validateOptionsObject(options, id, defaultOptions, deprecatedOptions, loaders) {
  const loaderName = id || 'Top level';
  const prefix = id ? `${id}.` : '';
  for (const key in options) {
    const isSubOptions = !id && (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isObject)(options[key]);
    const isBaseUriOption = key === 'baseUri' && !id;
    const isWorkerUrlOption = key === 'workerUrl' && id;
    if (!(key in defaultOptions) && !isBaseUriOption && !isWorkerUrlOption) {
      if (key in deprecatedOptions) {
        _loggers_js__WEBPACK_IMPORTED_MODULE_2__.probeLog.warn(`${loaderName} loader option \'${prefix}${key}\' no longer supported, use \'${deprecatedOptions[key]}\'`)();
      } else if (!isSubOptions) {
        const suggestion = findSimilarOption(key, loaders);
        _loggers_js__WEBPACK_IMPORTED_MODULE_2__.probeLog.warn(`${loaderName} loader option \'${prefix}${key}\' not recognized. ${suggestion}`)();
      }
    }
  }
}
function findSimilarOption(optionKey, loaders) {
  const lowerCaseOptionKey = optionKey.toLowerCase();
  let bestSuggestion = '';
  for (const loader of loaders) {
    for (const key in loader.options) {
      if (optionKey === key) {
        return `Did you mean \'${loader.id}.${key}\'?`;
      }
      const lowerCaseKey = key.toLowerCase();
      const isPartialMatch = lowerCaseOptionKey.startsWith(lowerCaseKey) || lowerCaseKey.startsWith(lowerCaseOptionKey);
      if (isPartialMatch) {
        bestSuggestion = bestSuggestion || `Did you mean \'${loader.id}.${key}\'?`;
      }
    }
  }
  return bestSuggestion;
}
function normalizeOptionsInternal(loader, options, url) {
  const loaderDefaultOptions = loader.options || {};
  const mergedOptions = {
    ...loaderDefaultOptions
  };
  addUrlOptions(mergedOptions, url);
  if (mergedOptions.log === null) {
    mergedOptions.log = new _loggers_js__WEBPACK_IMPORTED_MODULE_2__.NullLog();
  }
  mergeNestedFields(mergedOptions, getGlobalLoaderOptions());
  mergeNestedFields(mergedOptions, options);
  return mergedOptions;
}
function mergeNestedFields(mergedOptions, options) {
  for (const key in options) {
    if (key in options) {
      const value = options[key];
      if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isPureObject)(value) && (0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_1__.isPureObject)(mergedOptions[key])) {
        mergedOptions[key] = {
          ...mergedOptions[key],
          ...options[key]
        };
      } else {
        mergedOptions[key] = options[key];
      }
    }
  }
}
function addUrlOptions(options, url) {
  if (url && !('baseUri' in options)) {
    options.baseUri = url;
  }
}
//# sourceMappingURL=option-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/utils/log.js":
/*!*************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/utils/log.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   log: () => (/* binding */ log)
/* harmony export */ });
/* harmony import */ var _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/log */ "./node_modules/@probe.gl/log/dist/log.js");

const log = new _probe_gl_log__WEBPACK_IMPORTED_MODULE_0__.Log({
  id: 'loaders.gl'
});
//# sourceMappingURL=log.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/utils/mime-type-utils.js":
/*!*************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/utils/mime-type-utils.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   parseMIMEType: () => (/* binding */ parseMIMEType),
/* harmony export */   parseMIMETypeFromURL: () => (/* binding */ parseMIMETypeFromURL)
/* harmony export */ });
const DATA_URL_PATTERN = /^data:([-\w.]+\/[-\w.+]+)(;|,)/;
const MIME_TYPE_PATTERN = /^([-\w.]+\/[-\w.+]+)/;
function parseMIMEType(mimeString) {
  const matches = MIME_TYPE_PATTERN.exec(mimeString);
  if (matches) {
    return matches[1];
  }
  return mimeString;
}
function parseMIMETypeFromURL(url) {
  const matches = DATA_URL_PATTERN.exec(url);
  if (matches) {
    return matches[1];
  }
  return '';
}
//# sourceMappingURL=mime-type-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js":
/*!************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getResourceContentLength: () => (/* binding */ getResourceContentLength),
/* harmony export */   getResourceMIMEType: () => (/* binding */ getResourceMIMEType),
/* harmony export */   getResourceUrl: () => (/* binding */ getResourceUrl)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./mime-type-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/mime-type-utils.js");
/* harmony import */ var _url_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./url-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js");



function getResourceUrl(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    const response = resource;
    return response.url;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(resource)) {
    const blob = resource;
    return blob.name || '';
  }
  if (typeof resource === 'string') {
    return resource;
  }
  return '';
}
function getResourceMIMEType(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    const response = resource;
    const contentTypeHeader = response.headers.get('content-type') || '';
    const noQueryUrl = (0,_url_utils_js__WEBPACK_IMPORTED_MODULE_1__.stripQueryString)(response.url);
    return (0,_mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseMIMEType)(contentTypeHeader) || (0,_mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseMIMETypeFromURL)(noQueryUrl);
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(resource)) {
    const blob = resource;
    return blob.type || '';
  }
  if (typeof resource === 'string') {
    return (0,_mime_type_utils_js__WEBPACK_IMPORTED_MODULE_2__.parseMIMETypeFromURL)(resource);
  }
  return '';
}
function getResourceContentLength(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    const response = resource;
    return response.headers['content-length'] || -1;
  }
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isBlob)(resource)) {
    const blob = resource;
    return blob.size;
  }
  if (typeof resource === 'string') {
    return resource.length;
  }
  if (resource instanceof ArrayBuffer) {
    return resource.byteLength;
  }
  if (ArrayBuffer.isView(resource)) {
    return resource.byteLength;
  }
  return -1;
}
//# sourceMappingURL=resource-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js":
/*!************************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/utils/response-utils.js ***!
  \************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   checkResponse: () => (/* binding */ checkResponse),
/* harmony export */   checkResponseSync: () => (/* binding */ checkResponseSync),
/* harmony export */   makeResponse: () => (/* binding */ makeResponse)
/* harmony export */ });
/* harmony import */ var _javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../javascript-utils/is-type.js */ "./node_modules/@loaders.gl/core/dist/javascript-utils/is-type.js");
/* harmony import */ var _resource_utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./resource-utils.js */ "./node_modules/@loaders.gl/core/dist/lib/utils/resource-utils.js");


async function makeResponse(resource) {
  if ((0,_javascript_utils_is_type_js__WEBPACK_IMPORTED_MODULE_0__.isResponse)(resource)) {
    return resource;
  }
  const headers = {};
  const contentLength = (0,_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceContentLength)(resource);
  if (contentLength >= 0) {
    headers['content-length'] = String(contentLength);
  }
  const url = (0,_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceUrl)(resource);
  const type = (0,_resource_utils_js__WEBPACK_IMPORTED_MODULE_1__.getResourceMIMEType)(resource);
  if (type) {
    headers['content-type'] = type;
  }
  const initialDataUrl = await getInitialDataUrl(resource);
  if (initialDataUrl) {
    headers['x-first-bytes'] = initialDataUrl;
  }
  if (typeof resource === 'string') {
    resource = new TextEncoder().encode(resource);
  }
  const response = new Response(resource, {
    headers
  });
  Object.defineProperty(response, 'url', {
    value: url
  });
  return response;
}
async function checkResponse(response) {
  if (!response.ok) {
    const message = await getResponseError(response);
    throw new Error(message);
  }
}
function checkResponseSync(response) {
  if (!response.ok) {
    let message = `${response.status} ${response.statusText}`;
    message = message.length > 60 ? `${message.slice(0, 60)}...` : message;
    throw new Error(message);
  }
}
async function getResponseError(response) {
  let message = `Failed to fetch resource ${response.url} (${response.status}): `;
  try {
    const contentType = response.headers.get('Content-Type');
    let text = response.statusText;
    if (contentType !== null && contentType !== void 0 && contentType.includes('application/json')) {
      text += ` ${await response.text()}`;
    }
    message += text;
    message = message.length > 60 ? `${message.slice(0, 60)}...` : message;
  } catch (error) {}
  return message;
}
async function getInitialDataUrl(resource) {
  const INITIAL_DATA_LENGTH = 5;
  if (typeof resource === 'string') {
    return `data:,${resource.slice(0, INITIAL_DATA_LENGTH)}`;
  }
  if (resource instanceof Blob) {
    const blobSlice = resource.slice(0, 5);
    return await new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = event => {
        var _event$target;
        return resolve(event === null || event === void 0 ? void 0 : (_event$target = event.target) === null || _event$target === void 0 ? void 0 : _event$target.result);
      };
      reader.readAsDataURL(blobSlice);
    });
  }
  if (resource instanceof ArrayBuffer) {
    const slice = resource.slice(0, INITIAL_DATA_LENGTH);
    const base64 = arrayBufferToBase64(slice);
    return `data:base64,${base64}`;
  }
  return null;
}
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
//# sourceMappingURL=response-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@loaders.gl/core/dist/lib/utils/url-utils.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   extractQueryString: () => (/* binding */ extractQueryString),
/* harmony export */   stripQueryString: () => (/* binding */ stripQueryString)
/* harmony export */ });
const QUERY_STRING_PATTERN = /\?.*/;
function extractQueryString(url) {
  const matches = url.match(QUERY_STRING_PATTERN);
  return matches && matches[0];
}
function stripQueryString(url) {
  return url.replace(QUERY_STRING_PATTERN, '');
}
//# sourceMappingURL=url-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/gltf/dist/glb-loader.js":
/*!**********************************************************!*\
  !*** ./node_modules/@loaders.gl/gltf/dist/glb-loader.js ***!
  \**********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GLBLoader: () => (/* binding */ GLBLoader)
/* harmony export */ });
/* harmony import */ var _lib_utils_version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/utils/version.js */ "./node_modules/@loaders.gl/gltf/dist/lib/utils/version.js");
/* harmony import */ var _lib_parsers_parse_glb_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/parsers/parse-glb.js */ "./node_modules/@loaders.gl/gltf/dist/lib/parsers/parse-glb.js");


const GLBLoader = {
  name: 'GLB',
  id: 'glb',
  module: 'gltf',
  version: _lib_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION,
  extensions: ['glb'],
  mimeTypes: ['model/gltf-binary'],
  binary: true,
  parse,
  parseSync,
  options: {
    glb: {
      strict: false
    }
  }
};
async function parse(arrayBuffer, options) {
  return parseSync(arrayBuffer, options);
}
function parseSync(arrayBuffer, options) {
  const {
    byteOffset = 0
  } = options || {};
  const glb = {};
  (0,_lib_parsers_parse_glb_js__WEBPACK_IMPORTED_MODULE_1__.parseGLBSync)(glb, arrayBuffer, byteOffset, options === null || options === void 0 ? void 0 : options.glb);
  return glb;
}
//# sourceMappingURL=glb-loader.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/gltf/dist/lib/parsers/parse-glb.js":
/*!*********************************************************************!*\
  !*** ./node_modules/@loaders.gl/gltf/dist/lib/parsers/parse-glb.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isGLB: () => (/* binding */ isGLB),
/* harmony export */   parseGLBSync: () => (/* binding */ parseGLBSync)
/* harmony export */ });
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/loader-utils */ "./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-copy-utils.js");

const LITTLE_ENDIAN = true;
const MAGIC_glTF = 0x676c5446;
const GLB_FILE_HEADER_SIZE = 12;
const GLB_CHUNK_HEADER_SIZE = 8;
const GLB_CHUNK_TYPE_JSON = 0x4e4f534a;
const GLB_CHUNK_TYPE_BIN = 0x004e4942;
const GLB_V1_CONTENT_FORMAT_JSON = 0x0;
const GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED = 0;
const GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED = 1;
function getMagicString(dataView) {
  let byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return `\
${String.fromCharCode(dataView.getUint8(byteOffset + 0))}\
${String.fromCharCode(dataView.getUint8(byteOffset + 1))}\
${String.fromCharCode(dataView.getUint8(byteOffset + 2))}\
${String.fromCharCode(dataView.getUint8(byteOffset + 3))}`;
}
function isGLB(arrayBuffer) {
  let byteOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  let options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const dataView = new DataView(arrayBuffer);
  const {
    magic = MAGIC_glTF
  } = options;
  const magic1 = dataView.getUint32(byteOffset, false);
  return magic1 === magic || magic1 === MAGIC_glTF;
}
function parseGLBSync(glb, arrayBuffer) {
  let byteOffset = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  let options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {};
  const dataView = new DataView(arrayBuffer);
  const type = getMagicString(dataView, byteOffset + 0);
  const version = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
  const byteLength = dataView.getUint32(byteOffset + 8, LITTLE_ENDIAN);
  Object.assign(glb, {
    header: {
      byteOffset,
      byteLength,
      hasBinChunk: false
    },
    type,
    version,
    json: {},
    binChunks: []
  });
  byteOffset += GLB_FILE_HEADER_SIZE;
  switch (glb.version) {
    case 1:
      return parseGLBV1(glb, dataView, byteOffset);
    case 2:
      return parseGLBV2(glb, dataView, byteOffset, options = {});
    default:
      throw new Error(`Invalid GLB version ${glb.version}. Only supports version 1 and 2.`);
  }
}
function parseGLBV1(glb, dataView, byteOffset) {
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  const contentLength = dataView.getUint32(byteOffset + 0, LITTLE_ENDIAN);
  const contentFormat = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
  byteOffset += GLB_CHUNK_HEADER_SIZE;
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(contentFormat === GLB_V1_CONTENT_FORMAT_JSON);
  parseJSONChunk(glb, dataView, byteOffset, contentLength);
  byteOffset += contentLength;
  byteOffset += parseBINChunk(glb, dataView, byteOffset, glb.header.byteLength);
  return byteOffset;
}
function parseGLBV2(glb, dataView, byteOffset, options) {
  (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_0__.assert)(glb.header.byteLength > GLB_FILE_HEADER_SIZE + GLB_CHUNK_HEADER_SIZE);
  parseGLBChunksSync(glb, dataView, byteOffset, options);
  return byteOffset + glb.header.byteLength;
}
function parseGLBChunksSync(glb, dataView, byteOffset, options) {
  while (byteOffset + 8 <= glb.header.byteLength) {
    const chunkLength = dataView.getUint32(byteOffset + 0, LITTLE_ENDIAN);
    const chunkFormat = dataView.getUint32(byteOffset + 4, LITTLE_ENDIAN);
    byteOffset += GLB_CHUNK_HEADER_SIZE;
    switch (chunkFormat) {
      case GLB_CHUNK_TYPE_JSON:
        parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        break;
      case GLB_CHUNK_TYPE_BIN:
        parseBINChunk(glb, dataView, byteOffset, chunkLength);
        break;
      case GLB_CHUNK_TYPE_JSON_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseJSONChunk(glb, dataView, byteOffset, chunkLength);
        }
        break;
      case GLB_CHUNK_TYPE_BIX_XVIZ_DEPRECATED:
        if (!options.strict) {
          parseBINChunk(glb, dataView, byteOffset, chunkLength);
        }
        break;
      default:
        break;
    }
    byteOffset += (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.padToNBytes)(chunkLength, 4);
  }
  return byteOffset;
}
function parseJSONChunk(glb, dataView, byteOffset, chunkLength) {
  const jsonChunk = new Uint8Array(dataView.buffer, byteOffset, chunkLength);
  const textDecoder = new TextDecoder('utf8');
  const jsonText = textDecoder.decode(jsonChunk);
  glb.json = JSON.parse(jsonText);
  return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.padToNBytes)(chunkLength, 4);
}
function parseBINChunk(glb, dataView, byteOffset, chunkLength) {
  glb.header.hasBinChunk = true;
  glb.binChunks.push({
    byteOffset,
    byteLength: chunkLength,
    arrayBuffer: dataView.buffer
  });
  return (0,_loaders_gl_loader_utils__WEBPACK_IMPORTED_MODULE_1__.padToNBytes)(chunkLength, 4);
}
//# sourceMappingURL=parse-glb.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/gltf/dist/lib/utils/version.js":
/*!*****************************************************************!*\
  !*** ./node_modules/@loaders.gl/gltf/dist/lib/utils/version.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const VERSION =  true ? "4.1.3" : 0;
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js":
/*!*******************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js ***!
  \*******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   compareArrayBuffers: () => (/* binding */ compareArrayBuffers),
/* harmony export */   concatenateArrayBuffers: () => (/* binding */ concatenateArrayBuffers),
/* harmony export */   concatenateArrayBuffersFromArray: () => (/* binding */ concatenateArrayBuffersFromArray),
/* harmony export */   concatenateTypedArrays: () => (/* binding */ concatenateTypedArrays),
/* harmony export */   sliceArrayBuffer: () => (/* binding */ sliceArrayBuffer)
/* harmony export */ });
function compareArrayBuffers(arrayBuffer1, arrayBuffer2, byteLength) {
  byteLength = byteLength || arrayBuffer1.byteLength;
  if (arrayBuffer1.byteLength < byteLength || arrayBuffer2.byteLength < byteLength) {
    return false;
  }
  const array1 = new Uint8Array(arrayBuffer1);
  const array2 = new Uint8Array(arrayBuffer2);
  for (let i = 0; i < array1.length; ++i) {
    if (array1[i] !== array2[i]) {
      return false;
    }
  }
  return true;
}
function concatenateArrayBuffers() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }
  return concatenateArrayBuffersFromArray(sources);
}
function concatenateArrayBuffersFromArray(sources) {
  const sourceArrays = sources.map(source2 => source2 instanceof ArrayBuffer ? new Uint8Array(source2) : source2);
  const byteLength = sourceArrays.reduce((length, typedArray) => length + typedArray.byteLength, 0);
  const result = new Uint8Array(byteLength);
  let offset = 0;
  for (const sourceArray of sourceArrays) {
    result.set(sourceArray, offset);
    offset += sourceArray.byteLength;
  }
  return result.buffer;
}
function concatenateTypedArrays() {
  for (var _len2 = arguments.length, typedArrays = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
    typedArrays[_key2] = arguments[_key2];
  }
  const arrays = typedArrays;
  const TypedArrayConstructor = arrays && arrays.length > 1 && arrays[0].constructor || null;
  if (!TypedArrayConstructor) {
    throw new Error('"concatenateTypedArrays" - incorrect quantity of arguments or arguments have incompatible data types');
  }
  const sumLength = arrays.reduce((acc, value) => acc + value.length, 0);
  const result = new TypedArrayConstructor(sumLength);
  let offset = 0;
  for (const array of arrays) {
    result.set(array, offset);
    offset += array.length;
  }
  return result;
}
function sliceArrayBuffer(arrayBuffer, byteOffset, byteLength) {
  const subArray = byteLength !== undefined ? new Uint8Array(arrayBuffer).subarray(byteOffset, byteOffset + byteLength) : new Uint8Array(arrayBuffer).subarray(byteOffset);
  const arrayCopy = new Uint8Array(subArray);
  return arrayCopy.buffer;
}
//# sourceMappingURL=array-buffer-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-conversion-utils.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-conversion-utils.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBuffer: () => (/* binding */ isBuffer),
/* harmony export */   toArrayBuffer: () => (/* binding */ toArrayBuffer),
/* harmony export */   toBuffer: () => (/* binding */ toBuffer)
/* harmony export */ });
/* harmony import */ var _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../node/buffer.js */ "./node_modules/@loaders.gl/loader-utils/dist/lib/node/buffer.browser.js");

function isBuffer(value) {
  return value && typeof value === 'object' && value.isBuffer;
}
function toBuffer(data) {
  return _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__.toBuffer ? _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__.toBuffer(data) : data;
}
function toArrayBuffer(data) {
  if (isBuffer(data)) {
    return _node_buffer_js__WEBPACK_IMPORTED_MODULE_0__.toArrayBuffer(data);
  }
  if (data instanceof ArrayBuffer) {
    return data;
  }
  if (ArrayBuffer.isView(data)) {
    if (data.byteOffset === 0 && data.byteLength === data.buffer.byteLength) {
      return data.buffer;
    }
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }
  if (typeof data === 'string') {
    const text = data;
    const uint8Array = new TextEncoder().encode(text);
    return uint8Array.buffer;
  }
  if (data && typeof data === 'object' && data._toArrayBuffer) {
    return data._toArrayBuffer();
  }
  throw new Error('toArrayBuffer');
}
//# sourceMappingURL=memory-conversion-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-copy-utils.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/memory-copy-utils.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   copyArrayBuffer: () => (/* binding */ copyArrayBuffer),
/* harmony export */   copyToArray: () => (/* binding */ copyToArray),
/* harmony export */   padToNBytes: () => (/* binding */ padToNBytes)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/assert.js */ "./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js");

function padToNBytes(byteLength, padding) {
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(byteLength >= 0);
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(padding > 0);
  return byteLength + (padding - 1) & ~(padding - 1);
}
function copyArrayBuffer(targetBuffer, sourceBuffer, byteOffset) {
  let byteLength = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : sourceBuffer.byteLength;
  const targetArray = new Uint8Array(targetBuffer, byteOffset, byteLength);
  const sourceArray = new Uint8Array(sourceBuffer);
  targetArray.set(sourceArray);
  return targetBuffer;
}
function copyToArray(source, target, targetOffset) {
  let sourceArray;
  if (source instanceof ArrayBuffer) {
    sourceArray = new Uint8Array(source);
  } else {
    const srcByteOffset = source.byteOffset;
    const srcByteLength = source.byteLength;
    sourceArray = new Uint8Array(source.buffer || source.arrayBuffer, srcByteOffset, srcByteLength);
  }
  target.set(sourceArray, targetOffset);
  return targetOffset + padToNBytes(sourceArray.byteLength, 4);
}
//# sourceMappingURL=memory-copy-utils.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/assert.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'loader assertion failed.');
  }
}
//# sourceMappingURL=assert.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/env-utils/globals.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   document: () => (/* binding */ document_),
/* harmony export */   global: () => (/* binding */ global_),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isWorker: () => (/* binding */ isWorker),
/* harmony export */   nodeVersion: () => (/* binding */ nodeVersion),
/* harmony export */   self: () => (/* binding */ self_),
/* harmony export */   window: () => (/* binding */ window_)
/* harmony export */ });
const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const self_ = globals.self || globals.window || globals.global || {};
const window_ = globals.window || globals.self || globals.global || {};
const global_ = globals.global || globals.self || globals.window || {};
const document_ = globals.document || {};

const isBrowser = Boolean(typeof process !== 'object' || String(process) !== '[object process]' || process.browser);
const isWorker = typeof importScripts === 'function';
const matches = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
const nodeVersion = matches && parseFloat(matches[1]) || 0;
//# sourceMappingURL=globals.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/iterators/async-iteration.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/iterators/async-iteration.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   concatenateArrayBuffersAsync: () => (/* binding */ concatenateArrayBuffersAsync),
/* harmony export */   concatenateStringsAsync: () => (/* binding */ concatenateStringsAsync),
/* harmony export */   forEach: () => (/* binding */ forEach)
/* harmony export */ });
/* harmony import */ var _binary_utils_array_buffer_utils_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../binary-utils/array-buffer-utils.js */ "./node_modules/@loaders.gl/loader-utils/dist/lib/binary-utils/array-buffer-utils.js");

async function forEach(iterator, visitor) {
  while (true) {
    const {
      done,
      value
    } = await iterator.next();
    if (done) {
      iterator.return();
      return;
    }
    const cancel = visitor(value);
    if (cancel) {
      return;
    }
  }
}
async function concatenateArrayBuffersAsync(asyncIterator) {
  const arrayBuffers = [];
  for await (const chunk of asyncIterator) {
    arrayBuffers.push(chunk);
  }
  return (0,_binary_utils_array_buffer_utils_js__WEBPACK_IMPORTED_MODULE_0__.concatenateArrayBuffers)(...arrayBuffers);
}
async function concatenateStringsAsync(asyncIterator) {
  const strings = [];
  for await (const chunk of asyncIterator) {
    strings.push(chunk);
  }
  return strings.join('');
}
//# sourceMappingURL=async-iteration.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/node/buffer.browser.js":
/*!*******************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/node/buffer.browser.js ***!
  \*******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toArrayBuffer: () => (/* binding */ toArrayBuffer),
/* harmony export */   toBuffer: () => (/* binding */ toBuffer)
/* harmony export */ });
function toArrayBuffer(buffer) {
  return buffer;
}
function toBuffer(binaryData) {
  throw new Error('Buffer not supported in browser');
}
//# sourceMappingURL=buffer.browser.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/option-utils/merge-loader-options.js":
/*!*********************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/option-utils/merge-loader-options.js ***!
  \*********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mergeLoaderOptions: () => (/* binding */ mergeLoaderOptions)
/* harmony export */ });
function mergeLoaderOptions(baseOptions, newOptions) {
  return mergeOptionsRecursively(baseOptions || {}, newOptions);
}
function mergeOptionsRecursively(baseOptions, newOptions) {
  let level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
  if (level > 3) {
    return newOptions;
  }
  const options = {
    ...baseOptions
  };
  for (const [key, newValue] of Object.entries(newOptions)) {
    if (newValue && typeof newValue === 'object' && !Array.isArray(newValue)) {
      options[key] = mergeOptionsRecursively(options[key] || {}, newOptions[key], level + 1);
    } else {
      options[key] = newOptions[key];
    }
  }
  return options;
}
//# sourceMappingURL=merge-loader-options.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/file-aliases.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/file-aliases.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   addAliases: () => (/* binding */ addAliases),
/* harmony export */   getPathPrefix: () => (/* binding */ getPathPrefix),
/* harmony export */   resolvePath: () => (/* binding */ resolvePath),
/* harmony export */   setPathPrefix: () => (/* binding */ setPathPrefix)
/* harmony export */ });
let pathPrefix = '';
const fileAliases = {};
function setPathPrefix(prefix) {
  pathPrefix = prefix;
}
function getPathPrefix() {
  return pathPrefix;
}
function addAliases(aliases) {
  Object.assign(fileAliases, aliases);
}
function resolvePath(filename) {
  for (const alias in fileAliases) {
    if (filename.startsWith(alias)) {
      const replacement = fileAliases[alias];
      filename = filename.replace(alias, replacement);
    }
  }
  if (!filename.startsWith('http://') && !filename.startsWith('https://')) {
    filename = `${pathPrefix}${filename}`;
  }
  return filename;
}
//# sourceMappingURL=file-aliases.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/get-cwd.js":
/*!******************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/get-cwd.js ***!
  \******************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getCWD: () => (/* binding */ getCWD)
/* harmony export */ });
function getCWD() {
  var _window$location;
  if (typeof process !== 'undefined' && typeof process.cwd !== 'undefined') {
    return process.cwd();
  }
  const pathname = (_window$location = window.location) === null || _window$location === void 0 ? void 0 : _window$location.pathname;
  return (pathname === null || pathname === void 0 ? void 0 : pathname.slice(0, pathname.lastIndexOf('/') + 1)) || '';
}
//# sourceMappingURL=get-cwd.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js":
/*!***************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/path.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   dirname: () => (/* binding */ dirname),
/* harmony export */   filename: () => (/* binding */ filename),
/* harmony export */   join: () => (/* binding */ join),
/* harmony export */   resolve: () => (/* binding */ resolve)
/* harmony export */ });
/* harmony import */ var _get_cwd_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./get-cwd.js */ "./node_modules/@loaders.gl/loader-utils/dist/lib/path-utils/get-cwd.js");

function filename(url) {
  const slashIndex = url ? url.lastIndexOf('/') : -1;
  return slashIndex >= 0 ? url.substr(slashIndex + 1) : '';
}
function dirname(url) {
  const slashIndex = url ? url.lastIndexOf('/') : -1;
  return slashIndex >= 0 ? url.substr(0, slashIndex) : '';
}
function join() {
  for (var _len = arguments.length, parts = new Array(_len), _key = 0; _key < _len; _key++) {
    parts[_key] = arguments[_key];
  }
  const separator = '/';
  parts = parts.map((part, index) => {
    if (index) {
      part = part.replace(new RegExp(`^${separator}`), '');
    }
    if (index !== parts.length - 1) {
      part = part.replace(new RegExp(`${separator}$`), '');
    }
    return part;
  });
  return parts.join(separator);
}
function resolve() {
  const paths = [];
  for (let _i = 0; _i < arguments.length; _i++) {
    paths[_i] = _i < 0 || arguments.length <= _i ? undefined : arguments[_i];
  }
  let resolvedPath = '';
  let resolvedAbsolute = false;
  let cwd;
  for (let i = paths.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    let path;
    if (i >= 0) {
      path = paths[i];
    } else {
      if (cwd === undefined) {
        cwd = (0,_get_cwd_js__WEBPACK_IMPORTED_MODULE_0__.getCWD)();
      }
      path = cwd;
    }
    if (path.length === 0) {
      continue;
    }
    resolvedPath = `${path}/${resolvedPath}`;
    resolvedAbsolute = path.charCodeAt(0) === SLASH;
  }
  resolvedPath = normalizeStringPosix(resolvedPath, !resolvedAbsolute);
  if (resolvedAbsolute) {
    return `/${resolvedPath}`;
  } else if (resolvedPath.length > 0) {
    return resolvedPath;
  }
  return '.';
}
const SLASH = 47;
const DOT = 46;
function normalizeStringPosix(path, allowAboveRoot) {
  let res = '';
  let lastSlash = -1;
  let dots = 0;
  let code;
  let isAboveRoot = false;
  for (let i = 0; i <= path.length; ++i) {
    if (i < path.length) {
      code = path.charCodeAt(i);
    } else if (code === SLASH) {
      break;
    } else {
      code = SLASH;
    }
    if (code === SLASH) {
      if (lastSlash === i - 1 || dots === 1) {} else if (lastSlash !== i - 1 && dots === 2) {
        if (res.length < 2 || !isAboveRoot || res.charCodeAt(res.length - 1) !== DOT || res.charCodeAt(res.length - 2) !== DOT) {
          if (res.length > 2) {
            const start = res.length - 1;
            let j = start;
            for (; j >= 0; --j) {
              if (res.charCodeAt(j) === SLASH) {
                break;
              }
            }
            if (j !== start) {
              res = j === -1 ? '' : res.slice(0, j);
              lastSlash = i;
              dots = 0;
              isAboveRoot = false;
              continue;
            }
          } else if (res.length === 2 || res.length === 1) {
            res = '';
            lastSlash = i;
            dots = 0;
            isAboveRoot = false;
            continue;
          }
        }
        if (allowAboveRoot) {
          if (res.length > 0) {
            res += '/..';
          } else {
            res = '..';
          }
          isAboveRoot = true;
        }
      } else {
        const slice = path.slice(lastSlash + 1, i);
        if (res.length > 0) {
          res += `/${slice}`;
        } else {
          res = slice;
        }
        isAboveRoot = false;
      }
      lastSlash = i;
      dots = 0;
    } else if (code === DOT && dots !== -1) {
      ++dots;
    } else {
      dots = -1;
    }
  }
  return res;
}
//# sourceMappingURL=path.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/parse-with-worker.js":
/*!*************************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/loader-utils/dist/lib/worker-loader-utils/parse-with-worker.js ***!
  \*************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   canParseWithWorker: () => (/* binding */ canParseWithWorker),
/* harmony export */   parseWithWorker: () => (/* binding */ parseWithWorker)
/* harmony export */ });
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-farm.js");
/* harmony import */ var _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @loaders.gl/worker-utils */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/get-worker-url.js");


function canParseWithWorker(loader, options) {
  if (!_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported()) {
    return false;
  }
  if (!_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_1__.isBrowser && !(options !== null && options !== void 0 && options._nodeWorkers)) {
    return false;
  }
  return loader.worker && (options === null || options === void 0 ? void 0 : options.worker);
}
async function parseWithWorker(loader, data, options, context, parseOnMainThread) {
  const name = loader.id;
  const url = (0,_loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_2__.getWorkerURL)(loader, options);
  const workerFarm = _loaders_gl_worker_utils__WEBPACK_IMPORTED_MODULE_0__["default"].getWorkerFarm(options);
  const workerPool = workerFarm.getWorkerPool({
    name,
    url
  });
  options = JSON.parse(JSON.stringify(options));
  context = JSON.parse(JSON.stringify(context || {}));
  const job = await workerPool.startJob('process-on-worker', onMessage.bind(null, parseOnMainThread));
  job.postMessage('process', {
    input: data,
    options,
    context
  });
  const result = await job.result;
  return await result.result;
}
async function onMessage(parseOnMainThread, job, type, payload) {
  switch (type) {
    case 'done':
      job.done(payload);
      break;
    case 'error':
      job.error(new Error(payload.error));
      break;
    case 'process':
      const {
        id,
        input,
        options
      } = payload;
      try {
        const result = await parseOnMainThread(input, options);
        job.postMessage('done', {
          id,
          result
        });
      } catch (error) {
        const message = error instanceof Error ? error.message : 'unknown error';
        job.postMessage('error', {
          id,
          error: message
        });
      }
      break;
    default:
      console.warn(`parse-with-worker unknown message ${type}`);
  }
}
//# sourceMappingURL=parse-with-worker.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js":
/*!****************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js ***!
  \****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
  if (!condition) {
    throw new Error(message || 'loaders.gl assertion failed.');
  }
}
//# sourceMappingURL=assert.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   document: () => (/* binding */ document_),
/* harmony export */   global: () => (/* binding */ global_),
/* harmony export */   isBrowser: () => (/* binding */ isBrowser),
/* harmony export */   isMobile: () => (/* binding */ isMobile),
/* harmony export */   isWorker: () => (/* binding */ isWorker),
/* harmony export */   nodeVersion: () => (/* binding */ nodeVersion),
/* harmony export */   self: () => (/* binding */ self_),
/* harmony export */   window: () => (/* binding */ window_)
/* harmony export */ });
const globals = {
  self: typeof self !== 'undefined' && self,
  window: typeof window !== 'undefined' && window,
  global: typeof global !== 'undefined' && global,
  document: typeof document !== 'undefined' && document
};
const self_ = globals.self || globals.window || globals.global || {};
const window_ = globals.window || globals.self || globals.global || {};
const global_ = globals.global || globals.self || globals.window || {};
const document_ = globals.document || {};

const isBrowser = typeof process !== 'object' || String(process) !== '[object process]' || process.browser;
const isWorker = typeof importScripts === 'function';
const isMobile = typeof window !== 'undefined' && typeof window.orientation !== 'undefined';
const matches = typeof process !== 'undefined' && process.version && /v([0-9]*)/.exec(process.version);
const nodeVersion = matches && parseFloat(matches[1]) || 0;
//# sourceMappingURL=globals.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NPM_TAG: () => (/* binding */ NPM_TAG),
/* harmony export */   VERSION: () => (/* binding */ VERSION)
/* harmony export */ });
const NPM_TAG = 'latest';
function getVersion() {
  var _globalThis$_loadersg;
  if (!((_globalThis$_loadersg = globalThis._loadersgl_) !== null && _globalThis$_loadersg !== void 0 && _globalThis$_loadersg.version)) {
    globalThis._loadersgl_ = globalThis._loadersgl_ || {};
    if (false) {} else {
      globalThis._loadersgl_.version = "4.1.3";
    }
  }
  return globalThis._loadersgl_.version;
}
const VERSION = getVersion();
//# sourceMappingURL=version.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/node/worker_threads-browser.js":
/*!***************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/node/worker_threads-browser.js ***!
  \***************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NodeWorker: () => (/* binding */ NodeWorker),
/* harmony export */   parentPort: () => (/* binding */ parentPort)
/* harmony export */ });
class NodeWorker {
  terminate() {}
}
const parentPort = null;
//# sourceMappingURL=worker_threads-browser.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/get-worker-url.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/get-worker-url.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getWorkerName: () => (/* binding */ getWorkerName),
/* harmony export */   getWorkerURL: () => (/* binding */ getWorkerURL)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env-utils/assert.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env-utils/globals.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/version.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js");



function getWorkerName(worker) {
  const warning = worker.version !== _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION ? ` (worker-utils@${_env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION})` : '';
  return `${worker.name}@${worker.version}${warning}`;
}
function getWorkerURL(worker) {
  let options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  const workerOptions = options[worker.id] || {};
  const workerFile = _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_1__.isBrowser ? `${worker.id}-worker.js` : `${worker.id}-worker-node.js`;
  let url = workerOptions.workerUrl;
  if (!url && worker.id === 'compression') {
    url = options.workerUrl;
  }
  if (options._workerType === 'test') {
    if (_env_utils_globals_js__WEBPACK_IMPORTED_MODULE_1__.isBrowser) {
      url = `modules/${worker.module}/dist/${workerFile}`;
    } else {
      url = `modules/${worker.module}/src/workers/${worker.id}-worker-node.ts`;
    }
  }
  if (!url) {
    let version = worker.version;
    if (version === 'latest') {
      version = _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.NPM_TAG;
    }
    const versionTag = version ? `@${version}` : '';
    url = `https://unpkg.com/@loaders.gl/${worker.module}${versionTag}/dist/${workerFile}`;
  }
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__.assert)(url);
  return url;
}
//# sourceMappingURL=get-worker-url.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/validate-worker-version.js":
/*!**********************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-api/validate-worker-version.js ***!
  \**********************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   validateWorkerVersion: () => (/* binding */ validateWorkerVersion)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../env-utils/assert.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/version.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/version.js");


function validateWorkerVersion(worker) {
  let coreVersion = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _env_utils_version_js__WEBPACK_IMPORTED_MODULE_0__.VERSION;
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_1__.assert)(worker, 'no worker provided');
  const workerVersion = worker.version;
  if (!coreVersion || !workerVersion) {
    return false;
  }
  return true;
}
function parseVersion(version) {
  const parts = version.split('.').map(Number);
  return {
    major: parts[0],
    minor: parts[1]
  };
}
//# sourceMappingURL=validate-worker-version.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-farm.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-farm.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerFarm)
/* harmony export */ });
/* harmony import */ var _worker_pool_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./worker-pool.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-pool.js");
/* harmony import */ var _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worker-thread.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js");


const DEFAULT_PROPS = {
  maxConcurrency: 3,
  maxMobileConcurrency: 1,
  reuseWorkers: true,
  onDebug: () => {}
};
class WorkerFarm {
  static isSupported() {
    return _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported();
  }
  static getWorkerFarm() {
    let props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    WorkerFarm._workerFarm = WorkerFarm._workerFarm || new WorkerFarm({});
    WorkerFarm._workerFarm.setProps(props);
    return WorkerFarm._workerFarm;
  }
  constructor(props) {
    this.props = void 0;
    this.workerPools = new Map();
    this.props = {
      ...DEFAULT_PROPS
    };
    this.setProps(props);
    this.workerPools = new Map();
  }
  destroy() {
    for (const workerPool of this.workerPools.values()) {
      workerPool.destroy();
    }
    this.workerPools = new Map();
  }
  setProps(props) {
    this.props = {
      ...this.props,
      ...props
    };
    for (const workerPool of this.workerPools.values()) {
      workerPool.setProps(this._getWorkerPoolProps());
    }
  }
  getWorkerPool(options) {
    const {
      name,
      source,
      url
    } = options;
    let workerPool = this.workerPools.get(name);
    if (!workerPool) {
      workerPool = new _worker_pool_js__WEBPACK_IMPORTED_MODULE_1__["default"]({
        name,
        source,
        url
      });
      workerPool.setProps(this._getWorkerPoolProps());
      this.workerPools.set(name, workerPool);
    }
    return workerPool;
  }
  _getWorkerPoolProps() {
    return {
      maxConcurrency: this.props.maxConcurrency,
      maxMobileConcurrency: this.props.maxMobileConcurrency,
      reuseWorkers: this.props.reuseWorkers,
      onDebug: this.props.onDebug
    };
  }
}
WorkerFarm._workerFarm = void 0;
//# sourceMappingURL=worker-farm.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-job.js":
/*!**********************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-job.js ***!
  \**********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerJob)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/assert.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");

class WorkerJob {
  constructor(jobName, workerThread) {
    this.name = void 0;
    this.workerThread = void 0;
    this.isRunning = true;
    this.result = void 0;
    this._resolve = () => {};
    this._reject = () => {};
    this.name = jobName;
    this.workerThread = workerThread;
    this.result = new Promise((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });
  }
  postMessage(type, payload) {
    this.workerThread.postMessage({
      source: 'loaders.gl',
      type,
      payload
    });
  }
  done(value) {
    (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(this.isRunning);
    this.isRunning = false;
    this._resolve(value);
  }
  error(error) {
    (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(this.isRunning);
    this.isRunning = false;
    this._reject(error);
  }
}
//# sourceMappingURL=worker-job.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-pool.js":
/*!***********************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-pool.js ***!
  \***********************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerPool)
/* harmony export */ });
/* harmony import */ var _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env-utils/globals.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./worker-thread.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js");
/* harmony import */ var _worker_job_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./worker-job.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-job.js");



class WorkerPool {
  static isSupported() {
    return _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__["default"].isSupported();
  }
  constructor(props) {
    this.name = 'unnamed';
    this.source = void 0;
    this.url = void 0;
    this.maxConcurrency = 1;
    this.maxMobileConcurrency = 1;
    this.onDebug = () => {};
    this.reuseWorkers = true;
    this.props = {};
    this.jobQueue = [];
    this.idleQueue = [];
    this.count = 0;
    this.isDestroyed = false;
    this.source = props.source;
    this.url = props.url;
    this.setProps(props);
  }
  destroy() {
    this.idleQueue.forEach(worker => worker.destroy());
    this.isDestroyed = true;
  }
  setProps(props) {
    this.props = {
      ...this.props,
      ...props
    };
    if (props.name !== undefined) {
      this.name = props.name;
    }
    if (props.maxConcurrency !== undefined) {
      this.maxConcurrency = props.maxConcurrency;
    }
    if (props.maxMobileConcurrency !== undefined) {
      this.maxMobileConcurrency = props.maxMobileConcurrency;
    }
    if (props.reuseWorkers !== undefined) {
      this.reuseWorkers = props.reuseWorkers;
    }
    if (props.onDebug !== undefined) {
      this.onDebug = props.onDebug;
    }
  }
  async startJob(name) {
    let onMessage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : (job, type, data) => job.done(data);
    let onError = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : (job, error) => job.error(error);
    const startPromise = new Promise(onStart => {
      this.jobQueue.push({
        name,
        onMessage,
        onError,
        onStart
      });
      return this;
    });
    this._startQueuedJob();
    return await startPromise;
  }
  async _startQueuedJob() {
    if (!this.jobQueue.length) {
      return;
    }
    const workerThread = this._getAvailableWorker();
    if (!workerThread) {
      return;
    }
    const queuedJob = this.jobQueue.shift();
    if (queuedJob) {
      this.onDebug({
        message: 'Starting job',
        name: queuedJob.name,
        workerThread,
        backlog: this.jobQueue.length
      });
      const job = new _worker_job_js__WEBPACK_IMPORTED_MODULE_1__["default"](queuedJob.name, workerThread);
      workerThread.onMessage = data => queuedJob.onMessage(job, data.type, data.payload);
      workerThread.onError = error => queuedJob.onError(job, error);
      queuedJob.onStart(job);
      try {
        await job.result;
      } catch (error) {
        console.error(`Worker exception: ${error}`);
      } finally {
        this.returnWorkerToQueue(workerThread);
      }
    }
  }
  returnWorkerToQueue(worker) {
    const shouldDestroyWorker = !_env_utils_globals_js__WEBPACK_IMPORTED_MODULE_2__.isBrowser || this.isDestroyed || !this.reuseWorkers || this.count > this._getMaxConcurrency();
    if (shouldDestroyWorker) {
      worker.destroy();
      this.count--;
    } else {
      this.idleQueue.push(worker);
    }
    if (!this.isDestroyed) {
      this._startQueuedJob();
    }
  }
  _getAvailableWorker() {
    if (this.idleQueue.length > 0) {
      return this.idleQueue.shift() || null;
    }
    if (this.count < this._getMaxConcurrency()) {
      this.count++;
      const name = `${this.name.toLowerCase()} (#${this.count} of ${this.maxConcurrency})`;
      return new _worker_thread_js__WEBPACK_IMPORTED_MODULE_0__["default"]({
        name,
        source: this.source,
        url: this.url
      });
    }
    return null;
  }
  _getMaxConcurrency() {
    return _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_2__.isMobile ? this.maxMobileConcurrency : this.maxConcurrency;
  }
}
//# sourceMappingURL=worker-pool.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js":
/*!*************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-farm/worker-thread.js ***!
  \*************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ WorkerThread)
/* harmony export */ });
/* harmony import */ var _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../node/worker_threads.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/node/worker_threads-browser.js");
/* harmony import */ var _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/globals.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/globals.js");
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../env-utils/assert.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");
/* harmony import */ var _worker_utils_get_loadable_worker_url_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../worker-utils/get-loadable-worker-url.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-loadable-worker-url.js");
/* harmony import */ var _worker_utils_get_transfer_list_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../worker-utils/get-transfer-list.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js");





const NOOP = () => {};
class WorkerThread {
  static isSupported() {
    return typeof Worker !== 'undefined' && _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser || typeof _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__.NodeWorker !== 'undefined' && !_env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser;
  }
  constructor(props) {
    this.name = void 0;
    this.source = void 0;
    this.url = void 0;
    this.terminated = false;
    this.worker = void 0;
    this.onMessage = void 0;
    this.onError = void 0;
    this._loadableURL = '';
    const {
      name,
      source,
      url
    } = props;
    (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_2__.assert)(source || url);
    this.name = name;
    this.source = source;
    this.url = url;
    this.onMessage = NOOP;
    this.onError = error => console.log(error);
    this.worker = _env_utils_globals_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser ? this._createBrowserWorker() : this._createNodeWorker();
  }
  destroy() {
    this.onMessage = NOOP;
    this.onError = NOOP;
    this.worker.terminate();
    this.terminated = true;
  }
  get isRunning() {
    return Boolean(this.onMessage);
  }
  postMessage(data, transferList) {
    transferList = transferList || (0,_worker_utils_get_transfer_list_js__WEBPACK_IMPORTED_MODULE_3__.getTransferList)(data);
    this.worker.postMessage(data, transferList);
  }
  _getErrorFromErrorEvent(event) {
    let message = 'Failed to load ';
    message += `worker ${this.name} from ${this.url}. `;
    if (event.message) {
      message += `${event.message} in `;
    }
    if (event.lineno) {
      message += `:${event.lineno}:${event.colno}`;
    }
    return new Error(message);
  }
  _createBrowserWorker() {
    this._loadableURL = (0,_worker_utils_get_loadable_worker_url_js__WEBPACK_IMPORTED_MODULE_4__.getLoadableWorkerURL)({
      source: this.source,
      url: this.url
    });
    const worker = new Worker(this._loadableURL, {
      name: this.name
    });
    worker.onmessage = event => {
      if (!event.data) {
        this.onError(new Error('No data received'));
      } else {
        this.onMessage(event.data);
      }
    };
    worker.onerror = error => {
      this.onError(this._getErrorFromErrorEvent(error));
      this.terminated = true;
    };
    worker.onmessageerror = event => console.error(event);
    return worker;
  }
  _createNodeWorker() {
    let worker;
    if (this.url) {
      const absolute = this.url.includes(':/') || this.url.startsWith('/');
      const url = absolute ? this.url : `./${this.url}`;
      worker = new _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__.NodeWorker(url, {
        eval: false
      });
    } else if (this.source) {
      worker = new _node_worker_threads_js__WEBPACK_IMPORTED_MODULE_1__.NodeWorker(this.source, {
        eval: true
      });
    } else {
      throw new Error('no worker');
    }
    worker.on('message', data => {
      this.onMessage(data);
    });
    worker.on('error', error => {
      this.onError(error);
    });
    worker.on('exit', code => {});
    return worker;
  }
}
//# sourceMappingURL=worker-thread.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-loadable-worker-url.js":
/*!************************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-loadable-worker-url.js ***!
  \************************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getLoadableWorkerURL: () => (/* binding */ getLoadableWorkerURL)
/* harmony export */ });
/* harmony import */ var _env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../env-utils/assert.js */ "./node_modules/@loaders.gl/worker-utils/dist/lib/env-utils/assert.js");

const workerURLCache = new Map();
function getLoadableWorkerURL(props) {
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(props.source && !props.url || !props.source && props.url);
  let workerURL = workerURLCache.get(props.source || props.url);
  if (!workerURL) {
    if (props.url) {
      workerURL = getLoadableWorkerURLFromURL(props.url);
      workerURLCache.set(props.url, workerURL);
    }
    if (props.source) {
      workerURL = getLoadableWorkerURLFromSource(props.source);
      workerURLCache.set(props.source, workerURL);
    }
  }
  (0,_env_utils_assert_js__WEBPACK_IMPORTED_MODULE_0__.assert)(workerURL);
  return workerURL;
}
function getLoadableWorkerURLFromURL(url) {
  if (!url.startsWith('http')) {
    return url;
  }
  const workerSource = buildScriptSource(url);
  return getLoadableWorkerURLFromSource(workerSource);
}
function getLoadableWorkerURLFromSource(workerSource) {
  const blob = new Blob([workerSource], {
    type: 'application/javascript'
  });
  return URL.createObjectURL(blob);
}
function buildScriptSource(workerUrl) {
  return `\
try {
  importScripts('${workerUrl}');
} catch (error) {
  console.error(error);
  throw error;
}`;
}
//# sourceMappingURL=get-loadable-worker-url.js.map

/***/ }),

/***/ "./node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js":
/*!******************************************************************************************!*\
  !*** ./node_modules/@loaders.gl/worker-utils/dist/lib/worker-utils/get-transfer-list.js ***!
  \******************************************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getTransferList: () => (/* binding */ getTransferList),
/* harmony export */   getTransferListForWriter: () => (/* binding */ getTransferListForWriter)
/* harmony export */ });
function getTransferList(object) {
  let recursive = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  let transfers = arguments.length > 2 ? arguments[2] : undefined;
  const transfersSet = transfers || new Set();
  if (!object) {} else if (isTransferable(object)) {
    transfersSet.add(object);
  } else if (isTransferable(object.buffer)) {
    transfersSet.add(object.buffer);
  } else if (ArrayBuffer.isView(object)) {} else if (recursive && typeof object === 'object') {
    for (const key in object) {
      getTransferList(object[key], recursive, transfersSet);
    }
  }
  return transfers === undefined ? Array.from(transfersSet) : [];
}
function isTransferable(object) {
  if (!object) {
    return false;
  }
  if (object instanceof ArrayBuffer) {
    return true;
  }
  if (typeof MessagePort !== 'undefined' && object instanceof MessagePort) {
    return true;
  }
  if (typeof ImageBitmap !== 'undefined' && object instanceof ImageBitmap) {
    return true;
  }
  if (typeof OffscreenCanvas !== 'undefined' && object instanceof OffscreenCanvas) {
    return true;
  }
  return false;
}
function getTransferListForWriter(object) {
  if (object === null) {
    return {};
  }
  const clone = Object.assign({}, object);
  Object.keys(clone).forEach(key => {
    if (typeof object[key] === 'object' && !ArrayBuffer.isView(object[key]) && !(object[key] instanceof Array)) {
      clone[key] = getTransferListForWriter(object[key]);
    } else if (typeof clone[key] === 'function' || clone[key] instanceof RegExp) {
      clone[key] = {};
    } else {
      clone[key] = object[key];
    }
  });
  return clone;
}
//# sourceMappingURL=get-transfer-list.js.map

/***/ }),

/***/ "./node_modules/@probe.gl/env/dist/index.js":
/*!**************************************************!*\
  !*** ./node_modules/@probe.gl/env/dist/index.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   VERSION: () => (/* binding */ VERSION),
/* harmony export */   assert: () => (/* reexport safe */ _utils_assert_js__WEBPACK_IMPORTED_MODULE_4__.assert),
/* harmony export */   console: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.console),
/* harmony export */   document: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.document),
/* harmony export */   getBrowser: () => (/* reexport safe */ _lib_get_browser_js__WEBPACK_IMPORTED_MODULE_2__.getBrowser),
/* harmony export */   global: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.global),
/* harmony export */   isBrowser: () => (/* reexport safe */ _lib_is_browser_js__WEBPACK_IMPORTED_MODULE_1__.isBrowser),
/* harmony export */   isElectron: () => (/* reexport safe */ _lib_is_electron_js__WEBPACK_IMPORTED_MODULE_3__.isElectron),
/* harmony export */   isMobile: () => (/* reexport safe */ _lib_get_browser_js__WEBPACK_IMPORTED_MODULE_2__.isMobile),
/* harmony export */   process: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.process),
/* harmony export */   self: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.self),
/* harmony export */   window: () => (/* reexport safe */ _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__.window)
/* harmony export */ });
/* harmony import */ var _lib_globals_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./lib/globals.js */ "./node_modules/@probe.gl/env/dist/lib/globals.js");
/* harmony import */ var _lib_is_browser_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./lib/is-browser.js */ "./node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _lib_get_browser_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./lib/get-browser.js */ "./node_modules/@probe.gl/env/dist/lib/get-browser.js");
/* harmony import */ var _lib_is_electron_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./lib/is-electron.js */ "./node_modules/@probe.gl/env/dist/lib/is-electron.js");
/* harmony import */ var _utils_assert_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/assert.js */ "./node_modules/@probe.gl/env/dist/utils/assert.js");
// Extract injected version from package.json (injected by babel plugin)
// @ts-expect-error
const VERSION =  true ? "4.0.7" : 0;
// ENVIRONMENT




// ENVIRONMENT'S ASSERT IS 5-15KB, SO WE PROVIDE OUR OWN

// TODO - wish we could just export a constant
// export const isBrowser = checkIfBrowser();


/***/ }),

/***/ "./node_modules/@probe.gl/env/dist/lib/get-browser.js":
/*!************************************************************!*\
  !*** ./node_modules/@probe.gl/env/dist/lib/get-browser.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBrowser: () => (/* binding */ getBrowser),
/* harmony export */   isMobile: () => (/* binding */ isMobile)
/* harmony export */ });
/* harmony import */ var _is_browser_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is-browser.js */ "./node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _is_electron_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./is-electron.js */ "./node_modules/@probe.gl/env/dist/lib/is-electron.js");
/* harmony import */ var _globals_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./globals.js */ "./node_modules/@probe.gl/env/dist/lib/globals.js");
// Copyright (c) 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
// This function is needed in initialization stages,
// make sure it can be imported in isolation



function isMobile() {
    return typeof globalThis.orientation !== 'undefined';
}
// Simple browser detection
// `mockUserAgent` parameter allows user agent to be overridden for testing
/* eslint-disable complexity */
function getBrowser(mockUserAgent) {
    if (!mockUserAgent && !(0,_is_browser_js__WEBPACK_IMPORTED_MODULE_0__.isBrowser)()) {
        return 'Node';
    }
    if ((0,_is_electron_js__WEBPACK_IMPORTED_MODULE_1__.isElectron)(mockUserAgent)) {
        return 'Electron';
    }
    const userAgent = mockUserAgent || _globals_js__WEBPACK_IMPORTED_MODULE_2__.navigator.userAgent || '';
    // NOTE: Order of tests matter, as many agents list Chrome etc.
    if (userAgent.indexOf('Edge') > -1) {
        return 'Edge';
    }
    if (globalThis.chrome) {
        return 'Chrome';
    }
    if (globalThis.safari) {
        return 'Safari';
    }
    if (globalThis.mozInnerScreenX) {
        return 'Firefox';
    }
    return 'Unknown';
}


/***/ }),

/***/ "./node_modules/@probe.gl/env/dist/lib/globals.js":
/*!********************************************************!*\
  !*** ./node_modules/@probe.gl/env/dist/lib/globals.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   console: () => (/* binding */ console_),
/* harmony export */   document: () => (/* binding */ document_),
/* harmony export */   global: () => (/* binding */ global_),
/* harmony export */   navigator: () => (/* binding */ navigator_),
/* harmony export */   process: () => (/* binding */ process_),
/* harmony export */   self: () => (/* binding */ global_),
/* harmony export */   window: () => (/* binding */ window_)
/* harmony export */ });
// Do not name these variables the same as the global objects - will break bundling
const global_ = globalThis;
const window_ = globalThis;
const document_ = globalThis.document || {};
const process_ = globalThis.process || {};
const console_ = globalThis.console;
const navigator_ = globalThis.navigator || {};



/***/ }),

/***/ "./node_modules/@probe.gl/env/dist/lib/is-browser.js":
/*!***********************************************************!*\
  !*** ./node_modules/@probe.gl/env/dist/lib/is-browser.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isBrowser: () => (/* binding */ isBrowser)
/* harmony export */ });
/* harmony import */ var _is_electron_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./is-electron.js */ "./node_modules/@probe.gl/env/dist/lib/is-electron.js");
// This function is needed in initialization stages,
// make sure it can be imported in isolation

/** Check if in browser by duck-typing Node context */
function isBrowser() {
    const isNode = 
    // @ts-expect-error
    typeof process === 'object' && String(process) === '[object process]' && !process?.browser;
    return !isNode || (0,_is_electron_js__WEBPACK_IMPORTED_MODULE_0__.isElectron)();
}


/***/ }),

/***/ "./node_modules/@probe.gl/env/dist/lib/is-electron.js":
/*!************************************************************!*\
  !*** ./node_modules/@probe.gl/env/dist/lib/is-electron.js ***!
  \************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isElectron: () => (/* binding */ isElectron)
/* harmony export */ });
// based on https://github.com/cheton/is-electron
// https://github.com/electron/electron/issues/2288
/* eslint-disable complexity */
function isElectron(mockUserAgent) {
    // Renderer process
    // @ts-expect-error
    if (typeof window !== 'undefined' && window.process?.type === 'renderer') {
        return true;
    }
    // Main process
    // eslint-disable-next-line
    if (typeof process !== 'undefined' && Boolean(process.versions?.['electron'])) {
        return true;
    }
    // Detect the user agent when the `nodeIntegration` option is set to true
    const realUserAgent = typeof navigator !== 'undefined' && navigator.userAgent;
    const userAgent = mockUserAgent || realUserAgent;
    return Boolean(userAgent && userAgent.indexOf('Electron') >= 0);
}


/***/ }),

/***/ "./node_modules/@probe.gl/env/dist/utils/assert.js":
/*!*********************************************************!*\
  !*** ./node_modules/@probe.gl/env/dist/utils/assert.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   assert: () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}


/***/ }),

/***/ "./node_modules/@probe.gl/log/dist/log.js":
/*!************************************************!*\
  !*** ./node_modules/@probe.gl/log/dist/log.js ***!
  \************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Log: () => (/* binding */ Log),
/* harmony export */   normalizeArguments: () => (/* binding */ normalizeArguments)
/* harmony export */ });
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/env */ "./node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @probe.gl/env */ "./node_modules/@probe.gl/env/dist/index.js");
/* harmony import */ var _utils_local_storage_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils/local-storage.js */ "./node_modules/@probe.gl/log/dist/utils/local-storage.js");
/* harmony import */ var _utils_formatters_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils/formatters.js */ "./node_modules/@probe.gl/log/dist/utils/formatters.js");
/* harmony import */ var _utils_color_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./utils/color.js */ "./node_modules/@probe.gl/log/dist/utils/color.js");
/* harmony import */ var _utils_autobind_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./utils/autobind.js */ "./node_modules/@probe.gl/log/dist/utils/autobind.js");
/* harmony import */ var _utils_assert_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils/assert.js */ "./node_modules/@probe.gl/log/dist/utils/assert.js");
/* harmony import */ var _utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/hi-res-timestamp.js */ "./node_modules/@probe.gl/log/dist/utils/hi-res-timestamp.js");
// probe.gl, MIT license
/* eslint-disable no-console */







// Instrumentation in other packages may override console methods, so preserve them here
const originalConsole = {
    debug: (0,_probe_gl_env__WEBPACK_IMPORTED_MODULE_0__.isBrowser)() ? console.debug || console.log : console.log,
    log: console.log,
    info: console.info,
    warn: console.warn,
    error: console.error
};
const DEFAULT_LOG_CONFIGURATION = {
    enabled: true,
    level: 0
};
function noop() { } // eslint-disable-line @typescript-eslint/no-empty-function
const cache = {};
const ONCE = { once: true };
/** A console wrapper */
class Log {
    constructor({ id } = { id: '' }) {
        this.VERSION = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.VERSION;
        this._startTs = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
        this._deltaTs = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
        this.userData = {};
        // TODO - fix support from throttling groups
        this.LOG_THROTTLE_TIMEOUT = 0; // Time before throttled messages are logged again
        this.id = id;
        this.userData = {};
        this._storage = new _utils_local_storage_js__WEBPACK_IMPORTED_MODULE_3__.LocalStorage(`__probe-${this.id}__`, DEFAULT_LOG_CONFIGURATION);
        this.timeStamp(`${this.id} started`);
        (0,_utils_autobind_js__WEBPACK_IMPORTED_MODULE_4__.autobind)(this);
        Object.seal(this);
    }
    set level(newLevel) {
        this.setLevel(newLevel);
    }
    get level() {
        return this.getLevel();
    }
    isEnabled() {
        return this._storage.config.enabled;
    }
    getLevel() {
        return this._storage.config.level;
    }
    /** @return milliseconds, with fractions */
    getTotal() {
        return Number(((0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)() - this._startTs).toPrecision(10));
    }
    /** @return milliseconds, with fractions */
    getDelta() {
        return Number(((0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)() - this._deltaTs).toPrecision(10));
    }
    /** @deprecated use logLevel */
    set priority(newPriority) {
        this.level = newPriority;
    }
    /** @deprecated use logLevel */
    get priority() {
        return this.level;
    }
    /** @deprecated use logLevel */
    getPriority() {
        return this.level;
    }
    // Configure
    enable(enabled = true) {
        this._storage.setConfiguration({ enabled });
        return this;
    }
    setLevel(level) {
        this._storage.setConfiguration({ level });
        return this;
    }
    /** return the current status of the setting */
    get(setting) {
        return this._storage.config[setting];
    }
    // update the status of the setting
    set(setting, value) {
        this._storage.setConfiguration({ [setting]: value });
    }
    /** Logs the current settings as a table */
    settings() {
        if (console.table) {
            console.table(this._storage.config);
        }
        else {
            console.log(this._storage.config);
        }
    }
    // Unconditional logging
    assert(condition, message) {
        if (!condition) {
            throw new Error(message || 'Assertion failed');
        }
    }
    warn(message) {
        return this._getLogFunction(0, message, originalConsole.warn, arguments, ONCE);
    }
    error(message) {
        return this._getLogFunction(0, message, originalConsole.error, arguments);
    }
    /** Print a deprecation warning */
    deprecated(oldUsage, newUsage) {
        return this.warn(`\`${oldUsage}\` is deprecated and will be removed \
in a later version. Use \`${newUsage}\` instead`);
    }
    /** Print a removal warning */
    removed(oldUsage, newUsage) {
        return this.error(`\`${oldUsage}\` has been removed. Use \`${newUsage}\` instead`);
    }
    probe(logLevel, message) {
        return this._getLogFunction(logLevel, message, originalConsole.log, arguments, {
            time: true,
            once: true
        });
    }
    log(logLevel, message) {
        return this._getLogFunction(logLevel, message, originalConsole.debug, arguments);
    }
    info(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.info, arguments);
    }
    once(logLevel, message) {
        return this._getLogFunction(logLevel, message, originalConsole.debug || originalConsole.info, arguments, ONCE);
    }
    /** Logs an object as a table */
    table(logLevel, table, columns) {
        if (table) {
            return this._getLogFunction(logLevel, table, console.table || noop, (columns && [columns]), {
                tag: getTableHeader(table)
            });
        }
        return noop;
    }
    time(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.time ? console.time : console.info);
    }
    timeEnd(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.timeEnd ? console.timeEnd : console.info);
    }
    timeStamp(logLevel, message) {
        return this._getLogFunction(logLevel, message, console.timeStamp || noop);
    }
    group(logLevel, message, opts = { collapsed: false }) {
        const options = normalizeArguments({ logLevel, message, opts });
        const { collapsed } = opts;
        // @ts-expect-error
        options.method = (collapsed ? console.groupCollapsed : console.group) || console.info;
        return this._getLogFunction(options);
    }
    groupCollapsed(logLevel, message, opts = {}) {
        return this.group(logLevel, message, Object.assign({}, opts, { collapsed: true }));
    }
    groupEnd(logLevel) {
        return this._getLogFunction(logLevel, '', console.groupEnd || noop);
    }
    // EXPERIMENTAL
    withGroup(logLevel, message, func) {
        this.group(logLevel, message)();
        try {
            func();
        }
        finally {
            this.groupEnd(logLevel)();
        }
    }
    trace() {
        if (console.trace) {
            console.trace();
        }
    }
    // PRIVATE METHODS
    /** Deduces log level from a variety of arguments */
    _shouldLog(logLevel) {
        return this.isEnabled() && this.getLevel() >= normalizeLogLevel(logLevel);
    }
    _getLogFunction(logLevel, message, method, args, opts) {
        if (this._shouldLog(logLevel)) {
            // normalized opts + timings
            opts = normalizeArguments({ logLevel, message, args, opts });
            method = method || opts.method;
            (0,_utils_assert_js__WEBPACK_IMPORTED_MODULE_5__["default"])(method);
            opts.total = this.getTotal();
            opts.delta = this.getDelta();
            // reset delta timer
            this._deltaTs = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
            const tag = opts.tag || opts.message;
            if (opts.once && tag) {
                if (!cache[tag]) {
                    cache[tag] = (0,_utils_hi_res_timestamp_js__WEBPACK_IMPORTED_MODULE_2__.getHiResTimestamp)();
                }
                else {
                    return noop;
                }
            }
            // TODO - Make throttling work with groups
            // if (opts.nothrottle || !throttle(tag, this.LOG_THROTTLE_TIMEOUT)) {
            //   return noop;
            // }
            message = decorateMessage(this.id, opts.message, opts);
            // Bind console function so that it can be called after being returned
            return method.bind(console, message, ...opts.args);
        }
        return noop;
    }
}
Log.VERSION = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.VERSION;
/**
 * Get logLevel from first argument:
 * - log(logLevel, message, args) => logLevel
 * - log(message, args) => 0
 * - log({logLevel, ...}, message, args) => logLevel
 * - log({logLevel, message, args}) => logLevel
 */
function normalizeLogLevel(logLevel) {
    if (!logLevel) {
        return 0;
    }
    let resolvedLevel;
    switch (typeof logLevel) {
        case 'number':
            resolvedLevel = logLevel;
            break;
        case 'object':
            // Backward compatibility
            // TODO - deprecate `priority`
            // @ts-expect-error
            resolvedLevel = logLevel.logLevel || logLevel.priority || 0;
            break;
        default:
            return 0;
    }
    // 'log level must be a number'
    (0,_utils_assert_js__WEBPACK_IMPORTED_MODULE_5__["default"])(Number.isFinite(resolvedLevel) && resolvedLevel >= 0);
    return resolvedLevel;
}
/**
 * "Normalizes" the various argument patterns into an object with known types
 * - log(logLevel, message, args) => {logLevel, message, args}
 * - log(message, args) => {logLevel: 0, message, args}
 * - log({logLevel, ...}, message, args) => {logLevel, message, args}
 * - log({logLevel, message, args}) => {logLevel, message, args}
 */
function normalizeArguments(opts) {
    const { logLevel, message } = opts;
    opts.logLevel = normalizeLogLevel(logLevel);
    // We use `arguments` instead of rest parameters (...args) because IE
    // does not support the syntax. Rest parameters is transpiled to code with
    // perf impact. Doing it here instead avoids constructing args when logging is
    // disabled.
    // TODO - remove when/if IE support is dropped
    const args = opts.args ? Array.from(opts.args) : [];
    // args should only contain arguments that appear after `message`
    // eslint-disable-next-line no-empty
    while (args.length && args.shift() !== message) { }
    switch (typeof logLevel) {
        case 'string':
        case 'function':
            if (message !== undefined) {
                args.unshift(message);
            }
            opts.message = logLevel;
            break;
        case 'object':
            Object.assign(opts, logLevel);
            break;
        default:
    }
    // Resolve functions into strings by calling them
    if (typeof opts.message === 'function') {
        opts.message = opts.message();
    }
    const messageType = typeof opts.message;
    // 'log message must be a string' or object
    (0,_utils_assert_js__WEBPACK_IMPORTED_MODULE_5__["default"])(messageType === 'string' || messageType === 'object');
    // original opts + normalized opts + opts arg + fixed up message
    return Object.assign(opts, { args }, opts.opts);
}
function decorateMessage(id, message, opts) {
    if (typeof message === 'string') {
        const time = opts.time ? (0,_utils_formatters_js__WEBPACK_IMPORTED_MODULE_6__.leftPad)((0,_utils_formatters_js__WEBPACK_IMPORTED_MODULE_6__.formatTime)(opts.total)) : '';
        message = opts.time ? `${id}: ${time}  ${message}` : `${id}: ${message}`;
        message = (0,_utils_color_js__WEBPACK_IMPORTED_MODULE_7__.addColor)(message, opts.color, opts.background);
    }
    return message;
}
function getTableHeader(table) {
    for (const key in table) {
        for (const title in table[key]) {
            return title || 'untitled';
        }
    }
    return 'empty';
}


/***/ }),

/***/ "./node_modules/@probe.gl/log/dist/utils/assert.js":
/*!*********************************************************!*\
  !*** ./node_modules/@probe.gl/log/dist/utils/assert.js ***!
  \*********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ assert)
/* harmony export */ });
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}


/***/ }),

/***/ "./node_modules/@probe.gl/log/dist/utils/autobind.js":
/*!***********************************************************!*\
  !*** ./node_modules/@probe.gl/log/dist/utils/autobind.js ***!
  \***********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   autobind: () => (/* binding */ autobind)
/* harmony export */ });
// Copyright (c) 2015 - 2017 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.
/**
 * Binds the "this" argument of all functions on a class instance to the instance
 * @param obj - class instance (typically a react component)
 */
function autobind(obj, predefined = ['constructor']) {
    const proto = Object.getPrototypeOf(obj);
    const propNames = Object.getOwnPropertyNames(proto);
    const object = obj;
    for (const key of propNames) {
        const value = object[key];
        if (typeof value === 'function') {
            if (!predefined.find(name => key === name)) {
                object[key] = value.bind(obj);
            }
        }
    }
}


/***/ }),

/***/ "./node_modules/@probe.gl/log/dist/utils/color.js":
/*!********************************************************!*\
  !*** ./node_modules/@probe.gl/log/dist/utils/color.js ***!
  \********************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COLOR: () => (/* binding */ COLOR),
/* harmony export */   addColor: () => (/* binding */ addColor)
/* harmony export */ });
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/env */ "./node_modules/@probe.gl/env/dist/lib/is-browser.js");

var COLOR;
(function (COLOR) {
    COLOR[COLOR["BLACK"] = 30] = "BLACK";
    COLOR[COLOR["RED"] = 31] = "RED";
    COLOR[COLOR["GREEN"] = 32] = "GREEN";
    COLOR[COLOR["YELLOW"] = 33] = "YELLOW";
    COLOR[COLOR["BLUE"] = 34] = "BLUE";
    COLOR[COLOR["MAGENTA"] = 35] = "MAGENTA";
    COLOR[COLOR["CYAN"] = 36] = "CYAN";
    COLOR[COLOR["WHITE"] = 37] = "WHITE";
    COLOR[COLOR["BRIGHT_BLACK"] = 90] = "BRIGHT_BLACK";
    COLOR[COLOR["BRIGHT_RED"] = 91] = "BRIGHT_RED";
    COLOR[COLOR["BRIGHT_GREEN"] = 92] = "BRIGHT_GREEN";
    COLOR[COLOR["BRIGHT_YELLOW"] = 93] = "BRIGHT_YELLOW";
    COLOR[COLOR["BRIGHT_BLUE"] = 94] = "BRIGHT_BLUE";
    COLOR[COLOR["BRIGHT_MAGENTA"] = 95] = "BRIGHT_MAGENTA";
    COLOR[COLOR["BRIGHT_CYAN"] = 96] = "BRIGHT_CYAN";
    COLOR[COLOR["BRIGHT_WHITE"] = 97] = "BRIGHT_WHITE";
})(COLOR || (COLOR = {}));
const BACKGROUND_INCREMENT = 10;
function getColor(color) {
    if (typeof color !== 'string') {
        return color;
    }
    color = color.toUpperCase();
    return COLOR[color] || COLOR.WHITE;
}
function addColor(string, color, background) {
    if (!_probe_gl_env__WEBPACK_IMPORTED_MODULE_0__.isBrowser && typeof string === 'string') {
        if (color) {
            const colorCode = getColor(color);
            string = `\u001b[${colorCode}m${string}\u001b[39m`;
        }
        if (background) {
            // background colors values are +10
            const colorCode = getColor(background);
            string = `\u001b[${colorCode + BACKGROUND_INCREMENT}m${string}\u001b[49m`;
        }
    }
    return string;
}


/***/ }),

/***/ "./node_modules/@probe.gl/log/dist/utils/formatters.js":
/*!*************************************************************!*\
  !*** ./node_modules/@probe.gl/log/dist/utils/formatters.js ***!
  \*************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   formatTime: () => (/* binding */ formatTime),
/* harmony export */   formatValue: () => (/* binding */ formatValue),
/* harmony export */   leftPad: () => (/* binding */ leftPad),
/* harmony export */   rightPad: () => (/* binding */ rightPad)
/* harmony export */ });
// probe.gl, MIT license
/**
 * Format time
 */
function formatTime(ms) {
    let formatted;
    if (ms < 10) {
        formatted = `${ms.toFixed(2)}ms`;
    }
    else if (ms < 100) {
        formatted = `${ms.toFixed(1)}ms`;
    }
    else if (ms < 1000) {
        formatted = `${ms.toFixed(0)}ms`;
    }
    else {
        formatted = `${(ms / 1000).toFixed(2)}s`;
    }
    return formatted;
}
function leftPad(string, length = 8) {
    const padLength = Math.max(length - string.length, 0);
    return `${' '.repeat(padLength)}${string}`;
}
function rightPad(string, length = 8) {
    const padLength = Math.max(length - string.length, 0);
    return `${string}${' '.repeat(padLength)}`;
}
function formatValue(v, options = {}) {
    const EPSILON = 1e-16;
    const { isInteger = false } = options;
    if (Array.isArray(v) || ArrayBuffer.isView(v)) {
        return formatArrayValue(v, options);
    }
    if (!Number.isFinite(v)) {
        return String(v);
    }
    // @ts-expect-error
    if (Math.abs(v) < EPSILON) {
        return isInteger ? '0' : '0.';
    }
    if (isInteger) {
        // @ts-expect-error
        return v.toFixed(0);
    }
    // @ts-expect-error
    if (Math.abs(v) > 100 && Math.abs(v) < 10000) {
        // @ts-expect-error
        return v.toFixed(0);
    }
    // @ts-expect-error
    const string = v.toPrecision(2);
    const decimal = string.indexOf('.0');
    return decimal === string.length - 2 ? string.slice(0, -1) : string;
}
/** Helper to formatValue */
function formatArrayValue(v, options) {
    const { maxElts = 16, size = 1 } = options;
    let string = '[';
    for (let i = 0; i < v.length && i < maxElts; ++i) {
        if (i > 0) {
            string += `,${i % size === 0 ? ' ' : ''}`;
        }
        string += formatValue(v[i], options);
    }
    const terminator = v.length > maxElts ? '...' : ']';
    return `${string}${terminator}`;
}


/***/ }),

/***/ "./node_modules/@probe.gl/log/dist/utils/hi-res-timestamp.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@probe.gl/log/dist/utils/hi-res-timestamp.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getHiResTimestamp: () => (/* binding */ getHiResTimestamp)
/* harmony export */ });
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @probe.gl/env */ "./node_modules/@probe.gl/env/dist/lib/is-browser.js");
/* harmony import */ var _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @probe.gl/env */ "./node_modules/@probe.gl/env/dist/lib/globals.js");
// probe.gl, MIT license

/** Get best timer available. */
function getHiResTimestamp() {
    let timestamp;
    if ((0,_probe_gl_env__WEBPACK_IMPORTED_MODULE_0__.isBrowser)() && _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.window.performance) {
        timestamp = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.window?.performance?.now?.();
    }
    else if ("hrtime" in _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.process) {
        // @ts-ignore
        const timeParts = _probe_gl_env__WEBPACK_IMPORTED_MODULE_1__.process?.hrtime?.();
        timestamp = timeParts[0] * 1000 + timeParts[1] / 1e6;
    }
    else {
        timestamp = Date.now();
    }
    return timestamp;
}


/***/ }),

/***/ "./node_modules/@probe.gl/log/dist/utils/local-storage.js":
/*!****************************************************************!*\
  !*** ./node_modules/@probe.gl/log/dist/utils/local-storage.js ***!
  \****************************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LocalStorage: () => (/* binding */ LocalStorage)
/* harmony export */ });
// probe.gl, MIT license
function getStorage(type) {
    try {
        const storage = window[type];
        const x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return storage;
    }
    catch (e) {
        return null;
    }
}
// Store keys in local storage via simple interface
class LocalStorage {
    constructor(id, defaultConfig, type = 'sessionStorage') {
        this.storage = getStorage(type);
        this.id = id;
        this.config = defaultConfig;
        this._loadConfiguration();
    }
    getConfiguration() {
        return this.config;
    }
    setConfiguration(configuration) {
        Object.assign(this.config, configuration);
        if (this.storage) {
            const serialized = JSON.stringify(this.config);
            this.storage.setItem(this.id, serialized);
        }
    }
    // Get config from persistent store, if available
    _loadConfiguration() {
        let configuration = {};
        if (this.storage) {
            const serializedConfiguration = this.storage.getItem(this.id);
            configuration = serializedConfiguration ? JSON.parse(serializedConfiguration) : {};
        }
        Object.assign(this.config, configuration);
        return this;
    }
}


/***/ })

},
/******/ __webpack_require__ => { // webpackRuntimeModules
/******/ var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
/******/ var __webpack_exports__ = (__webpack_exec__("./node_modules/webpack-dev-server/client/index.js?protocol=ws%3A&hostname=0.0.0.0&port=3000&pathname=%2Fws&logging=info&overlay=true&reconnect=10&hot=true&live-reload=true"), __webpack_exec__("./node_modules/webpack/hot/dev-server.js"), __webpack_exec__("./src/index.ts"));
/******/ }
]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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SjtBQUNBO0FBQ0Esb0JBQW9CLFNBQVM7QUFDN0I7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQSxNQUFNO0FBQ047QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGdCQUFnQjtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFFBQVE7QUFDUjs7QUFFQSxrQ0FBa0MsUUFBUTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFD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eUIsNkJBQTZCLDJCQUEyQix5QkFBeUIseUJBQXlCLHVCQUF1QixxQkFBcUIscUJBQXFCLGNBQWMsY0FBYyxlQUFlLGVBQWUsYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGVBQWUsYUFBYSxZQUFZLFlBQVksWUFBWSxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsZUFBZSxlQUFlLGVBQWUsZUFBZSxlQUFlLGFBQWEsYUFBYSxjQUFjLGFBQWEsY0FBYyxjQUFjLGdCQUFnQixhQUFhLFlBQVksY0FBYyxhQUFhLGNBQWMsZUFBZSxXQUFXLFdBQVcsV0FBVyxnQkFBZ0IsV0FBVyxZQUFZLGNBQWMsWUFBWSxnQkFBZ0IsWUFBWSxZQUFZLFlBQVksY0FBYyxjQUFjLGFBQWEsY0FBYyxjQUFjLGdCQUFnQixhQUFhLFlBQVksY0FBYyxhQUFhLGNBQWMsZUFBZSxXQUFXLFdBQVcsV0FBVyxnQkFBZ0IsV0FBVyxZQUFZLGVBQWUsY0FBYyxZQUFZLGdCQUFnQixZQUFZLFlBQVksWUFBWSxjQUFjLGlCQUFpQixjQUFjLFlBQVksYUFBYSxlQUFlLGNBQWMsY0FBYyxjQUFjLGNBQWMsZUFBZSxjQUFjLGFBQWEsY0FBYyxnQkFBZ0IsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGNBQWMsYUFBYSxhQUFhLGFBQWEsYUFBYSxhQUFhLGVBQWUsYUFBYSxjQUFjLGNBQWMsY0FBYyxhQUFhLGNBQWMsV0FBVyxhQUFhLFlBQVksY0FBYyxlQUFlLGNBQWMsYUFBYSxjQUFjLFlBQVksWUFBWSxXQUFXLFlBQVksWUFBWSxZQUFZLGVBQWUsWUFBWSxhQUFhLGNBQWMsV0FBVyxjQUFjLFdBQVcsV0FBVyxZQUFZLFlBQVksYUFBYSxhQUFhLGFBQWEsY0FBYyxlQUFlLGFBQWEsYUFBYSxjQUFjLGNBQWMsZUFBZSxlQUFlLGFBQWEsYUFBYSxZQUFZLGVBQWUsY0FBYyxlQUFlLGNBQWMsTUFBTSxhQUFhLFdBQVcsYUFBYSxjQUFjLGFBQWEsY0FBYyxlQUFlLFlBQVksZUFBZSxhQUFhLFlBQVksYUFBYSxhQUFhLGNBQWMsWUFBWSxZQUFZLFlBQVksYUFBYSxZQUFZLGVBQWUsYUFBYSxhQUFhLGNBQWMsY0FBYyxhQUFhLGVBQWUsY0FBYyxhQUFhLGFBQWEsY0FBYyxlQUFlLGVBQWUsZUFBZSxlQUFlLGVBQWUsZUFBZSxjQUFjLGVBQWUsYUFBYSxjQUFjLGNBQWMsZUFBZSxlQUFlLGVBQWUsY0FBYyxhQUFhLGVBQWUsZUFBZSxjQUFjLGFBQWEsWUFBWSxlQUFlLGVBQWUsZUFBZSxjQUFjLGVBQWUsYUFBYSxjQUFjLGVBQWUsZUFBZSxlQUFlLGNBQWMsYUFBYSxlQUFlLGNBQWMsY0FBYyxlQUFlLGVBQWUsY0FBYyxlQUFlLGFBQWEsY0FBYyxjQUFjLGVBQWUsZUFBZSxlQUFlLGNBQWMsYUFBYSxlQUFlLGVBQWUsY0FBYyxhQUFhLFlBQVksZUFBZSxlQUFlLGVBQWUsY0FBYyxlQUFlLGFBQWEsZUFBZSxlQUFlLGVBQWUsZUFBZSxjQUFjLGFBQWEsZUFBZSxjQUFjLGFBQWEsYUFBYSxZQUFZLFdBQVcsV0FBVyxjQUFjLGNBQWMsZUFBZSxlQUFlLGFBQWEsYUFBYSxjQUFjLGFBQWEsYUFBYSxlQUFlLGFBQWEsWUFBWSxZQUFZLFlBQVksY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGVBQWUsZUFBZSxlQUFlLGVBQWUsZUFBZSxhQUFhLGFBQWEsY0FBYyxhQUFhLGNBQWMsY0FBYyxnQkFBZ0IsYUFBYSxZQUFZLGNBQWMsYUFBYSxjQUFjLGVBQWUsV0FBVyxXQUFXLFdBQVcsZ0JBQWdCLFdBQVcsWUFBWSxjQUFjLFlBQVksZ0JBQWdCLFlBQVksWUFBWSxZQUFZLGNBQWMsY0FBYyxhQUFhLGNBQWMsY0FBYyxnQkFBZ0IsYUFBYSxZQUFZLGNBQWMsYUFBYSxjQUFjLGVBQWUsV0FBVyxXQUFXLFdBQVcsZ0JBQWdCLFdBQVcsWUFBWSxlQUFlLGNBQWMsWUFBWSxnQkFBZ0IsWUFBWSxZQUFZLFlBQVksY0FBYyxpQkFBaUIsY0FBYyxZQUFZLGFBQWEsZUFBZSxjQUFjLGNBQWMsY0FBYyxjQUFjLGVBQWUsY0FB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QUFhLGNBQWMsY0FBYyxjQUFjLG1CQUFtQixjQUFjLGFBQWEsY0FBYyxhQUFhLGlCQUFpQixnQkFBZ0IsZ0JBQWdCLGNBQWMsZ0JBQWdCLGNBQWMsY0FBYyxlQUFlLGFBQWEsY0FBYyxhQUFhLFlBQVksY0FBYyxlQUFlLGFBQWEsYUFBYSxhQUFhLGFBQWEsMEJBQTBCLGVBQWUsZUFBZSxhQUFhLGNBQWMsY0FBYyxlQUFlLGNBQWMsZUFBZSxhQUFhLGNBQWMsY0FBYyxhQUFhLFdBQVcsY0FBYyxjQUFjLGFBQWEsYUFBYSxhQUFhLGVBQWUsY0FBYyxZQUFZLGFBQWEsY0FBYyxjQUFjLGFBQWEsYUFBYSxlQUFlLGVBQWUsWUFBWSxhQUFhLGFBQWEsZUFBZSxpQkFBaUIsY0FBYyxlQUFlLGVBQWUsZUFBZSxhQUFhLFlBQVksY0FBYyxZQUFZLGNBQWMsYUFBYSxlQUFlLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxlQUFlLGFBQWEsaUJBQWlCLGFBQWEsY0FBYyxhQUFhLHNCQUFzQixpQkFBaUIsaUJBQWlCLGlCQUFpQixpQkFBaUIsaUJBQWlCLGlCQUFpQixpQkFBaUIsaUJBQWlCLGNBQWMsZ0JBQWdCLGlCQUFpQixlQUFlLGdCQUFnQixjQUFjLGNBQWMsWUFBWSxlQUFlLGlCQUFpQixhQUFhLGFBQWEsY0FBYyxjQUFjLGVBQWUsZUFBZSxhQUFhLGNBQWMsYUFBYSxjQUFjLGNBQWMsZUFBZSxhQUFhLGNBQWMsZUFBZSxpQkFBaUIsaUJBQWlCLFlBQVksZUFBZSxnQkFBZ0IsYUFBYSxhQUFhLGNBQWMsYUFBYSxjQUFjLGNBQWMsZUFBZSxlQUFlLGVBQWUsY0FBYyxjQUFjLGNBQWMsZUFBZSxjQUFjLGFBQWEsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsYUFBYSxpQkFBaUIsYUFBYSxjQUFjLGVBQWUsY0FBYyxjQUFjLGNBQWMsY0FBYyxhQUFhLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxhQUFhLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGVBQWUsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGVBQWUsY0FBYyxlQUFlLGNBQWMsY0FBYyxjQUFjLGNBQWMsYUFBYSxjQUFjLGNBQWMsY0FBYyxjQUFjLGNBQWMsY0FBYyxlQUFlLGNBQWMsY0FBYyxjQUFjLGNBQWMsaUJBQWlCLGVBQWUsY0FBYyxlQUFlLFlBQVksZUFBZSxpQkFBaUIsZUFBZSxlQUFlLGVBQWUsY0FBYyxjQUFjLGNBQWMsZUFBZSxlQUFlLGNBQWMsY0FBYyxnQkFBZ0IsYUFBYSxnQkFBZ0IsYUFBYSxhQUFhLGFBQWEsa0JBQWtCLFlBQVksWUFBWSxhQUFhLGFBQWEsYUFBYSxjQUFjLGNBQWMsV0FBVyxhQUFhLGFBQWEsY0FBYyxpQkFBaUIsZUFBZSxnQkFBZ0IsaUJBQWlCLGNBQWMsY0FBYyxlQUFlLG1CQUFtQixnQkFBZ0IsY0FBYyxlQUFlLGNBQWMsY0FBYyxjQUFjLGFBQWEsY0FBYyxhQUFhLGNBQWMsY0FBYyxnQkFBZ0IsZ0JBQWdCLG9CQUFvQixvQkFBb0IsdUJBQXVCLGdCQUFnQixZQUFZLGlCQUFpQixlQUFlLGVBQWUsZUFBZSxjQUFjLGNBQWMsd0JBQXdCLGdCQUFnQixjQUFjLGNBQWMsZUFBZSxjQUFjLGVBQWUsYUFBYSxlQUFlLGVBQWUsZUFBZSxjQUFjLGVBQWUsWUFBWSx1QkFBdUIsY0FBYyxZQUFZLGNBQWMsZ0JBQWdCLGVBQWUsYUFBYSxjQUFjLGVBQWUsY0FBYyxlQUFlLGVBQWUsYUFBYSxpQkFBaUIsZUFBZSxhQUFhLGNBQWMsYUFBYSxlQUFlLGVBQWUsY0FBYyxpQkFBaUIsZUFBZSxjQUFjLGFBQWEsYUFBYSxlQUFlLGNBQWMscUJBQXFCLGdCQUFnQixhQUFhLGlCQUFpQixlQUFlLGVBQWUsZUFBZSxlQUFlLGNBQWMsZ0JBQWdCLFlBQVksYUFBYSxzQkFBc0IsYUFBYSxXQUFXLGVBQWUsbUJBQW1CLGVBQWUsV0FBVyxpQkFBaUIsWUFBWSxvQkFBb0IsZUFBZSxjQUFjLG1CQUFtQixlQUFlLGVBQWUsYUFBYSxZQUFZLGFBQWEsY0FBYyxjQUFjLGFBQWEsZUFBZSxjQUFjLGdCQUFnQixtQkFBbUIsZUFBZSxnQkFBZ0IsZ0JBQWdCLGlCQUFpQixxQkFBcUIsY0FBYyxhQUFhLFlBQVksWUFBWSxhQUFhLGFBQWEsYUFBYSxZQUFZLGVBQWUsZUFBZSxjQUFjLGVBQWUsYUFBYSxjQUFjLGFBQWEsYUFBYSxjQUFjLGNBQWMsYUFBYSxjQUFjLGtCQUFrQixjQUFjLGlCQUFpQixhQUFhLGVBQWUsZUFBZSxlQUFlLGVBQWUsZUFBZSxlQUFlLGVBQWUsZUFBZSxlQUFlLGVBQWUsZUFBZSxlQUFlLGVBQWUsZUFBZSxjQUFjLGVBQWUsY0FBYyxtQkFBbUIsZUFBZSxjQUFjLGtCQUFrQixlQUFlLGNBQWMsWUFBWSxhQUFhLGNBQWMsZUFBZSxnQkFBZ0IsaUJBQWlCLGNBQWMsZUFBZSxhQUFhLGNBQWMsYUFBYSxZQUFZLFlBQVksWUFBWSxjQUFjLGlCQUFpQixhQUFhLGNBQWMsY0FBYyxhQUFhLGNBQWMsY0FBYyxhQUFhLGNBQWMsZUFBZSxlQUFlLGdCQUFnQixlQUFlLGNBQWMsZUFBZSxnQkFBZ0IsNEJBQTRCLGVBQWUsY0FBYyxrQkFBa0IsYUFBYSxlQUFlLGFBQWEsZUFBZSxlQUFlLGNBQWMsZUFBZSxlQUFlLGVBQWUsY0FBYyxlQUFlLGNBQWMsZUFBZSxlQUFlLGVBQWUsY0FBYyxZQUFZLGFBQWEsY0FBYyxhQUFhLGVBQWUsYUFBYSxhQUFhLGVBQWUsY0FBYyxjQUFjLGNBQWMsZUFBZSxhQUFhLGNBQWMsZUFBZSxjQUFjLGlCQUFpQixpQkFBaUIsaUJBQWlCLGNBQWMsYUFBYSxjQUFjLGNBQWMsYUFBYSxlQUFlLGNBQWMsY0FBYyxnQkFBZ0IsY0FBYyxlQUFlLGVBQWUsY0FBYyxhQUFhLGNBQWMsWUFBWSxhQUFhLGNBQWMsY0FBYyxjQUFjLGVBQWUsY0FBYyxjQUFjLGlCQUFpQixlQUFlLFlBQVksYUFBYSxlQUFlLGFBQWEsYUFBYSxjQUFjLGNBQWMsZUFBZSxjQUFjLG1CQUFtQixhQUFhLGVBQWUsaUJBQWlCLGVBQWUsY0FBYyxtQkFBbUIsY0FBYyxnQkFBZ0IsZUFBZSxzQkFBc0IsZUFBZSxnQkFBZ0Isc0JBQXNCLFlBQVksZUFBZSxhQUFhLGVBQWUsY0FBYyxjQUFjLElBQUksU0FBUyxhQUFhLGNBQWMsZ0JBQWdCLGdCQUFnQixlQUFlLGVBQWUsWUFBWSxhQUFhLGdCQUFnQixpQkFBaUIsYUFBYSxZQUFZLGNBQWMsZUFBZSxjQUFjLGVBQWUsZ0JBQWdCLGlCQUFpQixjQUFjLGVBQWUsY0FBYyxlQUFlLGFBQWEsWUFBWSxlQUFlLGNBQWMsYUFBYSxlQUFlLGNBQWMsZUFBZSxtQkFBbUIsY0FBYyxpQkFBaUIsYUFBYSxjQUFjLGNBQWMsY0FBYyxhQUFhLGVBQWUsY0FBYyxjQUFjLGVBQWUsZ0JBQWdCLGVBQWUsZ0JBQWdCLGFBQWEsZUFBZSxlQUFlLFlBQVksY0FBYyxlQUFlLGNBQWMsY0FBYyxjQUFjLGNBQWMsZUFBZSxhQUFhLGNBQWMsZUFBZSxlQUFlLGdCQUFnQixlQUFlLHFCQUFxQixpQkFBaUIsZ0JBQWdCLGNBQWMsY0FBYyxjQUFjLGFBQWEsZ0JBQWdCLGVBQWUsZUFBZSxZQUFZLGNBQWMsYUFBYSxZQUFZLGNBQWMsZUFBZSxjQUFjLGdCQUFnQixhQUFhLGVBQWUsY0FBYyxjQUFjLFdBQVcsY0FBYyxhQUFhLGFBQWEsY0FBYyxjQUFjLGFBQWEsYUFBYSxjQUFjLGVBQWUsZUFBZSxlQUFlLGNBQWMsY0FBYyxlQUFlLGNBQWMsZ0JBQWdCLGFBQWEsZUFBZSxlQUFlLGtCQUFrQixhQUFhLFlBQVksY0FBYyxjQUFjLGVBQWUsZUFBZSxhQUFhLGFBQWEsd0JBQXdCLGNBQWMsWUFBWSxhQUFhLGFBQWEsZUFBZSxtQkFBbUIsYUFBYSxjQUFjLFlBQVksZ0JBQWdCLGtCQUFrQixnQkFBZ0IsZ0JBQWdCLGdCQUFnQixnQkFBZ0IsZ0JBQWdCLGVBQWUsZ0JBQWdCLG9CQUFvQixnQkFBZ0IsZ0JBQWdCLGNBQWMsYUFBYSxvQkFBb0IsYUFBYSxvQkFBb0IsZUFBZSxXQUFXLFlBQVksZUFBZSxjQUFjLGVBQWUsZUFBZSxjQUFjLGVBQWUsY0FBYyxjQUFjLGdCQUFnQixlQUFlLGNBQWMsY0FBYyxpQkFBaUIsZUFBZSxpQkFBaUIsZUFBZSxjQUFjLGVBQWUsZUFBZSxlQUFlLGNBQWMsWUFBWSxlQUFlLGFBQWEsZUFBZSxjQUFjLGNBQWMsYUFBYSxhQUFhLGVBQWUsWUFBWSxjQUFjLGNBQWMsZ0JBQWdCLFlBQVksY0FBYyxjQUFjLGdCQUFnQixhQUFhLGNBQWMsYUFBYSxjQUFjLFlBQVksWUFBWSxhQUFhLGFBQWEsYUFBYSxlQUFlLGFBQWEsZ0JBQWdCLFlBQVksZUFBZSxhQUFhLGVBQWUsaUJBQWlCLGFBQWEsY0FBYyxhQUFhLGVBQWUsY0FBYyxZQUFZLGVBQWUsZUFBZSxlQUFlLGdCQUFnQixhQUFhLFlBQVksZUFBZSxjQUFjLFdBQVcsY0FBYyxnQkFBZ0IsYUFBYSxpQkFBaUIsZ0JBQWdCLGVBQWUsY0FBYyxnQkFBZ0IsZ0JBQWdCLGlCQUFpQixjQUFjLGNBQWMsWUFBWSxtQkFBbUIsY0FBYyxhQUFhLGVBQWUsY0FBYyxpQkFBaUIsaUJBQWlCLGlCQUFpQixlQUFlLGNBQWMsWUFBWSxlQUFlLGFBQWEsY0FBYyxlQUFlLGNBQWMsZ0JBQWdCLGNBQWMsZUFBZSxhQUFhLGNBQWMsZUFBZSxpQkFBaUIsY0FBYyxjQUFjLGNBQWMsZUFBZSxnQkFBZ0IsY0FBYyxlQUFlLGVBQWUsZ0JBQWdCLHVCQUF1Qix3QkFBd0IsZUFBZSxjQUFjLGNBQWMsSUFBSSxTQUFTLGFBQWEsY0FBYyxnQkFBZ0IsZ0JBQWdCLGVBQWUsZUFBZSxZQUFZLGFBQWEsZ0JBQWdCLGFBQWEsYUFBYSxlQUFlLGFBQWEsZUFBZSxZQUFZLGVBQWUsY0FBYyxlQUFlLGFBQWEsWUFBWSxtQkFBbUIsY0FBYyxjQUFjLGNBQWMsY0FBYyxjQUFjLGVBQWUsZ0JBQWdCLGFBQWEsZUFBZSxpQkFBaUIsZUFBZSxjQUFjLGVBQWUsc0JBQXNCLGlCQUFpQixnQkFBZ0IsV0FBVyxlQUFlLFlBQVksbUJBQW1CLGVBQWUsZUFBZSxjQUFjLGlCQUFpQixvQkFBb0IsaUJBQWlCLGlCQUFpQixZQUFZLGFBQWEsY0FBYyxjQUFjLGFBQWEsSUFBSSxTQUFTLGFBQWEsYUFBYSxhQUFhLGNBQWMsZUFBZSxhQUFhLFlBQVksY0FBYyxpQkFBaUIsZUFBZSxhQUFhLGNBQWMsYUFBYSxjQUFjLGNBQWMsZ0JBQWdCLGdCQUFnQixlQUFlLGlCQUFpQixlQUFlLFlBQVksYUFBYSxlQUFlLGVBQWUsWUFBWSxhQUFhLGVBQWUsY0FBYyxrQkFBa0IsZ0JBQWdCLGdCQUFnQixjQUFjLGFBQWEsZUFBZSxrQkFBa0IsZUFBZSxnQkFBZ0IsZ0JBQWdCLG1CQUFtQixrQkFBa0IsZ0JBQWdCLGdCQUFnQixlQUFlLGVBQWUsZUFBZSxhQUFhLGFBQWEsYUFBYSxhQUFhLGtCQUFrQixlQUFlLGdCQUFnQixnQkFBZ0IsZ0JBQWdCLGdCQUFnQixnQkFBZ0IsZ0JBQWdCLG1CQUFtQixrQkFBa0IsZ0JBQWdCLGVBQWUsZUFBZSxlQUFlLGNBQWMsZUFBZSxjQUFjLGVBQWUsWUFBWSxlQUFlLGVBQWUsWUFBWSxlQUFlLGFBQWEsY0FBYyxpQkFBaUIsY0FBYyxjQUFjLGlCQUFpQixlQUFlLGVBQWUsZUFBZSxjQUFjLGdCQUFnQixlQUFlLGFBQWEsYUFBYSxlQUFlLGlCQUFpQixnQkFBZ0IsY0FBYyxnQkFBZ0IsaUJBQWlCLGNBQWMsYUFBYSxjQUFjLGVBQWUsYUFBYSxlQUFlLGNBQWMsZUFBZSxjQUFjLFlBQVksZUFBZSxlQUFlLGFBQWEsZUFBZSxjQUFjLGlCQUFpQixlQUFlLGNBQWMsY0FBYyxjQUFjLGNBQWMsZ0JBQWdCLGNBQWMsaUJBQWlCLGVBQWUsY0FBYyxjQUFjLGNBQWMsY0FBYyxlQUFlLGFBQWEsZ0JBQWdCLGFBQWEsY0FBYyxlQUFlLGdCQUFnQixnQkFBZ0IsZ0JBQWdCLGdCQUFnQixZQUFZLGVBQWUsY0FBYyxlQUFlLGFBQWEsY0FBYyxjQUFjLGdCQUFnQixjQUFjLGVBQWUsZUFBZSxXQUFXLGFBQWEsY0FBYyxjQUFjLGFBQWEsV0FBVyxhQUFhLGNBQWMsY0FBYyxlQUFlLGFBQWEsY0FBYyxZQUFZLFlBQVksYUFBYSxhQUFhLGNB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O0FBQ0EsYUFBYSw4REFBbUI7QUFDaEM7QUFDQSwwQkFBMEIsa0RBQU87QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7QUNqQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNPO0FBQ1A7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlcyI6WyJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL2Fuc2ktaHRtbC1jb21tdW5pdHkvaW5kZXguanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL2V2ZW50cy9ldmVudHMuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL2h0bWwtZW50aXRpZXMvbGliL2luZGV4LmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9odG1sLWVudGl0aWVzL2xpYi9uYW1lZC1yZWZlcmVuY2VzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9odG1sLWVudGl0aWVzL2xpYi9udW1lcmljLXVuaWNvZGUtbWFwLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9odG1sLWVudGl0aWVzL2xpYi9zdXJyb2dhdGUtcGFpcnMuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS9jb3JlL0NvbXBvbmVudC9Db21wb25lbnQudHMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS9jb3JlL0NvbXBvbmVudC9pbmRleC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvZW5naW5lL2NvcmUvRW50aXR5L0VudGl0eS50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvZW5naW5lL2NvcmUvRW50aXR5L2luZGV4LnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvY29yZS9HYW1lT2JqZWN0L0dhbWVPYmplY3QudHMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS9jb3JlL0dhbWVPYmplY3QvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS9jb3JlL01lc2gvTWVzaC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvZW5naW5lL2NvcmUvTWVzaC9pbmRleC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvZW5naW5lL2NvcmUvT2JqZWN0TWFuYWdlci9PYmplY3RNYW5hZ2VyLnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvY29yZS9PYmplY3RNYW5hZ2VyL2luZGV4LnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvY29yZS9TY2VuZVRyZWUvU2NlbmVUcmVlLnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvY29yZS9TY2VuZVRyZWUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS9jb3JlL1RyYW5zZm9ybS9UcmFuc2Zvcm0udHMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS9jb3JlL1RyYW5zZm9ybS9pbmRleC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvZW5naW5lL2NvcmUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS90eXBlcy9jb3JlL0NvbXBvbmVudC9pbmRleC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvZW5naW5lL3R5cGVzL2NvcmUvRW50aXR5L2luZGV4LnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvdHlwZXMvY29yZS9HYW1lT2JqZWN0L2luZGV4LnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvdHlwZXMvY29yZS9NZXNoL2luZGV4LnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvdHlwZXMvY29yZS9PYmplY3RNYW5hZ2VyL2luZGV4LnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9lbmdpbmUvdHlwZXMvY29yZS9TY2VuZVRyZWUvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vc3JjL2VuZ2luZS90eXBlcy9jb3JlL1RyYW5zZm9ybS9pbmRleC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvZW5naW5lL3R5cGVzL2luZGV4LnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvdXRpbHMvV2hlZXp5R0xCTG9hZGVyLnRzIiwid2VicGFjazovL1doZWV6eS8uL3NyYy91dGlscy9pbmRleC50cyIsIndlYnBhY2s6Ly9XaGVlenkvLi9zcmMvdGVzdFNoYWRlci53Z3NsIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L2NsaWVudHMvV2ViU29ja2V0Q2xpZW50LmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L2luZGV4LmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L21vZHVsZXMvbG9nZ2VyL2luZGV4LmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L292ZXJsYXkuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2stZGV2LXNlcnZlci9jbGllbnQvb3ZlcmxheS9mc20uanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2stZGV2LXNlcnZlci9jbGllbnQvb3ZlcmxheS9ydW50aW1lLWVycm9yLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L292ZXJsYXkvc3RhdGUtbWFjaGluZS5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvd2VicGFjay1kZXYtc2VydmVyL2NsaWVudC9vdmVybGF5L3N0eWxlcy5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvd2VicGFjay1kZXYtc2VydmVyL2NsaWVudC9zb2NrZXQuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2stZGV2LXNlcnZlci9jbGllbnQvdXRpbHMvY3JlYXRlU29ja2V0VVJMLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L3V0aWxzL2dldEN1cnJlbnRTY3JpcHRTb3VyY2UuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2stZGV2LXNlcnZlci9jbGllbnQvdXRpbHMvbG9nLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L3V0aWxzL3BhcnNlVVJMLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy93ZWJwYWNrLWRldi1zZXJ2ZXIvY2xpZW50L3V0aWxzL3JlbG9hZEFwcC5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvd2VicGFjay1kZXYtc2VydmVyL2NsaWVudC91dGlscy9zZW5kTWVzc2FnZS5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvd2VicGFjay1kZXYtc2VydmVyL2NsaWVudC91dGlscy9zdHJpcEFuc2kuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2Rldi1zZXJ2ZXIuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2VtaXR0ZXIuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy1hcHBseS1yZXN1bHQuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL3dlYnBhY2svaG90L2xvZy5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvY29yZS9kaXN0L2l0ZXJhdG9ycy9tYWtlLWl0ZXJhdG9yL21ha2UtYXJyYXktYnVmZmVyLWl0ZXJhdG9yLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvaXRlcmF0b3JzL21ha2UtaXRlcmF0b3IvbWFrZS1ibG9iLWl0ZXJhdG9yLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvaXRlcmF0b3JzL21ha2UtaXRlcmF0b3IvbWFrZS1pdGVyYXRvci5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvY29yZS9kaXN0L2l0ZXJhdG9ycy9tYWtlLWl0ZXJhdG9yL21ha2Utc3RyZWFtLWl0ZXJhdG9yLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvaXRlcmF0b3JzL21ha2UtaXRlcmF0b3IvbWFrZS1zdHJpbmctaXRlcmF0b3IuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2NvcmUvZGlzdC9qYXZhc2NyaXB0LXV0aWxzL2lzLXR5cGUuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2NvcmUvZGlzdC9saWIvYXBpL2xvYWQuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2NvcmUvZGlzdC9saWIvYXBpL3BhcnNlLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL2FwaS9yZWdpc3Rlci1sb2FkZXJzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL2FwaS9zZWxlY3QtbG9hZGVyLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL2ZldGNoL2ZldGNoLWZpbGUuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2NvcmUvZGlzdC9saWIvbG9hZGVyLXV0aWxzL2dldC1kYXRhLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL2xvYWRlci11dGlscy9nZXQtZmV0Y2gtZnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2NvcmUvZGlzdC9saWIvbG9hZGVyLXV0aWxzL2xvYWRlci1jb250ZXh0LmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL2xvYWRlci11dGlscy9sb2dnZXJzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL2xvYWRlci11dGlscy9ub3JtYWxpemUtbG9hZGVyLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL2xvYWRlci11dGlscy9vcHRpb24tZGVmYXVsdHMuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2NvcmUvZGlzdC9saWIvbG9hZGVyLXV0aWxzL29wdGlvbi11dGlscy5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvY29yZS9kaXN0L2xpYi91dGlscy9sb2cuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2NvcmUvZGlzdC9saWIvdXRpbHMvbWltZS10eXBlLXV0aWxzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL3V0aWxzL3Jlc291cmNlLXV0aWxzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL3V0aWxzL3Jlc3BvbnNlLXV0aWxzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9jb3JlL2Rpc3QvbGliL3V0aWxzL3VybC11dGlscy5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvZ2x0Zi9kaXN0L2dsYi1sb2FkZXIuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2dsdGYvZGlzdC9saWIvcGFyc2Vycy9wYXJzZS1nbGIuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2dsdGYvZGlzdC9saWIvdXRpbHMvdmVyc2lvbi5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzL2Rpc3QvbGliL2JpbmFyeS11dGlscy9hcnJheS1idWZmZXItdXRpbHMuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscy9kaXN0L2xpYi9iaW5hcnktdXRpbHMvbWVtb3J5LWNvbnZlcnNpb24tdXRpbHMuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscy9kaXN0L2xpYi9iaW5hcnktdXRpbHMvbWVtb3J5LWNvcHktdXRpbHMuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscy9kaXN0L2xpYi9lbnYtdXRpbHMvYXNzZXJ0LmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9sb2FkZXItdXRpbHMvZGlzdC9saWIvZW52LXV0aWxzL2dsb2JhbHMuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscy9kaXN0L2xpYi9pdGVyYXRvcnMvYXN5bmMtaXRlcmF0aW9uLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9sb2FkZXItdXRpbHMvZGlzdC9saWIvbm9kZS9idWZmZXIuYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzL2Rpc3QvbGliL29wdGlvbi11dGlscy9tZXJnZS1sb2FkZXItb3B0aW9ucy5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzL2Rpc3QvbGliL3BhdGgtdXRpbHMvZmlsZS1hbGlhc2VzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9sb2FkZXItdXRpbHMvZGlzdC9saWIvcGF0aC11dGlscy9nZXQtY3dkLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9sb2FkZXItdXRpbHMvZGlzdC9saWIvcGF0aC11dGlscy9wYXRoLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC9sb2FkZXItdXRpbHMvZGlzdC9saWIvd29ya2VyLWxvYWRlci11dGlscy9wYXJzZS13aXRoLXdvcmtlci5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvd29ya2VyLXV0aWxzL2Rpc3QvbGliL2Vudi11dGlscy9hc3NlcnQuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL3dvcmtlci11dGlscy9kaXN0L2xpYi9lbnYtdXRpbHMvZ2xvYmFscy5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvd29ya2VyLXV0aWxzL2Rpc3QvbGliL2Vudi11dGlscy92ZXJzaW9uLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC93b3JrZXItdXRpbHMvZGlzdC9saWIvbm9kZS93b3JrZXJfdGhyZWFkcy1icm93c2VyLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AbG9hZGVycy5nbC93b3JrZXItdXRpbHMvZGlzdC9saWIvd29ya2VyLWFwaS9nZXQtd29ya2VyLXVybC5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvd29ya2VyLXV0aWxzL2Rpc3QvbGliL3dvcmtlci1hcGkvdmFsaWRhdGUtd29ya2VyLXZlcnNpb24uanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL3dvcmtlci11dGlscy9kaXN0L2xpYi93b3JrZXItZmFybS93b3JrZXItZmFybS5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvd29ya2VyLXV0aWxzL2Rpc3QvbGliL3dvcmtlci1mYXJtL3dvcmtlci1qb2IuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL3dvcmtlci11dGlscy9kaXN0L2xpYi93b3JrZXItZmFybS93b3JrZXItcG9vbC5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQGxvYWRlcnMuZ2wvd29ya2VyLXV0aWxzL2Rpc3QvbGliL3dvcmtlci1mYXJtL3dvcmtlci10aHJlYWQuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL3dvcmtlci11dGlscy9kaXN0L2xpYi93b3JrZXItdXRpbHMvZ2V0LWxvYWRhYmxlLXdvcmtlci11cmwuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bsb2FkZXJzLmdsL3dvcmtlci11dGlscy9kaXN0L2xpYi93b3JrZXItdXRpbHMvZ2V0LXRyYW5zZmVyLWxpc3QuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bwcm9iZS5nbC9lbnYvZGlzdC9pbmRleC5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQHByb2JlLmdsL2Vudi9kaXN0L2xpYi9nZXQtYnJvd3Nlci5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQHByb2JlLmdsL2Vudi9kaXN0L2xpYi9nbG9iYWxzLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AcHJvYmUuZ2wvZW52L2Rpc3QvbGliL2lzLWJyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bwcm9iZS5nbC9lbnYvZGlzdC9saWIvaXMtZWxlY3Ryb24uanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bwcm9iZS5nbC9lbnYvZGlzdC91dGlscy9hc3NlcnQuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bwcm9iZS5nbC9sb2cvZGlzdC9sb2cuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bwcm9iZS5nbC9sb2cvZGlzdC91dGlscy9hc3NlcnQuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bwcm9iZS5nbC9sb2cvZGlzdC91dGlscy9hdXRvYmluZC5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQHByb2JlLmdsL2xvZy9kaXN0L3V0aWxzL2NvbG9yLmpzIiwid2VicGFjazovL1doZWV6eS8uL25vZGVfbW9kdWxlcy9AcHJvYmUuZ2wvbG9nL2Rpc3QvdXRpbHMvZm9ybWF0dGVycy5qcyIsIndlYnBhY2s6Ly9XaGVlenkvLi9ub2RlX21vZHVsZXMvQHByb2JlLmdsL2xvZy9kaXN0L3V0aWxzL2hpLXJlcy10aW1lc3RhbXAuanMiLCJ3ZWJwYWNrOi8vV2hlZXp5Ly4vbm9kZV9tb2R1bGVzL0Bwcm9iZS5nbC9sb2cvZGlzdC91dGlscy9sb2NhbC1zdG9yYWdlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0J1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuc2lIVE1MXG5cbi8vIFJlZmVyZW5jZSB0byBodHRwczovL2dpdGh1Yi5jb20vc2luZHJlc29yaHVzL2Fuc2ktcmVnZXhcbnZhciBfcmVnQU5TSSA9IC8oPzooPzpcXHUwMDFiXFxbKXxcXHUwMDliKSg/Oig/OlswLTldezEsM30pPyg/Oig/OjtbMC05XXswLDN9KSopP1tBLU18Zi1tXSl8XFx1MDAxYltBLU1dL1xuXG52YXIgX2RlZkNvbG9ycyA9IHtcbiAgcmVzZXQ6IFsnZmZmJywgJzAwMCddLCAvLyBbRk9SRUdST1VEX0NPTE9SLCBCQUNLR1JPVU5EX0NPTE9SXVxuICBibGFjazogJzAwMCcsXG4gIHJlZDogJ2ZmMDAwMCcsXG4gIGdyZWVuOiAnMjA5ODA1JyxcbiAgeWVsbG93OiAnZThiZjAzJyxcbiAgYmx1ZTogJzAwMDBmZicsXG4gIG1hZ2VudGE6ICdmZjAwZmYnLFxuICBjeWFuOiAnMDBmZmVlJyxcbiAgbGlnaHRncmV5OiAnZjBmMGYwJyxcbiAgZGFya2dyZXk6ICc4ODgnXG59XG52YXIgX3N0eWxlcyA9IHtcbiAgMzA6ICdibGFjaycsXG4gIDMxOiAncmVkJyxcbiAgMzI6ICdncmVlbicsXG4gIDMzOiAneWVsbG93JyxcbiAgMzQ6ICdibHVlJyxcbiAgMzU6ICdtYWdlbnRhJyxcbiAgMzY6ICdjeWFuJyxcbiAgMzc6ICdsaWdodGdyZXknXG59XG52YXIgX29wZW5UYWdzID0ge1xuICAnMSc6ICdmb250LXdlaWdodDpib2xkJywgLy8gYm9sZFxuICAnMic6ICdvcGFjaXR5OjAuNScsIC8vIGRpbVxuICAnMyc6ICc8aT4nLCAvLyBpdGFsaWNcbiAgJzQnOiAnPHU+JywgLy8gdW5kZXJzY29yZVxuICAnOCc6ICdkaXNwbGF5Om5vbmUnLCAvLyBoaWRkZW5cbiAgJzknOiAnPGRlbD4nIC8vIGRlbGV0ZVxufVxudmFyIF9jbG9zZVRhZ3MgPSB7XG4gICcyMyc6ICc8L2k+JywgLy8gcmVzZXQgaXRhbGljXG4gICcyNCc6ICc8L3U+JywgLy8gcmVzZXQgdW5kZXJzY29yZVxuICAnMjknOiAnPC9kZWw+JyAvLyByZXNldCBkZWxldGVcbn1cblxuO1swLCAyMSwgMjIsIDI3LCAyOCwgMzksIDQ5XS5mb3JFYWNoKGZ1bmN0aW9uIChuKSB7XG4gIF9jbG9zZVRhZ3Nbbl0gPSAnPC9zcGFuPidcbn0pXG5cbi8qKlxuICogQ29udmVydHMgdGV4dCB3aXRoIEFOU0kgY29sb3IgY29kZXMgdG8gSFRNTCBtYXJrdXAuXG4gKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxuICogQHJldHVybnMgeyp9XG4gKi9cbmZ1bmN0aW9uIGFuc2lIVE1MICh0ZXh0KSB7XG4gIC8vIFJldHVybnMgdGhlIHRleHQgaWYgdGhlIHN0cmluZyBoYXMgbm8gQU5TSSBlc2NhcGUgY29kZS5cbiAgaWYgKCFfcmVnQU5TSS50ZXN0KHRleHQpKSB7XG4gICAgcmV0dXJuIHRleHRcbiAgfVxuXG4gIC8vIENhY2hlIG9wZW5lZCBzZXF1ZW5jZS5cbiAgdmFyIGFuc2lDb2RlcyA9IFtdXG4gIC8vIFJlcGxhY2Ugd2l0aCBtYXJrdXAuXG4gIHZhciByZXQgPSB0ZXh0LnJlcGxhY2UoL1xcMDMzXFxbKFxcZCspbS9nLCBmdW5jdGlvbiAobWF0Y2gsIHNlcSkge1xuICAgIHZhciBvdCA9IF9vcGVuVGFnc1tzZXFdXG4gICAgaWYgKG90KSB7XG4gICAgICAvLyBJZiBjdXJyZW50IHNlcXVlbmNlIGhhcyBiZWVuIG9wZW5lZCwgY2xvc2UgaXQuXG4gICAgICBpZiAoISF+YW5zaUNvZGVzLmluZGV4T2Yoc2VxKSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWV4dHJhLWJvb2xlYW4tY2FzdFxuICAgICAgICBhbnNpQ29kZXMucG9wKClcbiAgICAgICAgcmV0dXJuICc8L3NwYW4+J1xuICAgICAgfVxuICAgICAgLy8gT3BlbiB0YWcuXG4gICAgICBhbnNpQ29kZXMucHVzaChzZXEpXG4gICAgICByZXR1cm4gb3RbMF0gPT09ICc8JyA/IG90IDogJzxzcGFuIHN0eWxlPVwiJyArIG90ICsgJztcIj4nXG4gICAgfVxuXG4gICAgdmFyIGN0ID0gX2Nsb3NlVGFnc1tzZXFdXG4gICAgaWYgKGN0KSB7XG4gICAgICAvLyBQb3Agc2VxdWVuY2VcbiAgICAgIGFuc2lDb2Rlcy5wb3AoKVxuICAgICAgcmV0dXJuIGN0XG4gICAgfVxuICAgIHJldHVybiAnJ1xuICB9KVxuXG4gIC8vIE1ha2Ugc3VyZSB0YWdzIGFyZSBjbG9zZWQuXG4gIHZhciBsID0gYW5zaUNvZGVzLmxlbmd0aFxuICA7KGwgPiAwKSAmJiAocmV0ICs9IEFycmF5KGwgKyAxKS5qb2luKCc8L3NwYW4+JykpXG5cbiAgcmV0dXJuIHJldFxufVxuXG4vKipcbiAqIEN1c3RvbWl6ZSBjb2xvcnMuXG4gKiBAcGFyYW0ge09iamVjdH0gY29sb3JzIHJlZmVyZW5jZSB0byBfZGVmQ29sb3JzXG4gKi9cbmFuc2lIVE1MLnNldENvbG9ycyA9IGZ1bmN0aW9uIChjb2xvcnMpIHtcbiAgaWYgKHR5cGVvZiBjb2xvcnMgIT09ICdvYmplY3QnKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdgY29sb3JzYCBwYXJhbWV0ZXIgbXVzdCBiZSBhbiBPYmplY3QuJylcbiAgfVxuXG4gIHZhciBfZmluYWxDb2xvcnMgPSB7fVxuICBmb3IgKHZhciBrZXkgaW4gX2RlZkNvbG9ycykge1xuICAgIHZhciBoZXggPSBjb2xvcnMuaGFzT3duUHJvcGVydHkoa2V5KSA/IGNvbG9yc1trZXldIDogbnVsbFxuICAgIGlmICghaGV4KSB7XG4gICAgICBfZmluYWxDb2xvcnNba2V5XSA9IF9kZWZDb2xvcnNba2V5XVxuICAgICAgY29udGludWVcbiAgICB9XG4gICAgaWYgKCdyZXNldCcgPT09IGtleSkge1xuICAgICAgaWYgKHR5cGVvZiBoZXggPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGhleCA9IFtoZXhdXG4gICAgICB9XG4gICAgICBpZiAoIUFycmF5LmlzQXJyYXkoaGV4KSB8fCBoZXgubGVuZ3RoID09PSAwIHx8IGhleC5zb21lKGZ1bmN0aW9uIChoKSB7XG4gICAgICAgIHJldHVybiB0eXBlb2YgaCAhPT0gJ3N0cmluZydcbiAgICAgIH0pKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignVGhlIHZhbHVlIG9mIGAnICsga2V5ICsgJ2AgcHJvcGVydHkgbXVzdCBiZSBhbiBBcnJheSBhbmQgZWFjaCBpdGVtIGNvdWxkIG9ubHkgYmUgYSBoZXggc3RyaW5nLCBlLmcuOiBGRjAwMDAnKVxuICAgICAgfVxuICAgICAgdmFyIGRlZkhleENvbG9yID0gX2RlZkNvbG9yc1trZXldXG4gICAgICBpZiAoIWhleFswXSkge1xuICAgICAgICBoZXhbMF0gPSBkZWZIZXhDb2xvclswXVxuICAgICAgfVxuICAgICAgaWYgKGhleC5sZW5ndGggPT09IDEgfHwgIWhleFsxXSkge1xuICAgICAgICBoZXggPSBbaGV4WzBdXVxuICAgICAgICBoZXgucHVzaChkZWZIZXhDb2xvclsxXSlcbiAgICAgIH1cblxuICAgICAgaGV4ID0gaGV4LnNsaWNlKDAsIDIpXG4gICAgfSBlbHNlIGlmICh0eXBlb2YgaGV4ICE9PSAnc3RyaW5nJykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdUaGUgdmFsdWUgb2YgYCcgKyBrZXkgKyAnYCBwcm9wZXJ0eSBtdXN0IGJlIGEgaGV4IHN0cmluZywgZS5nLjogRkYwMDAwJylcbiAgICB9XG4gICAgX2ZpbmFsQ29sb3JzW2tleV0gPSBoZXhcbiAgfVxuICBfc2V0VGFncyhfZmluYWxDb2xvcnMpXG59XG5cbi8qKlxuICogUmVzZXQgY29sb3JzLlxuICovXG5hbnNpSFRNTC5yZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgX3NldFRhZ3MoX2RlZkNvbG9ycylcbn1cblxuLyoqXG4gKiBFeHBvc2UgdGFncywgaW5jbHVkaW5nIG9wZW4gYW5kIGNsb3NlLlxuICogQHR5cGUge09iamVjdH1cbiAqL1xuYW5zaUhUTUwudGFncyA9IHt9XG5cbmlmIChPYmplY3QuZGVmaW5lUHJvcGVydHkpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFuc2lIVE1MLnRhZ3MsICdvcGVuJywge1xuICAgIGdldDogZnVuY3Rpb24gKCkgeyByZXR1cm4gX29wZW5UYWdzIH1cbiAgfSlcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGFuc2lIVE1MLnRhZ3MsICdjbG9zZScsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uICgpIHsgcmV0dXJuIF9jbG9zZVRhZ3MgfVxuICB9KVxufSBlbHNlIHtcbiAgYW5zaUhUTUwudGFncy5vcGVuID0gX29wZW5UYWdzXG4gIGFuc2lIVE1MLnRhZ3MuY2xvc2UgPSBfY2xvc2VUYWdzXG59XG5cbmZ1bmN0aW9uIF9zZXRUYWdzIChjb2xvcnMpIHtcbiAgLy8gcmVzZXQgYWxsXG4gIF9vcGVuVGFnc1snMCddID0gJ2ZvbnQtd2VpZ2h0Om5vcm1hbDtvcGFjaXR5OjE7Y29sb3I6IycgKyBjb2xvcnMucmVzZXRbMF0gKyAnO2JhY2tncm91bmQ6IycgKyBjb2xvcnMucmVzZXRbMV1cbiAgLy8gaW52ZXJzZVxuICBfb3BlblRhZ3NbJzcnXSA9ICdjb2xvcjojJyArIGNvbG9ycy5yZXNldFsxXSArICc7YmFja2dyb3VuZDojJyArIGNvbG9ycy5yZXNldFswXVxuICAvLyBkYXJrIGdyZXlcbiAgX29wZW5UYWdzWyc5MCddID0gJ2NvbG9yOiMnICsgY29sb3JzLmRhcmtncmV5XG5cbiAgZm9yICh2YXIgY29kZSBpbiBfc3R5bGVzKSB7XG4gICAgdmFyIGNvbG9yID0gX3N0eWxlc1tjb2RlXVxuICAgIHZhciBvcmlDb2xvciA9IGNvbG9yc1tjb2xvcl0gfHwgJzAwMCdcbiAgICBfb3BlblRhZ3NbY29kZV0gPSAnY29sb3I6IycgKyBvcmlDb2xvclxuICAgIGNvZGUgPSBwYXJzZUludChjb2RlKVxuICAgIF9vcGVuVGFnc1soY29kZSArIDEwKS50b1N0cmluZygpXSA9ICdiYWNrZ3JvdW5kOiMnICsgb3JpQ29sb3JcbiAgfVxufVxuXG5hbnNpSFRNTC5yZXNldCgpXG4iLCIvLyBDb3B5cmlnaHQgSm95ZW50LCBJbmMuIGFuZCBvdGhlciBOb2RlIGNvbnRyaWJ1dG9ycy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYVxuLy8gY29weSBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZVxuLy8gXCJTb2Z0d2FyZVwiKSwgdG8gZGVhbCBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nXG4vLyB3aXRob3V0IGxpbWl0YXRpb24gdGhlIHJpZ2h0cyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsXG4vLyBkaXN0cmlidXRlLCBzdWJsaWNlbnNlLCBhbmQvb3Igc2VsbCBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0XG4vLyBwZXJzb25zIHRvIHdob20gdGhlIFNvZnR3YXJlIGlzIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGVcbi8vIGZvbGxvd2luZyBjb25kaXRpb25zOlxuLy9cbi8vIFRoZSBhYm92ZSBjb3B5cmlnaHQgbm90aWNlIGFuZCB0aGlzIHBlcm1pc3Npb24gbm90aWNlIHNoYWxsIGJlIGluY2x1ZGVkXG4vLyBpbiBhbGwgY29waWVzIG9yIHN1YnN0YW50aWFsIHBvcnRpb25zIG9mIHRoZSBTb2Z0d2FyZS5cbi8vXG4vLyBUSEUgU09GVFdBUkUgSVMgUFJPVklERUQgXCJBUyBJU1wiLCBXSVRIT1VUIFdBUlJBTlRZIE9GIEFOWSBLSU5ELCBFWFBSRVNTXG4vLyBPUiBJTVBMSUVELCBJTkNMVURJTkcgQlVUIE5PVCBMSU1JVEVEIFRPIFRIRSBXQVJSQU5USUVTIE9GXG4vLyBNRVJDSEFOVEFCSUxJVFksIEZJVE5FU1MgRk9SIEEgUEFSVElDVUxBUiBQVVJQT1NFIEFORCBOT05JTkZSSU5HRU1FTlQuIElOXG4vLyBOTyBFVkVOVCBTSEFMTCBUSEUgQVVUSE9SUyBPUiBDT1BZUklHSFQgSE9MREVSUyBCRSBMSUFCTEUgRk9SIEFOWSBDTEFJTSxcbi8vIERBTUFHRVMgT1IgT1RIRVIgTElBQklMSVRZLCBXSEVUSEVSIElOIEFOIEFDVElPTiBPRiBDT05UUkFDVCwgVE9SVCBPUlxuLy8gT1RIRVJXSVNFLCBBUklTSU5HIEZST00sIE9VVCBPRiBPUiBJTiBDT05ORUNUSU9OIFdJVEggVEhFIFNPRlRXQVJFIE9SIFRIRVxuLy8gVVNFIE9SIE9USEVSIERFQUxJTkdTIElOIFRIRSBTT0ZUV0FSRS5cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUiA9IHR5cGVvZiBSZWZsZWN0ID09PSAnb2JqZWN0JyA/IFJlZmxlY3QgOiBudWxsXG52YXIgUmVmbGVjdEFwcGx5ID0gUiAmJiB0eXBlb2YgUi5hcHBseSA9PT0gJ2Z1bmN0aW9uJ1xuICA/IFIuYXBwbHlcbiAgOiBmdW5jdGlvbiBSZWZsZWN0QXBwbHkodGFyZ2V0LCByZWNlaXZlciwgYXJncykge1xuICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuY2FsbCh0YXJnZXQsIHJlY2VpdmVyLCBhcmdzKTtcbiAgfVxuXG52YXIgUmVmbGVjdE93bktleXNcbmlmIChSICYmIHR5cGVvZiBSLm93bktleXMgPT09ICdmdW5jdGlvbicpIHtcbiAgUmVmbGVjdE93bktleXMgPSBSLm93bktleXNcbn0gZWxzZSBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpXG4gICAgICAuY29uY2F0KE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHModGFyZ2V0KSk7XG4gIH07XG59IGVsc2Uge1xuICBSZWZsZWN0T3duS2V5cyA9IGZ1bmN0aW9uIFJlZmxlY3RPd25LZXlzKHRhcmdldCkge1xuICAgIHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0YXJnZXQpO1xuICB9O1xufVxuXG5mdW5jdGlvbiBQcm9jZXNzRW1pdFdhcm5pbmcod2FybmluZykge1xuICBpZiAoY29uc29sZSAmJiBjb25zb2xlLndhcm4pIGNvbnNvbGUud2Fybih3YXJuaW5nKTtcbn1cblxudmFyIE51bWJlcklzTmFOID0gTnVtYmVyLmlzTmFOIHx8IGZ1bmN0aW9uIE51bWJlcklzTmFOKHZhbHVlKSB7XG4gIHJldHVybiB2YWx1ZSAhPT0gdmFsdWU7XG59XG5cbmZ1bmN0aW9uIEV2ZW50RW1pdHRlcigpIHtcbiAgRXZlbnRFbWl0dGVyLmluaXQuY2FsbCh0aGlzKTtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xubW9kdWxlLmV4cG9ydHMub25jZSA9IG9uY2U7XG5cbi8vIEJhY2t3YXJkcy1jb21wYXQgd2l0aCBub2RlIDAuMTAueFxuRXZlbnRFbWl0dGVyLkV2ZW50RW1pdHRlciA9IEV2ZW50RW1pdHRlcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzID0gdW5kZWZpbmVkO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fZXZlbnRzQ291bnQgPSAwO1xuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5fbWF4TGlzdGVuZXJzID0gdW5kZWZpbmVkO1xuXG4vLyBCeSBkZWZhdWx0IEV2ZW50RW1pdHRlcnMgd2lsbCBwcmludCBhIHdhcm5pbmcgaWYgbW9yZSB0aGFuIDEwIGxpc3RlbmVycyBhcmVcbi8vIGFkZGVkIHRvIGl0LiBUaGlzIGlzIGEgdXNlZnVsIGRlZmF1bHQgd2hpY2ggaGVscHMgZmluZGluZyBtZW1vcnkgbGVha3MuXG52YXIgZGVmYXVsdE1heExpc3RlbmVycyA9IDEwO1xuXG5mdW5jdGlvbiBjaGVja0xpc3RlbmVyKGxpc3RlbmVyKSB7XG4gIGlmICh0eXBlb2YgbGlzdGVuZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdUaGUgXCJsaXN0ZW5lclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBGdW5jdGlvbi4gUmVjZWl2ZWQgdHlwZSAnICsgdHlwZW9mIGxpc3RlbmVyKTtcbiAgfVxufVxuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoRXZlbnRFbWl0dGVyLCAnZGVmYXVsdE1heExpc3RlbmVycycsIHtcbiAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgZ2V0OiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gZGVmYXVsdE1heExpc3RlbmVycztcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbihhcmcpIHtcbiAgICBpZiAodHlwZW9mIGFyZyAhPT0gJ251bWJlcicgfHwgYXJnIDwgMCB8fCBOdW1iZXJJc05hTihhcmcpKSB7XG4gICAgICB0aHJvdyBuZXcgUmFuZ2VFcnJvcignVGhlIHZhbHVlIG9mIFwiZGVmYXVsdE1heExpc3RlbmVyc1wiIGlzIG91dCBvZiByYW5nZS4gSXQgbXVzdCBiZSBhIG5vbi1uZWdhdGl2ZSBudW1iZXIuIFJlY2VpdmVkICcgKyBhcmcgKyAnLicpO1xuICAgIH1cbiAgICBkZWZhdWx0TWF4TGlzdGVuZXJzID0gYXJnO1xuICB9XG59KTtcblxuRXZlbnRFbWl0dGVyLmluaXQgPSBmdW5jdGlvbigpIHtcblxuICBpZiAodGhpcy5fZXZlbnRzID09PSB1bmRlZmluZWQgfHxcbiAgICAgIHRoaXMuX2V2ZW50cyA9PT0gT2JqZWN0LmdldFByb3RvdHlwZU9mKHRoaXMpLl9ldmVudHMpIHtcbiAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgIHRoaXMuX2V2ZW50c0NvdW50ID0gMDtcbiAgfVxuXG4gIHRoaXMuX21heExpc3RlbmVycyA9IHRoaXMuX21heExpc3RlbmVycyB8fCB1bmRlZmluZWQ7XG59O1xuXG4vLyBPYnZpb3VzbHkgbm90IGFsbCBFbWl0dGVycyBzaG91bGQgYmUgbGltaXRlZCB0byAxMC4gVGhpcyBmdW5jdGlvbiBhbGxvd3Ncbi8vIHRoYXQgdG8gYmUgaW5jcmVhc2VkLiBTZXQgdG8gemVybyBmb3IgdW5saW1pdGVkLlxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5zZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBzZXRNYXhMaXN0ZW5lcnMobikge1xuICBpZiAodHlwZW9mIG4gIT09ICdudW1iZXInIHx8IG4gPCAwIHx8IE51bWJlcklzTmFOKG4pKSB7XG4gICAgdGhyb3cgbmV3IFJhbmdlRXJyb3IoJ1RoZSB2YWx1ZSBvZiBcIm5cIiBpcyBvdXQgb2YgcmFuZ2UuIEl0IG11c3QgYmUgYSBub24tbmVnYXRpdmUgbnVtYmVyLiBSZWNlaXZlZCAnICsgbiArICcuJyk7XG4gIH1cbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gbjtcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5mdW5jdGlvbiBfZ2V0TWF4TGlzdGVuZXJzKHRoYXQpIHtcbiAgaWYgKHRoYXQuX21heExpc3RlbmVycyA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBFdmVudEVtaXR0ZXIuZGVmYXVsdE1heExpc3RlbmVycztcbiAgcmV0dXJuIHRoYXQuX21heExpc3RlbmVycztcbn1cblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5nZXRNYXhMaXN0ZW5lcnMgPSBmdW5jdGlvbiBnZXRNYXhMaXN0ZW5lcnMoKSB7XG4gIHJldHVybiBfZ2V0TWF4TGlzdGVuZXJzKHRoaXMpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24gZW1pdCh0eXBlKSB7XG4gIHZhciBhcmdzID0gW107XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSBhcmdzLnB1c2goYXJndW1lbnRzW2ldKTtcbiAgdmFyIGRvRXJyb3IgPSAodHlwZSA9PT0gJ2Vycm9yJyk7XG5cbiAgdmFyIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgaWYgKGV2ZW50cyAhPT0gdW5kZWZpbmVkKVxuICAgIGRvRXJyb3IgPSAoZG9FcnJvciAmJiBldmVudHMuZXJyb3IgPT09IHVuZGVmaW5lZCk7XG4gIGVsc2UgaWYgKCFkb0Vycm9yKVxuICAgIHJldHVybiBmYWxzZTtcblxuICAvLyBJZiB0aGVyZSBpcyBubyAnZXJyb3InIGV2ZW50IGxpc3RlbmVyIHRoZW4gdGhyb3cuXG4gIGlmIChkb0Vycm9yKSB7XG4gICAgdmFyIGVyO1xuICAgIGlmIChhcmdzLmxlbmd0aCA+IDApXG4gICAgICBlciA9IGFyZ3NbMF07XG4gICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgIC8vIE5vdGU6IFRoZSBjb21tZW50cyBvbiB0aGUgYHRocm93YCBsaW5lcyBhcmUgaW50ZW50aW9uYWwsIHRoZXkgc2hvd1xuICAgICAgLy8gdXAgaW4gTm9kZSdzIG91dHB1dCBpZiB0aGlzIHJlc3VsdHMgaW4gYW4gdW5oYW5kbGVkIGV4Y2VwdGlvbi5cbiAgICAgIHRocm93IGVyOyAvLyBVbmhhbmRsZWQgJ2Vycm9yJyBldmVudFxuICAgIH1cbiAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgdmFyIGVyciA9IG5ldyBFcnJvcignVW5oYW5kbGVkIGVycm9yLicgKyAoZXIgPyAnICgnICsgZXIubWVzc2FnZSArICcpJyA6ICcnKSk7XG4gICAgZXJyLmNvbnRleHQgPSBlcjtcbiAgICB0aHJvdyBlcnI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gIH1cblxuICB2YXIgaGFuZGxlciA9IGV2ZW50c1t0eXBlXTtcblxuICBpZiAoaGFuZGxlciA9PT0gdW5kZWZpbmVkKVxuICAgIHJldHVybiBmYWxzZTtcblxuICBpZiAodHlwZW9mIGhhbmRsZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICBSZWZsZWN0QXBwbHkoaGFuZGxlciwgdGhpcywgYXJncyk7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGxlbiA9IGhhbmRsZXIubGVuZ3RoO1xuICAgIHZhciBsaXN0ZW5lcnMgPSBhcnJheUNsb25lKGhhbmRsZXIsIGxlbik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47ICsraSlcbiAgICAgIFJlZmxlY3RBcHBseShsaXN0ZW5lcnNbaV0sIHRoaXMsIGFyZ3MpO1xuICB9XG5cbiAgcmV0dXJuIHRydWU7XG59O1xuXG5mdW5jdGlvbiBfYWRkTGlzdGVuZXIodGFyZ2V0LCB0eXBlLCBsaXN0ZW5lciwgcHJlcGVuZCkge1xuICB2YXIgbTtcbiAgdmFyIGV2ZW50cztcbiAgdmFyIGV4aXN0aW5nO1xuXG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpIHtcbiAgICBldmVudHMgPSB0YXJnZXQuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgdGFyZ2V0Ll9ldmVudHNDb3VudCA9IDA7XG4gIH0gZWxzZSB7XG4gICAgLy8gVG8gYXZvaWQgcmVjdXJzaW9uIGluIHRoZSBjYXNlIHRoYXQgdHlwZSA9PT0gXCJuZXdMaXN0ZW5lclwiISBCZWZvcmVcbiAgICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gICAgaWYgKGV2ZW50cy5uZXdMaXN0ZW5lciAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0YXJnZXQuZW1pdCgnbmV3TGlzdGVuZXInLCB0eXBlLFxuICAgICAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgPyBsaXN0ZW5lci5saXN0ZW5lciA6IGxpc3RlbmVyKTtcblxuICAgICAgLy8gUmUtYXNzaWduIGBldmVudHNgIGJlY2F1c2UgYSBuZXdMaXN0ZW5lciBoYW5kbGVyIGNvdWxkIGhhdmUgY2F1c2VkIHRoZVxuICAgICAgLy8gdGhpcy5fZXZlbnRzIHRvIGJlIGFzc2lnbmVkIHRvIGEgbmV3IG9iamVjdFxuICAgICAgZXZlbnRzID0gdGFyZ2V0Ll9ldmVudHM7XG4gICAgfVxuICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdO1xuICB9XG5cbiAgaWYgKGV4aXN0aW5nID09PSB1bmRlZmluZWQpIHtcbiAgICAvLyBPcHRpbWl6ZSB0aGUgY2FzZSBvZiBvbmUgbGlzdGVuZXIuIERvbid0IG5lZWQgdGhlIGV4dHJhIGFycmF5IG9iamVjdC5cbiAgICBleGlzdGluZyA9IGV2ZW50c1t0eXBlXSA9IGxpc3RlbmVyO1xuICAgICsrdGFyZ2V0Ll9ldmVudHNDb3VudDtcbiAgfSBlbHNlIHtcbiAgICBpZiAodHlwZW9mIGV4aXN0aW5nID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAvLyBBZGRpbmcgdGhlIHNlY29uZCBlbGVtZW50LCBuZWVkIHRvIGNoYW5nZSB0byBhcnJheS5cbiAgICAgIGV4aXN0aW5nID0gZXZlbnRzW3R5cGVdID1cbiAgICAgICAgcHJlcGVuZCA/IFtsaXN0ZW5lciwgZXhpc3RpbmddIDogW2V4aXN0aW5nLCBsaXN0ZW5lcl07XG4gICAgICAvLyBJZiB3ZSd2ZSBhbHJlYWR5IGdvdCBhbiBhcnJheSwganVzdCBhcHBlbmQuXG4gICAgfSBlbHNlIGlmIChwcmVwZW5kKSB7XG4gICAgICBleGlzdGluZy51bnNoaWZ0KGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZXhpc3RpbmcucHVzaChsaXN0ZW5lcik7XG4gICAgfVxuXG4gICAgLy8gQ2hlY2sgZm9yIGxpc3RlbmVyIGxlYWtcbiAgICBtID0gX2dldE1heExpc3RlbmVycyh0YXJnZXQpO1xuICAgIGlmIChtID4gMCAmJiBleGlzdGluZy5sZW5ndGggPiBtICYmICFleGlzdGluZy53YXJuZWQpIHtcbiAgICAgIGV4aXN0aW5nLndhcm5lZCA9IHRydWU7XG4gICAgICAvLyBObyBlcnJvciBjb2RlIGZvciB0aGlzIHNpbmNlIGl0IGlzIGEgV2FybmluZ1xuICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXJlc3RyaWN0ZWQtc3ludGF4XG4gICAgICB2YXIgdyA9IG5ldyBFcnJvcignUG9zc2libGUgRXZlbnRFbWl0dGVyIG1lbW9yeSBsZWFrIGRldGVjdGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgZXhpc3RpbmcubGVuZ3RoICsgJyAnICsgU3RyaW5nKHR5cGUpICsgJyBsaXN0ZW5lcnMgJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdhZGRlZC4gVXNlIGVtaXR0ZXIuc2V0TWF4TGlzdGVuZXJzKCkgdG8gJyArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICdpbmNyZWFzZSBsaW1pdCcpO1xuICAgICAgdy5uYW1lID0gJ01heExpc3RlbmVyc0V4Y2VlZGVkV2FybmluZyc7XG4gICAgICB3LmVtaXR0ZXIgPSB0YXJnZXQ7XG4gICAgICB3LnR5cGUgPSB0eXBlO1xuICAgICAgdy5jb3VudCA9IGV4aXN0aW5nLmxlbmd0aDtcbiAgICAgIFByb2Nlc3NFbWl0V2FybmluZyh3KTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gdGFyZ2V0O1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmFkZExpc3RlbmVyID0gZnVuY3Rpb24gYWRkTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgcmV0dXJuIF9hZGRMaXN0ZW5lcih0aGlzLCB0eXBlLCBsaXN0ZW5lciwgZmFsc2UpO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZExpc3RlbmVyID1cbiAgICBmdW5jdGlvbiBwcmVwZW5kTGlzdGVuZXIodHlwZSwgbGlzdGVuZXIpIHtcbiAgICAgIHJldHVybiBfYWRkTGlzdGVuZXIodGhpcywgdHlwZSwgbGlzdGVuZXIsIHRydWUpO1xuICAgIH07XG5cbmZ1bmN0aW9uIG9uY2VXcmFwcGVyKCkge1xuICBpZiAoIXRoaXMuZmlyZWQpIHtcbiAgICB0aGlzLnRhcmdldC5yZW1vdmVMaXN0ZW5lcih0aGlzLnR5cGUsIHRoaXMud3JhcEZuKTtcbiAgICB0aGlzLmZpcmVkID0gdHJ1ZTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMClcbiAgICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmNhbGwodGhpcy50YXJnZXQpO1xuICAgIHJldHVybiB0aGlzLmxpc3RlbmVyLmFwcGx5KHRoaXMudGFyZ2V0LCBhcmd1bWVudHMpO1xuICB9XG59XG5cbmZ1bmN0aW9uIF9vbmNlV3JhcCh0YXJnZXQsIHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBzdGF0ZSA9IHsgZmlyZWQ6IGZhbHNlLCB3cmFwRm46IHVuZGVmaW5lZCwgdGFyZ2V0OiB0YXJnZXQsIHR5cGU6IHR5cGUsIGxpc3RlbmVyOiBsaXN0ZW5lciB9O1xuICB2YXIgd3JhcHBlZCA9IG9uY2VXcmFwcGVyLmJpbmQoc3RhdGUpO1xuICB3cmFwcGVkLmxpc3RlbmVyID0gbGlzdGVuZXI7XG4gIHN0YXRlLndyYXBGbiA9IHdyYXBwZWQ7XG4gIHJldHVybiB3cmFwcGVkO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLm9uY2UgPSBmdW5jdGlvbiBvbmNlKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuICB0aGlzLm9uKHR5cGUsIF9vbmNlV3JhcCh0aGlzLCB0eXBlLCBsaXN0ZW5lcikpO1xuICByZXR1cm4gdGhpcztcbn07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUucHJlcGVuZE9uY2VMaXN0ZW5lciA9XG4gICAgZnVuY3Rpb24gcHJlcGVuZE9uY2VMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgY2hlY2tMaXN0ZW5lcihsaXN0ZW5lcik7XG4gICAgICB0aGlzLnByZXBlbmRMaXN0ZW5lcih0eXBlLCBfb25jZVdyYXAodGhpcywgdHlwZSwgbGlzdGVuZXIpKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbi8vIEVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZiBhbmQgb25seSBpZiB0aGUgbGlzdGVuZXIgd2FzIHJlbW92ZWQuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID1cbiAgICBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcikge1xuICAgICAgdmFyIGxpc3QsIGV2ZW50cywgcG9zaXRpb24sIGksIG9yaWdpbmFsTGlzdGVuZXI7XG5cbiAgICAgIGNoZWNrTGlzdGVuZXIobGlzdGVuZXIpO1xuXG4gICAgICBldmVudHMgPSB0aGlzLl9ldmVudHM7XG4gICAgICBpZiAoZXZlbnRzID09PSB1bmRlZmluZWQpXG4gICAgICAgIHJldHVybiB0aGlzO1xuXG4gICAgICBsaXN0ID0gZXZlbnRzW3R5cGVdO1xuICAgICAgaWYgKGxpc3QgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIGlmIChsaXN0ID09PSBsaXN0ZW5lciB8fCBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikge1xuICAgICAgICBpZiAoLS10aGlzLl9ldmVudHNDb3VudCA9PT0gMClcbiAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICBkZWxldGUgZXZlbnRzW3R5cGVdO1xuICAgICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdC5saXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGxpc3QgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgcG9zaXRpb24gPSAtMTtcblxuICAgICAgICBmb3IgKGkgPSBsaXN0Lmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgaWYgKGxpc3RbaV0gPT09IGxpc3RlbmVyIHx8IGxpc3RbaV0ubGlzdGVuZXIgPT09IGxpc3RlbmVyKSB7XG4gICAgICAgICAgICBvcmlnaW5hbExpc3RlbmVyID0gbGlzdFtpXS5saXN0ZW5lcjtcbiAgICAgICAgICAgIHBvc2l0aW9uID0gaTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb3NpdGlvbiA8IDApXG4gICAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgICAgaWYgKHBvc2l0aW9uID09PSAwKVxuICAgICAgICAgIGxpc3Quc2hpZnQoKTtcbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgc3BsaWNlT25lKGxpc3QsIHBvc2l0aW9uKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSlcbiAgICAgICAgICBldmVudHNbdHlwZV0gPSBsaXN0WzBdO1xuXG4gICAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgIT09IHVuZGVmaW5lZClcbiAgICAgICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgb3JpZ2luYWxMaXN0ZW5lciB8fCBsaXN0ZW5lcik7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub2ZmID0gRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVMaXN0ZW5lcjtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPVxuICAgIGZ1bmN0aW9uIHJlbW92ZUFsbExpc3RlbmVycyh0eXBlKSB7XG4gICAgICB2YXIgbGlzdGVuZXJzLCBldmVudHMsIGk7XG5cbiAgICAgIGV2ZW50cyA9IHRoaXMuX2V2ZW50cztcbiAgICAgIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICAgIC8vIG5vdCBsaXN0ZW5pbmcgZm9yIHJlbW92ZUxpc3RlbmVyLCBubyBuZWVkIHRvIGVtaXRcbiAgICAgIGlmIChldmVudHMucmVtb3ZlTGlzdGVuZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgIHRoaXMuX2V2ZW50cyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gICAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICB9IGVsc2UgaWYgKGV2ZW50c1t0eXBlXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgaWYgKC0tdGhpcy5fZXZlbnRzQ291bnQgPT09IDApXG4gICAgICAgICAgICB0aGlzLl9ldmVudHMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgIGRlbGV0ZSBldmVudHNbdHlwZV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICB9XG5cbiAgICAgIC8vIGVtaXQgcmVtb3ZlTGlzdGVuZXIgZm9yIGFsbCBsaXN0ZW5lcnMgb24gYWxsIGV2ZW50c1xuICAgICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhldmVudHMpO1xuICAgICAgICB2YXIga2V5O1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwga2V5cy5sZW5ndGg7ICsraSkge1xuICAgICAgICAgIGtleSA9IGtleXNbaV07XG4gICAgICAgICAgaWYgKGtleSA9PT0gJ3JlbW92ZUxpc3RlbmVyJykgY29udGludWU7XG4gICAgICAgICAgdGhpcy5yZW1vdmVBbGxMaXN0ZW5lcnMoa2V5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLnJlbW92ZUFsbExpc3RlbmVycygncmVtb3ZlTGlzdGVuZXInKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiAgICAgICAgdGhpcy5fZXZlbnRzQ291bnQgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgIH1cblxuICAgICAgbGlzdGVuZXJzID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgICBpZiAodHlwZW9mIGxpc3RlbmVycyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gICAgICB9IGVsc2UgaWYgKGxpc3RlbmVycyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIC8vIExJRk8gb3JkZXJcbiAgICAgICAgZm9yIChpID0gbGlzdGVuZXJzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbaV0pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbmZ1bmN0aW9uIF9saXN0ZW5lcnModGFyZ2V0LCB0eXBlLCB1bndyYXApIHtcbiAgdmFyIGV2ZW50cyA9IHRhcmdldC5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgPT09IHVuZGVmaW5lZClcbiAgICByZXR1cm4gW107XG5cbiAgdmFyIGV2bGlzdGVuZXIgPSBldmVudHNbdHlwZV07XG4gIGlmIChldmxpc3RlbmVyID09PSB1bmRlZmluZWQpXG4gICAgcmV0dXJuIFtdO1xuXG4gIGlmICh0eXBlb2YgZXZsaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJylcbiAgICByZXR1cm4gdW53cmFwID8gW2V2bGlzdGVuZXIubGlzdGVuZXIgfHwgZXZsaXN0ZW5lcl0gOiBbZXZsaXN0ZW5lcl07XG5cbiAgcmV0dXJuIHVud3JhcCA/XG4gICAgdW53cmFwTGlzdGVuZXJzKGV2bGlzdGVuZXIpIDogYXJyYXlDbG9uZShldmxpc3RlbmVyLCBldmxpc3RlbmVyLmxlbmd0aCk7XG59XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUubGlzdGVuZXJzID0gZnVuY3Rpb24gbGlzdGVuZXJzKHR5cGUpIHtcbiAgcmV0dXJuIF9saXN0ZW5lcnModGhpcywgdHlwZSwgdHJ1ZSk7XG59O1xuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJhd0xpc3RlbmVycyA9IGZ1bmN0aW9uIHJhd0xpc3RlbmVycyh0eXBlKSB7XG4gIHJldHVybiBfbGlzdGVuZXJzKHRoaXMsIHR5cGUsIGZhbHNlKTtcbn07XG5cbkV2ZW50RW1pdHRlci5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24oZW1pdHRlciwgdHlwZSkge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIubGlzdGVuZXJDb3VudCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBlbWl0dGVyLmxpc3RlbmVyQ291bnQodHlwZSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGxpc3RlbmVyQ291bnQuY2FsbChlbWl0dGVyLCB0eXBlKTtcbiAgfVxufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gbGlzdGVuZXJDb3VudDtcbmZ1bmN0aW9uIGxpc3RlbmVyQ291bnQodHlwZSkge1xuICB2YXIgZXZlbnRzID0gdGhpcy5fZXZlbnRzO1xuXG4gIGlmIChldmVudHMgIT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBldmxpc3RlbmVyID0gZXZlbnRzW3R5cGVdO1xuXG4gICAgaWYgKHR5cGVvZiBldmxpc3RlbmVyID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICByZXR1cm4gMTtcbiAgICB9IGVsc2UgaWYgKGV2bGlzdGVuZXIgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIGV2bGlzdGVuZXIubGVuZ3RoO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAwO1xufVxuXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLmV2ZW50TmFtZXMgPSBmdW5jdGlvbiBldmVudE5hbWVzKCkge1xuICByZXR1cm4gdGhpcy5fZXZlbnRzQ291bnQgPiAwID8gUmVmbGVjdE93bktleXModGhpcy5fZXZlbnRzKSA6IFtdO1xufTtcblxuZnVuY3Rpb24gYXJyYXlDbG9uZShhcnIsIG4pIHtcbiAgdmFyIGNvcHkgPSBuZXcgQXJyYXkobik7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbjsgKytpKVxuICAgIGNvcHlbaV0gPSBhcnJbaV07XG4gIHJldHVybiBjb3B5O1xufVxuXG5mdW5jdGlvbiBzcGxpY2VPbmUobGlzdCwgaW5kZXgpIHtcbiAgZm9yICg7IGluZGV4ICsgMSA8IGxpc3QubGVuZ3RoOyBpbmRleCsrKVxuICAgIGxpc3RbaW5kZXhdID0gbGlzdFtpbmRleCArIDFdO1xuICBsaXN0LnBvcCgpO1xufVxuXG5mdW5jdGlvbiB1bndyYXBMaXN0ZW5lcnMoYXJyKSB7XG4gIHZhciByZXQgPSBuZXcgQXJyYXkoYXJyLmxlbmd0aCk7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcmV0Lmxlbmd0aDsgKytpKSB7XG4gICAgcmV0W2ldID0gYXJyW2ldLmxpc3RlbmVyIHx8IGFycltpXTtcbiAgfVxuICByZXR1cm4gcmV0O1xufVxuXG5mdW5jdGlvbiBvbmNlKGVtaXR0ZXIsIG5hbWUpIHtcbiAgcmV0dXJuIG5ldyBQcm9taXNlKGZ1bmN0aW9uIChyZXNvbHZlLCByZWplY3QpIHtcbiAgICBmdW5jdGlvbiBlcnJvckxpc3RlbmVyKGVycikge1xuICAgICAgZW1pdHRlci5yZW1vdmVMaXN0ZW5lcihuYW1lLCByZXNvbHZlcik7XG4gICAgICByZWplY3QoZXJyKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlcigpIHtcbiAgICAgIGlmICh0eXBlb2YgZW1pdHRlci5yZW1vdmVMaXN0ZW5lciA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUxpc3RlbmVyKCdlcnJvcicsIGVycm9yTGlzdGVuZXIpO1xuICAgICAgfVxuICAgICAgcmVzb2x2ZShbXS5zbGljZS5jYWxsKGFyZ3VtZW50cykpO1xuICAgIH07XG5cbiAgICBldmVudFRhcmdldEFnbm9zdGljQWRkTGlzdGVuZXIoZW1pdHRlciwgbmFtZSwgcmVzb2x2ZXIsIHsgb25jZTogdHJ1ZSB9KTtcbiAgICBpZiAobmFtZSAhPT0gJ2Vycm9yJykge1xuICAgICAgYWRkRXJyb3JIYW5kbGVySWZFdmVudEVtaXR0ZXIoZW1pdHRlciwgZXJyb3JMaXN0ZW5lciwgeyBvbmNlOiB0cnVlIH0pO1xuICAgIH1cbiAgfSk7XG59XG5cbmZ1bmN0aW9uIGFkZEVycm9ySGFuZGxlcklmRXZlbnRFbWl0dGVyKGVtaXR0ZXIsIGhhbmRsZXIsIGZsYWdzKSB7XG4gIGlmICh0eXBlb2YgZW1pdHRlci5vbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIGV2ZW50VGFyZ2V0QWdub3N0aWNBZGRMaXN0ZW5lcihlbWl0dGVyLCAnZXJyb3InLCBoYW5kbGVyLCBmbGFncyk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZXZlbnRUYXJnZXRBZ25vc3RpY0FkZExpc3RlbmVyKGVtaXR0ZXIsIG5hbWUsIGxpc3RlbmVyLCBmbGFncykge1xuICBpZiAodHlwZW9mIGVtaXR0ZXIub24gPT09ICdmdW5jdGlvbicpIHtcbiAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgZW1pdHRlci5vbmNlKG5hbWUsIGxpc3RlbmVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZW1pdHRlci5vbihuYW1lLCBsaXN0ZW5lcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBlbWl0dGVyLmFkZEV2ZW50TGlzdGVuZXIgPT09ICdmdW5jdGlvbicpIHtcbiAgICAvLyBFdmVudFRhcmdldCBkb2VzIG5vdCBoYXZlIGBlcnJvcmAgZXZlbnQgc2VtYW50aWNzIGxpa2UgTm9kZVxuICAgIC8vIEV2ZW50RW1pdHRlcnMsIHdlIGRvIG5vdCBsaXN0ZW4gZm9yIGBlcnJvcmAgZXZlbnRzIGhlcmUuXG4gICAgZW1pdHRlci5hZGRFdmVudExpc3RlbmVyKG5hbWUsIGZ1bmN0aW9uIHdyYXBMaXN0ZW5lcihhcmcpIHtcbiAgICAgIC8vIElFIGRvZXMgbm90IGhhdmUgYnVpbHRpbiBgeyBvbmNlOiB0cnVlIH1gIHN1cHBvcnQgc28gd2VcbiAgICAgIC8vIGhhdmUgdG8gZG8gaXQgbWFudWFsbHkuXG4gICAgICBpZiAoZmxhZ3Mub25jZSkge1xuICAgICAgICBlbWl0dGVyLnJlbW92ZUV2ZW50TGlzdGVuZXIobmFtZSwgd3JhcExpc3RlbmVyKTtcbiAgICAgIH1cbiAgICAgIGxpc3RlbmVyKGFyZyk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcignVGhlIFwiZW1pdHRlclwiIGFyZ3VtZW50IG11c3QgYmUgb2YgdHlwZSBFdmVudEVtaXR0ZXIuIFJlY2VpdmVkIHR5cGUgJyArIHR5cGVvZiBlbWl0dGVyKTtcbiAgfVxufVxuIiwiXCJ1c2Ugc3RyaWN0XCI7dmFyIF9fYXNzaWduPXRoaXMmJnRoaXMuX19hc3NpZ258fGZ1bmN0aW9uKCl7X19hc3NpZ249T2JqZWN0LmFzc2lnbnx8ZnVuY3Rpb24odCl7Zm9yKHZhciBzLGk9MSxuPWFyZ3VtZW50cy5sZW5ndGg7aTxuO2krKyl7cz1hcmd1bWVudHNbaV07Zm9yKHZhciBwIGluIHMpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHMscCkpdFtwXT1zW3BdfXJldHVybiB0fTtyZXR1cm4gX19hc3NpZ24uYXBwbHkodGhpcyxhcmd1bWVudHMpfTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO3ZhciBuYW1lZF9yZWZlcmVuY2VzXzE9cmVxdWlyZShcIi4vbmFtZWQtcmVmZXJlbmNlc1wiKTt2YXIgbnVtZXJpY191bmljb2RlX21hcF8xPXJlcXVpcmUoXCIuL251bWVyaWMtdW5pY29kZS1tYXBcIik7dmFyIHN1cnJvZ2F0ZV9wYWlyc18xPXJlcXVpcmUoXCIuL3N1cnJvZ2F0ZS1wYWlyc1wiKTt2YXIgYWxsTmFtZWRSZWZlcmVuY2VzPV9fYXNzaWduKF9fYXNzaWduKHt9LG5hbWVkX3JlZmVyZW5jZXNfMS5uYW1lZFJlZmVyZW5jZXMpLHthbGw6bmFtZWRfcmVmZXJlbmNlc18xLm5hbWVkUmVmZXJlbmNlcy5odG1sNX0pO2Z1bmN0aW9uIHJlcGxhY2VVc2luZ1JlZ0V4cChtYWNyb1RleHQsbWFjcm9SZWdFeHAsbWFjcm9SZXBsYWNlcil7bWFjcm9SZWdFeHAubGFzdEluZGV4PTA7dmFyIHJlcGxhY2VNYXRjaD1tYWNyb1JlZ0V4cC5leGVjKG1hY3JvVGV4dCk7dmFyIHJlcGxhY2VSZXN1bHQ7aWYocmVwbGFjZU1hdGNoKXtyZXBsYWNlUmVzdWx0PVwiXCI7dmFyIHJlcGxhY2VMYXN0SW5kZXg9MDtkb3tpZihyZXBsYWNlTGFzdEluZGV4IT09cmVwbGFjZU1hdGNoLmluZGV4KXtyZXBsYWNlUmVzdWx0Kz1tYWNyb1RleHQuc3Vic3RyaW5nKHJlcGxhY2VMYXN0SW5kZXgscmVwbGFjZU1hdGNoLmluZGV4KX12YXIgcmVwbGFjZUlucHV0PXJlcGxhY2VNYXRjaFswXTtyZXBsYWNlUmVzdWx0Kz1tYWNyb1JlcGxhY2VyKHJlcGxhY2VJbnB1dCk7cmVwbGFjZUxhc3RJbmRleD1yZXBsYWNlTWF0Y2guaW5kZXgrcmVwbGFjZUlucHV0Lmxlbmd0aH13aGlsZShyZXBsYWNlTWF0Y2g9bWFjcm9SZWdFeHAuZXhlYyhtYWNyb1RleHQpKTtpZihyZXBsYWNlTGFzdEluZGV4IT09bWFjcm9UZXh0Lmxlbmd0aCl7cmVwbGFjZVJlc3VsdCs9bWFjcm9UZXh0LnN1YnN0cmluZyhyZXBsYWNlTGFzdEluZGV4KX19ZWxzZXtyZXBsYWNlUmVzdWx0PW1hY3JvVGV4dH1yZXR1cm4gcmVwbGFjZVJlc3VsdH12YXIgZW5jb2RlUmVnRXhwcz17c3BlY2lhbENoYXJzOi9bPD4nXCImXS9nLG5vbkFzY2lpOi9bPD4nXCImXFx1MDA4MC1cXHVEN0ZGXFx1RTAwMC1cXHVGRkZGXXxbXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdL2csbm9uQXNjaWlQcmludGFibGU6L1s8PidcIiZcXHgwMS1cXHgwOFxceDExLVxceDE1XFx4MTctXFx4MUZcXHg3Zi1cXHVEN0ZGXFx1RTAwMC1cXHVGRkZGXXxbXFx1RDgwMC1cXHVEQkZGXVtcXHVEQzAwLVxcdURGRkZdfFtcXHVEODAwLVxcdURCRkZdKD8hW1xcdURDMDAtXFx1REZGRl0pfCg/OlteXFx1RDgwMC1cXHVEQkZGXXxeKVtcXHVEQzAwLVxcdURGRkZdL2csbm9uQXNjaWlQcmludGFibGVPbmx5Oi9bXFx4MDEtXFx4MDhcXHgxMS1cXHgxNVxceDE3LVxceDFGXFx4N2YtXFx1RDdGRlxcdUUwMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXXxbXFx1RDgwMC1cXHVEQkZGXSg/IVtcXHVEQzAwLVxcdURGRkZdKXwoPzpbXlxcdUQ4MDAtXFx1REJGRl18XilbXFx1REMwMC1cXHVERkZGXS9nLGV4dGVuc2l2ZTovW1xceDAxLVxceDBjXFx4MGUtXFx4MWZcXHgyMS1cXHgyY1xceDJlLVxceDJmXFx4M2EtXFx4NDBcXHg1Yi1cXHg2MFxceDdiLVxceDdkXFx4N2YtXFx1RDdGRlxcdUUwMDAtXFx1RkZGRl18W1xcdUQ4MDAtXFx1REJGRl1bXFx1REMwMC1cXHVERkZGXXxbXFx1RDgwMC1cXHVEQkZGXSg/IVtcXHVEQzAwLVxcdURGRkZdKXwoPzpbXlxcdUQ4MDAtXFx1REJGRl18XilbXFx1REMwMC1cXHVERkZGXS9nfTt2YXIgZGVmYXVsdEVuY29kZU9wdGlvbnM9e21vZGU6XCJzcGVjaWFsQ2hhcnNcIixsZXZlbDpcImFsbFwiLG51bWVyaWM6XCJkZWNpbWFsXCJ9O2Z1bmN0aW9uIGVuY29kZSh0ZXh0LF9hKXt2YXIgX2I9X2E9PT12b2lkIDA/ZGVmYXVsdEVuY29kZU9wdGlvbnM6X2EsX2M9X2IubW9kZSxtb2RlPV9jPT09dm9pZCAwP1wic3BlY2lhbENoYXJzXCI6X2MsX2Q9X2IubnVtZXJpYyxudW1lcmljPV9kPT09dm9pZCAwP1wiZGVjaW1hbFwiOl9kLF9lPV9iLmxldmVsLGxldmVsPV9lPT09dm9pZCAwP1wiYWxsXCI6X2U7aWYoIXRleHQpe3JldHVyblwiXCJ9dmFyIGVuY29kZVJlZ0V4cD1lbmNvZGVSZWdFeHBzW21vZGVdO3ZhciByZWZlcmVuY2VzPWFsbE5hbWVkUmVmZXJlbmNlc1tsZXZlbF0uY2hhcmFjdGVyczt2YXIgaXNIZXg9bnVtZXJpYz09PVwiaGV4YWRlY2ltYWxcIjtyZXR1cm4gcmVwbGFjZVVzaW5nUmVnRXhwKHRleHQsZW5jb2RlUmVnRXhwLChmdW5jdGlvbihpbnB1dCl7dmFyIHJlc3VsdD1yZWZlcmVuY2VzW2lucHV0XTtpZighcmVzdWx0KXt2YXIgY29kZT1pbnB1dC5sZW5ndGg+MT9zdXJyb2dhdGVfcGFpcnNfMS5nZXRDb2RlUG9pbnQoaW5wdXQsMCk6aW5wdXQuY2hhckNvZGVBdCgwKTtyZXN1bHQ9KGlzSGV4P1wiJiN4XCIrY29kZS50b1N0cmluZygxNik6XCImI1wiK2NvZGUpK1wiO1wifXJldHVybiByZXN1bHR9KSl9ZXhwb3J0cy5lbmNvZGU9ZW5jb2RlO3ZhciBkZWZhdWx0RGVjb2RlT3B0aW9ucz17c2NvcGU6XCJib2R5XCIsbGV2ZWw6XCJhbGxcIn07dmFyIHN0cmljdD0vJig/OiNcXGQrfCNbeFhdW1xcZGEtZkEtRl0rfFswLTlhLXpBLVpdKyk7L2c7dmFyIGF0dHJpYnV0ZT0vJig/OiNcXGQrfCNbeFhdW1xcZGEtZkEtRl0rfFswLTlhLXpBLVpdKylbOz1dPy9nO3ZhciBiYXNlRGVjb2RlUmVnRXhwcz17eG1sOntzdHJpY3Q6c3RyaWN0LGF0dHJpYnV0ZTphdHRyaWJ1dGUsYm9keTpuYW1lZF9yZWZlcmVuY2VzXzEuYm9keVJlZ0V4cHMueG1sfSxodG1sNDp7c3RyaWN0OnN0cmljdCxhdHRyaWJ1dGU6YXR0cmlidXRlLGJvZHk6bmFtZWRfcmVmZXJlbmNlc18xLmJvZHlSZWdFeHBzLmh0bWw0fSxodG1sNTp7c3RyaWN0OnN0cmljdCxhdHRyaWJ1dGU6YXR0cmlidXRlLGJvZHk6bmFtZWRfcmVmZXJlbmNlc18xLmJvZHlSZWdFeHBzLmh0bWw1fX07dmFyIGRlY29kZVJlZ0V4cHM9X19hc3NpZ24oX19hc3NpZ24oe30sYmFzZURlY29kZVJlZ0V4cHMpLHthbGw6YmFzZURlY29kZVJlZ0V4cHMuaHRtbDV9KTt2YXIgZnJvbUNoYXJDb2RlPVN0cmluZy5mcm9tQ2hhckNvZGU7dmFyIG91dE9mQm91bmRzQ2hhcj1mcm9tQ2hhckNvZGUoNjU1MzMpO3ZhciBkZWZhdWx0RGVjb2RlRW50aXR5T3B0aW9ucz17bGV2ZWw6XCJhbGxcIn07ZnVuY3Rpb24gZ2V0RGVjb2RlZEVudGl0eShlbnRpdHkscmVmZXJlbmNlcyxpc0F0dHJpYnV0ZSxpc1N0cmljdCl7dmFyIGRlY29kZVJlc3VsdD1lbnRpdHk7dmFyIGRlY29kZUVudGl0eUxhc3RDaGFyPWVudGl0eVtlbnRpdHkubGVuZ3RoLTFdO2lmKGlzQXR0cmlidXRlJiZkZWNvZGVFbnRpdHlMYXN0Q2hhcj09PVwiPVwiKXtkZWNvZGVSZXN1bHQ9ZW50aXR5fWVsc2UgaWYoaXNTdHJpY3QmJmRlY29kZUVudGl0eUxhc3RDaGFyIT09XCI7XCIpe2RlY29kZVJlc3VsdD1lbnRpdHl9ZWxzZXt2YXIgZGVjb2RlUmVzdWx0QnlSZWZlcmVuY2U9cmVmZXJlbmNlc1tlbnRpdHldO2lmKGRlY29kZVJlc3VsdEJ5UmVmZXJlbmNlKXtkZWNvZGVSZXN1bHQ9ZGVjb2RlUmVzdWx0QnlSZWZlcmVuY2V9ZWxzZSBpZihlbnRpdHlbMF09PT1cIiZcIiYmZW50aXR5WzFdPT09XCIjXCIpe3ZhciBkZWNvZGVTZWNvbmRDaGFyPWVudGl0eVsyXTt2YXIgZGVjb2RlQ29kZT1kZWNvZGVTZWNvbmRDaGFyPT1cInhcInx8ZGVjb2RlU2Vjb25kQ2hhcj09XCJYXCI/cGFyc2VJbnQoZW50aXR5LnN1YnN0cigzKSwxNik6cGFyc2VJbnQoZW50aXR5LnN1YnN0cigyKSk7ZGVjb2RlUmVzdWx0PWRlY29kZUNvZGU+PTExMTQxMTE/b3V0T2ZCb3VuZHNDaGFyOmRlY29kZUNvZGU+NjU1MzU/c3Vycm9nYXRlX3BhaXJzXzEuZnJvbUNvZGVQb2ludChkZWNvZGVDb2RlKTpmcm9tQ2hhckNvZGUobnVtZXJpY191bmljb2RlX21hcF8xLm51bWVyaWNVbmljb2RlTWFwW2RlY29kZUNvZGVdfHxkZWNvZGVDb2RlKX19cmV0dXJuIGRlY29kZVJlc3VsdH1mdW5jdGlvbiBkZWNvZGVFbnRpdHkoZW50aXR5LF9hKXt2YXIgX2I9KF9hPT09dm9pZCAwP2RlZmF1bHREZWNvZGVFbnRpdHlPcHRpb25zOl9hKS5sZXZlbCxsZXZlbD1fYj09PXZvaWQgMD9cImFsbFwiOl9iO2lmKCFlbnRpdHkpe3JldHVyblwiXCJ9cmV0dXJuIGdldERlY29kZWRFbnRpdHkoZW50aXR5LGFsbE5hbWVkUmVmZXJlbmNlc1tsZXZlbF0uZW50aXRpZXMsZmFsc2UsZmFsc2UpfWV4cG9ydHMuZGVjb2RlRW50aXR5PWRlY29kZUVudGl0eTtmdW5jdGlvbiBkZWNvZGUodGV4dCxfYSl7dmFyIF9iPV9hPT09dm9pZCAwP2RlZmF1bHREZWNvZGVPcHRpb25zOl9hLF9jPV9iLmxldmVsLGxldmVsPV9jPT09dm9pZCAwP1wiYWxsXCI6X2MsX2Q9X2Iuc2NvcGUsc2NvcGU9X2Q9PT12b2lkIDA/bGV2ZWw9PT1cInhtbFwiP1wic3RyaWN0XCI6XCJib2R5XCI6X2Q7aWYoIXRleHQpe3JldHVyblwiXCJ9dmFyIGRlY29kZVJlZ0V4cD1kZWNvZGVSZWdFeHBzW2xldmVsXVtzY29wZV07dmFyIHJlZmVyZW5jZXM9YWxsTmFtZWRSZWZlcmVuY2VzW2xldmVsXS5lbnRpdGllczt2YXIgaXNBdHRyaWJ1dGU9c2NvcGU9PT1cImF0dHJpYnV0ZVwiO3ZhciBpc1N0cmljdD1zY29wZT09PVwic3RyaWN0XCI7cmV0dXJuIHJlcGxhY2VVc2luZ1JlZ0V4cCh0ZXh0LGRlY29kZVJlZ0V4cCwoZnVuY3Rpb24oZW50aXR5KXtyZXR1cm4gZ2V0RGVjb2RlZEVudGl0eShlbnRpdHkscmVmZXJlbmNlcyxpc0F0dHJpYnV0ZSxpc1N0cmljdCl9KSl9ZXhwb3J0cy5kZWNvZGU9ZGVjb2RlO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Li9pbmRleC5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMuYm9keVJlZ0V4cHM9e3htbDovJig/OiNcXGQrfCNbeFhdW1xcZGEtZkEtRl0rfFswLTlhLXpBLVpdKyk7Py9nLGh0bWw0Oi8mbm90aW47fCYoPzpuYnNwfGlleGNsfGNlbnR8cG91bmR8Y3VycmVufHllbnxicnZiYXJ8c2VjdHx1bWx8Y29weXxvcmRmfGxhcXVvfG5vdHxzaHl8cmVnfG1hY3J8ZGVnfHBsdXNtbnxzdXAyfHN1cDN8YWN1dGV8bWljcm98cGFyYXxtaWRkb3R8Y2VkaWx8c3VwMXxvcmRtfHJhcXVvfGZyYWMxNHxmcmFjMTJ8ZnJhYzM0fGlxdWVzdHxBZ3JhdmV8QWFjdXRlfEFjaXJjfEF0aWxkZXxBdW1sfEFyaW5nfEFFbGlnfENjZWRpbHxFZ3JhdmV8RWFjdXRlfEVjaXJjfEV1bWx8SWdyYXZlfElhY3V0ZXxJY2lyY3xJdW1sfEVUSHxOdGlsZGV8T2dyYXZlfE9hY3V0ZXxPY2lyY3xPdGlsZGV8T3VtbHx0aW1lc3xPc2xhc2h8VWdyYXZlfFVhY3V0ZXxVY2lyY3xVdW1sfFlhY3V0ZXxUSE9STnxzemxpZ3xhZ3JhdmV8YWFjdXRlfGFjaXJjfGF0aWxkZXxhdW1sfGFyaW5nfGFlbGlnfGNjZWRpbHxlZ3JhdmV8ZWFjdXRlfGVjaXJjfGV1bWx8aWdyYXZlfGlhY3V0ZXxpY2lyY3xpdW1sfGV0aHxudGlsZGV8b2dyYXZlfG9hY3V0ZXxvY2lyY3xvdGlsZGV8b3VtbHxkaXZpZGV8b3NsYXNofHVncmF2ZXx1YWN1dGV8dWNpcmN8dXVtbHx5YWN1dGV8dGhvcm58eXVtbHxxdW90fGFtcHxsdHxndHwjXFxkK3wjW3hYXVtcXGRhLWZBLUZdK3xbMC05YS16QS1aXSspOz8vZyxodG1sNTovJmNlbnRlcmRvdDt8JmNvcHlzcjt8JmRpdmlkZW9udGltZXM7fCZndGNjO3wmZ3RjaXI7fCZndGRvdDt8Jmd0bFBhcjt8Jmd0cXVlc3Q7fCZndHJhcHByb3g7fCZndHJhcnI7fCZndHJkb3Q7fCZndHJlcWxlc3M7fCZndHJlcXFsZXNzO3wmZ3RybGVzczt8Jmd0cnNpbTt8Jmx0Y2M7fCZsdGNpcjt8Jmx0ZG90O3wmbHRocmVlO3wmbHRpbWVzO3wmbHRsYXJyO3wmbHRxdWVzdDt8Jmx0clBhcjt8Jmx0cmk7fCZsdHJpZTt8Jmx0cmlmO3wmbm90aW47fCZub3RpbkU7fCZub3RpbmRvdDt8Jm5vdGludmE7fCZub3RpbnZiO3wmbm90aW52Yzt8Jm5vdG5pO3wmbm90bml2YTt8Jm5vdG5pdmI7fCZub3RuaXZjO3wmcGFyYWxsZWw7fCZ0aW1lc2I7fCZ0aW1lc2Jhcjt8JnRpbWVzZDt8Jig/OkFFbGlnfEFNUHxBYWN1dGV8QWNpcmN8QWdyYXZlfEFyaW5nfEF0aWxkZXxBdW1sfENPUFl8Q2NlZGlsfEVUSHxFYWN1dGV8RWNpcmN8RWdyYXZlfEV1bWx8R1R8SWFjdXRlfEljaXJjfElncmF2ZXxJdW1sfExUfE50aWxkZXxPYWN1dGV8T2NpcmN8T2dyYXZlfE9zbGFzaHxPdGlsZGV8T3VtbHxRVU9UfFJFR3xUSE9STnxVYWN1dGV8VWNpcmN8VWdyYXZlfFV1bWx8WWFjdXRlfGFhY3V0ZXxhY2lyY3xhY3V0ZXxhZWxpZ3xhZ3JhdmV8YW1wfGFyaW5nfGF0aWxkZXxhdW1sfGJydmJhcnxjY2VkaWx8Y2VkaWx8Y2VudHxjb3B5fGN1cnJlbnxkZWd8ZGl2aWRlfGVhY3V0ZXxlY2lyY3xlZ3JhdmV8ZXRofGV1bWx8ZnJhYzEyfGZyYWMxNHxmcmFjMzR8Z3R8aWFjdXRlfGljaXJjfGlleGNsfGlncmF2ZXxpcXVlc3R8aXVtbHxsYXF1b3xsdHxtYWNyfG1pY3JvfG1pZGRvdHxuYnNwfG5vdHxudGlsZGV8b2FjdXRlfG9jaXJjfG9ncmF2ZXxvcmRmfG9yZG18b3NsYXNofG90aWxkZXxvdW1sfHBhcmF8cGx1c21ufHBvdW5kfHF1b3R8cmFxdW98cmVnfHNlY3R8c2h5fHN1cDF8c3VwMnxzdXAzfHN6bGlnfHRob3JufHRpbWVzfHVhY3V0ZXx1Y2lyY3x1Z3JhdmV8dW1sfHV1bWx8eWFjdXRlfHllbnx5dW1sfCNcXGQrfCNbeFhdW1xcZGEtZkEtRl0rfFswLTlhLXpBLVpdKyk7Py9nfTtleHBvcnRzLm5hbWVkUmVmZXJlbmNlcz17eG1sOntlbnRpdGllczp7XCImbHQ7XCI6XCI8XCIsXCImZ3Q7XCI6XCI+XCIsXCImcXVvdDtcIjonXCInLFwiJmFwb3M7XCI6XCInXCIsXCImYW1wO1wiOlwiJlwifSxjaGFyYWN0ZXJzOntcIjxcIjpcIiZsdDtcIixcIj5cIjpcIiZndDtcIiwnXCInOlwiJnF1b3Q7XCIsXCInXCI6XCImYXBvcztcIixcIiZcIjpcIiZhbXA7XCJ9fSxodG1sNDp7ZW50aXRpZXM6e1wiJmFwb3M7XCI6XCInXCIsXCImbmJzcFwiOlwiwqBcIixcIiZuYnNwO1wiOlwiwqBcIixcIiZpZXhjbFwiOlwiwqFcIixcIiZpZXhjbDtcIjpcIsKhXCIsXCImY2VudFwiOlwiwqJcIixcIiZjZW50O1wiOlwiwqJcIixcIiZwb3VuZFwiOlwiwqNcIixcIiZwb3VuZDtcIjpcIsKjXCIsXCImY3VycmVuXCI6XCLCpFwiLFwiJmN1cnJlbjtcIjpcIsKkXCIsXCImeWVuXCI6XCLCpVwiLFwiJnllbjtcIjpcIsKlXCIsXCImYnJ2YmFyXCI6XCLCplwiLFwiJmJydmJhcjtcIjpcIsKmXCIsXCImc2VjdFwiOlwiwqdcIixcIiZzZWN0O1wiOlwiwqdcIixcIiZ1bWxcIjpcIsKoXCIsXCImdW1sO1wiOlwiwqhcIixcIiZjb3B5XCI6XCLCqVwiLFwiJmNvcHk7XCI6XCLCqVwiLFwiJm9yZGZcIjpcIsKqXCIsXCImb3JkZjtcIjpcIsKqXCIsXCImbGFxdW9cIjpcIsKrXCIsXCImbGFxdW87XCI6XCLCq1wiLFwiJm5vdFwiOlwiwqxcIixcIiZub3Q7XCI6XCLCrFwiLFwiJnNoeVwiOlwiwq1cIixcIiZzaHk7XCI6XCLCrVwiLFwiJnJlZ1wiOlwiwq5cIixcIiZyZWc7XCI6XCLCrlwiLFwiJm1hY3JcIjpcIsKvXCIsXCImbWFjcjtcIjpcIsKvXCIsXCImZGVnXCI6XCLCsFwiLFwiJmRlZztcIjpcIsKwXCIsXCImcGx1c21uXCI6XCLCsVwiLFwiJnBsdXNtbjtcIjpcIsKxXCIsXCImc3VwMlwiOlwiwrJcIixcIiZzdXAyO1wiOlwiwrJcIixcIiZzdXAzXCI6XCLCs1wiLFwiJnN1cDM7XCI6XCLCs1wiLFwiJmFjdXRlXCI6XCLCtFwiLFwiJmFjdXRlO1wiOlwiwrRcIixcIiZtaWNyb1wiOlwiwrVcIixcIiZtaWNybztcIjpcIsK1XCIsXCImcGFyYVwiOlwiwrZcIixcIiZwYXJhO1wiOlwiwrZcIixcIiZtaWRkb3RcIjpcIsK3XCIsXCImbWlkZG90O1wiOlwiwrdcIixcIiZjZWRpbFwiOlwiwrhcIixcIiZjZWRpbDtcIjpcIsK4XCIsXCImc3VwMVwiOlwiwrlcIixcIiZzdXAxO1wiOlwiwrlcIixcIiZvcmRtXCI6XCLCulwiLFwiJm9yZG07XCI6XCLCulwiLFwiJnJhcXVvXCI6XCLCu1wiLFwiJnJhcXVvO1wiOlwiwrtcIixcIiZmcmFjMTRcIjpcIsK8XCIsXCImZnJhYzE0O1wiOlwiwrxcIixcIiZmcmFjMTJcIjpcIsK9XCIsXCImZnJhYzEyO1wiOlwiwr1cIixcIiZmcmFjMzRcIjpcIsK+XCIsXCImZnJhYzM0O1wiOlwiwr5cIixcIiZpcXVlc3RcIjpcIsK/XCIsXCImaXF1ZXN0O1wiOlwiwr9cIixcIiZBZ3JhdmVcIjpcIsOAXCIsXCImQWdyYXZlO1wiOlwiw4BcIixcIiZBYWN1dGVcIjpcIsOBXCIsXCImQWFjdXRlO1wiOlwiw4FcIixcIiZBY2lyY1wiOlwiw4JcIixcIiZBY2lyYztcIjpcIsOCXCIsXCImQXRpbGRlXCI6XCLDg1wiLFwiJkF0aWxkZTtcIjpcIsODXCIsXCImQXVtbFwiOlwiw4RcIixcIiZBdW1sO1wiOlwiw4RcIixcIiZBcmluZ1wiOlwiw4VcIixcIiZBcmluZztcIjpcIsOFXCIsXCImQUVsaWdcIjpcIsOGXCIsXCImQUVsaWc7XCI6XCLDhlwiLFwiJkNjZWRpbFwiOlwiw4dcIixcIiZDY2VkaWw7XCI6XCLDh1wiLFwiJkVncmF2ZVwiOlwiw4hcIixcIiZFZ3JhdmU7XCI6XCLDiFwiLFwiJkVhY3V0ZVwiOlwiw4lcIixcIiZFYWN1dGU7XCI6XCLDiVwiLFwiJkVjaXJjXCI6XCLDilwiLFwiJkVjaXJjO1wiOlwiw4pcIixcIiZFdW1sXCI6XCLDi1wiLFwiJkV1bWw7XCI6XCLDi1wiLFwiJklncmF2ZVwiOlwiw4xcIixcIiZJZ3JhdmU7XCI6XCLDjFwiLFwiJklhY3V0ZVwiOlwiw41cIixcIiZJYWN1dGU7XCI6XCLDjVwiLFwiJkljaXJjXCI6XCLDjlwiLFwiJkljaXJjO1wiOlwiw45cIixcIiZJdW1sXCI6XCLDj1wiLFwiJkl1bWw7XCI6XCLDj1wiLFwiJkVUSFwiOlwiw5BcIixcIiZFVEg7XCI6XCLDkFwiLFwiJk50aWxkZVwiOlwiw5FcIixcIiZOdGlsZGU7XCI6XCLDkVwiLFwiJk9ncmF2ZVwiOlwiw5JcIixcIiZPZ3JhdmU7XCI6XCLDklwiLFwiJk9hY3V0ZVwiOlwiw5NcIixcIiZPYWN1dGU7XCI6XCLDk1wiLFwiJk9jaXJjXCI6XCLDlFwiLFwiJk9jaXJjO1wiOlwiw5RcIixcIiZPdGlsZGVcIjpcIsOVXCIsXCImT3RpbGRlO1wiOlwiw5VcIixcIiZPdW1sXCI6XCLDllwiLFwiJk91bWw7XCI6XCLDllwiLFwiJnRpbWVzXCI6XCLDl1wiLFwiJnRpbWVzO1wiOlwiw5dcIixcIiZPc2xhc2hcIjpcIsOYXCIsXCImT3NsYXNoO1wiOlwiw5hcIixcIiZVZ3JhdmVcIjpcIsOZXCIsXCImVWdyYXZlO1wiOlwiw5lcIixcIiZVYWN1dGVcIjpcIsOaXCIsXCImVWFjdXRlO1wiOlwiw5pcIixcIiZVY2lyY1wiOlwiw5tcIixcIiZVY2lyYztcIjpcIsObXCIsXCImVXVtbFwiOlwiw5xcIixcIiZVdW1sO1wiOlwiw5xcIixcIiZZYWN1dGVcIjpcIsOdXCIsXCImWWFjdXRlO1wiOlwiw51cIixcIiZUSE9STlwiOlwiw55cIixcIiZUSE9STjtcIjpcIsOeXCIsXCImc3psaWdcIjpcIsOfXCIsXCImc3psaWc7XCI6XCLDn1wiLFwiJmFncmF2ZVwiOlwiw6BcIixcIiZhZ3JhdmU7XCI6XCLDoFwiLFwiJmFhY3V0ZVwiOlwiw6FcIixcIiZhYWN1dGU7XCI6XCLDoVwiLFwiJmFjaXJjXCI6XCLDolwiLFwiJmFjaXJjO1wiOlwiw6JcIixcIiZhdGlsZGVcIjpcIsOjXCIsXCImYXRpbGRlO1wiOlwiw6NcIixcIiZhdW1sXCI6XCLDpFwiLFwiJmF1bWw7XCI6XCLDpFwiLFwiJmFyaW5nXCI6XCLDpVwiLFwiJmFyaW5nO1wiOlwiw6VcIixcIiZhZWxpZ1wiOlwiw6ZcIixcIiZhZWxpZztcIjpcIsOmXCIsXCImY2NlZGlsXCI6XCLDp1wiLFwiJmNjZWRpbDtcIjpcIsOnXCIsXCImZWdyYXZlXCI6XCLDqFwiLFwiJmVncmF2ZTtcIjpcIsOoXCIsXCImZWFjdXRlXCI6XCLDqVwiLFwiJmVhY3V0ZTtcIjpcIsOpXCIsXCImZWNpcmNcIjpcIsOqXCIsXCImZWNpcmM7XCI6XCLDqlwiLFwiJmV1bWxcIjpcIsOrXCIsXCImZXVtbDtcIjpcIsOrXCIsXCImaWdyYXZlXCI6XCLDrFwiLFwiJmlncmF2ZTtcIjpcIsOsXCIsXCImaWFjdXRlXCI6XCLDrVwiLFwiJmlhY3V0ZTtcIjpcIsOtXCIsXCImaWNpcmNcIjpcIsOuXCIsXCImaWNpcmM7XCI6XCLDrlwiLFwiJml1bWxcIjpcIsOvXCIsXCImaXVtbDtcIjpcIsOvXCIsXCImZXRoXCI6XCLDsFwiLFwiJmV0aDtcIjpcIsOwXCIsXCImbnRpbGRlXCI6XCLDsVwiLFwiJm50aWxkZTtcIjpcIsOxXCIsXCImb2dyYXZlXCI6XCLDslwiLFwiJm9ncmF2ZTtcIjpcIsOyXCIsXCImb2FjdXRlXCI6XCLDs1wiLFwiJm9hY3V0ZTtcIjpcIsOzXCIsXCImb2NpcmNcIjpcIsO0XCIsXCImb2NpcmM7XCI6XCLDtFwiLFwiJm90aWxkZVwiOlwiw7VcIixcIiZvdGlsZGU7XCI6XCLDtVwiLFwiJm91bWxcIjpcIsO2XCIsXCImb3VtbDtcIjpcIsO2XCIsXCImZGl2aWRlXCI6XCLDt1wiLFwiJmRpdmlkZTtcIjpcIsO3XCIsXCImb3NsYXNoXCI6XCLDuFwiLFwiJm9zbGFzaDtcIjpcIsO4XCIsXCImdWdyYXZlXCI6XCLDuVwiLFwiJnVncmF2ZTtcIjpcIsO5XCIsXCImdWFjdXRlXCI6XCLDulwiLFwiJnVhY3V0ZTtcIjpcIsO6XCIsXCImdWNpcmNcIjpcIsO7XCIsXCImdWNpcmM7XCI6XCLDu1wiLFwiJnV1bWxcIjpcIsO8XCIsXCImdXVtbDtcIjpcIsO8XCIsXCImeWFjdXRlXCI6XCLDvVwiLFwiJnlhY3V0ZTtcIjpcIsO9XCIsXCImdGhvcm5cIjpcIsO+XCIsXCImdGhvcm47XCI6XCLDvlwiLFwiJnl1bWxcIjpcIsO/XCIsXCImeXVtbDtcIjpcIsO/XCIsXCImcXVvdFwiOidcIicsXCImcXVvdDtcIjonXCInLFwiJmFtcFwiOlwiJlwiLFwiJmFtcDtcIjpcIiZcIixcIiZsdFwiOlwiPFwiLFwiJmx0O1wiOlwiPFwiLFwiJmd0XCI6XCI+XCIsXCImZ3Q7XCI6XCI+XCIsXCImT0VsaWc7XCI6XCLFklwiLFwiJm9lbGlnO1wiOlwixZNcIixcIiZTY2Fyb247XCI6XCLFoFwiLFwiJnNjYXJvbjtcIjpcIsWhXCIsXCImWXVtbDtcIjpcIsW4XCIsXCImY2lyYztcIjpcIsuGXCIsXCImdGlsZGU7XCI6XCLLnFwiLFwiJmVuc3A7XCI6XCLigIJcIixcIiZlbXNwO1wiOlwi4oCDXCIsXCImdGhpbnNwO1wiOlwi4oCJXCIsXCImenduajtcIjpcIuKAjFwiLFwiJnp3ajtcIjpcIuKAjVwiLFwiJmxybTtcIjpcIuKAjlwiLFwiJnJsbTtcIjpcIuKAj1wiLFwiJm5kYXNoO1wiOlwi4oCTXCIsXCImbWRhc2g7XCI6XCLigJRcIixcIiZsc3F1bztcIjpcIuKAmFwiLFwiJnJzcXVvO1wiOlwi4oCZXCIsXCImc2JxdW87XCI6XCLigJpcIixcIiZsZHF1bztcIjpcIuKAnFwiLFwiJnJkcXVvO1wiOlwi4oCdXCIsXCImYmRxdW87XCI6XCLigJ5cIixcIiZkYWdnZXI7XCI6XCLigKBcIixcIiZEYWdnZXI7XCI6XCLigKFcIixcIiZwZXJtaWw7XCI6XCLigLBcIixcIiZsc2FxdW87XCI6XCLigLlcIixcIiZyc2FxdW87XCI6XCLigLpcIixcIiZldXJvO1wiOlwi4oKsXCIsXCImZm5vZjtcIjpcIsaSXCIsXCImQWxwaGE7XCI6XCLOkVwiLFwiJkJldGE7XCI6XCLOklwiLFwiJkdhbW1hO1wiOlwizpNcIixcIiZEZWx0YTtcIjpcIs6UXCIsXCImRXBzaWxvbjtcIjpcIs6VXCIsXCImWmV0YTtcIjpcIs6WXCIsXCImRXRhO1wiOlwizpdcIixcIiZUaGV0YTtcIjpcIs6YXCIsXCImSW90YTtcIjpcIs6ZXCIsXCImS2FwcGE7XCI6XCLOmlwiLFwiJkxhbWJkYTtcIjpcIs6bXCIsXCImTXU7XCI6XCLOnFwiLFwiJk51O1wiOlwizp1cIixcIiZYaTtcIjpcIs6eXCIsXCImT21pY3JvbjtcIjpcIs6fXCIsXCImUGk7XCI6XCLOoFwiLFwiJlJobztcIjpcIs6hXCIsXCImU2lnbWE7XCI6XCLOo1wiLFwiJlRhdTtcIjpcIs6kXCIsXCImVXBzaWxvbjtcIjpcIs6lXCIsXCImUGhpO1wiOlwizqZcIixcIiZDaGk7XCI6XCLOp1wiLFwiJlBzaTtcIjpcIs6oXCIsXCImT21lZ2E7XCI6XCLOqVwiLFwiJmFscGhhO1wiOlwizrFcIixcIiZiZXRhO1wiOlwizrJcIixcIiZnYW1tYTtcIjpcIs6zXCIsXCImZGVsdGE7XCI6XCLOtFwiLFwiJmVwc2lsb247XCI6XCLOtVwiLFwiJnpldGE7XCI6XCLOtlwiLFwiJmV0YTtcIjpcIs63XCIsXCImdGhldGE7XCI6XCLOuFwiLFwiJmlvdGE7XCI6XCLOuVwiLFwiJmthcHBhO1wiOlwizrpcIixcIiZsYW1iZGE7XCI6XCLOu1wiLFwiJm11O1wiOlwizrxcIixcIiZudTtcIjpcIs69XCIsXCImeGk7XCI6XCLOvlwiLFwiJm9taWNyb247XCI6XCLOv1wiLFwiJnBpO1wiOlwiz4BcIixcIiZyaG87XCI6XCLPgVwiLFwiJnNpZ21hZjtcIjpcIs+CXCIsXCImc2lnbWE7XCI6XCLPg1wiLFwiJnRhdTtcIjpcIs+EXCIsXCImdXBzaWxvbjtcIjpcIs+FXCIsXCImcGhpO1wiOlwiz4ZcIixcIiZjaGk7XCI6XCLPh1wiLFwiJnBzaTtcIjpcIs+IXCIsXCImb21lZ2E7XCI6XCLPiVwiLFwiJnRoZXRhc3ltO1wiOlwiz5FcIixcIiZ1cHNpaDtcIjpcIs+SXCIsXCImcGl2O1wiOlwiz5ZcIixcIiZidWxsO1wiOlwi4oCiXCIsXCImaGVsbGlwO1wiOlwi4oCmXCIsXCImcHJpbWU7XCI6XCLigLJcIixcIiZQcmltZTtcIjpcIuKAs1wiLFwiJm9saW5lO1wiOlwi4oC+XCIsXCImZnJhc2w7XCI6XCLigYRcIixcIiZ3ZWllcnA7XCI6XCLihJhcIixcIiZpbWFnZTtcIjpcIuKEkVwiLFwiJnJlYWw7XCI6XCLihJxcIixcIiZ0cmFkZTtcIjpcIuKEolwiLFwiJmFsZWZzeW07XCI6XCLihLVcIixcIiZsYXJyO1wiOlwi4oaQXCIsXCImdWFycjtcIjpcIuKGkVwiLFwiJnJhcnI7XCI6XCLihpJcIixcIiZkYXJyO1wiOlwi4oaTXCIsXCImaGFycjtcIjpcIuKGlFwiLFwiJmNyYXJyO1wiOlwi4oa1XCIsXCImbEFycjtcIjpcIuKHkFwiLFwiJnVBcnI7XCI6XCLih5FcIixcIiZyQXJyO1wiOlwi4oeSXCIsXCImZEFycjtcIjpcIuKHk1wiLFwiJmhBcnI7XCI6XCLih5RcIixcIiZmb3JhbGw7XCI6XCLiiIBcIixcIiZwYXJ0O1wiOlwi4oiCXCIsXCImZXhpc3Q7XCI6XCLiiINcIixcIiZlbXB0eTtcIjpcIuKIhVwiLFwiJm5hYmxhO1wiOlwi4oiHXCIsXCImaXNpbjtcIjpcIuKIiFwiLFwiJm5vdGluO1wiOlwi4oiJXCIsXCImbmk7XCI6XCLiiItcIixcIiZwcm9kO1wiOlwi4oiPXCIsXCImc3VtO1wiOlwi4oiRXCIsXCImbWludXM7XCI6XCLiiJJcIixcIiZsb3dhc3Q7XCI6XCLiiJdcIixcIiZyYWRpYztcIjpcIuKImlwiLFwiJnByb3A7XCI6XCLiiJ1cIixcIiZpbmZpbjtcIjpcIuKInlwiLFwiJmFuZztcIjpcIuKIoFwiLFwiJmFuZDtcIjpcIuKIp1wiLFwiJm9yO1wiOlwi4oioXCIsXCImY2FwO1wiOlwi4oipXCIsXCImY3VwO1wiOlwi4oiqXCIsXCImaW50O1wiOlwi4oirXCIsXCImdGhlcmU0O1wiOlwi4oi0XCIsXCImc2ltO1wiOlwi4oi8XCIsXCImY29uZztcIjpcIuKJhVwiLFwiJmFzeW1wO1wiOlwi4omIXCIsXCImbmU7XCI6XCLiiaBcIixcIiZlcXVpdjtcIjpcIuKJoVwiLFwiJmxlO1wiOlwi4omkXCIsXCImZ2U7XCI6XCLiiaVcIixcIiZzdWI7XCI6XCLiioJcIixcIiZzdXA7XCI6XCLiioNcIixcIiZuc3ViO1wiOlwi4oqEXCIsXCImc3ViZTtcIjpcIuKKhlwiLFwiJnN1cGU7XCI6XCLiiodcIixcIiZvcGx1cztcIjpcIuKKlVwiLFwiJm90aW1lcztcIjpcIuKKl1wiLFwiJnBlcnA7XCI6XCLiiqVcIixcIiZzZG90O1wiOlwi4ouFXCIsXCImbGNlaWw7XCI6XCLijIhcIixcIiZyY2VpbDtcIjpcIuKMiVwiLFwiJmxmbG9vcjtcIjpcIuKMilwiLFwiJnJmbG9vcjtcIjpcIuKMi1wiLFwiJmxhbmc7XCI6XCLijKlcIixcIiZyYW5nO1wiOlwi4oyqXCIsXCImbG96O1wiOlwi4peKXCIsXCImc3BhZGVzO1wiOlwi4pmgXCIsXCImY2x1YnM7XCI6XCLimaNcIixcIiZoZWFydHM7XCI6XCLimaVcIixcIiZkaWFtcztcIjpcIuKZplwifSxjaGFyYWN0ZXJzOntcIidcIjpcIiZhcG9zO1wiLFwiwqBcIjpcIiZuYnNwO1wiLFwiwqFcIjpcIiZpZXhjbDtcIixcIsKiXCI6XCImY2VudDtcIixcIsKjXCI6XCImcG91bmQ7XCIsXCLCpFwiOlwiJmN1cnJlbjtcIixcIsKlXCI6XCImeWVuO1wiLFwiwqZcIjpcIiZicnZiYXI7XCIsXCLCp1wiOlwiJnNlY3Q7XCIsXCLCqFwiOlwiJnVtbDtcIixcIsKpXCI6XCImY29weTtcIixcIsKqXCI6XCImb3JkZjtcIixcIsKrXCI6XCImbGFxdW87XCIsXCLCrFwiOlwiJm5vdDtcIixcIsKtXCI6XCImc2h5O1wiLFwiwq5cIjpcIiZyZWc7XCIsXCLCr1wiOlwiJm1hY3I7XCIsXCLCsFwiOlwiJmRlZztcIixcIsKxXCI6XCImcGx1c21uO1wiLFwiwrJcIjpcIiZzdXAyO1wiLFwiwrNcIjpcIiZzdXAzO1wiLFwiwrRcIjpcIiZhY3V0ZTtcIixcIsK1XCI6XCImbWljcm87XCIsXCLCtlwiOlwiJnBhcmE7XCIsXCLCt1wiOlwiJm1pZGRvdDtcIixcIsK4XCI6XCImY2VkaWw7XCIsXCLCuVwiOlwiJnN1cDE7XCIsXCLCulwiOlwiJm9yZG07XCIsXCLCu1wiOlwiJnJhcXVvO1wiLFwiwrxcIjpcIiZmcmFjMTQ7XCIsXCLCvVwiOlwiJmZyYWMxMjtcIixcIsK+XCI6XCImZnJhYzM0O1wiLFwiwr9cIjpcIiZpcXVlc3Q7XCIsXCLDgFwiOlwiJkFncmF2ZTtcIixcIsOBXCI6XCImQWFjdXRlO1wiLFwiw4JcIjpcIiZBY2lyYztcIixcIsODXCI6XCImQXRpbGRlO1wiLFwiw4RcIjpcIiZBdW1sO1wiLFwiw4VcIjpcIiZBcmluZztcIixcIsOGXCI6XCImQUVsaWc7XCIsXCLDh1wiOlwiJkNjZWRpbDtcIixcIsOIXCI6XCImRWdyYXZlO1wiLFwiw4lcIjpcIiZFYWN1dGU7XCIsXCLDilwiOlwiJkVjaXJjO1wiLFwiw4tcIjpcIiZFdW1sO1wiLFwiw4xcIjpcIiZJZ3JhdmU7XCIsXCLDjVwiOlwiJklhY3V0ZTtcIixcIsOOXCI6XCImSWNpcmM7XCIsXCLDj1wiOlwiJkl1bWw7XCIsXCLDkFwiOlwiJkVUSDtcIixcIsORXCI6XCImTnRpbGRlO1wiLFwiw5JcIjpcIiZPZ3JhdmU7XCIsXCLDk1wiOlwiJk9hY3V0ZTtcIixcIsOUXCI6XCImT2NpcmM7XCIsXCLDlVwiOlwiJk90aWxkZTtcIixcIsOWXCI6XCImT3VtbDtcIixcIsOXXCI6XCImdGltZXM7XCIsXCLDmFwiOlwiJk9zbGFzaDtcIixcIsOZXCI6XCImVWdyYXZlO1wiLFwiw5pcIjpcIiZVYWN1dGU7XCIsXCLDm1wiOlwiJlVjaXJjO1wiLFwiw5xcIjpcIiZVdW1sO1wiLFwiw51cIjpcIiZZYWN1dGU7XCIsXCLDnlwiOlwiJlRIT1JOO1wiLFwiw59cIjpcIiZzemxpZztcIixcIsOgXCI6XCImYWdyYXZlO1wiLFwiw6FcIjpcIiZhYWN1dGU7XCIsXCLDolwiOlwiJmFjaXJjO1wiLFwiw6NcIjpcIiZhdGlsZGU7XCIsXCLDpFwiOlwiJmF1bWw7XCIsXCLDpVwiOlwiJmFyaW5nO1wiLFwiw6ZcIjpcIiZhZWxpZztcIixcIsOnXCI6XCImY2NlZGlsO1wiLFwiw6hcIjpcIiZlZ3JhdmU7XCIsXCLDqVwiOlwiJmVhY3V0ZTtcIixcIsOqXCI6XCImZWNpcmM7XCIsXCLDq1wiOlwiJmV1bWw7XCIsXCLDrFwiOlwiJmlncmF2ZTtcIixcIsOtXCI6XCImaWFjdXRlO1wiLFwiw65cIjpcIiZpY2lyYztcIixcIsOvXCI6XCImaXVtbDtcIixcIsOwXCI6XCImZXRoO1wiLFwiw7FcIjpcIiZudGlsZGU7XCIsXCLDslwiOlwiJm9ncmF2ZTtcIixcIsOzXCI6XCImb2FjdXRlO1wiLFwiw7RcIjpcIiZvY2lyYztcIixcIsO1XCI6XCImb3RpbGRlO1wiLFwiw7ZcIjpcIiZvdW1sO1wiLFwiw7dcIjpcIiZkaXZpZGU7XCIsXCLDuFwiOlwiJm9zbGFzaDtcIixcIsO5XCI6XCImdWdyYXZlO1wiLFwiw7pcIjpcIiZ1YWN1dGU7XCIsXCLDu1wiOlwiJnVjaXJjO1wiLFwiw7xcIjpcIiZ1dW1sO1wiLFwiw71cIjpcIiZ5YWN1dGU7XCIsXCLDvlwiOlwiJnRob3JuO1wiLFwiw79cIjpcIiZ5dW1sO1wiLCdcIic6XCImcXVvdDtcIixcIiZcIjpcIiZhbXA7XCIsXCI8XCI6XCImbHQ7XCIsXCI+XCI6XCImZ3Q7XCIsXCLFklwiOlwiJk9FbGlnO1wiLFwixZNcIjpcIiZvZWxpZztcIixcIsWgXCI6XCImU2Nhcm9uO1wiLFwixaFcIjpcIiZzY2Fyb247XCIsXCLFuFwiOlwiJll1bWw7XCIsXCLLhlwiOlwiJmNpcmM7XCIsXCLLnFwiOlwiJnRpbGRlO1wiLFwi4oCCXCI6XCImZW5zcDtcIixcIuKAg1wiOlwiJmVtc3A7XCIsXCLigIlcIjpcIiZ0aGluc3A7XCIsXCLigIxcIjpcIiZ6d25qO1wiLFwi4oCNXCI6XCImendqO1wiLFwi4oCOXCI6XCImbHJtO1wiLFwi4oCPXCI6XCImcmxtO1wiLFwi4oCTXCI6XCImbmRhc2g7XCIsXCLigJRcIjpcIiZtZGFzaDtcIixcIuKAmFwiOlwiJmxzcXVvO1wiLFwi4oCZXCI6XCImcnNxdW87XCIsXCLigJpcIjpcIiZzYnF1bztcIixcIuKAnFwiOlwiJmxkcXVvO1wiLFwi4oCdXCI6XCImcmRxdW87XCIsXCLigJ5cIjpcIiZiZHF1bztcIixcIuKAoFwiOlwiJmRhZ2dlcjtcIixcIuKAoVwiOlwiJkRhZ2dlcjtcIixcIuKAsFwiOlwiJnBlcm1pbDtcIixcIuKAuVwiOlwiJmxzYXF1bztcIixcIuKAulwiOlwiJnJzYXF1bztcIixcIuKCrFwiOlwiJmV1cm87XCIsXCLGklwiOlwiJmZub2Y7XCIsXCLOkVwiOlwiJkFscGhhO1wiLFwizpJcIjpcIiZCZXRhO1wiLFwizpNcIjpcIiZHYW1tYTtcIixcIs6UXCI6XCImRGVsdGE7XCIsXCLOlVwiOlwiJkVwc2lsb247XCIsXCLOllwiOlwiJlpldGE7XCIsXCLOl1wiOlwiJkV0YTtcIixcIs6YXCI6XCImVGhldGE7XCIsXCLOmVwiOlwiJklvdGE7XCIsXCLOmlwiOlwiJkthcHBhO1wiLFwizptcIjpcIiZMYW1iZGE7XCIsXCLOnFwiOlwiJk11O1wiLFwizp1cIjpcIiZOdTtcIixcIs6eXCI6XCImWGk7XCIsXCLOn1wiOlwiJk9taWNyb247XCIsXCLOoFwiOlwiJlBpO1wiLFwizqFcIjpcIiZSaG87XCIsXCLOo1wiOlwiJlNpZ21hO1wiLFwizqRcIjpcIiZUYXU7XCIsXCLOpVwiOlwiJlVwc2lsb247XCIsXCLOplwiOlwiJlBoaTtcIixcIs6nXCI6XCImQ2hpO1wiLFwizqhcIjpcIiZQc2k7XCIsXCLOqVwiOlwiJk9tZWdhO1wiLFwizrFcIjpcIiZhbHBoYTtcIixcIs6yXCI6XCImYmV0YTtcIixcIs6zXCI6XCImZ2FtbWE7XCIsXCLOtFwiOlwiJmRlbHRhO1wiLFwizrVcIjpcIiZlcHNpbG9uO1wiLFwizrZcIjpcIiZ6ZXRhO1wiLFwizrdcIjpcIiZldGE7XCIsXCLOuFwiOlwiJnRoZXRhO1wiLFwizrlcIjpcIiZpb3RhO1wiLFwizrpcIjpcIiZrYXBwYTtcIixcIs67XCI6XCImbGFtYmRhO1wiLFwizrxcIjpcIiZtdTtcIixcIs69XCI6XCImbnU7XCIsXCLOvlwiOlwiJnhpO1wiLFwizr9cIjpcIiZvbWljcm9uO1wiLFwiz4BcIjpcIiZwaTtcIixcIs+BXCI6XCImcmhvO1wiLFwiz4JcIjpcIiZzaWdtYWY7XCIsXCLPg1wiOlwiJnNpZ21hO1wiLFwiz4RcIjpcIiZ0YXU7XCIsXCLPhVwiOlwiJnVwc2lsb247XCIsXCLPhlwiOlwiJnBoaTtcIixcIs+HXCI6XCImY2hpO1wiLFwiz4hcIjpcIiZwc2k7XCIsXCLPiVwiOlwiJm9tZWdhO1wiLFwiz5FcIjpcIiZ0aGV0YXN5bTtcIixcIs+SXCI6XCImdXBzaWg7XCIsXCLPllwiOlwiJnBpdjtcIixcIuKAolwiOlwiJmJ1bGw7XCIsXCLigKZcIjpcIiZoZWxsaXA7XCIsXCLigLJcIjpcIiZwcmltZTtcIixcIuKAs1wiOlwiJlByaW1lO1wiLFwi4oC+XCI6XCImb2xpbmU7XCIsXCLigYRcIjpcIiZmcmFzbDtcIixcIuKEmFwiOlwiJndlaWVycDtcIixcIuKEkVwiOlwiJmltYWdlO1wiLFwi4oScXCI6XCImcmVhbDtcIixcIuKEolwiOlwiJnRyYWRlO1wiLFwi4oS1XCI6XCImYWxlZnN5bTtcIixcIuKGkFwiOlwiJmxhcnI7XCIsXCLihpFcIjpcIiZ1YXJyO1wiLFwi4oaSXCI6XCImcmFycjtcIixcIuKGk1wiOlwiJmRhcnI7XCIsXCLihpRcIjpcIiZoYXJyO1wiLFwi4oa1XCI6XCImY3JhcnI7XCIsXCLih5BcIjpcIiZsQXJyO1wiLFwi4oeRXCI6XCImdUFycjtcIixcIuKHklwiOlwiJnJBcnI7XCIsXCLih5NcIjpcIiZkQXJyO1wiLFwi4oeUXCI6XCImaEFycjtcIixcIuKIgFwiOlwiJmZvcmFsbDtcIixcIuKIglwiOlwiJnBhcnQ7XCIsXCLiiINcIjpcIiZleGlzdDtcIixcIuKIhVwiOlwiJmVtcHR5O1wiLFwi4oiHXCI6XCImbmFibGE7XCIsXCLiiIhcIjpcIiZpc2luO1wiLFwi4oiJXCI6XCImbm90aW47XCIsXCLiiItcIjpcIiZuaTtcIixcIuKIj1wiOlwiJnByb2Q7XCIsXCLiiJFcIjpcIiZzdW07XCIsXCLiiJJcIjpcIiZtaW51cztcIixcIuKIl1wiOlwiJmxvd2FzdDtcIixcIuKImlwiOlwiJnJhZGljO1wiLFwi4oidXCI6XCImcHJvcDtcIixcIuKInlwiOlwiJmluZmluO1wiLFwi4oigXCI6XCImYW5nO1wiLFwi4oinXCI6XCImYW5kO1wiLFwi4oioXCI6XCImb3I7XCIsXCLiiKlcIjpcIiZjYXA7XCIsXCLiiKpcIjpcIiZjdXA7XCIsXCLiiKtcIjpcIiZpbnQ7XCIsXCLiiLRcIjpcIiZ0aGVyZTQ7XCIsXCLiiLxcIjpcIiZzaW07XCIsXCLiiYVcIjpcIiZjb25nO1wiLFwi4omIXCI6XCImYXN5bXA7XCIsXCLiiaBcIjpcIiZuZTtcIixcIuKJoVwiOlwiJmVxdWl2O1wiLFwi4omkXCI6XCImbGU7XCIsXCLiiaVcIjpcIiZnZTtcIixcIuKKglwiOlwiJnN1YjtcIixcIuKKg1wiOlwiJnN1cDtcIixcIuKKhFwiOlwiJm5zdWI7XCIsXCLiioZcIjpcIiZzdWJlO1wiLFwi4oqHXCI6XCImc3VwZTtcIixcIuKKlVwiOlwiJm9wbHVzO1wiLFwi4oqXXCI6XCImb3RpbWVzO1wiLFwi4oqlXCI6XCImcGVycDtcIixcIuKLhVwiOlwiJnNkb3Q7XCIsXCLijIhcIjpcIiZsY2VpbDtcIixcIuKMiVwiOlwiJnJjZWlsO1wiLFwi4oyKXCI6XCImbGZsb29yO1wiLFwi4oyLXCI6XCImcmZsb29yO1wiLFwi4oypXCI6XCImbGFuZztcIixcIuKMqlwiOlwiJnJhbmc7XCIsXCLil4pcIjpcIiZsb3o7XCIsXCLimaBcIjpcIiZzcGFkZXM7XCIsXCLimaNcIjpcIiZjbHVicztcIixcIuKZpVwiOlwiJmhlYXJ0cztcIixcIuKZplwiOlwiJmRpYW1zO1wifX0saHRtbDU6e2VudGl0aWVzOntcIiZBRWxpZ1wiOlwiw4ZcIixcIiZBRWxpZztcIjpcIsOGXCIsXCImQU1QXCI6XCImXCIsXCImQU1QO1wiOlwiJlwiLFwiJkFhY3V0ZVwiOlwiw4FcIixcIiZBYWN1dGU7XCI6XCLDgVwiLFwiJkFicmV2ZTtcIjpcIsSCXCIsXCImQWNpcmNcIjpcIsOCXCIsXCImQWNpcmM7XCI6XCLDglwiLFwiJkFjeTtcIjpcItCQXCIsXCImQWZyO1wiOlwi8J2UhFwiLFwiJkFncmF2ZVwiOlwiw4BcIixcIiZBZ3JhdmU7XCI6XCLDgFwiLFwiJkFscGhhO1wiOlwizpFcIixcIiZBbWFjcjtcIjpcIsSAXCIsXCImQW5kO1wiOlwi4qmTXCIsXCImQW9nb247XCI6XCLEhFwiLFwiJkFvcGY7XCI6XCLwnZS4XCIsXCImQXBwbHlGdW5jdGlvbjtcIjpcIuKBoVwiLFwiJkFyaW5nXCI6XCLDhVwiLFwiJkFyaW5nO1wiOlwiw4VcIixcIiZBc2NyO1wiOlwi8J2SnFwiLFwiJkFzc2lnbjtcIjpcIuKJlFwiLFwiJkF0aWxkZVwiOlwiw4NcIixcIiZBdGlsZGU7XCI6XCLDg1wiLFwiJkF1bWxcIjpcIsOEXCIsXCImQXVtbDtcIjpcIsOEXCIsXCImQmFja3NsYXNoO1wiOlwi4oiWXCIsXCImQmFydjtcIjpcIuKrp1wiLFwiJkJhcndlZDtcIjpcIuKMhlwiLFwiJkJjeTtcIjpcItCRXCIsXCImQmVjYXVzZTtcIjpcIuKItVwiLFwiJkJlcm5vdWxsaXM7XCI6XCLihKxcIixcIiZCZXRhO1wiOlwizpJcIixcIiZCZnI7XCI6XCLwnZSFXCIsXCImQm9wZjtcIjpcIvCdlLlcIixcIiZCcmV2ZTtcIjpcIsuYXCIsXCImQnNjcjtcIjpcIuKErFwiLFwiJkJ1bXBlcTtcIjpcIuKJjlwiLFwiJkNIY3k7XCI6XCLQp1wiLFwiJkNPUFlcIjpcIsKpXCIsXCImQ09QWTtcIjpcIsKpXCIsXCImQ2FjdXRlO1wiOlwixIZcIixcIiZDYXA7XCI6XCLii5JcIixcIiZDYXBpdGFsRGlmZmVyZW50aWFsRDtcIjpcIuKFhVwiLFwiJkNheWxleXM7XCI6XCLihK1cIixcIiZDY2Fyb247XCI6XCLEjFwiLFwiJkNjZWRpbFwiOlwiw4dcIixcIiZDY2VkaWw7XCI6XCLDh1wiLFwiJkNjaXJjO1wiOlwixIhcIixcIiZDY29uaW50O1wiOlwi4oiwXCIsXCImQ2RvdDtcIjpcIsSKXCIsXCImQ2VkaWxsYTtcIjpcIsK4XCIsXCImQ2VudGVyRG90O1wiOlwiwrdcIixcIiZDZnI7XCI6XCLihK1cIixcIiZDaGk7XCI6XCLOp1wiLFwiJkNpcmNsZURvdDtcIjpcIuKKmVwiLFwiJkNpcmNsZU1pbnVzO1wiOlwi4oqWXCIsXCImQ2lyY2xlUGx1cztcIjpcIuKKlVwiLFwiJkNpcmNsZVRpbWVzO1wiOlwi4oqXXCIsXCImQ2xvY2t3aXNlQ29udG91ckludGVncmFsO1wiOlwi4oiyXCIsXCImQ2xvc2VDdXJseURvdWJsZVF1b3RlO1wiOlwi4oCdXCIsXCImQ2xvc2VDdXJseVF1b3RlO1wiOlwi4oCZXCIsXCImQ29sb247XCI6XCLiiLdcIixcIiZDb2xvbmU7XCI6XCLiqbRcIixcIiZDb25ncnVlbnQ7XCI6XCLiiaFcIixcIiZDb25pbnQ7XCI6XCLiiK9cIixcIiZDb250b3VySW50ZWdyYWw7XCI6XCLiiK5cIixcIiZDb3BmO1wiOlwi4oSCXCIsXCImQ29wcm9kdWN0O1wiOlwi4oiQXCIsXCImQ291bnRlckNsb2Nrd2lzZUNvbnRvdXJJbnRlZ3JhbDtcIjpcIuKIs1wiLFwiJkNyb3NzO1wiOlwi4qivXCIsXCImQ3NjcjtcIjpcIvCdkp5cIixcIiZDdXA7XCI6XCLii5NcIixcIiZDdXBDYXA7XCI6XCLiiY1cIixcIiZERDtcIjpcIuKFhVwiLFwiJkREb3RyYWhkO1wiOlwi4qSRXCIsXCImREpjeTtcIjpcItCCXCIsXCImRFNjeTtcIjpcItCFXCIsXCImRFpjeTtcIjpcItCPXCIsXCImRGFnZ2VyO1wiOlwi4oChXCIsXCImRGFycjtcIjpcIuKGoVwiLFwiJkRhc2h2O1wiOlwi4qukXCIsXCImRGNhcm9uO1wiOlwixI5cIixcIiZEY3k7XCI6XCLQlFwiLFwiJkRlbDtcIjpcIuKIh1wiLFwiJkRlbHRhO1wiOlwizpRcIixcIiZEZnI7XCI6XCLwnZSHXCIsXCImRGlhY3JpdGljYWxBY3V0ZTtcIjpcIsK0XCIsXCImRGlhY3JpdGljYWxEb3Q7XCI6XCLLmVwiLFwiJkRpYWNyaXRpY2FsRG91YmxlQWN1dGU7XCI6XCLLnVwiLFwiJkRpYWNyaXRpY2FsR3JhdmU7XCI6XCJgXCIsXCImRGlhY3JpdGljYWxUaWxkZTtcIjpcIsucXCIsXCImRGlhbW9uZDtcIjpcIuKLhFwiLFwiJkRpZmZlcmVudGlhbEQ7XCI6XCLihYZcIixcIiZEb3BmO1wiOlwi8J2Uu1wiLFwiJkRvdDtcIjpcIsKoXCIsXCImRG90RG90O1wiOlwi4oOcXCIsXCImRG90RXF1YWw7XCI6XCLiiZBcIixcIiZEb3VibGVDb250b3VySW50ZWdyYWw7XCI6XCLiiK9cIixcIiZEb3VibGVEb3Q7XCI6XCLCqFwiLFwiJkRvdWJsZURvd25BcnJvdztcIjpcIuKHk1wiLFwiJkRvdWJsZUxlZnRBcnJvdztcIjpcIuKHkFwiLFwiJkRvdWJsZUxlZnRSaWdodEFycm93O1wiOlwi4oeUXCIsXCImRG91YmxlTGVmdFRlZTtcIjpcIuKrpFwiLFwiJkRvdWJsZUxvbmdMZWZ0QXJyb3c7XCI6XCLin7hcIixcIiZEb3VibGVMb25nTGVmdFJpZ2h0QXJyb3c7XCI6XCLin7pcIixcIiZEb3VibGVMb25nUmlnaHRBcnJvdztcIjpcIuKfuVwiLFwiJkRvdWJsZVJpZ2h0QXJyb3c7XCI6XCLih5JcIixcIiZEb3VibGVSaWdodFRlZTtcIjpcIuKKqFwiLFwiJkRvdWJsZVVwQXJyb3c7XCI6XCLih5FcIixcIiZEb3VibGVVcERvd25BcnJvdztcIjpcIuKHlVwiLFwiJkRvdWJsZVZlcnRpY2FsQmFyO1wiOlwi4oilXCIsXCImRG93bkFycm93O1wiOlwi4oaTXCIsXCImRG93bkFycm93QmFyO1wiOlwi4qSTXCIsXCImRG93bkFycm93VXBBcnJvdztcIjpcIuKHtVwiLFwiJkRvd25CcmV2ZTtcIjpcIsyRXCIsXCImRG93bkxlZnRSaWdodFZlY3RvcjtcIjpcIuKlkFwiLFwiJkRvd25MZWZ0VGVlVmVjdG9yO1wiOlwi4qWeXCIsXCImRG93bkxlZnRWZWN0b3I7XCI6XCLihr1cIixcIiZEb3duTGVmdFZlY3RvckJhcjtcIjpcIuKlllwiLFwiJkRvd25SaWdodFRlZVZlY3RvcjtcIjpcIuKln1wiLFwiJkRvd25SaWdodFZlY3RvcjtcIjpcIuKHgVwiLFwiJkRvd25SaWdodFZlY3RvckJhcjtcIjpcIuKll1wiLFwiJkRvd25UZWU7XCI6XCLiiqRcIixcIiZEb3duVGVlQXJyb3c7XCI6XCLihqdcIixcIiZEb3duYXJyb3c7XCI6XCLih5NcIixcIiZEc2NyO1wiOlwi8J2Sn1wiLFwiJkRzdHJvaztcIjpcIsSQXCIsXCImRU5HO1wiOlwixYpcIixcIiZFVEhcIjpcIsOQXCIsXCImRVRIO1wiOlwiw5BcIixcIiZFYWN1dGVcIjpcIsOJXCIsXCImRWFjdXRlO1wiOlwiw4lcIixcIiZFY2Fyb247XCI6XCLEmlwiLFwiJkVjaXJjXCI6XCLDilwiLFwiJkVjaXJjO1wiOlwiw4pcIixcIiZFY3k7XCI6XCLQrVwiLFwiJkVkb3Q7XCI6XCLEllwiLFwiJkVmcjtcIjpcIvCdlIhcIixcIiZFZ3JhdmVcIjpcIsOIXCIsXCImRWdyYXZlO1wiOlwiw4hcIixcIiZFbGVtZW50O1wiOlwi4oiIXCIsXCImRW1hY3I7XCI6XCLEklwiLFwiJkVtcHR5U21hbGxTcXVhcmU7XCI6XCLil7tcIixcIiZFbXB0eVZlcnlTbWFsbFNxdWFyZTtcIjpcIuKWq1wiLFwiJkVvZ29uO1wiOlwixJhcIixcIiZFb3BmO1wiOlwi8J2UvFwiLFwiJkVwc2lsb247XCI6XCLOlVwiLFwiJkVxdWFsO1wiOlwi4qm1XCIsXCImRXF1YWxUaWxkZTtcIjpcIuKJglwiLFwiJkVxdWlsaWJyaXVtO1wiOlwi4oeMXCIsXCImRXNjcjtcIjpcIuKEsFwiLFwiJkVzaW07XCI6XCLiqbNcIixcIiZFdGE7XCI6XCLOl1wiLFwiJkV1bWxcIjpcIsOLXCIsXCImRXVtbDtcIjpcIsOLXCIsXCImRXhpc3RzO1wiOlwi4oiDXCIsXCImRXhwb25lbnRpYWxFO1wiOlwi4oWHXCIsXCImRmN5O1wiOlwi0KRcIixcIiZGZnI7XCI6XCLwnZSJXCIsXCImRmlsbGVkU21hbGxTcXVhcmU7XCI6XCLil7xcIixcIiZGaWxsZWRWZXJ5U21hbGxTcXVhcmU7XCI6XCLilqpcIixcIiZGb3BmO1wiOlwi8J2UvVwiLFwiJkZvckFsbDtcIjpcIuKIgFwiLFwiJkZvdXJpZXJ0cmY7XCI6XCLihLFcIixcIiZGc2NyO1wiOlwi4oSxXCIsXCImR0pjeTtcIjpcItCDXCIsXCImR1RcIjpcIj5cIixcIiZHVDtcIjpcIj5cIixcIiZHYW1tYTtcIjpcIs6TXCIsXCImR2FtbWFkO1wiOlwiz5xcIixcIiZHYnJldmU7XCI6XCLEnlwiLFwiJkdjZWRpbDtcIjpcIsSiXCIsXCImR2NpcmM7XCI6XCLEnFwiLFwiJkdjeTtcIjpcItCTXCIsXCImR2RvdDtcIjpcIsSgXCIsXCImR2ZyO1wiOlwi8J2UilwiLFwiJkdnO1wiOlwi4ouZXCIsXCImR29wZjtcIjpcIvCdlL5cIixcIiZHcmVhdGVyRXF1YWw7XCI6XCLiiaVcIixcIiZHcmVhdGVyRXF1YWxMZXNzO1wiOlwi4oubXCIsXCImR3JlYXRlckZ1bGxFcXVhbDtcIjpcIuKJp1wiLFwiJkdyZWF0ZXJHcmVhdGVyO1wiOlwi4qqiXCIsXCImR3JlYXRlckxlc3M7XCI6XCLiibdcIixcIiZHcmVhdGVyU2xhbnRFcXVhbDtcIjpcIuKpvlwiLFwiJkdyZWF0ZXJUaWxkZTtcIjpcIuKJs1wiLFwiJkdzY3I7XCI6XCLwnZKiXCIsXCImR3Q7XCI6XCLiiatcIixcIiZIQVJEY3k7XCI6XCLQqlwiLFwiJkhhY2VrO1wiOlwiy4dcIixcIiZIYXQ7XCI6XCJeXCIsXCImSGNpcmM7XCI6XCLEpFwiLFwiJkhmcjtcIjpcIuKEjFwiLFwiJkhpbGJlcnRTcGFjZTtcIjpcIuKEi1wiLFwiJkhvcGY7XCI6XCLihI1cIixcIiZIb3Jpem9udGFsTGluZTtcIjpcIuKUgFwiLFwiJkhzY3I7XCI6XCLihItcIixcIiZIc3Ryb2s7XCI6XCLEplwiLFwiJkh1bXBEb3duSHVtcDtcIjpcIuKJjlwiLFwiJkh1bXBFcXVhbDtcIjpcIuKJj1wiLFwiJklFY3k7XCI6XCLQlVwiLFwiJklKbGlnO1wiOlwixLJcIixcIiZJT2N5O1wiOlwi0IFcIixcIiZJYWN1dGVcIjpcIsONXCIsXCImSWFjdXRlO1wiOlwiw41cIixcIiZJY2lyY1wiOlwiw45cIixcIiZJY2lyYztcIjpcIsOOXCIsXCImSWN5O1wiOlwi0JhcIixcIiZJZG90O1wiOlwixLBcIixcIiZJZnI7XCI6XCLihJFcIixcIiZJZ3JhdmVcIjpcIsOMXCIsXCImSWdyYXZlO1wiOlwiw4xcIixcIiZJbTtcIjpcIuKEkVwiLFwiJkltYWNyO1wiOlwixKpcIixcIiZJbWFnaW5hcnlJO1wiOlwi4oWIXCIsXCImSW1wbGllcztcIjpcIuKHklwiLFwiJkludDtcIjpcIuKIrFwiLFwiJkludGVncmFsO1wiOlwi4oirXCIsXCImSW50ZXJzZWN0aW9uO1wiOlwi4ouCXCIsXCImSW52aXNpYmxlQ29tbWE7XCI6XCLigaNcIixcIiZJbnZpc2libGVUaW1lcztcIjpcIuKBolwiLFwiJklvZ29uO1wiOlwixK5cIixcIiZJb3BmO1wiOlwi8J2VgFwiLFwiJklvdGE7XCI6XCLOmVwiLFwiJklzY3I7XCI6XCLihJBcIixcIiZJdGlsZGU7XCI6XCLEqFwiLFwiJkl1a2N5O1wiOlwi0IZcIixcIiZJdW1sXCI6XCLDj1wiLFwiJkl1bWw7XCI6XCLDj1wiLFwiJkpjaXJjO1wiOlwixLRcIixcIiZKY3k7XCI6XCLQmVwiLFwiJkpmcjtcIjpcIvCdlI1cIixcIiZKb3BmO1wiOlwi8J2VgVwiLFwiJkpzY3I7XCI6XCLwnZKlXCIsXCImSnNlcmN5O1wiOlwi0IhcIixcIiZKdWtjeTtcIjpcItCEXCIsXCImS0hjeTtcIjpcItClXCIsXCImS0pjeTtcIjpcItCMXCIsXCImS2FwcGE7XCI6XCLOmlwiLFwiJktjZWRpbDtcIjpcIsS2XCIsXCImS2N5O1wiOlwi0JpcIixcIiZLZnI7XCI6XCLwnZSOXCIsXCImS29wZjtcIjpcIvCdlYJcIixcIiZLc2NyO1wiOlwi8J2SplwiLFwiJkxKY3k7XCI6XCLQiVwiLFwiJkxUXCI6XCI8XCIsXCImTFQ7XCI6XCI8XCIsXCImTGFjdXRlO1wiOlwixLlcIixcIiZMYW1iZGE7XCI6XCLOm1wiLFwiJkxhbmc7XCI6XCLin6pcIixcIiZMYXBsYWNldHJmO1wiOlwi4oSSXCIsXCImTGFycjtcIjpcIuKGnlwiLFwiJkxjYXJvbjtcIjpcIsS9XCIsXCImTGNlZGlsO1wiOlwixLtcIixcIiZMY3k7XCI6XCLQm1wiLFwiJkxlZnRBbmdsZUJyYWNrZXQ7XCI6XCLin6hcIixcIiZMZWZ0QXJyb3c7XCI6XCLihpBcIixcIiZMZWZ0QXJyb3dCYXI7XCI6XCLih6RcIixcIiZMZWZ0QXJyb3dSaWdodEFycm93O1wiOlwi4oeGXCIsXCImTGVmdENlaWxpbmc7XCI6XCLijIhcIixcIiZMZWZ0RG91YmxlQnJhY2tldDtcIjpcIuKfplwiLFwiJkxlZnREb3duVGVlVmVjdG9yO1wiOlwi4qWhXCIsXCImTGVmdERvd25WZWN0b3I7XCI6XCLih4NcIixcIiZMZWZ0RG93blZlY3RvckJhcjtcIjpcIuKlmVwiLFwiJkxlZnRGbG9vcjtcIjpcIuKMilwiLFwiJkxlZnRSaWdodEFycm93O1wiOlwi4oaUXCIsXCImTGVmdFJpZ2h0VmVjdG9yO1wiOlwi4qWOXCIsXCImTGVmdFRlZTtcIjpcIuKKo1wiLFwiJkxlZnRUZWVBcnJvdztcIjpcIuKGpFwiLFwiJkxlZnRUZWVWZWN0b3I7XCI6XCLipZpcIixcIiZMZWZ0VHJpYW5nbGU7XCI6XCLiirJcIixcIiZMZWZ0VHJpYW5nbGVCYXI7XCI6XCLip49cIixcIiZMZWZ0VHJpYW5nbGVFcXVhbDtcIjpcIuKKtFwiLFwiJkxlZnRVcERvd25WZWN0b3I7XCI6XCLipZFcIixcIiZMZWZ0VXBUZWVWZWN0b3I7XCI6XCLipaBcIixcIiZMZWZ0VXBWZWN0b3I7XCI6XCLihr9cIixcIiZMZWZ0VXBWZWN0b3JCYXI7XCI6XCLipZhcIixcIiZMZWZ0VmVjdG9yO1wiOlwi4oa8XCIsXCImTGVmdFZlY3RvckJhcjtcIjpcIuKlklwiLFwiJkxlZnRhcnJvdztcIjpcIuKHkFwiLFwiJkxlZnRyaWdodGFycm93O1wiOlwi4oeUXCIsXCImTGVzc0VxdWFsR3JlYXRlcjtcIjpcIuKLmlwiLFwiJkxlc3NGdWxsRXF1YWw7XCI6XCLiiaZcIixcIiZMZXNzR3JlYXRlcjtcIjpcIuKJtlwiLFwiJkxlc3NMZXNzO1wiOlwi4qqhXCIsXCImTGVzc1NsYW50RXF1YWw7XCI6XCLiqb1cIixcIiZMZXNzVGlsZGU7XCI6XCLiibJcIixcIiZMZnI7XCI6XCLwnZSPXCIsXCImTGw7XCI6XCLii5hcIixcIiZMbGVmdGFycm93O1wiOlwi4oeaXCIsXCImTG1pZG90O1wiOlwixL9cIixcIiZMb25nTGVmdEFycm93O1wiOlwi4p+1XCIsXCImTG9uZ0xlZnRSaWdodEFycm93O1wiOlwi4p+3XCIsXCImTG9uZ1JpZ2h0QXJyb3c7XCI6XCLin7ZcIixcIiZMb25nbGVmdGFycm93O1wiOlwi4p+4XCIsXCImTG9uZ2xlZnRyaWdodGFycm93O1wiOlwi4p+6XCIsXCImTG9uZ3JpZ2h0YXJyb3c7XCI6XCLin7lcIixcIiZMb3BmO1wiOlwi8J2Vg1wiLFwiJkxvd2VyTGVmdEFycm93O1wiOlwi4oaZXCIsXCImTG93ZXJSaWdodEFycm93O1wiOlwi4oaYXCIsXCImTHNjcjtcIjpcIuKEklwiLFwiJkxzaDtcIjpcIuKGsFwiLFwiJkxzdHJvaztcIjpcIsWBXCIsXCImTHQ7XCI6XCLiiapcIixcIiZNYXA7XCI6XCLipIVcIixcIiZNY3k7XCI6XCLQnFwiLFwiJk1lZGl1bVNwYWNlO1wiOlwi4oGfXCIsXCImTWVsbGludHJmO1wiOlwi4oSzXCIsXCImTWZyO1wiOlwi8J2UkFwiLFwiJk1pbnVzUGx1cztcIjpcIuKIk1wiLFwiJk1vcGY7XCI6XCLwnZWEXCIsXCImTXNjcjtcIjpcIuKEs1wiLFwiJk11O1wiOlwizpxcIixcIiZOSmN5O1wiOlwi0IpcIixcIiZOYWN1dGU7XCI6XCLFg1wiLFwiJk5jYXJvbjtcIjpcIsWHXCIsXCImTmNlZGlsO1wiOlwixYVcIixcIiZOY3k7XCI6XCLQnVwiLFwiJk5lZ2F0aXZlTWVkaXVtU3BhY2U7XCI6XCLigItcIixcIiZOZWdhdGl2ZVRoaWNrU3BhY2U7XCI6XCLigItcIixcIiZOZWdhdGl2ZVRoaW5TcGFjZTtcIjpcIuKAi1wiLFwiJk5lZ2F0aXZlVmVyeVRoaW5TcGFjZTtcIjpcIuKAi1wiLFwiJk5lc3RlZEdyZWF0ZXJHcmVhdGVyO1wiOlwi4omrXCIsXCImTmVzdGVkTGVzc0xlc3M7XCI6XCLiiapcIixcIiZOZXdMaW5lO1wiOlwiXFxuXCIsXCImTmZyO1wiOlwi8J2UkVwiLFwiJk5vQnJlYWs7XCI6XCLigaBcIixcIiZOb25CcmVha2luZ1NwYWNlO1wiOlwiwqBcIixcIiZOb3BmO1wiOlwi4oSVXCIsXCImTm90O1wiOlwi4qusXCIsXCImTm90Q29uZ3J1ZW50O1wiOlwi4omiXCIsXCImTm90Q3VwQ2FwO1wiOlwi4omtXCIsXCImTm90RG91YmxlVmVydGljYWxCYXI7XCI6XCLiiKZcIixcIiZOb3RFbGVtZW50O1wiOlwi4oiJXCIsXCImTm90RXF1YWw7XCI6XCLiiaBcIixcIiZOb3RFcXVhbFRpbGRlO1wiOlwi4omCzLhcIixcIiZOb3RFeGlzdHM7XCI6XCLiiIRcIixcIiZOb3RHcmVhdGVyO1wiOlwi4omvXCIsXCImTm90R3JlYXRlckVxdWFsO1wiOlwi4omxXCIsXCImTm90R3JlYXRlckZ1bGxFcXVhbDtcIjpcIuKJp8y4XCIsXCImTm90R3JlYXRlckdyZWF0ZXI7XCI6XCLiiavMuFwiLFwiJk5vdEdyZWF0ZXJMZXNzO1wiOlwi4om5XCIsXCImTm90R3JlYXRlclNsYW50RXF1YWw7XCI6XCLiqb7MuFwiLFwiJk5vdEdyZWF0ZXJUaWxkZTtcIjpcIuKJtVwiLFwiJk5vdEh1bXBEb3duSHVtcDtcIjpcIuKJjsy4XCIsXCImTm90SHVtcEVxdWFsO1wiOlwi4omPzLhcIixcIiZOb3RMZWZ0VHJpYW5nbGU7XCI6XCLii6pcIixcIiZOb3RMZWZ0VHJpYW5nbGVCYXI7XCI6XCLip4/MuFwiLFwiJk5vdExlZnRUcmlhbmdsZUVxdWFsO1wiOlwi4ousXCIsXCImTm90TGVzcztcIjpcIuKJrlwiLFwiJk5vdExlc3NFcXVhbDtcIjpcIuKJsFwiLFwiJk5vdExlc3NHcmVhdGVyO1wiOlwi4om4XCIsXCImTm90TGVzc0xlc3M7XCI6XCLiiarMuFwiLFwiJk5vdExlc3NTbGFudEVxdWFsO1wiOlwi4qm9zLhcIixcIiZOb3RMZXNzVGlsZGU7XCI6XCLiibRcIixcIiZOb3ROZXN0ZWRHcmVhdGVyR3JlYXRlcjtcIjpcIuKqosy4XCIsXCImTm90TmVzdGVkTGVzc0xlc3M7XCI6XCLiqqHMuFwiLFwiJk5vdFByZWNlZGVzO1wiOlwi4oqAXCIsXCImTm90UHJlY2VkZXNFcXVhbDtcIjpcIuKqr8y4XCIsXCImTm90UHJlY2VkZXNTbGFudEVxdWFsO1wiOlwi4ougXCIsXCImTm90UmV2ZXJzZUVsZW1lbnQ7XCI6XCLiiIxcIixcIiZOb3RSaWdodFRyaWFuZ2xlO1wiOlwi4ourXCIsXCImTm90UmlnaHRUcmlhbmdsZUJhcjtcIjpcIuKnkMy4XCIsXCImTm90UmlnaHRUcmlhbmdsZUVxdWFsO1wiOlwi4outXCIsXCImTm90U3F1YXJlU3Vic2V0O1wiOlwi4oqPzLhcIixcIiZOb3RTcXVhcmVTdWJzZXRFcXVhbDtcIjpcIuKLolwiLFwiJk5vdFNxdWFyZVN1cGVyc2V0O1wiOlwi4oqQzLhcIixcIiZOb3RTcXVhcmVTdXBlcnNldEVxdWFsO1wiOlwi4oujXCIsXCImTm90U3Vic2V0O1wiOlwi4oqC4oOSXCIsXCImTm90U3Vic2V0RXF1YWw7XCI6XCLiiohcIixcIiZOb3RTdWNjZWVkcztcIjpcIuKKgVwiLFwiJk5vdFN1Y2NlZWRzRXF1YWw7XCI6XCLiqrDMuFwiLFwiJk5vdFN1Y2NlZWRzU2xhbnRFcXVhbDtcIjpcIuKLoVwiLFwiJk5vdFN1Y2NlZWRzVGlsZGU7XCI6XCLiib/MuFwiLFwiJk5vdFN1cGVyc2V0O1wiOlwi4oqD4oOSXCIsXCImTm90U3VwZXJzZXRFcXVhbDtcIjpcIuKKiVwiLFwiJk5vdFRpbGRlO1wiOlwi4omBXCIsXCImTm90VGlsZGVFcXVhbDtcIjpcIuKJhFwiLFwiJk5vdFRpbGRlRnVsbEVxdWFsO1wiOlwi4omHXCIsXCImTm90VGlsZGVUaWxkZTtcIjpcIuKJiVwiLFwiJk5vdFZlcnRpY2FsQmFyO1wiOlwi4oikXCIsXCImTnNjcjtcIjpcIvCdkqlcIixcIiZOdGlsZGVcIjpcIsORXCIsXCImTnRpbGRlO1wiOlwiw5FcIixcIiZOdTtcIjpcIs6dXCIsXCImT0VsaWc7XCI6XCLFklwiLFwiJk9hY3V0ZVwiOlwiw5NcIixcIiZPYWN1dGU7XCI6XCLDk1wiLFwiJk9jaXJjXCI6XCLDlFwiLFwiJk9jaXJjO1wiOlwiw5RcIixcIiZPY3k7XCI6XCLQnlwiLFwiJk9kYmxhYztcIjpcIsWQXCIsXCImT2ZyO1wiOlwi8J2UklwiLFwiJk9ncmF2ZVwiOlwiw5JcIixcIiZPZ3JhdmU7XCI6XCLDklwiLFwiJk9tYWNyO1wiOlwixYxcIixcIiZPbWVnYTtcIjpcIs6pXCIsXCImT21pY3JvbjtcIjpcIs6fXCIsXCImT29wZjtcIjpcIvCdlYZcIixcIiZPcGVuQ3VybHlEb3VibGVRdW90ZTtcIjpcIuKAnFwiLFwiJk9wZW5DdXJseVF1b3RlO1wiOlwi4oCYXCIsXCImT3I7XCI6XCLiqZRcIixcIiZPc2NyO1wiOlwi8J2SqlwiLFwiJk9zbGFzaFwiOlwiw5hcIixcIiZPc2xhc2g7XCI6XCLDmFwiLFwiJk90aWxkZVwiOlwiw5VcIixcIiZPdGlsZGU7XCI6XCLDlVwiLFwiJk90aW1lcztcIjpcIuKot1wiLFwiJk91bWxcIjpcIsOWXCIsXCImT3VtbDtcIjpcIsOWXCIsXCImT3ZlckJhcjtcIjpcIuKAvlwiLFwiJk92ZXJCcmFjZTtcIjpcIuKPnlwiLFwiJk92ZXJCcmFja2V0O1wiOlwi4o60XCIsXCImT3ZlclBhcmVudGhlc2lzO1wiOlwi4o+cXCIsXCImUGFydGlhbEQ7XCI6XCLiiIJcIixcIiZQY3k7XCI6XCLQn1wiLFwiJlBmcjtcIjpcIvCdlJNcIixcIiZQaGk7XCI6XCLOplwiLFwiJlBpO1wiOlwizqBcIixcIiZQbHVzTWludXM7XCI6XCLCsVwiLFwiJlBvaW5jYXJlcGxhbmU7XCI6XCLihIxcIixcIiZQb3BmO1wiOlwi4oSZXCIsXCImUHI7XCI6XCLiqrtcIixcIiZQcmVjZWRlcztcIjpcIuKJulwiLFwiJlByZWNlZGVzRXF1YWw7XCI6XCLiqq9cIixcIiZQcmVjZWRlc1NsYW50RXF1YWw7XCI6XCLiibxcIixcIiZQcmVjZWRlc1RpbGRlO1wiOlwi4om+XCIsXCImUHJpbWU7XCI6XCLigLNcIixcIiZQcm9kdWN0O1wiOlwi4oiPXCIsXCImUHJvcG9ydGlvbjtcIjpcIuKIt1wiLFwiJlByb3BvcnRpb25hbDtcIjpcIuKInVwiLFwiJlBzY3I7XCI6XCLwnZKrXCIsXCImUHNpO1wiOlwizqhcIixcIiZRVU9UXCI6J1wiJyxcIiZRVU9UO1wiOidcIicsXCImUWZyO1wiOlwi8J2UlFwiLFwiJlFvcGY7XCI6XCLihJpcIixcIiZRc2NyO1wiOlwi8J2SrFwiLFwiJlJCYXJyO1wiOlwi4qSQXCIsXCImUkVHXCI6XCLCrlwiLFwiJlJFRztcIjpcIsKuXCIsXCImUmFjdXRlO1wiOlwixZRcIixcIiZSYW5nO1wiOlwi4p+rXCIsXCImUmFycjtcIjpcIuKGoFwiLFwiJlJhcnJ0bDtcIjpcIuKkllwiLFwiJlJjYXJvbjtcIjpcIsWYXCIsXCImUmNlZGlsO1wiOlwixZZcIixcIiZSY3k7XCI6XCLQoFwiLFwiJlJlO1wiOlwi4oScXCIsXCImUmV2ZXJzZUVsZW1lbnQ7XCI6XCLiiItcIixcIiZSZXZlcnNlRXF1aWxpYnJpdW07XCI6XCLih4tcIixcIiZSZXZlcnNlVXBFcXVpbGlicml1bTtcIjpcIuKlr1wiLFwiJlJmcjtcIjpcIuKEnFwiLFwiJlJobztcIjpcIs6hXCIsXCImUmlnaHRBbmdsZUJyYWNrZXQ7XCI6XCLin6lcIixcIiZSaWdodEFycm93O1wiOlwi4oaSXCIsXCImUmlnaHRBcnJvd0JhcjtcIjpcIuKHpVwiLFwiJlJpZ2h0QXJyb3dMZWZ0QXJyb3c7XCI6XCLih4RcIixcIiZSaWdodENlaWxpbmc7XCI6XCLijIlcIixcIiZSaWdodERvdWJsZUJyYWNrZXQ7XCI6XCLin6dcIixcIiZSaWdodERvd25UZWVWZWN0b3I7XCI6XCLipZ1cIixcIiZSaWdodERvd25WZWN0b3I7XCI6XCLih4JcIixcIiZSaWdodERvd25WZWN0b3JCYXI7XCI6XCLipZVcIixcIiZSaWdodEZsb29yO1wiOlwi4oyLXCIsXCImUmlnaHRUZWU7XCI6XCLiiqJcIixcIiZSaWdodFRlZUFycm93O1wiOlwi4oamXCIsXCImUmlnaHRUZWVWZWN0b3I7XCI6XCLipZtcIixcIiZSaWdodFRyaWFuZ2xlO1wiOlwi4oqzXCIsXCImUmlnaHRUcmlhbmdsZUJhcjtcIjpcIuKnkFwiLFwiJlJpZ2h0VHJpYW5nbGVFcXVhbDtcIjpcIuKKtVwiLFwiJlJpZ2h0VXBEb3duVmVjdG9yO1wiOlwi4qWPXCIsXCImUmlnaHRVcFRlZVZlY3RvcjtcIjpcIuKlnFwiLFwiJlJpZ2h0VXBWZWN0b3I7XCI6XCLihr5cIixcIiZSaWdodFVwVmVjdG9yQmFyO1wiOlwi4qWUXCIsXCImUmlnaHRWZWN0b3I7XCI6XCLih4BcIixcIiZSaWdodFZlY3RvckJhcjtcIjpcIuKlk1wiLFwiJlJpZ2h0YXJyb3c7XCI6XCLih5JcIixcIiZSb3BmO1wiOlwi4oSdXCIsXCImUm91bmRJbXBsaWVzO1wiOlwi4qWwXCIsXCImUnJpZ2h0YXJyb3c7XCI6XCLih5tcIixcIiZSc2NyO1wiOlwi4oSbXCIsXCImUnNoO1wiOlwi4oaxXCIsXCImUnVsZURlbGF5ZWQ7XCI6XCLip7RcIixcIiZTSENIY3k7XCI6XCLQqVwiLFwiJlNIY3k7XCI6XCLQqFwiLFwiJlNPRlRjeTtcIjpcItCsXCIsXCImU2FjdXRlO1wiOlwixZpcIixcIiZTYztcIjpcIuKqvFwiLFwiJlNjYXJvbjtcIjpcIsWgXCIsXCImU2NlZGlsO1wiOlwixZ5cIixcIiZTY2lyYztcIjpcIsWcXCIsXCImU2N5O1wiOlwi0KFcIixcIiZTZnI7XCI6XCLwnZSWXCIsXCImU2hvcnREb3duQXJyb3c7XCI6XCLihpNcIixcIiZTaG9ydExlZnRBcnJvdztcIjpcIuKGkFwiLFwiJlNob3J0UmlnaHRBcnJvdztcIjpcIuKGklwiLFwiJlNob3J0VXBBcnJvdztcIjpcIuKGkVwiLFwiJlNpZ21hO1wiOlwizqNcIixcIiZTbWFsbENpcmNsZTtcIjpcIuKImFwiLFwiJlNvcGY7XCI6XCLwnZWKXCIsXCImU3FydDtcIjpcIuKImlwiLFwiJlNxdWFyZTtcIjpcIuKWoVwiLFwiJlNxdWFyZUludGVyc2VjdGlvbjtcIjpcIuKKk1wiLFwiJlNxdWFyZVN1YnNldDtcIjpcIuKKj1wiLFwiJlNxdWFyZVN1YnNldEVxdWFsO1wiOlwi4oqRXCIsXCImU3F1YXJlU3VwZXJzZXQ7XCI6XCLiipBcIixcIiZTcXVhcmVTdXBlcnNldEVxdWFsO1wiOlwi4oqSXCIsXCImU3F1YXJlVW5pb247XCI6XCLiipRcIixcIiZTc2NyO1wiOlwi8J2SrlwiLFwiJlN0YXI7XCI6XCLii4ZcIixcIiZTdWI7XCI6XCLii5BcIixcIiZTdWJzZXQ7XCI6XCLii5BcIixcIiZTdWJzZXRFcXVhbDtcIjpcIuKKhlwiLFwiJlN1Y2NlZWRzO1wiOlwi4om7XCIsXCImU3VjY2VlZHNFcXVhbDtcIjpcIuKqsFwiLFwiJlN1Y2NlZWRzU2xhbnRFcXVhbDtcIjpcIuKJvVwiLFwiJlN1Y2NlZWRzVGlsZGU7XCI6XCLiib9cIixcIiZTdWNoVGhhdDtcIjpcIuKIi1wiLFwiJlN1bTtcIjpcIuKIkVwiLFwiJlN1cDtcIjpcIuKLkVwiLFwiJlN1cGVyc2V0O1wiOlwi4oqDXCIsXCImU3VwZXJzZXRFcXVhbDtcIjpcIuKKh1wiLFwiJlN1cHNldDtcIjpcIuKLkVwiLFwiJlRIT1JOXCI6XCLDnlwiLFwiJlRIT1JOO1wiOlwiw55cIixcIiZUUkFERTtcIjpcIuKEolwiLFwiJlRTSGN5O1wiOlwi0ItcIixcIiZUU2N5O1wiOlwi0KZcIixcIiZUYWI7XCI6XCJcXHRcIixcIiZUYXU7XCI6XCLOpFwiLFwiJlRjYXJvbjtcIjpcIsWkXCIsXCImVGNlZGlsO1wiOlwixaJcIixcIiZUY3k7XCI6XCLQolwiLFwiJlRmcjtcIjpcIvCdlJdcIixcIiZUaGVyZWZvcmU7XCI6XCLiiLRcIixcIiZUaGV0YTtcIjpcIs6YXCIsXCImVGhpY2tTcGFjZTtcIjpcIuKBn+KAilwiLFwiJlRoaW5TcGFjZTtcIjpcIuKAiVwiLFwiJlRpbGRlO1wiOlwi4oi8XCIsXCImVGlsZGVFcXVhbDtcIjpcIuKJg1wiLFwiJlRpbGRlRnVsbEVxdWFsO1wiOlwi4omFXCIsXCImVGlsZGVUaWxkZTtcIjpcIuKJiFwiLFwiJlRvcGY7XCI6XCLwnZWLXCIsXCImVHJpcGxlRG90O1wiOlwi4oObXCIsXCImVHNjcjtcIjpcIvCdkq9cIixcIiZUc3Ryb2s7XCI6XCLFplwiLFwiJlVhY3V0ZVwiOlwiw5pcIixcIiZVYWN1dGU7XCI6XCLDmlwiLFwiJlVhcnI7XCI6XCLihp9cIixcIiZVYXJyb2NpcjtcIjpcIuKliVwiLFwiJlVicmN5O1wiOlwi0I5cIixcIiZVYnJldmU7XCI6XCLFrFwiLFwiJlVjaXJjXCI6XCLDm1wiLFwiJlVjaXJjO1wiOlwiw5tcIixcIiZVY3k7XCI6XCLQo1wiLFwiJlVkYmxhYztcIjpcIsWwXCIsXCImVWZyO1wiOlwi8J2UmFwiLFwiJlVncmF2ZVwiOlwiw5lcIixcIiZVZ3JhdmU7XCI6XCLDmVwiLFwiJlVtYWNyO1wiOlwixapcIixcIiZVbmRlckJhcjtcIjpcIl9cIixcIiZVbmRlckJyYWNlO1wiOlwi4o+fXCIsXCImVW5kZXJCcmFja2V0O1wiOlwi4o61XCIsXCImVW5kZXJQYXJlbnRoZXNpcztcIjpcIuKPnVwiLFwiJlVuaW9uO1wiOlwi4ouDXCIsXCImVW5pb25QbHVzO1wiOlwi4oqOXCIsXCImVW9nb247XCI6XCLFslwiLFwiJlVvcGY7XCI6XCLwnZWMXCIsXCImVXBBcnJvdztcIjpcIuKGkVwiLFwiJlVwQXJyb3dCYXI7XCI6XCLipJJcIixcIiZVcEFycm93RG93bkFycm93O1wiOlwi4oeFXCIsXCImVXBEb3duQXJyb3c7XCI6XCLihpVcIixcIiZVcEVxdWlsaWJyaXVtO1wiOlwi4qWuXCIsXCImVXBUZWU7XCI6XCLiiqVcIixcIiZVcFRlZUFycm93O1wiOlwi4oalXCIsXCImVXBhcnJvdztcIjpcIuKHkVwiLFwiJlVwZG93bmFycm93O1wiOlwi4oeVXCIsXCImVXBwZXJMZWZ0QXJyb3c7XCI6XCLihpZcIixcIiZVcHBlclJpZ2h0QXJyb3c7XCI6XCLihpdcIixcIiZVcHNpO1wiOlwiz5JcIixcIiZVcHNpbG9uO1wiOlwizqVcIixcIiZVcmluZztcIjpcIsWuXCIsXCImVXNjcjtcIjpcIvCdkrBcIixcIiZVdGlsZGU7XCI6XCLFqFwiLFwiJlV1bWxcIjpcIsOcXCIsXCImVXVtbDtcIjpcIsOcXCIsXCImVkRhc2g7XCI6XCLiiqtcIixcIiZWYmFyO1wiOlwi4qurXCIsXCImVmN5O1wiOlwi0JJcIixcIiZWZGFzaDtcIjpcIuKKqVwiLFwiJlZkYXNobDtcIjpcIuKrplwiLFwiJlZlZTtcIjpcIuKLgVwiLFwiJlZlcmJhcjtcIjpcIuKAllwiLFwiJlZlcnQ7XCI6XCLigJZcIixcIiZWZXJ0aWNhbEJhcjtcIjpcIuKIo1wiLFwiJlZlcnRpY2FsTGluZTtcIjpcInxcIixcIiZWZXJ0aWNhbFNlcGFyYXRvcjtcIjpcIuKdmFwiLFwiJlZlcnRpY2FsVGlsZGU7XCI6XCLiiYBcIixcIiZWZXJ5VGhpblNwYWNlO1wiOlwi4oCKXCIsXCImVmZyO1wiOlwi8J2UmVwiLFwiJlZvcGY7XCI6XCLwnZWNXCIsXCImVnNjcjtcIjpcIvCdkrFcIixcIiZWdmRhc2g7XCI6XCLiiqpcIixcIiZXY2lyYztcIjpcIsW0XCIsXCImV2VkZ2U7XCI6XCLii4BcIixcIiZXZnI7XCI6XCLwnZSaXCIsXCImV29wZjtcIjpcIvCdlY5cIixcIiZXc2NyO1wiOlwi8J2SslwiLFwiJlhmcjtcIjpcIvCdlJtcIixcIiZYaTtcIjpcIs6eXCIsXCImWG9wZjtcIjpcIvCdlY9cIixcIiZYc2NyO1wiOlwi8J2Ss1wiLFwiJllBY3k7XCI6XCLQr1wiLFwiJllJY3k7XCI6XCLQh1wiLFwiJllVY3k7XCI6XCLQrlwiLFwiJllhY3V0ZVwiOlwiw51cIixcIiZZYWN1dGU7XCI6XCLDnVwiLFwiJlljaXJjO1wiOlwixbZcIixcIiZZY3k7XCI6XCLQq1wiLFwiJllmcjtcIjpcIvCdlJxcIixcIiZZb3BmO1wiOlwi8J2VkFwiLFwiJllzY3I7XCI6XCLwnZK0XCIsXCImWXVtbDtcIjpcIsW4XCIsXCImWkhjeTtcIjpcItCWXCIsXCImWmFjdXRlO1wiOlwixblcIixcIiZaY2Fyb247XCI6XCLFvVwiLFwiJlpjeTtcIjpcItCXXCIsXCImWmRvdDtcIjpcIsW7XCIsXCImWmVyb1dpZHRoU3BhY2U7XCI6XCLigItcIixcIiZaZXRhO1wiOlwizpZcIixcIiZaZnI7XCI6XCLihKhcIixcIiZab3BmO1wiOlwi4oSkXCIsXCImWnNjcjtcIjpcIvCdkrVcIixcIiZhYWN1dGVcIjpcIsOhXCIsXCImYWFjdXRlO1wiOlwiw6FcIixcIiZhYnJldmU7XCI6XCLEg1wiLFwiJmFjO1wiOlwi4oi+XCIsXCImYWNFO1wiOlwi4oi+zLNcIixcIiZhY2Q7XCI6XCLiiL9cIixcIiZhY2lyY1wiOlwiw6JcIixcIiZhY2lyYztcIjpcIsOiXCIsXCImYWN1dGVcIjpcIsK0XCIsXCImYWN1dGU7XCI6XCLCtFwiLFwiJmFjeTtcIjpcItCwXCIsXCImYWVsaWdcIjpcIsOmXCIsXCImYWVsaWc7XCI6XCLDplwiLFwiJmFmO1wiOlwi4oGhXCIsXCImYWZyO1wiOlwi8J2UnlwiLFwiJmFncmF2ZVwiOlwiw6BcIixcIiZhZ3JhdmU7XCI6XCLDoFwiLFwiJmFsZWZzeW07XCI6XCLihLVcIixcIiZhbGVwaDtcIjpcIuKEtVwiLFwiJmFscGhhO1wiOlwizrFcIixcIiZhbWFjcjtcIjpcIsSBXCIsXCImYW1hbGc7XCI6XCLiqL9cIixcIiZhbXBcIjpcIiZcIixcIiZhbXA7XCI6XCImXCIsXCImYW5kO1wiOlwi4oinXCIsXCImYW5kYW5kO1wiOlwi4qmVXCIsXCImYW5kZDtcIjpcIuKpnFwiLFwiJmFuZHNsb3BlO1wiOlwi4qmYXCIsXCImYW5kdjtcIjpcIuKpmlwiLFwiJmFuZztcIjpcIuKIoFwiLFwiJmFuZ2U7XCI6XCLipqRcIixcIiZhbmdsZTtcIjpcIuKIoFwiLFwiJmFuZ21zZDtcIjpcIuKIoVwiLFwiJmFuZ21zZGFhO1wiOlwi4qaoXCIsXCImYW5nbXNkYWI7XCI6XCLipqlcIixcIiZhbmdtc2RhYztcIjpcIuKmqlwiLFwiJmFuZ21zZGFkO1wiOlwi4qarXCIsXCImYW5nbXNkYWU7XCI6XCLipqxcIixcIiZhbmdtc2RhZjtcIjpcIuKmrVwiLFwiJmFuZ21zZGFnO1wiOlwi4qauXCIsXCImYW5nbXNkYWg7XCI6XCLipq9cIixcIiZhbmdydDtcIjpcIuKIn1wiLFwiJmFuZ3J0dmI7XCI6XCLiir5cIixcIiZhbmdydHZiZDtcIjpcIuKmnVwiLFwiJmFuZ3NwaDtcIjpcIuKIolwiLFwiJmFuZ3N0O1wiOlwiw4VcIixcIiZhbmd6YXJyO1wiOlwi4o28XCIsXCImYW9nb247XCI6XCLEhVwiLFwiJmFvcGY7XCI6XCLwnZWSXCIsXCImYXA7XCI6XCLiiYhcIixcIiZhcEU7XCI6XCLiqbBcIixcIiZhcGFjaXI7XCI6XCLiqa9cIixcIiZhcGU7XCI6XCLiiYpcIixcIiZhcGlkO1wiOlwi4omLXCIsXCImYXBvcztcIjpcIidcIixcIiZhcHByb3g7XCI6XCLiiYhcIixcIiZhcHByb3hlcTtcIjpcIuKJilwiLFwiJmFyaW5nXCI6XCLDpVwiLFwiJmFyaW5nO1wiOlwiw6VcIixcIiZhc2NyO1wiOlwi8J2StlwiLFwiJmFzdDtcIjpcIipcIixcIiZhc3ltcDtcIjpcIuKJiFwiLFwiJmFzeW1wZXE7XCI6XCLiiY1cIixcIiZhdGlsZGVcIjpcIsOjXCIsXCImYXRpbGRlO1wiOlwiw6NcIixcIiZhdW1sXCI6XCLDpFwiLFwiJmF1bWw7XCI6XCLDpFwiLFwiJmF3Y29uaW50O1wiOlwi4oizXCIsXCImYXdpbnQ7XCI6XCLiqJFcIixcIiZiTm90O1wiOlwi4qutXCIsXCImYmFja2Nvbmc7XCI6XCLiiYxcIixcIiZiYWNrZXBzaWxvbjtcIjpcIs+2XCIsXCImYmFja3ByaW1lO1wiOlwi4oC1XCIsXCImYmFja3NpbTtcIjpcIuKIvVwiLFwiJmJhY2tzaW1lcTtcIjpcIuKLjVwiLFwiJmJhcnZlZTtcIjpcIuKKvVwiLFwiJmJhcndlZDtcIjpcIuKMhVwiLFwiJmJhcndlZGdlO1wiOlwi4oyFXCIsXCImYmJyaztcIjpcIuKOtVwiLFwiJmJicmt0YnJrO1wiOlwi4o62XCIsXCImYmNvbmc7XCI6XCLiiYxcIixcIiZiY3k7XCI6XCLQsVwiLFwiJmJkcXVvO1wiOlwi4oCeXCIsXCImYmVjYXVzO1wiOlwi4oi1XCIsXCImYmVjYXVzZTtcIjpcIuKItVwiLFwiJmJlbXB0eXY7XCI6XCLiprBcIixcIiZiZXBzaTtcIjpcIs+2XCIsXCImYmVybm91O1wiOlwi4oSsXCIsXCImYmV0YTtcIjpcIs6yXCIsXCImYmV0aDtcIjpcIuKEtlwiLFwiJmJldHdlZW47XCI6XCLiiaxcIixcIiZiZnI7XCI6XCLwnZSfXCIsXCImYmlnY2FwO1wiOlwi4ouCXCIsXCImYmlnY2lyYztcIjpcIuKXr1wiLFwiJmJpZ2N1cDtcIjpcIuKLg1wiLFwiJmJpZ29kb3Q7XCI6XCLiqIBcIixcIiZiaWdvcGx1cztcIjpcIuKogVwiLFwiJmJpZ290aW1lcztcIjpcIuKoglwiLFwiJmJpZ3NxY3VwO1wiOlwi4qiGXCIsXCImYmlnc3RhcjtcIjpcIuKYhVwiLFwiJmJpZ3RyaWFuZ2xlZG93bjtcIjpcIuKWvVwiLFwiJmJpZ3RyaWFuZ2xldXA7XCI6XCLilrNcIixcIiZiaWd1cGx1cztcIjpcIuKohFwiLFwiJmJpZ3ZlZTtcIjpcIuKLgVwiLFwiJmJpZ3dlZGdlO1wiOlwi4ouAXCIsXCImYmthcm93O1wiOlwi4qSNXCIsXCImYmxhY2tsb3plbmdlO1wiOlwi4qerXCIsXCImYmxhY2tzcXVhcmU7XCI6XCLilqpcIixcIiZibGFja3RyaWFuZ2xlO1wiOlwi4pa0XCIsXCImYmxhY2t0cmlhbmdsZWRvd247XCI6XCLilr5cIixcIiZibGFja3RyaWFuZ2xlbGVmdDtcIjpcIuKXglwiLFwiJmJsYWNrdHJpYW5nbGVyaWdodDtcIjpcIuKWuFwiLFwiJmJsYW5rO1wiOlwi4pCjXCIsXCImYmxrMTI7XCI6XCLilpJcIixcIiZibGsxNDtcIjpcIuKWkVwiLFwiJmJsazM0O1wiOlwi4paTXCIsXCImYmxvY2s7XCI6XCLilohcIixcIiZibmU7XCI6XCI94oOlXCIsXCImYm5lcXVpdjtcIjpcIuKJoeKDpVwiLFwiJmJub3Q7XCI6XCLijJBcIixcIiZib3BmO1wiOlwi8J2Vk1wiLFwiJmJvdDtcIjpcIuKKpVwiLFwiJmJvdHRvbTtcIjpcIuKKpVwiLFwiJmJvd3RpZTtcIjpcIuKLiFwiLFwiJmJveERMO1wiOlwi4pWXXCIsXCImYm94RFI7XCI6XCLilZRcIixcIiZib3hEbDtcIjpcIuKVllwiLFwiJmJveERyO1wiOlwi4pWTXCIsXCImYm94SDtcIjpcIuKVkFwiLFwiJmJveEhEO1wiOlwi4pWmXCIsXCImYm94SFU7XCI6XCLilalcIixcIiZib3hIZDtcIjpcIuKVpFwiLFwiJmJveEh1O1wiOlwi4pWnXCIsXCImYm94VUw7XCI6XCLilZ1cIixcIiZib3hVUjtcIjpcIuKVmlwiLFwiJmJveFVsO1wiOlwi4pWcXCIsXCImYm94VXI7XCI6XCLilZlcIixcIiZib3hWO1wiOlwi4pWRXCIsXCImYm94Vkg7XCI6XCLilaxcIixcIiZib3hWTDtcIjpcIuKVo1wiLFwiJmJveFZSO1wiOlwi4pWgXCIsXCImYm94Vmg7XCI6XCLilatcIixcIiZib3hWbDtcIjpcIuKVolwiLFwiJmJveFZyO1wiOlwi4pWfXCIsXCImYm94Ym94O1wiOlwi4qeJXCIsXCImYm94ZEw7XCI6XCLilZVcIixcIiZib3hkUjtcIjpcIuKVklwiLFwiJmJveGRsO1wiOlwi4pSQXCIsXCImYm94ZHI7XCI6XCLilIxcIixcIiZib3hoO1wiOlwi4pSAXCIsXCImYm94aEQ7XCI6XCLilaVcIixcIiZib3hoVTtcIjpcIuKVqFwiLFwiJmJveGhkO1wiOlwi4pSsXCIsXCImYm94aHU7XCI6XCLilLRcIixcIiZib3htaW51cztcIjpcIuKKn1wiLFwiJmJveHBsdXM7XCI6XCLiip5cIixcIiZib3h0aW1lcztcIjpcIuKKoFwiLFwiJmJveHVMO1wiOlwi4pWbXCIsXCImYm94dVI7XCI6XCLilZhcIixcIiZib3h1bDtcIjpcIuKUmFwiLFwiJmJveHVyO1wiOlwi4pSUXCIsXCImYm94djtcIjpcIuKUglwiLFwiJmJveHZIO1wiOlwi4pWqXCIsXCImYm94dkw7XCI6XCLilaFcIixcIiZib3h2UjtcIjpcIuKVnlwiLFwiJmJveHZoO1wiOlwi4pS8XCIsXCImYm94dmw7XCI6XCLilKRcIixcIiZib3h2cjtcIjpcIuKUnFwiLFwiJmJwcmltZTtcIjpcIuKAtVwiLFwiJmJyZXZlO1wiOlwiy5hcIixcIiZicnZiYXJcIjpcIsKmXCIsXCImYnJ2YmFyO1wiOlwiwqZcIixcIiZic2NyO1wiOlwi8J2St1wiLFwiJmJzZW1pO1wiOlwi4oGPXCIsXCImYnNpbTtcIjpcIuKIvVwiLFwiJmJzaW1lO1wiOlwi4ouNXCIsXCImYnNvbDtcIjpcIlxcXFxcIixcIiZic29sYjtcIjpcIuKnhVwiLFwiJmJzb2xoc3ViO1wiOlwi4p+IXCIsXCImYnVsbDtcIjpcIuKAolwiLFwiJmJ1bGxldDtcIjpcIuKAolwiLFwiJmJ1bXA7XCI6XCLiiY5cIixcIiZidW1wRTtcIjpcIuKqrlwiLFwiJmJ1bXBlO1wiOlwi4omPXCIsXCImYnVtcGVxO1wiOlwi4omPXCIsXCImY2FjdXRlO1wiOlwixIdcIixcIiZjYXA7XCI6XCLiiKlcIixcIiZjYXBhbmQ7XCI6XCLiqYRcIixcIiZjYXBicmN1cDtcIjpcIuKpiVwiLFwiJmNhcGNhcDtcIjpcIuKpi1wiLFwiJmNhcGN1cDtcIjpcIuKph1wiLFwiJmNhcGRvdDtcIjpcIuKpgFwiLFwiJmNhcHM7XCI6XCLiiKnvuIBcIixcIiZjYXJldDtcIjpcIuKBgVwiLFwiJmNhcm9uO1wiOlwiy4dcIixcIiZjY2FwcztcIjpcIuKpjVwiLFwiJmNjYXJvbjtcIjpcIsSNXCIsXCImY2NlZGlsXCI6XCLDp1wiLFwiJmNjZWRpbDtcIjpcIsOnXCIsXCImY2NpcmM7XCI6XCLEiVwiLFwiJmNjdXBzO1wiOlwi4qmMXCIsXCImY2N1cHNzbTtcIjpcIuKpkFwiLFwiJmNkb3Q7XCI6XCLEi1wiLFwiJmNlZGlsXCI6XCLCuFwiLFwiJmNlZGlsO1wiOlwiwrhcIixcIiZjZW1wdHl2O1wiOlwi4qayXCIsXCImY2VudFwiOlwiwqJcIixcIiZjZW50O1wiOlwiwqJcIixcIiZjZW50ZXJkb3Q7XCI6XCLCt1wiLFwiJmNmcjtcIjpcIvCdlKBcIixcIiZjaGN5O1wiOlwi0YdcIixcIiZjaGVjaztcIjpcIuKck1wiLFwiJmNoZWNrbWFyaztcIjpcIuKck1wiLFwiJmNoaTtcIjpcIs+HXCIsXCImY2lyO1wiOlwi4peLXCIsXCImY2lyRTtcIjpcIuKng1wiLFwiJmNpcmM7XCI6XCLLhlwiLFwiJmNpcmNlcTtcIjpcIuKJl1wiLFwiJmNpcmNsZWFycm93bGVmdDtcIjpcIuKGulwiLFwiJmNpcmNsZWFycm93cmlnaHQ7XCI6XCLihrtcIixcIiZjaXJjbGVkUjtcIjpcIsKuXCIsXCImY2lyY2xlZFM7XCI6XCLik4hcIixcIiZjaXJjbGVkYXN0O1wiOlwi4oqbXCIsXCImY2lyY2xlZGNpcmM7XCI6XCLiippcIixcIiZjaXJjbGVkZGFzaDtcIjpcIuKKnVwiLFwiJmNpcmU7XCI6XCLiiZdcIixcIiZjaXJmbmludDtcIjpcIuKokFwiLFwiJmNpcm1pZDtcIjpcIuKrr1wiLFwiJmNpcnNjaXI7XCI6XCLip4JcIixcIiZjbHVicztcIjpcIuKZo1wiLFwiJmNsdWJzdWl0O1wiOlwi4pmjXCIsXCImY29sb247XCI6XCI6XCIsXCImY29sb25lO1wiOlwi4omUXCIsXCImY29sb25lcTtcIjpcIuKJlFwiLFwiJmNvbW1hO1wiOlwiLFwiLFwiJmNvbW1hdDtcIjpcIkBcIixcIiZjb21wO1wiOlwi4oiBXCIsXCImY29tcGZuO1wiOlwi4oiYXCIsXCImY29tcGxlbWVudDtcIjpcIuKIgVwiLFwiJmNvbXBsZXhlcztcIjpcIuKEglwiLFwiJmNvbmc7XCI6XCLiiYVcIixcIiZjb25nZG90O1wiOlwi4qmtXCIsXCImY29uaW50O1wiOlwi4oiuXCIsXCImY29wZjtcIjpcIvCdlZRcIixcIiZjb3Byb2Q7XCI6XCLiiJBcIixcIiZjb3B5XCI6XCLCqVwiLFwiJmNvcHk7XCI6XCLCqVwiLFwiJmNvcHlzcjtcIjpcIuKEl1wiLFwiJmNyYXJyO1wiOlwi4oa1XCIsXCImY3Jvc3M7XCI6XCLinJdcIixcIiZjc2NyO1wiOlwi8J2SuFwiLFwiJmNzdWI7XCI6XCLiq49cIixcIiZjc3ViZTtcIjpcIuKrkVwiLFwiJmNzdXA7XCI6XCLiq5BcIixcIiZjc3VwZTtcIjpcIuKrklwiLFwiJmN0ZG90O1wiOlwi4ouvXCIsXCImY3VkYXJybDtcIjpcIuKkuFwiLFwiJmN1ZGFycnI7XCI6XCLipLVcIixcIiZjdWVwcjtcIjpcIuKLnlwiLFwiJmN1ZXNjO1wiOlwi4oufXCIsXCImY3VsYXJyO1wiOlwi4oa2XCIsXCImY3VsYXJycDtcIjpcIuKkvVwiLFwiJmN1cDtcIjpcIuKIqlwiLFwiJmN1cGJyY2FwO1wiOlwi4qmIXCIsXCImY3VwY2FwO1wiOlwi4qmGXCIsXCImY3VwY3VwO1wiOlwi4qmKXCIsXCImY3VwZG90O1wiOlwi4oqNXCIsXCImY3Vwb3I7XCI6XCLiqYVcIixcIiZjdXBzO1wiOlwi4oiq77iAXCIsXCImY3VyYXJyO1wiOlwi4oa3XCIsXCImY3VyYXJybTtcIjpcIuKkvFwiLFwiJmN1cmx5ZXFwcmVjO1wiOlwi4oueXCIsXCImY3VybHllcXN1Y2M7XCI6XCLii59cIixcIiZjdXJseXZlZTtcIjpcIuKLjlwiLFwiJmN1cmx5d2VkZ2U7XCI6XCLii49cIixcIiZjdXJyZW5cIjpcIsKkXCIsXCImY3VycmVuO1wiOlwiwqRcIixcIiZjdXJ2ZWFycm93bGVmdDtcIjpcIuKGtlwiLFwiJmN1cnZlYXJyb3dyaWdodDtcIjpcIuKGt1wiLFwiJmN1dmVlO1wiOlwi4ouOXCIsXCImY3V3ZWQ7XCI6XCLii49cIixcIiZjd2NvbmludDtcIjpcIuKIslwiLFwiJmN3aW50O1wiOlwi4oixXCIsXCImY3lsY3R5O1wiOlwi4oytXCIsXCImZEFycjtcIjpcIuKHk1wiLFwiJmRIYXI7XCI6XCLipaVcIixcIiZkYWdnZXI7XCI6XCLigKBcIixcIiZkYWxldGg7XCI6XCLihLhcIixcIiZkYXJyO1wiOlwi4oaTXCIsXCImZGFzaDtcIjpcIuKAkFwiLFwiJmRhc2h2O1wiOlwi4oqjXCIsXCImZGJrYXJvdztcIjpcIuKkj1wiLFwiJmRibGFjO1wiOlwiy51cIixcIiZkY2Fyb247XCI6XCLEj1wiLFwiJmRjeTtcIjpcItC0XCIsXCImZGQ7XCI6XCLihYZcIixcIiZkZGFnZ2VyO1wiOlwi4oChXCIsXCImZGRhcnI7XCI6XCLih4pcIixcIiZkZG90c2VxO1wiOlwi4qm3XCIsXCImZGVnXCI6XCLCsFwiLFwiJmRlZztcIjpcIsKwXCIsXCImZGVsdGE7XCI6XCLOtFwiLFwiJmRlbXB0eXY7XCI6XCLiprFcIixcIiZkZmlzaHQ7XCI6XCLipb9cIixcIiZkZnI7XCI6XCLwnZShXCIsXCImZGhhcmw7XCI6XCLih4NcIixcIiZkaGFycjtcIjpcIuKHglwiLFwiJmRpYW07XCI6XCLii4RcIixcIiZkaWFtb25kO1wiOlwi4ouEXCIsXCImZGlhbW9uZHN1aXQ7XCI6XCLimaZcIixcIiZkaWFtcztcIjpcIuKZplwiLFwiJmRpZTtcIjpcIsKoXCIsXCImZGlnYW1tYTtcIjpcIs+dXCIsXCImZGlzaW47XCI6XCLii7JcIixcIiZkaXY7XCI6XCLDt1wiLFwiJmRpdmlkZVwiOlwiw7dcIixcIiZkaXZpZGU7XCI6XCLDt1wiLFwiJmRpdmlkZW9udGltZXM7XCI6XCLii4dcIixcIiZkaXZvbng7XCI6XCLii4dcIixcIiZkamN5O1wiOlwi0ZJcIixcIiZkbGNvcm47XCI6XCLijJ5cIixcIiZkbGNyb3A7XCI6XCLijI1cIixcIiZkb2xsYXI7XCI6XCIkXCIsXCImZG9wZjtcIjpcIvCdlZVcIixcIiZkb3Q7XCI6XCLLmVwiLFwiJmRvdGVxO1wiOlwi4omQXCIsXCImZG90ZXFkb3Q7XCI6XCLiiZFcIixcIiZkb3RtaW51cztcIjpcIuKIuFwiLFwiJmRvdHBsdXM7XCI6XCLiiJRcIixcIiZkb3RzcXVhcmU7XCI6XCLiiqFcIixcIiZkb3VibGViYXJ3ZWRnZTtcIjpcIuKMhlwiLFwiJmRvd25hcnJvdztcIjpcIuKGk1wiLFwiJmRvd25kb3duYXJyb3dzO1wiOlwi4oeKXCIsXCImZG93bmhhcnBvb25sZWZ0O1wiOlwi4oeDXCIsXCImZG93bmhhcnBvb25yaWdodDtcIjpcIuKHglwiLFwiJmRyYmthcm93O1wiOlwi4qSQXCIsXCImZHJjb3JuO1wiOlwi4oyfXCIsXCImZHJjcm9wO1wiOlwi4oyMXCIsXCImZHNjcjtcIjpcIvCdkrlcIixcIiZkc2N5O1wiOlwi0ZVcIixcIiZkc29sO1wiOlwi4qe2XCIsXCImZHN0cm9rO1wiOlwixJFcIixcIiZkdGRvdDtcIjpcIuKLsVwiLFwiJmR0cmk7XCI6XCLilr9cIixcIiZkdHJpZjtcIjpcIuKWvlwiLFwiJmR1YXJyO1wiOlwi4oe1XCIsXCImZHVoYXI7XCI6XCLipa9cIixcIiZkd2FuZ2xlO1wiOlwi4qamXCIsXCImZHpjeTtcIjpcItGfXCIsXCImZHppZ3JhcnI7XCI6XCLin79cIixcIiZlRERvdDtcIjpcIuKpt1wiLFwiJmVEb3Q7XCI6XCLiiZFcIixcIiZlYWN1dGVcIjpcIsOpXCIsXCImZWFjdXRlO1wiOlwiw6lcIixcIiZlYXN0ZXI7XCI6XCLiqa5cIixcIiZlY2Fyb247XCI6XCLEm1wiLFwiJmVjaXI7XCI6XCLiiZZcIixcIiZlY2lyY1wiOlwiw6pcIixcIiZlY2lyYztcIjpcIsOqXCIsXCImZWNvbG9uO1wiOlwi4omVXCIsXCImZWN5O1wiOlwi0Y1cIixcIiZlZG90O1wiOlwixJdcIixcIiZlZTtcIjpcIuKFh1wiLFwiJmVmRG90O1wiOlwi4omSXCIsXCImZWZyO1wiOlwi8J2UolwiLFwiJmVnO1wiOlwi4qqaXCIsXCImZWdyYXZlXCI6XCLDqFwiLFwiJmVncmF2ZTtcIjpcIsOoXCIsXCImZWdzO1wiOlwi4qqWXCIsXCImZWdzZG90O1wiOlwi4qqYXCIsXCImZWw7XCI6XCLiqplcIixcIiZlbGludGVycztcIjpcIuKPp1wiLFwiJmVsbDtcIjpcIuKEk1wiLFwiJmVscztcIjpcIuKqlVwiLFwiJmVsc2RvdDtcIjpcIuKql1wiLFwiJmVtYWNyO1wiOlwixJNcIixcIiZlbXB0eTtcIjpcIuKIhVwiLFwiJmVtcHR5c2V0O1wiOlwi4oiFXCIsXCImZW1wdHl2O1wiOlwi4oiFXCIsXCImZW1zcDEzO1wiOlwi4oCEXCIsXCImZW1zcDE0O1wiOlwi4oCFXCIsXCImZW1zcDtcIjpcIuKAg1wiLFwiJmVuZztcIjpcIsWLXCIsXCImZW5zcDtcIjpcIuKAglwiLFwiJmVvZ29uO1wiOlwixJlcIixcIiZlb3BmO1wiOlwi8J2VllwiLFwiJmVwYXI7XCI6XCLii5VcIixcIiZlcGFyc2w7XCI6XCLip6NcIixcIiZlcGx1cztcIjpcIuKpsVwiLFwiJmVwc2k7XCI6XCLOtVwiLFwiJmVwc2lsb247XCI6XCLOtVwiLFwiJmVwc2l2O1wiOlwiz7VcIixcIiZlcWNpcmM7XCI6XCLiiZZcIixcIiZlcWNvbG9uO1wiOlwi4omVXCIsXCImZXFzaW07XCI6XCLiiYJcIixcIiZlcXNsYW50Z3RyO1wiOlwi4qqWXCIsXCImZXFzbGFudGxlc3M7XCI6XCLiqpVcIixcIiZlcXVhbHM7XCI6XCI9XCIsXCImZXF1ZXN0O1wiOlwi4omfXCIsXCImZXF1aXY7XCI6XCLiiaFcIixcIiZlcXVpdkREO1wiOlwi4qm4XCIsXCImZXF2cGFyc2w7XCI6XCLip6VcIixcIiZlckRvdDtcIjpcIuKJk1wiLFwiJmVyYXJyO1wiOlwi4qWxXCIsXCImZXNjcjtcIjpcIuKEr1wiLFwiJmVzZG90O1wiOlwi4omQXCIsXCImZXNpbTtcIjpcIuKJglwiLFwiJmV0YTtcIjpcIs63XCIsXCImZXRoXCI6XCLDsFwiLFwiJmV0aDtcIjpcIsOwXCIsXCImZXVtbFwiOlwiw6tcIixcIiZldW1sO1wiOlwiw6tcIixcIiZldXJvO1wiOlwi4oKsXCIsXCImZXhjbDtcIjpcIiFcIixcIiZleGlzdDtcIjpcIuKIg1wiLFwiJmV4cGVjdGF0aW9uO1wiOlwi4oSwXCIsXCImZXhwb25lbnRpYWxlO1wiOlwi4oWHXCIsXCImZmFsbGluZ2RvdHNlcTtcIjpcIuKJklwiLFwiJmZjeTtcIjpcItGEXCIsXCImZmVtYWxlO1wiOlwi4pmAXCIsXCImZmZpbGlnO1wiOlwi76yDXCIsXCImZmZsaWc7XCI6XCLvrIBcIixcIiZmZmxsaWc7XCI6XCLvrIRcIixcIiZmZnI7XCI6XCLwnZSjXCIsXCImZmlsaWc7XCI6XCLvrIFcIixcIiZmamxpZztcIjpcImZqXCIsXCImZmxhdDtcIjpcIuKZrVwiLFwiJmZsbGlnO1wiOlwi76yCXCIsXCImZmx0bnM7XCI6XCLilrFcIixcIiZmbm9mO1wiOlwixpJcIixcIiZmb3BmO1wiOlwi8J2Vl1wiLFwiJmZvcmFsbDtcIjpcIuKIgFwiLFwiJmZvcms7XCI6XCLii5RcIixcIiZmb3JrdjtcIjpcIuKrmVwiLFwiJmZwYXJ0aW50O1wiOlwi4qiNXCIsXCImZnJhYzEyXCI6XCLCvVwiLFwiJmZyYWMxMjtcIjpcIsK9XCIsXCImZnJhYzEzO1wiOlwi4oWTXCIsXCImZnJhYzE0XCI6XCLCvFwiLFwiJmZyYWMxNDtcIjpcIsK8XCIsXCImZnJhYzE1O1wiOlwi4oWVXCIsXCImZnJhYzE2O1wiOlwi4oWZXCIsXCImZnJhYzE4O1wiOlwi4oWbXCIsXCImZnJhYzIzO1wiOlwi4oWUXCIsXCImZnJhYzI1O1wiOlwi4oWWXCIsXCImZnJhYzM0XCI6XCLCvlwiLFwiJmZyYWMzNDtcIjpcIsK+XCIsXCImZnJhYzM1O1wiOlwi4oWXXCIsXCImZnJhYzM4O1wiOlwi4oWcXCIsXCImZnJhYzQ1O1wiOlwi4oWYXCIsXCImZnJhYzU2O1wiOlwi4oWaXCIsXCImZnJhYzU4O1wiOlwi4oWdXCIsXCImZnJhYzc4O1wiOlwi4oWeXCIsXCImZnJhc2w7XCI6XCLigYRcIixcIiZmcm93bjtcIjpcIuKMolwiLFwiJmZzY3I7XCI6XCLwnZK7XCIsXCImZ0U7XCI6XCLiiadcIixcIiZnRWw7XCI6XCLiqoxcIixcIiZnYWN1dGU7XCI6XCLHtVwiLFwiJmdhbW1hO1wiOlwizrNcIixcIiZnYW1tYWQ7XCI6XCLPnVwiLFwiJmdhcDtcIjpcIuKqhlwiLFwiJmdicmV2ZTtcIjpcIsSfXCIsXCImZ2NpcmM7XCI6XCLEnVwiLFwiJmdjeTtcIjpcItCzXCIsXCImZ2RvdDtcIjpcIsShXCIsXCImZ2U7XCI6XCLiiaVcIixcIiZnZWw7XCI6XCLii5tcIixcIiZnZXE7XCI6XCLiiaVcIixcIiZnZXFxO1wiOlwi4omnXCIsXCImZ2Vxc2xhbnQ7XCI6XCLiqb5cIixcIiZnZXM7XCI6XCLiqb5cIixcIiZnZXNjYztcIjpcIuKqqVwiLFwiJmdlc2RvdDtcIjpcIuKqgFwiLFwiJmdlc2RvdG87XCI6XCLiqoJcIixcIiZnZXNkb3RvbDtcIjpcIuKqhFwiLFwiJmdlc2w7XCI6XCLii5vvuIBcIixcIiZnZXNsZXM7XCI6XCLiqpRcIixcIiZnZnI7XCI6XCLwnZSkXCIsXCImZ2c7XCI6XCLiiatcIixcIiZnZ2c7XCI6XCLii5lcIixcIiZnaW1lbDtcIjpcIuKEt1wiLFwiJmdqY3k7XCI6XCLRk1wiLFwiJmdsO1wiOlwi4om3XCIsXCImZ2xFO1wiOlwi4qqSXCIsXCImZ2xhO1wiOlwi4qqlXCIsXCImZ2xqO1wiOlwi4qqkXCIsXCImZ25FO1wiOlwi4ompXCIsXCImZ25hcDtcIjpcIuKqilwiLFwiJmduYXBwcm94O1wiOlwi4qqKXCIsXCImZ25lO1wiOlwi4qqIXCIsXCImZ25lcTtcIjpcIuKqiFwiLFwiJmduZXFxO1wiOlwi4ompXCIsXCImZ25zaW07XCI6XCLii6dcIixcIiZnb3BmO1wiOlwi8J2VmFwiLFwiJmdyYXZlO1wiOlwiYFwiLFwiJmdzY3I7XCI6XCLihIpcIixcIiZnc2ltO1wiOlwi4omzXCIsXCImZ3NpbWU7XCI6XCLiqo5cIixcIiZnc2ltbDtcIjpcIuKqkFwiLFwiJmd0XCI6XCI+XCIsXCImZ3Q7XCI6XCI+XCIsXCImZ3RjYztcIjpcIuKqp1wiLFwiJmd0Y2lyO1wiOlwi4qm6XCIsXCImZ3Rkb3Q7XCI6XCLii5dcIixcIiZndGxQYXI7XCI6XCLippVcIixcIiZndHF1ZXN0O1wiOlwi4qm8XCIsXCImZ3RyYXBwcm94O1wiOlwi4qqGXCIsXCImZ3RyYXJyO1wiOlwi4qW4XCIsXCImZ3RyZG90O1wiOlwi4ouXXCIsXCImZ3RyZXFsZXNzO1wiOlwi4oubXCIsXCImZ3RyZXFxbGVzcztcIjpcIuKqjFwiLFwiJmd0cmxlc3M7XCI6XCLiibdcIixcIiZndHJzaW07XCI6XCLiibNcIixcIiZndmVydG5lcXE7XCI6XCLiianvuIBcIixcIiZndm5FO1wiOlwi4omp77iAXCIsXCImaEFycjtcIjpcIuKHlFwiLFwiJmhhaXJzcDtcIjpcIuKAilwiLFwiJmhhbGY7XCI6XCLCvVwiLFwiJmhhbWlsdDtcIjpcIuKEi1wiLFwiJmhhcmRjeTtcIjpcItGKXCIsXCImaGFycjtcIjpcIuKGlFwiLFwiJmhhcnJjaXI7XCI6XCLipYhcIixcIiZoYXJydztcIjpcIuKGrVwiLFwiJmhiYXI7XCI6XCLihI9cIixcIiZoY2lyYztcIjpcIsSlXCIsXCImaGVhcnRzO1wiOlwi4pmlXCIsXCImaGVhcnRzdWl0O1wiOlwi4pmlXCIsXCImaGVsbGlwO1wiOlwi4oCmXCIsXCImaGVyY29uO1wiOlwi4oq5XCIsXCImaGZyO1wiOlwi8J2UpVwiLFwiJmhrc2Vhcm93O1wiOlwi4qSlXCIsXCImaGtzd2Fyb3c7XCI6XCLipKZcIixcIiZob2FycjtcIjpcIuKHv1wiLFwiJmhvbXRodDtcIjpcIuKIu1wiLFwiJmhvb2tsZWZ0YXJyb3c7XCI6XCLihqlcIixcIiZob29rcmlnaHRhcnJvdztcIjpcIuKGqlwiLFwiJmhvcGY7XCI6XCLwnZWZXCIsXCImaG9yYmFyO1wiOlwi4oCVXCIsXCImaHNjcjtcIjpcIvCdkr1cIixcIiZoc2xhc2g7XCI6XCLihI9cIixcIiZoc3Ryb2s7XCI6XCLEp1wiLFwiJmh5YnVsbDtcIjpcIuKBg1wiLFwiJmh5cGhlbjtcIjpcIuKAkFwiLFwiJmlhY3V0ZVwiOlwiw61cIixcIiZpYWN1dGU7XCI6XCLDrVwiLFwiJmljO1wiOlwi4oGjXCIsXCImaWNpcmNcIjpcIsOuXCIsXCImaWNpcmM7XCI6XCLDrlwiLFwiJmljeTtcIjpcItC4XCIsXCImaWVjeTtcIjpcItC1XCIsXCImaWV4Y2xcIjpcIsKhXCIsXCImaWV4Y2w7XCI6XCLCoVwiLFwiJmlmZjtcIjpcIuKHlFwiLFwiJmlmcjtcIjpcIvCdlKZcIixcIiZpZ3JhdmVcIjpcIsOsXCIsXCImaWdyYXZlO1wiOlwiw6xcIixcIiZpaTtcIjpcIuKFiFwiLFwiJmlpaWludDtcIjpcIuKojFwiLFwiJmlpaW50O1wiOlwi4oitXCIsXCImaWluZmluO1wiOlwi4qecXCIsXCImaWlvdGE7XCI6XCLihKlcIixcIiZpamxpZztcIjpcIsSzXCIsXCImaW1hY3I7XCI6XCLEq1wiLFwiJmltYWdlO1wiOlwi4oSRXCIsXCImaW1hZ2xpbmU7XCI6XCLihJBcIixcIiZpbWFncGFydDtcIjpcIuKEkVwiLFwiJmltYXRoO1wiOlwixLFcIixcIiZpbW9mO1wiOlwi4oq3XCIsXCImaW1wZWQ7XCI6XCLGtVwiLFwiJmluO1wiOlwi4oiIXCIsXCImaW5jYXJlO1wiOlwi4oSFXCIsXCImaW5maW47XCI6XCLiiJ5cIixcIiZpbmZpbnRpZTtcIjpcIuKnnVwiLFwiJmlub2RvdDtcIjpcIsSxXCIsXCImaW50O1wiOlwi4oirXCIsXCImaW50Y2FsO1wiOlwi4oq6XCIsXCImaW50ZWdlcnM7XCI6XCLihKRcIixcIiZpbnRlcmNhbDtcIjpcIuKKulwiLFwiJmludGxhcmhrO1wiOlwi4qiXXCIsXCImaW50cHJvZDtcIjpcIuKovFwiLFwiJmlvY3k7XCI6XCLRkVwiLFwiJmlvZ29uO1wiOlwixK9cIixcIiZpb3BmO1wiOlwi8J2VmlwiLFwiJmlvdGE7XCI6XCLOuVwiLFwiJmlwcm9kO1wiOlwi4qi8XCIsXCImaXF1ZXN0XCI6XCLCv1wiLFwiJmlxdWVzdDtcIjpcIsK/XCIsXCImaXNjcjtcIjpcIvCdkr5cIixcIiZpc2luO1wiOlwi4oiIXCIsXCImaXNpbkU7XCI6XCLii7lcIixcIiZpc2luZG90O1wiOlwi4ou1XCIsXCImaXNpbnM7XCI6XCLii7RcIixcIiZpc2luc3Y7XCI6XCLii7NcIixcIiZpc2ludjtcIjpcIuKIiFwiLFwiJml0O1wiOlwi4oGiXCIsXCImaXRpbGRlO1wiOlwixKlcIixcIiZpdWtjeTtcIjpcItGWXCIsXCImaXVtbFwiOlwiw69cIixcIiZpdW1sO1wiOlwiw69cIixcIiZqY2lyYztcIjpcIsS1XCIsXCImamN5O1wiOlwi0LlcIixcIiZqZnI7XCI6XCLwnZSnXCIsXCImam1hdGg7XCI6XCLIt1wiLFwiJmpvcGY7XCI6XCLwnZWbXCIsXCImanNjcjtcIjpcIvCdkr9cIixcIiZqc2VyY3k7XCI6XCLRmFwiLFwiJmp1a2N5O1wiOlwi0ZRcIixcIiZrYXBwYTtcIjpcIs66XCIsXCIma2FwcGF2O1wiOlwiz7BcIixcIiZrY2VkaWw7XCI6XCLEt1wiLFwiJmtjeTtcIjpcItC6XCIsXCIma2ZyO1wiOlwi8J2UqFwiLFwiJmtncmVlbjtcIjpcIsS4XCIsXCIma2hjeTtcIjpcItGFXCIsXCIma2pjeTtcIjpcItGcXCIsXCIma29wZjtcIjpcIvCdlZxcIixcIiZrc2NyO1wiOlwi8J2TgFwiLFwiJmxBYXJyO1wiOlwi4oeaXCIsXCImbEFycjtcIjpcIuKHkFwiLFwiJmxBdGFpbDtcIjpcIuKkm1wiLFwiJmxCYXJyO1wiOlwi4qSOXCIsXCImbEU7XCI6XCLiiaZcIixcIiZsRWc7XCI6XCLiqotcIixcIiZsSGFyO1wiOlwi4qWiXCIsXCImbGFjdXRlO1wiOlwixLpcIixcIiZsYWVtcHR5djtcIjpcIuKmtFwiLFwiJmxhZ3JhbjtcIjpcIuKEklwiLFwiJmxhbWJkYTtcIjpcIs67XCIsXCImbGFuZztcIjpcIuKfqFwiLFwiJmxhbmdkO1wiOlwi4qaRXCIsXCImbGFuZ2xlO1wiOlwi4p+oXCIsXCImbGFwO1wiOlwi4qqFXCIsXCImbGFxdW9cIjpcIsKrXCIsXCImbGFxdW87XCI6XCLCq1wiLFwiJmxhcnI7XCI6XCLihpBcIixcIiZsYXJyYjtcIjpcIuKHpFwiLFwiJmxhcnJiZnM7XCI6XCLipJ9cIixcIiZsYXJyZnM7XCI6XCLipJ1cIixcIiZsYXJyaGs7XCI6XCLihqlcIixcIiZsYXJybHA7XCI6XCLihqtcIixcIiZsYXJycGw7XCI6XCLipLlcIixcIiZsYXJyc2ltO1wiOlwi4qWzXCIsXCImbGFycnRsO1wiOlwi4oaiXCIsXCImbGF0O1wiOlwi4qqrXCIsXCImbGF0YWlsO1wiOlwi4qSZXCIsXCImbGF0ZTtcIjpcIuKqrVwiLFwiJmxhdGVzO1wiOlwi4qqt77iAXCIsXCImbGJhcnI7XCI6XCLipIxcIixcIiZsYmJyaztcIjpcIuKdslwiLFwiJmxicmFjZTtcIjpcIntcIixcIiZsYnJhY2s7XCI6XCJbXCIsXCImbGJya2U7XCI6XCLipotcIixcIiZsYnJrc2xkO1wiOlwi4qaPXCIsXCImbGJya3NsdTtcIjpcIuKmjVwiLFwiJmxjYXJvbjtcIjpcIsS+XCIsXCImbGNlZGlsO1wiOlwixLxcIixcIiZsY2VpbDtcIjpcIuKMiFwiLFwiJmxjdWI7XCI6XCJ7XCIsXCImbGN5O1wiOlwi0LtcIixcIiZsZGNhO1wiOlwi4qS2XCIsXCImbGRxdW87XCI6XCLigJxcIixcIiZsZHF1b3I7XCI6XCLigJ5cIixcIiZsZHJkaGFyO1wiOlwi4qWnXCIsXCImbGRydXNoYXI7XCI6XCLipYtcIixcIiZsZHNoO1wiOlwi4oayXCIsXCImbGU7XCI6XCLiiaRcIixcIiZsZWZ0YXJyb3c7XCI6XCLihpBcIixcIiZsZWZ0YXJyb3d0YWlsO1wiOlwi4oaiXCIsXCImbGVmdGhhcnBvb25kb3duO1wiOlwi4oa9XCIsXCImbGVmdGhhcnBvb251cDtcIjpcIuKGvFwiLFwiJmxlZnRsZWZ0YXJyb3dzO1wiOlwi4oeHXCIsXCImbGVmdHJpZ2h0YXJyb3c7XCI6XCLihpRcIixcIiZsZWZ0cmlnaHRhcnJvd3M7XCI6XCLih4ZcIixcIiZsZWZ0cmlnaHRoYXJwb29ucztcIjpcIuKHi1wiLFwiJmxlZnRyaWdodHNxdWlnYXJyb3c7XCI6XCLihq1cIixcIiZsZWZ0dGhyZWV0aW1lcztcIjpcIuKLi1wiLFwiJmxlZztcIjpcIuKLmlwiLFwiJmxlcTtcIjpcIuKJpFwiLFwiJmxlcXE7XCI6XCLiiaZcIixcIiZsZXFzbGFudDtcIjpcIuKpvVwiLFwiJmxlcztcIjpcIuKpvVwiLFwiJmxlc2NjO1wiOlwi4qqoXCIsXCImbGVzZG90O1wiOlwi4qm/XCIsXCImbGVzZG90bztcIjpcIuKqgVwiLFwiJmxlc2RvdG9yO1wiOlwi4qqDXCIsXCImbGVzZztcIjpcIuKLmu+4gFwiLFwiJmxlc2dlcztcIjpcIuKqk1wiLFwiJmxlc3NhcHByb3g7XCI6XCLiqoVcIixcIiZsZXNzZG90O1wiOlwi4ouWXCIsXCImbGVzc2VxZ3RyO1wiOlwi4ouaXCIsXCImbGVzc2VxcWd0cjtcIjpcIuKqi1wiLFwiJmxlc3NndHI7XCI6XCLiibZcIixcIiZsZXNzc2ltO1wiOlwi4omyXCIsXCImbGZpc2h0O1wiOlwi4qW8XCIsXCImbGZsb29yO1wiOlwi4oyKXCIsXCImbGZyO1wiOlwi8J2UqVwiLFwiJmxnO1wiOlwi4om2XCIsXCImbGdFO1wiOlwi4qqRXCIsXCImbGhhcmQ7XCI6XCLihr1cIixcIiZsaGFydTtcIjpcIuKGvFwiLFwiJmxoYXJ1bDtcIjpcIuKlqlwiLFwiJmxoYmxrO1wiOlwi4paEXCIsXCImbGpjeTtcIjpcItGZXCIsXCImbGw7XCI6XCLiiapcIixcIiZsbGFycjtcIjpcIuKHh1wiLFwiJmxsY29ybmVyO1wiOlwi4oyeXCIsXCImbGxoYXJkO1wiOlwi4qWrXCIsXCImbGx0cmk7XCI6XCLil7pcIixcIiZsbWlkb3Q7XCI6XCLFgFwiLFwiJmxtb3VzdDtcIjpcIuKOsFwiLFwiJmxtb3VzdGFjaGU7XCI6XCLijrBcIixcIiZsbkU7XCI6XCLiiahcIixcIiZsbmFwO1wiOlwi4qqJXCIsXCImbG5hcHByb3g7XCI6XCLiqolcIixcIiZsbmU7XCI6XCLiqodcIixcIiZsbmVxO1wiOlwi4qqHXCIsXCImbG5lcXE7XCI6XCLiiahcIixcIiZsbnNpbTtcIjpcIuKLplwiLFwiJmxvYW5nO1wiOlwi4p+sXCIsXCImbG9hcnI7XCI6XCLih71cIixcIiZsb2JyaztcIjpcIuKfplwiLFwiJmxvbmdsZWZ0YXJyb3c7XCI6XCLin7VcIixcIiZsb25nbGVmdHJpZ2h0YXJyb3c7XCI6XCLin7dcIixcIiZsb25nbWFwc3RvO1wiOlwi4p+8XCIsXCImbG9uZ3JpZ2h0YXJyb3c7XCI6XCLin7ZcIixcIiZsb29wYXJyb3dsZWZ0O1wiOlwi4oarXCIsXCImbG9vcGFycm93cmlnaHQ7XCI6XCLihqxcIixcIiZsb3BhcjtcIjpcIuKmhVwiLFwiJmxvcGY7XCI6XCLwnZWdXCIsXCImbG9wbHVzO1wiOlwi4qitXCIsXCImbG90aW1lcztcIjpcIuKotFwiLFwiJmxvd2FzdDtcIjpcIuKIl1wiLFwiJmxvd2JhcjtcIjpcIl9cIixcIiZsb3o7XCI6XCLil4pcIixcIiZsb3plbmdlO1wiOlwi4peKXCIsXCImbG96ZjtcIjpcIuKnq1wiLFwiJmxwYXI7XCI6XCIoXCIsXCImbHBhcmx0O1wiOlwi4qaTXCIsXCImbHJhcnI7XCI6XCLih4ZcIixcIiZscmNvcm5lcjtcIjpcIuKMn1wiLFwiJmxyaGFyO1wiOlwi4oeLXCIsXCImbHJoYXJkO1wiOlwi4qWtXCIsXCImbHJtO1wiOlwi4oCOXCIsXCImbHJ0cmk7XCI6XCLiir9cIixcIiZsc2FxdW87XCI6XCLigLlcIixcIiZsc2NyO1wiOlwi8J2TgVwiLFwiJmxzaDtcIjpcIuKGsFwiLFwiJmxzaW07XCI6XCLiibJcIixcIiZsc2ltZTtcIjpcIuKqjVwiLFwiJmxzaW1nO1wiOlwi4qqPXCIsXCImbHNxYjtcIjpcIltcIixcIiZsc3F1bztcIjpcIuKAmFwiLFwiJmxzcXVvcjtcIjpcIuKAmlwiLFwiJmxzdHJvaztcIjpcIsWCXCIsXCImbHRcIjpcIjxcIixcIiZsdDtcIjpcIjxcIixcIiZsdGNjO1wiOlwi4qqmXCIsXCImbHRjaXI7XCI6XCLiqblcIixcIiZsdGRvdDtcIjpcIuKLllwiLFwiJmx0aHJlZTtcIjpcIuKLi1wiLFwiJmx0aW1lcztcIjpcIuKLiVwiLFwiJmx0bGFycjtcIjpcIuKltlwiLFwiJmx0cXVlc3Q7XCI6XCLiqbtcIixcIiZsdHJQYXI7XCI6XCLippZcIixcIiZsdHJpO1wiOlwi4peDXCIsXCImbHRyaWU7XCI6XCLiirRcIixcIiZsdHJpZjtcIjpcIuKXglwiLFwiJmx1cmRzaGFyO1wiOlwi4qWKXCIsXCImbHVydWhhcjtcIjpcIuKlplwiLFwiJmx2ZXJ0bmVxcTtcIjpcIuKJqO+4gFwiLFwiJmx2bkU7XCI6XCLiiajvuIBcIixcIiZtRERvdDtcIjpcIuKIulwiLFwiJm1hY3JcIjpcIsKvXCIsXCImbWFjcjtcIjpcIsKvXCIsXCImbWFsZTtcIjpcIuKZglwiLFwiJm1hbHQ7XCI6XCLinKBcIixcIiZtYWx0ZXNlO1wiOlwi4pygXCIsXCImbWFwO1wiOlwi4oamXCIsXCImbWFwc3RvO1wiOlwi4oamXCIsXCImbWFwc3RvZG93bjtcIjpcIuKGp1wiLFwiJm1hcHN0b2xlZnQ7XCI6XCLihqRcIixcIiZtYXBzdG91cDtcIjpcIuKGpVwiLFwiJm1hcmtlcjtcIjpcIuKWrlwiLFwiJm1jb21tYTtcIjpcIuKoqVwiLFwiJm1jeTtcIjpcItC8XCIsXCImbWRhc2g7XCI6XCLigJRcIixcIiZtZWFzdXJlZGFuZ2xlO1wiOlwi4oihXCIsXCImbWZyO1wiOlwi8J2UqlwiLFwiJm1obztcIjpcIuKEp1wiLFwiJm1pY3JvXCI6XCLCtVwiLFwiJm1pY3JvO1wiOlwiwrVcIixcIiZtaWQ7XCI6XCLiiKNcIixcIiZtaWRhc3Q7XCI6XCIqXCIsXCImbWlkY2lyO1wiOlwi4quwXCIsXCImbWlkZG90XCI6XCLCt1wiLFwiJm1pZGRvdDtcIjpcIsK3XCIsXCImbWludXM7XCI6XCLiiJJcIixcIiZtaW51c2I7XCI6XCLiip9cIixcIiZtaW51c2Q7XCI6XCLiiLhcIixcIiZtaW51c2R1O1wiOlwi4qiqXCIsXCImbWxjcDtcIjpcIuKrm1wiLFwiJm1sZHI7XCI6XCLigKZcIixcIiZtbnBsdXM7XCI6XCLiiJNcIixcIiZtb2RlbHM7XCI6XCLiiqdcIixcIiZtb3BmO1wiOlwi8J2VnlwiLFwiJm1wO1wiOlwi4oiTXCIsXCImbXNjcjtcIjpcIvCdk4JcIixcIiZtc3Rwb3M7XCI6XCLiiL5cIixcIiZtdTtcIjpcIs68XCIsXCImbXVsdGltYXA7XCI6XCLiirhcIixcIiZtdW1hcDtcIjpcIuKKuFwiLFwiJm5HZztcIjpcIuKLmcy4XCIsXCImbkd0O1wiOlwi4omr4oOSXCIsXCImbkd0djtcIjpcIuKJq8y4XCIsXCImbkxlZnRhcnJvdztcIjpcIuKHjVwiLFwiJm5MZWZ0cmlnaHRhcnJvdztcIjpcIuKHjlwiLFwiJm5MbDtcIjpcIuKLmMy4XCIsXCImbkx0O1wiOlwi4omq4oOSXCIsXCImbkx0djtcIjpcIuKJqsy4XCIsXCImblJpZ2h0YXJyb3c7XCI6XCLih49cIixcIiZuVkRhc2g7XCI6XCLiiq9cIixcIiZuVmRhc2g7XCI6XCLiiq5cIixcIiZuYWJsYTtcIjpcIuKIh1wiLFwiJm5hY3V0ZTtcIjpcIsWEXCIsXCImbmFuZztcIjpcIuKIoOKDklwiLFwiJm5hcDtcIjpcIuKJiVwiLFwiJm5hcEU7XCI6XCLiqbDMuFwiLFwiJm5hcGlkO1wiOlwi4omLzLhcIixcIiZuYXBvcztcIjpcIsWJXCIsXCImbmFwcHJveDtcIjpcIuKJiVwiLFwiJm5hdHVyO1wiOlwi4pmuXCIsXCImbmF0dXJhbDtcIjpcIuKZrlwiLFwiJm5hdHVyYWxzO1wiOlwi4oSVXCIsXCImbmJzcFwiOlwiwqBcIixcIiZuYnNwO1wiOlwiwqBcIixcIiZuYnVtcDtcIjpcIuKJjsy4XCIsXCImbmJ1bXBlO1wiOlwi4omPzLhcIixcIiZuY2FwO1wiOlwi4qmDXCIsXCImbmNhcm9uO1wiOlwixYhcIixcIiZuY2VkaWw7XCI6XCLFhlwiLFwiJm5jb25nO1wiOlwi4omHXCIsXCImbmNvbmdkb3Q7XCI6XCLiqa3MuFwiLFwiJm5jdXA7XCI6XCLiqYJcIixcIiZuY3k7XCI6XCLQvVwiLFwiJm5kYXNoO1wiOlwi4oCTXCIsXCImbmU7XCI6XCLiiaBcIixcIiZuZUFycjtcIjpcIuKHl1wiLFwiJm5lYXJoaztcIjpcIuKkpFwiLFwiJm5lYXJyO1wiOlwi4oaXXCIsXCImbmVhcnJvdztcIjpcIuKGl1wiLFwiJm5lZG90O1wiOlwi4omQzLhcIixcIiZuZXF1aXY7XCI6XCLiiaJcIixcIiZuZXNlYXI7XCI6XCLipKhcIixcIiZuZXNpbTtcIjpcIuKJgsy4XCIsXCImbmV4aXN0O1wiOlwi4oiEXCIsXCImbmV4aXN0cztcIjpcIuKIhFwiLFwiJm5mcjtcIjpcIvCdlKtcIixcIiZuZ0U7XCI6XCLiiafMuFwiLFwiJm5nZTtcIjpcIuKJsVwiLFwiJm5nZXE7XCI6XCLiibFcIixcIiZuZ2VxcTtcIjpcIuKJp8y4XCIsXCImbmdlcXNsYW50O1wiOlwi4qm+zLhcIixcIiZuZ2VzO1wiOlwi4qm+zLhcIixcIiZuZ3NpbTtcIjpcIuKJtVwiLFwiJm5ndDtcIjpcIuKJr1wiLFwiJm5ndHI7XCI6XCLiia9cIixcIiZuaEFycjtcIjpcIuKHjlwiLFwiJm5oYXJyO1wiOlwi4oauXCIsXCImbmhwYXI7XCI6XCLiq7JcIixcIiZuaTtcIjpcIuKIi1wiLFwiJm5pcztcIjpcIuKLvFwiLFwiJm5pc2Q7XCI6XCLii7pcIixcIiZuaXY7XCI6XCLiiItcIixcIiZuamN5O1wiOlwi0ZpcIixcIiZubEFycjtcIjpcIuKHjVwiLFwiJm5sRTtcIjpcIuKJpsy4XCIsXCImbmxhcnI7XCI6XCLihppcIixcIiZubGRyO1wiOlwi4oClXCIsXCImbmxlO1wiOlwi4omwXCIsXCImbmxlZnRhcnJvdztcIjpcIuKGmlwiLFwiJm5sZWZ0cmlnaHRhcnJvdztcIjpcIuKGrlwiLFwiJm5sZXE7XCI6XCLiibBcIixcIiZubGVxcTtcIjpcIuKJpsy4XCIsXCImbmxlcXNsYW50O1wiOlwi4qm9zLhcIixcIiZubGVzO1wiOlwi4qm9zLhcIixcIiZubGVzcztcIjpcIuKJrlwiLFwiJm5sc2ltO1wiOlwi4om0XCIsXCImbmx0O1wiOlwi4omuXCIsXCImbmx0cmk7XCI6XCLii6pcIixcIiZubHRyaWU7XCI6XCLii6xcIixcIiZubWlkO1wiOlwi4oikXCIsXCImbm9wZjtcIjpcIvCdlZ9cIixcIiZub3RcIjpcIsKsXCIsXCImbm90O1wiOlwiwqxcIixcIiZub3RpbjtcIjpcIuKIiVwiLFwiJm5vdGluRTtcIjpcIuKLucy4XCIsXCImbm90aW5kb3Q7XCI6XCLii7XMuFwiLFwiJm5vdGludmE7XCI6XCLiiIlcIixcIiZub3RpbnZiO1wiOlwi4ou3XCIsXCImbm90aW52YztcIjpcIuKLtlwiLFwiJm5vdG5pO1wiOlwi4oiMXCIsXCImbm90bml2YTtcIjpcIuKIjFwiLFwiJm5vdG5pdmI7XCI6XCLii75cIixcIiZub3RuaXZjO1wiOlwi4ou9XCIsXCImbnBhcjtcIjpcIuKIplwiLFwiJm5wYXJhbGxlbDtcIjpcIuKIplwiLFwiJm5wYXJzbDtcIjpcIuKrveKDpVwiLFwiJm5wYXJ0O1wiOlwi4oiCzLhcIixcIiZucG9saW50O1wiOlwi4qiUXCIsXCImbnByO1wiOlwi4oqAXCIsXCImbnByY3VlO1wiOlwi4ougXCIsXCImbnByZTtcIjpcIuKqr8y4XCIsXCImbnByZWM7XCI6XCLiioBcIixcIiZucHJlY2VxO1wiOlwi4qqvzLhcIixcIiZuckFycjtcIjpcIuKHj1wiLFwiJm5yYXJyO1wiOlwi4oabXCIsXCImbnJhcnJjO1wiOlwi4qSzzLhcIixcIiZucmFycnc7XCI6XCLihp3MuFwiLFwiJm5yaWdodGFycm93O1wiOlwi4oabXCIsXCImbnJ0cmk7XCI6XCLii6tcIixcIiZucnRyaWU7XCI6XCLii61cIixcIiZuc2M7XCI6XCLiioFcIixcIiZuc2NjdWU7XCI6XCLii6FcIixcIiZuc2NlO1wiOlwi4qqwzLhcIixcIiZuc2NyO1wiOlwi8J2Tg1wiLFwiJm5zaG9ydG1pZDtcIjpcIuKIpFwiLFwiJm5zaG9ydHBhcmFsbGVsO1wiOlwi4oimXCIsXCImbnNpbTtcIjpcIuKJgVwiLFwiJm5zaW1lO1wiOlwi4omEXCIsXCImbnNpbWVxO1wiOlwi4omEXCIsXCImbnNtaWQ7XCI6XCLiiKRcIixcIiZuc3BhcjtcIjpcIuKIplwiLFwiJm5zcXN1YmU7XCI6XCLii6JcIixcIiZuc3FzdXBlO1wiOlwi4oujXCIsXCImbnN1YjtcIjpcIuKKhFwiLFwiJm5zdWJFO1wiOlwi4quFzLhcIixcIiZuc3ViZTtcIjpcIuKKiFwiLFwiJm5zdWJzZXQ7XCI6XCLiioLig5JcIixcIiZuc3Vic2V0ZXE7XCI6XCLiiohcIixcIiZuc3Vic2V0ZXFxO1wiOlwi4quFzLhcIixcIiZuc3VjYztcIjpcIuKKgVwiLFwiJm5zdWNjZXE7XCI6XCLiqrDMuFwiLFwiJm5zdXA7XCI6XCLiioVcIixcIiZuc3VwRTtcIjpcIuKrhsy4XCIsXCImbnN1cGU7XCI6XCLiiolcIixcIiZuc3Vwc2V0O1wiOlwi4oqD4oOSXCIsXCImbnN1cHNldGVxO1wiOlwi4oqJXCIsXCImbnN1cHNldGVxcTtcIjpcIuKrhsy4XCIsXCImbnRnbDtcIjpcIuKJuVwiLFwiJm50aWxkZVwiOlwiw7FcIixcIiZudGlsZGU7XCI6XCLDsVwiLFwiJm50bGc7XCI6XCLiibhcIixcIiZudHJpYW5nbGVsZWZ0O1wiOlwi4ouqXCIsXCImbnRyaWFuZ2xlbGVmdGVxO1wiOlwi4ousXCIsXCImbnRyaWFuZ2xlcmlnaHQ7XCI6XCLii6tcIixcIiZudHJpYW5nbGVyaWdodGVxO1wiOlwi4outXCIsXCImbnU7XCI6XCLOvVwiLFwiJm51bTtcIjpcIiNcIixcIiZudW1lcm87XCI6XCLihJZcIixcIiZudW1zcDtcIjpcIuKAh1wiLFwiJm52RGFzaDtcIjpcIuKKrVwiLFwiJm52SGFycjtcIjpcIuKkhFwiLFwiJm52YXA7XCI6XCLiiY3ig5JcIixcIiZudmRhc2g7XCI6XCLiiqxcIixcIiZudmdlO1wiOlwi4oml4oOSXCIsXCImbnZndDtcIjpcIj7ig5JcIixcIiZudmluZmluO1wiOlwi4qeeXCIsXCImbnZsQXJyO1wiOlwi4qSCXCIsXCImbnZsZTtcIjpcIuKJpOKDklwiLFwiJm52bHQ7XCI6XCI84oOSXCIsXCImbnZsdHJpZTtcIjpcIuKKtOKDklwiLFwiJm52ckFycjtcIjpcIuKkg1wiLFwiJm52cnRyaWU7XCI6XCLiirXig5JcIixcIiZudnNpbTtcIjpcIuKIvOKDklwiLFwiJm53QXJyO1wiOlwi4oeWXCIsXCImbndhcmhrO1wiOlwi4qSjXCIsXCImbndhcnI7XCI6XCLihpZcIixcIiZud2Fycm93O1wiOlwi4oaWXCIsXCImbnduZWFyO1wiOlwi4qSnXCIsXCImb1M7XCI6XCLik4hcIixcIiZvYWN1dGVcIjpcIsOzXCIsXCImb2FjdXRlO1wiOlwiw7NcIixcIiZvYXN0O1wiOlwi4oqbXCIsXCImb2NpcjtcIjpcIuKKmlwiLFwiJm9jaXJjXCI6XCLDtFwiLFwiJm9jaXJjO1wiOlwiw7RcIixcIiZvY3k7XCI6XCLQvlwiLFwiJm9kYXNoO1wiOlwi4oqdXCIsXCImb2RibGFjO1wiOlwixZFcIixcIiZvZGl2O1wiOlwi4qi4XCIsXCImb2RvdDtcIjpcIuKKmVwiLFwiJm9kc29sZDtcIjpcIuKmvFwiLFwiJm9lbGlnO1wiOlwixZNcIixcIiZvZmNpcjtcIjpcIuKmv1wiLFwiJm9mcjtcIjpcIvCdlKxcIixcIiZvZ29uO1wiOlwiy5tcIixcIiZvZ3JhdmVcIjpcIsOyXCIsXCImb2dyYXZlO1wiOlwiw7JcIixcIiZvZ3Q7XCI6XCLip4FcIixcIiZvaGJhcjtcIjpcIuKmtVwiLFwiJm9obTtcIjpcIs6pXCIsXCImb2ludDtcIjpcIuKIrlwiLFwiJm9sYXJyO1wiOlwi4oa6XCIsXCImb2xjaXI7XCI6XCLipr5cIixcIiZvbGNyb3NzO1wiOlwi4qa7XCIsXCImb2xpbmU7XCI6XCLigL5cIixcIiZvbHQ7XCI6XCLip4BcIixcIiZvbWFjcjtcIjpcIsWNXCIsXCImb21lZ2E7XCI6XCLPiVwiLFwiJm9taWNyb247XCI6XCLOv1wiLFwiJm9taWQ7XCI6XCLiprZcIixcIiZvbWludXM7XCI6XCLiipZcIixcIiZvb3BmO1wiOlwi8J2VoFwiLFwiJm9wYXI7XCI6XCLiprdcIixcIiZvcGVycDtcIjpcIuKmuVwiLFwiJm9wbHVzO1wiOlwi4oqVXCIsXCImb3I7XCI6XCLiiKhcIixcIiZvcmFycjtcIjpcIuKGu1wiLFwiJm9yZDtcIjpcIuKpnVwiLFwiJm9yZGVyO1wiOlwi4oS0XCIsXCImb3JkZXJvZjtcIjpcIuKEtFwiLFwiJm9yZGZcIjpcIsKqXCIsXCImb3JkZjtcIjpcIsKqXCIsXCImb3JkbVwiOlwiwrpcIixcIiZvcmRtO1wiOlwiwrpcIixcIiZvcmlnb2Y7XCI6XCLiirZcIixcIiZvcm9yO1wiOlwi4qmWXCIsXCImb3JzbG9wZTtcIjpcIuKpl1wiLFwiJm9ydjtcIjpcIuKpm1wiLFwiJm9zY3I7XCI6XCLihLRcIixcIiZvc2xhc2hcIjpcIsO4XCIsXCImb3NsYXNoO1wiOlwiw7hcIixcIiZvc29sO1wiOlwi4oqYXCIsXCImb3RpbGRlXCI6XCLDtVwiLFwiJm90aWxkZTtcIjpcIsO1XCIsXCImb3RpbWVzO1wiOlwi4oqXXCIsXCImb3RpbWVzYXM7XCI6XCLiqLZcIixcIiZvdW1sXCI6XCLDtlwiLFwiJm91bWw7XCI6XCLDtlwiLFwiJm92YmFyO1wiOlwi4oy9XCIsXCImcGFyO1wiOlwi4oilXCIsXCImcGFyYVwiOlwiwrZcIixcIiZwYXJhO1wiOlwiwrZcIixcIiZwYXJhbGxlbDtcIjpcIuKIpVwiLFwiJnBhcnNpbTtcIjpcIuKrs1wiLFwiJnBhcnNsO1wiOlwi4qu9XCIsXCImcGFydDtcIjpcIuKIglwiLFwiJnBjeTtcIjpcItC/XCIsXCImcGVyY250O1wiOlwiJVwiLFwiJnBlcmlvZDtcIjpcIi5cIixcIiZwZXJtaWw7XCI6XCLigLBcIixcIiZwZXJwO1wiOlwi4oqlXCIsXCImcGVydGVuaztcIjpcIuKAsVwiLFwiJnBmcjtcIjpcIvCdlK1cIixcIiZwaGk7XCI6XCLPhlwiLFwiJnBoaXY7XCI6XCLPlVwiLFwiJnBobW1hdDtcIjpcIuKEs1wiLFwiJnBob25lO1wiOlwi4piOXCIsXCImcGk7XCI6XCLPgFwiLFwiJnBpdGNoZm9yaztcIjpcIuKLlFwiLFwiJnBpdjtcIjpcIs+WXCIsXCImcGxhbmNrO1wiOlwi4oSPXCIsXCImcGxhbmNraDtcIjpcIuKEjlwiLFwiJnBsYW5rdjtcIjpcIuKEj1wiLFwiJnBsdXM7XCI6XCIrXCIsXCImcGx1c2FjaXI7XCI6XCLiqKNcIixcIiZwbHVzYjtcIjpcIuKKnlwiLFwiJnBsdXNjaXI7XCI6XCLiqKJcIixcIiZwbHVzZG87XCI6XCLiiJRcIixcIiZwbHVzZHU7XCI6XCLiqKVcIixcIiZwbHVzZTtcIjpcIuKpslwiLFwiJnBsdXNtblwiOlwiwrFcIixcIiZwbHVzbW47XCI6XCLCsVwiLFwiJnBsdXNzaW07XCI6XCLiqKZcIixcIiZwbHVzdHdvO1wiOlwi4qinXCIsXCImcG07XCI6XCLCsVwiLFwiJnBvaW50aW50O1wiOlwi4qiVXCIsXCImcG9wZjtcIjpcIvCdlaFcIixcIiZwb3VuZFwiOlwiwqNcIixcIiZwb3VuZDtcIjpcIsKjXCIsXCImcHI7XCI6XCLiibpcIixcIiZwckU7XCI6XCLiqrNcIixcIiZwcmFwO1wiOlwi4qq3XCIsXCImcHJjdWU7XCI6XCLiibxcIixcIiZwcmU7XCI6XCLiqq9cIixcIiZwcmVjO1wiOlwi4om6XCIsXCImcHJlY2FwcHJveDtcIjpcIuKqt1wiLFwiJnByZWNjdXJseWVxO1wiOlwi4om8XCIsXCImcHJlY2VxO1wiOlwi4qqvXCIsXCImcHJlY25hcHByb3g7XCI6XCLiqrlcIixcIiZwcmVjbmVxcTtcIjpcIuKqtVwiLFwiJnByZWNuc2ltO1wiOlwi4ouoXCIsXCImcHJlY3NpbTtcIjpcIuKJvlwiLFwiJnByaW1lO1wiOlwi4oCyXCIsXCImcHJpbWVzO1wiOlwi4oSZXCIsXCImcHJuRTtcIjpcIuKqtVwiLFwiJnBybmFwO1wiOlwi4qq5XCIsXCImcHJuc2ltO1wiOlwi4ouoXCIsXCImcHJvZDtcIjpcIuKIj1wiLFwiJnByb2ZhbGFyO1wiOlwi4oyuXCIsXCImcHJvZmxpbmU7XCI6XCLijJJcIixcIiZwcm9mc3VyZjtcIjpcIuKMk1wiLFwiJnByb3A7XCI6XCLiiJ1cIixcIiZwcm9wdG87XCI6XCLiiJ1cIixcIiZwcnNpbTtcIjpcIuKJvlwiLFwiJnBydXJlbDtcIjpcIuKKsFwiLFwiJnBzY3I7XCI6XCLwnZOFXCIsXCImcHNpO1wiOlwiz4hcIixcIiZwdW5jc3A7XCI6XCLigIhcIixcIiZxZnI7XCI6XCLwnZSuXCIsXCImcWludDtcIjpcIuKojFwiLFwiJnFvcGY7XCI6XCLwnZWiXCIsXCImcXByaW1lO1wiOlwi4oGXXCIsXCImcXNjcjtcIjpcIvCdk4ZcIixcIiZxdWF0ZXJuaW9ucztcIjpcIuKEjVwiLFwiJnF1YXRpbnQ7XCI6XCLiqJZcIixcIiZxdWVzdDtcIjpcIj9cIixcIiZxdWVzdGVxO1wiOlwi4omfXCIsXCImcXVvdFwiOidcIicsXCImcXVvdDtcIjonXCInLFwiJnJBYXJyO1wiOlwi4oebXCIsXCImckFycjtcIjpcIuKHklwiLFwiJnJBdGFpbDtcIjpcIuKknFwiLFwiJnJCYXJyO1wiOlwi4qSPXCIsXCImckhhcjtcIjpcIuKlpFwiLFwiJnJhY2U7XCI6XCLiiL3MsVwiLFwiJnJhY3V0ZTtcIjpcIsWVXCIsXCImcmFkaWM7XCI6XCLiiJpcIixcIiZyYWVtcHR5djtcIjpcIuKms1wiLFwiJnJhbmc7XCI6XCLin6lcIixcIiZyYW5nZDtcIjpcIuKmklwiLFwiJnJhbmdlO1wiOlwi4qalXCIsXCImcmFuZ2xlO1wiOlwi4p+pXCIsXCImcmFxdW9cIjpcIsK7XCIsXCImcmFxdW87XCI6XCLCu1wiLFwiJnJhcnI7XCI6XCLihpJcIixcIiZyYXJyYXA7XCI6XCLipbVcIixcIiZyYXJyYjtcIjpcIuKHpVwiLFwiJnJhcnJiZnM7XCI6XCLipKBcIixcIiZyYXJyYztcIjpcIuKks1wiLFwiJnJhcnJmcztcIjpcIuKknlwiLFwiJnJhcnJoaztcIjpcIuKGqlwiLFwiJnJhcnJscDtcIjpcIuKGrFwiLFwiJnJhcnJwbDtcIjpcIuKlhVwiLFwiJnJhcnJzaW07XCI6XCLipbRcIixcIiZyYXJydGw7XCI6XCLihqNcIixcIiZyYXJydztcIjpcIuKGnVwiLFwiJnJhdGFpbDtcIjpcIuKkmlwiLFwiJnJhdGlvO1wiOlwi4oi2XCIsXCImcmF0aW9uYWxzO1wiOlwi4oSaXCIsXCImcmJhcnI7XCI6XCLipI1cIixcIiZyYmJyaztcIjpcIuKds1wiLFwiJnJicmFjZTtcIjpcIn1cIixcIiZyYnJhY2s7XCI6XCJdXCIsXCImcmJya2U7XCI6XCLipoxcIixcIiZyYnJrc2xkO1wiOlwi4qaOXCIsXCImcmJya3NsdTtcIjpcIuKmkFwiLFwiJnJjYXJvbjtcIjpcIsWZXCIsXCImcmNlZGlsO1wiOlwixZdcIixcIiZyY2VpbDtcIjpcIuKMiVwiLFwiJnJjdWI7XCI6XCJ9XCIsXCImcmN5O1wiOlwi0YBcIixcIiZyZGNhO1wiOlwi4qS3XCIsXCImcmRsZGhhcjtcIjpcIuKlqVwiLFwiJnJkcXVvO1wiOlwi4oCdXCIsXCImcmRxdW9yO1wiOlwi4oCdXCIsXCImcmRzaDtcIjpcIuKGs1wiLFwiJnJlYWw7XCI6XCLihJxcIixcIiZyZWFsaW5lO1wiOlwi4oSbXCIsXCImcmVhbHBhcnQ7XCI6XCLihJxcIixcIiZyZWFscztcIjpcIuKEnVwiLFwiJnJlY3Q7XCI6XCLilq1cIixcIiZyZWdcIjpcIsKuXCIsXCImcmVnO1wiOlwiwq5cIixcIiZyZmlzaHQ7XCI6XCLipb1cIixcIiZyZmxvb3I7XCI6XCLijItcIixcIiZyZnI7XCI6XCLwnZSvXCIsXCImcmhhcmQ7XCI6XCLih4FcIixcIiZyaGFydTtcIjpcIuKHgFwiLFwiJnJoYXJ1bDtcIjpcIuKlrFwiLFwiJnJobztcIjpcIs+BXCIsXCImcmhvdjtcIjpcIs+xXCIsXCImcmlnaHRhcnJvdztcIjpcIuKGklwiLFwiJnJpZ2h0YXJyb3d0YWlsO1wiOlwi4oajXCIsXCImcmlnaHRoYXJwb29uZG93bjtcIjpcIuKHgVwiLFwiJnJpZ2h0aGFycG9vbnVwO1wiOlwi4oeAXCIsXCImcmlnaHRsZWZ0YXJyb3dzO1wiOlwi4oeEXCIsXCImcmlnaHRsZWZ0aGFycG9vbnM7XCI6XCLih4xcIixcIiZyaWdodHJpZ2h0YXJyb3dzO1wiOlwi4oeJXCIsXCImcmlnaHRzcXVpZ2Fycm93O1wiOlwi4oadXCIsXCImcmlnaHR0aHJlZXRpbWVzO1wiOlwi4ouMXCIsXCImcmluZztcIjpcIsuaXCIsXCImcmlzaW5nZG90c2VxO1wiOlwi4omTXCIsXCImcmxhcnI7XCI6XCLih4RcIixcIiZybGhhcjtcIjpcIuKHjFwiLFwiJnJsbTtcIjpcIuKAj1wiLFwiJnJtb3VzdDtcIjpcIuKOsVwiLFwiJnJtb3VzdGFjaGU7XCI6XCLijrFcIixcIiZybm1pZDtcIjpcIuKrrlwiLFwiJnJvYW5nO1wiOlwi4p+tXCIsXCImcm9hcnI7XCI6XCLih75cIixcIiZyb2JyaztcIjpcIuKfp1wiLFwiJnJvcGFyO1wiOlwi4qaGXCIsXCImcm9wZjtcIjpcIvCdlaNcIixcIiZyb3BsdXM7XCI6XCLiqK5cIixcIiZyb3RpbWVzO1wiOlwi4qi1XCIsXCImcnBhcjtcIjpcIilcIixcIiZycGFyZ3Q7XCI6XCLippRcIixcIiZycHBvbGludDtcIjpcIuKoklwiLFwiJnJyYXJyO1wiOlwi4oeJXCIsXCImcnNhcXVvO1wiOlwi4oC6XCIsXCImcnNjcjtcIjpcIvCdk4dcIixcIiZyc2g7XCI6XCLihrFcIixcIiZyc3FiO1wiOlwiXVwiLFwiJnJzcXVvO1wiOlwi4oCZXCIsXCImcnNxdW9yO1wiOlwi4oCZXCIsXCImcnRocmVlO1wiOlwi4ouMXCIsXCImcnRpbWVzO1wiOlwi4ouKXCIsXCImcnRyaTtcIjpcIuKWuVwiLFwiJnJ0cmllO1wiOlwi4oq1XCIsXCImcnRyaWY7XCI6XCLilrhcIixcIiZydHJpbHRyaTtcIjpcIuKnjlwiLFwiJnJ1bHVoYXI7XCI6XCLipahcIixcIiZyeDtcIjpcIuKEnlwiLFwiJnNhY3V0ZTtcIjpcIsWbXCIsXCImc2JxdW87XCI6XCLigJpcIixcIiZzYztcIjpcIuKJu1wiLFwiJnNjRTtcIjpcIuKqtFwiLFwiJnNjYXA7XCI6XCLiqrhcIixcIiZzY2Fyb247XCI6XCLFoVwiLFwiJnNjY3VlO1wiOlwi4om9XCIsXCImc2NlO1wiOlwi4qqwXCIsXCImc2NlZGlsO1wiOlwixZ9cIixcIiZzY2lyYztcIjpcIsWdXCIsXCImc2NuRTtcIjpcIuKqtlwiLFwiJnNjbmFwO1wiOlwi4qq6XCIsXCImc2Nuc2ltO1wiOlwi4oupXCIsXCImc2Nwb2xpbnQ7XCI6XCLiqJNcIixcIiZzY3NpbTtcIjpcIuKJv1wiLFwiJnNjeTtcIjpcItGBXCIsXCImc2RvdDtcIjpcIuKLhVwiLFwiJnNkb3RiO1wiOlwi4oqhXCIsXCImc2RvdGU7XCI6XCLiqaZcIixcIiZzZUFycjtcIjpcIuKHmFwiLFwiJnNlYXJoaztcIjpcIuKkpVwiLFwiJnNlYXJyO1wiOlwi4oaYXCIsXCImc2VhcnJvdztcIjpcIuKGmFwiLFwiJnNlY3RcIjpcIsKnXCIsXCImc2VjdDtcIjpcIsKnXCIsXCImc2VtaTtcIjpcIjtcIixcIiZzZXN3YXI7XCI6XCLipKlcIixcIiZzZXRtaW51cztcIjpcIuKIllwiLFwiJnNldG1uO1wiOlwi4oiWXCIsXCImc2V4dDtcIjpcIuKctlwiLFwiJnNmcjtcIjpcIvCdlLBcIixcIiZzZnJvd247XCI6XCLijKJcIixcIiZzaGFycDtcIjpcIuKZr1wiLFwiJnNoY2hjeTtcIjpcItGJXCIsXCImc2hjeTtcIjpcItGIXCIsXCImc2hvcnRtaWQ7XCI6XCLiiKNcIixcIiZzaG9ydHBhcmFsbGVsO1wiOlwi4oilXCIsXCImc2h5XCI6XCLCrVwiLFwiJnNoeTtcIjpcIsKtXCIsXCImc2lnbWE7XCI6XCLPg1wiLFwiJnNpZ21hZjtcIjpcIs+CXCIsXCImc2lnbWF2O1wiOlwiz4JcIixcIiZzaW07XCI6XCLiiLxcIixcIiZzaW1kb3Q7XCI6XCLiqapcIixcIiZzaW1lO1wiOlwi4omDXCIsXCImc2ltZXE7XCI6XCLiiYNcIixcIiZzaW1nO1wiOlwi4qqeXCIsXCImc2ltZ0U7XCI6XCLiqqBcIixcIiZzaW1sO1wiOlwi4qqdXCIsXCImc2ltbEU7XCI6XCLiqp9cIixcIiZzaW1uZTtcIjpcIuKJhlwiLFwiJnNpbXBsdXM7XCI6XCLiqKRcIixcIiZzaW1yYXJyO1wiOlwi4qWyXCIsXCImc2xhcnI7XCI6XCLihpBcIixcIiZzbWFsbHNldG1pbnVzO1wiOlwi4oiWXCIsXCImc21hc2hwO1wiOlwi4qizXCIsXCImc21lcGFyc2w7XCI6XCLip6RcIixcIiZzbWlkO1wiOlwi4oijXCIsXCImc21pbGU7XCI6XCLijKNcIixcIiZzbXQ7XCI6XCLiqqpcIixcIiZzbXRlO1wiOlwi4qqsXCIsXCImc210ZXM7XCI6XCLiqqzvuIBcIixcIiZzb2Z0Y3k7XCI6XCLRjFwiLFwiJnNvbDtcIjpcIi9cIixcIiZzb2xiO1wiOlwi4qeEXCIsXCImc29sYmFyO1wiOlwi4oy/XCIsXCImc29wZjtcIjpcIvCdlaRcIixcIiZzcGFkZXM7XCI6XCLimaBcIixcIiZzcGFkZXN1aXQ7XCI6XCLimaBcIixcIiZzcGFyO1wiOlwi4oilXCIsXCImc3FjYXA7XCI6XCLiipNcIixcIiZzcWNhcHM7XCI6XCLiipPvuIBcIixcIiZzcWN1cDtcIjpcIuKKlFwiLFwiJnNxY3VwcztcIjpcIuKKlO+4gFwiLFwiJnNxc3ViO1wiOlwi4oqPXCIsXCImc3FzdWJlO1wiOlwi4oqRXCIsXCImc3FzdWJzZXQ7XCI6XCLiio9cIixcIiZzcXN1YnNldGVxO1wiOlwi4oqRXCIsXCImc3FzdXA7XCI6XCLiipBcIixcIiZzcXN1cGU7XCI6XCLiipJcIixcIiZzcXN1cHNldDtcIjpcIuKKkFwiLFwiJnNxc3Vwc2V0ZXE7XCI6XCLiipJcIixcIiZzcXU7XCI6XCLilqFcIixcIiZzcXVhcmU7XCI6XCLilqFcIixcIiZzcXVhcmY7XCI6XCLilqpcIixcIiZzcXVmO1wiOlwi4paqXCIsXCImc3JhcnI7XCI6XCLihpJcIixcIiZzc2NyO1wiOlwi8J2TiFwiLFwiJnNzZXRtbjtcIjpcIuKIllwiLFwiJnNzbWlsZTtcIjpcIuKMo1wiLFwiJnNzdGFyZjtcIjpcIuKLhlwiLFwiJnN0YXI7XCI6XCLimIZcIixcIiZzdGFyZjtcIjpcIuKYhVwiLFwiJnN0cmFpZ2h0ZXBzaWxvbjtcIjpcIs+1XCIsXCImc3RyYWlnaHRwaGk7XCI6XCLPlVwiLFwiJnN0cm5zO1wiOlwiwq9cIixcIiZzdWI7XCI6XCLiioJcIixcIiZzdWJFO1wiOlwi4quFXCIsXCImc3ViZG90O1wiOlwi4qq9XCIsXCImc3ViZTtcIjpcIuKKhlwiLFwiJnN1YmVkb3Q7XCI6XCLiq4NcIixcIiZzdWJtdWx0O1wiOlwi4quBXCIsXCImc3VibkU7XCI6XCLiq4tcIixcIiZzdWJuZTtcIjpcIuKKilwiLFwiJnN1YnBsdXM7XCI6XCLiqr9cIixcIiZzdWJyYXJyO1wiOlwi4qW5XCIsXCImc3Vic2V0O1wiOlwi4oqCXCIsXCImc3Vic2V0ZXE7XCI6XCLiioZcIixcIiZzdWJzZXRlcXE7XCI6XCLiq4VcIixcIiZzdWJzZXRuZXE7XCI6XCLiiopcIixcIiZzdWJzZXRuZXFxO1wiOlwi4quLXCIsXCImc3Vic2ltO1wiOlwi4quHXCIsXCImc3Vic3ViO1wiOlwi4quVXCIsXCImc3Vic3VwO1wiOlwi4quTXCIsXCImc3VjYztcIjpcIuKJu1wiLFwiJnN1Y2NhcHByb3g7XCI6XCLiqrhcIixcIiZzdWNjY3VybHllcTtcIjpcIuKJvVwiLFwiJnN1Y2NlcTtcIjpcIuKqsFwiLFwiJnN1Y2NuYXBwcm94O1wiOlwi4qq6XCIsXCImc3VjY25lcXE7XCI6XCLiqrZcIixcIiZzdWNjbnNpbTtcIjpcIuKLqVwiLFwiJnN1Y2NzaW07XCI6XCLiib9cIixcIiZzdW07XCI6XCLiiJFcIixcIiZzdW5nO1wiOlwi4pmqXCIsXCImc3VwMVwiOlwiwrlcIixcIiZzdXAxO1wiOlwiwrlcIixcIiZzdXAyXCI6XCLCslwiLFwiJnN1cDI7XCI6XCLCslwiLFwiJnN1cDNcIjpcIsKzXCIsXCImc3VwMztcIjpcIsKzXCIsXCImc3VwO1wiOlwi4oqDXCIsXCImc3VwRTtcIjpcIuKrhlwiLFwiJnN1cGRvdDtcIjpcIuKqvlwiLFwiJnN1cGRzdWI7XCI6XCLiq5hcIixcIiZzdXBlO1wiOlwi4oqHXCIsXCImc3VwZWRvdDtcIjpcIuKrhFwiLFwiJnN1cGhzb2w7XCI6XCLin4lcIixcIiZzdXBoc3ViO1wiOlwi4quXXCIsXCImc3VwbGFycjtcIjpcIuKlu1wiLFwiJnN1cG11bHQ7XCI6XCLiq4JcIixcIiZzdXBuRTtcIjpcIuKrjFwiLFwiJnN1cG5lO1wiOlwi4oqLXCIsXCImc3VwcGx1cztcIjpcIuKrgFwiLFwiJnN1cHNldDtcIjpcIuKKg1wiLFwiJnN1cHNldGVxO1wiOlwi4oqHXCIsXCImc3Vwc2V0ZXFxO1wiOlwi4quGXCIsXCImc3Vwc2V0bmVxO1wiOlwi4oqLXCIsXCImc3Vwc2V0bmVxcTtcIjpcIuKrjFwiLFwiJnN1cHNpbTtcIjpcIuKriFwiLFwiJnN1cHN1YjtcIjpcIuKrlFwiLFwiJnN1cHN1cDtcIjpcIuKrllwiLFwiJnN3QXJyO1wiOlwi4oeZXCIsXCImc3dhcmhrO1wiOlwi4qSmXCIsXCImc3dhcnI7XCI6XCLihplcIixcIiZzd2Fycm93O1wiOlwi4oaZXCIsXCImc3dud2FyO1wiOlwi4qSqXCIsXCImc3psaWdcIjpcIsOfXCIsXCImc3psaWc7XCI6XCLDn1wiLFwiJnRhcmdldDtcIjpcIuKMllwiLFwiJnRhdTtcIjpcIs+EXCIsXCImdGJyaztcIjpcIuKOtFwiLFwiJnRjYXJvbjtcIjpcIsWlXCIsXCImdGNlZGlsO1wiOlwixaNcIixcIiZ0Y3k7XCI6XCLRglwiLFwiJnRkb3Q7XCI6XCLig5tcIixcIiZ0ZWxyZWM7XCI6XCLijJVcIixcIiZ0ZnI7XCI6XCLwnZSxXCIsXCImdGhlcmU0O1wiOlwi4oi0XCIsXCImdGhlcmVmb3JlO1wiOlwi4oi0XCIsXCImdGhldGE7XCI6XCLOuFwiLFwiJnRoZXRhc3ltO1wiOlwiz5FcIixcIiZ0aGV0YXY7XCI6XCLPkVwiLFwiJnRoaWNrYXBwcm94O1wiOlwi4omIXCIsXCImdGhpY2tzaW07XCI6XCLiiLxcIixcIiZ0aGluc3A7XCI6XCLigIlcIixcIiZ0aGthcDtcIjpcIuKJiFwiLFwiJnRoa3NpbTtcIjpcIuKIvFwiLFwiJnRob3JuXCI6XCLDvlwiLFwiJnRob3JuO1wiOlwiw75cIixcIiZ0aWxkZTtcIjpcIsucXCIsXCImdGltZXNcIjpcIsOXXCIsXCImdGltZXM7XCI6XCLDl1wiLFwiJnRpbWVzYjtcIjpcIuKKoFwiLFwiJnRpbWVzYmFyO1wiOlwi4qixXCIsXCImdGltZXNkO1wiOlwi4qiwXCIsXCImdGludDtcIjpcIuKIrVwiLFwiJnRvZWE7XCI6XCLipKhcIixcIiZ0b3A7XCI6XCLiiqRcIixcIiZ0b3Bib3Q7XCI6XCLijLZcIixcIiZ0b3BjaXI7XCI6XCLiq7FcIixcIiZ0b3BmO1wiOlwi8J2VpVwiLFwiJnRvcGZvcms7XCI6XCLiq5pcIixcIiZ0b3NhO1wiOlwi4qSpXCIsXCImdHByaW1lO1wiOlwi4oC0XCIsXCImdHJhZGU7XCI6XCLihKJcIixcIiZ0cmlhbmdsZTtcIjpcIuKWtVwiLFwiJnRyaWFuZ2xlZG93bjtcIjpcIuKWv1wiLFwiJnRyaWFuZ2xlbGVmdDtcIjpcIuKXg1wiLFwiJnRyaWFuZ2xlbGVmdGVxO1wiOlwi4oq0XCIsXCImdHJpYW5nbGVxO1wiOlwi4omcXCIsXCImdHJpYW5nbGVyaWdodDtcIjpcIuKWuVwiLFwiJnRyaWFuZ2xlcmlnaHRlcTtcIjpcIuKKtVwiLFwiJnRyaWRvdDtcIjpcIuKXrFwiLFwiJnRyaWU7XCI6XCLiiZxcIixcIiZ0cmltaW51cztcIjpcIuKoulwiLFwiJnRyaXBsdXM7XCI6XCLiqLlcIixcIiZ0cmlzYjtcIjpcIuKnjVwiLFwiJnRyaXRpbWU7XCI6XCLiqLtcIixcIiZ0cnBleml1bTtcIjpcIuKPolwiLFwiJnRzY3I7XCI6XCLwnZOJXCIsXCImdHNjeTtcIjpcItGGXCIsXCImdHNoY3k7XCI6XCLRm1wiLFwiJnRzdHJvaztcIjpcIsWnXCIsXCImdHdpeHQ7XCI6XCLiiaxcIixcIiZ0d29oZWFkbGVmdGFycm93O1wiOlwi4oaeXCIsXCImdHdvaGVhZHJpZ2h0YXJyb3c7XCI6XCLihqBcIixcIiZ1QXJyO1wiOlwi4oeRXCIsXCImdUhhcjtcIjpcIuKlo1wiLFwiJnVhY3V0ZVwiOlwiw7pcIixcIiZ1YWN1dGU7XCI6XCLDulwiLFwiJnVhcnI7XCI6XCLihpFcIixcIiZ1YnJjeTtcIjpcItGeXCIsXCImdWJyZXZlO1wiOlwixa1cIixcIiZ1Y2lyY1wiOlwiw7tcIixcIiZ1Y2lyYztcIjpcIsO7XCIsXCImdWN5O1wiOlwi0YNcIixcIiZ1ZGFycjtcIjpcIuKHhVwiLFwiJnVkYmxhYztcIjpcIsWxXCIsXCImdWRoYXI7XCI6XCLipa5cIixcIiZ1ZmlzaHQ7XCI6XCLipb5cIixcIiZ1ZnI7XCI6XCLwnZSyXCIsXCImdWdyYXZlXCI6XCLDuVwiLFwiJnVncmF2ZTtcIjpcIsO5XCIsXCImdWhhcmw7XCI6XCLihr9cIixcIiZ1aGFycjtcIjpcIuKGvlwiLFwiJnVoYmxrO1wiOlwi4paAXCIsXCImdWxjb3JuO1wiOlwi4oycXCIsXCImdWxjb3JuZXI7XCI6XCLijJxcIixcIiZ1bGNyb3A7XCI6XCLijI9cIixcIiZ1bHRyaTtcIjpcIuKXuFwiLFwiJnVtYWNyO1wiOlwixatcIixcIiZ1bWxcIjpcIsKoXCIsXCImdW1sO1wiOlwiwqhcIixcIiZ1b2dvbjtcIjpcIsWzXCIsXCImdW9wZjtcIjpcIvCdlaZcIixcIiZ1cGFycm93O1wiOlwi4oaRXCIsXCImdXBkb3duYXJyb3c7XCI6XCLihpVcIixcIiZ1cGhhcnBvb25sZWZ0O1wiOlwi4oa/XCIsXCImdXBoYXJwb29ucmlnaHQ7XCI6XCLihr5cIixcIiZ1cGx1cztcIjpcIuKKjlwiLFwiJnVwc2k7XCI6XCLPhVwiLFwiJnVwc2loO1wiOlwiz5JcIixcIiZ1cHNpbG9uO1wiOlwiz4VcIixcIiZ1cHVwYXJyb3dzO1wiOlwi4oeIXCIsXCImdXJjb3JuO1wiOlwi4oydXCIsXCImdXJjb3JuZXI7XCI6XCLijJ1cIixcIiZ1cmNyb3A7XCI6XCLijI5cIixcIiZ1cmluZztcIjpcIsWvXCIsXCImdXJ0cmk7XCI6XCLil7lcIixcIiZ1c2NyO1wiOlwi8J2TilwiLFwiJnV0ZG90O1wiOlwi4ouwXCIsXCImdXRpbGRlO1wiOlwixalcIixcIiZ1dHJpO1wiOlwi4pa1XCIsXCImdXRyaWY7XCI6XCLilrRcIixcIiZ1dWFycjtcIjpcIuKHiFwiLFwiJnV1bWxcIjpcIsO8XCIsXCImdXVtbDtcIjpcIsO8XCIsXCImdXdhbmdsZTtcIjpcIuKmp1wiLFwiJnZBcnI7XCI6XCLih5VcIixcIiZ2QmFyO1wiOlwi4quoXCIsXCImdkJhcnY7XCI6XCLiq6lcIixcIiZ2RGFzaDtcIjpcIuKKqFwiLFwiJnZhbmdydDtcIjpcIuKmnFwiLFwiJnZhcmVwc2lsb247XCI6XCLPtVwiLFwiJnZhcmthcHBhO1wiOlwiz7BcIixcIiZ2YXJub3RoaW5nO1wiOlwi4oiFXCIsXCImdmFycGhpO1wiOlwiz5VcIixcIiZ2YXJwaTtcIjpcIs+WXCIsXCImdmFycHJvcHRvO1wiOlwi4oidXCIsXCImdmFycjtcIjpcIuKGlVwiLFwiJnZhcnJobztcIjpcIs+xXCIsXCImdmFyc2lnbWE7XCI6XCLPglwiLFwiJnZhcnN1YnNldG5lcTtcIjpcIuKKiu+4gFwiLFwiJnZhcnN1YnNldG5lcXE7XCI6XCLiq4vvuIBcIixcIiZ2YXJzdXBzZXRuZXE7XCI6XCLiiovvuIBcIixcIiZ2YXJzdXBzZXRuZXFxO1wiOlwi4quM77iAXCIsXCImdmFydGhldGE7XCI6XCLPkVwiLFwiJnZhcnRyaWFuZ2xlbGVmdDtcIjpcIuKKslwiLFwiJnZhcnRyaWFuZ2xlcmlnaHQ7XCI6XCLiirNcIixcIiZ2Y3k7XCI6XCLQslwiLFwiJnZkYXNoO1wiOlwi4oqiXCIsXCImdmVlO1wiOlwi4oioXCIsXCImdmVlYmFyO1wiOlwi4oq7XCIsXCImdmVlZXE7XCI6XCLiiZpcIixcIiZ2ZWxsaXA7XCI6XCLii65cIixcIiZ2ZXJiYXI7XCI6XCJ8XCIsXCImdmVydDtcIjpcInxcIixcIiZ2ZnI7XCI6XCLwnZSzXCIsXCImdmx0cmk7XCI6XCLiirJcIixcIiZ2bnN1YjtcIjpcIuKKguKDklwiLFwiJnZuc3VwO1wiOlwi4oqD4oOSXCIsXCImdm9wZjtcIjpcIvCdladcIixcIiZ2cHJvcDtcIjpcIuKInVwiLFwiJnZydHJpO1wiOlwi4oqzXCIsXCImdnNjcjtcIjpcIvCdk4tcIixcIiZ2c3VibkU7XCI6XCLiq4vvuIBcIixcIiZ2c3VibmU7XCI6XCLiiorvuIBcIixcIiZ2c3VwbkU7XCI6XCLiq4zvuIBcIixcIiZ2c3VwbmU7XCI6XCLiiovvuIBcIixcIiZ2emlnemFnO1wiOlwi4qaaXCIsXCImd2NpcmM7XCI6XCLFtVwiLFwiJndlZGJhcjtcIjpcIuKpn1wiLFwiJndlZGdlO1wiOlwi4oinXCIsXCImd2VkZ2VxO1wiOlwi4omZXCIsXCImd2VpZXJwO1wiOlwi4oSYXCIsXCImd2ZyO1wiOlwi8J2UtFwiLFwiJndvcGY7XCI6XCLwnZWoXCIsXCImd3A7XCI6XCLihJhcIixcIiZ3cjtcIjpcIuKJgFwiLFwiJndyZWF0aDtcIjpcIuKJgFwiLFwiJndzY3I7XCI6XCLwnZOMXCIsXCImeGNhcDtcIjpcIuKLglwiLFwiJnhjaXJjO1wiOlwi4pevXCIsXCImeGN1cDtcIjpcIuKLg1wiLFwiJnhkdHJpO1wiOlwi4pa9XCIsXCImeGZyO1wiOlwi8J2UtVwiLFwiJnhoQXJyO1wiOlwi4p+6XCIsXCImeGhhcnI7XCI6XCLin7dcIixcIiZ4aTtcIjpcIs6+XCIsXCImeGxBcnI7XCI6XCLin7hcIixcIiZ4bGFycjtcIjpcIuKftVwiLFwiJnhtYXA7XCI6XCLin7xcIixcIiZ4bmlzO1wiOlwi4ou7XCIsXCImeG9kb3Q7XCI6XCLiqIBcIixcIiZ4b3BmO1wiOlwi8J2VqVwiLFwiJnhvcGx1cztcIjpcIuKogVwiLFwiJnhvdGltZTtcIjpcIuKoglwiLFwiJnhyQXJyO1wiOlwi4p+5XCIsXCImeHJhcnI7XCI6XCLin7ZcIixcIiZ4c2NyO1wiOlwi8J2TjVwiLFwiJnhzcWN1cDtcIjpcIuKohlwiLFwiJnh1cGx1cztcIjpcIuKohFwiLFwiJnh1dHJpO1wiOlwi4pazXCIsXCImeHZlZTtcIjpcIuKLgVwiLFwiJnh3ZWRnZTtcIjpcIuKLgFwiLFwiJnlhY3V0ZVwiOlwiw71cIixcIiZ5YWN1dGU7XCI6XCLDvVwiLFwiJnlhY3k7XCI6XCLRj1wiLFwiJnljaXJjO1wiOlwixbdcIixcIiZ5Y3k7XCI6XCLRi1wiLFwiJnllblwiOlwiwqVcIixcIiZ5ZW47XCI6XCLCpVwiLFwiJnlmcjtcIjpcIvCdlLZcIixcIiZ5aWN5O1wiOlwi0ZdcIixcIiZ5b3BmO1wiOlwi8J2VqlwiLFwiJnlzY3I7XCI6XCLwnZOOXCIsXCImeXVjeTtcIjpcItGOXCIsXCImeXVtbFwiOlwiw79cIixcIiZ5dW1sO1wiOlwiw79cIixcIiZ6YWN1dGU7XCI6XCLFulwiLFwiJnpjYXJvbjtcIjpcIsW+XCIsXCImemN5O1wiOlwi0LdcIixcIiZ6ZG90O1wiOlwixbxcIixcIiZ6ZWV0cmY7XCI6XCLihKhcIixcIiZ6ZXRhO1wiOlwizrZcIixcIiZ6ZnI7XCI6XCLwnZS3XCIsXCImemhjeTtcIjpcItC2XCIsXCImemlncmFycjtcIjpcIuKHnVwiLFwiJnpvcGY7XCI6XCLwnZWrXCIsXCImenNjcjtcIjpcIvCdk49cIixcIiZ6d2o7XCI6XCLigI1cIixcIiZ6d25qO1wiOlwi4oCMXCJ9LGNoYXJhY3RlcnM6e1wiw4ZcIjpcIiZBRWxpZztcIixcIiZcIjpcIiZhbXA7XCIsXCLDgVwiOlwiJkFhY3V0ZTtcIixcIsSCXCI6XCImQWJyZXZlO1wiLFwiw4JcIjpcIiZBY2lyYztcIixcItCQXCI6XCImQWN5O1wiLFwi8J2UhFwiOlwiJkFmcjtcIixcIsOAXCI6XCImQWdyYXZlO1wiLFwizpFcIjpcIiZBbHBoYTtcIixcIsSAXCI6XCImQW1hY3I7XCIsXCLiqZNcIjpcIiZBbmQ7XCIsXCLEhFwiOlwiJkFvZ29uO1wiLFwi8J2UuFwiOlwiJkFvcGY7XCIsXCLigaFcIjpcIiZhZjtcIixcIsOFXCI6XCImYW5nc3Q7XCIsXCLwnZKcXCI6XCImQXNjcjtcIixcIuKJlFwiOlwiJmNvbG9uZXE7XCIsXCLDg1wiOlwiJkF0aWxkZTtcIixcIsOEXCI6XCImQXVtbDtcIixcIuKIllwiOlwiJnNzZXRtbjtcIixcIuKrp1wiOlwiJkJhcnY7XCIsXCLijIZcIjpcIiZkb3VibGViYXJ3ZWRnZTtcIixcItCRXCI6XCImQmN5O1wiLFwi4oi1XCI6XCImYmVjYXVzZTtcIixcIuKErFwiOlwiJmJlcm5vdTtcIixcIs6SXCI6XCImQmV0YTtcIixcIvCdlIVcIjpcIiZCZnI7XCIsXCLwnZS5XCI6XCImQm9wZjtcIixcIsuYXCI6XCImYnJldmU7XCIsXCLiiY5cIjpcIiZidW1wO1wiLFwi0KdcIjpcIiZDSGN5O1wiLFwiwqlcIjpcIiZjb3B5O1wiLFwixIZcIjpcIiZDYWN1dGU7XCIsXCLii5JcIjpcIiZDYXA7XCIsXCLihYVcIjpcIiZERDtcIixcIuKErVwiOlwiJkNmcjtcIixcIsSMXCI6XCImQ2Nhcm9uO1wiLFwiw4dcIjpcIiZDY2VkaWw7XCIsXCLEiFwiOlwiJkNjaXJjO1wiLFwi4oiwXCI6XCImQ2NvbmludDtcIixcIsSKXCI6XCImQ2RvdDtcIixcIsK4XCI6XCImY2VkaWw7XCIsXCLCt1wiOlwiJm1pZGRvdDtcIixcIs6nXCI6XCImQ2hpO1wiLFwi4oqZXCI6XCImb2RvdDtcIixcIuKKllwiOlwiJm9taW51cztcIixcIuKKlVwiOlwiJm9wbHVzO1wiLFwi4oqXXCI6XCImb3RpbWVzO1wiLFwi4oiyXCI6XCImY3djb25pbnQ7XCIsXCLigJ1cIjpcIiZyZHF1b3I7XCIsXCLigJlcIjpcIiZyc3F1b3I7XCIsXCLiiLdcIjpcIiZQcm9wb3J0aW9uO1wiLFwi4qm0XCI6XCImQ29sb25lO1wiLFwi4omhXCI6XCImZXF1aXY7XCIsXCLiiK9cIjpcIiZEb3VibGVDb250b3VySW50ZWdyYWw7XCIsXCLiiK5cIjpcIiZvaW50O1wiLFwi4oSCXCI6XCImY29tcGxleGVzO1wiLFwi4oiQXCI6XCImY29wcm9kO1wiLFwi4oizXCI6XCImYXdjb25pbnQ7XCIsXCLiqK9cIjpcIiZDcm9zcztcIixcIvCdkp5cIjpcIiZDc2NyO1wiLFwi4ouTXCI6XCImQ3VwO1wiLFwi4omNXCI6XCImYXN5bXBlcTtcIixcIuKkkVwiOlwiJkREb3RyYWhkO1wiLFwi0IJcIjpcIiZESmN5O1wiLFwi0IVcIjpcIiZEU2N5O1wiLFwi0I9cIjpcIiZEWmN5O1wiLFwi4oChXCI6XCImZGRhZ2dlcjtcIixcIuKGoVwiOlwiJkRhcnI7XCIsXCLiq6RcIjpcIiZEb3VibGVMZWZ0VGVlO1wiLFwixI5cIjpcIiZEY2Fyb247XCIsXCLQlFwiOlwiJkRjeTtcIixcIuKIh1wiOlwiJm5hYmxhO1wiLFwizpRcIjpcIiZEZWx0YTtcIixcIvCdlIdcIjpcIiZEZnI7XCIsXCLCtFwiOlwiJmFjdXRlO1wiLFwiy5lcIjpcIiZkb3Q7XCIsXCLLnVwiOlwiJmRibGFjO1wiLFwiYFwiOlwiJmdyYXZlO1wiLFwiy5xcIjpcIiZ0aWxkZTtcIixcIuKLhFwiOlwiJmRpYW1vbmQ7XCIsXCLihYZcIjpcIiZkZDtcIixcIvCdlLtcIjpcIiZEb3BmO1wiLFwiwqhcIjpcIiZ1bWw7XCIsXCLig5xcIjpcIiZEb3REb3Q7XCIsXCLiiZBcIjpcIiZlc2RvdDtcIixcIuKHk1wiOlwiJmRBcnI7XCIsXCLih5BcIjpcIiZsQXJyO1wiLFwi4oeUXCI6XCImaWZmO1wiLFwi4p+4XCI6XCImeGxBcnI7XCIsXCLin7pcIjpcIiZ4aEFycjtcIixcIuKfuVwiOlwiJnhyQXJyO1wiLFwi4oeSXCI6XCImckFycjtcIixcIuKKqFwiOlwiJnZEYXNoO1wiLFwi4oeRXCI6XCImdUFycjtcIixcIuKHlVwiOlwiJnZBcnI7XCIsXCLiiKVcIjpcIiZzcGFyO1wiLFwi4oaTXCI6XCImZG93bmFycm93O1wiLFwi4qSTXCI6XCImRG93bkFycm93QmFyO1wiLFwi4oe1XCI6XCImZHVhcnI7XCIsXCLMkVwiOlwiJkRvd25CcmV2ZTtcIixcIuKlkFwiOlwiJkRvd25MZWZ0UmlnaHRWZWN0b3I7XCIsXCLipZ5cIjpcIiZEb3duTGVmdFRlZVZlY3RvcjtcIixcIuKGvVwiOlwiJmxoYXJkO1wiLFwi4qWWXCI6XCImRG93bkxlZnRWZWN0b3JCYXI7XCIsXCLipZ9cIjpcIiZEb3duUmlnaHRUZWVWZWN0b3I7XCIsXCLih4FcIjpcIiZyaWdodGhhcnBvb25kb3duO1wiLFwi4qWXXCI6XCImRG93blJpZ2h0VmVjdG9yQmFyO1wiLFwi4oqkXCI6XCImdG9wO1wiLFwi4oanXCI6XCImbWFwc3RvZG93bjtcIixcIvCdkp9cIjpcIiZEc2NyO1wiLFwixJBcIjpcIiZEc3Ryb2s7XCIsXCLFilwiOlwiJkVORztcIixcIsOQXCI6XCImRVRIO1wiLFwiw4lcIjpcIiZFYWN1dGU7XCIsXCLEmlwiOlwiJkVjYXJvbjtcIixcIsOKXCI6XCImRWNpcmM7XCIsXCLQrVwiOlwiJkVjeTtcIixcIsSWXCI6XCImRWRvdDtcIixcIvCdlIhcIjpcIiZFZnI7XCIsXCLDiFwiOlwiJkVncmF2ZTtcIixcIuKIiFwiOlwiJmlzaW52O1wiLFwixJJcIjpcIiZFbWFjcjtcIixcIuKXu1wiOlwiJkVtcHR5U21hbGxTcXVhcmU7XCIsXCLilqtcIjpcIiZFbXB0eVZlcnlTbWFsbFNxdWFyZTtcIixcIsSYXCI6XCImRW9nb247XCIsXCLwnZS8XCI6XCImRW9wZjtcIixcIs6VXCI6XCImRXBzaWxvbjtcIixcIuKptVwiOlwiJkVxdWFsO1wiLFwi4omCXCI6XCImZXNpbTtcIixcIuKHjFwiOlwiJnJsaGFyO1wiLFwi4oSwXCI6XCImZXhwZWN0YXRpb247XCIsXCLiqbNcIjpcIiZFc2ltO1wiLFwizpdcIjpcIiZFdGE7XCIsXCLDi1wiOlwiJkV1bWw7XCIsXCLiiINcIjpcIiZleGlzdDtcIixcIuKFh1wiOlwiJmV4cG9uZW50aWFsZTtcIixcItCkXCI6XCImRmN5O1wiLFwi8J2UiVwiOlwiJkZmcjtcIixcIuKXvFwiOlwiJkZpbGxlZFNtYWxsU3F1YXJlO1wiLFwi4paqXCI6XCImc3F1ZjtcIixcIvCdlL1cIjpcIiZGb3BmO1wiLFwi4oiAXCI6XCImZm9yYWxsO1wiLFwi4oSxXCI6XCImRnNjcjtcIixcItCDXCI6XCImR0pjeTtcIixcIj5cIjpcIiZndDtcIixcIs6TXCI6XCImR2FtbWE7XCIsXCLPnFwiOlwiJkdhbW1hZDtcIixcIsSeXCI6XCImR2JyZXZlO1wiLFwixKJcIjpcIiZHY2VkaWw7XCIsXCLEnFwiOlwiJkdjaXJjO1wiLFwi0JNcIjpcIiZHY3k7XCIsXCLEoFwiOlwiJkdkb3Q7XCIsXCLwnZSKXCI6XCImR2ZyO1wiLFwi4ouZXCI6XCImZ2dnO1wiLFwi8J2UvlwiOlwiJkdvcGY7XCIsXCLiiaVcIjpcIiZnZXE7XCIsXCLii5tcIjpcIiZndHJlcWxlc3M7XCIsXCLiiadcIjpcIiZnZXFxO1wiLFwi4qqiXCI6XCImR3JlYXRlckdyZWF0ZXI7XCIsXCLiibdcIjpcIiZndHJsZXNzO1wiLFwi4qm+XCI6XCImZ2VzO1wiLFwi4omzXCI6XCImZ3Ryc2ltO1wiLFwi8J2SolwiOlwiJkdzY3I7XCIsXCLiiatcIjpcIiZnZztcIixcItCqXCI6XCImSEFSRGN5O1wiLFwiy4dcIjpcIiZjYXJvbjtcIixcIl5cIjpcIiZIYXQ7XCIsXCLEpFwiOlwiJkhjaXJjO1wiLFwi4oSMXCI6XCImUG9pbmNhcmVwbGFuZTtcIixcIuKEi1wiOlwiJmhhbWlsdDtcIixcIuKEjVwiOlwiJnF1YXRlcm5pb25zO1wiLFwi4pSAXCI6XCImYm94aDtcIixcIsSmXCI6XCImSHN0cm9rO1wiLFwi4omPXCI6XCImYnVtcGVxO1wiLFwi0JVcIjpcIiZJRWN5O1wiLFwixLJcIjpcIiZJSmxpZztcIixcItCBXCI6XCImSU9jeTtcIixcIsONXCI6XCImSWFjdXRlO1wiLFwiw45cIjpcIiZJY2lyYztcIixcItCYXCI6XCImSWN5O1wiLFwixLBcIjpcIiZJZG90O1wiLFwi4oSRXCI6XCImaW1hZ3BhcnQ7XCIsXCLDjFwiOlwiJklncmF2ZTtcIixcIsSqXCI6XCImSW1hY3I7XCIsXCLihYhcIjpcIiZpaTtcIixcIuKIrFwiOlwiJkludDtcIixcIuKIq1wiOlwiJmludDtcIixcIuKLglwiOlwiJnhjYXA7XCIsXCLigaNcIjpcIiZpYztcIixcIuKBolwiOlwiJml0O1wiLFwixK5cIjpcIiZJb2dvbjtcIixcIvCdlYBcIjpcIiZJb3BmO1wiLFwizplcIjpcIiZJb3RhO1wiLFwi4oSQXCI6XCImaW1hZ2xpbmU7XCIsXCLEqFwiOlwiJkl0aWxkZTtcIixcItCGXCI6XCImSXVrY3k7XCIsXCLDj1wiOlwiJkl1bWw7XCIsXCLEtFwiOlwiJkpjaXJjO1wiLFwi0JlcIjpcIiZKY3k7XCIsXCLwnZSNXCI6XCImSmZyO1wiLFwi8J2VgVwiOlwiJkpvcGY7XCIsXCLwnZKlXCI6XCImSnNjcjtcIixcItCIXCI6XCImSnNlcmN5O1wiLFwi0IRcIjpcIiZKdWtjeTtcIixcItClXCI6XCImS0hjeTtcIixcItCMXCI6XCImS0pjeTtcIixcIs6aXCI6XCImS2FwcGE7XCIsXCLEtlwiOlwiJktjZWRpbDtcIixcItCaXCI6XCImS2N5O1wiLFwi8J2UjlwiOlwiJktmcjtcIixcIvCdlYJcIjpcIiZLb3BmO1wiLFwi8J2SplwiOlwiJktzY3I7XCIsXCLQiVwiOlwiJkxKY3k7XCIsXCI8XCI6XCImbHQ7XCIsXCLEuVwiOlwiJkxhY3V0ZTtcIixcIs6bXCI6XCImTGFtYmRhO1wiLFwi4p+qXCI6XCImTGFuZztcIixcIuKEklwiOlwiJmxhZ3JhbjtcIixcIuKGnlwiOlwiJnR3b2hlYWRsZWZ0YXJyb3c7XCIsXCLEvVwiOlwiJkxjYXJvbjtcIixcIsS7XCI6XCImTGNlZGlsO1wiLFwi0JtcIjpcIiZMY3k7XCIsXCLin6hcIjpcIiZsYW5nbGU7XCIsXCLihpBcIjpcIiZzbGFycjtcIixcIuKHpFwiOlwiJmxhcnJiO1wiLFwi4oeGXCI6XCImbHJhcnI7XCIsXCLijIhcIjpcIiZsY2VpbDtcIixcIuKfplwiOlwiJmxvYnJrO1wiLFwi4qWhXCI6XCImTGVmdERvd25UZWVWZWN0b3I7XCIsXCLih4NcIjpcIiZkb3duaGFycG9vbmxlZnQ7XCIsXCLipZlcIjpcIiZMZWZ0RG93blZlY3RvckJhcjtcIixcIuKMilwiOlwiJmxmbG9vcjtcIixcIuKGlFwiOlwiJmxlZnRyaWdodGFycm93O1wiLFwi4qWOXCI6XCImTGVmdFJpZ2h0VmVjdG9yO1wiLFwi4oqjXCI6XCImZGFzaHY7XCIsXCLihqRcIjpcIiZtYXBzdG9sZWZ0O1wiLFwi4qWaXCI6XCImTGVmdFRlZVZlY3RvcjtcIixcIuKKslwiOlwiJnZsdHJpO1wiLFwi4qePXCI6XCImTGVmdFRyaWFuZ2xlQmFyO1wiLFwi4oq0XCI6XCImdHJpYW5nbGVsZWZ0ZXE7XCIsXCLipZFcIjpcIiZMZWZ0VXBEb3duVmVjdG9yO1wiLFwi4qWgXCI6XCImTGVmdFVwVGVlVmVjdG9yO1wiLFwi4oa/XCI6XCImdXBoYXJwb29ubGVmdDtcIixcIuKlmFwiOlwiJkxlZnRVcFZlY3RvckJhcjtcIixcIuKGvFwiOlwiJmxoYXJ1O1wiLFwi4qWSXCI6XCImTGVmdFZlY3RvckJhcjtcIixcIuKLmlwiOlwiJmxlc3NlcWd0cjtcIixcIuKJplwiOlwiJmxlcXE7XCIsXCLiibZcIjpcIiZsZztcIixcIuKqoVwiOlwiJkxlc3NMZXNzO1wiLFwi4qm9XCI6XCImbGVzO1wiLFwi4omyXCI6XCImbHNpbTtcIixcIvCdlI9cIjpcIiZMZnI7XCIsXCLii5hcIjpcIiZMbDtcIixcIuKHmlwiOlwiJmxBYXJyO1wiLFwixL9cIjpcIiZMbWlkb3Q7XCIsXCLin7VcIjpcIiZ4bGFycjtcIixcIuKft1wiOlwiJnhoYXJyO1wiLFwi4p+2XCI6XCImeHJhcnI7XCIsXCLwnZWDXCI6XCImTG9wZjtcIixcIuKGmVwiOlwiJnN3YXJyb3c7XCIsXCLihphcIjpcIiZzZWFycm93O1wiLFwi4oawXCI6XCImbHNoO1wiLFwixYFcIjpcIiZMc3Ryb2s7XCIsXCLiiapcIjpcIiZsbDtcIixcIuKkhVwiOlwiJk1hcDtcIixcItCcXCI6XCImTWN5O1wiLFwi4oGfXCI6XCImTWVkaXVtU3BhY2U7XCIsXCLihLNcIjpcIiZwaG1tYXQ7XCIsXCLwnZSQXCI6XCImTWZyO1wiLFwi4oiTXCI6XCImbXA7XCIsXCLwnZWEXCI6XCImTW9wZjtcIixcIs6cXCI6XCImTXU7XCIsXCLQilwiOlwiJk5KY3k7XCIsXCLFg1wiOlwiJk5hY3V0ZTtcIixcIsWHXCI6XCImTmNhcm9uO1wiLFwixYVcIjpcIiZOY2VkaWw7XCIsXCLQnVwiOlwiJk5jeTtcIixcIuKAi1wiOlwiJlplcm9XaWR0aFNwYWNlO1wiLFwiXFxuXCI6XCImTmV3TGluZTtcIixcIvCdlJFcIjpcIiZOZnI7XCIsXCLigaBcIjpcIiZOb0JyZWFrO1wiLFwiwqBcIjpcIiZuYnNwO1wiLFwi4oSVXCI6XCImbmF0dXJhbHM7XCIsXCLiq6xcIjpcIiZOb3Q7XCIsXCLiiaJcIjpcIiZuZXF1aXY7XCIsXCLiia1cIjpcIiZOb3RDdXBDYXA7XCIsXCLiiKZcIjpcIiZuc3BhcjtcIixcIuKIiVwiOlwiJm5vdGludmE7XCIsXCLiiaBcIjpcIiZuZTtcIixcIuKJgsy4XCI6XCImbmVzaW07XCIsXCLiiIRcIjpcIiZuZXhpc3RzO1wiLFwi4omvXCI6XCImbmd0cjtcIixcIuKJsVwiOlwiJm5nZXE7XCIsXCLiiafMuFwiOlwiJm5nZXFxO1wiLFwi4omrzLhcIjpcIiZuR3R2O1wiLFwi4om5XCI6XCImbnRnbDtcIixcIuKpvsy4XCI6XCImbmdlcztcIixcIuKJtVwiOlwiJm5nc2ltO1wiLFwi4omOzLhcIjpcIiZuYnVtcDtcIixcIuKJj8y4XCI6XCImbmJ1bXBlO1wiLFwi4ouqXCI6XCImbnRyaWFuZ2xlbGVmdDtcIixcIuKnj8y4XCI6XCImTm90TGVmdFRyaWFuZ2xlQmFyO1wiLFwi4ousXCI6XCImbnRyaWFuZ2xlbGVmdGVxO1wiLFwi4omuXCI6XCImbmx0O1wiLFwi4omwXCI6XCImbmxlcTtcIixcIuKJuFwiOlwiJm50bGc7XCIsXCLiiarMuFwiOlwiJm5MdHY7XCIsXCLiqb3MuFwiOlwiJm5sZXM7XCIsXCLiibRcIjpcIiZubHNpbTtcIixcIuKqosy4XCI6XCImTm90TmVzdGVkR3JlYXRlckdyZWF0ZXI7XCIsXCLiqqHMuFwiOlwiJk5vdE5lc3RlZExlc3NMZXNzO1wiLFwi4oqAXCI6XCImbnByZWM7XCIsXCLiqq/MuFwiOlwiJm5wcmVjZXE7XCIsXCLii6BcIjpcIiZucHJjdWU7XCIsXCLiiIxcIjpcIiZub3RuaXZhO1wiLFwi4ourXCI6XCImbnRyaWFuZ2xlcmlnaHQ7XCIsXCLip5DMuFwiOlwiJk5vdFJpZ2h0VHJpYW5nbGVCYXI7XCIsXCLii61cIjpcIiZudHJpYW5nbGVyaWdodGVxO1wiLFwi4oqPzLhcIjpcIiZOb3RTcXVhcmVTdWJzZXQ7XCIsXCLii6JcIjpcIiZuc3FzdWJlO1wiLFwi4oqQzLhcIjpcIiZOb3RTcXVhcmVTdXBlcnNldDtcIixcIuKLo1wiOlwiJm5zcXN1cGU7XCIsXCLiioLig5JcIjpcIiZ2bnN1YjtcIixcIuKKiFwiOlwiJm5zdWJzZXRlcTtcIixcIuKKgVwiOlwiJm5zdWNjO1wiLFwi4qqwzLhcIjpcIiZuc3VjY2VxO1wiLFwi4ouhXCI6XCImbnNjY3VlO1wiLFwi4om/zLhcIjpcIiZOb3RTdWNjZWVkc1RpbGRlO1wiLFwi4oqD4oOSXCI6XCImdm5zdXA7XCIsXCLiiolcIjpcIiZuc3Vwc2V0ZXE7XCIsXCLiiYFcIjpcIiZuc2ltO1wiLFwi4omEXCI6XCImbnNpbWVxO1wiLFwi4omHXCI6XCImbmNvbmc7XCIsXCLiiYlcIjpcIiZuYXBwcm94O1wiLFwi4oikXCI6XCImbnNtaWQ7XCIsXCLwnZKpXCI6XCImTnNjcjtcIixcIsORXCI6XCImTnRpbGRlO1wiLFwizp1cIjpcIiZOdTtcIixcIsWSXCI6XCImT0VsaWc7XCIsXCLDk1wiOlwiJk9hY3V0ZTtcIixcIsOUXCI6XCImT2NpcmM7XCIsXCLQnlwiOlwiJk9jeTtcIixcIsWQXCI6XCImT2RibGFjO1wiLFwi8J2UklwiOlwiJk9mcjtcIixcIsOSXCI6XCImT2dyYXZlO1wiLFwixYxcIjpcIiZPbWFjcjtcIixcIs6pXCI6XCImb2htO1wiLFwizp9cIjpcIiZPbWljcm9uO1wiLFwi8J2VhlwiOlwiJk9vcGY7XCIsXCLigJxcIjpcIiZsZHF1bztcIixcIuKAmFwiOlwiJmxzcXVvO1wiLFwi4qmUXCI6XCImT3I7XCIsXCLwnZKqXCI6XCImT3NjcjtcIixcIsOYXCI6XCImT3NsYXNoO1wiLFwiw5VcIjpcIiZPdGlsZGU7XCIsXCLiqLdcIjpcIiZPdGltZXM7XCIsXCLDllwiOlwiJk91bWw7XCIsXCLigL5cIjpcIiZvbGluZTtcIixcIuKPnlwiOlwiJk92ZXJCcmFjZTtcIixcIuKOtFwiOlwiJnRicms7XCIsXCLij5xcIjpcIiZPdmVyUGFyZW50aGVzaXM7XCIsXCLiiIJcIjpcIiZwYXJ0O1wiLFwi0J9cIjpcIiZQY3k7XCIsXCLwnZSTXCI6XCImUGZyO1wiLFwizqZcIjpcIiZQaGk7XCIsXCLOoFwiOlwiJlBpO1wiLFwiwrFcIjpcIiZwbTtcIixcIuKEmVwiOlwiJnByaW1lcztcIixcIuKqu1wiOlwiJlByO1wiLFwi4om6XCI6XCImcHJlYztcIixcIuKqr1wiOlwiJnByZWNlcTtcIixcIuKJvFwiOlwiJnByZWNjdXJseWVxO1wiLFwi4om+XCI6XCImcHJzaW07XCIsXCLigLNcIjpcIiZQcmltZTtcIixcIuKIj1wiOlwiJnByb2Q7XCIsXCLiiJ1cIjpcIiZ2cHJvcDtcIixcIvCdkqtcIjpcIiZQc2NyO1wiLFwizqhcIjpcIiZQc2k7XCIsJ1wiJzpcIiZxdW90O1wiLFwi8J2UlFwiOlwiJlFmcjtcIixcIuKEmlwiOlwiJnJhdGlvbmFscztcIixcIvCdkqxcIjpcIiZRc2NyO1wiLFwi4qSQXCI6XCImZHJia2Fyb3c7XCIsXCLCrlwiOlwiJnJlZztcIixcIsWUXCI6XCImUmFjdXRlO1wiLFwi4p+rXCI6XCImUmFuZztcIixcIuKGoFwiOlwiJnR3b2hlYWRyaWdodGFycm93O1wiLFwi4qSWXCI6XCImUmFycnRsO1wiLFwixZhcIjpcIiZSY2Fyb247XCIsXCLFllwiOlwiJlJjZWRpbDtcIixcItCgXCI6XCImUmN5O1wiLFwi4oScXCI6XCImcmVhbHBhcnQ7XCIsXCLiiItcIjpcIiZuaXY7XCIsXCLih4tcIjpcIiZscmhhcjtcIixcIuKlr1wiOlwiJmR1aGFyO1wiLFwizqFcIjpcIiZSaG87XCIsXCLin6lcIjpcIiZyYW5nbGU7XCIsXCLihpJcIjpcIiZzcmFycjtcIixcIuKHpVwiOlwiJnJhcnJiO1wiLFwi4oeEXCI6XCImcmxhcnI7XCIsXCLijIlcIjpcIiZyY2VpbDtcIixcIuKfp1wiOlwiJnJvYnJrO1wiLFwi4qWdXCI6XCImUmlnaHREb3duVGVlVmVjdG9yO1wiLFwi4oeCXCI6XCImZG93bmhhcnBvb25yaWdodDtcIixcIuKllVwiOlwiJlJpZ2h0RG93blZlY3RvckJhcjtcIixcIuKMi1wiOlwiJnJmbG9vcjtcIixcIuKKolwiOlwiJnZkYXNoO1wiLFwi4oamXCI6XCImbWFwc3RvO1wiLFwi4qWbXCI6XCImUmlnaHRUZWVWZWN0b3I7XCIsXCLiirNcIjpcIiZ2cnRyaTtcIixcIuKnkFwiOlwiJlJpZ2h0VHJpYW5nbGVCYXI7XCIsXCLiirVcIjpcIiZ0cmlhbmdsZXJpZ2h0ZXE7XCIsXCLipY9cIjpcIiZSaWdodFVwRG93blZlY3RvcjtcIixcIuKlnFwiOlwiJlJpZ2h0VXBUZWVWZWN0b3I7XCIsXCLihr5cIjpcIiZ1cGhhcnBvb25yaWdodDtcIixcIuKllFwiOlwiJlJpZ2h0VXBWZWN0b3JCYXI7XCIsXCLih4BcIjpcIiZyaWdodGhhcnBvb251cDtcIixcIuKlk1wiOlwiJlJpZ2h0VmVjdG9yQmFyO1wiLFwi4oSdXCI6XCImcmVhbHM7XCIsXCLipbBcIjpcIiZSb3VuZEltcGxpZXM7XCIsXCLih5tcIjpcIiZyQWFycjtcIixcIuKEm1wiOlwiJnJlYWxpbmU7XCIsXCLihrFcIjpcIiZyc2g7XCIsXCLip7RcIjpcIiZSdWxlRGVsYXllZDtcIixcItCpXCI6XCImU0hDSGN5O1wiLFwi0KhcIjpcIiZTSGN5O1wiLFwi0KxcIjpcIiZTT0ZUY3k7XCIsXCLFmlwiOlwiJlNhY3V0ZTtcIixcIuKqvFwiOlwiJlNjO1wiLFwixaBcIjpcIiZTY2Fyb247XCIsXCLFnlwiOlwiJlNjZWRpbDtcIixcIsWcXCI6XCImU2NpcmM7XCIsXCLQoVwiOlwiJlNjeTtcIixcIvCdlJZcIjpcIiZTZnI7XCIsXCLihpFcIjpcIiZ1cGFycm93O1wiLFwizqNcIjpcIiZTaWdtYTtcIixcIuKImFwiOlwiJmNvbXBmbjtcIixcIvCdlYpcIjpcIiZTb3BmO1wiLFwi4oiaXCI6XCImcmFkaWM7XCIsXCLilqFcIjpcIiZzcXVhcmU7XCIsXCLiipNcIjpcIiZzcWNhcDtcIixcIuKKj1wiOlwiJnNxc3Vic2V0O1wiLFwi4oqRXCI6XCImc3FzdWJzZXRlcTtcIixcIuKKkFwiOlwiJnNxc3Vwc2V0O1wiLFwi4oqSXCI6XCImc3FzdXBzZXRlcTtcIixcIuKKlFwiOlwiJnNxY3VwO1wiLFwi8J2SrlwiOlwiJlNzY3I7XCIsXCLii4ZcIjpcIiZzc3RhcmY7XCIsXCLii5BcIjpcIiZTdWJzZXQ7XCIsXCLiioZcIjpcIiZzdWJzZXRlcTtcIixcIuKJu1wiOlwiJnN1Y2M7XCIsXCLiqrBcIjpcIiZzdWNjZXE7XCIsXCLiib1cIjpcIiZzdWNjY3VybHllcTtcIixcIuKJv1wiOlwiJnN1Y2NzaW07XCIsXCLiiJFcIjpcIiZzdW07XCIsXCLii5FcIjpcIiZTdXBzZXQ7XCIsXCLiioNcIjpcIiZzdXBzZXQ7XCIsXCLiiodcIjpcIiZzdXBzZXRlcTtcIixcIsOeXCI6XCImVEhPUk47XCIsXCLihKJcIjpcIiZ0cmFkZTtcIixcItCLXCI6XCImVFNIY3k7XCIsXCLQplwiOlwiJlRTY3k7XCIsXCJcXHRcIjpcIiZUYWI7XCIsXCLOpFwiOlwiJlRhdTtcIixcIsWkXCI6XCImVGNhcm9uO1wiLFwixaJcIjpcIiZUY2VkaWw7XCIsXCLQolwiOlwiJlRjeTtcIixcIvCdlJdcIjpcIiZUZnI7XCIsXCLiiLRcIjpcIiZ0aGVyZWZvcmU7XCIsXCLOmFwiOlwiJlRoZXRhO1wiLFwi4oGf4oCKXCI6XCImVGhpY2tTcGFjZTtcIixcIuKAiVwiOlwiJnRoaW5zcDtcIixcIuKIvFwiOlwiJnRoa3NpbTtcIixcIuKJg1wiOlwiJnNpbWVxO1wiLFwi4omFXCI6XCImY29uZztcIixcIuKJiFwiOlwiJnRoa2FwO1wiLFwi8J2Vi1wiOlwiJlRvcGY7XCIsXCLig5tcIjpcIiZ0ZG90O1wiLFwi8J2Sr1wiOlwiJlRzY3I7XCIsXCLFplwiOlwiJlRzdHJvaztcIixcIsOaXCI6XCImVWFjdXRlO1wiLFwi4oafXCI6XCImVWFycjtcIixcIuKliVwiOlwiJlVhcnJvY2lyO1wiLFwi0I5cIjpcIiZVYnJjeTtcIixcIsWsXCI6XCImVWJyZXZlO1wiLFwiw5tcIjpcIiZVY2lyYztcIixcItCjXCI6XCImVWN5O1wiLFwixbBcIjpcIiZVZGJsYWM7XCIsXCLwnZSYXCI6XCImVWZyO1wiLFwiw5lcIjpcIiZVZ3JhdmU7XCIsXCLFqlwiOlwiJlVtYWNyO1wiLF86XCImbG93YmFyO1wiLFwi4o+fXCI6XCImVW5kZXJCcmFjZTtcIixcIuKOtVwiOlwiJmJicms7XCIsXCLij51cIjpcIiZVbmRlclBhcmVudGhlc2lzO1wiLFwi4ouDXCI6XCImeGN1cDtcIixcIuKKjlwiOlwiJnVwbHVzO1wiLFwixbJcIjpcIiZVb2dvbjtcIixcIvCdlYxcIjpcIiZVb3BmO1wiLFwi4qSSXCI6XCImVXBBcnJvd0JhcjtcIixcIuKHhVwiOlwiJnVkYXJyO1wiLFwi4oaVXCI6XCImdmFycjtcIixcIuKlrlwiOlwiJnVkaGFyO1wiLFwi4oqlXCI6XCImcGVycDtcIixcIuKGpVwiOlwiJm1hcHN0b3VwO1wiLFwi4oaWXCI6XCImbndhcnJvdztcIixcIuKGl1wiOlwiJm5lYXJyb3c7XCIsXCLPklwiOlwiJnVwc2loO1wiLFwizqVcIjpcIiZVcHNpbG9uO1wiLFwixa5cIjpcIiZVcmluZztcIixcIvCdkrBcIjpcIiZVc2NyO1wiLFwixahcIjpcIiZVdGlsZGU7XCIsXCLDnFwiOlwiJlV1bWw7XCIsXCLiiqtcIjpcIiZWRGFzaDtcIixcIuKrq1wiOlwiJlZiYXI7XCIsXCLQklwiOlwiJlZjeTtcIixcIuKKqVwiOlwiJlZkYXNoO1wiLFwi4qumXCI6XCImVmRhc2hsO1wiLFwi4ouBXCI6XCImeHZlZTtcIixcIuKAllwiOlwiJlZlcnQ7XCIsXCLiiKNcIjpcIiZzbWlkO1wiLFwifFwiOlwiJnZlcnQ7XCIsXCLinZhcIjpcIiZWZXJ0aWNhbFNlcGFyYXRvcjtcIixcIuKJgFwiOlwiJndyZWF0aDtcIixcIuKAilwiOlwiJmhhaXJzcDtcIixcIvCdlJlcIjpcIiZWZnI7XCIsXCLwnZWNXCI6XCImVm9wZjtcIixcIvCdkrFcIjpcIiZWc2NyO1wiLFwi4oqqXCI6XCImVnZkYXNoO1wiLFwixbRcIjpcIiZXY2lyYztcIixcIuKLgFwiOlwiJnh3ZWRnZTtcIixcIvCdlJpcIjpcIiZXZnI7XCIsXCLwnZWOXCI6XCImV29wZjtcIixcIvCdkrJcIjpcIiZXc2NyO1wiLFwi8J2Um1wiOlwiJlhmcjtcIixcIs6eXCI6XCImWGk7XCIsXCLwnZWPXCI6XCImWG9wZjtcIixcIvCdkrNcIjpcIiZYc2NyO1wiLFwi0K9cIjpcIiZZQWN5O1wiLFwi0IdcIjpcIiZZSWN5O1wiLFwi0K5cIjpcIiZZVWN5O1wiLFwiw51cIjpcIiZZYWN1dGU7XCIsXCLFtlwiOlwiJlljaXJjO1wiLFwi0KtcIjpcIiZZY3k7XCIsXCLwnZScXCI6XCImWWZyO1wiLFwi8J2VkFwiOlwiJllvcGY7XCIsXCLwnZK0XCI6XCImWXNjcjtcIixcIsW4XCI6XCImWXVtbDtcIixcItCWXCI6XCImWkhjeTtcIixcIsW5XCI6XCImWmFjdXRlO1wiLFwixb1cIjpcIiZaY2Fyb247XCIsXCLQl1wiOlwiJlpjeTtcIixcIsW7XCI6XCImWmRvdDtcIixcIs6WXCI6XCImWmV0YTtcIixcIuKEqFwiOlwiJnplZXRyZjtcIixcIuKEpFwiOlwiJmludGVnZXJzO1wiLFwi8J2StVwiOlwiJlpzY3I7XCIsXCLDoVwiOlwiJmFhY3V0ZTtcIixcIsSDXCI6XCImYWJyZXZlO1wiLFwi4oi+XCI6XCImbXN0cG9zO1wiLFwi4oi+zLNcIjpcIiZhY0U7XCIsXCLiiL9cIjpcIiZhY2Q7XCIsXCLDolwiOlwiJmFjaXJjO1wiLFwi0LBcIjpcIiZhY3k7XCIsXCLDplwiOlwiJmFlbGlnO1wiLFwi8J2UnlwiOlwiJmFmcjtcIixcIsOgXCI6XCImYWdyYXZlO1wiLFwi4oS1XCI6XCImYWxlcGg7XCIsXCLOsVwiOlwiJmFscGhhO1wiLFwixIFcIjpcIiZhbWFjcjtcIixcIuKov1wiOlwiJmFtYWxnO1wiLFwi4oinXCI6XCImd2VkZ2U7XCIsXCLiqZVcIjpcIiZhbmRhbmQ7XCIsXCLiqZxcIjpcIiZhbmRkO1wiLFwi4qmYXCI6XCImYW5kc2xvcGU7XCIsXCLiqZpcIjpcIiZhbmR2O1wiLFwi4oigXCI6XCImYW5nbGU7XCIsXCLipqRcIjpcIiZhbmdlO1wiLFwi4oihXCI6XCImbWVhc3VyZWRhbmdsZTtcIixcIuKmqFwiOlwiJmFuZ21zZGFhO1wiLFwi4qapXCI6XCImYW5nbXNkYWI7XCIsXCLipqpcIjpcIiZhbmdtc2RhYztcIixcIuKmq1wiOlwiJmFuZ21zZGFkO1wiLFwi4qasXCI6XCImYW5nbXNkYWU7XCIsXCLipq1cIjpcIiZhbmdtc2RhZjtcIixcIuKmrlwiOlwiJmFuZ21zZGFnO1wiLFwi4qavXCI6XCImYW5nbXNkYWg7XCIsXCLiiJ9cIjpcIiZhbmdydDtcIixcIuKKvlwiOlwiJmFuZ3J0dmI7XCIsXCLipp1cIjpcIiZhbmdydHZiZDtcIixcIuKIolwiOlwiJmFuZ3NwaDtcIixcIuKNvFwiOlwiJmFuZ3phcnI7XCIsXCLEhVwiOlwiJmFvZ29uO1wiLFwi8J2VklwiOlwiJmFvcGY7XCIsXCLiqbBcIjpcIiZhcEU7XCIsXCLiqa9cIjpcIiZhcGFjaXI7XCIsXCLiiYpcIjpcIiZhcHByb3hlcTtcIixcIuKJi1wiOlwiJmFwaWQ7XCIsXCInXCI6XCImYXBvcztcIixcIsOlXCI6XCImYXJpbmc7XCIsXCLwnZK2XCI6XCImYXNjcjtcIixcIipcIjpcIiZtaWRhc3Q7XCIsXCLDo1wiOlwiJmF0aWxkZTtcIixcIsOkXCI6XCImYXVtbDtcIixcIuKokVwiOlwiJmF3aW50O1wiLFwi4qutXCI6XCImYk5vdDtcIixcIuKJjFwiOlwiJmJjb25nO1wiLFwiz7ZcIjpcIiZiZXBzaTtcIixcIuKAtVwiOlwiJmJwcmltZTtcIixcIuKIvVwiOlwiJmJzaW07XCIsXCLii41cIjpcIiZic2ltZTtcIixcIuKKvVwiOlwiJmJhcnZlZTtcIixcIuKMhVwiOlwiJmJhcndlZGdlO1wiLFwi4o62XCI6XCImYmJya3Ricms7XCIsXCLQsVwiOlwiJmJjeTtcIixcIuKAnlwiOlwiJmxkcXVvcjtcIixcIuKmsFwiOlwiJmJlbXB0eXY7XCIsXCLOslwiOlwiJmJldGE7XCIsXCLihLZcIjpcIiZiZXRoO1wiLFwi4omsXCI6XCImdHdpeHQ7XCIsXCLwnZSfXCI6XCImYmZyO1wiLFwi4pevXCI6XCImeGNpcmM7XCIsXCLiqIBcIjpcIiZ4b2RvdDtcIixcIuKogVwiOlwiJnhvcGx1cztcIixcIuKoglwiOlwiJnhvdGltZTtcIixcIuKohlwiOlwiJnhzcWN1cDtcIixcIuKYhVwiOlwiJnN0YXJmO1wiLFwi4pa9XCI6XCImeGR0cmk7XCIsXCLilrNcIjpcIiZ4dXRyaTtcIixcIuKohFwiOlwiJnh1cGx1cztcIixcIuKkjVwiOlwiJnJiYXJyO1wiLFwi4qerXCI6XCImbG96ZjtcIixcIuKWtFwiOlwiJnV0cmlmO1wiLFwi4pa+XCI6XCImZHRyaWY7XCIsXCLil4JcIjpcIiZsdHJpZjtcIixcIuKWuFwiOlwiJnJ0cmlmO1wiLFwi4pCjXCI6XCImYmxhbms7XCIsXCLilpJcIjpcIiZibGsxMjtcIixcIuKWkVwiOlwiJmJsazE0O1wiLFwi4paTXCI6XCImYmxrMzQ7XCIsXCLilohcIjpcIiZibG9jaztcIixcIj3ig6VcIjpcIiZibmU7XCIsXCLiiaHig6VcIjpcIiZibmVxdWl2O1wiLFwi4oyQXCI6XCImYm5vdDtcIixcIvCdlZNcIjpcIiZib3BmO1wiLFwi4ouIXCI6XCImYm93dGllO1wiLFwi4pWXXCI6XCImYm94REw7XCIsXCLilZRcIjpcIiZib3hEUjtcIixcIuKVllwiOlwiJmJveERsO1wiLFwi4pWTXCI6XCImYm94RHI7XCIsXCLilZBcIjpcIiZib3hIO1wiLFwi4pWmXCI6XCImYm94SEQ7XCIsXCLilalcIjpcIiZib3hIVTtcIixcIuKVpFwiOlwiJmJveEhkO1wiLFwi4pWnXCI6XCImYm94SHU7XCIsXCLilZ1cIjpcIiZib3hVTDtcIixcIuKVmlwiOlwiJmJveFVSO1wiLFwi4pWcXCI6XCImYm94VWw7XCIsXCLilZlcIjpcIiZib3hVcjtcIixcIuKVkVwiOlwiJmJveFY7XCIsXCLilaxcIjpcIiZib3hWSDtcIixcIuKVo1wiOlwiJmJveFZMO1wiLFwi4pWgXCI6XCImYm94VlI7XCIsXCLilatcIjpcIiZib3hWaDtcIixcIuKVolwiOlwiJmJveFZsO1wiLFwi4pWfXCI6XCImYm94VnI7XCIsXCLip4lcIjpcIiZib3hib3g7XCIsXCLilZVcIjpcIiZib3hkTDtcIixcIuKVklwiOlwiJmJveGRSO1wiLFwi4pSQXCI6XCImYm94ZGw7XCIsXCLilIxcIjpcIiZib3hkcjtcIixcIuKVpVwiOlwiJmJveGhEO1wiLFwi4pWoXCI6XCImYm94aFU7XCIsXCLilKxcIjpcIiZib3hoZDtcIixcIuKUtFwiOlwiJmJveGh1O1wiLFwi4oqfXCI6XCImbWludXNiO1wiLFwi4oqeXCI6XCImcGx1c2I7XCIsXCLiiqBcIjpcIiZ0aW1lc2I7XCIsXCLilZtcIjpcIiZib3h1TDtcIixcIuKVmFwiOlwiJmJveHVSO1wiLFwi4pSYXCI6XCImYm94dWw7XCIsXCLilJRcIjpcIiZib3h1cjtcIixcIuKUglwiOlwiJmJveHY7XCIsXCLilapcIjpcIiZib3h2SDtcIixcIuKVoVwiOlwiJmJveHZMO1wiLFwi4pWeXCI6XCImYm94dlI7XCIsXCLilLxcIjpcIiZib3h2aDtcIixcIuKUpFwiOlwiJmJveHZsO1wiLFwi4pScXCI6XCImYm94dnI7XCIsXCLCplwiOlwiJmJydmJhcjtcIixcIvCdkrdcIjpcIiZic2NyO1wiLFwi4oGPXCI6XCImYnNlbWk7XCIsXCJcXFxcXCI6XCImYnNvbDtcIixcIuKnhVwiOlwiJmJzb2xiO1wiLFwi4p+IXCI6XCImYnNvbGhzdWI7XCIsXCLigKJcIjpcIiZidWxsZXQ7XCIsXCLiqq5cIjpcIiZidW1wRTtcIixcIsSHXCI6XCImY2FjdXRlO1wiLFwi4oipXCI6XCImY2FwO1wiLFwi4qmEXCI6XCImY2FwYW5kO1wiLFwi4qmJXCI6XCImY2FwYnJjdXA7XCIsXCLiqYtcIjpcIiZjYXBjYXA7XCIsXCLiqYdcIjpcIiZjYXBjdXA7XCIsXCLiqYBcIjpcIiZjYXBkb3Q7XCIsXCLiiKnvuIBcIjpcIiZjYXBzO1wiLFwi4oGBXCI6XCImY2FyZXQ7XCIsXCLiqY1cIjpcIiZjY2FwcztcIixcIsSNXCI6XCImY2Nhcm9uO1wiLFwiw6dcIjpcIiZjY2VkaWw7XCIsXCLEiVwiOlwiJmNjaXJjO1wiLFwi4qmMXCI6XCImY2N1cHM7XCIsXCLiqZBcIjpcIiZjY3Vwc3NtO1wiLFwixItcIjpcIiZjZG90O1wiLFwi4qayXCI6XCImY2VtcHR5djtcIixcIsKiXCI6XCImY2VudDtcIixcIvCdlKBcIjpcIiZjZnI7XCIsXCLRh1wiOlwiJmNoY3k7XCIsXCLinJNcIjpcIiZjaGVja21hcms7XCIsXCLPh1wiOlwiJmNoaTtcIixcIuKXi1wiOlwiJmNpcjtcIixcIuKng1wiOlwiJmNpckU7XCIsXCLLhlwiOlwiJmNpcmM7XCIsXCLiiZdcIjpcIiZjaXJlO1wiLFwi4oa6XCI6XCImb2xhcnI7XCIsXCLihrtcIjpcIiZvcmFycjtcIixcIuKTiFwiOlwiJm9TO1wiLFwi4oqbXCI6XCImb2FzdDtcIixcIuKKmlwiOlwiJm9jaXI7XCIsXCLiip1cIjpcIiZvZGFzaDtcIixcIuKokFwiOlwiJmNpcmZuaW50O1wiLFwi4quvXCI6XCImY2lybWlkO1wiLFwi4qeCXCI6XCImY2lyc2NpcjtcIixcIuKZo1wiOlwiJmNsdWJzdWl0O1wiLFwiOlwiOlwiJmNvbG9uO1wiLFwiLFwiOlwiJmNvbW1hO1wiLFwiQFwiOlwiJmNvbW1hdDtcIixcIuKIgVwiOlwiJmNvbXBsZW1lbnQ7XCIsXCLiqa1cIjpcIiZjb25nZG90O1wiLFwi8J2VlFwiOlwiJmNvcGY7XCIsXCLihJdcIjpcIiZjb3B5c3I7XCIsXCLihrVcIjpcIiZjcmFycjtcIixcIuKcl1wiOlwiJmNyb3NzO1wiLFwi8J2SuFwiOlwiJmNzY3I7XCIsXCLiq49cIjpcIiZjc3ViO1wiLFwi4quRXCI6XCImY3N1YmU7XCIsXCLiq5BcIjpcIiZjc3VwO1wiLFwi4quSXCI6XCImY3N1cGU7XCIsXCLii69cIjpcIiZjdGRvdDtcIixcIuKkuFwiOlwiJmN1ZGFycmw7XCIsXCLipLVcIjpcIiZjdWRhcnJyO1wiLFwi4oueXCI6XCImY3VybHllcXByZWM7XCIsXCLii59cIjpcIiZjdXJseWVxc3VjYztcIixcIuKGtlwiOlwiJmN1cnZlYXJyb3dsZWZ0O1wiLFwi4qS9XCI6XCImY3VsYXJycDtcIixcIuKIqlwiOlwiJmN1cDtcIixcIuKpiFwiOlwiJmN1cGJyY2FwO1wiLFwi4qmGXCI6XCImY3VwY2FwO1wiLFwi4qmKXCI6XCImY3VwY3VwO1wiLFwi4oqNXCI6XCImY3VwZG90O1wiLFwi4qmFXCI6XCImY3Vwb3I7XCIsXCLiiKrvuIBcIjpcIiZjdXBzO1wiLFwi4oa3XCI6XCImY3VydmVhcnJvd3JpZ2h0O1wiLFwi4qS8XCI6XCImY3VyYXJybTtcIixcIuKLjlwiOlwiJmN1dmVlO1wiLFwi4ouPXCI6XCImY3V3ZWQ7XCIsXCLCpFwiOlwiJmN1cnJlbjtcIixcIuKIsVwiOlwiJmN3aW50O1wiLFwi4oytXCI6XCImY3lsY3R5O1wiLFwi4qWlXCI6XCImZEhhcjtcIixcIuKAoFwiOlwiJmRhZ2dlcjtcIixcIuKEuFwiOlwiJmRhbGV0aDtcIixcIuKAkFwiOlwiJmh5cGhlbjtcIixcIuKkj1wiOlwiJnJCYXJyO1wiLFwixI9cIjpcIiZkY2Fyb247XCIsXCLQtFwiOlwiJmRjeTtcIixcIuKHilwiOlwiJmRvd25kb3duYXJyb3dzO1wiLFwi4qm3XCI6XCImZUREb3Q7XCIsXCLCsFwiOlwiJmRlZztcIixcIs60XCI6XCImZGVsdGE7XCIsXCLiprFcIjpcIiZkZW1wdHl2O1wiLFwi4qW/XCI6XCImZGZpc2h0O1wiLFwi8J2UoVwiOlwiJmRmcjtcIixcIuKZplwiOlwiJmRpYW1zO1wiLFwiz51cIjpcIiZnYW1tYWQ7XCIsXCLii7JcIjpcIiZkaXNpbjtcIixcIsO3XCI6XCImZGl2aWRlO1wiLFwi4ouHXCI6XCImZGl2b254O1wiLFwi0ZJcIjpcIiZkamN5O1wiLFwi4oyeXCI6XCImbGxjb3JuZXI7XCIsXCLijI1cIjpcIiZkbGNyb3A7XCIsJDpcIiZkb2xsYXI7XCIsXCLwnZWVXCI6XCImZG9wZjtcIixcIuKJkVwiOlwiJmVEb3Q7XCIsXCLiiLhcIjpcIiZtaW51c2Q7XCIsXCLiiJRcIjpcIiZwbHVzZG87XCIsXCLiiqFcIjpcIiZzZG90YjtcIixcIuKMn1wiOlwiJmxyY29ybmVyO1wiLFwi4oyMXCI6XCImZHJjcm9wO1wiLFwi8J2SuVwiOlwiJmRzY3I7XCIsXCLRlVwiOlwiJmRzY3k7XCIsXCLip7ZcIjpcIiZkc29sO1wiLFwixJFcIjpcIiZkc3Ryb2s7XCIsXCLii7FcIjpcIiZkdGRvdDtcIixcIuKWv1wiOlwiJnRyaWFuZ2xlZG93bjtcIixcIuKmplwiOlwiJmR3YW5nbGU7XCIsXCLRn1wiOlwiJmR6Y3k7XCIsXCLin79cIjpcIiZkemlncmFycjtcIixcIsOpXCI6XCImZWFjdXRlO1wiLFwi4qmuXCI6XCImZWFzdGVyO1wiLFwixJtcIjpcIiZlY2Fyb247XCIsXCLiiZZcIjpcIiZlcWNpcmM7XCIsXCLDqlwiOlwiJmVjaXJjO1wiLFwi4omVXCI6XCImZXFjb2xvbjtcIixcItGNXCI6XCImZWN5O1wiLFwixJdcIjpcIiZlZG90O1wiLFwi4omSXCI6XCImZmFsbGluZ2RvdHNlcTtcIixcIvCdlKJcIjpcIiZlZnI7XCIsXCLiqppcIjpcIiZlZztcIixcIsOoXCI6XCImZWdyYXZlO1wiLFwi4qqWXCI6XCImZXFzbGFudGd0cjtcIixcIuKqmFwiOlwiJmVnc2RvdDtcIixcIuKqmVwiOlwiJmVsO1wiLFwi4o+nXCI6XCImZWxpbnRlcnM7XCIsXCLihJNcIjpcIiZlbGw7XCIsXCLiqpVcIjpcIiZlcXNsYW50bGVzcztcIixcIuKql1wiOlwiJmVsc2RvdDtcIixcIsSTXCI6XCImZW1hY3I7XCIsXCLiiIVcIjpcIiZ2YXJub3RoaW5nO1wiLFwi4oCEXCI6XCImZW1zcDEzO1wiLFwi4oCFXCI6XCImZW1zcDE0O1wiLFwi4oCDXCI6XCImZW1zcDtcIixcIsWLXCI6XCImZW5nO1wiLFwi4oCCXCI6XCImZW5zcDtcIixcIsSZXCI6XCImZW9nb247XCIsXCLwnZWWXCI6XCImZW9wZjtcIixcIuKLlVwiOlwiJmVwYXI7XCIsXCLip6NcIjpcIiZlcGFyc2w7XCIsXCLiqbFcIjpcIiZlcGx1cztcIixcIs61XCI6XCImZXBzaWxvbjtcIixcIs+1XCI6XCImdmFyZXBzaWxvbjtcIixcIj1cIjpcIiZlcXVhbHM7XCIsXCLiiZ9cIjpcIiZxdWVzdGVxO1wiLFwi4qm4XCI6XCImZXF1aXZERDtcIixcIuKnpVwiOlwiJmVxdnBhcnNsO1wiLFwi4omTXCI6XCImcmlzaW5nZG90c2VxO1wiLFwi4qWxXCI6XCImZXJhcnI7XCIsXCLihK9cIjpcIiZlc2NyO1wiLFwizrdcIjpcIiZldGE7XCIsXCLDsFwiOlwiJmV0aDtcIixcIsOrXCI6XCImZXVtbDtcIixcIuKCrFwiOlwiJmV1cm87XCIsXCIhXCI6XCImZXhjbDtcIixcItGEXCI6XCImZmN5O1wiLFwi4pmAXCI6XCImZmVtYWxlO1wiLFwi76yDXCI6XCImZmZpbGlnO1wiLFwi76yAXCI6XCImZmZsaWc7XCIsXCLvrIRcIjpcIiZmZmxsaWc7XCIsXCLwnZSjXCI6XCImZmZyO1wiLFwi76yBXCI6XCImZmlsaWc7XCIsZmo6XCImZmpsaWc7XCIsXCLima1cIjpcIiZmbGF0O1wiLFwi76yCXCI6XCImZmxsaWc7XCIsXCLilrFcIjpcIiZmbHRucztcIixcIsaSXCI6XCImZm5vZjtcIixcIvCdlZdcIjpcIiZmb3BmO1wiLFwi4ouUXCI6XCImcGl0Y2hmb3JrO1wiLFwi4quZXCI6XCImZm9ya3Y7XCIsXCLiqI1cIjpcIiZmcGFydGludDtcIixcIsK9XCI6XCImaGFsZjtcIixcIuKFk1wiOlwiJmZyYWMxMztcIixcIsK8XCI6XCImZnJhYzE0O1wiLFwi4oWVXCI6XCImZnJhYzE1O1wiLFwi4oWZXCI6XCImZnJhYzE2O1wiLFwi4oWbXCI6XCImZnJhYzE4O1wiLFwi4oWUXCI6XCImZnJhYzIzO1wiLFwi4oWWXCI6XCImZnJhYzI1O1wiLFwiwr5cIjpcIiZmcmFjMzQ7XCIsXCLihZdcIjpcIiZmcmFjMzU7XCIsXCLihZxcIjpcIiZmcmFjMzg7XCIsXCLihZhcIjpcIiZmcmFjNDU7XCIsXCLihZpcIjpcIiZmcmFjNTY7XCIsXCLihZ1cIjpcIiZmcmFjNTg7XCIsXCLihZ5cIjpcIiZmcmFjNzg7XCIsXCLigYRcIjpcIiZmcmFzbDtcIixcIuKMolwiOlwiJnNmcm93bjtcIixcIvCdkrtcIjpcIiZmc2NyO1wiLFwi4qqMXCI6XCImZ3RyZXFxbGVzcztcIixcIse1XCI6XCImZ2FjdXRlO1wiLFwizrNcIjpcIiZnYW1tYTtcIixcIuKqhlwiOlwiJmd0cmFwcHJveDtcIixcIsSfXCI6XCImZ2JyZXZlO1wiLFwixJ1cIjpcIiZnY2lyYztcIixcItCzXCI6XCImZ2N5O1wiLFwixKFcIjpcIiZnZG90O1wiLFwi4qqpXCI6XCImZ2VzY2M7XCIsXCLiqoBcIjpcIiZnZXNkb3Q7XCIsXCLiqoJcIjpcIiZnZXNkb3RvO1wiLFwi4qqEXCI6XCImZ2VzZG90b2w7XCIsXCLii5vvuIBcIjpcIiZnZXNsO1wiLFwi4qqUXCI6XCImZ2VzbGVzO1wiLFwi8J2UpFwiOlwiJmdmcjtcIixcIuKEt1wiOlwiJmdpbWVsO1wiLFwi0ZNcIjpcIiZnamN5O1wiLFwi4qqSXCI6XCImZ2xFO1wiLFwi4qqlXCI6XCImZ2xhO1wiLFwi4qqkXCI6XCImZ2xqO1wiLFwi4ompXCI6XCImZ25lcXE7XCIsXCLiqopcIjpcIiZnbmFwcHJveDtcIixcIuKqiFwiOlwiJmduZXE7XCIsXCLii6dcIjpcIiZnbnNpbTtcIixcIvCdlZhcIjpcIiZnb3BmO1wiLFwi4oSKXCI6XCImZ3NjcjtcIixcIuKqjlwiOlwiJmdzaW1lO1wiLFwi4qqQXCI6XCImZ3NpbWw7XCIsXCLiqqdcIjpcIiZndGNjO1wiLFwi4qm6XCI6XCImZ3RjaXI7XCIsXCLii5dcIjpcIiZndHJkb3Q7XCIsXCLippVcIjpcIiZndGxQYXI7XCIsXCLiqbxcIjpcIiZndHF1ZXN0O1wiLFwi4qW4XCI6XCImZ3RyYXJyO1wiLFwi4omp77iAXCI6XCImZ3ZuRTtcIixcItGKXCI6XCImaGFyZGN5O1wiLFwi4qWIXCI6XCImaGFycmNpcjtcIixcIuKGrVwiOlwiJmxlZnRyaWdodHNxdWlnYXJyb3c7XCIsXCLihI9cIjpcIiZwbGFua3Y7XCIsXCLEpVwiOlwiJmhjaXJjO1wiLFwi4pmlXCI6XCImaGVhcnRzdWl0O1wiLFwi4oCmXCI6XCImbWxkcjtcIixcIuKKuVwiOlwiJmhlcmNvbjtcIixcIvCdlKVcIjpcIiZoZnI7XCIsXCLipKVcIjpcIiZzZWFyaGs7XCIsXCLipKZcIjpcIiZzd2FyaGs7XCIsXCLih79cIjpcIiZob2FycjtcIixcIuKIu1wiOlwiJmhvbXRodDtcIixcIuKGqVwiOlwiJmxhcnJoaztcIixcIuKGqlwiOlwiJnJhcnJoaztcIixcIvCdlZlcIjpcIiZob3BmO1wiLFwi4oCVXCI6XCImaG9yYmFyO1wiLFwi8J2SvVwiOlwiJmhzY3I7XCIsXCLEp1wiOlwiJmhzdHJvaztcIixcIuKBg1wiOlwiJmh5YnVsbDtcIixcIsOtXCI6XCImaWFjdXRlO1wiLFwiw65cIjpcIiZpY2lyYztcIixcItC4XCI6XCImaWN5O1wiLFwi0LVcIjpcIiZpZWN5O1wiLFwiwqFcIjpcIiZpZXhjbDtcIixcIvCdlKZcIjpcIiZpZnI7XCIsXCLDrFwiOlwiJmlncmF2ZTtcIixcIuKojFwiOlwiJnFpbnQ7XCIsXCLiiK1cIjpcIiZ0aW50O1wiLFwi4qecXCI6XCImaWluZmluO1wiLFwi4oSpXCI6XCImaWlvdGE7XCIsXCLEs1wiOlwiJmlqbGlnO1wiLFwixKtcIjpcIiZpbWFjcjtcIixcIsSxXCI6XCImaW5vZG90O1wiLFwi4oq3XCI6XCImaW1vZjtcIixcIsa1XCI6XCImaW1wZWQ7XCIsXCLihIVcIjpcIiZpbmNhcmU7XCIsXCLiiJ5cIjpcIiZpbmZpbjtcIixcIuKnnVwiOlwiJmluZmludGllO1wiLFwi4oq6XCI6XCImaW50ZXJjYWw7XCIsXCLiqJdcIjpcIiZpbnRsYXJoaztcIixcIuKovFwiOlwiJmlwcm9kO1wiLFwi0ZFcIjpcIiZpb2N5O1wiLFwixK9cIjpcIiZpb2dvbjtcIixcIvCdlZpcIjpcIiZpb3BmO1wiLFwizrlcIjpcIiZpb3RhO1wiLFwiwr9cIjpcIiZpcXVlc3Q7XCIsXCLwnZK+XCI6XCImaXNjcjtcIixcIuKLuVwiOlwiJmlzaW5FO1wiLFwi4ou1XCI6XCImaXNpbmRvdDtcIixcIuKLtFwiOlwiJmlzaW5zO1wiLFwi4ouzXCI6XCImaXNpbnN2O1wiLFwixKlcIjpcIiZpdGlsZGU7XCIsXCLRllwiOlwiJml1a2N5O1wiLFwiw69cIjpcIiZpdW1sO1wiLFwixLVcIjpcIiZqY2lyYztcIixcItC5XCI6XCImamN5O1wiLFwi8J2Up1wiOlwiJmpmcjtcIixcIsi3XCI6XCImam1hdGg7XCIsXCLwnZWbXCI6XCImam9wZjtcIixcIvCdkr9cIjpcIiZqc2NyO1wiLFwi0ZhcIjpcIiZqc2VyY3k7XCIsXCLRlFwiOlwiJmp1a2N5O1wiLFwizrpcIjpcIiZrYXBwYTtcIixcIs+wXCI6XCImdmFya2FwcGE7XCIsXCLEt1wiOlwiJmtjZWRpbDtcIixcItC6XCI6XCIma2N5O1wiLFwi8J2UqFwiOlwiJmtmcjtcIixcIsS4XCI6XCIma2dyZWVuO1wiLFwi0YVcIjpcIiZraGN5O1wiLFwi0ZxcIjpcIiZramN5O1wiLFwi8J2VnFwiOlwiJmtvcGY7XCIsXCLwnZOAXCI6XCIma3NjcjtcIixcIuKkm1wiOlwiJmxBdGFpbDtcIixcIuKkjlwiOlwiJmxCYXJyO1wiLFwi4qqLXCI6XCImbGVzc2VxcWd0cjtcIixcIuKlolwiOlwiJmxIYXI7XCIsXCLEulwiOlwiJmxhY3V0ZTtcIixcIuKmtFwiOlwiJmxhZW1wdHl2O1wiLFwizrtcIjpcIiZsYW1iZGE7XCIsXCLippFcIjpcIiZsYW5nZDtcIixcIuKqhVwiOlwiJmxlc3NhcHByb3g7XCIsXCLCq1wiOlwiJmxhcXVvO1wiLFwi4qSfXCI6XCImbGFycmJmcztcIixcIuKknVwiOlwiJmxhcnJmcztcIixcIuKGq1wiOlwiJmxvb3BhcnJvd2xlZnQ7XCIsXCLipLlcIjpcIiZsYXJycGw7XCIsXCLipbNcIjpcIiZsYXJyc2ltO1wiLFwi4oaiXCI6XCImbGVmdGFycm93dGFpbDtcIixcIuKqq1wiOlwiJmxhdDtcIixcIuKkmVwiOlwiJmxhdGFpbDtcIixcIuKqrVwiOlwiJmxhdGU7XCIsXCLiqq3vuIBcIjpcIiZsYXRlcztcIixcIuKkjFwiOlwiJmxiYXJyO1wiLFwi4p2yXCI6XCImbGJicms7XCIsXCJ7XCI6XCImbGN1YjtcIixcIltcIjpcIiZsc3FiO1wiLFwi4qaLXCI6XCImbGJya2U7XCIsXCLipo9cIjpcIiZsYnJrc2xkO1wiLFwi4qaNXCI6XCImbGJya3NsdTtcIixcIsS+XCI6XCImbGNhcm9uO1wiLFwixLxcIjpcIiZsY2VkaWw7XCIsXCLQu1wiOlwiJmxjeTtcIixcIuKktlwiOlwiJmxkY2E7XCIsXCLipadcIjpcIiZsZHJkaGFyO1wiLFwi4qWLXCI6XCImbGRydXNoYXI7XCIsXCLihrJcIjpcIiZsZHNoO1wiLFwi4omkXCI6XCImbGVxO1wiLFwi4oeHXCI6XCImbGxhcnI7XCIsXCLii4tcIjpcIiZsdGhyZWU7XCIsXCLiqqhcIjpcIiZsZXNjYztcIixcIuKpv1wiOlwiJmxlc2RvdDtcIixcIuKqgVwiOlwiJmxlc2RvdG87XCIsXCLiqoNcIjpcIiZsZXNkb3RvcjtcIixcIuKLmu+4gFwiOlwiJmxlc2c7XCIsXCLiqpNcIjpcIiZsZXNnZXM7XCIsXCLii5ZcIjpcIiZsdGRvdDtcIixcIuKlvFwiOlwiJmxmaXNodDtcIixcIvCdlKlcIjpcIiZsZnI7XCIsXCLiqpFcIjpcIiZsZ0U7XCIsXCLipapcIjpcIiZsaGFydWw7XCIsXCLiloRcIjpcIiZsaGJsaztcIixcItGZXCI6XCImbGpjeTtcIixcIuKlq1wiOlwiJmxsaGFyZDtcIixcIuKXulwiOlwiJmxsdHJpO1wiLFwixYBcIjpcIiZsbWlkb3Q7XCIsXCLijrBcIjpcIiZsbW91c3RhY2hlO1wiLFwi4omoXCI6XCImbG5lcXE7XCIsXCLiqolcIjpcIiZsbmFwcHJveDtcIixcIuKqh1wiOlwiJmxuZXE7XCIsXCLii6ZcIjpcIiZsbnNpbTtcIixcIuKfrFwiOlwiJmxvYW5nO1wiLFwi4oe9XCI6XCImbG9hcnI7XCIsXCLin7xcIjpcIiZ4bWFwO1wiLFwi4oasXCI6XCImcmFycmxwO1wiLFwi4qaFXCI6XCImbG9wYXI7XCIsXCLwnZWdXCI6XCImbG9wZjtcIixcIuKorVwiOlwiJmxvcGx1cztcIixcIuKotFwiOlwiJmxvdGltZXM7XCIsXCLiiJdcIjpcIiZsb3dhc3Q7XCIsXCLil4pcIjpcIiZsb3plbmdlO1wiLFwiKFwiOlwiJmxwYXI7XCIsXCLippNcIjpcIiZscGFybHQ7XCIsXCLipa1cIjpcIiZscmhhcmQ7XCIsXCLigI5cIjpcIiZscm07XCIsXCLiir9cIjpcIiZscnRyaTtcIixcIuKAuVwiOlwiJmxzYXF1bztcIixcIvCdk4FcIjpcIiZsc2NyO1wiLFwi4qqNXCI6XCImbHNpbWU7XCIsXCLiqo9cIjpcIiZsc2ltZztcIixcIuKAmlwiOlwiJnNicXVvO1wiLFwixYJcIjpcIiZsc3Ryb2s7XCIsXCLiqqZcIjpcIiZsdGNjO1wiLFwi4qm5XCI6XCImbHRjaXI7XCIsXCLii4lcIjpcIiZsdGltZXM7XCIsXCLipbZcIjpcIiZsdGxhcnI7XCIsXCLiqbtcIjpcIiZsdHF1ZXN0O1wiLFwi4qaWXCI6XCImbHRyUGFyO1wiLFwi4peDXCI6XCImdHJpYW5nbGVsZWZ0O1wiLFwi4qWKXCI6XCImbHVyZHNoYXI7XCIsXCLipaZcIjpcIiZsdXJ1aGFyO1wiLFwi4omo77iAXCI6XCImbHZuRTtcIixcIuKIulwiOlwiJm1ERG90O1wiLFwiwq9cIjpcIiZzdHJucztcIixcIuKZglwiOlwiJm1hbGU7XCIsXCLinKBcIjpcIiZtYWx0ZXNlO1wiLFwi4pauXCI6XCImbWFya2VyO1wiLFwi4qipXCI6XCImbWNvbW1hO1wiLFwi0LxcIjpcIiZtY3k7XCIsXCLigJRcIjpcIiZtZGFzaDtcIixcIvCdlKpcIjpcIiZtZnI7XCIsXCLihKdcIjpcIiZtaG87XCIsXCLCtVwiOlwiJm1pY3JvO1wiLFwi4quwXCI6XCImbWlkY2lyO1wiLFwi4oiSXCI6XCImbWludXM7XCIsXCLiqKpcIjpcIiZtaW51c2R1O1wiLFwi4qubXCI6XCImbWxjcDtcIixcIuKKp1wiOlwiJm1vZGVscztcIixcIvCdlZ5cIjpcIiZtb3BmO1wiLFwi8J2TglwiOlwiJm1zY3I7XCIsXCLOvFwiOlwiJm11O1wiLFwi4oq4XCI6XCImbXVtYXA7XCIsXCLii5nMuFwiOlwiJm5HZztcIixcIuKJq+KDklwiOlwiJm5HdDtcIixcIuKHjVwiOlwiJm5sQXJyO1wiLFwi4oeOXCI6XCImbmhBcnI7XCIsXCLii5jMuFwiOlwiJm5MbDtcIixcIuKJquKDklwiOlwiJm5MdDtcIixcIuKHj1wiOlwiJm5yQXJyO1wiLFwi4oqvXCI6XCImblZEYXNoO1wiLFwi4oquXCI6XCImblZkYXNoO1wiLFwixYRcIjpcIiZuYWN1dGU7XCIsXCLiiKDig5JcIjpcIiZuYW5nO1wiLFwi4qmwzLhcIjpcIiZuYXBFO1wiLFwi4omLzLhcIjpcIiZuYXBpZDtcIixcIsWJXCI6XCImbmFwb3M7XCIsXCLima5cIjpcIiZuYXR1cmFsO1wiLFwi4qmDXCI6XCImbmNhcDtcIixcIsWIXCI6XCImbmNhcm9uO1wiLFwixYZcIjpcIiZuY2VkaWw7XCIsXCLiqa3MuFwiOlwiJm5jb25nZG90O1wiLFwi4qmCXCI6XCImbmN1cDtcIixcItC9XCI6XCImbmN5O1wiLFwi4oCTXCI6XCImbmRhc2g7XCIsXCLih5dcIjpcIiZuZUFycjtcIixcIuKkpFwiOlwiJm5lYXJoaztcIixcIuKJkMy4XCI6XCImbmVkb3Q7XCIsXCLipKhcIjpcIiZ0b2VhO1wiLFwi8J2Uq1wiOlwiJm5mcjtcIixcIuKGrlwiOlwiJm5sZWZ0cmlnaHRhcnJvdztcIixcIuKrslwiOlwiJm5ocGFyO1wiLFwi4ou8XCI6XCImbmlzO1wiLFwi4ou6XCI6XCImbmlzZDtcIixcItGaXCI6XCImbmpjeTtcIixcIuKJpsy4XCI6XCImbmxlcXE7XCIsXCLihppcIjpcIiZubGVmdGFycm93O1wiLFwi4oClXCI6XCImbmxkcjtcIixcIvCdlZ9cIjpcIiZub3BmO1wiLFwiwqxcIjpcIiZub3Q7XCIsXCLii7nMuFwiOlwiJm5vdGluRTtcIixcIuKLtcy4XCI6XCImbm90aW5kb3Q7XCIsXCLii7dcIjpcIiZub3RpbnZiO1wiLFwi4ou2XCI6XCImbm90aW52YztcIixcIuKLvlwiOlwiJm5vdG5pdmI7XCIsXCLii71cIjpcIiZub3RuaXZjO1wiLFwi4qu94oOlXCI6XCImbnBhcnNsO1wiLFwi4oiCzLhcIjpcIiZucGFydDtcIixcIuKolFwiOlwiJm5wb2xpbnQ7XCIsXCLihptcIjpcIiZucmlnaHRhcnJvdztcIixcIuKks8y4XCI6XCImbnJhcnJjO1wiLFwi4oadzLhcIjpcIiZucmFycnc7XCIsXCLwnZODXCI6XCImbnNjcjtcIixcIuKKhFwiOlwiJm5zdWI7XCIsXCLiq4XMuFwiOlwiJm5zdWJzZXRlcXE7XCIsXCLiioVcIjpcIiZuc3VwO1wiLFwi4quGzLhcIjpcIiZuc3Vwc2V0ZXFxO1wiLFwiw7FcIjpcIiZudGlsZGU7XCIsXCLOvVwiOlwiJm51O1wiLFwiI1wiOlwiJm51bTtcIixcIuKEllwiOlwiJm51bWVybztcIixcIuKAh1wiOlwiJm51bXNwO1wiLFwi4oqtXCI6XCImbnZEYXNoO1wiLFwi4qSEXCI6XCImbnZIYXJyO1wiLFwi4omN4oOSXCI6XCImbnZhcDtcIixcIuKKrFwiOlwiJm52ZGFzaDtcIixcIuKJpeKDklwiOlwiJm52Z2U7XCIsXCI+4oOSXCI6XCImbnZndDtcIixcIuKnnlwiOlwiJm52aW5maW47XCIsXCLipIJcIjpcIiZudmxBcnI7XCIsXCLiiaTig5JcIjpcIiZudmxlO1wiLFwiPOKDklwiOlwiJm52bHQ7XCIsXCLiirTig5JcIjpcIiZudmx0cmllO1wiLFwi4qSDXCI6XCImbnZyQXJyO1wiLFwi4oq14oOSXCI6XCImbnZydHJpZTtcIixcIuKIvOKDklwiOlwiJm52c2ltO1wiLFwi4oeWXCI6XCImbndBcnI7XCIsXCLipKNcIjpcIiZud2FyaGs7XCIsXCLipKdcIjpcIiZud25lYXI7XCIsXCLDs1wiOlwiJm9hY3V0ZTtcIixcIsO0XCI6XCImb2NpcmM7XCIsXCLQvlwiOlwiJm9jeTtcIixcIsWRXCI6XCImb2RibGFjO1wiLFwi4qi4XCI6XCImb2RpdjtcIixcIuKmvFwiOlwiJm9kc29sZDtcIixcIsWTXCI6XCImb2VsaWc7XCIsXCLipr9cIjpcIiZvZmNpcjtcIixcIvCdlKxcIjpcIiZvZnI7XCIsXCLLm1wiOlwiJm9nb247XCIsXCLDslwiOlwiJm9ncmF2ZTtcIixcIuKngVwiOlwiJm9ndDtcIixcIuKmtVwiOlwiJm9oYmFyO1wiLFwi4qa+XCI6XCImb2xjaXI7XCIsXCLiprtcIjpcIiZvbGNyb3NzO1wiLFwi4qeAXCI6XCImb2x0O1wiLFwixY1cIjpcIiZvbWFjcjtcIixcIs+JXCI6XCImb21lZ2E7XCIsXCLOv1wiOlwiJm9taWNyb247XCIsXCLiprZcIjpcIiZvbWlkO1wiLFwi8J2VoFwiOlwiJm9vcGY7XCIsXCLiprdcIjpcIiZvcGFyO1wiLFwi4qa5XCI6XCImb3BlcnA7XCIsXCLiiKhcIjpcIiZ2ZWU7XCIsXCLiqZ1cIjpcIiZvcmQ7XCIsXCLihLRcIjpcIiZvc2NyO1wiLFwiwqpcIjpcIiZvcmRmO1wiLFwiwrpcIjpcIiZvcmRtO1wiLFwi4oq2XCI6XCImb3JpZ29mO1wiLFwi4qmWXCI6XCImb3JvcjtcIixcIuKpl1wiOlwiJm9yc2xvcGU7XCIsXCLiqZtcIjpcIiZvcnY7XCIsXCLDuFwiOlwiJm9zbGFzaDtcIixcIuKKmFwiOlwiJm9zb2w7XCIsXCLDtVwiOlwiJm90aWxkZTtcIixcIuKotlwiOlwiJm90aW1lc2FzO1wiLFwiw7ZcIjpcIiZvdW1sO1wiLFwi4oy9XCI6XCImb3ZiYXI7XCIsXCLCtlwiOlwiJnBhcmE7XCIsXCLiq7NcIjpcIiZwYXJzaW07XCIsXCLiq71cIjpcIiZwYXJzbDtcIixcItC/XCI6XCImcGN5O1wiLFwiJVwiOlwiJnBlcmNudDtcIixcIi5cIjpcIiZwZXJpb2Q7XCIsXCLigLBcIjpcIiZwZXJtaWw7XCIsXCLigLFcIjpcIiZwZXJ0ZW5rO1wiLFwi8J2UrVwiOlwiJnBmcjtcIixcIs+GXCI6XCImcGhpO1wiLFwiz5VcIjpcIiZ2YXJwaGk7XCIsXCLimI5cIjpcIiZwaG9uZTtcIixcIs+AXCI6XCImcGk7XCIsXCLPllwiOlwiJnZhcnBpO1wiLFwi4oSOXCI6XCImcGxhbmNraDtcIixcIitcIjpcIiZwbHVzO1wiLFwi4qijXCI6XCImcGx1c2FjaXI7XCIsXCLiqKJcIjpcIiZwbHVzY2lyO1wiLFwi4qilXCI6XCImcGx1c2R1O1wiLFwi4qmyXCI6XCImcGx1c2U7XCIsXCLiqKZcIjpcIiZwbHVzc2ltO1wiLFwi4qinXCI6XCImcGx1c3R3bztcIixcIuKolVwiOlwiJnBvaW50aW50O1wiLFwi8J2VoVwiOlwiJnBvcGY7XCIsXCLCo1wiOlwiJnBvdW5kO1wiLFwi4qqzXCI6XCImcHJFO1wiLFwi4qq3XCI6XCImcHJlY2FwcHJveDtcIixcIuKquVwiOlwiJnBybmFwO1wiLFwi4qq1XCI6XCImcHJuRTtcIixcIuKLqFwiOlwiJnBybnNpbTtcIixcIuKAslwiOlwiJnByaW1lO1wiLFwi4oyuXCI6XCImcHJvZmFsYXI7XCIsXCLijJJcIjpcIiZwcm9mbGluZTtcIixcIuKMk1wiOlwiJnByb2ZzdXJmO1wiLFwi4oqwXCI6XCImcHJ1cmVsO1wiLFwi8J2ThVwiOlwiJnBzY3I7XCIsXCLPiFwiOlwiJnBzaTtcIixcIuKAiFwiOlwiJnB1bmNzcDtcIixcIvCdlK5cIjpcIiZxZnI7XCIsXCLwnZWiXCI6XCImcW9wZjtcIixcIuKBl1wiOlwiJnFwcmltZTtcIixcIvCdk4ZcIjpcIiZxc2NyO1wiLFwi4qiWXCI6XCImcXVhdGludDtcIixcIj9cIjpcIiZxdWVzdDtcIixcIuKknFwiOlwiJnJBdGFpbDtcIixcIuKlpFwiOlwiJnJIYXI7XCIsXCLiiL3MsVwiOlwiJnJhY2U7XCIsXCLFlVwiOlwiJnJhY3V0ZTtcIixcIuKms1wiOlwiJnJhZW1wdHl2O1wiLFwi4qaSXCI6XCImcmFuZ2Q7XCIsXCLipqVcIjpcIiZyYW5nZTtcIixcIsK7XCI6XCImcmFxdW87XCIsXCLipbVcIjpcIiZyYXJyYXA7XCIsXCLipKBcIjpcIiZyYXJyYmZzO1wiLFwi4qSzXCI6XCImcmFycmM7XCIsXCLipJ5cIjpcIiZyYXJyZnM7XCIsXCLipYVcIjpcIiZyYXJycGw7XCIsXCLipbRcIjpcIiZyYXJyc2ltO1wiLFwi4oajXCI6XCImcmlnaHRhcnJvd3RhaWw7XCIsXCLihp1cIjpcIiZyaWdodHNxdWlnYXJyb3c7XCIsXCLipJpcIjpcIiZyYXRhaWw7XCIsXCLiiLZcIjpcIiZyYXRpbztcIixcIuKds1wiOlwiJnJiYnJrO1wiLFwifVwiOlwiJnJjdWI7XCIsXCJdXCI6XCImcnNxYjtcIixcIuKmjFwiOlwiJnJicmtlO1wiLFwi4qaOXCI6XCImcmJya3NsZDtcIixcIuKmkFwiOlwiJnJicmtzbHU7XCIsXCLFmVwiOlwiJnJjYXJvbjtcIixcIsWXXCI6XCImcmNlZGlsO1wiLFwi0YBcIjpcIiZyY3k7XCIsXCLipLdcIjpcIiZyZGNhO1wiLFwi4qWpXCI6XCImcmRsZGhhcjtcIixcIuKGs1wiOlwiJnJkc2g7XCIsXCLilq1cIjpcIiZyZWN0O1wiLFwi4qW9XCI6XCImcmZpc2h0O1wiLFwi8J2Ur1wiOlwiJnJmcjtcIixcIuKlrFwiOlwiJnJoYXJ1bDtcIixcIs+BXCI6XCImcmhvO1wiLFwiz7FcIjpcIiZ2YXJyaG87XCIsXCLih4lcIjpcIiZycmFycjtcIixcIuKLjFwiOlwiJnJ0aHJlZTtcIixcIsuaXCI6XCImcmluZztcIixcIuKAj1wiOlwiJnJsbTtcIixcIuKOsVwiOlwiJnJtb3VzdGFjaGU7XCIsXCLiq65cIjpcIiZybm1pZDtcIixcIuKfrVwiOlwiJnJvYW5nO1wiLFwi4oe+XCI6XCImcm9hcnI7XCIsXCLipoZcIjpcIiZyb3BhcjtcIixcIvCdlaNcIjpcIiZyb3BmO1wiLFwi4qiuXCI6XCImcm9wbHVzO1wiLFwi4qi1XCI6XCImcm90aW1lcztcIixcIilcIjpcIiZycGFyO1wiLFwi4qaUXCI6XCImcnBhcmd0O1wiLFwi4qiSXCI6XCImcnBwb2xpbnQ7XCIsXCLigLpcIjpcIiZyc2FxdW87XCIsXCLwnZOHXCI6XCImcnNjcjtcIixcIuKLilwiOlwiJnJ0aW1lcztcIixcIuKWuVwiOlwiJnRyaWFuZ2xlcmlnaHQ7XCIsXCLip45cIjpcIiZydHJpbHRyaTtcIixcIuKlqFwiOlwiJnJ1bHVoYXI7XCIsXCLihJ5cIjpcIiZyeDtcIixcIsWbXCI6XCImc2FjdXRlO1wiLFwi4qq0XCI6XCImc2NFO1wiLFwi4qq4XCI6XCImc3VjY2FwcHJveDtcIixcIsWhXCI6XCImc2Nhcm9uO1wiLFwixZ9cIjpcIiZzY2VkaWw7XCIsXCLFnVwiOlwiJnNjaXJjO1wiLFwi4qq2XCI6XCImc3VjY25lcXE7XCIsXCLiqrpcIjpcIiZzdWNjbmFwcHJveDtcIixcIuKLqVwiOlwiJnN1Y2Nuc2ltO1wiLFwi4qiTXCI6XCImc2Nwb2xpbnQ7XCIsXCLRgVwiOlwiJnNjeTtcIixcIuKLhVwiOlwiJnNkb3Q7XCIsXCLiqaZcIjpcIiZzZG90ZTtcIixcIuKHmFwiOlwiJnNlQXJyO1wiLFwiwqdcIjpcIiZzZWN0O1wiLFwiO1wiOlwiJnNlbWk7XCIsXCLipKlcIjpcIiZ0b3NhO1wiLFwi4py2XCI6XCImc2V4dDtcIixcIvCdlLBcIjpcIiZzZnI7XCIsXCLima9cIjpcIiZzaGFycDtcIixcItGJXCI6XCImc2hjaGN5O1wiLFwi0YhcIjpcIiZzaGN5O1wiLFwiwq1cIjpcIiZzaHk7XCIsXCLPg1wiOlwiJnNpZ21hO1wiLFwiz4JcIjpcIiZ2YXJzaWdtYTtcIixcIuKpqlwiOlwiJnNpbWRvdDtcIixcIuKqnlwiOlwiJnNpbWc7XCIsXCLiqqBcIjpcIiZzaW1nRTtcIixcIuKqnVwiOlwiJnNpbWw7XCIsXCLiqp9cIjpcIiZzaW1sRTtcIixcIuKJhlwiOlwiJnNpbW5lO1wiLFwi4qikXCI6XCImc2ltcGx1cztcIixcIuKlslwiOlwiJnNpbXJhcnI7XCIsXCLiqLNcIjpcIiZzbWFzaHA7XCIsXCLip6RcIjpcIiZzbWVwYXJzbDtcIixcIuKMo1wiOlwiJnNzbWlsZTtcIixcIuKqqlwiOlwiJnNtdDtcIixcIuKqrFwiOlwiJnNtdGU7XCIsXCLiqqzvuIBcIjpcIiZzbXRlcztcIixcItGMXCI6XCImc29mdGN5O1wiLFwiL1wiOlwiJnNvbDtcIixcIuKnhFwiOlwiJnNvbGI7XCIsXCLijL9cIjpcIiZzb2xiYXI7XCIsXCLwnZWkXCI6XCImc29wZjtcIixcIuKZoFwiOlwiJnNwYWRlc3VpdDtcIixcIuKKk++4gFwiOlwiJnNxY2FwcztcIixcIuKKlO+4gFwiOlwiJnNxY3VwcztcIixcIvCdk4hcIjpcIiZzc2NyO1wiLFwi4piGXCI6XCImc3RhcjtcIixcIuKKglwiOlwiJnN1YnNldDtcIixcIuKrhVwiOlwiJnN1YnNldGVxcTtcIixcIuKqvVwiOlwiJnN1YmRvdDtcIixcIuKrg1wiOlwiJnN1YmVkb3Q7XCIsXCLiq4FcIjpcIiZzdWJtdWx0O1wiLFwi4quLXCI6XCImc3Vic2V0bmVxcTtcIixcIuKKilwiOlwiJnN1YnNldG5lcTtcIixcIuKqv1wiOlwiJnN1YnBsdXM7XCIsXCLipblcIjpcIiZzdWJyYXJyO1wiLFwi4quHXCI6XCImc3Vic2ltO1wiLFwi4quVXCI6XCImc3Vic3ViO1wiLFwi4quTXCI6XCImc3Vic3VwO1wiLFwi4pmqXCI6XCImc3VuZztcIixcIsK5XCI6XCImc3VwMTtcIixcIsKyXCI6XCImc3VwMjtcIixcIsKzXCI6XCImc3VwMztcIixcIuKrhlwiOlwiJnN1cHNldGVxcTtcIixcIuKqvlwiOlwiJnN1cGRvdDtcIixcIuKrmFwiOlwiJnN1cGRzdWI7XCIsXCLiq4RcIjpcIiZzdXBlZG90O1wiLFwi4p+JXCI6XCImc3VwaHNvbDtcIixcIuKrl1wiOlwiJnN1cGhzdWI7XCIsXCLipbtcIjpcIiZzdXBsYXJyO1wiLFwi4quCXCI6XCImc3VwbXVsdDtcIixcIuKrjFwiOlwiJnN1cHNldG5lcXE7XCIsXCLiiotcIjpcIiZzdXBzZXRuZXE7XCIsXCLiq4BcIjpcIiZzdXBwbHVzO1wiLFwi4quIXCI6XCImc3Vwc2ltO1wiLFwi4quUXCI6XCImc3Vwc3ViO1wiLFwi4quWXCI6XCImc3Vwc3VwO1wiLFwi4oeZXCI6XCImc3dBcnI7XCIsXCLipKpcIjpcIiZzd253YXI7XCIsXCLDn1wiOlwiJnN6bGlnO1wiLFwi4oyWXCI6XCImdGFyZ2V0O1wiLFwiz4RcIjpcIiZ0YXU7XCIsXCLFpVwiOlwiJnRjYXJvbjtcIixcIsWjXCI6XCImdGNlZGlsO1wiLFwi0YJcIjpcIiZ0Y3k7XCIsXCLijJVcIjpcIiZ0ZWxyZWM7XCIsXCLwnZSxXCI6XCImdGZyO1wiLFwizrhcIjpcIiZ0aGV0YTtcIixcIs+RXCI6XCImdmFydGhldGE7XCIsXCLDvlwiOlwiJnRob3JuO1wiLFwiw5dcIjpcIiZ0aW1lcztcIixcIuKosVwiOlwiJnRpbWVzYmFyO1wiLFwi4qiwXCI6XCImdGltZXNkO1wiLFwi4oy2XCI6XCImdG9wYm90O1wiLFwi4quxXCI6XCImdG9wY2lyO1wiLFwi8J2VpVwiOlwiJnRvcGY7XCIsXCLiq5pcIjpcIiZ0b3Bmb3JrO1wiLFwi4oC0XCI6XCImdHByaW1lO1wiLFwi4pa1XCI6XCImdXRyaTtcIixcIuKJnFwiOlwiJnRyaWU7XCIsXCLil6xcIjpcIiZ0cmlkb3Q7XCIsXCLiqLpcIjpcIiZ0cmltaW51cztcIixcIuKouVwiOlwiJnRyaXBsdXM7XCIsXCLip41cIjpcIiZ0cmlzYjtcIixcIuKou1wiOlwiJnRyaXRpbWU7XCIsXCLij6JcIjpcIiZ0cnBleml1bTtcIixcIvCdk4lcIjpcIiZ0c2NyO1wiLFwi0YZcIjpcIiZ0c2N5O1wiLFwi0ZtcIjpcIiZ0c2hjeTtcIixcIsWnXCI6XCImdHN0cm9rO1wiLFwi4qWjXCI6XCImdUhhcjtcIixcIsO6XCI6XCImdWFjdXRlO1wiLFwi0Z5cIjpcIiZ1YnJjeTtcIixcIsWtXCI6XCImdWJyZXZlO1wiLFwiw7tcIjpcIiZ1Y2lyYztcIixcItGDXCI6XCImdWN5O1wiLFwixbFcIjpcIiZ1ZGJsYWM7XCIsXCLipb5cIjpcIiZ1ZmlzaHQ7XCIsXCLwnZSyXCI6XCImdWZyO1wiLFwiw7lcIjpcIiZ1Z3JhdmU7XCIsXCLiloBcIjpcIiZ1aGJsaztcIixcIuKMnFwiOlwiJnVsY29ybmVyO1wiLFwi4oyPXCI6XCImdWxjcm9wO1wiLFwi4pe4XCI6XCImdWx0cmk7XCIsXCLFq1wiOlwiJnVtYWNyO1wiLFwixbNcIjpcIiZ1b2dvbjtcIixcIvCdlaZcIjpcIiZ1b3BmO1wiLFwiz4VcIjpcIiZ1cHNpbG9uO1wiLFwi4oeIXCI6XCImdXVhcnI7XCIsXCLijJ1cIjpcIiZ1cmNvcm5lcjtcIixcIuKMjlwiOlwiJnVyY3JvcDtcIixcIsWvXCI6XCImdXJpbmc7XCIsXCLil7lcIjpcIiZ1cnRyaTtcIixcIvCdk4pcIjpcIiZ1c2NyO1wiLFwi4ouwXCI6XCImdXRkb3Q7XCIsXCLFqVwiOlwiJnV0aWxkZTtcIixcIsO8XCI6XCImdXVtbDtcIixcIuKmp1wiOlwiJnV3YW5nbGU7XCIsXCLiq6hcIjpcIiZ2QmFyO1wiLFwi4qupXCI6XCImdkJhcnY7XCIsXCLippxcIjpcIiZ2YW5ncnQ7XCIsXCLiiorvuIBcIjpcIiZ2c3VibmU7XCIsXCLiq4vvuIBcIjpcIiZ2c3VibkU7XCIsXCLiiovvuIBcIjpcIiZ2c3VwbmU7XCIsXCLiq4zvuIBcIjpcIiZ2c3VwbkU7XCIsXCLQslwiOlwiJnZjeTtcIixcIuKKu1wiOlwiJnZlZWJhcjtcIixcIuKJmlwiOlwiJnZlZWVxO1wiLFwi4ouuXCI6XCImdmVsbGlwO1wiLFwi8J2Us1wiOlwiJnZmcjtcIixcIvCdladcIjpcIiZ2b3BmO1wiLFwi8J2Ti1wiOlwiJnZzY3I7XCIsXCLipppcIjpcIiZ2emlnemFnO1wiLFwixbVcIjpcIiZ3Y2lyYztcIixcIuKpn1wiOlwiJndlZGJhcjtcIixcIuKJmVwiOlwiJndlZGdlcTtcIixcIuKEmFwiOlwiJndwO1wiLFwi8J2UtFwiOlwiJndmcjtcIixcIvCdlahcIjpcIiZ3b3BmO1wiLFwi8J2TjFwiOlwiJndzY3I7XCIsXCLwnZS1XCI6XCImeGZyO1wiLFwizr5cIjpcIiZ4aTtcIixcIuKLu1wiOlwiJnhuaXM7XCIsXCLwnZWpXCI6XCImeG9wZjtcIixcIvCdk41cIjpcIiZ4c2NyO1wiLFwiw71cIjpcIiZ5YWN1dGU7XCIsXCLRj1wiOlwiJnlhY3k7XCIsXCLFt1wiOlwiJnljaXJjO1wiLFwi0YtcIjpcIiZ5Y3k7XCIsXCLCpVwiOlwiJnllbjtcIixcIvCdlLZcIjpcIiZ5ZnI7XCIsXCLRl1wiOlwiJnlpY3k7XCIsXCLwnZWqXCI6XCImeW9wZjtcIixcIvCdk45cIjpcIiZ5c2NyO1wiLFwi0Y5cIjpcIiZ5dWN5O1wiLFwiw79cIjpcIiZ5dW1sO1wiLFwixbpcIjpcIiZ6YWN1dGU7XCIsXCLFvlwiOlwiJnpjYXJvbjtcIixcItC3XCI6XCImemN5O1wiLFwixbxcIjpcIiZ6ZG90O1wiLFwizrZcIjpcIiZ6ZXRhO1wiLFwi8J2Ut1wiOlwiJnpmcjtcIixcItC2XCI6XCImemhjeTtcIixcIuKHnVwiOlwiJnppZ3JhcnI7XCIsXCLwnZWrXCI6XCImem9wZjtcIixcIvCdk49cIjpcIiZ6c2NyO1wiLFwi4oCNXCI6XCImendqO1wiLFwi4oCMXCI6XCImenduajtcIn19fTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPS4vbmFtZWQtcmVmZXJlbmNlcy5qcy5tYXAiLCJcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6dHJ1ZX0pO2V4cG9ydHMubnVtZXJpY1VuaWNvZGVNYXA9ezA6NjU1MzMsMTI4OjgzNjQsMTMwOjgyMTgsMTMxOjQwMiwxMzI6ODIyMiwxMzM6ODIzMCwxMzQ6ODIyNCwxMzU6ODIyNSwxMzY6NzEwLDEzNzo4MjQwLDEzODozNTIsMTM5OjgyNDksMTQwOjMzOCwxNDI6MzgxLDE0NTo4MjE2LDE0Njo4MjE3LDE0Nzo4MjIwLDE0ODo4MjIxLDE0OTo4MjI2LDE1MDo4MjExLDE1MTo4MjEyLDE1Mjo3MzIsMTUzOjg0ODIsMTU0OjM1MywxNTU6ODI1MCwxNTY6MzM5LDE1ODozODIsMTU5OjM3Nn07XG4vLyMgc291cmNlTWFwcGluZ1VSTD0uL251bWVyaWMtdW5pY29kZS1tYXAuanMubWFwIiwiXCJ1c2Ugc3RyaWN0XCI7T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOnRydWV9KTtleHBvcnRzLmZyb21Db2RlUG9pbnQ9U3RyaW5nLmZyb21Db2RlUG9pbnR8fGZ1bmN0aW9uKGFzdHJhbENvZGVQb2ludCl7cmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoTWF0aC5mbG9vcigoYXN0cmFsQ29kZVBvaW50LTY1NTM2KS8xMDI0KSs1NTI5NiwoYXN0cmFsQ29kZVBvaW50LTY1NTM2KSUxMDI0KzU2MzIwKX07ZXhwb3J0cy5nZXRDb2RlUG9pbnQ9U3RyaW5nLnByb3RvdHlwZS5jb2RlUG9pbnRBdD9mdW5jdGlvbihpbnB1dCxwb3NpdGlvbil7cmV0dXJuIGlucHV0LmNvZGVQb2ludEF0KHBvc2l0aW9uKX06ZnVuY3Rpb24oaW5wdXQscG9zaXRpb24pe3JldHVybihpbnB1dC5jaGFyQ29kZUF0KHBvc2l0aW9uKS01NTI5NikqMTAyNCtpbnB1dC5jaGFyQ29kZUF0KHBvc2l0aW9uKzEpLTU2MzIwKzY1NTM2fTtleHBvcnRzLmhpZ2hTdXJyb2dhdGVGcm9tPTU1Mjk2O2V4cG9ydHMuaGlnaFN1cnJvZ2F0ZVRvPTU2MzE5O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Li9zdXJyb2dhdGUtcGFpcnMuanMubWFwIiwiaW1wb3J0IHsgRW50aXR5VHlwZXMsIElDb21wb25lbnQgfSBmcm9tICcuLi8uLi90eXBlcydcclxuaW1wb3J0IHsgRW50aXR5IH0gZnJvbSAnLi4vRW50aXR5J1xyXG5cclxuZXhwb3J0IGNsYXNzIENvbXBvbmVudDxUIGV4dGVuZHMgRW50aXR5VHlwZXM+XHJcbiAgICBleHRlbmRzIEVudGl0eTxUPlxyXG4gICAgaW1wbGVtZW50cyBJQ29tcG9uZW50PFQ+XHJcbntcclxuICAgIF9wYXJlbnQ6IElDb21wb25lbnQ8VD5bJ3BhcmVudCddXHJcblxyXG4gICAgY29uc3RydWN0b3IocGFyZW50OiBJQ29tcG9uZW50PFQ+WydwYXJlbnQnXSwgY29tcG9uZW50VHlwZTogVCkge1xyXG4gICAgICAgIHN1cGVyKGNvbXBvbmVudFR5cGUpXHJcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gcGFyZW50XHJcbiAgICAgICAgdGhpcy5fcGFyZW50LmFkZENvbXBvbmVudCh0aGlzKVxyXG4gICAgfVxyXG5cclxuICAgIGdldCBwYXJlbnQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3BhcmVudFxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gJy4vQ29tcG9uZW50J1xyXG4iLCJpbXBvcnQgeyBFbnRpdHlUeXBlcywgSUVudGl0eSB9IGZyb20gJy4uLy4uL3R5cGVzJ1xyXG5cclxuZXhwb3J0IGNsYXNzIEVudGl0eTxUIGV4dGVuZHMgRW50aXR5VHlwZXM+IGltcGxlbWVudHMgSUVudGl0eTxUPiB7XHJcbiAgICBwcml2YXRlIF9pZDogc3RyaW5nXHJcbiAgICBwcml2YXRlIF90eXBlOiBUXHJcblxyXG4gICAgY29uc3RydWN0b3IodHlwZTogVCkge1xyXG4gICAgICAgIHRoaXMuX2lkID0gdGhpcy5fZ2VuZXJhdGVJZCgpXHJcbiAgICAgICAgdGhpcy5fdHlwZSA9IHR5cGVcclxuICAgIH1cclxuXHJcbiAgICBwcml2YXRlIF9nZW5lcmF0ZUlkKCkge1xyXG4gICAgICAgIHJldHVybiBTdHJpbmcoTWF0aC5yYW5kb20oKSlcclxuICAgIH1cclxuXHJcbiAgICBnZXQgaWQoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX2lkXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IHR5cGUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuX3R5cGVcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgKiBmcm9tICcuL0VudGl0eSdcclxuIiwiaW1wb3J0IHsgRW50aXR5SUQsIEVudGl0eVR5cGVzLCBJQ29tcG9uZW50LCBJR2FtZU9iamVjdCB9IGZyb20gJy4uLy4uL3R5cGVzJ1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tICcuLi9FbnRpdHknXHJcblxyXG5leHBvcnQgY2xhc3MgR2FtZU9iamVjdFxyXG4gICAgZXh0ZW5kcyBFbnRpdHk8RW50aXR5VHlwZXMuZ2FtZU9iamVjdD5cclxuICAgIGltcGxlbWVudHMgSUdhbWVPYmplY3Rcclxue1xyXG4gICAgX25hbWU6IHN0cmluZ1xyXG4gICAgX2NvbXBvbmVudHMgPSBuZXcgTWFwKCkgYXMgTWFwPEVudGl0eUlELCBJQ29tcG9uZW50PEVudGl0eVR5cGVzPj5cclxuXHJcbiAgICBjb25zdHJ1Y3RvcigpIHtcclxuICAgICAgICBzdXBlcihFbnRpdHlUeXBlcy5nYW1lT2JqZWN0KVxyXG4gICAgICAgIHRoaXMuX25hbWUgPSBgR2FtZU9iamVjdCAke3N1cGVyLmlkfWBcclxuICAgIH1cclxuXHJcbiAgICBnZXQgbmFtZSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbmFtZVxyXG4gICAgfVxyXG5cclxuICAgIHNldCBuYW1lKHZhbHVlOiBzdHJpbmcpIHtcclxuICAgICAgICB0aGlzLl9uYW1lID0gdmFsdWVcclxuICAgIH1cclxuXHJcbiAgICBnZXQgY29tcG9uZW50cygpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fY29tcG9uZW50c1xyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyBhZGRDb21wb25lbnQoY29tcG9uZW50OiBJQ29tcG9uZW50PEVudGl0eVR5cGVzPikge1xyXG4gICAgICAgIHRoaXMuX2NvbXBvbmVudHMuc2V0KGNvbXBvbmVudC5pZCwgY29tcG9uZW50KVxyXG4gICAgfVxyXG5cclxuICAgIHB1YmxpYyByZW1vdmVDb21wb25lbnQoaWQ6IEVudGl0eUlEKSB7XHJcbiAgICAgICAgdGhpcy5fY29tcG9uZW50cy5kZWxldGUoaWQpXHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0ICogZnJvbSAnLi9HYW1lT2JqZWN0J1xyXG4iLCJpbXBvcnQgeyBFbnRpdHlUeXBlcywgR0xURkFjY2Vzc29yLCBJR2FtZU9iamVjdCwgSU1lc2ggfSBmcm9tICcuLi8uLi90eXBlcydcclxuaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnLi4vQ29tcG9uZW50J1xyXG5cclxuZXhwb3J0IGNsYXNzIE1lc2ggZXh0ZW5kcyBDb21wb25lbnQ8RW50aXR5VHlwZXMubWVzaD4gaW1wbGVtZW50cyBJTWVzaCB7XHJcbiAgICBtb2RlID0gNCAvLyBHUFUgdG9wb2xvZ3kgbW9kZVxyXG4gICAgcG9zaXRpb25zOiBHTFRGQWNjZXNzb3IgLy9idWZmZXIgdmlldyBvciBhY2Nlc3Nvcj9cclxuICAgIHJlbmRlclBpcGVsaW5lPzogR1BVUmVuZGVyUGlwZWxpbmVcclxuXHJcbiAgICBjb25zdHJ1Y3RvcihwYXJlbnQ6IElHYW1lT2JqZWN0LCBwb3NpdGlvbnM6IEdMVEZBY2Nlc3Nvcikge1xyXG4gICAgICAgIHN1cGVyKHBhcmVudCwgRW50aXR5VHlwZXMubWVzaClcclxuXHJcbiAgICAgICAgdGhpcy5wb3NpdGlvbnMgPSBwb3NpdGlvbnNcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYnVpbGRSZW5kZXJQaXBlbGluZShcclxuICAgICAgICBkZXZpY2U6IEdQVURldmljZSxcclxuICAgICAgICBzaGFkZXJNb2R1bGU6IEdQVVNoYWRlck1vZHVsZSxcclxuICAgICAgICBjb2xvckZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCxcclxuICAgICAgICBkZXB0aEZvcm1hdDogR1BVVGV4dHVyZUZvcm1hdCxcclxuICAgICAgICB1bmlmb3Jtc0JHTGF5b3V0OiBHUFVCaW5kR3JvdXBMYXlvdXRcclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IHZlcnRleFN0YXRlOiBHUFVWZXJ0ZXhTdGF0ZSA9IHtcclxuICAgICAgICAgICAgbW9kdWxlOiBzaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgIGVudHJ5UG9pbnQ6ICd2ZXJ0ZXhfbWFpbicsXHJcbiAgICAgICAgICAgIGJ1ZmZlcnM6IFtcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBhcnJheVN0cmlkZTogdGhpcy5wb3NpdGlvbnMuYnl0ZVN0cmlkZSxcclxuICAgICAgICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiBbXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIE5vdGU6IFdlIGRvIG5vdCBwYXNzIHRoZSBwb3NpdGlvbnMuYnl0ZU9mZnNldCBoZXJlLCBhcyBpdHNcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gbWVhbmluZyBjYW4gdmFyeSBpbiBkaWZmZXJlbnQgZ2xCIGZpbGVzLCBpLmUuLCBpZiBpdCdzXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGJlaW5nIHVzZWQgZm9yIGludGVybGVhdmVkIGVsZW1lbnQgb2Zmc2V0IG9yIGFuIGFic29sdXRlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIG9mZnNldC5cclxuICAgICAgICAgICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZm9ybWF0OiB0aGlzLnBvc2l0aW9ucy5lbGVtZW50VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9mZnNldDogMCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNoYWRlckxvY2F0aW9uOiAwLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgICAgIF0sXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBdLFxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZnJhZ21lbnRTdGF0ZTogR1BVRnJhZ21lbnRTdGF0ZSA9IHtcclxuICAgICAgICAgICAgbW9kdWxlOiBzaGFkZXJNb2R1bGUsXHJcbiAgICAgICAgICAgIGVudHJ5UG9pbnQ6ICdmcmFnbWVudF9tYWluJyxcclxuICAgICAgICAgICAgdGFyZ2V0czogW3sgZm9ybWF0OiBjb2xvckZvcm1hdCB9XSxcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIE91ciBsb2FkZXIgb25seSBzdXBwb3J0cyB0cmlhbmdsZSBsaXN0cyBhbmQgc3RyaXBzLCBzbyBieSBkZWZhdWx0IHdlIHNldFxyXG4gICAgICAgIC8vIHRoZSBwcmltaXRpdmUgdG9wb2xvZ3kgdG8gdHJpYW5nbGUgbGlzdCwgYW5kIGNoZWNrIGlmIGl0J3NcclxuICAgICAgICAvLyBpbnN0ZWFkIGEgdHJpYW5nbGUgc3RyaXBcclxuICAgICAgICBjb25zdCBwcmltaXRpdmU6IEdQVVByaW1pdGl2ZVN0YXRlID0ge1xyXG4gICAgICAgICAgICB0b3BvbG9neTogJ3RyaWFuZ2xlLWxpc3QnLFxyXG4gICAgICAgICAgICBzdHJpcEluZGV4Rm9ybWF0OiB1bmRlZmluZWQsXHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8vIGlmICh0aGlzLm1vZGUgPT09IDUpIHtcclxuICAgICAgICAvLyAgICAgcHJpbWl0aXZlLnRvcG9sb2d5ID0gJ3RyaWFuZ2xlLXN0cmlwJ1xyXG4gICAgICAgIC8vICAgICBwcmltaXRpdmUuc3RyaXBJbmRleEZvcm1hdCA9IHRoaXMuaW5kaWNlcy52ZXJ0ZXhUeXBlXHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICBjb25zdCBsYXlvdXQgPSBkZXZpY2UuY3JlYXRlUGlwZWxpbmVMYXlvdXQoe1xyXG4gICAgICAgICAgICBiaW5kR3JvdXBMYXlvdXRzOiBbdW5pZm9ybXNCR0xheW91dF0sXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgdGhpcy5yZW5kZXJQaXBlbGluZSA9IGRldmljZS5jcmVhdGVSZW5kZXJQaXBlbGluZSh7XHJcbiAgICAgICAgICAgIGxheW91dDogbGF5b3V0LFxyXG4gICAgICAgICAgICB2ZXJ0ZXg6IHZlcnRleFN0YXRlLFxyXG4gICAgICAgICAgICBmcmFnbWVudDogZnJhZ21lbnRTdGF0ZSxcclxuICAgICAgICAgICAgcHJpbWl0aXZlOiBwcmltaXRpdmUsXHJcbiAgICAgICAgICAgIGRlcHRoU3RlbmNpbDoge1xyXG4gICAgICAgICAgICAgICAgZm9ybWF0OiBkZXB0aEZvcm1hdCxcclxuICAgICAgICAgICAgICAgIGRlcHRoV3JpdGVFbmFibGVkOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgZGVwdGhDb21wYXJlOiAnbGVzcycsXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSlcclxuICAgIH1cclxufVxyXG4iLCJleHBvcnQgKiBmcm9tICcuL01lc2gnXHJcbiIsImltcG9ydCB7XHJcbiAgICBFbnRpdHlJRCxcclxuICAgIElHYW1lT2JqZWN0LFxyXG4gICAgSU9iamVjdE1hbmFnZXIsXHJcbiAgICBJU2NlbmVUcmVlLFxyXG4gICAgU2NlbmVUcmVlUG9zaXRpb24sXHJcbn0gZnJvbSAnLi4vLi4vdHlwZXMnXHJcbmltcG9ydCB7IFNjZW5lVHJlZSB9IGZyb20gJy4uL1NjZW5lVHJlZSdcclxuXHJcbnR5cGUgT2JqZWN0UG9zaXRpb25zID0gTWFwPEVudGl0eUlELCBTY2VuZVRyZWVQb3NpdGlvbiB8IG51bGw+XHJcblxyXG5leHBvcnQgY2xhc3MgT2JqZWN0TWFuYWdlciBpbXBsZW1lbnRzIElPYmplY3RNYW5hZ2VyIHtcclxuICAgIHByaXZhdGUgX29iamVjdFBvc2l0aW9uczogT2JqZWN0UG9zaXRpb25zID0gbmV3IE1hcCgpXHJcbiAgICBwcml2YXRlIF9zY2VuZVRyZWU6IElTY2VuZVRyZWUgPSBuZXcgU2NlbmVUcmVlKClcclxuXHJcbiAgICBwcml2YXRlIGdldE9iamVjdFBvc2l0aW9uKGdhbWVPYmplY3Q/OiBJR2FtZU9iamVjdCB8IG51bGwpIHtcclxuICAgICAgICByZXR1cm4gZ2FtZU9iamVjdFxyXG4gICAgICAgICAgICA/IHRoaXMuX29iamVjdFBvc2l0aW9ucy5nZXQoZ2FtZU9iamVjdC5pZCkgPz8gbnVsbFxyXG4gICAgICAgICAgICA6IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkT2JqZWN0KGNoaWxkOiBJR2FtZU9iamVjdCwgdGFyZ2V0PzogSUdhbWVPYmplY3QpIHtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbiA9IHRoaXMuX3NjZW5lVHJlZS5hZGROb2RlQXQoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0T2JqZWN0UG9zaXRpb24odGFyZ2V0KSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgZ2FtZU9iamVjdDogY2hpbGQsXHJcbiAgICAgICAgICAgICAgICBjaGlsZHJlbjogbmV3IE1hcCgpLFxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgKVxyXG5cclxuICAgICAgICB0aGlzLl9vYmplY3RQb3NpdGlvbnMuc2V0KGNoaWxkLmlkLCBwb3NpdGlvbilcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVwYXJlbnRPYmplY3QoY2hpbGQ6IElHYW1lT2JqZWN0LCB0YXJnZXQ/OiBJR2FtZU9iamVjdCkge1xyXG4gICAgICAgIGNvbnN0IGNoaWxkUG9zaXRpb24gPSB0aGlzLl9vYmplY3RQb3NpdGlvbnMuZ2V0KGNoaWxkLmlkKVxyXG5cclxuICAgICAgICBpZiAoIWNoaWxkUG9zaXRpb24pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQb3NpdGlvbiByZWNvcmQgbm90IGZvdW5kIGZvciAke2NoaWxkLmlkfWApXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBuZXdQb3NpdGlvbiA9IHRoaXMuX3NjZW5lVHJlZS5yZXBhcmVudE5vZGUoXHJcbiAgICAgICAgICAgIHRoaXMuZ2V0T2JqZWN0UG9zaXRpb24odGFyZ2V0KSxcclxuICAgICAgICAgICAgY2hpbGRQb3NpdGlvblxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgdGhpcy5fb2JqZWN0UG9zaXRpb25zLnNldChjaGlsZC5pZCwgbmV3UG9zaXRpb24pXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIGRlc3Ryb3lPYmplY3QoZ2FtZU9iamVjdDogSUdhbWVPYmplY3QpIHtcclxuICAgICAgICBjb25zdCBjaGlsZFBvc2l0aW9uID0gdGhpcy5fb2JqZWN0UG9zaXRpb25zLmdldChnYW1lT2JqZWN0LmlkKVxyXG5cclxuICAgICAgICBpZiAoIWNoaWxkUG9zaXRpb24pIHtcclxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBQb3NpdGlvbiByZWNvcmQgbm90IGZvdW5kIGZvciAke2dhbWVPYmplY3QuaWR9YClcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGlkc1RvUmVtb3ZlID0gdGhpcy5fc2NlbmVUcmVlLnJlbW92ZU5vZGUoY2hpbGRQb3NpdGlvbilcclxuXHJcbiAgICAgICAgaWRzVG9SZW1vdmUuZm9yRWFjaCgoaWQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb2JqZWN0UG9zaXRpb25zLmRlbGV0ZShpZClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gJy4vT2JqZWN0TWFuYWdlcidcclxuIiwiaW1wb3J0IHtcclxuICAgIEVudGl0eUlELFxyXG4gICAgSVNjZW5lVHJlZSxcclxuICAgIFNjZW5lTm9kZSxcclxuICAgIFNjZW5lTm9kZUNvbnRlbnQsXHJcbiAgICBTY2VuZVRyZWVQb3NpdGlvbixcclxufSBmcm9tICcuLi8uLi90eXBlcydcclxuXHJcbmV4cG9ydCBjbGFzcyBTY2VuZVRyZWUgaW1wbGVtZW50cyBJU2NlbmVUcmVlIHtcclxuICAgIF9ub2RlczogU2NlbmVOb2RlID0gbmV3IE1hcCgpXHJcblxyXG4gICAgcHVibGljIGdldE5vZGVDb250ZW50QXQocG9zaXRpb246IFNjZW5lVHJlZVBvc2l0aW9uKSB7XHJcbiAgICAgICAgbGV0IGN1cnJlbnRUcmVlTm9kZSA9IHRoaXMuX25vZGVzLmdldChwb3NpdGlvblswXSlcclxuXHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb3NpdGlvbi5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgICAgICBjdXJyZW50VHJlZU5vZGUgPSBjdXJyZW50VHJlZU5vZGU/LmNoaWxkcmVuPy5nZXQocG9zaXRpb25baV0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gY3VycmVudFRyZWVOb2RlID8/IG51bGxcclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgYWRkTm9kZUF0KFxyXG4gICAgICAgIHBvc2l0aW9uOiBTY2VuZVRyZWVQb3NpdGlvbiB8IG51bGwsXHJcbiAgICAgICAgbm9kZUNvbnRlbnQ6IFNjZW5lTm9kZUNvbnRlbnRcclxuICAgICk6IFNjZW5lVHJlZVBvc2l0aW9uIHtcclxuICAgICAgICBpZiAoIXBvc2l0aW9uKSB7XHJcbiAgICAgICAgICAgIHRoaXMuX25vZGVzLnNldChub2RlQ29udGVudC5nYW1lT2JqZWN0LmlkLCBub2RlQ29udGVudClcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBbbm9kZUNvbnRlbnQuZ2FtZU9iamVjdC5pZF1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGxldCBjdXJyZW50VHJlZU5vZGUgPSB0aGlzLmdldE5vZGVDb250ZW50QXQocG9zaXRpb24pXHJcblxyXG4gICAgICAgIGN1cnJlbnRUcmVlTm9kZT8uY2hpbGRyZW4/LnNldChub2RlQ29udGVudC5nYW1lT2JqZWN0LmlkLCBub2RlQ29udGVudClcclxuXHJcbiAgICAgICAgcmV0dXJuIFsuLi5wb3NpdGlvbiwgbm9kZUNvbnRlbnQuZ2FtZU9iamVjdC5pZF1cclxuICAgIH1cclxuXHJcbiAgICBwdWJsaWMgcmVwYXJlbnROb2RlKFxyXG4gICAgICAgIHRhcmdldDogU2NlbmVUcmVlUG9zaXRpb24gfCBudWxsLFxyXG4gICAgICAgIGNoaWxkOiBTY2VuZVRyZWVQb3NpdGlvblxyXG4gICAgKTogU2NlbmVUcmVlUG9zaXRpb24ge1xyXG4gICAgICAgIGNvbnN0IG5vZGVDb250ZW50ID0gdGhpcy5nZXROb2RlQ29udGVudEF0KGNoaWxkKVxyXG5cclxuICAgICAgICBpZiAoIW5vZGVDb250ZW50KSB7XHJcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgTm8gbm9kZSBmb3VuZCBhdCBwb3NpdGlvbiAke2NoaWxkLmpvaW4oKX1gKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgbmV3UG9zaXRpb24gPSB0aGlzLmFkZE5vZGVBdCh0YXJnZXQsIG5vZGVDb250ZW50KVxyXG4gICAgICAgIHRoaXMucmVtb3ZlTm9kZShjaGlsZClcclxuXHJcbiAgICAgICAgcmV0dXJuIG5ld1Bvc2l0aW9uXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHJlbW92ZU5vZGUodGFyZ2V0UG9zaXRpb246IFNjZW5lVHJlZVBvc2l0aW9uKTogRW50aXR5SURbXSB7XHJcbiAgICAgICAgY29uc3QgcGFyZW50UG9zaXRpb24gPSB0YXJnZXRQb3NpdGlvbi5zbGljZSgtMSlcclxuICAgICAgICBjb25zdCBwYXJlbnROb2RlID0gdGhpcy5nZXROb2RlQ29udGVudEF0KHBhcmVudFBvc2l0aW9uKVxyXG5cclxuICAgICAgICBjb25zdCBjaGlsZHJlbklkczogRW50aXR5SURbXSA9IFtdXHJcbiAgICAgICAgdGhpcy50cmF2ZXJzZU5vZGUocGFyZW50Tm9kZT8uY2hpbGRyZW4sIChub2RlSWQpID0+IHtcclxuICAgICAgICAgICAgY2hpbGRyZW5JZHMucHVzaChub2RlSWQpXHJcbiAgICAgICAgfSlcclxuXHJcbiAgICAgICAgcGFyZW50Tm9kZT8uY2hpbGRyZW4/LmRlbGV0ZSh0YXJnZXRQb3NpdGlvblt0YXJnZXRQb3NpdGlvbi5sZW5ndGggLSAxXSlcclxuXHJcbiAgICAgICAgcmV0dXJuIGNoaWxkcmVuSWRzXHJcbiAgICB9XHJcblxyXG4gICAgcHVibGljIHRyYXZlcnNlTm9kZShcclxuICAgICAgICBub2RlOiBTY2VuZU5vZGUgfCBudWxsIHwgdW5kZWZpbmVkLFxyXG4gICAgICAgIGNhbGxiYWNrOiAobm9kZUlkOiBFbnRpdHlJRCwgbm9kZUNvbnRlbnQ6IFNjZW5lTm9kZUNvbnRlbnQpID0+IHZvaWRcclxuICAgICkge1xyXG4gICAgICAgIGNvbnN0IGl0ZXJhdGUgPSAoc2NlbmVOb2RlPzogU2NlbmVOb2RlIHwgbnVsbCkgPT4ge1xyXG4gICAgICAgICAgICBpZiAoIXNjZW5lTm9kZSkgcmV0dXJuXHJcblxyXG4gICAgICAgICAgICBzY2VuZU5vZGUuZm9yRWFjaCgodmFsdWUsIGtleSkgPT4ge1xyXG4gICAgICAgICAgICAgICAgY2FsbGJhY2soa2V5LCB2YWx1ZSlcclxuICAgICAgICAgICAgICAgIGl0ZXJhdGUodmFsdWUuY2hpbGRyZW4pXHJcbiAgICAgICAgICAgIH0pXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpdGVyYXRlKG5vZGUpXHJcbiAgICB9XHJcblxyXG4gICAgZ2V0IG5vZGVzKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9ub2Rlc1xyXG4gICAgfVxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gJy4vU2NlbmVUcmVlJ1xyXG4iLCJpbXBvcnQge1xyXG4gICAgRW50aXR5VHlwZXMsXHJcbiAgICBJR2FtZU9iamVjdCxcclxuICAgIFRyYW5zZm9ybWF0aW9uTWF0cml4LFxyXG4gICAgVFJTLFxyXG59IGZyb20gJy4uLy4uL3R5cGVzJ1xyXG5pbXBvcnQgeyBJVHJhbnNmb3JtIH0gZnJvbSAnLi4vLi4vdHlwZXMnXHJcbmltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBvbmVudCdcclxuXHJcbmV4cG9ydCBjbGFzcyBUcmFuc2Zvcm1cclxuICAgIGV4dGVuZHMgQ29tcG9uZW50PEVudGl0eVR5cGVzLnRyYW5zZm9ybT5cclxuICAgIGltcGxlbWVudHMgSVRyYW5zZm9ybVxyXG57XHJcbiAgICBtYXRyaXg/OiBUcmFuc2Zvcm1hdGlvbk1hdHJpeFxyXG4gICAgc2NhbGU/OiBUUlNbJ3NjYWxlJ11cclxuICAgIHJvdGF0aW9uPzogVFJTWydyb3RhdGlvbiddXHJcbiAgICB0cmFuc2xhdGlvbj86IFRSU1sndHJhbnNsYXRpb24nXVxyXG5cclxuICAgIGNvbnN0cnVjdG9yKFxyXG4gICAgICAgIHBhcmVudDogSUdhbWVPYmplY3QsXHJcbiAgICAgICAgdHJzPzogUGFydGlhbDxUUlM+LFxyXG4gICAgICAgIG1hdHJpeD86IFRyYW5zZm9ybWF0aW9uTWF0cml4XHJcbiAgICApIHtcclxuICAgICAgICBzdXBlcihwYXJlbnQsIEVudGl0eVR5cGVzLnRyYW5zZm9ybSlcclxuICAgICAgICBpZiAobWF0cml4KSB7XHJcbiAgICAgICAgICAgIHRoaXMubWF0cml4ID0gbWF0cml4XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zY2FsZSA9IHRycz8uc2NhbGUgPz8gWzEsIDEsIDFdXHJcbiAgICAgICAgICAgIHRoaXMucm90YXRpb24gPSB0cnM/LnJvdGF0aW9uID8/IFswLCAwLCAwLCAxXVxyXG4gICAgICAgICAgICB0aGlzLnRyYW5zbGF0aW9uID0gdHJzPy50cmFuc2xhdGlvbiA/PyBbMCwgMCwgMF1cclxuICAgICAgICB9XHJcbiAgICB9XHJcbn1cclxuIiwiZXhwb3J0ICogZnJvbSAnLi9UcmFuc2Zvcm0nXHJcbiIsImV4cG9ydCAqIGZyb20gJy4vQ29tcG9uZW50J1xyXG5leHBvcnQgKiBmcm9tICcuL0VudGl0eSdcclxuZXhwb3J0ICogZnJvbSAnLi9HYW1lT2JqZWN0J1xyXG5leHBvcnQgKiBmcm9tICcuL09iamVjdE1hbmFnZXInXHJcbmV4cG9ydCAqIGZyb20gJy4vU2NlbmVUcmVlJ1xyXG5leHBvcnQgKiBmcm9tICcuL1RyYW5zZm9ybSdcclxuZXhwb3J0ICogZnJvbSAnLi9NZXNoJ1xyXG4iLCJpbXBvcnQgeyBFbnRpdHlUeXBlLCBJRW50aXR5IH0gZnJvbSAnLi4vRW50aXR5J1xyXG5pbXBvcnQgeyBJR2FtZU9iamVjdCB9IGZyb20gJy4uL0dhbWVPYmplY3QnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElDb21wb25lbnQ8VCBleHRlbmRzIEVudGl0eVR5cGU+IGV4dGVuZHMgSUVudGl0eTxUPiB7XHJcbiAgICBwYXJlbnQ6IElHYW1lT2JqZWN0XHJcbn1cclxuIiwiZXhwb3J0IGVudW0gRW50aXR5VHlwZXMge1xyXG4gICAgZ2FtZU9iamVjdCA9ICdnYW1lT2JqZWN0JyxcclxuICAgIG1lc2ggPSAnbWVzaCcsXHJcbiAgICBtYXRlcmlhbCA9ICdtYXRlcmlhbCcsXHJcbiAgICB0cmFuc2Zvcm0gPSAndHJhbnNmb3JtJyxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5VHlwZSA9IGtleW9mIHR5cGVvZiBFbnRpdHlUeXBlc1xyXG5cclxuZXhwb3J0IHR5cGUgRW50aXR5SUQgPSBzdHJpbmdcclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSUVudGl0eTxUIGV4dGVuZHMgUGFydGlhbDxFbnRpdHlUeXBlPj4ge1xyXG4gICAgaWQ6IEVudGl0eUlEXHJcbiAgICB0eXBlOiBUXHJcbn1cclxuIiwiaW1wb3J0IHsgSUNvbXBvbmVudCB9IGZyb20gJy4uL0NvbXBvbmVudCdcclxuaW1wb3J0IHsgRW50aXR5SUQsIEVudGl0eVR5cGVzLCBJRW50aXR5IH0gZnJvbSAnLi4vRW50aXR5J1xyXG5cclxuZXhwb3J0IGludGVyZmFjZSBJR2FtZU9iamVjdCBleHRlbmRzIElFbnRpdHk8RW50aXR5VHlwZXMuZ2FtZU9iamVjdD4ge1xyXG4gICAgbmFtZTogc3RyaW5nXHJcbiAgICBvblVwZGF0ZT86IChkdDogbnVtYmVyKSA9PiB2b2lkXHJcbiAgICAvL0ZJWE1FOiB0eXBlIGluY2x1ZGVzIGdhbWVPYmplY3RcclxuICAgIGNvbXBvbmVudHM6IE1hcDxFbnRpdHlJRCwgSUNvbXBvbmVudDxFbnRpdHlUeXBlcz4+XHJcbiAgICBhZGRDb21wb25lbnQ6IChjb21wb25lbnQ6IElDb21wb25lbnQ8RW50aXR5VHlwZXM+KSA9PiB2b2lkXHJcbiAgICByZW1vdmVDb21wb25lbnQ6IChpZDogRW50aXR5SUQpID0+IHZvaWRcclxufVxyXG4iLCJpbXBvcnQgeyBJQ29tcG9uZW50IH0gZnJvbSAnLi4vQ29tcG9uZW50J1xyXG5pbXBvcnQgeyBFbnRpdHlUeXBlcyB9IGZyb20gJy4uL0VudGl0eSdcclxuaW1wb3J0IHsgVmVjMywgVmVjNCB9IGZyb20gJ3dncHUtbWF0cml4J1xyXG5cclxuZXhwb3J0IHR5cGUgTWF0ZXJpYWxQQlIgPSB7XHJcbiAgICAvL0ZJWE1FOiB0eXBlIHRoaXNcclxuICAgIGJhc2VDb2xvckZhY3Rvcj86IFZlYzQgLy92ZWM0XHJcbiAgICBiYXNlQ29sb3JUZXh0dXJlPzoge1xyXG4gICAgICAgIGluZGV4OiAxXHJcbiAgICAgICAgdGV4Q29vcmQ6IDFcclxuICAgIH1cclxuICAgIG1ldGFsbGljRmFjdG9yPzogbnVtYmVyIC8vMCB0byAxXHJcbiAgICByb3VnaG5lc3NGYWN0b3I/OiBudW1iZXIgLy8wIHRvIDFcclxuICAgIG1ldGFsbGljUm91Z2huZXNzVGV4dHVyZT86IHtcclxuICAgICAgICBpbmRleDogMlxyXG4gICAgICAgIHRleENvb3JkOiAxXHJcbiAgICB9XHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgSU1hdGVyaWFsIHtcclxuICAgIG5hbWU/OiBzdHJpbmdcclxuICAgIHBicj86IE1hdGVyaWFsUEJSXHJcbiAgICAvL0ZJWE1FOiB0eXBlIHRoaXNcclxuICAgIG5vcm1hbFRleHR1cmU/OiB7XHJcbiAgICAgICAgc2NhbGU6IDJcclxuICAgICAgICBpbmRleDogM1xyXG4gICAgICAgIHRleENvb3JkOiAxXHJcbiAgICB9XHJcbiAgICBvY2NsdXNpb25UZXh0dXJlPzogW11cclxuICAgIGVtaXNzaXZlVGV4dHVyZT86IFtdXHJcbiAgICBlbWlzc2l2ZUZhY3Rvcj86IFZlYzNcclxufVxyXG5cclxuZXhwb3J0IGludGVyZmFjZSBHTFRGQnVmZmVyVmlldyB7XHJcbiAgICBieXRlTGVuZ3RoOiBudW1iZXJcclxuICAgIGJ5dGVTdHJpZGU6IG51bWJlclxyXG4gICAgdmlldzogVWludDhBcnJheVxyXG4gICAgYnVmZmVyOiBHUFVCdWZmZXJcclxuICAgIHVzYWdlOiBHUFVCdWZmZXJVc2FnZUZsYWdzXHJcbn1cclxuXHJcbmV4cG9ydCBpbnRlcmZhY2UgR0xURkFjY2Vzc29yIHtcclxuICAgIGJ5dGVTdHJpZGU6IG51bWJlclxyXG4gICAgY291bnQ6IG51bWJlclxyXG4gICAgY29tcG9uZW50VHlwZTogbnVtYmVyXHJcbiAgICB0eXBlOiBzdHJpbmdcclxuICAgIGJ1ZmZlclZpZXc6IEdMVEZCdWZmZXJWaWV3XHJcbiAgICBieXRlT2Zmc2V0OiBudW1iZXJcclxuICAgIGVsZW1lbnRUeXBlOiBHUFVWZXJ0ZXhGb3JtYXRcclxuICAgIG1pbj86IG51bWJlcltdXHJcbiAgICBtYXg/OiBudW1iZXJbXVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElNZXNoIGV4dGVuZHMgSUNvbXBvbmVudDxFbnRpdHlUeXBlcy5tZXNoPiB7XHJcbiAgICAvLyBhdHRyaWJ1dGVzOiB7XHJcbiAgICAvLyAgICAgTk9STUFMOiAyM1xyXG4gICAgLy8gICAgIFBPU0lUSU9OOiAyMlxyXG4gICAgLy8gICAgIFRBTkdFTlQ6IDI0XHJcbiAgICAvLyAgICAgVEVYQ09PUkRfMDogMjVcclxuICAgIC8vIH1cclxuICAgIC8vaHR0cHM6Ly9yZWdpc3RyeS5raHJvbm9zLm9yZy9nbFRGL3NwZWNzLzIuMC9nbFRGLTIuMC5odG1sI3JlZmVyZW5jZS1tZXNoLXByaW1pdGl2ZVxyXG4gICAgbm9ybWFsPzogR0xURkFjY2Vzc29yXHJcbiAgICB0YW5nZW50PzogR0xURkFjY2Vzc29yXHJcbiAgICAvL0ZJWE1FOiB3aHkgY291bGQgdGhlcmUgYmUgbXVsdGlwbGU/XHJcbiAgICB0ZXh0dXJlQ29vcmRpbmF0ZXM/OiBHTFRGQWNjZXNzb3JbXVxyXG4gICAgaW5kaWNlcz86IEdMVEZBY2Nlc3NvclxyXG4gICAgLy9GSVhNRTogaW1wbGVtZW50IGRlZmF1bHQgbWF0ZXJpYWwgYWNjb3JkaW5nIHRvIGRlZmF1bHRzIGh0dHBzOi8vcmVnaXN0cnkua2hyb25vcy5vcmcvZ2xURi9zcGVjcy8yLjAvZ2xURi0yLjAuaHRtbCNyZWZlcmVuY2UtbWF0ZXJpYWxcclxuICAgIC8vRklYTUU6IGltcGxlbWVudCBtYXRlcmlhbHNcclxuICAgIC8vIG1hdGVyaWFsOiBJTWF0ZXJpYWwgLy9pZiBub3QgcHJlc2VudCBpbiB0aGUgZmlsZSwgYSBkZWZhdWx0IG1hdGVyaWFsIHNob3VsZCBiZSB1c2VkXHJcbiAgICBwb3NpdGlvbnM6IEdMVEZBY2Nlc3NvclxyXG4gICAgbW9kZTogbnVtYmVyIC8vZ3B1IHRvcG9sb2d5IC0gZGVmYXVsdCBpcyA0XHJcbiAgICAvKipcclxuICAgICAgICAwIFBPSU5UU1xyXG4gICAgICAgIDEgTElORVNcclxuICAgICAgICAyIExJTkVfTE9PUFxyXG4gICAgICAgIDMgTElORV9TVFJJUFxyXG4gICAgICAgIDQgVFJJQU5HTEVTXHJcbiAgICAgICAgNSBUUklBTkdMRV9TVFJJUFxyXG4gICAgICAgIDYgVFJJQU5HTEVfRkFOXHJcbiAgICAgKi9cclxufVxyXG4iLCJpbXBvcnQgeyBJR2FtZU9iamVjdCB9IGZyb20gJy4uL0dhbWVPYmplY3QnXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElPYmplY3RNYW5hZ2VyIHtcclxuICAgIGFkZE9iamVjdDogKGNoaWxkOiBJR2FtZU9iamVjdCwgdGFyZ2V0PzogSUdhbWVPYmplY3QpID0+IHZvaWRcclxuICAgIHJlcGFyZW50T2JqZWN0OiAoY2hpbGQ6IElHYW1lT2JqZWN0LCB0YXJnZXQ/OiBJR2FtZU9iamVjdCkgPT4gdm9pZFxyXG4gICAgZGVzdHJveU9iamVjdDogKGdhbWVPYmplY3Q6IElHYW1lT2JqZWN0KSA9PiB2b2lkXHJcbn1cclxuIiwiaW1wb3J0IHsgRW50aXR5SUQgfSBmcm9tICcuLi9FbnRpdHknXHJcbmltcG9ydCB7IElHYW1lT2JqZWN0IH0gZnJvbSAnLi4vR2FtZU9iamVjdCdcclxuXHJcbmV4cG9ydCB0eXBlIFNjZW5lTm9kZSA9IE1hcDxFbnRpdHlJRCwgU2NlbmVOb2RlQ29udGVudD5cclxuXHJcbmV4cG9ydCB0eXBlIFNjZW5lTm9kZUNvbnRlbnQgPSB7XHJcbiAgICBnYW1lT2JqZWN0OiBJR2FtZU9iamVjdFxyXG4gICAgY2hpbGRyZW46IFNjZW5lTm9kZSB8IG51bGxcclxufVxyXG5cclxuZXhwb3J0IHR5cGUgU2NlbmVUcmVlUG9zaXRpb24gPSBFbnRpdHlJRFtdXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElTY2VuZVRyZWUge1xyXG4gICAgbm9kZXM6IFNjZW5lTm9kZVxyXG4gICAgYWRkTm9kZUF0OiAoXHJcbiAgICAgICAgcG9zaXRpb246IFNjZW5lVHJlZVBvc2l0aW9uIHwgbnVsbCxcclxuICAgICAgICBub2RlOiBTY2VuZU5vZGVDb250ZW50XHJcbiAgICApID0+IFNjZW5lVHJlZVBvc2l0aW9uXHJcbiAgICByZXBhcmVudE5vZGU6IChcclxuICAgICAgICB0YXJnZXQ6IFNjZW5lVHJlZVBvc2l0aW9uIHwgbnVsbCxcclxuICAgICAgICBjaGlsZDogU2NlbmVUcmVlUG9zaXRpb25cclxuICAgICkgPT4gU2NlbmVUcmVlUG9zaXRpb25cclxuICAgIC8vcmV0dXJucyBhbiBhcnJheSBvZiBnYW1lT2JqZWN0IGlkcyB0byBiZSBjbGVhcmVkIGZyb20gT2JqZWN0TWFuYWdlclxyXG4gICAgcmVtb3ZlTm9kZTogKHRhcmdldFBvc2l0aW9uOiBTY2VuZVRyZWVQb3NpdGlvbikgPT4gRW50aXR5SURbXVxyXG4gICAgZ2V0Tm9kZUNvbnRlbnRBdDogKHBvc2l0aW9uOiBTY2VuZVRyZWVQb3NpdGlvbikgPT4gU2NlbmVOb2RlQ29udGVudCB8IG51bGxcclxufVxyXG4iLCJpbXBvcnQgeyBJQ29tcG9uZW50IH0gZnJvbSAnLi4vQ29tcG9uZW50J1xyXG5pbXBvcnQgeyBFbnRpdHlUeXBlcyB9IGZyb20gJy4uL0VudGl0eSdcclxuXHJcbmV4cG9ydCB0eXBlIFRSUyA9IHtcclxuICAgIHJvdGF0aW9uOiBbbnVtYmVyLCBudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgc2NhbGU6IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG4gICAgdHJhbnNsYXRpb246IFtudW1iZXIsIG51bWJlciwgbnVtYmVyXVxyXG59XHJcblxyXG5leHBvcnQgdHlwZSBUcmFuc2Zvcm1hdGlvbk1hdHJpeCA9IG51bWJlcltdXHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIElUcmFuc2Zvcm0gZXh0ZW5kcyBJQ29tcG9uZW50PEVudGl0eVR5cGVzLnRyYW5zZm9ybT4ge1xyXG4gICAgLy9GSVhNRTogdHlwZSB0aGlzIGFjY29yZGluZyB0byBtYXQ0IGxpYnJhcnkgb2YgY2hvaWNlXHJcbiAgICByb3RhdGlvbj86IFRSU1sncm90YXRpb24nXVxyXG4gICAgc2NhbGU/OiBUUlNbJ3NjYWxlJ11cclxuICAgIHRyYW5zbGF0aW9uPzogVFJTWyd0cmFuc2xhdGlvbiddXHJcbiAgICBtYXRyaXg/OiBUcmFuc2Zvcm1hdGlvbk1hdHJpeFxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gJy4vY29yZS9FbnRpdHknXHJcbmV4cG9ydCAqIGZyb20gJy4vY29yZS9HYW1lT2JqZWN0J1xyXG5leHBvcnQgKiBmcm9tICcuL2NvcmUvQ29tcG9uZW50J1xyXG5leHBvcnQgKiBmcm9tICcuL2NvcmUvU2NlbmVUcmVlJ1xyXG5leHBvcnQgKiBmcm9tICcuL2NvcmUvT2JqZWN0TWFuYWdlcidcclxuZXhwb3J0ICogZnJvbSAnLi9jb3JlL01lc2gnXHJcbmV4cG9ydCAqIGZyb20gJy4vY29yZS9UcmFuc2Zvcm0nXHJcbiIsImltcG9ydCB7IE9iamVjdE1hbmFnZXIgfSBmcm9tICcuL2VuZ2luZS9jb3JlJ1xyXG5pbXBvcnQgeyBXaGVlenlHTEJMb2FkZXIgfSBmcm9tICcuL3V0aWxzJ1xyXG5pbXBvcnQgc2hhZGVyQ29kZSBmcm9tICcuL3Rlc3RTaGFkZXIud2dzbCdcclxuOyhhc3luYyAoKSA9PiB7XHJcbiAgICBjb25zdCBvYmplY3RNYW5hZ2VyID0gbmV3IE9iamVjdE1hbmFnZXIoKVxyXG5cclxuICAgIGNvbnN0IGFkYXB0ZXIgPSAoYXdhaXQgbmF2aWdhdG9yLmdwdS5yZXF1ZXN0QWRhcHRlcigpKSBhcyBHUFVBZGFwdGVyXHJcbiAgICBjb25zdCBkZXZpY2UgPSBhd2FpdCBhZGFwdGVyLnJlcXVlc3REZXZpY2UoKVxyXG5cclxuICAgIC8vIEdldCBhIGNvbnRleHQgdG8gZGlzcGxheSBvdXIgcmVuZGVyZWQgaW1hZ2Ugb24gdGhlIGNhbnZhc1xyXG4gICAgY29uc3QgY2FudmFzID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3dlYmdwdS1jYW52YXMnKSBhcyBIVE1MQ2FudmFzRWxlbWVudFxyXG4gICAgY29uc3QgY29udGV4dCA9IGNhbnZhcy5nZXRDb250ZXh0KCd3ZWJncHUnKVxyXG5cclxuICAgIGNvbnN0IHNoYWRlck1vZHVsZSA9IGRldmljZS5jcmVhdGVTaGFkZXJNb2R1bGUoeyBjb2RlOiBzaGFkZXJDb2RlIH0pXHJcblxyXG4gICAgY29uc3QgYXNzID0gYXdhaXQgV2hlZXp5R0xCTG9hZGVyLmxvYWRGcm9tVXJsKFxyXG4gICAgICAgICdzdGF0aWMvbW9kZWxzL0R1Y2suZ2xiJyxcclxuICAgICAgICBvYmplY3RNYW5hZ2VyLFxyXG4gICAgICAgIGRldmljZVxyXG4gICAgKVxyXG5cclxuICAgIC8vIGNvbnNvbGUubG9nKGFzcylcclxufSkoKVxyXG4iLCJpbXBvcnQgeyBsb2FkIH0gZnJvbSAnQGxvYWRlcnMuZ2wvY29yZSdcclxuaW1wb3J0IHsgR0xCTG9hZGVyIH0gZnJvbSAnQGxvYWRlcnMuZ2wvZ2x0ZidcclxuaW1wb3J0IHsgR0xURkFjY2Vzc29yLCBJR2FtZU9iamVjdCwgSU9iamVjdE1hbmFnZXIgfSBmcm9tICcuLi9lbmdpbmUvdHlwZXMnXHJcbmltcG9ydCB7IEdhbWVPYmplY3QsIE1lc2gsIFRyYW5zZm9ybSB9IGZyb20gJy4uL2VuZ2luZS9jb3JlJ1xyXG5cclxuZXhwb3J0IGNsYXNzIFdoZWV6eUdMQkxvYWRlciB7XHJcbiAgICBwdWJsaWMgc3RhdGljIGFzeW5jIGxvYWRGcm9tVXJsKFxyXG4gICAgICAgIHVybDogc3RyaW5nLFxyXG4gICAgICAgIG9iamVjdE1hbmFnZXI6IElPYmplY3RNYW5hZ2VyLFxyXG4gICAgICAgIGRldmljZTogR1BVRGV2aWNlXHJcbiAgICApIHtcclxuICAgICAgICAvL0ZJWE1FOiBjcmVhdGUgYSBtZWNoYW5pc20gdG8gbG9hZCBtb2RlbHMgd2l0aG91dCByZWdpc3RlcmluZyB0aGVtIGluc3RhbnRseVxyXG4gICAgICAgIC8vRklYTUU6IGJ1ZmZlcnMgdXBsb2FkaW5nIHRvIGdwdSBvbiBsb2FkXHJcbiAgICAgICAgY29uc3QgbW9kZWxEYXRhID0gYXdhaXQgbG9hZCh1cmwsIEdMQkxvYWRlcilcclxuXHJcbiAgICAgICAgLy8gY29uc29sZS5sb2cobW9kZWxEYXRhKVxyXG5cclxuICAgICAgICBjb25zdCBzY2VuZU9iamVjdCA9IG5ldyBHYW1lT2JqZWN0KClcclxuXHJcbiAgICAgICAgb2JqZWN0TWFuYWdlci5hZGRPYmplY3Qoc2NlbmVPYmplY3QpXHJcblxyXG4gICAgICAgIG1vZGVsRGF0YT8uanNvbj8uc2NlbmVzPy5mb3JFYWNoKChzY2VuZTogeyBub2Rlcz86IG51bWJlcltdIH0pID0+IHtcclxuICAgICAgICAgICAgc2NlbmU/Lm5vZGVzPy5mb3JFYWNoKChub2RlSW5kZXgpID0+IHtcclxuICAgICAgICAgICAgICAgIHRoaXMubG9hZE5vZGUoXHJcbiAgICAgICAgICAgICAgICAgICAgbm9kZUluZGV4LFxyXG4gICAgICAgICAgICAgICAgICAgIG1vZGVsRGF0YSxcclxuICAgICAgICAgICAgICAgICAgICBkZXZpY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgb2JqZWN0TWFuYWdlcixcclxuICAgICAgICAgICAgICAgICAgICBzY2VuZU9iamVjdFxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICB9KVxyXG4gICAgICAgIH0pXHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKG9iamVjdE1hbmFnZXIpXHJcbiAgICB9XHJcblxyXG4gICAgcHJpdmF0ZSBzdGF0aWMgbG9hZE5vZGUoXHJcbiAgICAgICAgbm9kZUluZGV4OiBudW1iZXIsXHJcbiAgICAgICAgbW9kZWxEYXRhOiBSZWNvcmQ8c3RyaW5nLCBhbnk+LFxyXG4gICAgICAgIGRldmljZTogR1BVRGV2aWNlLFxyXG4gICAgICAgIG9iamVjdE1hbmFnZXI6IElPYmplY3RNYW5hZ2VyLFxyXG4gICAgICAgIHBhcmVudE9iamVjdD86IElHYW1lT2JqZWN0XHJcbiAgICApIHtcclxuICAgICAgICBjb25zdCBub2RlSnNvbkRhdGEgPSBtb2RlbERhdGE/Lmpzb24/Lm5vZGVzW25vZGVJbmRleF1cclxuICAgICAgICBpZiAoIW5vZGVKc29uRGF0YSkge1xyXG4gICAgICAgICAgICByZXR1cm5cclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3Qgbm9kZUdhbWVPYmplY3QgPSBuZXcgR2FtZU9iamVjdCgpXHJcbiAgICAgICAgb2JqZWN0TWFuYWdlci5hZGRPYmplY3Qobm9kZUdhbWVPYmplY3QsIHBhcmVudE9iamVjdClcclxuXHJcbiAgICAgICAgLy9GSVhNRTogZmlndXJlIG91dCB3aGF0IGZvcm1hdCBpcyB1c2VkIGZvciB0cnMgdmFsdWVzIGluIHRoZSBwYXJzZXJcclxuICAgICAgICBjb25zdCBub2RlVHJhbnNmcm9tID0gbmV3IFRyYW5zZm9ybShcclxuICAgICAgICAgICAgbm9kZUdhbWVPYmplY3QsXHJcbiAgICAgICAgICAgIHVuZGVmaW5lZCxcclxuICAgICAgICAgICAgbm9kZUpzb25EYXRhLm1hdHJpeFxyXG4gICAgICAgIClcclxuXHJcbiAgICAgICAgaWYgKG5vZGVKc29uRGF0YS5tZXNoICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgLy9GSVhNRTogZ2V0IG1lc2ggYnVmZmVycyBhY2Nlc3NvcnMgYW5kIHNldCB0aGVtIGhlcmVcclxuICAgICAgICAgICAgLy8gY29uc3QgcG9zaXRpb25BY2Nlc3NvcjogR0xURkFjY2Vzc29yID0ge31cclxuICAgICAgICAgICAgY29uc3QgbWVzaEpzb25EYXRhID0gbW9kZWxEYXRhLmpzb24ubWVzaGVzW25vZGVKc29uRGF0YS5tZXNoXVxyXG4gICAgICAgICAgICBub2RlR2FtZU9iamVjdC5uYW1lID0gbWVzaEpzb25EYXRhLm5hbWVcclxuXHJcbiAgICAgICAgICAgIC8vIHtcclxuICAgICAgICAgICAgLy8gICAgIFwiYXR0cmlidXRlc1wiOiB7XHJcbiAgICAgICAgICAgIC8vICAgICAgICAgXCJOT1JNQUxcIjogMSxcclxuICAgICAgICAgICAgLy8gICAgICAgICBcIlBPU0lUSU9OXCI6IDIsXHJcbiAgICAgICAgICAgIC8vICAgICAgICAgXCJURVhDT09SRF8wXCI6IDNcclxuICAgICAgICAgICAgLy8gICAgIH0sXHJcbiAgICAgICAgICAgIC8vICAgICBcImluZGljZXNcIjogMCxcclxuICAgICAgICAgICAgLy8gICAgIFwibW9kZVwiOiA0LFxyXG4gICAgICAgICAgICAvLyAgICAgXCJtYXRlcmlhbFwiOiAwXHJcbiAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgIG1lc2hKc29uRGF0YS5wcmltaXRpdmVzLmZvckVhY2goXHJcbiAgICAgICAgICAgICAgICAocHJpbWl0aXZlOiB7XHJcbiAgICAgICAgICAgICAgICAgICAgYXR0cmlidXRlczoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBOT1JNQUw6IG51bWJlclxyXG4gICAgICAgICAgICAgICAgICAgICAgICBQT1NJVElPTjogbnVtYmVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFRFWENPT1JEXzA6IG51bWJlclxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpbmRpY2VzOiBudW1iZXJcclxuICAgICAgICAgICAgICAgICAgICBtb2RlOiBudW1iZXJcclxuICAgICAgICAgICAgICAgICAgICBtYXRlcmlhbDogbnVtYmVyXHJcbiAgICAgICAgICAgICAgICB9KSA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9UT0RPIVxyXG4gICAgICAgICAgICAgICAgICAgIC8vRklYTUU6IFBhcnNlIHRleHR1cmVzLCBtYXRlcmlhbHMsIGV0Yy4gaGVyZVxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uUmF3QWNjZXNzb3IgPVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtb2RlbERhdGEuanNvbi5hY2Nlc3NvcnNbcHJpbWl0aXZlLmF0dHJpYnV0ZXMuUE9TSVRJT05dXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uUmF3QnVmZmVyVmlldyA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsRGF0YS5qc29uLmJ1ZmZlclZpZXdzW1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25SYXdBY2Nlc3Nvci5idWZmZXJWaWV3XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIF1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocG9zaXRpb25SYXdCdWZmZXJWaWV3KVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBwb3NpdGlvbkJ1ZmZlciA9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1vZGVsRGF0YS5iaW5DaHVua3NbcG9zaXRpb25SYXdCdWZmZXJWaWV3LmJ1ZmZlcl1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cocG9zaXRpb25CdWZmZXIpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc2hHYW1lT2JqZWN0ID0gbmV3IEdhbWVPYmplY3QoKVxyXG4gICAgICAgICAgICAgICAgICAgIG9iamVjdE1hbmFnZXIuYWRkT2JqZWN0KG1lc2hHYW1lT2JqZWN0LCBub2RlR2FtZU9iamVjdClcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29uc3QgdmlldyA9IG5ldyBVaW50OEFycmF5KFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbkJ1ZmZlci5hcnJheUJ1ZmZlclxyXG4gICAgICAgICAgICAgICAgICAgICkuc3ViYXJyYXkoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uUmF3QnVmZmVyVmlldy5ieXRlT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblJhd0J1ZmZlclZpZXcuYnl0ZU9mZnNldCArXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvblJhd0J1ZmZlclZpZXcuYnl0ZUxlbmd0aFxyXG4gICAgICAgICAgICAgICAgICAgIClcclxuICAgICAgICAgICAgICAgICAgICBjb25zdCBidWYgPSBkZXZpY2UuY3JlYXRlQnVmZmVyKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2l6ZTogcG9zaXRpb25SYXdCdWZmZXJWaWV3LmJ5dGVMZW5ndGgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVzYWdlOiBwb3NpdGlvblJhd0J1ZmZlclZpZXcudGFyZ2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBtYXBwZWRBdENyZWF0aW9uOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAgICAgbmV3IFVpbnQ4QXJyYXkoYnVmLmdldE1hcHBlZFJhbmdlKCkpLnNldCh2aWV3KVxyXG4gICAgICAgICAgICAgICAgICAgIGJ1Zi51bm1hcCgpXHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBvc2l0aW9uQWNjZXNzb3I6IEdMVEZBY2Nlc3NvciA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZVN0cmlkZTogcG9zaXRpb25SYXdBY2Nlc3Nvci5ieXRlU3RyaWRlID8/IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvdW50OiBwb3NpdGlvblJhd0FjY2Vzc29yLmNvdW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb21wb25lbnRUeXBlOiBwb3NpdGlvblJhd0FjY2Vzc29yLmNvbXBvbmVudFR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHR5cGU6IHBvc2l0aW9uUmF3QWNjZXNzb3IudHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZU9mZnNldDogcG9zaXRpb25SYXdBY2Nlc3Nvci5ieXRlT2Zmc2V0ID8/IDAsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUeXBlOiBnZXRWZXJ0ZXhUeXBlKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25SYXdBY2Nlc3Nvci5jb21wb25lbnRUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb25SYXdBY2Nlc3Nvci50eXBlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1pbjogcG9zaXRpb25SYXdBY2Nlc3Nvci5taW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG1heDogcG9zaXRpb25SYXdBY2Nlc3Nvci5tYXgsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJ1ZmZlclZpZXc6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJ5dGVMZW5ndGg6IHBvc2l0aW9uUmF3QnVmZmVyVmlldy5ieXRlTGVuZ3RoLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnl0ZVN0cmlkZTogcG9zaXRpb25SYXdCdWZmZXJWaWV3LmJ5dGVTdHJpZGUsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnVmZmVyOiBidWYsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2FnZTogcG9zaXRpb25SYXdCdWZmZXJWaWV3LnRhcmdldCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IG1lc2ggPSBuZXcgTWVzaChtZXNoR2FtZU9iamVjdCwgcG9zaXRpb25BY2Nlc3NvcilcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gY29uc29sZS5sb2cobWVzaClcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgKVxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbm9kZUpzb25EYXRhPy5jaGlsZHJlbj8uZm9yRWFjaCgoY2hpbGRJbmRleDogbnVtYmVyKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMubG9hZE5vZGUoXHJcbiAgICAgICAgICAgICAgICBjaGlsZEluZGV4LFxyXG4gICAgICAgICAgICAgICAgbW9kZWxEYXRhLFxyXG4gICAgICAgICAgICAgICAgZGV2aWNlLFxyXG4gICAgICAgICAgICAgICAgb2JqZWN0TWFuYWdlcixcclxuICAgICAgICAgICAgICAgIG5vZGVHYW1lT2JqZWN0XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9KVxyXG4gICAgfVxyXG59XHJcblxyXG5leHBvcnQgZW51bSBHTFRGQ29tcG9uZW50VHlwZSB7XHJcbiAgICBCWVRFID0gNTEyMCxcclxuICAgIFVOU0lHTkVEX0JZVEUgPSA1MTIxLFxyXG4gICAgU0hPUlQgPSA1MTIyLFxyXG4gICAgVU5TSUdORURfU0hPUlQgPSA1MTIzLFxyXG4gICAgSU5UID0gNTEyNCxcclxuICAgIFVOU0lHTkVEX0lOVCA9IDUxMjUsXHJcbiAgICBGTE9BVCA9IDUxMjYsXHJcbiAgICBET1VCTEUgPSA1MTMwLFxyXG59XHJcblxyXG5jb25zdCBnZXRUeXBlQ29tcG9uZW50c0Ftb3VudCA9ICh0eXBlOiBzdHJpbmcpID0+IHtcclxuICAgIHN3aXRjaCAodHlwZSkge1xyXG4gICAgICAgIGNhc2UgJ1NDQUxBUic6XHJcbiAgICAgICAgICAgIHJldHVybiAxXHJcbiAgICAgICAgY2FzZSAnVkVDMic6XHJcbiAgICAgICAgICAgIHJldHVybiAyXHJcbiAgICAgICAgY2FzZSAnVkVDMyc6XHJcbiAgICAgICAgICAgIHJldHVybiAzXHJcbiAgICAgICAgY2FzZSAnVkVDNCc6XHJcbiAgICAgICAgY2FzZSAnTUFUMic6XHJcbiAgICAgICAgICAgIHJldHVybiA0XHJcbiAgICAgICAgY2FzZSAnTUFUMyc6XHJcbiAgICAgICAgICAgIHJldHVybiA5XHJcbiAgICAgICAgY2FzZSAnTUFUNCc6XHJcbiAgICAgICAgICAgIHJldHVybiAxNlxyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIGdsdGYgdHlwZSAke3R5cGV9YClcclxuICAgIH1cclxufVxyXG5cclxuY29uc3QgZ2V0VmVydGV4VHlwZSA9IChcclxuICAgIGNvbXBvbmVudFR5cGU6IG51bWJlcixcclxuICAgIHR5cGU6IHN0cmluZ1xyXG4pOiBHUFVWZXJ0ZXhGb3JtYXQgPT4ge1xyXG4gICAgbGV0IHR5cGVTdHI6IHN0cmluZyB8IG51bGwgPSBudWxsXHJcbiAgICBzd2l0Y2ggKGNvbXBvbmVudFR5cGUpIHtcclxuICAgICAgICBjYXNlIEdMVEZDb21wb25lbnRUeXBlLkJZVEU6XHJcbiAgICAgICAgICAgIHR5cGVTdHIgPSAnc2ludDgnXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSBHTFRGQ29tcG9uZW50VHlwZS5VTlNJR05FRF9CWVRFOlxyXG4gICAgICAgICAgICB0eXBlU3RyID0gJ3VpbnQ4J1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgR0xURkNvbXBvbmVudFR5cGUuU0hPUlQ6XHJcbiAgICAgICAgICAgIHR5cGVTdHIgPSAnc2ludDE2J1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgR0xURkNvbXBvbmVudFR5cGUuVU5TSUdORURfU0hPUlQ6XHJcbiAgICAgICAgICAgIHR5cGVTdHIgPSAndWludDE2J1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgR0xURkNvbXBvbmVudFR5cGUuSU5UOlxyXG4gICAgICAgICAgICB0eXBlU3RyID0gJ2ludDMyJ1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGNhc2UgR0xURkNvbXBvbmVudFR5cGUuVU5TSUdORURfSU5UOlxyXG4gICAgICAgICAgICB0eXBlU3RyID0gJ3VpbnQzMidcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIEdMVEZDb21wb25lbnRUeXBlLkZMT0FUOlxyXG4gICAgICAgICAgICB0eXBlU3RyID0gJ2Zsb2F0MzInXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgZGVmYXVsdDpcclxuICAgICAgICAgICAgdGhyb3cgRXJyb3IoXHJcbiAgICAgICAgICAgICAgICBgVW5yZWNvZ25pemVkIG9yIHVuc3VwcG9ydGVkIGdsdGYgdHlwZSAke2NvbXBvbmVudFR5cGV9YFxyXG4gICAgICAgICAgICApXHJcbiAgICB9XHJcblxyXG4gICAgc3dpdGNoIChnZXRUeXBlQ29tcG9uZW50c0Ftb3VudCh0eXBlKSkge1xyXG4gICAgICAgIGNhc2UgMjpcclxuICAgICAgICAgICAgdHlwZVN0ciArPSAneDInXHJcbiAgICAgICAgICAgIGJyZWFrXHJcbiAgICAgICAgY2FzZSAzOlxyXG4gICAgICAgICAgICB0eXBlU3RyICs9ICd4MydcclxuICAgICAgICAgICAgYnJlYWtcclxuICAgICAgICBjYXNlIDQ6XHJcbiAgICAgICAgICAgIHR5cGVTdHIgKz0gJ3g0J1xyXG4gICAgICAgICAgICBicmVha1xyXG4gICAgICAgIGRlZmF1bHQ6XHJcbiAgICAgICAgICAgIHRocm93IEVycm9yKGBJbnZhbGlkIG51bWJlciBvZiBjb21wb25lbnRzIGZvciBnbHRmIHR5cGU6ICR7dHlwZX1gKVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0eXBlU3RyIGFzIEdQVVZlcnRleEZvcm1hdFxyXG59XHJcbiIsImV4cG9ydCAqIGZyb20gJy4vV2hlZXp5R0xCTG9hZGVyJ1xyXG4iLCJleHBvcnQgZGVmYXVsdCBcImFsaWFzIGZsb2F0NCA9IHZlYzQ8ZjMyPjtcXHJcXG5hbGlhcyBmbG9hdDMgPSB2ZWMzPGYzMj47XFxyXFxuXFxyXFxuc3RydWN0IFZlcnRleElucHV0IHtcXHJcXG4gICAgQGxvY2F0aW9uKDApIHBvc2l0aW9uOiBmbG9hdDMsXFxyXFxufTtcXHJcXG5cXHJcXG5zdHJ1Y3QgVmVydGV4T3V0cHV0IHtcXHJcXG4gICAgQGJ1aWx0aW4ocG9zaXRpb24pIHBvc2l0aW9uOiBmbG9hdDQsXFxyXFxuICAgIEBsb2NhdGlvbigwKSB3b3JsZF9wb3M6IGZsb2F0MyxcXHJcXG59O1xcclxcblxcclxcbnN0cnVjdCBWaWV3UGFyYW1zIHtcXHJcXG4gICAgdmlld19wcm9qOiBtYXQ0eDQ8ZjMyPixcXHJcXG59O1xcclxcblxcclxcbnN0cnVjdCBOb2RlUGFyYW1zIHtcXHJcXG4gICAgdHJhbnNmb3JtOiBtYXQ0eDQ8ZjMyPixcXHJcXG59O1xcclxcblxcclxcbkBncm91cCgwKSBAYmluZGluZygwKVxcclxcbnZhcjx1bmlmb3JtPiB2aWV3X3BhcmFtczogVmlld1BhcmFtcztcXHJcXG5cXHJcXG5AZ3JvdXAoMSkgQGJpbmRpbmcoMClcXHJcXG52YXI8dW5pZm9ybT4gbm9kZV9wYXJhbXM6IE5vZGVQYXJhbXM7XFxyXFxuXFxyXFxuQHZlcnRleFxcclxcbmZuIHZlcnRleF9tYWluKHZlcnQ6IFZlcnRleElucHV0KSAtPiBWZXJ0ZXhPdXRwdXQge1xcclxcbiAgICB2YXIgb3V0OiBWZXJ0ZXhPdXRwdXQ7XFxyXFxuICAgIG91dC5wb3NpdGlvbiA9IHZpZXdfcGFyYW1zLnZpZXdfcHJvaiAqIG5vZGVfcGFyYW1zLnRyYW5zZm9ybSAqIGZsb2F0NCh2ZXJ0LnBvc2l0aW9uLCAxLjApO1xcclxcbiAgICBvdXQud29ybGRfcG9zID0gdmVydC5wb3NpdGlvbi54eXo7XFxyXFxuICAgIHJldHVybiBvdXQ7XFxyXFxufTtcXHJcXG5cXHJcXG5AZnJhZ21lbnRcXHJcXG5mbiBmcmFnbWVudF9tYWluKGluOiBWZXJ0ZXhPdXRwdXQpIC0+IEBsb2NhdGlvbigwKSBmbG9hdDQge1xcclxcbiAgICBsZXQgZHggPSBkcGR4KGluLndvcmxkX3Bvcyk7XFxyXFxuICAgIGxldCBkeSA9IGRwZHkoaW4ud29ybGRfcG9zKTtcXHJcXG4gICAgbGV0IG4gPSBub3JtYWxpemUoY3Jvc3MoZHgsIGR5KSk7XFxyXFxuICAgIHJldHVybiBmbG9hdDQoKG4gKyAxLjApICogMC41LCAxLjApO1xcclxcbn1cXHJcXG5cIiIsImZ1bmN0aW9uIF9jbGFzc0NhbGxDaGVjayhpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHsgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHsgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTsgfSB9XG5mdW5jdGlvbiBfZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7IGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHsgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTsgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlOyBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7IGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7IE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIF90b1Byb3BlcnR5S2V5KGRlc2NyaXB0b3Iua2V5KSwgZGVzY3JpcHRvcik7IH0gfVxuZnVuY3Rpb24gX2NyZWF0ZUNsYXNzKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykgeyBpZiAocHJvdG9Qcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTsgaWYgKHN0YXRpY1Byb3BzKSBfZGVmaW5lUHJvcGVydGllcyhDb25zdHJ1Y3Rvciwgc3RhdGljUHJvcHMpOyBPYmplY3QuZGVmaW5lUHJvcGVydHkoQ29uc3RydWN0b3IsIFwicHJvdG90eXBlXCIsIHsgd3JpdGFibGU6IGZhbHNlIH0pOyByZXR1cm4gQ29uc3RydWN0b3I7IH1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KGFyZykgeyB2YXIga2V5ID0gX3RvUHJpbWl0aXZlKGFyZywgXCJzdHJpbmdcIik7IHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7IH1cbmZ1bmN0aW9uIF90b1ByaW1pdGl2ZShpbnB1dCwgaGludCkgeyBpZiAodHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKHR5cGVvZiByZXMgIT09IFwib2JqZWN0XCIpIHJldHVybiByZXM7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTsgfSByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTsgfVxuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL3V0aWxzL2xvZy5qc1wiO1xudmFyIFdlYlNvY2tldENsaWVudCA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsXG4gICAqL1xuICBmdW5jdGlvbiBXZWJTb2NrZXRDbGllbnQodXJsKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdlYlNvY2tldENsaWVudCk7XG4gICAgdGhpcy5jbGllbnQgPSBuZXcgV2ViU29ja2V0KHVybCk7XG4gICAgdGhpcy5jbGllbnQub25lcnJvciA9IGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgbG9nLmVycm9yKGVycm9yKTtcbiAgICB9O1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7KC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkfSBmXG4gICAqL1xuICBfY3JlYXRlQ2xhc3MoV2ViU29ja2V0Q2xpZW50LCBbe1xuICAgIGtleTogXCJvbk9wZW5cIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25PcGVuKGYpIHtcbiAgICAgIHRoaXMuY2xpZW50Lm9ub3BlbiA9IGY7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsoLi4uYXJnczogYW55W10pID0+IHZvaWR9IGZcbiAgICAgKi9cbiAgfSwge1xuICAgIGtleTogXCJvbkNsb3NlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2xvc2UoZikge1xuICAgICAgdGhpcy5jbGllbnQub25jbG9zZSA9IGY7XG4gICAgfVxuXG4gICAgLy8gY2FsbCBmIHdpdGggdGhlIG1lc3NhZ2Ugc3RyaW5nIGFzIHRoZSBmaXJzdCBhcmd1bWVudFxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7KC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkfSBmXG4gICAgICovXG4gIH0sIHtcbiAgICBrZXk6IFwib25NZXNzYWdlXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uTWVzc2FnZShmKSB7XG4gICAgICB0aGlzLmNsaWVudC5vbm1lc3NhZ2UgPSBmdW5jdGlvbiAoZSkge1xuICAgICAgICBmKGUuZGF0YSk7XG4gICAgICB9O1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gV2ViU29ja2V0Q2xpZW50O1xufSgpO1xuZXhwb3J0IHsgV2ViU29ja2V0Q2xpZW50IGFzIGRlZmF1bHQgfTsiLCJmdW5jdGlvbiBvd25LZXlzKG9iamVjdCwgZW51bWVyYWJsZU9ubHkpIHsgdmFyIGtleXMgPSBPYmplY3Qua2V5cyhvYmplY3QpOyBpZiAoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scykgeyB2YXIgc3ltYm9scyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eVN5bWJvbHMob2JqZWN0KTsgZW51bWVyYWJsZU9ubHkgJiYgKHN5bWJvbHMgPSBzeW1ib2xzLmZpbHRlcihmdW5jdGlvbiAoc3ltKSB7IHJldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgc3ltKS5lbnVtZXJhYmxlOyB9KSksIGtleXMucHVzaC5hcHBseShrZXlzLCBzeW1ib2xzKTsgfSByZXR1cm4ga2V5czsgfVxuZnVuY3Rpb24gX29iamVjdFNwcmVhZCh0YXJnZXQpIHsgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHsgdmFyIHNvdXJjZSA9IG51bGwgIT0gYXJndW1lbnRzW2ldID8gYXJndW1lbnRzW2ldIDoge307IGkgJSAyID8gb3duS2V5cyhPYmplY3Qoc291cmNlKSwgITApLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBfZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIHNvdXJjZVtrZXldKTsgfSkgOiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyA/IE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMoc291cmNlKSkgOiBvd25LZXlzKE9iamVjdChzb3VyY2UpKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwga2V5LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHNvdXJjZSwga2V5KSk7IH0pOyB9IHJldHVybiB0YXJnZXQ7IH1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0eShvYmosIGtleSwgdmFsdWUpIHsga2V5ID0gX3RvUHJvcGVydHlLZXkoa2V5KTsgaWYgKGtleSBpbiBvYmopIHsgT2JqZWN0LmRlZmluZVByb3BlcnR5KG9iaiwga2V5LCB7IHZhbHVlOiB2YWx1ZSwgZW51bWVyYWJsZTogdHJ1ZSwgY29uZmlndXJhYmxlOiB0cnVlLCB3cml0YWJsZTogdHJ1ZSB9KTsgfSBlbHNlIHsgb2JqW2tleV0gPSB2YWx1ZTsgfSByZXR1cm4gb2JqOyB9XG5mdW5jdGlvbiBfdG9Qcm9wZXJ0eUtleShhcmcpIHsgdmFyIGtleSA9IF90b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpOyByZXR1cm4gdHlwZW9mIGtleSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpOyB9XG5mdW5jdGlvbiBfdG9QcmltaXRpdmUoaW5wdXQsIGhpbnQpIHsgaWYgKHR5cGVvZiBpbnB1dCAhPT0gXCJvYmplY3RcIiB8fCBpbnB1dCA9PT0gbnVsbCkgcmV0dXJuIGlucHV0OyB2YXIgcHJpbSA9IGlucHV0W1N5bWJvbC50b1ByaW1pdGl2ZV07IGlmIChwcmltICE9PSB1bmRlZmluZWQpIHsgdmFyIHJlcyA9IHByaW0uY2FsbChpbnB1dCwgaGludCB8fCBcImRlZmF1bHRcIik7IGlmICh0eXBlb2YgcmVzICE9PSBcIm9iamVjdFwiKSByZXR1cm4gcmVzOyB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7IH0gcmV0dXJuIChoaW50ID09PSBcInN0cmluZ1wiID8gU3RyaW5nIDogTnVtYmVyKShpbnB1dCk7IH1cbi8qIGdsb2JhbCBfX3Jlc291cmNlUXVlcnksIF9fd2VicGFja19oYXNoX18gKi9cbi8vLyA8cmVmZXJlbmNlIHR5cGVzPVwid2VicGFjay9tb2R1bGVcIiAvPlxuaW1wb3J0IHdlYnBhY2tIb3RMb2cgZnJvbSBcIndlYnBhY2svaG90L2xvZy5qc1wiO1xuaW1wb3J0IHN0cmlwQW5zaSBmcm9tIFwiLi91dGlscy9zdHJpcEFuc2kuanNcIjtcbmltcG9ydCBwYXJzZVVSTCBmcm9tIFwiLi91dGlscy9wYXJzZVVSTC5qc1wiO1xuaW1wb3J0IHNvY2tldCBmcm9tIFwiLi9zb2NrZXQuanNcIjtcbmltcG9ydCB7IGZvcm1hdFByb2JsZW0sIGNyZWF0ZU92ZXJsYXkgfSBmcm9tIFwiLi9vdmVybGF5LmpzXCI7XG5pbXBvcnQgeyBsb2csIGxvZ0VuYWJsZWRGZWF0dXJlcywgc2V0TG9nTGV2ZWwgfSBmcm9tIFwiLi91dGlscy9sb2cuanNcIjtcbmltcG9ydCBzZW5kTWVzc2FnZSBmcm9tIFwiLi91dGlscy9zZW5kTWVzc2FnZS5qc1wiO1xuaW1wb3J0IHJlbG9hZEFwcCBmcm9tIFwiLi91dGlscy9yZWxvYWRBcHAuanNcIjtcbmltcG9ydCBjcmVhdGVTb2NrZXRVUkwgZnJvbSBcIi4vdXRpbHMvY3JlYXRlU29ja2V0VVJMLmpzXCI7XG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gT3ZlcmxheU9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbiB8IChlcnJvcjogRXJyb3IpID0+IGJvb2xlYW59IFt3YXJuaW5nc11cbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbiB8IChlcnJvcjogRXJyb3IpID0+IGJvb2xlYW59IFtlcnJvcnNdXG4gKiBAcHJvcGVydHkge2Jvb2xlYW4gfCAoZXJyb3I6IEVycm9yKSA9PiBib29sZWFufSBbcnVudGltZUVycm9yc11cbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBbdHJ1c3RlZFR5cGVzUG9saWN5TmFtZV1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IE9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gaG90XG4gKiBAcHJvcGVydHkge2Jvb2xlYW59IGxpdmVSZWxvYWRcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbn0gcHJvZ3Jlc3NcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbiB8IE92ZXJsYXlPcHRpb25zfSBvdmVybGF5XG4gKiBAcHJvcGVydHkge3N0cmluZ30gW2xvZ2dpbmddXG4gKiBAcHJvcGVydHkge251bWJlcn0gW3JlY29ubmVjdF1cbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IFN0YXR1c1xuICogQHByb3BlcnR5IHtib29sZWFufSBpc1VubG9hZGluZ1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGN1cnJlbnRIYXNoXG4gKiBAcHJvcGVydHkge3N0cmluZ30gW3ByZXZpb3VzSGFzaF1cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7Ym9vbGVhbiB8IHsgd2FybmluZ3M/OiBib29sZWFuIHwgc3RyaW5nOyBlcnJvcnM/OiBib29sZWFuIHwgc3RyaW5nOyBydW50aW1lRXJyb3JzPzogYm9vbGVhbiB8IHN0cmluZzsgfX0gb3ZlcmxheU9wdGlvbnNcbiAqL1xudmFyIGRlY29kZU92ZXJsYXlPcHRpb25zID0gZnVuY3Rpb24gZGVjb2RlT3ZlcmxheU9wdGlvbnMob3ZlcmxheU9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBvdmVybGF5T3B0aW9ucyA9PT0gXCJvYmplY3RcIikge1xuICAgIFtcIndhcm5pbmdzXCIsIFwiZXJyb3JzXCIsIFwicnVudGltZUVycm9yc1wiXS5mb3JFYWNoKGZ1bmN0aW9uIChwcm9wZXJ0eSkge1xuICAgICAgaWYgKHR5cGVvZiBvdmVybGF5T3B0aW9uc1twcm9wZXJ0eV0gPT09IFwic3RyaW5nXCIpIHtcbiAgICAgICAgdmFyIG92ZXJsYXlGaWx0ZXJGdW5jdGlvblN0cmluZyA9IGRlY29kZVVSSUNvbXBvbmVudChvdmVybGF5T3B0aW9uc1twcm9wZXJ0eV0pO1xuXG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXctZnVuY1xuICAgICAgICB2YXIgb3ZlcmxheUZpbHRlckZ1bmN0aW9uID0gbmV3IEZ1bmN0aW9uKFwibWVzc2FnZVwiLCBcInZhciBjYWxsYmFjayA9IFwiLmNvbmNhdChvdmVybGF5RmlsdGVyRnVuY3Rpb25TdHJpbmcsIFwiXFxuICAgICAgICByZXR1cm4gY2FsbGJhY2sobWVzc2FnZSlcIikpO1xuICAgICAgICBvdmVybGF5T3B0aW9uc1twcm9wZXJ0eV0gPSBvdmVybGF5RmlsdGVyRnVuY3Rpb247XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn07XG5cbi8qKlxuICogQHR5cGUge1N0YXR1c31cbiAqL1xudmFyIHN0YXR1cyA9IHtcbiAgaXNVbmxvYWRpbmc6IGZhbHNlLFxuICAvLyBUT0RPIFdvcmthcm91bmQgZm9yIHdlYnBhY2sgdjQsIGBfX3dlYnBhY2tfaGFzaF9fYCBpcyBub3QgcmVwbGFjZWQgd2l0aG91dCBIb3RNb2R1bGVSZXBsYWNlbWVudFxuICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgY2FtZWxjYXNlXG4gIGN1cnJlbnRIYXNoOiB0eXBlb2YgX193ZWJwYWNrX2hhc2hfXyAhPT0gXCJ1bmRlZmluZWRcIiA/IF9fd2VicGFja19oYXNoX18gOiBcIlwiXG59O1xuXG4vKiogQHR5cGUge09wdGlvbnN9ICovXG52YXIgb3B0aW9ucyA9IHtcbiAgaG90OiBmYWxzZSxcbiAgbGl2ZVJlbG9hZDogZmFsc2UsXG4gIHByb2dyZXNzOiBmYWxzZSxcbiAgb3ZlcmxheTogZmFsc2Vcbn07XG52YXIgcGFyc2VkUmVzb3VyY2VRdWVyeSA9IHBhcnNlVVJMKF9fcmVzb3VyY2VRdWVyeSk7XG52YXIgZW5hYmxlZEZlYXR1cmVzID0ge1xuICBcIkhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcIjogZmFsc2UsXG4gIFwiTGl2ZSBSZWxvYWRpbmdcIjogZmFsc2UsXG4gIFByb2dyZXNzOiBmYWxzZSxcbiAgT3ZlcmxheTogZmFsc2Vcbn07XG5pZiAocGFyc2VkUmVzb3VyY2VRdWVyeS5ob3QgPT09IFwidHJ1ZVwiKSB7XG4gIG9wdGlvbnMuaG90ID0gdHJ1ZTtcbiAgZW5hYmxlZEZlYXR1cmVzW1wiSG90IE1vZHVsZSBSZXBsYWNlbWVudFwiXSA9IHRydWU7XG59XG5pZiAocGFyc2VkUmVzb3VyY2VRdWVyeVtcImxpdmUtcmVsb2FkXCJdID09PSBcInRydWVcIikge1xuICBvcHRpb25zLmxpdmVSZWxvYWQgPSB0cnVlO1xuICBlbmFibGVkRmVhdHVyZXNbXCJMaXZlIFJlbG9hZGluZ1wiXSA9IHRydWU7XG59XG5pZiAocGFyc2VkUmVzb3VyY2VRdWVyeS5wcm9ncmVzcyA9PT0gXCJ0cnVlXCIpIHtcbiAgb3B0aW9ucy5wcm9ncmVzcyA9IHRydWU7XG4gIGVuYWJsZWRGZWF0dXJlcy5Qcm9ncmVzcyA9IHRydWU7XG59XG5pZiAocGFyc2VkUmVzb3VyY2VRdWVyeS5vdmVybGF5KSB7XG4gIHRyeSB7XG4gICAgb3B0aW9ucy5vdmVybGF5ID0gSlNPTi5wYXJzZShwYXJzZWRSZXNvdXJjZVF1ZXJ5Lm92ZXJsYXkpO1xuICB9IGNhdGNoIChlKSB7XG4gICAgbG9nLmVycm9yKFwiRXJyb3IgcGFyc2luZyBvdmVybGF5IG9wdGlvbnMgZnJvbSByZXNvdXJjZSBxdWVyeTpcIiwgZSk7XG4gIH1cblxuICAvLyBGaWxsIGluIGRlZmF1bHQgXCJ0cnVlXCIgcGFyYW1zIGZvciBwYXJ0aWFsbHktc3BlY2lmaWVkIG9iamVjdHMuXG4gIGlmICh0eXBlb2Ygb3B0aW9ucy5vdmVybGF5ID09PSBcIm9iamVjdFwiKSB7XG4gICAgb3B0aW9ucy5vdmVybGF5ID0gX29iamVjdFNwcmVhZCh7XG4gICAgICBlcnJvcnM6IHRydWUsXG4gICAgICB3YXJuaW5nczogdHJ1ZSxcbiAgICAgIHJ1bnRpbWVFcnJvcnM6IHRydWVcbiAgICB9LCBvcHRpb25zLm92ZXJsYXkpO1xuICAgIGRlY29kZU92ZXJsYXlPcHRpb25zKG9wdGlvbnMub3ZlcmxheSk7XG4gIH1cbiAgZW5hYmxlZEZlYXR1cmVzLk92ZXJsYXkgPSB0cnVlO1xufVxuaWYgKHBhcnNlZFJlc291cmNlUXVlcnkubG9nZ2luZykge1xuICBvcHRpb25zLmxvZ2dpbmcgPSBwYXJzZWRSZXNvdXJjZVF1ZXJ5LmxvZ2dpbmc7XG59XG5pZiAodHlwZW9mIHBhcnNlZFJlc291cmNlUXVlcnkucmVjb25uZWN0ICE9PSBcInVuZGVmaW5lZFwiKSB7XG4gIG9wdGlvbnMucmVjb25uZWN0ID0gTnVtYmVyKHBhcnNlZFJlc291cmNlUXVlcnkucmVjb25uZWN0KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gbGV2ZWxcbiAqL1xuZnVuY3Rpb24gc2V0QWxsTG9nTGV2ZWwobGV2ZWwpIHtcbiAgLy8gVGhpcyBpcyBuZWVkZWQgYmVjYXVzZSB0aGUgSE1SIGxvZ2dlciBvcGVyYXRlIHNlcGFyYXRlbHkgZnJvbSBkZXYgc2VydmVyIGxvZ2dlclxuICB3ZWJwYWNrSG90TG9nLnNldExvZ0xldmVsKGxldmVsID09PSBcInZlcmJvc2VcIiB8fCBsZXZlbCA9PT0gXCJsb2dcIiA/IFwiaW5mb1wiIDogbGV2ZWwpO1xuICBzZXRMb2dMZXZlbChsZXZlbCk7XG59XG5pZiAob3B0aW9ucy5sb2dnaW5nKSB7XG4gIHNldEFsbExvZ0xldmVsKG9wdGlvbnMubG9nZ2luZyk7XG59XG5sb2dFbmFibGVkRmVhdHVyZXMoZW5hYmxlZEZlYXR1cmVzKTtcbnNlbGYuYWRkRXZlbnRMaXN0ZW5lcihcImJlZm9yZXVubG9hZFwiLCBmdW5jdGlvbiAoKSB7XG4gIHN0YXR1cy5pc1VubG9hZGluZyA9IHRydWU7XG59KTtcbnZhciBvdmVybGF5ID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IGNyZWF0ZU92ZXJsYXkodHlwZW9mIG9wdGlvbnMub3ZlcmxheSA9PT0gXCJvYmplY3RcIiA/IHtcbiAgdHJ1c3RlZFR5cGVzUG9saWN5TmFtZTogb3B0aW9ucy5vdmVybGF5LnRydXN0ZWRUeXBlc1BvbGljeU5hbWUsXG4gIGNhdGNoUnVudGltZUVycm9yOiBvcHRpb25zLm92ZXJsYXkucnVudGltZUVycm9yc1xufSA6IHtcbiAgdHJ1c3RlZFR5cGVzUG9saWN5TmFtZTogZmFsc2UsXG4gIGNhdGNoUnVudGltZUVycm9yOiBvcHRpb25zLm92ZXJsYXlcbn0pIDoge1xuICBzZW5kOiBmdW5jdGlvbiBzZW5kKCkge31cbn07XG52YXIgb25Tb2NrZXRNZXNzYWdlID0ge1xuICBob3Q6IGZ1bmN0aW9uIGhvdCgpIHtcbiAgICBpZiAocGFyc2VkUmVzb3VyY2VRdWVyeS5ob3QgPT09IFwiZmFsc2VcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvcHRpb25zLmhvdCA9IHRydWU7XG4gIH0sXG4gIGxpdmVSZWxvYWQ6IGZ1bmN0aW9uIGxpdmVSZWxvYWQoKSB7XG4gICAgaWYgKHBhcnNlZFJlc291cmNlUXVlcnlbXCJsaXZlLXJlbG9hZFwiXSA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9wdGlvbnMubGl2ZVJlbG9hZCA9IHRydWU7XG4gIH0sXG4gIGludmFsaWQ6IGZ1bmN0aW9uIGludmFsaWQoKSB7XG4gICAgbG9nLmluZm8oXCJBcHAgdXBkYXRlZC4gUmVjb21waWxpbmcuLi5cIik7XG5cbiAgICAvLyBGaXhlcyAjMTA0Mi4gb3ZlcmxheSBkb2Vzbid0IGNsZWFyIGlmIGVycm9ycyBhcmUgZml4ZWQgYnV0IHdhcm5pbmdzIHJlbWFpbi5cbiAgICBpZiAob3B0aW9ucy5vdmVybGF5KSB7XG4gICAgICBvdmVybGF5LnNlbmQoe1xuICAgICAgICB0eXBlOiBcIkRJU01JU1NcIlxuICAgICAgfSk7XG4gICAgfVxuICAgIHNlbmRNZXNzYWdlKFwiSW52YWxpZFwiKTtcbiAgfSxcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBoYXNoXG4gICAqL1xuICBoYXNoOiBmdW5jdGlvbiBoYXNoKF9oYXNoKSB7XG4gICAgc3RhdHVzLnByZXZpb3VzSGFzaCA9IHN0YXR1cy5jdXJyZW50SGFzaDtcbiAgICBzdGF0dXMuY3VycmVudEhhc2ggPSBfaGFzaDtcbiAgfSxcbiAgbG9nZ2luZzogc2V0QWxsTG9nTGV2ZWwsXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZhbHVlXG4gICAqL1xuICBvdmVybGF5OiBmdW5jdGlvbiBvdmVybGF5KHZhbHVlKSB7XG4gICAgaWYgKHR5cGVvZiBkb2N1bWVudCA9PT0gXCJ1bmRlZmluZWRcIikge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBvcHRpb25zLm92ZXJsYXkgPSB2YWx1ZTtcbiAgICBkZWNvZGVPdmVybGF5T3B0aW9ucyhvcHRpb25zLm92ZXJsYXkpO1xuICB9LFxuICAvKipcbiAgICogQHBhcmFtIHtudW1iZXJ9IHZhbHVlXG4gICAqL1xuICByZWNvbm5lY3Q6IGZ1bmN0aW9uIHJlY29ubmVjdCh2YWx1ZSkge1xuICAgIGlmIChwYXJzZWRSZXNvdXJjZVF1ZXJ5LnJlY29ubmVjdCA9PT0gXCJmYWxzZVwiKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIG9wdGlvbnMucmVjb25uZWN0ID0gdmFsdWU7XG4gIH0sXG4gIC8qKlxuICAgKiBAcGFyYW0ge2Jvb2xlYW59IHZhbHVlXG4gICAqL1xuICBwcm9ncmVzczogZnVuY3Rpb24gcHJvZ3Jlc3ModmFsdWUpIHtcbiAgICBvcHRpb25zLnByb2dyZXNzID0gdmFsdWU7XG4gIH0sXG4gIC8qKlxuICAgKiBAcGFyYW0ge3sgcGx1Z2luTmFtZT86IHN0cmluZywgcGVyY2VudDogbnVtYmVyLCBtc2c6IHN0cmluZyB9fSBkYXRhXG4gICAqL1xuICBcInByb2dyZXNzLXVwZGF0ZVwiOiBmdW5jdGlvbiBwcm9ncmVzc1VwZGF0ZShkYXRhKSB7XG4gICAgaWYgKG9wdGlvbnMucHJvZ3Jlc3MpIHtcbiAgICAgIGxvZy5pbmZvKFwiXCIuY29uY2F0KGRhdGEucGx1Z2luTmFtZSA/IFwiW1wiLmNvbmNhdChkYXRhLnBsdWdpbk5hbWUsIFwiXSBcIikgOiBcIlwiKS5jb25jYXQoZGF0YS5wZXJjZW50LCBcIiUgLSBcIikuY29uY2F0KGRhdGEubXNnLCBcIi5cIikpO1xuICAgIH1cbiAgICBzZW5kTWVzc2FnZShcIlByb2dyZXNzXCIsIGRhdGEpO1xuICB9LFxuICBcInN0aWxsLW9rXCI6IGZ1bmN0aW9uIHN0aWxsT2soKSB7XG4gICAgbG9nLmluZm8oXCJOb3RoaW5nIGNoYW5nZWQuXCIpO1xuICAgIGlmIChvcHRpb25zLm92ZXJsYXkpIHtcbiAgICAgIG92ZXJsYXkuc2VuZCh7XG4gICAgICAgIHR5cGU6IFwiRElTTUlTU1wiXG4gICAgICB9KTtcbiAgICB9XG4gICAgc2VuZE1lc3NhZ2UoXCJTdGlsbE9rXCIpO1xuICB9LFxuICBvazogZnVuY3Rpb24gb2soKSB7XG4gICAgc2VuZE1lc3NhZ2UoXCJPa1wiKTtcbiAgICBpZiAob3B0aW9ucy5vdmVybGF5KSB7XG4gICAgICBvdmVybGF5LnNlbmQoe1xuICAgICAgICB0eXBlOiBcIkRJU01JU1NcIlxuICAgICAgfSk7XG4gICAgfVxuICAgIHJlbG9hZEFwcChvcHRpb25zLCBzdGF0dXMpO1xuICB9LFxuICAvLyBUT0RPOiByZW1vdmUgaW4gdjUgaW4gZmF2b3Igb2YgJ3N0YXRpYy1jaGFuZ2VkJ1xuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IGZpbGVcbiAgICovXG4gIFwiY29udGVudC1jaGFuZ2VkXCI6IGZ1bmN0aW9uIGNvbnRlbnRDaGFuZ2VkKGZpbGUpIHtcbiAgICBsb2cuaW5mbyhcIlwiLmNvbmNhdChmaWxlID8gXCJcXFwiXCIuY29uY2F0KGZpbGUsIFwiXFxcIlwiKSA6IFwiQ29udGVudFwiLCBcIiBmcm9tIHN0YXRpYyBkaXJlY3Rvcnkgd2FzIGNoYW5nZWQuIFJlbG9hZGluZy4uLlwiKSk7XG4gICAgc2VsZi5sb2NhdGlvbi5yZWxvYWQoKTtcbiAgfSxcbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBmaWxlXG4gICAqL1xuICBcInN0YXRpYy1jaGFuZ2VkXCI6IGZ1bmN0aW9uIHN0YXRpY0NoYW5nZWQoZmlsZSkge1xuICAgIGxvZy5pbmZvKFwiXCIuY29uY2F0KGZpbGUgPyBcIlxcXCJcIi5jb25jYXQoZmlsZSwgXCJcXFwiXCIpIDogXCJDb250ZW50XCIsIFwiIGZyb20gc3RhdGljIGRpcmVjdG9yeSB3YXMgY2hhbmdlZC4gUmVsb2FkaW5nLi4uXCIpKTtcbiAgICBzZWxmLmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9LFxuICAvKipcbiAgICogQHBhcmFtIHtFcnJvcltdfSB3YXJuaW5nc1xuICAgKiBAcGFyYW0ge2FueX0gcGFyYW1zXG4gICAqL1xuICB3YXJuaW5nczogZnVuY3Rpb24gd2FybmluZ3MoX3dhcm5pbmdzLCBwYXJhbXMpIHtcbiAgICBsb2cud2FybihcIldhcm5pbmdzIHdoaWxlIGNvbXBpbGluZy5cIik7XG4gICAgdmFyIHByaW50YWJsZVdhcm5pbmdzID0gX3dhcm5pbmdzLm1hcChmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgIHZhciBfZm9ybWF0UHJvYmxlbSA9IGZvcm1hdFByb2JsZW0oXCJ3YXJuaW5nXCIsIGVycm9yKSxcbiAgICAgICAgaGVhZGVyID0gX2Zvcm1hdFByb2JsZW0uaGVhZGVyLFxuICAgICAgICBib2R5ID0gX2Zvcm1hdFByb2JsZW0uYm9keTtcbiAgICAgIHJldHVybiBcIlwiLmNvbmNhdChoZWFkZXIsIFwiXFxuXCIpLmNvbmNhdChzdHJpcEFuc2koYm9keSkpO1xuICAgIH0pO1xuICAgIHNlbmRNZXNzYWdlKFwiV2FybmluZ3NcIiwgcHJpbnRhYmxlV2FybmluZ3MpO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJpbnRhYmxlV2FybmluZ3MubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxvZy53YXJuKHByaW50YWJsZVdhcm5pbmdzW2ldKTtcbiAgICB9XG4gICAgdmFyIG92ZXJsYXlXYXJuaW5nc1NldHRpbmcgPSB0eXBlb2Ygb3B0aW9ucy5vdmVybGF5ID09PSBcImJvb2xlYW5cIiA/IG9wdGlvbnMub3ZlcmxheSA6IG9wdGlvbnMub3ZlcmxheSAmJiBvcHRpb25zLm92ZXJsYXkud2FybmluZ3M7XG4gICAgaWYgKG92ZXJsYXlXYXJuaW5nc1NldHRpbmcpIHtcbiAgICAgIHZhciB3YXJuaW5nc1RvRGlzcGxheSA9IHR5cGVvZiBvdmVybGF5V2FybmluZ3NTZXR0aW5nID09PSBcImZ1bmN0aW9uXCIgPyBfd2FybmluZ3MuZmlsdGVyKG92ZXJsYXlXYXJuaW5nc1NldHRpbmcpIDogX3dhcm5pbmdzO1xuICAgICAgaWYgKHdhcm5pbmdzVG9EaXNwbGF5Lmxlbmd0aCkge1xuICAgICAgICBvdmVybGF5LnNlbmQoe1xuICAgICAgICAgIHR5cGU6IFwiQlVJTERfRVJST1JcIixcbiAgICAgICAgICBsZXZlbDogXCJ3YXJuaW5nXCIsXG4gICAgICAgICAgbWVzc2FnZXM6IF93YXJuaW5nc1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHBhcmFtcyAmJiBwYXJhbXMucHJldmVudFJlbG9hZGluZykge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICByZWxvYWRBcHAob3B0aW9ucywgc3RhdHVzKTtcbiAgfSxcbiAgLyoqXG4gICAqIEBwYXJhbSB7RXJyb3JbXX0gZXJyb3JzXG4gICAqL1xuICBlcnJvcnM6IGZ1bmN0aW9uIGVycm9ycyhfZXJyb3JzKSB7XG4gICAgbG9nLmVycm9yKFwiRXJyb3JzIHdoaWxlIGNvbXBpbGluZy4gUmVsb2FkIHByZXZlbnRlZC5cIik7XG4gICAgdmFyIHByaW50YWJsZUVycm9ycyA9IF9lcnJvcnMubWFwKGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgdmFyIF9mb3JtYXRQcm9ibGVtMiA9IGZvcm1hdFByb2JsZW0oXCJlcnJvclwiLCBlcnJvciksXG4gICAgICAgIGhlYWRlciA9IF9mb3JtYXRQcm9ibGVtMi5oZWFkZXIsXG4gICAgICAgIGJvZHkgPSBfZm9ybWF0UHJvYmxlbTIuYm9keTtcbiAgICAgIHJldHVybiBcIlwiLmNvbmNhdChoZWFkZXIsIFwiXFxuXCIpLmNvbmNhdChzdHJpcEFuc2koYm9keSkpO1xuICAgIH0pO1xuICAgIHNlbmRNZXNzYWdlKFwiRXJyb3JzXCIsIHByaW50YWJsZUVycm9ycyk7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcmludGFibGVFcnJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGxvZy5lcnJvcihwcmludGFibGVFcnJvcnNbaV0pO1xuICAgIH1cbiAgICB2YXIgb3ZlcmxheUVycm9yc1NldHRpbmdzID0gdHlwZW9mIG9wdGlvbnMub3ZlcmxheSA9PT0gXCJib29sZWFuXCIgPyBvcHRpb25zLm92ZXJsYXkgOiBvcHRpb25zLm92ZXJsYXkgJiYgb3B0aW9ucy5vdmVybGF5LmVycm9ycztcbiAgICBpZiAob3ZlcmxheUVycm9yc1NldHRpbmdzKSB7XG4gICAgICB2YXIgZXJyb3JzVG9EaXNwbGF5ID0gdHlwZW9mIG92ZXJsYXlFcnJvcnNTZXR0aW5ncyA9PT0gXCJmdW5jdGlvblwiID8gX2Vycm9ycy5maWx0ZXIob3ZlcmxheUVycm9yc1NldHRpbmdzKSA6IF9lcnJvcnM7XG4gICAgICBpZiAoZXJyb3JzVG9EaXNwbGF5Lmxlbmd0aCkge1xuICAgICAgICBvdmVybGF5LnNlbmQoe1xuICAgICAgICAgIHR5cGU6IFwiQlVJTERfRVJST1JcIixcbiAgICAgICAgICBsZXZlbDogXCJlcnJvclwiLFxuICAgICAgICAgIG1lc3NhZ2VzOiBfZXJyb3JzXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgLyoqXG4gICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yXG4gICAqL1xuICBlcnJvcjogZnVuY3Rpb24gZXJyb3IoX2Vycm9yKSB7XG4gICAgbG9nLmVycm9yKF9lcnJvcik7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICBsb2cuaW5mbyhcIkRpc2Nvbm5lY3RlZCFcIik7XG4gICAgaWYgKG9wdGlvbnMub3ZlcmxheSkge1xuICAgICAgb3ZlcmxheS5zZW5kKHtcbiAgICAgICAgdHlwZTogXCJESVNNSVNTXCJcbiAgICAgIH0pO1xuICAgIH1cbiAgICBzZW5kTWVzc2FnZShcIkNsb3NlXCIpO1xuICB9XG59O1xudmFyIHNvY2tldFVSTCA9IGNyZWF0ZVNvY2tldFVSTChwYXJzZWRSZXNvdXJjZVF1ZXJ5KTtcbnNvY2tldChzb2NrZXRVUkwsIG9uU29ja2V0TWVzc2FnZSwgb3B0aW9ucy5yZWNvbm5lY3QpOyIsIi8qKioqKiovIChmdW5jdGlvbigpIHsgLy8gd2VicGFja0Jvb3RzdHJhcFxuLyoqKioqKi8gXHRcInVzZSBzdHJpY3RcIjtcbi8qKioqKiovIFx0dmFyIF9fd2VicGFja19tb2R1bGVzX18gPSAoe1xuXG4vKioqLyBcIi4vY2xpZW50LXNyYy9tb2R1bGVzL2xvZ2dlci9TeW5jQmFpbEhvb2tGYWtlLmpzXCI6XG4vKiEqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vY2xpZW50LXNyYy9tb2R1bGVzL2xvZ2dlci9TeW5jQmFpbEhvb2tGYWtlLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKi8gKGZ1bmN0aW9uKG1vZHVsZSkge1xuXG5cblxuLyoqXG4gKiBDbGllbnQgc3R1YiBmb3IgdGFwYWJsZSBTeW5jQmFpbEhvb2tcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjbGllbnRUYXBhYmxlU3luY0JhaWxIb29rKCkge1xuICByZXR1cm4ge1xuICAgIGNhbGw6IGZ1bmN0aW9uIGNhbGwoKSB7fVxuICB9O1xufTtcblxuLyoqKi8gfSksXG5cbi8qKiovIFwiLi9ub2RlX21vZHVsZXMvd2VicGFjay9saWIvbG9nZ2luZy9Mb2dnZXIuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvd2VicGFjay9saWIvbG9nZ2luZy9Mb2dnZXIuanMgKioqIVxuICBcXCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoZnVuY3Rpb24oX191bnVzZWRfd2VicGFja19tb2R1bGUsIGV4cG9ydHMpIHtcblxuLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxuXG5cbmZ1bmN0aW9uIF90b0NvbnN1bWFibGVBcnJheShhcnIpIHtcbiAgcmV0dXJuIF9hcnJheVdpdGhvdXRIb2xlcyhhcnIpIHx8IF9pdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkoYXJyKSB8fCBfbm9uSXRlcmFibGVTcHJlYWQoKTtcbn1cbmZ1bmN0aW9uIF9ub25JdGVyYWJsZVNwcmVhZCgpIHtcbiAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBzcHJlYWQgbm9uLWl0ZXJhYmxlIGluc3RhbmNlLlxcbkluIG9yZGVyIHRvIGJlIGl0ZXJhYmxlLCBub24tYXJyYXkgb2JqZWN0cyBtdXN0IGhhdmUgYSBbU3ltYm9sLml0ZXJhdG9yXSgpIG1ldGhvZC5cIik7XG59XG5mdW5jdGlvbiBfdW5zdXBwb3J0ZWRJdGVyYWJsZVRvQXJyYXkobywgbWluTGVuKSB7XG4gIGlmICghbykgcmV0dXJuO1xuICBpZiAodHlwZW9mIG8gPT09IFwic3RyaW5nXCIpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShvLCBtaW5MZW4pO1xuICB2YXIgbiA9IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKS5zbGljZSg4LCAtMSk7XG4gIGlmIChuID09PSBcIk9iamVjdFwiICYmIG8uY29uc3RydWN0b3IpIG4gPSBvLmNvbnN0cnVjdG9yLm5hbWU7XG4gIGlmIChuID09PSBcIk1hcFwiIHx8IG4gPT09IFwiU2V0XCIpIHJldHVybiBBcnJheS5mcm9tKG8pO1xuICBpZiAobiA9PT0gXCJBcmd1bWVudHNcIiB8fCAvXig/OlVpfEkpbnQoPzo4fDE2fDMyKSg/OkNsYW1wZWQpP0FycmF5JC8udGVzdChuKSkgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG59XG5mdW5jdGlvbiBfaXRlcmFibGVUb0FycmF5KGl0ZXIpIHtcbiAgaWYgKHR5cGVvZiAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiA/IFN5bWJvbCA6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBpOyB9KSAhPT0gXCJ1bmRlZmluZWRcIiAmJiBpdGVyWyh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiID8gU3ltYm9sIDogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGk7IH0pLml0ZXJhdG9yXSAhPSBudWxsIHx8IGl0ZXJbXCJAQGl0ZXJhdG9yXCJdICE9IG51bGwpIHJldHVybiBBcnJheS5mcm9tKGl0ZXIpO1xufVxuZnVuY3Rpb24gX2FycmF5V2l0aG91dEhvbGVzKGFycikge1xuICBpZiAoQXJyYXkuaXNBcnJheShhcnIpKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkoYXJyKTtcbn1cbmZ1bmN0aW9uIF9hcnJheUxpa2VUb0FycmF5KGFyciwgbGVuKSB7XG4gIGlmIChsZW4gPT0gbnVsbCB8fCBsZW4gPiBhcnIubGVuZ3RoKSBsZW4gPSBhcnIubGVuZ3RoO1xuICBmb3IgKHZhciBpID0gMCwgYXJyMiA9IG5ldyBBcnJheShsZW4pOyBpIDwgbGVuOyBpKyspIGFycjJbaV0gPSBhcnJbaV07XG4gIHJldHVybiBhcnIyO1xufVxuZnVuY3Rpb24gX2NsYXNzQ2FsbENoZWNrKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn1cbmZ1bmN0aW9uIF9kZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIF90b1Byb3BlcnR5S2V5KGRlc2NyaXB0b3Iua2V5KSwgZGVzY3JpcHRvcik7XG4gIH1cbn1cbmZ1bmN0aW9uIF9jcmVhdGVDbGFzcyhDb25zdHJ1Y3RvciwgcHJvdG9Qcm9wcywgc3RhdGljUHJvcHMpIHtcbiAgaWYgKHByb3RvUHJvcHMpIF9kZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gIGlmIChzdGF0aWNQcm9wcykgX2RlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbnN0cnVjdG9yLCBcInByb3RvdHlwZVwiLCB7XG4gICAgd3JpdGFibGU6IGZhbHNlXG4gIH0pO1xuICByZXR1cm4gQ29uc3RydWN0b3I7XG59XG5mdW5jdGlvbiBfdG9Qcm9wZXJ0eUtleShhcmcpIHtcbiAgdmFyIGtleSA9IF90b1ByaW1pdGl2ZShhcmcsIFwic3RyaW5nXCIpO1xuICByZXR1cm4gdHlwZW9mIGtleSA9PT0gXCJzeW1ib2xcIiA/IGtleSA6IFN0cmluZyhrZXkpO1xufVxuZnVuY3Rpb24gX3RvUHJpbWl0aXZlKGlucHV0LCBoaW50KSB7XG4gIGlmICh0eXBlb2YgaW5wdXQgIT09IFwib2JqZWN0XCIgfHwgaW5wdXQgPT09IG51bGwpIHJldHVybiBpbnB1dDtcbiAgdmFyIHByaW0gPSBpbnB1dFsodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiA/IFN5bWJvbCA6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBpOyB9KS50b1ByaW1pdGl2ZV07XG4gIGlmIChwcmltICE9PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTtcbiAgICBpZiAodHlwZW9mIHJlcyAhPT0gXCJvYmplY3RcIikgcmV0dXJuIHJlcztcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQEB0b1ByaW1pdGl2ZSBtdXN0IHJldHVybiBhIHByaW1pdGl2ZSB2YWx1ZS5cIik7XG4gIH1cbiAgcmV0dXJuIChoaW50ID09PSBcInN0cmluZ1wiID8gU3RyaW5nIDogTnVtYmVyKShpbnB1dCk7XG59XG52YXIgTG9nVHlwZSA9IE9iamVjdC5mcmVlemUoe1xuICBlcnJvcjogLyoqIEB0eXBlIHtcImVycm9yXCJ9ICovXCJlcnJvclwiLFxuICAvLyBtZXNzYWdlLCBjIHN0eWxlIGFyZ3VtZW50c1xuICB3YXJuOiAvKiogQHR5cGUge1wid2FyblwifSAqL1wid2FyblwiLFxuICAvLyBtZXNzYWdlLCBjIHN0eWxlIGFyZ3VtZW50c1xuICBpbmZvOiAvKiogQHR5cGUge1wiaW5mb1wifSAqL1wiaW5mb1wiLFxuICAvLyBtZXNzYWdlLCBjIHN0eWxlIGFyZ3VtZW50c1xuICBsb2c6IC8qKiBAdHlwZSB7XCJsb2dcIn0gKi9cImxvZ1wiLFxuICAvLyBtZXNzYWdlLCBjIHN0eWxlIGFyZ3VtZW50c1xuICBkZWJ1ZzogLyoqIEB0eXBlIHtcImRlYnVnXCJ9ICovXCJkZWJ1Z1wiLFxuICAvLyBtZXNzYWdlLCBjIHN0eWxlIGFyZ3VtZW50c1xuXG4gIHRyYWNlOiAvKiogQHR5cGUge1widHJhY2VcIn0gKi9cInRyYWNlXCIsXG4gIC8vIG5vIGFyZ3VtZW50c1xuXG4gIGdyb3VwOiAvKiogQHR5cGUge1wiZ3JvdXBcIn0gKi9cImdyb3VwXCIsXG4gIC8vIFtsYWJlbF1cbiAgZ3JvdXBDb2xsYXBzZWQ6IC8qKiBAdHlwZSB7XCJncm91cENvbGxhcHNlZFwifSAqL1wiZ3JvdXBDb2xsYXBzZWRcIixcbiAgLy8gW2xhYmVsXVxuICBncm91cEVuZDogLyoqIEB0eXBlIHtcImdyb3VwRW5kXCJ9ICovXCJncm91cEVuZFwiLFxuICAvLyBbbGFiZWxdXG5cbiAgcHJvZmlsZTogLyoqIEB0eXBlIHtcInByb2ZpbGVcIn0gKi9cInByb2ZpbGVcIixcbiAgLy8gW3Byb2ZpbGVOYW1lXVxuICBwcm9maWxlRW5kOiAvKiogQHR5cGUge1wicHJvZmlsZUVuZFwifSAqL1wicHJvZmlsZUVuZFwiLFxuICAvLyBbcHJvZmlsZU5hbWVdXG5cbiAgdGltZTogLyoqIEB0eXBlIHtcInRpbWVcIn0gKi9cInRpbWVcIixcbiAgLy8gbmFtZSwgdGltZSBhcyBbc2Vjb25kcywgbmFub3NlY29uZHNdXG5cbiAgY2xlYXI6IC8qKiBAdHlwZSB7XCJjbGVhclwifSAqL1wiY2xlYXJcIixcbiAgLy8gbm8gYXJndW1lbnRzXG4gIHN0YXR1czogLyoqIEB0eXBlIHtcInN0YXR1c1wifSAqL1wic3RhdHVzXCIgLy8gbWVzc2FnZSwgYXJndW1lbnRzXG59KTtcblxuZXhwb3J0cy5Mb2dUeXBlID0gTG9nVHlwZTtcblxuLyoqIEB0eXBlZGVmIHt0eXBlb2YgTG9nVHlwZVtrZXlvZiB0eXBlb2YgTG9nVHlwZV19IExvZ1R5cGVFbnVtICovXG5cbnZhciBMT0dfU1lNQk9MID0gKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgPyBTeW1ib2wgOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gaTsgfSkoXCJ3ZWJwYWNrIGxvZ2dlciByYXcgbG9nIG1ldGhvZFwiKTtcbnZhciBUSU1FUlNfU1lNQk9MID0gKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgPyBTeW1ib2wgOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gaTsgfSkoXCJ3ZWJwYWNrIGxvZ2dlciB0aW1lc1wiKTtcbnZhciBUSU1FUlNfQUdHUkVHQVRFU19TWU1CT0wgPSAodHlwZW9mIFN5bWJvbCAhPT0gXCJ1bmRlZmluZWRcIiA/IFN5bWJvbCA6IGZ1bmN0aW9uIChpKSB7IHJldHVybiBpOyB9KShcIndlYnBhY2sgbG9nZ2VyIGFnZ3JlZ2F0ZWQgdGltZXNcIik7XG52YXIgV2VicGFja0xvZ2dlciA9IC8qI19fUFVSRV9fKi9mdW5jdGlvbiAoKSB7XG4gIC8qKlxuICAgKiBAcGFyYW0ge2Z1bmN0aW9uKExvZ1R5cGVFbnVtLCBhbnlbXT0pOiB2b2lkfSBsb2cgbG9nIGZ1bmN0aW9uXG4gICAqIEBwYXJhbSB7ZnVuY3Rpb24oc3RyaW5nIHwgZnVuY3Rpb24oKTogc3RyaW5nKTogV2VicGFja0xvZ2dlcn0gZ2V0Q2hpbGRMb2dnZXIgZnVuY3Rpb24gdG8gY3JlYXRlIGNoaWxkIGxvZ2dlclxuICAgKi9cbiAgZnVuY3Rpb24gV2VicGFja0xvZ2dlcihsb2csIGdldENoaWxkTG9nZ2VyKSB7XG4gICAgX2NsYXNzQ2FsbENoZWNrKHRoaXMsIFdlYnBhY2tMb2dnZXIpO1xuICAgIHRoaXNbTE9HX1NZTUJPTF0gPSBsb2c7XG4gICAgdGhpcy5nZXRDaGlsZExvZ2dlciA9IGdldENoaWxkTG9nZ2VyO1xuICB9XG4gIF9jcmVhdGVDbGFzcyhXZWJwYWNrTG9nZ2VyLCBbe1xuICAgIGtleTogXCJlcnJvclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBlcnJvcigpIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXldID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuICAgICAgdGhpc1tMT0dfU1lNQk9MXShMb2dUeXBlLmVycm9yLCBhcmdzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwid2FyblwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB3YXJuKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICAgIGFyZ3NbX2tleTJdID0gYXJndW1lbnRzW19rZXkyXTtcbiAgICAgIH1cbiAgICAgIHRoaXNbTE9HX1NZTUJPTF0oTG9nVHlwZS53YXJuLCBhcmdzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiaW5mb1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpbmZvKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjMgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4zKSwgX2tleTMgPSAwOyBfa2V5MyA8IF9sZW4zOyBfa2V5MysrKSB7XG4gICAgICAgIGFyZ3NbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICAgIH1cbiAgICAgIHRoaXNbTE9HX1NZTUJPTF0oTG9nVHlwZS5pbmZvLCBhcmdzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwibG9nXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxvZygpIHtcbiAgICAgIGZvciAodmFyIF9sZW40ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNCksIF9rZXk0ID0gMDsgX2tleTQgPCBfbGVuNDsgX2tleTQrKykge1xuICAgICAgICBhcmdzW19rZXk0XSA9IGFyZ3VtZW50c1tfa2V5NF07XG4gICAgICB9XG4gICAgICB0aGlzW0xPR19TWU1CT0xdKExvZ1R5cGUubG9nLCBhcmdzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiZGVidWdcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gZGVidWcoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuNSA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjUpLCBfa2V5NSA9IDA7IF9rZXk1IDwgX2xlbjU7IF9rZXk1KyspIHtcbiAgICAgICAgYXJnc1tfa2V5NV0gPSBhcmd1bWVudHNbX2tleTVdO1xuICAgICAgfVxuICAgICAgdGhpc1tMT0dfU1lNQk9MXShMb2dUeXBlLmRlYnVnLCBhcmdzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwiYXNzZXJ0XCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGFzc2VydChhc3NlcnRpb24pIHtcbiAgICAgIGlmICghYXNzZXJ0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIF9sZW42ID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuNiA+IDEgPyBfbGVuNiAtIDEgOiAwKSwgX2tleTYgPSAxOyBfa2V5NiA8IF9sZW42OyBfa2V5NisrKSB7XG4gICAgICAgICAgYXJnc1tfa2V5NiAtIDFdID0gYXJndW1lbnRzW19rZXk2XTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzW0xPR19TWU1CT0xdKExvZ1R5cGUuZXJyb3IsIGFyZ3MpO1xuICAgICAgfVxuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0cmFjZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0cmFjZSgpIHtcbiAgICAgIHRoaXNbTE9HX1NZTUJPTF0oTG9nVHlwZS50cmFjZSwgW1wiVHJhY2VcIl0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJjbGVhclwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBjbGVhcigpIHtcbiAgICAgIHRoaXNbTE9HX1NZTUJPTF0oTG9nVHlwZS5jbGVhcik7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInN0YXR1c1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzdGF0dXMoKSB7XG4gICAgICBmb3IgKHZhciBfbGVuNyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjcpLCBfa2V5NyA9IDA7IF9rZXk3IDwgX2xlbjc7IF9rZXk3KyspIHtcbiAgICAgICAgYXJnc1tfa2V5N10gPSBhcmd1bWVudHNbX2tleTddO1xuICAgICAgfVxuICAgICAgdGhpc1tMT0dfU1lNQk9MXShMb2dUeXBlLnN0YXR1cywgYXJncyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdyb3VwXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdyb3VwKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjggPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW44KSwgX2tleTggPSAwOyBfa2V5OCA8IF9sZW44OyBfa2V5OCsrKSB7XG4gICAgICAgIGFyZ3NbX2tleThdID0gYXJndW1lbnRzW19rZXk4XTtcbiAgICAgIH1cbiAgICAgIHRoaXNbTE9HX1NZTUJPTF0oTG9nVHlwZS5ncm91cCwgYXJncyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdyb3VwQ29sbGFwc2VkXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdyb3VwQ29sbGFwc2VkKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjkgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW45KSwgX2tleTkgPSAwOyBfa2V5OSA8IF9sZW45OyBfa2V5OSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleTldID0gYXJndW1lbnRzW19rZXk5XTtcbiAgICAgIH1cbiAgICAgIHRoaXNbTE9HX1NZTUJPTF0oTG9nVHlwZS5ncm91cENvbGxhcHNlZCwgYXJncyk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcImdyb3VwRW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdyb3VwRW5kKCkge1xuICAgICAgZm9yICh2YXIgX2xlbjEwID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IG5ldyBBcnJheShfbGVuMTApLCBfa2V5MTAgPSAwOyBfa2V5MTAgPCBfbGVuMTA7IF9rZXkxMCsrKSB7XG4gICAgICAgIGFyZ3NbX2tleTEwXSA9IGFyZ3VtZW50c1tfa2V5MTBdO1xuICAgICAgfVxuICAgICAgdGhpc1tMT0dfU1lNQk9MXShMb2dUeXBlLmdyb3VwRW5kLCBhcmdzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwicHJvZmlsZVwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBwcm9maWxlKGxhYmVsKSB7XG4gICAgICB0aGlzW0xPR19TWU1CT0xdKExvZ1R5cGUucHJvZmlsZSwgW2xhYmVsXSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInByb2ZpbGVFbmRcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gcHJvZmlsZUVuZChsYWJlbCkge1xuICAgICAgdGhpc1tMT0dfU1lNQk9MXShMb2dUeXBlLnByb2ZpbGVFbmQsIFtsYWJlbF0pO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0aW1lXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRpbWUobGFiZWwpIHtcbiAgICAgIHRoaXNbVElNRVJTX1NZTUJPTF0gPSB0aGlzW1RJTUVSU19TWU1CT0xdIHx8IG5ldyBNYXAoKTtcbiAgICAgIHRoaXNbVElNRVJTX1NZTUJPTF0uc2V0KGxhYmVsLCBwcm9jZXNzLmhydGltZSgpKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidGltZUxvZ1wiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0aW1lTG9nKGxhYmVsKSB7XG4gICAgICB2YXIgcHJldiA9IHRoaXNbVElNRVJTX1NZTUJPTF0gJiYgdGhpc1tUSU1FUlNfU1lNQk9MXS5nZXQobGFiZWwpO1xuICAgICAgaWYgKCFwcmV2KSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN1Y2ggbGFiZWwgJ1wiLmNvbmNhdChsYWJlbCwgXCInIGZvciBXZWJwYWNrTG9nZ2VyLnRpbWVMb2coKVwiKSk7XG4gICAgICB9XG4gICAgICB2YXIgdGltZSA9IHByb2Nlc3MuaHJ0aW1lKHByZXYpO1xuICAgICAgdGhpc1tMT0dfU1lNQk9MXShMb2dUeXBlLnRpbWUsIFtsYWJlbF0uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheSh0aW1lKSkpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogXCJ0aW1lRW5kXCIsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRpbWVFbmQobGFiZWwpIHtcbiAgICAgIHZhciBwcmV2ID0gdGhpc1tUSU1FUlNfU1lNQk9MXSAmJiB0aGlzW1RJTUVSU19TWU1CT0xdLmdldChsYWJlbCk7XG4gICAgICBpZiAoIXByZXYpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VjaCBsYWJlbCAnXCIuY29uY2F0KGxhYmVsLCBcIicgZm9yIFdlYnBhY2tMb2dnZXIudGltZUVuZCgpXCIpKTtcbiAgICAgIH1cbiAgICAgIHZhciB0aW1lID0gcHJvY2Vzcy5ocnRpbWUocHJldik7XG4gICAgICB0aGlzW1RJTUVSU19TWU1CT0xdLmRlbGV0ZShsYWJlbCk7XG4gICAgICB0aGlzW0xPR19TWU1CT0xdKExvZ1R5cGUudGltZSwgW2xhYmVsXS5jb25jYXQoX3RvQ29uc3VtYWJsZUFycmF5KHRpbWUpKSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiBcInRpbWVBZ2dyZWdhdGVcIixcbiAgICB2YWx1ZTogZnVuY3Rpb24gdGltZUFnZ3JlZ2F0ZShsYWJlbCkge1xuICAgICAgdmFyIHByZXYgPSB0aGlzW1RJTUVSU19TWU1CT0xdICYmIHRoaXNbVElNRVJTX1NZTUJPTF0uZ2V0KGxhYmVsKTtcbiAgICAgIGlmICghcHJldikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzdWNoIGxhYmVsICdcIi5jb25jYXQobGFiZWwsIFwiJyBmb3IgV2VicGFja0xvZ2dlci50aW1lQWdncmVnYXRlKClcIikpO1xuICAgICAgfVxuICAgICAgdmFyIHRpbWUgPSBwcm9jZXNzLmhydGltZShwcmV2KTtcbiAgICAgIHRoaXNbVElNRVJTX1NZTUJPTF0uZGVsZXRlKGxhYmVsKTtcbiAgICAgIHRoaXNbVElNRVJTX0FHR1JFR0FURVNfU1lNQk9MXSA9IHRoaXNbVElNRVJTX0FHR1JFR0FURVNfU1lNQk9MXSB8fCBuZXcgTWFwKCk7XG4gICAgICB2YXIgY3VycmVudCA9IHRoaXNbVElNRVJTX0FHR1JFR0FURVNfU1lNQk9MXS5nZXQobGFiZWwpO1xuICAgICAgaWYgKGN1cnJlbnQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICBpZiAodGltZVsxXSArIGN1cnJlbnRbMV0gPiAxZTkpIHtcbiAgICAgICAgICB0aW1lWzBdICs9IGN1cnJlbnRbMF0gKyAxO1xuICAgICAgICAgIHRpbWVbMV0gPSB0aW1lWzFdIC0gMWU5ICsgY3VycmVudFsxXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICB0aW1lWzBdICs9IGN1cnJlbnRbMF07XG4gICAgICAgICAgdGltZVsxXSArPSBjdXJyZW50WzFdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICB0aGlzW1RJTUVSU19BR0dSRUdBVEVTX1NZTUJPTF0uc2V0KGxhYmVsLCB0aW1lKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6IFwidGltZUFnZ3JlZ2F0ZUVuZFwiLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0aW1lQWdncmVnYXRlRW5kKGxhYmVsKSB7XG4gICAgICBpZiAodGhpc1tUSU1FUlNfQUdHUkVHQVRFU19TWU1CT0xdID09PSB1bmRlZmluZWQpIHJldHVybjtcbiAgICAgIHZhciB0aW1lID0gdGhpc1tUSU1FUlNfQUdHUkVHQVRFU19TWU1CT0xdLmdldChsYWJlbCk7XG4gICAgICBpZiAodGltZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgICB0aGlzW1RJTUVSU19BR0dSRUdBVEVTX1NZTUJPTF0uZGVsZXRlKGxhYmVsKTtcbiAgICAgIHRoaXNbTE9HX1NZTUJPTF0oTG9nVHlwZS50aW1lLCBbbGFiZWxdLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkodGltZSkpKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFdlYnBhY2tMb2dnZXI7XG59KCk7XG5leHBvcnRzLkxvZ2dlciA9IFdlYnBhY2tMb2dnZXI7XG5cbi8qKiovIH0pLFxuXG4vKioqLyBcIi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svbGliL2xvZ2dpbmcvY3JlYXRlQ29uc29sZUxvZ2dlci5qc1wiOlxuLyohKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiohKlxcXG4gICEqKiogLi9ub2RlX21vZHVsZXMvd2VicGFjay9saWIvbG9nZ2luZy9jcmVhdGVDb25zb2xlTG9nZ2VyLmpzICoqKiFcbiAgXFwqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKi9cbi8qKiovIChmdW5jdGlvbihtb2R1bGUsIF9fdW51c2VkX3dlYnBhY2tfZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXykge1xuXG4vKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG5cblxuZnVuY3Rpb24gX3RvQ29uc3VtYWJsZUFycmF5KGFycikge1xuICByZXR1cm4gX2FycmF5V2l0aG91dEhvbGVzKGFycikgfHwgX2l0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShhcnIpIHx8IF9ub25JdGVyYWJsZVNwcmVhZCgpO1xufVxuZnVuY3Rpb24gX25vbkl0ZXJhYmxlU3ByZWFkKCkge1xuICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2UuXFxuSW4gb3JkZXIgdG8gYmUgaXRlcmFibGUsIG5vbi1hcnJheSBvYmplY3RzIG11c3QgaGF2ZSBhIFtTeW1ib2wuaXRlcmF0b3JdKCkgbWV0aG9kLlwiKTtcbn1cbmZ1bmN0aW9uIF91bnN1cHBvcnRlZEl0ZXJhYmxlVG9BcnJheShvLCBtaW5MZW4pIHtcbiAgaWYgKCFvKSByZXR1cm47XG4gIGlmICh0eXBlb2YgbyA9PT0gXCJzdHJpbmdcIikgcmV0dXJuIF9hcnJheUxpa2VUb0FycmF5KG8sIG1pbkxlbik7XG4gIHZhciBuID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pLnNsaWNlKDgsIC0xKTtcbiAgaWYgKG4gPT09IFwiT2JqZWN0XCIgJiYgby5jb25zdHJ1Y3RvcikgbiA9IG8uY29uc3RydWN0b3IubmFtZTtcbiAgaWYgKG4gPT09IFwiTWFwXCIgfHwgbiA9PT0gXCJTZXRcIikgcmV0dXJuIEFycmF5LmZyb20obyk7XG4gIGlmIChuID09PSBcIkFyZ3VtZW50c1wiIHx8IC9eKD86VWl8SSludCg/Ojh8MTZ8MzIpKD86Q2xhbXBlZCk/QXJyYXkkLy50ZXN0KG4pKSByZXR1cm4gX2FycmF5TGlrZVRvQXJyYXkobywgbWluTGVuKTtcbn1cbmZ1bmN0aW9uIF9pdGVyYWJsZVRvQXJyYXkoaXRlcikge1xuICBpZiAodHlwZW9mICh0eXBlb2YgU3ltYm9sICE9PSBcInVuZGVmaW5lZFwiID8gU3ltYm9sIDogZnVuY3Rpb24gKGkpIHsgcmV0dXJuIGk7IH0pICE9PSBcInVuZGVmaW5lZFwiICYmIGl0ZXJbKHR5cGVvZiBTeW1ib2wgIT09IFwidW5kZWZpbmVkXCIgPyBTeW1ib2wgOiBmdW5jdGlvbiAoaSkgeyByZXR1cm4gaTsgfSkuaXRlcmF0b3JdICE9IG51bGwgfHwgaXRlcltcIkBAaXRlcmF0b3JcIl0gIT0gbnVsbCkgcmV0dXJuIEFycmF5LmZyb20oaXRlcik7XG59XG5mdW5jdGlvbiBfYXJyYXlXaXRob3V0SG9sZXMoYXJyKSB7XG4gIGlmIChBcnJheS5pc0FycmF5KGFycikpIHJldHVybiBfYXJyYXlMaWtlVG9BcnJheShhcnIpO1xufVxuZnVuY3Rpb24gX2FycmF5TGlrZVRvQXJyYXkoYXJyLCBsZW4pIHtcbiAgaWYgKGxlbiA9PSBudWxsIHx8IGxlbiA+IGFyci5sZW5ndGgpIGxlbiA9IGFyci5sZW5ndGg7XG4gIGZvciAodmFyIGkgPSAwLCBhcnIyID0gbmV3IEFycmF5KGxlbik7IGkgPCBsZW47IGkrKykgYXJyMltpXSA9IGFycltpXTtcbiAgcmV0dXJuIGFycjI7XG59XG52YXIgX3JlcXVpcmUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL0xvZ2dlciAqLyBcIi4vbm9kZV9tb2R1bGVzL3dlYnBhY2svbGliL2xvZ2dpbmcvTG9nZ2VyLmpzXCIpLFxuICBMb2dUeXBlID0gX3JlcXVpcmUuTG9nVHlwZTtcblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi8uLi9kZWNsYXJhdGlvbnMvV2VicGFja09wdGlvbnNcIikuRmlsdGVySXRlbVR5cGVzfSBGaWx0ZXJJdGVtVHlwZXMgKi9cbi8qKiBAdHlwZWRlZiB7aW1wb3J0KFwiLi4vLi4vZGVjbGFyYXRpb25zL1dlYnBhY2tPcHRpb25zXCIpLkZpbHRlclR5cGVzfSBGaWx0ZXJUeXBlcyAqL1xuLyoqIEB0eXBlZGVmIHtpbXBvcnQoXCIuL0xvZ2dlclwiKS5Mb2dUeXBlRW51bX0gTG9nVHlwZUVudW0gKi9cblxuLyoqIEB0eXBlZGVmIHtmdW5jdGlvbihzdHJpbmcpOiBib29sZWFufSBGaWx0ZXJGdW5jdGlvbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IExvZ2dlckNvbnNvbGVcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oKTogdm9pZH0gY2xlYXJcbiAqIEBwcm9wZXJ0eSB7ZnVuY3Rpb24oKTogdm9pZH0gdHJhY2VcbiAqIEBwcm9wZXJ0eSB7KC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkfSBpbmZvXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZH0gbG9nXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZH0gd2FyblxuICogQHByb3BlcnR5IHsoLi4uYXJnczogYW55W10pID0+IHZvaWR9IGVycm9yXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD19IGRlYnVnXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD19IGdyb3VwXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD19IGdyb3VwQ29sbGFwc2VkXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD19IGdyb3VwRW5kXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD19IHN0YXR1c1xuICogQHByb3BlcnR5IHsoLi4uYXJnczogYW55W10pID0+IHZvaWQ9fSBwcm9maWxlXG4gKiBAcHJvcGVydHkgeyguLi5hcmdzOiBhbnlbXSkgPT4gdm9pZD19IHByb2ZpbGVFbmRcbiAqIEBwcm9wZXJ0eSB7KC4uLmFyZ3M6IGFueVtdKSA9PiB2b2lkPX0gbG9nVGltZVxuICovXG5cbi8qKlxuICogQHR5cGVkZWYge09iamVjdH0gTG9nZ2VyT3B0aW9uc1xuICogQHByb3BlcnR5IHtmYWxzZXx0cnVlfFwibm9uZVwifFwiZXJyb3JcInxcIndhcm5cInxcImluZm9cInxcImxvZ1wifFwidmVyYm9zZVwifSBsZXZlbCBsb2dsZXZlbFxuICogQHByb3BlcnR5IHtGaWx0ZXJUeXBlc3xib29sZWFufSBkZWJ1ZyBmaWx0ZXIgZm9yIGRlYnVnIGxvZ2dpbmdcbiAqIEBwcm9wZXJ0eSB7TG9nZ2VyQ29uc29sZX0gY29uc29sZSB0aGUgY29uc29sZSB0byBsb2cgdG9cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7RmlsdGVySXRlbVR5cGVzfSBpdGVtIGFuIGlucHV0IGl0ZW1cbiAqIEByZXR1cm5zIHtGaWx0ZXJGdW5jdGlvbn0gZmlsdGVyIGZ1bmN0aW9uXG4gKi9cbnZhciBmaWx0ZXJUb0Z1bmN0aW9uID0gZnVuY3Rpb24gZmlsdGVyVG9GdW5jdGlvbihpdGVtKSB7XG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJzdHJpbmdcIikge1xuICAgIHZhciByZWdFeHAgPSBuZXcgUmVnRXhwKFwiW1xcXFxcXFxcL11cIi5jb25jYXQoaXRlbS5yZXBsYWNlKFxuICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11c2VsZXNzLWVzY2FwZVxuICAgIC9bLVtcXF17fSgpKis/LlxcXFxeJHxdL2csIFwiXFxcXCQmXCIpLCBcIihbXFxcXFxcXFwvXXwkfCF8XFxcXD8pXCIpKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKGlkZW50KSB7XG4gICAgICByZXR1cm4gcmVnRXhwLnRlc3QoaWRlbnQpO1xuICAgIH07XG4gIH1cbiAgaWYgKGl0ZW0gJiYgdHlwZW9mIGl0ZW0gPT09IFwib2JqZWN0XCIgJiYgdHlwZW9mIGl0ZW0udGVzdCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChpZGVudCkge1xuICAgICAgcmV0dXJuIGl0ZW0udGVzdChpZGVudCk7XG4gICAgfTtcbiAgfVxuICBpZiAodHlwZW9mIGl0ZW0gPT09IFwiZnVuY3Rpb25cIikge1xuICAgIHJldHVybiBpdGVtO1xuICB9XG4gIGlmICh0eXBlb2YgaXRlbSA9PT0gXCJib29sZWFuXCIpIHtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIGl0ZW07XG4gICAgfTtcbiAgfVxufTtcblxuLyoqXG4gKiBAZW51bSB7bnVtYmVyfVxuICovXG52YXIgTG9nTGV2ZWwgPSB7XG4gIG5vbmU6IDYsXG4gIGZhbHNlOiA2LFxuICBlcnJvcjogNSxcbiAgd2FybjogNCxcbiAgaW5mbzogMyxcbiAgbG9nOiAyLFxuICB0cnVlOiAyLFxuICB2ZXJib3NlOiAxXG59O1xuXG4vKipcbiAqIEBwYXJhbSB7TG9nZ2VyT3B0aW9uc30gb3B0aW9ucyBvcHRpb25zIG9iamVjdFxuICogQHJldHVybnMge2Z1bmN0aW9uKHN0cmluZywgTG9nVHlwZUVudW0sIGFueVtdKTogdm9pZH0gbG9nZ2luZyBmdW5jdGlvblxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChfcmVmKSB7XG4gIHZhciBfcmVmJGxldmVsID0gX3JlZi5sZXZlbCxcbiAgICBsZXZlbCA9IF9yZWYkbGV2ZWwgPT09IHZvaWQgMCA/IFwiaW5mb1wiIDogX3JlZiRsZXZlbCxcbiAgICBfcmVmJGRlYnVnID0gX3JlZi5kZWJ1ZyxcbiAgICBkZWJ1ZyA9IF9yZWYkZGVidWcgPT09IHZvaWQgMCA/IGZhbHNlIDogX3JlZiRkZWJ1ZyxcbiAgICBjb25zb2xlID0gX3JlZi5jb25zb2xlO1xuICB2YXIgZGVidWdGaWx0ZXJzID0gdHlwZW9mIGRlYnVnID09PSBcImJvb2xlYW5cIiA/IFtmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIGRlYnVnO1xuICB9XSA6IC8qKiBAdHlwZSB7RmlsdGVySXRlbVR5cGVzW119ICovW10uY29uY2F0KGRlYnVnKS5tYXAoZmlsdGVyVG9GdW5jdGlvbik7XG4gIC8qKiBAdHlwZSB7bnVtYmVyfSAqL1xuICB2YXIgbG9nbGV2ZWwgPSBMb2dMZXZlbFtcIlwiLmNvbmNhdChsZXZlbCldIHx8IDA7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWUgb2YgdGhlIGxvZ2dlclxuICAgKiBAcGFyYW0ge0xvZ1R5cGVFbnVtfSB0eXBlIHR5cGUgb2YgdGhlIGxvZyBlbnRyeVxuICAgKiBAcGFyYW0ge2FueVtdfSBhcmdzIGFyZ3VtZW50cyBvZiB0aGUgbG9nIGVudHJ5XG4gICAqIEByZXR1cm5zIHt2b2lkfVxuICAgKi9cbiAgdmFyIGxvZ2dlciA9IGZ1bmN0aW9uIGxvZ2dlcihuYW1lLCB0eXBlLCBhcmdzKSB7XG4gICAgdmFyIGxhYmVsZWRBcmdzID0gZnVuY3Rpb24gbGFiZWxlZEFyZ3MoKSB7XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShhcmdzKSkge1xuICAgICAgICBpZiAoYXJncy5sZW5ndGggPiAwICYmIHR5cGVvZiBhcmdzWzBdID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgICAgcmV0dXJuIFtcIltcIi5jb25jYXQobmFtZSwgXCJdIFwiKS5jb25jYXQoYXJnc1swXSldLmNvbmNhdChfdG9Db25zdW1hYmxlQXJyYXkoYXJncy5zbGljZSgxKSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBbXCJbXCIuY29uY2F0KG5hbWUsIFwiXVwiKV0uY29uY2F0KF90b0NvbnN1bWFibGVBcnJheShhcmdzKSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBbXTtcbiAgICAgIH1cbiAgICB9O1xuICAgIHZhciBkZWJ1ZyA9IGRlYnVnRmlsdGVycy5zb21lKGZ1bmN0aW9uIChmKSB7XG4gICAgICByZXR1cm4gZihuYW1lKTtcbiAgICB9KTtcbiAgICBzd2l0Y2ggKHR5cGUpIHtcbiAgICAgIGNhc2UgTG9nVHlwZS5kZWJ1ZzpcbiAgICAgICAgaWYgKCFkZWJ1ZykgcmV0dXJuO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZS5kZWJ1ZyA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGluc1xuICAgICAgICAgIGNvbnNvbGUuZGVidWcuYXBwbHkoY29uc29sZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxhYmVsZWRBcmdzKCkpKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBfdG9Db25zdW1hYmxlQXJyYXkobGFiZWxlZEFyZ3MoKSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMb2dUeXBlLmxvZzpcbiAgICAgICAgaWYgKCFkZWJ1ZyAmJiBsb2dsZXZlbCA+IExvZ0xldmVsLmxvZykgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBfdG9Db25zdW1hYmxlQXJyYXkobGFiZWxlZEFyZ3MoKSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nVHlwZS5pbmZvOlxuICAgICAgICBpZiAoIWRlYnVnICYmIGxvZ2xldmVsID4gTG9nTGV2ZWwuaW5mbykgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLmluZm8uYXBwbHkoY29uc29sZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxhYmVsZWRBcmdzKCkpKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIExvZ1R5cGUud2FybjpcbiAgICAgICAgaWYgKCFkZWJ1ZyAmJiBsb2dsZXZlbCA+IExvZ0xldmVsLndhcm4pIHJldHVybjtcbiAgICAgICAgY29uc29sZS53YXJuLmFwcGx5KGNvbnNvbGUsIF90b0NvbnN1bWFibGVBcnJheShsYWJlbGVkQXJncygpKSk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMb2dUeXBlLmVycm9yOlxuICAgICAgICBpZiAoIWRlYnVnICYmIGxvZ2xldmVsID4gTG9nTGV2ZWwuZXJyb3IpIHJldHVybjtcbiAgICAgICAgY29uc29sZS5lcnJvci5hcHBseShjb25zb2xlLCBfdG9Db25zdW1hYmxlQXJyYXkobGFiZWxlZEFyZ3MoKSkpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nVHlwZS50cmFjZTpcbiAgICAgICAgaWYgKCFkZWJ1ZykgcmV0dXJuO1xuICAgICAgICBjb25zb2xlLnRyYWNlKCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMb2dUeXBlLmdyb3VwQ29sbGFwc2VkOlxuICAgICAgICBpZiAoIWRlYnVnICYmIGxvZ2xldmVsID4gTG9nTGV2ZWwubG9nKSByZXR1cm47XG4gICAgICAgIGlmICghZGVidWcgJiYgbG9nbGV2ZWwgPiBMb2dMZXZlbC52ZXJib3NlKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGluc1xuICAgICAgICAgIGlmICh0eXBlb2YgY29uc29sZS5ncm91cENvbGxhcHNlZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zXG4gICAgICAgICAgICBjb25zb2xlLmdyb3VwQ29sbGFwc2VkLmFwcGx5KGNvbnNvbGUsIF90b0NvbnN1bWFibGVBcnJheShsYWJlbGVkQXJncygpKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIF90b0NvbnN1bWFibGVBcnJheShsYWJlbGVkQXJncygpKSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAvLyBmYWxscyB0aHJvdWdoXG4gICAgICBjYXNlIExvZ1R5cGUuZ3JvdXA6XG4gICAgICAgIGlmICghZGVidWcgJiYgbG9nbGV2ZWwgPiBMb2dMZXZlbC5sb2cpIHJldHVybjtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGluc1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUuZ3JvdXAgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnNcbiAgICAgICAgICBjb25zb2xlLmdyb3VwLmFwcGx5KGNvbnNvbGUsIF90b0NvbnN1bWFibGVBcnJheShsYWJlbGVkQXJncygpKSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY29uc29sZS5sb2cuYXBwbHkoY29uc29sZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxhYmVsZWRBcmdzKCkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nVHlwZS5ncm91cEVuZDpcbiAgICAgICAgaWYgKCFkZWJ1ZyAmJiBsb2dsZXZlbCA+IExvZ0xldmVsLmxvZykgcmV0dXJuO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZS5ncm91cEVuZCA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGluc1xuICAgICAgICAgIGNvbnNvbGUuZ3JvdXBFbmQoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nVHlwZS50aW1lOlxuICAgICAgICB7XG4gICAgICAgICAgaWYgKCFkZWJ1ZyAmJiBsb2dsZXZlbCA+IExvZ0xldmVsLmxvZykgcmV0dXJuO1xuICAgICAgICAgIHZhciBtcyA9IGFyZ3NbMV0gKiAxMDAwICsgYXJnc1syXSAvIDEwMDAwMDA7XG4gICAgICAgICAgdmFyIG1zZyA9IFwiW1wiLmNvbmNhdChuYW1lLCBcIl0gXCIpLmNvbmNhdChhcmdzWzBdLCBcIjogXCIpLmNvbmNhdChtcywgXCIgbXNcIik7XG4gICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLmxvZ1RpbWUgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgICAgY29uc29sZS5sb2dUaW1lKG1zZyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKG1zZyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICBjYXNlIExvZ1R5cGUucHJvZmlsZTpcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGluc1xuICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUucHJvZmlsZSA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGluc1xuICAgICAgICAgIGNvbnNvbGUucHJvZmlsZS5hcHBseShjb25zb2xlLCBfdG9Db25zdW1hYmxlQXJyYXkobGFiZWxlZEFyZ3MoKSkpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBMb2dUeXBlLnByb2ZpbGVFbmQ6XG4gICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnNcbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnByb2ZpbGVFbmQgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBub2RlL25vLXVuc3VwcG9ydGVkLWZlYXR1cmVzL25vZGUtYnVpbHRpbnNcbiAgICAgICAgICBjb25zb2xlLnByb2ZpbGVFbmQuYXBwbHkoY29uc29sZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxhYmVsZWRBcmdzKCkpKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nVHlwZS5jbGVhcjpcbiAgICAgICAgaWYgKCFkZWJ1ZyAmJiBsb2dsZXZlbCA+IExvZ0xldmVsLmxvZykgcmV0dXJuO1xuICAgICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm9kZS9uby11bnN1cHBvcnRlZC1mZWF0dXJlcy9ub2RlLWJ1aWx0aW5zXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZS5jbGVhciA9PT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vZGUvbm8tdW5zdXBwb3J0ZWQtZmVhdHVyZXMvbm9kZS1idWlsdGluc1xuICAgICAgICAgIGNvbnNvbGUuY2xlYXIoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgTG9nVHlwZS5zdGF0dXM6XG4gICAgICAgIGlmICghZGVidWcgJiYgbG9nbGV2ZWwgPiBMb2dMZXZlbC5pbmZvKSByZXR1cm47XG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZS5zdGF0dXMgPT09IFwiZnVuY3Rpb25cIikge1xuICAgICAgICAgIGlmIChhcmdzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgY29uc29sZS5zdGF0dXMoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5zdGF0dXMuYXBwbHkoY29uc29sZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxhYmVsZWRBcmdzKCkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgaWYgKGFyZ3MubGVuZ3RoICE9PSAwKSB7XG4gICAgICAgICAgICBjb25zb2xlLmluZm8uYXBwbHkoY29uc29sZSwgX3RvQ29uc3VtYWJsZUFycmF5KGxhYmVsZWRBcmdzKCkpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJVbmV4cGVjdGVkIExvZ1R5cGUgXCIuY29uY2F0KHR5cGUpKTtcbiAgICB9XG4gIH07XG4gIHJldHVybiBsb2dnZXI7XG59O1xuXG4vKioqLyB9KSxcblxuLyoqKi8gXCIuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2xpYi9sb2dnaW5nL3J1bnRpbWUuanNcIjpcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vbm9kZV9tb2R1bGVzL3dlYnBhY2svbGliL2xvZ2dpbmcvcnVudGltZS5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqLyAoZnVuY3Rpb24oX191bnVzZWRfd2VicGFja19tb2R1bGUsIGV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pIHtcblxuLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cblxuXG5cbmZ1bmN0aW9uIF9leHRlbmRzKCkge1xuICBfZXh0ZW5kcyA9IE9iamVjdC5hc3NpZ24gPyBPYmplY3QuYXNzaWduLmJpbmQoKSA6IGZ1bmN0aW9uICh0YXJnZXQpIHtcbiAgICBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIHNvdXJjZSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgIGZvciAodmFyIGtleSBpbiBzb3VyY2UpIHtcbiAgICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChzb3VyY2UsIGtleSkpIHtcbiAgICAgICAgICB0YXJnZXRba2V5XSA9IHNvdXJjZVtrZXldO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0YXJnZXQ7XG4gIH07XG4gIHJldHVybiBfZXh0ZW5kcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xufVxudmFyIFN5bmNCYWlsSG9vayA9IF9fd2VicGFja19yZXF1aXJlX18oLyohIHRhcGFibGUvbGliL1N5bmNCYWlsSG9vayAqLyBcIi4vY2xpZW50LXNyYy9tb2R1bGVzL2xvZ2dlci9TeW5jQmFpbEhvb2tGYWtlLmpzXCIpO1xudmFyIF9yZXF1aXJlID0gX193ZWJwYWNrX3JlcXVpcmVfXygvKiEgLi9Mb2dnZXIgKi8gXCIuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2xpYi9sb2dnaW5nL0xvZ2dlci5qc1wiKSxcbiAgTG9nZ2VyID0gX3JlcXVpcmUuTG9nZ2VyO1xudmFyIGNyZWF0ZUNvbnNvbGVMb2dnZXIgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISAuL2NyZWF0ZUNvbnNvbGVMb2dnZXIgKi8gXCIuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2xpYi9sb2dnaW5nL2NyZWF0ZUNvbnNvbGVMb2dnZXIuanNcIik7XG5cbi8qKiBAdHlwZSB7Y3JlYXRlQ29uc29sZUxvZ2dlci5Mb2dnZXJPcHRpb25zfSAqL1xudmFyIGN1cnJlbnREZWZhdWx0TG9nZ2VyT3B0aW9ucyA9IHtcbiAgbGV2ZWw6IFwiaW5mb1wiLFxuICBkZWJ1ZzogZmFsc2UsXG4gIGNvbnNvbGU6IGNvbnNvbGVcbn07XG52YXIgY3VycmVudERlZmF1bHRMb2dnZXIgPSBjcmVhdGVDb25zb2xlTG9nZ2VyKGN1cnJlbnREZWZhdWx0TG9nZ2VyT3B0aW9ucyk7XG5cbi8qKlxuICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgbmFtZSBvZiB0aGUgbG9nZ2VyXG4gKiBAcmV0dXJucyB7TG9nZ2VyfSBhIGxvZ2dlclxuICovXG5leHBvcnRzLmdldExvZ2dlciA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gIHJldHVybiBuZXcgTG9nZ2VyKGZ1bmN0aW9uICh0eXBlLCBhcmdzKSB7XG4gICAgaWYgKGV4cG9ydHMuaG9va3MubG9nLmNhbGwobmFtZSwgdHlwZSwgYXJncykgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY3VycmVudERlZmF1bHRMb2dnZXIobmFtZSwgdHlwZSwgYXJncyk7XG4gICAgfVxuICB9LCBmdW5jdGlvbiAoY2hpbGROYW1lKSB7XG4gICAgcmV0dXJuIGV4cG9ydHMuZ2V0TG9nZ2VyKFwiXCIuY29uY2F0KG5hbWUsIFwiL1wiKS5jb25jYXQoY2hpbGROYW1lKSk7XG4gIH0pO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge2NyZWF0ZUNvbnNvbGVMb2dnZXIuTG9nZ2VyT3B0aW9uc30gb3B0aW9ucyBuZXcgb3B0aW9ucywgbWVyZ2Ugd2l0aCBvbGQgb3B0aW9uc1xuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmV4cG9ydHMuY29uZmlndXJlRGVmYXVsdExvZ2dlciA9IGZ1bmN0aW9uIChvcHRpb25zKSB7XG4gIF9leHRlbmRzKGN1cnJlbnREZWZhdWx0TG9nZ2VyT3B0aW9ucywgb3B0aW9ucyk7XG4gIGN1cnJlbnREZWZhdWx0TG9nZ2VyID0gY3JlYXRlQ29uc29sZUxvZ2dlcihjdXJyZW50RGVmYXVsdExvZ2dlck9wdGlvbnMpO1xufTtcbmV4cG9ydHMuaG9va3MgPSB7XG4gIGxvZzogbmV3IFN5bmNCYWlsSG9vayhbXCJvcmlnaW5cIiwgXCJ0eXBlXCIsIFwiYXJnc1wiXSlcbn07XG5cbi8qKiovIH0pXG5cbi8qKioqKiovIFx0fSk7XG4vKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqL1xuLyoqKioqKi8gXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4vKioqKioqLyBcdHZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4vKioqKioqLyBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcbi8qKioqKiovIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbi8qKioqKiovIFx0XHR2YXIgY2FjaGVkTW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXTtcbi8qKioqKiovIFx0XHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcbi8qKioqKiovIFx0XHRcdHJldHVybiBjYWNoZWRNb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0XHR9XG4vKioqKioqLyBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbi8qKioqKiovIFx0XHR2YXIgbW9kdWxlID0gX193ZWJwYWNrX21vZHVsZV9jYWNoZV9fW21vZHVsZUlkXSA9IHtcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5pZCBuZWVkZWRcbi8qKioqKiovIFx0XHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG4vKioqKioqLyBcdFx0XHRleHBvcnRzOiB7fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdFxuLyoqKioqKi8gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuLyoqKioqKi8gXHRcdF9fd2VicGFja19tb2R1bGVzX19bbW9kdWxlSWRdKG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuLyoqKioqKi8gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbi8qKioqKiovIFx0fVxuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9kZWZpbmUgcHJvcGVydHkgZ2V0dGVycyAqL1xuLyoqKioqKi8gXHQhZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbnMgZm9yIGhhcm1vbnkgZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdGZvcih2YXIga2V5IGluIGRlZmluaXRpb24pIHtcbi8qKioqKiovIFx0XHRcdFx0aWYoX193ZWJwYWNrX3JlcXVpcmVfXy5vKGRlZmluaXRpb24sIGtleSkgJiYgIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBrZXkpKSB7XG4vKioqKioqLyBcdFx0XHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIGtleSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGRlZmluaXRpb25ba2V5XSB9KTtcbi8qKioqKiovIFx0XHRcdFx0fVxuLyoqKioqKi8gXHRcdFx0fVxuLyoqKioqKi8gXHRcdH07XG4vKioqKioqLyBcdH0oKTtcbi8qKioqKiovIFx0XG4vKioqKioqLyBcdC8qIHdlYnBhY2svcnVudGltZS9oYXNPd25Qcm9wZXJ0eSBzaG9ydGhhbmQgKi9cbi8qKioqKiovIFx0IWZ1bmN0aW9uKCkge1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iaiwgcHJvcCkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCk7IH1cbi8qKioqKiovIFx0fSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKiovIFx0Lyogd2VicGFjay9ydW50aW1lL21ha2UgbmFtZXNwYWNlIG9iamVjdCAqL1xuLyoqKioqKi8gXHQhZnVuY3Rpb24oKSB7XG4vKioqKioqLyBcdFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuLyoqKioqKi8gXHRcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbi8qKioqKiovIFx0XHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuLyoqKioqKi8gXHRcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbi8qKioqKiovIFx0XHRcdH1cbi8qKioqKiovIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4vKioqKioqLyBcdFx0fTtcbi8qKioqKiovIFx0fSgpO1xuLyoqKioqKi8gXHRcbi8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG52YXIgX193ZWJwYWNrX2V4cG9ydHNfXyA9IHt9O1xuLy8gVGhpcyBlbnRyeSBuZWVkIHRvIGJlIHdyYXBwZWQgaW4gYW4gSUlGRSBiZWNhdXNlIGl0IG5lZWQgdG8gYmUgaXNvbGF0ZWQgYWdhaW5zdCBvdGhlciBtb2R1bGVzIGluIHRoZSBjaHVuay5cbiFmdW5jdGlvbigpIHtcbi8qISoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqISpcXFxuICAhKioqIC4vY2xpZW50LXNyYy9tb2R1bGVzL2xvZ2dlci9pbmRleC5qcyAqKiohXG4gIFxcKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKiovXG5fX3dlYnBhY2tfcmVxdWlyZV9fLnIoX193ZWJwYWNrX2V4cG9ydHNfXyk7XG4vKiBoYXJtb255IGV4cG9ydCAqLyBfX3dlYnBhY2tfcmVxdWlyZV9fLmQoX193ZWJwYWNrX2V4cG9ydHNfXywge1xuLyogaGFybW9ueSBleHBvcnQgKi8gICBcImRlZmF1bHRcIjogZnVuY3Rpb24oKSB7IHJldHVybiAvKiByZWV4cG9ydCBkZWZhdWx0IGV4cG9ydCBmcm9tIG5hbWVkIG1vZHVsZSAqLyB3ZWJwYWNrX2xpYl9sb2dnaW5nX3J1bnRpbWVfanNfX1dFQlBBQ0tfSU1QT1JURURfTU9EVUxFXzBfXzsgfVxuLyogaGFybW9ueSBleHBvcnQgKi8gfSk7XG4vKiBoYXJtb255IGltcG9ydCAqLyB2YXIgd2VicGFja19saWJfbG9nZ2luZ19ydW50aW1lX2pzX19XRUJQQUNLX0lNUE9SVEVEX01PRFVMRV8wX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKC8qISB3ZWJwYWNrL2xpYi9sb2dnaW5nL3J1bnRpbWUuanMgKi8gXCIuL25vZGVfbW9kdWxlcy93ZWJwYWNrL2xpYi9sb2dnaW5nL3J1bnRpbWUuanNcIik7XG5cbn0oKTtcbnZhciBfX3dlYnBhY2tfZXhwb3J0X3RhcmdldF9fID0gZXhwb3J0cztcbmZvcih2YXIgaSBpbiBfX3dlYnBhY2tfZXhwb3J0c19fKSBfX3dlYnBhY2tfZXhwb3J0X3RhcmdldF9fW2ldID0gX193ZWJwYWNrX2V4cG9ydHNfX1tpXTtcbmlmKF9fd2VicGFja19leHBvcnRzX18uX19lc01vZHVsZSkgT2JqZWN0LmRlZmluZVByb3BlcnR5KF9fd2VicGFja19leHBvcnRfdGFyZ2V0X18sIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xuLyoqKioqKi8gfSkoKVxuOyIsImZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBlbnVtZXJhYmxlT25seSAmJiAoc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pKSwga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gbnVsbCAhPSBhcmd1bWVudHNbaV0gPyBhcmd1bWVudHNbaV0gOiB7fTsgaSAlIDIgPyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCAhMCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSA6IG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gcmV0dXJuIHRhcmdldDsgfVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBrZXkgPSBfdG9Qcm9wZXJ0eUtleShrZXkpOyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KGFyZykgeyB2YXIga2V5ID0gX3RvUHJpbWl0aXZlKGFyZywgXCJzdHJpbmdcIik7IHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7IH1cbmZ1bmN0aW9uIF90b1ByaW1pdGl2ZShpbnB1dCwgaGludCkgeyBpZiAodHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKHR5cGVvZiByZXMgIT09IFwib2JqZWN0XCIpIHJldHVybiByZXM7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTsgfSByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTsgfVxuLy8gVGhlIGVycm9yIG92ZXJsYXkgaXMgaW5zcGlyZWQgKGFuZCBtb3N0bHkgY29waWVkKSBmcm9tIENyZWF0ZSBSZWFjdCBBcHAgKGh0dHBzOi8vZ2l0aHViLmNvbS9mYWNlYm9va2luY3ViYXRvci9jcmVhdGUtcmVhY3QtYXBwKVxuLy8gVGhleSwgaW4gdHVybiwgZ290IGluc3BpcmVkIGJ5IHdlYnBhY2staG90LW1pZGRsZXdhcmUgKGh0dHBzOi8vZ2l0aHViLmNvbS9nbGVuamFtaW4vd2VicGFjay1ob3QtbWlkZGxld2FyZSkuXG5cbmltcG9ydCBhbnNpSFRNTCBmcm9tIFwiYW5zaS1odG1sLWNvbW11bml0eVwiO1xuaW1wb3J0IHsgZW5jb2RlIH0gZnJvbSBcImh0bWwtZW50aXRpZXNcIjtcbmltcG9ydCB7IGxpc3RlblRvUnVudGltZUVycm9yLCBsaXN0ZW5Ub1VuaGFuZGxlZFJlamVjdGlvbiwgcGFyc2VFcnJvclRvU3RhY2tzIH0gZnJvbSBcIi4vb3ZlcmxheS9ydW50aW1lLWVycm9yLmpzXCI7XG5pbXBvcnQgY3JlYXRlT3ZlcmxheU1hY2hpbmUgZnJvbSBcIi4vb3ZlcmxheS9zdGF0ZS1tYWNoaW5lLmpzXCI7XG5pbXBvcnQgeyBjb250YWluZXJTdHlsZSwgZGlzbWlzc0J1dHRvblN0eWxlLCBoZWFkZXJTdHlsZSwgaWZyYW1lU3R5bGUsIG1zZ1N0eWxlcywgbXNnVGV4dFN0eWxlLCBtc2dUeXBlU3R5bGUgfSBmcm9tIFwiLi9vdmVybGF5L3N0eWxlcy5qc1wiO1xudmFyIGNvbG9ycyA9IHtcbiAgcmVzZXQ6IFtcInRyYW5zcGFyZW50XCIsIFwidHJhbnNwYXJlbnRcIl0sXG4gIGJsYWNrOiBcIjE4MTgxOFwiLFxuICByZWQ6IFwiRTM2MDQ5XCIsXG4gIGdyZWVuOiBcIkIzQ0I3NFwiLFxuICB5ZWxsb3c6IFwiRkZEMDgwXCIsXG4gIGJsdWU6IFwiN0NBRkMyXCIsXG4gIG1hZ2VudGE6IFwiN0ZBQ0NBXCIsXG4gIGN5YW46IFwiQzNDMkVGXCIsXG4gIGxpZ2h0Z3JleTogXCJFQkU3RTNcIixcbiAgZGFya2dyZXk6IFwiNkQ3ODkxXCJcbn07XG5hbnNpSFRNTC5zZXRDb2xvcnMoY29sb3JzKTtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gdHlwZVxuICogQHBhcmFtIHtzdHJpbmcgIHwgeyBmaWxlPzogc3RyaW5nLCBtb2R1bGVOYW1lPzogc3RyaW5nLCBsb2M/OiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmc7IHN0YWNrPzogc3RyaW5nW10gfX0gaXRlbVxuICogQHJldHVybnMge3sgaGVhZGVyOiBzdHJpbmcsIGJvZHk6IHN0cmluZyB9fVxuICovXG5mdW5jdGlvbiBmb3JtYXRQcm9ibGVtKHR5cGUsIGl0ZW0pIHtcbiAgdmFyIGhlYWRlciA9IHR5cGUgPT09IFwid2FybmluZ1wiID8gXCJXQVJOSU5HXCIgOiBcIkVSUk9SXCI7XG4gIHZhciBib2R5ID0gXCJcIjtcbiAgaWYgKHR5cGVvZiBpdGVtID09PSBcInN0cmluZ1wiKSB7XG4gICAgYm9keSArPSBpdGVtO1xuICB9IGVsc2Uge1xuICAgIHZhciBmaWxlID0gaXRlbS5maWxlIHx8IFwiXCI7XG4gICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLW5lc3RlZC10ZXJuYXJ5XG4gICAgdmFyIG1vZHVsZU5hbWUgPSBpdGVtLm1vZHVsZU5hbWUgPyBpdGVtLm1vZHVsZU5hbWUuaW5kZXhPZihcIiFcIikgIT09IC0xID8gXCJcIi5jb25jYXQoaXRlbS5tb2R1bGVOYW1lLnJlcGxhY2UoL14oXFxzfFxcUykqIS8sIFwiXCIpLCBcIiAoXCIpLmNvbmNhdChpdGVtLm1vZHVsZU5hbWUsIFwiKVwiKSA6IFwiXCIuY29uY2F0KGl0ZW0ubW9kdWxlTmFtZSkgOiBcIlwiO1xuICAgIHZhciBsb2MgPSBpdGVtLmxvYztcbiAgICBoZWFkZXIgKz0gXCJcIi5jb25jYXQobW9kdWxlTmFtZSB8fCBmaWxlID8gXCIgaW4gXCIuY29uY2F0KG1vZHVsZU5hbWUgPyBcIlwiLmNvbmNhdChtb2R1bGVOYW1lKS5jb25jYXQoZmlsZSA/IFwiIChcIi5jb25jYXQoZmlsZSwgXCIpXCIpIDogXCJcIikgOiBmaWxlKS5jb25jYXQobG9jID8gXCIgXCIuY29uY2F0KGxvYykgOiBcIlwiKSA6IFwiXCIpO1xuICAgIGJvZHkgKz0gaXRlbS5tZXNzYWdlIHx8IFwiXCI7XG4gIH1cbiAgaWYgKEFycmF5LmlzQXJyYXkoaXRlbS5zdGFjaykpIHtcbiAgICBpdGVtLnN0YWNrLmZvckVhY2goZnVuY3Rpb24gKHN0YWNrKSB7XG4gICAgICBpZiAodHlwZW9mIHN0YWNrID09PSBcInN0cmluZ1wiKSB7XG4gICAgICAgIGJvZHkgKz0gXCJcXHJcXG5cIi5jb25jYXQoc3RhY2spO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG4gIHJldHVybiB7XG4gICAgaGVhZGVyOiBoZWFkZXIsXG4gICAgYm9keTogYm9keVxuICB9O1xufVxuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IENyZWF0ZU92ZXJsYXlPcHRpb25zXG4gKiBAcHJvcGVydHkge3N0cmluZyB8IG51bGx9IHRydXN0ZWRUeXBlc1BvbGljeU5hbWVcbiAqIEBwcm9wZXJ0eSB7Ym9vbGVhbiB8IChlcnJvcjogRXJyb3IpID0+IHZvaWR9IFtjYXRjaFJ1bnRpbWVFcnJvcl1cbiAqL1xuXG4vKipcbiAqXG4gKiBAcGFyYW0ge0NyZWF0ZU92ZXJsYXlPcHRpb25zfSBvcHRpb25zXG4gKi9cbnZhciBjcmVhdGVPdmVybGF5ID0gZnVuY3Rpb24gY3JlYXRlT3ZlcmxheShvcHRpb25zKSB7XG4gIC8qKiBAdHlwZSB7SFRNTElGcmFtZUVsZW1lbnQgfCBudWxsIHwgdW5kZWZpbmVkfSAqL1xuICB2YXIgaWZyYW1lQ29udGFpbmVyRWxlbWVudDtcbiAgLyoqIEB0eXBlIHtIVE1MRGl2RWxlbWVudCB8IG51bGwgfCB1bmRlZmluZWR9ICovXG4gIHZhciBjb250YWluZXJFbGVtZW50O1xuICAvKiogQHR5cGUge0hUTUxEaXZFbGVtZW50IHwgbnVsbCB8IHVuZGVmaW5lZH0gKi9cbiAgdmFyIGhlYWRlckVsZW1lbnQ7XG4gIC8qKiBAdHlwZSB7QXJyYXk8KGVsZW1lbnQ6IEhUTUxEaXZFbGVtZW50KSA9PiB2b2lkPn0gKi9cbiAgdmFyIG9uTG9hZFF1ZXVlID0gW107XG4gIC8qKiBAdHlwZSB7VHJ1c3RlZFR5cGVQb2xpY3kgfCB1bmRlZmluZWR9ICovXG4gIHZhciBvdmVybGF5VHJ1c3RlZFR5cGVzUG9saWN5O1xuXG4gIC8qKlxuICAgKlxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gICAqIEBwYXJhbSB7Q1NTU3R5bGVEZWNsYXJhdGlvbn0gc3R5bGVcbiAgICovXG4gIGZ1bmN0aW9uIGFwcGx5U3R5bGUoZWxlbWVudCwgc3R5bGUpIHtcbiAgICBPYmplY3Qua2V5cyhzdHlsZSkuZm9yRWFjaChmdW5jdGlvbiAocHJvcCkge1xuICAgICAgZWxlbWVudC5zdHlsZVtwcm9wXSA9IHN0eWxlW3Byb3BdO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbH0gdHJ1c3RlZFR5cGVzUG9saWN5TmFtZVxuICAgKi9cbiAgZnVuY3Rpb24gY3JlYXRlQ29udGFpbmVyKHRydXN0ZWRUeXBlc1BvbGljeU5hbWUpIHtcbiAgICAvLyBFbmFibGUgVHJ1c3RlZCBUeXBlcyBpZiB0aGV5IGFyZSBhdmFpbGFibGUgaW4gdGhlIGN1cnJlbnQgYnJvd3Nlci5cbiAgICBpZiAod2luZG93LnRydXN0ZWRUeXBlcykge1xuICAgICAgb3ZlcmxheVRydXN0ZWRUeXBlc1BvbGljeSA9IHdpbmRvdy50cnVzdGVkVHlwZXMuY3JlYXRlUG9saWN5KHRydXN0ZWRUeXBlc1BvbGljeU5hbWUgfHwgXCJ3ZWJwYWNrLWRldi1zZXJ2ZXIjb3ZlcmxheVwiLCB7XG4gICAgICAgIGNyZWF0ZUhUTUw6IGZ1bmN0aW9uIGNyZWF0ZUhUTUwodmFsdWUpIHtcbiAgICAgICAgICByZXR1cm4gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZnJhbWVDb250YWluZXJFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImlmcmFtZVwiKTtcbiAgICBpZnJhbWVDb250YWluZXJFbGVtZW50LmlkID0gXCJ3ZWJwYWNrLWRldi1zZXJ2ZXItY2xpZW50LW92ZXJsYXlcIjtcbiAgICBpZnJhbWVDb250YWluZXJFbGVtZW50LnNyYyA9IFwiYWJvdXQ6YmxhbmtcIjtcbiAgICBhcHBseVN0eWxlKGlmcmFtZUNvbnRhaW5lckVsZW1lbnQsIGlmcmFtZVN0eWxlKTtcbiAgICBpZnJhbWVDb250YWluZXJFbGVtZW50Lm9ubG9hZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBjb250ZW50RWxlbWVudCA9IC8qKiBAdHlwZSB7RG9jdW1lbnR9ICovXG4gICAgICAvKiogQHR5cGUge0hUTUxJRnJhbWVFbGVtZW50fSAqL1xuICAgICAgaWZyYW1lQ29udGFpbmVyRWxlbWVudC5jb250ZW50RG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgIGNvbnRhaW5lckVsZW1lbnQgPSAvKiogQHR5cGUge0RvY3VtZW50fSAqL1xuICAgICAgLyoqIEB0eXBlIHtIVE1MSUZyYW1lRWxlbWVudH0gKi9cbiAgICAgIGlmcmFtZUNvbnRhaW5lckVsZW1lbnQuY29udGVudERvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBjb250ZW50RWxlbWVudC5pZCA9IFwid2VicGFjay1kZXYtc2VydmVyLWNsaWVudC1vdmVybGF5LWRpdlwiO1xuICAgICAgYXBwbHlTdHlsZShjb250ZW50RWxlbWVudCwgY29udGFpbmVyU3R5bGUpO1xuICAgICAgaGVhZGVyRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG4gICAgICBoZWFkZXJFbGVtZW50LmlubmVyVGV4dCA9IFwiQ29tcGlsZWQgd2l0aCBwcm9ibGVtczpcIjtcbiAgICAgIGFwcGx5U3R5bGUoaGVhZGVyRWxlbWVudCwgaGVhZGVyU3R5bGUpO1xuICAgICAgdmFyIGNsb3NlQnV0dG9uRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG4gICAgICBhcHBseVN0eWxlKGNsb3NlQnV0dG9uRWxlbWVudCwgZGlzbWlzc0J1dHRvblN0eWxlKTtcbiAgICAgIGNsb3NlQnV0dG9uRWxlbWVudC5pbm5lclRleHQgPSBcIsOXXCI7XG4gICAgICBjbG9zZUJ1dHRvbkVsZW1lbnQuYXJpYUxhYmVsID0gXCJEaXNtaXNzXCI7XG4gICAgICBjbG9zZUJ1dHRvbkVsZW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgLy8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVzZS1iZWZvcmUtZGVmaW5lXG4gICAgICAgIG92ZXJsYXlTZXJ2aWNlLnNlbmQoe1xuICAgICAgICAgIHR5cGU6IFwiRElTTUlTU1wiXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICBjb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZChoZWFkZXJFbGVtZW50KTtcbiAgICAgIGNvbnRlbnRFbGVtZW50LmFwcGVuZENoaWxkKGNsb3NlQnV0dG9uRWxlbWVudCk7XG4gICAgICBjb250ZW50RWxlbWVudC5hcHBlbmRDaGlsZChjb250YWluZXJFbGVtZW50KTtcblxuICAgICAgLyoqIEB0eXBlIHtEb2N1bWVudH0gKi9cbiAgICAgIC8qKiBAdHlwZSB7SFRNTElGcmFtZUVsZW1lbnR9ICovXG4gICAgICBpZnJhbWVDb250YWluZXJFbGVtZW50LmNvbnRlbnREb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGNvbnRlbnRFbGVtZW50KTtcbiAgICAgIG9uTG9hZFF1ZXVlLmZvckVhY2goZnVuY3Rpb24gKG9uTG9hZCkge1xuICAgICAgICBvbkxvYWQoIC8qKiBAdHlwZSB7SFRNTERpdkVsZW1lbnR9ICovY29udGVudEVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgICBvbkxvYWRRdWV1ZSA9IFtdO1xuXG4gICAgICAvKiogQHR5cGUge0hUTUxJRnJhbWVFbGVtZW50fSAqL1xuICAgICAgaWZyYW1lQ29udGFpbmVyRWxlbWVudC5vbmxvYWQgPSBudWxsO1xuICAgIH07XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChpZnJhbWVDb250YWluZXJFbGVtZW50KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAcGFyYW0geyhlbGVtZW50OiBIVE1MRGl2RWxlbWVudCkgPT4gdm9pZH0gY2FsbGJhY2tcbiAgICogQHBhcmFtIHtzdHJpbmcgfCBudWxsfSB0cnVzdGVkVHlwZXNQb2xpY3lOYW1lXG4gICAqL1xuICBmdW5jdGlvbiBlbnN1cmVPdmVybGF5RXhpc3RzKGNhbGxiYWNrLCB0cnVzdGVkVHlwZXNQb2xpY3lOYW1lKSB7XG4gICAgaWYgKGNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIGNvbnRhaW5lckVsZW1lbnQuaW5uZXJIVE1MID0gXCJcIjtcbiAgICAgIC8vIEV2ZXJ5dGhpbmcgaXMgcmVhZHksIGNhbGwgdGhlIGNhbGxiYWNrIHJpZ2h0IGF3YXkuXG4gICAgICBjYWxsYmFjayhjb250YWluZXJFbGVtZW50KTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgb25Mb2FkUXVldWUucHVzaChjYWxsYmFjayk7XG4gICAgaWYgKGlmcmFtZUNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY3JlYXRlQ29udGFpbmVyKHRydXN0ZWRUeXBlc1BvbGljeU5hbWUpO1xuICB9XG5cbiAgLy8gU3VjY2Vzc2Z1bCBjb21waWxhdGlvbi5cbiAgZnVuY3Rpb24gaGlkZSgpIHtcbiAgICBpZiAoIWlmcmFtZUNvbnRhaW5lckVsZW1lbnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBDbGVhbiB1cCBhbmQgcmVzZXQgaW50ZXJuYWwgc3RhdGUuXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZChpZnJhbWVDb250YWluZXJFbGVtZW50KTtcbiAgICBpZnJhbWVDb250YWluZXJFbGVtZW50ID0gbnVsbDtcbiAgICBjb250YWluZXJFbGVtZW50ID0gbnVsbDtcbiAgfVxuXG4gIC8vIENvbXBpbGF0aW9uIHdpdGggZXJyb3JzIChlLmcuIHN5bnRheCBlcnJvciBvciBtaXNzaW5nIG1vZHVsZXMpLlxuICAvKipcbiAgICogQHBhcmFtIHtzdHJpbmd9IHR5cGVcbiAgICogQHBhcmFtIHtBcnJheTxzdHJpbmcgIHwgeyBtb2R1bGVJZGVudGlmaWVyPzogc3RyaW5nLCBtb2R1bGVOYW1lPzogc3RyaW5nLCBsb2M/OiBzdHJpbmcsIG1lc3NhZ2U/OiBzdHJpbmcgfT59IG1lc3NhZ2VzXG4gICAqIEBwYXJhbSB7c3RyaW5nIHwgbnVsbH0gdHJ1c3RlZFR5cGVzUG9saWN5TmFtZVxuICAgKiBAcGFyYW0geydidWlsZCcgfCAncnVudGltZSd9IG1lc3NhZ2VTb3VyY2VcbiAgICovXG4gIGZ1bmN0aW9uIHNob3codHlwZSwgbWVzc2FnZXMsIHRydXN0ZWRUeXBlc1BvbGljeU5hbWUsIG1lc3NhZ2VTb3VyY2UpIHtcbiAgICBlbnN1cmVPdmVybGF5RXhpc3RzKGZ1bmN0aW9uICgpIHtcbiAgICAgIGhlYWRlckVsZW1lbnQuaW5uZXJUZXh0ID0gbWVzc2FnZVNvdXJjZSA9PT0gXCJydW50aW1lXCIgPyBcIlVuY2F1Z2h0IHJ1bnRpbWUgZXJyb3JzOlwiIDogXCJDb21waWxlZCB3aXRoIHByb2JsZW1zOlwiO1xuICAgICAgbWVzc2FnZXMuZm9yRWFjaChmdW5jdGlvbiAobWVzc2FnZSkge1xuICAgICAgICB2YXIgZW50cnlFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgdmFyIG1zZ1N0eWxlID0gdHlwZSA9PT0gXCJ3YXJuaW5nXCIgPyBtc2dTdHlsZXMud2FybmluZyA6IG1zZ1N0eWxlcy5lcnJvcjtcbiAgICAgICAgYXBwbHlTdHlsZShlbnRyeUVsZW1lbnQsIF9vYmplY3RTcHJlYWQoX29iamVjdFNwcmVhZCh7fSwgbXNnU3R5bGUpLCB7fSwge1xuICAgICAgICAgIHBhZGRpbmc6IFwiMXJlbSAxcmVtIDEuNXJlbSAxcmVtXCJcbiAgICAgICAgfSkpO1xuICAgICAgICB2YXIgdHlwZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuICAgICAgICB2YXIgX2Zvcm1hdFByb2JsZW0gPSBmb3JtYXRQcm9ibGVtKHR5cGUsIG1lc3NhZ2UpLFxuICAgICAgICAgIGhlYWRlciA9IF9mb3JtYXRQcm9ibGVtLmhlYWRlcixcbiAgICAgICAgICBib2R5ID0gX2Zvcm1hdFByb2JsZW0uYm9keTtcbiAgICAgICAgdHlwZUVsZW1lbnQuaW5uZXJUZXh0ID0gaGVhZGVyO1xuICAgICAgICBhcHBseVN0eWxlKHR5cGVFbGVtZW50LCBtc2dUeXBlU3R5bGUpO1xuICAgICAgICBpZiAobWVzc2FnZS5tb2R1bGVJZGVudGlmaWVyKSB7XG4gICAgICAgICAgYXBwbHlTdHlsZSh0eXBlRWxlbWVudCwge1xuICAgICAgICAgICAgY3Vyc29yOiBcInBvaW50ZXJcIlxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIGVsZW1lbnQuZGF0YXNldCBub3Qgc3VwcG9ydGVkIGluIElFXG4gICAgICAgICAgdHlwZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwiZGF0YS1jYW4tb3BlblwiLCB0cnVlKTtcbiAgICAgICAgICB0eXBlRWxlbWVudC5hZGRFdmVudExpc3RlbmVyKFwiY2xpY2tcIiwgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgZmV0Y2goXCIvd2VicGFjay1kZXYtc2VydmVyL29wZW4tZWRpdG9yP2ZpbGVOYW1lPVwiLmNvbmNhdChtZXNzYWdlLm1vZHVsZUlkZW50aWZpZXIpKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIE1ha2UgaXQgbG9vayBzaW1pbGFyIHRvIG91ciB0ZXJtaW5hbC5cbiAgICAgICAgdmFyIHRleHQgPSBhbnNpSFRNTChlbmNvZGUoYm9keSkpO1xuICAgICAgICB2YXIgbWVzc2FnZVRleHROb2RlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcbiAgICAgICAgYXBwbHlTdHlsZShtZXNzYWdlVGV4dE5vZGUsIG1zZ1RleHRTdHlsZSk7XG4gICAgICAgIG1lc3NhZ2VUZXh0Tm9kZS5pbm5lckhUTUwgPSBvdmVybGF5VHJ1c3RlZFR5cGVzUG9saWN5ID8gb3ZlcmxheVRydXN0ZWRUeXBlc1BvbGljeS5jcmVhdGVIVE1MKHRleHQpIDogdGV4dDtcbiAgICAgICAgZW50cnlFbGVtZW50LmFwcGVuZENoaWxkKHR5cGVFbGVtZW50KTtcbiAgICAgICAgZW50cnlFbGVtZW50LmFwcGVuZENoaWxkKG1lc3NhZ2VUZXh0Tm9kZSk7XG5cbiAgICAgICAgLyoqIEB0eXBlIHtIVE1MRGl2RWxlbWVudH0gKi9cbiAgICAgICAgY29udGFpbmVyRWxlbWVudC5hcHBlbmRDaGlsZChlbnRyeUVsZW1lbnQpO1xuICAgICAgfSk7XG4gICAgfSwgdHJ1c3RlZFR5cGVzUG9saWN5TmFtZSk7XG4gIH1cbiAgdmFyIG92ZXJsYXlTZXJ2aWNlID0gY3JlYXRlT3ZlcmxheU1hY2hpbmUoe1xuICAgIHNob3dPdmVybGF5OiBmdW5jdGlvbiBzaG93T3ZlcmxheShfcmVmKSB7XG4gICAgICB2YXIgX3JlZiRsZXZlbCA9IF9yZWYubGV2ZWwsXG4gICAgICAgIGxldmVsID0gX3JlZiRsZXZlbCA9PT0gdm9pZCAwID8gXCJlcnJvclwiIDogX3JlZiRsZXZlbCxcbiAgICAgICAgbWVzc2FnZXMgPSBfcmVmLm1lc3NhZ2VzLFxuICAgICAgICBtZXNzYWdlU291cmNlID0gX3JlZi5tZXNzYWdlU291cmNlO1xuICAgICAgcmV0dXJuIHNob3cobGV2ZWwsIG1lc3NhZ2VzLCBvcHRpb25zLnRydXN0ZWRUeXBlc1BvbGljeU5hbWUsIG1lc3NhZ2VTb3VyY2UpO1xuICAgIH0sXG4gICAgaGlkZU92ZXJsYXk6IGhpZGVcbiAgfSk7XG4gIGlmIChvcHRpb25zLmNhdGNoUnVudGltZUVycm9yKSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtFcnJvciB8IHVuZGVmaW5lZH0gZXJyb3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZmFsbGJhY2tNZXNzYWdlXG4gICAgICovXG4gICAgdmFyIGhhbmRsZUVycm9yID0gZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IsIGZhbGxiYWNrTWVzc2FnZSkge1xuICAgICAgdmFyIGVycm9yT2JqZWN0ID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yIDogbmV3IEVycm9yKGVycm9yIHx8IGZhbGxiYWNrTWVzc2FnZSk7XG4gICAgICB2YXIgc2hvdWxkRGlzcGxheSA9IHR5cGVvZiBvcHRpb25zLmNhdGNoUnVudGltZUVycm9yID09PSBcImZ1bmN0aW9uXCIgPyBvcHRpb25zLmNhdGNoUnVudGltZUVycm9yKGVycm9yT2JqZWN0KSA6IHRydWU7XG4gICAgICBpZiAoc2hvdWxkRGlzcGxheSkge1xuICAgICAgICBvdmVybGF5U2VydmljZS5zZW5kKHtcbiAgICAgICAgICB0eXBlOiBcIlJVTlRJTUVfRVJST1JcIixcbiAgICAgICAgICBtZXNzYWdlczogW3tcbiAgICAgICAgICAgIG1lc3NhZ2U6IGVycm9yT2JqZWN0Lm1lc3NhZ2UsXG4gICAgICAgICAgICBzdGFjazogcGFyc2VFcnJvclRvU3RhY2tzKGVycm9yT2JqZWN0KVxuICAgICAgICAgIH1dXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH07XG4gICAgbGlzdGVuVG9SdW50aW1lRXJyb3IoZnVuY3Rpb24gKGVycm9yRXZlbnQpIHtcbiAgICAgIC8vIGVycm9yIHByb3BlcnR5IG1heSBiZSBlbXB0eSBpbiBvbGRlciBicm93c2VyIGxpa2UgSUVcbiAgICAgIHZhciBlcnJvciA9IGVycm9yRXZlbnQuZXJyb3IsXG4gICAgICAgIG1lc3NhZ2UgPSBlcnJvckV2ZW50Lm1lc3NhZ2U7XG4gICAgICBpZiAoIWVycm9yICYmICFtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGhhbmRsZUVycm9yKGVycm9yLCBtZXNzYWdlKTtcbiAgICB9KTtcbiAgICBsaXN0ZW5Ub1VuaGFuZGxlZFJlamVjdGlvbihmdW5jdGlvbiAocHJvbWlzZVJlamVjdGlvbkV2ZW50KSB7XG4gICAgICB2YXIgcmVhc29uID0gcHJvbWlzZVJlamVjdGlvbkV2ZW50LnJlYXNvbjtcbiAgICAgIGhhbmRsZUVycm9yKHJlYXNvbiwgXCJVbmtub3duIHByb21pc2UgcmVqZWN0aW9uIHJlYXNvblwiKTtcbiAgICB9KTtcbiAgfVxuICByZXR1cm4gb3ZlcmxheVNlcnZpY2U7XG59O1xuZXhwb3J0IHsgZm9ybWF0UHJvYmxlbSwgY3JlYXRlT3ZlcmxheSB9OyIsImZ1bmN0aW9uIG93bktleXMob2JqZWN0LCBlbnVtZXJhYmxlT25seSkgeyB2YXIga2V5cyA9IE9iamVjdC5rZXlzKG9iamVjdCk7IGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7IHZhciBzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhvYmplY3QpOyBlbnVtZXJhYmxlT25seSAmJiAoc3ltYm9scyA9IHN5bWJvbHMuZmlsdGVyKGZ1bmN0aW9uIChzeW0pIHsgcmV0dXJuIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBzeW0pLmVudW1lcmFibGU7IH0pKSwga2V5cy5wdXNoLmFwcGx5KGtleXMsIHN5bWJvbHMpOyB9IHJldHVybiBrZXlzOyB9XG5mdW5jdGlvbiBfb2JqZWN0U3ByZWFkKHRhcmdldCkgeyBmb3IgKHZhciBpID0gMTsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykgeyB2YXIgc291cmNlID0gbnVsbCAhPSBhcmd1bWVudHNbaV0gPyBhcmd1bWVudHNbaV0gOiB7fTsgaSAlIDIgPyBvd25LZXlzKE9iamVjdChzb3VyY2UpLCAhMCkuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7IF9kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGtleSwgc291cmNlW2tleV0pOyB9KSA6IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzID8gT2JqZWN0LmRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhzb3VyY2UpKSA6IG93bktleXMoT2JqZWN0KHNvdXJjZSkpLmZvckVhY2goZnVuY3Rpb24gKGtleSkgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBrZXksIE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Ioc291cmNlLCBrZXkpKTsgfSk7IH0gcmV0dXJuIHRhcmdldDsgfVxuZnVuY3Rpb24gX2RlZmluZVByb3BlcnR5KG9iaiwga2V5LCB2YWx1ZSkgeyBrZXkgPSBfdG9Qcm9wZXJ0eUtleShrZXkpOyBpZiAoa2V5IGluIG9iaikgeyBPYmplY3QuZGVmaW5lUHJvcGVydHkob2JqLCBrZXksIHsgdmFsdWU6IHZhbHVlLCBlbnVtZXJhYmxlOiB0cnVlLCBjb25maWd1cmFibGU6IHRydWUsIHdyaXRhYmxlOiB0cnVlIH0pOyB9IGVsc2UgeyBvYmpba2V5XSA9IHZhbHVlOyB9IHJldHVybiBvYmo7IH1cbmZ1bmN0aW9uIF90b1Byb3BlcnR5S2V5KGFyZykgeyB2YXIga2V5ID0gX3RvUHJpbWl0aXZlKGFyZywgXCJzdHJpbmdcIik7IHJldHVybiB0eXBlb2Yga2V5ID09PSBcInN5bWJvbFwiID8ga2V5IDogU3RyaW5nKGtleSk7IH1cbmZ1bmN0aW9uIF90b1ByaW1pdGl2ZShpbnB1dCwgaGludCkgeyBpZiAodHlwZW9mIGlucHV0ICE9PSBcIm9iamVjdFwiIHx8IGlucHV0ID09PSBudWxsKSByZXR1cm4gaW5wdXQ7IHZhciBwcmltID0gaW5wdXRbU3ltYm9sLnRvUHJpbWl0aXZlXTsgaWYgKHByaW0gIT09IHVuZGVmaW5lZCkgeyB2YXIgcmVzID0gcHJpbS5jYWxsKGlucHV0LCBoaW50IHx8IFwiZGVmYXVsdFwiKTsgaWYgKHR5cGVvZiByZXMgIT09IFwib2JqZWN0XCIpIHJldHVybiByZXM7IHRocm93IG5ldyBUeXBlRXJyb3IoXCJAQHRvUHJpbWl0aXZlIG11c3QgcmV0dXJuIGEgcHJpbWl0aXZlIHZhbHVlLlwiKTsgfSByZXR1cm4gKGhpbnQgPT09IFwic3RyaW5nXCIgPyBTdHJpbmcgOiBOdW1iZXIpKGlucHV0KTsgfVxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTdGF0ZURlZmluaXRpb25zXG4gKiBAcHJvcGVydHkge3tbZXZlbnQ6IHN0cmluZ106IHsgdGFyZ2V0OiBzdHJpbmc7IGFjdGlvbnM/OiBBcnJheTxzdHJpbmc+IH19fSBbb25dXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBPcHRpb25zXG4gKiBAcHJvcGVydHkge3tbc3RhdGU6IHN0cmluZ106IFN0YXRlRGVmaW5pdGlvbnN9fSBzdGF0ZXNcbiAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjb250ZXh0O1xuICogQHByb3BlcnR5IHtzdHJpbmd9IGluaXRpYWxcbiAqL1xuXG4vKipcbiAqIEB0eXBlZGVmIHtPYmplY3R9IEltcGxlbWVudGF0aW9uXG4gKiBAcHJvcGVydHkge3tbYWN0aW9uTmFtZTogc3RyaW5nXTogKGN0eDogb2JqZWN0LCBldmVudDogYW55KSA9PiBvYmplY3R9fSBhY3Rpb25zXG4gKi9cblxuLyoqXG4gKiBBIHNpbXBsaWZpZWQgYGNyZWF0ZU1hY2hpbmVgIGZyb20gYEB4c3RhdGUvZnNtYCB3aXRoIHRoZSBmb2xsb3dpbmcgZGlmZmVyZW5jZXM6XG4gKlxuICogIC0gdGhlIHJldHVybmVkIG1hY2hpbmUgaXMgdGVjaG5pY2FsbHkgYSBcInNlcnZpY2VcIi4gTm8gYGludGVycHJldChtYWNoaW5lKS5zdGFydCgpYCBpcyBuZWVkZWQuXG4gKiAgLSB0aGUgc3RhdGUgZGVmaW5pdGlvbiBvbmx5IHN1cHBvcnQgYG9uYCBhbmQgdGFyZ2V0IG11c3QgYmUgZGVjbGFyZWQgd2l0aCB7IHRhcmdldDogJ25leHRTdGF0ZScsIGFjdGlvbnM6IFtdIH0gZXhwbGljaXRseS5cbiAqICAtIGV2ZW50IHBhc3NlZCB0byBgc2VuZGAgbXVzdCBiZSBhbiBvYmplY3Qgd2l0aCBgdHlwZWAgcHJvcGVydHkuXG4gKiAgLSBhY3Rpb25zIGltcGxlbWVudGF0aW9uIHdpbGwgYmUgW2Fzc2lnbiBhY3Rpb25dKGh0dHBzOi8veHN0YXRlLmpzLm9yZy9kb2NzL2d1aWRlcy9jb250ZXh0Lmh0bWwjYXNzaWduLWFjdGlvbikgaWYgeW91IHJldHVybiBhbnkgdmFsdWUuXG4gKiAgRG8gbm90IHJldHVybiBhbnl0aGluZyBpZiB5b3UganVzdCB3YW50IHRvIGludm9rZSBzaWRlIGVmZmVjdC5cbiAqXG4gKiBUaGUgZ29hbCBvZiB0aGlzIGN1c3RvbSBmdW5jdGlvbiBpcyB0byBhdm9pZCBpbnN0YWxsaW5nIHRoZSBlbnRpcmUgYCd4c3RhdGUvZnNtJ2AgcGFja2FnZSwgd2hpbGUgZW5hYmxpbmcgbW9kZWxpbmcgdXNpbmdcbiAqIHN0YXRlIG1hY2hpbmUuIFlvdSBjYW4gY29weSB0aGUgZmlyc3QgcGFyYW1ldGVyIGludG8gdGhlIGVkaXRvciBhdCBodHRwczovL3N0YXRlbHkuYWkvdml6IHRvIHZpc3VhbGl6ZSB0aGUgc3RhdGUgbWFjaGluZS5cbiAqXG4gKiBAcGFyYW0ge09wdGlvbnN9IG9wdGlvbnNcbiAqIEBwYXJhbSB7SW1wbGVtZW50YXRpb259IGltcGxlbWVudGF0aW9uXG4gKi9cbmZ1bmN0aW9uIGNyZWF0ZU1hY2hpbmUoX3JlZiwgX3JlZjIpIHtcbiAgdmFyIHN0YXRlcyA9IF9yZWYuc3RhdGVzLFxuICAgIGNvbnRleHQgPSBfcmVmLmNvbnRleHQsXG4gICAgaW5pdGlhbCA9IF9yZWYuaW5pdGlhbDtcbiAgdmFyIGFjdGlvbnMgPSBfcmVmMi5hY3Rpb25zO1xuICB2YXIgY3VycmVudFN0YXRlID0gaW5pdGlhbDtcbiAgdmFyIGN1cnJlbnRDb250ZXh0ID0gY29udGV4dDtcbiAgcmV0dXJuIHtcbiAgICBzZW5kOiBmdW5jdGlvbiBzZW5kKGV2ZW50KSB7XG4gICAgICB2YXIgY3VycmVudFN0YXRlT24gPSBzdGF0ZXNbY3VycmVudFN0YXRlXS5vbjtcbiAgICAgIHZhciB0cmFuc2l0aW9uQ29uZmlnID0gY3VycmVudFN0YXRlT24gJiYgY3VycmVudFN0YXRlT25bZXZlbnQudHlwZV07XG4gICAgICBpZiAodHJhbnNpdGlvbkNvbmZpZykge1xuICAgICAgICBjdXJyZW50U3RhdGUgPSB0cmFuc2l0aW9uQ29uZmlnLnRhcmdldDtcbiAgICAgICAgaWYgKHRyYW5zaXRpb25Db25maWcuYWN0aW9ucykge1xuICAgICAgICAgIHRyYW5zaXRpb25Db25maWcuYWN0aW9ucy5mb3JFYWNoKGZ1bmN0aW9uIChhY3ROYW1lKSB7XG4gICAgICAgICAgICB2YXIgYWN0aW9uSW1wbCA9IGFjdGlvbnNbYWN0TmFtZV07XG4gICAgICAgICAgICB2YXIgbmV4dENvbnRleHRWYWx1ZSA9IGFjdGlvbkltcGwgJiYgYWN0aW9uSW1wbChjdXJyZW50Q29udGV4dCwgZXZlbnQpO1xuICAgICAgICAgICAgaWYgKG5leHRDb250ZXh0VmFsdWUpIHtcbiAgICAgICAgICAgICAgY3VycmVudENvbnRleHQgPSBfb2JqZWN0U3ByZWFkKF9vYmplY3RTcHJlYWQoe30sIGN1cnJlbnRDb250ZXh0KSwgbmV4dENvbnRleHRWYWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH07XG59XG5leHBvcnQgZGVmYXVsdCBjcmVhdGVNYWNoaW5lOyIsIi8qKlxuICpcbiAqIEBwYXJhbSB7RXJyb3J9IGVycm9yXG4gKi9cbmZ1bmN0aW9uIHBhcnNlRXJyb3JUb1N0YWNrcyhlcnJvcikge1xuICBpZiAoIWVycm9yIHx8ICEoZXJyb3IgaW5zdGFuY2VvZiBFcnJvcikpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJwYXJzZUVycm9yVG9TdGFja3MgZXhwZWN0cyBFcnJvciBvYmplY3RcIik7XG4gIH1cbiAgaWYgKHR5cGVvZiBlcnJvci5zdGFjayA9PT0gXCJzdHJpbmdcIikge1xuICAgIHJldHVybiBlcnJvci5zdGFjay5zcGxpdChcIlxcblwiKS5maWx0ZXIoZnVuY3Rpb24gKHN0YWNrKSB7XG4gICAgICByZXR1cm4gc3RhY2sgIT09IFwiRXJyb3I6IFwiLmNvbmNhdChlcnJvci5tZXNzYWdlKTtcbiAgICB9KTtcbiAgfVxufVxuXG4vKipcbiAqIEBjYWxsYmFjayBFcnJvckNhbGxiYWNrXG4gKiBAcGFyYW0ge0Vycm9yRXZlbnR9IGVycm9yXG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7RXJyb3JDYWxsYmFja30gY2FsbGJhY2tcbiAqL1xuZnVuY3Rpb24gbGlzdGVuVG9SdW50aW1lRXJyb3IoY2FsbGJhY2spIHtcbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJlcnJvclwiLCBjYWxsYmFjayk7XG4gIHJldHVybiBmdW5jdGlvbiBjbGVhbnVwKCkge1xuICAgIHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKFwiZXJyb3JcIiwgY2FsbGJhY2spO1xuICB9O1xufVxuXG4vKipcbiAqIEBjYWxsYmFjayBVbmhhbmRsZWRSZWplY3Rpb25DYWxsYmFja1xuICogQHBhcmFtIHtQcm9taXNlUmVqZWN0aW9uRXZlbnR9IHJlamVjdGlvbkV2ZW50XG4gKiBAcmV0dXJucyB7dm9pZH1cbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7VW5oYW5kbGVkUmVqZWN0aW9uQ2FsbGJhY2t9IGNhbGxiYWNrXG4gKi9cbmZ1bmN0aW9uIGxpc3RlblRvVW5oYW5kbGVkUmVqZWN0aW9uKGNhbGxiYWNrKSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwidW5oYW5kbGVkcmVqZWN0aW9uXCIsIGNhbGxiYWNrKTtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNsZWFudXAoKSB7XG4gICAgd2luZG93LnJlbW92ZUV2ZW50TGlzdGVuZXIoXCJ1bmhhbmRsZWRyZWplY3Rpb25cIiwgY2FsbGJhY2spO1xuICB9O1xufVxuZXhwb3J0IHsgbGlzdGVuVG9SdW50aW1lRXJyb3IsIGxpc3RlblRvVW5oYW5kbGVkUmVqZWN0aW9uLCBwYXJzZUVycm9yVG9TdGFja3MgfTsiLCJpbXBvcnQgY3JlYXRlTWFjaGluZSBmcm9tIFwiLi9mc20uanNcIjtcblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBTaG93T3ZlcmxheURhdGFcbiAqIEBwcm9wZXJ0eSB7J3dhcm5pbmcnIHwgJ2Vycm9yJ30gbGV2ZWxcbiAqIEBwcm9wZXJ0eSB7QXJyYXk8c3RyaW5nICB8IHsgbW9kdWxlSWRlbnRpZmllcj86IHN0cmluZywgbW9kdWxlTmFtZT86IHN0cmluZywgbG9jPzogc3RyaW5nLCBtZXNzYWdlPzogc3RyaW5nIH0+fSBtZXNzYWdlc1xuICogQHByb3BlcnR5IHsnYnVpbGQnIHwgJ3J1bnRpbWUnfSBtZXNzYWdlU291cmNlXG4gKi9cblxuLyoqXG4gKiBAdHlwZWRlZiB7T2JqZWN0fSBDcmVhdGVPdmVybGF5TWFjaGluZU9wdGlvbnNcbiAqIEBwcm9wZXJ0eSB7KGRhdGE6IFNob3dPdmVybGF5RGF0YSkgPT4gdm9pZH0gc2hvd092ZXJsYXlcbiAqIEBwcm9wZXJ0eSB7KCkgPT4gdm9pZH0gaGlkZU92ZXJsYXlcbiAqL1xuXG4vKipcbiAqIEBwYXJhbSB7Q3JlYXRlT3ZlcmxheU1hY2hpbmVPcHRpb25zfSBvcHRpb25zXG4gKi9cbnZhciBjcmVhdGVPdmVybGF5TWFjaGluZSA9IGZ1bmN0aW9uIGNyZWF0ZU92ZXJsYXlNYWNoaW5lKG9wdGlvbnMpIHtcbiAgdmFyIGhpZGVPdmVybGF5ID0gb3B0aW9ucy5oaWRlT3ZlcmxheSxcbiAgICBzaG93T3ZlcmxheSA9IG9wdGlvbnMuc2hvd092ZXJsYXk7XG4gIHZhciBvdmVybGF5TWFjaGluZSA9IGNyZWF0ZU1hY2hpbmUoe1xuICAgIGluaXRpYWw6IFwiaGlkZGVuXCIsXG4gICAgY29udGV4dDoge1xuICAgICAgbGV2ZWw6IFwiZXJyb3JcIixcbiAgICAgIG1lc3NhZ2VzOiBbXSxcbiAgICAgIG1lc3NhZ2VTb3VyY2U6IFwiYnVpbGRcIlxuICAgIH0sXG4gICAgc3RhdGVzOiB7XG4gICAgICBoaWRkZW46IHtcbiAgICAgICAgb246IHtcbiAgICAgICAgICBCVUlMRF9FUlJPUjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImRpc3BsYXlCdWlsZEVycm9yXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJzZXRNZXNzYWdlc1wiLCBcInNob3dPdmVybGF5XCJdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBSVU5USU1FX0VSUk9SOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiZGlzcGxheVJ1bnRpbWVFcnJvclwiLFxuICAgICAgICAgICAgYWN0aW9uczogW1wic2V0TWVzc2FnZXNcIiwgXCJzaG93T3ZlcmxheVwiXVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSxcbiAgICAgIGRpc3BsYXlCdWlsZEVycm9yOiB7XG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgRElTTUlTUzoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImhpZGRlblwiLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiZGlzbWlzc01lc3NhZ2VzXCIsIFwiaGlkZU92ZXJsYXlcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIEJVSUxEX0VSUk9SOiB7XG4gICAgICAgICAgICB0YXJnZXQ6IFwiZGlzcGxheUJ1aWxkRXJyb3JcIixcbiAgICAgICAgICAgIGFjdGlvbnM6IFtcImFwcGVuZE1lc3NhZ2VzXCIsIFwic2hvd092ZXJsYXlcIl1cbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgICBkaXNwbGF5UnVudGltZUVycm9yOiB7XG4gICAgICAgIG9uOiB7XG4gICAgICAgICAgRElTTUlTUzoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImhpZGRlblwiLFxuICAgICAgICAgICAgYWN0aW9uczogW1wiZGlzbWlzc01lc3NhZ2VzXCIsIFwiaGlkZU92ZXJsYXlcIl1cbiAgICAgICAgICB9LFxuICAgICAgICAgIFJVTlRJTUVfRVJST1I6IHtcbiAgICAgICAgICAgIHRhcmdldDogXCJkaXNwbGF5UnVudGltZUVycm9yXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJhcHBlbmRNZXNzYWdlc1wiLCBcInNob3dPdmVybGF5XCJdXG4gICAgICAgICAgfSxcbiAgICAgICAgICBCVUlMRF9FUlJPUjoge1xuICAgICAgICAgICAgdGFyZ2V0OiBcImRpc3BsYXlCdWlsZEVycm9yXCIsXG4gICAgICAgICAgICBhY3Rpb25zOiBbXCJzZXRNZXNzYWdlc1wiLCBcInNob3dPdmVybGF5XCJdXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9LCB7XG4gICAgYWN0aW9uczoge1xuICAgICAgZGlzbWlzc01lc3NhZ2VzOiBmdW5jdGlvbiBkaXNtaXNzTWVzc2FnZXMoKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbWVzc2FnZXM6IFtdLFxuICAgICAgICAgIGxldmVsOiBcImVycm9yXCIsXG4gICAgICAgICAgbWVzc2FnZVNvdXJjZTogXCJidWlsZFwiXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgYXBwZW5kTWVzc2FnZXM6IGZ1bmN0aW9uIGFwcGVuZE1lc3NhZ2VzKGNvbnRleHQsIGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbWVzc2FnZXM6IGNvbnRleHQubWVzc2FnZXMuY29uY2F0KGV2ZW50Lm1lc3NhZ2VzKSxcbiAgICAgICAgICBsZXZlbDogZXZlbnQubGV2ZWwgfHwgY29udGV4dC5sZXZlbCxcbiAgICAgICAgICBtZXNzYWdlU291cmNlOiBldmVudC50eXBlID09PSBcIlJVTlRJTUVfRVJST1JcIiA/IFwicnVudGltZVwiIDogXCJidWlsZFwiXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgc2V0TWVzc2FnZXM6IGZ1bmN0aW9uIHNldE1lc3NhZ2VzKGNvbnRleHQsIGV2ZW50KSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgbWVzc2FnZXM6IGV2ZW50Lm1lc3NhZ2VzLFxuICAgICAgICAgIGxldmVsOiBldmVudC5sZXZlbCB8fCBjb250ZXh0LmxldmVsLFxuICAgICAgICAgIG1lc3NhZ2VTb3VyY2U6IGV2ZW50LnR5cGUgPT09IFwiUlVOVElNRV9FUlJPUlwiID8gXCJydW50aW1lXCIgOiBcImJ1aWxkXCJcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICBoaWRlT3ZlcmxheTogaGlkZU92ZXJsYXksXG4gICAgICBzaG93T3ZlcmxheTogc2hvd092ZXJsYXlcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gb3ZlcmxheU1hY2hpbmU7XG59O1xuZXhwb3J0IGRlZmF1bHQgY3JlYXRlT3ZlcmxheU1hY2hpbmU7IiwiLy8gc3R5bGVzIGFyZSBpbnNwaXJlZCBieSBgcmVhY3QtZXJyb3Itb3ZlcmxheWBcblxudmFyIG1zZ1N0eWxlcyA9IHtcbiAgZXJyb3I6IHtcbiAgICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgyMDYsIDE3LCAzOCwgMC4xKVwiLFxuICAgIGNvbG9yOiBcIiNmY2NmY2ZcIlxuICB9LFxuICB3YXJuaW5nOiB7XG4gICAgYmFja2dyb3VuZENvbG9yOiBcInJnYmEoMjUxLCAyNDUsIDE4MCwgMC4xKVwiLFxuICAgIGNvbG9yOiBcIiNmYmY1YjRcIlxuICB9XG59O1xudmFyIGlmcmFtZVN0eWxlID0ge1xuICBwb3NpdGlvbjogXCJmaXhlZFwiLFxuICB0b3A6IDAsXG4gIGxlZnQ6IDAsXG4gIHJpZ2h0OiAwLFxuICBib3R0b206IDAsXG4gIHdpZHRoOiBcIjEwMHZ3XCIsXG4gIGhlaWdodDogXCIxMDB2aFwiLFxuICBib3JkZXI6IFwibm9uZVwiLFxuICBcInotaW5kZXhcIjogOTk5OTk5OTk5OVxufTtcbnZhciBjb250YWluZXJTdHlsZSA9IHtcbiAgcG9zaXRpb246IFwiZml4ZWRcIixcbiAgYm94U2l6aW5nOiBcImJvcmRlci1ib3hcIixcbiAgbGVmdDogMCxcbiAgdG9wOiAwLFxuICByaWdodDogMCxcbiAgYm90dG9tOiAwLFxuICB3aWR0aDogXCIxMDB2d1wiLFxuICBoZWlnaHQ6IFwiMTAwdmhcIixcbiAgZm9udFNpemU6IFwibGFyZ2VcIixcbiAgcGFkZGluZzogXCIycmVtIDJyZW0gNHJlbSAycmVtXCIsXG4gIGxpbmVIZWlnaHQ6IFwiMS4yXCIsXG4gIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIixcbiAgb3ZlcmZsb3c6IFwiYXV0b1wiLFxuICBiYWNrZ3JvdW5kQ29sb3I6IFwicmdiYSgwLCAwLCAwLCAwLjkpXCIsXG4gIGNvbG9yOiBcIndoaXRlXCJcbn07XG52YXIgaGVhZGVyU3R5bGUgPSB7XG4gIGNvbG9yOiBcIiNlODNiNDZcIixcbiAgZm9udFNpemU6IFwiMmVtXCIsXG4gIHdoaXRlU3BhY2U6IFwicHJlLXdyYXBcIixcbiAgZm9udEZhbWlseTogXCJzYW5zLXNlcmlmXCIsXG4gIG1hcmdpbjogXCIwIDJyZW0gMnJlbSAwXCIsXG4gIGZsZXg6IFwiMCAwIGF1dG9cIixcbiAgbWF4SGVpZ2h0OiBcIjUwJVwiLFxuICBvdmVyZmxvdzogXCJhdXRvXCJcbn07XG52YXIgZGlzbWlzc0J1dHRvblN0eWxlID0ge1xuICBjb2xvcjogXCIjZmZmZmZmXCIsXG4gIGxpbmVIZWlnaHQ6IFwiMXJlbVwiLFxuICBmb250U2l6ZTogXCIxLjVyZW1cIixcbiAgcGFkZGluZzogXCIxcmVtXCIsXG4gIGN1cnNvcjogXCJwb2ludGVyXCIsXG4gIHBvc2l0aW9uOiBcImFic29sdXRlXCIsXG4gIHJpZ2h0OiAwLFxuICB0b3A6IDAsXG4gIGJhY2tncm91bmRDb2xvcjogXCJ0cmFuc3BhcmVudFwiLFxuICBib3JkZXI6IFwibm9uZVwiXG59O1xudmFyIG1zZ1R5cGVTdHlsZSA9IHtcbiAgY29sb3I6IFwiI2U4M2I0NlwiLFxuICBmb250U2l6ZTogXCIxLjJlbVwiLFxuICBtYXJnaW5Cb3R0b206IFwiMXJlbVwiLFxuICBmb250RmFtaWx5OiBcInNhbnMtc2VyaWZcIlxufTtcbnZhciBtc2dUZXh0U3R5bGUgPSB7XG4gIGxpbmVIZWlnaHQ6IFwiMS41XCIsXG4gIGZvbnRTaXplOiBcIjFyZW1cIixcbiAgZm9udEZhbWlseTogXCJNZW5sbywgQ29uc29sYXMsIG1vbm9zcGFjZVwiXG59O1xuZXhwb3J0IHsgbXNnU3R5bGVzLCBpZnJhbWVTdHlsZSwgY29udGFpbmVyU3R5bGUsIGhlYWRlclN0eWxlLCBkaXNtaXNzQnV0dG9uU3R5bGUsIG1zZ1R5cGVTdHlsZSwgbXNnVGV4dFN0eWxlIH07IiwiLyogZ2xvYmFsIF9fd2VicGFja19kZXZfc2VydmVyX2NsaWVudF9fICovXG5cbmltcG9ydCBXZWJTb2NrZXRDbGllbnQgZnJvbSBcIi4vY2xpZW50cy9XZWJTb2NrZXRDbGllbnQuanNcIjtcbmltcG9ydCB7IGxvZyB9IGZyb20gXCIuL3V0aWxzL2xvZy5qc1wiO1xuXG4vLyB0aGlzIFdlYnNvY2tldENsaWVudCBpcyBoZXJlIGFzIGEgZGVmYXVsdCBmYWxsYmFjaywgaW4gY2FzZSB0aGUgY2xpZW50IGlzIG5vdCBpbmplY3RlZFxuLyogZXNsaW50LWRpc2FibGUgY2FtZWxjYXNlICovXG52YXIgQ2xpZW50ID1cbi8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1uZXN0ZWQtdGVybmFyeVxudHlwZW9mIF9fd2VicGFja19kZXZfc2VydmVyX2NsaWVudF9fICE9PSBcInVuZGVmaW5lZFwiID8gdHlwZW9mIF9fd2VicGFja19kZXZfc2VydmVyX2NsaWVudF9fLmRlZmF1bHQgIT09IFwidW5kZWZpbmVkXCIgPyBfX3dlYnBhY2tfZGV2X3NlcnZlcl9jbGllbnRfXy5kZWZhdWx0IDogX193ZWJwYWNrX2Rldl9zZXJ2ZXJfY2xpZW50X18gOiBXZWJTb2NrZXRDbGllbnQ7XG4vKiBlc2xpbnQtZW5hYmxlIGNhbWVsY2FzZSAqL1xuXG52YXIgcmV0cmllcyA9IDA7XG52YXIgbWF4UmV0cmllcyA9IDEwO1xuXG4vLyBJbml0aWFsaXplZCBjbGllbnQgaXMgZXhwb3J0ZWQgc28gZXh0ZXJuYWwgY29uc3VtZXJzIGNhbiB1dGlsaXplIHRoZSBzYW1lIGluc3RhbmNlXG4vLyBJdCBpcyBtdXRhYmxlIHRvIGVuZm9yY2Ugc2luZ2xldG9uXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L25vLW11dGFibGUtZXhwb3J0c1xuZXhwb3J0IHZhciBjbGllbnQgPSBudWxsO1xuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB1cmxcbiAqIEBwYXJhbSB7eyBbaGFuZGxlcjogc3RyaW5nXTogKGRhdGE/OiBhbnksIHBhcmFtcz86IGFueSkgPT4gYW55IH19IGhhbmRsZXJzXG4gKiBAcGFyYW0ge251bWJlcn0gW3JlY29ubmVjdF1cbiAqL1xudmFyIHNvY2tldCA9IGZ1bmN0aW9uIGluaXRTb2NrZXQodXJsLCBoYW5kbGVycywgcmVjb25uZWN0KSB7XG4gIGNsaWVudCA9IG5ldyBDbGllbnQodXJsKTtcbiAgY2xpZW50Lm9uT3BlbihmdW5jdGlvbiAoKSB7XG4gICAgcmV0cmllcyA9IDA7XG4gICAgaWYgKHR5cGVvZiByZWNvbm5lY3QgIT09IFwidW5kZWZpbmVkXCIpIHtcbiAgICAgIG1heFJldHJpZXMgPSByZWNvbm5lY3Q7XG4gICAgfVxuICB9KTtcbiAgY2xpZW50Lm9uQ2xvc2UoZnVuY3Rpb24gKCkge1xuICAgIGlmIChyZXRyaWVzID09PSAwKSB7XG4gICAgICBoYW5kbGVycy5jbG9zZSgpO1xuICAgIH1cblxuICAgIC8vIFRyeSB0byByZWNvbm5lY3QuXG4gICAgY2xpZW50ID0gbnVsbDtcblxuICAgIC8vIEFmdGVyIDEwIHJldHJpZXMgc3RvcCB0cnlpbmcsIHRvIHByZXZlbnQgbG9nc3BhbS5cbiAgICBpZiAocmV0cmllcyA8IG1heFJldHJpZXMpIHtcbiAgICAgIC8vIEV4cG9uZW50aWFsbHkgaW5jcmVhc2UgdGltZW91dCB0byByZWNvbm5lY3QuXG4gICAgICAvLyBSZXNwZWN0ZnVsbHkgY29waWVkIGZyb20gdGhlIHBhY2thZ2UgYGdvdGAuXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tcmVzdHJpY3RlZC1wcm9wZXJ0aWVzXG4gICAgICB2YXIgcmV0cnlJbk1zID0gMTAwMCAqIE1hdGgucG93KDIsIHJldHJpZXMpICsgTWF0aC5yYW5kb20oKSAqIDEwMDtcbiAgICAgIHJldHJpZXMgKz0gMTtcbiAgICAgIGxvZy5pbmZvKFwiVHJ5aW5nIHRvIHJlY29ubmVjdC4uLlwiKTtcbiAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICBzb2NrZXQodXJsLCBoYW5kbGVycywgcmVjb25uZWN0KTtcbiAgICAgIH0sIHJldHJ5SW5Ncyk7XG4gICAgfVxuICB9KTtcbiAgY2xpZW50Lm9uTWVzc2FnZShcbiAgLyoqXG4gICAqIEBwYXJhbSB7YW55fSBkYXRhXG4gICAqL1xuICBmdW5jdGlvbiAoZGF0YSkge1xuICAgIHZhciBtZXNzYWdlID0gSlNPTi5wYXJzZShkYXRhKTtcbiAgICBpZiAoaGFuZGxlcnNbbWVzc2FnZS50eXBlXSkge1xuICAgICAgaGFuZGxlcnNbbWVzc2FnZS50eXBlXShtZXNzYWdlLmRhdGEsIG1lc3NhZ2UucGFyYW1zKTtcbiAgICB9XG4gIH0pO1xufTtcbmV4cG9ydCBkZWZhdWx0IHNvY2tldDsiLCIvKipcbiAqIEBwYXJhbSB7eyBwcm90b2NvbD86IHN0cmluZywgYXV0aD86IHN0cmluZywgaG9zdG5hbWU/OiBzdHJpbmcsIHBvcnQ/OiBzdHJpbmcsIHBhdGhuYW1lPzogc3RyaW5nLCBzZWFyY2g/OiBzdHJpbmcsIGhhc2g/OiBzdHJpbmcsIHNsYXNoZXM/OiBib29sZWFuIH19IG9ialVSTFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gZm9ybWF0KG9ialVSTCkge1xuICB2YXIgcHJvdG9jb2wgPSBvYmpVUkwucHJvdG9jb2wgfHwgXCJcIjtcbiAgaWYgKHByb3RvY29sICYmIHByb3RvY29sLnN1YnN0cigtMSkgIT09IFwiOlwiKSB7XG4gICAgcHJvdG9jb2wgKz0gXCI6XCI7XG4gIH1cbiAgdmFyIGF1dGggPSBvYmpVUkwuYXV0aCB8fCBcIlwiO1xuICBpZiAoYXV0aCkge1xuICAgIGF1dGggPSBlbmNvZGVVUklDb21wb25lbnQoYXV0aCk7XG4gICAgYXV0aCA9IGF1dGgucmVwbGFjZSgvJTNBL2ksIFwiOlwiKTtcbiAgICBhdXRoICs9IFwiQFwiO1xuICB9XG4gIHZhciBob3N0ID0gXCJcIjtcbiAgaWYgKG9ialVSTC5ob3N0bmFtZSkge1xuICAgIGhvc3QgPSBhdXRoICsgKG9ialVSTC5ob3N0bmFtZS5pbmRleE9mKFwiOlwiKSA9PT0gLTEgPyBvYmpVUkwuaG9zdG5hbWUgOiBcIltcIi5jb25jYXQob2JqVVJMLmhvc3RuYW1lLCBcIl1cIikpO1xuICAgIGlmIChvYmpVUkwucG9ydCkge1xuICAgICAgaG9zdCArPSBcIjpcIi5jb25jYXQob2JqVVJMLnBvcnQpO1xuICAgIH1cbiAgfVxuICB2YXIgcGF0aG5hbWUgPSBvYmpVUkwucGF0aG5hbWUgfHwgXCJcIjtcbiAgaWYgKG9ialVSTC5zbGFzaGVzKSB7XG4gICAgaG9zdCA9IFwiLy9cIi5jb25jYXQoaG9zdCB8fCBcIlwiKTtcbiAgICBpZiAocGF0aG5hbWUgJiYgcGF0aG5hbWUuY2hhckF0KDApICE9PSBcIi9cIikge1xuICAgICAgcGF0aG5hbWUgPSBcIi9cIi5jb25jYXQocGF0aG5hbWUpO1xuICAgIH1cbiAgfSBlbHNlIGlmICghaG9zdCkge1xuICAgIGhvc3QgPSBcIlwiO1xuICB9XG4gIHZhciBzZWFyY2ggPSBvYmpVUkwuc2VhcmNoIHx8IFwiXCI7XG4gIGlmIChzZWFyY2ggJiYgc2VhcmNoLmNoYXJBdCgwKSAhPT0gXCI/XCIpIHtcbiAgICBzZWFyY2ggPSBcIj9cIi5jb25jYXQoc2VhcmNoKTtcbiAgfVxuICB2YXIgaGFzaCA9IG9ialVSTC5oYXNoIHx8IFwiXCI7XG4gIGlmIChoYXNoICYmIGhhc2guY2hhckF0KDApICE9PSBcIiNcIikge1xuICAgIGhhc2ggPSBcIiNcIi5jb25jYXQoaGFzaCk7XG4gIH1cbiAgcGF0aG5hbWUgPSBwYXRobmFtZS5yZXBsYWNlKC9bPyNdL2csXG4gIC8qKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbWF0Y2hcbiAgICogQHJldHVybnMge3N0cmluZ31cbiAgICovXG4gIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiBlbmNvZGVVUklDb21wb25lbnQobWF0Y2gpO1xuICB9KTtcbiAgc2VhcmNoID0gc2VhcmNoLnJlcGxhY2UoXCIjXCIsIFwiJTIzXCIpO1xuICByZXR1cm4gXCJcIi5jb25jYXQocHJvdG9jb2wpLmNvbmNhdChob3N0KS5jb25jYXQocGF0aG5hbWUpLmNvbmNhdChzZWFyY2gpLmNvbmNhdChoYXNoKTtcbn1cblxuLyoqXG4gKiBAcGFyYW0ge1VSTCAmIHsgZnJvbUN1cnJlbnRTY3JpcHQ/OiBib29sZWFuIH19IHBhcnNlZFVSTFxuICogQHJldHVybnMge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gY3JlYXRlU29ja2V0VVJMKHBhcnNlZFVSTCkge1xuICB2YXIgaG9zdG5hbWUgPSBwYXJzZWRVUkwuaG9zdG5hbWU7XG5cbiAgLy8gTm9kZS5qcyBtb2R1bGUgcGFyc2VzIGl0IGFzIGA6OmBcbiAgLy8gYG5ldyBVUkwodXJsU3RyaW5nLCBbYmFzZVVSTFN0cmluZ10pYCBwYXJzZXMgaXQgYXMgJ1s6Ol0nXG4gIHZhciBpc0luQWRkckFueSA9IGhvc3RuYW1lID09PSBcIjAuMC4wLjBcIiB8fCBob3N0bmFtZSA9PT0gXCI6OlwiIHx8IGhvc3RuYW1lID09PSBcIls6Ol1cIjtcblxuICAvLyB3aHkgZG8gd2UgbmVlZCB0aGlzIGNoZWNrP1xuICAvLyBob3N0bmFtZSBuL2EgZm9yIGZpbGUgcHJvdG9jb2wgKGV4YW1wbGUsIHdoZW4gdXNpbmcgZWxlY3Ryb24sIGlvbmljKVxuICAvLyBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrL3dlYnBhY2stZGV2LXNlcnZlci9wdWxsLzM4NFxuICBpZiAoaXNJbkFkZHJBbnkgJiYgc2VsZi5sb2NhdGlvbi5ob3N0bmFtZSAmJiBzZWxmLmxvY2F0aW9uLnByb3RvY29sLmluZGV4T2YoXCJodHRwXCIpID09PSAwKSB7XG4gICAgaG9zdG5hbWUgPSBzZWxmLmxvY2F0aW9uLmhvc3RuYW1lO1xuICB9XG4gIHZhciBzb2NrZXRVUkxQcm90b2NvbCA9IHBhcnNlZFVSTC5wcm90b2NvbCB8fCBzZWxmLmxvY2F0aW9uLnByb3RvY29sO1xuXG4gIC8vIFdoZW4gaHR0cHMgaXMgdXNlZCBpbiB0aGUgYXBwLCBzZWN1cmUgd2ViIHNvY2tldHMgYXJlIGFsd2F5cyBuZWNlc3NhcnkgYmVjYXVzZSB0aGUgYnJvd3NlciBkb2Vzbid0IGFjY2VwdCBub24tc2VjdXJlIHdlYiBzb2NrZXRzLlxuICBpZiAoc29ja2V0VVJMUHJvdG9jb2wgPT09IFwiYXV0bzpcIiB8fCBob3N0bmFtZSAmJiBpc0luQWRkckFueSAmJiBzZWxmLmxvY2F0aW9uLnByb3RvY29sID09PSBcImh0dHBzOlwiKSB7XG4gICAgc29ja2V0VVJMUHJvdG9jb2wgPSBzZWxmLmxvY2F0aW9uLnByb3RvY29sO1xuICB9XG4gIHNvY2tldFVSTFByb3RvY29sID0gc29ja2V0VVJMUHJvdG9jb2wucmVwbGFjZSgvXig/Omh0dHB8ListZXh0ZW5zaW9ufGZpbGUpL2ksIFwid3NcIik7XG4gIHZhciBzb2NrZXRVUkxBdXRoID0gXCJcIjtcblxuICAvLyBgbmV3IFVSTCh1cmxTdHJpbmcsIFtiYXNlVVJMc3RyaW5nXSlgIGRvZXNuJ3QgaGF2ZSBgYXV0aGAgcHJvcGVydHlcbiAgLy8gUGFyc2UgYXV0aGVudGljYXRpb24gY3JlZGVudGlhbHMgaW4gY2FzZSB3ZSBuZWVkIHRoZW1cbiAgaWYgKHBhcnNlZFVSTC51c2VybmFtZSkge1xuICAgIHNvY2tldFVSTEF1dGggPSBwYXJzZWRVUkwudXNlcm5hbWU7XG5cbiAgICAvLyBTaW5jZSBIVFRQIGJhc2ljIGF1dGhlbnRpY2F0aW9uIGRvZXMgbm90IGFsbG93IGVtcHR5IHVzZXJuYW1lLFxuICAgIC8vIHdlIG9ubHkgaW5jbHVkZSBwYXNzd29yZCBpZiB0aGUgdXNlcm5hbWUgaXMgbm90IGVtcHR5LlxuICAgIGlmIChwYXJzZWRVUkwucGFzc3dvcmQpIHtcbiAgICAgIC8vIFJlc3VsdDogPHVzZXJuYW1lPjo8cGFzc3dvcmQ+XG4gICAgICBzb2NrZXRVUkxBdXRoID0gc29ja2V0VVJMQXV0aC5jb25jYXQoXCI6XCIsIHBhcnNlZFVSTC5wYXNzd29yZCk7XG4gICAgfVxuICB9XG5cbiAgLy8gSW4gY2FzZSB0aGUgaG9zdCBpcyBhIHJhdyBJUHY2IGFkZHJlc3MsIGl0IGNhbiBiZSBlbmNsb3NlZCBpblxuICAvLyB0aGUgYnJhY2tldHMgYXMgdGhlIGJyYWNrZXRzIGFyZSBuZWVkZWQgaW4gdGhlIGZpbmFsIFVSTCBzdHJpbmcuXG4gIC8vIE5lZWQgdG8gcmVtb3ZlIHRob3NlIGFzIHVybC5mb3JtYXQgYmxpbmRseSBhZGRzIGl0cyBvd24gc2V0IG9mIGJyYWNrZXRzXG4gIC8vIGlmIHRoZSBob3N0IHN0cmluZyBjb250YWlucyBjb2xvbnMuIFRoYXQgd291bGQgbGVhZCB0byBub24td29ya2luZ1xuICAvLyBkb3VibGUgYnJhY2tldHMgKGUuZy4gW1s6Ol1dKSBob3N0XG4gIC8vXG4gIC8vIEFsbCBvZiB0aGVzZSB3ZWIgc29ja2V0IHVybCBwYXJhbXMgYXJlIG9wdGlvbmFsbHkgcGFzc2VkIGluIHRocm91Z2ggcmVzb3VyY2VRdWVyeSxcbiAgLy8gc28gd2UgbmVlZCB0byBmYWxsIGJhY2sgdG8gdGhlIGRlZmF1bHQgaWYgdGhleSBhcmUgbm90IHByb3ZpZGVkXG4gIHZhciBzb2NrZXRVUkxIb3N0bmFtZSA9IChob3N0bmFtZSB8fCBzZWxmLmxvY2F0aW9uLmhvc3RuYW1lIHx8IFwibG9jYWxob3N0XCIpLnJlcGxhY2UoL15cXFsoLiopXFxdJC8sIFwiJDFcIik7XG4gIHZhciBzb2NrZXRVUkxQb3J0ID0gcGFyc2VkVVJMLnBvcnQ7XG4gIGlmICghc29ja2V0VVJMUG9ydCB8fCBzb2NrZXRVUkxQb3J0ID09PSBcIjBcIikge1xuICAgIHNvY2tldFVSTFBvcnQgPSBzZWxmLmxvY2F0aW9uLnBvcnQ7XG4gIH1cblxuICAvLyBJZiBwYXRoIGlzIHByb3ZpZGVkIGl0J2xsIGJlIHBhc3NlZCBpbiB2aWEgdGhlIHJlc291cmNlUXVlcnkgYXMgYVxuICAvLyBxdWVyeSBwYXJhbSBzbyBpdCBoYXMgdG8gYmUgcGFyc2VkIG91dCBvZiB0aGUgcXVlcnlzdHJpbmcgaW4gb3JkZXIgZm9yIHRoZVxuICAvLyBjbGllbnQgdG8gb3BlbiB0aGUgc29ja2V0IHRvIHRoZSBjb3JyZWN0IGxvY2F0aW9uLlxuICB2YXIgc29ja2V0VVJMUGF0aG5hbWUgPSBcIi93c1wiO1xuICBpZiAocGFyc2VkVVJMLnBhdGhuYW1lICYmICFwYXJzZWRVUkwuZnJvbUN1cnJlbnRTY3JpcHQpIHtcbiAgICBzb2NrZXRVUkxQYXRobmFtZSA9IHBhcnNlZFVSTC5wYXRobmFtZTtcbiAgfVxuICByZXR1cm4gZm9ybWF0KHtcbiAgICBwcm90b2NvbDogc29ja2V0VVJMUHJvdG9jb2wsXG4gICAgYXV0aDogc29ja2V0VVJMQXV0aCxcbiAgICBob3N0bmFtZTogc29ja2V0VVJMSG9zdG5hbWUsXG4gICAgcG9ydDogc29ja2V0VVJMUG9ydCxcbiAgICBwYXRobmFtZTogc29ja2V0VVJMUGF0aG5hbWUsXG4gICAgc2xhc2hlczogdHJ1ZVxuICB9KTtcbn1cbmV4cG9ydCBkZWZhdWx0IGNyZWF0ZVNvY2tldFVSTDsiLCIvKipcbiAqIEByZXR1cm5zIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldEN1cnJlbnRTY3JpcHRTb3VyY2UoKSB7XG4gIC8vIGBkb2N1bWVudC5jdXJyZW50U2NyaXB0YCBpcyB0aGUgbW9zdCBhY2N1cmF0ZSB3YXkgdG8gZmluZCB0aGUgY3VycmVudCBzY3JpcHQsXG4gIC8vIGJ1dCBpcyBub3Qgc3VwcG9ydGVkIGluIGFsbCBicm93c2Vycy5cbiAgaWYgKGRvY3VtZW50LmN1cnJlbnRTY3JpcHQpIHtcbiAgICByZXR1cm4gZG9jdW1lbnQuY3VycmVudFNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XG4gIH1cblxuICAvLyBGYWxsYmFjayB0byBnZXR0aW5nIGFsbCBzY3JpcHRzIHJ1bm5pbmcgaW4gdGhlIGRvY3VtZW50LlxuICB2YXIgc2NyaXB0RWxlbWVudHMgPSBkb2N1bWVudC5zY3JpcHRzIHx8IFtdO1xuICB2YXIgc2NyaXB0RWxlbWVudHNXaXRoU3JjID0gQXJyYXkucHJvdG90eXBlLmZpbHRlci5jYWxsKHNjcmlwdEVsZW1lbnRzLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShcInNyY1wiKTtcbiAgfSk7XG4gIGlmIChzY3JpcHRFbGVtZW50c1dpdGhTcmMubGVuZ3RoID4gMCkge1xuICAgIHZhciBjdXJyZW50U2NyaXB0ID0gc2NyaXB0RWxlbWVudHNXaXRoU3JjW3NjcmlwdEVsZW1lbnRzV2l0aFNyYy5sZW5ndGggLSAxXTtcbiAgICByZXR1cm4gY3VycmVudFNjcmlwdC5nZXRBdHRyaWJ1dGUoXCJzcmNcIik7XG4gIH1cblxuICAvLyBGYWlsIGFzIHRoZXJlIHdhcyBubyBzY3JpcHQgdG8gdXNlLlxuICB0aHJvdyBuZXcgRXJyb3IoXCJbd2VicGFjay1kZXYtc2VydmVyXSBGYWlsZWQgdG8gZ2V0IGN1cnJlbnQgc2NyaXB0IHNvdXJjZS5cIik7XG59XG5leHBvcnQgZGVmYXVsdCBnZXRDdXJyZW50U2NyaXB0U291cmNlOyIsImltcG9ydCBsb2dnZXIgZnJvbSBcIi4uL21vZHVsZXMvbG9nZ2VyL2luZGV4LmpzXCI7XG52YXIgbmFtZSA9IFwid2VicGFjay1kZXYtc2VydmVyXCI7XG4vLyBkZWZhdWx0IGxldmVsIGlzIHNldCBvbiB0aGUgY2xpZW50IHNpZGUsIHNvIGl0IGRvZXMgbm90IG5lZWRcbi8vIHRvIGJlIHNldCBieSB0aGUgQ0xJIG9yIEFQSVxudmFyIGRlZmF1bHRMZXZlbCA9IFwiaW5mb1wiO1xuXG4vLyBvcHRpb25zIG5ldyBvcHRpb25zLCBtZXJnZSB3aXRoIG9sZCBvcHRpb25zXG4vKipcbiAqIEBwYXJhbSB7ZmFsc2UgfCB0cnVlIHwgXCJub25lXCIgfCBcImVycm9yXCIgfCBcIndhcm5cIiB8IFwiaW5mb1wiIHwgXCJsb2dcIiB8IFwidmVyYm9zZVwifSBsZXZlbFxuICogQHJldHVybnMge3ZvaWR9XG4gKi9cbmZ1bmN0aW9uIHNldExvZ0xldmVsKGxldmVsKSB7XG4gIGxvZ2dlci5jb25maWd1cmVEZWZhdWx0TG9nZ2VyKHtcbiAgICBsZXZlbDogbGV2ZWxcbiAgfSk7XG59XG5zZXRMb2dMZXZlbChkZWZhdWx0TGV2ZWwpO1xudmFyIGxvZyA9IGxvZ2dlci5nZXRMb2dnZXIobmFtZSk7XG52YXIgbG9nRW5hYmxlZEZlYXR1cmVzID0gZnVuY3Rpb24gbG9nRW5hYmxlZEZlYXR1cmVzKGZlYXR1cmVzKSB7XG4gIHZhciBlbmFibGVkRmVhdHVyZXMgPSBPYmplY3Qua2V5cyhmZWF0dXJlcyk7XG4gIGlmICghZmVhdHVyZXMgfHwgZW5hYmxlZEZlYXR1cmVzLmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybjtcbiAgfVxuICB2YXIgbG9nU3RyaW5nID0gXCJTZXJ2ZXIgc3RhcnRlZDpcIjtcblxuICAvLyBTZXJ2ZXIgc3RhcnRlZDogSG90IE1vZHVsZSBSZXBsYWNlbWVudCBlbmFibGVkLCBMaXZlIFJlbG9hZGluZyBlbmFibGVkLCBPdmVybGF5IGRpc2FibGVkLlxuICBmb3IgKHZhciBpID0gMDsgaSA8IGVuYWJsZWRGZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrZXkgPSBlbmFibGVkRmVhdHVyZXNbaV07XG4gICAgbG9nU3RyaW5nICs9IFwiIFwiLmNvbmNhdChrZXksIFwiIFwiKS5jb25jYXQoZmVhdHVyZXNba2V5XSA/IFwiZW5hYmxlZFwiIDogXCJkaXNhYmxlZFwiLCBcIixcIik7XG4gIH1cbiAgLy8gcmVwbGFjZSBsYXN0IGNvbW1hIHdpdGggYSBwZXJpb2RcbiAgbG9nU3RyaW5nID0gbG9nU3RyaW5nLnNsaWNlKDAsIC0xKS5jb25jYXQoXCIuXCIpO1xuICBsb2cuaW5mbyhsb2dTdHJpbmcpO1xufTtcbmV4cG9ydCB7IGxvZywgbG9nRW5hYmxlZEZlYXR1cmVzLCBzZXRMb2dMZXZlbCB9OyIsImltcG9ydCBnZXRDdXJyZW50U2NyaXB0U291cmNlIGZyb20gXCIuL2dldEN1cnJlbnRTY3JpcHRTb3VyY2UuanNcIjtcblxuLyoqXG4gKiBAcGFyYW0ge3N0cmluZ30gcmVzb3VyY2VRdWVyeVxuICogQHJldHVybnMge3sgW2tleTogc3RyaW5nXTogc3RyaW5nIHwgYm9vbGVhbiB9fVxuICovXG5mdW5jdGlvbiBwYXJzZVVSTChyZXNvdXJjZVF1ZXJ5KSB7XG4gIC8qKiBAdHlwZSB7eyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfX0gKi9cbiAgdmFyIG9wdGlvbnMgPSB7fTtcbiAgaWYgKHR5cGVvZiByZXNvdXJjZVF1ZXJ5ID09PSBcInN0cmluZ1wiICYmIHJlc291cmNlUXVlcnkgIT09IFwiXCIpIHtcbiAgICB2YXIgc2VhcmNoUGFyYW1zID0gcmVzb3VyY2VRdWVyeS5zbGljZSgxKS5zcGxpdChcIiZcIik7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzZWFyY2hQYXJhbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBwYWlyID0gc2VhcmNoUGFyYW1zW2ldLnNwbGl0KFwiPVwiKTtcbiAgICAgIG9wdGlvbnNbcGFpclswXV0gPSBkZWNvZGVVUklDb21wb25lbnQocGFpclsxXSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIC8vIEVsc2UsIGdldCB0aGUgdXJsIGZyb20gdGhlIDxzY3JpcHQ+IHRoaXMgZmlsZSB3YXMgY2FsbGVkIHdpdGguXG4gICAgdmFyIHNjcmlwdFNvdXJjZSA9IGdldEN1cnJlbnRTY3JpcHRTb3VyY2UoKTtcbiAgICB2YXIgc2NyaXB0U291cmNlVVJMO1xuICAgIHRyeSB7XG4gICAgICAvLyBUaGUgcGxhY2Vob2xkZXIgYGJhc2VVUkxgIHdpdGggYHdpbmRvdy5sb2NhdGlvbi5ocmVmYCxcbiAgICAgIC8vIGlzIHRvIGFsbG93IHBhcnNpbmcgb2YgcGF0aC1yZWxhdGl2ZSBvciBwcm90b2NvbC1yZWxhdGl2ZSBVUkxzLFxuICAgICAgLy8gYW5kIHdpbGwgaGF2ZSBubyBlZmZlY3QgaWYgYHNjcmlwdFNvdXJjZWAgaXMgYSBmdWxseSB2YWxpZCBVUkwuXG4gICAgICBzY3JpcHRTb3VyY2VVUkwgPSBuZXcgVVJMKHNjcmlwdFNvdXJjZSwgc2VsZi5sb2NhdGlvbi5ocmVmKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgLy8gVVJMIHBhcnNpbmcgZmFpbGVkLCBkbyBub3RoaW5nLlxuICAgICAgLy8gV2Ugd2lsbCBzdGlsbCBwcm9jZWVkIHRvIHNlZSBpZiB3ZSBjYW4gcmVjb3ZlciB1c2luZyBgcmVzb3VyY2VRdWVyeWBcbiAgICB9XG4gICAgaWYgKHNjcmlwdFNvdXJjZVVSTCkge1xuICAgICAgb3B0aW9ucyA9IHNjcmlwdFNvdXJjZVVSTDtcbiAgICAgIG9wdGlvbnMuZnJvbUN1cnJlbnRTY3JpcHQgPSB0cnVlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cbmV4cG9ydCBkZWZhdWx0IHBhcnNlVVJMOyIsImltcG9ydCBob3RFbWl0dGVyIGZyb20gXCJ3ZWJwYWNrL2hvdC9lbWl0dGVyLmpzXCI7XG5pbXBvcnQgeyBsb2cgfSBmcm9tIFwiLi9sb2cuanNcIjtcblxuLyoqIEB0eXBlZGVmIHtpbXBvcnQoXCIuLi9pbmRleFwiKS5PcHRpb25zfSBPcHRpb25zXG4vKiogQHR5cGVkZWYge2ltcG9ydChcIi4uL2luZGV4XCIpLlN0YXR1c30gU3RhdHVzXG5cbi8qKlxuICogQHBhcmFtIHtPcHRpb25zfSBvcHRpb25zXG4gKiBAcGFyYW0ge1N0YXR1c30gc3RhdHVzXG4gKi9cbmZ1bmN0aW9uIHJlbG9hZEFwcChfcmVmLCBzdGF0dXMpIHtcbiAgdmFyIGhvdCA9IF9yZWYuaG90LFxuICAgIGxpdmVSZWxvYWQgPSBfcmVmLmxpdmVSZWxvYWQ7XG4gIGlmIChzdGF0dXMuaXNVbmxvYWRpbmcpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgdmFyIGN1cnJlbnRIYXNoID0gc3RhdHVzLmN1cnJlbnRIYXNoLFxuICAgIHByZXZpb3VzSGFzaCA9IHN0YXR1cy5wcmV2aW91c0hhc2g7XG4gIHZhciBpc0luaXRpYWwgPSBjdXJyZW50SGFzaC5pbmRleE9mKCAvKiogQHR5cGUge3N0cmluZ30gKi9wcmV2aW91c0hhc2gpID49IDA7XG4gIGlmIChpc0luaXRpYWwpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICAvKipcbiAgICogQHBhcmFtIHtXaW5kb3d9IHJvb3RXaW5kb3dcbiAgICogQHBhcmFtIHtudW1iZXJ9IGludGVydmFsSWRcbiAgICovXG4gIGZ1bmN0aW9uIGFwcGx5UmVsb2FkKHJvb3RXaW5kb3csIGludGVydmFsSWQpIHtcbiAgICBjbGVhckludGVydmFsKGludGVydmFsSWQpO1xuICAgIGxvZy5pbmZvKFwiQXBwIHVwZGF0ZWQuIFJlbG9hZGluZy4uLlwiKTtcbiAgICByb290V2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuICB9XG4gIHZhciBzZWFyY2ggPSBzZWxmLmxvY2F0aW9uLnNlYXJjaC50b0xvd2VyQ2FzZSgpO1xuICB2YXIgYWxsb3dUb0hvdCA9IHNlYXJjaC5pbmRleE9mKFwid2VicGFjay1kZXYtc2VydmVyLWhvdD1mYWxzZVwiKSA9PT0gLTE7XG4gIHZhciBhbGxvd1RvTGl2ZVJlbG9hZCA9IHNlYXJjaC5pbmRleE9mKFwid2VicGFjay1kZXYtc2VydmVyLWxpdmUtcmVsb2FkPWZhbHNlXCIpID09PSAtMTtcbiAgaWYgKGhvdCAmJiBhbGxvd1RvSG90KSB7XG4gICAgbG9nLmluZm8oXCJBcHAgaG90IHVwZGF0ZS4uLlwiKTtcbiAgICBob3RFbWl0dGVyLmVtaXQoXCJ3ZWJwYWNrSG90VXBkYXRlXCIsIHN0YXR1cy5jdXJyZW50SGFzaCk7XG4gICAgaWYgKHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiICYmIHNlbGYud2luZG93KSB7XG4gICAgICAvLyBicm9hZGNhc3QgdXBkYXRlIHRvIHdpbmRvd1xuICAgICAgc2VsZi5wb3N0TWVzc2FnZShcIndlYnBhY2tIb3RVcGRhdGVcIi5jb25jYXQoc3RhdHVzLmN1cnJlbnRIYXNoKSwgXCIqXCIpO1xuICAgIH1cbiAgfVxuICAvLyBhbGxvdyByZWZyZXNoaW5nIHRoZSBwYWdlIG9ubHkgaWYgbGl2ZVJlbG9hZCBpc24ndCBkaXNhYmxlZFxuICBlbHNlIGlmIChsaXZlUmVsb2FkICYmIGFsbG93VG9MaXZlUmVsb2FkKSB7XG4gICAgdmFyIHJvb3RXaW5kb3cgPSBzZWxmO1xuXG4gICAgLy8gdXNlIHBhcmVudCB3aW5kb3cgZm9yIHJlbG9hZCAoaW4gY2FzZSB3ZSdyZSBpbiBhbiBpZnJhbWUgd2l0aCBubyB2YWxpZCBzcmMpXG4gICAgdmFyIGludGVydmFsSWQgPSBzZWxmLnNldEludGVydmFsKGZ1bmN0aW9uICgpIHtcbiAgICAgIGlmIChyb290V2luZG93LmxvY2F0aW9uLnByb3RvY29sICE9PSBcImFib3V0OlwiKSB7XG4gICAgICAgIC8vIHJlbG9hZCBpbW1lZGlhdGVseSBpZiBwcm90b2NvbCBpcyB2YWxpZFxuICAgICAgICBhcHBseVJlbG9hZChyb290V2luZG93LCBpbnRlcnZhbElkKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJvb3RXaW5kb3cgPSByb290V2luZG93LnBhcmVudDtcbiAgICAgICAgaWYgKHJvb3RXaW5kb3cucGFyZW50ID09PSByb290V2luZG93KSB7XG4gICAgICAgICAgLy8gaWYgcGFyZW50IGVxdWFscyBjdXJyZW50IHdpbmRvdyB3ZSd2ZSByZWFjaGVkIHRoZSByb290IHdoaWNoIHdvdWxkIGNvbnRpbnVlIGZvcmV2ZXIsIHNvIHRyaWdnZXIgYSByZWxvYWQgYW55d2F5c1xuICAgICAgICAgIGFwcGx5UmVsb2FkKHJvb3RXaW5kb3csIGludGVydmFsSWQpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSk7XG4gIH1cbn1cbmV4cG9ydCBkZWZhdWx0IHJlbG9hZEFwcDsiLCIvKiBnbG9iYWwgX19yZXNvdXJjZVF1ZXJ5IFdvcmtlckdsb2JhbFNjb3BlICovXG5cbi8vIFNlbmQgbWVzc2FnZXMgdG8gdGhlIG91dHNpZGUsIHNvIHBsdWdpbnMgY2FuIGNvbnN1bWUgaXQuXG4vKipcbiAqIEBwYXJhbSB7c3RyaW5nfSB0eXBlXG4gKiBAcGFyYW0ge2FueX0gW2RhdGFdXG4gKi9cbmZ1bmN0aW9uIHNlbmRNc2codHlwZSwgZGF0YSkge1xuICBpZiAodHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgJiYgKHR5cGVvZiBXb3JrZXJHbG9iYWxTY29wZSA9PT0gXCJ1bmRlZmluZWRcIiB8fCAhKHNlbGYgaW5zdGFuY2VvZiBXb3JrZXJHbG9iYWxTY29wZSkpKSB7XG4gICAgc2VsZi5wb3N0TWVzc2FnZSh7XG4gICAgICB0eXBlOiBcIndlYnBhY2tcIi5jb25jYXQodHlwZSksXG4gICAgICBkYXRhOiBkYXRhXG4gICAgfSwgXCIqXCIpO1xuICB9XG59XG5leHBvcnQgZGVmYXVsdCBzZW5kTXNnOyIsInZhciBhbnNpUmVnZXggPSBuZXcgUmVnRXhwKFtcIltcXFxcdTAwMUJcXFxcdTAwOUJdW1tcXFxcXSgpIzs/XSooPzooPzooPzooPzo7Wy1hLXpBLVpcXFxcZFxcXFwvIyYuOj0/JUB+X10rKSp8W2EtekEtWlxcXFxkXSsoPzo7Wy1hLXpBLVpcXFxcZFxcXFwvIyYuOj0/JUB+X10qKSopP1xcXFx1MDAwNylcIiwgXCIoPzooPzpcXFxcZHsxLDR9KD86O1xcXFxkezAsNH0pKik/W1xcXFxkQS1QUi1UWmNmLW5xLXV5PT48fl0pKVwiXS5qb2luKFwifFwiKSwgXCJnXCIpO1xuXG4vKipcbiAqXG4gKiBTdHJpcCBbQU5TSSBlc2NhcGUgY29kZXNdKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0FOU0lfZXNjYXBlX2NvZGUpIGZyb20gYSBzdHJpbmcuXG4gKiBBZGFwdGVkIGZyb20gY29kZSBvcmlnaW5hbGx5IHJlbGVhc2VkIGJ5IFNpbmRyZSBTb3JodXNcbiAqIExpY2Vuc2VkIHRoZSBNSVQgTGljZW5zZVxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBzdHJpbmdcbiAqIEByZXR1cm4ge3N0cmluZ31cbiAqL1xuZnVuY3Rpb24gc3RyaXBBbnNpKHN0cmluZykge1xuICBpZiAodHlwZW9mIHN0cmluZyAhPT0gXCJzdHJpbmdcIikge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJFeHBlY3RlZCBhIGBzdHJpbmdgLCBnb3QgYFwiLmNvbmNhdCh0eXBlb2Ygc3RyaW5nLCBcImBcIikpO1xuICB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShhbnNpUmVnZXgsIFwiXCIpO1xufVxuZXhwb3J0IGRlZmF1bHQgc3RyaXBBbnNpOyIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vKiBnbG9iYWxzIF9fd2VicGFja19oYXNoX18gKi9cbmlmIChtb2R1bGUuaG90KSB7XG5cdC8qKiBAdHlwZSB7dW5kZWZpbmVkfHN0cmluZ30gKi9cblx0dmFyIGxhc3RIYXNoO1xuXHR2YXIgdXBUb0RhdGUgPSBmdW5jdGlvbiB1cFRvRGF0ZSgpIHtcblx0XHRyZXR1cm4gLyoqIEB0eXBlIHtzdHJpbmd9ICovIChsYXN0SGFzaCkuaW5kZXhPZihfX3dlYnBhY2tfaGFzaF9fKSA+PSAwO1xuXHR9O1xuXHR2YXIgbG9nID0gcmVxdWlyZShcIi4vbG9nXCIpO1xuXHR2YXIgY2hlY2sgPSBmdW5jdGlvbiBjaGVjaygpIHtcblx0XHRtb2R1bGUuaG90XG5cdFx0XHQuY2hlY2sodHJ1ZSlcblx0XHRcdC50aGVuKGZ1bmN0aW9uICh1cGRhdGVkTW9kdWxlcykge1xuXHRcdFx0XHRpZiAoIXVwZGF0ZWRNb2R1bGVzKSB7XG5cdFx0XHRcdFx0bG9nKFxuXHRcdFx0XHRcdFx0XCJ3YXJuaW5nXCIsXG5cdFx0XHRcdFx0XHRcIltITVJdIENhbm5vdCBmaW5kIHVwZGF0ZS4gXCIgK1xuXHRcdFx0XHRcdFx0XHQodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIlxuXHRcdFx0XHRcdFx0XHRcdD8gXCJOZWVkIHRvIGRvIGEgZnVsbCByZWxvYWQhXCJcblx0XHRcdFx0XHRcdFx0XHQ6IFwiUGxlYXNlIHJlbG9hZCBtYW51YWxseSFcIilcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGxvZyhcblx0XHRcdFx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XHRcdFx0XCJbSE1SXSAoUHJvYmFibHkgYmVjYXVzZSBvZiByZXN0YXJ0aW5nIHRoZSB3ZWJwYWNrLWRldi1zZXJ2ZXIpXCJcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGlmICh0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdFx0XHR3aW5kb3cubG9jYXRpb24ucmVsb2FkKCk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmICghdXBUb0RhdGUoKSkge1xuXHRcdFx0XHRcdGNoZWNrKCk7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXF1aXJlKFwiLi9sb2ctYXBwbHktcmVzdWx0XCIpKHVwZGF0ZWRNb2R1bGVzLCB1cGRhdGVkTW9kdWxlcyk7XG5cblx0XHRcdFx0aWYgKHVwVG9EYXRlKCkpIHtcblx0XHRcdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gQXBwIGlzIHVwIHRvIGRhdGUuXCIpO1xuXHRcdFx0XHR9XG5cdFx0XHR9KVxuXHRcdFx0LmNhdGNoKGZ1bmN0aW9uIChlcnIpIHtcblx0XHRcdFx0dmFyIHN0YXR1cyA9IG1vZHVsZS5ob3Quc3RhdHVzKCk7XG5cdFx0XHRcdGlmIChbXCJhYm9ydFwiLCBcImZhaWxcIl0uaW5kZXhPZihzdGF0dXMpID49IDApIHtcblx0XHRcdFx0XHRsb2coXG5cdFx0XHRcdFx0XHRcIndhcm5pbmdcIixcblx0XHRcdFx0XHRcdFwiW0hNUl0gQ2Fubm90IGFwcGx5IHVwZGF0ZS4gXCIgK1xuXHRcdFx0XHRcdFx0XHQodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIlxuXHRcdFx0XHRcdFx0XHRcdD8gXCJOZWVkIHRvIGRvIGEgZnVsbCByZWxvYWQhXCJcblx0XHRcdFx0XHRcdFx0XHQ6IFwiUGxlYXNlIHJlbG9hZCBtYW51YWxseSFcIilcblx0XHRcdFx0XHQpO1xuXHRcdFx0XHRcdGxvZyhcIndhcm5pbmdcIiwgXCJbSE1SXSBcIiArIGxvZy5mb3JtYXRFcnJvcihlcnIpKTtcblx0XHRcdFx0XHRpZiAodHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRcdFx0d2luZG93LmxvY2F0aW9uLnJlbG9hZCgpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gVXBkYXRlIGZhaWxlZDogXCIgKyBsb2cuZm9ybWF0RXJyb3IoZXJyKSk7XG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXHR9O1xuXHR2YXIgaG90RW1pdHRlciA9IHJlcXVpcmUoXCIuL2VtaXR0ZXJcIik7XG5cdGhvdEVtaXR0ZXIub24oXCJ3ZWJwYWNrSG90VXBkYXRlXCIsIGZ1bmN0aW9uIChjdXJyZW50SGFzaCkge1xuXHRcdGxhc3RIYXNoID0gY3VycmVudEhhc2g7XG5cdFx0aWYgKCF1cFRvRGF0ZSgpICYmIG1vZHVsZS5ob3Quc3RhdHVzKCkgPT09IFwiaWRsZVwiKSB7XG5cdFx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gQ2hlY2tpbmcgZm9yIHVwZGF0ZXMgb24gdGhlIHNlcnZlci4uLlwiKTtcblx0XHRcdGNoZWNrKCk7XG5cdFx0fVxuXHR9KTtcblx0bG9nKFwiaW5mb1wiLCBcIltITVJdIFdhaXRpbmcgZm9yIHVwZGF0ZSBzaWduYWwgZnJvbSBXRFMuLi5cIik7XG59IGVsc2Uge1xuXHR0aHJvdyBuZXcgRXJyb3IoXCJbSE1SXSBIb3QgTW9kdWxlIFJlcGxhY2VtZW50IGlzIGRpc2FibGVkLlwiKTtcbn1cbiIsInZhciBFdmVudEVtaXR0ZXIgPSByZXF1aXJlKFwiZXZlbnRzXCIpO1xubW9kdWxlLmV4cG9ydHMgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG4iLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuXG4vKipcbiAqIEBwYXJhbSB7KHN0cmluZyB8IG51bWJlcilbXX0gdXBkYXRlZE1vZHVsZXMgdXBkYXRlZCBtb2R1bGVzXG4gKiBAcGFyYW0geyhzdHJpbmcgfCBudW1iZXIpW10gfCBudWxsfSByZW5ld2VkTW9kdWxlcyByZW5ld2VkIG1vZHVsZXNcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAodXBkYXRlZE1vZHVsZXMsIHJlbmV3ZWRNb2R1bGVzKSB7XG5cdHZhciB1bmFjY2VwdGVkTW9kdWxlcyA9IHVwZGF0ZWRNb2R1bGVzLmZpbHRlcihmdW5jdGlvbiAobW9kdWxlSWQpIHtcblx0XHRyZXR1cm4gcmVuZXdlZE1vZHVsZXMgJiYgcmVuZXdlZE1vZHVsZXMuaW5kZXhPZihtb2R1bGVJZCkgPCAwO1xuXHR9KTtcblx0dmFyIGxvZyA9IHJlcXVpcmUoXCIuL2xvZ1wiKTtcblxuXHRpZiAodW5hY2NlcHRlZE1vZHVsZXMubGVuZ3RoID4gMCkge1xuXHRcdGxvZyhcblx0XHRcdFwid2FybmluZ1wiLFxuXHRcdFx0XCJbSE1SXSBUaGUgZm9sbG93aW5nIG1vZHVsZXMgY291bGRuJ3QgYmUgaG90IHVwZGF0ZWQ6IChUaGV5IHdvdWxkIG5lZWQgYSBmdWxsIHJlbG9hZCEpXCJcblx0XHQpO1xuXHRcdHVuYWNjZXB0ZWRNb2R1bGVzLmZvckVhY2goZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRsb2coXCJ3YXJuaW5nXCIsIFwiW0hNUl0gIC0gXCIgKyBtb2R1bGVJZCk7XG5cdFx0fSk7XG5cdH1cblxuXHRpZiAoIXJlbmV3ZWRNb2R1bGVzIHx8IHJlbmV3ZWRNb2R1bGVzLmxlbmd0aCA9PT0gMCkge1xuXHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSBOb3RoaW5nIGhvdCB1cGRhdGVkLlwiKTtcblx0fSBlbHNlIHtcblx0XHRsb2coXCJpbmZvXCIsIFwiW0hNUl0gVXBkYXRlZCBtb2R1bGVzOlwiKTtcblx0XHRyZW5ld2VkTW9kdWxlcy5mb3JFYWNoKGZ1bmN0aW9uIChtb2R1bGVJZCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtb2R1bGVJZCA9PT0gXCJzdHJpbmdcIiAmJiBtb2R1bGVJZC5pbmRleE9mKFwiIVwiKSAhPT0gLTEpIHtcblx0XHRcdFx0dmFyIHBhcnRzID0gbW9kdWxlSWQuc3BsaXQoXCIhXCIpO1xuXHRcdFx0XHRsb2cuZ3JvdXBDb2xsYXBzZWQoXCJpbmZvXCIsIFwiW0hNUl0gIC0gXCIgKyBwYXJ0cy5wb3AoKSk7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdFx0bG9nLmdyb3VwRW5kKFwiaW5mb1wiKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGxvZyhcImluZm9cIiwgXCJbSE1SXSAgLSBcIiArIG1vZHVsZUlkKTtcblx0XHRcdH1cblx0XHR9KTtcblx0XHR2YXIgbnVtYmVySWRzID0gcmVuZXdlZE1vZHVsZXMuZXZlcnkoZnVuY3Rpb24gKG1vZHVsZUlkKSB7XG5cdFx0XHRyZXR1cm4gdHlwZW9mIG1vZHVsZUlkID09PSBcIm51bWJlclwiO1xuXHRcdH0pO1xuXHRcdGlmIChudW1iZXJJZHMpXG5cdFx0XHRsb2coXG5cdFx0XHRcdFwiaW5mb1wiLFxuXHRcdFx0XHQnW0hNUl0gQ29uc2lkZXIgdXNpbmcgdGhlIG9wdGltaXphdGlvbi5tb2R1bGVJZHM6IFwibmFtZWRcIiBmb3IgbW9kdWxlIG5hbWVzLidcblx0XHRcdCk7XG5cdH1cbn07XG4iLCIvKiogQHR5cGVkZWYge1wiaW5mb1wiIHwgXCJ3YXJuaW5nXCIgfCBcImVycm9yXCJ9IExvZ0xldmVsICovXG5cbi8qKiBAdHlwZSB7TG9nTGV2ZWx9ICovXG52YXIgbG9nTGV2ZWwgPSBcImluZm9cIjtcblxuZnVuY3Rpb24gZHVtbXkoKSB7fVxuXG4vKipcbiAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxldmVsIGxvZyBsZXZlbFxuICogQHJldHVybnMge2Jvb2xlYW59IHRydWUsIGlmIHNob3VsZCBsb2dcbiAqL1xuZnVuY3Rpb24gc2hvdWxkTG9nKGxldmVsKSB7XG5cdHZhciBzaG91bGRMb2cgPVxuXHRcdChsb2dMZXZlbCA9PT0gXCJpbmZvXCIgJiYgbGV2ZWwgPT09IFwiaW5mb1wiKSB8fFxuXHRcdChbXCJpbmZvXCIsIFwid2FybmluZ1wiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcIndhcm5pbmdcIikgfHxcblx0XHQoW1wiaW5mb1wiLCBcIndhcm5pbmdcIiwgXCJlcnJvclwiXS5pbmRleE9mKGxvZ0xldmVsKSA+PSAwICYmIGxldmVsID09PSBcImVycm9yXCIpO1xuXHRyZXR1cm4gc2hvdWxkTG9nO1xufVxuXG4vKipcbiAqIEBwYXJhbSB7KG1zZz86IHN0cmluZykgPT4gdm9pZH0gbG9nRm4gbG9nIGZ1bmN0aW9uXG4gKiBAcmV0dXJucyB7KGxldmVsOiBMb2dMZXZlbCwgbXNnPzogc3RyaW5nKSA9PiB2b2lkfSBmdW5jdGlvbiB0aGF0IGxvZ3Mgd2hlbiBsb2cgbGV2ZWwgaXMgc3VmZmljaWVudFxuICovXG5mdW5jdGlvbiBsb2dHcm91cChsb2dGbikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKGxldmVsLCBtc2cpIHtcblx0XHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdFx0bG9nRm4obXNnKTtcblx0XHR9XG5cdH07XG59XG5cbi8qKlxuICogQHBhcmFtIHtMb2dMZXZlbH0gbGV2ZWwgbG9nIGxldmVsXG4gKiBAcGFyYW0ge3N0cmluZ3xFcnJvcn0gbXNnIG1lc3NhZ2VcbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAobGV2ZWwsIG1zZykge1xuXHRpZiAoc2hvdWxkTG9nKGxldmVsKSkge1xuXHRcdGlmIChsZXZlbCA9PT0gXCJpbmZvXCIpIHtcblx0XHRcdGNvbnNvbGUubG9nKG1zZyk7XG5cdFx0fSBlbHNlIGlmIChsZXZlbCA9PT0gXCJ3YXJuaW5nXCIpIHtcblx0XHRcdGNvbnNvbGUud2Fybihtc2cpO1xuXHRcdH0gZWxzZSBpZiAobGV2ZWwgPT09IFwiZXJyb3JcIikge1xuXHRcdFx0Y29uc29sZS5lcnJvcihtc2cpO1xuXHRcdH1cblx0fVxufTtcblxudmFyIGdyb3VwID0gY29uc29sZS5ncm91cCB8fCBkdW1teTtcbnZhciBncm91cENvbGxhcHNlZCA9IGNvbnNvbGUuZ3JvdXBDb2xsYXBzZWQgfHwgZHVtbXk7XG52YXIgZ3JvdXBFbmQgPSBjb25zb2xlLmdyb3VwRW5kIHx8IGR1bW15O1xuXG5tb2R1bGUuZXhwb3J0cy5ncm91cCA9IGxvZ0dyb3VwKGdyb3VwKTtcblxubW9kdWxlLmV4cG9ydHMuZ3JvdXBDb2xsYXBzZWQgPSBsb2dHcm91cChncm91cENvbGxhcHNlZCk7XG5cbm1vZHVsZS5leHBvcnRzLmdyb3VwRW5kID0gbG9nR3JvdXAoZ3JvdXBFbmQpO1xuXG4vKipcbiAqIEBwYXJhbSB7TG9nTGV2ZWx9IGxldmVsIGxvZyBsZXZlbFxuICovXG5tb2R1bGUuZXhwb3J0cy5zZXRMb2dMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCkge1xuXHRsb2dMZXZlbCA9IGxldmVsO1xufTtcblxuLyoqXG4gKiBAcGFyYW0ge0Vycm9yfSBlcnIgZXJyb3JcbiAqIEByZXR1cm5zIHtzdHJpbmd9IGZvcm1hdHRlZCBlcnJvclxuICovXG5tb2R1bGUuZXhwb3J0cy5mb3JtYXRFcnJvciA9IGZ1bmN0aW9uIChlcnIpIHtcblx0dmFyIG1lc3NhZ2UgPSBlcnIubWVzc2FnZTtcblx0dmFyIHN0YWNrID0gZXJyLnN0YWNrO1xuXHRpZiAoIXN0YWNrKSB7XG5cdFx0cmV0dXJuIG1lc3NhZ2U7XG5cdH0gZWxzZSBpZiAoc3RhY2suaW5kZXhPZihtZXNzYWdlKSA8IDApIHtcblx0XHRyZXR1cm4gbWVzc2FnZSArIFwiXFxuXCIgKyBzdGFjaztcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gc3RhY2s7XG5cdH1cbn07XG4iLCJjb25zdCBERUZBVUxUX0NIVU5LX1NJWkUgPSAyNTYgKiAxMDI0O1xuZXhwb3J0IGZ1bmN0aW9uIG1ha2VBcnJheUJ1ZmZlckl0ZXJhdG9yKGFycmF5QnVmZmVyKSB7XG4gIGxldCBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB7fTtcbiAgcmV0dXJuIGZ1bmN0aW9uKiAoKSB7XG4gICAgY29uc3Qge1xuICAgICAgY2h1bmtTaXplID0gREVGQVVMVF9DSFVOS19TSVpFXG4gICAgfSA9IG9wdGlvbnM7XG4gICAgbGV0IGJ5dGVPZmZzZXQgPSAwO1xuICAgIHdoaWxlIChieXRlT2Zmc2V0IDwgYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgY29uc3QgY2h1bmtCeXRlTGVuZ3RoID0gTWF0aC5taW4oYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCAtIGJ5dGVPZmZzZXQsIGNodW5rU2l6ZSk7XG4gICAgICBjb25zdCBjaHVuayA9IG5ldyBBcnJheUJ1ZmZlcihjaHVua0J5dGVMZW5ndGgpO1xuICAgICAgY29uc3Qgc291cmNlQXJyYXkgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlciwgYnl0ZU9mZnNldCwgY2h1bmtCeXRlTGVuZ3RoKTtcbiAgICAgIGNvbnN0IGNodW5rQXJyYXkgPSBuZXcgVWludDhBcnJheShjaHVuayk7XG4gICAgICBjaHVua0FycmF5LnNldChzb3VyY2VBcnJheSk7XG4gICAgICBieXRlT2Zmc2V0ICs9IGNodW5rQnl0ZUxlbmd0aDtcbiAgICAgIHlpZWxkIGNodW5rO1xuICAgIH1cbiAgfSgpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWFrZS1hcnJheS1idWZmZXItaXRlcmF0b3IuanMubWFwIiwiY29uc3QgREVGQVVMVF9DSFVOS19TSVpFID0gMTAyNCAqIDEwMjQ7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24qIG1ha2VCbG9iSXRlcmF0b3IoYmxvYiwgb3B0aW9ucykge1xuICBjb25zdCBjaHVua1NpemUgPSAob3B0aW9ucyA9PT0gbnVsbCB8fCBvcHRpb25zID09PSB2b2lkIDAgPyB2b2lkIDAgOiBvcHRpb25zLmNodW5rU2l6ZSkgfHwgREVGQVVMVF9DSFVOS19TSVpFO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgd2hpbGUgKG9mZnNldCA8IGJsb2Iuc2l6ZSkge1xuICAgIGNvbnN0IGVuZCA9IG9mZnNldCArIGNodW5rU2l6ZTtcbiAgICBjb25zdCBjaHVuayA9IGF3YWl0IGJsb2Iuc2xpY2Uob2Zmc2V0LCBlbmQpLmFycmF5QnVmZmVyKCk7XG4gICAgb2Zmc2V0ID0gZW5kO1xuICAgIHlpZWxkIGNodW5rO1xuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWtlLWJsb2ItaXRlcmF0b3IuanMubWFwIiwiaW1wb3J0IHsgbWFrZVN0cmluZ0l0ZXJhdG9yIH0gZnJvbSBcIi4vbWFrZS1zdHJpbmctaXRlcmF0b3IuanNcIjtcbmltcG9ydCB7IG1ha2VBcnJheUJ1ZmZlckl0ZXJhdG9yIH0gZnJvbSBcIi4vbWFrZS1hcnJheS1idWZmZXItaXRlcmF0b3IuanNcIjtcbmltcG9ydCB7IG1ha2VCbG9iSXRlcmF0b3IgfSBmcm9tIFwiLi9tYWtlLWJsb2ItaXRlcmF0b3IuanNcIjtcbmltcG9ydCB7IG1ha2VTdHJlYW1JdGVyYXRvciB9IGZyb20gXCIuL21ha2Utc3RyZWFtLWl0ZXJhdG9yLmpzXCI7XG5pbXBvcnQgeyBpc0Jsb2IsIGlzUmVhZGFibGVTdHJlYW0sIGlzUmVzcG9uc2UgfSBmcm9tIFwiLi4vLi4vamF2YXNjcmlwdC11dGlscy9pcy10eXBlLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gbWFrZUl0ZXJhdG9yKGRhdGEsIG9wdGlvbnMpIHtcbiAgaWYgKHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBtYWtlU3RyaW5nSXRlcmF0b3IoZGF0YSwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBtYWtlQXJyYXlCdWZmZXJJdGVyYXRvcihkYXRhLCBvcHRpb25zKTtcbiAgfVxuICBpZiAoaXNCbG9iKGRhdGEpKSB7XG4gICAgcmV0dXJuIG1ha2VCbG9iSXRlcmF0b3IoZGF0YSwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKGlzUmVhZGFibGVTdHJlYW0oZGF0YSkpIHtcbiAgICByZXR1cm4gbWFrZVN0cmVhbUl0ZXJhdG9yKGRhdGEsIG9wdGlvbnMpO1xuICB9XG4gIGlmIChpc1Jlc3BvbnNlKGRhdGEpKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBkYXRhO1xuICAgIHJldHVybiBtYWtlU3RyZWFtSXRlcmF0b3IocmVzcG9uc2UuYm9keSwgb3B0aW9ucyk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKCdtYWtlSXRlcmF0b3InKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1ha2UtaXRlcmF0b3IuanMubWFwIiwiaW1wb3J0IHsgaXNCcm93c2VyLCB0b0FycmF5QnVmZmVyIH0gZnJvbSAnQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzJztcbmV4cG9ydCBmdW5jdGlvbiBtYWtlU3RyZWFtSXRlcmF0b3Ioc3RyZWFtLCBvcHRpb25zKSB7XG4gIHJldHVybiBpc0Jyb3dzZXIgPyBtYWtlQnJvd3NlclN0cmVhbUl0ZXJhdG9yKHN0cmVhbSwgb3B0aW9ucykgOiBtYWtlTm9kZVN0cmVhbUl0ZXJhdG9yKHN0cmVhbSwgb3B0aW9ucyk7XG59XG5hc3luYyBmdW5jdGlvbiogbWFrZUJyb3dzZXJTdHJlYW1JdGVyYXRvcihzdHJlYW0sIG9wdGlvbnMpIHtcbiAgY29uc3QgcmVhZGVyID0gc3RyZWFtLmdldFJlYWRlcigpO1xuICBsZXQgbmV4dEJhdGNoUHJvbWlzZTtcbiAgdHJ5IHtcbiAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgY29uc3QgY3VycmVudEJhdGNoUHJvbWlzZSA9IG5leHRCYXRjaFByb21pc2UgfHwgcmVhZGVyLnJlYWQoKTtcbiAgICAgIGlmIChvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLl9zdHJlYW1SZWFkQWhlYWQpIHtcbiAgICAgICAgbmV4dEJhdGNoUHJvbWlzZSA9IHJlYWRlci5yZWFkKCk7XG4gICAgICB9XG4gICAgICBjb25zdCB7XG4gICAgICAgIGRvbmUsXG4gICAgICAgIHZhbHVlXG4gICAgICB9ID0gYXdhaXQgY3VycmVudEJhdGNoUHJvbWlzZTtcbiAgICAgIGlmIChkb25lKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHlpZWxkIHRvQXJyYXlCdWZmZXIodmFsdWUpO1xuICAgIH1cbiAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICByZWFkZXIucmVsZWFzZUxvY2soKTtcbiAgfVxufVxuYXN5bmMgZnVuY3Rpb24qIG1ha2VOb2RlU3RyZWFtSXRlcmF0b3Ioc3RyZWFtLCBvcHRpb25zKSB7XG4gIGZvciBhd2FpdCAoY29uc3QgY2h1bmsgb2Ygc3RyZWFtKSB7XG4gICAgeWllbGQgdG9BcnJheUJ1ZmZlcihjaHVuayk7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1ha2Utc3RyZWFtLWl0ZXJhdG9yLmpzLm1hcCIsImNvbnN0IERFRkFVTFRfQ0hVTktfU0laRSA9IDI1NiAqIDEwMjQ7XG5leHBvcnQgZnVuY3Rpb24qIG1ha2VTdHJpbmdJdGVyYXRvcihzdHJpbmcsIG9wdGlvbnMpIHtcbiAgY29uc3QgY2h1bmtTaXplID0gKG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5jaHVua1NpemUpIHx8IERFRkFVTFRfQ0hVTktfU0laRTtcbiAgbGV0IG9mZnNldCA9IDA7XG4gIGNvbnN0IHRleHRFbmNvZGVyID0gbmV3IFRleHRFbmNvZGVyKCk7XG4gIHdoaWxlIChvZmZzZXQgPCBzdHJpbmcubGVuZ3RoKSB7XG4gICAgY29uc3QgY2h1bmtMZW5ndGggPSBNYXRoLm1pbihzdHJpbmcubGVuZ3RoIC0gb2Zmc2V0LCBjaHVua1NpemUpO1xuICAgIGNvbnN0IGNodW5rID0gc3RyaW5nLnNsaWNlKG9mZnNldCwgb2Zmc2V0ICsgY2h1bmtMZW5ndGgpO1xuICAgIG9mZnNldCArPSBjaHVua0xlbmd0aDtcbiAgICB5aWVsZCB0ZXh0RW5jb2Rlci5lbmNvZGUoY2h1bmspO1xuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1tYWtlLXN0cmluZy1pdGVyYXRvci5qcy5tYXAiLCJjb25zdCBpc0Jvb2xlYW4gPSB4ID0+IHR5cGVvZiB4ID09PSAnYm9vbGVhbic7XG5jb25zdCBpc0Z1bmN0aW9uID0geCA9PiB0eXBlb2YgeCA9PT0gJ2Z1bmN0aW9uJztcbmV4cG9ydCBjb25zdCBpc09iamVjdCA9IHggPT4geCAhPT0gbnVsbCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCc7XG5leHBvcnQgY29uc3QgaXNQdXJlT2JqZWN0ID0geCA9PiBpc09iamVjdCh4KSAmJiB4LmNvbnN0cnVjdG9yID09PSB7fS5jb25zdHJ1Y3RvcjtcbmV4cG9ydCBjb25zdCBpc1Byb21pc2UgPSB4ID0+IGlzT2JqZWN0KHgpICYmIGlzRnVuY3Rpb24oeC50aGVuKTtcbmV4cG9ydCBjb25zdCBpc0l0ZXJhYmxlID0geCA9PiBCb29sZWFuKHgpICYmIHR5cGVvZiB4W1N5bWJvbC5pdGVyYXRvcl0gPT09ICdmdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNBc3luY0l0ZXJhYmxlID0geCA9PiB4ICYmIHR5cGVvZiB4W1N5bWJvbC5hc3luY0l0ZXJhdG9yXSA9PT0gJ2Z1bmN0aW9uJztcbmV4cG9ydCBjb25zdCBpc0l0ZXJhdG9yID0geCA9PiB4ICYmIGlzRnVuY3Rpb24oeC5uZXh0KTtcbmV4cG9ydCBjb25zdCBpc1Jlc3BvbnNlID0geCA9PiB0eXBlb2YgUmVzcG9uc2UgIT09ICd1bmRlZmluZWQnICYmIHggaW5zdGFuY2VvZiBSZXNwb25zZSB8fCB4ICYmIHguYXJyYXlCdWZmZXIgJiYgeC50ZXh0ICYmIHguanNvbjtcbmV4cG9ydCBjb25zdCBpc0ZpbGUgPSB4ID0+IHR5cGVvZiBGaWxlICE9PSAndW5kZWZpbmVkJyAmJiB4IGluc3RhbmNlb2YgRmlsZTtcbmV4cG9ydCBjb25zdCBpc0Jsb2IgPSB4ID0+IHR5cGVvZiBCbG9iICE9PSAndW5kZWZpbmVkJyAmJiB4IGluc3RhbmNlb2YgQmxvYjtcbmV4cG9ydCBjb25zdCBpc0J1ZmZlciA9IHggPT4geCAmJiB0eXBlb2YgeCA9PT0gJ29iamVjdCcgJiYgeC5pc0J1ZmZlcjtcbmV4cG9ydCBjb25zdCBpc1dyaXRhYmxlRE9NU3RyZWFtID0geCA9PiBpc09iamVjdCh4KSAmJiBpc0Z1bmN0aW9uKHguYWJvcnQpICYmIGlzRnVuY3Rpb24oeC5nZXRXcml0ZXIpO1xuZXhwb3J0IGNvbnN0IGlzUmVhZGFibGVET01TdHJlYW0gPSB4ID0+IHR5cGVvZiBSZWFkYWJsZVN0cmVhbSAhPT0gJ3VuZGVmaW5lZCcgJiYgeCBpbnN0YW5jZW9mIFJlYWRhYmxlU3RyZWFtIHx8IGlzT2JqZWN0KHgpICYmIGlzRnVuY3Rpb24oeC50ZWUpICYmIGlzRnVuY3Rpb24oeC5jYW5jZWwpICYmIGlzRnVuY3Rpb24oeC5nZXRSZWFkZXIpO1xuZXhwb3J0IGNvbnN0IGlzV3JpdGFibGVOb2RlU3RyZWFtID0geCA9PiBpc09iamVjdCh4KSAmJiBpc0Z1bmN0aW9uKHguZW5kKSAmJiBpc0Z1bmN0aW9uKHgud3JpdGUpICYmIGlzQm9vbGVhbih4LndyaXRhYmxlKTtcbmV4cG9ydCBjb25zdCBpc1JlYWRhYmxlTm9kZVN0cmVhbSA9IHggPT4gaXNPYmplY3QoeCkgJiYgaXNGdW5jdGlvbih4LnJlYWQpICYmIGlzRnVuY3Rpb24oeC5waXBlKSAmJiBpc0Jvb2xlYW4oeC5yZWFkYWJsZSk7XG5leHBvcnQgY29uc3QgaXNSZWFkYWJsZVN0cmVhbSA9IHggPT4gaXNSZWFkYWJsZURPTVN0cmVhbSh4KSB8fCBpc1JlYWRhYmxlTm9kZVN0cmVhbSh4KTtcbmV4cG9ydCBjb25zdCBpc1dyaXRhYmxlU3RyZWFtID0geCA9PiBpc1dyaXRhYmxlRE9NU3RyZWFtKHgpIHx8IGlzV3JpdGFibGVOb2RlU3RyZWFtKHgpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aXMtdHlwZS5qcy5tYXAiLCJpbXBvcnQgeyBpc0Jsb2IgfSBmcm9tIFwiLi4vLi4vamF2YXNjcmlwdC11dGlscy9pcy10eXBlLmpzXCI7XG5pbXBvcnQgeyBpc0xvYWRlck9iamVjdCB9IGZyb20gXCIuLi9sb2FkZXItdXRpbHMvbm9ybWFsaXplLWxvYWRlci5qc1wiO1xuaW1wb3J0IHsgZ2V0RmV0Y2hGdW5jdGlvbiB9IGZyb20gXCIuLi9sb2FkZXItdXRpbHMvZ2V0LWZldGNoLWZ1bmN0aW9uLmpzXCI7XG5pbXBvcnQgeyBwYXJzZSB9IGZyb20gXCIuL3BhcnNlLmpzXCI7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbG9hZCh1cmwsIGxvYWRlcnMsIG9wdGlvbnMsIGNvbnRleHQpIHtcbiAgbGV0IHJlc29sdmVkTG9hZGVycztcbiAgbGV0IHJlc29sdmVkT3B0aW9ucztcbiAgaWYgKCFBcnJheS5pc0FycmF5KGxvYWRlcnMpICYmICFpc0xvYWRlck9iamVjdChsb2FkZXJzKSkge1xuICAgIHJlc29sdmVkTG9hZGVycyA9IFtdO1xuICAgIHJlc29sdmVkT3B0aW9ucyA9IGxvYWRlcnM7XG4gICAgY29udGV4dCA9IHVuZGVmaW5lZDtcbiAgfSBlbHNlIHtcbiAgICByZXNvbHZlZExvYWRlcnMgPSBsb2FkZXJzO1xuICAgIHJlc29sdmVkT3B0aW9ucyA9IG9wdGlvbnM7XG4gIH1cbiAgY29uc3QgZmV0Y2ggPSBnZXRGZXRjaEZ1bmN0aW9uKHJlc29sdmVkT3B0aW9ucyk7XG4gIGxldCBkYXRhID0gdXJsO1xuICBpZiAodHlwZW9mIHVybCA9PT0gJ3N0cmluZycpIHtcbiAgICBkYXRhID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgfVxuICBpZiAoaXNCbG9iKHVybCkpIHtcbiAgICBkYXRhID0gYXdhaXQgZmV0Y2godXJsKTtcbiAgfVxuICByZXR1cm4gQXJyYXkuaXNBcnJheShyZXNvbHZlZExvYWRlcnMpID8gYXdhaXQgcGFyc2UoZGF0YSwgcmVzb2x2ZWRMb2FkZXJzLCByZXNvbHZlZE9wdGlvbnMpIDogYXdhaXQgcGFyc2UoZGF0YSwgcmVzb2x2ZWRMb2FkZXJzLCByZXNvbHZlZE9wdGlvbnMpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bG9hZC5qcy5tYXAiLCJpbXBvcnQgeyBwYXJzZVdpdGhXb3JrZXIsIGNhblBhcnNlV2l0aFdvcmtlciB9IGZyb20gJ0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscyc7XG5pbXBvcnQgeyBhc3NlcnQsIHZhbGlkYXRlV29ya2VyVmVyc2lvbiB9IGZyb20gJ0Bsb2FkZXJzLmdsL3dvcmtlci11dGlscyc7XG5pbXBvcnQgeyBpc0xvYWRlck9iamVjdCB9IGZyb20gXCIuLi9sb2FkZXItdXRpbHMvbm9ybWFsaXplLWxvYWRlci5qc1wiO1xuaW1wb3J0IHsgaXNSZXNwb25zZSB9IGZyb20gXCIuLi8uLi9qYXZhc2NyaXB0LXV0aWxzL2lzLXR5cGUuanNcIjtcbmltcG9ydCB7IG5vcm1hbGl6ZU9wdGlvbnMgfSBmcm9tIFwiLi4vbG9hZGVyLXV0aWxzL29wdGlvbi11dGlscy5qc1wiO1xuaW1wb3J0IHsgbWVyZ2VMb2FkZXJPcHRpb25zIH0gZnJvbSAnQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzJztcbmltcG9ydCB7IGdldEFycmF5QnVmZmVyT3JTdHJpbmdGcm9tRGF0YSB9IGZyb20gXCIuLi9sb2FkZXItdXRpbHMvZ2V0LWRhdGEuanNcIjtcbmltcG9ydCB7IGdldExvYWRlckNvbnRleHQsIGdldExvYWRlcnNGcm9tQ29udGV4dCB9IGZyb20gXCIuLi9sb2FkZXItdXRpbHMvbG9hZGVyLWNvbnRleHQuanNcIjtcbmltcG9ydCB7IGdldFJlc291cmNlVXJsIH0gZnJvbSBcIi4uL3V0aWxzL3Jlc291cmNlLXV0aWxzLmpzXCI7XG5pbXBvcnQgeyBzZWxlY3RMb2FkZXIgfSBmcm9tIFwiLi9zZWxlY3QtbG9hZGVyLmpzXCI7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gcGFyc2UoZGF0YSwgbG9hZGVycywgb3B0aW9ucywgY29udGV4dCkge1xuICBpZiAobG9hZGVycyAmJiAhQXJyYXkuaXNBcnJheShsb2FkZXJzKSAmJiAhaXNMb2FkZXJPYmplY3QobG9hZGVycykpIHtcbiAgICBjb250ZXh0ID0gdW5kZWZpbmVkO1xuICAgIG9wdGlvbnMgPSBsb2FkZXJzO1xuICAgIGxvYWRlcnMgPSB1bmRlZmluZWQ7XG4gIH1cbiAgZGF0YSA9IGF3YWl0IGRhdGE7XG4gIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCB1cmwgPSBnZXRSZXNvdXJjZVVybChkYXRhKTtcbiAgY29uc3QgdHlwZWRMb2FkZXJzID0gbG9hZGVycztcbiAgY29uc3QgY2FuZGlkYXRlTG9hZGVycyA9IGdldExvYWRlcnNGcm9tQ29udGV4dCh0eXBlZExvYWRlcnMsIGNvbnRleHQpO1xuICBjb25zdCBsb2FkZXIgPSBhd2FpdCBzZWxlY3RMb2FkZXIoZGF0YSwgY2FuZGlkYXRlTG9hZGVycywgb3B0aW9ucyk7XG4gIGlmICghbG9hZGVyKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgb3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnMob3B0aW9ucywgbG9hZGVyLCBjYW5kaWRhdGVMb2FkZXJzLCB1cmwpO1xuICBjb250ZXh0ID0gZ2V0TG9hZGVyQ29udGV4dCh7XG4gICAgdXJsLFxuICAgIF9wYXJzZTogcGFyc2UsXG4gICAgbG9hZGVyczogY2FuZGlkYXRlTG9hZGVyc1xuICB9LCBvcHRpb25zLCBjb250ZXh0IHx8IG51bGwpO1xuICByZXR1cm4gYXdhaXQgcGFyc2VXaXRoTG9hZGVyKGxvYWRlciwgZGF0YSwgb3B0aW9ucywgY29udGV4dCk7XG59XG5hc3luYyBmdW5jdGlvbiBwYXJzZVdpdGhMb2FkZXIobG9hZGVyLCBkYXRhLCBvcHRpb25zLCBjb250ZXh0KSB7XG4gIHZhbGlkYXRlV29ya2VyVmVyc2lvbihsb2FkZXIpO1xuICBvcHRpb25zID0gbWVyZ2VMb2FkZXJPcHRpb25zKGxvYWRlci5vcHRpb25zLCBvcHRpb25zKTtcbiAgaWYgKGlzUmVzcG9uc2UoZGF0YSkpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IGRhdGE7XG4gICAgY29uc3Qge1xuICAgICAgb2ssXG4gICAgICByZWRpcmVjdGVkLFxuICAgICAgc3RhdHVzLFxuICAgICAgc3RhdHVzVGV4dCxcbiAgICAgIHR5cGUsXG4gICAgICB1cmxcbiAgICB9ID0gcmVzcG9uc2U7XG4gICAgY29uc3QgaGVhZGVycyA9IE9iamVjdC5mcm9tRW50cmllcyhyZXNwb25zZS5oZWFkZXJzLmVudHJpZXMoKSk7XG4gICAgY29udGV4dC5yZXNwb25zZSA9IHtcbiAgICAgIGhlYWRlcnMsXG4gICAgICBvayxcbiAgICAgIHJlZGlyZWN0ZWQsXG4gICAgICBzdGF0dXMsXG4gICAgICBzdGF0dXNUZXh0LFxuICAgICAgdHlwZSxcbiAgICAgIHVybFxuICAgIH07XG4gIH1cbiAgZGF0YSA9IGF3YWl0IGdldEFycmF5QnVmZmVyT3JTdHJpbmdGcm9tRGF0YShkYXRhLCBsb2FkZXIsIG9wdGlvbnMpO1xuICBjb25zdCBsb2FkZXJXaXRoUGFyc2VyID0gbG9hZGVyO1xuICBpZiAobG9hZGVyV2l0aFBhcnNlci5wYXJzZVRleHRTeW5jICYmIHR5cGVvZiBkYXRhID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBsb2FkZXJXaXRoUGFyc2VyLnBhcnNlVGV4dFN5bmMoZGF0YSwgb3B0aW9ucywgY29udGV4dCk7XG4gIH1cbiAgaWYgKGNhblBhcnNlV2l0aFdvcmtlcihsb2FkZXIsIG9wdGlvbnMpKSB7XG4gICAgcmV0dXJuIGF3YWl0IHBhcnNlV2l0aFdvcmtlcihsb2FkZXIsIGRhdGEsIG9wdGlvbnMsIGNvbnRleHQsIHBhcnNlKTtcbiAgfVxuICBpZiAobG9hZGVyV2l0aFBhcnNlci5wYXJzZVRleHQgJiYgdHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGF3YWl0IGxvYWRlcldpdGhQYXJzZXIucGFyc2VUZXh0KGRhdGEsIG9wdGlvbnMsIGNvbnRleHQpO1xuICB9XG4gIGlmIChsb2FkZXJXaXRoUGFyc2VyLnBhcnNlKSB7XG4gICAgcmV0dXJuIGF3YWl0IGxvYWRlcldpdGhQYXJzZXIucGFyc2UoZGF0YSwgb3B0aW9ucywgY29udGV4dCk7XG4gIH1cbiAgYXNzZXJ0KCFsb2FkZXJXaXRoUGFyc2VyLnBhcnNlU3luYyk7XG4gIHRocm93IG5ldyBFcnJvcihgJHtsb2FkZXIuaWR9IGxvYWRlciAtIG5vIHBhcnNlciBmb3VuZCBhbmQgd29ya2VyIGlzIGRpc2FibGVkYCk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS5qcy5tYXAiLCJpbXBvcnQgeyBub3JtYWxpemVMb2FkZXIgfSBmcm9tIFwiLi4vbG9hZGVyLXV0aWxzL25vcm1hbGl6ZS1sb2FkZXIuanNcIjtcbmltcG9ydCB7IGdldEdsb2JhbExvYWRlclN0YXRlIH0gZnJvbSBcIi4uL2xvYWRlci11dGlscy9vcHRpb24tdXRpbHMuanNcIjtcbmNvbnN0IGdldEdsb2JhbExvYWRlclJlZ2lzdHJ5ID0gKCkgPT4ge1xuICBjb25zdCBzdGF0ZSA9IGdldEdsb2JhbExvYWRlclN0YXRlKCk7XG4gIHN0YXRlLmxvYWRlclJlZ2lzdHJ5ID0gc3RhdGUubG9hZGVyUmVnaXN0cnkgfHwgW107XG4gIHJldHVybiBzdGF0ZS5sb2FkZXJSZWdpc3RyeTtcbn07XG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJMb2FkZXJzKGxvYWRlcnMpIHtcbiAgY29uc3QgbG9hZGVyUmVnaXN0cnkgPSBnZXRHbG9iYWxMb2FkZXJSZWdpc3RyeSgpO1xuICBsb2FkZXJzID0gQXJyYXkuaXNBcnJheShsb2FkZXJzKSA/IGxvYWRlcnMgOiBbbG9hZGVyc107XG4gIGZvciAoY29uc3QgbG9hZGVyIG9mIGxvYWRlcnMpIHtcbiAgICBjb25zdCBub3JtYWxpemVkTG9hZGVyID0gbm9ybWFsaXplTG9hZGVyKGxvYWRlcik7XG4gICAgaWYgKCFsb2FkZXJSZWdpc3RyeS5maW5kKHJlZ2lzdGVyZWRMb2FkZXIgPT4gbm9ybWFsaXplZExvYWRlciA9PT0gcmVnaXN0ZXJlZExvYWRlcikpIHtcbiAgICAgIGxvYWRlclJlZ2lzdHJ5LnVuc2hpZnQobm9ybWFsaXplZExvYWRlcik7XG4gICAgfVxuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UmVnaXN0ZXJlZExvYWRlcnMoKSB7XG4gIHJldHVybiBnZXRHbG9iYWxMb2FkZXJSZWdpc3RyeSgpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIF91bnJlZ2lzdGVyTG9hZGVycygpIHtcbiAgY29uc3Qgc3RhdGUgPSBnZXRHbG9iYWxMb2FkZXJTdGF0ZSgpO1xuICBzdGF0ZS5sb2FkZXJSZWdpc3RyeSA9IFtdO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVnaXN0ZXItbG9hZGVycy5qcy5tYXAiLCJpbXBvcnQgeyBjb21wYXJlQXJyYXlCdWZmZXJzLCBwYXRoIH0gZnJvbSAnQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzJztcbmltcG9ydCB7IG5vcm1hbGl6ZUxvYWRlciB9IGZyb20gXCIuLi9sb2FkZXItdXRpbHMvbm9ybWFsaXplLWxvYWRlci5qc1wiO1xuaW1wb3J0IHsgbG9nIH0gZnJvbSBcIi4uL3V0aWxzL2xvZy5qc1wiO1xuaW1wb3J0IHsgZ2V0UmVzb3VyY2VVcmwsIGdldFJlc291cmNlTUlNRVR5cGUgfSBmcm9tIFwiLi4vdXRpbHMvcmVzb3VyY2UtdXRpbHMuanNcIjtcbmltcG9ydCB7IGdldFJlZ2lzdGVyZWRMb2FkZXJzIH0gZnJvbSBcIi4vcmVnaXN0ZXItbG9hZGVycy5qc1wiO1xuaW1wb3J0IHsgaXNCbG9iIH0gZnJvbSBcIi4uLy4uL2phdmFzY3JpcHQtdXRpbHMvaXMtdHlwZS5qc1wiO1xuaW1wb3J0IHsgc3RyaXBRdWVyeVN0cmluZyB9IGZyb20gXCIuLi91dGlscy91cmwtdXRpbHMuanNcIjtcbmNvbnN0IEVYVF9QQVRURVJOID0gL1xcLihbXi5dKykkLztcbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBzZWxlY3RMb2FkZXIoZGF0YSkge1xuICBsZXQgbG9hZGVycyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogW107XG4gIGxldCBvcHRpb25zID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gIGxldCBjb250ZXh0ID0gYXJndW1lbnRzLmxlbmd0aCA+IDMgPyBhcmd1bWVudHNbM10gOiB1bmRlZmluZWQ7XG4gIGlmICghdmFsaWRIVFRQUmVzcG9uc2UoZGF0YSkpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICBsZXQgbG9hZGVyID0gc2VsZWN0TG9hZGVyU3luYyhkYXRhLCBsb2FkZXJzLCB7XG4gICAgLi4ub3B0aW9ucyxcbiAgICBub3Rocm93OiB0cnVlXG4gIH0sIGNvbnRleHQpO1xuICBpZiAobG9hZGVyKSB7XG4gICAgcmV0dXJuIGxvYWRlcjtcbiAgfVxuICBpZiAoaXNCbG9iKGRhdGEpKSB7XG4gICAgZGF0YSA9IGF3YWl0IGRhdGEuc2xpY2UoMCwgMTApLmFycmF5QnVmZmVyKCk7XG4gICAgbG9hZGVyID0gc2VsZWN0TG9hZGVyU3luYyhkYXRhLCBsb2FkZXJzLCBvcHRpb25zLCBjb250ZXh0KTtcbiAgfVxuICBpZiAoIWxvYWRlciAmJiAhKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMubm90aHJvdykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoZ2V0Tm9WYWxpZExvYWRlck1lc3NhZ2UoZGF0YSkpO1xuICB9XG4gIHJldHVybiBsb2FkZXI7XG59XG5leHBvcnQgZnVuY3Rpb24gc2VsZWN0TG9hZGVyU3luYyhkYXRhKSB7XG4gIGxldCBsb2FkZXJzID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiBbXTtcbiAgbGV0IG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiA/IGFyZ3VtZW50c1syXSA6IHVuZGVmaW5lZDtcbiAgbGV0IGNvbnRleHQgPSBhcmd1bWVudHMubGVuZ3RoID4gMyA/IGFyZ3VtZW50c1szXSA6IHVuZGVmaW5lZDtcbiAgaWYgKCF2YWxpZEhUVFBSZXNwb25zZShkYXRhKSkge1xuICAgIHJldHVybiBudWxsO1xuICB9XG4gIGlmIChsb2FkZXJzICYmICFBcnJheS5pc0FycmF5KGxvYWRlcnMpKSB7XG4gICAgcmV0dXJuIG5vcm1hbGl6ZUxvYWRlcihsb2FkZXJzKTtcbiAgfVxuICBsZXQgY2FuZGlkYXRlTG9hZGVycyA9IFtdO1xuICBpZiAobG9hZGVycykge1xuICAgIGNhbmRpZGF0ZUxvYWRlcnMgPSBjYW5kaWRhdGVMb2FkZXJzLmNvbmNhdChsb2FkZXJzKTtcbiAgfVxuICBpZiAoIShvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLmlnbm9yZVJlZ2lzdGVyZWRMb2FkZXJzKSkge1xuICAgIGNhbmRpZGF0ZUxvYWRlcnMucHVzaCguLi5nZXRSZWdpc3RlcmVkTG9hZGVycygpKTtcbiAgfVxuICBub3JtYWxpemVMb2FkZXJzKGNhbmRpZGF0ZUxvYWRlcnMpO1xuICBjb25zdCBsb2FkZXIgPSBzZWxlY3RMb2FkZXJJbnRlcm5hbChkYXRhLCBjYW5kaWRhdGVMb2FkZXJzLCBvcHRpb25zLCBjb250ZXh0KTtcbiAgaWYgKCFsb2FkZXIgJiYgIShvcHRpb25zICE9PSBudWxsICYmIG9wdGlvbnMgIT09IHZvaWQgMCAmJiBvcHRpb25zLm5vdGhyb3cpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKGdldE5vVmFsaWRMb2FkZXJNZXNzYWdlKGRhdGEpKTtcbiAgfVxuICByZXR1cm4gbG9hZGVyO1xufVxuZnVuY3Rpb24gc2VsZWN0TG9hZGVySW50ZXJuYWwoZGF0YSwgbG9hZGVycywgb3B0aW9ucywgY29udGV4dCkge1xuICBjb25zdCB1cmwgPSBnZXRSZXNvdXJjZVVybChkYXRhKTtcbiAgY29uc3QgdHlwZSA9IGdldFJlc291cmNlTUlNRVR5cGUoZGF0YSk7XG4gIGNvbnN0IHRlc3RVcmwgPSBzdHJpcFF1ZXJ5U3RyaW5nKHVybCkgfHwgKGNvbnRleHQgPT09IG51bGwgfHwgY29udGV4dCA9PT0gdm9pZCAwID8gdm9pZCAwIDogY29udGV4dC51cmwpO1xuICBsZXQgbG9hZGVyID0gbnVsbDtcbiAgbGV0IHJlYXNvbiA9ICcnO1xuICBpZiAob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgJiYgb3B0aW9ucy5taW1lVHlwZSkge1xuICAgIGxvYWRlciA9IGZpbmRMb2FkZXJCeU1JTUVUeXBlKGxvYWRlcnMsIG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5taW1lVHlwZSk7XG4gICAgcmVhc29uID0gYG1hdGNoIGZvcmNlZCBieSBzdXBwbGllZCBNSU1FIHR5cGUgJHtvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMubWltZVR5cGV9YDtcbiAgfVxuICBsb2FkZXIgPSBsb2FkZXIgfHwgZmluZExvYWRlckJ5VXJsKGxvYWRlcnMsIHRlc3RVcmwpO1xuICByZWFzb24gPSByZWFzb24gfHwgKGxvYWRlciA/IGBtYXRjaGVkIHVybCAke3Rlc3RVcmx9YCA6ICcnKTtcbiAgbG9hZGVyID0gbG9hZGVyIHx8IGZpbmRMb2FkZXJCeU1JTUVUeXBlKGxvYWRlcnMsIHR5cGUpO1xuICByZWFzb24gPSByZWFzb24gfHwgKGxvYWRlciA/IGBtYXRjaGVkIE1JTUUgdHlwZSAke3R5cGV9YCA6ICcnKTtcbiAgbG9hZGVyID0gbG9hZGVyIHx8IGZpbmRMb2FkZXJCeUluaXRpYWxCeXRlcyhsb2FkZXJzLCBkYXRhKTtcbiAgcmVhc29uID0gcmVhc29uIHx8IChsb2FkZXIgPyBgbWF0Y2hlZCBpbml0aWFsIGRhdGEgJHtnZXRGaXJzdENoYXJhY3RlcnMoZGF0YSl9YCA6ICcnKTtcbiAgaWYgKG9wdGlvbnMgIT09IG51bGwgJiYgb3B0aW9ucyAhPT0gdm9pZCAwICYmIG9wdGlvbnMuZmFsbGJhY2tNaW1lVHlwZSkge1xuICAgIGxvYWRlciA9IGxvYWRlciB8fCBmaW5kTG9hZGVyQnlNSU1FVHlwZShsb2FkZXJzLCBvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMuZmFsbGJhY2tNaW1lVHlwZSk7XG4gICAgcmVhc29uID0gcmVhc29uIHx8IChsb2FkZXIgPyBgbWF0Y2hlZCBmYWxsYmFjayBNSU1FIHR5cGUgJHt0eXBlfWAgOiAnJyk7XG4gIH1cbiAgaWYgKHJlYXNvbikge1xuICAgIHZhciBfbG9hZGVyO1xuICAgIGxvZy5sb2coMSwgYHNlbGVjdExvYWRlciBzZWxlY3RlZCAkeyhfbG9hZGVyID0gbG9hZGVyKSA9PT0gbnVsbCB8fCBfbG9hZGVyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfbG9hZGVyLm5hbWV9OiAke3JlYXNvbn0uYCk7XG4gIH1cbiAgcmV0dXJuIGxvYWRlcjtcbn1cbmZ1bmN0aW9uIHZhbGlkSFRUUFJlc3BvbnNlKGRhdGEpIHtcbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBSZXNwb25zZSkge1xuICAgIGlmIChkYXRhLnN0YXR1cyA9PT0gMjA0KSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gZ2V0Tm9WYWxpZExvYWRlck1lc3NhZ2UoZGF0YSkge1xuICBjb25zdCB1cmwgPSBnZXRSZXNvdXJjZVVybChkYXRhKTtcbiAgY29uc3QgdHlwZSA9IGdldFJlc291cmNlTUlNRVR5cGUoZGF0YSk7XG4gIGxldCBtZXNzYWdlID0gJ05vIHZhbGlkIGxvYWRlciBmb3VuZCAoJztcbiAgbWVzc2FnZSArPSB1cmwgPyBgJHtwYXRoLmZpbGVuYW1lKHVybCl9LCBgIDogJ25vIHVybCBwcm92aWRlZCwgJztcbiAgbWVzc2FnZSArPSBgTUlNRSB0eXBlOiAke3R5cGUgPyBgXCIke3R5cGV9XCJgIDogJ25vdCBwcm92aWRlZCd9LCBgO1xuICBjb25zdCBmaXJzdENoYXJhY3RlcnMgPSBkYXRhID8gZ2V0Rmlyc3RDaGFyYWN0ZXJzKGRhdGEpIDogJyc7XG4gIG1lc3NhZ2UgKz0gZmlyc3RDaGFyYWN0ZXJzID8gYCBmaXJzdCBieXRlczogXCIke2ZpcnN0Q2hhcmFjdGVyc31cImAgOiAnZmlyc3QgYnl0ZXM6IG5vdCBhdmFpbGFibGUnO1xuICBtZXNzYWdlICs9ICcpJztcbiAgcmV0dXJuIG1lc3NhZ2U7XG59XG5mdW5jdGlvbiBub3JtYWxpemVMb2FkZXJzKGxvYWRlcnMpIHtcbiAgZm9yIChjb25zdCBsb2FkZXIgb2YgbG9hZGVycykge1xuICAgIG5vcm1hbGl6ZUxvYWRlcihsb2FkZXIpO1xuICB9XG59XG5mdW5jdGlvbiBmaW5kTG9hZGVyQnlVcmwobG9hZGVycywgdXJsKSB7XG4gIGNvbnN0IG1hdGNoID0gdXJsICYmIEVYVF9QQVRURVJOLmV4ZWModXJsKTtcbiAgY29uc3QgZXh0ZW5zaW9uID0gbWF0Y2ggJiYgbWF0Y2hbMV07XG4gIHJldHVybiBleHRlbnNpb24gPyBmaW5kTG9hZGVyQnlFeHRlbnNpb24obG9hZGVycywgZXh0ZW5zaW9uKSA6IG51bGw7XG59XG5mdW5jdGlvbiBmaW5kTG9hZGVyQnlFeHRlbnNpb24obG9hZGVycywgZXh0ZW5zaW9uKSB7XG4gIGV4dGVuc2lvbiA9IGV4dGVuc2lvbi50b0xvd2VyQ2FzZSgpO1xuICBmb3IgKGNvbnN0IGxvYWRlciBvZiBsb2FkZXJzKSB7XG4gICAgZm9yIChjb25zdCBsb2FkZXJFeHRlbnNpb24gb2YgbG9hZGVyLmV4dGVuc2lvbnMpIHtcbiAgICAgIGlmIChsb2FkZXJFeHRlbnNpb24udG9Mb3dlckNhc2UoKSA9PT0gZXh0ZW5zaW9uKSB7XG4gICAgICAgIHJldHVybiBsb2FkZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZmluZExvYWRlckJ5TUlNRVR5cGUobG9hZGVycywgbWltZVR5cGUpIHtcbiAgZm9yIChjb25zdCBsb2FkZXIgb2YgbG9hZGVycykge1xuICAgIGlmIChsb2FkZXIubWltZVR5cGVzICYmIGxvYWRlci5taW1lVHlwZXMuaW5jbHVkZXMobWltZVR5cGUpKSB7XG4gICAgICByZXR1cm4gbG9hZGVyO1xuICAgIH1cbiAgICBpZiAobWltZVR5cGUgPT09IGBhcHBsaWNhdGlvbi94LiR7bG9hZGVyLmlkfWApIHtcbiAgICAgIHJldHVybiBsb2FkZXI7XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gZmluZExvYWRlckJ5SW5pdGlhbEJ5dGVzKGxvYWRlcnMsIGRhdGEpIHtcbiAgaWYgKCFkYXRhKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgZm9yIChjb25zdCBsb2FkZXIgb2YgbG9hZGVycykge1xuICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIGlmICh0ZXN0RGF0YUFnYWluc3RUZXh0KGRhdGEsIGxvYWRlcikpIHtcbiAgICAgICAgcmV0dXJuIGxvYWRlcjtcbiAgICAgIH1cbiAgICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhkYXRhKSkge1xuICAgICAgaWYgKHRlc3REYXRhQWdhaW5zdEJpbmFyeShkYXRhLmJ1ZmZlciwgZGF0YS5ieXRlT2Zmc2V0LCBsb2FkZXIpKSB7XG4gICAgICAgIHJldHVybiBsb2FkZXI7XG4gICAgICB9XG4gICAgfSBlbHNlIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICAgIGNvbnN0IGJ5dGVPZmZzZXQgPSAwO1xuICAgICAgaWYgKHRlc3REYXRhQWdhaW5zdEJpbmFyeShkYXRhLCBieXRlT2Zmc2V0LCBsb2FkZXIpKSB7XG4gICAgICAgIHJldHVybiBsb2FkZXI7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBudWxsO1xufVxuZnVuY3Rpb24gdGVzdERhdGFBZ2FpbnN0VGV4dChkYXRhLCBsb2FkZXIpIHtcbiAgaWYgKGxvYWRlci50ZXN0VGV4dCkge1xuICAgIHJldHVybiBsb2FkZXIudGVzdFRleHQoZGF0YSk7XG4gIH1cbiAgY29uc3QgdGVzdHMgPSBBcnJheS5pc0FycmF5KGxvYWRlci50ZXN0cykgPyBsb2FkZXIudGVzdHMgOiBbbG9hZGVyLnRlc3RzXTtcbiAgcmV0dXJuIHRlc3RzLnNvbWUodGVzdCA9PiBkYXRhLnN0YXJ0c1dpdGgodGVzdCkpO1xufVxuZnVuY3Rpb24gdGVzdERhdGFBZ2FpbnN0QmluYXJ5KGRhdGEsIGJ5dGVPZmZzZXQsIGxvYWRlcikge1xuICBjb25zdCB0ZXN0cyA9IEFycmF5LmlzQXJyYXkobG9hZGVyLnRlc3RzKSA/IGxvYWRlci50ZXN0cyA6IFtsb2FkZXIudGVzdHNdO1xuICByZXR1cm4gdGVzdHMuc29tZSh0ZXN0ID0+IHRlc3RCaW5hcnkoZGF0YSwgYnl0ZU9mZnNldCwgbG9hZGVyLCB0ZXN0KSk7XG59XG5mdW5jdGlvbiB0ZXN0QmluYXJ5KGRhdGEsIGJ5dGVPZmZzZXQsIGxvYWRlciwgdGVzdCkge1xuICBpZiAodGVzdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIGNvbXBhcmVBcnJheUJ1ZmZlcnModGVzdCwgZGF0YSwgdGVzdC5ieXRlTGVuZ3RoKTtcbiAgfVxuICBzd2l0Y2ggKHR5cGVvZiB0ZXN0KSB7XG4gICAgY2FzZSAnZnVuY3Rpb24nOlxuICAgICAgcmV0dXJuIHRlc3QoZGF0YSk7XG4gICAgY2FzZSAnc3RyaW5nJzpcbiAgICAgIGNvbnN0IG1hZ2ljID0gZ2V0TWFnaWNTdHJpbmcoZGF0YSwgYnl0ZU9mZnNldCwgdGVzdC5sZW5ndGgpO1xuICAgICAgcmV0dXJuIHRlc3QgPT09IG1hZ2ljO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEZpcnN0Q2hhcmFjdGVycyhkYXRhKSB7XG4gIGxldCBsZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IDU7XG4gIGlmICh0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGF0YS5zbGljZSgwLCBsZW5ndGgpO1xuICB9IGVsc2UgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhkYXRhKSkge1xuICAgIHJldHVybiBnZXRNYWdpY1N0cmluZyhkYXRhLmJ1ZmZlciwgZGF0YS5ieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9IGVsc2UgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIGNvbnN0IGJ5dGVPZmZzZXQgPSAwO1xuICAgIHJldHVybiBnZXRNYWdpY1N0cmluZyhkYXRhLCBieXRlT2Zmc2V0LCBsZW5ndGgpO1xuICB9XG4gIHJldHVybiAnJztcbn1cbmZ1bmN0aW9uIGdldE1hZ2ljU3RyaW5nKGFycmF5QnVmZmVyLCBieXRlT2Zmc2V0LCBsZW5ndGgpIHtcbiAgaWYgKGFycmF5QnVmZmVyLmJ5dGVMZW5ndGggPCBieXRlT2Zmc2V0ICsgbGVuZ3RoKSB7XG4gICAgcmV0dXJuICcnO1xuICB9XG4gIGNvbnN0IGRhdGFWaWV3ID0gbmV3IERhdGFWaWV3KGFycmF5QnVmZmVyKTtcbiAgbGV0IG1hZ2ljID0gJyc7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBtYWdpYyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFWaWV3LmdldFVpbnQ4KGJ5dGVPZmZzZXQgKyBpKSk7XG4gIH1cbiAgcmV0dXJuIG1hZ2ljO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9c2VsZWN0LWxvYWRlci5qcy5tYXAiLCJpbXBvcnQgeyByZXNvbHZlUGF0aCB9IGZyb20gJ0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscyc7XG5pbXBvcnQgeyBtYWtlUmVzcG9uc2UgfSBmcm9tIFwiLi4vdXRpbHMvcmVzcG9uc2UtdXRpbHMuanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBpc05vZGVQYXRoKHVybCkge1xuICByZXR1cm4gIWlzUmVxdWVzdFVSTCh1cmwpICYmICFpc0RhdGFVUkwodXJsKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc1JlcXVlc3RVUkwodXJsKSB7XG4gIHJldHVybiB1cmwuc3RhcnRzV2l0aCgnaHR0cDonKSB8fCB1cmwuc3RhcnRzV2l0aCgnaHR0cHM6Jyk7XG59XG5leHBvcnQgZnVuY3Rpb24gaXNEYXRhVVJMKHVybCkge1xuICByZXR1cm4gdXJsLnN0YXJ0c1dpdGgoJ2RhdGE6Jyk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmV0Y2hGaWxlKHVybE9yRGF0YSwgZmV0Y2hPcHRpb25zKSB7XG4gIGlmICh0eXBlb2YgdXJsT3JEYXRhID09PSAnc3RyaW5nJykge1xuICAgIGNvbnN0IHVybCA9IHJlc29sdmVQYXRoKHVybE9yRGF0YSk7XG4gICAgaWYgKGlzTm9kZVBhdGgodXJsKSkge1xuICAgICAgdmFyIF9nbG9iYWxUaGlzJGxvYWRlcnM7XG4gICAgICBpZiAoKF9nbG9iYWxUaGlzJGxvYWRlcnMgPSBnbG9iYWxUaGlzLmxvYWRlcnMpICE9PSBudWxsICYmIF9nbG9iYWxUaGlzJGxvYWRlcnMgIT09IHZvaWQgMCAmJiBfZ2xvYmFsVGhpcyRsb2FkZXJzLmZldGNoTm9kZSkge1xuICAgICAgICB2YXIgX2dsb2JhbFRoaXMkbG9hZGVyczI7XG4gICAgICAgIHJldHVybiAoX2dsb2JhbFRoaXMkbG9hZGVyczIgPSBnbG9iYWxUaGlzLmxvYWRlcnMpID09PSBudWxsIHx8IF9nbG9iYWxUaGlzJGxvYWRlcnMyID09PSB2b2lkIDAgPyB2b2lkIDAgOiBfZ2xvYmFsVGhpcyRsb2FkZXJzMi5mZXRjaE5vZGUodXJsLCBmZXRjaE9wdGlvbnMpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gYXdhaXQgZmV0Y2godXJsLCBmZXRjaE9wdGlvbnMpO1xuICB9XG4gIHJldHVybiBhd2FpdCBtYWtlUmVzcG9uc2UodXJsT3JEYXRhKTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWZldGNoLWZpbGUuanMubWFwIiwiaW1wb3J0IHsgY29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnNBc3luYyB9IGZyb20gJ0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscyc7XG5pbXBvcnQgeyBpc1Jlc3BvbnNlLCBpc1JlYWRhYmxlU3RyZWFtLCBpc0FzeW5jSXRlcmFibGUsIGlzSXRlcmFibGUsIGlzSXRlcmF0b3IsIGlzQmxvYiwgaXNCdWZmZXIgfSBmcm9tIFwiLi4vLi4vamF2YXNjcmlwdC11dGlscy9pcy10eXBlLmpzXCI7XG5pbXBvcnQgeyBtYWtlSXRlcmF0b3IgfSBmcm9tIFwiLi4vLi4vaXRlcmF0b3JzL21ha2UtaXRlcmF0b3IvbWFrZS1pdGVyYXRvci5qc1wiO1xuaW1wb3J0IHsgY2hlY2tSZXNwb25zZSwgbWFrZVJlc3BvbnNlIH0gZnJvbSBcIi4uL3V0aWxzL3Jlc3BvbnNlLXV0aWxzLmpzXCI7XG5jb25zdCBFUlJfREFUQSA9ICdDYW5ub3QgY29udmVydCBzdXBwbGllZCBkYXRhIHR5cGUnO1xuZXhwb3J0IGZ1bmN0aW9uIGdldEFycmF5QnVmZmVyT3JTdHJpbmdGcm9tRGF0YVN5bmMoZGF0YSwgbG9hZGVyLCBvcHRpb25zKSB7XG4gIGlmIChsb2FkZXIudGV4dCAmJiB0eXBlb2YgZGF0YSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuICBpZiAoaXNCdWZmZXIoZGF0YSkpIHtcbiAgICBkYXRhID0gZGF0YS5idWZmZXI7XG4gIH1cbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIGNvbnN0IGFycmF5QnVmZmVyID0gZGF0YTtcbiAgICBpZiAobG9hZGVyLnRleHQgJiYgIWxvYWRlci5iaW5hcnkpIHtcbiAgICAgIGNvbnN0IHRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGY4Jyk7XG4gICAgICByZXR1cm4gdGV4dERlY29kZXIuZGVjb2RlKGFycmF5QnVmZmVyKTtcbiAgICB9XG4gICAgcmV0dXJuIGFycmF5QnVmZmVyO1xuICB9XG4gIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcoZGF0YSkpIHtcbiAgICBpZiAobG9hZGVyLnRleHQgJiYgIWxvYWRlci5iaW5hcnkpIHtcbiAgICAgIGNvbnN0IHRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGY4Jyk7XG4gICAgICByZXR1cm4gdGV4dERlY29kZXIuZGVjb2RlKGRhdGEpO1xuICAgIH1cbiAgICBsZXQgYXJyYXlCdWZmZXIgPSBkYXRhLmJ1ZmZlcjtcbiAgICBjb25zdCBieXRlTGVuZ3RoID0gZGF0YS5ieXRlTGVuZ3RoIHx8IGRhdGEubGVuZ3RoO1xuICAgIGlmIChkYXRhLmJ5dGVPZmZzZXQgIT09IDAgfHwgYnl0ZUxlbmd0aCAhPT0gYXJyYXlCdWZmZXIuYnl0ZUxlbmd0aCkge1xuICAgICAgYXJyYXlCdWZmZXIgPSBhcnJheUJ1ZmZlci5zbGljZShkYXRhLmJ5dGVPZmZzZXQsIGRhdGEuYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGgpO1xuICAgIH1cbiAgICByZXR1cm4gYXJyYXlCdWZmZXI7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKEVSUl9EQVRBKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBcnJheUJ1ZmZlck9yU3RyaW5nRnJvbURhdGEoZGF0YSwgbG9hZGVyLCBvcHRpb25zKSB7XG4gIGNvbnN0IGlzQXJyYXlCdWZmZXIgPSBkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgfHwgQXJyYXlCdWZmZXIuaXNWaWV3KGRhdGEpO1xuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnIHx8IGlzQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZ2V0QXJyYXlCdWZmZXJPclN0cmluZ0Zyb21EYXRhU3luYyhkYXRhLCBsb2FkZXIsIG9wdGlvbnMpO1xuICB9XG4gIGlmIChpc0Jsb2IoZGF0YSkpIHtcbiAgICBkYXRhID0gYXdhaXQgbWFrZVJlc3BvbnNlKGRhdGEpO1xuICB9XG4gIGlmIChpc1Jlc3BvbnNlKGRhdGEpKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBkYXRhO1xuICAgIGF3YWl0IGNoZWNrUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIHJldHVybiBsb2FkZXIuYmluYXJ5ID8gYXdhaXQgcmVzcG9uc2UuYXJyYXlCdWZmZXIoKSA6IGF3YWl0IHJlc3BvbnNlLnRleHQoKTtcbiAgfVxuICBpZiAoaXNSZWFkYWJsZVN0cmVhbShkYXRhKSkge1xuICAgIGRhdGEgPSBtYWtlSXRlcmF0b3IoZGF0YSwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKGlzSXRlcmFibGUoZGF0YSkgfHwgaXNBc3luY0l0ZXJhYmxlKGRhdGEpKSB7XG4gICAgcmV0dXJuIGNvbmNhdGVuYXRlQXJyYXlCdWZmZXJzQXN5bmMoZGF0YSk7XG4gIH1cbiAgdGhyb3cgbmV3IEVycm9yKEVSUl9EQVRBKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRBc3luY0l0ZXJhYmxlRnJvbURhdGEoZGF0YSwgb3B0aW9ucykge1xuICBpZiAoaXNJdGVyYXRvcihkYXRhKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIGlmIChpc1Jlc3BvbnNlKGRhdGEpKSB7XG4gICAgY29uc3QgcmVzcG9uc2UgPSBkYXRhO1xuICAgIGF3YWl0IGNoZWNrUmVzcG9uc2UocmVzcG9uc2UpO1xuICAgIGNvbnN0IGJvZHkgPSBhd2FpdCByZXNwb25zZS5ib2R5O1xuICAgIHJldHVybiBtYWtlSXRlcmF0b3IoYm9keSwgb3B0aW9ucyk7XG4gIH1cbiAgaWYgKGlzQmxvYihkYXRhKSB8fCBpc1JlYWRhYmxlU3RyZWFtKGRhdGEpKSB7XG4gICAgcmV0dXJuIG1ha2VJdGVyYXRvcihkYXRhLCBvcHRpb25zKTtcbiAgfVxuICBpZiAoaXNBc3luY0l0ZXJhYmxlKGRhdGEpKSB7XG4gICAgcmV0dXJuIGRhdGE7XG4gIH1cbiAgcmV0dXJuIGdldEl0ZXJhYmxlRnJvbURhdGEoZGF0YSk7XG59XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZ2V0UmVhZGFibGVTdHJlYW0oZGF0YSkge1xuICBpZiAoaXNSZWFkYWJsZVN0cmVhbShkYXRhKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIGlmIChpc1Jlc3BvbnNlKGRhdGEpKSB7XG4gICAgcmV0dXJuIGRhdGEuYm9keTtcbiAgfVxuICBjb25zdCByZXNwb25zZSA9IGF3YWl0IG1ha2VSZXNwb25zZShkYXRhKTtcbiAgcmV0dXJuIHJlc3BvbnNlLmJvZHk7XG59XG5mdW5jdGlvbiBnZXRJdGVyYWJsZUZyb21EYXRhKGRhdGEpIHtcbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhkYXRhKSkge1xuICAgIHJldHVybiBmdW5jdGlvbiogb25lQ2h1bmsoKSB7XG4gICAgICB5aWVsZCBkYXRhLmJ1ZmZlcjtcbiAgICB9KCk7XG4gIH1cbiAgaWYgKGRhdGEgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlcikge1xuICAgIHJldHVybiBmdW5jdGlvbiogb25lQ2h1bmsoKSB7XG4gICAgICB5aWVsZCBkYXRhO1xuICAgIH0oKTtcbiAgfVxuICBpZiAoaXNJdGVyYXRvcihkYXRhKSkge1xuICAgIHJldHVybiBkYXRhO1xuICB9XG4gIGlmIChpc0l0ZXJhYmxlKGRhdGEpKSB7XG4gICAgcmV0dXJuIGRhdGFbU3ltYm9sLml0ZXJhdG9yXSgpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcihFUlJfREFUQSk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtZGF0YS5qcy5tYXAiLCJpbXBvcnQgeyBpc09iamVjdCB9IGZyb20gXCIuLi8uLi9qYXZhc2NyaXB0LXV0aWxzL2lzLXR5cGUuanNcIjtcbmltcG9ydCB7IGZldGNoRmlsZSB9IGZyb20gXCIuLi9mZXRjaC9mZXRjaC1maWxlLmpzXCI7XG5pbXBvcnQgeyBnZXRHbG9iYWxMb2FkZXJPcHRpb25zIH0gZnJvbSBcIi4vb3B0aW9uLXV0aWxzLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gZ2V0RmV0Y2hGdW5jdGlvbihvcHRpb25zLCBjb250ZXh0KSB7XG4gIGNvbnN0IGdsb2JhbE9wdGlvbnMgPSBnZXRHbG9iYWxMb2FkZXJPcHRpb25zKCk7XG4gIGNvbnN0IGxvYWRlck9wdGlvbnMgPSBvcHRpb25zIHx8IGdsb2JhbE9wdGlvbnM7XG4gIGlmICh0eXBlb2YgbG9hZGVyT3B0aW9ucy5mZXRjaCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBsb2FkZXJPcHRpb25zLmZldGNoO1xuICB9XG4gIGlmIChpc09iamVjdChsb2FkZXJPcHRpb25zLmZldGNoKSkge1xuICAgIHJldHVybiB1cmwgPT4gZmV0Y2hGaWxlKHVybCwgbG9hZGVyT3B0aW9ucy5mZXRjaCk7XG4gIH1cbiAgaWYgKGNvbnRleHQgIT09IG51bGwgJiYgY29udGV4dCAhPT0gdm9pZCAwICYmIGNvbnRleHQuZmV0Y2gpIHtcbiAgICByZXR1cm4gY29udGV4dCA9PT0gbnVsbCB8fCBjb250ZXh0ID09PSB2b2lkIDAgPyB2b2lkIDAgOiBjb250ZXh0LmZldGNoO1xuICB9XG4gIHJldHVybiBmZXRjaEZpbGU7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtZmV0Y2gtZnVuY3Rpb24uanMubWFwIiwiaW1wb3J0IHsgZ2V0RmV0Y2hGdW5jdGlvbiB9IGZyb20gXCIuL2dldC1mZXRjaC1mdW5jdGlvbi5qc1wiO1xuaW1wb3J0IHsgZXh0cmFjdFF1ZXJ5U3RyaW5nLCBzdHJpcFF1ZXJ5U3RyaW5nIH0gZnJvbSBcIi4uL3V0aWxzL3VybC11dGlscy5qc1wiO1xuaW1wb3J0IHsgcGF0aCB9IGZyb20gJ0Bsb2FkZXJzLmdsL2xvYWRlci11dGlscyc7XG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9hZGVyQ29udGV4dChjb250ZXh0LCBvcHRpb25zLCBwYXJlbnRDb250ZXh0KSB7XG4gIGlmIChwYXJlbnRDb250ZXh0KSB7XG4gICAgcmV0dXJuIHBhcmVudENvbnRleHQ7XG4gIH1cbiAgY29uc3QgbmV3Q29udGV4dCA9IHtcbiAgICBmZXRjaDogZ2V0RmV0Y2hGdW5jdGlvbihvcHRpb25zLCBjb250ZXh0KSxcbiAgICAuLi5jb250ZXh0XG4gIH07XG4gIGlmIChuZXdDb250ZXh0LnVybCkge1xuICAgIGNvbnN0IGJhc2VVcmwgPSBzdHJpcFF1ZXJ5U3RyaW5nKG5ld0NvbnRleHQudXJsKTtcbiAgICBuZXdDb250ZXh0LmJhc2VVcmwgPSBiYXNlVXJsO1xuICAgIG5ld0NvbnRleHQucXVlcnlTdHJpbmcgPSBleHRyYWN0UXVlcnlTdHJpbmcobmV3Q29udGV4dC51cmwpO1xuICAgIG5ld0NvbnRleHQuZmlsZW5hbWUgPSBwYXRoLmZpbGVuYW1lKGJhc2VVcmwpO1xuICAgIG5ld0NvbnRleHQuYmFzZVVybCA9IHBhdGguZGlybmFtZShiYXNlVXJsKTtcbiAgfVxuICBpZiAoIUFycmF5LmlzQXJyYXkobmV3Q29udGV4dC5sb2FkZXJzKSkge1xuICAgIG5ld0NvbnRleHQubG9hZGVycyA9IG51bGw7XG4gIH1cbiAgcmV0dXJuIG5ld0NvbnRleHQ7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9hZGVyc0Zyb21Db250ZXh0KGxvYWRlcnMsIGNvbnRleHQpIHtcbiAgaWYgKGxvYWRlcnMgJiYgIUFycmF5LmlzQXJyYXkobG9hZGVycykpIHtcbiAgICByZXR1cm4gbG9hZGVycztcbiAgfVxuICBsZXQgY2FuZGlkYXRlTG9hZGVycztcbiAgaWYgKGxvYWRlcnMpIHtcbiAgICBjYW5kaWRhdGVMb2FkZXJzID0gQXJyYXkuaXNBcnJheShsb2FkZXJzKSA/IGxvYWRlcnMgOiBbbG9hZGVyc107XG4gIH1cbiAgaWYgKGNvbnRleHQgJiYgY29udGV4dC5sb2FkZXJzKSB7XG4gICAgY29uc3QgY29udGV4dExvYWRlcnMgPSBBcnJheS5pc0FycmF5KGNvbnRleHQubG9hZGVycykgPyBjb250ZXh0LmxvYWRlcnMgOiBbY29udGV4dC5sb2FkZXJzXTtcbiAgICBjYW5kaWRhdGVMb2FkZXJzID0gY2FuZGlkYXRlTG9hZGVycyA/IFsuLi5jYW5kaWRhdGVMb2FkZXJzLCAuLi5jb250ZXh0TG9hZGVyc10gOiBjb250ZXh0TG9hZGVycztcbiAgfVxuICByZXR1cm4gY2FuZGlkYXRlTG9hZGVycyAmJiBjYW5kaWRhdGVMb2FkZXJzLmxlbmd0aCA/IGNhbmRpZGF0ZUxvYWRlcnMgOiB1bmRlZmluZWQ7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2FkZXItY29udGV4dC5qcy5tYXAiLCJpbXBvcnQgeyBMb2cgfSBmcm9tICdAcHJvYmUuZ2wvbG9nJztcbmV4cG9ydCBjb25zdCBwcm9iZUxvZyA9IG5ldyBMb2coe1xuICBpZDogJ2xvYWRlcnMuZ2wnXG59KTtcbmV4cG9ydCBjbGFzcyBOdWxsTG9nIHtcbiAgbG9nKCkge1xuICAgIHJldHVybiAoKSA9PiB7fTtcbiAgfVxuICBpbmZvKCkge1xuICAgIHJldHVybiAoKSA9PiB7fTtcbiAgfVxuICB3YXJuKCkge1xuICAgIHJldHVybiAoKSA9PiB7fTtcbiAgfVxuICBlcnJvcigpIHtcbiAgICByZXR1cm4gKCkgPT4ge307XG4gIH1cbn1cbmV4cG9ydCBjbGFzcyBDb25zb2xlTG9nIHtcbiAgY29uc3RydWN0b3IoKSB7XG4gICAgdGhpcy5jb25zb2xlID0gdm9pZCAwO1xuICAgIHRoaXMuY29uc29sZSA9IGNvbnNvbGU7XG4gIH1cbiAgbG9nKCkge1xuICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4pLCBfa2V5ID0gMDsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgYXJnc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29uc29sZS5sb2cuYmluZCh0aGlzLmNvbnNvbGUsIC4uLmFyZ3MpO1xuICB9XG4gIGluZm8oKSB7XG4gICAgZm9yICh2YXIgX2xlbjIgPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gbmV3IEFycmF5KF9sZW4yKSwgX2tleTIgPSAwOyBfa2V5MiA8IF9sZW4yOyBfa2V5MisrKSB7XG4gICAgICBhcmdzW19rZXkyXSA9IGFyZ3VtZW50c1tfa2V5Ml07XG4gICAgfVxuICAgIHJldHVybiB0aGlzLmNvbnNvbGUuaW5mby5iaW5kKHRoaXMuY29uc29sZSwgLi4uYXJncyk7XG4gIH1cbiAgd2FybigpIHtcbiAgICBmb3IgKHZhciBfbGVuMyA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjMpLCBfa2V5MyA9IDA7IF9rZXkzIDwgX2xlbjM7IF9rZXkzKyspIHtcbiAgICAgIGFyZ3NbX2tleTNdID0gYXJndW1lbnRzW19rZXkzXTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29uc29sZS53YXJuLmJpbmQodGhpcy5jb25zb2xlLCAuLi5hcmdzKTtcbiAgfVxuICBlcnJvcigpIHtcbiAgICBmb3IgKHZhciBfbGVuNCA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBuZXcgQXJyYXkoX2xlbjQpLCBfa2V5NCA9IDA7IF9rZXk0IDwgX2xlbjQ7IF9rZXk0KyspIHtcbiAgICAgIGFyZ3NbX2tleTRdID0gYXJndW1lbnRzW19rZXk0XTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuY29uc29sZS5lcnJvci5iaW5kKHRoaXMuY29uc29sZSwgLi4uYXJncyk7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWxvZ2dlcnMuanMubWFwIiwiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSAnQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzJztcbmV4cG9ydCBmdW5jdGlvbiBpc0xvYWRlck9iamVjdChsb2FkZXIpIHtcbiAgdmFyIF9sb2FkZXI7XG4gIGlmICghbG9hZGVyKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KGxvYWRlcikpIHtcbiAgICBsb2FkZXIgPSBsb2FkZXJbMF07XG4gIH1cbiAgY29uc3QgaGFzRXh0ZW5zaW9ucyA9IEFycmF5LmlzQXJyYXkoKF9sb2FkZXIgPSBsb2FkZXIpID09PSBudWxsIHx8IF9sb2FkZXIgPT09IHZvaWQgMCA/IHZvaWQgMCA6IF9sb2FkZXIuZXh0ZW5zaW9ucyk7XG4gIHJldHVybiBoYXNFeHRlbnNpb25zO1xufVxuZXhwb3J0IGZ1bmN0aW9uIG5vcm1hbGl6ZUxvYWRlcihsb2FkZXIpIHtcbiAgdmFyIF9sb2FkZXIyLCBfbG9hZGVyMztcbiAgYXNzZXJ0KGxvYWRlciwgJ251bGwgbG9hZGVyJyk7XG4gIGFzc2VydChpc0xvYWRlck9iamVjdChsb2FkZXIpLCAnaW52YWxpZCBsb2FkZXInKTtcbiAgbGV0IG9wdGlvbnM7XG4gIGlmIChBcnJheS5pc0FycmF5KGxvYWRlcikpIHtcbiAgICBvcHRpb25zID0gbG9hZGVyWzFdO1xuICAgIGxvYWRlciA9IGxvYWRlclswXTtcbiAgICBsb2FkZXIgPSB7XG4gICAgICAuLi5sb2FkZXIsXG4gICAgICBvcHRpb25zOiB7XG4gICAgICAgIC4uLmxvYWRlci5vcHRpb25zLFxuICAgICAgICAuLi5vcHRpb25zXG4gICAgICB9XG4gICAgfTtcbiAgfVxuICBpZiAoKF9sb2FkZXIyID0gbG9hZGVyKSAhPT0gbnVsbCAmJiBfbG9hZGVyMiAhPT0gdm9pZCAwICYmIF9sb2FkZXIyLnBhcnNlVGV4dFN5bmMgfHwgKF9sb2FkZXIzID0gbG9hZGVyKSAhPT0gbnVsbCAmJiBfbG9hZGVyMyAhPT0gdm9pZCAwICYmIF9sb2FkZXIzLnBhcnNlVGV4dCkge1xuICAgIGxvYWRlci50ZXh0ID0gdHJ1ZTtcbiAgfVxuICBpZiAoIWxvYWRlci50ZXh0KSB7XG4gICAgbG9hZGVyLmJpbmFyeSA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIGxvYWRlcjtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW5vcm1hbGl6ZS1sb2FkZXIuanMubWFwIiwiaW1wb3J0IHsgaXNCcm93c2VyIH0gZnJvbSAnQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzJztcbmltcG9ydCB7IENvbnNvbGVMb2cgfSBmcm9tIFwiLi9sb2dnZXJzLmpzXCI7XG5leHBvcnQgY29uc3QgREVGQVVMVF9MT0FERVJfT1BUSU9OUyA9IHtcbiAgZmV0Y2g6IG51bGwsXG4gIG1pbWVUeXBlOiB1bmRlZmluZWQsXG4gIG5vdGhyb3c6IGZhbHNlLFxuICBsb2c6IG5ldyBDb25zb2xlTG9nKCksXG4gIHVzZUxvY2FsTGlicmFyaWVzOiBmYWxzZSxcbiAgQ0ROOiAnaHR0cHM6Ly91bnBrZy5jb20vQGxvYWRlcnMuZ2wnLFxuICB3b3JrZXI6IHRydWUsXG4gIG1heENvbmN1cnJlbmN5OiAzLFxuICBtYXhNb2JpbGVDb25jdXJyZW5jeTogMSxcbiAgcmV1c2VXb3JrZXJzOiBpc0Jyb3dzZXIsXG4gIF9ub2RlV29ya2VyczogZmFsc2UsXG4gIF93b3JrZXJUeXBlOiAnJyxcbiAgbGltaXQ6IDAsXG4gIF9saW1pdE1COiAwLFxuICBiYXRjaFNpemU6ICdhdXRvJyxcbiAgYmF0Y2hEZWJvdW5jZU1zOiAwLFxuICBtZXRhZGF0YTogZmFsc2UsXG4gIHRyYW5zZm9ybXM6IFtdXG59O1xuZXhwb3J0IGNvbnN0IFJFTU9WRURfTE9BREVSX09QVElPTlMgPSB7XG4gIHRocm93czogJ25vdGhyb3cnLFxuICBkYXRhVHlwZTogJyhubyBsb25nZXIgdXNlZCknLFxuICB1cmk6ICdiYXNlVXJpJyxcbiAgbWV0aG9kOiAnZmV0Y2gubWV0aG9kJyxcbiAgaGVhZGVyczogJ2ZldGNoLmhlYWRlcnMnLFxuICBib2R5OiAnZmV0Y2guYm9keScsXG4gIG1vZGU6ICdmZXRjaC5tb2RlJyxcbiAgY3JlZGVudGlhbHM6ICdmZXRjaC5jcmVkZW50aWFscycsXG4gIGNhY2hlOiAnZmV0Y2guY2FjaGUnLFxuICByZWRpcmVjdDogJ2ZldGNoLnJlZGlyZWN0JyxcbiAgcmVmZXJyZXI6ICdmZXRjaC5yZWZlcnJlcicsXG4gIHJlZmVycmVyUG9saWN5OiAnZmV0Y2gucmVmZXJyZXJQb2xpY3knLFxuICBpbnRlZ3JpdHk6ICdmZXRjaC5pbnRlZ3JpdHknLFxuICBrZWVwYWxpdmU6ICdmZXRjaC5rZWVwYWxpdmUnLFxuICBzaWduYWw6ICdmZXRjaC5zaWduYWwnXG59O1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9b3B0aW9uLWRlZmF1bHRzLmpzLm1hcCIsImltcG9ydCB7IGlzUHVyZU9iamVjdCwgaXNPYmplY3QgfSBmcm9tIFwiLi4vLi4vamF2YXNjcmlwdC11dGlscy9pcy10eXBlLmpzXCI7XG5pbXBvcnQgeyBwcm9iZUxvZywgTnVsbExvZyB9IGZyb20gXCIuL2xvZ2dlcnMuanNcIjtcbmltcG9ydCB7IERFRkFVTFRfTE9BREVSX09QVElPTlMsIFJFTU9WRURfTE9BREVSX09QVElPTlMgfSBmcm9tIFwiLi9vcHRpb24tZGVmYXVsdHMuanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBnZXRHbG9iYWxMb2FkZXJTdGF0ZSgpIHtcbiAgZ2xvYmFsVGhpcy5sb2FkZXJzID0gZ2xvYmFsVGhpcy5sb2FkZXJzIHx8IHt9O1xuICBjb25zdCB7XG4gICAgbG9hZGVyc1xuICB9ID0gZ2xvYmFsVGhpcztcbiAgbG9hZGVycy5fc3RhdGUgPSBsb2FkZXJzLl9zdGF0ZSB8fCB7fTtcbiAgcmV0dXJuIGxvYWRlcnMuX3N0YXRlO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldEdsb2JhbExvYWRlck9wdGlvbnMoKSB7XG4gIGNvbnN0IHN0YXRlID0gZ2V0R2xvYmFsTG9hZGVyU3RhdGUoKTtcbiAgc3RhdGUuZ2xvYmFsT3B0aW9ucyA9IHN0YXRlLmdsb2JhbE9wdGlvbnMgfHwge1xuICAgIC4uLkRFRkFVTFRfTE9BREVSX09QVElPTlNcbiAgfTtcbiAgcmV0dXJuIHN0YXRlLmdsb2JhbE9wdGlvbnM7XG59XG5leHBvcnQgZnVuY3Rpb24gc2V0R2xvYmFsT3B0aW9ucyhvcHRpb25zKSB7XG4gIGNvbnN0IHN0YXRlID0gZ2V0R2xvYmFsTG9hZGVyU3RhdGUoKTtcbiAgY29uc3QgZ2xvYmFsT3B0aW9ucyA9IGdldEdsb2JhbExvYWRlck9wdGlvbnMoKTtcbiAgc3RhdGUuZ2xvYmFsT3B0aW9ucyA9IG5vcm1hbGl6ZU9wdGlvbnNJbnRlcm5hbChnbG9iYWxPcHRpb25zLCBvcHRpb25zKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVPcHRpb25zKG9wdGlvbnMsIGxvYWRlciwgbG9hZGVycywgdXJsKSB7XG4gIGxvYWRlcnMgPSBsb2FkZXJzIHx8IFtdO1xuICBsb2FkZXJzID0gQXJyYXkuaXNBcnJheShsb2FkZXJzKSA/IGxvYWRlcnMgOiBbbG9hZGVyc107XG4gIHZhbGlkYXRlT3B0aW9ucyhvcHRpb25zLCBsb2FkZXJzKTtcbiAgcmV0dXJuIG5vcm1hbGl6ZU9wdGlvbnNJbnRlcm5hbChsb2FkZXIsIG9wdGlvbnMsIHVybCk7XG59XG5mdW5jdGlvbiB2YWxpZGF0ZU9wdGlvbnMob3B0aW9ucywgbG9hZGVycykge1xuICB2YWxpZGF0ZU9wdGlvbnNPYmplY3Qob3B0aW9ucywgbnVsbCwgREVGQVVMVF9MT0FERVJfT1BUSU9OUywgUkVNT1ZFRF9MT0FERVJfT1BUSU9OUywgbG9hZGVycyk7XG4gIGZvciAoY29uc3QgbG9hZGVyIG9mIGxvYWRlcnMpIHtcbiAgICBjb25zdCBpZE9wdGlvbnMgPSBvcHRpb25zICYmIG9wdGlvbnNbbG9hZGVyLmlkXSB8fCB7fTtcbiAgICBjb25zdCBsb2FkZXJPcHRpb25zID0gbG9hZGVyLm9wdGlvbnMgJiYgbG9hZGVyLm9wdGlvbnNbbG9hZGVyLmlkXSB8fCB7fTtcbiAgICBjb25zdCBkZXByZWNhdGVkT3B0aW9ucyA9IGxvYWRlci5kZXByZWNhdGVkT3B0aW9ucyAmJiBsb2FkZXIuZGVwcmVjYXRlZE9wdGlvbnNbbG9hZGVyLmlkXSB8fCB7fTtcbiAgICB2YWxpZGF0ZU9wdGlvbnNPYmplY3QoaWRPcHRpb25zLCBsb2FkZXIuaWQsIGxvYWRlck9wdGlvbnMsIGRlcHJlY2F0ZWRPcHRpb25zLCBsb2FkZXJzKTtcbiAgfVxufVxuZnVuY3Rpb24gdmFsaWRhdGVPcHRpb25zT2JqZWN0KG9wdGlvbnMsIGlkLCBkZWZhdWx0T3B0aW9ucywgZGVwcmVjYXRlZE9wdGlvbnMsIGxvYWRlcnMpIHtcbiAgY29uc3QgbG9hZGVyTmFtZSA9IGlkIHx8ICdUb3AgbGV2ZWwnO1xuICBjb25zdCBwcmVmaXggPSBpZCA/IGAke2lkfS5gIDogJyc7XG4gIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICBjb25zdCBpc1N1Yk9wdGlvbnMgPSAhaWQgJiYgaXNPYmplY3Qob3B0aW9uc1trZXldKTtcbiAgICBjb25zdCBpc0Jhc2VVcmlPcHRpb24gPSBrZXkgPT09ICdiYXNlVXJpJyAmJiAhaWQ7XG4gICAgY29uc3QgaXNXb3JrZXJVcmxPcHRpb24gPSBrZXkgPT09ICd3b3JrZXJVcmwnICYmIGlkO1xuICAgIGlmICghKGtleSBpbiBkZWZhdWx0T3B0aW9ucykgJiYgIWlzQmFzZVVyaU9wdGlvbiAmJiAhaXNXb3JrZXJVcmxPcHRpb24pIHtcbiAgICAgIGlmIChrZXkgaW4gZGVwcmVjYXRlZE9wdGlvbnMpIHtcbiAgICAgICAgcHJvYmVMb2cud2FybihgJHtsb2FkZXJOYW1lfSBsb2FkZXIgb3B0aW9uIFxcJyR7cHJlZml4fSR7a2V5fVxcJyBubyBsb25nZXIgc3VwcG9ydGVkLCB1c2UgXFwnJHtkZXByZWNhdGVkT3B0aW9uc1trZXldfVxcJ2ApKCk7XG4gICAgICB9IGVsc2UgaWYgKCFpc1N1Yk9wdGlvbnMpIHtcbiAgICAgICAgY29uc3Qgc3VnZ2VzdGlvbiA9IGZpbmRTaW1pbGFyT3B0aW9uKGtleSwgbG9hZGVycyk7XG4gICAgICAgIHByb2JlTG9nLndhcm4oYCR7bG9hZGVyTmFtZX0gbG9hZGVyIG9wdGlvbiBcXCcke3ByZWZpeH0ke2tleX1cXCcgbm90IHJlY29nbml6ZWQuICR7c3VnZ2VzdGlvbn1gKSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxufVxuZnVuY3Rpb24gZmluZFNpbWlsYXJPcHRpb24ob3B0aW9uS2V5LCBsb2FkZXJzKSB7XG4gIGNvbnN0IGxvd2VyQ2FzZU9wdGlvbktleSA9IG9wdGlvbktleS50b0xvd2VyQ2FzZSgpO1xuICBsZXQgYmVzdFN1Z2dlc3Rpb24gPSAnJztcbiAgZm9yIChjb25zdCBsb2FkZXIgb2YgbG9hZGVycykge1xuICAgIGZvciAoY29uc3Qga2V5IGluIGxvYWRlci5vcHRpb25zKSB7XG4gICAgICBpZiAob3B0aW9uS2V5ID09PSBrZXkpIHtcbiAgICAgICAgcmV0dXJuIGBEaWQgeW91IG1lYW4gXFwnJHtsb2FkZXIuaWR9LiR7a2V5fVxcJz9gO1xuICAgICAgfVxuICAgICAgY29uc3QgbG93ZXJDYXNlS2V5ID0ga2V5LnRvTG93ZXJDYXNlKCk7XG4gICAgICBjb25zdCBpc1BhcnRpYWxNYXRjaCA9IGxvd2VyQ2FzZU9wdGlvbktleS5zdGFydHNXaXRoKGxvd2VyQ2FzZUtleSkgfHwgbG93ZXJDYXNlS2V5LnN0YXJ0c1dpdGgobG93ZXJDYXNlT3B0aW9uS2V5KTtcbiAgICAgIGlmIChpc1BhcnRpYWxNYXRjaCkge1xuICAgICAgICBiZXN0U3VnZ2VzdGlvbiA9IGJlc3RTdWdnZXN0aW9uIHx8IGBEaWQgeW91IG1lYW4gXFwnJHtsb2FkZXIuaWR9LiR7a2V5fVxcJz9gO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gYmVzdFN1Z2dlc3Rpb247XG59XG5mdW5jdGlvbiBub3JtYWxpemVPcHRpb25zSW50ZXJuYWwobG9hZGVyLCBvcHRpb25zLCB1cmwpIHtcbiAgY29uc3QgbG9hZGVyRGVmYXVsdE9wdGlvbnMgPSBsb2FkZXIub3B0aW9ucyB8fCB7fTtcbiAgY29uc3QgbWVyZ2VkT3B0aW9ucyA9IHtcbiAgICAuLi5sb2FkZXJEZWZhdWx0T3B0aW9uc1xuICB9O1xuICBhZGRVcmxPcHRpb25zKG1lcmdlZE9wdGlvbnMsIHVybCk7XG4gIGlmIChtZXJnZWRPcHRpb25zLmxvZyA9PT0gbnVsbCkge1xuICAgIG1lcmdlZE9wdGlvbnMubG9nID0gbmV3IE51bGxMb2coKTtcbiAgfVxuICBtZXJnZU5lc3RlZEZpZWxkcyhtZXJnZWRPcHRpb25zLCBnZXRHbG9iYWxMb2FkZXJPcHRpb25zKCkpO1xuICBtZXJnZU5lc3RlZEZpZWxkcyhtZXJnZWRPcHRpb25zLCBvcHRpb25zKTtcbiAgcmV0dXJuIG1lcmdlZE9wdGlvbnM7XG59XG5mdW5jdGlvbiBtZXJnZU5lc3RlZEZpZWxkcyhtZXJnZWRPcHRpb25zLCBvcHRpb25zKSB7XG4gIGZvciAoY29uc3Qga2V5IGluIG9wdGlvbnMpIHtcbiAgICBpZiAoa2V5IGluIG9wdGlvbnMpIHtcbiAgICAgIGNvbnN0IHZhbHVlID0gb3B0aW9uc1trZXldO1xuICAgICAgaWYgKGlzUHVyZU9iamVjdCh2YWx1ZSkgJiYgaXNQdXJlT2JqZWN0KG1lcmdlZE9wdGlvbnNba2V5XSkpIHtcbiAgICAgICAgbWVyZ2VkT3B0aW9uc1trZXldID0ge1xuICAgICAgICAgIC4uLm1lcmdlZE9wdGlvbnNba2V5XSxcbiAgICAgICAgICAuLi5vcHRpb25zW2tleV1cbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1lcmdlZE9wdGlvbnNba2V5XSA9IG9wdGlvbnNba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIGFkZFVybE9wdGlvbnMob3B0aW9ucywgdXJsKSB7XG4gIGlmICh1cmwgJiYgISgnYmFzZVVyaScgaW4gb3B0aW9ucykpIHtcbiAgICBvcHRpb25zLmJhc2VVcmkgPSB1cmw7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW9wdGlvbi11dGlscy5qcy5tYXAiLCJpbXBvcnQgeyBMb2cgfSBmcm9tICdAcHJvYmUuZ2wvbG9nJztcbmV4cG9ydCBjb25zdCBsb2cgPSBuZXcgTG9nKHtcbiAgaWQ6ICdsb2FkZXJzLmdsJ1xufSk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1sb2cuanMubWFwIiwiY29uc3QgREFUQV9VUkxfUEFUVEVSTiA9IC9eZGF0YTooWy1cXHcuXStcXC9bLVxcdy4rXSspKDt8LCkvO1xuY29uc3QgTUlNRV9UWVBFX1BBVFRFUk4gPSAvXihbLVxcdy5dK1xcL1stXFx3LitdKykvO1xuZXhwb3J0IGZ1bmN0aW9uIHBhcnNlTUlNRVR5cGUobWltZVN0cmluZykge1xuICBjb25zdCBtYXRjaGVzID0gTUlNRV9UWVBFX1BBVFRFUk4uZXhlYyhtaW1lU3RyaW5nKTtcbiAgaWYgKG1hdGNoZXMpIHtcbiAgICByZXR1cm4gbWF0Y2hlc1sxXTtcbiAgfVxuICByZXR1cm4gbWltZVN0cmluZztcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZU1JTUVUeXBlRnJvbVVSTCh1cmwpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IERBVEFfVVJMX1BBVFRFUk4uZXhlYyh1cmwpO1xuICBpZiAobWF0Y2hlcykge1xuICAgIHJldHVybiBtYXRjaGVzWzFdO1xuICB9XG4gIHJldHVybiAnJztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1pbWUtdHlwZS11dGlscy5qcy5tYXAiLCJpbXBvcnQgeyBpc1Jlc3BvbnNlLCBpc0Jsb2IgfSBmcm9tIFwiLi4vLi4vamF2YXNjcmlwdC11dGlscy9pcy10eXBlLmpzXCI7XG5pbXBvcnQgeyBwYXJzZU1JTUVUeXBlLCBwYXJzZU1JTUVUeXBlRnJvbVVSTCB9IGZyb20gXCIuL21pbWUtdHlwZS11dGlscy5qc1wiO1xuaW1wb3J0IHsgc3RyaXBRdWVyeVN0cmluZyB9IGZyb20gXCIuL3VybC11dGlscy5qc1wiO1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc291cmNlVXJsKHJlc291cmNlKSB7XG4gIGlmIChpc1Jlc3BvbnNlKHJlc291cmNlKSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gcmVzb3VyY2U7XG4gICAgcmV0dXJuIHJlc3BvbnNlLnVybDtcbiAgfVxuICBpZiAoaXNCbG9iKHJlc291cmNlKSkge1xuICAgIGNvbnN0IGJsb2IgPSByZXNvdXJjZTtcbiAgICByZXR1cm4gYmxvYi5uYW1lIHx8ICcnO1xuICB9XG4gIGlmICh0eXBlb2YgcmVzb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIHJlc291cmNlO1xuICB9XG4gIHJldHVybiAnJztcbn1cbmV4cG9ydCBmdW5jdGlvbiBnZXRSZXNvdXJjZU1JTUVUeXBlKHJlc291cmNlKSB7XG4gIGlmIChpc1Jlc3BvbnNlKHJlc291cmNlKSkge1xuICAgIGNvbnN0IHJlc3BvbnNlID0gcmVzb3VyY2U7XG4gICAgY29uc3QgY29udGVudFR5cGVIZWFkZXIgPSByZXNwb25zZS5oZWFkZXJzLmdldCgnY29udGVudC10eXBlJykgfHwgJyc7XG4gICAgY29uc3Qgbm9RdWVyeVVybCA9IHN0cmlwUXVlcnlTdHJpbmcocmVzcG9uc2UudXJsKTtcbiAgICByZXR1cm4gcGFyc2VNSU1FVHlwZShjb250ZW50VHlwZUhlYWRlcikgfHwgcGFyc2VNSU1FVHlwZUZyb21VUkwobm9RdWVyeVVybCk7XG4gIH1cbiAgaWYgKGlzQmxvYihyZXNvdXJjZSkpIHtcbiAgICBjb25zdCBibG9iID0gcmVzb3VyY2U7XG4gICAgcmV0dXJuIGJsb2IudHlwZSB8fCAnJztcbiAgfVxuICBpZiAodHlwZW9mIHJlc291cmNlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBwYXJzZU1JTUVUeXBlRnJvbVVSTChyZXNvdXJjZSk7XG4gIH1cbiAgcmV0dXJuICcnO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlc291cmNlQ29udGVudExlbmd0aChyZXNvdXJjZSkge1xuICBpZiAoaXNSZXNwb25zZShyZXNvdXJjZSkpIHtcbiAgICBjb25zdCByZXNwb25zZSA9IHJlc291cmNlO1xuICAgIHJldHVybiByZXNwb25zZS5oZWFkZXJzWydjb250ZW50LWxlbmd0aCddIHx8IC0xO1xuICB9XG4gIGlmIChpc0Jsb2IocmVzb3VyY2UpKSB7XG4gICAgY29uc3QgYmxvYiA9IHJlc291cmNlO1xuICAgIHJldHVybiBibG9iLnNpemU7XG4gIH1cbiAgaWYgKHR5cGVvZiByZXNvdXJjZSA9PT0gJ3N0cmluZycpIHtcbiAgICByZXR1cm4gcmVzb3VyY2UubGVuZ3RoO1xuICB9XG4gIGlmIChyZXNvdXJjZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHJlc291cmNlLmJ5dGVMZW5ndGg7XG4gIH1cbiAgaWYgKEFycmF5QnVmZmVyLmlzVmlldyhyZXNvdXJjZSkpIHtcbiAgICByZXR1cm4gcmVzb3VyY2UuYnl0ZUxlbmd0aDtcbiAgfVxuICByZXR1cm4gLTE7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1yZXNvdXJjZS11dGlscy5qcy5tYXAiLCJpbXBvcnQgeyBpc1Jlc3BvbnNlIH0gZnJvbSBcIi4uLy4uL2phdmFzY3JpcHQtdXRpbHMvaXMtdHlwZS5qc1wiO1xuaW1wb3J0IHsgZ2V0UmVzb3VyY2VDb250ZW50TGVuZ3RoLCBnZXRSZXNvdXJjZVVybCwgZ2V0UmVzb3VyY2VNSU1FVHlwZSB9IGZyb20gXCIuL3Jlc291cmNlLXV0aWxzLmpzXCI7XG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbWFrZVJlc3BvbnNlKHJlc291cmNlKSB7XG4gIGlmIChpc1Jlc3BvbnNlKHJlc291cmNlKSkge1xuICAgIHJldHVybiByZXNvdXJjZTtcbiAgfVxuICBjb25zdCBoZWFkZXJzID0ge307XG4gIGNvbnN0IGNvbnRlbnRMZW5ndGggPSBnZXRSZXNvdXJjZUNvbnRlbnRMZW5ndGgocmVzb3VyY2UpO1xuICBpZiAoY29udGVudExlbmd0aCA+PSAwKSB7XG4gICAgaGVhZGVyc1snY29udGVudC1sZW5ndGgnXSA9IFN0cmluZyhjb250ZW50TGVuZ3RoKTtcbiAgfVxuICBjb25zdCB1cmwgPSBnZXRSZXNvdXJjZVVybChyZXNvdXJjZSk7XG4gIGNvbnN0IHR5cGUgPSBnZXRSZXNvdXJjZU1JTUVUeXBlKHJlc291cmNlKTtcbiAgaWYgKHR5cGUpIHtcbiAgICBoZWFkZXJzWydjb250ZW50LXR5cGUnXSA9IHR5cGU7XG4gIH1cbiAgY29uc3QgaW5pdGlhbERhdGFVcmwgPSBhd2FpdCBnZXRJbml0aWFsRGF0YVVybChyZXNvdXJjZSk7XG4gIGlmIChpbml0aWFsRGF0YVVybCkge1xuICAgIGhlYWRlcnNbJ3gtZmlyc3QtYnl0ZXMnXSA9IGluaXRpYWxEYXRhVXJsO1xuICB9XG4gIGlmICh0eXBlb2YgcmVzb3VyY2UgPT09ICdzdHJpbmcnKSB7XG4gICAgcmVzb3VyY2UgPSBuZXcgVGV4dEVuY29kZXIoKS5lbmNvZGUocmVzb3VyY2UpO1xuICB9XG4gIGNvbnN0IHJlc3BvbnNlID0gbmV3IFJlc3BvbnNlKHJlc291cmNlLCB7XG4gICAgaGVhZGVyc1xuICB9KTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHJlc3BvbnNlLCAndXJsJywge1xuICAgIHZhbHVlOiB1cmxcbiAgfSk7XG4gIHJldHVybiByZXNwb25zZTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjaGVja1Jlc3BvbnNlKHJlc3BvbnNlKSB7XG4gIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICBjb25zdCBtZXNzYWdlID0gYXdhaXQgZ2V0UmVzcG9uc2VFcnJvcihyZXNwb25zZSk7XG4gICAgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UpO1xuICB9XG59XG5leHBvcnQgZnVuY3Rpb24gY2hlY2tSZXNwb25zZVN5bmMocmVzcG9uc2UpIHtcbiAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgIGxldCBtZXNzYWdlID0gYCR7cmVzcG9uc2Uuc3RhdHVzfSAke3Jlc3BvbnNlLnN0YXR1c1RleHR9YDtcbiAgICBtZXNzYWdlID0gbWVzc2FnZS5sZW5ndGggPiA2MCA/IGAke21lc3NhZ2Uuc2xpY2UoMCwgNjApfS4uLmAgOiBtZXNzYWdlO1xuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgfVxufVxuYXN5bmMgZnVuY3Rpb24gZ2V0UmVzcG9uc2VFcnJvcihyZXNwb25zZSkge1xuICBsZXQgbWVzc2FnZSA9IGBGYWlsZWQgdG8gZmV0Y2ggcmVzb3VyY2UgJHtyZXNwb25zZS51cmx9ICgke3Jlc3BvbnNlLnN0YXR1c30pOiBgO1xuICB0cnkge1xuICAgIGNvbnN0IGNvbnRlbnRUeXBlID0gcmVzcG9uc2UuaGVhZGVycy5nZXQoJ0NvbnRlbnQtVHlwZScpO1xuICAgIGxldCB0ZXh0ID0gcmVzcG9uc2Uuc3RhdHVzVGV4dDtcbiAgICBpZiAoY29udGVudFR5cGUgIT09IG51bGwgJiYgY29udGVudFR5cGUgIT09IHZvaWQgMCAmJiBjb250ZW50VHlwZS5pbmNsdWRlcygnYXBwbGljYXRpb24vanNvbicpKSB7XG4gICAgICB0ZXh0ICs9IGAgJHthd2FpdCByZXNwb25zZS50ZXh0KCl9YDtcbiAgICB9XG4gICAgbWVzc2FnZSArPSB0ZXh0O1xuICAgIG1lc3NhZ2UgPSBtZXNzYWdlLmxlbmd0aCA+IDYwID8gYCR7bWVzc2FnZS5zbGljZSgwLCA2MCl9Li4uYCA6IG1lc3NhZ2U7XG4gIH0gY2F0Y2ggKGVycm9yKSB7fVxuICByZXR1cm4gbWVzc2FnZTtcbn1cbmFzeW5jIGZ1bmN0aW9uIGdldEluaXRpYWxEYXRhVXJsKHJlc291cmNlKSB7XG4gIGNvbnN0IElOSVRJQUxfREFUQV9MRU5HVEggPSA1O1xuICBpZiAodHlwZW9mIHJlc291cmNlID09PSAnc3RyaW5nJykge1xuICAgIHJldHVybiBgZGF0YTosJHtyZXNvdXJjZS5zbGljZSgwLCBJTklUSUFMX0RBVEFfTEVOR1RIKX1gO1xuICB9XG4gIGlmIChyZXNvdXJjZSBpbnN0YW5jZW9mIEJsb2IpIHtcbiAgICBjb25zdCBibG9iU2xpY2UgPSByZXNvdXJjZS5zbGljZSgwLCA1KTtcbiAgICByZXR1cm4gYXdhaXQgbmV3IFByb21pc2UocmVzb2x2ZSA9PiB7XG4gICAgICBjb25zdCByZWFkZXIgPSBuZXcgRmlsZVJlYWRlcigpO1xuICAgICAgcmVhZGVyLm9ubG9hZCA9IGV2ZW50ID0+IHtcbiAgICAgICAgdmFyIF9ldmVudCR0YXJnZXQ7XG4gICAgICAgIHJldHVybiByZXNvbHZlKGV2ZW50ID09PSBudWxsIHx8IGV2ZW50ID09PSB2b2lkIDAgPyB2b2lkIDAgOiAoX2V2ZW50JHRhcmdldCA9IGV2ZW50LnRhcmdldCkgPT09IG51bGwgfHwgX2V2ZW50JHRhcmdldCA9PT0gdm9pZCAwID8gdm9pZCAwIDogX2V2ZW50JHRhcmdldC5yZXN1bHQpO1xuICAgICAgfTtcbiAgICAgIHJlYWRlci5yZWFkQXNEYXRhVVJMKGJsb2JTbGljZSk7XG4gICAgfSk7XG4gIH1cbiAgaWYgKHJlc291cmNlIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICBjb25zdCBzbGljZSA9IHJlc291cmNlLnNsaWNlKDAsIElOSVRJQUxfREFUQV9MRU5HVEgpO1xuICAgIGNvbnN0IGJhc2U2NCA9IGFycmF5QnVmZmVyVG9CYXNlNjQoc2xpY2UpO1xuICAgIHJldHVybiBgZGF0YTpiYXNlNjQsJHtiYXNlNjR9YDtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn1cbmZ1bmN0aW9uIGFycmF5QnVmZmVyVG9CYXNlNjQoYnVmZmVyKSB7XG4gIGxldCBiaW5hcnkgPSAnJztcbiAgY29uc3QgYnl0ZXMgPSBuZXcgVWludDhBcnJheShidWZmZXIpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ5dGVzLmJ5dGVMZW5ndGg7IGkrKykge1xuICAgIGJpbmFyeSArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldKTtcbiAgfVxuICByZXR1cm4gYnRvYShiaW5hcnkpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cmVzcG9uc2UtdXRpbHMuanMubWFwIiwiY29uc3QgUVVFUllfU1RSSU5HX1BBVFRFUk4gPSAvXFw/LiovO1xuZXhwb3J0IGZ1bmN0aW9uIGV4dHJhY3RRdWVyeVN0cmluZyh1cmwpIHtcbiAgY29uc3QgbWF0Y2hlcyA9IHVybC5tYXRjaChRVUVSWV9TVFJJTkdfUEFUVEVSTik7XG4gIHJldHVybiBtYXRjaGVzICYmIG1hdGNoZXNbMF07XG59XG5leHBvcnQgZnVuY3Rpb24gc3RyaXBRdWVyeVN0cmluZyh1cmwpIHtcbiAgcmV0dXJuIHVybC5yZXBsYWNlKFFVRVJZX1NUUklOR19QQVRURVJOLCAnJyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD11cmwtdXRpbHMuanMubWFwIiwiaW1wb3J0IHsgVkVSU0lPTiB9IGZyb20gXCIuL2xpYi91dGlscy92ZXJzaW9uLmpzXCI7XG5pbXBvcnQgeyBwYXJzZUdMQlN5bmMgfSBmcm9tIFwiLi9saWIvcGFyc2Vycy9wYXJzZS1nbGIuanNcIjtcbmV4cG9ydCBjb25zdCBHTEJMb2FkZXIgPSB7XG4gIG5hbWU6ICdHTEInLFxuICBpZDogJ2dsYicsXG4gIG1vZHVsZTogJ2dsdGYnLFxuICB2ZXJzaW9uOiBWRVJTSU9OLFxuICBleHRlbnNpb25zOiBbJ2dsYiddLFxuICBtaW1lVHlwZXM6IFsnbW9kZWwvZ2x0Zi1iaW5hcnknXSxcbiAgYmluYXJ5OiB0cnVlLFxuICBwYXJzZSxcbiAgcGFyc2VTeW5jLFxuICBvcHRpb25zOiB7XG4gICAgZ2xiOiB7XG4gICAgICBzdHJpY3Q6IGZhbHNlXG4gICAgfVxuICB9XG59O1xuYXN5bmMgZnVuY3Rpb24gcGFyc2UoYXJyYXlCdWZmZXIsIG9wdGlvbnMpIHtcbiAgcmV0dXJuIHBhcnNlU3luYyhhcnJheUJ1ZmZlciwgb3B0aW9ucyk7XG59XG5mdW5jdGlvbiBwYXJzZVN5bmMoYXJyYXlCdWZmZXIsIG9wdGlvbnMpIHtcbiAgY29uc3Qge1xuICAgIGJ5dGVPZmZzZXQgPSAwXG4gIH0gPSBvcHRpb25zIHx8IHt9O1xuICBjb25zdCBnbGIgPSB7fTtcbiAgcGFyc2VHTEJTeW5jKGdsYiwgYXJyYXlCdWZmZXIsIGJ5dGVPZmZzZXQsIG9wdGlvbnMgPT09IG51bGwgfHwgb3B0aW9ucyA9PT0gdm9pZCAwID8gdm9pZCAwIDogb3B0aW9ucy5nbGIpO1xuICByZXR1cm4gZ2xiO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2xiLWxvYWRlci5qcy5tYXAiLCJpbXBvcnQgeyBwYWRUb05CeXRlcywgYXNzZXJ0IH0gZnJvbSAnQGxvYWRlcnMuZ2wvbG9hZGVyLXV0aWxzJztcbmNvbnN0IExJVFRMRV9FTkRJQU4gPSB0cnVlO1xuY29uc3QgTUFHSUNfZ2xURiA9IDB4Njc2YzU0NDY7XG5jb25zdCBHTEJfRklMRV9IRUFERVJfU0laRSA9IDEyO1xuY29uc3QgR0xCX0NIVU5LX0hFQURFUl9TSVpFID0gODtcbmNvbnN0IEdMQl9DSFVOS19UWVBFX0pTT04gPSAweDRlNGY1MzRhO1xuY29uc3QgR0xCX0NIVU5LX1RZUEVfQklOID0gMHgwMDRlNDk0MjtcbmNvbnN0IEdMQl9WMV9DT05URU5UX0ZPUk1BVF9KU09OID0gMHgwO1xuY29uc3QgR0xCX0NIVU5LX1RZUEVfSlNPTl9YVklaX0RFUFJFQ0FURUQgPSAwO1xuY29uc3QgR0xCX0NIVU5LX1RZUEVfQklYX1hWSVpfREVQUkVDQVRFRCA9IDE7XG5mdW5jdGlvbiBnZXRNYWdpY1N0cmluZyhkYXRhVmlldykge1xuICBsZXQgYnl0ZU9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgcmV0dXJuIGBcXFxuJHtTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFWaWV3LmdldFVpbnQ4KGJ5dGVPZmZzZXQgKyAwKSl9XFxcbiR7U3RyaW5nLmZyb21DaGFyQ29kZShkYXRhVmlldy5nZXRVaW50OChieXRlT2Zmc2V0ICsgMSkpfVxcXG4ke1N0cmluZy5mcm9tQ2hhckNvZGUoZGF0YVZpZXcuZ2V0VWludDgoYnl0ZU9mZnNldCArIDIpKX1cXFxuJHtTdHJpbmcuZnJvbUNoYXJDb2RlKGRhdGFWaWV3LmdldFVpbnQ4KGJ5dGVPZmZzZXQgKyAzKSl9YDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBpc0dMQihhcnJheUJ1ZmZlcikge1xuICBsZXQgYnl0ZU9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDogMDtcbiAgbGV0IG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IHt9O1xuICBjb25zdCBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhhcnJheUJ1ZmZlcik7XG4gIGNvbnN0IHtcbiAgICBtYWdpYyA9IE1BR0lDX2dsVEZcbiAgfSA9IG9wdGlvbnM7XG4gIGNvbnN0IG1hZ2ljMSA9IGRhdGFWaWV3LmdldFVpbnQzMihieXRlT2Zmc2V0LCBmYWxzZSk7XG4gIHJldHVybiBtYWdpYzEgPT09IG1hZ2ljIHx8IG1hZ2ljMSA9PT0gTUFHSUNfZ2xURjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBwYXJzZUdMQlN5bmMoZ2xiLCBhcnJheUJ1ZmZlcikge1xuICBsZXQgYnl0ZU9mZnNldCA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogMDtcbiAgbGV0IG9wdGlvbnMgPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHt9O1xuICBjb25zdCBkYXRhVmlldyA9IG5ldyBEYXRhVmlldyhhcnJheUJ1ZmZlcik7XG4gIGNvbnN0IHR5cGUgPSBnZXRNYWdpY1N0cmluZyhkYXRhVmlldywgYnl0ZU9mZnNldCArIDApO1xuICBjb25zdCB2ZXJzaW9uID0gZGF0YVZpZXcuZ2V0VWludDMyKGJ5dGVPZmZzZXQgKyA0LCBMSVRUTEVfRU5ESUFOKTtcbiAgY29uc3QgYnl0ZUxlbmd0aCA9IGRhdGFWaWV3LmdldFVpbnQzMihieXRlT2Zmc2V0ICsgOCwgTElUVExFX0VORElBTik7XG4gIE9iamVjdC5hc3NpZ24oZ2xiLCB7XG4gICAgaGVhZGVyOiB7XG4gICAgICBieXRlT2Zmc2V0LFxuICAgICAgYnl0ZUxlbmd0aCxcbiAgICAgIGhhc0JpbkNodW5rOiBmYWxzZVxuICAgIH0sXG4gICAgdHlwZSxcbiAgICB2ZXJzaW9uLFxuICAgIGpzb246IHt9LFxuICAgIGJpbkNodW5rczogW11cbiAgfSk7XG4gIGJ5dGVPZmZzZXQgKz0gR0xCX0ZJTEVfSEVBREVSX1NJWkU7XG4gIHN3aXRjaCAoZ2xiLnZlcnNpb24pIHtcbiAgICBjYXNlIDE6XG4gICAgICByZXR1cm4gcGFyc2VHTEJWMShnbGIsIGRhdGFWaWV3LCBieXRlT2Zmc2V0KTtcbiAgICBjYXNlIDI6XG4gICAgICByZXR1cm4gcGFyc2VHTEJWMihnbGIsIGRhdGFWaWV3LCBieXRlT2Zmc2V0LCBvcHRpb25zID0ge30pO1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgR0xCIHZlcnNpb24gJHtnbGIudmVyc2lvbn0uIE9ubHkgc3VwcG9ydHMgdmVyc2lvbiAxIGFuZCAyLmApO1xuICB9XG59XG5mdW5jdGlvbiBwYXJzZUdMQlYxKGdsYiwgZGF0YVZpZXcsIGJ5dGVPZmZzZXQpIHtcbiAgYXNzZXJ0KGdsYi5oZWFkZXIuYnl0ZUxlbmd0aCA+IEdMQl9GSUxFX0hFQURFUl9TSVpFICsgR0xCX0NIVU5LX0hFQURFUl9TSVpFKTtcbiAgY29uc3QgY29udGVudExlbmd0aCA9IGRhdGFWaWV3LmdldFVpbnQzMihieXRlT2Zmc2V0ICsgMCwgTElUVExFX0VORElBTik7XG4gIGNvbnN0IGNvbnRlbnRGb3JtYXQgPSBkYXRhVmlldy5nZXRVaW50MzIoYnl0ZU9mZnNldCArIDQsIExJVFRMRV9FTkRJQU4pO1xuICBieXRlT2Zmc2V0ICs9IEdMQl9DSFVOS19IRUFERVJfU0laRTtcbiAgYXNzZXJ0KGNvbnRlbnRGb3JtYXQgPT09IEdMQl9WMV9DT05URU5UX0ZPUk1BVF9KU09OKTtcbiAgcGFyc2VKU09OQ2h1bmsoZ2xiLCBkYXRhVmlldywgYnl0ZU9mZnNldCwgY29udGVudExlbmd0aCk7XG4gIGJ5dGVPZmZzZXQgKz0gY29udGVudExlbmd0aDtcbiAgYnl0ZU9mZnNldCArPSBwYXJzZUJJTkNodW5rKGdsYiwgZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIGdsYi5oZWFkZXIuYnl0ZUxlbmd0aCk7XG4gIHJldHVybiBieXRlT2Zmc2V0O1xufVxuZnVuY3Rpb24gcGFyc2VHTEJWMihnbGIsIGRhdGFWaWV3LCBieXRlT2Zmc2V0LCBvcHRpb25zKSB7XG4gIGFzc2VydChnbGIuaGVhZGVyLmJ5dGVMZW5ndGggPiBHTEJfRklMRV9IRUFERVJfU0laRSArIEdMQl9DSFVOS19IRUFERVJfU0laRSk7XG4gIHBhcnNlR0xCQ2h1bmtzU3luYyhnbGIsIGRhdGFWaWV3LCBieXRlT2Zmc2V0LCBvcHRpb25zKTtcbiAgcmV0dXJuIGJ5dGVPZmZzZXQgKyBnbGIuaGVhZGVyLmJ5dGVMZW5ndGg7XG59XG5mdW5jdGlvbiBwYXJzZUdMQkNodW5rc1N5bmMoZ2xiLCBkYXRhVmlldywgYnl0ZU9mZnNldCwgb3B0aW9ucykge1xuICB3aGlsZSAoYnl0ZU9mZnNldCArIDggPD0gZ2xiLmhlYWRlci5ieXRlTGVuZ3RoKSB7XG4gICAgY29uc3QgY2h1bmtMZW5ndGggPSBkYXRhVmlldy5nZXRVaW50MzIoYnl0ZU9mZnNldCArIDAsIExJVFRMRV9FTkRJQU4pO1xuICAgIGNvbnN0IGNodW5rRm9ybWF0ID0gZGF0YVZpZXcuZ2V0VWludDMyKGJ5dGVPZmZzZXQgKyA0LCBMSVRUTEVfRU5ESUFOKTtcbiAgICBieXRlT2Zmc2V0ICs9IEdMQl9DSFVOS19IRUFERVJfU0laRTtcbiAgICBzd2l0Y2ggKGNodW5rRm9ybWF0KSB7XG4gICAgICBjYXNlIEdMQl9DSFVOS19UWVBFX0pTT046XG4gICAgICAgIHBhcnNlSlNPTkNodW5rKGdsYiwgZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIGNodW5rTGVuZ3RoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIEdMQl9DSFVOS19UWVBFX0JJTjpcbiAgICAgICAgcGFyc2VCSU5DaHVuayhnbGIsIGRhdGFWaWV3LCBieXRlT2Zmc2V0LCBjaHVua0xlbmd0aCk7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSBHTEJfQ0hVTktfVFlQRV9KU09OX1hWSVpfREVQUkVDQVRFRDpcbiAgICAgICAgaWYgKCFvcHRpb25zLnN0cmljdCkge1xuICAgICAgICAgIHBhcnNlSlNPTkNodW5rKGdsYiwgZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIGNodW5rTGVuZ3RoKTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgR0xCX0NIVU5LX1RZUEVfQklYX1hWSVpfREVQUkVDQVRFRDpcbiAgICAgICAgaWYgKCFvcHRpb25zLnN0cmljdCkge1xuICAgICAgICAgIHBhcnNlQklOQ2h1bmsoZ2xiLCBkYXRhVmlldywgYnl0ZU9mZnNldCwgY2h1bmtMZW5ndGgpO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICAgIGJ5dGVPZmZzZXQgKz0gcGFkVG9OQnl0ZXMoY2h1bmtMZW5ndGgsIDQpO1xuICB9XG4gIHJldHVybiBieXRlT2Zmc2V0O1xufVxuZnVuY3Rpb24gcGFyc2VKU09OQ2h1bmsoZ2xiLCBkYXRhVmlldywgYnl0ZU9mZnNldCwgY2h1bmtMZW5ndGgpIHtcbiAgY29uc3QganNvbkNodW5rID0gbmV3IFVpbnQ4QXJyYXkoZGF0YVZpZXcuYnVmZmVyLCBieXRlT2Zmc2V0LCBjaHVua0xlbmd0aCk7XG4gIGNvbnN0IHRleHREZWNvZGVyID0gbmV3IFRleHREZWNvZGVyKCd1dGY4Jyk7XG4gIGNvbnN0IGpzb25UZXh0ID0gdGV4dERlY29kZXIuZGVjb2RlKGpzb25DaHVuayk7XG4gIGdsYi5qc29uID0gSlNPTi5wYXJzZShqc29uVGV4dCk7XG4gIHJldHVybiBwYWRUb05CeXRlcyhjaHVua0xlbmd0aCwgNCk7XG59XG5mdW5jdGlvbiBwYXJzZUJJTkNodW5rKGdsYiwgZGF0YVZpZXcsIGJ5dGVPZmZzZXQsIGNodW5rTGVuZ3RoKSB7XG4gIGdsYi5oZWFkZXIuaGFzQmluQ2h1bmsgPSB0cnVlO1xuICBnbGIuYmluQ2h1bmtzLnB1c2goe1xuICAgIGJ5dGVPZmZzZXQsXG4gICAgYnl0ZUxlbmd0aDogY2h1bmtMZW5ndGgsXG4gICAgYXJyYXlCdWZmZXI6IGRhdGFWaWV3LmJ1ZmZlclxuICB9KTtcbiAgcmV0dXJuIHBhZFRvTkJ5dGVzKGNodW5rTGVuZ3RoLCA0KTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXBhcnNlLWdsYi5qcy5tYXAiLCJleHBvcnQgY29uc3QgVkVSU0lPTiA9IHR5cGVvZiBcIjQuMS4zXCIgIT09ICd1bmRlZmluZWQnID8gXCI0LjEuM1wiIDogJ2xhdGVzdCc7XG4vLyMgc291cmNlTWFwcGluZ1VSTD12ZXJzaW9uLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiBjb21wYXJlQXJyYXlCdWZmZXJzKGFycmF5QnVmZmVyMSwgYXJyYXlCdWZmZXIyLCBieXRlTGVuZ3RoKSB7XG4gIGJ5dGVMZW5ndGggPSBieXRlTGVuZ3RoIHx8IGFycmF5QnVmZmVyMS5ieXRlTGVuZ3RoO1xuICBpZiAoYXJyYXlCdWZmZXIxLmJ5dGVMZW5ndGggPCBieXRlTGVuZ3RoIHx8IGFycmF5QnVmZmVyMi5ieXRlTGVuZ3RoIDwgYnl0ZUxlbmd0aCkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBjb25zdCBhcnJheTEgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcjEpO1xuICBjb25zdCBhcnJheTIgPSBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcjIpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGFycmF5MS5sZW5ndGg7ICsraSkge1xuICAgIGlmIChhcnJheTFbaV0gIT09IGFycmF5MltpXSkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb25jYXRlbmF0ZUFycmF5QnVmZmVycygpIHtcbiAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIHNvdXJjZXMgPSBuZXcgQXJyYXkoX2xlbiksIF9rZXkgPSAwOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgc291cmNlc1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuICByZXR1cm4gY29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnNGcm9tQXJyYXkoc291cmNlcyk7XG59XG5leHBvcnQgZnVuY3Rpb24gY29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnNGcm9tQXJyYXkoc291cmNlcykge1xuICBjb25zdCBzb3VyY2VBcnJheXMgPSBzb3VyY2VzLm1hcChzb3VyY2UyID0+IHNvdXJjZTIgaW5zdGFuY2VvZiBBcnJheUJ1ZmZlciA/IG5ldyBVaW50OEFycmF5KHNvdXJjZTIpIDogc291cmNlMik7XG4gIGNvbnN0IGJ5dGVMZW5ndGggPSBzb3VyY2VBcnJheXMucmVkdWNlKChsZW5ndGgsIHR5cGVkQXJyYXkpID0+IGxlbmd0aCArIHR5cGVkQXJyYXkuYnl0ZUxlbmd0aCwgMCk7XG4gIGNvbnN0IHJlc3VsdCA9IG5ldyBVaW50OEFycmF5KGJ5dGVMZW5ndGgpO1xuICBsZXQgb2Zmc2V0ID0gMDtcbiAgZm9yIChjb25zdCBzb3VyY2VBcnJheSBvZiBzb3VyY2VBcnJheXMpIHtcbiAgICByZXN1bHQuc2V0KHNvdXJjZUFycmF5LCBvZmZzZXQpO1xuICAgIG9mZnNldCArPSBzb3VyY2VBcnJheS5ieXRlTGVuZ3RoO1xuICB9XG4gIHJldHVybiByZXN1bHQuYnVmZmVyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGNvbmNhdGVuYXRlVHlwZWRBcnJheXMoKSB7XG4gIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgdHlwZWRBcnJheXMgPSBuZXcgQXJyYXkoX2xlbjIpLCBfa2V5MiA9IDA7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICB0eXBlZEFycmF5c1tfa2V5Ml0gPSBhcmd1bWVudHNbX2tleTJdO1xuICB9XG4gIGNvbnN0IGFycmF5cyA9IHR5cGVkQXJyYXlzO1xuICBjb25zdCBUeXBlZEFycmF5Q29uc3RydWN0b3IgPSBhcnJheXMgJiYgYXJyYXlzLmxlbmd0aCA+IDEgJiYgYXJyYXlzWzBdLmNvbnN0cnVjdG9yIHx8IG51bGw7XG4gIGlmICghVHlwZWRBcnJheUNvbnN0cnVjdG9yKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdcImNvbmNhdGVuYXRlVHlwZWRBcnJheXNcIiAtIGluY29ycmVjdCBxdWFudGl0eSBvZiBhcmd1bWVudHMgb3IgYXJndW1lbnRzIGhhdmUgaW5jb21wYXRpYmxlIGRhdGEgdHlwZXMnKTtcbiAgfVxuICBjb25zdCBzdW1MZW5ndGggPSBhcnJheXMucmVkdWNlKChhY2MsIHZhbHVlKSA9PiBhY2MgKyB2YWx1ZS5sZW5ndGgsIDApO1xuICBjb25zdCByZXN1bHQgPSBuZXcgVHlwZWRBcnJheUNvbnN0cnVjdG9yKHN1bUxlbmd0aCk7XG4gIGxldCBvZmZzZXQgPSAwO1xuICBmb3IgKGNvbnN0IGFycmF5IG9mIGFycmF5cykge1xuICAgIHJlc3VsdC5zZXQoYXJyYXksIG9mZnNldCk7XG4gICAgb2Zmc2V0ICs9IGFycmF5Lmxlbmd0aDtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0IGZ1bmN0aW9uIHNsaWNlQXJyYXlCdWZmZXIoYXJyYXlCdWZmZXIsIGJ5dGVPZmZzZXQsIGJ5dGVMZW5ndGgpIHtcbiAgY29uc3Qgc3ViQXJyYXkgPSBieXRlTGVuZ3RoICE9PSB1bmRlZmluZWQgPyBuZXcgVWludDhBcnJheShhcnJheUJ1ZmZlcikuc3ViYXJyYXkoYnl0ZU9mZnNldCwgYnl0ZU9mZnNldCArIGJ5dGVMZW5ndGgpIDogbmV3IFVpbnQ4QXJyYXkoYXJyYXlCdWZmZXIpLnN1YmFycmF5KGJ5dGVPZmZzZXQpO1xuICBjb25zdCBhcnJheUNvcHkgPSBuZXcgVWludDhBcnJheShzdWJBcnJheSk7XG4gIHJldHVybiBhcnJheUNvcHkuYnVmZmVyO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXJyYXktYnVmZmVyLXV0aWxzLmpzLm1hcCIsImltcG9ydCAqIGFzIG5vZGUgZnJvbSBcIi4uL25vZGUvYnVmZmVyLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gaXNCdWZmZXIodmFsdWUpIHtcbiAgcmV0dXJuIHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUuaXNCdWZmZXI7XG59XG5leHBvcnQgZnVuY3Rpb24gdG9CdWZmZXIoZGF0YSkge1xuICByZXR1cm4gbm9kZS50b0J1ZmZlciA/IG5vZGUudG9CdWZmZXIoZGF0YSkgOiBkYXRhO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvQXJyYXlCdWZmZXIoZGF0YSkge1xuICBpZiAoaXNCdWZmZXIoZGF0YSkpIHtcbiAgICByZXR1cm4gbm9kZS50b0FycmF5QnVmZmVyKGRhdGEpO1xuICB9XG4gIGlmIChkYXRhIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZGF0YTtcbiAgfVxuICBpZiAoQXJyYXlCdWZmZXIuaXNWaWV3KGRhdGEpKSB7XG4gICAgaWYgKGRhdGEuYnl0ZU9mZnNldCA9PT0gMCAmJiBkYXRhLmJ5dGVMZW5ndGggPT09IGRhdGEuYnVmZmVyLmJ5dGVMZW5ndGgpIHtcbiAgICAgIHJldHVybiBkYXRhLmJ1ZmZlcjtcbiAgICB9XG4gICAgcmV0dXJuIGRhdGEuYnVmZmVyLnNsaWNlKGRhdGEuYnl0ZU9mZnNldCwgZGF0YS5ieXRlT2Zmc2V0ICsgZGF0YS5ieXRlTGVuZ3RoKTtcbiAgfVxuICBpZiAodHlwZW9mIGRhdGEgPT09ICdzdHJpbmcnKSB7XG4gICAgY29uc3QgdGV4dCA9IGRhdGE7XG4gICAgY29uc3QgdWludDhBcnJheSA9IG5ldyBUZXh0RW5jb2RlcigpLmVuY29kZSh0ZXh0KTtcbiAgICByZXR1cm4gdWludDhBcnJheS5idWZmZXI7XG4gIH1cbiAgaWYgKGRhdGEgJiYgdHlwZW9mIGRhdGEgPT09ICdvYmplY3QnICYmIGRhdGEuX3RvQXJyYXlCdWZmZXIpIHtcbiAgICByZXR1cm4gZGF0YS5fdG9BcnJheUJ1ZmZlcigpO1xuICB9XG4gIHRocm93IG5ldyBFcnJvcigndG9BcnJheUJ1ZmZlcicpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVtb3J5LWNvbnZlcnNpb24tdXRpbHMuanMubWFwIiwiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4uL2Vudi11dGlscy9hc3NlcnQuanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBwYWRUb05CeXRlcyhieXRlTGVuZ3RoLCBwYWRkaW5nKSB7XG4gIGFzc2VydChieXRlTGVuZ3RoID49IDApO1xuICBhc3NlcnQocGFkZGluZyA+IDApO1xuICByZXR1cm4gYnl0ZUxlbmd0aCArIChwYWRkaW5nIC0gMSkgJiB+KHBhZGRpbmcgLSAxKTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb3B5QXJyYXlCdWZmZXIodGFyZ2V0QnVmZmVyLCBzb3VyY2VCdWZmZXIsIGJ5dGVPZmZzZXQpIHtcbiAgbGV0IGJ5dGVMZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoID4gMyAmJiBhcmd1bWVudHNbM10gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1szXSA6IHNvdXJjZUJ1ZmZlci5ieXRlTGVuZ3RoO1xuICBjb25zdCB0YXJnZXRBcnJheSA9IG5ldyBVaW50OEFycmF5KHRhcmdldEJ1ZmZlciwgYnl0ZU9mZnNldCwgYnl0ZUxlbmd0aCk7XG4gIGNvbnN0IHNvdXJjZUFycmF5ID0gbmV3IFVpbnQ4QXJyYXkoc291cmNlQnVmZmVyKTtcbiAgdGFyZ2V0QXJyYXkuc2V0KHNvdXJjZUFycmF5KTtcbiAgcmV0dXJuIHRhcmdldEJ1ZmZlcjtcbn1cbmV4cG9ydCBmdW5jdGlvbiBjb3B5VG9BcnJheShzb3VyY2UsIHRhcmdldCwgdGFyZ2V0T2Zmc2V0KSB7XG4gIGxldCBzb3VyY2VBcnJheTtcbiAgaWYgKHNvdXJjZSBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgc291cmNlQXJyYXkgPSBuZXcgVWludDhBcnJheShzb3VyY2UpO1xuICB9IGVsc2Uge1xuICAgIGNvbnN0IHNyY0J5dGVPZmZzZXQgPSBzb3VyY2UuYnl0ZU9mZnNldDtcbiAgICBjb25zdCBzcmNCeXRlTGVuZ3RoID0gc291cmNlLmJ5dGVMZW5ndGg7XG4gICAgc291cmNlQXJyYXkgPSBuZXcgVWludDhBcnJheShzb3VyY2UuYnVmZmVyIHx8IHNvdXJjZS5hcnJheUJ1ZmZlciwgc3JjQnl0ZU9mZnNldCwgc3JjQnl0ZUxlbmd0aCk7XG4gIH1cbiAgdGFyZ2V0LnNldChzb3VyY2VBcnJheSwgdGFyZ2V0T2Zmc2V0KTtcbiAgcmV0dXJuIHRhcmdldE9mZnNldCArIHBhZFRvTkJ5dGVzKHNvdXJjZUFycmF5LmJ5dGVMZW5ndGgsIDQpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9bWVtb3J5LWNvcHktdXRpbHMuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgaWYgKCFjb25kaXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnbG9hZGVyIGFzc2VydGlvbiBmYWlsZWQuJyk7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzc2VydC5qcy5tYXAiLCJjb25zdCBnbG9iYWxzID0ge1xuICBzZWxmOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZixcbiAgd2luZG93OiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3csXG4gIGdsb2JhbDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsLFxuICBkb2N1bWVudDogdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudFxufTtcbmNvbnN0IHNlbGZfID0gZ2xvYmFscy5zZWxmIHx8IGdsb2JhbHMud2luZG93IHx8IGdsb2JhbHMuZ2xvYmFsIHx8IHt9O1xuY29uc3Qgd2luZG93XyA9IGdsb2JhbHMud2luZG93IHx8IGdsb2JhbHMuc2VsZiB8fCBnbG9iYWxzLmdsb2JhbCB8fCB7fTtcbmNvbnN0IGdsb2JhbF8gPSBnbG9iYWxzLmdsb2JhbCB8fCBnbG9iYWxzLnNlbGYgfHwgZ2xvYmFscy53aW5kb3cgfHwge307XG5jb25zdCBkb2N1bWVudF8gPSBnbG9iYWxzLmRvY3VtZW50IHx8IHt9O1xuZXhwb3J0IHsgc2VsZl8gYXMgc2VsZiwgd2luZG93XyBhcyB3aW5kb3csIGdsb2JhbF8gYXMgZ2xvYmFsLCBkb2N1bWVudF8gYXMgZG9jdW1lbnQgfTtcbmV4cG9ydCBjb25zdCBpc0Jyb3dzZXIgPSBCb29sZWFuKHR5cGVvZiBwcm9jZXNzICE9PSAnb2JqZWN0JyB8fCBTdHJpbmcocHJvY2VzcykgIT09ICdbb2JqZWN0IHByb2Nlc3NdJyB8fCBwcm9jZXNzLmJyb3dzZXIpO1xuZXhwb3J0IGNvbnN0IGlzV29ya2VyID0gdHlwZW9mIGltcG9ydFNjcmlwdHMgPT09ICdmdW5jdGlvbic7XG5jb25zdCBtYXRjaGVzID0gdHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MudmVyc2lvbiAmJiAvdihbMC05XSopLy5leGVjKHByb2Nlc3MudmVyc2lvbik7XG5leHBvcnQgY29uc3Qgbm9kZVZlcnNpb24gPSBtYXRjaGVzICYmIHBhcnNlRmxvYXQobWF0Y2hlc1sxXSkgfHwgMDtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdsb2JhbHMuanMubWFwIiwiaW1wb3J0IHsgY29uY2F0ZW5hdGVBcnJheUJ1ZmZlcnMgfSBmcm9tIFwiLi4vYmluYXJ5LXV0aWxzL2FycmF5LWJ1ZmZlci11dGlscy5qc1wiO1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGZvckVhY2goaXRlcmF0b3IsIHZpc2l0b3IpIHtcbiAgd2hpbGUgKHRydWUpIHtcbiAgICBjb25zdCB7XG4gICAgICBkb25lLFxuICAgICAgdmFsdWVcbiAgICB9ID0gYXdhaXQgaXRlcmF0b3IubmV4dCgpO1xuICAgIGlmIChkb25lKSB7XG4gICAgICBpdGVyYXRvci5yZXR1cm4oKTtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgY29uc3QgY2FuY2VsID0gdmlzaXRvcih2YWx1ZSk7XG4gICAgaWYgKGNhbmNlbCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgfVxufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbmNhdGVuYXRlQXJyYXlCdWZmZXJzQXN5bmMoYXN5bmNJdGVyYXRvcikge1xuICBjb25zdCBhcnJheUJ1ZmZlcnMgPSBbXTtcbiAgZm9yIGF3YWl0IChjb25zdCBjaHVuayBvZiBhc3luY0l0ZXJhdG9yKSB7XG4gICAgYXJyYXlCdWZmZXJzLnB1c2goY2h1bmspO1xuICB9XG4gIHJldHVybiBjb25jYXRlbmF0ZUFycmF5QnVmZmVycyguLi5hcnJheUJ1ZmZlcnMpO1xufVxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGNvbmNhdGVuYXRlU3RyaW5nc0FzeW5jKGFzeW5jSXRlcmF0b3IpIHtcbiAgY29uc3Qgc3RyaW5ncyA9IFtdO1xuICBmb3IgYXdhaXQgKGNvbnN0IGNodW5rIG9mIGFzeW5jSXRlcmF0b3IpIHtcbiAgICBzdHJpbmdzLnB1c2goY2h1bmspO1xuICB9XG4gIHJldHVybiBzdHJpbmdzLmpvaW4oJycpO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YXN5bmMtaXRlcmF0aW9uLmpzLm1hcCIsImV4cG9ydCBmdW5jdGlvbiB0b0FycmF5QnVmZmVyKGJ1ZmZlcikge1xuICByZXR1cm4gYnVmZmVyO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvQnVmZmVyKGJpbmFyeURhdGEpIHtcbiAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiBicm93c2VyJyk7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1idWZmZXIuYnJvd3Nlci5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gbWVyZ2VMb2FkZXJPcHRpb25zKGJhc2VPcHRpb25zLCBuZXdPcHRpb25zKSB7XG4gIHJldHVybiBtZXJnZU9wdGlvbnNSZWN1cnNpdmVseShiYXNlT3B0aW9ucyB8fCB7fSwgbmV3T3B0aW9ucyk7XG59XG5mdW5jdGlvbiBtZXJnZU9wdGlvbnNSZWN1cnNpdmVseShiYXNlT3B0aW9ucywgbmV3T3B0aW9ucykge1xuICBsZXQgbGV2ZWwgPSBhcmd1bWVudHMubGVuZ3RoID4gMiAmJiBhcmd1bWVudHNbMl0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1syXSA6IDA7XG4gIGlmIChsZXZlbCA+IDMpIHtcbiAgICByZXR1cm4gbmV3T3B0aW9ucztcbiAgfVxuICBjb25zdCBvcHRpb25zID0ge1xuICAgIC4uLmJhc2VPcHRpb25zXG4gIH07XG4gIGZvciAoY29uc3QgW2tleSwgbmV3VmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG5ld09wdGlvbnMpKSB7XG4gICAgaWYgKG5ld1ZhbHVlICYmIHR5cGVvZiBuZXdWYWx1ZSA9PT0gJ29iamVjdCcgJiYgIUFycmF5LmlzQXJyYXkobmV3VmFsdWUpKSB7XG4gICAgICBvcHRpb25zW2tleV0gPSBtZXJnZU9wdGlvbnNSZWN1cnNpdmVseShvcHRpb25zW2tleV0gfHwge30sIG5ld09wdGlvbnNba2V5XSwgbGV2ZWwgKyAxKTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3B0aW9uc1trZXldID0gbmV3T3B0aW9uc1trZXldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gb3B0aW9ucztcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPW1lcmdlLWxvYWRlci1vcHRpb25zLmpzLm1hcCIsImxldCBwYXRoUHJlZml4ID0gJyc7XG5jb25zdCBmaWxlQWxpYXNlcyA9IHt9O1xuZXhwb3J0IGZ1bmN0aW9uIHNldFBhdGhQcmVmaXgocHJlZml4KSB7XG4gIHBhdGhQcmVmaXggPSBwcmVmaXg7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0UGF0aFByZWZpeCgpIHtcbiAgcmV0dXJuIHBhdGhQcmVmaXg7XG59XG5leHBvcnQgZnVuY3Rpb24gYWRkQWxpYXNlcyhhbGlhc2VzKSB7XG4gIE9iamVjdC5hc3NpZ24oZmlsZUFsaWFzZXMsIGFsaWFzZXMpO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJlc29sdmVQYXRoKGZpbGVuYW1lKSB7XG4gIGZvciAoY29uc3QgYWxpYXMgaW4gZmlsZUFsaWFzZXMpIHtcbiAgICBpZiAoZmlsZW5hbWUuc3RhcnRzV2l0aChhbGlhcykpIHtcbiAgICAgIGNvbnN0IHJlcGxhY2VtZW50ID0gZmlsZUFsaWFzZXNbYWxpYXNdO1xuICAgICAgZmlsZW5hbWUgPSBmaWxlbmFtZS5yZXBsYWNlKGFsaWFzLCByZXBsYWNlbWVudCk7XG4gICAgfVxuICB9XG4gIGlmICghZmlsZW5hbWUuc3RhcnRzV2l0aCgnaHR0cDovLycpICYmICFmaWxlbmFtZS5zdGFydHNXaXRoKCdodHRwczovLycpKSB7XG4gICAgZmlsZW5hbWUgPSBgJHtwYXRoUHJlZml4fSR7ZmlsZW5hbWV9YDtcbiAgfVxuICByZXR1cm4gZmlsZW5hbWU7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1maWxlLWFsaWFzZXMuanMubWFwIiwiZXhwb3J0IGZ1bmN0aW9uIGdldENXRCgpIHtcbiAgdmFyIF93aW5kb3ckbG9jYXRpb247XG4gIGlmICh0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgdHlwZW9mIHByb2Nlc3MuY3dkICE9PSAndW5kZWZpbmVkJykge1xuICAgIHJldHVybiBwcm9jZXNzLmN3ZCgpO1xuICB9XG4gIGNvbnN0IHBhdGhuYW1lID0gKF93aW5kb3ckbG9jYXRpb24gPSB3aW5kb3cubG9jYXRpb24pID09PSBudWxsIHx8IF93aW5kb3ckbG9jYXRpb24gPT09IHZvaWQgMCA/IHZvaWQgMCA6IF93aW5kb3ckbG9jYXRpb24ucGF0aG5hbWU7XG4gIHJldHVybiAocGF0aG5hbWUgPT09IG51bGwgfHwgcGF0aG5hbWUgPT09IHZvaWQgMCA/IHZvaWQgMCA6IHBhdGhuYW1lLnNsaWNlKDAsIHBhdGhuYW1lLmxhc3RJbmRleE9mKCcvJykgKyAxKSkgfHwgJyc7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtY3dkLmpzLm1hcCIsImltcG9ydCB7IGdldENXRCB9IGZyb20gXCIuL2dldC1jd2QuanNcIjtcbmV4cG9ydCBmdW5jdGlvbiBmaWxlbmFtZSh1cmwpIHtcbiAgY29uc3Qgc2xhc2hJbmRleCA9IHVybCA/IHVybC5sYXN0SW5kZXhPZignLycpIDogLTE7XG4gIHJldHVybiBzbGFzaEluZGV4ID49IDAgPyB1cmwuc3Vic3RyKHNsYXNoSW5kZXggKyAxKSA6ICcnO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGRpcm5hbWUodXJsKSB7XG4gIGNvbnN0IHNsYXNoSW5kZXggPSB1cmwgPyB1cmwubGFzdEluZGV4T2YoJy8nKSA6IC0xO1xuICByZXR1cm4gc2xhc2hJbmRleCA+PSAwID8gdXJsLnN1YnN0cigwLCBzbGFzaEluZGV4KSA6ICcnO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGpvaW4oKSB7XG4gIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBwYXJ0cyA9IG5ldyBBcnJheShfbGVuKSwgX2tleSA9IDA7IF9rZXkgPCBfbGVuOyBfa2V5KyspIHtcbiAgICBwYXJ0c1tfa2V5XSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgfVxuICBjb25zdCBzZXBhcmF0b3IgPSAnLyc7XG4gIHBhcnRzID0gcGFydHMubWFwKChwYXJ0LCBpbmRleCkgPT4ge1xuICAgIGlmIChpbmRleCkge1xuICAgICAgcGFydCA9IHBhcnQucmVwbGFjZShuZXcgUmVnRXhwKGBeJHtzZXBhcmF0b3J9YCksICcnKTtcbiAgICB9XG4gICAgaWYgKGluZGV4ICE9PSBwYXJ0cy5sZW5ndGggLSAxKSB7XG4gICAgICBwYXJ0ID0gcGFydC5yZXBsYWNlKG5ldyBSZWdFeHAoYCR7c2VwYXJhdG9yfSRgKSwgJycpO1xuICAgIH1cbiAgICByZXR1cm4gcGFydDtcbiAgfSk7XG4gIHJldHVybiBwYXJ0cy5qb2luKHNlcGFyYXRvcik7XG59XG5leHBvcnQgZnVuY3Rpb24gcmVzb2x2ZSgpIHtcbiAgY29uc3QgcGF0aHMgPSBbXTtcbiAgZm9yIChsZXQgX2kgPSAwOyBfaSA8IGFyZ3VtZW50cy5sZW5ndGg7IF9pKyspIHtcbiAgICBwYXRoc1tfaV0gPSBfaSA8IDAgfHwgYXJndW1lbnRzLmxlbmd0aCA8PSBfaSA/IHVuZGVmaW5lZCA6IGFyZ3VtZW50c1tfaV07XG4gIH1cbiAgbGV0IHJlc29sdmVkUGF0aCA9ICcnO1xuICBsZXQgcmVzb2x2ZWRBYnNvbHV0ZSA9IGZhbHNlO1xuICBsZXQgY3dkO1xuICBmb3IgKGxldCBpID0gcGF0aHMubGVuZ3RoIC0gMTsgaSA+PSAtMSAmJiAhcmVzb2x2ZWRBYnNvbHV0ZTsgaS0tKSB7XG4gICAgbGV0IHBhdGg7XG4gICAgaWYgKGkgPj0gMCkge1xuICAgICAgcGF0aCA9IHBhdGhzW2ldO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAoY3dkID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgY3dkID0gZ2V0Q1dEKCk7XG4gICAgICB9XG4gICAgICBwYXRoID0gY3dkO1xuICAgIH1cbiAgICBpZiAocGF0aC5sZW5ndGggPT09IDApIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXNvbHZlZFBhdGggPSBgJHtwYXRofS8ke3Jlc29sdmVkUGF0aH1gO1xuICAgIHJlc29sdmVkQWJzb2x1dGUgPSBwYXRoLmNoYXJDb2RlQXQoMCkgPT09IFNMQVNIO1xuICB9XG4gIHJlc29sdmVkUGF0aCA9IG5vcm1hbGl6ZVN0cmluZ1Bvc2l4KHJlc29sdmVkUGF0aCwgIXJlc29sdmVkQWJzb2x1dGUpO1xuICBpZiAocmVzb2x2ZWRBYnNvbHV0ZSkge1xuICAgIHJldHVybiBgLyR7cmVzb2x2ZWRQYXRofWA7XG4gIH0gZWxzZSBpZiAocmVzb2x2ZWRQYXRoLmxlbmd0aCA+IDApIHtcbiAgICByZXR1cm4gcmVzb2x2ZWRQYXRoO1xuICB9XG4gIHJldHVybiAnLic7XG59XG5jb25zdCBTTEFTSCA9IDQ3O1xuY29uc3QgRE9UID0gNDY7XG5mdW5jdGlvbiBub3JtYWxpemVTdHJpbmdQb3NpeChwYXRoLCBhbGxvd0Fib3ZlUm9vdCkge1xuICBsZXQgcmVzID0gJyc7XG4gIGxldCBsYXN0U2xhc2ggPSAtMTtcbiAgbGV0IGRvdHMgPSAwO1xuICBsZXQgY29kZTtcbiAgbGV0IGlzQWJvdmVSb290ID0gZmFsc2U7XG4gIGZvciAobGV0IGkgPSAwOyBpIDw9IHBhdGgubGVuZ3RoOyArK2kpIHtcbiAgICBpZiAoaSA8IHBhdGgubGVuZ3RoKSB7XG4gICAgICBjb2RlID0gcGF0aC5jaGFyQ29kZUF0KGkpO1xuICAgIH0gZWxzZSBpZiAoY29kZSA9PT0gU0xBU0gpIHtcbiAgICAgIGJyZWFrO1xuICAgIH0gZWxzZSB7XG4gICAgICBjb2RlID0gU0xBU0g7XG4gICAgfVxuICAgIGlmIChjb2RlID09PSBTTEFTSCkge1xuICAgICAgaWYgKGxhc3RTbGFzaCA9PT0gaSAtIDEgfHwgZG90cyA9PT0gMSkge30gZWxzZSBpZiAobGFzdFNsYXNoICE9PSBpIC0gMSAmJiBkb3RzID09PSAyKSB7XG4gICAgICAgIGlmIChyZXMubGVuZ3RoIDwgMiB8fCAhaXNBYm92ZVJvb3QgfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDEpICE9PSBET1QgfHwgcmVzLmNoYXJDb2RlQXQocmVzLmxlbmd0aCAtIDIpICE9PSBET1QpIHtcbiAgICAgICAgICBpZiAocmVzLmxlbmd0aCA+IDIpIHtcbiAgICAgICAgICAgIGNvbnN0IHN0YXJ0ID0gcmVzLmxlbmd0aCAtIDE7XG4gICAgICAgICAgICBsZXQgaiA9IHN0YXJ0O1xuICAgICAgICAgICAgZm9yICg7IGogPj0gMDsgLS1qKSB7XG4gICAgICAgICAgICAgIGlmIChyZXMuY2hhckNvZGVBdChqKSA9PT0gU0xBU0gpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGogIT09IHN0YXJ0KSB7XG4gICAgICAgICAgICAgIHJlcyA9IGogPT09IC0xID8gJycgOiByZXMuc2xpY2UoMCwgaik7XG4gICAgICAgICAgICAgIGxhc3RTbGFzaCA9IGk7XG4gICAgICAgICAgICAgIGRvdHMgPSAwO1xuICAgICAgICAgICAgICBpc0Fib3ZlUm9vdCA9IGZhbHNlO1xuICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKHJlcy5sZW5ndGggPT09IDIgfHwgcmVzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgICAgICAgcmVzID0gJyc7XG4gICAgICAgICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgICAgICAgZG90cyA9IDA7XG4gICAgICAgICAgICBpc0Fib3ZlUm9vdCA9IGZhbHNlO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmIChhbGxvd0Fib3ZlUm9vdCkge1xuICAgICAgICAgIGlmIChyZXMubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgcmVzICs9ICcvLi4nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXMgPSAnLi4nO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpc0Fib3ZlUm9vdCA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGNvbnN0IHNsaWNlID0gcGF0aC5zbGljZShsYXN0U2xhc2ggKyAxLCBpKTtcbiAgICAgICAgaWYgKHJlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgcmVzICs9IGAvJHtzbGljZX1gO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlcyA9IHNsaWNlO1xuICAgICAgICB9XG4gICAgICAgIGlzQWJvdmVSb290ID0gZmFsc2U7XG4gICAgICB9XG4gICAgICBsYXN0U2xhc2ggPSBpO1xuICAgICAgZG90cyA9IDA7XG4gICAgfSBlbHNlIGlmIChjb2RlID09PSBET1QgJiYgZG90cyAhPT0gLTEpIHtcbiAgICAgICsrZG90cztcbiAgICB9IGVsc2Uge1xuICAgICAgZG90cyA9IC0xO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzO1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9cGF0aC5qcy5tYXAiLCJpbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tICdAbG9hZGVycy5nbC93b3JrZXItdXRpbHMnO1xuaW1wb3J0IHsgV29ya2VyRmFybSwgZ2V0V29ya2VyVVJMIH0gZnJvbSAnQGxvYWRlcnMuZ2wvd29ya2VyLXV0aWxzJztcbmV4cG9ydCBmdW5jdGlvbiBjYW5QYXJzZVdpdGhXb3JrZXIobG9hZGVyLCBvcHRpb25zKSB7XG4gIGlmICghV29ya2VyRmFybS5pc1N1cHBvcnRlZCgpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGlmICghaXNCcm93c2VyICYmICEob3B0aW9ucyAhPT0gbnVsbCAmJiBvcHRpb25zICE9PSB2b2lkIDAgJiYgb3B0aW9ucy5fbm9kZVdvcmtlcnMpKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBsb2FkZXIud29ya2VyICYmIChvcHRpb25zID09PSBudWxsIHx8IG9wdGlvbnMgPT09IHZvaWQgMCA/IHZvaWQgMCA6IG9wdGlvbnMud29ya2VyKTtcbn1cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBwYXJzZVdpdGhXb3JrZXIobG9hZGVyLCBkYXRhLCBvcHRpb25zLCBjb250ZXh0LCBwYXJzZU9uTWFpblRocmVhZCkge1xuICBjb25zdCBuYW1lID0gbG9hZGVyLmlkO1xuICBjb25zdCB1cmwgPSBnZXRXb3JrZXJVUkwobG9hZGVyLCBvcHRpb25zKTtcbiAgY29uc3Qgd29ya2VyRmFybSA9IFdvcmtlckZhcm0uZ2V0V29ya2VyRmFybShvcHRpb25zKTtcbiAgY29uc3Qgd29ya2VyUG9vbCA9IHdvcmtlckZhcm0uZ2V0V29ya2VyUG9vbCh7XG4gICAgbmFtZSxcbiAgICB1cmxcbiAgfSk7XG4gIG9wdGlvbnMgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KG9wdGlvbnMpKTtcbiAgY29udGV4dCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoY29udGV4dCB8fCB7fSkpO1xuICBjb25zdCBqb2IgPSBhd2FpdCB3b3JrZXJQb29sLnN0YXJ0Sm9iKCdwcm9jZXNzLW9uLXdvcmtlcicsIG9uTWVzc2FnZS5iaW5kKG51bGwsIHBhcnNlT25NYWluVGhyZWFkKSk7XG4gIGpvYi5wb3N0TWVzc2FnZSgncHJvY2VzcycsIHtcbiAgICBpbnB1dDogZGF0YSxcbiAgICBvcHRpb25zLFxuICAgIGNvbnRleHRcbiAgfSk7XG4gIGNvbnN0IHJlc3VsdCA9IGF3YWl0IGpvYi5yZXN1bHQ7XG4gIHJldHVybiBhd2FpdCByZXN1bHQucmVzdWx0O1xufVxuYXN5bmMgZnVuY3Rpb24gb25NZXNzYWdlKHBhcnNlT25NYWluVGhyZWFkLCBqb2IsIHR5cGUsIHBheWxvYWQpIHtcbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSAnZG9uZSc6XG4gICAgICBqb2IuZG9uZShwYXlsb2FkKTtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2Vycm9yJzpcbiAgICAgIGpvYi5lcnJvcihuZXcgRXJyb3IocGF5bG9hZC5lcnJvcikpO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAncHJvY2Vzcyc6XG4gICAgICBjb25zdCB7XG4gICAgICAgIGlkLFxuICAgICAgICBpbnB1dCxcbiAgICAgICAgb3B0aW9uc1xuICAgICAgfSA9IHBheWxvYWQ7XG4gICAgICB0cnkge1xuICAgICAgICBjb25zdCByZXN1bHQgPSBhd2FpdCBwYXJzZU9uTWFpblRocmVhZChpbnB1dCwgb3B0aW9ucyk7XG4gICAgICAgIGpvYi5wb3N0TWVzc2FnZSgnZG9uZScsIHtcbiAgICAgICAgICBpZCxcbiAgICAgICAgICByZXN1bHRcbiAgICAgICAgfSk7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zdCBtZXNzYWdlID0gZXJyb3IgaW5zdGFuY2VvZiBFcnJvciA/IGVycm9yLm1lc3NhZ2UgOiAndW5rbm93biBlcnJvcic7XG4gICAgICAgIGpvYi5wb3N0TWVzc2FnZSgnZXJyb3InLCB7XG4gICAgICAgICAgaWQsXG4gICAgICAgICAgZXJyb3I6IG1lc3NhZ2VcbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgICBicmVhaztcbiAgICBkZWZhdWx0OlxuICAgICAgY29uc29sZS53YXJuKGBwYXJzZS13aXRoLXdvcmtlciB1bmtub3duIG1lc3NhZ2UgJHt0eXBlfWApO1xuICB9XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1wYXJzZS13aXRoLXdvcmtlci5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICBpZiAoIWNvbmRpdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdsb2FkZXJzLmdsIGFzc2VydGlvbiBmYWlsZWQuJyk7XG4gIH1cbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFzc2VydC5qcy5tYXAiLCJjb25zdCBnbG9iYWxzID0ge1xuICBzZWxmOiB0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcgJiYgc2VsZixcbiAgd2luZG93OiB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB3aW5kb3csXG4gIGdsb2JhbDogdHlwZW9mIGdsb2JhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgZ2xvYmFsLFxuICBkb2N1bWVudDogdHlwZW9mIGRvY3VtZW50ICE9PSAndW5kZWZpbmVkJyAmJiBkb2N1bWVudFxufTtcbmNvbnN0IHNlbGZfID0gZ2xvYmFscy5zZWxmIHx8IGdsb2JhbHMud2luZG93IHx8IGdsb2JhbHMuZ2xvYmFsIHx8IHt9O1xuY29uc3Qgd2luZG93XyA9IGdsb2JhbHMud2luZG93IHx8IGdsb2JhbHMuc2VsZiB8fCBnbG9iYWxzLmdsb2JhbCB8fCB7fTtcbmNvbnN0IGdsb2JhbF8gPSBnbG9iYWxzLmdsb2JhbCB8fCBnbG9iYWxzLnNlbGYgfHwgZ2xvYmFscy53aW5kb3cgfHwge307XG5jb25zdCBkb2N1bWVudF8gPSBnbG9iYWxzLmRvY3VtZW50IHx8IHt9O1xuZXhwb3J0IHsgc2VsZl8gYXMgc2VsZiwgd2luZG93XyBhcyB3aW5kb3csIGdsb2JhbF8gYXMgZ2xvYmFsLCBkb2N1bWVudF8gYXMgZG9jdW1lbnQgfTtcbmV4cG9ydCBjb25zdCBpc0Jyb3dzZXIgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ29iamVjdCcgfHwgU3RyaW5nKHByb2Nlc3MpICE9PSAnW29iamVjdCBwcm9jZXNzXScgfHwgcHJvY2Vzcy5icm93c2VyO1xuZXhwb3J0IGNvbnN0IGlzV29ya2VyID0gdHlwZW9mIGltcG9ydFNjcmlwdHMgPT09ICdmdW5jdGlvbic7XG5leHBvcnQgY29uc3QgaXNNb2JpbGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJyAmJiB0eXBlb2Ygd2luZG93Lm9yaWVudGF0aW9uICE9PSAndW5kZWZpbmVkJztcbmNvbnN0IG1hdGNoZXMgPSB0eXBlb2YgcHJvY2VzcyAhPT0gJ3VuZGVmaW5lZCcgJiYgcHJvY2Vzcy52ZXJzaW9uICYmIC92KFswLTldKikvLmV4ZWMocHJvY2Vzcy52ZXJzaW9uKTtcbmV4cG9ydCBjb25zdCBub2RlVmVyc2lvbiA9IG1hdGNoZXMgJiYgcGFyc2VGbG9hdChtYXRjaGVzWzFdKSB8fCAwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9Z2xvYmFscy5qcy5tYXAiLCJleHBvcnQgY29uc3QgTlBNX1RBRyA9ICdsYXRlc3QnO1xuZnVuY3Rpb24gZ2V0VmVyc2lvbigpIHtcbiAgdmFyIF9nbG9iYWxUaGlzJF9sb2FkZXJzZztcbiAgaWYgKCEoKF9nbG9iYWxUaGlzJF9sb2FkZXJzZyA9IGdsb2JhbFRoaXMuX2xvYWRlcnNnbF8pICE9PSBudWxsICYmIF9nbG9iYWxUaGlzJF9sb2FkZXJzZyAhPT0gdm9pZCAwICYmIF9nbG9iYWxUaGlzJF9sb2FkZXJzZy52ZXJzaW9uKSkge1xuICAgIGdsb2JhbFRoaXMuX2xvYWRlcnNnbF8gPSBnbG9iYWxUaGlzLl9sb2FkZXJzZ2xfIHx8IHt9O1xuICAgIGlmICh0eXBlb2YgXCI0LjEuM1wiID09PSAndW5kZWZpbmVkJykge1xuICAgICAgY29uc29sZS53YXJuKCdsb2FkZXJzLmdsOiBUaGUgX19WRVJTSU9OX18gdmFyaWFibGUgaXMgbm90IGluamVjdGVkIHVzaW5nIGJhYmVsIHBsdWdpbi4gTGF0ZXN0IHVuc3RhYmxlIHdvcmtlcnMgd291bGQgYmUgZmV0Y2hlZCBmcm9tIHRoZSBDRE4uJyk7XG4gICAgICBnbG9iYWxUaGlzLl9sb2FkZXJzZ2xfLnZlcnNpb24gPSBOUE1fVEFHO1xuICAgIH0gZWxzZSB7XG4gICAgICBnbG9iYWxUaGlzLl9sb2FkZXJzZ2xfLnZlcnNpb24gPSBcIjQuMS4zXCI7XG4gICAgfVxuICB9XG4gIHJldHVybiBnbG9iYWxUaGlzLl9sb2FkZXJzZ2xfLnZlcnNpb247XG59XG5leHBvcnQgY29uc3QgVkVSU0lPTiA9IGdldFZlcnNpb24oKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPXZlcnNpb24uanMubWFwIiwiZXhwb3J0IGNsYXNzIE5vZGVXb3JrZXIge1xuICB0ZXJtaW5hdGUoKSB7fVxufVxuZXhwb3J0IGNvbnN0IHBhcmVudFBvcnQgPSBudWxsO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d29ya2VyX3RocmVhZHMtYnJvd3Nlci5qcy5tYXAiLCJpbXBvcnQgeyBhc3NlcnQgfSBmcm9tIFwiLi4vZW52LXV0aWxzL2Fzc2VydC5qc1wiO1xuaW1wb3J0IHsgaXNCcm93c2VyIH0gZnJvbSBcIi4uL2Vudi11dGlscy9nbG9iYWxzLmpzXCI7XG5pbXBvcnQgeyBWRVJTSU9OLCBOUE1fVEFHIH0gZnJvbSBcIi4uL2Vudi11dGlscy92ZXJzaW9uLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gZ2V0V29ya2VyTmFtZSh3b3JrZXIpIHtcbiAgY29uc3Qgd2FybmluZyA9IHdvcmtlci52ZXJzaW9uICE9PSBWRVJTSU9OID8gYCAod29ya2VyLXV0aWxzQCR7VkVSU0lPTn0pYCA6ICcnO1xuICByZXR1cm4gYCR7d29ya2VyLm5hbWV9QCR7d29ya2VyLnZlcnNpb259JHt3YXJuaW5nfWA7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0V29ya2VyVVJMKHdvcmtlcikge1xuICBsZXQgb3B0aW9ucyA9IGFyZ3VtZW50cy5sZW5ndGggPiAxICYmIGFyZ3VtZW50c1sxXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzFdIDoge307XG4gIGNvbnN0IHdvcmtlck9wdGlvbnMgPSBvcHRpb25zW3dvcmtlci5pZF0gfHwge307XG4gIGNvbnN0IHdvcmtlckZpbGUgPSBpc0Jyb3dzZXIgPyBgJHt3b3JrZXIuaWR9LXdvcmtlci5qc2AgOiBgJHt3b3JrZXIuaWR9LXdvcmtlci1ub2RlLmpzYDtcbiAgbGV0IHVybCA9IHdvcmtlck9wdGlvbnMud29ya2VyVXJsO1xuICBpZiAoIXVybCAmJiB3b3JrZXIuaWQgPT09ICdjb21wcmVzc2lvbicpIHtcbiAgICB1cmwgPSBvcHRpb25zLndvcmtlclVybDtcbiAgfVxuICBpZiAob3B0aW9ucy5fd29ya2VyVHlwZSA9PT0gJ3Rlc3QnKSB7XG4gICAgaWYgKGlzQnJvd3Nlcikge1xuICAgICAgdXJsID0gYG1vZHVsZXMvJHt3b3JrZXIubW9kdWxlfS9kaXN0LyR7d29ya2VyRmlsZX1gO1xuICAgIH0gZWxzZSB7XG4gICAgICB1cmwgPSBgbW9kdWxlcy8ke3dvcmtlci5tb2R1bGV9L3NyYy93b3JrZXJzLyR7d29ya2VyLmlkfS13b3JrZXItbm9kZS50c2A7XG4gICAgfVxuICB9XG4gIGlmICghdXJsKSB7XG4gICAgbGV0IHZlcnNpb24gPSB3b3JrZXIudmVyc2lvbjtcbiAgICBpZiAodmVyc2lvbiA9PT0gJ2xhdGVzdCcpIHtcbiAgICAgIHZlcnNpb24gPSBOUE1fVEFHO1xuICAgIH1cbiAgICBjb25zdCB2ZXJzaW9uVGFnID0gdmVyc2lvbiA/IGBAJHt2ZXJzaW9ufWAgOiAnJztcbiAgICB1cmwgPSBgaHR0cHM6Ly91bnBrZy5jb20vQGxvYWRlcnMuZ2wvJHt3b3JrZXIubW9kdWxlfSR7dmVyc2lvblRhZ30vZGlzdC8ke3dvcmtlckZpbGV9YDtcbiAgfVxuICBhc3NlcnQodXJsKTtcbiAgcmV0dXJuIHVybDtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdldC13b3JrZXItdXJsLmpzLm1hcCIsImltcG9ydCB7IGFzc2VydCB9IGZyb20gXCIuLi9lbnYtdXRpbHMvYXNzZXJ0LmpzXCI7XG5pbXBvcnQgeyBWRVJTSU9OIH0gZnJvbSBcIi4uL2Vudi11dGlscy92ZXJzaW9uLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVXb3JrZXJWZXJzaW9uKHdvcmtlcikge1xuICBsZXQgY29yZVZlcnNpb24gPSBhcmd1bWVudHMubGVuZ3RoID4gMSAmJiBhcmd1bWVudHNbMV0gIT09IHVuZGVmaW5lZCA/IGFyZ3VtZW50c1sxXSA6IFZFUlNJT047XG4gIGFzc2VydCh3b3JrZXIsICdubyB3b3JrZXIgcHJvdmlkZWQnKTtcbiAgY29uc3Qgd29ya2VyVmVyc2lvbiA9IHdvcmtlci52ZXJzaW9uO1xuICBpZiAoIWNvcmVWZXJzaW9uIHx8ICF3b3JrZXJWZXJzaW9uKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiB0cnVlO1xufVxuZnVuY3Rpb24gcGFyc2VWZXJzaW9uKHZlcnNpb24pIHtcbiAgY29uc3QgcGFydHMgPSB2ZXJzaW9uLnNwbGl0KCcuJykubWFwKE51bWJlcik7XG4gIHJldHVybiB7XG4gICAgbWFqb3I6IHBhcnRzWzBdLFxuICAgIG1pbm9yOiBwYXJ0c1sxXVxuICB9O1xufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9dmFsaWRhdGUtd29ya2VyLXZlcnNpb24uanMubWFwIiwiaW1wb3J0IFdvcmtlclBvb2wgZnJvbSBcIi4vd29ya2VyLXBvb2wuanNcIjtcbmltcG9ydCBXb3JrZXJUaHJlYWQgZnJvbSBcIi4vd29ya2VyLXRocmVhZC5qc1wiO1xuY29uc3QgREVGQVVMVF9QUk9QUyA9IHtcbiAgbWF4Q29uY3VycmVuY3k6IDMsXG4gIG1heE1vYmlsZUNvbmN1cnJlbmN5OiAxLFxuICByZXVzZVdvcmtlcnM6IHRydWUsXG4gIG9uRGVidWc6ICgpID0+IHt9XG59O1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ya2VyRmFybSB7XG4gIHN0YXRpYyBpc1N1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gV29ya2VyVGhyZWFkLmlzU3VwcG9ydGVkKCk7XG4gIH1cbiAgc3RhdGljIGdldFdvcmtlckZhcm0oKSB7XG4gICAgbGV0IHByb3BzID0gYXJndW1lbnRzLmxlbmd0aCA+IDAgJiYgYXJndW1lbnRzWzBdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMF0gOiB7fTtcbiAgICBXb3JrZXJGYXJtLl93b3JrZXJGYXJtID0gV29ya2VyRmFybS5fd29ya2VyRmFybSB8fCBuZXcgV29ya2VyRmFybSh7fSk7XG4gICAgV29ya2VyRmFybS5fd29ya2VyRmFybS5zZXRQcm9wcyhwcm9wcyk7XG4gICAgcmV0dXJuIFdvcmtlckZhcm0uX3dvcmtlckZhcm07XG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICB0aGlzLnByb3BzID0gdm9pZCAwO1xuICAgIHRoaXMud29ya2VyUG9vbHMgPSBuZXcgTWFwKCk7XG4gICAgdGhpcy5wcm9wcyA9IHtcbiAgICAgIC4uLkRFRkFVTFRfUFJPUFNcbiAgICB9O1xuICAgIHRoaXMuc2V0UHJvcHMocHJvcHMpO1xuICAgIHRoaXMud29ya2VyUG9vbHMgPSBuZXcgTWFwKCk7XG4gIH1cbiAgZGVzdHJveSgpIHtcbiAgICBmb3IgKGNvbnN0IHdvcmtlclBvb2wgb2YgdGhpcy53b3JrZXJQb29scy52YWx1ZXMoKSkge1xuICAgICAgd29ya2VyUG9vbC5kZXN0cm95KCk7XG4gICAgfVxuICAgIHRoaXMud29ya2VyUG9vbHMgPSBuZXcgTWFwKCk7XG4gIH1cbiAgc2V0UHJvcHMocHJvcHMpIHtcbiAgICB0aGlzLnByb3BzID0ge1xuICAgICAgLi4udGhpcy5wcm9wcyxcbiAgICAgIC4uLnByb3BzXG4gICAgfTtcbiAgICBmb3IgKGNvbnN0IHdvcmtlclBvb2wgb2YgdGhpcy53b3JrZXJQb29scy52YWx1ZXMoKSkge1xuICAgICAgd29ya2VyUG9vbC5zZXRQcm9wcyh0aGlzLl9nZXRXb3JrZXJQb29sUHJvcHMoKSk7XG4gICAgfVxuICB9XG4gIGdldFdvcmtlclBvb2wob3B0aW9ucykge1xuICAgIGNvbnN0IHtcbiAgICAgIG5hbWUsXG4gICAgICBzb3VyY2UsXG4gICAgICB1cmxcbiAgICB9ID0gb3B0aW9ucztcbiAgICBsZXQgd29ya2VyUG9vbCA9IHRoaXMud29ya2VyUG9vbHMuZ2V0KG5hbWUpO1xuICAgIGlmICghd29ya2VyUG9vbCkge1xuICAgICAgd29ya2VyUG9vbCA9IG5ldyBXb3JrZXJQb29sKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc291cmNlLFxuICAgICAgICB1cmxcbiAgICAgIH0pO1xuICAgICAgd29ya2VyUG9vbC5zZXRQcm9wcyh0aGlzLl9nZXRXb3JrZXJQb29sUHJvcHMoKSk7XG4gICAgICB0aGlzLndvcmtlclBvb2xzLnNldChuYW1lLCB3b3JrZXJQb29sKTtcbiAgICB9XG4gICAgcmV0dXJuIHdvcmtlclBvb2w7XG4gIH1cbiAgX2dldFdvcmtlclBvb2xQcm9wcygpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbWF4Q29uY3VycmVuY3k6IHRoaXMucHJvcHMubWF4Q29uY3VycmVuY3ksXG4gICAgICBtYXhNb2JpbGVDb25jdXJyZW5jeTogdGhpcy5wcm9wcy5tYXhNb2JpbGVDb25jdXJyZW5jeSxcbiAgICAgIHJldXNlV29ya2VyczogdGhpcy5wcm9wcy5yZXVzZVdvcmtlcnMsXG4gICAgICBvbkRlYnVnOiB0aGlzLnByb3BzLm9uRGVidWdcbiAgICB9O1xuICB9XG59XG5Xb3JrZXJGYXJtLl93b3JrZXJGYXJtID0gdm9pZCAwO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d29ya2VyLWZhcm0uanMubWFwIiwiaW1wb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4uL2Vudi11dGlscy9hc3NlcnQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmtlckpvYiB7XG4gIGNvbnN0cnVjdG9yKGpvYk5hbWUsIHdvcmtlclRocmVhZCkge1xuICAgIHRoaXMubmFtZSA9IHZvaWQgMDtcbiAgICB0aGlzLndvcmtlclRocmVhZCA9IHZvaWQgMDtcbiAgICB0aGlzLmlzUnVubmluZyA9IHRydWU7XG4gICAgdGhpcy5yZXN1bHQgPSB2b2lkIDA7XG4gICAgdGhpcy5fcmVzb2x2ZSA9ICgpID0+IHt9O1xuICAgIHRoaXMuX3JlamVjdCA9ICgpID0+IHt9O1xuICAgIHRoaXMubmFtZSA9IGpvYk5hbWU7XG4gICAgdGhpcy53b3JrZXJUaHJlYWQgPSB3b3JrZXJUaHJlYWQ7XG4gICAgdGhpcy5yZXN1bHQgPSBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICB0aGlzLl9yZXNvbHZlID0gcmVzb2x2ZTtcbiAgICAgIHRoaXMuX3JlamVjdCA9IHJlamVjdDtcbiAgICB9KTtcbiAgfVxuICBwb3N0TWVzc2FnZSh0eXBlLCBwYXlsb2FkKSB7XG4gICAgdGhpcy53b3JrZXJUaHJlYWQucG9zdE1lc3NhZ2Uoe1xuICAgICAgc291cmNlOiAnbG9hZGVycy5nbCcsXG4gICAgICB0eXBlLFxuICAgICAgcGF5bG9hZFxuICAgIH0pO1xuICB9XG4gIGRvbmUodmFsdWUpIHtcbiAgICBhc3NlcnQodGhpcy5pc1J1bm5pbmcpO1xuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcmVzb2x2ZSh2YWx1ZSk7XG4gIH1cbiAgZXJyb3IoZXJyb3IpIHtcbiAgICBhc3NlcnQodGhpcy5pc1J1bm5pbmcpO1xuICAgIHRoaXMuaXNSdW5uaW5nID0gZmFsc2U7XG4gICAgdGhpcy5fcmVqZWN0KGVycm9yKTtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d29ya2VyLWpvYi5qcy5tYXAiLCJpbXBvcnQgeyBpc01vYmlsZSwgaXNCcm93c2VyIH0gZnJvbSBcIi4uL2Vudi11dGlscy9nbG9iYWxzLmpzXCI7XG5pbXBvcnQgV29ya2VyVGhyZWFkIGZyb20gXCIuL3dvcmtlci10aHJlYWQuanNcIjtcbmltcG9ydCBXb3JrZXJKb2IgZnJvbSBcIi4vd29ya2VyLWpvYi5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgV29ya2VyUG9vbCB7XG4gIHN0YXRpYyBpc1N1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gV29ya2VyVGhyZWFkLmlzU3VwcG9ydGVkKCk7XG4gIH1cbiAgY29uc3RydWN0b3IocHJvcHMpIHtcbiAgICB0aGlzLm5hbWUgPSAndW5uYW1lZCc7XG4gICAgdGhpcy5zb3VyY2UgPSB2b2lkIDA7XG4gICAgdGhpcy51cmwgPSB2b2lkIDA7XG4gICAgdGhpcy5tYXhDb25jdXJyZW5jeSA9IDE7XG4gICAgdGhpcy5tYXhNb2JpbGVDb25jdXJyZW5jeSA9IDE7XG4gICAgdGhpcy5vbkRlYnVnID0gKCkgPT4ge307XG4gICAgdGhpcy5yZXVzZVdvcmtlcnMgPSB0cnVlO1xuICAgIHRoaXMucHJvcHMgPSB7fTtcbiAgICB0aGlzLmpvYlF1ZXVlID0gW107XG4gICAgdGhpcy5pZGxlUXVldWUgPSBbXTtcbiAgICB0aGlzLmNvdW50ID0gMDtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gZmFsc2U7XG4gICAgdGhpcy5zb3VyY2UgPSBwcm9wcy5zb3VyY2U7XG4gICAgdGhpcy51cmwgPSBwcm9wcy51cmw7XG4gICAgdGhpcy5zZXRQcm9wcyhwcm9wcyk7XG4gIH1cbiAgZGVzdHJveSgpIHtcbiAgICB0aGlzLmlkbGVRdWV1ZS5mb3JFYWNoKHdvcmtlciA9PiB3b3JrZXIuZGVzdHJveSgpKTtcbiAgICB0aGlzLmlzRGVzdHJveWVkID0gdHJ1ZTtcbiAgfVxuICBzZXRQcm9wcyhwcm9wcykge1xuICAgIHRoaXMucHJvcHMgPSB7XG4gICAgICAuLi50aGlzLnByb3BzLFxuICAgICAgLi4ucHJvcHNcbiAgICB9O1xuICAgIGlmIChwcm9wcy5uYW1lICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMubmFtZSA9IHByb3BzLm5hbWU7XG4gICAgfVxuICAgIGlmIChwcm9wcy5tYXhDb25jdXJyZW5jeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm1heENvbmN1cnJlbmN5ID0gcHJvcHMubWF4Q29uY3VycmVuY3k7XG4gICAgfVxuICAgIGlmIChwcm9wcy5tYXhNb2JpbGVDb25jdXJyZW5jeSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLm1heE1vYmlsZUNvbmN1cnJlbmN5ID0gcHJvcHMubWF4TW9iaWxlQ29uY3VycmVuY3k7XG4gICAgfVxuICAgIGlmIChwcm9wcy5yZXVzZVdvcmtlcnMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5yZXVzZVdvcmtlcnMgPSBwcm9wcy5yZXVzZVdvcmtlcnM7XG4gICAgfVxuICAgIGlmIChwcm9wcy5vbkRlYnVnICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMub25EZWJ1ZyA9IHByb3BzLm9uRGVidWc7XG4gICAgfVxuICB9XG4gIGFzeW5jIHN0YXJ0Sm9iKG5hbWUpIHtcbiAgICBsZXQgb25NZXNzYWdlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiAoam9iLCB0eXBlLCBkYXRhKSA9PiBqb2IuZG9uZShkYXRhKTtcbiAgICBsZXQgb25FcnJvciA9IGFyZ3VtZW50cy5sZW5ndGggPiAyICYmIGFyZ3VtZW50c1syXSAhPT0gdW5kZWZpbmVkID8gYXJndW1lbnRzWzJdIDogKGpvYiwgZXJyb3IpID0+IGpvYi5lcnJvcihlcnJvcik7XG4gICAgY29uc3Qgc3RhcnRQcm9taXNlID0gbmV3IFByb21pc2Uob25TdGFydCA9PiB7XG4gICAgICB0aGlzLmpvYlF1ZXVlLnB1c2goe1xuICAgICAgICBuYW1lLFxuICAgICAgICBvbk1lc3NhZ2UsXG4gICAgICAgIG9uRXJyb3IsXG4gICAgICAgIG9uU3RhcnRcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfSk7XG4gICAgdGhpcy5fc3RhcnRRdWV1ZWRKb2IoKTtcbiAgICByZXR1cm4gYXdhaXQgc3RhcnRQcm9taXNlO1xuICB9XG4gIGFzeW5jIF9zdGFydFF1ZXVlZEpvYigpIHtcbiAgICBpZiAoIXRoaXMuam9iUXVldWUubGVuZ3RoKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHdvcmtlclRocmVhZCA9IHRoaXMuX2dldEF2YWlsYWJsZVdvcmtlcigpO1xuICAgIGlmICghd29ya2VyVGhyZWFkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGNvbnN0IHF1ZXVlZEpvYiA9IHRoaXMuam9iUXVldWUuc2hpZnQoKTtcbiAgICBpZiAocXVldWVkSm9iKSB7XG4gICAgICB0aGlzLm9uRGVidWcoe1xuICAgICAgICBtZXNzYWdlOiAnU3RhcnRpbmcgam9iJyxcbiAgICAgICAgbmFtZTogcXVldWVkSm9iLm5hbWUsXG4gICAgICAgIHdvcmtlclRocmVhZCxcbiAgICAgICAgYmFja2xvZzogdGhpcy5qb2JRdWV1ZS5sZW5ndGhcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgam9iID0gbmV3IFdvcmtlckpvYihxdWV1ZWRKb2IubmFtZSwgd29ya2VyVGhyZWFkKTtcbiAgICAgIHdvcmtlclRocmVhZC5vbk1lc3NhZ2UgPSBkYXRhID0+IHF1ZXVlZEpvYi5vbk1lc3NhZ2Uoam9iLCBkYXRhLnR5cGUsIGRhdGEucGF5bG9hZCk7XG4gICAgICB3b3JrZXJUaHJlYWQub25FcnJvciA9IGVycm9yID0+IHF1ZXVlZEpvYi5vbkVycm9yKGpvYiwgZXJyb3IpO1xuICAgICAgcXVldWVkSm9iLm9uU3RhcnQoam9iKTtcbiAgICAgIHRyeSB7XG4gICAgICAgIGF3YWl0IGpvYi5yZXN1bHQ7XG4gICAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgICBjb25zb2xlLmVycm9yKGBXb3JrZXIgZXhjZXB0aW9uOiAke2Vycm9yfWApO1xuICAgICAgfSBmaW5hbGx5IHtcbiAgICAgICAgdGhpcy5yZXR1cm5Xb3JrZXJUb1F1ZXVlKHdvcmtlclRocmVhZCk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybldvcmtlclRvUXVldWUod29ya2VyKSB7XG4gICAgY29uc3Qgc2hvdWxkRGVzdHJveVdvcmtlciA9ICFpc0Jyb3dzZXIgfHwgdGhpcy5pc0Rlc3Ryb3llZCB8fCAhdGhpcy5yZXVzZVdvcmtlcnMgfHwgdGhpcy5jb3VudCA+IHRoaXMuX2dldE1heENvbmN1cnJlbmN5KCk7XG4gICAgaWYgKHNob3VsZERlc3Ryb3lXb3JrZXIpIHtcbiAgICAgIHdvcmtlci5kZXN0cm95KCk7XG4gICAgICB0aGlzLmNvdW50LS07XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuaWRsZVF1ZXVlLnB1c2god29ya2VyKTtcbiAgICB9XG4gICAgaWYgKCF0aGlzLmlzRGVzdHJveWVkKSB7XG4gICAgICB0aGlzLl9zdGFydFF1ZXVlZEpvYigpO1xuICAgIH1cbiAgfVxuICBfZ2V0QXZhaWxhYmxlV29ya2VyKCkge1xuICAgIGlmICh0aGlzLmlkbGVRdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICByZXR1cm4gdGhpcy5pZGxlUXVldWUuc2hpZnQoKSB8fCBudWxsO1xuICAgIH1cbiAgICBpZiAodGhpcy5jb3VudCA8IHRoaXMuX2dldE1heENvbmN1cnJlbmN5KCkpIHtcbiAgICAgIHRoaXMuY291bnQrKztcbiAgICAgIGNvbnN0IG5hbWUgPSBgJHt0aGlzLm5hbWUudG9Mb3dlckNhc2UoKX0gKCMke3RoaXMuY291bnR9IG9mICR7dGhpcy5tYXhDb25jdXJyZW5jeX0pYDtcbiAgICAgIHJldHVybiBuZXcgV29ya2VyVGhyZWFkKHtcbiAgICAgICAgbmFtZSxcbiAgICAgICAgc291cmNlOiB0aGlzLnNvdXJjZSxcbiAgICAgICAgdXJsOiB0aGlzLnVybFxuICAgICAgfSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIF9nZXRNYXhDb25jdXJyZW5jeSgpIHtcbiAgICByZXR1cm4gaXNNb2JpbGUgPyB0aGlzLm1heE1vYmlsZUNvbmN1cnJlbmN5IDogdGhpcy5tYXhDb25jdXJyZW5jeTtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d29ya2VyLXBvb2wuanMubWFwIiwiaW1wb3J0IHsgTm9kZVdvcmtlciB9IGZyb20gXCIuLi9ub2RlL3dvcmtlcl90aHJlYWRzLmpzXCI7XG5pbXBvcnQgeyBpc0Jyb3dzZXIgfSBmcm9tIFwiLi4vZW52LXV0aWxzL2dsb2JhbHMuanNcIjtcbmltcG9ydCB7IGFzc2VydCB9IGZyb20gXCIuLi9lbnYtdXRpbHMvYXNzZXJ0LmpzXCI7XG5pbXBvcnQgeyBnZXRMb2FkYWJsZVdvcmtlclVSTCB9IGZyb20gXCIuLi93b3JrZXItdXRpbHMvZ2V0LWxvYWRhYmxlLXdvcmtlci11cmwuanNcIjtcbmltcG9ydCB7IGdldFRyYW5zZmVyTGlzdCB9IGZyb20gXCIuLi93b3JrZXItdXRpbHMvZ2V0LXRyYW5zZmVyLWxpc3QuanNcIjtcbmNvbnN0IE5PT1AgPSAoKSA9PiB7fTtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFdvcmtlclRocmVhZCB7XG4gIHN0YXRpYyBpc1N1cHBvcnRlZCgpIHtcbiAgICByZXR1cm4gdHlwZW9mIFdvcmtlciAhPT0gJ3VuZGVmaW5lZCcgJiYgaXNCcm93c2VyIHx8IHR5cGVvZiBOb2RlV29ya2VyICE9PSAndW5kZWZpbmVkJyAmJiAhaXNCcm93c2VyO1xuICB9XG4gIGNvbnN0cnVjdG9yKHByb3BzKSB7XG4gICAgdGhpcy5uYW1lID0gdm9pZCAwO1xuICAgIHRoaXMuc291cmNlID0gdm9pZCAwO1xuICAgIHRoaXMudXJsID0gdm9pZCAwO1xuICAgIHRoaXMudGVybWluYXRlZCA9IGZhbHNlO1xuICAgIHRoaXMud29ya2VyID0gdm9pZCAwO1xuICAgIHRoaXMub25NZXNzYWdlID0gdm9pZCAwO1xuICAgIHRoaXMub25FcnJvciA9IHZvaWQgMDtcbiAgICB0aGlzLl9sb2FkYWJsZVVSTCA9ICcnO1xuICAgIGNvbnN0IHtcbiAgICAgIG5hbWUsXG4gICAgICBzb3VyY2UsXG4gICAgICB1cmxcbiAgICB9ID0gcHJvcHM7XG4gICAgYXNzZXJ0KHNvdXJjZSB8fCB1cmwpO1xuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy5zb3VyY2UgPSBzb3VyY2U7XG4gICAgdGhpcy51cmwgPSB1cmw7XG4gICAgdGhpcy5vbk1lc3NhZ2UgPSBOT09QO1xuICAgIHRoaXMub25FcnJvciA9IGVycm9yID0+IGNvbnNvbGUubG9nKGVycm9yKTtcbiAgICB0aGlzLndvcmtlciA9IGlzQnJvd3NlciA/IHRoaXMuX2NyZWF0ZUJyb3dzZXJXb3JrZXIoKSA6IHRoaXMuX2NyZWF0ZU5vZGVXb3JrZXIoKTtcbiAgfVxuICBkZXN0cm95KCkge1xuICAgIHRoaXMub25NZXNzYWdlID0gTk9PUDtcbiAgICB0aGlzLm9uRXJyb3IgPSBOT09QO1xuICAgIHRoaXMud29ya2VyLnRlcm1pbmF0ZSgpO1xuICAgIHRoaXMudGVybWluYXRlZCA9IHRydWU7XG4gIH1cbiAgZ2V0IGlzUnVubmluZygpIHtcbiAgICByZXR1cm4gQm9vbGVhbih0aGlzLm9uTWVzc2FnZSk7XG4gIH1cbiAgcG9zdE1lc3NhZ2UoZGF0YSwgdHJhbnNmZXJMaXN0KSB7XG4gICAgdHJhbnNmZXJMaXN0ID0gdHJhbnNmZXJMaXN0IHx8IGdldFRyYW5zZmVyTGlzdChkYXRhKTtcbiAgICB0aGlzLndvcmtlci5wb3N0TWVzc2FnZShkYXRhLCB0cmFuc2Zlckxpc3QpO1xuICB9XG4gIF9nZXRFcnJvckZyb21FcnJvckV2ZW50KGV2ZW50KSB7XG4gICAgbGV0IG1lc3NhZ2UgPSAnRmFpbGVkIHRvIGxvYWQgJztcbiAgICBtZXNzYWdlICs9IGB3b3JrZXIgJHt0aGlzLm5hbWV9IGZyb20gJHt0aGlzLnVybH0uIGA7XG4gICAgaWYgKGV2ZW50Lm1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2UgKz0gYCR7ZXZlbnQubWVzc2FnZX0gaW4gYDtcbiAgICB9XG4gICAgaWYgKGV2ZW50LmxpbmVubykge1xuICAgICAgbWVzc2FnZSArPSBgOiR7ZXZlbnQubGluZW5vfToke2V2ZW50LmNvbG5vfWA7XG4gICAgfVxuICAgIHJldHVybiBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIH1cbiAgX2NyZWF0ZUJyb3dzZXJXb3JrZXIoKSB7XG4gICAgdGhpcy5fbG9hZGFibGVVUkwgPSBnZXRMb2FkYWJsZVdvcmtlclVSTCh7XG4gICAgICBzb3VyY2U6IHRoaXMuc291cmNlLFxuICAgICAgdXJsOiB0aGlzLnVybFxuICAgIH0pO1xuICAgIGNvbnN0IHdvcmtlciA9IG5ldyBXb3JrZXIodGhpcy5fbG9hZGFibGVVUkwsIHtcbiAgICAgIG5hbWU6IHRoaXMubmFtZVxuICAgIH0pO1xuICAgIHdvcmtlci5vbm1lc3NhZ2UgPSBldmVudCA9PiB7XG4gICAgICBpZiAoIWV2ZW50LmRhdGEpIHtcbiAgICAgICAgdGhpcy5vbkVycm9yKG5ldyBFcnJvcignTm8gZGF0YSByZWNlaXZlZCcpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMub25NZXNzYWdlKGV2ZW50LmRhdGEpO1xuICAgICAgfVxuICAgIH07XG4gICAgd29ya2VyLm9uZXJyb3IgPSBlcnJvciA9PiB7XG4gICAgICB0aGlzLm9uRXJyb3IodGhpcy5fZ2V0RXJyb3JGcm9tRXJyb3JFdmVudChlcnJvcikpO1xuICAgICAgdGhpcy50ZXJtaW5hdGVkID0gdHJ1ZTtcbiAgICB9O1xuICAgIHdvcmtlci5vbm1lc3NhZ2VlcnJvciA9IGV2ZW50ID0+IGNvbnNvbGUuZXJyb3IoZXZlbnQpO1xuICAgIHJldHVybiB3b3JrZXI7XG4gIH1cbiAgX2NyZWF0ZU5vZGVXb3JrZXIoKSB7XG4gICAgbGV0IHdvcmtlcjtcbiAgICBpZiAodGhpcy51cmwpIHtcbiAgICAgIGNvbnN0IGFic29sdXRlID0gdGhpcy51cmwuaW5jbHVkZXMoJzovJykgfHwgdGhpcy51cmwuc3RhcnRzV2l0aCgnLycpO1xuICAgICAgY29uc3QgdXJsID0gYWJzb2x1dGUgPyB0aGlzLnVybCA6IGAuLyR7dGhpcy51cmx9YDtcbiAgICAgIHdvcmtlciA9IG5ldyBOb2RlV29ya2VyKHVybCwge1xuICAgICAgICBldmFsOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLnNvdXJjZSkge1xuICAgICAgd29ya2VyID0gbmV3IE5vZGVXb3JrZXIodGhpcy5zb3VyY2UsIHtcbiAgICAgICAgZXZhbDogdHJ1ZVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignbm8gd29ya2VyJyk7XG4gICAgfVxuICAgIHdvcmtlci5vbignbWVzc2FnZScsIGRhdGEgPT4ge1xuICAgICAgdGhpcy5vbk1lc3NhZ2UoZGF0YSk7XG4gICAgfSk7XG4gICAgd29ya2VyLm9uKCdlcnJvcicsIGVycm9yID0+IHtcbiAgICAgIHRoaXMub25FcnJvcihlcnJvcik7XG4gICAgfSk7XG4gICAgd29ya2VyLm9uKCdleGl0JywgY29kZSA9PiB7fSk7XG4gICAgcmV0dXJuIHdvcmtlcjtcbiAgfVxufVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9d29ya2VyLXRocmVhZC5qcy5tYXAiLCJpbXBvcnQgeyBhc3NlcnQgfSBmcm9tIFwiLi4vZW52LXV0aWxzL2Fzc2VydC5qc1wiO1xuY29uc3Qgd29ya2VyVVJMQ2FjaGUgPSBuZXcgTWFwKCk7XG5leHBvcnQgZnVuY3Rpb24gZ2V0TG9hZGFibGVXb3JrZXJVUkwocHJvcHMpIHtcbiAgYXNzZXJ0KHByb3BzLnNvdXJjZSAmJiAhcHJvcHMudXJsIHx8ICFwcm9wcy5zb3VyY2UgJiYgcHJvcHMudXJsKTtcbiAgbGV0IHdvcmtlclVSTCA9IHdvcmtlclVSTENhY2hlLmdldChwcm9wcy5zb3VyY2UgfHwgcHJvcHMudXJsKTtcbiAgaWYgKCF3b3JrZXJVUkwpIHtcbiAgICBpZiAocHJvcHMudXJsKSB7XG4gICAgICB3b3JrZXJVUkwgPSBnZXRMb2FkYWJsZVdvcmtlclVSTEZyb21VUkwocHJvcHMudXJsKTtcbiAgICAgIHdvcmtlclVSTENhY2hlLnNldChwcm9wcy51cmwsIHdvcmtlclVSTCk7XG4gICAgfVxuICAgIGlmIChwcm9wcy5zb3VyY2UpIHtcbiAgICAgIHdvcmtlclVSTCA9IGdldExvYWRhYmxlV29ya2VyVVJMRnJvbVNvdXJjZShwcm9wcy5zb3VyY2UpO1xuICAgICAgd29ya2VyVVJMQ2FjaGUuc2V0KHByb3BzLnNvdXJjZSwgd29ya2VyVVJMKTtcbiAgICB9XG4gIH1cbiAgYXNzZXJ0KHdvcmtlclVSTCk7XG4gIHJldHVybiB3b3JrZXJVUkw7XG59XG5mdW5jdGlvbiBnZXRMb2FkYWJsZVdvcmtlclVSTEZyb21VUkwodXJsKSB7XG4gIGlmICghdXJsLnN0YXJ0c1dpdGgoJ2h0dHAnKSkge1xuICAgIHJldHVybiB1cmw7XG4gIH1cbiAgY29uc3Qgd29ya2VyU291cmNlID0gYnVpbGRTY3JpcHRTb3VyY2UodXJsKTtcbiAgcmV0dXJuIGdldExvYWRhYmxlV29ya2VyVVJMRnJvbVNvdXJjZSh3b3JrZXJTb3VyY2UpO1xufVxuZnVuY3Rpb24gZ2V0TG9hZGFibGVXb3JrZXJVUkxGcm9tU291cmNlKHdvcmtlclNvdXJjZSkge1xuICBjb25zdCBibG9iID0gbmV3IEJsb2IoW3dvcmtlclNvdXJjZV0sIHtcbiAgICB0eXBlOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdCdcbiAgfSk7XG4gIHJldHVybiBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xufVxuZnVuY3Rpb24gYnVpbGRTY3JpcHRTb3VyY2Uod29ya2VyVXJsKSB7XG4gIHJldHVybiBgXFxcbnRyeSB7XG4gIGltcG9ydFNjcmlwdHMoJyR7d29ya2VyVXJsfScpO1xufSBjYXRjaCAoZXJyb3IpIHtcbiAgY29uc29sZS5lcnJvcihlcnJvcik7XG4gIHRocm93IGVycm9yO1xufWA7XG59XG4vLyMgc291cmNlTWFwcGluZ1VSTD1nZXQtbG9hZGFibGUtd29ya2VyLXVybC5qcy5tYXAiLCJleHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNmZXJMaXN0KG9iamVjdCkge1xuICBsZXQgcmVjdXJzaXZlID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgJiYgYXJndW1lbnRzWzFdICE9PSB1bmRlZmluZWQgPyBhcmd1bWVudHNbMV0gOiB0cnVlO1xuICBsZXQgdHJhbnNmZXJzID0gYXJndW1lbnRzLmxlbmd0aCA+IDIgPyBhcmd1bWVudHNbMl0gOiB1bmRlZmluZWQ7XG4gIGNvbnN0IHRyYW5zZmVyc1NldCA9IHRyYW5zZmVycyB8fCBuZXcgU2V0KCk7XG4gIGlmICghb2JqZWN0KSB7fSBlbHNlIGlmIChpc1RyYW5zZmVyYWJsZShvYmplY3QpKSB7XG4gICAgdHJhbnNmZXJzU2V0LmFkZChvYmplY3QpO1xuICB9IGVsc2UgaWYgKGlzVHJhbnNmZXJhYmxlKG9iamVjdC5idWZmZXIpKSB7XG4gICAgdHJhbnNmZXJzU2V0LmFkZChvYmplY3QuYnVmZmVyKTtcbiAgfSBlbHNlIGlmIChBcnJheUJ1ZmZlci5pc1ZpZXcob2JqZWN0KSkge30gZWxzZSBpZiAocmVjdXJzaXZlICYmIHR5cGVvZiBvYmplY3QgPT09ICdvYmplY3QnKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gb2JqZWN0KSB7XG4gICAgICBnZXRUcmFuc2Zlckxpc3Qob2JqZWN0W2tleV0sIHJlY3Vyc2l2ZSwgdHJhbnNmZXJzU2V0KTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHRyYW5zZmVycyA9PT0gdW5kZWZpbmVkID8gQXJyYXkuZnJvbSh0cmFuc2ZlcnNTZXQpIDogW107XG59XG5mdW5jdGlvbiBpc1RyYW5zZmVyYWJsZShvYmplY3QpIHtcbiAgaWYgKCFvYmplY3QpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgaWYgKG9iamVjdCBpbnN0YW5jZW9mIEFycmF5QnVmZmVyKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbiAgaWYgKHR5cGVvZiBNZXNzYWdlUG9ydCAhPT0gJ3VuZGVmaW5lZCcgJiYgb2JqZWN0IGluc3RhbmNlb2YgTWVzc2FnZVBvcnQpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICBpZiAodHlwZW9mIEltYWdlQml0bWFwICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBJbWFnZUJpdG1hcCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG4gIGlmICh0eXBlb2YgT2Zmc2NyZWVuQ2FudmFzICE9PSAndW5kZWZpbmVkJyAmJiBvYmplY3QgaW5zdGFuY2VvZiBPZmZzY3JlZW5DYW52YXMpIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJhbnNmZXJMaXN0Rm9yV3JpdGVyKG9iamVjdCkge1xuICBpZiAob2JqZWN0ID09PSBudWxsKSB7XG4gICAgcmV0dXJuIHt9O1xuICB9XG4gIGNvbnN0IGNsb25lID0gT2JqZWN0LmFzc2lnbih7fSwgb2JqZWN0KTtcbiAgT2JqZWN0LmtleXMoY2xvbmUpLmZvckVhY2goa2V5ID0+IHtcbiAgICBpZiAodHlwZW9mIG9iamVjdFtrZXldID09PSAnb2JqZWN0JyAmJiAhQXJyYXlCdWZmZXIuaXNWaWV3KG9iamVjdFtrZXldKSAmJiAhKG9iamVjdFtrZXldIGluc3RhbmNlb2YgQXJyYXkpKSB7XG4gICAgICBjbG9uZVtrZXldID0gZ2V0VHJhbnNmZXJMaXN0Rm9yV3JpdGVyKG9iamVjdFtrZXldKTtcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBjbG9uZVtrZXldID09PSAnZnVuY3Rpb24nIHx8IGNsb25lW2tleV0gaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAgIGNsb25lW2tleV0gPSB7fTtcbiAgICB9IGVsc2Uge1xuICAgICAgY2xvbmVba2V5XSA9IG9iamVjdFtrZXldO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBjbG9uZTtcbn1cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWdldC10cmFuc2Zlci1saXN0LmpzLm1hcCIsIi8vIEV4dHJhY3QgaW5qZWN0ZWQgdmVyc2lvbiBmcm9tIHBhY2thZ2UuanNvbiAoaW5qZWN0ZWQgYnkgYmFiZWwgcGx1Z2luKVxuLy8gQHRzLWV4cGVjdC1lcnJvclxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSB0eXBlb2YgXCI0LjAuN1wiICE9PSAndW5kZWZpbmVkJyA/IFwiNC4wLjdcIiA6ICd1bnRyYW5zcGlsZWQgc291cmNlJztcbi8vIEVOVklST05NRU5UXG5leHBvcnQgeyBzZWxmLCB3aW5kb3csIGdsb2JhbCwgZG9jdW1lbnQsIHByb2Nlc3MsIGNvbnNvbGUgfSBmcm9tIFwiLi9saWIvZ2xvYmFscy5qc1wiO1xuZXhwb3J0IHsgaXNCcm93c2VyIH0gZnJvbSBcIi4vbGliL2lzLWJyb3dzZXIuanNcIjtcbmV4cG9ydCB7IGdldEJyb3dzZXIsIGlzTW9iaWxlIH0gZnJvbSBcIi4vbGliL2dldC1icm93c2VyLmpzXCI7XG5leHBvcnQgeyBpc0VsZWN0cm9uIH0gZnJvbSBcIi4vbGliL2lzLWVsZWN0cm9uLmpzXCI7XG4vLyBFTlZJUk9OTUVOVCdTIEFTU0VSVCBJUyA1LTE1S0IsIFNPIFdFIFBST1ZJREUgT1VSIE9XTlxuZXhwb3J0IHsgYXNzZXJ0IH0gZnJvbSBcIi4vdXRpbHMvYXNzZXJ0LmpzXCI7XG4vLyBUT0RPIC0gd2lzaCB3ZSBjb3VsZCBqdXN0IGV4cG9ydCBhIGNvbnN0YW50XG4vLyBleHBvcnQgY29uc3QgaXNCcm93c2VyID0gY2hlY2tJZkJyb3dzZXIoKTtcbiIsIi8vIENvcHlyaWdodCAoYykgMjAxNyBVYmVyIFRlY2hub2xvZ2llcywgSW5jLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhIGNvcHlcbi8vIG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlIFwiU29mdHdhcmVcIiksIHRvIGRlYWxcbi8vIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmcgd2l0aG91dCBsaW1pdGF0aW9uIHRoZSByaWdodHNcbi8vIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCwgZGlzdHJpYnV0ZSwgc3VibGljZW5zZSwgYW5kL29yIHNlbGxcbi8vIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXQgcGVyc29ucyB0byB3aG9tIHRoZSBTb2Z0d2FyZSBpc1xuLy8gZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZSBmb2xsb3dpbmcgY29uZGl0aW9uczpcbi8vXG4vLyBUaGUgYWJvdmUgY29weXJpZ2h0IG5vdGljZSBhbmQgdGhpcyBwZXJtaXNzaW9uIG5vdGljZSBzaGFsbCBiZSBpbmNsdWRlZCBpblxuLy8gYWxsIGNvcGllcyBvciBzdWJzdGFudGlhbCBwb3J0aW9ucyBvZiB0aGUgU29mdHdhcmUuXG4vL1xuLy8gVEhFIFNPRlRXQVJFIElTIFBST1ZJREVEIFwiQVMgSVNcIiwgV0lUSE9VVCBXQVJSQU5UWSBPRiBBTlkgS0lORCwgRVhQUkVTUyBPUlxuLy8gSU1QTElFRCwgSU5DTFVESU5HIEJVVCBOT1QgTElNSVRFRCBUTyBUSEUgV0FSUkFOVElFUyBPRiBNRVJDSEFOVEFCSUxJVFksXG4vLyBGSVRORVNTIEZPUiBBIFBBUlRJQ1VMQVIgUFVSUE9TRSBBTkQgTk9OSU5GUklOR0VNRU5ULiBJTiBOTyBFVkVOVCBTSEFMTCBUSEVcbi8vIEFVVEhPUlMgT1IgQ09QWVJJR0hUIEhPTERFUlMgQkUgTElBQkxFIEZPUiBBTlkgQ0xBSU0sIERBTUFHRVMgT1IgT1RIRVJcbi8vIExJQUJJTElUWSwgV0hFVEhFUiBJTiBBTiBBQ1RJT04gT0YgQ09OVFJBQ1QsIFRPUlQgT1IgT1RIRVJXSVNFLCBBUklTSU5HIEZST00sXG4vLyBPVVQgT0YgT1IgSU4gQ09OTkVDVElPTiBXSVRIIFRIRSBTT0ZUV0FSRSBPUiBUSEUgVVNFIE9SIE9USEVSIERFQUxJTkdTIElOXG4vLyBUSEUgU09GVFdBUkUuXG4vLyBUaGlzIGZ1bmN0aW9uIGlzIG5lZWRlZCBpbiBpbml0aWFsaXphdGlvbiBzdGFnZXMsXG4vLyBtYWtlIHN1cmUgaXQgY2FuIGJlIGltcG9ydGVkIGluIGlzb2xhdGlvblxuaW1wb3J0IHsgaXNCcm93c2VyIH0gZnJvbSBcIi4vaXMtYnJvd3Nlci5qc1wiO1xuaW1wb3J0IHsgaXNFbGVjdHJvbiB9IGZyb20gXCIuL2lzLWVsZWN0cm9uLmpzXCI7XG5pbXBvcnQgeyBuYXZpZ2F0b3IgfSBmcm9tIFwiLi9nbG9iYWxzLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gaXNNb2JpbGUoKSB7XG4gICAgcmV0dXJuIHR5cGVvZiBnbG9iYWxUaGlzLm9yaWVudGF0aW9uICE9PSAndW5kZWZpbmVkJztcbn1cbi8vIFNpbXBsZSBicm93c2VyIGRldGVjdGlvblxuLy8gYG1vY2tVc2VyQWdlbnRgIHBhcmFtZXRlciBhbGxvd3MgdXNlciBhZ2VudCB0byBiZSBvdmVycmlkZGVuIGZvciB0ZXN0aW5nXG4vKiBlc2xpbnQtZGlzYWJsZSBjb21wbGV4aXR5ICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnJvd3Nlcihtb2NrVXNlckFnZW50KSB7XG4gICAgaWYgKCFtb2NrVXNlckFnZW50ICYmICFpc0Jyb3dzZXIoKSkge1xuICAgICAgICByZXR1cm4gJ05vZGUnO1xuICAgIH1cbiAgICBpZiAoaXNFbGVjdHJvbihtb2NrVXNlckFnZW50KSkge1xuICAgICAgICByZXR1cm4gJ0VsZWN0cm9uJztcbiAgICB9XG4gICAgY29uc3QgdXNlckFnZW50ID0gbW9ja1VzZXJBZ2VudCB8fCBuYXZpZ2F0b3IudXNlckFnZW50IHx8ICcnO1xuICAgIC8vIE5PVEU6IE9yZGVyIG9mIHRlc3RzIG1hdHRlciwgYXMgbWFueSBhZ2VudHMgbGlzdCBDaHJvbWUgZXRjLlxuICAgIGlmICh1c2VyQWdlbnQuaW5kZXhPZignRWRnZScpID4gLTEpIHtcbiAgICAgICAgcmV0dXJuICdFZGdlJztcbiAgICB9XG4gICAgaWYgKGdsb2JhbFRoaXMuY2hyb21lKSB7XG4gICAgICAgIHJldHVybiAnQ2hyb21lJztcbiAgICB9XG4gICAgaWYgKGdsb2JhbFRoaXMuc2FmYXJpKSB7XG4gICAgICAgIHJldHVybiAnU2FmYXJpJztcbiAgICB9XG4gICAgaWYgKGdsb2JhbFRoaXMubW96SW5uZXJTY3JlZW5YKSB7XG4gICAgICAgIHJldHVybiAnRmlyZWZveCc7XG4gICAgfVxuICAgIHJldHVybiAnVW5rbm93bic7XG59XG4iLCIvLyBEbyBub3QgbmFtZSB0aGVzZSB2YXJpYWJsZXMgdGhlIHNhbWUgYXMgdGhlIGdsb2JhbCBvYmplY3RzIC0gd2lsbCBicmVhayBidW5kbGluZ1xuY29uc3QgZ2xvYmFsXyA9IGdsb2JhbFRoaXM7XG5jb25zdCB3aW5kb3dfID0gZ2xvYmFsVGhpcztcbmNvbnN0IGRvY3VtZW50XyA9IGdsb2JhbFRoaXMuZG9jdW1lbnQgfHwge307XG5jb25zdCBwcm9jZXNzXyA9IGdsb2JhbFRoaXMucHJvY2VzcyB8fCB7fTtcbmNvbnN0IGNvbnNvbGVfID0gZ2xvYmFsVGhpcy5jb25zb2xlO1xuY29uc3QgbmF2aWdhdG9yXyA9IGdsb2JhbFRoaXMubmF2aWdhdG9yIHx8IHt9O1xuZXhwb3J0IHsgZ2xvYmFsXyBhcyBnbG9iYWwsIGdsb2JhbF8gYXMgc2VsZiwgd2luZG93XyBhcyB3aW5kb3csIGRvY3VtZW50XyBhcyBkb2N1bWVudCwgcHJvY2Vzc18gYXMgcHJvY2VzcywgY29uc29sZV8gYXMgY29uc29sZSwgbmF2aWdhdG9yXyBhcyBuYXZpZ2F0b3IgfTtcbiIsIi8vIFRoaXMgZnVuY3Rpb24gaXMgbmVlZGVkIGluIGluaXRpYWxpemF0aW9uIHN0YWdlcyxcbi8vIG1ha2Ugc3VyZSBpdCBjYW4gYmUgaW1wb3J0ZWQgaW4gaXNvbGF0aW9uXG5pbXBvcnQgeyBpc0VsZWN0cm9uIH0gZnJvbSBcIi4vaXMtZWxlY3Ryb24uanNcIjtcbi8qKiBDaGVjayBpZiBpbiBicm93c2VyIGJ5IGR1Y2stdHlwaW5nIE5vZGUgY29udGV4dCAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzQnJvd3NlcigpIHtcbiAgICBjb25zdCBpc05vZGUgPSBcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgdHlwZW9mIHByb2Nlc3MgPT09ICdvYmplY3QnICYmIFN0cmluZyhwcm9jZXNzKSA9PT0gJ1tvYmplY3QgcHJvY2Vzc10nICYmICFwcm9jZXNzPy5icm93c2VyO1xuICAgIHJldHVybiAhaXNOb2RlIHx8IGlzRWxlY3Ryb24oKTtcbn1cbiIsIi8vIGJhc2VkIG9uIGh0dHBzOi8vZ2l0aHViLmNvbS9jaGV0b24vaXMtZWxlY3Ryb25cbi8vIGh0dHBzOi8vZ2l0aHViLmNvbS9lbGVjdHJvbi9lbGVjdHJvbi9pc3N1ZXMvMjI4OFxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGlzRWxlY3Ryb24obW9ja1VzZXJBZ2VudCkge1xuICAgIC8vIFJlbmRlcmVyIHByb2Nlc3NcbiAgICAvLyBAdHMtZXhwZWN0LWVycm9yXG4gICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnICYmIHdpbmRvdy5wcm9jZXNzPy50eXBlID09PSAncmVuZGVyZXInKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvLyBNYWluIHByb2Nlc3NcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmVcbiAgICBpZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIEJvb2xlYW4ocHJvY2Vzcy52ZXJzaW9ucz8uWydlbGVjdHJvbiddKSkge1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgLy8gRGV0ZWN0IHRoZSB1c2VyIGFnZW50IHdoZW4gdGhlIGBub2RlSW50ZWdyYXRpb25gIG9wdGlvbiBpcyBzZXQgdG8gdHJ1ZVxuICAgIGNvbnN0IHJlYWxVc2VyQWdlbnQgPSB0eXBlb2YgbmF2aWdhdG9yICE9PSAndW5kZWZpbmVkJyAmJiBuYXZpZ2F0b3IudXNlckFnZW50O1xuICAgIGNvbnN0IHVzZXJBZ2VudCA9IG1vY2tVc2VyQWdlbnQgfHwgcmVhbFVzZXJBZ2VudDtcbiAgICByZXR1cm4gQm9vbGVhbih1c2VyQWdlbnQgJiYgdXNlckFnZW50LmluZGV4T2YoJ0VsZWN0cm9uJykgPj0gMCk7XG59XG4iLCJleHBvcnQgZnVuY3Rpb24gYXNzZXJ0KGNvbmRpdGlvbiwgbWVzc2FnZSkge1xuICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdBc3NlcnRpb24gZmFpbGVkJyk7XG4gICAgfVxufVxuIiwiLy8gcHJvYmUuZ2wsIE1JVCBsaWNlbnNlXG4vKiBlc2xpbnQtZGlzYWJsZSBuby1jb25zb2xlICovXG5pbXBvcnQgeyBWRVJTSU9OLCBpc0Jyb3dzZXIgfSBmcm9tICdAcHJvYmUuZ2wvZW52JztcbmltcG9ydCB7IExvY2FsU3RvcmFnZSB9IGZyb20gXCIuL3V0aWxzL2xvY2FsLXN0b3JhZ2UuanNcIjtcbmltcG9ydCB7IGZvcm1hdFRpbWUsIGxlZnRQYWQgfSBmcm9tIFwiLi91dGlscy9mb3JtYXR0ZXJzLmpzXCI7XG5pbXBvcnQgeyBhZGRDb2xvciB9IGZyb20gXCIuL3V0aWxzL2NvbG9yLmpzXCI7XG5pbXBvcnQgeyBhdXRvYmluZCB9IGZyb20gXCIuL3V0aWxzL2F1dG9iaW5kLmpzXCI7XG5pbXBvcnQgYXNzZXJ0IGZyb20gXCIuL3V0aWxzL2Fzc2VydC5qc1wiO1xuaW1wb3J0IHsgZ2V0SGlSZXNUaW1lc3RhbXAgfSBmcm9tIFwiLi91dGlscy9oaS1yZXMtdGltZXN0YW1wLmpzXCI7XG4vLyBJbnN0cnVtZW50YXRpb24gaW4gb3RoZXIgcGFja2FnZXMgbWF5IG92ZXJyaWRlIGNvbnNvbGUgbWV0aG9kcywgc28gcHJlc2VydmUgdGhlbSBoZXJlXG5jb25zdCBvcmlnaW5hbENvbnNvbGUgPSB7XG4gICAgZGVidWc6IGlzQnJvd3NlcigpID8gY29uc29sZS5kZWJ1ZyB8fCBjb25zb2xlLmxvZyA6IGNvbnNvbGUubG9nLFxuICAgIGxvZzogY29uc29sZS5sb2csXG4gICAgaW5mbzogY29uc29sZS5pbmZvLFxuICAgIHdhcm46IGNvbnNvbGUud2FybixcbiAgICBlcnJvcjogY29uc29sZS5lcnJvclxufTtcbmNvbnN0IERFRkFVTFRfTE9HX0NPTkZJR1VSQVRJT04gPSB7XG4gICAgZW5hYmxlZDogdHJ1ZSxcbiAgICBsZXZlbDogMFxufTtcbmZ1bmN0aW9uIG5vb3AoKSB7IH0gLy8gZXNsaW50LWRpc2FibGUtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tZW1wdHktZnVuY3Rpb25cbmNvbnN0IGNhY2hlID0ge307XG5jb25zdCBPTkNFID0geyBvbmNlOiB0cnVlIH07XG4vKiogQSBjb25zb2xlIHdyYXBwZXIgKi9cbmV4cG9ydCBjbGFzcyBMb2cge1xuICAgIGNvbnN0cnVjdG9yKHsgaWQgfSA9IHsgaWQ6ICcnIH0pIHtcbiAgICAgICAgdGhpcy5WRVJTSU9OID0gVkVSU0lPTjtcbiAgICAgICAgdGhpcy5fc3RhcnRUcyA9IGdldEhpUmVzVGltZXN0YW1wKCk7XG4gICAgICAgIHRoaXMuX2RlbHRhVHMgPSBnZXRIaVJlc1RpbWVzdGFtcCgpO1xuICAgICAgICB0aGlzLnVzZXJEYXRhID0ge307XG4gICAgICAgIC8vIFRPRE8gLSBmaXggc3VwcG9ydCBmcm9tIHRocm90dGxpbmcgZ3JvdXBzXG4gICAgICAgIHRoaXMuTE9HX1RIUk9UVExFX1RJTUVPVVQgPSAwOyAvLyBUaW1lIGJlZm9yZSB0aHJvdHRsZWQgbWVzc2FnZXMgYXJlIGxvZ2dlZCBhZ2FpblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgICAgIHRoaXMudXNlckRhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5fc3RvcmFnZSA9IG5ldyBMb2NhbFN0b3JhZ2UoYF9fcHJvYmUtJHt0aGlzLmlkfV9fYCwgREVGQVVMVF9MT0dfQ09ORklHVVJBVElPTik7XG4gICAgICAgIHRoaXMudGltZVN0YW1wKGAke3RoaXMuaWR9IHN0YXJ0ZWRgKTtcbiAgICAgICAgYXV0b2JpbmQodGhpcyk7XG4gICAgICAgIE9iamVjdC5zZWFsKHRoaXMpO1xuICAgIH1cbiAgICBzZXQgbGV2ZWwobmV3TGV2ZWwpIHtcbiAgICAgICAgdGhpcy5zZXRMZXZlbChuZXdMZXZlbCk7XG4gICAgfVxuICAgIGdldCBsZXZlbCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0TGV2ZWwoKTtcbiAgICB9XG4gICAgaXNFbmFibGVkKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5jb25maWcuZW5hYmxlZDtcbiAgICB9XG4gICAgZ2V0TGV2ZWwoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zdG9yYWdlLmNvbmZpZy5sZXZlbDtcbiAgICB9XG4gICAgLyoqIEByZXR1cm4gbWlsbGlzZWNvbmRzLCB3aXRoIGZyYWN0aW9ucyAqL1xuICAgIGdldFRvdGFsKCkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKChnZXRIaVJlc1RpbWVzdGFtcCgpIC0gdGhpcy5fc3RhcnRUcykudG9QcmVjaXNpb24oMTApKTtcbiAgICB9XG4gICAgLyoqIEByZXR1cm4gbWlsbGlzZWNvbmRzLCB3aXRoIGZyYWN0aW9ucyAqL1xuICAgIGdldERlbHRhKCkge1xuICAgICAgICByZXR1cm4gTnVtYmVyKChnZXRIaVJlc1RpbWVzdGFtcCgpIC0gdGhpcy5fZGVsdGFUcykudG9QcmVjaXNpb24oMTApKTtcbiAgICB9XG4gICAgLyoqIEBkZXByZWNhdGVkIHVzZSBsb2dMZXZlbCAqL1xuICAgIHNldCBwcmlvcml0eShuZXdQcmlvcml0eSkge1xuICAgICAgICB0aGlzLmxldmVsID0gbmV3UHJpb3JpdHk7XG4gICAgfVxuICAgIC8qKiBAZGVwcmVjYXRlZCB1c2UgbG9nTGV2ZWwgKi9cbiAgICBnZXQgcHJpb3JpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxldmVsO1xuICAgIH1cbiAgICAvKiogQGRlcHJlY2F0ZWQgdXNlIGxvZ0xldmVsICovXG4gICAgZ2V0UHJpb3JpdHkoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmxldmVsO1xuICAgIH1cbiAgICAvLyBDb25maWd1cmVcbiAgICBlbmFibGUoZW5hYmxlZCA9IHRydWUpIHtcbiAgICAgICAgdGhpcy5fc3RvcmFnZS5zZXRDb25maWd1cmF0aW9uKHsgZW5hYmxlZCB9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIHNldExldmVsKGxldmVsKSB7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0Q29uZmlndXJhdGlvbih7IGxldmVsIH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqIHJldHVybiB0aGUgY3VycmVudCBzdGF0dXMgb2YgdGhlIHNldHRpbmcgKi9cbiAgICBnZXQoc2V0dGluZykge1xuICAgICAgICByZXR1cm4gdGhpcy5fc3RvcmFnZS5jb25maWdbc2V0dGluZ107XG4gICAgfVxuICAgIC8vIHVwZGF0ZSB0aGUgc3RhdHVzIG9mIHRoZSBzZXR0aW5nXG4gICAgc2V0KHNldHRpbmcsIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuX3N0b3JhZ2Uuc2V0Q29uZmlndXJhdGlvbih7IFtzZXR0aW5nXTogdmFsdWUgfSk7XG4gICAgfVxuICAgIC8qKiBMb2dzIHRoZSBjdXJyZW50IHNldHRpbmdzIGFzIGEgdGFibGUgKi9cbiAgICBzZXR0aW5ncygpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUudGFibGUpIHtcbiAgICAgICAgICAgIGNvbnNvbGUudGFibGUodGhpcy5fc3RvcmFnZS5jb25maWcpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5fc3RvcmFnZS5jb25maWcpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFVuY29uZGl0aW9uYWwgbG9nZ2luZ1xuICAgIGFzc2VydChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICAgICAgaWYgKCFjb25kaXRpb24pIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdBc3NlcnRpb24gZmFpbGVkJyk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgd2FybihtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRMb2dGdW5jdGlvbigwLCBtZXNzYWdlLCBvcmlnaW5hbENvbnNvbGUud2FybiwgYXJndW1lbnRzLCBPTkNFKTtcbiAgICB9XG4gICAgZXJyb3IobWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0TG9nRnVuY3Rpb24oMCwgbWVzc2FnZSwgb3JpZ2luYWxDb25zb2xlLmVycm9yLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgICAvKiogUHJpbnQgYSBkZXByZWNhdGlvbiB3YXJuaW5nICovXG4gICAgZGVwcmVjYXRlZChvbGRVc2FnZSwgbmV3VXNhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMud2FybihgXFxgJHtvbGRVc2FnZX1cXGAgaXMgZGVwcmVjYXRlZCBhbmQgd2lsbCBiZSByZW1vdmVkIFxcXG5pbiBhIGxhdGVyIHZlcnNpb24uIFVzZSBcXGAke25ld1VzYWdlfVxcYCBpbnN0ZWFkYCk7XG4gICAgfVxuICAgIC8qKiBQcmludCBhIHJlbW92YWwgd2FybmluZyAqL1xuICAgIHJlbW92ZWQob2xkVXNhZ2UsIG5ld1VzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmVycm9yKGBcXGAke29sZFVzYWdlfVxcYCBoYXMgYmVlbiByZW1vdmVkLiBVc2UgXFxgJHtuZXdVc2FnZX1cXGAgaW5zdGVhZGApO1xuICAgIH1cbiAgICBwcm9iZShsb2dMZXZlbCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0TG9nRnVuY3Rpb24obG9nTGV2ZWwsIG1lc3NhZ2UsIG9yaWdpbmFsQ29uc29sZS5sb2csIGFyZ3VtZW50cywge1xuICAgICAgICAgICAgdGltZTogdHJ1ZSxcbiAgICAgICAgICAgIG9uY2U6IHRydWVcbiAgICAgICAgfSk7XG4gICAgfVxuICAgIGxvZyhsb2dMZXZlbCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0TG9nRnVuY3Rpb24obG9nTGV2ZWwsIG1lc3NhZ2UsIG9yaWdpbmFsQ29uc29sZS5kZWJ1ZywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgaW5mbyhsb2dMZXZlbCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0TG9nRnVuY3Rpb24obG9nTGV2ZWwsIG1lc3NhZ2UsIGNvbnNvbGUuaW5mbywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgb25jZShsb2dMZXZlbCwgbWVzc2FnZSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0TG9nRnVuY3Rpb24obG9nTGV2ZWwsIG1lc3NhZ2UsIG9yaWdpbmFsQ29uc29sZS5kZWJ1ZyB8fCBvcmlnaW5hbENvbnNvbGUuaW5mbywgYXJndW1lbnRzLCBPTkNFKTtcbiAgICB9XG4gICAgLyoqIExvZ3MgYW4gb2JqZWN0IGFzIGEgdGFibGUgKi9cbiAgICB0YWJsZShsb2dMZXZlbCwgdGFibGUsIGNvbHVtbnMpIHtcbiAgICAgICAgaWYgKHRhYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5fZ2V0TG9nRnVuY3Rpb24obG9nTGV2ZWwsIHRhYmxlLCBjb25zb2xlLnRhYmxlIHx8IG5vb3AsIChjb2x1bW5zICYmIFtjb2x1bW5zXSksIHtcbiAgICAgICAgICAgICAgICB0YWc6IGdldFRhYmxlSGVhZGVyKHRhYmxlKVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgfVxuICAgIHRpbWUobG9nTGV2ZWwsIG1lc3NhZ2UpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldExvZ0Z1bmN0aW9uKGxvZ0xldmVsLCBtZXNzYWdlLCBjb25zb2xlLnRpbWUgPyBjb25zb2xlLnRpbWUgOiBjb25zb2xlLmluZm8pO1xuICAgIH1cbiAgICB0aW1lRW5kKGxvZ0xldmVsLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRMb2dGdW5jdGlvbihsb2dMZXZlbCwgbWVzc2FnZSwgY29uc29sZS50aW1lRW5kID8gY29uc29sZS50aW1lRW5kIDogY29uc29sZS5pbmZvKTtcbiAgICB9XG4gICAgdGltZVN0YW1wKGxvZ0xldmVsLCBtZXNzYWdlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9nZXRMb2dGdW5jdGlvbihsb2dMZXZlbCwgbWVzc2FnZSwgY29uc29sZS50aW1lU3RhbXAgfHwgbm9vcCk7XG4gICAgfVxuICAgIGdyb3VwKGxvZ0xldmVsLCBtZXNzYWdlLCBvcHRzID0geyBjb2xsYXBzZWQ6IGZhbHNlIH0pIHtcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IG5vcm1hbGl6ZUFyZ3VtZW50cyh7IGxvZ0xldmVsLCBtZXNzYWdlLCBvcHRzIH0pO1xuICAgICAgICBjb25zdCB7IGNvbGxhcHNlZCB9ID0gb3B0cztcbiAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICBvcHRpb25zLm1ldGhvZCA9IChjb2xsYXBzZWQgPyBjb25zb2xlLmdyb3VwQ29sbGFwc2VkIDogY29uc29sZS5ncm91cCkgfHwgY29uc29sZS5pbmZvO1xuICAgICAgICByZXR1cm4gdGhpcy5fZ2V0TG9nRnVuY3Rpb24ob3B0aW9ucyk7XG4gICAgfVxuICAgIGdyb3VwQ29sbGFwc2VkKGxvZ0xldmVsLCBtZXNzYWdlLCBvcHRzID0ge30pIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ3JvdXAobG9nTGV2ZWwsIG1lc3NhZ2UsIE9iamVjdC5hc3NpZ24oe30sIG9wdHMsIHsgY29sbGFwc2VkOiB0cnVlIH0pKTtcbiAgICB9XG4gICAgZ3JvdXBFbmQobG9nTGV2ZWwpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2dldExvZ0Z1bmN0aW9uKGxvZ0xldmVsLCAnJywgY29uc29sZS5ncm91cEVuZCB8fCBub29wKTtcbiAgICB9XG4gICAgLy8gRVhQRVJJTUVOVEFMXG4gICAgd2l0aEdyb3VwKGxvZ0xldmVsLCBtZXNzYWdlLCBmdW5jKSB7XG4gICAgICAgIHRoaXMuZ3JvdXAobG9nTGV2ZWwsIG1lc3NhZ2UpKCk7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBmdW5jKCk7XG4gICAgICAgIH1cbiAgICAgICAgZmluYWxseSB7XG4gICAgICAgICAgICB0aGlzLmdyb3VwRW5kKGxvZ0xldmVsKSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRyYWNlKCkge1xuICAgICAgICBpZiAoY29uc29sZS50cmFjZSkge1xuICAgICAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIFBSSVZBVEUgTUVUSE9EU1xuICAgIC8qKiBEZWR1Y2VzIGxvZyBsZXZlbCBmcm9tIGEgdmFyaWV0eSBvZiBhcmd1bWVudHMgKi9cbiAgICBfc2hvdWxkTG9nKGxvZ0xldmVsKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmlzRW5hYmxlZCgpICYmIHRoaXMuZ2V0TGV2ZWwoKSA+PSBub3JtYWxpemVMb2dMZXZlbChsb2dMZXZlbCk7XG4gICAgfVxuICAgIF9nZXRMb2dGdW5jdGlvbihsb2dMZXZlbCwgbWVzc2FnZSwgbWV0aG9kLCBhcmdzLCBvcHRzKSB7XG4gICAgICAgIGlmICh0aGlzLl9zaG91bGRMb2cobG9nTGV2ZWwpKSB7XG4gICAgICAgICAgICAvLyBub3JtYWxpemVkIG9wdHMgKyB0aW1pbmdzXG4gICAgICAgICAgICBvcHRzID0gbm9ybWFsaXplQXJndW1lbnRzKHsgbG9nTGV2ZWwsIG1lc3NhZ2UsIGFyZ3MsIG9wdHMgfSk7XG4gICAgICAgICAgICBtZXRob2QgPSBtZXRob2QgfHwgb3B0cy5tZXRob2Q7XG4gICAgICAgICAgICBhc3NlcnQobWV0aG9kKTtcbiAgICAgICAgICAgIG9wdHMudG90YWwgPSB0aGlzLmdldFRvdGFsKCk7XG4gICAgICAgICAgICBvcHRzLmRlbHRhID0gdGhpcy5nZXREZWx0YSgpO1xuICAgICAgICAgICAgLy8gcmVzZXQgZGVsdGEgdGltZXJcbiAgICAgICAgICAgIHRoaXMuX2RlbHRhVHMgPSBnZXRIaVJlc1RpbWVzdGFtcCgpO1xuICAgICAgICAgICAgY29uc3QgdGFnID0gb3B0cy50YWcgfHwgb3B0cy5tZXNzYWdlO1xuICAgICAgICAgICAgaWYgKG9wdHMub25jZSAmJiB0YWcpIHtcbiAgICAgICAgICAgICAgICBpZiAoIWNhY2hlW3RhZ10pIHtcbiAgICAgICAgICAgICAgICAgICAgY2FjaGVbdGFnXSA9IGdldEhpUmVzVGltZXN0YW1wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gbm9vcDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvLyBUT0RPIC0gTWFrZSB0aHJvdHRsaW5nIHdvcmsgd2l0aCBncm91cHNcbiAgICAgICAgICAgIC8vIGlmIChvcHRzLm5vdGhyb3R0bGUgfHwgIXRocm90dGxlKHRhZywgdGhpcy5MT0dfVEhST1RUTEVfVElNRU9VVCkpIHtcbiAgICAgICAgICAgIC8vICAgcmV0dXJuIG5vb3A7XG4gICAgICAgICAgICAvLyB9XG4gICAgICAgICAgICBtZXNzYWdlID0gZGVjb3JhdGVNZXNzYWdlKHRoaXMuaWQsIG9wdHMubWVzc2FnZSwgb3B0cyk7XG4gICAgICAgICAgICAvLyBCaW5kIGNvbnNvbGUgZnVuY3Rpb24gc28gdGhhdCBpdCBjYW4gYmUgY2FsbGVkIGFmdGVyIGJlaW5nIHJldHVybmVkXG4gICAgICAgICAgICByZXR1cm4gbWV0aG9kLmJpbmQoY29uc29sZSwgbWVzc2FnZSwgLi4ub3B0cy5hcmdzKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbm9vcDtcbiAgICB9XG59XG5Mb2cuVkVSU0lPTiA9IFZFUlNJT047XG4vKipcbiAqIEdldCBsb2dMZXZlbCBmcm9tIGZpcnN0IGFyZ3VtZW50OlxuICogLSBsb2cobG9nTGV2ZWwsIG1lc3NhZ2UsIGFyZ3MpID0+IGxvZ0xldmVsXG4gKiAtIGxvZyhtZXNzYWdlLCBhcmdzKSA9PiAwXG4gKiAtIGxvZyh7bG9nTGV2ZWwsIC4uLn0sIG1lc3NhZ2UsIGFyZ3MpID0+IGxvZ0xldmVsXG4gKiAtIGxvZyh7bG9nTGV2ZWwsIG1lc3NhZ2UsIGFyZ3N9KSA9PiBsb2dMZXZlbFxuICovXG5mdW5jdGlvbiBub3JtYWxpemVMb2dMZXZlbChsb2dMZXZlbCkge1xuICAgIGlmICghbG9nTGV2ZWwpIHtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgfVxuICAgIGxldCByZXNvbHZlZExldmVsO1xuICAgIHN3aXRjaCAodHlwZW9mIGxvZ0xldmVsKSB7XG4gICAgICAgIGNhc2UgJ251bWJlcic6XG4gICAgICAgICAgICByZXNvbHZlZExldmVsID0gbG9nTGV2ZWw7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgIC8vIEJhY2t3YXJkIGNvbXBhdGliaWxpdHlcbiAgICAgICAgICAgIC8vIFRPRE8gLSBkZXByZWNhdGUgYHByaW9yaXR5YFxuICAgICAgICAgICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgICAgICAgICAgcmVzb2x2ZWRMZXZlbCA9IGxvZ0xldmVsLmxvZ0xldmVsIHx8IGxvZ0xldmVsLnByaW9yaXR5IHx8IDA7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgZGVmYXVsdDpcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgIH1cbiAgICAvLyAnbG9nIGxldmVsIG11c3QgYmUgYSBudW1iZXInXG4gICAgYXNzZXJ0KE51bWJlci5pc0Zpbml0ZShyZXNvbHZlZExldmVsKSAmJiByZXNvbHZlZExldmVsID49IDApO1xuICAgIHJldHVybiByZXNvbHZlZExldmVsO1xufVxuLyoqXG4gKiBcIk5vcm1hbGl6ZXNcIiB0aGUgdmFyaW91cyBhcmd1bWVudCBwYXR0ZXJucyBpbnRvIGFuIG9iamVjdCB3aXRoIGtub3duIHR5cGVzXG4gKiAtIGxvZyhsb2dMZXZlbCwgbWVzc2FnZSwgYXJncykgPT4ge2xvZ0xldmVsLCBtZXNzYWdlLCBhcmdzfVxuICogLSBsb2cobWVzc2FnZSwgYXJncykgPT4ge2xvZ0xldmVsOiAwLCBtZXNzYWdlLCBhcmdzfVxuICogLSBsb2coe2xvZ0xldmVsLCAuLi59LCBtZXNzYWdlLCBhcmdzKSA9PiB7bG9nTGV2ZWwsIG1lc3NhZ2UsIGFyZ3N9XG4gKiAtIGxvZyh7bG9nTGV2ZWwsIG1lc3NhZ2UsIGFyZ3N9KSA9PiB7bG9nTGV2ZWwsIG1lc3NhZ2UsIGFyZ3N9XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBub3JtYWxpemVBcmd1bWVudHMob3B0cykge1xuICAgIGNvbnN0IHsgbG9nTGV2ZWwsIG1lc3NhZ2UgfSA9IG9wdHM7XG4gICAgb3B0cy5sb2dMZXZlbCA9IG5vcm1hbGl6ZUxvZ0xldmVsKGxvZ0xldmVsKTtcbiAgICAvLyBXZSB1c2UgYGFyZ3VtZW50c2AgaW5zdGVhZCBvZiByZXN0IHBhcmFtZXRlcnMgKC4uLmFyZ3MpIGJlY2F1c2UgSUVcbiAgICAvLyBkb2VzIG5vdCBzdXBwb3J0IHRoZSBzeW50YXguIFJlc3QgcGFyYW1ldGVycyBpcyB0cmFuc3BpbGVkIHRvIGNvZGUgd2l0aFxuICAgIC8vIHBlcmYgaW1wYWN0LiBEb2luZyBpdCBoZXJlIGluc3RlYWQgYXZvaWRzIGNvbnN0cnVjdGluZyBhcmdzIHdoZW4gbG9nZ2luZyBpc1xuICAgIC8vIGRpc2FibGVkLlxuICAgIC8vIFRPRE8gLSByZW1vdmUgd2hlbi9pZiBJRSBzdXBwb3J0IGlzIGRyb3BwZWRcbiAgICBjb25zdCBhcmdzID0gb3B0cy5hcmdzID8gQXJyYXkuZnJvbShvcHRzLmFyZ3MpIDogW107XG4gICAgLy8gYXJncyBzaG91bGQgb25seSBjb250YWluIGFyZ3VtZW50cyB0aGF0IGFwcGVhciBhZnRlciBgbWVzc2FnZWBcbiAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tZW1wdHlcbiAgICB3aGlsZSAoYXJncy5sZW5ndGggJiYgYXJncy5zaGlmdCgpICE9PSBtZXNzYWdlKSB7IH1cbiAgICBzd2l0Y2ggKHR5cGVvZiBsb2dMZXZlbCkge1xuICAgICAgICBjYXNlICdzdHJpbmcnOlxuICAgICAgICBjYXNlICdmdW5jdGlvbic6XG4gICAgICAgICAgICBpZiAobWVzc2FnZSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgYXJncy51bnNoaWZ0KG1lc3NhZ2UpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgb3B0cy5tZXNzYWdlID0gbG9nTGV2ZWw7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgY2FzZSAnb2JqZWN0JzpcbiAgICAgICAgICAgIE9iamVjdC5hc3NpZ24ob3B0cywgbG9nTGV2ZWwpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIGRlZmF1bHQ6XG4gICAgfVxuICAgIC8vIFJlc29sdmUgZnVuY3Rpb25zIGludG8gc3RyaW5ncyBieSBjYWxsaW5nIHRoZW1cbiAgICBpZiAodHlwZW9mIG9wdHMubWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICBvcHRzLm1lc3NhZ2UgPSBvcHRzLm1lc3NhZ2UoKTtcbiAgICB9XG4gICAgY29uc3QgbWVzc2FnZVR5cGUgPSB0eXBlb2Ygb3B0cy5tZXNzYWdlO1xuICAgIC8vICdsb2cgbWVzc2FnZSBtdXN0IGJlIGEgc3RyaW5nJyBvciBvYmplY3RcbiAgICBhc3NlcnQobWVzc2FnZVR5cGUgPT09ICdzdHJpbmcnIHx8IG1lc3NhZ2VUeXBlID09PSAnb2JqZWN0Jyk7XG4gICAgLy8gb3JpZ2luYWwgb3B0cyArIG5vcm1hbGl6ZWQgb3B0cyArIG9wdHMgYXJnICsgZml4ZWQgdXAgbWVzc2FnZVxuICAgIHJldHVybiBPYmplY3QuYXNzaWduKG9wdHMsIHsgYXJncyB9LCBvcHRzLm9wdHMpO1xufVxuZnVuY3Rpb24gZGVjb3JhdGVNZXNzYWdlKGlkLCBtZXNzYWdlLCBvcHRzKSB7XG4gICAgaWYgKHR5cGVvZiBtZXNzYWdlID09PSAnc3RyaW5nJykge1xuICAgICAgICBjb25zdCB0aW1lID0gb3B0cy50aW1lID8gbGVmdFBhZChmb3JtYXRUaW1lKG9wdHMudG90YWwpKSA6ICcnO1xuICAgICAgICBtZXNzYWdlID0gb3B0cy50aW1lID8gYCR7aWR9OiAke3RpbWV9ICAke21lc3NhZ2V9YCA6IGAke2lkfTogJHttZXNzYWdlfWA7XG4gICAgICAgIG1lc3NhZ2UgPSBhZGRDb2xvcihtZXNzYWdlLCBvcHRzLmNvbG9yLCBvcHRzLmJhY2tncm91bmQpO1xuICAgIH1cbiAgICByZXR1cm4gbWVzc2FnZTtcbn1cbmZ1bmN0aW9uIGdldFRhYmxlSGVhZGVyKHRhYmxlKSB7XG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGFibGUpIHtcbiAgICAgICAgZm9yIChjb25zdCB0aXRsZSBpbiB0YWJsZVtrZXldKSB7XG4gICAgICAgICAgICByZXR1cm4gdGl0bGUgfHwgJ3VudGl0bGVkJztcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJ2VtcHR5Jztcbn1cbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIGFzc2VydChjb25kaXRpb24sIG1lc3NhZ2UpIHtcbiAgICBpZiAoIWNvbmRpdGlvbikge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnQXNzZXJ0aW9uIGZhaWxlZCcpO1xuICAgIH1cbn1cbiIsIi8vIENvcHlyaWdodCAoYykgMjAxNSAtIDIwMTcgVWJlciBUZWNobm9sb2dpZXMsIEluYy5cbi8vXG4vLyBQZXJtaXNzaW9uIGlzIGhlcmVieSBncmFudGVkLCBmcmVlIG9mIGNoYXJnZSwgdG8gYW55IHBlcnNvbiBvYnRhaW5pbmcgYSBjb3B5XG4vLyBvZiB0aGlzIHNvZnR3YXJlIGFuZCBhc3NvY2lhdGVkIGRvY3VtZW50YXRpb24gZmlsZXMgKHRoZSBcIlNvZnR3YXJlXCIpLCB0byBkZWFsXG4vLyBpbiB0aGUgU29mdHdhcmUgd2l0aG91dCByZXN0cmljdGlvbiwgaW5jbHVkaW5nIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzXG4vLyB0byB1c2UsIGNvcHksIG1vZGlmeSwgbWVyZ2UsIHB1Ymxpc2gsIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsXG4vLyBjb3BpZXMgb2YgdGhlIFNvZnR3YXJlLCBhbmQgdG8gcGVybWl0IHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXNcbi8vIGZ1cm5pc2hlZCB0byBkbyBzbywgc3ViamVjdCB0byB0aGUgZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWQgaW5cbi8vIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1MgT1Jcbi8vIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0YgTUVSQ0hBTlRBQklMSVRZLFxuLy8gRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU4gTk8gRVZFTlQgU0hBTEwgVEhFXG4vLyBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLCBEQU1BR0VTIE9SIE9USEVSXG4vLyBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SIE9USEVSV0lTRSwgQVJJU0lORyBGUk9NLFxuLy8gT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFIFVTRSBPUiBPVEhFUiBERUFMSU5HUyBJTlxuLy8gVEhFIFNPRlRXQVJFLlxuLyoqXG4gKiBCaW5kcyB0aGUgXCJ0aGlzXCIgYXJndW1lbnQgb2YgYWxsIGZ1bmN0aW9ucyBvbiBhIGNsYXNzIGluc3RhbmNlIHRvIHRoZSBpbnN0YW5jZVxuICogQHBhcmFtIG9iaiAtIGNsYXNzIGluc3RhbmNlICh0eXBpY2FsbHkgYSByZWFjdCBjb21wb25lbnQpXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBhdXRvYmluZChvYmosIHByZWRlZmluZWQgPSBbJ2NvbnN0cnVjdG9yJ10pIHtcbiAgICBjb25zdCBwcm90byA9IE9iamVjdC5nZXRQcm90b3R5cGVPZihvYmopO1xuICAgIGNvbnN0IHByb3BOYW1lcyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHByb3RvKTtcbiAgICBjb25zdCBvYmplY3QgPSBvYmo7XG4gICAgZm9yIChjb25zdCBrZXkgb2YgcHJvcE5hbWVzKSB7XG4gICAgICAgIGNvbnN0IHZhbHVlID0gb2JqZWN0W2tleV07XG4gICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGlmICghcHJlZGVmaW5lZC5maW5kKG5hbWUgPT4ga2V5ID09PSBuYW1lKSkge1xuICAgICAgICAgICAgICAgIG9iamVjdFtrZXldID0gdmFsdWUuYmluZChvYmopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgaXNCcm93c2VyIH0gZnJvbSAnQHByb2JlLmdsL2Vudic7XG5leHBvcnQgdmFyIENPTE9SO1xuKGZ1bmN0aW9uIChDT0xPUikge1xuICAgIENPTE9SW0NPTE9SW1wiQkxBQ0tcIl0gPSAzMF0gPSBcIkJMQUNLXCI7XG4gICAgQ09MT1JbQ09MT1JbXCJSRURcIl0gPSAzMV0gPSBcIlJFRFwiO1xuICAgIENPTE9SW0NPTE9SW1wiR1JFRU5cIl0gPSAzMl0gPSBcIkdSRUVOXCI7XG4gICAgQ09MT1JbQ09MT1JbXCJZRUxMT1dcIl0gPSAzM10gPSBcIllFTExPV1wiO1xuICAgIENPTE9SW0NPTE9SW1wiQkxVRVwiXSA9IDM0XSA9IFwiQkxVRVwiO1xuICAgIENPTE9SW0NPTE9SW1wiTUFHRU5UQVwiXSA9IDM1XSA9IFwiTUFHRU5UQVwiO1xuICAgIENPTE9SW0NPTE9SW1wiQ1lBTlwiXSA9IDM2XSA9IFwiQ1lBTlwiO1xuICAgIENPTE9SW0NPTE9SW1wiV0hJVEVcIl0gPSAzN10gPSBcIldISVRFXCI7XG4gICAgQ09MT1JbQ09MT1JbXCJCUklHSFRfQkxBQ0tcIl0gPSA5MF0gPSBcIkJSSUdIVF9CTEFDS1wiO1xuICAgIENPTE9SW0NPTE9SW1wiQlJJR0hUX1JFRFwiXSA9IDkxXSA9IFwiQlJJR0hUX1JFRFwiO1xuICAgIENPTE9SW0NPTE9SW1wiQlJJR0hUX0dSRUVOXCJdID0gOTJdID0gXCJCUklHSFRfR1JFRU5cIjtcbiAgICBDT0xPUltDT0xPUltcIkJSSUdIVF9ZRUxMT1dcIl0gPSA5M10gPSBcIkJSSUdIVF9ZRUxMT1dcIjtcbiAgICBDT0xPUltDT0xPUltcIkJSSUdIVF9CTFVFXCJdID0gOTRdID0gXCJCUklHSFRfQkxVRVwiO1xuICAgIENPTE9SW0NPTE9SW1wiQlJJR0hUX01BR0VOVEFcIl0gPSA5NV0gPSBcIkJSSUdIVF9NQUdFTlRBXCI7XG4gICAgQ09MT1JbQ09MT1JbXCJCUklHSFRfQ1lBTlwiXSA9IDk2XSA9IFwiQlJJR0hUX0NZQU5cIjtcbiAgICBDT0xPUltDT0xPUltcIkJSSUdIVF9XSElURVwiXSA9IDk3XSA9IFwiQlJJR0hUX1dISVRFXCI7XG59KShDT0xPUiB8fCAoQ09MT1IgPSB7fSkpO1xuY29uc3QgQkFDS0dST1VORF9JTkNSRU1FTlQgPSAxMDtcbmZ1bmN0aW9uIGdldENvbG9yKGNvbG9yKSB7XG4gICAgaWYgKHR5cGVvZiBjb2xvciAhPT0gJ3N0cmluZycpIHtcbiAgICAgICAgcmV0dXJuIGNvbG9yO1xuICAgIH1cbiAgICBjb2xvciA9IGNvbG9yLnRvVXBwZXJDYXNlKCk7XG4gICAgcmV0dXJuIENPTE9SW2NvbG9yXSB8fCBDT0xPUi5XSElURTtcbn1cbmV4cG9ydCBmdW5jdGlvbiBhZGRDb2xvcihzdHJpbmcsIGNvbG9yLCBiYWNrZ3JvdW5kKSB7XG4gICAgaWYgKCFpc0Jyb3dzZXIgJiYgdHlwZW9mIHN0cmluZyA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICBjb25zdCBjb2xvckNvZGUgPSBnZXRDb2xvcihjb2xvcik7XG4gICAgICAgICAgICBzdHJpbmcgPSBgXFx1MDAxYlske2NvbG9yQ29kZX1tJHtzdHJpbmd9XFx1MDAxYlszOW1gO1xuICAgICAgICB9XG4gICAgICAgIGlmIChiYWNrZ3JvdW5kKSB7XG4gICAgICAgICAgICAvLyBiYWNrZ3JvdW5kIGNvbG9ycyB2YWx1ZXMgYXJlICsxMFxuICAgICAgICAgICAgY29uc3QgY29sb3JDb2RlID0gZ2V0Q29sb3IoYmFja2dyb3VuZCk7XG4gICAgICAgICAgICBzdHJpbmcgPSBgXFx1MDAxYlske2NvbG9yQ29kZSArIEJBQ0tHUk9VTkRfSU5DUkVNRU5UfW0ke3N0cmluZ31cXHUwMDFiWzQ5bWA7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHN0cmluZztcbn1cbiIsIi8vIHByb2JlLmdsLCBNSVQgbGljZW5zZVxuLyoqXG4gKiBGb3JtYXQgdGltZVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0VGltZShtcykge1xuICAgIGxldCBmb3JtYXR0ZWQ7XG4gICAgaWYgKG1zIDwgMTApIHtcbiAgICAgICAgZm9ybWF0dGVkID0gYCR7bXMudG9GaXhlZCgyKX1tc2A7XG4gICAgfVxuICAgIGVsc2UgaWYgKG1zIDwgMTAwKSB7XG4gICAgICAgIGZvcm1hdHRlZCA9IGAke21zLnRvRml4ZWQoMSl9bXNgO1xuICAgIH1cbiAgICBlbHNlIGlmIChtcyA8IDEwMDApIHtcbiAgICAgICAgZm9ybWF0dGVkID0gYCR7bXMudG9GaXhlZCgwKX1tc2A7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBmb3JtYXR0ZWQgPSBgJHsobXMgLyAxMDAwKS50b0ZpeGVkKDIpfXNgO1xuICAgIH1cbiAgICByZXR1cm4gZm9ybWF0dGVkO1xufVxuZXhwb3J0IGZ1bmN0aW9uIGxlZnRQYWQoc3RyaW5nLCBsZW5ndGggPSA4KSB7XG4gICAgY29uc3QgcGFkTGVuZ3RoID0gTWF0aC5tYXgobGVuZ3RoIC0gc3RyaW5nLmxlbmd0aCwgMCk7XG4gICAgcmV0dXJuIGAkeycgJy5yZXBlYXQocGFkTGVuZ3RoKX0ke3N0cmluZ31gO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHJpZ2h0UGFkKHN0cmluZywgbGVuZ3RoID0gOCkge1xuICAgIGNvbnN0IHBhZExlbmd0aCA9IE1hdGgubWF4KGxlbmd0aCAtIHN0cmluZy5sZW5ndGgsIDApO1xuICAgIHJldHVybiBgJHtzdHJpbmd9JHsnICcucmVwZWF0KHBhZExlbmd0aCl9YDtcbn1cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2LCBvcHRpb25zID0ge30pIHtcbiAgICBjb25zdCBFUFNJTE9OID0gMWUtMTY7XG4gICAgY29uc3QgeyBpc0ludGVnZXIgPSBmYWxzZSB9ID0gb3B0aW9ucztcbiAgICBpZiAoQXJyYXkuaXNBcnJheSh2KSB8fCBBcnJheUJ1ZmZlci5pc1ZpZXcodikpIHtcbiAgICAgICAgcmV0dXJuIGZvcm1hdEFycmF5VmFsdWUodiwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGlmICghTnVtYmVyLmlzRmluaXRlKHYpKSB7XG4gICAgICAgIHJldHVybiBTdHJpbmcodik7XG4gICAgfVxuICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICBpZiAoTWF0aC5hYnModikgPCBFUFNJTE9OKSB7XG4gICAgICAgIHJldHVybiBpc0ludGVnZXIgPyAnMCcgOiAnMC4nO1xuICAgIH1cbiAgICBpZiAoaXNJbnRlZ2VyKSB7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgcmV0dXJuIHYudG9GaXhlZCgwKTtcbiAgICB9XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgIGlmIChNYXRoLmFicyh2KSA+IDEwMCAmJiBNYXRoLmFicyh2KSA8IDEwMDAwKSB7XG4gICAgICAgIC8vIEB0cy1leHBlY3QtZXJyb3JcbiAgICAgICAgcmV0dXJuIHYudG9GaXhlZCgwKTtcbiAgICB9XG4gICAgLy8gQHRzLWV4cGVjdC1lcnJvclxuICAgIGNvbnN0IHN0cmluZyA9IHYudG9QcmVjaXNpb24oMik7XG4gICAgY29uc3QgZGVjaW1hbCA9IHN0cmluZy5pbmRleE9mKCcuMCcpO1xuICAgIHJldHVybiBkZWNpbWFsID09PSBzdHJpbmcubGVuZ3RoIC0gMiA/IHN0cmluZy5zbGljZSgwLCAtMSkgOiBzdHJpbmc7XG59XG4vKiogSGVscGVyIHRvIGZvcm1hdFZhbHVlICovXG5mdW5jdGlvbiBmb3JtYXRBcnJheVZhbHVlKHYsIG9wdGlvbnMpIHtcbiAgICBjb25zdCB7IG1heEVsdHMgPSAxNiwgc2l6ZSA9IDEgfSA9IG9wdGlvbnM7XG4gICAgbGV0IHN0cmluZyA9ICdbJztcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHYubGVuZ3RoICYmIGkgPCBtYXhFbHRzOyArK2kpIHtcbiAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICBzdHJpbmcgKz0gYCwke2kgJSBzaXplID09PSAwID8gJyAnIDogJyd9YDtcbiAgICAgICAgfVxuICAgICAgICBzdHJpbmcgKz0gZm9ybWF0VmFsdWUodltpXSwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGNvbnN0IHRlcm1pbmF0b3IgPSB2Lmxlbmd0aCA+IG1heEVsdHMgPyAnLi4uJyA6ICddJztcbiAgICByZXR1cm4gYCR7c3RyaW5nfSR7dGVybWluYXRvcn1gO1xufVxuIiwiLy8gcHJvYmUuZ2wsIE1JVCBsaWNlbnNlXG5pbXBvcnQgeyB3aW5kb3csIHByb2Nlc3MsIGlzQnJvd3NlciB9IGZyb20gJ0Bwcm9iZS5nbC9lbnYnO1xuLyoqIEdldCBiZXN0IHRpbWVyIGF2YWlsYWJsZS4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRIaVJlc1RpbWVzdGFtcCgpIHtcbiAgICBsZXQgdGltZXN0YW1wO1xuICAgIGlmIChpc0Jyb3dzZXIoKSAmJiB3aW5kb3cucGVyZm9ybWFuY2UpIHtcbiAgICAgICAgdGltZXN0YW1wID0gd2luZG93Py5wZXJmb3JtYW5jZT8ubm93Py4oKTtcbiAgICB9XG4gICAgZWxzZSBpZiAoJ2hydGltZScgaW4gcHJvY2Vzcykge1xuICAgICAgICAvLyBAdHMtaWdub3JlXG4gICAgICAgIGNvbnN0IHRpbWVQYXJ0cyA9IHByb2Nlc3M/LmhydGltZT8uKCk7XG4gICAgICAgIHRpbWVzdGFtcCA9IHRpbWVQYXJ0c1swXSAqIDEwMDAgKyB0aW1lUGFydHNbMV0gLyAxZTY7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aW1lc3RhbXAgPSBEYXRlLm5vdygpO1xuICAgIH1cbiAgICByZXR1cm4gdGltZXN0YW1wO1xufVxuIiwiLy8gcHJvYmUuZ2wsIE1JVCBsaWNlbnNlXG5mdW5jdGlvbiBnZXRTdG9yYWdlKHR5cGUpIHtcbiAgICB0cnkge1xuICAgICAgICBjb25zdCBzdG9yYWdlID0gd2luZG93W3R5cGVdO1xuICAgICAgICBjb25zdCB4ID0gJ19fc3RvcmFnZV90ZXN0X18nO1xuICAgICAgICBzdG9yYWdlLnNldEl0ZW0oeCwgeCk7XG4gICAgICAgIHN0b3JhZ2UucmVtb3ZlSXRlbSh4KTtcbiAgICAgICAgcmV0dXJuIHN0b3JhZ2U7XG4gICAgfVxuICAgIGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbn1cbi8vIFN0b3JlIGtleXMgaW4gbG9jYWwgc3RvcmFnZSB2aWEgc2ltcGxlIGludGVyZmFjZVxuZXhwb3J0IGNsYXNzIExvY2FsU3RvcmFnZSB7XG4gICAgY29uc3RydWN0b3IoaWQsIGRlZmF1bHRDb25maWcsIHR5cGUgPSAnc2Vzc2lvblN0b3JhZ2UnKSB7XG4gICAgICAgIHRoaXMuc3RvcmFnZSA9IGdldFN0b3JhZ2UodHlwZSk7XG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICAgICAgdGhpcy5jb25maWcgPSBkZWZhdWx0Q29uZmlnO1xuICAgICAgICB0aGlzLl9sb2FkQ29uZmlndXJhdGlvbigpO1xuICAgIH1cbiAgICBnZXRDb25maWd1cmF0aW9uKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5jb25maWc7XG4gICAgfVxuICAgIHNldENvbmZpZ3VyYXRpb24oY29uZmlndXJhdGlvbikge1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuY29uZmlnLCBjb25maWd1cmF0aW9uKTtcbiAgICAgICAgaWYgKHRoaXMuc3RvcmFnZSkge1xuICAgICAgICAgICAgY29uc3Qgc2VyaWFsaXplZCA9IEpTT04uc3RyaW5naWZ5KHRoaXMuY29uZmlnKTtcbiAgICAgICAgICAgIHRoaXMuc3RvcmFnZS5zZXRJdGVtKHRoaXMuaWQsIHNlcmlhbGl6ZWQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8vIEdldCBjb25maWcgZnJvbSBwZXJzaXN0ZW50IHN0b3JlLCBpZiBhdmFpbGFibGVcbiAgICBfbG9hZENvbmZpZ3VyYXRpb24oKSB7XG4gICAgICAgIGxldCBjb25maWd1cmF0aW9uID0ge307XG4gICAgICAgIGlmICh0aGlzLnN0b3JhZ2UpIHtcbiAgICAgICAgICAgIGNvbnN0IHNlcmlhbGl6ZWRDb25maWd1cmF0aW9uID0gdGhpcy5zdG9yYWdlLmdldEl0ZW0odGhpcy5pZCk7XG4gICAgICAgICAgICBjb25maWd1cmF0aW9uID0gc2VyaWFsaXplZENvbmZpZ3VyYXRpb24gPyBKU09OLnBhcnNlKHNlcmlhbGl6ZWRDb25maWd1cmF0aW9uKSA6IHt9O1xuICAgICAgICB9XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5jb25maWcsIGNvbmZpZ3VyYXRpb24pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iXSwibmFtZXMiOltdLCJzb3VyY2VSb290IjoiIn0=