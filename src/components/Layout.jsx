import { Col, Layout, Row, Typography } from "antd";
import { Outlet } from "react-router-dom";
import ModelsMenu from "./ModelsMenu";

const Main = () => {
    return (
        <Row>
            <Col>
                <div style={{ textAlign: "center", margin: 10, marginTop: 0, marginBottom: 0, background: "white" }}>
                    <Typography.Title style={{ padding: 10, paddingBottom: 5, margin: 0, marginTop: 10 }} level={5}>
                        Файлы ИМ
                    </Typography.Title>
                </div>
                <ModelsMenu />
            </Col>
            <Col flex="auto">
                <div style={{ padding: 10, paddingLeft: 0, height: "100%" }}>
                    <Outlet />
                </div>
            </Col>
        </Row>
    );
};

export default () => {
    return (
        <Layout>
            <Layout.Header>
                <Typography.Title
                    level={3}
                    style={{ whiteSpace: "nowrap", color: "white", marginTop: 15, marginBottom: 15 }}
                >
                    Подсистема имитационного моделирования
                </Typography.Title>
            </Layout.Header>
            <Layout.Content>
                <Main />
            </Layout.Content>
            <Layout.Footer style={{ background: "white", textAlign: "center", paddingTop: 18, paddingBottom: 18 }}>
                © Лаборатория «Интеллектуальные системы и технологии» НИЯУ МИФИ
            </Layout.Footer>
        </Layout>
    );
};
