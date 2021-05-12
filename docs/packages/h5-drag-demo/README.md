---
title: H5 拖拽
---

相关资料

- [html5 原生拖拽研究](https://zhuanlan.zhihu.com/p/101307532)
- [React 实现拖拽功能](https://www.cnblogs.com/wenruo/p/10225377.html)

<code src="./src/App.tsx" />

- 区域外：dragleave，离开范围
- 区域内：dragenter，用来确定放置目标是否接受放置。
- 区域内移动：dragover，用来确定给用户显示怎样的反馈信息
- 完成拖拽（落下）drop：，允许放置对象。
