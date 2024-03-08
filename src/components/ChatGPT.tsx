import React, { useState } from "react";
import axios from "axios";

const ChatGPT = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const result = await axios.post("http://localhost:3001/", {
        prompt: input,
      });
      setResponse(result.data);
    } catch (error) {
      console.error(error);
      setResponse(
        "From GPT component - An error occurred while processing your request."
      );
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label htmlFor="input">Input:</label>
        <input
          type="text"
          id="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Submit</button>
      </form>
      <div>
        <h3>Response:</h3>
        <p>{response}</p>
      </div>
    </div>
  );
};

export default ChatGPT;
