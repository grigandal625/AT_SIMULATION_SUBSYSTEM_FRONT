export const requiredRule = {
    required: true,
    message: "Заполните",
};

export const lengthRequiredRule = {
    validator: (_, value) => (value && value.length ? Promise.resolve() : Promise.reject(new Error("Укажите элементы"))),
};

export const lengthMinRequiredRule = (min) => ({
    validator: (_, value) => (value && value.length >= min ? Promise.resolve() : Promise.reject(new Error(`Минимум ${min} элемента`))),
});

export const itemLengthRequiredRule = (form, name) => ({
    validator: () => (form.getFieldValue(name) && form.getFieldValue(name).length ? Promise.resolve() : Promise.reject(new Error("Укажите элементы"))),
});
