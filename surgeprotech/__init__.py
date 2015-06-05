from flask import Flask, request, Response, send_from_directory
from flask.ext.sqlalchemy import SQLAlchemy
from flask.ext.login import LoginManager

app = Flask(__name__)

# Get configuration from file config.py
app.config.from_object('surgeprotech.config')

# Create the database object
db = SQLAlchemy(app)

lm = LoginManager()
lm.init_app(app)
lm.login_view = 'login'

import surgeprotech.models
import surgeprotech.controllers
