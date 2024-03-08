import AssistantIcon from "../icons/AssistantIcon";
import AssistantArea from "./AssistantArea";
import React, { useState } from "react";

const WelcomeContainer = () => {
  // state for destination input field
  const [destination, setDestination] = useState("");

  // state for departure date input field
  const [departureDate, setDepartureDate] = useState("");

  // state for travel time input field
  const [daysOfTravel, setDaysOfTravel] = useState("");

  // handle destination input
  const handleDestinationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDestination(e.target.value);
  };

  // handle departure date input
  const handleDepartureDateChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setDepartureDate(e.target.value);
  };

  // hanle days of travel input
  const handleDaysOfTravelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDaysOfTravel(e.target.value);
  };

  return (
    <div
      className="
      flex flex-col
      h-[500px]
      max-h-[500px]
      w-[350px]
      min-w-[350px]
      rounded-lg
      bg-columnBackgroundColour
      border-2
      border-rose-500
      p-2
      gap-2
      overflow-hidden
  "
    >
      <div
        className="
      text-md 
      rounded-md 
      p-3
      font-bold
      bg-rose-500
      bg-opacity-10
      text-rose-500
      "
      >
        Welcome to KanBag
      </div>

      <div
        className="
      text-xs
      rounded-md 
      p-3
      bg-opacity-10
      bg-rose-500
      mb-3
      "
      >
        Use this trip packing kanban board to make sure you haven't forgotten to
        pack anything. <br />
        <br /> Happy holidays!
      </div>

      <div className="flex justify-between items-center text-xs pl-3">
        <label>Destination:</label>
        <input
          value={destination}
          onChange={(e) => {
            handleDestinationChange(e);
          }}
          type="text"
          className="
        bg-mainBackgroundColour
        focus:border-rose-500 
        border 
        border-mainBackgroundColour 
        rounded-md 
        outline-none 
        p-2
        "
        />
      </div>

      <div className="flex justify-between items-center text-xs pl-3">
        <label>Departure Date:</label>
        <input
          value={departureDate}
          onChange={(e) => {
            handleDepartureDateChange(e);
          }}
          type="date"
          className="
        bg-mainBackgroundColour 
        focus:border-rose-500 border 
        border-mainBackgroundColour 
        rounded-md 
        outline-none 
        p-2
        "
        />
      </div>

      <div className="flex justify-between items-center text-xs pl-3">
        <label>Days of Travel:</label>
        <input
          value={daysOfTravel}
          onChange={(e) => {
            handleDaysOfTravelChange(e);
          }}
          type="number"
          className="
        bg-mainBackgroundColour 
        focus:border-rose-500 
        border 
        border-mainBackgroundColour 
        rounded-md 
        outline-none 
        p-2
        "
        />
      </div>

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
      </div>

      <div
        className="
       flex-grow
       text-xs
       rounded-md
       p-3
       font-bold
       bg-rose-500
       bg-opacity-10
       text-rose-500
       overflow-auto
     "
        style={{
          minHeight: "calc(20px)" /* Adjust for margin requirements */,
        }}
      >
        <AssistantArea
          destination={destination}
          departureDate={departureDate}
          daysOfTravel={daysOfTravel}
        />
      </div>
    </div>
  );
};

export default WelcomeContainer;
