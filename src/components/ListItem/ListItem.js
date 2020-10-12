import React from "react";
import "./ListItem.css";
import imagelaceholder from "../../images/icons8-delete.svg";


function ListItem({ incident }) {
  const { title, description, occurred_at, address, media } = incident;
  const hasImage = media["image_url_thumb"],
    placeholderClass = !hasImage ? " img-placeholder" : "";

  const getDateString = (dateMillis) => {
    console.log("apple",dateMillis);
    const date = new Date(parseInt(dateMillis * 1000));
    const dateSpliced = date.toString().slice(0, 15);
    return `${dateSpliced}`;
  }
  
  return (
    <div className="ListItem">
      <div className="ListItem-image-container">
        <img
          src={hasImage || imagelaceholder}
          alt="Bike"
          className={"ListItem-image" + placeholderClass}
        />
      </div>
      <div className="ListItem-details">
        {title && <h2 className="ListItem-title">{title}</h2>}
        {description && <p className="ListItem-description">{description}</p>}
        <div className="ListItem-timestamp">
          <div className="ListItem-stolen">
            <span>{getDateString(occurred_at)}</span>
            <span> - </span>
            <span>{address}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListItem;
