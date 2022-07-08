import DataTable from 'react-data-table-component';
import '../../styles/AturanAsosiasi.module.css';

export function AturanAsosiasi({modalData}) {
        const columns = [
            {
                name: 'Kecamatan',
                selector: (row) => row.kec,
            },
            {
                name: 'Aturan Asosiasi',
                selector: (row) => row.aturan,
                width: "480px",
            },
        ]

        return (
            <DataTable
                columns={columns}
                data={modalData || []}
            />
        );

};
