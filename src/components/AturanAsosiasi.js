import DataTable from 'react-data-table-component';

const data = [
    {
        id: 1,
        kec: 'Biringkanaya',
        aturan: 'Tidak ada riwayat penyakit diabetes (orang tua), Pendapatan orang tua 5.000.001 - 10.000.000, berhubungan dengan Anak tidak pernah diabetes',
    },
    {
        id: 2,
        kec: 'Bontoala',
        aturan: '1984',
    },
]

export function AturanAsosiasi() {

        const columns = [
            {
                name: 'Kecamatan',
                selector: (row) => row.kec,
            },
            {
                name: 'Aturan Asosiasi',
                selector: (row) => row.aturan,
            },
        ]

        return (
            <DataTable
                columns={columns}
                data={data}
            />
        );
    
};