FROM ubuntu:18.04
RUN apt-get update && \
    apt install -y software-properties-common &&\
    apt-get install --no-install-recommends -y \
    python3.8 python3-pip python3.8-dev &&\
    apt install -y curl &&\
    apt-get install -y unzip
RUN /usr/bin/python3.8 -m pip install --upgrade pip
RUN ln -s /usr/bin/python3.8 /usr/bin/python

WORKDIR /
RUN curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
RUN unzip awscliv2.zip
RUN ./aws/install

ARG AWS_DEFAULT_REGION
ARG AWS_ACCESS_KEY_ID
ARG AWS_SECRET_ACCESS_KEY
ENV AWS_ACCESS_KEY_ID ${AWS_ACCESS_KEY_ID}
ENV AWS_DEFAULT_REGION ${AWS_DEFAULT_REGION}
ENV AWS_SECRET_ACCESS_KEY ${AWS_SECRET_ACCESS_KEY}

RUN pip install -U setuptools
RUN apt-get install -y libmysqlclient-dev
RUN apt-get install gcc -y

WORKDIR /app
COPY ./requirements.txt /app
RUN pip install -r requirements.txt

COPY . /app
RUN chown -R root:root /app
RUN chmod -R +x /app/bin
RUN chmod -R +x /app/cmd

WORKDIR /app/larva
# RUN python manage.py makemigrations common
# RUN python manage.py migrate
RUN echo yes | python manage.py collectstatic

WORKDIR /app

VOLUME /app

# ENTRYPOINT ["/bin/bash"]
# ENTRYPOINT ["/app/bin/gunicorn_start"]
ENTRYPOINT [ "/app/cmd/start" ]