export const getName = () => {
  // should get the name in localstorage in the future
  const randName: string = 'joe_' + (Math.floor(Math.random() * (1000)));

  return randName;
};
