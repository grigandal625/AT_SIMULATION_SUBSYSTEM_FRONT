import { Tabs } from "antd";
import { Link, useMatches, useNavigate, useParams } from "react-router-dom";
import "./ModelPanel.css";
import ResourceTypes from "./resourceTypes/ResourceTypes";
import Resources from "./resources/Resources";
import Templates from "./templates/Templates"
import TemplateUsages from "./templateUsages/TemplateUsages";

export default () => {
    const navigate = useNavigate();
    const params = useParams();
    const matches = useMatches();
    const keyPath = matches[2]?.pathname?.split("/")[3];
    const defaultActiveKey = ["resource-types", "resources", "templates", "template-usages"].includes(keyPath)
        ? keyPath
        : null;

    return (
        <div style={{ background: "white", padding: 10, paddingTop: 0, paddingLeft: 0 }}>
            <Tabs
                tabPosition="left"
                className="model-panel"
                activeKey={defaultActiveKey}
                size="small"
                tabBarStyle={{ width: 50 }}
                onTabClick={(activeKey) => navigate(`/models/${params.modelId}/${activeKey}`)}
                items={[
                    {
                        key: "resource-types",
                        label: <div style={{ writingMode: "vertical-lr" }}>Типы ресурсов</div>,
                        children: <ResourceTypes />,
                    },
                    {
                        key: "resources",
                        label: <div style={{ writingMode: "vertical-lr" }}>Ресурсы</div>,
                        children: <Resources />,
                    },
                    {
                        key: "templates",
                        label: <div style={{ writingMode: "vertical-lr" }}>Образцы операций</div>,
                        children: <Templates />,
                    },
                    {
                        key: "template-usages",
                        label: <div style={{ writingMode: "vertical-lr" }}>Операции</div>,
                        children: <TemplateUsages />,
                    },
                ]}
            />
        </div>
    );
};
