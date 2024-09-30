import { Col, Form, Input, Row, Select, Typography } from "antd";
import GoTypingInput from "../../../../../utils/GoTypingInput";
import { requiredRule } from "../../../../../utils/validators/general";
import FuncBody from "./body/FuncBody";
// import { useEffect, useState } from "react";

export default ({ form, ...formProps }) => {
    const [actualForm] = form ? [form] : Form.useForm();
    // const [mounted, setMounted] = useState(false);
    // useEffect(() => {
    //     setMounted(true);
    // }, [actualForm]);

    return (
        <Form form={actualForm} {...formProps}>
            <Form.Item name="id" hidden />
            <Form.Item name="model_id" hidden />
            <Row gutter={5}>
                <Col flex={12}>
                    <Form.Item name="name" label="Имя функции" rules={[requiredRule]}>
                        <Input placeholder="Укажите имя функции" />
                    </Form.Item>
                </Col>
                <Col flex={12}>
                    <Form.Item name="ret_type" label="Возвращаемый тип" rules={[requiredRule]}>
                        <GoTypingInput placeholder="Укажите тип функции" />
                    </Form.Item>
                </Col>
            </Row>
            <Typography.Title level={5}>Описание функции</Typography.Title>
            <FuncBody form={actualForm} />
        </Form>
    );
};
