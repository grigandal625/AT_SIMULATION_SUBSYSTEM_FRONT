import { EditOutlined, WarningFilled } from "@ant-design/icons";
import { Button, Empty, Form, Input, Select, Row, Col, Tooltip, theme } from "antd";
import { useEffect, useState } from "react";
import CheckboxItem from "../../../../../utils/CheckboxItem";
import { Link } from "react-router-dom";
import AttributesFormList from "./attributes/AttributesList";

const ResourceTypeSelect = ({ value, onChange, resourceTypes, onSelect, modelId }) => {
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
                <Link to={`/models/${modelId}/resource-types/${value}/edit`}>
                    <Button disabled={!resourceType} icon={<EditOutlined />} type="link">
                        Редактировать
                    </Button>
                </Link>
            </Col>
        </Row>
    );
};

export default ({ form, resourceTypes, modelId, ...formProps }) => {
    const [actualForm] = form ? [form] : Form.useForm();

    const [resourceType, setResourceType] = useState(
        resourceTypes ? resourceTypes.find((t) => t.id === actualForm.getFieldValue("resource_type_id")) : undefined
    );

    useEffect(() => {
        const oldAttributes = form.getFieldValue("attributes") || [];
        const newResourceType = resourceTypes.find((t) => t.id === actualForm.getFieldValue("resource_type_id"));
        if (newResourceType) {
            setResourceType(newResourceType);
            actualForm.setFieldsValue({
                attributes: newResourceType.attributes.map((attr, i) => ({
                    rta_id: attr.id,
                    value: oldAttributes[i]?.value !== undefined ? oldAttributes[i]?.value : attr.default_value,
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
                <ResourceTypeSelect resourceTypes={resourceTypes} onSelect={onResourceTypeChange} modelId={modelId} />
            </Form.Item>
            <Form.Item label="Параметры">
                {resourceType ? (
                    <Form.List name="attributes">
                        {(fields) => (
                            <AttributesFormList fields={fields} form={actualForm} resourceType={resourceType} />
                        )}
                    </Form.List>
                ) : (
                    <Empty description="Выберите тип ресурса" />
                )}
            </Form.Item>
        </Form>
    );
};
