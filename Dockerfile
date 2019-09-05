# Use an official Python runtime as a parent image
FROM python:3.6.8-slim

ENV PYTHONUNBUFFERED 1

# Set the working directory to /app
WORKDIR /TMS-diploma

# Copy the current directory contents into the container at /app
COPY . /TMS-diploma

# need for proper install setproctitle
RUN apt-get update && apt-get install -y --allow-unauthenticated gcc python3-dev

RUN pip3 install --upgrade pip
RUN pip3 install pipenv


# Install any needed packages specified in requirements.txt

RUN pipenv install -d


# Make port 80 available to the world outside this container
EXPOSE 8000

# Run app.py when the container launches
CMD ["bash", "./runtime_middleware.sh"]


