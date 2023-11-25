/**
 * Returns the width and height of the screen.
 *
 * @return {object} An object containing the width and height of the screen.
 */
export const useScreenSize = () => {
  try {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    };
  } catch (e) {
    return {
      width: 0,
      height: 0,
    };
  }
};
