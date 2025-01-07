import { Tabs } from "antd";
import { Outlet, useMatches, useNavigate } from "react-router-dom";

export default () => {
    const tabItems = [
        {
            key: "translation",
            label: "Трансляция имитационной модели",
            children: <Outlet />,
        },
        {
            key: "runner",
            label: "Расчет состояний имитационной модели",
            children: <Outlet />,
        },
    ];

    const navigate = useNavigate();
    const matches = useMatches();
    const tabKey = matches.length >= 3 && matches[2].pathname.slice(-1) !== "/" ? matches[2].pathname.split("/").slice(-1)[0] : "translation";

    console.log(matches);
    return (
        <div style={{ padding: 10, marginLeft: 10, background: "white" }}>
            <Tabs activeKey={tabKey} onChange={(key) => navigate(`/evaluate/${key}`)} items={tabItems} />
        </div>
    );
};
