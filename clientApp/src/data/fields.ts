import { useFormInput } from "./utils";

export const useSignupFields = () => {

    return [
        {
            id: "fname",
            label: "First Name",
            required: true,
            input: {
                
                props: {
                    
                    type: "text",
                    placeholder: "Joe"
                },
                state: useFormInput("")
            }
        },
        {
            id: "sname",
            label: "Last Name",
            required: true,
            input: {
                
                props: {
                    
                    type: "text",
                    placeholder: "Bloggs"
                },
                state: useFormInput("")
            }
        },
        {
            id: "phone",
            label: "Phone",
            required: true,
            input: {
                
                props: {
                    
                    type: "text",
                    placeholder: "123456789"
                },
                state: useFormInput("")
            }
        },
        {
            id: "email",
            label: "Email",
            required: true,
            input: {
                
                props: {
                    
                    type: "email",
                    placeholder: "joe@bloggs.com"
                },
                state: useFormInput("")
            }
        },
        {
            id: "password",
            label: "Password",
            required: true,
            input: {
                
                props: {
                    
                    type: "password",
                    placeholder: "*********"
                },
                state: useFormInput("")
            }
        }
    ];
}

export const useLoginFields = () => {

    return [

        {
            id: "email",
            label: "Email",
            required: true,
            input: {
                
                props: {
                    type: "email",
                    placeholder: "joe@bloggs.com"
                },
                state: useFormInput("")
            }
        },
        {
            id: "password",
            label: "Password",
            required: true,
            input: {
                
                props: {
                    type: "password",
                    placeholder: "*******"
                },
                state: useFormInput("")
            }
        }
    ];
}