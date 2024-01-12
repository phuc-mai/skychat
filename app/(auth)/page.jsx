import UserForm from "@components/UserForm";

const Login = () => {
  const data = {
    email: "",
    password: "",
  }

  return (
    <UserForm type="login" data={data} />
  );
};

export default Login;
