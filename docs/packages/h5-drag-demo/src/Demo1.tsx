import React, { useState, useEffect } from 'react';
import styles from './styles.less';

interface Demo1Props {}

const Demo1: React.FC<Demo1Props> = props => {
  const onDragStart = (e: React.DragEvent) => {
    // @ts-ignore
    e.dataTransfer.setData('index', e.target.dataset.index);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  /** 拖拽到该区域 */
  const onDrop = (e: React.DragEvent) => {
    alert(e.dataTransfer.getData('index'));
  };

  return (
    <div className="demo">
      <h3>Demo1 - 基础拖拽</h3>
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

export default Demo1;
