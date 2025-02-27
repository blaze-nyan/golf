"use client";

import { useEffect } from "react";

function CustomLoading() {
  useEffect(() => {
    const img = new window.Image();
    img.src = "/new-golf-loading.gif";
  }, []);

  return (
    <div className="w-16 rounded-full border-2 border-primary">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/new-golf-loading.gif"
        alt="golf loading"
        className="w-16 rounded-full"
      />
    </div>
  );
}
export default CustomLoading;
