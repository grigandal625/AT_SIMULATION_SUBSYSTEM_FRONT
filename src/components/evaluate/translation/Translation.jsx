import { Steps, Row, Col, Form, Button, Result, Spin, Space, Typography, Collapse, Skeleton } from "antd";
import { useState } from "react";
import SelectModelForm from "./forms/SelectModelForm";
import { useDispatch } from "react-redux";
import { createTranslatedModel } from "../../../redux/stores/translatedModelsStore";
import { Link, useParams } from "react-router-dom";
import { DeliveredProcedureOutlined, DownloadOutlined, EditOutlined, FileSyncOutlined, ReloadOutlined } from "@ant-design/icons";
import CodeEditorItem, { defaultEditorDidMount, defaultEditorOptions } from "../../../utils/CodeEditorItem";
import { download } from "../../../utils/DownloadText";

const InternalAndLogs = ({ file_content, translate_logs }) => (
    <div>
        <div>
            <CodeEditorItem language="go" height={400} value={file_content} editorDidMount={defaultEditorDidMount} options={{ ...defaultEditorOptions, readOnly: true }} />
        </div>
        <Typography.Title level={5}>Журнал транслятора</Typography.Title>
        <Typography.Paragraph style={{ textAlign: "left", display: "block" }}>
            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{translate_logs === "empty" ? "(пусто)" : translate_logs}</pre>
        </Typography.Paragraph>
    </div>
);

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

    const resultsAndLogs = translatedModel ? <InternalAndLogs {...translatedModel} /> : <Skeleton active />;

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
                            <Row justify="center" gutter={10} align="middle">
                                <Col>
                                    <Link to={`/evaluate/runner/${translatedModel.id}`}>
                                        <Button icon={<DeliveredProcedureOutlined />} type="primary">
                                            Перейти к расчету состояний имитационной модели
                                        </Button>
                                    </Link>
                                </Col>
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
                        </div>
                        <div style={{ marginTop: 20, textAlign: "left" }}>
                            <Collapse
                                size="small"
                                items={[
                                    {
                                        label: (
                                            <Row wrap={false}>
                                                <Col flex="auto">Внутреннее представление ИМ</Col>
                                                <Col>
                                                    <Button
                                                        size="small"
                                                        onClick={() => download(`${translatedModel.name}.go`, translatedModel?.file_content)}
                                                        type="primary"
                                                        icon={<DownloadOutlined />}
                                                        disabled={!translatedModel?.file_content}
                                                    >
                                                        Скачать
                                                    </Button>
                                                </Col>
                                            </Row>
                                        ),
                                        children: resultsAndLogs,
                                    },
                                ]}
                            />
                        </div>
                    </div>
                }
            />
        </div>
    ) : (
        <Spin />
    );

    const errorView = errorResult ? (
        <Result
            status="error"
            title="Ошибка трансляции ИМ"
            subTitle={
                <>
                    <Typography.Title style={{ marginTop: 10, marginBottom: 10 }} level={4}>
                        {errorResult.message}
                    </Typography.Title>
                    {errorResult.data?.file_content && errorResult.data?.translate_logs ? (
                        <InternalAndLogs {...errorResult.data} />
                    ) : (
                        <Typography.Paragraph style={{ textAlign: "left", display: "block" }}>
                            <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>{JSON.stringify(errorResult, null, 4)}</pre>
                        </Typography.Paragraph>
                    )}
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
        <Skeleton active />
    );

    const viewByStage = {
        0: smSelect,
        1: <div>Лексический анализ</div>,
        2: <div>Синтаксический анализ</div>,
        3: errorView,
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
