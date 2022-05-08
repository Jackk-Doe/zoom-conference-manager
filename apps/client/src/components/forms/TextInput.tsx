import {
  Controller,
  Control,
  RegisterOptions,
  Path,
  FieldError,
} from 'react-hook-form';
import { TextField } from '@mui/material';

interface Props<T> {
  name: Path<T>;
  label: string;
  control: Control<T>;
  error: FieldError | void;
  rules?: RegisterOptions;
}

// eslint-disable-next-line react/function-component-definition
function TextInput<T>({ name, label, control, rules, error }: Props<T>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <TextField
          {...field}
          label={label}
          required={!!rules?.required}
          error={!!error}
          helperText={error?.message}
        />
      )}
    />
  );
}

export default TextInput;
