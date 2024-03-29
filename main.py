from flask import Flask, render_template
from datetime import datetime
import query
from google.cloud import bigquery
client = bigquery.Client()
app = Flask(__name__)


@app.route('/')
def home():
    return render_template('index.html')


@app.route('/find/<string:id>&<string:phone>&<string:email>')
def find(id, phone, email):
    orders = query.run_query(id, email, phone, client)
    print(orders)
    res = []
    for order in orders:
        res.append({
            "order_search_id": order[0],
            "order_product": order[1],
            "order_status": order[2],
            "date_delivery": order[3],
            "time_delivery": order[4],
            "client_name": order[5],
        })
    current_orders = get_current_orders(res)

    return {
        "orders": current_orders
    }


if __name__ == '__main__':
    app.run(host='127.0.0.1', port=8080, debug=True)


def get_current_orders(orders):
    today = datetime.today().date()
    current_orders = []
    orders.sort(key=lambda x: x["date_delivery"], reverse=True)

    for order in orders:
        if (order["date_delivery"] >= today and order["order_status"] != "matched" and order["order_status"] != "checkout"):
            order["date_delivery"] = order["date_delivery"].strftime(
                "%d/%m/%Y")
            current_orders.append(order)
    return current_orders
