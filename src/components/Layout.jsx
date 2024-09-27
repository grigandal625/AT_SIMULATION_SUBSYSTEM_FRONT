import { Col, Flex, Layout, Row, Splitter, Typography } from "antd";
import { useEffect } from "react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import ModelsMenu from "./ModelsMenu";

const Main = () => {
    const [sizes, setSizes] = useState([270, window.innerWidth - 270]);

    useEffect(() => {
        window.addEventListener("resize", () => {
            setSizes([sizes[0], window.innerWidth - sizes[0]]);
        });
    }, [sizes[0]]);
    return (
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
    return (
        <Layout>
            <Layout.Header>
                <Typography.Title level={3} style={{ whiteSpace: "nowrap", color: "white", marginTop: 15, marginBottom: 15 }}>
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
