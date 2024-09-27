import { Button, Card, Col, Form, Input, InputNumber, Row, Select, Space, Typography, theme } from "antd";
import { useEffect, useState } from "react";
import MonacoEditor from "@uiw/react-monacoeditor";
import {languages} from "monaco-editor"
import TinyFormItem from "../../../../../utils/TinyFormItem";
import { CloseOutlined, PlusOutlined } from "@ant-design/icons";


const isValidGoIdentifier = (name) => {
    return /^[a-zA-Z_]\w*$/.test(name);
};

const CodeEditorField = ({ value, onChange, onCodeChanged, relevantResources, ...props }) => {
    const [code, setCode] = useState(value);
    useEffect(() => {
        setCode(value);
    }, []);

    useEffect(() => {
        try {
            onChange(code);
            onCodeChanged(code);
        } catch (e) {}
    }, [code]);

    return <MonacoEditor onChange={setCode} {...props} />;
};

const IrregularEventBody = ({ form, relevantResources }) => {
    const {
        token: { colorInfoBg },
    } = theme.useToken();
    const options = [
        { value: "normal", label: "Нормальное распределение" },
        { value: "precise", label: "Точное число" },
        { value: "random", label: "Случайное число" },
        { value: "uniform", label: "Равномерное распределение" },
        { value: "exponential", label: "Экспоненциальное распределение" },
        { value: "gaussian", label: "Распределение Гаусса" },
        { value: "poisson", label: "Распределение Пуассона" },
    ];

    const [code, setCode] = useState();

    const [selectedGeneratorType, setSelectedGeneratorType] = useState();

    useEffect(() => {
        if (selectedGeneratorType === "precise") {
            form.setFieldValue(["body", "dispersion"], 0);
        }
    }, [selectedGeneratorType]);

    const codeEditorOptions = {
        selectOnLineNumbers: true,
        roundedSelection: false,
        readOnly: false,
        cursorStyle: "line",
        automaticLayout: false,
        theme: "atsym",
        scrollbar: {
            useShadows: true,
            verticalHasArrows: true,
            horizontalHasArrows: true,
            vertical: "visible",
            horizontal: "visible",
            verticalScrollbarSize: 17,
            horizontalScrollbarSize: 17,
            arrowSize: 30,
        },
        suggest: {
            showFields: false,
            showFunctions: false,
        },
    };

    return (
        <Row gutter={5}>
            <Col>
                <Card title="Параметры генератора события">
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
                <Card title="Тело нерегулярного события">
                    <Form.Item name={["body", "text"]}>
                        <CodeEditorField
                            language="go"
                            relevantResources={relevantResources}
                            options={codeEditorOptions}
                            style={{ backgroundColor: colorInfoBg }}
                            height="250px"
           
                            onCodeChanged={setCode}
                            autoComplete={(model, position) => {
                                let originalSuggestions = languages.ge

                                const filteredResources = relevantResources.filter((resource) => resource?.name && isValidGoIdentifier(resource.name));

                                const suggestions = filteredResources.map((resource) => ({
                                    label: resource.name,
                                    kind: languages.CompletionItemKind.Class,
                                    insertText: resource.name,
                                    detail: "Релевантный ресурс",
                                }));

                                return [...originalSuggestions, ...suggestions];
                            }}
                        />
                    </Form.Item>
                </Card>
            </Col>
        </Row>
    );
};

const RelevantResourcesList = ({ fields, add, remove, resourceTypes, relevantResources, setRelevantResources }) => {
    const {
        token: { borderRadius, colorInfoBg },
    } = theme.useToken();

    return (
        <Space wrap={true}>
            {fields.map((field, i) => (
                <div style={{ paddingLeft: 5, paddingRight: 5, borderRadius, background: colorInfoBg }}>
                    <Row wrap align="middle" gutter={5}>
                        <Col>
                            <TinyFormItem {...field} name={[i, "name"]}>
                                <Input
                                    size="small"
                                    placeholder="Имя ресурса"
                                    onChange={(e) =>
                                        setRelevantResources(
                                            relevantResources.map((relevantResource, index) => (i === index ? { ...relevantResource, name: e.target.value } : relevantResource))
                                        )
                                    }
                                />
                            </TinyFormItem>
                        </Col>
                        <Col>
                            <TinyFormItem {...field} name={[i, "type"]}>
                                <Select
                                    size="small"
                                    options={resourceTypes.map((resourceType) => ({ value: resourceType.id, label: resourceType.name }))}
                                    placeholder="Тип ресурса"
                                    onSelect={(type) =>
                                        setRelevantResources(relevantResources.map((relevantResource, index) => (i === index ? { ...relevantResource, type } : relevantResource)))
                                    }
                                />
                            </TinyFormItem>
                        </Col>
                        <Col>
                            <Button
                                danger
                                size="small"
                                icon={<CloseOutlined />}
                                onClick={() => {
                                    remove(i);
                                    setRelevantResources((relevantResources || []).filter((_, index) => index !== i));
                                }}
                            />
                        </Col>
                    </Row>
                </div>
            ))}
            <Button
                icon={<PlusOutlined />}
                size="small"
                onClick={() => {
                    add();
                    setRelevantResources([...relevantResources, {}]);
                }}
            />
        </Space>
    );
};

export default ({ form, resourceTypes, ...formProps }) => {
    const [actualForm] = form ? [form] : Form.useForm();
    const [selectedType, setSelectedType] = useState();
    const [relevantResources, setRelevantResources] = useState([]);

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
                    {(fields, { add, remove }) => (
                        <RelevantResourcesList
                            setRelevantResources={setRelevantResources}
                            relevantResources={relevantResources}
                            fields={fields}
                            add={add}
                            remove={remove}
                            resourceTypes={resourceTypes}
                        />
                    )}
                </Form.List>
            </Form.Item>
            <Form.Item label="Тело образца">
                <SelectedBodyItem relevantResources={relevantResources} form={form} />
            </Form.Item>
        </Form>
    );
};
