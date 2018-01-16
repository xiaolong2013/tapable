var Tapable = require("../lib/Tapable");
var should = require("should");

/**
 * Function designed to return a plugin handler.
 * With applyPluginsWaterfall, each plugin handler
 * has some expected arguments it will receive and an
 * optional return value. This function produces plugin
 * handler functions that perform expected arg checks and
 * returns some value (implicitly undefined if none specified).
 */
function makeTestPlugin(expectedArgs, returnVal) {
	return function() {
		var args = Array.prototype.slice.call(arguments);
		args.should.be.eql(expectedArgs);
		return returnVal;
	}
}

describe("applyPluginsWaterfall", function() {

	it("should call all handlers", function() {
		var runningSum = 0;
		var tapable = new Tapable();
        
        //注册插件
		tapable.plugin('plugin', function() {
			runningSum++;
		});
        
        //注册插件
		tapable.plugin('plugin', function() {
			runningSum++;
		});
         
        //注册插件 
		tapable.plugin('plugin', function() {
			runningSum++;
		});
        
        //执行所有的插件
		tapable.applyPluginsWaterfall('plugin');
		runningSum.should.be.eql(3);
	});

	it("should call first handler with init value", function() {
		var tapable = new Tapable();
		//makeTestPlugin 的目标是返回一个插件的handler
		var pluginHandler = makeTestPlugin(['initValue']);
        //注册插件
		tapable.plugin('plugin', pluginHandler);
        //执行插件 加一个的参数
		tapable.applyPluginsWaterfall('plugin', 'initValue');
	});
    
    //应该执行后面的 handlers 用前面的handler的返回值
	it("should call subsequent handlers with previous handler return value", function() {
		var tapable = new Tapable();
        
        //第一个参数 期望值  第二个参数 返回值
		var pluginHandler1 = makeTestPlugin(['initValue'], 'handler1Return');
		var pluginHandler2 = makeTestPlugin(['handler1Return'], 'handler2Return');
		var pluginHandler3 = makeTestPlugin(['handler2Return'], 'handler3Return');
		var pluginHandler4 = makeTestPlugin(['handler3Return']);
        
        //注册插件   
		tapable.plugin('plugin', pluginHandler1);
		//注册插件
		tapable.plugin('plugin', pluginHandler2);
		//注册插件
		tapable.plugin('plugin', pluginHandler3);
		//注册插件
		tapable.plugin('plugin', pluginHandler4);
        
        //执行插件的时侯以瀑布流的方式  需要传入一个初始的param
		tapable.applyPluginsWaterfall('plugin', 'initValue');
	});
     
    //用原始的参数 调用随后的参数 
	it("should call subsequent handlers with original arguments", function() {
		//创建一个tapable 实例
		var tapable = new Tapable();
		//创建一个参数列表
		var allArgs = ['plugin', 'initValue', 'sharedArg1', 'sharedArg2', 'sharedArg3'];
		//截取参数 sh1 sh2 sh3
		var sharedArgs = allArgs.slice(2); // arguments that each plugin handler will get

        //创建第一个handler
		var pluginHandler1 = makeTestPlugin(allArgs.slice(1), 'handler1Return');
		//创建第二个handler
		var pluginHandler2 = makeTestPlugin(['handler1Return'].concat(sharedArgs), 'handler2Return');
		//创建第三个handler
		var pluginHandler3 = makeTestPlugin(['handler2Return'].concat(sharedArgs), 'handler3Return');
		//创建第四个handler
		var pluginHandler4 = makeTestPlugin(['handler3Return'].concat(sharedArgs));
        
        //开始注册插件
		tapable.plugin('plugin', pluginHandler1);
		tapable.plugin('plugin', pluginHandler2);
		tapable.plugin('plugin', pluginHandler3);
		tapable.plugin('plugin', pluginHandler4);

		//Calling apply to simulate ...spreadOperator
		//allArgs 作为一个数组作为参数传递进去 其实就是函数的 参数列表 而不是一个 参数 数组
		//以这样的方式传递进去 那么第一个参数就是 plugin 第二个参数就是 initValue 而不是 第一个参数为数组
		//深刻理解 apply 的用处
		tapable.applyPluginsWaterfall.apply(tapable, allArgs);
	});

});
