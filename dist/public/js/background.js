/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/js/browser.api.ts":
/*!*******************************!*\
  !*** ./src/js/browser.api.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var BrowserApi = /** @class */ (function () {
    function BrowserApi() {
        try {
            if (!chrome) {
                this.isInit = false;
            }
            else {
                this.isInit = true;
            }
        }
        catch (_a) {
            this.isInit = false;
        }
    }
    BrowserApi.prototype.getTab = function (active) {
        return __awaiter(this, void 0, void 0, function () {
            var tabs, tab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isInit)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, chrome.tabs.query({ active: active, lastFocusedWindow: true })];
                    case 1:
                        tabs = _a.sent();
                        tab = tabs[0];
                        if (tab && tab.url) {
                            return [2 /*return*/, {
                                    url: tab.url
                                }];
                        }
                        return [2 /*return*/, null];
                }
            });
        });
    };
    BrowserApi.prototype.findTab = function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.isInit)
                    return [2 /*return*/, null];
                return [2 /*return*/, chrome.tabs.query({
                        url: url
                    })];
            });
        });
    };
    BrowserApi.prototype.closeActiveTab = function () {
        return __awaiter(this, void 0, void 0, function () {
            var tabs, tab;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.isInit)
                            return [2 /*return*/, null];
                        return [4 /*yield*/, chrome.tabs.query({ active: true, lastFocusedWindow: true })];
                    case 1:
                        tabs = _a.sent();
                        tab = tabs[0];
                        return [4 /*yield*/, chrome.tabs.remove(tab.id)];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserApi.prototype.extensionId = function () {
        return chrome.runtime.id;
    };
    BrowserApi.prototype.sendMessage = function (msg) {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chrome.runtime.reload];
                    case 1:
                        _a.sent();
                        return [4 /*yield*/, chrome.runtime.sendMessage(this.extensionId(), msg)];
                    case 2:
                        response = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserApi.prototype.addListener = function (callback) {
        return chrome.commands.onCommand.addListener(callback);
    };
    BrowserApi.prototype.onMessage = function (callback) {
        return chrome.runtime.onMessage.addListener(callback);
    };
    BrowserApi.prototype.openExternal = function (url) {
        if (!this.isInit)
            return;
        chrome.tabs.create({ url: url });
    };
    BrowserApi.prototype.setAlarm = function (name, alarm) {
        if (!this.isInit)
            return;
        chrome.alarms.create(name, alarm);
    };
    BrowserApi.prototype.onAlarm = function (callback) {
        if (!this.isInit)
            return;
        chrome.alarms.onAlarm.addListener(callback);
    };
    BrowserApi.prototype.onInstalled = function (callback) {
        if (!this.isInit)
            return null;
        chrome.runtime.onInstalled.addListener(callback);
    };
    BrowserApi.prototype.onStartup = function (callback) {
        if (!this.isInit)
            return void 0;
        chrome.runtime.onStartup.addListener(callback);
    };
    BrowserApi.prototype.getAlarms = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.isInit)
                    return [2 /*return*/, []];
                return [2 /*return*/, chrome.alarms.getAll()];
            });
        });
    };
    BrowserApi.prototype.removeAlarm = function (name) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.isInit)
                    return [2 /*return*/, void 0];
                return [2 /*return*/, chrome.alarms.clear(name)];
            });
        });
    };
    BrowserApi.prototype.removeAllAlarms = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (!this.isInit)
                    return [2 /*return*/, void 0];
                return [2 /*return*/, chrome.alarms.clearAll()];
            });
        });
    };
    BrowserApi.prototype.createNotification = function (options, id, callback) {
        if (!this.isInit)
            return void 0;
        if (id) {
            chrome.notifications.create(id, options, callback);
        }
        else {
            chrome.notifications.create(options, callback);
        }
    };
    BrowserApi.prototype.onNotificationClick = function (callback) {
        if (!this.isInit)
            return void 0;
        chrome.notifications.onClicked.addListener(callback);
    };
    return BrowserApi;
}());
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (new BrowserApi());


/***/ }),

/***/ "./src/js/proxy-storage.extension.ts":
/*!*******************************************!*\
  !*** ./src/js/proxy-storage.extension.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "StorageType": () => (/* binding */ StorageType),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   "proxyStorage": () => (/* binding */ proxyStorage)
/* harmony export */ });
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var StorageType;
(function (StorageType) {
    StorageType["local"] = "local";
    StorageType["sync"] = "sync";
    StorageType["session"] = "session";
    StorageType["default"] = "";
})(StorageType || (StorageType = {}));
var proxyStorage = {
    getItem: function (key, storage) {
        if (storage === void 0) { storage = StorageType.sync; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chrome.storage[storage].get(key)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result[key]];
                }
            });
        });
    },
    setItem: function (key, value, storage) {
        if (storage === void 0) { storage = StorageType.sync; }
        return __awaiter(this, void 0, void 0, function () {
            var newItem;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        newItem = {};
                        newItem[key] = value;
                        return [4 /*yield*/, chrome.storage[storage].set(newItem)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    getAllItems: function (keys, storage) {
        if (storage === void 0) { storage = StorageType.sync; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chrome.storage[storage].get((keys && keys.length > 0) ? keys : undefined)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/, result];
                }
            });
        });
    },
    setAllItems: function (items, storage) {
        if (storage === void 0) { storage = StorageType.sync; }
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chrome.storage[storage].set(items)];
                    case 1:
                        result = _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    canUse: function () {
        if (chrome.storage.sync)
            return true;
        return false;
    },
    removeItem: function (key, storage) {
        if (storage === void 0) { storage = StorageType.sync; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, chrome.storage[storage].remove(key)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    removeAllItems: function (keys, storage) {
        if (storage === void 0) { storage = StorageType.sync; }
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(!keys || keys.length == 0)) return [3 /*break*/, 2];
                        return [4 /*yield*/, chrome.storage[storage].clear()];
                    case 1:
                        _a.sent();
                        return [3 /*break*/, 4];
                    case 2: return [4 /*yield*/, chrome.storage[storage].remove(keys)];
                    case 3:
                        _a.sent();
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (proxyStorage);


/***/ }),

/***/ "./src/js/config.js":
/*!**************************!*\
  !*** ./src/js/config.js ***!
  \**************************/
/***/ ((module) => {

const tmpAddr = 'http://localhost:8002'

if (false) {} else if (true) {
  module.exports = {
    serviceUrl: window.location.origin,
    displayServiceUrl: 'shlk.cc',
    target: 'webapp',
    mode: 'development',
    extensionLink: 'https://chrome.google.com/webstore/detail/nhmacemlmokklfnncnkncnboajhifepd?hl=en'
  } 
} else {}

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 	
/******/ 		        // webpack-livereload-plugin
/******/ 		        (function() {
/******/ 		          if (typeof window === "undefined") { return };
/******/ 		          var id = "webpack-livereload-plugin-script-afc2093ad01e8fe0";
/******/ 		          if (document.getElementById(id)) { return; }
/******/ 		          var el = document.createElement("script");
/******/ 		          el.id = id;
/******/ 		          el.async = true;
/******/ 		          el.src = "http://0.0.0.0:35729/livereload.js";
/******/ 		          document.getElementsByTagName("head")[0].appendChild(el);
/******/ 		          console.log("[Live Reload] enabled");
/******/ 		        }());
/******/ 		        // Check if module is in cache
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
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
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
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
/*!******************************!*\
  !*** ./src/js/background.ts ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./config */ "./src/js/config.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _browser_api__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./browser.api */ "./src/js/browser.api.ts");
/* harmony import */ var _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./proxy-storage.extension */ "./src/js/proxy-storage.extension.ts");
var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};



var ALARM_NAME = 'checkInTact';
var ALARM_PERIOD = (_config__WEBPACK_IMPORTED_MODULE_0___default().target) == 'production' ? 10 : 1;
var AppNetwork = {
    updateRestoredTabs: function (ids) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, responseBody;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch((_config__WEBPACK_IMPORTED_MODULE_0___default().serviceUrl) + '/api', {
                            method: 'POST',
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({
                                query: "\n        mutation (\n          $ids: [String]\n        )\n        {\n          deleteShortlinkSnoozeTimer(\n            ids: $ids\n          ) {\n            _id\n          }\n        }\n        ",
                                variables: {
                                    ids: ids
                                }
                            })
                        })];
                    case 1:
                        response = _b.sent();
                        return [4 /*yield*/, response.json()];
                    case 2:
                        responseBody = _b.sent();
                        return [2 /*return*/, ((_a = responseBody.data) === null || _a === void 0 ? void 0 : _a.deleteShortlinkSnoozeTimer) || ''];
                }
            });
        });
    },
    getShortlinks: function (skip) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var response, responseBody;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, fetch((_config__WEBPACK_IMPORTED_MODULE_0___default().serviceUrl) + '/api', {
                            method: 'POST',
                            body: JSON.stringify({
                                query: "\n        {\n          getUserShortlinks(args: {isSnooze: true, sort: \"snooze.awake\", order: \"1\", limit: 30, skip:".concat(skip, "}) {\n            _id location snooze { awake } siteTitle\n          } \n        }\n        ")
                            }),
                            headers: {
                                "Content-Type": "application/json"
                            }
                        })];
                    case 1:
                        response = _b.sent();
                        if (response.status != 200)
                            return [2 /*return*/, []];
                        return [4 /*yield*/, response.json()];
                    case 2:
                        responseBody = _b.sent();
                        return [2 /*return*/, ((_a = responseBody.data) === null || _a === void 0 ? void 0 : _a.getUserShortlinks) || []];
                }
            });
        });
    }
};
var BackgroundApp = {
    appState: function (newState) {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!newState) return [3 /*break*/, 2];
                        return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].setItem('appState', newState, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__.StorageType.local)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].getItem('appState', _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__.StorageType.local)];
                    case 3:
                        result = _a.sent();
                        console.log('App state ', result);
                        return [2 /*return*/, result];
                }
            });
        });
    },
    getSyncOnlineThreshold: function () {
        var threshold = new Date();
        threshold.setHours(threshold.getHours() - 1);
        return threshold.valueOf();
    },
    getAwakeSyncThreshold: function () {
        var threshold = new Date();
        threshold.setDate(threshold.getDate() + 7);
        return threshold.valueOf();
    },
    getRestoreTimerThreshold: function () {
        var threshold = new Date();
        threshold.setMinutes(threshold.getMinutes() + 5);
        return threshold.valueOf();
    },
    setCheckInAlarm: function () {
        _browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].setAlarm(ALARM_NAME, {
            periodInMinutes: ALARM_PERIOD
        });
    },
    install: function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, BackgroundApp.appState({
                            isSyncInProgress: false,
                            lastSynced: BackgroundApp.getSyncOnlineThreshold()
                        })];
                    case 1:
                        _a.sent();
                        BackgroundApp.setCheckInAlarm();
                        return [2 /*return*/];
                }
            });
        });
    },
    startup: function () {
        return __awaiter(this, void 0, void 0, function () {
            var alarms;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].getAlarms()];
                    case 1:
                        alarms = _a.sent();
                        if (!alarms[ALARM_NAME])
                            BackgroundApp.setCheckInAlarm();
                        return [2 /*return*/];
                }
            });
        });
    },
    loadSnoozedTabs: function () {
        return __awaiter(this, void 0, void 0, function () {
            var snoozedLinks, next, threshold, chunk, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        snoozedLinks = [];
                        next = true;
                        threshold = BackgroundApp.getAwakeSyncThreshold();
                        _a.label = 1;
                    case 1:
                        if (!next) return [3 /*break*/, 3];
                        return [4 /*yield*/, AppNetwork.getShortlinks(snoozedLinks.length)];
                    case 2:
                        chunk = _a.sent();
                        snoozedLinks = Array().concat(snoozedLinks, chunk);
                        if (chunk.length < 30 || chunk[chunk.length - 1].snooze.awake >= threshold)
                            next = false;
                        return [3 /*break*/, 1];
                    case 3:
                        result = {};
                        snoozedLinks.forEach(function (shortlink) {
                            result[shortlink._id] = shortlink;
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    },
    getExistingAlarms: function () {
        return __awaiter(this, void 0, void 0, function () {
            var alarmsArray, result, alarmIDs, shortlinkMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].getAlarms()];
                    case 1:
                        alarmsArray = _a.sent();
                        result = {};
                        alarmIDs = [];
                        alarmsArray.forEach(function (alarm) { alarm.name != 'syncSnoozedTabs' && alarmIDs.push(alarm.name); });
                        return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].getAllItems(alarmIDs)];
                    case 2:
                        shortlinkMetadata = (_a.sent());
                        alarmIDs.forEach(function (id) {
                            result[id] = shortlinkMetadata[id];
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    },
    updateAlarms: function () {
        return __awaiter(this, void 0, void 0, function () {
            var currentState, synced;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, BackgroundApp.appState()];
                    case 1:
                        currentState = _a.sent();
                        console.log(currentState);
                        return [4 /*yield*/, BackgroundApp.appState({
                                isSyncInProgress: true,
                                lastSynced: currentState.lastSynced
                            })];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, BackgroundApp.loadSnoozedTabs()];
                    case 3:
                        synced = _a.sent();
                        return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].removeAllItems(null)];
                    case 4:
                        _a.sent();
                        BackgroundApp.createAlarms(synced);
                        return [4 /*yield*/, BackgroundApp.appState({
                                isSyncInProgress: false,
                                lastSynced: (new Date()).valueOf()
                            })];
                    case 5:
                        _a.sent();
                        return [4 /*yield*/, BackgroundApp.restoreSnoozedTabs()];
                    case 6:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    },
    getAllAlarms: function () {
        return __awaiter(this, void 0, void 0, function () {
            var allSyncStorage, keys, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].getAllItems(null)];
                    case 1:
                        allSyncStorage = _a.sent();
                        keys = Object.getOwnPropertyNames(allSyncStorage);
                        result = {};
                        console.log(allSyncStorage);
                        keys.forEach(function (key) {
                            try {
                                if (/^link_/.test(key)) {
                                    var id = (key.split('_'))[1];
                                    result[id] = allSyncStorage[key];
                                }
                            }
                            catch (_a) { }
                        });
                        return [2 /*return*/, result];
                }
            });
        });
    },
    createAlarms: function (items) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixedItems, keys;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefixedItems = {};
                        keys = Object.getOwnPropertyNames(items);
                        keys.forEach(function (key) {
                            prefixedItems["link_".concat(key)] = items[key];
                        });
                        return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].setAllItems(prefixedItems)];
                    case 1:
                        _a.sent();
                        console.log('Created ', prefixedItems);
                        return [2 /*return*/];
                }
            });
        });
    },
    removeAlarms: function (ids) {
        return __awaiter(this, void 0, void 0, function () {
            var prefixedIds;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        prefixedIds = [];
                        ids.forEach(function (id) {
                            prefixedIds.push("link_".concat(id));
                        });
                        AppNetwork.updateRestoredTabs(ids);
                        return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].removeAllItems(prefixedIds)];
                    case 1:
                        _a.sent();
                        console.log('Removed ', prefixedIds);
                        return [2 /*return*/];
                }
            });
        });
    },
    openTab: function (url) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                _browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].openExternal(url);
                return [2 /*return*/];
            });
        });
    },
    handleNotificationClick: function (url) {
        return __awaiter(this, void 0, void 0, function () {
            var tabs;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, _browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].findTab(url)];
                    case 1:
                        tabs = _a.sent();
                        if (!tabs[0])
                            return [2 /*return*/];
                        chrome.tabs.update(tabs[0].id, { active: true });
                        return [2 /*return*/];
                }
            });
        });
    },
    handleAlarm: function (alarm) {
        return __awaiter(this, void 0, void 0, function () {
            var appState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(alarm.name == ALARM_NAME)) return [3 /*break*/, 2];
                        return [4 /*yield*/, _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__["default"].getItem('appState', _proxy_storage_extension__WEBPACK_IMPORTED_MODULE_1__.StorageType.local)];
                    case 1:
                        appState = _a.sent();
                        if (appState.isSyncInProgess)
                            return [2 /*return*/];
                        // check if need sync: last synced is more than 1 hour ago
                        if (appState.lastSynced < BackgroundApp.getSyncOnlineThreshold()) {
                            BackgroundApp.updateAlarms();
                        }
                        else {
                            BackgroundApp.restoreSnoozedTabs();
                        }
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    },
    restoreSnoozedTabs: function () {
        return __awaiter(this, void 0, void 0, function () {
            var existingAlarms, existingAlarmKeys, restoredTabs, awakeTime, restoredTabIDs, title, message;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, BackgroundApp.getAllAlarms()];
                    case 1:
                        existingAlarms = _a.sent();
                        existingAlarmKeys = Object.getOwnPropertyNames(existingAlarms);
                        console.log(existingAlarms);
                        restoredTabs = {};
                        awakeTime = BackgroundApp.getRestoreTimerThreshold();
                        existingAlarmKeys.forEach(function (id) {
                            if (existingAlarms[id] && existingAlarms[id].snooze.awake < awakeTime) {
                                restoredTabs[id] = existingAlarms[id];
                            }
                        });
                        console.log(restoredTabs);
                        restoredTabIDs = Object.getOwnPropertyNames(restoredTabs);
                        if (restoredTabIDs.length > 0) {
                            BackgroundApp.removeAlarms(restoredTabIDs);
                            restoredTabIDs.forEach(function (id) {
                                BackgroundApp.openTab(restoredTabs[id].location);
                            });
                            title = "Shlk.cc woke up tabs (".concat(restoredTabIDs.length, ")");
                            message = "".concat(restoredTabs[restoredTabIDs[0]].siteTitle || restoredTabs[restoredTabIDs[0]].location);
                            message += restoredTabIDs.length > 1 ? "and ".concat(restoredTabIDs.length - 1, " more") : "";
                            _browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].createNotification({
                                type: 'basic',
                                title: title,
                                message: message,
                                iconUrl: '/assets/favicon/android-chrome-192x192.png',
                                priority: 1
                            }, restoredTabIDs[0], function (result) {
                                console.log('Notification: ' + result);
                            });
                        }
                        return [2 /*return*/];
                }
            });
        });
    },
    handleMessage: function (message, sender, sendResponse) {
        //if(message.command == 'sync') BackgroundApp.updateAlarms()
        return true;
    }
};
_browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].onInstalled(BackgroundApp.install);
_browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].onStartup(BackgroundApp.startup);
_browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].onAlarm(BackgroundApp.handleAlarm);
_browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].onNotificationClick(BackgroundApp.handleNotificationClick);
_browser_api__WEBPACK_IMPORTED_MODULE_2__["default"].onMessage(BackgroundApp.handleMessage);

})();

/******/ })()
;
//# sourceMappingURL=background.js.map