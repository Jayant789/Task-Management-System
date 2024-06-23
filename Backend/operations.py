from bson.objectid import ObjectId
import datetime
from flask import jsonify


class Task:
    def __init__(self, id, date_created, entity_name, task_type, time, contact_person_id, note, status, priority=None, labels=None):
        self.id = id
        self.date_created = date_created
        self.entity_name = entity_name
        self.task_type = task_type
        self.time = time
        self.contact_person_id = contact_person_id  
        self.note = note
        self.status = status
        self.priority = priority  
        self.labels = labels or []

def create_task(db,data):
    try:
        new_task = Task(
            id=data.get('id', None),
            date_created=datetime.datetime.now(),
            entity_name=data['entity_name'],
            task_type=data['task_type'],
            time=data['time'],
            contact_person_id=data.get('contact_person_id', None),
            note=data.get('note', None),
            status=data['status'],
            priority=data.get('priority', None),
            labels=data.get('labels', []),
        )
        db.tasks.insert_one(new_task.__dict__)
        return jsonify({'message': 'Task created successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def get_task(db, task_id):
    try:
        task = db.tasks.find_one({'_id': ObjectId(task_id)})
        if task:
            task['_id'] = str(task['_id'])
            return jsonify(task), 200
        else:
            return jsonify({'message': 'Task not found'}), 404 
    except Exception as e:
        return jsonify({'error': str(e)}), 400

def update_task(db, task_id, data):
    try:
        update_data = {}
        for field, value in data.items():
            if field in ['entity_name', 'task_type', 'time', 'contact_person_id', 'note', 'status', 'priority', 'labels']:
                update_data[field] = value
        db.tasks.update_one({'_id': ObjectId(task_id)}, {'$set': update_data})
        return jsonify({'message': 'Task updated successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 400 

def delete_task(db, task_id):
    try:
        task_deleted = db.tasks.delete_one({'_id': ObjectId(task_id)})
        if task_deleted.deleted_count == 1:
            return jsonify({'message': 'Task deleted successfully'}), 200
        else:
            return jsonify({'message': 'Task not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 400