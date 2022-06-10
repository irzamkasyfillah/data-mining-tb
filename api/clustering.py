import re

import numpy as np
import pandas as pd
from geopy.geocoders import Nominatim
from sklearn.metrics import silhouette_score
# from kmodes.kprototypes import KPrototypes
from sklearn.cluster import KMeans
import matplotlib.pyplot as plt
from sklearn.preprocessing import StandardScaler

from data import Data


def cluster(dataset):
    # ============= READ ALL REQUIRED DATA ============== #

    data_original = pd.read_csv('csv/perkecamatan.csv', index_col=0)

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
        if location != None:
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
    kmeans = KMeans(n_clusters=2, random_state=9)
    preds = kmeans.fit_predict(cluster2)

    pd.Series(kmeans.labels_).value_counts()

    # new column for cluster labels associated with each subject
    cluster2['labels'] = kmeans.labels_
    # cluster2['Segment'] = cluster2['labels'].map({0:'First', 1:'Second', 2:'Third'})
    cluster2['Segment'] = cluster2['labels'].map({0: 'First', 1: 'Second'})

    # Order the cluster
    cluster2['Segment'] = cluster2['Segment'].astype('category')
    # cluster2['Segment'] = cluster2['Segment'].cat.reorder_categories(['First','Second','Third'])
    cluster2['Segment'] = cluster2['Segment'].cat.reorder_categories(['First', 'Second'])

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