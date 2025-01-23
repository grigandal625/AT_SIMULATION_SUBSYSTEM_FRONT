import { Tabs, message, Alert, Button, Spin, Tag } from "antd";
import { useState } from "react";
import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { WS_URL } from "../../../../GLOBAL";
import { addTicks } from "../../../../redux/stores/simulationProcessesStore";
import ResourcesState from "./ResourcesState";

export default () => {
    const simulationProcesses = useSelector((state) => state.simulationProcesses);
    const params = useParams();
    const dispatch = useDispatch();
    const currentProcess = simulationProcesses.data.find((p) => p.id === params.processId);

    const [disconnected, setDisconnected] = useState(false);
    const [connected, setConnected] = useState(false);

    const wsRef = useRef();
    const reconnectCountRef = useRef(0);

    const connect = () => {
        setDisconnected(false);
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        if (currentProcess) {
            const ws = new WebSocket(`${WS_URL}/api/processor/ws?process_id=${params.processId}&token=${window.sessionStorage.getItem("token")}`);
            wsRef.current = ws;

            ws.onopen = () => {
                message.success("Соединение с процессом прогона установлено");
                setConnected(true);
                reconnectCountRef.current = 0;
            };

            ws.onmessage = (e) => {
                if (currentProcess) {
                    const ticks = JSON.parse(e.data);
                    dispatch(addTicks({ ...currentProcess, ticks }));
                }
            };

            ws.onclose = () => {
                setConnected(false);
                reconnectCountRef.current += 1;
                if (reconnectCountRef.current < 5) {
                    message.warning(`Соединение с процессом прогона разорвано. Попытка переподключения: ${reconnectCountRef.current}/5 ...`);
                    setTimeout(connect, 1000 * reconnectCountRef.current);
                } else {
                    message.error("Не удалось установить соединение с процессом прогона");
                    setDisconnected(true);
                }
            };
        }
    };

    useEffect(() => {
        connect();
    }, [params.processId]);

    const ticks = currentProcess.ticks || [];

    const tabItems = [
        {
            key: "params",
            label: "Состояния параметров ресурсов (текущий такт)",
            children: <ResourcesState ticks={ticks} />,
        },
        {
            key: "paramsLog",
            label: "Журнал изменения параметров ресурсов",
            children: <pre>{JSON.stringify(ticks, null, 4)}</pre>,
        },
        {
            key: "log",
            label: "Журнал операций",
            children: <pre>{JSON.stringify(ticks, null, 4)}</pre>,
        },
    ];

    const disconnectedAlert = disconnected ? (
        <Alert
            message="Соединение с процессом прогона не установлено"
            description="Не удалось установить соединение с процессом прогона за максимальное количество попыток"
            action={
                <Button size="small" onClick={connect} danger>
                    Попытка переподключения
                </Button>
            }
            type="error"
            showIcon
        />
    ) : !connected ? (
        <Alert
            type="info"
            message="Установка соединения с процессом прогона"
            description="Состояние парметров ресурсов и журнал операций будут обновляться в реальном времени после установки соединения"
            action={<Spin size="small" />}
            showIcon
        />
    ) : (
        <></>
    );

    return (
        <>
            <div style={{ marginTop: 10, marginBottom: 10 }}>{disconnectedAlert}</div>
            <Tabs items={tabItems} tabBarExtraContent={<Tag color="blue">Текущий такт: {currentProcess?.current_tick || 0}</Tag>} />
        </>
    );
};
