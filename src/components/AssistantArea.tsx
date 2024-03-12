// import dependencies
import AssistantIcon from "../icons/AssistantIcon";
import { useState } from "react";
import axios from "axios";

// set types for props
interface Props {
  destination: string;
  departureDate: string;
  daysOfTravel: string;
}

// extract props
const AssistantArea: React.FC<Props> = ({
  destination,
  departureDate,
  daysOfTravel,
}) => {
  // state for AI response
  const [response, setResponse] = useState("");

  // handle refresh button push
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // prevent page refresh
    e.preventDefault();

    try {
      // post req to Render deployment
      const apiUrl = "https://kanbag.onrender.com";
      const result = await axios.post(apiUrl, {
        prompt: `I am going to ${destination} on ${departureDate} for ${daysOfTravel} days. Suggest some things I might need to pack specific to this destination, time of year and duration. The reponse must be an array of items. Each item must be no more than 4 words long.`,
      });

      // set response state to returned api data
      setResponse(result.data);

      // handle error
    } catch (error) {
      console.error(error);
      setResponse(
        "From GPT component - An error occurred while processing your request."
      );
    }
  };

  return (
    <div className="flex flex-col flex-grow">
      <div
        className="
        flex 
        justify-between 
        items-center 
        bg-opacity-10
      bg-rose-500
        px-3
        py-2
        mt-3
        rounded-md
      "
      >
        <div
          className="
          text-xs
          rounded-md
          flex
          gap-2
          items-center
          "
        >
          <AssistantIcon />
          AI Suggestions
        </div>
        <form onSubmit={handleSubmit}>
          <button
            type="submit"
            className="
            text-xs 
            bg-rose-500 
            hover:bg-rose-700 
            hover:bg-opacity-90
            p-2 
            rounded-md
            "
          >
            Refresh
          </button>
        </form>
      </div>
      <div
        className="
       text-xs
       rounded-md
       px-3
       py-2
       font-bold
       bg-rose-500
       bg-opacity-10
       text-rose-500
       mt-2
       "
      >
        <div className="overflow-auto max-h-[104px]">{response}</div>
      </div>
    </div>
  );
};

export default AssistantArea;
