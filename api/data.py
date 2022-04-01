from sqlalchemy import Column, Integer, String, Boolean, DateTime, Date, Float
from database import Base


class Data(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String, unique=True, index=True)
    timestamp = Column(DateTime)
    tanggal_lahir = Column(Date)
    umur = Column(String)
    tinggi_badan = Column(Float)
    berat_badan = Column(Float)
    jenis_kelamin = Column(String)
    alamat_kelurahan = Column(String)
    alamat_kecamatan = Column(String)
    alamat_kota = Column(String)
    alamat_lengkap = Column(String)
    pekerjaan_ayah = Column(String)
    pekerjaan_ibu = Column(String)
    pernah_sedang_tb = Column(Boolean)
    diabetes_anak = Column(String)
    vaksin_bcg = Column(Boolean)
    riwayat_opname_anak = Column(Boolean)
    penyakit_anak = Column(String)
    asi_ekslusif = Column(Boolean)
    tb_serumah = Column(Boolean)
    penyakit_lainnya = Column(String)
    penyakit_serumah = Column(String)
    konsumsi_obat_tb = Column(Boolean)
    luas_rumah = Column(String)
    jumlah_kamar = Column(Integer)
    jumlah_orang = Column(Integer)
    sistem_ventilasi = Column(String)