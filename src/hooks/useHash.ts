import { useState } from 'react';
import { createMD5 } from 'hash-wasm';

const useHash = () => {
  const [progress, setProgress] = useState(0);

  const getHash = async (file: File) => {
    const chunkSize = 4194304;
    const chunks = Math.floor(file.size / chunkSize);
    const fileReader = new FileReader();

    // init hasher
    const hasher = await createMD5();
    hasher.init();

    function hashChunk(c: Blob) {
      return new Promise<void>((resolve, reject) => {
        fileReader.onload = (e) => {
          if (e.target && e.target.result) {
            const result = e.target.result;
            let view;

            if (typeof result === 'string') {
              view = result;
            } else {
              // result is an array buffer, needs to be IDataType from hash-wasm
              view = new Uint8Array(result);
            }

            hasher.update(view);
            resolve();
          }
        };

        fileReader.readAsArrayBuffer(c);
      });
    }

    for (let i = 0; i <= chunks; i++) {
      const chunkStart = chunkSize * i;
      // slice until the next chunk or end of file
      const chunk = file.slice(
        chunkStart,
        Math.min(chunkSize * (i + 1), file.size)
      );

      const currentProgress = (chunkStart / file.size) * 100;
      setProgress(currentProgress);
      await hashChunk(chunk);
    }

    const hashVal = hasher.digest();
    return hashVal;
  };

  return { progress, getHash };
};
export default useHash;
