import React, { useState, useEffect } from 'react';

interface Demo2Props {}

const Demo2: React.FC<Demo2Props> = props => {
  const onDragStart = (e: React.DragEvent) => {
    // @ts-ignore
    e.dataTransfer.setData('index', e.target.dataset.index);
  };

  const onDragOver = (e: React.DragEvent) => {
    //
    e.dataTransfer.dropEffect = 'link'; // 修改移动时的光标样式 默认 copy
    e.preventDefault();
  };

  /** 拖拽到该区域 */
  const onDrop = (e: React.DragEvent) => {
    alert(e.dataTransfer.getData('index'));
  };

  return (
    <div className="demo">
      <h3>Demo2 - dropEffect 设置移动的光标</h3>
      <div className="flex">
        <div
          className="box1"
          draggable
          onDragStart={onDragStart}
          data-index="1"
        >
          源对象
        </div>
        <div className="box2" onDragOver={onDragOver} onDrop={onDrop}>
          目标对象
        </div>
      </div>
    </div>
  );
};

export default Demo2;
