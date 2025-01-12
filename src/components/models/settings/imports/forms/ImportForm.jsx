import { Col, Empty, Form, Input, Row, Table, Typography, Button, InputNumber } from "antd";
import { requiredRule } from "../../../../../utils/validators/general";
import TinyFormItem from "../../../../../utils/TinyFormItem";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";

const PackagesList = ({ fields, add, remove }) => {
    const colums = [
        {
            key: "action",
            render: (__, _, index) => (
                <Button
                    type="link"
                    icon={<MinusCircleOutlined />}
                    onClick={() => {
                        remove(index);
                    }}
                />
            ),
        },
        {
            title: "Пакет",
            key: "package",
            render: (field, _, index) => (
                <TinyFormItem {...field} name={[index, "name"]} rules={[requiredRule]}>
                    <Input placeholder="Укажите имя пакета" />
                </TinyFormItem>
            ),
        },
        {
            title: "Синоним",
            key: "alias",
            render: (field, _, index) => (
                <TinyFormItem {...field} name={[index, "alias"]}>
                    <Input placeholder="Укажите синоним пакета" />
                </TinyFormItem>
            ),
        },
    ];

    return fields.length ? (
        <Table
            title={() => (
                <Row align="middle">
                    <Col flex="auto">
                        <Typography.Title level={5} style={{ marginTop: 10 }}>
                            Используемые пакеты
                        </Typography.Title>
                    </Col>
                    <Col>
                        <Button icon={<PlusOutlined />} onClick={() => add({})}>
                            Добавить пакет
                        </Button>
                    </Col>
                </Row>
            )}
            dataSource={fields}
            columns={colums}
            pagination={false}
            size="small"
        />
    ) : (
        <Empty description="Пакетов не добавлено">
            <Button style={{ width: "100%" }} icon={<PlusOutlined />} onClick={() => add({})}>
                Добавить пакет
            </Button>
        </Empty>
    );
};

export default ({ form, ...props }) => {
    const [actualForm] = form ? [form] : Form.useForm();

    return (
        <Form form={actualForm} {...props}>
            <Form.Item hidden name="id">
                <InputNumber />
            </Form.Item>
            <Row gutter={10}>
                <Col flex="auto">
                    <Form.Item label="Название/URL" name="name" rules={[requiredRule]}>
                        <Input placeholder="Укажите название/URL" />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item style={{ marginTop: 1 }} label="Версия" name="version">
                        <Input placeholder="Укажите версию" />
                    </Form.Item>
                </Col>
            </Row>
            <Form.List name="packages">{(fields, { add, remove }) => <PackagesList fields={fields} add={add} remove={remove} />}</Form.List>
        </Form>
    );
};
