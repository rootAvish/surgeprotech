from surgeprotech.models import Paper, User, Comment
from surgeprotech import app, db, lm
from surgeprotech.paper_controller import paper_api
from flask import make_response, send_from_directory, request, jsonify, abort, url_for, session, g, redirect, render_template
import flask.json
import os, hashlib
from models import Comment, User, Paper
from werkzeug import secure_filename
from flask.ext.login import login_user, logout_user, current_user, login_required
from surgeprotech.utils import send_mail
from itsdangerous import TimedJSONWebSignatureSerializer as jwt
import json

app.register_blueprint(paper_api)


@lm.user_loader
def load_user(id):

    return User.query.get(int(id))


@app.before_request
def before_request():

    # Get the current user for the session
    g.user = current_user


@app.route('/')
def home():

    # Return the html for the homepage.
    return make_response(open('surgeprotech/templates/main.html').read())


@app.route('/login')
def login(**kwargs):

    if g.user is not None and g.user.is_authenticated():
        return redirect(url_for('rest_pages', model_name='user'))

    else:
        return make_response(open('surgeprotech/templates/index.html').read())


@app.route('/delegate-registration', methods=['GET','POST'])
def delegateRegistration():

    if request.method == 'GET':

        return make_response(open('surgeprotech/templates/delegate-registration.html').read())

    else:

        body = ""
        
        categories =    {
                '1':    "IEEMA Members",
                '2':    "Non-IEEMA Members",   
                '3':    "Utility/Discoms", 
                '4':    "International", 
                '5':    "Student"
        }

        for key in request.json:

            if key == 'category':
                body += key + ":" + categories[request.json[key]] + '\n'
            else:
                body += key + ":" + request.json[key] + '\n'

        send_mail("Delegate Registration", body, "anita.gupta@ieema.org")
        return jsonify({"success": True})


@app.route('/reset', methods=['POST'])
def reset_password():

    if request.method == 'POST':

        token = request.json['token']
        u = User.verify_auth_token(token)
        
        if u != None:

            u.password = hashlib.sha1(request.json['password']).hexdigest()
            
            db.session.add(u)
            db.session.commit()
            
            return json.dumps({"success": True}), 200

        else:

            abort(401)

    else:

        return make_response(open('surgeprotech/templates/index.html').read())


@app.route('/forgot', methods=['GET','POST'])
def forgot_pass():

    if request.method == 'POST':
        #send a recovery email
        print request.json
        email = request.json['email']

        u = User.query.filter_by(email=email).first()

        if u != None:

            token = jwt(app.config['SECRET_KEY'], 3600)
            # The e-mail to send
            body = """
                To reset your password for surgeprotech.org paper submission forums, please follow the link:
                %s

                The link will expire in 1 hour from the time of sending this e-mail, if you fail to complete the
                reset by then please request for a new code at surgeprotech.org/forgot.

                ~ Surgeprotech admin
            """ % ('surgeprotech.org/reset/' + token.dumps({'user': u.id}).decode('utf-8'))

            # Finally send the e-mail to this user.
            send_mail("Surgeprotech Password Reset", body, email)

            return json.dumps({"success": True})

    else:
        return make_response(open('surgeprotech/templates/index.html').read())


@app.route('/reset/<token>')
def resetToken(token):

    return make_response(open('surgeprotech/templates/index.html').read())


@app.route('/register')
def register(**kwargs):

    return make_response(open('surgeprotech/templates/index.html').read())


@app.route('/<model_name>/')
@app.route('/<model_name>/<item_id>')
@login_required
def rest_pages(model_name, item_id=None):

# if the model name is a valid API endpoint, then send.
    if model_name == 'user' or model_name == 'paper':
        return make_response(open('surgeprotech/templates/index.html').read())

# else abort this shit.
    abort(404)


@app.route('/logout')
def logout():

    return make_response(open('surgeprotech/templates/index.html').read())


@app.route('/brochure')
def sendBrochure():

    return send_from_directory(os.path.join(app.root_path, 'static'),
                           'pdf/brochure.pdf')


# =====================The API endpoints begin here=================
# endpoint to create and get users.

@app.route('/api/user', methods=['POST','GET'])
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
            return  jsonify(
                        {
                            "success": True, 
                            "userId":user.get_id(),
                            "userRole":'false'
                        }
                    )

        else:
            # Return error since user was already in the database.
            return  jsonify(
                        {
                            "success": False, 
                            "error-email": "User with this e-mail id already \
                                            exists"
                        }
                    )

    else:
        if g.user.get_id() != None:
            usr = User.query.filter_by(id=g.user.get_id()).first()
            
            # Also return the user's paper, for links.
            pid = Paper.query.filter_by(Author=usr.id).first()
            
            # If no paper exists then create a new one.
            if pid == None:
                pid = 0
            else:
                pid = pid.p_id

            print(pid)

            return jsonify({
                            "u_id": g.user.get_id(),
                            "Name": usr.name,
                            "role": usr.ac_type,
                            "paper": pid
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

        # Also return the user's paper, for links.
        pid = Paper.query.filter_by(Author=user.id).first()
        
        # If no paper exists then create a new one.
        if pid == None:
            pid = 0
        else:
            pid = pid.p_id

        print "g.user in login is ", g.user
        return jsonify({
                            "success": True,
                            "u_id": user.id,
                            "Name": user.name,
                            "role": user.ac_type,
                            "paper": pid
                       })

    else:
        return jsonify({})



@app.route('/api/logout')
def Logout():

    logout_user()
    return jsonify({"success": True})


@app.errorhandler(404)
def page_not_found(e):

        return render_template('404.html'), 404
