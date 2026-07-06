const STORAGE_PREFIX = 'carenest:';

export const sessionStorageAdapter = {
  /**
   * @param {string} key
   * @returns {string | null}
   */
  get(key) {
    try {
      return sessionStorage.getItem(`${STORAGE_PREFIX}${key}`);
    } catch {
      return null;
    }
  },

  /**
   * @param {string} key
   * @param {string} value
   */
  set(key, value) {
    try {
      sessionStorage.setItem(`${STORAGE_PREFIX}${key}`, value);
    } catch {
      // Storage unavailable
    }
  },

  /**
   * @param {string} key
   */
  remove(key) {
    try {
      sessionStorage.removeItem(`${STORAGE_PREFIX}${key}`);
    } catch {
      // Storage unavailable
    }
  },

  clear() {
    try {
      const keysToRemove = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach((key) => sessionStorage.removeItem(key));
    } catch {
      // Storage unavailable
    }
  },
};
