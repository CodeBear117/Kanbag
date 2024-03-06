// This component defines a column within the Kanban Board

// import dependencies
import { SortableContext, useSortable } from "@dnd-kit/sortable";
import BinIcon from "../icons/BinIcon";
import { Column, Id } from "../types";
import { CSS } from "@dnd-kit/utilities";
import { useState, useMemo } from "react";
import PlusIcon from "../icons/PlusIcon";
import { Task } from "../types";
import TaskCard from "./TaskCard";

// assign types for props used in this component
interface Props {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  tasks: Task[];
  createTask: (columnId: Id) => void;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}
const ColumnContainer = (props: Props) => {
  // destructure/extract functions and states from props
  const {
    column,
    deleteColumn,
    updateColumn,
    tasks,
    createTask,
    deleteTask,
    updateTask,
  } = props;

  // This state is used to set the column being editted (e.g. title, cards etc)
  const [editMode, setEditMode] = useState(false);

  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  // functionality desctructed from useSortable hook to enable dragging columns. Identifiers set for data retreival.
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id, // set the id proerty to the column id
    data: {
      type: "Column", // set the data property to Column and the column state
      column,
    },
    disabled: editMode, // set the disabled property to the editmode state
  });

  // define a custom style. This style allows the column to look like it is overlapping other columns as it is being dragged
  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  // if the column is being dragged, return a custom style to denote that columns original position
  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-columnBackgroundColour w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-50 border border-rose-500"
      ></div>
    );
  }

  return (
    <div
      ref={
        setNodeRef
      } /* Ref sets the reference of this div so that it can be identified elsewhere - used in KanbanBoard.tsx */
      style={style}
      className="bg-columnBackgroundColour w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col"
    >
      {/* Column title */}
      <div
        {...attributes}
        {...listeners}
        onClick={() => {
          setEditMode(true);
        }}
        className="
      bg-mainBackgroundColour 
      text-md 
      h-[60px] 
      cursor-grab 
      rounded-md 
      rounded-b-none 
      p-3 
      font-bold 
      border-columnBackgroundColour 
      border-4
      flex
      items-center
      justify-between
      "
      >
        <div className="flex gap-2">
          {!editMode && column.title}
          {editMode && (
            <input // update column title
              className="bg-black focus:border-rose-500 border rounded outline-none px-2"
              value={column.title}
              onChange={(e) => {
                updateColumn(column.id, e.target.value);
              }}
              autoFocus
              onBlur={() => {
                setEditMode(false); // stop edit mode if clicked somewhere else
              }}
              onKeyDown={(e) => {
                if (e.key !== "Enter") return;
                setEditMode(false); // stop edit mode if enter is pressed
              }}
            />
          )}
        </div>
        <button
          onClick={() => {
            deleteColumn(column.id);
          }}
          className="
        stroke-gray-500 
        hover:stroke-white 
        hover:bg-columnBackgroundColour 
        rounded 
        px-1 
        py-2
        "
        >
          <BinIcon />
        </button>
      </div>
      {/* Column task container */}
      <div className="flex flex-grow flex-col gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <SortableContext items={tasksIds}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              deleteTask={deleteTask}
              updateTask={updateTask}
            />
          ))}
        </SortableContext>
      </div>
      {/* Column footer*/}
      <button
        onClick={() => {
          createTask(column.id);
        }}
        className="
      flex 
      gap-2 
      items-center 
      border-columnBackgroundColour 
      mounded-md 
      p-4 
      border-x-columnBackgroundColour 
      hover:bg-mainBackgroundColour 
      hover:text-rose-500 
      active:bg-black
      "
      >
        <PlusIcon />
        Add task
      </button>
    </div>
  );
};

export default ColumnContainer;
