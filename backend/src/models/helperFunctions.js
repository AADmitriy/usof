
exports.convert_to_values_str = (data, fields) => {
    const values = fields.map( (field) => { 
        if (typeof data[field] == "string") {
            return `"${data[field]}"` 
        }
        else {
            return `${data[field]}`
        }
    })
    .join(', ')

    return values
}

exports.convert_to_key_values = (data, fields) => {
    const key_values = fields.map( (field) => {
        if (typeof data[field] == "string") {
            return `${field}="${data[field]}"`
        }
        else {
            return `${field}=${data[field]}`
        }
    })
    .join(', ')

    return key_values
}

// exports.select_where_template = (table_name, field_name, field_value) => {
//     if (typeof field_value == "string") {
//         return `SELECT * FROM ${table_name} WHERE ${field_name} = "${field_value}";`
//     }
//     else {
//         return `SELECT * FROM ${table_name} WHERE ${field_name} = ${field_value};`
//     }
// }

function where_statement_constructor(key_values) {
    const convert_to_str = (key, value) => {
        if (typeof key == "string" &&
            key.startsWith('__special')) {
            return `${key.slice(9)}${value}`
        }
        if (typeof value == "string") {
            return `${key} = "${value}"`
        }
        else {
            return `${key} = ${value}`
        }
    }

    let sql = 'WHERE '

    const keys = Object.keys(key_values)
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        const value = key_values[key];
        sql += convert_to_str(key, value)

        if (i != keys.length - 1) {
            sql += ' AND '
        }
    }

    return sql
}

exports.select_where_template = (table_name, key_values) => {
    let sql_select = `SELECT * FROM ${table_name} ${where_statement_constructor(key_values)};`

    return sql_select
}

exports.insert_template = (table_name, fields, data) => {
    const values = exports.convert_to_values_str(data, fields)
    const sql_insert = `
        INSERT INTO ${table_name} (${fields.join(', ')}) 
        VALUES ( ${ values } );`

    return sql_insert
}

exports.update_template = (table_name, fields, data) => {
    const values = exports.convert_to_key_values(data, fields)

    const sql_update = `
        UPDATE ${table_name}
        SET ${values}
        WHERE id = ${data.id}`

    return sql_update
}

exports.delete_template = (table_name, id) => {
    const sql_delete = `
            DELETE FROM ${table_name}
            WHERE id = ${id};`

    return sql_delete
}

exports.model_to_json = (model, fields) => {
    const model_json = {}

    for (const field of fields) {
        model_json[field] = model[field]
    }

    return model_json
}

exports.query_constructor = ({table_name, where_key_values=null,
                              select_all=true, values_to_select=[], 
                              order_by=null, cte=null}) => {
    let select_query = 'SELECT '
    
    if (null != cte) {
        select_query = cte + ' ' + select_query
    }

    if (select_all) {
        select_query += '*'
        if (values_to_select.length != 0) {
            select_query += ','
        }
        select_query += ' '
    }

    if (values_to_select.length != 0) {
        select_query += values_to_select.join(', ')
    }

    select_query += ` FROM ${table_name}`

    if (null != where_key_values) {
        select_query += ' ' + where_statement_constructor(where_key_values)
    }

    if (null != order_by) {
        select_query += ` ORDER BY ${order_by}`
    }

    return select_query
}