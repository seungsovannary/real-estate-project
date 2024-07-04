import React from "react";
import { FaFacebook, FaTelegram } from "react-icons/fa";

const shareOnFacebook = (propertyUrl) => {
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
    propertyUrl
  )}`;
  window.open(facebookShareUrl, "_blank", "width=600,height=400");
};

const shareOnTelegram = (propertyUrl, message) => {
  const telegramShareUrl = `https://t.me/share/url?url=${encodeURIComponent(
    propertyUrl
  )}&text=${encodeURIComponent(message)}`;
  window.open(telegramShareUrl, "_blank", "width=600,height=400");
};

const Share = ({ propertyUrl, message }) => (
  <div className="space-x-4">
    <button
      className="btn btn-primary"
      onClick={() => shareOnFacebook(propertyUrl)}
    >
      <FaFacebook />
      Share on Facebook
    </button>
    <button
      className="btn btn-primary"
      onClick={() => shareOnTelegram(propertyUrl, message)}
    >
      <FaTelegram />
      Share on Telegram
    </button>
  </div>
);

export default Share;
