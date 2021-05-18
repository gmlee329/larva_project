import pymysql
import pandas as pd
from config import Config

config = Config().config
tables = config['TABLES']

conn = pymysql.connect(host=config['DB_HOST'], 
                        port=config['DB_PORT'], 
                        user=config['DB_USER'],
                        passwd=config['DB_PASSWD'],
                        db=config['DB_NAME'],
                        charset=config['CHARSET'],
                        autocommit=True)
cursor = conn.cursor()

def insert_item():
    # item table create and insert
    data = pd.read_csv(tables['ITEM'])
    df = pd.DataFrame(data)
    sql = '''CREATE TABLE IF NOT EXISTS item (
        id INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(20) NOT NULL,
        CONSTRAINT PRIMARY KEY (id)
        )'''
    cursor.execute(sql)
    for i, row in df.iterrows():
        sql = f'''INSERT INTO item(name) VALUES ("{row['name']}")'''
        cursor.execute(sql)

def insert_user():
    # user table create and insert
    data = pd.read_csv(tables['USER'])
    df = pd.DataFrame(data)
    sql = '''CREATE TABLE IF NOT EXISTS user (
        id INT AUTO_INCREMENT NOT NULL,
        name VARCHAR(10) NOT NULL,
        phone VARCHAR(15) NOT NULL,
        address VARCHAR(60) NOT NULL,
        CONSTRAINT PRIMARY KEY (id)
        )'''
    cursor.execute(sql)
    for i, row in df.iterrows():
        sql = f'''INSERT INTO user(name, phone, address) VALUES 
        ("{row['name']}",
        "{row['phone']}",
        "{row['address']}")'''
        cursor.execute(sql)

def insert_charge():
    # user table create and insert
    data = pd.read_csv(tables['CHARGE'])
    df = pd.DataFrame(data)
    sql = '''CREATE TABLE IF NOT EXISTS charge (
        id INT AUTO_INCREMENT NOT NULL,
        item_id INT NOT NULL,
        standard VARCHAR(20) NOT NULL,
        price INT NOT NULL,
        CONSTRAINT PRIMARY KEY (id),
        CONSTRAINT FK_item_charge FOREIGN KEY(item_id) REFERENCES item(id) ON DELETE CASCADE
        )'''
    cursor.execute(sql)
    for i, row in df.iterrows():
        sql = f'''INSERT INTO charge(item_id, standard, price) VALUES 
        ({row['item_id']},
        "{row['standard']}",
        {row['price']})'''
        cursor.execute(sql)

def insert_reservation():
    # user table create and insert
    data = pd.read_csv(tables['RESERVATION'])
    df = pd.DataFrame(data)
    sql = '''CREATE TABLE IF NOT EXISTS reservation (
        id INT AUTO_INCREMENT NOT NULL,
        user_id INT NOT NULL,
        charge_id INT NOT NULL,
        count INT NOT NULL,
        disposal_due_data date NOT NULL,
        reservation_date date NOT NULL,
        CONSTRAINT PRIMARY KEY (id),
        CONSTRAINT FK_user_reservation FOREIGN KEY(user_id) REFERENCES user(id) ON DELETE CASCADE,
        CONSTRAINT FK_charge_reservation FOREIGN KEY(charge_id) REFERENCES charge(id) ON DELETE CASCADE
        )'''
    cursor.execute(sql)
    for i, row in df.iterrows():
        sql = f'''INSERT INTO reservation(user_id, charge_id, count, disposal_due_data, reservation_date) VALUES 
        ({row['user_id']},
        {row['charge_id']},
        {row['count']},
        "{row['disposal_due_date']}",
        "{row['reservation_date']}")'''
        cursor.execute(sql)

if __name__ == "__main__":
    insert_item()
    insert_user()
    insert_charge()
    insert_reservation()