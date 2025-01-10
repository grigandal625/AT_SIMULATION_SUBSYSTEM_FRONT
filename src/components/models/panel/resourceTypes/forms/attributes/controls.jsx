import { InputNumber, Select } from "antd";
import CheckboxItem from "../../../../../../utils/CheckboxItem";

export const getControlsTypesMapping = ({ enumOptions }) => ({
    INT: {
        component: InputNumber,
        getProps: () => ({
            placeholder: "Введите целочисленное значение",
            style: { width: "100%" },
            precision: 0,
            
        }),
    },
    FLOAT: {
        component: InputNumber,
        getProps: () => ({
            placeholder: "Введите числовое значение",
            style: { width: "100%" },
            
        }),
    },
    BOOL: {
        component: CheckboxItem,
        getProps: () => ({
            children: "Укажите логическое значение",
            style: { marginLeft: 7 },
        }),
    },
    ENUM: {
        component: Select,
        getProps: (i) => ({
            style: { width: "100%" },
            placeholder: "Выберите значение из набора",
            options: (enumOptions[i] || []).map((value) => ({ value })),
            
        }),
    },
});
