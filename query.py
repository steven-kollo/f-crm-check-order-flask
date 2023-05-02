def set_where_statement(id, email, phone, client):
    where_statements = []
    if (id != 'none'):
        where_statements.append(f"order_search_id='{id}'")
    if (email != 'none'):
        where_statements.append(f"client_email='{email}'")
    if (phone != 'none'):
        uuids = match_phones(phone, client)
        if (uuids != False):
            where_statements.append(f"uuid IN ({uuids})")

    if (where_statements != []):
        WHERE_STATEMENT = 'WHERE ' + ' OR '.join(where_statements)
        return WHERE_STATEMENT
    return False


def run_query(id, email, phone, client):
    WHERE_STATEMENT = set_where_statement(id, email, phone, client)
    if (WHERE_STATEMENT == False):
        return
    query = f"""
        SELECT order_search_id, order_product, order_status
        FROM `florissimo-378500.main.orders`
        {WHERE_STATEMENT}
        ORDER BY order_created_datetime DESC
        LIMIT 10
    """
    print('=====QUERY=====')
    print(query)
    query_job = client.query(query)
    res = []
    for row in query_job:
        res.append([row["order_search_id"],
                   row["order_product"], row["order_status"]])

    return res


def query_phones(client):  # PHONE NUMBERS
    query = f"""
        SELECT uuid, client_phone
        FROM `florissimo-378500.main.orders`
        WHERE client_phone NOT IN ("")
        ORDER BY order_created_datetime DESC
    """
    query_job = client.query(query)
    phones = {}

    for row in query_job:
        clear_number = clear_phone_number(row["client_phone"])

        if (clear_number in phones):
            phones[clear_number].append(row["uuid"])
        else:
            phones[clear_number] = [row["uuid"]]

    return phones


def clear_phone_number(phone):
    return phone.replace("+", "").replace(" ", "").replace("(", "").replace(")", "")[-9:]


def match_phones(phone, client):
    clear_number = clear_phone_number(phone)
    phones = query_phones(client)
    if (clear_number in phones):
        res = ''
        uuids = phones[clear_number]
        for uuid in uuids:
            if (res == ''):
                res = f"'{uuid}'"
            else:
                res = res + f",'{uuid}'"
        return res
    else:
        return False
