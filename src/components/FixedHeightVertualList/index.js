/**
 * 固定高度的虚拟列表
 * 
 * 1. 计算顶部的高度，移动嘴上面的 li 到最下面
 */

import React from "react";

export default function FixedHeightVertualList() {
  const data = (() => {
    const list = [];
    for (let i = 0; i < 100; i++) {
      list.push({ id: i + 1, text: `data ${i + 1}` });
    }
    return list;
  })();

  return (
    <div
      className="box"
      style={{ padding: 100, margin: 100, background: "gold" }}
    >
      <div
        className="parent"
        style={{ padding: 25, margin: 25, background: "orange" }}
      >
        <ul
          className="list-wrap"
          style={{ height: 200, overflow: "auto", background: "yellow" }}
        >
          {data.map((item) => {
            return (
              <li key={item.id} style={{ lineHeight: "20px" }}>
                {item.text}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
