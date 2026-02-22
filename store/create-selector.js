/**
 * Creates a selector factory that automatically generates selectors
 * for all state properties without manual definition
 * @param {Function} store - Zustand store hook
 * @returns {Object} Auto-generated selectors for all store properties
 */
export const createSelector = (store) => {
  return new Proxy(
    {},
    {
      get: (target, prop) => {
        if (typeof prop === 'string') {
          return (state) => state[prop];
        }
        return undefined;
      },
    }
  );
};