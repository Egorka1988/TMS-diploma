# Use an official Python runtime as a parent image
FROM python:3.6.8-slim

ENV PYTHONUNBUFFERED 1

# Set the working directory to /app
WORKDIR /TMS-diploma

# Copy the current directory contents into the container at /app
COPY . /TMS-diploma

RUN apt-get update && apt-get install -y gcc python3-dev
RUN pip install --upgrade pip


# Install any needed packages specified in requirements.txt
RUN pip install --trusted-host pypi.python.org -r requirements.txt

# Make port 80 available to the world outside this container
EXPOSE 8000

# Run app.py when the container launches
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]



