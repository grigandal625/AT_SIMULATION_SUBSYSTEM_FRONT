import { FilterOutlined } from "@ant-design/icons";
import { Form, Select, Input, Radio, Row, Col, Space, Typography, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LOAD_STATUSES } from "../../../../GLOBAL";
import { loadModels } from "../../../../redux/stores/modelsStore";
import { loadTranslatedModels } from "../../../../redux/stores/translatedModelsStore";
import { loadSimulationProcesses } from "../../../../redux/stores/simulationProcessesStore";
import { useNavigate, useParams } from "react-router-dom";

export default ({ form, ...props }) => {
    const [actualForm] = form ? [form] : Form.useForm();
    const models = useSelector((state) => state.models);
    const translatedModels = useSelector((state) => state.translatedModels);
    const simulationProcesses = useSelector((state) => state.simulationProcesses);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const params = useParams();

    useEffect(() => {
        if (models.status !== LOAD_STATUSES.SUCCESS) {
            dispatch(loadModels());
        }
        if (translatedModels.status !== LOAD_STATUSES.SUCCESS) {
            dispatch(loadTranslatedModels());
        }
        if (simulationProcesses.status !== LOAD_STATUSES.SUCCESS) {
            dispatch(loadSimulationProcesses());
        }
    });

    useEffect(() => {
        if (params.selectedTranslatedModelId) {
            actualForm.setFieldsValue({ file_id: params.selectedTranslatedModelId });
            const foundTranslatedModel = translatedModels.data.find(({ id }) => id === params.selectedTranslatedModelId);
            setSelectedTranslatedModel(foundTranslatedModel);
        }
    }, [params, models, translatedModels, simulationProcesses]);

    const [filterModelId, setFilterModelId] = useState();
    const [smVariant, setSmVariant] = useState(1);
    const [selectedTranslatedModel, setSelectedTranslatedModel] = useState();

    const smVariantOptions = [
        { label: "Начать новый прогон", value: 1 },
        { label: "Продолжить существующий прогон", value: 2 },
    ];

    const modelOptions = models.data.map(({ id, name }) => ({ value: id, label: name }));
    const translatedModelOptions = translatedModels.data
        .filter(({ model_id }) => !filterModelId || model_id === filterModelId)
        .map(({ id, name }) => ({
            value: id,
            label: name,
        }));

    const newProcessNameItem = (
        <Form.Item name="process_name" label="Название прогона" rules={[{ required: true, message: "Укажите название прогона" }]}>
            <Input placeholder="Укажите название прогона" />
        </Form.Item>
    );

    const processesOptions = selectedTranslatedModel
        ? simulationProcesses.data
              .filter((p) => p.file_id === selectedTranslatedModel.id)
              .map(({ id, name }) => ({
                  value: id,
                  label: name,
              }))
        : [];

    const selectProcessItem = selectedTranslatedModel ? (
        <Form.Item name="id" label="Прогон" rules={[{ required: true, message: "Укажите прогон" }]}>
            <Select options={processesOptions} showSearch optionFilterProp="label" placeholder="Выберите прогон" />
        </Form.Item>
    ) : (
        <></>
    );

    const onSelectedTranslatedModelChange = (v) => {
        setSelectedTranslatedModel(translatedModels.data.find((m) => m.id === v));
        actualForm.resetFields(["id"]);
        navigate(`/evaluate/runner/${v}`);
    };

    return (
        <Form form={actualForm} {...props}>
            <Row align="bottom" gutter={10} wrap={false}>
                <Col flex="auto">
                    <Form.Item
                        name="file_id"
                        label="Файл внутреннего представления ИМ"
                        rules={[{ required: true, message: "Укажите файл внутреннего представления ИМ" }]}
                    >
                        <Select
                            onChange={onSelectedTranslatedModelChange}
                            options={translatedModelOptions}
                            showSearch
                            optionFilterProp="label"
                            placeholder="Выберите файл внутреннего представления"
                        />
                    </Form.Item>
                </Col>
                <Col>
                    <Form.Item
                        label={
                            <Space>
                                <span>Фильтр по исходному файлу ИМ</span>
                                <FilterOutlined />
                            </Space>
                        }
                    >
                        <Select
                            showSearch
                            optionFilterProp="label"
                            onClear={() => setFilterModelId()}
                            allowClear
                            placeholder="Выберите"
                            options={modelOptions}
                            value={filterModelId}
                            onSelect={(v) => setFilterModelId(v)}
                        />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={processesOptions.length ? 10 : 0}>
                <Col>
                    {processesOptions.length ? (
                        <Form.Item label="Вариант прогона" name="_sm_variant" required>
                            <Radio.Group
                                buttonStyle="solid"
                                options={smVariantOptions}
                                defaultValue={smVariant}
                                onChange={(e) => setSmVariant(e.target.value)}
                                optionType="button"
                            />
                        </Form.Item>
                    ) : (
                        <Form.Item name="_sm_variant" hidden>
                            <InputNumber value={1} />
                        </Form.Item>
                    )}
                </Col>
                <Col flex="auto">{selectedTranslatedModel ? smVariant === 1 || !processesOptions.length ? newProcessNameItem : selectProcessItem : <></>}</Col>
            </Row>
        </Form>
    );
};
