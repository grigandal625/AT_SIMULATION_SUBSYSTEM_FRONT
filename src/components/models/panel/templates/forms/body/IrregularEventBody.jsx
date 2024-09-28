import { useEffect, useState } from "react";

import { theme, Card, Row, Col, Form, Select, InputNumber } from "antd";
import CodeEditorItem, {
    defaultEditorBackground,
    defaultEditorDidMount,
    defaultEditorOptions,
} from "../../../../../../utils/CodeEditorItem";
import { makeAutoComplete } from "./autoComplete";
import TinyFormItem from "../../../../../../utils/TinyFormItem";
// import {} from "monaco-editor/esm/vs/editor/browser/services/editorWorkerService";

export default ({ form, relevantResources, resourceTypes }) => {
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

    const editorDidMount = defaultEditorDidMount;
    const codeEditorOptions = defaultEditorOptions;

    const autoComplete = makeAutoComplete(relevantResources, resourceTypes);

    return (
        <Row gutter={5}>
            <Col>
                <Card title="Параметры генератора события">
                    <Form.Item label="Тип генератора" name={["body", "type"]}>
                        <Select
                            placeholder="Укажите тип генератора"
                            options={options}
                            onSelect={(value) => setSelectedGeneratorType(value)}
                        />
                    </Form.Item>
                    <Form.Item label="Мат. ожидание" name={["body", "value"]}>
                        <InputNumber style={{ width: "100%" }} placeholder="Укажите мат. ожидание" />
                    </Form.Item>
                    <Form.Item label="Дисперсия" name={["body", "dispersion"]}>
                        <InputNumber
                            style={{ width: "100%" }}
                            disabled={selectedGeneratorType === "precise"}
                            placeholder="Укажите диперсию"
                        />
                    </Form.Item>
                </Card>
            </Col>
            <Col flex="auto">
                <Card title="Тело нерегулярного события">
                    <div style={{ paddingTop: 5, background: defaultEditorBackground }}>
                        <TinyFormItem name={["body", "text"]}>
                            <CodeEditorItem
                                language="go"
                                relevantResources={relevantResources}
                                options={codeEditorOptions}
                                style={{ backgroundColor: colorInfoBg }}
                                height="250px"
                                onCodeChanged={setCode}
                                autoComplete={autoComplete}
                                editorDidMount={editorDidMount}
                            />
                        </TinyFormItem>
                    </div>
                </Card>
            </Col>
        </Row>
    );
};
