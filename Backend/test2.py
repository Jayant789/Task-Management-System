from flask import Flask
from flask_login import LoginManager
from flask_login import UserMixin
import pymongo
import datetime


app = Flask(__name__)

app.config['SECRET_KEY'] = 'One23'

# # Initialize Flask-Login
# login_manager = LoginManager()
# login_manager.init_app(app)

# bcrypt = Bcrypt(app)

client = pymongo.MongoClient("mongodb+srv://jayantlaldas:<password>@cluster0.lfa05l6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client["task-management"]

# # User model class
# class User(UserMixin):
#     def __init__(self, id, username, password_hash):
#         self.id = id
#         self.username = username
#         self.password_hash = password_hash

#     def verify_password(self, password):
#         return bcrypt.check_password_hash(self.password_hash, password)


# # User loader function (loads user by username)
# @login_manager.user_loader
# def load_user(username):
#     user = db.users.find_one({"username": username})
#     return User(user["_id"], user["username"], user["password_hash"]) if user else None


# # Login route
# @app.route('/login', methods=['GET', 'POST'])
# def login():
#     if current_user.is_authenticated:
#         return redirect('/tasks') 

#     if request.method == 'POST':
#         username = request.form['username']
#         password = request.form['password']

#         user = load_user(username)
#         if user and user.verify_password(password):
#             login_user(user)
#             return redirect('/tasks')
#         else:
#             return render_template('login.html', error="Invalid username or password")

#     return render_template('login.html')


# # Logout route
# @app.route('/logout')
# @login_required
# def logout():
#     logout_user()
#     return redirect('/login')



@app.route('/tasks')
@login_required
def tasks():
    tasks = [Task(1, "Task 1", "This is task 1 description", False),
             Task(2, "Task 2", "This is task 2 description", True)]
    return render_template('tasks.html', tasks=tasks)


