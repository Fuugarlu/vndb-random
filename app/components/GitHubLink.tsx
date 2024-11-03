import React from "react";
import { FaGithub } from "react-icons/fa";

export default function GitHubLink() {
  return (
    <div className="flex items-center justify-center">
      <a
        href="https://github.com/Fuugarlu/vndb-random"
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className="flex items-center text-blue-600 underline hover:text-blue-800">
          <FaGithub className="mr-2 text-xl" /> {/* GitHub icon */}
          GitHub Repository
        </div>
      </a>
    </div>
  );
}
