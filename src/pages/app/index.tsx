import { Task } from "@prisma/client";
import { GetServerSideProps } from "next";
import { FormEvent, useState } from "react";
import { prisma } from "../../lib/prisma";

type TasksProps = {
  tasks: Task[]
}
//dafault prisma create typescript
//export default function app({ tasks }) {
export default function app({ tasks }: TasksProps) {  
  const [newTask, setNewTask] = useState("");

  async function handleCreateTask (event: FormEvent) {
    event.preventDefault();

    await fetch('http://localhost:3000/api/tasks/create',{
      method: 'POST',
      body: JSON.stringify({title: newTask}),
      headers: {'Content-Type': 'application/json'}
    })
  }

  return (
    <div>
      <ul>
        {tasks.map(task => 
          <li className="text-4xl" key={task.id}>{task.title}</li>)}
      </ul>
      <form action="" onSubmit={handleCreateTask}>
        <input type="text" value={newTask} onChange={e => setNewTask(e.target.value)}></input>
        <button type="submit">Create Task</button>
      </form>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tasks = await prisma.task.findMany()
  // ({
  //   where: {
  //     isDone: true,
  //     title: {
  //       contains: 'task'
  //     }
  //   }
  // });
//  console.log(tasks);

  const data = tasks.map(task => { 
    return {
      id: task.id,
      title: task.title,
      isdone: task.isDone,
      date: task.createdAt.toISOString(),
    }
  })

  return {
    props: {tasks: data}
  }
}

