self.importScripts("spark-md5.min.js");

self.onmessage = (e) => {
  console.log("我是 webworker ", e);

  const chunks = e.data;
  const spark = new self.SparkMD5.ArrayBuffer();
  let progress = 0;
  let count = 0;
  const total = chunks.length;

  const loadChunk = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(chunks[index]);
    reader.onload = (e) => {
      count++;

      spark.append(e.target.result);

      if (count === total) {
        self.postMessage({
          progress: 100,
          hash: spark.end(),
        });
      } else {
        self.postMessage({
          progress: (count / total) * 100,
        });

        loadChunk(count);
      }
    };
  };

  loadChunk(0);

  self.postMessage("webworker 数据");
};
