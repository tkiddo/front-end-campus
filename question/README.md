<!--
 * @Author: tkiddo
 * @Date: 2021-02-06 09:51:44
 * @LastEditors: tkiddo
 * @LastEditTime: 2021-02-06 15:41:04
 * @Description:
-->

1.

```js
// 3
const shape = {
  radius: 10,
  diameter() {
    return this.radius * 2;
  },
  perimeter: () => 2 * Math.PI * this.radius
};

console.log(shape.diameter());
console.log(shape.perimeter());
```

2.

```js
// 7
let a = 3;
let b = new Number(3);
let c = 3;

console.log(a == b);
console.log(a === b);
console.log(b === c);
```

3.

```js
class Chameleon {
  static colorChange(newColor) {
    this.newColor = newColor;
    return this.newColor;
  }

  constructor({ newColor = 'green' } = {}) {
    this.newColor = newColor;
  }
}

const freddie = new Chameleon({ newColor: 'purple' });
console.log(freddie.colorChange('orange'));
```

4.

```js
// 17

function getPersonInfo(one, two, three) {
  console.log(one);
  console.log(two);
  console.log(three);
}

const person = 'Lydia';
const age = 21;

getPersonInfo`${person} is ${age} years old`;
```

5.

```js
// 24
const obj = { 1: 'a', 2: 'b', 3: 'c' };
const set = new Set([1, 2, 3, 4, 5]);

obj.hasOwnProperty('1');
obj.hasOwnProperty(1);
set.has('1');
set.has(1);
```

6.

```js
// 46

let person = { name: 'Lydia' };
const members = [person];
person = null;

console.log(members);
```

7.

```js
// 49

const num = parseInt('7*6', 10);
```

8.

```js
// 65

[1, 2, 3, 4].reduce((x, y) => console.log(x, y));
```

9.

```js
//73
async function getData() {
  return await Promise.resolve('I made it!');
}

const data = getData();
console.log(data);
```

9.

```js
// 75

const box = { x: 10, y: 20 };

Object.freeze(box);

const shape = box;
shape.x = 100;

console.log(shape);
```

10.

```js
// 101
const one = false || {} || null;
const two = null || false || '';
const three = [] || 0 || true;

console.log(one, two, three);
```

11.

```js
//103

const set = new Set();

set.add(1);
set.add('Lydia');
set.add({ name: 'Lydia' });

for (let item of set) {
  console.log(item + 2);
}
```

12.

```js
// 114

let config = {
  alert: setInterval(() => {
    console.log('Alert!');
  }, 1000)
};

config = null;
```

react
es6
webpack
