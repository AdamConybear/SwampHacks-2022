import React from 'react';
import { default as MaterialButton } from '@mui/material/Button';

export default function Button ({ event_trigger, variant, disabled, text })
{
    return (
        <MaterialButton
        onClick={event_trigger}
        variant={variant}
        disabled={disabled}
        >
            {text}
        </MaterialButton>
    );
}