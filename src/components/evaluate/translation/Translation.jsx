import { Input, Steps, Select, Row, Col, Form, Button, Descriptions, Result, Spin, Space, Typography } from "antd";
import { useState } from "react";
import SelectModelForm from "./forms/SelectModelForm";
import { useDispatch } from "react-redux";
import { createTranslatedModel } from "../../../redux/stores/translatedModelsStore";
import { Link, useParams } from "react-router-dom";
import { DeliveredProcedureOutlined, EditOutlined, FileSyncOutlined, ReloadOutlined } from "@ant-design/icons";

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
    const params = useParams();

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
        3: errorResult ? (
            <Result
                status="error"
                title="Ошибка трансляции ИМ"
                subTitle={
                    <>
                        <Typography.Title style={{ marginTop: 10, marginBottom: 10 }} level={4}>
                            {errorResult.message}
                        </Typography.Title>
                        <Typography.Paragraph style={{ textAlign: "left", display: "block" }}>
                            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(errorResult, null, 4)}</pre>
                        </Typography.Paragraph>
                        <Row justify="center" gutter={10} align="middle">
                            <Col>
                                <Button
                                    type="link"
                                    icon={<ReloadOutlined />}
                                    onClick={() => {
                                        setStage(0);
                                        setStatus();
                                    }}
                                >
                                    Выбрать другой файл ИМ для трансляции
                                </Button>
                            </Col>
                            <Col>
                                <Link to={`/models/${params.selectedModelId}`}>
                                    <Button type="link" icon={<EditOutlined />}>
                                        Вернуться к разработке ИМ
                                    </Button>
                                </Link>
                            </Col>
                        </Row>
                    </>
                }
            />
        ) : (
            <Spin />
        ),
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
