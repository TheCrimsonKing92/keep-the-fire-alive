import { AsyncStorage } from 'react-native'
import { FIRE_MAX_HEALTH, SAVE_KEY } from '../Constants';

const DEFAULT_FIRE = {
  current: FIRE_MAX_HEALTH,
  max: FIRE_MAX_HEALTH
};

const DEFAULT_PLAYER = {
  hasName: false,
  name: ''
};

const DEFAULT_TICKS = {
  fire: {
    current: 0,
    max: 100
  },
  freeze: {
    current: 0,
    max: 300
  },
  save: {
    current: 0,
    max: 10
  }
};

const DEFAULT_DATA = {
  player: DEFAULT_PLAYER,
  fire: DEFAULT_FIRE,
  ticks: DEFAULT_TICKS
};

export const clearData = () => {
  return AsyncStorage.removeItem(SAVE_KEY);
};

const getDataInternal = () => {
  return AsyncStorage.getItem(SAVE_KEY);
};

export const getDefault = () => {
  return DEFAULT_DATA;
};

export const getData = async () => {
  try {
    const response = await getDataInternal();
    if (response === null) {
      console.info('Queried storage but no data to be found. Returning default.');
      return DEFAULT_DATA;
    }
    return JSON.parse(response);
  } catch (e) {
    console.error('Could not retrieve and parse data with error: ', e);
    return DEFAULT_DATA;
  }
};

export const getFire = async () => {
  try {
    const data = await getData();
    if (!data.fire) {
      console.info('Retrieved data but no fire to be found. Returning default');
      return DEFAULT_FIRE;
    }
    return data.fire;
  } catch (e) {
    console.error('Could not retrieve and parse fire data with error: ', e);
    return DEFAULT_FIRE;
  }
}

export const getPlayer = async () => {
  try {
    const data = await getData();
    if (!data.player) {
      console.info('Retrieved data but no player to be found. Returning default.');
      return DEFAULT_PLAYER;
    }
    return data.player;
  } catch (e) {
    console.error('Could not retrieve and parse player data with error: ', e);
    return DEFAULT_PLAYER;
  }
}

export const getSave = async () => {
  try {
    const ticks = await getTicks();
    return ticks.save;
  } catch (e) {
    console.error('Could not return save ticks with error: ', e);
    return DEFAULT_TICKS.save;
  }
}

export const getTicks = async () => {
  try {
    const data = await getData();
    if (!data.ticks) {
      console.info('Retrieved data but no ticks to be found. Returning default.');
      return DEFAULT_TICKS;
    }
    return data.ticks;
  } catch (e) {
    console.error('Could not retrieve and parase ticks data with error: ', e);
    return DEFAULT_TICKS;
  }
}

export const setData = data => {
  return AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

export const setFire = async fire => {
  try {
    const current = await getData();
    const next = {
      ...current,
      fire
    };
    await setData(next);
    Promise.resolve();
  } catch (e) {
    console.error('Could not set fire with error: ', e);
    Promise.reject();
  }
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

export const setSave = async save => {
  try {
    const current = await getTicks();
    const next = {
      ...current,
      save
    };
    await setTicks(next);
    Promise.resolve();
  } catch (e) {
    console.error('Could not set save with error');
    Promise.reject();
  }
}

export const setSaveFrequency = async max => {
  try {
    const current = await getSave();
    const next = {
      ...current,
      max
    };
    await setSave(next);
    Promise.resolve();
  } catch (e) {
    console.error('Could not set save frequency with error: ', e);
    Promise.reject();
  }
}

export const setTicks = async ticks => {
  try {
    const current = await getData();
    const next = {
      ...current,
      ticks
    };
    await setData(next);
    Promise.resolve();
  } catch (e) {
    console.error('Could not set ticks with error: ', e);
    Promise.reject();
  }
}

export default {
  clearData,
  getData,
  getDefault,
  getFire,
  getPlayer,
  getTicks,
  setData,
  setFire,
  setPlayer,
  setSave,
  setSaveFrequency,
  setTicks
};