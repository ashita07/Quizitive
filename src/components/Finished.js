function Finished({ points, maxPoints, highscore, dispatch }) {
  const percent = (points / maxPoints) * 100;

  let emoji;
  if (percent === 100) emoji = "🤩";
  if (percent >= 80 && percent < 100) emoji = "⭐";
  if (percent >= 60 && percent < 80) emoji = "❤️";
  if (percent >= 40 && percent < 60) emoji = "😐";
  if (percent < 40) emoji = "😔";

  return (
    <>
      <p className="result">
        You Scored <strong>{points}</strong> out of {maxPoints}{" "}
        <span>{emoji}</span>( {Math.ceil(percent)}%)
      </p>
      <p className="highscore">Highscore: {highscore} points</p>
      <button
        className="btn btn-ui"
        onClick={() => dispatch({ type: "reset" })}
      >
        Reset Quiz
      </button>
    </>
  );
}

export default Finished;
