import React from "react";
import "./styles.css";

export default function Card(props) {
  const { feed } = props;
  const date = new Date(feed.dateLastEdited);
  return (
    <div className="card-wrapper" key={feed.name}>
      <div className="img">
        <img src={feed.image} width={250} height={250} alt="feed image" />
      </div>
      <div className="meta">
        <div className="name">{feed.name}</div>
        <div className="desc">{feed.description} </div>
        <div className="desc">{date.toString()} </div>
      </div>
    </div>
  );
}
