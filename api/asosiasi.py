import pandas as pd
import numpy as np
import itertools
import collections
import math
import json
import pprint

from scipy.sparse import csr_matrix
from itertools import combinations
from geopy.geocoders import Nominatim
from sqlalchemy.orm import Session
from data import Data


def preprocessing(dataset):
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
    df = pd.DataFrame(db)
    IMT_laki = pd.read_csv('./csv/status_gizi_laki.csv', header=1)
    IMT_perempuan = pd.read_csv('./csv/status_gizi_perempuan.csv', header=1)
    df.replace(np.nan, 'Tidak Ada', inplace=True)

    df.drop([
        'Timestamp',
        'Tanggal Lahir',
        'Alamat lengkap',
        'pernah/sedang TB',
        'riwayat opname',
        'riwayat penyakit lain orang serumah',
        'sistem ventilasi'
    ],
        axis='columns', inplace=True)

    new = df['Umur'].str.split(r'(\d+)', expand=True)
    new = new.replace([None], '0')
    df['Tahun'] = new[1]
    df['Bulan'] = new[3]
    df.drop(['Umur'], axis='columns', inplace=True)

    df['jumlah kamar tidur'] = df['jumlah kamar tidur'].astype(str)
    df['jumlah orang dalam rumah'] = df['jumlah orang dalam rumah'].astype(str)

    df['Pekerjaan Ayah'] = 'Ayah ' + df['Pekerjaan Ayah']
    df['Pekerjaan Ibu'] = 'Ibu ' + df['Pekerjaan Ibu']
    df['jumlah kamar tidur'] = df['jumlah kamar tidur'] + ' Kamar'
    df['jumlah orang dalam rumah'] = df['jumlah orang dalam rumah'] + ' Orang'
    df['riwayat diabetes anak'] = df['riwayat diabetes anak'] + ' pernah diabetes (anak)'
    df['riwayat vaksin BCG'] = df['riwayat vaksin BCG'] + ' Anak Telah BCG'
    df['ASI eksklusif'] = df['ASI eksklusif'] + ' ASI Ekslusif'
    df['riwayat TB orang serumah'] = df['riwayat TB orang serumah'] + ' ada riwayat Tuberkulosis orang serumah'
    df['riwayat diabetes keluarga'] = df['riwayat diabetes keluarga'] + ' ada riwayat penyakit diabetes (orang tua)'
    df['daftar penyakit opname'] = df['daftar penyakit opname'] + ' (Penyakit Opname Anak)'
    df['daftar penyakit lain orang serumah'] = df[
                                                   'daftar penyakit lain orang serumah'] + ' (penyakit lainnya orang serumah)'

    tinggi_meter = df['Tinggi badan (dalam cm)'] / 100
    df['IMT'] = df['Berat badan (dalam kg)'] / (pow(tinggi_meter, 2))

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
            status_gender = IMT_laki.copy()
        else:
            status_gender = IMT_perempuan.copy()

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

    status_gizi = []
    i = 0
    for imt in df['IMT']:
        z_score = np.round(
            count_z_score(df['Jenis Kelamin'][i], int(df['Tahun'][i]), int(df['Bulan'][i]), df['IMT'][i]), 2)

        if (int(df['Tahun'][i]) < 5):
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

    df['Status Gizi'] = status_gizi

    df['Tahun'] = df['Tahun'].astype(str)
    df['Tahun'] = df['Tahun'] + ' Tahun'
    df.drop(['Tinggi badan (dalam cm)', 'Berat badan (dalam kg)',
             'Bulan', 'IMT'], axis='columns', inplace=True)
    df["variabel"] = df[['Jenis Kelamin', 'Kelurahan', 'Kecamatan',
                         'Kab/Kota', 'Pekerjaan Ayah', 'Pekerjaan Ibu',
                         'Pendapatan Orang Tua', 'riwayat diabetes anak', 'riwayat vaksin BCG',
                         'daftar penyakit opname', 'ASI eksklusif', 'riwayat TB orang serumah',
                         'riwayat diabetes keluarga', 'daftar penyakit lain orang serumah',
                         'luas rumah', 'jumlah kamar tidur', 'jumlah orang dalam rumah',
                         'Tahun', 'Status Gizi']].astype(str).agg(','.join, axis=1)
    data_array = df["variabel"].apply(lambda x: x.split(','))
    df.drop(['variabel'], axis='columns', inplace=True)

    return df, data_array


def coordinate(df):
    df['location'] = df[[
        'Kecamatan',
        'Kab/Kota']].agg(','.join, axis=1)
    coord = df['location'].apply(lambda x: x.split(','))
    geolocator = Nominatim(user_agent="arcgis")

    keckota = []
    polygons = {}
    loc = []
    for i, j in enumerate(coord):
        keckota_item = ','.join(str(x) for x in j)
        keckota.append(keckota_item)
        location = geolocator.geocode(keckota_item, geometry='geojson', timeout=None)
        if location != None:
            loc.append([location.address, location.latitude, location.longitude])
            geometry = location.raw['geojson']
            kec_name = [str(x) for x in j][0]
            polygons[kec_name] = geometry

    locations = pd.DataFrame(loc, columns=['address', 'lat', 'long'])

    return locations, geolocator, polygons, keckota


def transform(data_array, sparse=False):
    unique_items = set()

    for uniq in data_array:
        for item in uniq:
            unique_items.add(item)
    columns_ = sorted(unique_items)
    columns_mapping = {}

    for col_idx, item in enumerate(columns_):
        columns_mapping[item] = col_idx
    columns_mapping_ = columns_mapping
    df_columns_mapping = pd.DataFrame(columns_mapping_, index=[0])

    if sparse:
        indptr = [0]
        indices = []
        for uniq in data_array:
            for item in set(uniq):
                col_idx = columns_mapping_[item]
                indices.append(col_idx)
            indptr.append(len(indices))
        non_sparse_values = [True] * len(indices)
        array = csr_matrix((non_sparse_values, indices, indptr),
                           dtype=bool)
    else:
        array = np.zeros((len(data_array), len(columns_)), dtype=bool)
        for row_idx, uniq in enumerate(data_array):
            for item in uniq:
                col_idx = columns_mapping_[item]
                array[row_idx, col_idx] = True

    data_encoding = pd.DataFrame(array, columns=columns_mapping_)

    return data_encoding


def setup_fptree(df, min_support):
    num_itemsets = len(df.index)

    is_sparse = False
    if hasattr(df, "sparse"):
        if df.size == 0:
            itemsets = df.values
        else:
            itemsets = df.sparse.to_coo().tocsr()
            is_sparse = True
    else:
        itemsets = df.values

    item_support = np.array(np.sum(itemsets, axis=0) / float(num_itemsets))
    item_support = item_support.reshape(-1)

    items = np.nonzero(item_support >= min_support)[0]

    indices = item_support[items].argsort()
    rank = {item: i for i, item in enumerate(items[indices])}

    if is_sparse:
        itemsets.eliminate_zeros()

    tree = FPTree(rank)
    for i in range(num_itemsets):
        if is_sparse:
            nonnull = itemsets.indices[itemsets.indptr[i]:itemsets.indptr[i + 1]]
        else:
            nonnull = np.where(itemsets[i, :])[0]
        itemset = [item for item in nonnull if item in rank]
        itemset.sort(key=rank.get, reverse=True)
        tree.insert_itemset(itemset)

    return tree, rank


def generate_itemsets(generator, num_itemsets, colname_map):
    itemsets = []
    supports = []
    for sup, iset in generator:
        itemsets.append(frozenset(iset))
        supports.append(sup / num_itemsets)

    res_df = pd.DataFrame({'support': supports, 'itemsets': itemsets})

    if colname_map is not None:
        res_df['itemsets'] = res_df['itemsets'] \
            .apply(lambda x: frozenset([colname_map[i] for i in x]))

    return res_df


class FPTree(object):
    def __init__(self, rank=None):
        self.root = FPNode(None)
        self.nodes = collections.defaultdict(list)
        self.cond_items = []
        self.rank = rank

    def conditional_tree(self, cond_item, minsup):
        branches = []
        count = collections.defaultdict(int)
        for node in self.nodes[cond_item]:
            branch = node.itempath_from_root()
            branches.append(branch)
            for item in branch:
                count[item] += node.count

        items = [item for item in count if count[item] >= minsup]
        items.sort(key=count.get)
        rank = {item: i for i, item in enumerate(items)}

        cond_tree = FPTree(rank)
        for idx, branch in enumerate(branches):
            branch = sorted([i for i in branch if i in rank],
                            key=rank.get, reverse=True)
            cond_tree.insert_itemset(branch, self.nodes[cond_item][idx].count)
        cond_tree.cond_items = self.cond_items + [cond_item]

        return cond_tree

    def insert_itemset(self, itemset, count=1):
        self.root.count += count

        if len(itemset) == 0:
            return

        index = 0
        node = self.root
        for item in itemset:
            if item in node.children:
                child = node.children[item]
                child.count += count
                node = child
                index += 1
            else:
                break

        for item in itemset[index:]:
            child_node = FPNode(item, count, node)
            self.nodes[item].append(child_node)
            node = child_node

    def is_path(self):
        if len(self.root.children) > 1:
            return False
        for i in self.nodes:
            if len(self.nodes[i]) > 1 or len(self.nodes[i][0].children) > 1:
                return False
        return True

    def print_status(self, count, colnames):
        cond_items = [str(i) for i in self.cond_items]
        if colnames:
            cond_items = [str(colnames[i]) for i in self.cond_items]
        cond_items = ", ".join(cond_items)
        print('\r%d itemset(s) from tree conditioned on items (%s)' %
              (count, cond_items), end="\n")


class FPNode(object):
    def __init__(self, item, count=0, parent=None):
        self.item = item
        self.count = count
        self.parent = parent
        self.children = collections.defaultdict(FPNode)

        if parent is not None:
            parent.children[item] = self

    def itempath_from_root(self):
        path = []
        if self.item is None:
            return path

        node = self.parent
        while node.item is not None:
            path.append(node.item)
            node = node.parent

        path.reverse()
        return path


def fpg_step(tree, minsup, colnames, max_len, verbose):
    count = 0
    items = tree.nodes.keys()
    if tree.is_path():
        size_remain = len(items) + 1
        if max_len:
            size_remain = max_len - len(tree.cond_items) + 1
        for i in range(1, size_remain):
            for itemset in itertools.combinations(items, i):
                count += 1
                support = min([tree.nodes[i][0].count for i in itemset])
                yield support, tree.cond_items + list(itemset)
    elif not max_len or max_len > len(tree.cond_items):
        for item in items:
            count += 1
            support = sum([node.count for node in tree.nodes[item]])
            yield support, tree.cond_items + [item]

    if verbose:
        tree.print_status(count, colnames)

    if not tree.is_path() and (not max_len or max_len > len(tree.cond_items)):
        for item in items:
            cond_tree = tree.conditional_tree(item, minsup)
            for sup, iset in fpg_step(cond_tree, minsup,
                                      colnames, max_len, verbose):
                yield sup, iset


def fpgrowth(df, min_support=0.1, use_colnames=True, max_len=None, verbose=0):
    if min_support <= 0.:
        raise ValueError('`min_support` must be a positive '
                         'number within the interval `(0, 1]`. '
                         'Got %s.' % min_support)

    colname_map = None
    if use_colnames:
        colname_map = {idx: item for idx, item in enumerate(df.columns)}

    tree, _ = setup_fptree(df, min_support)
    minsup = math.ceil(min_support * len(df.index))  # min support as count
    generator = fpg_step(tree, minsup, colname_map, max_len, verbose)

    return generate_itemsets(generator, len(df.index), colname_map)


def conviction(sAC, sA, sC):
    confidence = sAC / sA
    conviction = np.empty(confidence.shape, dtype=float)
    if not len(conviction.shape):
        conviction = conviction[np.newaxis]
        confidence = confidence[np.newaxis]
        sAC = sAC[np.newaxis]
        sA = sA[np.newaxis]
        sC = sC[np.newaxis]
    conviction[:] = np.inf
    conviction[confidence < 1.] = ((1. - sC[confidence < 1.]) /
                                   (1. - confidence[confidence < 1.]))

    return conviction


def get_rules(res_df, metric="confidence", min_threshold=0.8, support_only=False):
    if not res_df.shape[0]:
        raise ValueError('The input DataFrame `df` containing '
                         'the frequent itemsets is empty.')

    if not all(col in res_df.columns for col in ["support", "itemsets"]):
        raise ValueError("Dataframe needs to contain the\
                         columns 'support' and 'itemsets'")

    metric_dict = {
        "antecedent support": lambda _, sA, __: sA,
        "consequent support": lambda _, __, sC: sC,
        "support": lambda sAC, _, __: sAC,
        "confidence": lambda sAC, sA, _: sAC / sA,
        "lift": lambda sAC, sA, sC: metric_dict["confidence"](sAC, sA, sC) / sC,
        "leverage": lambda sAC, sA, sC: metric_dict["support"](
            sAC, sA, sC) - sA * sC,
        "conviction": lambda sAC, sA, sC: conviction(sAC, sA, sC)
    }

    columns_ordered = ["antecedent support",
                       "consequent support",
                       "support",
                       "confidence",
                       "lift",
                       "leverage",
                       "conviction"]

    if support_only:
        metric = 'support'
    else:
        if metric not in metric_dict.keys():
            raise ValueError("Metric must be 'confidence' or 'lift', got '{}'"
                             .format(metric))

    # get dict of {frequent itemset} -> support
    keys = res_df['itemsets'].values
    values = res_df['support'].values
    frozenset_vect = np.vectorize(lambda x: frozenset(x))
    frequent_items_dict = dict(zip(frozenset_vect(keys), values))

    # prepare buckets to collect frequent rules
    rule_antecedents = []
    rule_consequents = []
    rule_supports = []

    for k in frequent_items_dict.keys():
        sAC = frequent_items_dict[k]
        # to find all possible combinations
        for idx in range(len(k) - 1, 0, -1):
            # of antecedent and consequent
            for c in combinations(k, r=idx):
                antecedent = frozenset(c)
                consequent = k.difference(antecedent)

                if support_only:
                    # support doesn't need these,
                    # hence, placeholders should suffice
                    sA = None
                    sC = None

                else:
                    try:
                        sA = frequent_items_dict[antecedent]
                        sC = frequent_items_dict[consequent]
                    except KeyError as e:
                        s = (str(e) + 'You are likely getting this error'
                                      ' because the DataFrame is missing '
                                      ' antecedent and/or consequent '
                                      ' information.'
                                      ' You can try using the '
                                      ' `support_only=True` option')
                        raise KeyError(s)
                    # check for the threshold

                score = metric_dict[metric](sAC, sA, sC)
                if score >= min_threshold:
                    rule_antecedents.append(antecedent)
                    rule_consequents.append(consequent)
                    rule_supports.append([sAC, sA, sC])

    # check if frequent rule was generated
    if not rule_supports:
        return pd.DataFrame(
            columns=["antecedents", "consequents"] + columns_ordered)

    else:
        # generate metrics
        rule_supports = np.array(rule_supports).T.astype(float)
        df_res = pd.DataFrame(
            data=list(zip(rule_antecedents, rule_consequents)),
            columns=["antecedents", "consequents"])

        if support_only:
            sAC = rule_supports[0]
            for m in columns_ordered:
                df_res[m] = np.nan
            df_res['support'] = sAC

        else:
            sAC = rule_supports[0]
            sA = rule_supports[1]
            sC = rule_supports[2]
            for m in columns_ordered:
                df_res[m] = metric_dict[m](sAC, sA, sC)

        return df_res


def getKota(df):
    list_kota = df['Kab/Kota'].unique()

    return list_kota


def getKecamatan(df):
    list_kec = df['Kecamatan'].unique()

    return list_kec


def getKecamatandict(list_kec, data_array):
    dict_kec = {}

    for kec in list_kec:
        list_row = []
        for data_row in data_array:
            if kec in data_row:
                list_row.append(data_row)
        dict_kec[kec] = list_row

    return dict_kec


def visualisation(dict_kec, rules, locations, polygons):
    dict_kec_rules = {}

    for i, kec in enumerate(dict_kec):
        for arr in dict_kec[kec]:
            for row in rules.iterrows():
                exist = True
                for antecedent in dict(row[1].items())['antecedents']:
                    if antecedent not in arr:
                        exist = False

                for consequent in dict(row[1].items())['consequents']:
                    if consequent not in arr:
                        exist = False

                if exist:
                    dict_rule = {}
                    list_antecedents = [antecedent for antecedent in dict(row[1].items())['antecedents']]
                    list_consequents = [antecedent for antecedent in dict(row[1].items())['consequents']]
                    antecedent_support = dict(row[1].items())['antecedent support']
                    consequent_support = dict(row[1].items())['consequent support']
                    support = dict(row[1].items())['support']
                    confidence = dict(row[1].items())['confidence']
                    lift = dict(row[1].items())['lift']

                    dict_rule['index'] = i
                    dict_rule['antecedents'] = list_antecedents
                    dict_rule['consequents'] = list_consequents
                    dict_rule['antecedent support'] = antecedent_support
                    dict_rule['consequent support'] = consequent_support
                    dict_rule['support'] = support
                    dict_rule['confidence'] = confidence
                    dict_rule['lift'] = lift

                    dict_kec_rules[kec] = dict_rule

    dict_kec_rules_location = {}
    for kec in dict_kec_rules:
        location = locations[locations['address'].str.contains(kec)]
        polygon = polygons.get(kec)

        if not location.empty:
            dict_kec_rules_location[kec] = {
                "index": dict_kec_rules[kec]['index'],
                "antecedents": dict_kec_rules[kec]['antecedents'],
                "consequents": dict_kec_rules[kec]['consequents'],
                "antecedent support": dict_kec_rules[kec]['antecedent support'],
                "consequent support": dict_kec_rules[kec]['consequent support'],
                "support": dict_kec_rules[kec]['support'],
                "confidence": dict_kec_rules[kec]['confidence'],
                "lift": dict_kec_rules[kec]['lift'],
                "lat": location['lat'].iloc[0],
                "long": location['long'].iloc[0],
                "polygons": polygon
            }

    return dict_kec_rules_location


def get_result(dict_kec_rules_location):
    result = {}
    for kec in dict_kec_rules_location:
        antecedents = dict_kec_rules_location[kec]["rules"]
        consequents = dict_kec_rules_location[kec]["rules"]
        result[kec] = {
            "id": dict_kec_rules_location[kec]["index"],
            "antecedents": antecedents,
            "consequents": consequents,
            "lat": dict_kec_rules_location[kec]["lat"],
            "long": dict_kec_rules_location[kec]["long"]
        }
    return result


def count_highest(df):
    count = df['Kecamatan'].value_counts()
    count = count.head(n=5)
    df2 = df[df['Kecamatan'].isin(count.index)]

    df2["variabel2"] = df2[['Jenis Kelamin', 'Kelurahan', 'Kecamatan',
                            'Kab/Kota', 'Pekerjaan Ayah', 'Pekerjaan Ibu',
                            'Pendapatan Orang Tua', 'riwayat diabetes anak', 'riwayat vaksin BCG',
                            'daftar penyakit opname', 'ASI eksklusif', 'riwayat TB orang serumah',
                            'riwayat diabetes keluarga', 'daftar penyakit lain orang serumah',
                            'luas rumah', 'jumlah kamar tidur', 'jumlah orang dalam rumah',
                            'Tahun', 'Status Gizi']].astype(str).agg(','.join, axis=1)
    data_array2 = df2["variabel2"].apply(lambda x: x.split(','))
    df2.drop(['variabel2'], axis='columns', inplace=True)

    return count.to_json(), data_array2, count.index.tolist()


def getKecamatan_highest(dict_kec, highest_kec_name):
    dict_highest_kec = {}

    for kec in highest_kec_name:
        dict_highest_kec[kec] = dict_kec[kec]

    return dict_highest_kec


def asosiasi(dataset, min_support=0.35, min_threshold=0.9):
    df, data_array = preprocessing(dataset)
    locations, geolocator, polygons, keckota = coordinate(df)
    data_all = transform(data_array)
    frequent_pattern = fpgrowth(data_all, min_support)
    rules2 = get_rules(frequent_pattern, 'confidence', min_threshold)
    rules = rules2[rules2.lift > 1]
    list_kec = getKecamatan(df)
    dict_kec = getKecamatandict(list_kec, data_array)
    dict_kec_rules_location = visualisation(dict_kec, rules, locations, polygons)

    # cross asosiasi
    highest_kec, data_array2, highest_kec_name = count_highest(df)
    transform2 = transform(data_array2)
    frequent_pattern2 = fpgrowth(transform2, min_support)
    cross_rules = get_rules(frequent_pattern2, 'confidence', min_threshold)
    cross_assosiasi = cross_rules[cross_rules.lift > 1]
    dict_kec_highest = getKecamatan_highest(dict_kec, highest_kec_name)
    highest_rules = visualisation(dict_kec_highest, cross_assosiasi, locations, polygons)

    list_antecedents = []
    list_consequents = []

    for kec in highest_kec_name:
        list_antecedents.extend(highest_rules[kec]['antecedents'])
        list_consequents.extend(highest_rules[kec]['consequents'])

    list_antecedents_unique = np.unique(np.array(list_antecedents)).tolist()
    list_consequents_unique = np.unique(np.array(list_consequents)).tolist()
    list_aturan = list_antecedents_unique + list_consequents_unique
    list_aturan = np.unique(np.array(list_aturan)).tolist()

    rules.to_csv("./rules/rules.csv")
    frequent_pattern.to_csv("./rules/frequent_pattern.csv")

    with open("./rules/location.json", "w") as outfile1:
        json.dump(keckota, outfile1)

    with open("./rules/data.json", "w") as outfile:
        json.dump(dict_kec_rules_location, outfile)

    with open("./rules/data_highest.json", "w") as outfile:
        json.dump(highest_kec, outfile)

    with open("./rules/list_antecedents_unique.json", "w") as outfile:
        json.dump(list_antecedents_unique, outfile)

    with open("./rules/list_consequents_unique.json", "w") as outfile:
        json.dump(list_consequents_unique, outfile)

    with open("./rules/list_aturan.json", "w") as outfile:
        json.dump(list_aturan, outfile)

    print(keckota)
    print(frequent_pattern)
    print(rules2)
    print(rules)
    pprint.pprint(dict_kec_rules_location)
    print(highest_kec)
    print(frequent_pattern2)
    print(cross_assosiasi)
    pprint.pprint(highest_rules)

    return {
        'df': df,
        'data_array': data_array,
        'fp': frequent_pattern,
        'rules': rules.to_json(),
        'locations': keckota,
        'dict_kec_rules_location': dict_kec_rules_location,
        'highest_kec': highest_kec,
        'list_antecedents_unique': list_antecedents_unique,
        'list_consequents_unique': list_consequents_unique,
        'list_aturan': list_aturan
    }
