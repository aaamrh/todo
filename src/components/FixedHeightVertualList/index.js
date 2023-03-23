/**
 * 固定高度的虚拟列表
 *
 * 1. 计算顶部的高度，移动嘴上面的 li 到最下面
 */

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";

const data = (() => {
  const list = [];
  for (let i = 0; i < 100; i++) {
    list.push({ id: i + 1, text: `data ${i + 1}` });
  }
  return list;
})();

export default function FixedHeightVertualList() {
  const showCounts = 10;
  const bufferCounts = 1;
  const itemHeight = 40;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [show, setShow] = useState(
    data.slice(currentIndex, showCounts + bufferCounts)
  );

  // const lock = useRef(false);

  const onScroll = (e) => {
    const passedHeight = e.target.scrollTop;
    if (passedHeight !== undefined) {
      const viewportFirstItemIndex = Math.floor(passedHeight / itemHeight);
      if (viewportFirstItemIndex !== currentIndex) {
        setCurrentIndex(viewportFirstItemIndex);
      }
    }
  };

  useEffect(() => {
    const newShow = data.slice(
      currentIndex,
      currentIndex + showCounts + bufferCounts
    );
    setShow(newShow);
  }, [currentIndex]);

  return (
    <div
      className="box"
      style={{ padding: 100, margin: 100, background: "gold" }}
    >
      <div
        className="viewport"
        style={{
          height: showCounts * itemHeight, // 一条数据高20
          // 下面样式不重要
          margin: 25,
          overflowY: "auto",
          overflowX: "hidden",
          background: "orange",
        }}
        onScroll={onScroll}
      >
        <ul
          className="list-wrap"
          style={{
            height: data.length * itemHeight,
            // 下面样式不重要
            background: "yellow",
            fontSize: 0,
            position: "relative",
          }}
        >
          {show.map((item, index) => {
            return (
              <li
                key={item.id}
                style={{
                  lineHeight: `${itemHeight}px`,
                  fontSize: 16,
                  willChange: "transform",
                  transform: `translate3d(0, ${
                    itemHeight * currentIndex
                  }px, 0)`,
                }}
              >
                {item.text}
              </li>
              // 1. absolute
              // <li
              // key={item.id}
              // style={{
              //   lineHeight: `${itemHeight}px`,
              //   fontSize: 16,
              //   position: "absolute",
              //   width: "100%",
              //   top: `${itemHeight * (currentIndex + index)}px`,
              // }}
              // >
              // {item.text}
              // </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
