// old handle change on new file
// before changing to webtorrent sync

export function handleChange () {
  return 'uncomment';
}

  // async function handleChange(e: React.FormEvent<HTMLInputElement>) {
  //   e.preventDefault();
  //   setError(null);

  //   const files = e.currentTarget.files;
  //   if (!files || files.length === 0) {
  //     return;
  //   }

  //   if (files.length > 1) {
  //     setError(`You're only allowed to select 1 file.`);
  //     return;
  //   }

  //   if (files.length === 1) {
  //     const file = files[0];

  //     // only mp4
  //     // const allowedTypes = /(\.mp4|\.ogg|\.bmp|\.gif|\.png)$/i;
  //     const allowedTypes = /(\.mp4)$/i;

  //     if (!allowedTypes.exec(file.name)) {
  //       setError('Selected file type is not mp4.');
  //       return;
  //     }

  //     try {
  //       setLoading(true);
  //       const fileDetails = await getVideoDetails(file);

  //       let oldURL;
  //       if (details) {
  //         oldURL = details.url;
  //       }

  //       setDetails(fileDetails);

  //       if (oldURL) {
  //         URL.revokeObjectURL(oldURL);
  //       }
  //     } catch (err) {
  //       if (err instanceof Error) {
  //         setError(err.message);
  //       } else {
  //         console.log(err);
  //       }
  //     }
  //     setLoading(false);
  //   }
  // }