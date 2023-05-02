import query
from flask import Flask, render_template
from google.cloud import bigquery
client = bigquery.Client()
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/find/<string:id>&<string:phone>&<string:email>')
def find(id, phone, email):
    print(id[3:])
    print(email[6:])
    print(phone[6:])
    orders = query.run_query(id[3:], email[6:], phone[6:], client)
    print(orders)
    res = []
    for order in orders:
        res.append({
            "order_search_id": order[0],
            "order_product": order[1],
            "order_status": order[2]
        })
    return {
        "orders": res
    }


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)
