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
  timezone!: string;

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
  timezone!: string;

  @include()
  calendar!: CreateResourceCalendarRO;
}
