
const API_URL = "http://localhost:8000";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro HTTP: ${response.status}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTasks() {
  return request("/tasks");
}

export function createTask(title) {
  return request("/tasks", {
    method: "POST",
    body: JSON.stringify({ title, done: false }),
  });
}

export function replaceTask(id, task) {
  return request(`/tasks/${id}`, {
    method: "PUT",
    body: JSON.stringify(task),
  });
}

export function updateTask(id, changes) {
  return request(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deleteTask(id) {
  return request(`/tasks/${id}`, {
    method: "DELETE",
  });
}
