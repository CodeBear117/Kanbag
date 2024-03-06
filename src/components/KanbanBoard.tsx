// import dependencies
import PlusIcon from "../icons/PlusIcon";
import { useState, useMemo } from "react";
import { Column, Id, Task } from "../types";
import ColumnContainer from "./ColumnContainer";
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { createPortal } from "react-dom";
import TaskCard from "./TaskCard";
import WelcomeContainer from "./WelcomeContainer";

const KanbanBoard = () => {
  // set 2 default columns for the app
  const defaultColumns = [
    {
      id: 1,
      title: "Unpacked",
    },
    {
      id: 2,
      title: "Packed",
    },
  ];

  // the <Column[]> in useState declaration indicates the type of the states (Columns Array, defined in type.ts and imported)
  const [columns, setColumns] = useState<Column[]>(defaultColumns);

  const defaultTasks = [
    {
      id: 11,
      columnId: 1,
      content: "Passport",
    },
    {
      id: 12,
      columnId: 1,
      content: "Charger",
    },
  ];

  // state for task cards within the columns
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);

  // This state is used to set the column being dragged. The state's type is either Column or null.
  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  // This state is used to set the taskcard being dragged. The state's type is either Task or null.
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  // create a unique ID for columns/tasks
  const generateId = () => {
    // return a random number beween 1 and 10,000
    return Math.floor(Math.random() * 10001);
  };

  // this function creates a new task/ list item within a column
  const createTask = (columnId: Id) => {
    // create a const of type Task with parameters required by Task type defined in types.ts
    const newTask: Task = {
      id: generateId(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    // set tasks to be current array of tasks with newly created task added
    setTasks([...tasks, newTask]);
  };

  // function to delete a task
  const deleteTask = (id: Id) => {
    // filter tasks array where the task id is not equal to the id of the selected task for deletion
    const newTasks = tasks.filter((task) => task.id !== id);
    // return the array of filtered tasks
    setTasks(newTasks);
  };

  // function to update a task
  const updateTask = (id: Id, content: string) => {
    // for each task in the tasks array
    const newTasks = tasks.map((task) => {
      // if the id of that task is not the selected id, simply return the task unchanged
      if (task.id !== id) return task;
      // else, return the task with new content
      return { ...task, content };
    });
    // set the state of tasks to the new (updated) array of tasks
    setTasks(newTasks);
  };

  // onclick function for creating a new column
  const createNewColumn = () => {
    // create a const of type Column with parameters required by Column type defined in types.ts
    const columnToAdd: Column = {
      id: generateId(),
      title: `Column ${columns.length + 1}`,
    };
    // set columns to array of all current columns as well as this new column
    setColumns([...columns, columnToAdd]);
  };

  // function to handle deleting a column
  const deleteColumn = (id: Id) => {
    // .filter method to filter columns whose Id is not equal to the target deletion col ID.
    const filteredColumns = columns.filter((col) => col.id !== id);
    // set state to remaining columns
    setColumns(filteredColumns);

    // filter for the tasks remaining (not deleted with the column)
    const newTasks = tasks.filter((t) => t.columnId !== id);

    // set tasks array as the filtered list of tasks
    setTasks(newTasks);
  };

  // function to handle updating the title of a column selected column
  const updateColumn = (id: Id, title: string) => {
    // map the columns array such that:
    const newColumns = columns.map((col) => {
      // if the id of the column is not the id of the target/selected column, do nothing
      if (col.id !== id) return col;
      // else return the column with an updated title
      return { ...col, title };
    });
    // set the state of columns to the new columns
    setColumns(newColumns);
  };

  // everytime the columns array changes, we return the columnsId array for all columns in the columns array
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  // function to intercept a user intiating a drag of a column
  const onDragStart = (event: DragStartEvent) => {
    // the parameters of the condition is an identifier from a referenced div in ColumnContainer.tsx
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    }
    // the parameters of the condition is an identifier from a referenced div in TaskCard.tsx
    if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  };

  // function to set the final position of a dragged column where it needs to be placed
  const onDragEnd = (event: DragEndEvent) => {
    // remove drag overlay when the drag is finished
    setActiveColumn(null);
    setActiveTask(null);
    // extract the active and over variables from event (check DragEndEvent)
    const { active, over } = event;
    // if there is no 'over' variable, simply return, becuase it means we are not dragging 'over' another column/element
    if (!over) return;
    // define variables for the ids of active and over elements from the event if they exist
    const activeColumnId = active.id;
    const overColumnId = over.id;
    // if they are equal, it means the element is active over its own original position, therefore dont fo anything
    if (activeColumnId === overColumnId) return;
    // finally if there other if statements are not true, it means the active column is being swapped with another column, therefore:
    setColumns((columns) => {
      // find the index of the active column using its id
      const activeColumnIndex = columns.findIndex(
        (col) => col.id === activeColumnId
      );
      // find the index of the column that is being passed over
      const overColumnIndex = columns.findIndex(
        (col) => col.id === overColumnId
      );
      // helper function from dnd-kit that swaps the active col index with over col index inside the columns array and returning the new array
      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  };

  // this function allows us to handle the dragging of a card over another card such that its new position is saved
  const onDragOver = (event: DragOverEvent) => {
    // extract the active and over variables from event (check DragOverEvent)
    const { active, over } = event;
    // if there is no 'over' variable, simply return, because it means we are not dragging 'over' another column/element
    if (!over) return;
    // define variables for the ids of active and over elements from the event if they exist
    const activeId = active.id;
    const overId = over.id;
    // if they are equal, it means the element is active over its own original position, therefore dont fo anything
    if (activeId === overId) return;

    // case 1: handle dragging cards over other cards

    // variable is true if active's taskcard data property type is "Task" (see TaskCard.tsx)
    const isActiveATask = active.data.current?.type === "Task";
    // variable is true if over's taskcard data property type is "Task" (see TaskCard.tsx)
    const isOverATask = over.data.current?.type === "Task";
    // activate onDragOver even if only dragging a task
    if (!isActiveATask) return;

    // if card is both active and is over a task
    if (isActiveATask && isOverATask) {
      // in this case, swap the tasks
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        // set the active tasks columnId to the target columnId if dragging over another column
        tasks[activeIndex].columnId = tasks[overIndex].columnId;

        // return the rearranged array of tasks
        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    // case 2: handle dragging cards over other columns
    // variable is true if active's column data property type is "Column" (see ColumnContainer.tsx)
    const isOverAColumn = over.data.current?.type === "Column";
    // check if taskcard is active task and is over a column
    if (isActiveATask && isOverAColumn) {
      // in this case, swap the tasks
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        // set the active tasks columnId to the target columnId if dragging over another column
        tasks[activeIndex].columnId = overId;
        // return the rearranged array of tasks, this is done to simply trigger a rerender
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  };

  // The use sensors hook allows us to detect the type of user input
  const sensors = useSensors(
    // detect pointer inputs for distinguishing between clicking or dragging
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3, // 3px meaning input will be recognised as a click unless a click is held down over 3px+ (i.e. dragging)
      },
    })
  );

  return (
    <div
      className="
    m-auto 
    flex 
    min-h-screen 
    items-center 
    overflow-x-auto 
    overflow-y-hidden 
    px-[40px]"
    >
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <WelcomeContainer />
          <div className="flex gap-4">
            {/* Sortable Content allows the elements within it to become draggable */}
            <SortableContext items={columnsId}>
              {/* map each column in the columns array such that each column is a new column container*/}
              {columns.map((col) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  tasks={tasks.filter((task) => task.columnId === col.id)} // only show tasks that belong to this column
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={createNewColumn}
            className="
            h-[60px] 
            w-[350px] 
            min-w-[350px] 
            cursor-pointer 
            rounded-lg 
            bg-mainBackgroundColour 
            border-2 
            border-columnBackgroundColour 
            p-4 
            ring-rose-500 
            hover:ring-2 
            flex 
            gap-2"
          >
            <PlusIcon />
            Add Column
          </button>
          {/* We use an overlay so that we don't affect the original position and layout of the element that would happen if we just dragged the original element */}
          {createPortal(
            <DragOverlay>
              {activeColumn && (
                <ColumnContainer
                  column={activeColumn}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id
                  )} // only show tasks that belong to this column
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
              {activeTask && (
                <TaskCard
                  task={activeTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                />
              )}
            </DragOverlay>,
            document.body
          )}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
