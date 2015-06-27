from surgeprotech.models import Paper, User, Comment
from surgeprotech import app, db, lm
from flask import make_response, send_from_directory, request, jsonify, abort, url_for, session, g, redirect, render_template
import flask.json
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
    return make_response(open('surgeprotech/templates/index.html').read())



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
            return jsonify({"success": True, "userId":user.get_id(),"userRole":'false'})

        else:
            # Return error since user was already in the database.
            return jsonify({"success": False, "error-email": "User with this e-mail id already exists"})

    else:
        if g.user.get_id() != None:
            usr = User.query.filter_by(id=g.user.get_id()).first()

            return jsonify({
                            "u_id": g.user.get_id(),
                            "Name": usr.name,
                            "role": usr.ac_type
                          })

        else:
            return jsonify({})


# The login handler.
@app.route('/api/login', methods=['POST'])
def loginAPI():
    formData = request.json
    print formData
    password = hashlib.sha1(formData['password']).hexdigest()

    user = User.query.filter_by(email=formData['email'], password=password).first()
    print "user is: ", user
    if user != None:  
        login_user(user, remember = formData['remember'])
        print "g.user in login is ", g.user
        return jsonify({
                            "success": True,
                            "u_id": user.id,
                            "Name": user.name,
                            "role": user.ac_type
                       })
    else:
        return jsonify({})


@app.route('/api/paper/', methods=['GET','POST'])
@app.route('/api/paper/<authorId>', methods=['GET','POST'])
def paper(authorId=None):
    user = g.user

    if request.method == "POST":
        try:
            os.stat(app.config['UPLOAD_FOLDER'])
        except:
            os.mkdir(app.config['UPLOAD_FOLDER'])

        file = request.files['file']

        if file:
            try:
                u_id = user.get_id()
                name = User.query.filter_by(id=u_id).first()

                filename = secure_filename(str(u_id)+'_'+name.name.split(' ')[0])

                link = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(link)

                print request.form.getlist('title'),request.form.getlist('abstract'),link

                db.session.add(Paper(request.form.getlist('title')[0],request.form.getlist('abstract')[0],filename, u_id))
                db.session.commit()

                return jsonify({"success":True}), 200
            except:
                 return abort(501)
    else:

        admin = User.query.filter_by(id=user.get_id()).first()
        #authenticate that the user is an admin.
        print admin.ac_type
        posts = []

        if admin.ac_type == True:

            if 'authorId' not in request.args:
                post = Paper.query.paginate(int(request.args['page']), int(app.config['POSTS_PER_PAGE']), False)
                
                for item in post.items:
                    posts.append({"title":item.Title, "abstract": item.Abstract, "p_id": item.p_id, "author": item.Author})

                return jsonify({"papers": posts})

            else:

                print request.args

                paper = Paper.query.filter_by(Author=request.args['authorId']).first()
                return jsonify(link=paper.Link,
                                abstract = paper.Abstract,
                                title=paper.Title,
                                p_id=paper.p_id)
        else:
            print g.user
            paper = Paper.query.filter_by(Author=user.get_id()).first()

            if paper is not None:
                
                return jsonify(link=paper.Link,
                                abstract = paper.Abstract,
                                title=paper.Title,
                                p_id=paper.p_id)
            else:
                # return an empty json if no paper found
                return jsonify({})


@app.route('/api/comment/', methods=['GET','POST'])
def Reviews():
    if request.method == "POST":
        formData = request.json
        print formData
        db.session.add(Comment(formData['content'],g.user.get_id(), int(formData['p_id'])))
        db.session.commit()

        return jsonify({"success": True}), 200

    else:

        print request.args

        retval = []

        comments = Comment.query.filter_by(p_id=request.args['paperId']).all()

        for comment in comments:

            author = User.query.filter_by(id=comment.author).first()

            retval.append({"content": comment.content, "rv_date": comment.rv_date, "author": author.name})
        return jsonify({"reviews": retval});


@app.route('/api/paper/download/<filename>/')
def download(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'pdf/'+filename)


@app.route('/api/logout')
def Logout():
    logout_user()
    return jsonify({"success": True})


@app.errorhandler(404)
def page_not_found(e):
        return render_template('404.html'), 404