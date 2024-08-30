export const ROUTES = {
  // Onboarding
  activateAccount: '/onboarding/company/activate-account/:email',
  updateCompanyPassword: '/onboarding/company/update-password',
  updateCompanyProfile: '/onboarding/company/update-profile',
  acceptInvite: '/onboarding/member/accept-invite',
  updateMemberPassword: '/onboarding/member/update-password',
  updateMemberProfile: '/onboarding/member/update-profile',

  // Auth
  login: '/auth/login',
  forgotPassword: '/auth/forgot-password/:token',
  resetPassword: '/auth/reset-password/:hash_id',

  // People
  people: '/people',
  employeeDirectory: '/people/employee-directory',
  employeeDetails: '/people/employee-directory/employee-details/:employeeId',
  employeePersonalDetails:
    '/people/employee-directory/employee-details/:employeeId/personal',
  employeeWorkDetails:
    '/people/employee-directory/employee-details/:employeeId/work',
  employeeCompensation:
    '/people/employee-directory/employee-details/:employeeId/compensation',
  employeeDocuments:
    '/people/employee-directory/employee-details/:employeeId/documents',
  employeeDevices:
    '/people/employee-directory/employee-details/:employeeId/devices',
  employeeDeviceDetails:
    '/people/employee-directory/employee-details/:employeeId/devices/:deviceId',
  employeeApps: '/people/employee-directory/employee-details/:employeeId/app',
  employeePayslip:
    '/people/employee-directory/employee-details/:employeeId/payslip',

  // Documents
  documents: '/documents',
  companyDocuments: '/documents/company-documents',
  documentTemplates: '/documents/templates',
  uploadDocumentTemplate: '/documents/upload-template/:docId',
  editDocumentTemplate: '/documents/templates/edit/:templateId',
  editDocument: '/documents/edit-document/:docId',

  // Data Manager
  dataManager: '/data-manager',
  dataManagerObjects: '/data-manager/objects',
  dataManagerPermissions: '/data-manager/permissions',
  dataManagerAddField: '/data-manager/objects/:objectId',
};
