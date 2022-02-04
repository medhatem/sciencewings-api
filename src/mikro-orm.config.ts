import { OrganizationSocial } from './server/modules/organisations/models/OraganizationSocial';
import { OrganizationContact } from './server/modules/organisations/models/OrganizationContact';
import { OrganizationLabel } from './server/modules/organisations/models/OrganizationLabel';
import { WorkLocation } from './server/modules/hr/models/WorkLocation';
import { PlanWizard } from './server/modules/hr/models/PlanWizard';
import { PlanActivityType } from './server/modules/hr/models/PlanActivityType';
import { Plan } from './server/modules/hr/models/Plan';
import { PayrollStructureType } from './server/modules/hr/models/PayrollStructureType';
import { Job } from './server/modules/hr/models/Job';
import { EmployeeCategory } from './server/modules/hr/models/EmployeeCategory';
import { Employee } from './server/modules/hr/models/Employee';
import { DepartureWizard } from './server/modules/hr/models/DepartureWizard';
import { DepartureReason } from './server/modules/hr/models/DepartureReason';
import { Department } from './server/modules/hr/models/Department';
import { ContractType } from './server/modules/hr/models/ContractType';
import { Contract } from './server/modules/hr/models/Contract';
import { ResPartnerIndustry } from './server/modules/organisations/models/ResPartnerIndustry';
import { ResPartnerCategory } from './server/modules/organisations/models/ResPartnerCategory';
import { ResPartnerBank } from './server/modules/organisations/models/ResPartnerBank';
import { ResPartner } from './server/modules/organisations/models/ResPartner';
import { ResCurrencyRate } from './server/modules/organisations/models/ResCurrencyRate';
import { ResCurrency } from './server/modules/organisations/models/ResCurrency';
import { ResCountryState } from './server/modules/organisations/models/ResCountryState';
import { ResCountryGroup } from './server/modules/organisations/models/ResCountryGroup';
import { ResCountry } from './server/modules/organisations/models/ResCountry';
import { ResConfigSettings } from './server/modules/organisations/models/ResConfigSettings';
import { ResBank } from './server/modules/organisations/models/ResBank';
import { Organization } from './server/modules/organisations/models/Organization';
import { ResourceResource } from './server/modules/resources/models/ResourceResource';
import { ResourceCalendarLeaves } from './server/modules/resources/models/ResourceCalendarLeaves';
import { ResourceCalendarAttendance } from './server/modules/resources/models/ResourceCalendarAttendance';
import { ResourceCalendar } from './server/modules/resources/models/ResourceCalendar';
import { Resource } from './server/modules/resources/models/Resource';
import { ResGroupsUsersRel } from './server/modules/users/models/ResGroupsUsersRel';
import { ResGroupsReportRel } from './server/modules/users/models/ResGroupsReportRel';
import { ResGroupsImpliedRel } from './server/modules/users/models/ResGroupsImpliedRel';
import { ResGroups } from './server/modules/users/models/ResGroups';
import { User } from './server/modules/users/models/User';
import { ResPartnerTitle } from './server/modules/organisations/models/ResPartnerTitle';
export default {
  entities: [
    // users service
    User,
    ResGroups,
    ResGroupsImpliedRel,
    ResGroupsReportRel,
    ResGroupsUsersRel,
    // resources service
    Resource,
    ResourceCalendar,
    ResourceCalendarAttendance,
    ResourceCalendarLeaves,
    ResourceResource,
    // organization
    Organization,
    ResBank,
    ResConfigSettings,
    ResCountry,
    ResCountryGroup,
    ResCountryState,
    ResCurrency,
    ResCurrencyRate,
    ResPartner,
    ResPartnerBank,
    ResPartnerCategory,
    ResPartnerIndustry,
    ResPartnerTitle,
    OrganizationLabel,
    OrganizationContact,
    OrganizationSocial,
    // hr
    Contract,
    ContractType,
    Department,
    DepartureReason,
    DepartureWizard,
    Employee,
    EmployeeCategory,
    Job,
    PayrollStructureType,
    Plan,
    PlanActivityType,
    PlanWizard,
    WorkLocation,
  ],
  host: '0.0.0.0',
  port: 5433,
  dbName: 'local',
  user: 'localapi',
  password: 'localapi',
  type: 'postgresql',
};
