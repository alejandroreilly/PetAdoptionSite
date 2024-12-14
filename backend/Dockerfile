FROM python:latest

WORKDIR /app

#requirements download
COPY requirements.txt .
RUN pip install -r requirements.txt

#entire backend directory
COPY . .

#expose port
EXPOSE 5000

#init databse
RUN python -c "from init_db import initialize_database; initialize_database()"

RUN python add_init_pets.py
RUN python add_init_applications.py
RUN python add_init_users.py
RUN python add_init_visits.py

#start Flask app
CMD [ "python", "app.py" ]