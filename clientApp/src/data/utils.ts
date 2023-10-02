import { SetStateAction, useState } from "react";

export const useFormInput = (initialValue = "") => {

    const [ value, setValue ] = useState(initialValue);
    
    const handleChange = async (e: { currentTarget: { value: any; }; }) => {

        const tempValue = await e.currentTarget.value;
        setValue(tempValue);
    }

    return {

        value,
        reset: (newValue: SetStateAction<string>) => setValue(newValue),
        onIonChange: handleChange,
        onKeyUp: handleChange
    };
}

export const validateForm = (fields: { required: any; input: { state: { value: any; }; }; id: any; }[]) => {

	let errors: { id: any; message: string; }[] = [];

	fields.forEach((field: { required: any; input: { state: { value: any; }; }; id: any; }) => {

		if (field.required) {

			const fieldValue = field.input.state.value;

			if (fieldValue === "") {

				const error = {

					id: field.id,
					message: `Please check your ${ field.id }`,
				};

				errors.push(error);
			}
		}
	});

	return errors;
}