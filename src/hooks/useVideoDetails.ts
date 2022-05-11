import React, { useEffect, useState } from 'react';
import { VideoDetails } from '../types/Types';
import getLength from '../utils/getLength';
import useHash from './useHash';

type Status = 'WAITING' | 'HASHING FILE' | 'GETTING VIDEO DETAILS' | 'DONE';

const statusMessages: {[key in Exclude<Status, 'DONE'>]: string} = {
  'WAITING': 'Waiting for file',
  'HASHING FILE': 'Hashing file',
  'GETTING VIDEO DETAILS': 'Getting video details',
};

const useVideoDetails = () => {
  const [status, setStatus] = useState<Status>('WAITING');
  const { progress, getHash } = useHash();
  const [statusMessage, setStatusMessage] = useState<string>(); 

  useEffect(() => {
    if (status === 'DONE') return;

    setStatusMessage(statusMessages[status]);
  }, [status]);

  const getVideoDetails = async (file: File, hashEnabled: boolean) => {
    setStatus('GETTING VIDEO DETAILS');
    const videoLength = await getLength(file);

    let videoHash = null;
    if (hashEnabled) {
      setStatus('HASHING FILE');
      videoHash = await getHash(file);
    }


    setStatus('DONE');

    const videoDetails: VideoDetails = {
      size: file.size,
      length: videoLength,
      hash: videoHash,
    }

    return (videoDetails);
  };

  return {
    hashProgress: progress,
    status,
    statusMessage,
    getVideoDetails
  };
};

export default useVideoDetails;
