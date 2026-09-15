import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from './layouts/AppLayout'
import DataExtraction from './pages/DataExtraction'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Projects from './pages/Projects'
import QualityAssessment from './pages/QualityAssessment'
import QualityAssessmentDetail from './pages/QualityAssessmentDetail'
import Reports from './pages/Reports'
import Screening from './pages/Screening'
import ScreeningDetail from './pages/ScreeningDetail'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/projects" element={<Projects />} />
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/screening" element={<Screening />} />
        <Route path="/screening/:paperId" element={<ScreeningDetail />} />
        <Route path="/quality-assessment" element={<QualityAssessment />} />
        <Route path="/quality-assessment/:paperId" element={<QualityAssessmentDetail />} />
        <Route path="/data-extraction" element={<DataExtraction />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
    </Routes>
  )
}

export default App
