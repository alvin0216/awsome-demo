---
title: react-context demo
---

```tsx | pure
import React from 'react';
import { useImmerReducer } from 'use-immer';

export const initialState: FRInitialState = {
  widgetList: [], // 数据列表
  template: null, // 组件模板数据
  channelPort1: null,
  validationList: [],
};

type ACTIONTYPE =
  | { type: 'setFR'; payload: Partial<FRInitialState> }
  | { type: 'setWipWidgetIndex'; payload: any } // for example number
  | { type: 'setWidgetList'; payload: WidgetItem[] };

export const FRContext = React.createContext<
  [FRInitialState, React.Dispatch<ACTIONTYPE>]
>([initialState, action => action]);

export const reducer = (state: FRInitialState, action: ACTIONTYPE) => {
  const { type, payload } = action;
  switch (type) {
    // 更新 widgetList
    case 'setWidgetList':
      state.widgetList = payload;
      break;

    default:
  }

  return state;
};

export const FRProvider = ({ children }: any) => {
  const contextValue = useImmerReducer(reducer, initialState); // 初始化数据
  return (
    <FRContext.Provider value={contextValue}>{children}</FRContext.Provider>
  );
};
```
