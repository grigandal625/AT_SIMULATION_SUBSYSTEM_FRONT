import { Button, Form, Modal, Space } from "antd";
import TemplateForm from "../forms/TemplateForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateTemplate } from "../../../../../redux/stores/templatesStore";
import { useEffect } from "react";
import { loadResourceTypes } from "../../../../../redux/stores/resourceTypesStore";

export default ({ open, ...modalProps }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const templates = useSelector((store) => store.templates);
    const template = templates.data.find((template) => template.meta.id.toString() === params.templateId);
    form.setFieldsValue(template);

    const resourceTypes = useSelector((store) => store.resourceTypes);
    useEffect(() => {
        dispatch(loadResourceTypes(params.modelId));
    }, []);

    return (
        <Modal
            width={1300}
            open={open}
            title="Редактирование образца операции"
            onCancel={() => navigate(`/models/${params.modelId}/templates/${params.templateId}`)}
            footer={
                <Space>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={async () => {
                            try {
                                const data = await form.validateFields();
                                const action = await dispatch(
                                    updateTemplate({ modelId: params.modelId, template: data })
                                );
                                const updatedTemplate = action.payload;
                                navigate(`/models/${params.modelId}/templates/${updatedTemplate.id}`);
                            } catch (err) {
                                console.error("Form validation failed:", err);
                            }
                        }}
                    >
                        Сохранить
                    </Button>
                    <Link to={`/models/${params.modelId}/templates/${params.templateId}`}>
                        <Button>Отмена</Button>
                    </Link>
                </Space>
            }
            {...modalProps}
        >
            <TemplateForm modelId={params.modelId} resourceTypes={resourceTypes.data} form={form} layout="vertical" />
        </Modal>
    );
};
