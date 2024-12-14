# cse-2102-fall24-Team11
Jacky Li - jvl22001
Alejandro Reilly - alr20020
Shiven Patel - smp19007
Jonathan Le - jol22002

Trello Link:
https://trello.com/invite/b/66eb006a9e7be0c5aaaa9ff3/ATTIf0cdedfe794baf1430b6dbb592f8bb0dB302DD85/cse-2102-group-project

Figma Prototype:
https://www.figma.com/design/iYGB1PSSHGvtkzjco4go5b/Pet-Adoption-Web-App?node-id=0-1&t=R3G9mlWJnUtipSQs-1 

Docker Instructions:

docker-compose up --build

For testing perform POST the following bodies on localhost:5000/api/db_query (using POSTMAN or AdminDB page) <br/>
{
    "action": "create",
    "table": "pets",
    "user_id": "None",
    "name": "Buddy",
    "species": "golden retriever",
    "breed": "placeholder",
    "age": 19,
    "status": "open"
}<br/>
{
    "action": "read",
    "table": "pets"
}<br/>
{
    "action": "update",
    "table": "pets",
    "pet_id": 1,
    "name": "Fluffy"
}<br/>
{
    "action": "read",
    "table": "pets"
}<br/>
{
    "action": "delete",
    "table": "pets",
    "pet_id": 1
}<br/>
{
    "action": "read",
    "table": "pets"
}<br/>
