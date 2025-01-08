import { Col, Layout, Menu, Row, Splitter, Typography } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { Link, Outlet, useLocation, useMatches, useNavigate } from "react-router-dom";
import ModelsMenu from "./ModelsMenu";

const Main = () => {
    const [sizes, setSizes] = useState([270, window.innerWidth - 270]);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setSizes([sizes[0], window.innerWidth - sizes[0]]);
        });
    }, [sizes[0]]);

    const matches = useMatches();
    const authenticationNow = Boolean(matches.find((match) => /^\/token/g.test(match.pathname)));
    const token = window.sessionStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        if (!token && !authenticationNow) {
            navigate("/not-authorized");
        }
    }, []);
    return !token ? (
        <Outlet />
    ) : (
        <Splitter
            onResize={(v) => {
                if (sizes[0] === 0 && v[0] - sizes[0] > 50) {
                    setSizes([270, window.innerWidth - 270]);
                } else {
                    setSizes(v);
                }
            }}
        >
            <Splitter.Panel collapsible size={sizes[0]} max={270} style={{ minWidth: 0, overflow: "hidden", whiteSpace: "nowrap" }}>
                <div style={{ textAlign: "center", margin: 10, marginTop: 0, marginBottom: 0, background: "white", minWidth: 250 }}>
                    <Typography.Title
                        style={{
                            padding: 10,
                            paddingBottom: 5,
                            margin: 0,
                            marginTop: 10,
                        }}
                        level={5}
                    >
                        Файлы ИМ
                    </Typography.Title>
                </div>
                <ModelsMenu />
            </Splitter.Panel>
            <Splitter.Panel size={sizes[1]}>
                <div style={{ padding: 10, paddingLeft: 0, height: "100%" }}>
                    <Outlet />
                </div>
            </Splitter.Panel>
        </Splitter>
    );
};

export default () => {
    const token = window.localStorage.getItem("token");
    if (token) {
        window.sessionStorage.setItem("token", token);
    }

    const location = useLocation();

    useEffect(() => {
        const frameId = window.sessionStorage.getItem("frameId");
        if (frameId) {
            const parentOrigin = window.sessionStorage.getItem("parentOrigin") || "*";
            window.parent.postMessage({ type: "urlUpdate", frameId, url: window.location.href }, parentOrigin);
        }
    }, [location]);

    const matches = useMatches();
    const authenticationNow = Boolean(matches.find((match) => /^\/token/g.test(match.pathname)));
    const currentToken = window.sessionStorage.getItem("token");

    const defaultKey = matches.map((m) => m.pathname).includes("/evaluate") ? "evaluation" : "develop";

    const menuItems = [
        {
            label: <Link to="/models">Разработка имитационной модели</Link>,
            key: "develop",
        },
        {
            label: <Link to="/evaluate">Расчет имитационной модели</Link>,
            key: "evaluation",
        },
    ];

    return (
        <Layout>
            <Layout.Header>
                <Row wrap={false} justify="space-between">
                    <Col>
                        <Typography.Title level={3} style={{ whiteSpace: "nowrap", color: "white", marginTop: 15, marginBottom: 15 }}>
                            Подсистема имитационного моделирования
                        </Typography.Title>
                    </Col>
                    <Col>
                        {currentToken && !authenticationNow && (
                            <Menu style={{ minWidth: 484 }} mode="horizontal" theme="dark" defaultSelectedKeys={[defaultKey]} items={menuItems} />
                        )}
                    </Col>
                </Row>
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
