export const DIRT_DELAY = 6000;
export const FIRE_DELAY = 1600;
export const FIRE_MAX_HEALTH = 100;
export const FIRE_MIN_HEALTH = 0;
export const FPS = 60;
export const PLAYER_MAX_HEALTH = 10;
export const PROGRESS_TIME = 200;
export const SAVE_KEY = '@keep-the-fire-alive/save';
export const TEMPERATURE_THRESHOLD = {
  FREEZING: FIRE_MIN_HEALTH,
  CHILLED: 10,
  THAWED: 20,
  WARM: 40,
  HOT: 60
};

export default {
  DIRT_DELAY,
  FIRE_MAX_HEALTH,
  FIRE_MIN_HEALTH,
  FPS,
  PLAYER_MAX_HEALTH,
  PROGRESS_TIME,
  SAVE_KEY,
  TEMPERATURE_THRESHOLD
};