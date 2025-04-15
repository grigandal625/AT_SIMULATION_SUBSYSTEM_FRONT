import { Col, Empty, Row, Table, Typography, theme } from "antd";

export const ResourcesTables = ({ tick }) => {
    if (!tick?.resources) {
        return <Empty description="Информация о ресурсах отсутствует" />;
    }

    const columns = [
        {
            dataIndex: "parameter",
            title: "Параметр",
            ellipsis: true,
        },
        {
            dataIndex: "value",
            title: "Значение",
            ellipsis: true,
        },
    ];

    const getResourceParameters = (resource) =>
        Object.entries(resource)
            .filter(([parameter, _]) => parameter !== "resource_name")
            .map(([parameter, value], i) => ({ parameter, value, key: i.toString() }));

    const {
        token: { colorBgLayout, colorBgContainer },
    } = theme.useToken();

    return (
        <>
            <Row style={{ background: colorBgLayout, paddingTop: 20, paddingBottom: 20 }} gutter={[20, 20]}>
                {tick.resources
                    .filter((res) => res)
                    .map((res) => {
                        const dataSource = getResourceParameters(res);
                        return (
                            <Col span={6}>
                                <div style={{ background: colorBgContainer, height: "100%" }}>
                                    <Table
                                        scroll={dataSource.length > 4 ? { y: 170 } : undefined}
                                        columns={columns}
                                        dataSource={dataSource}
                                        size="small"
                                        pagination={false}
                                        title={() => (
                                            <Typography.Title level={5} style={{ marginTop: 5, marginBottom: 5 }}>
                                                Ресурс {res.resource_name}
                                            </Typography.Title>
                                        )}
                                    />
                                </div>
                            </Col>
                        );
                    })}
            </Row>
        </>
    );
};

export default ({ ticks }) => {
    const lastTick = ticks ? ticks[0] : undefined;
    return ticks ? (
        <div>
            <ResourcesTables tick={lastTick} />
        </div>
    ) : (
        <Empty description="Тактов моделирования не выполнялось" />
    );
};
