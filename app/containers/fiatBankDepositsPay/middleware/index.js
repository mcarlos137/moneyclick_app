export function noAction({ dispatch }) {
  return function(next) {
    return function(action) {
      return next(action);
    };
  };
}
