import { Result, Spin } from "antd";
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default () => {
    const [search, _] = useSearchParams();
    const navigate = useNavigate();
    const token = search.get("token");
    const remember = search.get("remember");

    useEffect(() => {
        if (remember) {
            window.localStorage.setItem("token", token);
        }
        window.sessionStorage.setItem("token", token);
        navigate("/");
    }, []);

    return <Result icon={<Spin />} title="Аутентификация..." />;
};
