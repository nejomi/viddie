import React from 'react';

export interface FilepathContextInterface {
  filepath: string;
  updateFilepath: (s: string) => void;
}

const FilepathContext = React.createContext<FilepathContextInterface>({
  filepath: '',
  updateFilepath: () => {}
});

export default FilepathContext;
