
import { useEffect, useState } from "react";
import {
  getTasks,
  createTask,
  replaceTask,
  updateTask,
  deleteTask,
} from "./api/tasks";

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  async function loadTasks() {
    const data = await getTasks();
    setTasks(data);
  }

  useEffect(() => {
    let active = true;

    getTasks()
      .then(data => {
        if (active) setTasks(data);
      })
      .catch(() => {
        if (active) setError("Erro ao carregar tarefas");
      });

    return () => {
      active = false;
    };
  }, []);

  async function handleAdd(event) {
    event.preventDefault();
    if (!title.trim()) return;

    try {
      setError("");
      await createTask(title.trim());
      setTitle("");
      await loadTasks();
    } catch {
      setError("Erro ao adicionar tarefa");
    }
  }

  async function handleToggle(task) {
    try {
      setError("");
      await updateTask(task.id, { done: !task.done });
      await loadTasks();
    } catch {
      setError("Erro ao atualizar tarefa");
    }
  }

  async function handleEdit(task) {
    const newTitle = window.prompt("Novo título:", task.title);

    if (newTitle === null || !newTitle.trim()) return;

    try {
      setError("");
      await replaceTask(task.id, {
        title: newTitle.trim(),
        done: task.done,
      });
      await loadTasks();
    } catch {
      setError("Erro ao editar tarefa");
    }
  }

  async function handleDelete(id) {
    try {
      setError("");
      await deleteTask(id);
      await loadTasks();
    } catch {
      setError("Erro ao excluir tarefa");
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: "40px auto" }}>
      <h1>Minhas tarefas</h1>

      <form onSubmit={handleAdd}>
        <input
          value={title}
          onChange={event => setTitle(event.target.value)}
          placeholder="Digite uma tarefa"
        />
        <button type="submit">Adicionar</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.done}
              onChange={() => handleToggle(task)}
            />

            <span>{task.title}</span>{" "}

            <button onClick={() => handleEdit(task)}>
              Editar
            </button>

            <button onClick={() => handleDelete(task.id)}>
              Excluir
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
