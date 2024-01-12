import UserForm from "@components/UserForm";

const Register = () => {
  const data = {
    username: "",
    email: "",
    password: "",
  };

  return (
    <UserForm type="register" data={data} />
  );
};

export default Register;
