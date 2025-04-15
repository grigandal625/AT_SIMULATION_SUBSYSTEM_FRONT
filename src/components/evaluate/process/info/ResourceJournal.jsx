import { Table } from "antd";
import "./Info.css";

export default ({ ticks }) => {
    const parameters = (ticks || []).reduce(
        (tickAccumulator, tick) => [
            ...tickAccumulator,
            ...tick.resources
                .filter((res) => res)
                .reduce(
                    (resAccumulator, res) => [
                        ...resAccumulator,
                        ...Object.entries(res)
                            .filter(([parameter, _]) => parameter !== "resource_name")
                            .map(([parameter, value]) => ({
                                parameter,
                                value,
                                tick: tick.current_tick,
                                resource: res.resource_name,
                            })),
                    ],
                    []
                ),
        ],
        []
    );

    const resources = [];
    parameters.forEach((p) => {
        if (!resources.includes(p.resource)) {
            resources.push(p.resource);
        }
    });

    const parameterVariants = [];
    parameters.forEach((p) => {
        if (!parameterVariants.includes(p.parameter)) {
            parameterVariants.push(p.parameter);
        }
    });

    const columns = [
        {
            key: "resource",
            dataIndex: "resource",
            title: "Ресурс",
            filters: resources.map((r) => ({ text: r, value: r })),
            filterMode: "tree",
            filterSearch: true,
            onFilter: (value, record) => record.resource.startsWith(value),
        },
        {
            key: "parameter",
            dataIndex: "parameter",
            title: "Параметр",
            filters: parameterVariants.map((p) => ({ text: p, value: p })),
            filterMode: "tree",
            filterSearch: true,
            onFilter: (value, record) => record.parameter.startsWith(value),
        },
        {
            key: "value",
            dataIndex: "value",
            title: "Значение",
        },
        {
            key: "tick",
            dataIndex: "tick",
            title: "Такт",
        },
    ];

    const getRowClassName = (parameter) => (parameter.tick % 2 ? "odd-tick" : "even-tick");

    return (
        <Table
            pagination={{ position: ["topRight", "bottomRight"], showSizeChanger: true, total: parameters.length }}
            size="small"
            columns={columns}
            dataSource={parameters}
            rowClassName={getRowClassName}
        />
    );
};
