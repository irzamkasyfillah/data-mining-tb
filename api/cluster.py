import re

import numpy as np
import pandas as pd
from geopy.geocoders import Nominatim
# from sklearn.metrics import silhouette_score
from kmodes.kprototypes import KPrototypes
from sklearn.preprocessing import StandardScaler

from data import Data


def cluster(dataset):
    df = pd.read_csv(dataset)
    data_status_gizi_laki = pd.read_csv('csv/status_gizi_laki.csv', header=1)
    data_status_gizi_perempuan = pd.read_csv('csv/status_gizi_perempuan.csv', header=1)

    age = df['Umur'].str.split(r'(\d+)', expand=True)
    age = age.replace([None], '0')

    df['Jika pernah, anak diopname karena penyakit apa saja?'] = df[
        'Jika pernah, anak diopname karena penyakit apa saja?'].replace(np.nan, 'Tidak Pernah')
    df['Jika ada, penyakit apa saja?'] = df['Jika ada, penyakit apa saja?'].replace(np.nan, 'Tidak Ada')

    data = df.rename(columns={'Alamat (mohon sertakan nama kelurahan dan kecamatan)': 'Alamat lengkap',
                              'Apakah anak pernah atau sedang dalam pengobatan tuberkulosis?': 'pernah/sedang TB',
                              'Apakah anak pernah mengalami penyakit diabetes?': 'riwayat diabetes anak',
                              'Apakah anak telah menerima imunisasi BCG (Bacillus Calmette-Guérin, imunisasi untuk mencegah penyakit TB)?': 'riwayat vaksin BCG',
                              'Apakah anak pernah di opname sebelumnya?': 'riwayat opname',
                              'Jika pernah, anak diopname karena penyakit apa saja?': 'daftar penyakit opname',
                              'Apakah anak mengkonsumsi ASI secara eksklusif? (ASI Eksklusif adalah pemberian ASI tanpa makanan/minuman (susu formula) tambahan hingga berusia 6 bulan)': 'ASI eksklusif',
                              'Apakah ada riwayat penyakit tuberkulosis dalam orang serumah?': 'riwayat TB orang serumah',
                              'Apakah ada riwayat penyakit diabetes dalam keluarga (orang tua)?': 'riwayat diabetes keluarga',
                              'Apakah ada riwayat penyakit lainnya selain tuberkulosis, diabetes dalam orang  serumah?': 'riwayat penyakit lain orang serumah',
                              'Jika ada, penyakit apa saja?': 'daftar penyakit lain orang serumah',
                              'Berapa luas rumah tempat anak tinggal?': 'luas rumah',
                              'Berapa jumlah kamar tidur dalam rumah?': 'jumlah kamar tidur',
                              'Berapa jumlah orang yang tinggal dalam satu rumah?': 'jumlah orang dalam rumah',
                              'Bagaimana sistem ventilasi di rumah Anda? ': 'sistem ventilasi'})

    # ADD NEW COLUMN FOR 'TAHUN' AND 'BULAN'

    data['Tahun'] = age[1]
    data['Bulan'] = age[3]

    data = data.astype({"Tahun": int, "Bulan": int})

    # CALCULATE THE IMT FOR STATUS GIZI

    data['IMT'] = np.round(
        data['Berat badan (dalam kg)'] / (data['Tinggi badan (dalam cm)'] * data['Tinggi badan (dalam cm)'] / 10000), 2)
    # data['IMT'] = data['Berat badan (dalam kg)']/(pow(data['Tinggi badan (dalam cm)']/100, 2))

    # HANDLE NAN VALUES

    data['daftar penyakit opname'] = data['daftar penyakit opname'].replace(np.nan, 'Tidak Pernah')
    data['daftar penyakit lain orang serumah'] = data['daftar penyakit lain orang serumah'].replace(np.nan, 'Tidak Ada')
    data_status_gizi_laki['Tahun'] = data_status_gizi_laki['Tahun'].replace(np.nan, 0)
    data_status_gizi_perempuan['Tahun'] = data_status_gizi_perempuan['Tahun'].replace(np.nan, 0)

    # ===== DATA DAFTAR OPNAME DAN DAFTAR PENYAKIT LAIN ORANG SERUMAH ========#

    daftar_opname = []
    for i in data['daftar penyakit opname']:
        # delete_space = re.sub(' ', '', i)
        to_list = re.split(', ', i.upper())
        daftar_opname.append(to_list)

    data['daftar opname'] = daftar_opname

    daftar_penyakit = []
    for i in data['daftar penyakit lain orang serumah']:
        # delete_space = re.sub(' ', '', i)
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

        # print("IMT = ", imt, ", Z score = ", z_score)
        status_gizi.append(status)
        i += 1

    data['Status Gizi'] = status_gizi

    # ============== DATA SELECTION =============== #

    data = data.drop(
        ['Timestamp', 'Tinggi badan (dalam cm)', 'Berat badan (dalam kg)', 'Umur', 'Tanggal Lahir', 'Alamat lengkap',
         'Apakah ada yang pernah atau sedang mengkonsumsi obat tuberkulosis dalam orang serumah?', 'pernah/sedang TB',
         'Bulan', 'IMT'], axis=1)
    # data_positive = data[data['Apakah anak pernah atau sedang dalam pengobatan tuberkulosis?'] == 'Ya']
    data_positive = data.copy()

    # ============= DATA TRANSFORMATION ============== #
    # preprocessing numerical

    scaler = StandardScaler()
    Num_features = data_positive.select_dtypes(include=['int64', 'float64', 'int32']).columns
    scaler.fit(data_positive[Num_features])
    data_positive[Num_features] = scaler.transform(data_positive[Num_features])

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

    data_positive['Tahun'] = data_positive['Tahun'].astype('float')

    # =========== CREATE DATA FRAME WITH LATITUDE AND LONGITUDE COORDINATE ============= #

    # alamat = ['Alamat (Kelurahan)', 'Alamat (Kecamatan)', 'Alamat (Kab/Kota)']
    # data_coordinate = data_positive.loc[:, data_positive.columns.isin(alamat)]
    #
    # geolocator = Nominatim(user_agent="tes")
    # latitude = []
    # longitude = []
    #
    # for i in range(0, data_coordinate.shape[0]):
    #     loc = data_coordinate['Alamat (Kelurahan)'][i] + ' ' + data_coordinate['Alamat (Kecamatan)'][i] + ' ' + \
    #           data_coordinate['Alamat (Kab/Kota)'][i]
    #     location = geolocator.geocode(loc, timeout=None)
    #     if location is not None:
    #         print(location.address)
    #         latitude.append(location.latitude)
    #         longitude.append(location.longitude)
    #     else:
    #         latitude.append('0')
    #         longitude.append('0')
    #
    # data_coordinate['latitude'] = latitude
    # data_coordinate['longitude'] = longitude

    data_positive = data_positive.drop(
        ['daftar opname', 'daftar penyakit lain', 'daftar penyakit lain orang serumah', 'daftar penyakit opname'
         ], axis=1)

    # ============= K-PROTOTYPE CLUSTERING ALGORYTHM ================= #

    # converting numerical columns datatype as float

    mark_array = data_positive.values

    # mark_array[:, 14] = mark_array[:, 14].astype(float)
    # mark_array[:, 15] = mark_array[:, 15].astype(float)
    # mark_array[:, 17] = mark_array[:, 17].astype(float)

    # ========== index of categorical columns =============#

    # categorical_index = list(range(2,19)) + list(range(21,22)) + list(range(23, 24))
    categorical_index = [data_positive.columns.get_loc(col) for col in
                         list(data_positive.select_dtypes('object').columns)]

    # ============= Function for plotting elbow curve =============== #

    # def plot_elbow_curve(start, end, data):
    #     no_of_clusters = list(range(start, end + 1))
    #     cost_values = []
    #
    #     for k in no_of_clusters:
    #         test_model = KPrototypes(n_clusters=k, init='Huang', verbose=2)
    #         preds = test_model.fit_predict(data, categorical=categorical_index)
    #         cost_values.append(test_model.cost_)
    #         # score = silhouette_score(data, preds, metric='jaccard')
    #         # print("For n_clusters = {}, silhouette score is {})".format(n_clusters, score))
    #         print('Cluster initiation: {}'.format(k))
    #         print('Cost : {}'.format(test_model.cost_))
    #
    #     sns.set_theme(style="whitegrid", palette="bright", font_scale=1.2)
    #
    #     plt.figure(figsize=(15, 7))
    #     ax = sns.lineplot(x=no_of_clusters, y=cost_values, marker="o", dashes=False)
    #     ax.set_title('Elbow curve', fontsize=18)
    #     ax.set_xlabel('No of clusters', fontsize=14)
    #     ax.set_ylabel('Cost', fontsize=14)
    #     ax.set(xlim=(start - 0.1, end + 0.1))
    #     plt.plot()
    #
    # # Plotting elbow curve for k=2 to k=10
    # plot_elbow_curve(2, 8, mark_array)

    # ============ CHOOSE OPTIMAL NUMBER OF CLUSTER BASED ON ELBOW METHOD ============== #

    model_4 = KPrototypes(n_clusters=5, init='Huang', verbose=2)
    model_4.fit_predict(mark_array, categorical=categorical_index)
    print(model_4.cost_)
    # new column for cluster labels associated with each subject
    data_positive['labels'] = model_4.labels_

    data_positive['Segment'] = data_positive['labels'].map(
        {0: '1', 1: '2', 2: '3', 3: '4', 4: '5'})
    # Order the cluster
    data_positive['Segment'] = data_positive['Segment'].astype('category')
    data_positive['Segment'] = data_positive['Segment'].cat.reorder_categories(['1', '2', '3', '4', '5'])

    # ============== INVERSE TRANSFORMATION FOR NUMERIC DATA ================#

    data_positive[Num_features] = scaler.inverse_transform(data_positive[Num_features])

    # =============== CREATE DICTIONARY FOR OBJECT AND NUMERICAL COLUMNS ================#
    dict_cat = {}
    dict_num = {}

    for cat in data_positive.select_dtypes(['object', 'category']):
        dict_cat[cat] = lambda x: x.value_counts().index[0]

    for num in data_positive.select_dtypes(['int64', 'float64']):
        dict_num[num] = ['mean', 'median', 'min', 'max']

    # ============ CREATE TABLE FOR EACH CLUSTER ============#

    data_positive.rename(columns={'labels': 'Total'}, inplace=True)
    data_percluster = data_positive.groupby('Segment').agg({

        'Total': 'count',
        **dict_cat,
        **dict_num

    }).reset_index().T

    index_2 = []
    for i in range(0, data_percluster.shape[0]):
        if ((data_percluster.index[i][1] == '<lambda>') or (data_percluster.index[i][1] == 'count')):
            index_2.append(data_percluster.index[i][0])
        else:
            index_2.append(data_percluster.index[i][0] + ' (' + data_percluster.index[i][1] + ')')

    data_cluster = pd.DataFrame(np.array(data_percluster), index=index_2,
                                columns=data_percluster.columns)

    data_perkecamatan = data_positive.groupby('Alamat (Kecamatan)').agg({

        'Total': 'count',
        **dict_num,
        **dict_cat

    }).T

    index = []
    for i in range(0, data_perkecamatan.shape[0]):
        if ((data_perkecamatan.index[i][1] == '<lambda>') or (data_perkecamatan.index[i][1] == 'count')):
            index.append(data_perkecamatan.index[i][0])
        else:
            index.append(data_perkecamatan.index[i][0] + ' (' + data_perkecamatan.index[i][1] + ')')

    data_kecamatan = pd.DataFrame(np.array(data_perkecamatan), index=index,
                                  columns=data_perkecamatan.columns)

    # Setting the objects to category

    # cat_data = data_positive.copy()
    # for i in cat_data.select_dtypes(include='object'):
    #     cat_data[i] = cat_data[i].astype('category')
    #
    # cat_data = cat_data.drop(['Total', 'Segment'], axis=1)
    # labels = model_4.labels_
    #
    # clf_kp = LGBMClassifier(colsample_by_tree=0.8)
    # cv_scores_kp = cross_val_score(clf_kp, cat_data, labels, scoring='f1_weighted')
    # print(f'CV F1 score for K-Prototypes clusters is {np.mean(cv_scores_kp)}')
    #
    # clf_kp.fit(cat_data, labels)
    #
    # explainer_kp = shap.TreeExplainer(clf_kp)
    # shap_values_kp = explainer_kp.shap_values(cat_data)
    #
    # shap.summary_plot(shap_values_kp, cat_data, plot_type="bar", plot_size=(15, 10))

    # data_coordinate.to_csv(r'gis_web/api/csv/data coordinate.csv', index=False)

    # ======  COUNT LOGITUDE AND LATITUDE FOR ALL KECAMATAN =======#

    # alamat = ['Alamat (Kelurahan)','Alamat (Kecamatan)','Alamat (Kab/Kota)']
    # data_coordinate = data_positive.loc[:, data_positive.columns.isin(alamat)]

    kec = []
    kab_kota = []
    for i in data_kecamatan.columns:
        kec.append(i)
        kab_kota.append(data_kecamatan[i]['Alamat (Kab/Kota)'])

    data_coord = pd.DataFrame(kec, columns=['Kecamatan'])
    data_coord['Kab/Kota'] = kab_kota

    geolocator = Nominatim(user_agent="tes")
    latitude = []
    longitude = []

    for i in range(0, data_coord.shape[0]):
        loc = data_coord['Kecamatan'][i] + ' ' + data_coord['Kab/Kota'][i]
        location = geolocator.geocode(loc, timeout=None)
        if location != None:
            latitude.append(location.latitude)
            longitude.append(location.longitude)
            print(loc)
        else:
            latitude.append('0')
            longitude.append('0')

    # data_coord['latitude'] = latitude
    # data_coord['longitude'] = longitude

    data_kecamatan = data_kecamatan.T

    data_kecamatan['latitude'] = latitude
    data_kecamatan['longitude'] = longitude

    data_kecamatan = data_kecamatan.T

    for i in data_positive.select_dtypes(include=['uint16']):
        data_positive[i] = data_positive[i].astype('object')

    # print(data_coordinate.head())
    df.to_json(r'./result/df.json')
    data_kecamatan.to_json(r'./result/data_kecamatan.json')
    data_cluster.to_json(r'./result/data_cluster.json')
    return {
        'df': data_positive,
        'data_kecamatan': data_kecamatan,
        'data_cluster': data_cluster,
        # 'data_coordinate': data_coord,
        # 'data_coordinate': data_coordinate
    }

# data = cluster()
#
# print(data)
