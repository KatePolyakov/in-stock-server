# in-stock-server

In the same folder, in terminal, run:  npm install

Create a new MySQL database schema: instock

Start the local server with: npm run dev

example routes to be called from the frontend:

GET APIs:
http://localhost:8080/api/warehouses

http://localhost:8080/api/inventories-warehouses

http://localhost:8080/api/warehouses/:warehouse_id

http://localhost:8080/api/inventories/:inventoryId

POST APIs:
http://localhost:8080/api/warehouses

CREATE a New Warehouse Request body example:
{
    "warehouse_name": "Chicago",
    "address": "3218 Guess Rd",
    "city": "Chicago",
    "country": "USA",
    "contact_name": "Jameson Schuppe",
    "contact_position": "Warehouse Manager",
    "contact_phone": "+1 (919) 797-2875",
    "contact_email": "jschuppe@instock.com"
}

DELETE APIs:
http://localhost:8080/api/warehouses/:warehouse_id
i.e. http://localhost:8080/api/warehouses/10

Sorting functionality in ascending/descending order api example requests:

http://localhost:8080/api/warehouses?sort_by=warehouse_name&order_by=desc

http://localhost:8080/api/inventories-warehouses?sort_by=item_name&order_by=asc