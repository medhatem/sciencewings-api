import { dto, include } from 'dto-mapper';

@dto()
export class CreateResourceCalendarRO {
  @include()
  name!: string;

  @include()
  active?: boolean;

  @include()
  organization?: number;

  @include()
  hoursPerDay?: number;

  @include()
  tz!: string;

  @include()
  twoWeeksCalendar?: boolean;
}

@dto()
export class CreateResourceRO {
  @include()
  name: string;

  @include()
  active?: boolean;

  @include()
  organization?: number;

  @include()
  resourceType!: string;

  @include()
  user?: number;

  @include()
  timeEfficiency!: number;

  @include()
  tz!: string;

  @include()
  calendar!: CreateResourceCalendarRO;
}
