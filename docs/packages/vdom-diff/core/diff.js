import { REMOVE, REPLACE, TEXT, ATTR } from './contants';

function diff(oldTree, newTree) {
  // 声明变量 patches 用来存放补丁的对象
  let patches = {};

  // 第一次比较应该是树的第0个索引
  let index = 0;

  // 递归树，将比较后的结果放在补丁 patches 内
  dfsWalk(oldTree, newTree, index, patches);

  return patches;
}

function dfsWalk(oldNode, newNode, index, patches) {
  // 每个元素都有一个补丁
  let currentPatches = [];

  switch (true) {
    case !newNode:
      currentPatches.push({ type: REMOVE, index });
      break;

    case isString(oldNode) && isString(newNode): // 判断文本是否一致
      if (oldNode !== newNode) {
        currentPatches.push({ type: TEXT, text: newNode });
      }
      break;

    case oldNode.type === newNode.type:
      // 比较属性是否有更改
      let attr = diffAttr(oldNode.props, newNode.props);

      if (Object.keys(attr).length > 0) {
        currentPatches.push({ type: ATTR, attr });
      }

      // 如果有子节点，遍历子节点
      diffChildren(oldNode.children, newNode.children, patches);
      break;

    // 说明节点被替换了
    default:
      currentPatches.push({ type: REPLACE, newNode });
      break;
  }

  // 当前元素确实有补丁
  if (currentPatches.length) {
    // 将元素和补丁对应起来，放到大补丁包中
    patches[index] = currentPatches;
  }
}

function isString(obj) {
  return Object.prototype.toString.call(obj) === '[object String]';
}

function diffAttr(oldAttrs, newAttrs) {
  let patch = {};
  // 判断老的属性中和新的属性的关系
  for (let key in oldAttrs) {
    if (oldAttrs[key] !== newAttrs[key]) {
      patch[key] = newAttrs[key]; // 有可能还是undefined
    }
  }

  for (let key in newAttrs) {
    // 老节点没有新节点的属性
    if (!oldAttrs.hasOwnProperty(key)) {
      patch[key] = newAttrs[key];
    }
  }
  return patch;
}

// 所有都基于一个序号来实现
let mountIndex = 0;

function diffChildren(oldChildren, newChildren, patches) {
  // 比较老的第一个和新的第一个
  oldChildren.forEach((child, index) => {
    dfsWalk(child, newChildren[index], ++mountIndex, patches);
  });
}

export default diff;
