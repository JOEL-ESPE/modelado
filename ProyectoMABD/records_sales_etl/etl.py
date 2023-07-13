# app.py
from pymongo import MongoClient, errors

# Cadenas de conexión para las bases de datos
SOURCE_MONGODB_URLS = [
    'mongodb://192.168.100.48:65000/',
    'mongodb://192.168.100.48:55001/',
    'mongodb://192.168.100.48:55002/',
    'mongodb://192.168.100.48:55003/'
]

DESTINATION_MONGODB_URLS = [
    'mongodb://192.168.100.48:65002/',
    'mongodb://192.168.100.48:55005/',
    'mongodb://192.168.100.48:55006/',
    'mongodb://192.168.100.48:55007/'
]


def connect_to_mongodb(mongodb_urls):
    for url in mongodb_urls:
        try:
            client = MongoClient(url, serverSelectionTimeoutMS=2000)
            client.server_info()  # Lanza una excepción si no puede conectarse al servidor
            return client
        except errors.ServerSelectionTimeoutError:
            continue  # Prueba con el siguiente URL si no pudo conectarse
    return None  # Devuelve None si no pudo conectarse a ninguno de los servidores


def perform_etl():
    # Conexión a la base de datos origen
    source_client = connect_to_mongodb(SOURCE_MONGODB_URLS)
    if not source_client:
        print("No se encontró conexión con la base de datos origen")
        return

    source_db = source_client['records']
    source_collection = source_db['sales']

    # Conexión a la base de datos destino
    destination_client = connect_to_mongodb(DESTINATION_MONGODB_URLS)
    if not destination_client:
        print("No se encontró conexión con la base de datos destino")
        return

    destination_db = destination_client['records']
    destination_collection = destination_db['sales']

    # Si ya existe la colección 'sales' en la base de datos destino, la borramos
    if 'sales' in destination_db.list_collection_names():
        destination_collection.drop()

    try:
        # Extracción de datos de la base de datos origen
        data = source_collection.find({})

        # Transformación y carga de datos en la base de datos destino
        for record in data:
            # Eliminar el campo _id
            record.pop('_id', None)
            destination_collection.insert_one(record)

        print('Completed')

    except Exception as err:
        print('An error occurred', str(err))


if __name__ == "__main__":
    perform_etl()
