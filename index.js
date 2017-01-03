var index =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _vkConfig = __webpack_require__(1);

	var _vkConfig2 = _interopRequireDefault(_vkConfig);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/**
	 * Function change Element in arrays
	 * @param oneList
	 * @param twolist
	 * @param id
	 */
	var changeElem = function changeElem(oneList, twolist, id, boolean) {
	    oneList.forEach(function (item, i) {
	        if (item.uid == id) {

	            if (boolean === true) {
	                twolist.unshift(item);
	            } else {
	                twolist.push(item);
	            }
	            oneList.splice(i, 1);
	        }
	        return twolist;
	    });
	};

	new Promise(function (resolve) {
	    if (document.readyState === 'complete') {
	        resolve();
	    } else {
	        window.onload = resolve;
	    }
	}).then(function () {
	    return new Promise(function (resolve, reject) {
	        VK.init({
	            apiId: _vkConfig2.default.configuration.apiId
	        });

	        VK.Auth.login(function (response) {
	            if (response.session) {
	                resolve(response);
	            } else {
	                reject(new Error('Не удалось авторизоваться'));
	            }
	        }, 8);
	    });
	}).then(function () {
	    return new Promise(function (resolve, reject) {
	        VK.api('friends.get', { 'fields': 'nickname,photo_100' }, function (response) {

	            if (response.error) {
	                reject(new Error(response.error.error_msg));
	            } else {
	                (function () {
	                    var in_change = function in_change(type, node) {

	                        if (type === 'list-friend') {
	                            changeElem(data_cache_just, data_cache_best, node);
	                        } else {
	                            changeElem(data_cache_best, data_cache_just, node, true);
	                        }
	                    };

	                    var data_cache_just = response.response;
	                    var data_cache_best = new Array();

	                    if (localStorage.getItem('just') !== null && localStorage.getItem('best') !== null) {
	                        data_cache_just = JSON.parse(localStorage.getItem('just'));
	                        data_cache_best = JSON.parse(localStorage.getItem('best'));
	                    }

	                    var best_friend = document.getElementById('best-friend');
	                    var just_friend = document.getElementById('just-friend');
	                    var search = document.querySelector('.search');

	                    var button_save = document.querySelector('save');
	                    var justriend = document.getElementById('just-friend');
	                    var source = document.getElementById('playerItemTemplate').innerHTML;
	                    var templateFn = Handlebars.compile(source);
	                    var template = templateFn({ list: data_cache_just });
	                    justriend.innerHTML = template;

	                    var newtemplate = templateFn({ list: data_cache_best });
	                    best_friend.innerHTML = newtemplate;

	                    var friends_block = document.querySelector('.friends-block');

	                    friends_block.addEventListener('click', function (e) {
	                        if (e.target.className === 'glyphicon') {

	                            if (e.target.parentNode.parentNode.parentNode.parentNode.id == 'best-friend') {
	                                changeElem(data_cache_best, data_cache_just, e.target.parentNode.parentNode.parentNode.getAttribute('data-id'));
	                                just_friend.insertBefore(e.target.parentNode.parentNode.parentNode, just_friend.firstChild);
	                            } else {
	                                changeElem(data_cache_just, data_cache_best, e.target.parentNode.parentNode.parentNode.getAttribute('data-id'));
	                                best_friend.appendChild(e.target.parentNode.parentNode.parentNode);
	                            }
	                        }
	                    });
	                    search.addEventListener('input', function (e) {
	                        var newList = new Array();
	                        var test = just_friend.querySelectorAll('.friends-item');

	                        if (e.target.className === 'search-input-just') {
	                            var search_just = data_cache_just;

	                            for (var name in search_just) {

	                                if ((search_just[name].first_name + ' ' + search_just[name].last_name).indexOf(e.target.value, 0) != -1) {
	                                    newList.push(search_just[name]);
	                                }
	                            }
	                            var _template = templateFn({ list: newList });
	                            justriend.innerHTML = _template;
	                        } else {
	                            var search_best = data_cache_best;
	                            for (var _name in search_best) {
	                                if ((search_best[_name].first_name + ' ' + search_best[_name].last_name).indexOf(e.target.value, 0) != -1) {
	                                    newList.push(search_best[_name]);
	                                }
	                            }
	                            var _template2 = templateFn({ list: newList });
	                            best_friend.innerHTML = _template2;
	                        }
	                    });

	                    friends_block.addEventListener('dragstart', function (e) {
	                        e.target.style.opacity = '0.4';

	                        e.dataTransfer.setData("Text", e.clientX);
	                        e.dataTransfer.setData("node", e.target.getAttribute('data-id'));

	                        e.target.parentNode.parentNode.id === 'list-friend' ? e.dataTransfer.setData("type", 'list-friend') : e.dataTransfer.setData("type", 'no-list-friend');
	                    });
	                    var AllWidth = document.body.offsetWidth; //1436
	                    var widthBlock = document.querySelector('.friends-block').offsetWidth; //620

	                    var side = (AllWidth - widthBlock) / 2; //406
	                    var rightmost_point = AllWidth - side; //1030
	                    var in_left_point = rightmost_point - widthBlock / 2;
	                    var start_point = (AllWidth - widthBlock) / 2; //406

	                    friends_block.addEventListener('drop', function (e) {
	                        e.preventDefault();
	                        if (e.dataTransfer.getData('Text') > start_point && e.dataTransfer.getData('Text') < in_left_point) {

	                            if (in_left_point < e.clientX && rightmost_point > e.clientX) {
	                                in_change(e.dataTransfer.getData("type"), e.dataTransfer.getData("node"));
	                                var _template3 = templateFn({ list: data_cache_best });
	                                best_friend.innerHTML = _template3;
	                                var neewtemplate = templateFn({ list: data_cache_just });
	                                justriend.innerHTML = neewtemplate;
	                            }
	                        } else {
	                            if (in_left_point > e.clientX && start_point < e.clientX) {
	                                in_change(e.dataTransfer.getData("type"), e.dataTransfer.getData("node"));
	                                var _template4 = templateFn({ list: data_cache_best });
	                                best_friend.innerHTML = _template4;
	                                var _neewtemplate = templateFn({ list: data_cache_just });
	                                justriend.innerHTML = _neewtemplate;
	                            }
	                        }

	                        if (e.stopPropagation) {
	                            e.stopPropagation();
	                        }
	                    });

	                    friends_block.addEventListener('dragend', function (e) {
	                        e.target.style.opacity = '1.0';
	                    });

	                    friends_block.addEventListener('dragover', function (e) {
	                        if (e.preventDefault) {
	                            e.preventDefault();
	                        }
	                        e.dataTransfer.dropEffect = 'move';
	                        return false;
	                    });

	                    save.addEventListener('click', function () {
	                        localStorage.setItem('just', JSON.stringify(data_cache_just));
	                        localStorage.setItem('best', JSON.stringify(data_cache_best));
	                    });
	                })();
	            }
	        });
	    });
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var configuration = {
	    apiId: 5267932
	};

	exports.default = {
	    configuration: configuration
		};

/***/ }
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAgMmI4MGU2NDJjYmZkOGViYzBkMmEiLCJ3ZWJwYWNrOi8vL2RldmVsb3Blci9idWlsZC5qcyIsIndlYnBhY2s6Ly8vdmtDb25maWcuanMiXSwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pXG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG5cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGV4cG9ydHM6IHt9LFxuIFx0XHRcdGlkOiBtb2R1bGVJZCxcbiBcdFx0XHRsb2FkZWQ6IGZhbHNlXG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmxvYWRlZCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oMCk7XG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gd2VicGFjay9ib290c3RyYXAgMmI4MGU2NDJjYmZkOGViYzBkMmEiLCIndXNlIHN0cmljdCc7XG5pbXBvcnQgY29uZiBmcm9tICcuLi92a0NvbmZpZy5qcyc7XG5cbi8qKlxuICogRnVuY3Rpb24gY2hhbmdlIEVsZW1lbnQgaW4gYXJyYXlzXG4gKiBAcGFyYW0gb25lTGlzdFxuICogQHBhcmFtIHR3b2xpc3RcbiAqIEBwYXJhbSBpZFxuICovXG5sZXQgY2hhbmdlRWxlbSA9IGZ1bmN0aW9uIChvbmVMaXN0ICwgdHdvbGlzdCAsIGlkICwgYm9vbGVhbikge1xuICAgIG9uZUxpc3QuZm9yRWFjaCggKCBpdGVtLCBpICkgPT4ge1xuICAgICAgICBpZiggaXRlbS51aWQgID09IGlkICApIHtcblxuICAgICAgICAgICAgaWYgKGJvb2xlYW4gPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICB0d29saXN0LnVuc2hpZnQoaXRlbSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHR3b2xpc3QucHVzaChpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG9uZUxpc3Quc3BsaWNlKGksMSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHR3b2xpc3Q7XG4gICAgfSk7XG59O1xuXG5uZXcgUHJvbWlzZSggcmVzb2x2ZSA9PiAge1xuICAgIGlmIChkb2N1bWVudC5yZWFkeVN0YXRlID09PSAnY29tcGxldGUnKSB7XG4gICAgICAgIHJlc29sdmUoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cub25sb2FkID0gcmVzb2x2ZTtcbiAgICB9XG59KS50aGVuKCAoKSA9PiB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIFZLLmluaXQoe1xuICAgICAgICAgICAgYXBpSWQ6IGNvbmYuY29uZmlndXJhdGlvbi5hcGlJZFxuICAgICAgICB9KTtcblxuICAgICAgICBWSy5BdXRoLmxvZ2luKCByZXNwb25zZSA9PiAge1xuICAgICAgICAgICAgaWYgKHJlc3BvbnNlLnNlc3Npb24pIHtcbiAgICAgICAgICAgICAgICByZXNvbHZlKHJlc3BvbnNlKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcmVqZWN0KG5ldyBFcnJvcign0J3QtSDRg9C00LDQu9C+0YHRjCDQsNCy0YLQvtGA0LjQt9C+0LLQsNGC0YzRgdGPJykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9LCA4KTtcbiAgICB9KTtcbn0pLnRoZW4oICgpID0+ICB7XG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKCAocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG4gICAgICAgIFZLLmFwaSgnZnJpZW5kcy5nZXQnLCB7J2ZpZWxkcycgOiAnbmlja25hbWUscGhvdG9fMTAwJ30sIHJlc3BvbnNlID0+ICB7XG5cbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xuICAgICAgICAgICAgICAgIHJlamVjdCggbmV3IEVycm9yKHJlc3BvbnNlLmVycm9yLmVycm9yX21zZykgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBsZXQgZGF0YV9jYWNoZV9qdXN0ICAgICAgPSByZXNwb25zZS5yZXNwb25zZTtcbiAgICAgICAgICAgICAgICBsZXQgZGF0YV9jYWNoZV9iZXN0ICAgICAgPSBuZXcgQXJyYXk7XG5cbiAgICAgICAgICAgICAgICBpZiAobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2p1c3QnKSAhPT0gbnVsbCAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYmVzdCcpICE9PSBudWxsICkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhX2NhY2hlX2p1c3QgICAgICA9IEpTT04ucGFyc2UobG9jYWxTdG9yYWdlLmdldEl0ZW0oJ2p1c3QnKSk7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFfY2FjaGVfYmVzdCAgICAgID0gSlNPTi5wYXJzZShsb2NhbFN0b3JhZ2UuZ2V0SXRlbSgnYmVzdCcpKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBsZXQgYmVzdF9mcmllbmQgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdiZXN0LWZyaWVuZCcpO1xuICAgICAgICAgICAgICAgIGxldCBqdXN0X2ZyaWVuZCAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2p1c3QtZnJpZW5kJyk7XG4gICAgICAgICAgICAgICAgbGV0IHNlYXJjaCAgICAgICAgICAgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuc2VhcmNoJyk7XG5cbiAgICAgICAgICAgICAgICBsZXQgYnV0dG9uX3NhdmUgICAgICA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ3NhdmUnKTtcbiAgICAgICAgICAgICAgICBsZXQganVzdHJpZW5kICAgICAgICA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdqdXN0LWZyaWVuZCcpO1xuICAgICAgICAgICAgICAgIGxldCBzb3VyY2UgICAgICAgICAgID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ3BsYXllckl0ZW1UZW1wbGF0ZScpLmlubmVySFRNTDtcbiAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGVGbiAgICAgICA9IEhhbmRsZWJhcnMuY29tcGlsZShzb3VyY2UpO1xuICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSAgICAgICAgID0gdGVtcGxhdGVGbih7bGlzdDogZGF0YV9jYWNoZV9qdXN0fSk7XG4gICAgICAgICAgICAgICAganVzdHJpZW5kLmlubmVySFRNTCAgPSB0ZW1wbGF0ZTtcblxuICAgICAgICAgICAgICAgIGxldCBuZXd0ZW1wbGF0ZSAgICAgICAgICAgPSB0ZW1wbGF0ZUZuKHtsaXN0OiBkYXRhX2NhY2hlX2Jlc3R9KTtcbiAgICAgICAgICAgICAgICBiZXN0X2ZyaWVuZC5pbm5lckhUTUwgICAgID0gbmV3dGVtcGxhdGU7XG5cblxuICAgICAgICAgICAgICAgIGxldCBmcmllbmRzX2Jsb2NrICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZyaWVuZHMtYmxvY2snKTtcblxuICAgICAgICAgICAgICAgIGZyaWVuZHNfYmxvY2suYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCBlLnRhcmdldC5jbGFzc05hbWUgPT09ICdnbHlwaGljb24nICkge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAoIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuaWQgPT0gJ2Jlc3QtZnJpZW5kJyApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGFuZ2VFbGVtKGRhdGFfY2FjaGVfYmVzdCxkYXRhX2NhY2hlX2p1c3QsZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RfZnJpZW5kLmluc2VydEJlZm9yZShlLnRhcmdldC5wYXJlbnROb2RlLnBhcmVudE5vZGUucGFyZW50Tm9kZSxqdXN0X2ZyaWVuZC5maXJzdENoaWxkKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlRWxlbShkYXRhX2NhY2hlX2p1c3QsZGF0YV9jYWNoZV9iZXN0LGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5wYXJlbnROb2RlLmdldEF0dHJpYnV0ZSgnZGF0YS1pZCcpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZXN0X2ZyaWVuZC5hcHBlbmRDaGlsZCggZS50YXJnZXQucGFyZW50Tm9kZS5wYXJlbnROb2RlLnBhcmVudE5vZGUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgc2VhcmNoLmFkZEV2ZW50TGlzdGVuZXIoJ2lucHV0JywgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdMaXN0ICAgICA9IG5ldyBBcnJheTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IHRlc3QgICAgICAgID0ganVzdF9mcmllbmQucXVlcnlTZWxlY3RvckFsbCgnLmZyaWVuZHMtaXRlbScpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICggZS50YXJnZXQuY2xhc3NOYW1lID09PSAnc2VhcmNoLWlucHV0LWp1c3QnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgc2VhcmNoX2p1c3QgPSBkYXRhX2NhY2hlX2p1c3Q7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvciAobGV0IG5hbWUgaW4gc2VhcmNoX2p1c3QpIHtcblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChgJHtzZWFyY2hfanVzdFtuYW1lXS5maXJzdF9uYW1lfSAke3NlYXJjaF9qdXN0W25hbWVdLmxhc3RfbmFtZX1gLmluZGV4T2YoZS50YXJnZXQudmFsdWUsIDApICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xpc3QucHVzaCggc2VhcmNoX2p1c3RbbmFtZV0gKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgdGVtcGxhdGUgICAgICAgID0gdGVtcGxhdGVGbih7bGlzdDogbmV3TGlzdH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAganVzdHJpZW5kLmlubmVySFRNTCA9IHRlbXBsYXRlO1xuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHNlYXJjaF9iZXN0ID0gZGF0YV9jYWNoZV9iZXN0O1xuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgbmFtZSBpbiBzZWFyY2hfYmVzdCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChgJHtzZWFyY2hfYmVzdFtuYW1lXS5maXJzdF9uYW1lfSAke3NlYXJjaF9iZXN0W25hbWVdLmxhc3RfbmFtZX1gLmluZGV4T2YoZS50YXJnZXQudmFsdWUsIDApICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0xpc3QucHVzaChzZWFyY2hfYmVzdFtuYW1lXSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlICAgICAgICAgID0gdGVtcGxhdGVGbih7bGlzdDogbmV3TGlzdH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgYmVzdF9mcmllbmQuaW5uZXJIVE1MID0gdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZyaWVuZHNfYmxvY2suYWRkRXZlbnRMaXN0ZW5lciggJ2RyYWdzdGFydCcgLCBlID0+IHtcbiAgICAgICAgICAgICAgICAgICAgZS50YXJnZXQuc3R5bGUub3BhY2l0eSA9ICcwLjQnO1xuXG4gICAgICAgICAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJUZXh0XCIsZS5jbGllbnRYICk7XG4gICAgICAgICAgICAgICAgICAgIGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJub2RlXCIsZS50YXJnZXQuZ2V0QXR0cmlidXRlKCdkYXRhLWlkJykpO1xuXG4gICAgICAgICAgICAgICAgICAgIGUudGFyZ2V0LnBhcmVudE5vZGUucGFyZW50Tm9kZS5pZCA9PT0gJ2xpc3QtZnJpZW5kJyA/IGUuZGF0YVRyYW5zZmVyLnNldERhdGEoXCJ0eXBlXCIsJ2xpc3QtZnJpZW5kJykgOiAgZS5kYXRhVHJhbnNmZXIuc2V0RGF0YShcInR5cGVcIiwnbm8tbGlzdC1mcmllbmQnKTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICBsZXQgQWxsV2lkdGggICAgICAgICA9IGRvY3VtZW50LmJvZHkub2Zmc2V0V2lkdGg7IC8vMTQzNlxuICAgICAgICAgICAgICAgIGxldCB3aWR0aEJsb2NrICAgICAgID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmZyaWVuZHMtYmxvY2snKS5vZmZzZXRXaWR0aDsgLy82MjBcblxuICAgICAgICAgICAgICAgIGxldCBzaWRlICAgICAgICAgICAgID0gKEFsbFdpZHRoLXdpZHRoQmxvY2spLzI7IC8vNDA2XG4gICAgICAgICAgICAgICAgbGV0IHJpZ2h0bW9zdF9wb2ludCAgPSBBbGxXaWR0aC1zaWRlOyAvLzEwMzBcbiAgICAgICAgICAgICAgICBsZXQgaW5fbGVmdF9wb2ludCAgICA9IHJpZ2h0bW9zdF9wb2ludC13aWR0aEJsb2NrLzI7XG4gICAgICAgICAgICAgICAgbGV0IHN0YXJ0X3BvaW50ICAgICAgPSAoQWxsV2lkdGgtd2lkdGhCbG9jaykvMjsgLy80MDZcblxuICAgICAgICAgICAgICAgIGZyaWVuZHNfYmxvY2suYWRkRXZlbnRMaXN0ZW5lcignZHJvcCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIGlmKCBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCdUZXh0JykgPiBzdGFydF9wb2ludCAmJiBlLmRhdGFUcmFuc2Zlci5nZXREYXRhKCdUZXh0JykgIDwgaW5fbGVmdF9wb2ludClcbiAgICAgICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggaW5fbGVmdF9wb2ludCA8IGUuY2xpZW50WCAmJiAgcmlnaHRtb3N0X3BvaW50ID4gZS5jbGllbnRYICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGluX2NoYW5nZShlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwidHlwZVwiKSxlLmRhdGFUcmFuc2Zlci5nZXREYXRhKFwibm9kZVwiKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IHRlbXBsYXRlICAgICAgICAgICAgICA9IHRlbXBsYXRlRm4oe2xpc3Q6IGRhdGFfY2FjaGVfYmVzdH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJlc3RfZnJpZW5kLmlubmVySFRNTCAgICAgPSB0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmVld3RlbXBsYXRlICAgICAgICAgID0gdGVtcGxhdGVGbih7bGlzdDogZGF0YV9jYWNoZV9qdXN0fSk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAganVzdHJpZW5kLmlubmVySFRNTCAgICAgICA9IG5lZXd0ZW1wbGF0ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBpbl9sZWZ0X3BvaW50ID4gZS5jbGllbnRYICYmICBzdGFydF9wb2ludCA8IGUuY2xpZW50WCApIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbl9jaGFuZ2UoZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcInR5cGVcIiksZS5kYXRhVHJhbnNmZXIuZ2V0RGF0YShcIm5vZGVcIikpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCB0ZW1wbGF0ZSAgICAgICAgICAgICAgPSB0ZW1wbGF0ZUZuKHtsaXN0OiBkYXRhX2NhY2hlX2Jlc3R9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBiZXN0X2ZyaWVuZC5pbm5lckhUTUwgICAgID0gdGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IG5lZXd0ZW1wbGF0ZSAgICAgICAgICA9IHRlbXBsYXRlRm4oe2xpc3Q6IGRhdGFfY2FjaGVfanVzdH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGp1c3RyaWVuZC5pbm5lckhUTUwgICAgICAgPSBuZWV3dGVtcGxhdGU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiAoZS5zdG9wUHJvcGFnYXRpb24pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZyaWVuZHNfYmxvY2suYWRkRXZlbnRMaXN0ZW5lcignZHJhZ2VuZCcsIGUgPT4ge1xuICAgICAgICAgICAgICAgICAgICBlLnRhcmdldC5zdHlsZS5vcGFjaXR5ID0gJzEuMCc7XG4gICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICBmcmllbmRzX2Jsb2NrLmFkZEV2ZW50TGlzdGVuZXIoJ2RyYWdvdmVyJywgZSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLnByZXZlbnREZWZhdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZS5kYXRhVHJhbnNmZXIuZHJvcEVmZmVjdCA9ICdtb3ZlJztcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAgICAgc2F2ZS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsICgpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2p1c3QnLCBKU09OLnN0cmluZ2lmeShkYXRhX2NhY2hlX2p1c3QpKTtcbiAgICAgICAgICAgICAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oJ2Jlc3QnLCBKU09OLnN0cmluZ2lmeShkYXRhX2NhY2hlX2Jlc3QpKTtcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgIGZ1bmN0aW9uIGluX2NoYW5nZSh0eXBlICwgbm9kZSkge1xuXG4gICAgICAgICAgICAgICAgICAgIGlmICh0eXBlICA9PT0gJ2xpc3QtZnJpZW5kJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hhbmdlRWxlbShkYXRhX2NhY2hlX2p1c3QgLCBkYXRhX2NhY2hlX2Jlc3QgLCBub2RlKTtcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNoYW5nZUVsZW0oZGF0YV9jYWNoZV9iZXN0ICwgZGF0YV9jYWNoZV9qdXN0ICwgbm9kZSAsIHRydWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9KVxufSk7XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIGRldmVsb3Blci9idWlsZC5qcyIsIlxubGV0IGNvbmZpZ3VyYXRpb24gPSB7XG4gICAgYXBpSWQgOiA1MjY3OTMyXG59O1xuXG5leHBvcnQgZGVmYXVsdCAge1xuICAgICBjb25maWd1cmF0aW9uXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyB2a0NvbmZpZy5qcyJdLCJtYXBwaW5ncyI6Ijs7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7Ozs7QUN0Q0E7QUFDQTtBQUFBO0FBQ0E7Ozs7O0FBQ0E7Ozs7OztBQU1BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBREE7QUFDQTtBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUFBO0FBQUE7QUFDQTtBQStIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQXBJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQTVIQTtBQXNJQTtBQUNBO0FBQ0E7Ozs7Ozs7Ozs7Ozs7QUN6TEE7QUFDQTtBQURBO0FBQ0E7QUFHQTtBQUNBO0FBREE7OzsiLCJzb3VyY2VSb290IjoiIn0=