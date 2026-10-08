const STAGE_TALK_KEY = 'waf_stage_talk_index';

/** Reads the line the stage was on, so a reloaded laptop tab resumes the talk. -1 means not started. */
export const readStageTalkIndex = (lineCount: number): number => {
  try {
    const raw = window.sessionStorage.getItem(STAGE_TALK_KEY);
    const parsed = raw === null ? -1 : Number.parseInt(raw, 10);
    return Number.isInteger(parsed) && parsed >= 0 && parsed < lineCount ? parsed : -1;
  } catch {
    return -1;
  }
};

export const writeStageTalkIndex = (index: number): void => {
  try {
    window.sessionStorage.setItem(STAGE_TALK_KEY, String(index));
  } catch {
    // Storage is blocked: the talk still works, it just will not resume after a reload.
  }
};
