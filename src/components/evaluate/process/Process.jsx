import { Button, Col, Collapse, Form, Modal, Row, Skeleton, Space, Tabs, Tag, Typography } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { LOAD_STATUSES, PROCES_STATUSES } from "../../../GLOBAL";
import { killSimulationProcess, loadSimulationProcesses, pauseSimulationProcess, runSimulationProcess } from "../../../redux/stores/simulationProcessesStore";
import { BackwardOutlined, CloseCircleOutlined, PauseCircleOutlined, PlayCircleOutlined } from "@ant-design/icons";
import ModelParamsConfigForm from "./forms/ModelParamsConfigForm";
import Info from "./info/Info";

export default () => {
    const params = useParams();
    const processes = useSelector((state) => state.simulationProcesses);
    const dispatch = useDispatch();

    const [form] = Form.useForm();
    const [modal, contextHolder] = Modal.useModal();

    useEffect(() => {
        if (processes.status !== LOAD_STATUSES.SUCCESS) {
            dispatch(loadSimulationProcesses());
        }
    }, []);

    const currentProcess = processes.data.find((p) => p.id === params.processId);

    const [startLoading, setStartLoading] = useState(false);
    const [pauseLoading, setPauseLoading] = useState(false);

    if (!currentProcess) {
        return <Skeleton active />;
    }

    const statuses = {};
    statuses[PROCES_STATUSES.PAUSED] = "Приостановлен";
    statuses[PROCES_STATUSES.RUNNING] = "Выполняется";
    statuses[PROCES_STATUSES.KILLED] = "Завершен";
    statuses[PROCES_STATUSES.ERROR] = "Ошибка";

    const statusTag = (
        <Tag color={currentProcess.status === PROCES_STATUSES.ERROR ? "red" : currentProcess.status === PROCES_STATUSES.RUNNING ? "green" : "blue"}>
            {statuses[currentProcess.status]}
        </Tag>
    );

    const onStartClick = async (e) => {
        e.stopPropagation();
        setStartLoading(true);
        try {
            await form.validateFields();
        } catch (e) {
            console.error(e);
            setStartLoading(false);
            return;
        }

        const data = form.getFieldsValue();
        try {
            await dispatch(runSimulationProcess({ ...data, id: params.processId })).unwrap();
        } finally {
            setStartLoading(false);
        }
    };

    const onPauseClick = async (e) => {
        setPauseLoading(true);
        e.stopPropagation();
        try {
            await dispatch(pauseSimulationProcess(currentProcess.id)).unwrap();
        } finally {
            setPauseLoading(false);
        }
    };

    const onKillClick = (e) => {
        e.stopPropagation();
        modal.confirm({
            title: "Завершение прогона",
            content: (
                <div>
                    <Typography.Paragraph>
                        Завершить прогон <b>{currentProcess.process_name}</b>?
                    </Typography.Paragraph>
                    <Typography.Paragraph>Завершенный прогон невозможно будет продолжить</Typography.Paragraph>
                </div>
            ),
            onOk: async () => {
                await dispatch(killSimulationProcess(currentProcess.id)).unwrap();
            },
            onCancel: () => {},
            okText: "Завершить",
            cancelText: "Отмена",
        });
    };

    const controlItem = {
        label: (
            <Row wrap={false}>
                <Col flex="auto">Конфигурирование параметров ИМ</Col>
                <Col>
                    <Space>
                        <Typography.Text>Статус:</Typography.Text>
                        {statusTag}
                        <Button
                            onClick={onStartClick}
                            disabled={[PROCES_STATUSES.RUNNING, PROCES_STATUSES.KILLED, PROCES_STATUSES.ERROR].includes(currentProcess.status)}
                            size="small"
                            type="primary"
                            icon={<PlayCircleOutlined />}
                            loading={startLoading}
                        >
                            Запустить/продолжить
                        </Button>
                        <Button
                            onClick={onPauseClick}
                            disabled={[PROCES_STATUSES.KILLED, PROCES_STATUSES.ERROR, PROCES_STATUSES.PAUSED].includes(currentProcess.status)}
                            size="small"
                            icon={<PauseCircleOutlined />}
                            loading={pauseLoading}
                        >
                            Пауза
                        </Button>
                        <Button onClick={onKillClick} disabled={[PROCES_STATUSES.KILLED].includes(currentProcess.status)} size="small" icon={<CloseCircleOutlined />} danger>
                            Завершить
                        </Button>
                    </Space>
                </Col>
            </Row>
        ),
        key: "config",
        children: <ModelParamsConfigForm initialValues={{ ticks: 10, delay: 200 }} form={form} />,
    };

    return (
        <div>
            <Row wrap={false}>
                <Col flex="auto">
                    <Typography.Title style={{ margin: 0 }} level={5}>
                        Прогон «{currentProcess.name}»
                    </Typography.Title>
                </Col>
                <Col>
                    <Link to={`/evaluate/runner/${currentProcess.file_id}`}>
                        <Button type="link" icon={<BackwardOutlined />}>
                            Вернуться к выбору прогона
                        </Button>
                    </Link>
                </Col>
            </Row>
            <div style={{ marginTop: 10 }}>
                <Collapse defaultActiveKey="config" size="small" items={[controlItem]} />
            </div>
            <Info />
            {contextHolder}
        </div>
    );
};
