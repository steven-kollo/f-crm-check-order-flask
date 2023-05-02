# import query
from flask import Flask, render_template
# from google.cloud import bigquery
# client = bigquery.Client()
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/find/<string:id>&<string:phone>&<string:email>')
def find(id, phone, email):
    # res = query.run_query(id, phone, email, client)
    # print(res)
    return {
        "id": id,
        "phone": phone,
        "email": email
    }


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
