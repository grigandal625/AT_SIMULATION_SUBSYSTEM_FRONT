import { Col, Form, InputNumber, Row } from "antd";
import TinyFormItem from "../../../../utils/TinyFormItem";

export default ({ form, ...props }) => {
    const [actualForm] = form ? [form] : Form.useForm();

    return (
        <Form form={actualForm} {...props} layout="vertical">
            <Row gutter={10}>
                <Col flex="auto">
                    <TinyFormItem name="tacts" label="Количество тактов прогона" rules={[{ required: true, message: "Укажите количество тактов прогона" }]}>
                        <InputNumber step={1} style={{ width: "100%" }} min={1} placeholder="Укажите количество тактов прогона" />
                    </TinyFormItem>
                </Col>
                <Col flex="auto">
                    <TinyFormItem name="wait" label="Интервал между тактами (мс)" rules={[{ required: true, message: "Укажите интервал между тактами" }]}>
                        <InputNumber step={1} style={{ width: "100%" }} min={1} placeholder="Укажите интервал между тактами" />
                    </TinyFormItem>
                </Col>
            </Row>
        </Form>
    );
};
