import React, { useState, useEffect, useRef } from "react";

export const Panels = ({ url }) => {
  const [frames, setFrames] = useState([{ url }]);
  useEffect(() => {
    const onMessage = e => {
      switch (e.data.type) {
        case "open-child":
          const frame = +e.data.name.substr(6);
          setFrames(frames => [
            ...frames.slice(0, frame + 1),
            {
              url:
                e.data.message && frames.length > frame + 1
                  ? frames[frame + 1].url
                  : e.data.url,
              message: e.data.message
            }
          ]);
          break;
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);
  return (
    <div className="panels">
      {frames.map(({ url, message }, i) => (
        <Panel key={i} url={url} message={message} i={i} />
      ))}
    </div>
  );
};

const Panel = ({ url, message, i }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && message) {
      console.log("posting message");
      ref.current.contentWindow.postMessage(message, new URL(url).origin);
    }
  }, [ref.current, message]);
  return (
    <div className="panel">
      <iframe
        ref={ref}
        name={`panel-${i}`}
        src={url + `&parent=${window.location.origin}`}
        frameBorder="0"
      ></iframe>
    </div>
  );
};
