const example_json = [
    {
        "date_delivery": "Thu, 13 Apr 2023 00:00:00 GMT",
        "order_product": "Cajita petit",
        "order_search_id": "S-11-1874",
        "order_status": "delivered"
    },
    {
        "date_delivery": "Tue, 21 Mar 2023 00:00:00 GMT",
        "order_product": "Caja San Valentín M",
        "order_search_id": "S-62-1841",
        "order_status": "new"
    }
]

function find() {
    document.getElementById("email").disabled = true
    document.getElementById("order_id").disabled = true
    document.getElementById("phone").disabled = true
    document.getElementById("find_button").disabled = true
    document.getElementById("spinner").style = ""
    const email = document.getElementById("email").value
    const phone = document.getElementById("phone").value
    const order_id = document.getElementById("order_id").value
    let fields = process_fields(email, phone, order_id)
    let json = fetchReq(fields)
    let data = process_json(json)
    console.log(data)
}

function show_orders(data) {

}

function process_json(json) {
    return json
}

function fetchReq(fields) {
    return example_json
    let json
    fetch(`/find/id=${fields.order_id}&phone=${fields.phone}&email=${fields.email}`)
        .then(response => response.json())
        .then(data => {
            json = data
        })
    return json
}

function process_fields(email, phone, order_id) {
    let res = {
        phone: "none",
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
        res.phone = phone.toString().replace('+', '').replace(' ', '').replace('(', '').replace(')', '')
    }
    return res
}

function validate_email(str) {
    if (str.toString().indexOf('@') != -1) return true
    return false
}

function validate_phone(phone) {
    if (phone == '') return false
    let processed = phone.toString().replace('+', '').replace(' ', '').replace('(', '').replace(')', '')
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