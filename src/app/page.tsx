import 'react-toastify/dist/ReactToastify.css';
import {ToastContainer} from 'react-toastify';
import Login from "@/components/login";

export default function Home() {
  return (
    <>
    <Login/>
    <ToastContainer />
    </>
  );
}
