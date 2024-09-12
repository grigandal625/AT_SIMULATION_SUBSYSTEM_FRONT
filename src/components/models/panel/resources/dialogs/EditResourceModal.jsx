import { Button, Form, Modal, Space } from "antd";
import ResourceForm from "../forms/ResourceForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateResource } from "../../../../../redux/stores/resourcesStore";
import { loadResourceTypes } from "../../../../../redux/stores/resourceTypesStore";
import { useEffect } from "react";

export default ({ open, ...modalProps }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const resources = useSelector((store) => store.resources);
    const resource = resources.data.find((resource) => resource.id.toString() === params.resourceId);
    form.setFieldsValue(resource);

    

    const resourceTypes = useSelector((store) => store.resourceTypes);
    useEffect(() => {
        dispatch(loadResourceTypes(params.modelId));
    }, []);

    return (
        <Modal
            width={1300}
            open={open}
            title="Редактирование ресурса"
            onCancel={() => navigate(`/models/${params.modelId}/resources/${params.resourceId}`)}
            footer={
                <Space>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={async () => {
                            try {
                                const data = await form.validateFields();
                                console.log(data);
                                const action = await dispatch(
                                    updateResource({ modelId: params.modelId, resource: data })
                                );
                                const updatedResource = action.payload;
                                navigate(`/models/${params.modelId}/resources/${updatedResource.id}`);
                            } catch (err) {
                                console.error("Form validation failed:", err);
                            }
                        }}
                    >
                        Сохранить
                    </Button>
                    <Link to={`/models/${params.modelId}/resources/${params.resourceId}`}>
                        <Button>Отмена</Button>
                    </Link>
                </Space>
            }
            {...modalProps}
        >
            <ResourceForm resourceTypes={resourceTypes.data} form={form} layout="vertical" />
        </Modal>
    );
};
