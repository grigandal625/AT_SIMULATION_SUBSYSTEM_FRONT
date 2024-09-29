import { Form, Input, Select } from "antd";
import AttributesFormList from "./attributes/AttributesList";

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
                            value: "constant",
                        },
                        {
                            label: "Временный",
                            value: "temporal",
                        },
                    ]}
                />
            </Form.Item>
            <Form.Item label="Параметры">
                <Form.List name="attributes">
                    {(fields, { add, remove }) => (
                        <AttributesFormList fields={fields} add={add} remove={remove} form={actualForm} />
                    )}
                </Form.List>
            </Form.Item>
        </Form>
    );
};
