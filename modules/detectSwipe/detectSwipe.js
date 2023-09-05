import { addEventDelegate } from "../../modules/eventDelegate/eventDelegate.js";

export const detectSwipe = ({ target, left, right, up, down } = {}) => {
  let startX = 0,
    startY = 0;

  const handleTouchStart = (target, e) => {
    startX = e.changedTouches[0].screenX;
    startY = e.changedTouches[0].screenY;
  };

  const handleTouchMove = (target, e) => {
    const moveX = e.changedTouches[0].screenX - startX;

    if (moveX > 10 || moveX < -10) {
      // make body overflow hidden
      const body = document.querySelector("body");

      body.style.overflow = "hidden";
    }
  };

  const handleTouchEnd = (target, e) => {
    // make body overflow inherit
    const body = document.querySelector("body");

    body.style.overflow = "inherit";

    const diffX = e.changedTouches[0].screenX - startX;
    const diffY = e.changedTouches[0].screenY - startY;
    const ratioX = Math.abs(diffX / diffY);
    const ratioY = Math.abs(diffY / diffX);
    const absDiff = Math.abs(ratioX > ratioY ? diffX : diffY);

    // Ignore small movements.
    if (absDiff < 30) {
      return;
    }

    if (ratioX > ratioY) {
      if (diffX >= 0) {
        if (left !== undefined) {
          left(target);
        }
      } else {
        if (right !== undefined) {
          right(target);
        }
      }
    } else {
      if (diffY >= 0) {
        if (down !== undefined) {
          down(target);
        }
      } else {
        if (up !== undefined) {
          up(target);
        }
      }
    }
  };

  addEventDelegate("touchstart", target, handleTouchStart);
  addEventDelegate("touchmove", target, handleTouchMove);
  addEventDelegate("touchend", target, handleTouchEnd);
};
