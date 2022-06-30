import DataTable from 'react-data-table-component';

export function AturanAsosiasi({modalData}) {
  console.log("_TST", modalData);

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
                data={modalData.resultKec || []}
            />
        );

};
