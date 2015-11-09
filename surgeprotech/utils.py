from surgeprotech import app
from flask_mail import Mail, Message


# A function to send mail
def send_mail(subject, body, to):

    mail = Mail(app)

    # Configure the specifics
    message = Message(subject, sender='admin@surgeprotech.org', recipients=[to])
    msg.body = body

    # Finally send the mail
    mail.send(message)