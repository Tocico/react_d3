import React from "react";

class Dialogue extends React.Component {
  setText(data) {
    return (
      <div>
        <p>
          <span className="bold">Client: </span>
          <br></br>
          {data.client}
        </p>
        <p>
          <span className="bold">Start date: </span>
          <br></br>
          {data.startDate}
        </p>
        <p>
          <span className="bold">End date: </span>
          <br></br>
          {data.endDate}
        </p>
        <p>{data.description}</p>
      </div>
    );
  }

  render() {
    const { dialogueIsShown, dialogueInfo } = this.props;
    const data = dialogueInfo;
    const text = data ? this.setText(data) : <div />;

    return (
      <div>
        <div className={dialogueIsShown ? "dialogueBarchart" : "dialogue hidden"}>
          <div className="identification">
            {data ? (
              <img src={data.img} alt={data.name} />
            ) : (
              <i className="fas fa-laptop-code"></i>
            )}
            <div className="spacing x-small"></div>
            <h2>{data ? data.name : ""}</h2>
          </div>
          <div className="information">{text}</div>
        </div>
      </div>
    );
  }
}

export default Dialogue;
