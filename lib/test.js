
const Tapable = require('./Tapable');

var tap = new Tapable();
// 模拟两个插件
/*tap._plugins = {
    "emit":[
        function(a,b,cb){
            setTimeout(()=>{
               console.log('1',a,b);
               //调用下一个插件
               cb();
            },1000);
        },
        function(a,b,cb){
            setTimeout(()=>{
                console.log('2',a,b);
                //相当于执行回调
                cb();
            },500)
        }
    ]
}*/

// 一般最后一个参数为回调函数 
// 在程序开始的时候 就已经把 回调弹出了
// 所以说 args 里面其实是 三个参数
// ["aaaa","bbbb",function next] 
// 按顺序执行 emit 的回调 最后执行 callback 
/*tap.applyPluginsAsync("emit",'aaaa','bbbbb',function(){console.log('end')});*/

//注册插件
/*tap._plugins = {
	"emit":[
	    function(a,b,cb){
	        setTimeout(()=>{
	          console.log('1',a,b);
	          cb(null,'e222','33333');
	        },1000);
	    },
	    function(a,b,cb){
	        setTimeout(()=>{
	            console.log('2',a,b);
	            cb(null,'err');
	        },500)
	    }
	]
}

// 因为这个函数里面 plugin 执行的是 循环执行
// 所有插件都会执行一遍 
// 如果插件执行完 就执行 callback 或者  
// 其中一个插件出错 就执行回调  之后就再也不会执行回调,
tap.applyPluginsParallel("emit",'aaaa','bbbbb',function(a,b){console.log('end',a,b)}); */


tap._plugins = {
"emit":[
    function(a,b,cb){
        setTimeout(()=>{
          console.log('1',a,b);
          cb('1');
        },1000);
    },
    function(a,b,cb){
        setTimeout(()=>{
            console.log('2',a,b);
            cb('2');
        },500)
    },
    function(a,b,cb){
        setTimeout(()=>{
            console.log('3',a,b);
            cb('3');
        },1500)
    }
]
}

tap.applyPluginsParallelBailResult("emit",'aaaa','bbbbb',function(a,b){console.log('end',a,b)});
 

