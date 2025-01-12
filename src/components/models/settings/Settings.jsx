import { Tabs } from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import Imports from "./imports/Imports";

export default () => {
    const [search, setSeacrh] = useSearchParams();

    const activeTab = search.get("settingTab") || "imports";

    const items = [
        {
            key: "imports",
            label: "Подключаемые библиотеки Golang",
            children: <Imports />,
        },
    ];

    return (
        <Tabs
            tabPosition="left"
            activeKey={activeTab}
            onTabClick={(settingTab) => {
                search.delete("settingTab");
                search.append("settingTab", settingTab);
                setSeacrh(search);
            }}
            items={items}
        />
    );
};
