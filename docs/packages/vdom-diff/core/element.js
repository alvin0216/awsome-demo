class Element {
  constructor(type, props, children) {
    this.type = type;
    this.props = props;
    this.children = children;
  }
}

function createElement(type, props, children) {
  return new Element(type, props, children);
}

// 设置属性
function setAttr(dom, key, value) {
  switch (key) {
    case 'value': // dom是一个input或者textarea
      if (
        dom.tagName.toUpperCase() === 'INPUT' ||
        dom.tagName.toUpperCase() === 'TEXTAREA'
      ) {
        dom.value = value;
      } else {
        dom.setAttribute(key, value);
      }
      break;
    case 'style':
      dom.style.cssText = value;
      break;
    default:
      dom.setAttribute(key, value);
      break;
  }
}

function render(vdom) {
  let dom = document.createElement(vdom.type);
  for (const key in vdom.props) {
    setAttr(dom, key, vdom.props[key]);
  }
  vdom.children.forEach(child => {
    child =
      child instanceof Element ? render(child) : document.createTextNode(child);
    dom.appendChild(child);
  });

  return dom;
}

function renderDom(dom, container) {
  container.appendChild(dom);
}

export { Element, createElement, setAttr, render, renderDom };
