
var Tapable = require('../lib/Tapable');

function Demo(){
    Tapable.call(this); 
}

Demo.prototype = Object.create(Tapable.prototype);

let demo = new Demo();

//开始注册plugin

/*demo.plugin("One",function(int,arg){
     console.log(1+"=="+int+"=="+arg);

     return int
})
demo.plugin("One",function(pre,arg){
     console.log(2+"==="+pre+"=="+arg);

     return 2 + pre
})
demo.plugin("One",function(pre,arg){
     console.log(3+"==="+pre+"=="+arg);

     return 3 + pre
})*/


//执行 plugin

/*console.log(demo._plugins.One.toString());*/
/*console.log(demo._plugins);*/

//let onePlugin = demo._plugins["One"]; 

//apply 是一个一个的插件执行
/*for(var i=0;i<onePlugin.length;i++){
     demo.apply(onePlugin[i])
}*/
 

//applyPlugins 是 执行当前key 对应的所有plugin 
//同步执行 One 对应的所有 handler
//applyPlugins 没有返回值
/*demo.applyPlugins("One","adasd")*/

//applyPluginsWaterfall 以流的方式执行 可以把前一个函数的返回值 作为下一个函数的参数 
//也是同步执行
//let sum = demo.applyPluginsWaterfall("One",1,"DDD")
//console.log("sum==="+sum);

/*console.log("**********applyPluginsAsync**********")

demo.plugin("One",function(a,b){
     setTimeout(()=>{
     	 console.log(1111);
     	 b();
     },1000)
})

demo.plugin("One",function(a,b){
     setTimeout(()=>{
        console.log(22222);   
        b();
     },1000)
})

demo.plugin("One",function(a,b){
     setTimeout(()=>{
       console.log(3333333);
       //代表结束整个流程
       b(a);
     },1000) 
})

demo.applyPluginsAsync("One","ddd",function(arg){
    console.log(arg);
});
 
console.log("**********applyPluginsAsync**********")*/



/*console.log("**********applyPluginsBailResult**********")

//只要有一个插件 返回不是 undefined 的话 就终止流程
demo.plugin("One",function(b){
    console.log(1111+"--"+b);
    return b;
})

demo.plugin("One",function(b){
    console.log(2222+"--"+b);
})

demo.plugin("One",function(a){
    console.log(3333+"--"+a);
})

demo.applyPluginsBailResult("One","ddd");
 

console.log("**********applyPluginsBailResult**********") */



/*console.log("**********applyPluginsAsyncWaterfall**********")

demo.plugin("One",function(a,b){
     setTimeout(()=>{
     	 console.log(1111);
     	 console.log(a);
     	 b('',"11111");
     },1000)
})

demo.plugin("One",function(a,b){
     setTimeout(()=>{
        console.log(22222);
        console.log(a);   
        b('',a);
     },1000)
})

demo.plugin("One",function(a,b){
     setTimeout(()=>{
        console.log(3333333);
        console.log(a);
        //代表结束整个流程
        b('',a);
     },1000) 
})

demo.applyPluginsAsyncWaterfall("One","ddd",function(err,arg){
    console.log('err=='+err+"==arg=="+arg);
});
 
console.log("**********applyPluginsAsyncWaterfall**********")*/



console.log("**********applyPluginsAsyncSeries**********")

/*demo.plugin("One",function(a,b){
     setTimeout(()=>{
     	 console.log(1111);
     	 console.log(a);
     	 b('',"11111");
     },1000)
})

demo.plugin("One",function(a,b){
     setTimeout(()=>{
        console.log(22222);
        console.log(a);   
        b('1',"err","asdasd");
     },1000)
})

demo.plugin("One",function(a,b){
     setTimeout(()=>{
        console.log(3333333);
        console.log(a);
        //代表结束整个流程
        b('',"asdasdasd");
     },1000) 
})

demo.applyPluginsAsyncSeries("One","ddd",function(err,arg){
    console.log('err=='+err+"==arg=="+arg);
});*/
 
/*console.log("**********applyPluginsAsyncSeries**********")*/



/*console.log("**********applyPluginsParallel**********")

demo.plugin("One",function(a,cb){
     setTimeout(()=>{
     	 console.log(1111);
     	 cb(null,"111","222");
     },1000)
})

demo.plugin("One",function(a,cb){
     setTimeout(()=>{
        console.log(22222);
        cb(null,a);   
     },1000)
})

demo.plugin("One",function(a,cb){
     setTimeout(()=>{
        console.log(3333333);
        cb(true,a)
        //代表结束整个流程
     },1000) 
})

demo.applyPluginsParallel("One","ddd",function(q){
    console.log(q);
});
 
console.log("**********applyPluginsParallel**********")*/



/*console.log("**********applyPluginsParallelBailResult**********")*/

demo.plugin("One",function(a,b,cb){
     setTimeout(()=>{
     	 console.log(1111+"a="+a+"b=="+b);
     	 cb(1,'dddd');
     },1000)
})

demo.plugin("One",function(a,b,cb){
     setTimeout(()=>{
        console.log(22222+"a=="+a+"b=="+b);
        cb(2);   
     },1000)
})

demo.plugin("One",function(a,b,cb){
     setTimeout(()=>{
        console.log(3333333+"a=="+a+"b=="+b);
        cb(3)
        //代表结束整个流程
     },1000) 
})


demo.applyPluginsParallelBailResult("One",'aaaa','bbbbb',function(a,b){
	 console.log('end',a,b)
});
 
console.log("**********applyPluginsParallelBailResult**********")


console.log("One==="+demo.hasPlugins("One"));