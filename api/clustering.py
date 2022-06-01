import numpy as np
import pandas as pd
import re
from data import Data
from geopy.geocoders import Nominatim
from sklearn.metrics import silhouette_score
from sklearn.cluster import KMeans
# from kmodes.kprototypes import KPrototypes
# from lightgbm import LGBMClassifier
# from sklearn.model_selection import cross_val_score
# from sklearn.preprocessing import PowerTransformer
from sklearn.preprocessing import StandardScaler


def cluster(dataset):
    # df = pd.read_csv(dataset)
    # data_status_gizi_laki = pd.read_csv('csv/status_gizi_laki.csv', header=1)
    # data_status_gizi_perempuan = pd.read_csv('csv/status_gizi_perempuan.csv', header=1)
    #
    # data = df.copy()
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
    #
    # # =========================  PRE PROCESSING  ========================== #
    # # DATA CLEANING, TRANSFORMATION, REDUCTION
    #
    # # HANDLE NAN VALUES
    #
    # data['daftar penyakit opname'] = data['daftar penyakit opname'].replace(np.nan, 'Tidak Pernah')
    # data['daftar penyakit lain orang serumah'] = data['daftar penyakit lain orang serumah'].replace(np.nan, 'Tidak Ada')
    # data_status_gizi_laki['Tahun'] = data_status_gizi_laki['Tahun'].replace(np.nan, 0)
    # data_status_gizi_perempuan['Tahun'] = data_status_gizi_perempuan['Tahun'].replace(np.nan, 0)
    #
    # # ADD NEW COLUMN FOR 'TAHUN' AND 'BULAN'
    #
    # age = data['Umur'].str.split(r'(\d+)', expand=True)
    # age = age.replace([None], '0')
    #
    # data['Tahun'] = age[1]
    # data['Bulan'] = age[3]
    #
    # data = data.astype({"Tahun": float, "Bulan": float})
    #
    # # CALCULATE THE IMT FOR STATUS GIZI
    #
    # data['IMT'] = np.round(
    #     data['Berat badan (dalam kg)'] / (data['Tinggi badan (dalam cm)'] * data['Tinggi badan (dalam cm)'] / 10000), 2)
    # # data['IMT'] = data['Berat badan (dalam kg)']/(pow(data['Tinggi badan (dalam cm)']/100, 2))
    #
    # # ===== DATA DAFTAR OPNAME DAN DAFTAR PENYAKIT LAIN ORANG SERUMAH ========#
    #
    # daftar_opname = []
    # for i in data['daftar penyakit opname']:
    #     # delete_space = re.sub(' ', '', i)
    #     to_list = re.split(', ', i.upper())
    #     daftar_opname.append(to_list)
    #
    # data['daftar opname'] = daftar_opname
    #
    # daftar_penyakit = []
    # for i in data['daftar penyakit lain orang serumah']:
    #     # delete_space = re.sub(' ', '', i)
    #     to_list = re.split(', ', i.upper())
    #     daftar_penyakit.append(to_list)
    #
    # data['daftar penyakit lain'] = daftar_penyakit
    #
    # # ============== DETERMINE THE STATUS GIZI OF EACH DATA ==================#
    #
    # def count_z_score(jenis_kelamin, tahun, bulan, imt):
    #     def count_z(idx):
    #         if (imt > status_gender['Median'][idx[0]]):
    #             z = (imt - status_gender['Median'][idx[0]]) / (
    #                     status_gender['+1 SD'][idx[0]] - status_gender['Median'][idx[0]])
    #         else:
    #             z = (imt - status_gender['Median'][idx[0]]) / (
    #                     status_gender['Median'][idx[0]] - status_gender['-1 SD'][idx[0]])
    #         return z
    #
    #     if jenis_kelamin == 'Laki - laki':
    #         status_gender = data_status_gizi_laki.copy()
    #     else:
    #         status_gender = data_status_gizi_perempuan.copy()
    #
    #     if (tahun < 5):
    #         tahun = tahun * 12
    #         bulan = tahun + bulan
    #         index = status_gender.index[status_gender['Bulan'] == bulan].tolist()
    #         z_score = count_z(index)
    #     else:
    #         index = status_gender.index[(status_gender['Tahun'] == tahun) & (status_gender['Bulan'] == bulan)].tolist()
    #         if ((tahun == 5) & (bulan == 0)):
    #             index = status_gender.index[(status_gender['Tahun'] == 5) & (status_gender['Bulan'] == 1)].tolist()
    #             index[0] = index[0] - 1
    #         z_score = count_z(index)
    #     return z_score
    #
    # # z_score = np.round(count_z_score('Perempuan', 10, 0, 19.6), 2)
    # # print(z_score)
    # status_gizi = []
    # i = 0
    # for imt in data['IMT']:
    #     z_score = np.round(
    #         count_z_score(data['Jenis Kelamin'][i], int(data['Tahun'][i]), int(data['Bulan'][i]), data['IMT'][i]), 2)
    #
    #     if (int(data['Tahun'][i]) < 5):
    #         if (z_score < -3):
    #             status = "Gizi buruk"
    #         elif ((z_score > -3) & (z_score < -2)):
    #             status = "Gizi kurang"
    #         elif ((z_score >= -2) & (z_score < 1)):
    #             status = "Gizi baik"
    #         elif ((z_score >= 1) & (z_score < 2)):
    #             status = "Berisiko gizi lebih"
    #         elif ((z_score >= 2) & (z_score < 3)):
    #             status = "Gizi lebih"
    #         elif ((z_score) >= 3):
    #             status = "Obesitas"
    #     else:
    #         if ((z_score >= -3) & (z_score < -2)):
    #             status = "Gizi kurang"
    #         elif ((z_score >= -2) & (z_score < 1)):
    #             status = "Gizi baik"
    #         elif ((z_score >= 1) & (z_score < 2)):
    #             status = "Gizi lebih"
    #         elif ((z_score) >= 2):
    #             status = "Obesitas"
    #
    #     # print("IMT = ", imt, ", Z score = ", z_score)
    #     status_gizi.append(status)
    #     i += 1
    #
    # data['Status Gizi'] = status_gizi
    #
    # # ============== DATA SELECTION =============== #
    #
    # data = data.drop(['code', 'Timestamp', 'Umur', 'Tanggal Lahir', 'Alamat lengkap',
    #                   'Apakah ada yang pernah atau sedang mengkonsumsi obat tuberkulosis dalam orang serumah?', 'Bulan',
    #                   'IMT'], axis=1)
    #
    # # data_positive = data.loc[data['pernah/sedang TB'] == 'Ya'].copy()
    # data_positive = data.copy()
    #
    # # ============= DATA TRANSFORMATION ============== #
    # # preprocessing numerical
    #
    # # scaler = StandardScaler()
    # # Num_features = data_positive.select_dtypes(include=['int64','float64']).columns
    # # scaler.fit(data_positive[Num_features])
    # # data_positive[Num_features] = scaler.transform(data_positive[Num_features])
    #
    # # Num_features = data_positive.select_dtypes(include=['int64','float64']).columns
    # # data_positive[Num_features] = StandardScaler().fit_transform(data_positive[Num_features])
    #
    # # ========== EXPAND COLUMN FOR EACH DAFTAR OPNAME DAN PENYAKIT LAIN ============ #
    #
    # opname = data_positive["daftar opname"].explode().unique()
    # penyakit_lain = data_positive["daftar penyakit lain"].explode().unique()
    #
    # for op in opname:
    #     if op == 'TIDAK PERNAH':
    #         continue
    #     new_col = []
    #     for row in data_positive['daftar opname']:
    #         if op in row:
    #             new_col.append('Ya')
    #         else:
    #             new_col.append('Tidak')
    #     data_positive[op + ' (opname)'] = new_col
    #     # data_positive[op + ' (opname)'] = data_positive[op + ' (opname)'].astype('object')
    #
    # for peny in penyakit_lain:
    #     if peny == 'TIDAK ADA':
    #         continue
    #     new_col = []
    #     for row in data_positive['daftar penyakit lain']:
    #         if peny in row:
    #             new_col.append('Ya')
    #         else:
    #             new_col.append('Tidak')
    #     data_positive[peny + ' (org serumah)'] = new_col
    #     # data_positive[peny + ' (org serumah)'] = data_positive[peny + ' (org serumah)'].astype('object')
    #
    # ## Lowercase values of perkerjaan ayah and ibu columns
    # data_positive['Pekerjaan Ayah'] = data_positive['Pekerjaan Ayah'].str.lower()
    # data_positive['Pekerjaan Ibu'] = data_positive['Pekerjaan Ibu'].str.lower()
    #
    # data_positive = data_positive.drop(
    #     ['Alamat (Kelurahan)', 'daftar opname', 'riwayat opname', 'pernah/sedang TB', 'daftar penyakit lain',
    #      'daftar penyakit lain orang serumah', 'daftar penyakit opname', 'riwayat penyakit lain orang serumah'], axis=1)
    #
    # # ============= K-PROTOTYPE CLUSTERING ALGORYTHM ================= #
    # kprot_data = data_positive.copy()
    # # Pre-processing
    # for c in kprot_data.select_dtypes(exclude='object').columns:
    #     pt = PowerTransformer()
    #     kprot_data[c] = pt.fit_transform(np.array(kprot_data[c]).reshape(-1, 1))
    #
    # categorical_index = [kprot_data.columns.get_loc(col) for col in list(kprot_data.select_dtypes('object').columns)]
    #
    # # Actual clustering
    # kproto = KPrototypes(n_clusters=5, init='Cao', random_state=36, verbose=2)
    # clusters = kproto.fit_predict(kprot_data, categorical=categorical_index)
    #
    # data_kproto = data_positive.copy()
    #
    # data_kproto['labels'] = kproto.labels_
    #
    # data_kproto['Segment'] = data_kproto['labels'].map(
    #     {0: '1', 1: '2', 2: '3', 3: '4', 4: '5'})
    # # {0: '1', 1: '2', 2: '3'})
    # # Order the cluster
    # data_kproto['Segment'] = data_kproto['Segment'].astype('category')
    # data_kproto['Segment'] = data_kproto['Segment'].cat.reorder_categories(
    #     ['1', '2', '3', '4', '5'])
    # # ['1', '2', '3'])
    #
    # # =============== COUNT F1 SCORE =============== #
    #
    # # Setting the objects to category
    # lgbm_data = data_positive.copy()
    # for c in lgbm_data.select_dtypes(include='object'):
    #     lgbm_data[c] = lgbm_data[c].astype('category')
    #
    # clf_kp = LGBMClassifier(colsample_by_tree=0.8)
    # cv_scores_kp = cross_val_score(clf_kp, lgbm_data, clusters, scoring='f1_weighted')
    # print(f'CV F1 score for K-Prototypes clusters is {np.mean(cv_scores_kp)}')
    #
    # # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    # dict_cat = {}
    # dict_num = {}
    #
    # for cat in data_kproto.select_dtypes(['object', 'category']):
    #     if (cat == 'Pekerjaan Ayah' or cat == 'Pekerjaan Ibu' or cat == 'Segment'):
    #         dict_cat[cat] = lambda x: x.value_counts().index[0]
    #     else:
    #         dict_cat[cat] = lambda x: (x.value_counts().index, x.value_counts())
    #
    # for num in data_kproto.select_dtypes(['int64', 'float64']):
    #     dict_num[num] = ['mean', 'median', 'min', 'max']
    #
    # # ============ CREATE TABLE FOR EACH CLUSTER ============#
    #
    # data_kproto.rename(columns={'labels': 'Total'}, inplace=True)
    # data_percluster = data_kproto.groupby('Segment').agg({
    #
    #     'Total': 'count',
    #     **dict_cat,
    #     **dict_num
    #
    # }).reset_index().T
    #
    # index_2 = []
    # for i in range(0, data_percluster.shape[0]):
    #     if ((data_percluster.index[i][1] == '<lambda>') or (data_percluster.index[i][1] == 'count')):
    #         index_2.append(data_percluster.index[i][0])
    #     else:
    #         index_2.append(data_percluster.index[i][0] + ' (' + data_percluster.index[i][1] + ')')
    #
    # data_cluster = pd.DataFrame(np.array(data_percluster), index=index_2,
    #                             columns=data_percluster.columns)
    #
    # # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    # dict_cat = {}
    # dict_num = {}
    #
    # for cat in data_kproto.select_dtypes(['object', 'category']):
    #     if (cat == 'Alamat (Kecamatan)'):
    #         continue
    #     elif (cat == 'Pekerjaan Ayah' or cat == 'Pekerjaan Ibu' or cat == 'Segment' or cat == 'Alamat (Kab/Kota)'):
    #         dict_cat[cat] = lambda x: x.value_counts().index[0]
    #     else:
    #         dict_cat[cat] = lambda x: (x.value_counts().index, x.value_counts())
    #
    # for num in data_kproto.select_dtypes(['int64', 'float64']):
    #     dict_num[num] = ['mean', 'median', 'min', 'max']
    #
    # # ============ CREATE TABLE FOR EACH KECAMATAN ============#
    #
    # data_kproto.rename(columns={'labels': 'Total'}, inplace=True)
    # data_perkecamatan = data_kproto.groupby('Alamat (Kecamatan)').agg({
    #
    #     'Total': 'count',
    #     **dict_num,
    #     **dict_cat
    #
    # }).T
    #
    # index = []
    # for i in range(0, data_perkecamatan.shape[0]):
    #     if ((data_perkecamatan.index[i][1] == '<lambda>') or (data_perkecamatan.index[i][1] == 'count')):
    #         index.append(data_perkecamatan.index[i][0])
    #     else:
    #         index.append(data_perkecamatan.index[i][0] + ' (' + data_perkecamatan.index[i][1] + ')')
    #
    # data_kecamatan = pd.DataFrame(np.array(data_perkecamatan), index=index,
    #                               columns=data_perkecamatan.columns)
    #
    # # ======  COUNT LOGITUDE AND LATITUDE FOR ALL KECAMATAN =======#
    #
    # # alamat = ['Alamat (Kelurahan)','Alamat (Kecamatan)','Alamat (Kab/Kota)']
    # # data_coordinate = data_positive.loc[:, data_positive.columns.isin(alamat)]
    #
    # kec = []
    # kab_kota = []
    # for i in data_kecamatan.columns:
    #     kec.append(i)
    #     kab_kota.append(data_kecamatan[i]['Alamat (Kab/Kota)'])
    #
    # data_coord = pd.DataFrame(kec, columns=['Kecamatan'])
    # data_coord['Kab/Kota'] = kab_kota
    #
    # geolocator = Nominatim(user_agent="tes")
    # latitude = []
    # longitude = []
    #
    # for i in range(0, data_coord.shape[0]):
    #     loc = data_coord['Kecamatan'][i] + ' ' + data_coord['Kab/Kota'][i]
    #     location = geolocator.geocode(loc, timeout=None)
    #     if location != None:
    #         latitude.append(location.latitude)
    #         longitude.append(location.longitude)
    #         print(loc)
    #     else:
    #         latitude.append('0')
    #         longitude.append('0')
    #
    # # data_coord['latitude'] = latitude
    # # data_coord['longitude'] = longitude
    #
    # data_kecamatan = data_kecamatan.T
    #
    # data_kecamatan['latitude'] = latitude
    # data_kecamatan['longitude'] = longitude
    #
    # data_kecamatan = data_kecamatan.T
    #
    # # for i in data_positive.select_dtypes(include=['uint16']):
    # #     data_positive[i] = data_positive[i].astype('object')
    #
    # # print(data_coordinate.head())
    # data_positive.to_json(r'./result/df.json')
    # data_kecamatan.to_json(r'./result/data_kecamatan.json')
    # data_cluster.to_json(r'./result/data_cluster.json')
    #
    # print(f'CV F1 score for K-Prototypes clusters is {np.mean(cv_scores_kp)}')

    data_original = pd.read_csv('dataset/perkecamatan.csv', index_col=0)

    data = data_original.copy()
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
    data.index = data.index + ' (' + data['Alamat (Kab/Kota)'] + ')'

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
        dict_num[num] = ['mean']

    # ============ CREATE TABLE FOR EACH CLUSTER ============#

    cluster1.rename(columns={'labels': 'Total'}, inplace=True)
    data_percluster1 = cluster1.groupby('Segment').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    })


    return {
        'data_cluster1': data_percluster1,
        # 'df': data_positive,
        # 'data_kecamatan': data_kecamatan,
        # 'data_coordinate': data_coord,
        # 'data_coordinate': data_coordinate
    }
