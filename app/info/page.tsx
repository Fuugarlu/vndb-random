import BackButton from "../components/BackButton";
import GitHubLink from "../components/GitHubLink";
import RedditLink from "../components/RedditLink";

export default function InfoPage() {
  return (
    <div className="w-2/3 mx-auto text-center justify-items-center content-center bg-blue-200 p-3 rounded-md my-2 flex flex-col">
      <BackButton />
      <p className="text-lg mb-3">Random VNDB Grabber by Fuugarlu</p>

<div className="flex flex-col gap-1">
      <p>Any issues or suggestions? Let me know!</p>
      <GitHubLink /> 
      <RedditLink />
      <p className="mt-5">The GitHub link includes a changelog.</p>
      </div>
      
    </div>
  );
};
