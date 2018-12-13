export const lazyKeyMap = (el, i) => ({
  ...el,
  key: id
});

export const randomBool = () => Math.random() >= 0.5;

export const selectRandom = arr => arr[Math.floor((Math.random()*arr.length))];

export default {
  lazyKeyMap,
  randomBool,
  selectRandom
};