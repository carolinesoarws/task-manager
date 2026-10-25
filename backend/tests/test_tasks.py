from fastapi.testclient import TestClient
import sys
sys.path.append('/Users/carol/Documents/estudos/projetos/task-manager/backend')
from main import app


client = TestClient(app)

def test_list_tasks(): 
    response = client.get("/tasks")
    assert response.status_code == 200


def test_list_tasks_by_id(): 
    response = client.get("/tasks/1")
    assert response.json()["id"] == 1
    assert response.status_code == 200


    response = client.get("/tasks/999")
    assert response.json()["detail"] == "Tarefa não encontrada"
    assert response.status_code == 404
 