/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/

// polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
// using the polyfill specifically to avoid the call to `Object.defineProperty` for performance reasons
function fastFilter(fun/*, thisArg*/) {
	'use strict';

	if (this === void 0 || this === null) {
		throw new TypeError();
	}

	var t = Object(this);
	var len = t.length >>> 0;
	if (typeof fun !== 'function') {
		throw new TypeError();
	}

	var res = [];
	var thisArg = arguments.length >= 2 ? arguments[1] : void 0;
	for (var i = 0; i < len; i++) {
		if (i in t) {
			var val = t[i];

			// NOTE: Technically this should Object.defineProperty at
			//       the next index, as push can be affected by
			//       properties on Object.prototype and Array.prototype.
			//       But that method's new, and collisions should be
			//       rare, so use the more-compatible alternative.
			if (fun.call(thisArg, val, i, t)) {
				res.push(val);
			}
		}
	}

	return res;
}

//Tapable 的构造函数
function Tapable() { 
	//定义一个对象来存放 插件
	this._plugins = {};
}

// 导出这个模块
module.exports = Tapable;

//拷贝属性 浅拷贝 
function copyProperties(from, to) {
	for(var key in from)
		to[key] = from[key];
	return to;
}

Tapable.copyProperties = copyProperties;

//混入
Tapable.mixin = function mixinTapable(pt) {
	//把 pt 加入到 Tapable的原型上
	copyProperties(Tapable.prototype, pt);
};

// 执行 插件为 Name 的插件
// 并且处理了一下参数 把参数传递给了 name 所对应的 所有的handler
// 这个方法没有返回值  只负责执行  
Tapable.prototype.applyPlugins = function applyPlugins(name) {
	if(!this._plugins[name]) return;
	var args = Array.prototype.slice.call(arguments, 1);
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++)
		plugins[i].apply(this, args);
};


//执行 name 所对应的所有 handler 没有传递参数
//没有返回值
Tapable.prototype.applyPlugins0 = function applyPlugins0(name) {
	var plugins = this._plugins[name];
	if(!plugins) return;
	for(var i = 0; i < plugins.length; i++)
		plugins[i].call(this);
};

// 执行 name 所对应的所有handler 只传递一个参数
// 没有返回值
Tapable.prototype.applyPlugins1 = function applyPlugins1(name, param) {
	var plugins = this._plugins[name];
	if(!plugins) return;
	for(var i = 0; i < plugins.length; i++)
		plugins[i].call(this, param);
};

// 执行 name 所对应的所有 handler 传递两个参数
// 没有返回值
Tapable.prototype.applyPlugins2 = function applyPlugins2(name, param1, param2) {
	var plugins = this._plugins[name];
	if(!plugins) return;
	for(var i = 0; i < plugins.length; i++)
		plugins[i].call(this, param1, param2);
};


//以瀑布流的方式执行 name 对应的所有插件 并接受一个 init 参数 即初始化参数
Tapable.prototype.applyPluginsWaterfall = function applyPluginsWaterfall(name, init) {
	//如果 该name 名下没有插件 就返回 init 
	if(!this._plugins[name]) return init;
	//拿到参数 从 init 开始 
	var args = Array.prototype.slice.call(arguments, 1);
	//找到 该name 所对应的所有handler
	 
	var plugins = this._plugins[name];
	//把初始化的参数 赋值给 current 
	var current = init;
	//遍历 所有的 plugins
	for(var i = 0; i < plugins.length; i++) {
		// 把current 的参数 赋值给 第一个参数
		args[0] = current;
		//当做第一个plugin的 参数传递进去
		//返回结果 做为下一个 plugin 的参数 依次类推
		//这里有一个关键点 就是 从第一个 plugin 开始 都有返回值
		current = plugins[i].apply(this, args);
	}
	//返回最后一个 plugin 执行后的 结果
	return current;
};


// 以瀑布流的方式 执行插件
// 接受 init 参数 作为初始 第一个plugin 的参数
// 返回最后一个plugin 执行完的结果
Tapable.prototype.applyPluginsWaterfall0 = function applyPluginsWaterfall0(name, init) {
	var plugins = this._plugins[name];
	if(!plugins) return init;
	var current = init;
	for(var i = 0; i < plugins.length; i++)
		current = plugins[i].call(this, current);
	return current;
};


// 1.以瀑布流的方式 执行插件
// 2.接受两个参数
// 3.每个 plugin 执行返回的结果 作为下一个 plugin 的参数  param  保持不变
// 4.返回最后一个plugin 执行返回的结果
Tapable.prototype.applyPluginsWaterfall1 = function applyPluginsWaterfall1(name, init, param) {
	var plugins = this._plugins[name];
	if(!plugins) return init;
	var current = init;
	for(var i = 0; i < plugins.length; i++)
		current = plugins[i].call(this, current, param);
	return current;
};


// 1.以瀑布流的方式 执行插件
// 2.接受三个参数 包括  
// 3.每个 plugin 执行返回的结果 作为下一个 plugin 的参数  param  保持不变
// 4.返回最后一个plugin 执行返回的结果
Tapable.prototype.applyPluginsWaterfall2 = function applyPluginsWaterfall2(name, init, param1, param2) {
	var plugins = this._plugins[name];
	if(!plugins) return init;
	var current = init;
	for(var i = 0; i < plugins.length; i++)
		current = plugins[i].call(this, current, param1, param2);
	return current;
};


// 以一种安全的方式返回执行的结果
Tapable.prototype.applyPluginsBailResult = function applyPluginsBailResult(name) {
	//如果name 所对应的plugin 不存在的话 就返回
	if(!this._plugins[name]) return;
	//获取参数
	var args = Array.prototype.slice.call(arguments, 1);
	//获取该name 所有的plugin
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++) {
		// 把参数传入每一个执行的 Plugin
		// 只要任何一个 plugin 执行完 有结果返回
		// 并且结果不为 undefined  就直接返回结果
		var result = plugins[i].apply(this, args);
		if(typeof result !== "undefined") {
			return result;
		}
	}
};

// 以安全的方式 执行插件并返回结果
// 传入一个指定的参数
// 只要有插件返回结果就直接返回 不再继续执行
Tapable.prototype.applyPluginsBailResult1 = function applyPluginsBailResult1(name, param) {
	if(!this._plugins[name]) return;
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++) {
		var result = plugins[i].call(this, param);
		if(typeof result !== "undefined") {
			return result;
		}
	}
};

// 以安全的方式 执行插件并返回结果
// 传入两个指定的参数
// 只要有插件返回结果就直接返回 不再继续执行
Tapable.prototype.applyPluginsBailResult2 = function applyPluginsBailResult2(name, param1, param2) {
	if(!this._plugins[name]) return;
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++) {
		var result = plugins[i].call(this, param1, param2);
		if(typeof result !== "undefined") {
			return result;
		}
	}
};

// 以安全的方式 执行插件并返回结果
// 传入三个指定的参数
// 只要有插件返回结果就直接返回 不再继续执行
Tapable.prototype.applyPluginsBailResult3 = function applyPluginsBailResult3(name, param1, param2, param3) {
	if(!this._plugins[name]) return;
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++) {
		var result = plugins[i].call(this, param1, param2, param3);
		if(typeof result !== "undefined") {
			return result;
		}
	}
};

// 以安全的方式 执行插件并返回结果
// 传入四个指定的参数
// 只要有插件返回结果就直接返回 不再继续执行
Tapable.prototype.applyPluginsBailResult4 = function applyPluginsBailResult4(name, param1, param2, param3, param4) {
	if(!this._plugins[name]) return;
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++) {
		var result = plugins[i].call(this, param1, param2, param3, param4);
		if(typeof result !== "undefined") {
			return result;
		}
	}
};

// 以安全的方式 执行插件并返回结果
// 传入五个指定的参数
// 只要有插件返回结果就直接返回 不再继续执行
Tapable.prototype.applyPluginsBailResult5 = function applyPluginsBailResult5(name, param1, param2, param3, param4, param5) {
	if(!this._plugins[name]) return;
	var plugins = this._plugins[name];
	for(var i = 0; i < plugins.length; i++) {
		var result = plugins[i].call(this, param1, param2, param3, param4, param5);
		if(typeof result !== "undefined") {
			return result;
		}
	}
};


// 异步串行执行插件
// 接受的参数为 name
// 没有返回值
Tapable.prototype.applyPluginsAsyncSeries = Tapable.prototype.applyPluginsAsync = function applyPluginsAsyncSeries(name) {
	//获取到所有的参数
	var args = Array.prototype.slice.call(arguments, 1);
	//获取到参数列表中最后一个参数
	var callback = args.pop();
	//获取到 该name 所有的 plugins
	var plugins = this._plugins[name];
	// 如果没有 plugins 则返回 callback 执行后的结果
	if(!plugins || plugins.length === 0) return callback();

	var i = 0;
	var _this = this;

	// 参数列表 push 
	// 把 callback 上的属性 拷贝到 next 函数中
	// 疑问 next 函数 其实 此刻 只是定义 要执行的逻辑 
	// 真正的执行是在最后一句 
	args.push(copyProperties(callback, function next(err) {
		
		if(err) return callback(err);
		i++;
		//如果 i 大于 plugins 的长度 
		if(i >= plugins.length) {
			//返回 callback 执行后的结果
			return callback();
		}
		// 从第一个插件 
		// 参数是目前所有的参数 
		plugins[i].apply(_this, args);
	}));
      
     
      
	//第一个插件执行
	//参数为所有的参数 
	plugins[0].apply(this, args);
};


//异步串行执行插件
//包括两个参数 param callback
//
Tapable.prototype.applyPluginsAsyncSeries1 = function applyPluginsAsyncSeries1(name, param, callback) {
	var plugins = this._plugins[name];
	//如果没有plugin 则直接返回 callback()
	if(!plugins || plugins.length === 0) return callback();
	var i = 0;
	var _this = this;
	// 把callback 的属性 拷贝到 next 函数上 
	var innerCallback = copyProperties(callback, function next(err) {
		//如果传入 err 则
		if(err) return callback(err);
		i++;
		if(i >= plugins.length) {
			return callback();
		}
		plugins[i].call(_this, param, innerCallback);
	});
	// 开始执行 第一个 plugin 把 param 和 innerCallback 带上
	plugins[0].call(this, param, innerCallback);
};

//异步串行保险的结果
Tapable.prototype.applyPluginsAsyncSeriesBailResult = function applyPluginsAsyncSeriesBailResult(name) {
	var args = Array.prototype.slice.call(arguments, 1);
	var callback = args.pop();
	if(!this._plugins[name] || this._plugins[name].length === 0) return callback();
	var plugins = this._plugins[name];
	var i = 0;
	var _this = this;
	args.push(copyProperties(callback, function next() {
		//如果参数大于0的话 则直接执行callback 并且把参数带上
		if(arguments.length > 0) return callback.apply(null, arguments);
		i++;
		if(i >= plugins.length) {
			return callback();
		}
		plugins[i].apply(_this, args);
	}));
	//执行第一个plugin 并把所有的参数都带上 
	plugins[0].apply(this, args);
};

//异步串行保险的结果1
Tapable.prototype.applyPluginsAsyncSeriesBailResult1 = function applyPluginsAsyncSeriesBailResult1(name, param, callback) {
	var plugins = this._plugins[name];
	if(!plugins || plugins.length === 0) return callback();
	var i = 0;
	var _this = this;
	var innerCallback = copyProperties(callback, function next(err, result) {
		//执行 callback 并把result 参数带上
		if(arguments.length > 0) return callback(err, result);
		i++;
		if(i >= plugins.length) {
			return callback();
		}
		plugins[i].call(_this, param, innerCallback);
	});
	plugins[0].call(this, param, innerCallback);
};

//以瀑布流的方式 异步执行插件
Tapable.prototype.applyPluginsAsyncWaterfall = function applyPluginsAsyncWaterfall(name, init, callback) {
	if(!this._plugins[name] || this._plugins[name].length === 0) return callback(null, init);
	var plugins = this._plugins[name];
	var i = 0;
	var _this = this;
	//把callback 的属性 拷贝到 匿名函数上
	var next = copyProperties(callback, function(err, value) {
		if(err) return callback(err);
		i++;
		if(i >= plugins.length) {
			return callback(null, value);
		}
		plugins[i].call(_this, value, next);
	});
	//开始执行插件
	//传入参数 init 和 next
	//从第一个插件开始执行
	plugins[0].call(this, init, next);
};


//并行的执行参数
Tapable.prototype.applyPluginsParallel = function applyPluginsParallel(name) {
	var args = Array.prototype.slice.call(arguments, 1);
	var callback = args.pop();
	if(!this._plugins[name] || this._plugins[name].length === 0) return callback();
	var plugins = this._plugins[name];
	var remaining = plugins.length;
	args.push(copyProperties(callback, function(err) {
		if(remaining < 0) return; // ignore
		if(err) {
			remaining = -1;
			return callback(err);
		}
		remaining--;
		if(remaining === 0) {
			return callback();
		}
	}));
	//开始遍历所有的插件 并执行
	for(var i = 0; i < plugins.length; i++) {
		plugins[i].apply(this, args);
		if(remaining < 0) return;
	}
};

//并行可靠的执行插件并返回结果
Tapable.prototype.applyPluginsParallelBailResult = function applyPluginsParallelBailResult(name) {
	var args = Array.prototype.slice.call(arguments, 1);
	//拿到最后一个参数
	var callback = args[args.length - 1];
	if(!this._plugins[name] || this._plugins[name].length === 0) return callback();
	//找到插件列表
	var plugins = this._plugins[name];
	//当前的位置 指向 插件的长度
	var currentPos = plugins.length;

	var currentResult;
	var done = [];
	
	 
	for(var i = 0; i < plugins.length; i++) {
		args[args.length - 1] = (function(i) {
			return copyProperties(callback, function() {
				if(i >= currentPos) return; // ignore
				done.push(i);
				if(arguments.length > 0) {
					currentPos = i + 1;
					done = fastFilter.call(done, function(item) {
						return item <= i;
					});
					currentResult = Array.prototype.slice.call(arguments);
				}
				if(done.length === currentPos) {
					callback.apply(null, currentResult);
					currentPos = 0;
				}
			});
		}(i));
		plugins[i].apply(this, args);
	}
};

Tapable.prototype.applyPluginsParallelBailResult1 = function applyPluginsParallelBailResult1(name, param, callback) {
	var plugins = this._plugins[name];
	if(!plugins || plugins.length === 0) return callback();
	var currentPos = plugins.length;
	var currentResult;
	var done = [];
	for(var i = 0; i < plugins.length; i++) {
		var innerCallback = (function(i) {
			return copyProperties(callback, function() {
				if(i >= currentPos) return; // ignore
				done.push(i);
				if(arguments.length > 0) {
					currentPos = i + 1;
					done = fastFilter.call(done, function(item) {
						return item <= i;
					});
					currentResult = Array.prototype.slice.call(arguments);
				}
				if(done.length === currentPos) {
					callback.apply(null, currentResult);
					currentPos = 0;
				}
			});
		}(i));
		plugins[i].call(this, param, innerCallback);
	}
};

//判断是否有 指定 name 的插件
Tapable.prototype.hasPlugins = function hasPlugins(name) {
	var plugins = this._plugins[name];
	return plugins && plugins.length > 0;
};

//注册插件
//接受两个参数 name fn
Tapable.prototype.plugin = function plugin(name, fn) {
	// 如果 name 是数组的话
	if(Array.isArray(name)) {
		//开始遍历数组
		name.forEach(function(name) {
			//分别注册
			this.plugin(name, fn);
		}, this);
		return;
	}
	//如果当前这个 name 指定的插件不存在的话 就初始化为 包含fn的数组
	// 否则直接 push 进去
	if(!this._plugins[name]) this._plugins[name] = [fn];
	else this._plugins[name].push(fn);
};

//执行插件
Tapable.prototype.apply = function apply() {
	//遍历参数列表 并执行
	for(var i = 0; i < arguments.length; i++) {
		arguments[i].apply(this);
	}
};
