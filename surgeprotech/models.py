from surgeprotech import db, app
import hashlib

# Table to store technical commitee's comments on papers.
class Comment(db.Model):

    cmt_id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text)
    author = db.Column(db.Integer,db.ForeignKey('user.id'))
    p_id = db.Column(db.Integer, db.ForeignKey('paper.p_id'))


# The table to store links to all submitted papers.
class Paper(db.Model):

    p_id = db.Column(db.Integer, primary_key=True)
    Title = db.Column(db.Unicode(300))
    Abstract = db.Column(db.Text)
    Link = db.Column(db.Unicode(500))
    Author = db.Column(db.Integer, db.ForeignKey('user.id'))
    comment_rl = db.relationship(Comment, backref='paper', lazy='dynamic')

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
    paper_rl = db.relationship(Paper, backref='user',lazy='joined',uselist=False)
    comment_rl = db.relationship(Comment,backref='user',lazy='dynamic')

    def __init__(self, name, email, password):
        self.email = email
        self.name = name
        self.password = hashlib.sha1(password).hexdigest()
        self.ac_type = False

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
