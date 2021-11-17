import SparkMD5 from 'spark-md5';

export const getHash = (file: Blob) => {
  /**
   * code from SparkMD5 documentation
   * TODO change to use hash-wasm instead
   */
  return new Promise<string>(async (resolve, reject) => {
    // read in chunks of 2MB
    const chunkSize = 2097152;
    const blobSlice = File.prototype.slice;
    const chunks = Math.ceil(file.size / chunkSize);
    const spark = new SparkMD5.ArrayBuffer();
    const fileReader = new FileReader();
    let currentChunk = 0;

    fileReader.onerror = () => {
      fileReader.abort();
      reject(new Error('Problem parsing input file.'));
    };

    fileReader.onload = function (e) {
      console.log('read chunk nr', currentChunk + 1, 'of', chunks);
      if (e.target && e.target.result) {
        // append array buffer
        spark.append(e.target.result as ArrayBuffer);
        currentChunk++;

        if (currentChunk < chunks) {
          loadNext();
        } else {
          console.log('finished loading');

          // compute hash
          console.info('computed hash', spark.end());
          resolve(spark.end());
        }
      }
    };

    function loadNext() {
      const start = currentChunk * chunkSize;
      const end =
        start + chunkSize >= file.size ? file.size : start + chunkSize;

      fileReader.readAsArrayBuffer(blobSlice.call(file, start, end));
    }

    loadNext();
  });
};
