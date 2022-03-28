import WebTorrent from 'webtorrent';

const client = new WebTorrent();
export default client;
// export const client = new WebTorrent({
//   tracker: {
//     rtcConfig: {
//       iceServers: [
//         {
//           url: 'stun:global.stun.twilio.com:3478?transport=udp',
//           urls: 'stun:global.stun.twilio.com:3478?transport=udp',
//         },
//         {
//           url: 'turn:global.turn.twilio.com:3478?transport=udp',
//           username:
//             'fcd2113f299b17c7189c1d915a3544093ae7136d70e694995318604314ab8431',
//           urls: 'turn:global.turn.twilio.com:3478?transport=udp',
//           credential: 'FWifwkUji0bm+/jtkRdjappvDPqFVe9aZKBKnigiyOI=',
//         },
//         {
//           url: 'turn:global.turn.twilio.com:3478?transport=tcp',
//           username:
//             'fcd2113f299b17c7189c1d915a3544093ae7136d70e694995318604314ab8431',
//           urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
//           credential: 'FWifwkUji0bm+/jtkRdjappvDPqFVe9aZKBKnigiyOI=',
//         },
//         {
//           url: 'turn:global.turn.twilio.com:443?transport=tcp',
//           username:
//             'fcd2113f299b17c7189c1d915a3544093ae7136d70e694995318604314ab8431',
//           urls: 'turn:global.turn.twilio.com:443?transport=tcp',
//           credential: 'FWifwkUji0bm+/jtkRdjappvDPqFVe9aZKBKnigiyOI=',
//         },
//       ],
//       sdpSemantics: 'unified-plan',
//       bundlePolicy: 'max-bundle',
//       iceCandidatePoolsize: 1,
//     },
//   },
// });
