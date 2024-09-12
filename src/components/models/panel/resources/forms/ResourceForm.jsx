import { EditOutlined, InfoCircleOutlined, MinusCircleOutlined, PlusOutlined, WarningFilled } from "@ant-design/icons";
import {
    Button,
    Descriptions,
    Empty,
    Form,
    Input,
    InputNumber,
    Popover,
    Select,
    Space,
    Table,
    Tag,
    Row,
    Col,
    Tooltip,
    theme,
    Typography,
    Spin,
} from "antd";
import TinyFormItem from "../../../../../utils/TinyFormItem";
import { useEffect, useState } from "react";
import CheckboxItem from "../../../../../utils/CheckboxItem";
import { Link } from "react-router-dom";

const typeLabels = { 1: "Численный", 2: "Символьный", 3: "Перечислимый" };

const AttributeControl = ({ attribute, value, onChange }) => {
    const controlsTypesMapping = {
        1: {
            component: InputNumber,
            props: {
                value,
                onChange,
                placeholder: "Введите числовое значение",
                style: { width: "100%" },
            },
        },
        2: {
            component: Input,
            props: {
                value,
                onChange,
                placeholder: "Введите символьное значение",
            },
        },
        3: {
            component: Select,
            props: {
                value,
                onChange,
                options: (attribute && (attribute.options instanceof Array) ? attribute.options : []).map((value) => ({ value })),
                style: { width: "100%" },
                placeholder: "Выберите значение",
            },
        },
    };
    if (!attribute) {
        return <Spin />
    }
    const ControlComponent = controlsTypesMapping[attribute.type].component;
    const props = controlsTypesMapping[attribute.type].props;

    return <ControlComponent {...props} />;
};

const AttributesFormList = ({ fields, form, resourceType }) => {
    debugger;
    return !fields.length ? (
        <Empty description="Параметров не добавлено" />
    ) : (
        <div style={{ marginTop: 5 }}>
            <Table
                size="small"
                dataSource={fields}
                pagination={false}
                columns={[
                    {
                        key: 1,
                        title: "Имя параметра",
                        render: (field, _, i) => <Typography.Text>{resourceType.attributes[i]?.name}</Typography.Text>,
                    },
                    {
                        key: 2,
                        title: "Тип параметра",
                        render: (field, _, i) => (
                            <>
                                <Form.Item hidden name={[i, "rta_id"]} />
                                <Tag>{typeLabels[resourceType.attributes[i]?.type]}</Tag>
                            </>
                        ),
                    },
                    {
                        key: 3,
                        title: "Значения по умолчанию",
                        render: (field, _, i) => (
                            <TinyFormItem name={[i, "value"]}>
                                <AttributeControl attribute={resourceType.attributes[i]} />
                            </TinyFormItem>
                        ),
                    },
                ]}
            />
        </div>
    );
};

const ResourceTypeSelect = ({ value, onChange, resourceTypes, onSelect }) => {
    const {
        token: { colorWarningText },
    } = theme.useToken();
    const resourceType = resourceTypes ? resourceTypes.find((t) => t.id === value) : undefined;

    return (
        <Row>
            <Col flex="auto">
                <Select
                    value={value}
                    onChange={onChange}
                    placeholder="Выберите тип ресурса"
                    suffixIcon={
                        <Tooltip title="При смене типа ресурса значения параметров удалятся">
                            <WarningFilled style={{ color: colorWarningText }} />
                        </Tooltip>
                    }
                    style={{ width: "100%" }}
                    options={(resourceTypes || []).map((t) => ({ key: t.id.toString(), label: t.name, value: t.id }))}
                    onSelect={onSelect}
                />
            </Col>
            <Col>
                <Link
                    to={
                        resourceType?.model_id
                            ? `/models/${resourceType.model_id}/resource-types/${value}/edit`
                            : undefined
                    }
                >
                    <Button disabled={!resourceType} icon={<EditOutlined />} type="link">
                        Редактировать
                    </Button>
                </Link>
            </Col>
        </Row>
    );
};

export default ({ form, resourceTypes, ...formProps }) => {
    const [actualForm] = form ? [form] : Form.useForm();

    const [resourceType, setResourceType] = useState(
        resourceTypes ? resourceTypes.find((t) => t.id === actualForm.getFieldValue("resource_type_id")) : undefined
    );

    useEffect(() => {
        const newResourceType = resourceTypes.find((t) => t.id === actualForm.getFieldValue("resource_type_id"));
        if (newResourceType) {
            setResourceType(newResourceType);
            form.setFieldsValue({
                attributes: newResourceType.attributes.map((attr) => ({
                    rta_id: attr.id,
                    value: attr.default_value,
                    name: attr.name,
                })),
            });
        }
    }, [resourceTypes]);

    const onResourceTypeChange = (value) => {
        const newResourceType = resourceTypes.find((t) => t.id === value);
        setResourceType(newResourceType);
        form.setFieldsValue({
            attributes: newResourceType.attributes.map((attr) => ({
                rta_id: attr.id,
                value: attr.default_value,
                name: attr.name,
            })),
            resource_type_id: value,
        });
    };

    return (
        <Form form={actualForm} {...formProps}>
            <Form.Item name="id" hidden />
            <Form.Item name="model_id" hidden />
            <Form.Item name="resource_type_id" hidden />
            <Row align="bottom" gutter={5}>
                <Col flex="auto">
                    <Form.Item
                        name="name"
                        label="Имя типа ресурса"
                        rules={[{ required: true, message: "Укажите имя ресурса" }]}
                    >
                        <Input placeholder="Укажите имя ресурса" />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        name="to_be_traced"
                        layout="horizontal"
                        label="Трассировка"
                        rules={[{ required: true, message: "Укажите тип" }]}
                    >
                        <CheckboxItem />
                    </Form.Item>
                </Col>
            </Row>
            <Form.Item name="resource_type_id" label="Тип ресурса">
                <ResourceTypeSelect resourceTypes={resourceTypes} onSelect={onResourceTypeChange} />
            </Form.Item>
            <Form.Item label="Параметры">
                {resourceType ? (
                    <Form.List name="attributes">
                        {(fields) => <AttributesFormList fields={fields} form={form} resourceType={resourceType} />}
                    </Form.List>
                ) : (
                    <Empty description="Выберите тип ресурса" />
                )}
            </Form.Item>
        </Form>
    );
};
