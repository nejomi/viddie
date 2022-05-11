const getLength = (file: File) => {
  return new Promise<number>((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';

    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      let length = video.duration;
      resolve(length);
    }

    video.src = URL.createObjectURL(file);
  });
};

export default getLength;
