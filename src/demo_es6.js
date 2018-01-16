

let Tapable = require('../lib/Tapable')

//并没有继承到 Tapable的静态属性
class Demo extends Tapable{
     constructor(){
     	 super();
     }
}

let demo = new Demo();

//hasOwnProperty 如果当前的 属性在 静态 或实例上时 返回 true  如果属性在原型上时 则返回 false 

//console.log(demo.hasOwnProperty("_plugins")); 

//isPrototypeOf 判断某个对象是否在 指定对象的原型上
console.log(Tapable.prototype.isPrototypeOf(demo)); 



