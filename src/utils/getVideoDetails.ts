export {};
// import { VideoDetails } from '../types/Video';
// import SparkMD5 from 'spark-md5';

// // TODO: fix hash stutter
// export const getVideoDetails = (file: File) => {
//   // return promise
//   return new Promise<VideoDetails>(async (resolve, reject) => {
//     let fileDetails: VideoDetails;

//     const getHash = () => {
//       // TODO use getHash.ts after done with everything
//       return new Promise<string>((resolve, reject) => {
//         resolve(SparkMD5.hash('BAD MAN'));
//       });
//     };

//     const getLength = () => {
//       return new Promise<number>((resolve) => {
//         const video = document.createElement('video');
//         video.preload = 'metadata';

//         video.onloadedmetadata = function () {
//           window.URL.revokeObjectURL(video.src);
//           const duration = video.duration;
//           resolve(duration);
//         };

//         video.src = URL.createObjectURL(file);
//       });
//     };

//     try {
//       const [hash, length] = await Promise.all([getHash(), getLength()]);
//       // const [hash, length] = await Promise.all([allHash(), getLength()]);

//       fileDetails = {
//         url: URL.createObjectURL(file),
//         size: file.size,
//         hash: hash,
//         length: length,
//       };

//       resolve(fileDetails);
//     } catch (err) {
//       // no rejects in promises, here just to be safe
//       reject(err);
//     }
//   });
// };
