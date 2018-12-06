import { AsyncStorage } from 'react-native'
import { SAVE_KEY } from '../Constants';

const DEFAULT_PLAYER = {
  count: 0,
  fire: 10,
  hasName: false,
  name: ''
};
const DEFAULT_SETTINGS = {
  saveTicks: 600
};

const DEFAULT_DATA = {
  player: DEFAULT_PLAYER,
  settings: DEFAULT_SETTINGS
};

export const clearData = () => {
  return AsyncStorage.removeItem(SAVE_KEY);
};

const getDataInternal = () => {
  return AsyncStorage.getItem(SAVE_KEY);
};

export const getData = async () => {
  try {
    const response = await getDataInternal();
    if (response === null) {
      console.warn('Queried storage but no data to be found. Returning default.');
      return DEFAULT_DATA;
    }
    return JSON.parse(response);
  } catch (e) {
    console.error('Could not retrieve and parse data with error: ', e);
    console.log('Returning default');
    return DEFAULT_DATA;
  }
};

export const getPlayer = async () => {
  try {
    const data = await getData();
    if (!data.player) {
      console.warn('Retrieved data but no player to be found. Returning default.');
      return DEFAULT_PLAYER;
    }
    return data.player;
  } catch (e) {
    console.error('Could not retrieve and parse player data with error: ', e);
    console.log('Returning default');
    return DEFAULT_PLAYER;
  }
}

export const getSettings = async () => {
  try {
    const data = await getData();
    if (!data.settings) {
      console.warn('Retrieved data but no settings to be found. Returning default.');
      return DEFAULT_SETTINGS;
    }
    return data.settings;
  } catch (e) {
    console.error('Could not retrieve and parse settings data with error: ', e);
    console.log('Returning default');
    return DEFAULT_SETTINGS;
  }
} 

export const setData = data => {
  return AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export const setPlayer = async player => {
  try {
    const current = await getData();
    const next = {
      ...current,
      player
    };
    await setData(next);
    Promise.resolve();
  } catch (e) {
    console.error('Could not set player with error: ', e);
    Promise.reject();
  }
}

export const setSettings = async settings => {
  try {
    const current = await getData();
    const next = {
      ...current,
      settings
    };
    await setData(next);
    Promise.resolve();
  } catch (e) {
    console.error('Could not set settings with error: ', e);
    Promise.reject();
  }
}

export default {
  clearData,
  getData,
  getPlayer,
  getSettings,
  setData,
  setPlayer,
  setSettings
};