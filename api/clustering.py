import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import re
from data import Data
from geopy.geocoders import Nominatim
from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
from sklearn.preprocessing import StandardScaler


def cluster(dataset):
    # print(dataset)
    db = {}
    db_kec = []
    db_kel = []
    db_kota = []
    db_alamat_lengkap = []
    db_asi_eksklusif = []
    db_berat = []
    db_tinggi = []
    db_diabetes_anak = []
    db_diabetes_ortu = []
    db_jenis_kelamin = []
    db_jumlah_kamar = []
    db_jumlah_orang = []
    db_luas_rumah = []
    db_pekerjaan_ayah = []
    db_pekerjaan_ibu = []
    db_pendapatan = []
    db_daftar_penyakit_opname = []
    db_riwayat_penyakit_serumah = []
    db_daftar_penyakit_serumah = []
    db_pernah_tb = []
    db_riwayat_opname_anak = []
    db_sistem_ventilasi = []
    db_tanggal_lahir = []
    db_tb_serumah = []
    db_timestamp = []
    db_umur = []
    db_vaksin_bcg = []

    for i in dataset:
        db_kec.append(i.alamat_kecamatan)
        db_kel.append(i.alamat_kelurahan)
        db_kota.append(i.alamat_kota)
        db_alamat_lengkap.append(i.alamat_lengkap)
        db_asi_eksklusif.append(i.asi_ekslusif)
        db_berat.append(i.berat_badan)
        db_tinggi.append(i.tinggi_badan)
        db_diabetes_anak.append(i.diabetes_anak)
        db_diabetes_ortu.append(i.diabetes_serumah)
        db_jenis_kelamin.append(i.jenis_kelamin)
        db_jumlah_kamar.append(i.jumlah_kamar)
        db_jumlah_orang.append(i.jumlah_orang)
        db_luas_rumah.append(i.luas_rumah)
        db_pekerjaan_ayah.append(i.pekerjaan_ayah)
        db_pekerjaan_ibu.append(i.pekerjaan_ibu)
        db_pendapatan.append(i.pendapatan)
        db_daftar_penyakit_opname.append(i.penyakit_anak)
        db_riwayat_penyakit_serumah.append(i.penyakit_lainnya)
        db_daftar_penyakit_serumah.append(i.penyakit_serumah)
        db_pernah_tb.append(i.pernah_sedang_tb)
        db_riwayat_opname_anak.append(i.riwayat_opname_anak)
        db_sistem_ventilasi.append(i.sistem_ventilasi)
        db_tanggal_lahir.append(i.tanggal_lahir)
        db_tb_serumah.append(i.tb_serumah)
        db_timestamp.append(i.timestamp)
        db_umur.append(i.umur)
        db_vaksin_bcg.append(i.vaksin_bcg)

    db['Kelurahan'] = db_kel
    db['Kecamatan'] = db_kec
    db['Kab/Kota'] = db_kota
    db['Alamat lengkap'] = db_alamat_lengkap
    db['ASI eksklusif'] = db_asi_eksklusif
    db['Berat badan (dalam kg)'] = db_berat
    db['Tinggi badan (dalam cm)'] = db_tinggi
    db['riwayat diabetes anak'] = db_diabetes_anak
    db['riwayat diabetes keluarga'] = db_diabetes_ortu
    db['Jenis Kelamin'] = db_jenis_kelamin
    db['jumlah kamar tidur'] = db_jumlah_kamar
    db['jumlah orang dalam rumah'] = db_jumlah_orang
    db['luas rumah'] = db_luas_rumah
    db['Pekerjaan Ayah'] = db_pekerjaan_ayah
    db['Pekerjaan Ibu'] = db_pekerjaan_ibu
    db['Pendapatan Orang Tua'] = db_pendapatan
    db['daftar penyakit opname'] = db_daftar_penyakit_opname
    db['riwayat penyakit lain orang serumah'] = db_riwayat_penyakit_serumah
    db['daftar penyakit lain orang serumah'] = db_daftar_penyakit_serumah
    db['pernah/sedang TB'] = db_pernah_tb
    db['riwayat opname'] = db_riwayat_opname_anak
    db['sistem ventilasi'] = db_sistem_ventilasi
    db['Tanggal Lahir'] = db_tanggal_lahir
    db['riwayat TB orang serumah'] = db_tb_serumah
    db['Timestamp'] = db_timestamp
    db['Umur'] = db_umur
    db['riwayat vaksin BCG'] = db_vaksin_bcg

    # print(db)

    df = pd.DataFrame(db)
    # print(df)
    data = df.copy()

    #===== BATAS REVISIAN ======#
    # df_original = pd.read_csv('csv/Dataset TB anak.csv')
    # df_original = pd.read_csv(dataset)

    data_status_gizi_laki = pd.read_csv('./csv/status_gizi_laki.csv', header=1)
    data_status_gizi_perempuan = pd.read_csv('./csv/status_gizi_perempuan.csv', header=1)

    # data = df_original.copy()
    # data = data.rename(columns={'Alamat (mohon sertakan nama kelurahan dan kecamatan)': 'Alamat lengkap',
    #                             'Apakah anak pernah atau sedang dalam pengobatan tuberkulosis?': 'pernah/sedang TB',
    #                             'Apakah anak pernah mengalami penyakit diabetes?': 'riwayat diabetes anak',
    #                             'Apakah anak telah menerima imunisasi BCG (Bacillus Calmette-Guérin, imunisasi untuk mencegah penyakit TB)?': 'riwayat vaksin BCG',
    #                             'Apakah anak pernah di opname sebelumnya?': 'riwayat opname',
    #                             'Jika pernah, anak diopname karena penyakit apa saja?': 'daftar penyakit opname',
    #                             'Apakah anak mengkonsumsi ASI secara eksklusif? (ASI Eksklusif adalah pemberian ASI tanpa makanan/minuman (susu formula) tambahan hingga berusia 6 bulan)': 'ASI eksklusif',
    #                             'Apakah ada riwayat penyakit tuberkulosis dalam orang serumah?': 'riwayat TB orang serumah',
    #                             'Apakah ada riwayat penyakit diabetes dalam keluarga (orang tua)?': 'riwayat diabetes keluarga',
    #                             'Apakah ada riwayat penyakit lainnya selain tuberkulosis, diabetes dalam orang  serumah?': 'riwayat penyakit lain orang serumah',
    #                             'Jika ada, penyakit apa saja?': 'daftar penyakit lain orang serumah',
    #                             'Berapa luas rumah tempat anak tinggal?': 'luas rumah',
    #                             'Berapa jumlah kamar tidur dalam rumah?': 'jumlah kamar tidur',
    #                             'Berapa jumlah orang yang tinggal dalam satu rumah?': 'jumlah orang dalam rumah',
    #                             'Bagaimana sistem ventilasi di rumah Anda? ': 'sistem ventilasi'})

    # =========================  PRE PROCESSING  ========================== #
    # DATA CLEANING, INTEGRATION, TRANSFORMATION, REDUCTION

    # HANDLE NAN VALUES

    data['daftar penyakit opname'] = data['daftar penyakit opname'].replace(np.nan, 'Tidak Pernah')
    data['daftar penyakit lain orang serumah'] = data['daftar penyakit lain orang serumah'].replace(np.nan, 'Tidak Ada')
    data_status_gizi_laki['Tahun'] = data_status_gizi_laki['Tahun'].replace(np.nan, 0)
    data_status_gizi_perempuan['Tahun'] = data_status_gizi_perempuan['Tahun'].replace(np.nan, 0)

    # ADD NEW COLUMN FOR 'TAHUN' AND 'BULAN'

    age = data['Umur'].str.split(r'(\d+)', expand=True)
    age = age.replace([None], '0')

    data['Tahun'] = age[1]
    data['Bulan'] = age[3]

    data = data.astype({"Tahun": float, "Bulan": float})

    # CALCULATE THE IMT FOR STATUS GIZI

    data['IMT'] = np.round(
        data['Berat badan (dalam kg)'] / (data['Tinggi badan (dalam cm)'] * data['Tinggi badan (dalam cm)'] / 10000), 2)

    # ===== DATA DAFTAR OPNAME DAN DAFTAR PENYAKIT LAIN ORANG SERUMAH ========#

    daftar_opname = []
    for i in data['daftar penyakit opname']:
        to_list = re.split(', ', i.upper())
        daftar_opname.append(to_list)

    data['daftar opname'] = daftar_opname

    daftar_penyakit = []
    for i in data['daftar penyakit lain orang serumah']:
        to_list = re.split(', ', i.upper())
        daftar_penyakit.append(to_list)

    data['daftar penyakit lain'] = daftar_penyakit

    # ============== DETERMINE THE STATUS GIZI OF EACH DATA ==================#

    def count_z_score(jenis_kelamin, tahun, bulan, imt):
        def count_z(idx):
            if (imt > status_gender['Median'][idx[0]]):
                z = (imt - status_gender['Median'][idx[0]]) / (
                        status_gender['+1 SD'][idx[0]] - status_gender['Median'][idx[0]])
            else:
                z = (imt - status_gender['Median'][idx[0]]) / (
                        status_gender['Median'][idx[0]] - status_gender['-1 SD'][idx[0]])
            return z

        if jenis_kelamin == 'Laki - laki':
            status_gender = data_status_gizi_laki.copy()
        else:
            status_gender = data_status_gizi_perempuan.copy()

        if (tahun < 5):
            tahun = tahun * 12
            bulan = tahun + bulan
            index = status_gender.index[status_gender['Bulan'] == bulan].tolist()
            z_score = count_z(index)
        else:
            index = status_gender.index[(status_gender['Tahun'] == tahun) & (status_gender['Bulan'] == bulan)].tolist()
            if ((tahun == 5) & (bulan == 0)):
                index = status_gender.index[(status_gender['Tahun'] == 5) & (status_gender['Bulan'] == 1)].tolist()
                index[0] = index[0] - 1
            z_score = count_z(index)
        return z_score

    # z_score = np.round(count_z_score('Perempuan', 10, 0, 19.6), 2)
    # print(z_score)
    status_gizi = []
    i = 0
    for imt in data['IMT']:
        z_score = np.round(
            count_z_score(data['Jenis Kelamin'][i], int(data['Tahun'][i]), int(data['Bulan'][i]), data['IMT'][i]), 2)

        if (int(data['Tahun'][i]) < 5):
            if (z_score < -3):
                status = "Gizi buruk"
            elif ((z_score > -3) & (z_score < -2)):
                status = "Gizi kurang"
            elif ((z_score >= -2) & (z_score < 1)):
                status = "Gizi baik"
            elif ((z_score >= 1) & (z_score < 2)):
                status = "Berisiko gizi lebih"
            elif ((z_score >= 2) & (z_score < 3)):
                status = "Gizi lebih"
            elif ((z_score) >= 3):
                status = "Obesitas"
        else:
            if ((z_score >= -3) & (z_score < -2)):
                status = "Gizi kurang"
            elif ((z_score >= -2) & (z_score < 1)):
                status = "Gizi baik"
            elif ((z_score >= 1) & (z_score < 2)):
                status = "Gizi lebih"
            elif ((z_score) >= 2):
                status = "Obesitas"

        status_gizi.append(status)
        i += 1

    data['Status Gizi'] = status_gizi

    # ============== DATA SELECTION =============== #

    data = data.drop(['Timestamp', 'Umur', 'Tanggal Lahir', 'Alamat lengkap', 'Bulan', 'IMT'], axis=1)
    data_positive = data.loc[data['pernah/sedang TB'] == 'Ya'].copy()
    # data_positive = data.copy()

    # ============= DATA TRANSFORMATION ============== #
    # preprocessing numerical

    # scaler = StandardScaler()
    # Num_features = data_positive.select_dtypes(include=['int64','float64']).columns
    # scaler.fit(data_positive[Num_features])
    # data_positive[Num_features] = scaler.transform(data_positive[Num_features])

    # Num_features = data_positive.select_dtypes(include=['int64','float64']).columns
    # data_positive[Num_features] = StandardScaler().fit_transform(data_positive[Num_features])

    # ========== EXPAND COLUMN FOR EACH DAFTAR OPNAME DAN PENYAKIT LAIN ============ #

    opname = data_positive["daftar opname"].explode().unique()
    penyakit_lain = data_positive["daftar penyakit lain"].explode().unique()

    for op in opname:
        if op == 'TIDAK PERNAH':
            continue
        new_col = []
        for row in data_positive['daftar opname']:
            if op in row:
                new_col.append('Ya')
            else:
                new_col.append('Tidak')
        data_positive[op + ' (opname)'] = new_col
        # data_positive[op + ' (opname)'] = data_positive[op + ' (opname)'].astype('object')

    for peny in penyakit_lain:
        if peny == 'TIDAK ADA':
            continue
        new_col = []
        for row in data_positive['daftar penyakit lain']:
            if peny in row:
                new_col.append('Ya')
            else:
                new_col.append('Tidak')
        data_positive[peny + ' (org serumah)'] = new_col
        # data_positive[peny + ' (org serumah)'] = data_positive[peny + ' (org serumah)'].astype('object')

    data_positive['Tahun'] = data_positive['Tahun'].astype('float')

    ## Lowercase values of perkerjaan ayah and ibu columns
    data_positive['Pekerjaan Ayah'] = data_positive['Pekerjaan Ayah'].str.lower()
    data_positive['Pekerjaan Ibu'] = data_positive['Pekerjaan Ibu'].str.lower()

    data_positive = data_positive.drop(['daftar opname', 'riwayat opname', 'pernah/sedang TB', 'daftar penyakit lain',
                                        'daftar penyakit lain orang serumah', 'daftar penyakit opname',
                                        'riwayat penyakit lain orang serumah'], axis=1)

    data_positive = data_positive.loc[data_positive['Kab/Kota'].isin(['Makassar', 'Gowa'])]
    data_positive['Total'] = data_positive['Tahun']

    l = data_positive.columns

    for i in l:
        res = data_positive[i].value_counts(normalize=True) * 100
        if res.iloc[0] >= 96:
            del data_positive[i]
        # print(res)

    # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    dict_cat = {}
    dict_num = {}

    for cat in data_positive.select_dtypes(['object', 'category']):
        if (cat == 'Kecamatan'):
            continue
        dict_cat[cat] = lambda x: x.value_counts().index[0]

    for num in data_positive.select_dtypes(['int64', 'float64']):
        if (num == 'Total'):
            continue
        dict_num[num] = ['mean']

    # ============ CREATE TABLE FOR EACH KECAMATAN ============#

    data_perkecamatan = data_positive.groupby('Kecamatan').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    })

    riwayat_col = ['riwayat diabetes anak', 'riwayat vaksin BCG', 'ASI eksklusif', 'riwayat TB orang serumah',
                   'riwayat diabetes keluarga', 'TIPOID (opname)', 'DEMAM (opname)', 'SESAK (opname)',
                   'HIPERTENSI (org serumah)', 'ASMA (org serumah)', 'ASAM URAT (org serumah)']

    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == 'Ya'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan[k] = new_col

    riwayat_col = ['Status Gizi']
    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == 'Gizi baik'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Status Gizi baik'] = new_col

    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and (
                        data_positive[k][j] == 'Berisiko gizi lebih' or data_positive[k][j] == 'Gizi lebih' or
                        data_positive[k][j] == 'Obesitas')):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Status Gizi lebih'] = new_col

    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and (
                        data_positive[k][j] == 'Gizi kurang' or data_positive[k][j] == 'Gizi buruk')):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Status Gizi kurang'] = new_col

    riwayat_col = ['sistem ventilasi']
    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == 'Setiap ruangan terdapat ventilasi'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Jumlah rumah dgn ventilasi di setiap ruangan'] = new_col

    riwayat_col = ['Pendapatan Orang Tua']
    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '< 2.500.000'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Pendapatan ( < 2.500.000 )'] = new_col

    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '2.500.000 - 5.000.000'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Pendapatan ( 2.500.000 - 5.000.000 )'] = new_col

    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '5.000.001 - 10.000.000'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Pendapatan ( 5.000.001 - 10.000.000 )'] = new_col

    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '> 10.000.000'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Pendapatan ( > 10.000.000 )'] = new_col

    riwayat_col = ['luas rumah']
    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '< 36 m^2'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Luas rumah ( < 36 m^2 )'] = new_col

    riwayat_col = ['luas rumah']
    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '36 - 54 m^2'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Luas rumah ( 36 - 54 m^2 )'] = new_col

    riwayat_col = ['luas rumah']
    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '54 - 120 m^2'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Luas rumah ( 54 - 120 m^2 )'] = new_col

    riwayat_col = ['luas rumah']
    for k in riwayat_col:
        new_col = []
        for i in data_perkecamatan.index:
            total = 0
            for j in data_positive.index:
                if (i == data_positive['Kecamatan'][j] and data_positive[k][j] == '> 120 m^2'):
                    total = total + 1
            new_col.append(total)

        data_perkecamatan['Luas rumah ( > 120 m^2 )'] = new_col

    data_perkecamatan = data_perkecamatan.droplevel(1, axis=1)
    data_perkecamatan = data_perkecamatan.rename(columns={'Total': 'Jumlah TB'})

    # ============= READ ALL REQUIRED DATA ============== #

    # data_original = pd.read_csv('csv/perkecamatan.csv', index_col=0)

    data = data_perkecamatan.copy()
    data = data.rename(
        columns={'Status Gizi lebih': 'Persentase anak gizi lebih', 'Status Gizi kurang': 'Persentase anak gizi kurang',
                 'Status Gizi baik': 'Persentase anak gizi baik', 'Total': 'Jumlah TB',
                 'Tinggi badan (dalam cm)': 'Tinggi anak (mean)', 'Berat badan (dalam kg)': 'Berat anak (mean)',
                 'jumlah kamar tidur': 'Jumlah kamar (mean)',
                 'jumlah orang dalam rumah': 'Jumlah orang di rumah (mean)', 'Tahun': 'Usia (mean)',
                 'riwayat diabetes anak': 'Persentase anak menderita diabetes',
                 'riwayat vaksin BCG': 'Persentase anak telah BCG',
                 'ASI eksklusif': 'Persentase anak dengan ASI eksklusif',
                 'riwayat TB orang serumah': 'Persentase kasus dengan riwayat TB serumah',
                 'riwayat diabetes keluarga': 'Persentase kasus dengan keluarga menderita diabetes'})
    data.index = data.index + ' (' + data['Kab/Kota'] + ')'

    # =========== CHANGE TO PERCENTAGE FORMAT =========== #

    data['Persentase anak gizi baik'] = (data['Persentase anak gizi baik'] / data['Jumlah TB']) * 100
    data['Persentase anak gizi lebih'] = (data['Persentase anak gizi lebih'] / data['Jumlah TB']) * 100
    data['Persentase anak gizi kurang'] = (data['Persentase anak gizi kurang'] / data['Jumlah TB']) * 100

    data['Pendapatan ( < 2.500.000 )'] = (data['Pendapatan ( < 2.500.000 )'] / data['Jumlah TB']) * 100
    data['Pendapatan ( 2.500.000 - 5.000.000 )'] = (data['Pendapatan ( 2.500.000 - 5.000.000 )'] / data[
        'Jumlah TB']) * 100
    data['Pendapatan ( 5.000.001 - 10.000.000 )'] = (data['Pendapatan ( 5.000.001 - 10.000.000 )'] / data[
        'Jumlah TB']) * 100
    data['Pendapatan ( > 10.000.000 )'] = (data['Pendapatan ( > 10.000.000 )'] / data['Jumlah TB']) * 100

    data['Luas rumah ( < 36 m^2 )'] = (data['Luas rumah ( < 36 m^2 )'] / data['Jumlah TB']) * 100
    data['Luas rumah ( 36 - 54 m^2 )'] = (data['Luas rumah ( 36 - 54 m^2 )'] / data['Jumlah TB']) * 100
    data['Luas rumah ( 54 - 120 m^2 )'] = (data['Luas rumah ( 54 - 120 m^2 )'] / data['Jumlah TB']) * 100
    data['Luas rumah ( > 120 m^2 )'] = (data['Luas rumah ( > 120 m^2 )'] / data['Jumlah TB']) * 100

    data['Persentase anak menderita diabetes'] = (data['Persentase anak menderita diabetes'] / data['Jumlah TB']) * 100
    data['Persentase anak telah BCG'] = (data['Persentase anak telah BCG'] / data['Jumlah TB']) * 100
    data['Persentase anak dengan ASI eksklusif'] = (data['Persentase anak dengan ASI eksklusif'] / data[
        'Jumlah TB']) * 100
    data['Persentase kasus dengan riwayat TB serumah'] = (data['Persentase kasus dengan riwayat TB serumah'] / data[
        'Jumlah TB']) * 100
    data['Persentase kasus dengan keluarga menderita diabetes'] = (data[
                                                                       'Persentase kasus dengan keluarga menderita diabetes'] /
                                                                   data['Jumlah TB']) * 100

    # ===== CLUSTER 1 ======= #
    cluster1 = data[['Jumlah TB', 'Usia (mean)']]

    # ============= DATA TRANSFORMATION ============== #
    # preprocessing numerical

    scaler = StandardScaler()
    Num_features = cluster1.select_dtypes(include=['int64', 'float64']).columns
    scaler.fit(cluster1[Num_features])
    cluster1[Num_features] = scaler.transform(cluster1[Num_features])

    # Actual Clustering
    kmeans = KMeans(n_clusters=3, random_state=9)
    preds = kmeans.fit_predict(cluster1)

    pd.Series(kmeans.labels_).value_counts()

    # new column for cluster labels associated with each subject
    cluster1['labels'] = kmeans.labels_
    # cluster1['Segment'] = cluster1['labels'].map({0:'First', 1:'Second'})
    cluster1['Segment'] = cluster1['labels'].map({0: 'First', 1: 'Second', 2: 'Third'})

    # Order the cluster
    cluster1['Segment'] = cluster1['Segment'].astype('category')
    # cluster1['Segment'] = cluster1['Segment'].cat.reorder_categories(['First','Second'])
    cluster1['Segment'] = cluster1['Segment'].cat.reorder_categories(['First', 'Second', 'Third'])

    # ============== INVERSE TRANSFORMATION FOR NUMERIC DATA ================#

    cluster1[Num_features] = scaler.inverse_transform(cluster1[Num_features])

    # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    dict_cat = {}
    dict_num = {}

    for cat in cluster1.select_dtypes('object'):
        dict_cat[cat] = lambda x: x.value_counts().index[0]

    for num in cluster1.select_dtypes(['int64', 'float64']):
        # dict_num[num] = ['mean', 'median', 'min', 'max']
        dict_num[num] = ['mean']

    # ============ CREATE TABLE FOR EACH CLUSTER ============#

    cluster1.rename(columns={'labels': 'Total'}, inplace=True)
    data_percluster1 = cluster1.groupby('Segment').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    }).T

    # ======  COUNT LOGITUDE AND LATITUDE FOR ALL KECAMATAN =======#
    alamat = []
    for i in cluster1.index:
        splitted = i.split(' (')
        alamat.append(splitted[0] + ' ' + splitted[1][:-1])

    geolocator = Nominatim(user_agent="tes")
    coord = []

    for i in range(0, len(alamat)):
        loc = alamat[i]
        location = geolocator.geocode(loc, timeout=None)
        if location is not None:
            m = 0.0025
            coord.append([[location.latitude, location.longitude], [location.latitude + m, location.longitude + m],
                          [location.latitude + m, location.longitude - m],
                          [location.latitude - m, location.longitude + m],
                          [location.latitude - m, location.longitude - m]])
            print(loc)

    coord1 = [i[0] for i in coord]
    coord2 = [i[1] for i in coord]
    coord3 = [i[2] for i in coord]
    coord4 = [i[3] for i in coord]
    coord5 = [i[4] for i in coord]

    cluster1['coord'] = coord1
    cluster1 = cluster1.T

    data_percluster1.to_json(r'./result/cluster1_result.json')
    cluster1.to_json(r'./result/cluster1_df.json')

    # ====== CLUSTER 2 ======== #
    cluster2 = data[['Persentase anak gizi baik', 'Persentase anak gizi lebih', 'Persentase anak gizi kurang']]

    # ============= DATA TRANSFORMATION ============== #
    # preprocessing numerical

    scaler = StandardScaler()
    Num_features = cluster2.select_dtypes(include=['int64', 'float64']).columns
    scaler.fit(cluster2[Num_features])
    cluster2[Num_features] = scaler.transform(cluster2[Num_features])

    # Actual Clustering
    kmeans = KMeans(n_clusters=3, random_state=9)
    preds = kmeans.fit_predict(cluster2)

    pd.Series(kmeans.labels_).value_counts()

    # new column for cluster labels associated with each subject
    cluster2['labels'] = kmeans.labels_
    cluster2['Segment'] = cluster2['labels'].map({0:'First', 1:'Second', 2:'Third'})
    # cluster2['Segment'] = cluster2['labels'].map({0: 'First', 1: 'Second'})

    # Order the cluster
    cluster2['Segment'] = cluster2['Segment'].astype('category')
    cluster2['Segment'] = cluster2['Segment'].cat.reorder_categories(['First','Second','Third'])
    # cluster2['Segment'] = cluster2['Segment'].cat.reorder_categories(['First', 'Second'])

    # ============== INVERSE TRANSFORMATION FOR NUMERIC DATA ================#

    cluster2[Num_features] = scaler.inverse_transform(cluster2[Num_features])

    # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    dict_cat = {}
    dict_num = {}

    for cat in cluster2.select_dtypes('object'):
        dict_cat[cat] = lambda x: x.value_counts().index[0]

    for num in cluster2.select_dtypes(['int64', 'float64']):
        # dict_num[num] = ['mean', 'median', 'min', 'max']
        dict_num[num] = ['mean']

    # ============ CREATE TABLE FOR EACH CLUSTER ============#

    cluster2.rename(columns={'labels': 'Total'}, inplace=True)
    data_percluster2 = cluster2.groupby('Segment').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    }).T

    cluster2['coord'] = coord2
    cluster2 = cluster2.T

    data_percluster2.to_json(r'./result/cluster2_result.json')
    cluster2.to_json(r'./result/cluster2_df.json')

    # ==== CLUSTER 3 ==== #
    cluster3 = data[
        ['Pendapatan ( < 2.500.000 )', 'Pendapatan ( 2.500.000 - 5.000.000 )', 'Pendapatan ( 5.000.001 - 10.000.000 )',
         'Pendapatan ( > 10.000.000 )']]

    # ============= DATA TRANSFORMATION ============== #
    # preprocessing numerical

    scaler = StandardScaler()
    Num_features = cluster3.select_dtypes(include=['int64', 'float64']).columns
    scaler.fit(cluster3[Num_features])
    cluster3[Num_features] = scaler.transform(cluster3[Num_features])

    # Actual Clustering
    kmeans = KMeans(n_clusters=5, random_state=9)
    preds = kmeans.fit_predict(cluster3)

    pd.Series(kmeans.labels_).value_counts()

    # new column for cluster labels associated with each subject
    cluster3['labels'] = kmeans.labels_
    # cluster3['Segment'] = cluster3['labels'].map({0:'First', 1:'Second'})
    cluster3['Segment'] = cluster3['labels'].map({0: 'First', 1: 'Second', 2: 'Third', 3: 'Fourth', 4: 'Fifth'})
    # cluster3['Segment'] = cluster3['labels'].map({0:'First', 1:'Second',2:'Third',3:'Fourth'})

    # Order the cluster
    cluster3['Segment'] = cluster3['Segment'].astype('category')
    cluster3['Segment'] = cluster3['Segment'].cat.reorder_categories(['First', 'Second', 'Third', 'Fourth', 'Fifth'])
    # cluster3['Segment'] = cluster3['Segment'].cat.reorder_categories(['First','Second','Third','Fourth'])

    # ============== INVERSE TRANSFORMATION FOR NUMERIC DATA ================#

    cluster3[Num_features] = scaler.inverse_transform(cluster3[Num_features])

    # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    dict_cat = {}
    dict_num = {}

    for cat in cluster3.select_dtypes('object'):
        dict_cat[cat] = lambda x: x.value_counts().index[0]

    for num in cluster3.select_dtypes(['int64', 'float64']):
        # dict_num[num] = ['mean', 'median', 'min', 'max']
        dict_num[num] = ['mean']

    # ============ CREATE TABLE FOR EACH CLUSTER ============#

    cluster3.rename(columns={'labels': 'Total'}, inplace=True)
    data_percluster3 = cluster3.groupby('Segment').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    }).T

    cluster3['coord'] = coord3
    cluster3 = cluster3.T

    data_percluster3.to_json(r'./result/cluster3_result.json')
    cluster3.to_json(r'./result/cluster3_df.json')

    # ==== CLUSTER 4 ==== #
    cluster4 = data[['Luas rumah ( < 36 m^2 )', 'Luas rumah ( 36 - 54 m^2 )', 'Luas rumah ( 54 - 120 m^2 )',
                     'Luas rumah ( > 120 m^2 )']]

    # ============= DATA TRANSFORMATION ============== #
    # preprocessing numerical

    scaler = StandardScaler()
    Num_features = cluster4.select_dtypes(include=['int64', 'float64']).columns
    scaler.fit(cluster4[Num_features])
    cluster4[Num_features] = scaler.transform(cluster4[Num_features])

    # Actual Clustering
    kmeans = KMeans(n_clusters=5, random_state=9)
    preds = kmeans.fit_predict(cluster4)

    pd.Series(kmeans.labels_).value_counts()

    # new column for cluster labels associated with each subject
    cluster4['labels'] = kmeans.labels_
    cluster4['Segment'] = cluster4['labels'].map({0: 'First', 1: 'Second', 2: 'Third', 3: 'Fourth', 4: 'Fifth'})

    # Order the cluster
    cluster4['Segment'] = cluster4['Segment'].astype('category')
    cluster4['Segment'] = cluster4['Segment'].cat.reorder_categories(['First', 'Second', 'Third', 'Fourth', 'Fifth'])

    # ============== INVERSE TRANSFORMATION FOR NUMERIC DATA ================#

    cluster4[Num_features] = scaler.inverse_transform(cluster4[Num_features])

    # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    dict_cat = {}
    dict_num = {}

    for cat in cluster4.select_dtypes('object'):
        dict_cat[cat] = lambda x: x.value_counts().index[0]

    for num in cluster4.select_dtypes(['int64', 'float64']):
        # dict_num[num] = ['mean', 'median', 'min', 'max']
        dict_num[num] = ['mean']

    # ============ CREATE TABLE FOR EACH CLUSTER ============#

    cluster4.rename(columns={'labels': 'Total'}, inplace=True)
    data_percluster4 = cluster4.groupby('Segment').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    }).T

    cluster4['coord'] = coord4
    cluster4 = cluster4.T

    data_percluster4.to_json(r'./result/cluster4_result.json')
    cluster4.to_json(r'./result/cluster4_df.json')

    # ==== CLUSTER 5 ==== #
    cluster5 = data[['Persentase anak telah BCG', 'Persentase anak dengan ASI eksklusif',
                     'Persentase kasus dengan riwayat TB serumah', 'Persentase anak menderita diabetes',
                     'Persentase kasus dengan keluarga menderita diabetes']]

    # ============= DATA TRANSFORMATION ============== #
    # preprocessing numerical

    scaler = StandardScaler()
    Num_features = cluster5.select_dtypes(include=['int64', 'float64']).columns
    scaler.fit(cluster5[Num_features])
    cluster5[Num_features] = scaler.transform(cluster5[Num_features])

    # Actual Clustering
    kmeans = KMeans(n_clusters=4, random_state=9)
    preds = kmeans.fit_predict(cluster5)

    pd.Series(kmeans.labels_).value_counts()

    # new column for cluster labels associated with each subject
    cluster5['labels'] = kmeans.labels_
    cluster5['Segment'] = cluster5['labels'].map({0: 'First', 1: 'Second', 2: 'Third', 3: 'Fourth'})

    # Order the cluster
    cluster5['Segment'] = cluster5['Segment'].astype('category')
    cluster5['Segment'] = cluster5['Segment'].cat.reorder_categories(['First', 'Second', 'Third', 'Fourth'])

    # ============== INVERSE TRANSFORMATION FOR NUMERIC DATA ================#

    cluster5[Num_features] = scaler.inverse_transform(cluster5[Num_features])

    # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    dict_cat = {}
    dict_num = {}

    for cat in cluster5.select_dtypes('object'):
        dict_cat[cat] = lambda x: x.value_counts().index[0]

    for num in cluster5.select_dtypes(['int64', 'float64']):
        # dict_num[num] = ['mean', 'median', 'min', 'max']
        dict_num[num] = ['mean']

    # ============ CREATE TABLE FOR EACH CLUSTER ============#

    cluster5.rename(columns={'labels': 'Total'}, inplace=True)
    data_percluster5 = cluster5.groupby('Segment').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    }).T

    cluster5['coord'] = coord5
    cluster5 = cluster5.T

    data_percluster5.to_json(r'./result/cluster5_result.json')
    cluster5.to_json(r'./result/cluster5_df.json')

    return {
        # 'df': data_positive,
        # 'data_kecamatan': data_kecamatan,
        # 'data_cluster1': data_percluster1.to_json(),
        # 'data_coordinate': data_coord,
        # 'data_coordinate': data_coordinate
    }