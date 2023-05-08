async function find() {
    document.getElementById("find_button").disabled = true
    document.getElementById("spinner").style = ""
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const order_id = document.getElementById("order_id").value
    let fields = process_fields(email, phone, order_id)
    let data = await fetchReq(fields)
    await console.log(data)
    paste_orders_data(data)
    console.log("Done!")
}

function create_badge(status) {
    if (status == "delivered") {
        return '<span style="font-size:15px;" class="badge badge-pill bg-success">Entregado</span>'
    }
    if (status == "cancelled") {
        return '<span style="font-size:15px;" class="badge bg-pill bg-secondary">Cancelada</span>'
    }
    if (status == "sent") {
        return '<span style="font-size:15px;" class="badge bg-pill bg-primary">Entregando</span>'
    }
    return '<span style="font-size:15px" class="badge bg-pill bg-primary">En curso</span>'

}

function create_single_order_html(order) {
    html = `
    <div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
            <div>
                <b><a>${order.order_search_id}</a></b>
                ${create_badge(order.order_status)}
            </div>
            <a>Fecha de pedido: ${order.date_delivery} | ${order.time_delivery}</a>
        </div>
        <a><b>Orden para:</b> ${order.client_name}</a>
    </div>
    <hr>
    `
    return html
}

function paste_orders_data(orders) {
    document.getElementById("spinner").style = "display: none;"
    document.getElementById("find_button").disabled = false
    document.getElementById("find_button").innerText = "Busca mas"
    let html = ``
    if (orders.length == 0) {
        html = `
            <p>No se encontró nada para su solicitud</p>
            <hr>
        `
    } else {
        orders.forEach(order => {
            html = html + create_single_order_html(order)
        })
    }

    document.getElementById("search-results-container").innerHTML = html
}

async function fetchReq(fields) {
    try {
        let res = await fetch(`/find/${fields.order_id}&${fields.phone}&${fields.email}`)
        let json = await res.json()
        return json.orders
    } catch (e) {
        console.log(e)
        return []
    }

}

function process_fields(email, phone, order_id) {
    let res = {
        phone: "0",
        email: "none",
        order_id: "none"
    }
    if (validate_email(email) == true) {
        res.email = email
    }
    if (validate_id(order_id) == true) {
        res.order_id = order_id
    }
    if (validate_phone(phone) == true) {
        res.phone = phone.toString().replaceAll('+', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '')
    }
    console.log(res)
    return res
}

function validate_email(str) {
    if (str.toString().indexOf('@') != -1) return true
    return false
}

function validate_phone(phone) {
    if (phone == '') return false
    let processed = phone.toString().replaceAll('+', '').replaceAll(' ', '').replaceAll('(', '').replaceAll(')', '')
    console.log(processed)
    console.log(Number(processed))
    if (Number(processed) == Number(processed) * 1) return true
}

function validate_id(id) {
    id = id.toString()
    if (
        (id.length == 9 || id.length == 8) &&
        (id.charAt(0) == 'S' || id.charAt(0) == 'M' || id.charAt(0) == 'R' || id.charAt(0) == 'C') &&
        (id.charAt(1) == '-' && (id.charAt(3) == '-' || id.charAt(4) == '-'))
    ) return true
    return false
}