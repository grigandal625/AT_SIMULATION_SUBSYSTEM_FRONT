import { MinusCircleOutlined } from "@ant-design/icons";
import { Button, Input, Select, Typography } from "antd";
import TinyFormItem from "../../../../../../utils/TinyFormItem";
import { getControlsTypesMapping } from "./controls";

export const parameterTypeOptions = [
    {
        key: "int",
        value: "int",
        label: "Целочисленный",
    },
    {
        key: "float",
        value: "float",
        label: "Числовой",
    },
    {
        key: "bool",
        value: "bool",
        label: "Логический",
    },
    {
        key: "enum",
        value: "enum",
        label: "Перечислимый",
    },
];

export const getColumns = ({ enumOptions, setEnumOptions, selectedTypes, setSelectedTypes, remove }) => {
    const handleParameterTypeSelect = (i) => (value) => {
        const newSelectedTypes = { ...selectedTypes };
        newSelectedTypes[i] = value;
        setSelectedTypes(newSelectedTypes);
        if (value !== "enum") {
            const newEnumOptions = { ...enumOptions };
            newEnumOptions[i] = null;
            setEnumOptions(newEnumOptions);
        }
    };

    const renderDefaultValue = (field, _, i) => {
        const selectedType = selectedTypes[i];
        if (!selectedType) {
            return <Typography.Text type="secondary">Укажите тип параметра</Typography.Text>;
        }

        const controlsTypesMapping = getControlsTypesMapping({ enumOptions });

        const ControlComponent = controlsTypesMapping[selectedType].component;
        const props = controlsTypesMapping[selectedType].getProps(i);

        return (
            <TinyFormItem {...field} name={[i, "default_value"]}>
                <ControlComponent {...props} />
            </TinyFormItem>
        );
    };

    const renderAdditional = (field, _, i) => {
        if (selectedTypes[i] !== "enum") {
            return <></>;
        }
        return (
            <TinyFormItem {...field} name={[i, "enum_values_set"]}>
                <Select
                    
                    placeholder="Укажите набор допустимых значений"
                    mode="tags"
                    onChange={(value) => {
                        const newEnumOptions = { ...enumOptions };
                        newEnumOptions[i] = value || [];
                        setEnumOptions(newEnumOptions);
                    }}
                />
            </TinyFormItem>
        );
    };

    return [
        {
            key: -1,
            render: (field, _, i) => <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(i)} />,
        },
        {
            key: 1,
            title: "Имя параметра",
            render: (field, _, i) => (
                <TinyFormItem
                    {...field}
                    name={[i, "name"]}
                    rules={[{ required: true, message: "Укажите имя параметра" }]}
                >
                    <Input placeholder="Укажите имя параметра" />
                </TinyFormItem>
            ),
        },
        {
            key: 2,
            title: "Тип параметра",
            render: (field, _, i) => (
                <TinyFormItem
                    {...field}
                    name={[i, "type"]}
                    rules={[{ required: true, message: "Укажите тип параметра" }]}
                >
                    <Select
                        onSelect={handleParameterTypeSelect(i)}
                        placeholder="Выберите тип параметра"
                        options={parameterTypeOptions}
                    />
                </TinyFormItem>
            ),
        },
        {
            key: 3,
            title: "Значения по умолчанию",
            render: renderDefaultValue,
        },
        {
            key: 4,
            title: "Дополнительно",
            render: renderAdditional,
        },
    ];
};
