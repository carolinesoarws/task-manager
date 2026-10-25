
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)

class TaskInput(BaseModel):
    title: str
    done: bool = False

class TaskPatch(BaseModel):
    title: str | None = None
    done: bool | None = None

tasks = [
    {"id": 1, "title": "Estudar React", "done": False},
    {"id": 2, "title": "Criar API", "done": True},
]
next_id = 3


@app.get("/tasks")
def list_tasks():
    return tasks


@app.post("/tasks", status_code=201)
def create_task(task: TaskInput):
    global next_id

    new_task = {"id": next_id, **task.model_dump()}
    tasks.append(new_task)
    next_id += 1

    return new_task


@app.put("/tasks/{task_id}")
def replace_task(task_id: int, task: TaskInput):
    for index, existing in enumerate(tasks):
        if existing["id"] == task_id:
            updated = {"id": task_id, **task.model_dump()}
            tasks[index] = updated
            return updated

    raise HTTPException(status_code=404, detail="Tarefa não encontrada")


@app.patch("/tasks/{task_id}")
def update_task(task_id: int, patch: TaskPatch):
    changes = patch.model_dump(exclude_unset=True)

    if "title" in changes and changes["title"] is None:
        raise HTTPException(status_code=422, detail="Título inválido")
    if "done" in changes and changes["done"] is None:
        raise HTTPException(status_code=422, detail="Status inválido")

    for task in tasks:
        if task["id"] == task_id:
            task.update(changes)
            return task

    raise HTTPException(status_code=404, detail="Tarefa não encontrada")


@app.delete("/tasks/{task_id}", status_code=204)
def delete_task(task_id: int):
    for index, task in enumerate(tasks):
        if task["id"] == task_id:
            tasks.pop(index)
            return

    raise HTTPException(status_code=404, detail="Tarefa não encontrada")

@app.get("/tasks/{task_id}")
def get_tasks_by_id(task_id: int):
    for task in tasks:
        if task["id"] == task_id:
            return task
    raise HTTPException(status_code=404, detail="Tarefa não encontrada")