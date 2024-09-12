import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Empty, Form, Input, InputNumber, Select, Table, Typography } from "antd";
import TinyFormItem from "../../../../../utils/TinyFormItem";
import { useState } from "react";

const AttributesFormList = ({ fields, add, remove, form }) => {
    const [selectedTypes, setSelectedTypes] = useState(
        Object.fromEntries(form.getFieldValue("attributes")?.map((attribute, i) => [i, attribute.type]) || [])
    );

    const [enumOptions, setEnumOptions] = useState(
        Object.fromEntries(
            form
                .getFieldValue("attributes")
                ?.map((attribute, i) => [i, attribute.type === 3 ? attribute.options : null]) || []
        )
    );

    const controlsTypesMapping = {
        1: {
            component: InputNumber,
            getProps: () => ({
                placeholder: "Введите числовое значение",
                style: { width: "100%" },
            }),
        },
        2: {
            component: Input,
            getProps: () => ({
                placeholder: "Введите символьное значение",
            }),
        },
        3: {
            component: Select,
            getProps: (i) => ({
                style: { width: "100%" },
                placeholder: "Выберите значение из набора",
                options: (enumOptions[i] || []).map((value) => ({ value })),
            }),
        },
    };

    return !fields.length ? (
        <Empty description="Параметров не добавлено">
            <Button style={{ width: "100%" }} icon={<PlusOutlined />} onClick={() => add({})}>
                Добавить
            </Button>
        </Empty>
    ) : (
        <div>
            <div style={{ marginTop: 5 }}>
                <Table
                    size="small"
                    dataSource={fields}
                    pagination={false}
                    columns={[
                        {
                            key: -1,
                            render: (field, _, i) => (
                                <Button type="link" icon={<MinusCircleOutlined />} onClick={() => remove(i)} />
                            ),
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
                                        onSelect={(value) => {
                                            const newSelectedTypes = { ...selectedTypes };
                                            newSelectedTypes[i] = value;
                                            setSelectedTypes(newSelectedTypes);
                                            if (value !== 3) {
                                                const newEnumOptions = { ...enumOptions };
                                                newEnumOptions[i] = null;
                                                setEnumOptions(newEnumOptions);
                                            }
                                        }}
                                        placeholder="Выберите тип параметра"
                                        options={[
                                            {
                                                key: 1,
                                                value: 1,
                                                label: "Числовой",
                                            },
                                            {
                                                key: 2,
                                                value: 2,
                                                label: "Символьный",
                                            },
                                            {
                                                key: 3,
                                                value: 3,
                                                label: "Перечислимый",
                                            },
                                        ]}
                                    />
                                </TinyFormItem>
                            ),
                        },
                        {
                            key: 3,
                            title: "Значения по умолчанию",
                            render: (field, _, i) => {
                                const selectedType = selectedTypes[i];
                                if (!selectedType) {
                                    return <Typography.Text type="secondary">Укажите тип параметра</Typography.Text>;
                                }

                                const ControlComponent = controlsTypesMapping[selectedType].component;
                                const props = controlsTypesMapping[selectedType].getProps(i);

                                return (
                                    <TinyFormItem {...field} name={[i, "default_value"]}>
                                        <ControlComponent {...props} />
                                    </TinyFormItem>
                                );
                            },
                        },
                        {
                            key: 4,
                            title: "Дополнительно",
                            render: (field, _, i) =>
                                selectedTypes[i] === 3 ? (
                                    <TinyFormItem {...field} name={[i, "options"]}>
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
                                ) : (
                                    <></>
                                ),
                        },
                    ]}
                />
            </div>
            <Button style={{ width: "100%" }} icon={<PlusOutlined />} onClick={() => add({})}>
                Добавить
            </Button>
        </div>
    );
};

export default ({ form, ...formProps }) => {
    const [actualForm] = form ? [form] : Form.useForm();
    return (
        <Form form={actualForm} {...formProps}>
            <Form.Item name="id" hidden />
            <Form.Item name="model_id" hidden />
            <Form.Item
                name="name"
                label="Имя типа ресурса"
                rules={[{ required: true, message: "Укажите имя типа ресурса" }]}
            >
                <Input placeholder="Укажите имя типа ресурса" />
            </Form.Item>
            <Form.Item name="type" label="Тип" rules={[{ required: true, message: "Укажите тип" }]}>
                <Select
                    placeholder="Выберите тип"
                    options={[
                        {
                            label: "Постоянный",
                            value: 1,
                        },
                        {
                            label: "Временный",
                            value: 2,
                        },
                    ]}
                />
            </Form.Item>
            <Form.Item label="Параметры">
                <Form.List name="attributes">
                    {(fields, { add, remove }) => (
                        <AttributesFormList fields={fields} add={add} remove={remove} form={form} />
                    )}
                </Form.List>
            </Form.Item>
        </Form>
    );
};
