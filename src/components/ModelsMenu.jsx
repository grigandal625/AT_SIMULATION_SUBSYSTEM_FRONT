import { useSelector, useDispatch } from "react-redux";
import { Button, Col, Dropdown, Menu, Row, Skeleton, Space } from "antd";
import { useParams, Link } from "react-router-dom";
import { LOAD_STATUSES } from "../GLOBAL";
import { useEffect } from "react";
import { loadModels } from "../redux/stores/modelsStore";

import "./ModelsMenu.css";
import {
    CopyOutlined,
    DashOutlined,
    DeleteOutlined,
    PlusOutlined,
    SaveOutlined,
    UploadOutlined,
} from "@ant-design/icons";

export default () => {
    const dispatch = useDispatch();
    const models = useSelector((state) => state.models);
    const params = useParams();
    const currentModelId = params.modelId;
    const dropDownItems = (model) => [
        {
            label: "Экспортировать",
            icon: <SaveOutlined />,
        },
        {
            label: "Дублировать",
            icon: <CopyOutlined />,
        },
        {
            label: "Удалить",
            icon: <DeleteOutlined />,
            danger: true,
        },
    ];

    const items = models?.data?.map((model) => ({
        key: model.id.toString(),
        label: (
            <Row>
                <Col flex="auto">
                    <Link to={`/models/${model.id}`}>{model.name}</Link>
                </Col>
                <Col>
                    <Dropdown trigger={["click"]} menu={{ items: dropDownItems(model) }}>
                        <Button size="small" icon={<DashOutlined />} />
                    </Dropdown>
                </Col>
            </Row>
        ),
    }));

    useEffect(() => {
        dispatch(loadModels());
    }, []);

    return models.status === LOAD_STATUSES.SUCCESS ? (
        <div className="sider-model-menu-wrapper">
            <div>
                <Menu className="sider-model-menu" selectedKeys={[currentModelId]} items={items} />
            </div>
            <div style={{ marginBottom: 10 }}>
                <Button icon={<PlusOutlined />} style={{ width: "100%" }}>
                    Создать модель
                </Button>
            </div>
            <div>
                <Button icon={<UploadOutlined />} style={{ width: "100%" }}>
                    Загрузить модель
                </Button>
            </div>
        </div>
    ) : (
        <div className="sider-model-menu-wrapper" style={{ background: "white" }}>
            <Skeleton active />
        </div>
    );
};
