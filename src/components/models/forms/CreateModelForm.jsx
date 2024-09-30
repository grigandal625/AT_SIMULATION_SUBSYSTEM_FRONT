import {Form, Input} from "antd"
import { requiredRule } from "../../../utils/validators/general"

export default ({ form, ...props }) => {
    return <Form form={form} {...props}>
        <Form.Item name="name" rules={[requiredRule]} label="Название модели">
            <Input placeholder="Укажите название" />
        </Form.Item>
    </Form>
}