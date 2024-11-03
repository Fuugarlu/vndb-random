import React from "react";
import { FaReddit } from "react-icons/fa";

export default function RedditLink() {
  return (
    <div className="flex items-center justify-center">
      <a
        href="https://www.reddit.com/user/Fuugarlu/"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center text-blue-600 underline hover:text-blue-800">
          <FaReddit className="mr-2 text-xl" /> {/* Reddit icon */}
          Reddit
        </div>
      </a>
    </div>
  );
}
