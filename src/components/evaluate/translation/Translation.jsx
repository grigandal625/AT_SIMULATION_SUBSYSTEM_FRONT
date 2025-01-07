import { Input, Steps, Select, Row, Col, Form, Button, Descriptions, Result, Spin, Space, Typography } from "antd";
import { useState } from "react";
import SelectModelForm from "./forms/SelectModelForm";
import { useDispatch } from "react-redux";
import { createTranslatedModel } from "../../../redux/stores/translatedModelsStore";
import { Link } from "react-router-dom";
import { DeliveredProcedureOutlined, FileSyncOutlined } from "@ant-design/icons";

export default () => {
    const stepsItems = [
        { title: "Выбор файла модели" },
        { title: "Лексический анализ" },
        { title: "Синтаксический анализ" },
        { title: "Семантический анализ" },
        { title: "Результаты" },
    ];

    const [stage, setStage] = useState(0);
    const [status, setStatus] = useState();
    const [translatedModel, setTranslatedModel] = useState();
    const [errorResult, setErrorResult] = useState();
    const dispatch = useDispatch();

    const [smSelectForm] = Form.useForm();

    const startTranslation = async () => {
        try {
            await smSelectForm.validateFields();
        } catch (e) {
            console.error("Form validation failed:", e);
            return;
        }
        const { id, name } = smSelectForm.getFieldsValue();

        try {
            const result = await dispatch(createTranslatedModel({ modelId: id, name })).unwrap();
            setTranslatedModel(result);
            setStage(stepsItems.length - 1);
        } catch (e) {
            setStatus("error");
            setErrorResult(e);
            setStage(stepsItems.length - 2);
        }
    };
    const smSelect = (
        <div>
            <SelectModelForm form={smSelectForm} layout="vertical" />
            <Button icon={<FileSyncOutlined />} onClick={startTranslation} type="primary">
                Начать трансляцию
            </Button>
        </div>
    );

    const resultView = translatedModel ? (
        <div style={{ textAlign: "center" }}>
            <Result
                status="success"
                title="Трансляция ИМ успешно завершена"
                extra={
                    <div>
                        <div>
                            <Space>
                                <Typography.Text>Имя файла внутреннего представления ИМ:</Typography.Text>
                                <Typography.Text strong>{translatedModel.name}</Typography.Text>
                            </Space>
                        </div>
                        <div style={{ marginTop: 20 }}>
                            <Link to={`/evaluate/runner/${translatedModel.id}`}>
                                <Button icon={<DeliveredProcedureOutlined />} type="primary">
                                    Перейти к расчету состояний имитационной модели
                                </Button>
                            </Link>
                        </div>
                    </div>
                }
            />
        </div>
    ) : (
        <Spin />
    );

    const viewByStage = {
        0: smSelect,
        1: <div>Лексический анализ</div>,
        2: <div>Синтаксический анализ</div>,
        3: <div>Семантический анализ</div>,
        4: resultView,
    };

    return (
        <Row wrap={false} gutter={20}>
            <Col flex="auto">{viewByStage[stage]}</Col>
            <Col>
                <Steps current={stage} status={status} items={stepsItems} direction="vertical" />
            </Col>
        </Row>
    );
};
