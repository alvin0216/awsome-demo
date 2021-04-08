import { createElement, render, renderDom } from './element';
import diff from './diff';
import patch from './patch';

let virtualDom = createElement('ul', { class: 'list' }, [
  createElement('li', { class: 'item' }, ['A']),
  createElement('li', { class: 'item' }, ['B']),
  createElement('li', { class: 'item' }, ['C']),
]);

let virtualDom2 = createElement('ul', { class: 'list-group' }, [
  createElement('li', { class: 'item' }, ['A changed']),
  createElement('li', { class: 'item' }, ['B']),
  createElement('p', { class: 'page' }, [
    createElement('a', { class: 'link', href: 'https://blog.alvin.run' }, [
      'C replaced',
    ]),
  ]),
  createElement('li', { class: 'item' }, ['这个是新增的节点']),
]);

let el = render(virtualDom);
renderDom(el, document.getElementById('app'));

let patches = diff(virtualDom, virtualDom2);
console.log(patches);

// 给元素打补丁，重新更新视图
patch(el, patches);

// 遗留问题
// 如果平级互换，会导致重新渲染
// 新增节点 不生效
// index
