The BaseModel class is an abstract base class for representing database entities in the project.
It provides common CRUD operations and utility methods for working with MySQL tables using a connection pool.

Concrete models (e.g. User, Post, Category) should extend BaseModel and define their own table metadata.

# Class Structure
```class BaseModel {
  static table_name = null
  static fields = []
  static updateable_fields = []
  static admin_updateable_fields = []
  static uninsertable_fields = []

  constructor(data) { ... }

  // Static methods
  static async all()
  static async all_json()
  static async select_where(key_values)
  static async select_where_json(key_values)
  static async findById(id)
  static async findById_json(id)
  static async delete(id)

  // Instance methods
  set_values(data)
  set_values_admin(data)
  async save()
  to_json()
}
```

# Static Properties
table_name - table name

fields - fields that can be set using insert

updateable_fields - fields that user can update

admin_updateable_fields	- fields that admin can update

uninsertable_fields	- fields that derived or auto populated and so can not be inserted or updated

# Constructor
constructor(data)

Accepts a plain object with key–value pairs of model properties.

Assigns all provided fields directly to the instance.

# Static Methods
all()

Fetches all rows from the table.

Returns:
Array<BaseModel> — array of model instances.

all_json()

Fetches all rows and converts them to JSON objects.

Returns:
Array<Object> — array of JSON representations.

select_where(key_values)

Selects rows based on key-value conditions.

Parameters:

key_values (Object): { column: value } pairs.

Returns:
Array<BaseModel>

select_where_json(key_values)

Like select_where, but returns JSON objects.

findById(id)

Finds a row by primary key id.

Parameters:

id (number): row ID.

Returns:
BaseModel | null

findById_json(id)

Same as findById, but returns JSON or null.

delete(id)

Deletes a row by ID.

Returns:

true if deletion succeeded

false otherwise

# Instance Methods
set_values(data)

Updates instance properties with user-provided data.

Only fields in updateable_fields are allowed.

Returns:

true if successful

false if invalid keys were provided

set_values_admin(data)

Same as set_values, but uses admin_updateable_fields.

async save()

Updates the current instance in the database.

Returns:

true if the update query succeeded

false if an error occurred

to_json()

Converts the instance into a plain JSON object.

Includes all fields plus uninsertable_fields.

# Usage Example
```
class User extends BaseModel {
  static table_name = 'user'
  static fields = ['login', 'email', 'role']
  static updateable_fields = ['login', 'email']
  static admin_updateable_fields = ['login', 'email', 'role']
  static uninsertable_fields = ['id']
}

// Fetch all users
const users = await User.all_json()

// Find user
const user = await User.findById(1)

// Update user
user.set_values({ login: 'newLogin' })
await user.save()

// Convert to JSON
console.log(user.to_json())
```


✅ With this setup, BaseModel acts like a mini ORM layer where each table maps to a subclass, avoiding code duplication.