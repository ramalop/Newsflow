import React from "react";

export default function NewsItem(props) {
  const placeholderImg = "https://placehold.co/300x200?text=No+Image";

  return (
    <div className="card my-3">
      <img
        src={props.imageUrl || placeholderImg}
        alt="news"
        className="card-img-top"
        onError={(e) => {
          e.target.onerror = null; // 🔑 prevent infinite loop
          e.target.src = placeholderImg; // 🔄 fallback
        }}
      />
      <div className="card-body">
        <h5 className="card-title">{props.title}</h5>
        <p className="card-text">{props.description}</p>
        <p className="card-text">
          <small className="text-muted">
            By {props.author ? props.author : "Unknown"} on{" "}
            {new Date(props.date).toGMTString()}
          </small>
        </p>
        <a href={props.newsUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-dark">
          Read More
        </a>
      </div>
    </div>
  );
}
