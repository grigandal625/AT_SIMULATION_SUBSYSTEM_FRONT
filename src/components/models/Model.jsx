import { LeftOutlined, RightOutlined, SettingOutlined } from "@ant-design/icons";
import { Row, Col, Button, Typography, Drawer } from "antd";
import { useState } from "react";
import { Outlet, useParams, useSearchParams } from "react-router-dom";
import ModelPanel from "./panel/ModelPanel";
import { useSelector } from "react-redux";
import Settings from "./settings/Settings";

export default () => {
    const [panelOpen, setPanelOpen] = useState(true);
    const [search, setSeacrh] = useSearchParams();
    const params = useParams();
    const models = useSelector((state) => state.models);
    const currentModel = models.data.find((model) => model.id === parseInt(params.modelId));
    const showSettings = search.get("showSettings");
    return (
        <Row>
            <Col style={panelOpen ? { width: 0, transition: "0.5s" } : { transition: "0.5s" }} flex={panelOpen ? null : "auto"}>
                <div
                    style={{
                        height: "100%",
                        visibility: panelOpen ? "hidden" : "visible",
                        transition: "0.5s",
                    }}
                >
                    <Outlet />
                </div>
            </Col>
            <Col style={{ transition: "0.5s", marginLeft: panelOpen ? 0 : 10 }} flex={panelOpen ? "auto" : "none"}>
                <Row style={{ background: "white", padding: 10, marginLeft: 10 }} wrap={false}>
                    <Col>
                        <Button onClick={() => setPanelOpen(!panelOpen)} icon={panelOpen ? <RightOutlined /> : <LeftOutlined />} />
                    </Col>
                    <Col flex="auto">
                        <Typography.Title style={{ margin: 5 }} level={5}>
                            Панель сущностей ИМ
                        </Typography.Title>
                    </Col>
                    <Col>
                        <Button type="link" onClick={() => setSeacrh({ showSettings: true })} icon={<SettingOutlined />}>
                            Настройки
                        </Button>
                    </Col>
                </Row>
                <ModelPanel panelOpen={panelOpen} />
                <Drawer
                    placement="bottom"
                    height="100%"
                    open={showSettings}
                    onClose={() => {
                        search.delete("showSettings");
                        search.delete("settingTab");
                        setSeacrh(search);
                    }}
                    title={`Настройки имитационной модели «${currentModel?.name}»`}
                >
                    <Settings />
                </Drawer>
            </Col>
        </Row>
    );
};
