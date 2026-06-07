// this component shows the quality score circle after a review
const ScoreCard = ({ score }) => {
  const getClass = (s) => {
    if (s >= 80) return "s-great";
    if (s >= 60) return "s-good";
    if (s >= 40) return "s-ok";
    return "s-poor";
  };

  const getLabel = (s) => {
    if (s >= 80) return "Excellent";
    if (s >= 60) return "Good";
    if (s >= 40) return "Needs Work";
    return "Poor Quality";
  };

  return (
    <div className="score-row">
      <div className={`score-ring ${getClass(score)}`}>{score}</div>
      <div className="score-text">
        <h4>{getLabel(score)} Code</h4>
        <p>Quality score out of 100</p>
      </div>
    </div>
  );
};

export default ScoreCard;
