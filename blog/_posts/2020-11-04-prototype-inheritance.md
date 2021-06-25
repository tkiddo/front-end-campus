---
title: 理解 JavaScript 中的原型和继承
date: 2020-11-04
tags:
  - JS
  - prototype
---# 理解 JavaScript 中的原型和继承

翻译自[Understanding Prototypes and Inheritance in JavaScript](https://www.digitalocean.com/community/tutorials/understanding-prototypes-and-inheritance-in-javascript#:~:text=JavaScript%20is%20a%20prototype-based%20language%2C%20meaning%20object%20properties,languages%2C%20JavaScript%20is%20relatively%20unique%2C%20as%20other%20)

### 引言

JavaScript 是一门基于原型的语言，意味着可以通过具有克隆和扩展功能的通用对象来共享对象属性和方法。这称为原型继承，和类继承不同。在众多面向对象的编程语言中，JavaScript 相对特殊，因为其他出色的语言比如 PHP，Java，Python 都是基于类的，用类定义对象的蓝本。

### JavaScript Prototype

JavaScript 中的每一个对象都有一个内部属性`[[Prototype]]`。我么可以通过创建一个空对象来演示：

```js
let x = {};
```

我们通常会这样创建空对象，但利用对象构造器也可以创建对象：`let x = new Object()`

> 包含`[[Prototype]]`的双方括号表示它是一个内部属性，不能直接在代码中访问

为了找到这个新创建对象的`[[Prototype]]`，我们将使用`getPrototypeOf()`方法。

```js
Object.getPrototypeof(x);
```

输出结果包含一系列内置属性和方法。

```js
{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, …}
```

另一个找到`[[Prototype]]`的方法是通过`__proto__`属性。`__proto__`是一个将对象的内置属性`[[Prototype]]`暴露出来的属性。

```js
x.__proto__;
```

输出结果将是一样的：

```js
{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, …}
```

每个对象都有一个`[[Prototype]]`属性很重要，它为任何两个或更多对象链接提供了一种方法。

您创建的对象具有`[[Prototype]]`，内置对象也具有`[[Prototype]]`，例如 Date 和 Array。可以通过`prototype`属性从一个对象到另一个对象对该内部属性进行引用

### 原型继承

当你尝试访问一个对象的属性或方法时，JavaScript 会首先从对象本身开始查找，如果找不到，就会搜索对象的`[[Prototype]]`。如果从对象本身和对象的`[[Prototype]]`上均未找到，JavaScript 会继续搜索链接对象的原型，直到原型链的末尾。

在原型链的末尾是`Object.prototype`。所有对象都继承了`Object`的属性和方法。在原型链末尾继续搜索会得到`null`

举个例子，`x`是一个继承自`Object`的空对象，`x`可以使用`Object`上的任何属性或者方法，比如`toString()`

```js
x.toString(); // [object Object]
```

这条原型链只有一个链接：`x -> Object`。当我们试图将两个`[[Prototype]]`链接起来，会得到`null`

```js
x.__proto__.__proto__; //null
```

我们来看另一种对象。如果你用过数组，你就会知道数组包含很多内置方法，比如`pop()`和`push()`。你之所以能使用这些方法，是因为这些方法都存在`Array.prototype`上。

我们来测试一下：

```js
let y = [];
```

你也可以使用数组构造器，`let y = new Array()`.

从新创建的数组`y`的`[[Prototype]]`上，我们可以看到比`x`对象更多的属性和方法。它继承了`Array.prototype`的全部。

```js
y.__proto__; //[constructor: ƒ, concat: ƒ, pop: ƒ, push: ƒ, …]
```

您会注意到原型上的构造函数属性设置为`Array()`。 `Constructor`属性返回对象的构造函数，这是一种用于从函数构造对象的机制。

现在，我们可以将两个原型链接在一起，因为在这种情况下，原型链更长. 看起来像`y-> Array-> Object`

```js
y.__proto__.__proto__; //{constructor: ƒ, __defineGetter__: ƒ, __defineSetter__: ƒ, …}
```

现在，此链指的是`Object.prototype`。我们可以针对构造函数的`prototype`属性测试内部`[[Prototype]]`，以查看它们是否指向同一事物。

```js
y.__proto__ === Array.prototype; // true
y.__proto__.__proto__ === Object.prototype; // true
```

我们还可以使用`isPrototypeOf()`方法来完成此操作。

```js
Array.prototype.isPrototypeOf(y); // true
Object.prototype.isPrototypeOf(Array); // true
```

我们可以使用`instanceof`运算符来测试构造函数的`prototype`属性是否出现在对象原型链中的任何位置。

```js
y instanceof Array; // true
```

总而言之,**所有 JavaScript 对象都包含一个内部属性`[[Prototype]]`，可以通过`__proto__`来访问。对象可以通过继承其构造函数`[[Prototype]]`上的方法和属性来扩展**

原型可以被链接起来，并且每个对象都会继承这条链上的所有内容。原型链终于`Object.prototype`

### 构造函数

构造函数是用来构造新对象的函数。`new`S 操作符可以基于构造函数创建新的实例。我们已经看到了一些内置的 JavaScript 构造函数，例如`new Array()`和`new Date()`，但是我们还可以创建自己的自定义模板，从中构建新对象。

举例来说，假设我们正在创建一个非常简单的基于文本的角色扮演游戏。用户可以选择一个角色，然后选择他们将拥有的角色类别，例如战士，治疗者，小偷等等

由于每个角色将共享许多特征，例如具有名称，级别和生命值，因此有必要将构造函数创建为模板。但是，由于每个角色类可能具有截然不同的能力，因此我们要确保每个角色只能使用自己的能力。让我们看一下如何通过原型继承和构造函数来完成此任务

首先，构造函数只是一个常规函数。当实例使用`new`关键字调用它时，它将成为构造函数。在 JavaScript 中，我们按约定将构造函数的首字母大写。

```js
// Initialize a constructor function for a new Hero
function Hero(name, level) {
  this.name = name;
  this.level = level;
}
```

我们创建了一个名为 Hero 的构造函数，它带有两个参数：name 和 level。由于每个角色都会有一个名称和一个级别，因此每个新角色都必须具有这些属性。`this`关键字将引用创建的新实例，因此将`this.name`设置为 name 参数可确保新对象设置了 name 属性。

现在，我们可以使用 new 创建一个新实例。

```js
let hero1 = new Hero('Bjorn', 1);
```

如果我们输出 hero1，我们将看到已经创建了一个新对象，并按预期设置了新属性。

```
Hero {name: "Bjorn", level: 1}
```

现在，如果获得 hero1 的`[[Prototype]]`，我们将能够看到构造函数为`Hero()`。 （请记住，此输入与`hero1 .__ proto__`相同，但这是使用的正确方法。）

```js
Object.getPrototypeOf(hero1); //{constructor:f Hero(name,level){...},__proto__:Object}
```

您可能会注意到，我们仅在构造函数中定义了属性，而没有定义方法。在 JavaScript 中，通常的做法是在原型上定义方法以提高效率和代码可读性。

我们可以使用原型向 Hero 添加方法。我们将创建一个 greet（）方法。

```js
// Add greet method to the Hero prototype
Hero.prototype.greet = function() {
  return `${this.name} says hello.`;
};
```

由于`greet()`在`Hero`的原型中，而 hero1 是`Hero`的实例，因此该方法可用于 hero1。

```js
hero1.greet(); //"Bjorn says hello."
```

很好，但是现在我们要创建角色类供英雄使用。将每个类的所有功能都放入 Hero 构造函数中是没有意义的，因为不同的类将具有不同的功能。我们想创建新的构造函数，但我们也希望将它们连接到原始 Hero。

我们可以使用`call()`方法将属性从一个构造函数复制到另一个构造函数。让我们创建一个 Warrior 和 Healer 构造函数。

```js
// Initialize Warrior constructor
function Warrior(name, level, weapon) {
  // Chain constructor with call
  Hero.call(this, name, level);

  // Add a new property
  this.weapon = weapon;
}

// Initialize Healer constructor
function Healer(name, level, spell) {
  Hero.call(this, name, level);

  this.spell = spell;
}
```

这两个新的构造函数现在都具有 Hero 属性和一些不受限制的属性。我们将 Attack（）方法添加到 Warrior，并将 heal（）方法添加到 Healer

```js
Warrior.prototype.attack = function() {
  return `${this.name} attacks with the ${this.weapon}.`;
};

Healer.prototype.heal = function() {
  return `${this.name} casts ${this.spell}.`;
};
```

此时，我们将使用这两个可用的角色类来创建角色。

```js
const hero1 = new Warrior('Bjorn', 1, 'axe');
const hero2 = new Healer('Kanin', 1, 'cure');
```

hero1 就是携带了两个新属性的`Warrior`

```js
console.log(hero1); //Warrior {name: 'Bjorn', level: 1, weapon: 'axe'}
console.log(hero2); //Healer {name: 'Kanin', level: 1, spell: 'cure'}
```

我们可以使用`Warrior`原型上的方法

```js
hero1.attack(); // "Bjorn attacks with the axe."
```

但是，当我们调用原型链上的方法时：

```js
hero1.greet(); //Uncaught TypeError: hero1.greet is not a function
```

当您使用`call()`链接构造函数时，原型属性和方法不会自动链接。我们将使用`Object.create()`链接原型，**确保在创建任何其他方法并将其添加到原型之前将其放置**。

```js
//...
Warrior.prototype = Object.create(Hero.prototype);
Healer.prototype = Object.create(Hero.prototype);

// All other prototype methods added below
//...
```

现在，我们可以在 Warrior 或 Healer 的实例上成功使用 Hero 中的原型方法。

```js
hero1.greet(); //"Bjorn says hello."
```

完整代码:

```js
// Initialize constructor functions
function Hero(name, level) {
  this.name = name;
  this.level = level;
}

function Warrior(name, level, weapon) {
  Hero.call(this, name, level);

  this.weapon = weapon;
}

function Healer(name, level, spell) {
  Hero.call(this, name, level);

  this.spell = spell;
}

// Link prototypes and add prototype methods
Warrior.prototype = Object.create(Hero.prototype);
Healer.prototype = Object.create(Hero.prototype);

Hero.prototype.greet = function() {
  return `${this.name} says hello.`;
};

Warrior.prototype.attack = function() {
  return `${this.name} attacks with the ${this.weapon}.`;
};

Healer.prototype.heal = function() {
  return `${this.name} casts ${this.spell}.`;
};

// Initialize individual character instances
const hero1 = new Warrior('Bjorn', 1, 'axe');
const hero2 = new Healer('Kanin', 1, 'cure');
```

通过此代码，我们使用基本属性创建了 Hero 类，从原始构造函数创建了两个称为 Warrior 和 Healer 的角色类，为原型添加了方法并创建了单独的角色实例。

### 小结

JavaScript 是一种基于原型的语言，其功能与许多其他面向对象的语言所使用的传统的基于类的范例不同。
