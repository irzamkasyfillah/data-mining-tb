import json
import numpy as np
import os
import pandas as pd
import shutil
import uvicorn
from asosiasi import asosiasi
from clustering import cluster
from data import Data
from data_mahasiswa import DataMahasiswa
from database import get_db
from datetime import datetime
from db_mahasiswa import get_db_mahasiswa
from fastapi import FastAPI, UploadFile, File, Depends, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from os import path
from pydantic import BaseModel
from sqlalchemy.orm import Session
from datetime import datetime

app = FastAPI()
dataset = "./dataset/Dataset_TB_anak.csv"
start = datetime.today()
format = "%d%m%Y_%H%M%S_"

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def root(start_date: datetime = start):
    return {"start_date": start_date}


@app.post("/create")
async def create(data: Request, db: Session = Depends(get_db_mahasiswa)):
    req = await data.json()

    db_data = DataMahasiswa(
        nama=req['nama'],
        kelas=req['kelas']
    )
    db.add(db_data)
    db.commit()
    return {
        'status': 'Success',
        'data': req
    }


@app.get("/read")
def read_root(db: Session = Depends(get_db_mahasiswa)):
    return db.query(DataMahasiswa).all()


@app.get("/edit/{id}")
def read_root(id: int, db: Session = Depends(get_db_mahasiswa)):
    return db.query(DataMahasiswa).get(id)


@app.put("/update/{id}")
async def read_root(id: int, data: Request, db: Session = Depends(get_db_mahasiswa)):
    req = await data.json()
    get_data = db.query(DataMahasiswa).get(id)
    if get_data:
        get_data.nama = req['nama']
        get_data.kelas = req['kelas']

    db.commit()
    db.refresh(get_data)
    return {
        'status': 'Success update data',
        'data': req
    }


@app.delete("/delete/{id}")
async def read_root(id: int, db: Session = Depends(get_db_mahasiswa)):
    get_data = db.query(DataMahasiswa).get(id)
    if get_data:
        db.delete(get_data)
        db.commit()

    return {
        'status': 'Success delete data',
        'data': get_data
    }


@app.post("/data-create")
async def create(data: Request, db: Session = Depends(get_db)):
    req = await data.json()

    db_data = Data(
        code='0',
        timestamp=datetime.today().strftime('%d/%m/%Y %H:%M:%S'),
        tanggal_lahir='',
        umur=req['umur'],
        tinggi_badan=req['tinggi'],
        berat_badan=req['berat'],
        jenis_kelamin=req['jenis_kelamin'],
        alamat_kelurahan=req['kelurahan'],
        alamat_kecamatan=req['kecamatan'],
        alamat_kota=req['kab_kota'],
        alamat_lengkap='',
        pekerjaan_ayah=req['pekerjaan_ayah'],
        pekerjaan_ibu=req['pekerjaan_ibu'],
        pendapatan=req['pendapatan'],
        pernah_sedang_tb='Ya',
        diabetes_anak=req['diabetes_anak'],
        vaksin_bcg=req['vaksin_bcg'],
        riwayat_opname_anak=req['riwayat_opname'],
        penyakit_anak=req['daftar_penyakit_opname'],
        asi_ekslusif=req['asi_eksklusif'],
        tb_serumah=req['tb_serumah'],
        diabetes_serumah=req['diabetes_ortu'],
        penyakit_lainnya=req['riwayat_penyakit_serumah'],
        penyakit_serumah=req['daftar_penyakit_serumah'],
        konsumsi_obat_tb='Ya',
        luas_rumah=req['luas_rumah'],
        jumlah_kamar=req['jumlah_kamar'],
        jumlah_orang=req['jumlah_orang'],
        sistem_ventilasi=req['sistem_ventilasi']
    )
    db.add(db_data)
    db.commit()
    return {
        'status': 'Success',
        'data': req
    }


@app.get("/data-edit/{id}")
def read_root(id: int, db: Session = Depends(get_db)):
    return db.query(Data).get(id)


@app.put("/data-update/{id}")
async def read_root(id: int, data: Request, db: Session = Depends(get_db)):
    req = await data.json()
    get_data = db.query(Data).get(id)
    if get_data:
        get_data.code = '0',
        get_data.timestamp = datetime.today().strftime('%d/%m/%Y %H:%M:%S'),
        get_data.tanggal_lahir = '',
        get_data.umur = req['umur'],
        get_data.tinggi_badan = req['tinggi'],
        get_data.berat_badan = req['berat'],
        get_data.jenis_kelamin = req['jenis_kelamin'],
        get_data.alamat_kelurahan = req['kelurahan'],
        get_data.alamat_kecamatan = req['kecamatan'],
        get_data.alamat_kota = req['kab_kota'],
        get_data.alamat_lengkap = '',
        get_data.pekerjaan_ayah = req['pekerjaan_ayah'],
        get_data.pekerjaan_ibu = req['pekerjaan_ibu'],
        get_data.pendapatan = req['pendapatan'],
        get_data.pernah_sedang_tb = 'Ya',
        get_data.diabetes_anak = req['diabetes_anak'],
        get_data.vaksin_bcg = req['vaksin_bcg'],
        get_data.riwayat_opname_anak = req['riwayat_opname'],
        get_data.penyakit_anak = req['daftar_penyakit_opname'],
        get_data.asi_ekslusif = req['asi_eksklusif'],
        get_data.tb_serumah = req['tb_serumah'],
        get_data.diabetes_serumah = req['diabetes_ortu'],
        get_data.penyakit_lainnya = req['riwayat_penyakit_serumah'],
        get_data.penyakit_serumah = req['daftar_penyakit_serumah'],
        get_data.konsumsi_obat_tb = 'Ya',
        get_data.luas_rumah = req['luas_rumah'],
        get_data.jumlah_kamar = req['jumlah_kamar'],
        get_data.jumlah_orang = req['jumlah_orang'],
        get_data.sistem_ventilasi = req['sistem_ventilasi']

    db.commit()
    db.refresh(get_data)
    return {
        'status': 'Success update data',
        'data': req
    }


@app.delete("/data-delete/{id}")
async def read_root(id: int, db: Session = Depends(get_db)):
    get_data = db.query(Data).get(id)
    if get_data:
        db.delete(get_data)
        db.commit()

    return {
        'status': 'Success delete data',
        'data': get_data
    }


@app.delete("/data-delete-all")
async def read_root(db: Session = Depends(get_db)):
    all_data = db.query(Data).all()
    for i in all_data:
        get_data = db.query(Data).get(i.id)
        db.delete(get_data)
        db.commit()

    return {
        'status': 'Success delete all data',
        'data': all_data
    }


@app.post("/uploadfile")
async def create_upload_file(background_task: BackgroundTasks, db: Session = Depends(get_db),
                             uploaded_file: UploadFile = File(...)):
    print(uploaded_file, "uploaded_file")
    allowedFiles = {"application/vnd.ms-excel", "text/csv"}
    if uploaded_file.content_type in allowedFiles:
        date_time = start.strftime(format)
        file_location = path.join("./dataset", date_time + uploaded_file.filename)
        with open(file_location, "wb") as file_object:
            shutil.copyfileobj(uploaded_file.file, file_object)

        global dataset
        dataset = file_location
        print(dataset, "dataset")

        df = pd.read_csv(dataset)

        df['Jika pernah, anak diopname karena penyakit apa saja?'] = df[
            'Jika pernah, anak diopname karena penyakit apa saja?'].replace(np.nan, 'Tidak Pernah')
        df['Jika ada, penyakit apa saja?'] = df['Jika ada, penyakit apa saja?'].replace(np.nan, 'Tidak Ada')

        for index, df_data in df.iterrows():
            # existing_data = db.query(Data).filter(Data.code == df_data['code']).first()
            # if not existing_data:
            if not False:
                db_data = Data(
                    code=df_data['code'],
                    timestamp=df_data['Timestamp'],
                    tanggal_lahir=df_data['Tanggal Lahir'],
                    umur=df_data['Umur'],
                    tinggi_badan=df_data['Tinggi badan (dalam cm)'],
                    berat_badan=df_data['Berat badan (dalam kg)'],
                    jenis_kelamin=df_data['Jenis Kelamin'],
                    alamat_kelurahan=df_data['Kelurahan'],
                    alamat_kecamatan=df_data['Kecamatan'],
                    alamat_kota=df_data['Kab/Kota'],
                    alamat_lengkap=df_data['Alamat (mohon sertakan nama kelurahan dan kecamatan)'],
                    pekerjaan_ayah=df_data['Pekerjaan Ayah'],
                    pekerjaan_ibu=df_data['Pekerjaan Ibu'],
                    pendapatan=df_data['Pendapatan Orang Tua'],
                    pernah_sedang_tb=df_data['Apakah anak pernah atau sedang dalam pengobatan tuberkulosis?'],
                    diabetes_anak=df_data['Apakah anak pernah mengalami penyakit diabetes?'],
                    vaksin_bcg=df_data[
                        'Apakah anak telah menerima imunisasi BCG (Bacillus Calmette-Guérin, imunisasi untuk mencegah penyakit TB)?'],
                    riwayat_opname_anak=df_data['Apakah anak pernah di opname sebelumnya?'],
                    penyakit_anak=df_data['Jika pernah, anak diopname karena penyakit apa saja?'],
                    asi_ekslusif=df_data[
                        'Apakah anak mengkonsumsi ASI secara eksklusif? (ASI Eksklusif adalah pemberian ASI tanpa makanan/minuman (susu formula) tambahan hingga berusia 6 bulan)'],
                    tb_serumah=df_data['Apakah ada riwayat penyakit tuberkulosis dalam orang serumah?'],
                    diabetes_serumah=df_data['Apakah ada riwayat penyakit diabetes dalam keluarga (orang tua)?'],
                    penyakit_lainnya=df_data[
                        'Apakah ada riwayat penyakit lainnya selain tuberkulosis, diabetes dalam orang  serumah?'],
                    penyakit_serumah=df_data['Jika ada, penyakit apa saja?'],
                    konsumsi_obat_tb=df_data[
                        'Apakah ada yang pernah atau sedang mengkonsumsi obat tuberkulosis dalam orang serumah?'],
                    luas_rumah=df_data['Berapa luas rumah tempat anak tinggal?'],
                    jumlah_kamar=df_data['Berapa jumlah kamar tidur dalam rumah?'],
                    jumlah_orang=df_data['Berapa jumlah orang yang tinggal dalam satu rumah?'],
                    sistem_ventilasi=df_data['Bagaimana sistem ventilasi di rumah Anda? ']
                )

                db.add(db_data)
        db.commit()

        return {"info": f"file '{uploaded_file.filename}' saved at '{file_location}'"}

    else:
        return {"info": 'Hanya menerima file CSV'}


@app.get("/get_data")
def read_root(db: Session = Depends(get_db)):
    return db.query(Data).all()


@app.get("/asosiasi")
def read_data():
    if os.path.exists("./rules/location.json") and os.path.exists("./rules/data.json"):
        with open('./rules/location.json', 'r') as data1:
            data_lokasi = json.load(data1)
        with open('./rules/data.json', 'r') as data:
            data_asosiasi = json.load(data)
        with open('./rules/data_highest.json', 'r') as data:
            data_highest = json.load(data)
        with open('./rules/list_antecedents_unique.json', 'r') as data:
            data_list_antecedents = json.load(data)
        with open('./rules/list_consequents_unique.json', 'r') as data:
            data_list_consequents = json.load(data)
        with open('./rules/list_aturan.json', 'r') as data:
            data_list_aturan = json.load(data)

        return {
            'locations': data_lokasi,
            'dict_kec_rules_location': data_asosiasi,
            'highest_kec': data_highest,
            'list_antecedents_unique': data_list_antecedents,
            'list_consequents_unique': data_list_consequents,
            'list_aturan': data_list_aturan
        }
    else:
        return False


@app.post("/run_asosiasi")
async def read_root(background_task: BackgroundTasks, db: Session = Depends(get_db)):
    if os.path.exists('./rules/location.json'):
        os.remove('./rules/location.json')
    if os.path.exists('./rules/data.json'):
        os.remove('./rules/data.json')

    data = db.query(Data).all()
    background_task.add_task(asosiasi, data, 0.35, 0.9)
    return {
        'message': 'Running association...',
        'dataset': data
    }


@app.get("/cluster")
async def do_cluster():
    if os.path.exists("./result/cluster1_result.json") and os.path.exists("./result/cluster1_df.json"):
        with open("./result/cluster1_result.json", "r") as j:
            cluster1_result = json.load(j)
        with open("./result/cluster1_df.json", "r") as k:
            cluster1_df = json.load(k)
        with open("./result/cluster2_result.json", "r") as j:
            cluster2_result = json.load(j)
        with open("./result/cluster2_df.json", "r") as k:
            cluster2_df = json.load(k)
        with open("./result/cluster3_result.json", "r") as j:
            cluster3_result = json.load(j)
        with open("./result/cluster3_df.json", "r") as k:
            cluster3_df = json.load(k)
        with open("./result/cluster4_result.json", "r") as j:
            cluster4_result = json.load(j)
        with open("./result/cluster4_df.json", "r") as k:
            cluster4_df = json.load(k)
        with open("./result/cluster5_result.json", "r") as j:
            cluster5_result = json.load(j)
        with open("./result/cluster5_df.json", "r") as k:
            cluster5_df = json.load(k)
        return {
            'cluster1_result': cluster1_result,
            'cluster1_df': cluster1_df,
            'cluster2_result': cluster2_result,
            'cluster2_df': cluster2_df,
            'cluster3_result': cluster3_result,
            'cluster3_df': cluster3_df,
            'cluster4_result': cluster4_result,
            'cluster4_df': cluster4_df,
            'cluster5_result': cluster5_result,
            'cluster5_df': cluster5_df,
        }
    else:
        return False


@app.post("/run_cluster")
async def do_cluster(background_task: BackgroundTasks, db: Session = Depends(get_db)):
    if os.path.exists("./result/cluster1_result.json"):
        os.remove("./result/cluster1_result.json")
    if os.path.exists("./result/cluster1_df.json"):
        os.remove("./result/cluster1_df.json")
    if os.path.exists("./result/cluster2_result.json"):
        os.remove("./result/cluster2_result.json")
    if os.path.exists("./result/cluster2_df.json"):
        os.remove("./result/cluster2_df.json")
    if os.path.exists("./result/cluster3_result.json"):
        os.remove("./result/cluster3_result.json")
    if os.path.exists("./result/cluster3_df.json"):
        os.remove("./result/cluster3_df.json")
    if os.path.exists("./result/cluster4_result.json"):
        os.remove("./result/cluster4_result.json")
    if os.path.exists("./result/cluster4_df.json"):
        os.remove("./result/cluster4_df.json")
    if os.path.exists("./result/cluster5_result.json"):
        os.remove("./result/cluster5_result.json")
    if os.path.exists("./result/cluster5_df.json"):
        os.remove("./result/cluster5_df.json")

    data = db.query(Data).all()
    background_task.add_task(cluster, data)
    return {
        'message': 'Running cluster...',
        'data': data
    }


if __name__ == '__main__':
    uvicorn.run("main:app", host='127.0.0.1', port=8080, reload=True)