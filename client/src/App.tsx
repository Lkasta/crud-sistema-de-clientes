import { Routes, Route } from "react-router-dom"
import Layout from "./components/Layout"
import CustomerList from "./pages/CustomerList"
import CustomerForm from "./pages/CustomerForm"
import CustomerEdit from "./pages/CustomerEdit"

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<CustomerList />} />
        <Route path="/customers" element={<CustomerList />} />
        <Route path="/customers/new" element={<CustomerForm />} />
        <Route path="/customers/edit/:id" element={<CustomerEdit />} />
      </Routes>
    </Layout>
  )
}

export default App
