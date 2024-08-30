import {useOutletContext} from 'react-router-dom';
import {Loader} from 'lucide-react';
import {EditContactInfo} from '@/components/modules/employee/edit-contact-info';
import {EditPersonalInfo} from '@/components/modules/employee/edit-personal-info';
import {
  Detail,
  EmployeeDetailsCard,
} from '@/components/modules/employee/employee-details-card';
import {IEmployee} from '@/types/members';

export const EmployeePersonalDetails = () => {
  const {employee} = useOutletContext() as {
    employee: IEmployee;
  };

  const employeePersonalDetails = employee?.personal_info;
  const employeeContactDetails = employee?.contact_info;

  const personalInfo: Detail[] = [
    {
      label: 'Employee ID',
      value: employeePersonalDetails?.employee_id,
      canCopy: true,
    },
    {
      label: 'First name',
      value: employeePersonalDetails?.first_name,
    },
    {
      label: 'Last Name',
      value: employeePersonalDetails?.last_name,
    },
    {
      label: 'Middle Name',
      value: employeePersonalDetails?.middle_name,
    },
    {
      label: 'Date of Birth',
      value: employeePersonalDetails?.dob,
    },
    {
      label: 'Gender',
      value: employeePersonalDetails?.gender,
      capitalize: true,
    },
    {
      label: 'Marital Status',
      value: employeePersonalDetails?.marital_status,
    },
    {
      label: 'Nationality',
      value: employeePersonalDetails?.nationality,
    },
  ];

  const contactInfo: Detail[] = [
    {
      label: 'Email Address',
      value: employeeContactDetails?.email,
      canCopy: true,
    },
    {
      label: 'Phone Number',
      value: employeeContactDetails?.phone_number,
    },
    {
      label: 'Emergency Contact Name',
      value: employeeContactDetails?.emergency_contact_name,
    },
    {
      label: 'Emergency Contact Relationship',
      value: employeeContactDetails?.emergency_contact_relationship,
    },
    {
      label: 'Emergency Contact Phone Number',
      value: employeeContactDetails?.emergency_contact_phone_number,
    },
    {
      label: 'Current Address',
      value: employeeContactDetails?.current_address,
    },
    {
      label: 'Permanent Address',
      value: employeeContactDetails?.permanent_address,
    },
  ];

  if (!employee) {
    return (
      <div className="grow">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="grow flex flex-col gap-8">
      <EmployeeDetailsCard
        title="Personal Information"
        details={personalInfo}
        edit={
          <EditPersonalInfo employeePersonalDetails={employeePersonalDetails} />
        }
      />
      <EmployeeDetailsCard
        title="Contact Information"
        details={contactInfo}
        edit={
          <EditContactInfo employeeContactDetails={employeeContactDetails} />
        }
      />
    </div>
  );
};
