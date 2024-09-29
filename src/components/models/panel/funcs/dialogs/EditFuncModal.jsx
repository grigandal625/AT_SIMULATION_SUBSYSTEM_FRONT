import { Button, Form, Modal, Space } from "antd";
import FuncForm from "../forms/FuncForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { SaveOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { updateFunc } from "../../../../../redux/stores/funcsStore";

export default ({ open, ...modalProps }) => {
    const params = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [form] = Form.useForm();

    const funcs = useSelector((store) => store.funcs);
    const func = funcs.data.find(
        (func) => func.id.toString() === params.funcId
    );
    form.setFieldsValue(func);

    return (
        <Modal
            width={1300}
            open={open}
            title="Редактирование функции"
            onCancel={() => navigate(`/models/${params.modelId}/funcs/${params.funcId}`)}
            footer={
                <Space>
                    <Button
                        type="primary"
                        icon={<SaveOutlined />}
                        onClick={async () => {
                            try {
                                const data = await form.validateFields();
                                const action = await dispatch(
                                    updateFunc({ modelId: params.modelId, func: data })
                                );
                                const updatedFunc = action.payload;
                                navigate(`/models/${params.modelId}/funcs/${updatedFunc.id}`);
                            } catch (err) {
                                console.error("Form validation failed:", err);
                            }
                        }}
                    >
                        Сохранить
                    </Button>
                    <Link to={`/models/${params.modelId}/funcs/${params.funcId}`}>
                        <Button>Отмена</Button>
                    </Link>
                </Space>
            }
            {...modalProps}
        >
            <FuncForm form={form} layout="vertical" />
        </Modal>
    );
};
