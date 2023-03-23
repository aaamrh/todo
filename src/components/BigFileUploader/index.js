import React, { useRef, useState } from "react";

const worker = new Worker("/worker.js");

class ConcurrencyAsync {
  constructor() {
    this.taskMap = new Map();
    this.queue = [];
    this.maxTask = 3;
    this.currentTaskCount = 0; // 当前执行了几个任务
  }

  add(url, method, body, resolve, reject, id) {
    if (!this.taskMap.has(id)) {
      this.taskMap.set(id, []);
    }
    let taskStatus = this.taskMap.get(id);

    taskStatus.push(false); // 当前任务未完成
    const currentTaskIndex = taskStatus.length - 1;

    return new Promise((_resolve) => {
      this.queue.push(() => {
        let start = performance.now();
        this.currentTaskCount++;

        fetch(url, {
          method,
          body: body,
        })
          .then((response) => response.json())
          .then((res) => {
            taskStatus[currentTaskIndex] = true; // 任务完成
            resolve(res);
          })
          .catch(reject)
          .finally(() => {
            this.currentTaskCount--;
            this.run();
            let end = performance.now();
            _resolve((end - start) / 1000); // 计算传输时间
          });

        // setTimeout(() => {
        //   resolve();
        //   this.currentTaskCount--;
        //   this.run();
        // }, Math.random() * 5 * 1000);
      });

      this.run();
    });
  }

  run() {
    while (this.currentTaskCount < this.maxTask && this.queue.length > 0) {
      const task = this.queue.shift();
      task();
    }
  }

}

const concurrencyAsync = new ConcurrencyAsync();
export default function BigFileUploader() {
  const inputRef = useRef(null);
  const [hashProgress, setHashProgress] = useState(0);

  const onFileChange = (e) => {
    const files = e.target.files;
    const file = files[0];

    if (file) {
      const size = file.size;
      let step = 20 * 1024; // 20KB
      let current = 0;

      let index = 1;
      const chunks = [];
      while (current < size) {
        const chunk = file.slice(current, current + step);
        console.log(`切片${index}: `, chunk);

        chunks.push(chunk);

        current += step;
        index++;
      }

      // 计算文件命名
      worker.postMessage(chunks);
      worker.onmessage = async (e) => {
        console.log("主线程，收到 worker 消息", e.data);

        const progress = e.data.progress;
        setHashProgress(progress);

        // 获取道 hash 上传到后端, 并发上传
        if (progress === 100) {
          const hash = e.data.hash;

          // 上传
          const chunksCount = chunks.length;
          while (chunks.length > 0) {
            const chunk = chunks.shift;
            const formData = new FormData();
            formData.append("file", chunk);
            formData.append("ext", "png");
            formData.append("hash", hash);
            formData.append("chunkname", `${hash}-${1}`);
            formData.append("total", chunksCount);

            concurrencyAsync.add(
              "/1",
              "GET",
              formData, // 数据
              (res) => {
                console.log("res", res);
              },
              (err) => {
                console.log("err", err);
              }
            );
          }
        }
      };

      // const fileReader = new FileReader();
      // fileReader.onload = function (e) {
      //   console.log(e, e.target);
      //   console.log(e.target.result);
      // };
      // fileReader.readAsArrayBuffer(new Blob(chunks));
    }
  };

  return (
    <div>
      <h1 style={{ textAlign: "center" }}>大文件上传</h1>

      <p>Hash 计算进度 ： {hashProgress} % </p>

      <div>
        <input
          ref={inputRef}
          type="file"
          onChange={onFileChange}
          accept="image/*"
        />
      </div>
    </div>
  );
}
