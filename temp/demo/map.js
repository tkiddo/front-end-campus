/*
 * @Author: 唐凯强
 * @Date: 2021-01-18 09:44:21
 * @LastEditors: 唐凯强
 * @LastEditTime: 2021-01-18 11:39:02
 * @Description:
 */
class MyMap {
  constructor() {
    // 链表的头，遍历的起点
    this.head = { next: null };
  }

  set(key, value) {
    let current = this.head;
    // 遍历链表
    while (current.next) {
      // 判断键值是否相同，相同则覆盖value
      if (current.next.key === key) {
        return (current.next.value = value);
      }
      current = current.next;
    }
    // 在链表中没有找到相同key值的，则创建新的元素，添加到链表尾部
    const el = { key, value, next: null };
    current.next = el;
  }

  get(key) {
    let current = this.head;
    // 遍历查找相同key值是否存在
    while (current.next) {
      if (current.next.key === key) {
        return current.next.value;
      }
      current = current.next;
    }
    return undefined;
  }

  delete(key) {
    let current = this.head;
    while (current.next) {
      if (current.next.key === key) {
        // 删除链表中指定项
        current.next = current.next.next;
      }
      current = current.next;
    }
  }

  has(key) {
    let current = this.head;
    while (current.next) {
      if (current.next.key === key) {
        return true;
      }
      current = current.next;
    }
    return false;
  }

  clear() {
    this.head = { next: null };
  }

  keys() {
    let current = this.head;
    //用数组保存所有键
    const keys = [];
    while (current.next) {
      keys.push(current.next.key);
      current = current.next;
    }

    return keys;
  }

  values() {
    let current = this.head;
    //用数组保存所有值
    const values = [];
    while (current.next) {
      values.push(current.next.value);
      current = current.next;
    }

    return values;
  }

  entries() {
    let current = this.head;
    //用数组保存所有键值对
    const entries = [];
    while (current.next) {
      entries.push([current.next.key, current.next.value]);
      current = current.next;
    }

    return entries;
  }
}

const map = new MyMap();

map.set(1, [1, 2, 3]);
map.set('haha', { name: 'ahha' });
map.set({ key: 'gas' }, Symbol('s'));
map.set({ key: 'gas' }, () => {});
map.delete('haha');
console.log(map.keys(), map.values(), map.entries());
