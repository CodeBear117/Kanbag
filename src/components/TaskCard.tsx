// import dependencies
import BinIcon from "../icons/BinIcon";
import { Id, Task } from "../types";
import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// assign types for the props of this component
interface Props {
  task: Task;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

// This component defines a single task card
const TaskCard = ({ task, deleteTask, updateTask }: Props) => {
  // state for mouse hover over/out of task card
  const [mouseIsOver, setMouseIsOver] = useState(false);

  // state for editing task card
  const [editMode, setEditMode] = useState(false);

  // functionality desctructed from useSortable hook to enable dragging tasks. Identifiers set for data retreival.
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id, // set the id property to the task id
    data: {
      type: "Task", // set the data property to Task and the task state
      task,
    },
    disabled: editMode, // set the disabled property to the editmode state
  });

  // define a custom style. This style allows the column to look like it is overlapping other columns as it is being dragged
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // function to toggle between editing a task card and static
  const toggleEditMode = () => {
    // invert editMode's current state
    setEditMode((prev) => !prev);
    // hide delete icon in editMode - this setting is dictated by the state of setMouseIsOver
    setMouseIsOver(false);
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-mainBackgroundColour 
        p-2.5
        h-[50px] 
        min-h-[50px] 
        items-center 
        flex 
        text-left 
        rounded-xl 
        cursor-grab
        relative
        task
        opacity-30
        border-2
        border-rose-500
        "
      ></div>
    );
  }

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="
    bg-mainBackgroundColour 
    p-2.5
    h-[50px] 
    min-h-[50px] 
    items-center 
    flex 
    text-left 
    rounded-xl 
    hover:ring-2 
    hover:ring-inset 
    hover:ring-rose-500
    cursor-grab
    relative
    "
      >
        <textarea
          value={task.content}
          autoFocus
          placeholder="New Item"
          onBlur={toggleEditMode}
          onKeyDown={(e) => {
            if (e.key === "Enter" && e.shiftKey) toggleEditMode();
          }}
          onChange={(e) => updateTask(task.id, e.target.value)}
          className="
        h-[90%]
        w-full
        resize-none
        border-none
        rounded
        bg-transparent
        text-white
        focus:outline-none
        "
        ></textarea>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={toggleEditMode}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="
  bg-mainBackgroundColour 
  p-2.5
  h-[50px] 
  min-h-[50px] 
  items-center 
  flex 
  text-left 
  rounded-xl 
  hover:ring-2 
  hover:ring-inset 
  hover:ring-rose-500
  cursor-grab
  relative
  task
  "
    >
      <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
        {task.content}
      </p>

      {mouseIsOver && (
        <button
          onClick={() => deleteTask(task.id)}
          className="
        stroke-white 
        absolute 
        right-4 
        top-1/2-translate-y-1/2
        bg-columnBackgroundColour 
        p-2 
        rounded
        opacity-40
        hover:opacity-100
        "
        >
          <BinIcon />
        </button>
      )}
    </div>
  );
};

export default TaskCard;
