import {Navigate, Route, Routes} from 'react-router-dom';
import {UpdateCompanyPassword} from '@/pages/onboarding/company/update-password';
import {UpdateCompanyProfile} from '@/pages/onboarding/company/update-profile';
import {UpdateMemberPassword} from '@/pages/onboarding/members/update-password';
import {UpdateMemberProfile} from '@/pages/onboarding/members/update-profile';
import {AcceptInvite} from '@/pages/onboarding/members/accept-invite';
import {ActivateAccount} from '@/pages/onboarding/company/activate-account';
import {ForgotPassword} from '@/pages/auth/forgot-password';
import {Login} from '@/pages/auth/login';
import {ResetPassword} from '@/pages/auth/reset-password';
import useAuth from '@/store/useAuth';
import {useEffect} from 'react';
import {ROUTES} from './routes';
import EmployeeDirectory from '@/pages/people/employee-directory/employee-directory';
import EmployeeDetails from '@/pages/people/employee-directory/employee-details/employee-details';
import {EmployeePersonalDetails} from '@/pages/people/employee-directory/employee-details/personal';
import {EmployeeWorkDetails} from '@/pages/people/employee-directory/employee-details/work';
import {EmployeeCompensation} from '@/pages/people/employee-directory/employee-details/compensation';
import {EmployeeDocuments} from '@/pages/people/employee-directory/employee-details/documents';
import {EmployeeDevices} from '@/pages/people/employee-directory/employee-details/devices/devices';
import {EmployeeApps} from '@/pages/people/employee-directory/employee-details/apps';
import {EmployeePayslip} from '@/pages/people/employee-directory/employee-details/payslip';
import {DeviceDetails} from '@/pages/people/employee-directory/employee-details/devices/details';
import {Documents} from '@/pages/documents';
import {CompanyDocuments} from '@/pages/documents/company-documents';
import {Templates} from '@/pages/documents/templates';
import {UploadTemplates} from '@/pages/documents/upload-template';
import {EditDocument} from '@/pages/documents/edit-document';
import {EditTemplate} from '@/pages/documents/edit-template';
import {useFetchBusiness} from '@/hooks/useQueries';
import {NotFound} from '@/pages/not-found';
import DataManager from '@/pages/data-manager';
import {DataManagerObjects} from '@/pages/data-manager/objects';
import DataManagerPermissions from '@/pages/data-manager/permissions';
import DataObject from '@/pages/data-manager/object';
import ProtectedRoutes from './ProtectedRoutes';
// import ProtectedRoutes from './ProtectedRoutes';

const AppRouter = () => {
  const {user} = useAuth();
  const {refetch: refetchBusiness} = useFetchBusiness();

  useEffect(() => {
    if (user) {
      refetchBusiness();
    }
  }, [refetchBusiness, user]);

  return (
    <Routes>
      <Route
        path="/"
        element={<Navigate to={ROUTES.employeeDirectory} replace />}
      />
      <Route path="*" element={<NotFound />} />

      {/* Auth routes */}
      <Route path={ROUTES.login} element={<Login />} />
      <Route path={ROUTES.forgotPassword} element={<ForgotPassword />} />
      <Route path={`${ROUTES.resetPassword}`} element={<ResetPassword />} />

      {/* Onboarding routes */}
      <Route path={`${ROUTES.activateAccount}`} element={<ActivateAccount />} />
      <Route
        path={ROUTES.updateCompanyPassword}
        element={<UpdateCompanyPassword />}
      />
      <Route
        path={ROUTES.updateCompanyProfile}
        element={<UpdateCompanyProfile />}
      />
      <Route path={`${ROUTES.acceptInvite}`} element={<AcceptInvite />} />
      <Route
        path={ROUTES.updateMemberPassword}
        element={<UpdateMemberPassword />}
      />
      <Route
        path={ROUTES.updateMemberProfile}
        element={<UpdateMemberProfile />}
      />

      <Route element={<ProtectedRoutes />}>
        {/* People routes */}
        <Route
          path={ROUTES.employeeDirectory}
          element={<EmployeeDirectory />}
        />
        <Route
          path={ROUTES.people}
          element={<Navigate to={ROUTES.employeeDirectory} replace />}
        />

        <Route path={ROUTES.employeeDetails} element={<EmployeeDetails />}>
          <Route
            path={ROUTES.employeePersonalDetails}
            element={<EmployeePersonalDetails />}
          />
          <Route
            path={ROUTES.employeeWorkDetails}
            element={<EmployeeWorkDetails />}
          />
          <Route
            path={ROUTES.employeeCompensation}
            element={<EmployeeCompensation />}
          />
          <Route
            path={ROUTES.employeeDocuments}
            element={<EmployeeDocuments />}
          />
          <Route path={ROUTES.employeeDevices} element={<EmployeeDevices />} />
          <Route path={ROUTES.employeeApps} element={<EmployeeApps />} />
          <Route path={ROUTES.employeePayslip} element={<EmployeePayslip />} />
        </Route>
        <Route
          path={ROUTES.employeeDeviceDetails}
          element={<DeviceDetails />}
        />

        {/* Document routes */}
        <Route path={ROUTES.documents} element={<Documents />}>
          <Route
            path=""
            element={<Navigate to={ROUTES.companyDocuments} replace />}
          />
          <Route
            path={ROUTES.companyDocuments}
            element={<CompanyDocuments />}
          />
          <Route path={ROUTES.documentTemplates} element={<Templates />} />
        </Route>
        <Route
          path={ROUTES.uploadDocumentTemplate}
          element={<UploadTemplates />}
        />
        <Route path={ROUTES.editDocument} element={<EditDocument />} />
        <Route path={ROUTES.editDocumentTemplate} element={<EditTemplate />} />

        <Route path={ROUTES.dataManager} element={<DataManager />}>
          <Route
            path=""
            element={<Navigate to={ROUTES.dataManagerObjects} replace />}
          />
          <Route
            path={ROUTES.dataManagerObjects}
            element={<DataManagerObjects />}
          />
          <Route
            path={ROUTES.dataManagerPermissions}
            element={<DataManagerPermissions />}
          />
        </Route>
        <Route path={ROUTES.dataManagerAddField} element={<DataObject />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;
