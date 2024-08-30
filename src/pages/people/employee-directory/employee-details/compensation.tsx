import {useOutletContext} from 'react-router-dom';
import {Loader} from 'lucide-react';
import {EditCompensationInfo} from '@/components/modules/employee/edit-compensation-info';
import {
  Detail,
  EmployeeDetailsCard,
} from '@/components/modules/employee/employee-details-card';
import {IEmployee} from '@/types/members';

export const EmployeeCompensation = () => {
  const {employee} = useOutletContext() as {
    employee: IEmployee;
  };

  const employeeCompensationDetails = employee?.compensations;

  const compensationInfo: Detail[] = [
    {
      label: 'Salary Grade',
      value: employeeCompensationDetails?.salary_grade,
    },
    {
      label: 'Base Salary',
      value: employeeCompensationDetails?.base_salary,
    },
    {
      label: 'Net Salary',
      value: employeeCompensationDetails?.net_salary,
    },
    {
      label: 'Bonus',
      value: employeeCompensationDetails?.bonus,
    },
    {
      label: 'Commission',
      value: employeeCompensationDetails?.commission,
    },
    {
      label: 'Pay Frequency',
      value: employeeCompensationDetails?.pay_frequency,
    },
    {
      label: 'Bank Name',
      value: employeeCompensationDetails?.bank_name,
    },
    {
      label: 'Account Number',
      value: employeeCompensationDetails?.account_number,
    },
    {
      label: 'Account Name',
      value: employeeCompensationDetails?.bank_account_name,
    },
    {
      label: 'Tax Amount',
      value: employeeCompensationDetails?.tax_amount,
    },
    {
      label: 'Swift code',
      value: employeeCompensationDetails?.swift_code,
    },
    {
      label: 'Sort code',
      value: employeeCompensationDetails?.sort_code,
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
        title="Compensation Information"
        details={compensationInfo}
        edit={
          <EditCompensationInfo
            employeeCompensationDetails={employeeCompensationDetails}
          />
        }
      />
    </div>
  );
};
