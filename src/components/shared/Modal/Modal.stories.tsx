import { LoginForm } from "../AuthForms/LoginForm";
import { RegistrationForm } from "../AuthForms/RegistrationForm";
import { Modal } from "./Modal";

const meta = {
  title: "Components/Modal",
  component: Modal,
};

export default meta;

export const Basic = {
  args: {
    show: true,
    title: "Modal",
    children: "test",
  },
};

export const LoginModal = {
  args: {
    show: true,
    title: "Login",
    children: <LoginForm handleLogin={() => {}} />,
  },
};

export const RegistrationModal = {
  args: {
    show: true,
    title: "Register",
    children: <RegistrationForm />,
  },
};
