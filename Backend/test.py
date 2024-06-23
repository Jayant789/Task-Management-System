from flask import Flask, render_template, request
from connection import connect
from operations import create_task, get_task, update_task, delete_task


app = Flask(__name__)

app.config['SECRET_KEY'] = 'One23'
global client, db

@app.route('/tasks')
def tasks():
    global client
    tasks = client["task-management"].tasks.find()
    return render_template('tasks.html', tasks=tasks)


# Create a new task
@app.route('/tasks', methods=['POST'])
def create_task_route():
    try:
        data = request.get_json()
        resp = create_task(db, data)
        return resp
    except Exception as e:
        return handle_exception(e)

# Get a specific task by ID
@app.route('/tasks/<task_id>', methods=['GET'])
def get_task_by_id_route(task_id):
    try:
        task = get_task(db, task_id)
        return task
    except Exception as e:
        return handle_exception(e)


# Update a task by ID
@app.route('/tasks/<task_id>', methods=['PUT'])
def update_task_route(task_id):
    try:
        data = request.get_json()
        resp = update_task(db, task_id, data)
        return resp
    except Exception as e:
        return handle_exception(e)

# Delete a task by ID
@app.route('/tasks/<task_id>', methods=['DELETE'])
def delete_task_route(task_id):
    try:
        resp = delete_task(db, task_id)
        return resp
    except Exception as e:
        return handle_exception(e)



if __name__ == "__main__":
    client = connect()
    db =  client["task-management"]
    app.run(debug=True)