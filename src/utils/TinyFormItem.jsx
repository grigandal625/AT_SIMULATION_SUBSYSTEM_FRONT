import { Form } from "antd";
import styled from "styled-components";

const NoMGFormItem = styled(Form.Item)`
    margin-bottom: 0px;
    position: relative;
`;

const TinyFormItem = styled(NoMGFormItem)`
    .ant-form-item-explain {
        position: absolute;
        top: 100%;
        width: auto;
        display: inline;
        vertical-align: top;
        transform: translateY(-50%);
        left: 5px;
    }

    .ant-form-item-explain > div {
        position: relative;
        display: inline;
        vertical-align: top;
        background: white;
        padding: 0px 2px;
    }
`;

export default TinyFormItem;
