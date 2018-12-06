import { AsyncStorage } from 'react-native'
import { SAVE_KEY } from '../Constants';

export const clearData = () => {
  return AsyncStorage.removeItem(SAVE_KEY);
};

export const getData = () => {
  return AsyncStorage.getItem(SAVE_KEY);
};

export const setData = data => {
  return AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export default {
  clearData,
  getData,
  setData
};