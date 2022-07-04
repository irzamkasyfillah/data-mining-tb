from sqlalchemy import create_engine, Table, MetaData, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql://root:@localhost:3306/tuberkulosis"

metadata = MetaData()

data = Table(
    "mahasiswa",
    metadata,
    Column("id", Integer, primary_key=True),
    Column("nama", String(255)),
    Column("kelas", String(255))
)


engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
metadata.create_all(engine)


SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db_mahasiswa():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()