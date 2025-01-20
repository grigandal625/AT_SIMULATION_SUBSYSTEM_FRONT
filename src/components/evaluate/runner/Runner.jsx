import { useForm } from "antd/es/form/Form";
import SelectTranslatedModelAndProcessForm from "./forms/SelectTranslatedModelAndProcessForm";
import { Button, message } from "antd";
import { ForwardOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { createSimulationProcess } from "../../../redux/stores/simulationProcessesStore";

export default () => {
    const [form] = useForm();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const onNextClick = async () => {
        try {
            await form.validateFields();
        } catch (e) {
            console.error(e);
            return;
        }
        const data = form.getFieldsValue();

        if (data._sm_variant === 2) {
            navigate(`/evaluate/runner/process/${data.id}`);
        } else {
            try {
                const newProcess = await dispatch(createSimulationProcess(data)).unwrap();
                navigate(`/evaluate/runner/process/${newProcess.id}`);
            } catch (e) {
                console.error(e);
                message.error(e.error_message);
            }
        }
    };

    return (
        <div>
            <SelectTranslatedModelAndProcessForm form={form} layout="vertical" />
            <Button type="primary" onClick={onNextClick} icon={<ForwardOutlined />}>
                Далее
            </Button>
        </div>
    );
};
