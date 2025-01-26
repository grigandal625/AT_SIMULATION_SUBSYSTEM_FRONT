import { Input, Select, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_STATUSES } from "../../../../GLOBAL";
import { loadModels } from "../../../../redux/stores/modelsStore";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { loadTranslatedModels } from "../../../../redux/stores/translatedModelsStore";

export default ({ form, ...props }) => {
    const [actualForm] = form ? [form] : Form.useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    const models = useSelector((state) => state.models);
    const translatedModels = useSelector((state) => state.translatedModels);

    useEffect(() => {
        if (models.status !== LOAD_STATUSES.SUCCESS) {
            dispatch(loadModels());
        }
        if (translatedModels.status !== LOAD_STATUSES.SUCCESS) {
            dispatch(loadTranslatedModels());
        }
    }, []);

    useEffect(() => {
        if (params.selectedModelId) {
            actualForm.setFieldValue("id", parseInt(params.selectedModelId));
            const foundModel = models.data.find(({ id }) => id === parseInt(params.selectedModelId));
            debugger;
            if (foundModel) {
                actualForm.setFieldValue("name", foundModel.name + " " + new Date().toISOString());
            }
        } else {
            actualForm.resetFields(["name"]);
        }
    }, [params.selectedModelId, models.status]);

    return (
        <Form form={actualForm} {...props}>
            <Form.Item label="Файл ИМ" name="id" rules={[{ required: true, message: "Выберите файл модели" }]}>
                <Select
                    showSearch
                    optionFilterProp="label"
                    onSelect={(id) => navigate(`/evaluate/translation/${id}`)}
                    placeholder="Выберите файл ИМ"
                    options={models.data.map(({ id, name }) => ({ value: id, label: name }))}
                />
            </Form.Item>
            <Form.Item label="Имя файла внутреннего представления ИМ" name="name" rules={[{ required: true, message: "Укажите имя файла" }]}>
                <Input placeholder="Укажите имя файла" />
            </Form.Item>
        </Form>
    );
};
