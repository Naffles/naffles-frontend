import React from "react";
import { useForm, FormProvider } from "react-hook-form";

type FormContextProps = {
  onSubmit: (args: any) => any;
  className?: string;
};

export const FormContext = (
  props: React.PropsWithChildren<FormContextProps>
) => {
  const { onSubmit, children, className } = props;
  const methods = useForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <div className={className}>{children}</div>
      </form>
    </FormProvider>
  );
};
