import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Typography } from "antd";
import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor";
import rehypePrism from "rehype-prism-plus";
import TinyFormItem from "../../../../../utils/TinyFormItem";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";

const IrregularEventBody = ({ form }) => {
    const options = [
        { value: "normal", label: "Нормальное распределение" },
        { value: "precise", label: "Точное число" },
        { value: "random", label: "Случайное число" },
        { value: "uniform", label: "Равномерное распределение" },
        { value: "exponential", label: "Экспоненциальное распределение" },
        { value: "gaussian", label: "Распределение Гаусса" },
        { value: "poisson", label: "Распределение Пуассона" },
    ];

    const [selectedGeneratorType, setSelectedGeneratorType] = useState();

    useEffect(() => {
        if (selectedGeneratorType === "precise") {
            form.setFieldValue(["body", "dispersion"], 0);
        }
    }, [selectedGeneratorType]);
    return (
        <Row gutter={5}>
            <Col>
                <Card title="Параметры генератора">
                    <Form.Item label="Тип генератора" name={["body", "type"]}>
                        <Select options={options} onSelect={(value) => setSelectedGeneratorType(value)} />
                    </Form.Item>
                    <Form.Item label="Мат. ожидание" name={["body", "value"]}>
                        <InputNumber style={{ width: "100%" }} placeholder="Укажите мат. ожидание" />
                    </Form.Item>
                    <Form.Item label="Дисперсия" name={["body", "dispersion"]}>
                        <InputNumber style={{ width: "100%" }} disabled={selectedGeneratorType === "precise"} placeholder="Диперсию" />
                    </Form.Item>
                </Card>
            </Col>
            <Col flex="auto">
                <Card title="Тело образца">
                    <Form.Item name={["body"]}>
                        <CodeEditor
                            rehypePlugins={[[rehypePrism, { ignoreMissing: true, showLineNumbers: true }]]}
                            style={{ fontSize: 18, fontFamily: "monospace" }}
                            language="go"
                            placeholder="Введите код тела образца"
                        />
                    </Form.Item>
                </Card>
            </Col>
        </Row>
    );
};

const RelevantResourcesList = ({ fields, add, remove, resourceTypes }) => {
    return (
        <Space>
            {fields.map((field, i) => (
                <Space wrap={false}>
                    <TinyFormItem {...field} layout="inline" name={[i, "name"]}>
                        <Input size="small" placeholder="Имя ресурса" />
                    </TinyFormItem>
                    <TinyFormItem {...field} layout="inline" name={[i, "type"]}>
                        <Select size="small" items={resourceTypes.map((resourceType) => ({ value: resourceType.id, label: resourceType.name }))} placeholder="Тип ресурса" />
                    </TinyFormItem>
                    <Button danger size="small" icon={<CloseOutlined />} onClick={() => remove(i)} />
                </Space>
            ))}
            <Button icon={<PlusOutlined />} size="small" onClick={() => add()} />
        </Space>
    );
};

export default ({ form, resourceTypes, ...formProps }) => {
    const [actualForm] = form ? [form] : Form.useForm();
    const [selectedType, setSelectedType] = useState();

    const bodyItems = {
        1: IrregularEventBody,
        2: () => <p>Тело операции</p>,
        3: () => <p>Тело правила</p>,
    };

    const SelectedBodyItem = selectedType ? bodyItems[selectedType] : () => <Typography.Text type="secondary">Укажите вид образца</Typography.Text>;

    return (
        <Form form={actualForm} {...formProps}>
            <Row gutter={10}>
                <Col flex={12}>
                    <Form.Item label="Название образца операции" name="name" rules={[{ required: true, message: "Укажите имя образца операции" }]}>
                        <Input placeholder="Укажите имя образца операции" />
                    </Form.Item>
                </Col>
                <Col flex={12}>
                    <Form.Item label="Вид" name="type" rules={[{ required: true, message: "Укажите вид" }]}>
                        <Select
                            options={[
                                { value: 1, label: "Нерегулярное событие" },
                                { value: 2, label: "Операция" },
                                { value: 3, label: "Правило" },
                            ]}
                            onSelect={(value) => setSelectedType(value)}
                            placeholder="Выберите вид операции"
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item label="Релевантные ресурсы">
                <Form.List name="relevant_resources">
                    {(fields, { add, remove }) => <RelevantResourcesList fields={fields} add={add} remove={remove} resourceTypes={resourceTypes} />}
                </Form.List>
            </Form.Item>

            <SelectedBodyItem />
        </Form>
    );
};
