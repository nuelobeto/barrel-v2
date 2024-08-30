import {useOutletContext} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {Loader} from 'lucide-react';
import {EditEducationAndCertification} from '@/components/modules/employee/edit-education-and-certification';
import {EditEmploymentDetails} from '@/components/modules/employee/edit-employment-details';
import {EditWorkExperience} from '@/components/modules/employee/edit-work-experience';
import {
  Detail,
  EmployeeDetailsCard,
} from '@/components/modules/employee/employee-details-card';
import {
  useFetchBusiness,
  useFetchJobTitles,
  useFetchMembers,
} from '@/hooks/useQueries';
import {IEmployee, Manager, MemberType} from '@/types/members';
import businessServices from '@/services/businessServices';
import {JobTitleDepartment} from '@/types/business';

export const EmployeeWorkDetails = () => {
  const {employee} = useOutletContext() as {employee: IEmployee};
  const {data: business} = useFetchBusiness();
  const {data: members, status: membersStatus} = useFetchMembers({
    businessId: business?.data?.id as string,
  });

  const managerOptions: Manager[] =
    members?.data.result?.map((m: MemberType) => ({
      id: m.id,
      name: `${m.user.first_name} ${m.user.last_name}`,
      avatar: m.user.avatar,
    })) || [];

  const {data: jobTitlesRes, status: jobTitlesStatus} = useFetchJobTitles();

  const {data: departmentsRes, status: departmentsStatus} = useQuery({
    queryKey: ['departments'],
    queryFn: businessServices.getDepartments,
  });

  const jobTitlesData =
    jobTitlesRes?.data.map((jobTitle: JobTitleDepartment) => ({
      value: jobTitle.id,
      label: jobTitle.name,
    })) || [];

  const departmentsData =
    departmentsRes?.data.map((department: JobTitleDepartment) => ({
      value: department.id,
      label: department.name,
    })) || [];

  const employeeWorkExperience = employee?.work_exp;
  const employeeEmploymentDetails = employee?.employment_details;
  const employeeEducationCert = employee?.education_cert;

  const manager: Manager | undefined = managerOptions?.find(
    m => m.id === employeeEmploymentDetails?.manager,
  );

  const workExperience: Detail[] = [
    {
      label: 'Previous Job Titles',
      value: employeeWorkExperience?.previous_job_titles,
    },
    {
      label: 'Previous Employers',
      value: employeeWorkExperience?.previous_employers,
    },
    {
      label: 'Employment Dates',
      value: employeeWorkExperience?.employment_dates,
    },
    {
      label: 'Job Responsibilities',
      value: employeeWorkExperience?.job_responsibilities,
    },
  ];

  const employmentDetails: Detail[] = [
    {
      label: 'Job Title',
      value: employeeEmploymentDetails?.job_title,
    },
    {
      label: 'Department',
      value: employeeEmploymentDetails?.department,
    },
    {
      label: 'Employee Type',
      value: employeeEmploymentDetails?.employment_type,
      capitalize: true,
    },
    {
      label: 'Employee Status',
      value: employeeEmploymentDetails?.employee_status,
      capitalize: true,
    },
    {
      label: 'Date of Hire',
      value: employeeEmploymentDetails?.date_of_hire,
    },
    {
      label: 'Date of Termination',
      value: employeeEmploymentDetails?.date_of_termination,
    },
    {
      label: 'Manager',
      value: manager?.name ?? '-',
    },
    {
      label: 'Work Location',
      value: employeeEmploymentDetails?.work_location,
    },
  ];

  const educationAndCertification: Detail[] = [
    {
      label: 'Highest Degree Obtained',
      value: employeeEducationCert?.highest_degree_obtained,
    },
    {
      label: 'Field of Study',
      value: employeeEducationCert?.field_of_study,
    },
    {
      label: 'Institution Name',
      value: employeeEducationCert?.institution_name,
    },
    {
      label: 'Graduation Year',
      value: employeeEducationCert?.graduation_year,
    },
    {
      label: 'Certifications',
      value: employeeEducationCert?.certification,
    },
  ];

  const isPageReady =
    employee &&
    membersStatus === 'success' &&
    jobTitlesStatus === 'success' &&
    departmentsStatus === 'success';

  if (!isPageReady) {
    return (
      <div className="grow">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="grow flex flex-col gap-8">
      <EmployeeDetailsCard
        title="Work Experience"
        details={workExperience}
        edit={
          <EditWorkExperience employeeWorkExperience={employeeWorkExperience} />
        }
      />
      <EmployeeDetailsCard
        title="Employment Details"
        details={employmentDetails}
        edit={
          <EditEmploymentDetails
            employeeEmploymentDetails={employeeEmploymentDetails}
            jobTitlesData={jobTitlesData}
            departmentsData={departmentsData}
            managerOptions={managerOptions}
          />
        }
      />
      <EmployeeDetailsCard
        title="Education and Certifications"
        details={educationAndCertification}
        edit={
          <EditEducationAndCertification
            employeeEducationCert={employeeEducationCert}
          />
        }
      />
    </div>
  );
};
