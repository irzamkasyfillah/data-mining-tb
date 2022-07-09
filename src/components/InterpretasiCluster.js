import DataTable from 'react-data-table-component';

export function InterpretasiCluster({modalData}) {
    const columns = [
        {
            name: 'KECAMATAN',
            selector: function (row) {
                const result = row.kecamatan.split('\n').map(e => `${e}<br/>`).join('')
                return <div className="text-sm" dangerouslySetInnerHTML={{__html: result}}></div>
            },
            width: '240px'
        },
        {
            name: 'INTERPRETASI',
            selector: function (row) {
                const result = row.interpretasi.split('\n').map(e => `${e}<br/>`).join('')
                return <div className="text-sm" dangerouslySetInnerHTML={{__html: result}}></div>
            },
            // width: '480px'
        },
    ]

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
            data={modalData}
            pagination
            customStyles={customStyles}
        />
    );

};
