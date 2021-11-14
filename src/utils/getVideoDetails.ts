import md5 from 'crypto-js/md5';
import { VideoDetails } from '../types/Video';

export const getVideoDetails = (file: File) => {
  // return promise
  return new Promise<VideoDetails>(async (resolve, reject) => {
    // only mp4
    // const allowedTypes = /(\.mp4|\.ogg|\.bmp|\.gif|\.png)$/i;
    const allowedTypes = /(\.mp4)$/i;

    if (!allowedTypes.exec(file.name)) {
      reject(new Error('Selected file type is not mp4.'));
      return;
    }

    let fileDetails: VideoDetails;

    const getHash = () => {
      // only 10mb
      const bufferSize = Math.pow(1024, 2) * 10;
      // last10Mb
      const filePartial = file.slice(file.size - bufferSize, file.size);
      const temporaryFileReader = new FileReader();

      return new Promise<string>((resolve, reject) => {
        temporaryFileReader.onerror = () => {
          temporaryFileReader.abort();
          reject(new DOMException('Problem parsing input file.'));
        };

        temporaryFileReader.onload = (event) => {
          if (event && event.target) {
            const binary = event.target.result;
            if (typeof binary === 'string') {
              const partialHash = md5(binary).toString();
              resolve(partialHash);
            }
          }
        };

        temporaryFileReader.readAsBinaryString(filePartial);
      });
    };

    const getLength = () => {
      return new Promise<number>((resolve, reject) => {
        const video = document.createElement('video');
        video.preload = 'metadata';

        video.onloadedmetadata = function () {
          window.URL.revokeObjectURL(video.src);
          const duration = video.duration;
          resolve(duration);
        };

        video.src = URL.createObjectURL(file);
      });
    };

    try {
      const [partialHash, length] = await Promise.all([getHash(), getLength()]);

      fileDetails = {
        url: URL.createObjectURL(file),
        size: file.size,
        hash: partialHash,
        length: length,
      };

      resolve(fileDetails);
    } catch (err) {
      // no rejects in promises, here just to be safe
      reject(err);
    }
  });
};
