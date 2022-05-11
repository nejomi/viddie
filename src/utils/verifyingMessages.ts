import { VerifyingStatus } from '../types/Types';

const verifyingMessages: {
  [key in Exclude<VerifyingStatus, 'WAITING'>]: string;
} = {
  'HASHING FILE': 'Hashing file',
  'GETTING VIDEO DETAILS': 'Getting video details',
  DONE: 'Waiting for server',
};

export default verifyingMessages;
