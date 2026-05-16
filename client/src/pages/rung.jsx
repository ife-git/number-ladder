import React from "react";

export default function Rung(props) {
  return (
    <button
      onClick={props.clickRung}
      className={`rung ${props.isFilled ? "filled" : "empty"}`}
      disabled={props.isFilled}
    >
      {!props.isFilled ? (
        <span className="rung-number">{props.rungNumber}</span>
      ) : (
        <span className="rung-value">{props.value}</span>
      )}
    </button>
  );
}
