import React from 'react';

const IframeComponent = ({ width = "560", height = "315", title = "YouTube video player" }) => {
  return (
    <iframe
      src="https://www.youtube.com/embed/H7u6DMRKaiY?si=aoJLDm2yQ2WaUa7x&autoplay=1&loop=1&playlist=H7u6DMRKaiY" 
      width={width}
      height={height}
      title={title}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
      style={{ border: "none" }}
    />
  );
};

export default IframeComponent;