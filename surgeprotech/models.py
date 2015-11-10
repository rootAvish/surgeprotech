from surgeprotech import db, app
import hashlib
from datetime import datetime
from itsdangerous import TimedJSONWebSignatureSerializer as jwt, SignatureExpired

# Table to store technical commitee's comments on papers.
class Comment(db.Model):

    cmt_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    rv_date = db.Column(db.DateTime)
    author = db.Column(db.Integer,db.ForeignKey('user.id'))
    p_id = db.Column(db.Integer, db.ForeignKey('paper.p_id'))

    def __init__(self,content, author, p_id):
        self.content = content
        self.rv_date = datetime.utcnow()
        self.author = author
        self.p_id = p_id


# The table to store links to all submitted papers.
class Paper(db.Model):

    p_id = db.Column(db.Integer, primary_key=True)
    Title = db.Column(db.Unicode(300))
    Abstract = db.Column(db.Text)
    up_date = db.Column(db.DateTime)
    Link = db.Column(db.Unicode(500))

    Author = db.Column(db.Integer, db.ForeignKey('user.id'))
    comment_rl = db.relationship(Comment, backref='paper', lazy='dynamic')

    def __init__(self,title=None,abstract=None,link=None, Author=None):
        self.Title = title
        self.Abstract = abstract
        self.up_date = datetime.utcnow()
        self.Author = Author
        self.Link = link

    def ___repr__(self):
        return '<Paper %r>' % self.p_id


# Table to store the profiles of all users.
class User(db.Model):

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(256), index=True,unique=True)
    ac_type = db.Column(db.Boolean)
    name = db.Column(db.Text)
    picture = db.Column(db.String(256))
    password = db.Column(db.String(512))
    paper_rl = db.relationship(Paper, backref='user',lazy='joined')
    comment_rl = db.relationship(Comment,backref='user',lazy='dynamic')

    def __init__(self, name, email, password):
        self.email = email
        self.name = name
        self.password = hashlib.sha1(password).hexdigest()
        self.ac_type = False

    @staticmethod
    def verify_auth_token(token):
        s = jwt(app.config['SECRET_KEY'])
        try:
            data = s.loads(token)
        except SignatureExpired:
            return None # valid token, but expired
        except BadSignature:
            return None # invalid token
        user = User.query.get(data['id'])
        return user

    def is_authenticated(self):
            return True

    def is_active(self):
        return True

    def is_anonymous(self):
        return False

    def get_id(self):
        try:
            return unicode(self.id)  # python 2
        except NameError:
            return str(self.id)  # python 3

    def __repr__(self):
        return '<User %r>' % (self.id)
