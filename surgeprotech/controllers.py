#from surgeprotech.models import Paper, User, Comment
from surgeprotech import app, db, lm
from flask import make_response, send_from_directory, request, jsonify, abort, url_for, session, g, redirect
import os, hashlib
from models import Comment, User, Paper
from werkzeug import secure_filename
from flask.ext.login import login_user, logout_user, current_user, login_required

@lm.user_loader
def load_user(id):
    return User.query.get(int(id))

@app.before_request
def before_request():
    g.user = current_user


@app.route('/')
def home():
	return make_response(open('surgeprotech/templates/main.html').read())


@app.route('/login')
def login(**kwargs):
    if g.user is not None and g.user.is_authenticated():
        return redirect(url_for('rest_pages', model_name='user'))
    else:
        return make_response(open('surgeprotech/templates/index.html').read())


@app.route('/register')
def register(**kwargs):
    return make_response(open('surgeprotech/templates/index.html').read())

@app.route('/<model_name>/')
@app.route('/<model_name>/<item_id>')
@login_required
def rest_pages(model_name, item_id=None):
    if model_name == 'user' or model_name == 'paper':
        return make_response(open(
            'surgeprotech/templates/index.html').read())
    abort(404)


@app.route('/logout')
def logout():
    logout_user()
    return redirect(url_for('login'))
# =====================The API endpoints begin here=================

# endpoint to create and get users.
@app.route('/api/user/', methods=['POST','GET'])
@app.route('/api/user/<user_id>')
def registerUser():

    if request.method == 'POST':
    # Get POST'd JSON
        formData = request.json

        # check if e-mail already exists in the database.
        u = User.query.filter_by(email=formData["email"]).first()
 
        if u == None:

            # If not create the account and return success.
            user = User(formData['name'], formData['email'], formData['password'])
            db.session.add(user)
            db.session.commit()
            login_user(user, remember=False)
            return jsonify({"success": True})

        else:
            # Return error since user was already in the database.
            return jsonify({"success": False, "error-email": "User with this e-mail id already exists"})


# The login handler.
@app.route('/api/login', methods=['POST'])
def loginAPI():
    formData = request.json
    print formData
    password = hashlib.sha1(formData['password']).hexdigest()

    user = User.query.filter_by(email=formData['email'], password=password).first()
    print user
    if user != None:  
        login_user(user, remember = formData['remember'])
        return jsonify({
                            "success": True,
                            "u_id": user.id,
                            "Name": user.name,
                            "role": user.ac_type
                       })
    else:
        return jsonify({
                            "success": False
                       })

@app.route('/api/paper/', methods=['GET','POST'])
def paper():
    user = g.user

    if request.method == "POST":
        try:
            os.stat(app.config['UPLOAD_FOLDER'])
        except:
            os.mkdir(app.config['UPLOAD_FOLDER'])

        file = request.files['file']
        if file:
            filename = secure_filename('paper_avishkar.gupta.delhi@gmail.com'+'my paper title'+'.pdf')
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            return jsonify({"success":True})
    else:

        print request.args['user']
        #authenticate that the user is an admin.
        admin = True

        if admin == True:
            post = Paper.query.paginate(int(request.args['page']), int(app.config['POSTS_PER_PAGE']), False)
            return jsonify({"posts": post.items});


@app.route('/api/comment/')
def getReviews():
    print request.args['paperid']
    Comment.query.filter_by('p_id').all()


@app.route('/api/paper/download/<filename>/')
def download(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'pdf/'+filename)

@app.errorhandler(404)
def page_not_found(e):
        return make_response('404.html'), 404