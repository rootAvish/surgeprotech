from surgeprotech import app
import os

port = os.environ.get('PORT','5000')

if __name__=="__main__":
    app.run(host='0.0.0.0')
