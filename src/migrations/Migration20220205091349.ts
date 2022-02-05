import { Migration } from '@mikro-orm/migrations';

export class Migration20220205091349 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "plan" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "active" boolean null);');

    this.addSql('create table "employee_category" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "color" int null);');
    this.addSql('alter table "employee_category" add constraint "hr_employee_category_name_uniq" unique ("name");');

    this.addSql('create table "departure_reason" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "sequence" int null, "name" varchar(255) not null);');

    this.addSql('create table "contract_type" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null);');

    this.addSql('create table "res_partner_title" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "shortcut" varchar(255) null);');

    this.addSql('create table "res_partner_industry" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) null, "full_name" varchar(255) null, "active" boolean null);');

    this.addSql('create table "res_partner_category" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "color" int null, "parent_id" int null, "active" boolean null, "parent_path" varchar(255) null);');
    this.addSql('create index "res_partner_category_parent_id_index" on "res_partner_category" ("parent_id");');
    this.addSql('create index "res_partner_category_parent_path_index" on "res_partner_category" ("parent_path");');

    this.addSql('create table "res_currency" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "symbol" varchar(255) not null, "full_name" varchar(255) null, "rounding" numeric null, "decimal_places" int null, "active" boolean null, "position" varchar(255) null, "currency_unit_label" varchar(255) null, "currency_subunit_label" varchar(255) null);');
    this.addSql('alter table "res_currency" add constraint "res_currency_unique_name" unique ("name");');

    this.addSql('create table "res_country_group" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null);');

    this.addSql('create table "res_country" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "code" varchar(2) null, "address_format" text null, "address_view_id" int null, "currency_id" int null, "phone_code" int null, "name_position" varchar(255) null, "vat_label" varchar(255) null, "state_required" boolean null, "zip_required" boolean null);');
    this.addSql('alter table "res_country" add constraint "res_country_name_uniq" unique ("name");');
    this.addSql('alter table "res_country" add constraint "res_country_code_uniq" unique ("code");');

    this.addSql('create table "res_country_state" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "country_id" int not null, "name" varchar(255) not null, "code" varchar(255) not null);');
    this.addSql('alter table "res_country_state" add constraint "res_country_state_country_id_unique" unique ("country_id");');
    this.addSql('alter table "res_country_state" add constraint "res_country_state_name_code_uniq" unique ("country_id", "code");');

    this.addSql('create table "res_bank" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "street" varchar(255) null, "street2" varchar(255) null, "zip" varchar(255) null, "city" varchar(255) null, "state" int null, "country" int null, "email" varchar(255) null, "phone" varchar(255) null, "active" boolean null, "bic" varchar(255) null);');
    this.addSql('create index "res_bank_bic_index" on "res_bank" ("bic");');

    this.addSql('create table "res_groups" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "comment" text null, "category_id" int null, "color" int null, "share" boolean null);');
    this.addSql('create index "res_groups_category_id_index" on "res_groups" ("category_id");');
    this.addSql('alter table "res_groups" add constraint "res_groups_name_uniq" unique ("name", "category_id");');

    this.addSql('create table "res_groups_implied_rel" ("gid" int not null, "hid" int not null);');
    this.addSql('create index "res_groups_implied_rel_hid_gid_idx" on "res_groups_implied_rel" ("gid", "hid");');
    this.addSql('alter table "res_groups_implied_rel" add constraint "res_groups_implied_rel_pkey" primary key ("gid", "hid");');

    this.addSql('create table "res_groups_report_rel" ("uid" int not null, "gid" int not null);');
    this.addSql('create index "res_groups_report_rel_gid_uid_idx" on "res_groups_report_rel" ("uid", "gid");');
    this.addSql('alter table "res_groups_report_rel" add constraint "res_groups_report_rel_pkey" primary key ("uid", "gid");');

    this.addSql('create table "user" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "firstname" varchar(255) not null, "lastname" varchar(255) not null, "email" varchar(255) not null, "keycloak_id" varchar(255) not null, "signature" text null, "action_id" int null, "share" boolean null);');
    this.addSql('alter table "user" add constraint "user_email_unique" unique ("email");');
    this.addSql('create index "user_keycloak_id_index" on "user" ("keycloak_id");');

    this.addSql('create table "res_groups_users_rel" ("gid" int not null, "uid" int not null);');
    this.addSql('create index "res_groups_users_rel_uid_gid_idx" on "res_groups_users_rel" ("gid", "uid");');
    this.addSql('alter table "res_groups_users_rel" add constraint "res_groups_users_rel_pkey" primary key ("gid", "uid");');

    this.addSql('create table "organization" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "email" varchar(255) not null, "phone" varchar(255) not null, "type" varchar(255) not null, "direction_id" int not null, "admin_contact_id" int not null, "parent_id" int null);');
    this.addSql('alter table "organization" add constraint "res_organisation_name_uniq" unique ("name");');
    this.addSql('alter table "organization" add constraint "organization_email_unique" unique ("email");');
    this.addSql('alter table "organization" add constraint "organization_phone_unique" unique ("phone");');
    this.addSql('alter table "organization" add constraint "organization_direction_id_unique" unique ("direction_id");');
    this.addSql('alter table "organization" add constraint "organization_admin_contact_id_unique" unique ("admin_contact_id");');

    this.addSql('create table "resource_calendar" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "active" boolean null, "organisation_id" int null, "hours_per_day" float8 null, "tz" varchar(255) not null, "two_weeks_calendar" boolean null);');

    this.addSql('create table "payroll_structure_type" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) null, "default_resource_calendar_id" int null, "country_id" int null);');

    this.addSql('create table "resource_resource" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "active" boolean null, "organisation_id" int null, "resource_type" varchar(255) not null, "user_id" int null, "time_efficiency" float8 not null, "calendar_id" int not null, "tz" varchar(255) not null);');

    this.addSql('create table "resource" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "resource_id" int not null, "organisation_id" int null, "resource_calendar_id" int null, "name" varchar(255) null);');
    this.addSql('create index "resource_test_resource_id_index" on "resource" ("resource_id");');
    this.addSql('create index "resource_test_organization_id_index" on "resource" ("organisation_id");');
    this.addSql('create index "resource_test_resource_calendar_id_index" on "resource" ("resource_calendar_id");');

    this.addSql('create table "resource_calendar_attendance" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "dayofweek" varchar(255) not null, "date_from" date null, "date_to" date null, "hour_from" float8 not null, "hour_to" float8 not null, "calendar_id" int not null, "day_period" varchar(255) not null, "resource_id" int null, "week_type" varchar(255) null, "display_type" varchar(255) null, "sequence" int null);');
    this.addSql('create index "resource_calendar_attendance_dayofweek_index" on "resource_calendar_attendance" ("dayofweek");');
    this.addSql('create index "resource_calendar_attendance_hour_from_index" on "resource_calendar_attendance" ("hour_from");');

    this.addSql('create table "resource_calendar_leaves" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) null, "organisation_id" int null, "calendar_id" int null, "date_from" timestamp not null, "date_to" timestamp not null, "resource_id" int null, "time_type" varchar(255) null);');
    this.addSql('create index "resource_calendar_leaves_calendar_id_index" on "resource_calendar_leaves" ("calendar_id");');
    this.addSql('create index "resource_calendar_leaves_resource_id_index" on "resource_calendar_leaves" ("resource_id");');

    this.addSql('create table "res_config_settings" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "organisation_id" int not null, "user_default_rights" boolean null, "external_email_server_default" boolean null, "module_google_calendar" boolean null, "module_microsoft_calendar" boolean null, "module_account_interorganisation_rules" boolean null, "module_hr_presence" boolean null, "module_hr_skills" boolean null, "hr_presence_control_login" boolean null, "hr_presence_control_email" boolean null, "hr_presence_control_ip" boolean null, "module_hr_attendance" boolean null, "hr_employee_self_edit" boolean null);');

    this.addSql('create table "res_currency_rate" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" date not null, "rate" numeric null, "currency_id" int not null, "organisation_id" int null);');
    this.addSql('create index "res_currency_rate_name_index" on "res_currency_rate" ("name");');
    this.addSql('alter table "res_currency_rate" add constraint "res_currency_rate_currency_id_unique" unique ("currency_id");');
    this.addSql('alter table "res_currency_rate" add constraint "res_currency_rate_organisation_id_unique" unique ("organisation_id");');
    this.addSql('alter table "res_currency_rate" add constraint "res_currency_rate_unique_name_per_day" unique ("name", "currency_id", "organisation_id");');

    this.addSql('create table "organization_label" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) not null, "organisation_id" int null);');
    this.addSql('alter table "organization_label" add constraint "organization_label_name_unique" unique ("name");');

    this.addSql('create table "organization_contact" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "type" varchar(255) not null, "value" varchar(255) not null, "organisation_id" int null);');

    this.addSql('create table "organization_social" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "type" varchar(255) not null, "link" varchar(255) not null, "organisation_id" int null);');

    this.addSql('create table "res_partner" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "name" varchar(255) null, "organisation_id" int null, "display_name" varchar(255) null, "date" date null, "title" int null, "parent_id" int null, "ref" varchar(255) null, "lang" varchar(255) null, "tz" varchar(255) null, "user_id" int null, "vat" varchar(255) null, "website" varchar(255) null, "comment" text null, "credit_limit" float8 null, "active" boolean null, "employee" boolean null, "function" varchar(255) null, "type" varchar(255) null, "street" varchar(255) null, "street2" varchar(255) null, "zip" varchar(255) null, "city" varchar(255) null, "state_id" int null, "country_id" int null, "partner_latitude" numeric null, "partner_longitude" numeric null, "email" varchar(255) null, "phone" varchar(255) null, "mobile" varchar(255) null, "isorganisation" boolean null, "industry_id" int null, "color" int null, "partner_share" boolean null, "commercial_partner_id" int null, "commercialorganisation_name" varchar(255) null, "organisation_name" varchar(255) null, "message_main_attachment_id" int null, "email_normalized" varchar(255) null, "message_bounce" int null, "signup_token" varchar(255) null, "signup_type" varchar(255) null, "signup_expiration" timestamp null, "partner_gid" int null, "additional_info" varchar(255) null, "phone_sanitized" varchar(255) null);');
    this.addSql('create index "res_partner_name_index" on "res_partner" ("name");');
    this.addSql('create index "res_partner_organisation_id_index" on "res_partner" ("organisation_id");');
    this.addSql('create index "res_partner_display_name_index" on "res_partner" ("display_name");');
    this.addSql('create index "res_partner_date_index" on "res_partner" ("date");');
    this.addSql('create index "res_partner_parent_id_index" on "res_partner" ("parent_id");');
    this.addSql('create index "res_partner_ref_index" on "res_partner" ("ref");');
    this.addSql('create index "res_partner_vat_index" on "res_partner" ("vat");');
    this.addSql('create index "res_partner_commercial_partner_id_index" on "res_partner" ("commercial_partner_id");');
    this.addSql('create index "res_partner_message_main_attachment_id_index" on "res_partner" ("message_main_attachment_id");');

    this.addSql('create table "res_partner_bank" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "active" boolean null, "acc_number" varchar(255) not null, "sanitized_acc_number" varchar(255) null, "acc_holder_name" varchar(255) null, "partner_id" int not null, "bank_id" int null, "sequence" int null, "currency_id" int null, "organisation_id" int null);');
    this.addSql('create index "res_partner_bank_partner_id_index" on "res_partner_bank" ("partner_id");');
    this.addSql('alter table "res_partner_bank" add constraint "res_partner_bank_organisation_id_unique" unique ("organisation_id");');
    this.addSql('alter table "res_partner_bank" add constraint "res_partner_bank_unique_number" unique ("sanitized_acc_number", "organisation_id");');

    this.addSql('create table "work_location" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "active" boolean null, "name" varchar(255) not null, "organisation_id" int not null, "address_id" int not null, "location_number" varchar(255) null);');

    this.addSql('create table "employee" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "resource_id" int not null, "organisation_id" int not null, "resource_calendar_id" int null, "message_main_attachment_id" int null, "name" varchar(255) null, "active" boolean null, "color" int null, "department_id" int null, "job_id" int null, "job_title" varchar(255) null, "address_id" int null, "work_phone" varchar(255) null, "mobile_phone" varchar(255) null, "work_email" varchar(255) null, "work_location_id" int null, "user_id" int null, "parent_id" int null, "coach_id" int null, "employee_type" varchar(255) not null, "address_home_id" int null, "country_id" int null, "gender" varchar(255) null, "marital" varchar(255) null, "spouse_complete_name" varchar(255) null, "spouse_birthdate" date null, "children" int null, "place_of_birth" varchar(255) null, "country_of_birth" int null, "birthday" date null, "ssnid" varchar(255) null, "sinid" varchar(255) null, "identification_id" varchar(255) null, "passport_id" varchar(255) null, "bank_account_id" int null, "permit_no" varchar(255) null, "visa_no" varchar(255) null, "visa_expire" date null, "work_permit_expiration_date" date null, "work_permit_scheduled_activity" boolean null, "additional_note" text null, "certificate" varchar(255) null, "study_field" varchar(255) null, "study_school" varchar(255) null, "emergency_contact" varchar(255) null, "emergency_phone" varchar(255) null, "km_home_work" int null, "notes" text null, "barcode" varchar(255) null, "pin" varchar(255) null, "departure_reason_id" int null, "departure_description" text null, "departure_date" date null, "vehicle" varchar(255) null, "contract_id" int null, "contract_warning" boolean null, "first_contract_date" date null);');
    this.addSql('create index "hr_employee_resource_id_index" on "employee" ("resource_id");');
    this.addSql('create index "hr_employee_organisation_id_index" on "employee" ("organisation_id");');
    this.addSql('alter table "employee" add constraint "employee_organisation_id_unique" unique ("organisation_id");');
    this.addSql('create index "hr_employee_resource_calendar_id_index" on "employee" ("resource_calendar_id");');
    this.addSql('create index "hr_employee_message_main_attachment_id_index" on "employee" ("message_main_attachment_id");');
    this.addSql('alter table "employee" add constraint "employee_user_id_unique" unique ("user_id");');
    this.addSql('alter table "employee" add constraint "hr_employee_barcode_uniq" unique ("barcode");');
    this.addSql('alter table "employee" add constraint "hr_employee_user_uniq" unique ("organisation_id", "user_id");');

    this.addSql('create table "department" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "message_main_attachment_id" int null, "name" varchar(255) not null, "complete_name" varchar(255) null, "active" boolean null, "organisation_id" int null, "parent_id" int null, "manager_id" int null, "note" text null, "color" int null);');
    this.addSql('create index "hr_department_message_main_attachment_id_index" on "department" ("message_main_attachment_id");');
    this.addSql('create index "hr_department_organisation_id_index" on "department" ("organisation_id");');
    this.addSql('create index "hr_department_parent_id_index" on "department" ("parent_id");');

    this.addSql('create table "job" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "message_main_attachment_id" int null, "name" varchar(255) not null, "sequence" int null, "expected_employees" int null, "no_of_employee" int null, "no_of_recruitment" int null, "no_of_hired_employee" int null, "description" text null, "requirements" text null, "department_id" int null, "organisation_id" int null, "state" varchar(255) not null);');
    this.addSql('create index "hr_job_message_main_attachment_id_index" on "job" ("message_main_attachment_id");');
    this.addSql('create index "hr_job_name_index" on "job" ("name");');
    this.addSql('alter table "job" add constraint "job_department_id_unique" unique ("department_id");');
    this.addSql('alter table "job" add constraint "job_organisation_id_unique" unique ("organisation_id");');
    this.addSql('alter table "job" add constraint "hr_job_name_organisation_uniq" unique ("name", "department_id", "organisation_id");');

    this.addSql('create table "contract" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "message_main_attachment_id" int null, "name" varchar(255) not null, "active" boolean null, "structure_type_id" int null, "employee_id" int null, "department_id" int null, "job_id" int null, "date_start" date not null, "date_end" date null, "trial_date_end" date null, "resource_calendar_id" int null, "wage" numeric not null, "notes" text null, "state" varchar(255) null, "organisation_id" int not null, "contract_type_id" int null, "kanban_state" varchar(255) null, "hr_responsible_id" int null);');
    this.addSql('create index "hr_contract_message_main_attachment_id_index" on "contract" ("message_main_attachment_id");');
    this.addSql('create index "hr_contract_date_start_index" on "contract" ("date_start");');
    this.addSql('create index "hr_contract_resource_calendar_id_index" on "contract" ("resource_calendar_id");');

    this.addSql('create table "departure_wizard" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "departure_reason_id" int not null, "departure_description" text null, "departure_date" date not null, "employee_id" int not null, "archive_private_address" boolean null, "set_date_end" boolean null);');

    this.addSql('create table "plan_wizard" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "plan_id" int null, "employee_id" int not null);');

    this.addSql('create table "plan_activity_type" ("id" serial primary key, "created_at" timestamp null, "updated_at" timestamp null, "activity_type_id" int null, "summary" varchar(255) null, "responsible_id" int null, "note" text null);');

    this.addSql('create table "organization_members" ("organization_id" int not null, "user_id" int not null);');
    this.addSql('alter table "organization_members" add constraint "organization_members_pkey" primary key ("organization_id", "user_id");');

    this.addSql('alter table "res_partner_category" add constraint "res_partner_category_parent_id_foreign" foreign key ("parent_id") references "res_partner_category" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "res_country" add constraint "res_country_currency_id_foreign" foreign key ("currency_id") references "res_currency" ("id") on update cascade on delete set null;');

    this.addSql('alter table "res_country_state" add constraint "res_country_state_country_id_foreign" foreign key ("country_id") references "res_country" ("id") on update cascade;');

    this.addSql('alter table "res_bank" add constraint "res_bank_state_foreign" foreign key ("state") references "res_country_state" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_bank" add constraint "res_bank_country_foreign" foreign key ("country") references "res_country" ("id") on update cascade on delete set null;');

    this.addSql('alter table "res_groups_implied_rel" add constraint "res_groups_implied_rel_gid_foreign" foreign key ("gid") references "res_groups" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "res_groups_implied_rel" add constraint "res_groups_implied_rel_hid_foreign" foreign key ("hid") references "res_groups" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "res_groups_report_rel" add constraint "res_groups_report_rel_gid_foreign" foreign key ("gid") references "res_groups" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "res_groups_users_rel" add constraint "res_groups_users_rel_gid_foreign" foreign key ("gid") references "res_groups" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "res_groups_users_rel" add constraint "res_groups_users_rel_uid_foreign" foreign key ("uid") references "user" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "organization" add constraint "organization_direction_id_foreign" foreign key ("direction_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "organization" add constraint "organization_admin_contact_id_foreign" foreign key ("admin_contact_id") references "user" ("id") on update cascade;');
    this.addSql('alter table "organization" add constraint "organization_parent_id_foreign" foreign key ("parent_id") references "organization" ("id") on update cascade on delete set null;');

    this.addSql('alter table "resource_calendar" add constraint "resource_calendar_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');

    this.addSql('alter table "payroll_structure_type" add constraint "payroll_structure_type_default_resource_calendar_id_foreign" foreign key ("default_resource_calendar_id") references "resource_calendar" ("id") on update cascade on delete set null;');
    this.addSql('alter table "payroll_structure_type" add constraint "payroll_structure_type_country_id_foreign" foreign key ("country_id") references "res_country" ("id") on update cascade on delete set null;');

    this.addSql('alter table "resource_resource" add constraint "resource_resource_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');
    this.addSql('alter table "resource_resource" add constraint "resource_resource_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "resource_resource" add constraint "resource_resource_calendar_id_foreign" foreign key ("calendar_id") references "resource_calendar" ("id") on update cascade;');

    this.addSql('alter table "resource" add constraint "resource_resource_id_foreign" foreign key ("resource_id") references "resource_resource" ("id") on update cascade;');
    this.addSql('alter table "resource" add constraint "resource_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');
    this.addSql('alter table "resource" add constraint "resource_resource_calendar_id_foreign" foreign key ("resource_calendar_id") references "resource_calendar" ("id") on update cascade on delete set null;');

    this.addSql('alter table "resource_calendar_attendance" add constraint "resource_calendar_attendance_calendar_id_foreign" foreign key ("calendar_id") references "resource_calendar" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "resource_calendar_attendance" add constraint "resource_calendar_attendance_resource_id_foreign" foreign key ("resource_id") references "resource_resource" ("id") on update cascade on delete set null;');

    this.addSql('alter table "resource_calendar_leaves" add constraint "resource_calendar_leaves_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');
    this.addSql('alter table "resource_calendar_leaves" add constraint "resource_calendar_leaves_calendar_id_foreign" foreign key ("calendar_id") references "resource_calendar" ("id") on update cascade on delete set null;');
    this.addSql('alter table "resource_calendar_leaves" add constraint "resource_calendar_leaves_resource_id_foreign" foreign key ("resource_id") references "resource_resource" ("id") on update cascade on delete set null;');

    this.addSql('alter table "res_config_settings" add constraint "res_config_settings_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "res_currency_rate" add constraint "res_currency_rate_currency_id_foreign" foreign key ("currency_id") references "res_currency" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "res_currency_rate" add constraint "res_currency_rate_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');

    this.addSql('alter table "organization_label" add constraint "organization_label_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "organization_contact" add constraint "organization_contact_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "organization_social" add constraint "organization_social_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "res_partner" add constraint "res_partner_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner" add constraint "res_partner_title_foreign" foreign key ("title") references "res_partner_title" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner" add constraint "res_partner_parent_id_foreign" foreign key ("parent_id") references "res_partner" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner" add constraint "res_partner_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner" add constraint "res_partner_state_id_foreign" foreign key ("state_id") references "res_country_state" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner" add constraint "res_partner_country_id_foreign" foreign key ("country_id") references "res_country" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner" add constraint "res_partner_industry_id_foreign" foreign key ("industry_id") references "res_partner_industry" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner" add constraint "res_partner_commercial_partner_id_foreign" foreign key ("commercial_partner_id") references "res_partner" ("id") on update cascade on delete set null;');

    this.addSql('alter table "res_partner_bank" add constraint "res_partner_bank_partner_id_foreign" foreign key ("partner_id") references "res_partner" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "res_partner_bank" add constraint "res_partner_bank_bank_id_foreign" foreign key ("bank_id") references "res_bank" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner_bank" add constraint "res_partner_bank_currency_id_foreign" foreign key ("currency_id") references "res_currency" ("id") on update cascade on delete set null;');
    this.addSql('alter table "res_partner_bank" add constraint "res_partner_bank_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "work_location" add constraint "work_location_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade;');
    this.addSql('alter table "work_location" add constraint "work_location_address_id_foreign" foreign key ("address_id") references "res_partner" ("id") on update cascade;');

    this.addSql('alter table "employee" add constraint "employee_resource_id_foreign" foreign key ("resource_id") references "resource_resource" ("id") on update cascade;');
    this.addSql('alter table "employee" add constraint "employee_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_resource_calendar_id_foreign" foreign key ("resource_calendar_id") references "resource_calendar" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_department_id_foreign" foreign key ("department_id") references "department" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_job_id_foreign" foreign key ("job_id") references "job" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_address_id_foreign" foreign key ("address_id") references "res_partner" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_work_location_id_foreign" foreign key ("work_location_id") references "work_location" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_parent_id_foreign" foreign key ("parent_id") references "employee" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_coach_id_foreign" foreign key ("coach_id") references "employee" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_address_home_id_foreign" foreign key ("address_home_id") references "res_partner" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_country_id_foreign" foreign key ("country_id") references "res_country" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_country_of_birth_foreign" foreign key ("country_of_birth") references "res_country" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_bank_account_id_foreign" foreign key ("bank_account_id") references "res_partner_bank" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_departure_reason_id_foreign" foreign key ("departure_reason_id") references "departure_reason" ("id") on update cascade on delete set null;');
    this.addSql('alter table "employee" add constraint "employee_contract_id_foreign" foreign key ("contract_id") references "contract" ("id") on update cascade on delete set null;');

    this.addSql('alter table "department" add constraint "department_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');
    this.addSql('alter table "department" add constraint "department_parent_id_foreign" foreign key ("parent_id") references "department" ("id") on update cascade on delete set null;');
    this.addSql('alter table "department" add constraint "department_manager_id_foreign" foreign key ("manager_id") references "employee" ("id") on update cascade on delete set null;');

    this.addSql('alter table "job" add constraint "job_department_id_foreign" foreign key ("department_id") references "department" ("id") on update cascade on delete set null;');
    this.addSql('alter table "job" add constraint "job_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade on delete set null;');

    this.addSql('alter table "contract" add constraint "contract_structure_type_id_foreign" foreign key ("structure_type_id") references "payroll_structure_type" ("id") on update cascade on delete set null;');
    this.addSql('alter table "contract" add constraint "contract_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade on delete set null;');
    this.addSql('alter table "contract" add constraint "contract_department_id_foreign" foreign key ("department_id") references "department" ("id") on update cascade on delete set null;');
    this.addSql('alter table "contract" add constraint "contract_job_id_foreign" foreign key ("job_id") references "job" ("id") on update cascade on delete set null;');
    this.addSql('alter table "contract" add constraint "contract_resource_calendar_id_foreign" foreign key ("resource_calendar_id") references "resource_calendar" ("id") on update cascade on delete set null;');
    this.addSql('alter table "contract" add constraint "contract_organisation_id_foreign" foreign key ("organisation_id") references "organization" ("id") on update cascade;');
    this.addSql('alter table "contract" add constraint "contract_contract_type_id_foreign" foreign key ("contract_type_id") references "contract_type" ("id") on update cascade on delete set null;');
    this.addSql('alter table "contract" add constraint "contract_hr_responsible_id_foreign" foreign key ("hr_responsible_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "departure_wizard" add constraint "departure_wizard_departure_reason_id_foreign" foreign key ("departure_reason_id") references "departure_reason" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "departure_wizard" add constraint "departure_wizard_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "plan_wizard" add constraint "plan_wizard_plan_id_foreign" foreign key ("plan_id") references "plan" ("id") on update cascade on delete set null;');
    this.addSql('alter table "plan_wizard" add constraint "plan_wizard_employee_id_foreign" foreign key ("employee_id") references "employee" ("id") on update cascade on delete cascade;');

    this.addSql('alter table "plan_activity_type" add constraint "plan_activity_type_responsible_id_foreign" foreign key ("responsible_id") references "user" ("id") on update cascade on delete set null;');

    this.addSql('alter table "organization_members" add constraint "organization_members_organization_id_foreign" foreign key ("organization_id") references "organization" ("id") on update cascade on delete cascade;');
    this.addSql('alter table "organization_members" add constraint "organization_members_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade on delete cascade;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "plan_wizard" drop constraint "plan_wizard_plan_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_departure_reason_id_foreign";');

    this.addSql('alter table "departure_wizard" drop constraint "departure_wizard_departure_reason_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_contract_type_id_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_title_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_industry_id_foreign";');

    this.addSql('alter table "res_partner_category" drop constraint "res_partner_category_parent_id_foreign";');

    this.addSql('alter table "res_country" drop constraint "res_country_currency_id_foreign";');

    this.addSql('alter table "res_currency_rate" drop constraint "res_currency_rate_currency_id_foreign";');

    this.addSql('alter table "res_partner_bank" drop constraint "res_partner_bank_currency_id_foreign";');

    this.addSql('alter table "res_country_state" drop constraint "res_country_state_country_id_foreign";');

    this.addSql('alter table "res_bank" drop constraint "res_bank_country_foreign";');

    this.addSql('alter table "payroll_structure_type" drop constraint "payroll_structure_type_country_id_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_country_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_country_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_country_of_birth_foreign";');

    this.addSql('alter table "res_bank" drop constraint "res_bank_state_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_state_id_foreign";');

    this.addSql('alter table "res_partner_bank" drop constraint "res_partner_bank_bank_id_foreign";');

    this.addSql('alter table "res_groups_implied_rel" drop constraint "res_groups_implied_rel_gid_foreign";');

    this.addSql('alter table "res_groups_implied_rel" drop constraint "res_groups_implied_rel_hid_foreign";');

    this.addSql('alter table "res_groups_report_rel" drop constraint "res_groups_report_rel_gid_foreign";');

    this.addSql('alter table "res_groups_users_rel" drop constraint "res_groups_users_rel_gid_foreign";');

    this.addSql('alter table "res_groups_users_rel" drop constraint "res_groups_users_rel_uid_foreign";');

    this.addSql('alter table "organization" drop constraint "organization_direction_id_foreign";');

    this.addSql('alter table "organization" drop constraint "organization_admin_contact_id_foreign";');

    this.addSql('alter table "resource_resource" drop constraint "resource_resource_user_id_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_user_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_user_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_hr_responsible_id_foreign";');

    this.addSql('alter table "plan_activity_type" drop constraint "plan_activity_type_responsible_id_foreign";');

    this.addSql('alter table "organization_members" drop constraint "organization_members_user_id_foreign";');

    this.addSql('alter table "organization" drop constraint "organization_parent_id_foreign";');

    this.addSql('alter table "resource_calendar" drop constraint "resource_calendar_organisation_id_foreign";');

    this.addSql('alter table "resource_resource" drop constraint "resource_resource_organisation_id_foreign";');

    this.addSql('alter table "resource" drop constraint "resource_organisation_id_foreign";');

    this.addSql('alter table "resource_calendar_leaves" drop constraint "resource_calendar_leaves_organisation_id_foreign";');

    this.addSql('alter table "res_config_settings" drop constraint "res_config_settings_organisation_id_foreign";');

    this.addSql('alter table "res_currency_rate" drop constraint "res_currency_rate_organisation_id_foreign";');

    this.addSql('alter table "organization_label" drop constraint "organization_label_organisation_id_foreign";');

    this.addSql('alter table "organization_contact" drop constraint "organization_contact_organisation_id_foreign";');

    this.addSql('alter table "organization_social" drop constraint "organization_social_organisation_id_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_organisation_id_foreign";');

    this.addSql('alter table "res_partner_bank" drop constraint "res_partner_bank_organisation_id_foreign";');

    this.addSql('alter table "work_location" drop constraint "work_location_organisation_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_organisation_id_foreign";');

    this.addSql('alter table "department" drop constraint "department_organisation_id_foreign";');

    this.addSql('alter table "job" drop constraint "job_organisation_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_organisation_id_foreign";');

    this.addSql('alter table "organization_members" drop constraint "organization_members_organization_id_foreign";');

    this.addSql('alter table "payroll_structure_type" drop constraint "payroll_structure_type_default_resource_calendar_id_foreign";');

    this.addSql('alter table "resource_resource" drop constraint "resource_resource_calendar_id_foreign";');

    this.addSql('alter table "resource" drop constraint "resource_resource_calendar_id_foreign";');

    this.addSql('alter table "resource_calendar_attendance" drop constraint "resource_calendar_attendance_calendar_id_foreign";');

    this.addSql('alter table "resource_calendar_leaves" drop constraint "resource_calendar_leaves_calendar_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_resource_calendar_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_resource_calendar_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_structure_type_id_foreign";');

    this.addSql('alter table "resource" drop constraint "resource_resource_id_foreign";');

    this.addSql('alter table "resource_calendar_attendance" drop constraint "resource_calendar_attendance_resource_id_foreign";');

    this.addSql('alter table "resource_calendar_leaves" drop constraint "resource_calendar_leaves_resource_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_resource_id_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_parent_id_foreign";');

    this.addSql('alter table "res_partner" drop constraint "res_partner_commercial_partner_id_foreign";');

    this.addSql('alter table "res_partner_bank" drop constraint "res_partner_bank_partner_id_foreign";');

    this.addSql('alter table "work_location" drop constraint "work_location_address_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_address_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_address_home_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_bank_account_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_work_location_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_parent_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_coach_id_foreign";');

    this.addSql('alter table "department" drop constraint "department_manager_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_employee_id_foreign";');

    this.addSql('alter table "departure_wizard" drop constraint "departure_wizard_employee_id_foreign";');

    this.addSql('alter table "plan_wizard" drop constraint "plan_wizard_employee_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_department_id_foreign";');

    this.addSql('alter table "department" drop constraint "department_parent_id_foreign";');

    this.addSql('alter table "job" drop constraint "job_department_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_department_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_job_id_foreign";');

    this.addSql('alter table "contract" drop constraint "contract_job_id_foreign";');

    this.addSql('alter table "employee" drop constraint "employee_contract_id_foreign";');

    this.addSql('drop table if exists "plan" cascade;');

    this.addSql('drop table if exists "employee_category" cascade;');

    this.addSql('drop table if exists "departure_reason" cascade;');

    this.addSql('drop table if exists "contract_type" cascade;');

    this.addSql('drop table if exists "res_partner_title" cascade;');

    this.addSql('drop table if exists "res_partner_industry" cascade;');

    this.addSql('drop table if exists "res_partner_category" cascade;');

    this.addSql('drop table if exists "res_currency" cascade;');

    this.addSql('drop table if exists "res_country_group" cascade;');

    this.addSql('drop table if exists "res_country" cascade;');

    this.addSql('drop table if exists "res_country_state" cascade;');

    this.addSql('drop table if exists "res_bank" cascade;');

    this.addSql('drop table if exists "res_groups" cascade;');

    this.addSql('drop table if exists "res_groups_implied_rel" cascade;');

    this.addSql('drop table if exists "res_groups_report_rel" cascade;');

    this.addSql('drop table if exists "user" cascade;');

    this.addSql('drop table if exists "res_groups_users_rel" cascade;');

    this.addSql('drop table if exists "organization" cascade;');

    this.addSql('drop table if exists "resource_calendar" cascade;');

    this.addSql('drop table if exists "payroll_structure_type" cascade;');

    this.addSql('drop table if exists "resource_resource" cascade;');

    this.addSql('drop table if exists "resource" cascade;');

    this.addSql('drop table if exists "resource_calendar_attendance" cascade;');

    this.addSql('drop table if exists "resource_calendar_leaves" cascade;');

    this.addSql('drop table if exists "res_config_settings" cascade;');

    this.addSql('drop table if exists "res_currency_rate" cascade;');

    this.addSql('drop table if exists "organization_label" cascade;');

    this.addSql('drop table if exists "organization_contact" cascade;');

    this.addSql('drop table if exists "organization_social" cascade;');

    this.addSql('drop table if exists "res_partner" cascade;');

    this.addSql('drop table if exists "res_partner_bank" cascade;');

    this.addSql('drop table if exists "work_location" cascade;');

    this.addSql('drop table if exists "employee" cascade;');

    this.addSql('drop table if exists "department" cascade;');

    this.addSql('drop table if exists "job" cascade;');

    this.addSql('drop table if exists "contract" cascade;');

    this.addSql('drop table if exists "departure_wizard" cascade;');

    this.addSql('drop table if exists "plan_wizard" cascade;');

    this.addSql('drop table if exists "plan_activity_type" cascade;');

    this.addSql('drop table if exists "organization_members" cascade;');
  }

}
