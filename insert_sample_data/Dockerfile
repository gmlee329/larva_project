FROM ubuntu:18.04
RUN apt-get update && \
    apt install -y software-properties-common &&\
    apt-get install --no-install-recommends -y \
    python3.8 python3-pip python3.8-dev
RUN /usr/bin/python3.8 -m pip install --upgrade pip
RUN ln -s /usr/bin/python3.8 /usr/bin/python

RUN pip install django
RUN pip install pymysql
RUN pip install pandas

WORKDIR /app
CMD ["bash"]