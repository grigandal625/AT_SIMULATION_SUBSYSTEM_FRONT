import { Card, Col, Form, Input, InputNumber, Row, Select } from "antd";
import { useEffect, useState } from "react";
import CodeEditor from "@uiw/react-textarea-code-editor"

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

    const [selectedGeneratorType, setSelectedGeneratorType] = useState()

    useEffect(() => {
        if (selectedGeneratorType === 'precise') {
            form.setFieldValue(["body", "dispersion"], 0);
        }
    }, [selectedGeneratorType]);
    return (
        <Row gutter={5}>
            <Col>
                <Card title="Параметры генератора">
                    <Form.Item label="Тип генератора" name={["body", "type"]}>
                        <Select options={options} onSelect={(value) => setSelectedGeneratorType(value)}/>
                    </Form.Item>
                    <Form.Item label="Мат. ожидание" name={["body", "value"]}>
                        <InputNumber placeholder="Укажите мат. ожидание" />
                    </Form.Item>
                    <Form.Item label="Дисперсия" name={["body", "dispersion"]}>
                        <InputNumber disabled={selectedGeneratorType === 'precise'} placeholder="Диперсию" />
                    </Form.Item>
                </Card>
            </Col>
            <Col flex="auto">
                <Card title="Тело образца">
                    <Form.Item name={['body']}><CodeEditor language="go" /></Form.Item>
                </Card>
            </Col>
        </Row>
    );
};

export default ({ form, resourceTypes, ...formProps }) => {
    const [actualForm] = form ? [form] : Form.useForm();
    const [selectedType, setSelectedType] = useState();
    
    const bodyItems = {
        1: IrregularEventBody,
        2: () => <p>Тело операции</p>,
        3: () => <p>Тело правила</p>,
    }

    const SelectedBodyItem = selectedType ? bodyItems[selectedType] : () => <

    return (
        <Form form={actualForm}>
            <Form.Item
                label="Название образца операции"
                name="name"
                rules={[{ required: true, message: "Укажите имя образца операции" }]}
            >
                <Input placeholder="Укажите имя образца операции" />
            </Form.Item>
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
        </Form>
    );
};
