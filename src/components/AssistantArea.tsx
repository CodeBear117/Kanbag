// This component outputs the recommendations and suggestions of a GPT instance based on the user inputted packing list and trip details

// how does that work?

// The GPT model needs data
// The data comes from the trip detail values
// The data is aggregated into a JSON file with a general prompt and concatenated, named arrays of list items for each column defined by the user.
// The model would use this as a prompt and return suggested packing items (2-3 at any one time, continuously updating) based on the the JSON
// The output will be used to automatically generate task cards in the Asistant Area which the user can drag and drop in the column of their choice
import ChatGPT from "./ChatGPT";

interface Props {
  destination: string;
  departureDate: string;
  daysOfTravel: string;
}

const AssistantArea: React.FC<Props> = ({
  destination,
  departureDate,
  daysOfTravel,
}) => {
  return (
    <div>
      Assistant Area {destination} {departureDate} {daysOfTravel}
      <ChatGPT />
    </div>
  );
};

export default AssistantArea;
