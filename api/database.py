from sqlalchemy import create_engine, Table, MetaData, Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = "mysql://root:@localhost:3306/tuberkulosis"

metadata = MetaData()

data = Table(
    "data",
    metadata,
    Column("id", Integer, primary_key=True),
    # Column("code", String(255), unique=True, index=True),
    Column("code", String(255)),
    Column("timestamp", String(255)),
    Column("tanggal_lahir", String(255)),
    Column("umur", String(255)),
    Column("tinggi_badan", Float),
    Column("berat_badan", Float),
    Column("jenis_kelamin", String(255)),
    Column("alamat_kelurahan", String(255)),
    Column("alamat_kecamatan", String(255)),
    Column("alamat_kota", String(255)),
    Column("alamat_lengkap", String(255)),
    Column("pekerjaan_ayah", String(255)),
    Column("pekerjaan_ibu", String(255)),
    Column("pendapatan", String(255)),
    Column("pernah_sedang_tb", String(10)),
    Column("diabetes_anak", String(10)),
    Column("vaksin_bcg", String(10)),
    Column("riwayat_opname_anak", String(10)),
    Column("penyakit_anak", String(255)),
    Column("asi_ekslusif", String(10)),
    Column("tb_serumah", String(10)),
    Column("diabetes_serumah", String(10)),
    Column("penyakit_lainnya", String(255)),
    Column("penyakit_serumah", String(255)),
    Column("konsumsi_obat_tb", String(10)),
    Column("luas_rumah", String(255)),
    Column("jumlah_kamar", Integer),
    Column("jumlah_orang", Integer),
    Column("sistem_ventilasi", String(255))

)

engine = create_engine(
    SQLALCHEMY_DATABASE_URL
)
metadata.create_all(engine)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db

    finally:
        db.close()