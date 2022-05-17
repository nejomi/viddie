// import { formatDistance } from 'date-fns';
// import prettyBytes from 'pretty-bytes';
// import { useEffect, useState } from 'react';
// import { unstable_batchedUpdates } from 'react-dom';
// import { type TorrentFile, type Torrent } from 'webtorrent';
// import client from '../utils/webtorrent-client';

// interface Details {
//   name: string;
//   downloadSpeed: string;
//   uploadSpeed: string;
//   progress: number;
//   peers: number;
//   eta: string;
// }

// export const useVideo = () => {
//   const [video, setVideo] = useState<TorrentFile | null>(null);
//   const [loadingTorrent, setLoadingTorrent] = useState(false);
//   const [details, setDetails] = useState<Details | null>();
//   const [torrent, setTorrent] = useState<Torrent | null>(null);

//   console.log('use video');
//   useEffect(() => {
//     if (!magnet) {
//       return;
//     }

//     // reset
//     setTorrent(null);
//     setVideo(null);
//     setDetails(null);
//     setLoadingTorrent(true);

//     client.add(magnet, {
//       announce: ['ws://localhost:8000'],
//     }, function (torrent) {
//       // find the first file that ends with .mp4
//       const video = torrent.files.find(function (file) {
//         return file.name.endsWith('.mp4');
//       });

//       if (video) {
//         // remove this on React 18
//         unstable_batchedUpdates(() => {
//           setVideo(video);
//           setTorrent(torrent);
//           setLoadingTorrent(false);
//         });
//       } else {
//         console.log('No video file');
//       }

//       return () => {
//         client.remove(magnet);
//       };
//     });
//   }, [magnet]);

//   useEffect(() => {
//     console.log('TORRENT EFFECT');
//     if (!torrent) {
//       return;
//     }

//     function updateDetails() {
//       if (!torrent) return;

//       // calculate remaining time
//       let remaining;
//       if (torrent.done) {
//         remaining = 'Done.';
//       } else {
//         remaining =
//           torrent.timeRemaining !== Infinity
//             ? formatDistance(torrent.timeRemaining, 0, {
//                 includeSeconds: true,
//               })
//             : 'Infinity years';
//         remaining =
//           remaining[0].toUpperCase() + remaining.substring(1) + ' remaining.';
//       }

//       setDetails({
//         name: torrent.name,
//         downloadSpeed: prettyBytes(client.downloadSpeed) + '/s',
//         uploadSpeed: prettyBytes(client.uploadSpeed) + '/s',
//         peers: torrent.numPeers,
//         progress: client.progress,
//         eta: remaining,
//       });
//     }
//     const id = setInterval(updateDetails, 1000);

//     return () => {
//       clearInterval(id);
//     }
//   }, [torrent]);

//   return { video, details, loadingTorrent };
// };

