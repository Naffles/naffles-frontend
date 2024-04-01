import Button from "./button";

const meta = {
  title: "Components/Button",
  component: Button,
  argTypes: {
    size: {
      options: ["sx", "sm", "base", "lg", "xl"],
      control: { type: "radio" },
    },
    variant: {
      options: ["primary", "secondary", "tertiary", "special", "outline"],
      control: { type: "radio" },
    },
  },
};

export default meta;

export const Basic = {
  args: {
    size: "base",
    variant: "primary",
    label: "Text",
    children: "Button text",
  },
};
