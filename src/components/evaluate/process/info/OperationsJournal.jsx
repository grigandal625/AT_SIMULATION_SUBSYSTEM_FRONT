import { AlertOutlined, ExportOutlined, NodeExpandOutlined } from "@ant-design/icons";
import { Button, Table, Tag } from "antd";
import { OPERATION_TYPES, OPERATION_TYPE_LABELS } from "../../../../GLOBAL";
import "./Info.css";

export default ({ ticks }) => {
    let tick_row_index = 0;
    const operations = (ticks || []).reduce(
        (tickAccumulator, tick) => [
            ...tickAccumulator,
            ...tick.usages
                .filter((usage) => usage.has_triggered || usage.has_triggered_after || usage.has_triggered_before)
                .reduce(
                    (usageAccumulator, { has_triggered, has_triggered_before, has_triggered_after, usage_name, usage_type }) => [
                        ...usageAccumulator,
                        {
                            has_triggered,
                            has_triggered_before,
                            has_triggered_after,
                            tick: tick.current_tick,
                            usage: usage_name,
                            type: usage_type,
                            tick_obj: tick,
                            tick_row_index: tickAccumulator.length
                                ? tickAccumulator.slice(-1)[0].tick_obj.current_tick === tick.current_tick
                                    ? tick_row_index
                                    : tick_row_index++ + 1
                                : tick_row_index,
                        },
                    ],
                    []
                ),
        ],
        []
    );

    const operationVariants = [];
    operations.forEach(({ usage }) => {
        if (!operationVariants.includes(usage)) {
            operationVariants.push(usage);
        }
    });

    const typeColors = Object.fromEntries([
        [OPERATION_TYPES.IRREGULAR_EVENT, "blue"],
        [OPERATION_TYPES.OPERATION, "green"],
        [OPERATION_TYPES.RULE, "orange"],
    ]);

    const getOperationColor = (operation) =>
        operation.has_triggered ? "green" : operation.has_triggered_before ? "volcano" : operation.has_triggered_after ? "primary" : undefined;

    const getOperationIcon = (operation) =>
        operation.has_triggered ? <AlertOutlined /> : operation.has_triggered_before ? <NodeExpandOutlined /> : operation.has_triggered_after ? <ExportOutlined /> : undefined;

    const getOperationText = (operation) =>
        operation.has_triggered
            ? operation.type === OPERATION_TYPES.IRREGULAR_EVENT
                ? "Возникновение события"
                : "Срабатывание предусловия правила"
            : operation.has_triggered_before
            ? "Срабатывание предусловия и начальных действий операции"
            : operation.has_triggered_after
            ? "Срабатывание конечных действия операции"
            : undefined;

    const columns = [
        {
            key: "usage",
            dataIndex: "usage",
            title: "Операция",
            filters: operationVariants.map((u) => ({ text: u, value: u })),
            filterMode: "tree",
            filterSearch: true,
            onFilter: (value, record) => record.usage.startsWith(value),
        },
        {
            key: "type",
            dataIndex: "type",
            title: "Вид операции",
            filters: Object.values(OPERATION_TYPES).map((v) => ({ text: OPERATION_TYPE_LABELS[v], value: v })),
            filterMode: "tree",
            onFilter: (value, record) => record.type == value,
            render: (type) => <Tag color={typeColors[type]}>{OPERATION_TYPE_LABELS[type]}</Tag>,
        },
        {
            key: "has_triggered",
            title: "Статус",
            render: (operation) => (
                <Button style={{ userSelect: "text" }} color={getOperationColor(operation)} variant="filled" icon={getOperationIcon(operation)}>
                    {getOperationText(operation)}
                </Button>
            ),
        },
        {
            key: "tick",
            dataIndex: "tick",
            title: "Такт",
        },
    ];

    const getRowClassName = (operation) => (operation.tick_row_index % 2 ? "odd-tick" : "even-tick");

    return (
        <Table
            pagination={{ position: ["topRight", "bottomRight"], showSizeChanger: true, total: operations.length }}
            size="small"
            columns={columns}
            dataSource={operations}
            rowClassName={getRowClassName}
        />
    );
};
