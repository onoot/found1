// hoc/withLayout.js
import Layout from '../components/Layout'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const withLayout = (WrappedComponent) => {
    return (props) => (
        <Layout>
            <ToastContainer />
                <WrappedComponent {...props} />
        </Layout>
    )
}

export default withLayout
