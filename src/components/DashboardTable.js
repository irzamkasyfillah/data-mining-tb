import DataTable from "react-data-table-component";
import React from "react";

/**
 * Table to render data on dashboard
 * @param data {any[]}
 * @constructor
 */
export function DashboardTable({ data = [] }) {
  const columns = [
    {
      selector: (row) => row.timestamp,
      name: "Timestamp",
    },
    {
      selector: (row) => row.umur,
      name: "Umur",
    },
    {
      selector: (row) => row.tinggi_badan,
      name: "Tinggi Badan (cm)",
    },
    {
      selector: (row) => row.berat_badan,
      name: "Berat Badan (kg)",
    },
    {
      selector: (row) => row.jenis_kelamin,
      name: "Jenis Kelamin",
    },
    {
      selector: (row) => row.alamat_kelurahan,
      name: "Kelurahan",
    },
    {
      selector: (row) => row.alamat_kecamatan,
      name: "Kecamatan",
    },
    {
      selector: (row) => row.alamat_kota,
      name: "Kab/Kota",
    },
    {
      selector: (row) => row.pekerjaan_ayah,
      name: "Pekerjaan Ayah",
    },
    {
      selector: (row) => row.pekerjaan_ibu,
      name: "Pekerjaan Ibu",
    },
    {
      selector: (row) => row.pendapatan,
      name: "Pendapatan Orang Tua",
    },
    {
      selector: (row) => row.pernah_sedang_tb,
      name: "Pernah/Sedang Tuberkulosis",
    },
    {
      selector: (row) => row.diabetes_anak,
      name: "Diabetes Anak",
    },
    {
      selector: (row) => row.vaksin_bcg,
      name: "Riwayat Vaksin BCG",
    },
    {
      selector: (row) => row.riwayat_opname_anak,
      name: "Riwayat Opname",
    },
    {
      selector: (row) => row.penyakit_anak,
      name: "Penyakit Saat Opname",
    },
    {
      selector: (row) => row.asi_ekslusif,
      name: "ASI Eksklusif",
    },
    {
      selector: (row) => row.tb_serumah,
      name: "Riwayat Tuberkulosis Orang Serumah",
    },
    {
      selector: (row) => row.diabetes_serumah,
      name: "Riwayat Diabetes Orang Tua",
    },
    {
      selector: (row) => row.penyakit_lainnya,
      name: "Penyakit Lainnya",
    },
    {
      selector: (row) => row.luas_rumah,
      name: "Luas Rumah",
    },
    {
      selector: (row) => row.jumlah_kamar,
      name: "Jumlah Kamar Tidur",
    },
    {
      selector: (row) => row.jumlah_orang,
      name: "Jumlah Orang Serumah",
    },
    {
      selector: (row) => row.sistem_ventilasi,
      name: "Sistem Ventilasi",
    },
  ];

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: "#f3f3f3",
        padding: "0.5rem 0",
      },
    },
    cells: {
      style: {
        lineHeight: "1.5em",
      },
    },
    rows: {
      style: {
        padding: "0.5rem 0",
      },
    },
    pagination: {
      style: {
        color: "rgb(59 130 246)",
      },
    },
  };

  return (
    <DataTable
      columns={columns}
      data={data}
      customStyles={customStyles}
      pagination
      highlightOnHover
    />
  );
}
