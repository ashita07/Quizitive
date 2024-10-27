import { useEffect } from "react";

function Timer({ dispatch, remaining }) {
  const mins = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  useEffect(
    function () {
      const id = setInterval(function () {
        dispatch({ type: "tick" });
      }, 1000);
      return () => clearInterval(id);
    },
    [dispatch]
  );

  return (
    <div className="timer">
      {mins}:{seconds}
    </div>
  );
}

export default Timer;
