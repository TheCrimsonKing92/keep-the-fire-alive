export const lazyKeyMap = (el, i) => ({
  ...el,
  key: id
});

export const selectRandom = arr => arr[Math.floor((Math.random()*arr.length))];

export default {
  lazyKeyMap,
  selectRandom
};