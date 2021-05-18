class Config:
    def __init__(self):
        self.config = {
            "DB_HOST" : "mariadb",
            "DB_PORT" : 3306,
            "DB_USER" : "root",
            "DB_PASSWD" : '1234',
            "DB_NAME" : "larva_db",
            "CHARSET" : "utf8",
            "TABLES" : {'ITEM' : 'item_table.csv', 
                        'CHARGE' : 'charge_table.csv',
                        'RESERVATION' : 'reservation_table.csv',
                        'USER' : 'user_table.csv'}
        }