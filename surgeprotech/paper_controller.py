from surgeprotech.models import Paper, User, Comment
from surgeprotech import app, db, lm
from flask import make_response, send_from_directory, request, jsonify, abort, url_for, session, g, redirect, render_template, Blueprint
import flask.json
import os, hashlib
from models import Comment, User, Paper
from werkzeug import secure_filename
from flask.ext.login import login_user, logout_user, current_user, login_required


paper_api = Blueprint('paper_api', __name__)

@paper_api.route('/api/paper', methods=['GET','POST'])
@paper_api.route('/api/paper/<authorId>', methods=['GET'])
def paper(authorId=None):
    user = g.user

    if request.method == "POST":
        filename = None

        if request.files:
            try:
                os.stat(app.config['UPLOAD_FOLDER'])
            except:
                os.mkdir(app.config['UPLOAD_FOLDER'])

            file = request.files['file']
            
            try:
                u_id = user.get_id()
                name = User.query.filter_by(id=u_id).first()

                # Filename for the file: userid + firstname of user.
                filename = secure_filename(str(u_id)+'_'+name.name.split(' ')[0])

                link = os.path.join(app.config['UPLOAD_FOLDER'], filename)

                #save the paper if there is one
                file.save(link)

            except:
                abort(500)


            # Check if a paper already exists for this author, if it does, update it.
            paper = Paper.query.filter_by(Author=user.get_id()).first()

            if paper == None:
                # If we do not have a paper, then create a new one.

                paper = Paper(None,None,None,u_id)

            if 'title' in request.form:
                paper.Title =  request.form.getlist('title')[0]

            if 'abstract' in request.form:
                paper.Abstract = request.form.getlist('abstract')[0]   

            if filename:
                paper.Link = filename

            db.session.add(paper)

        else:
            # We did not get a file. Proceed to fetch a JSON and update the database with it.
            formdata = request.json
            print formdata

            paper = Paper.query.filter_by(Author=user.get_id()).first()

            if (paper == None):
                # if no paper found create a new class object.
                paper = Paper(None,None,None,user.get_id())

            if 'title' in formdata:

                paper.Title = formdata["title"]

            if 'abstract' in formdata:

                paper.Abstract = formdata["abstract"]

            db.session.add(paper)
        
        # Commit the session and return success.        
        db.session.commit()
        return jsonify({"success":True}), 200


    # If we GET a request for a paper, or all papers.
    elif request.method == 'GET':

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


# POST and GET comments from the database.
# GET /api/comment - fetch a list of all comments.
# POST /api/comment - Post a new comment.
@paper_api.route('/api/comment/', methods=['GET','POST'])
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


# Endpoint to facilitate download of full paper texts.
@paper_api.route('/api/paper/download/<filename>/')
def download(filename):
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'pdf/'+filename)
