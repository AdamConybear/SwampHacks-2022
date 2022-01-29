import React from 'react';
import { default as MaterialTextField } from '@mui/material/TextField'

export default function TextField ({ value, set_value_function, id, label, disabled })
{
    return  (
        <MaterialTextField
        id={id}
        label={label}
        variant={"standard"}
        onChange={(new_text) => { set_value_function(new_text.target.value) }}
        value={value}
        disabled={disabled}
        />
    );
}