import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from '@/utils/constants/routes';
import { PageLoader } from '@/components/ui/Loader';
import { AuthLayout } from '@/components/layout/AuthLayout';
import { OnboardingLayout } from '@/components/layout/OnboardingLayout';
import { AppLayout } from '@/components/layout/AppLayout';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { OnboardingGuard } from '@/components/common/OnboardingGuard';

const Login = lazy(() => import('@/pages/Login/Login'));
const CreateAccount = lazy(() => import('@/pages/CreateAccount/CreateAccount'));
const ForgotPassword = lazy(() => import('@/pages/ForgotPassword/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/ResetPassword/ResetPassword'));
const Welcome = lazy(() => import('@/pages/Welcome/Welcome'));
const CareRecipient = lazy(() => import('@/pages/CareRecipient/CareRecipient'));
const Caregiver = lazy(() => import('@/pages/Caregiver/Caregiver'));
const Dashboard = lazy(() => import('@/pages/Dashboard/Dashboard'));
const Notes = lazy(() => import('@/pages/Notes/Notes'));
const Profile = lazy(() => import('@/pages/Profile/Profile'));
const EditProfile = lazy(() => import('@/pages/Profile/EditProfile'));
const NotFound = lazy(() => import('@/pages/NotFound/NotFound'));

export default function AppRoutes() {
  return (
    <OnboardingGuard>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.HOME} element={<Login />} />
            <Route path={ROUTES.CREATE_ACCOUNT} element={<CreateAccount />} />
            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <OnboardingLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.WELCOME} element={<Welcome />} />
            <Route path={ROUTES.CARE_RECIPIENT} element={<CareRecipient />} />
            <Route path={ROUTES.CAREGIVER} element={<Caregiver />} />
          </Route>

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
            <Route path={ROUTES.NOTES} element={<Notes />} />
            <Route path={ROUTES.PROFILE} element={<Profile />} />
            <Route path={ROUTES.PROFILE_EDIT} element={<EditProfile />} />
          </Route>

          <Route path="/login" element={<Navigate to={ROUTES.HOME} replace />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </OnboardingGuard>
  );
}
